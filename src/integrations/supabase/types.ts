export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_booking_summary: {
        Row: {
          check_in_date: string | null
          check_out_date: string | null
          created_at: string | null
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          guests: number | null
          id: string | null
          paid_at: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          room_name: string | null
          room_type: Database["public"]["Enums"]["room_type"] | null
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number | null
        }
        Insert: {
          check_in_date?: string | null
          check_out_date?: string | null
          created_at?: string | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          guests?: number | null
          id?: string | null
          paid_at?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          room_name?: string | null
          room_type?: Database["public"]["Enums"]["room_type"] | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number | null
        }
        Update: {
          check_in_date?: string | null
          check_out_date?: string | null
          created_at?: string | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          guests?: number | null
          id?: string | null
          paid_at?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          room_name?: string | null
          room_type?: Database["public"]["Enums"]["room_type"] | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number | null
        }
        Relationships: []
      }
      admin_login_attempts: {
        Row: {
          attempted_at: string | null
          email: string
          id: string
          ip_address: unknown | null
          success: boolean | null
        }
        Insert: {
          attempted_at?: string | null
          email: string
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
        }
        Update: {
          attempted_at?: string | null
          email?: string
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          password_hash: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          password_hash?: string
        }
        Relationships: []
      }
      booking_analytics: {
        Row: {
          average_booking_value: number | null
          month: string | null
          total_bookings: number | null
          total_revenue: number | null
          unique_guests: number | null
        }
        Insert: {
          average_booking_value?: number | null
          month?: string | null
          total_bookings?: number | null
          total_revenue?: number | null
          unique_guests?: number | null
        }
        Update: {
          average_booking_value?: number | null
          month?: string | null
          total_bookings?: number | null
          total_revenue?: number | null
          unique_guests?: number | null
        }
        Relationships: []
      }
      booking_services: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          quantity: number | null
          service_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          quantity?: number | null
          service_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          quantity?: number | null
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_services_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_services_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "admin_booking_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          check_in_date: string
          check_out_date: string
          created_at: string
          guest_email: string
          guest_name: string
          guest_phone: string | null
          guests: number
          id: string
          room_id: string
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          check_in_date: string
          check_out_date: string
          created_at?: string
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          guests?: number
          id?: string
          room_id: string
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          check_in_date?: string
          check_out_date?: string
          created_at?: string
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          guests?: number
          id?: string
          room_id?: string
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_occupancy"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          currency: string | null
          id: string
          paid_at: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          currency?: string | null
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          currency?: string | null
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "admin_booking_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      room_occupancy: {
        Row: {
          avg_stay_duration: number | null
          id: string | null
          name: string | null
          total_bookings: number | null
          total_revenue: number | null
          type: Database["public"]["Enums"]["room_type"] | null
        }
        Insert: {
          avg_stay_duration?: number | null
          id?: string | null
          name?: string | null
          total_bookings?: number | null
          total_revenue?: number | null
          type?: Database["public"]["Enums"]["room_type"] | null
        }
        Update: {
          avg_stay_duration?: number | null
          id?: string | null
          name?: string | null
          total_bookings?: number | null
          total_revenue?: number | null
          type?: Database["public"]["Enums"]["room_type"] | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          amenities: string[] | null
          capacity: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          price_per_night: number
          room_number: string | null
          size_sqm: number | null
          type: Database["public"]["Enums"]["room_type"]
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          price_per_night: number
          room_number?: string | null
          size_sqm?: number | null
          type: Database["public"]["Enums"]["room_type"]
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          price_per_night?: number
          room_number?: string | null
          size_sqm?: number | null
          type?: Database["public"]["Enums"]["room_type"]
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_available: boolean | null
          name: string
          price: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean | null
          name: string
          price?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean | null
          name?: string
          price?: number | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          email: string
          id: string
          last_activity: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          last_activity?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_activity?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_admin: {
        Args: {
          email_input: string
          password_input: string
        }
        Returns: {
          success: boolean
          admin_id: string
          admin_email: string
          admin_name: string
        }[]
      }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      room_type: "standard" | "deluxe" | "executive_suite" | "conference_suite"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}