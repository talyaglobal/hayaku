import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

interface InventoryUpdate {
  product_id: string
  previous_quantity: number
  new_quantity: number
  quantity_changed: number
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { orderId, items } = await request.json()
    
    // Update inventory quantities based on order
    const inventoryUpdates: InventoryUpdate[] = []
    
    for (const item of items) {
      // Get current inventory
      const { data: currentInventory, error: fetchError } = await supabase
        .from('inventory')
        .select('quantity, track_inventory')
        .eq('product_id', item.product_id)
        .single()
      
      if (fetchError) {
        console.error('Error fetching inventory:', fetchError)
        continue
      }
      
      if (currentInventory.track_inventory) {
        const newQuantity = Math.max(0, currentInventory.quantity - item.quantity)
        
        const { error: updateError } = await supabase
          .from('inventory')
          .update({ 
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('product_id', item.product_id)
        
        if (updateError) {
          console.error('Error updating inventory:', updateError)
          continue
        }
        
        inventoryUpdates.push({
          product_id: item.product_id,
          previous_quantity: currentInventory.quantity,
          new_quantity: newQuantity,
          quantity_changed: item.quantity
        })
      }
    }

    return NextResponse.json({ 
      data: {
        updated: inventoryUpdates.length,
        details: inventoryUpdates
      }
    })
  } catch (error: any) {
    console.error('Inventory sync error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}