-- Referral Program Tables for Hayaku E-commerce
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Referral codes table
CREATE TABLE IF NOT EXISTS referral_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    total_uses INTEGER DEFAULT 0,
    total_referrals INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals tracking table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    referral_code_id UUID REFERENCES referral_codes(id) ON DELETE CASCADE,
    referrer_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    referral_email TEXT,
    referral_status TEXT DEFAULT 'pending' CHECK (referral_status IN ('pending', 'signed_up', 'first_purchase', 'completed')),
    signup_date TIMESTAMP WITH TIME ZONE,
    first_purchase_date TIMESTAMP WITH TIME ZONE,
    first_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    referrer_reward_amount DECIMAL(10,2) DEFAULT 0.00,
    referred_reward_amount DECIMAL(10,2) DEFAULT 0.00,
    reward_status TEXT DEFAULT 'pending' CHECK (reward_status IN ('pending', 'credited', 'paid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code_id ON referrals(referral_code_id);

-- Enable RLS
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referral_codes
CREATE POLICY "Users can view own referral codes" ON referral_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own referral codes" ON referral_codes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own referral codes" ON referral_codes FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for referrals
CREATE POLICY "Users can view own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);
CREATE POLICY "Users can view referral if they were referred" ON referrals FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM referral_codes 
        WHERE referral_codes.id = referrals.referral_code_id 
        AND referral_codes.user_id = auth.uid()
    )
);

-- Trigger to update updated_at
CREATE TRIGGER update_referral_codes_updated_at BEFORE UPDATE ON referral_codes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code(user_id_param UUID)
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        -- Generate a random code (e.g., user's initials + random numbers)
        code := UPPER(SUBSTRING(MD5(user_id_param::TEXT || NOW()::TEXT || RANDOM()::TEXT) FROM 1 FOR 8));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM referral_codes WHERE referral_codes.code = generate_referral_code.code) INTO exists_check;
        
        EXIT WHEN NOT exists_check;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;
