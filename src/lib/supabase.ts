import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          farm_name: string | null
          location: string | null
          farm_size: number | null
          primary_crops: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      crops: {
        Row: {
          id: string
          user_id: string
          name: string
          variety: string | null
          planting_date: string
          expected_harvest: string | null
          status: 'planted' | 'growing' | 'ready' | 'harvested'
          area: number | null
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['crops']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['crops']['Insert']>
      }
      soil_tests: {
        Row: {
          id: string
          user_id: string
          field_name: string
          ph: number
          nitrogen: number
          phosphorus: number
          potassium: number
          moisture: number
          organic_matter: number
          test_date: string
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['soil_tests']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['soil_tests']['Insert']>
      }
      farm_diary: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          category: 'planting' | 'irrigation' | 'fertilizing' | 'pest_control' | 'harvest' | 'general'
          weather: string | null
          photos: string[] | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['farm_diary']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['farm_diary']['Insert']>
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'income' | 'expense'
          category: string
          amount: number
          description: string
          date: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>
      }
      livestock: {
        Row: {
          id: string
          user_id: string
          type: string
          breed: string | null
          count: number
          health_status: 'healthy' | 'sick' | 'treatment'
          last_vaccination: string | null
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['livestock']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['livestock']['Insert']>
      }
    }
  }
}
