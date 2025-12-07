-- Inventory Management System Migration
-- This migration adds support for pre-orders, stock alerts, and enhanced inventory tracking

-- Ensure inventory table has all necessary columns
DO $$ 
BEGIN
    -- Add pre_order_available column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inventory' AND column_name = 'pre_order_available'
    ) THEN
        ALTER TABLE inventory ADD COLUMN pre_order_available BOOLEAN DEFAULT false;
    END IF;

    -- Add last_alert_sent column for tracking low stock alerts
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inventory' AND column_name = 'last_alert_sent'
    ) THEN
        ALTER TABLE inventory ADD COLUMN last_alert_sent TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Add expected_restock_date for pre-orders
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inventory' AND column_name = 'expected_restock_date'
    ) THEN
        ALTER TABLE inventory ADD COLUMN expected_restock_date TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create index for faster low stock queries
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock 
ON inventory(product_id) 
WHERE track_inventory = true AND quantity <= low_stock_threshold;

-- Create index for out of stock queries
CREATE INDEX IF NOT EXISTS idx_inventory_out_of_stock 
ON inventory(product_id) 
WHERE track_inventory = true AND quantity = 0 AND allow_backorder = false;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic updated_at
DROP TRIGGER IF EXISTS trigger_update_inventory_updated_at ON inventory;
CREATE TRIGGER trigger_update_inventory_updated_at
    BEFORE UPDATE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_updated_at();

-- Function to check and log low stock events (for alerts)
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- If quantity dropped to or below threshold, mark for alert
    IF NEW.track_inventory = true 
       AND NEW.quantity <= NEW.low_stock_threshold 
       AND NEW.quantity > 0
       AND (OLD.quantity > NEW.low_stock_threshold OR OLD.quantity IS NULL) THEN
        -- This will be handled by the application layer
        -- We just ensure the record is updated
        NEW.last_alert_sent = NULL; -- Reset to allow new alert
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for low stock detection
DROP TRIGGER IF EXISTS trigger_check_low_stock ON inventory;
CREATE TRIGGER trigger_check_low_stock
    AFTER UPDATE OF quantity ON inventory
    FOR EACH ROW
    WHEN (NEW.track_inventory = true)
    EXECUTE FUNCTION check_low_stock();

-- Create view for inventory status summary (useful for admin dashboard)
CREATE OR REPLACE VIEW inventory_status_summary AS
SELECT 
    i.id,
    i.product_id,
    p.name as product_name,
    p.sku,
    i.quantity,
    i.low_stock_threshold,
    i.track_inventory,
    i.allow_backorder,
    i.pre_order_available,
    i.expected_restock_date,
    i.updated_at,
    CASE 
        WHEN i.track_inventory = false THEN 'not_tracked'
        WHEN i.quantity = 0 AND i.allow_backorder = false THEN 'out_of_stock'
        WHEN i.quantity = 0 AND i.allow_backorder = true THEN 'pre_order'
        WHEN i.quantity > 0 AND i.quantity <= i.low_stock_threshold THEN 'low_stock'
        ELSE 'in_stock'
    END as stock_status
FROM inventory i
LEFT JOIN products p ON i.product_id = p.id
WHERE p.is_active = true;

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT SELECT ON inventory_status_summary TO authenticated;
-- GRANT SELECT ON inventory_status_summary TO anon;

COMMENT ON VIEW inventory_status_summary IS 'Provides a summary view of inventory status for all active products';
