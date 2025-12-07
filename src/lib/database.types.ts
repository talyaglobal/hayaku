export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          birth_date: string | null
          gender: 'male' | 'female' | 'other' | 'prefer-not-to-say' | null
          vip_tier: 'Bronze' | 'Gold' | 'Platinum' | 'Diamond'
          vip_points: number
          total_orders: number
          total_spent: number
          preferred_language: 'tr' | 'en'
          preferred_currency: 'TRY' | 'USD' | 'EUR'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say' | null
          vip_tier?: 'Bronze' | 'Gold' | 'Platinum' | 'Diamond'
          vip_points?: number
          total_orders?: number
          total_spent?: number
          preferred_language?: 'tr' | 'en'
          preferred_currency?: 'TRY' | 'USD' | 'EUR'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say' | null
          vip_tier?: 'Bronze' | 'Gold' | 'Platinum' | 'Diamond'
          vip_points?: number
          total_orders?: number
          total_spent?: number
          preferred_language?: 'tr' | 'en'
          preferred_currency?: 'TRY' | 'USD' | 'EUR'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_notification_preferences: {
        Row: {
          id: string
          user_id: string
          email_notifications: boolean
          sms_notifications: boolean
          push_notifications: boolean
          newsletter_subscription: boolean
          marketing_emails: boolean
          order_updates: boolean
          price_alerts: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_notifications?: boolean
          sms_notifications?: boolean
          push_notifications?: boolean
          newsletter_subscription?: boolean
          marketing_emails?: boolean
          order_updates?: boolean
          price_alerts?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_notifications?: boolean
          sms_notifications?: boolean
          push_notifications?: boolean
          newsletter_subscription?: boolean
          marketing_emails?: boolean
          order_updates?: boolean
          price_alerts?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          banner_url: string | null
          country: string | null
          website_url: string | null
          is_featured: boolean
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          country?: string | null
          website_url?: string | null
          is_featured?: boolean
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          country?: string | null
          website_url?: string | null
          is_featured?: boolean
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          image_url: string | null
          icon_name: string | null
          is_featured: boolean
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          icon_name?: string | null
          is_featured?: boolean
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          icon_name?: string | null
          is_featured?: boolean
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          brand_id: string | null
          category_id: string | null
          sku: string | null
          price: number
          compare_price: number | null
          cost_price: number | null
          currency: string
          weight: number | null
          dimensions: Json | null
          material: string | null
          care_instructions: string | null
          country_of_origin: string | null
          is_featured: boolean
          is_active: boolean
          requires_shipping: boolean
          is_taxable: boolean
          tax_rate: number
          seo_title: string | null
          seo_description: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          brand_id?: string | null
          category_id?: string | null
          sku?: string | null
          price: number
          compare_price?: number | null
          cost_price?: number | null
          currency?: string
          weight?: number | null
          dimensions?: Json | null
          material?: string | null
          care_instructions?: string | null
          country_of_origin?: string | null
          is_featured?: boolean
          is_active?: boolean
          requires_shipping?: boolean
          is_taxable?: boolean
          tax_rate?: number
          seo_title?: string | null
          seo_description?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          brand_id?: string | null
          category_id?: string | null
          sku?: string | null
          price?: number
          compare_price?: number | null
          cost_price?: number | null
          currency?: string
          weight?: number | null
          dimensions?: Json | null
          material?: string | null
          care_instructions?: string | null
          country_of_origin?: string | null
          is_featured?: boolean
          is_active?: boolean
          requires_shipping?: boolean
          is_taxable?: boolean
          tax_rate?: number
          seo_title?: string | null
          seo_description?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          email: string
          phone: string | null
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          fulfillment_status: 'unfulfilled' | 'partial' | 'fulfilled' | null
          payment_status: 'pending' | 'authorized' | 'paid' | 'partially_paid' | 'refunded' | 'voided'
          subtotal: number
          tax_amount: number
          shipping_amount: number
          discount_amount: number
          total_amount: number
          currency: string
          billing_address: Json
          shipping_address: Json
          shipping_method: string | null
          shipping_carrier: string | null
          tracking_number: string | null
          shipping_date: string | null
          delivery_date: string | null
          notes: string | null
          admin_notes: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          email: string
          phone?: string | null
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          fulfillment_status?: 'unfulfilled' | 'partial' | 'fulfilled' | null
          payment_status?: 'pending' | 'authorized' | 'paid' | 'partially_paid' | 'refunded' | 'voided'
          subtotal: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount: number
          currency?: string
          billing_address: Json
          shipping_address: Json
          shipping_method?: string | null
          shipping_carrier?: string | null
          tracking_number?: string | null
          shipping_date?: string | null
          delivery_date?: string | null
          notes?: string | null
          admin_notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          email?: string
          phone?: string | null
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          fulfillment_status?: 'unfulfilled' | 'partial' | 'fulfilled' | null
          payment_status?: 'pending' | 'authorized' | 'paid' | 'partially_paid' | 'refunded' | 'voided'
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount?: number
          currency?: string
          billing_address?: Json
          shipping_address?: Json
          shipping_method?: string | null
          shipping_carrier?: string | null
          tracking_number?: string | null
          shipping_date?: string | null
          delivery_date?: string | null
          notes?: string | null
          admin_notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          name: string
          is_default: boolean
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string
          is_default?: boolean
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          is_default?: boolean
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      wishlist_items: {
        Row: {
          id: string
          wishlist_id: string
          product_id: string
          variant_id: string | null
          added_at: string
        }
        Insert: {
          id?: string
          wishlist_id: string
          product_id: string
          variant_id?: string | null
          added_at?: string
        }
        Update: {
          id?: string
          wishlist_id?: string
          product_id?: string
          variant_id?: string | null
          added_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}