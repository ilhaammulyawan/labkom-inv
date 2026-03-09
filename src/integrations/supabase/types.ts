export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      borrowings: {
        Row: {
          actual_return_date: string | null
          approved_by: string | null
          borrow_date: string
          borrower_id: string
          borrower_name: string
          created_at: string
          expected_return_date: string
          id: string
          item_id: string
          notes: string | null
          purpose: string | null
          status: Database["public"]["Enums"]["borrowing_status"]
        }
        Insert: {
          actual_return_date?: string | null
          approved_by?: string | null
          borrow_date?: string
          borrower_id: string
          borrower_name: string
          created_at?: string
          expected_return_date: string
          id?: string
          item_id: string
          notes?: string | null
          purpose?: string | null
          status?: Database["public"]["Enums"]["borrowing_status"]
        }
        Update: {
          actual_return_date?: string | null
          approved_by?: string | null
          borrow_date?: string
          borrower_id?: string
          borrower_name?: string
          created_at?: string
          expected_return_date?: string
          id?: string
          item_id?: string
          notes?: string | null
          purpose?: string | null
          status?: Database["public"]["Enums"]["borrowing_status"]
        }
        Relationships: [
          {
            foreignKeyName: "borrowings_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      items: {
        Row: {
          brand: string
          category_id: string | null
          condition: Database["public"]["Enums"]["item_condition"]
          cpu: string | null
          created_at: string
          hostname: string | null
          id: string
          image_url: string | null
          inventory_code: string
          ip_address: string | null
          last_service_date: string | null
          mac_address: string | null
          model: string
          name: string
          notes: string | null
          os: string | null
          os_license: string | null
          price: number | null
          printer_type: string | null
          ram: string | null
          room_id: string | null
          screen_size: string | null
          serial_number: string
          status: Database["public"]["Enums"]["item_status"]
          storage: string | null
          vga: string | null
          year_acquired: number | null
          year_manufactured: number | null
        }
        Insert: {
          brand?: string
          category_id?: string | null
          condition?: Database["public"]["Enums"]["item_condition"]
          cpu?: string | null
          created_at?: string
          hostname?: string | null
          id?: string
          image_url?: string | null
          inventory_code: string
          ip_address?: string | null
          last_service_date?: string | null
          mac_address?: string | null
          model?: string
          name: string
          notes?: string | null
          os?: string | null
          os_license?: string | null
          price?: number | null
          printer_type?: string | null
          ram?: string | null
          room_id?: string | null
          screen_size?: string | null
          serial_number?: string
          status?: Database["public"]["Enums"]["item_status"]
          storage?: string | null
          vga?: string | null
          year_acquired?: number | null
          year_manufactured?: number | null
        }
        Update: {
          brand?: string
          category_id?: string | null
          condition?: Database["public"]["Enums"]["item_condition"]
          cpu?: string | null
          created_at?: string
          hostname?: string | null
          id?: string
          image_url?: string | null
          inventory_code?: string
          ip_address?: string | null
          last_service_date?: string | null
          mac_address?: string | null
          model?: string
          name?: string
          notes?: string | null
          os?: string | null
          os_license?: string | null
          price?: number | null
          printer_type?: string | null
          ram?: string | null
          room_id?: string | null
          screen_size?: string | null
          serial_number?: string
          status?: Database["public"]["Enums"]["item_status"]
          storage?: string | null
          vga?: string | null
          year_acquired?: number | null
          year_manufactured?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          action: string | null
          cost: number | null
          created_at: string
          description: string
          id: string
          issue_date: string
          item_id: string
          repair_date: string | null
          status: Database["public"]["Enums"]["maintenance_status"]
          technician: string
        }
        Insert: {
          action?: string | null
          cost?: number | null
          created_at?: string
          description: string
          id?: string
          issue_date?: string
          item_id: string
          repair_date?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          technician?: string
        }
        Update: {
          action?: string | null
          cost?: number | null
          created_at?: string
          description?: string
          id?: string
          issue_date?: string
          item_id?: string
          repair_date?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          technician?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_schedules: {
        Row: {
          assigned_technician: string | null
          created_at: string
          description: string | null
          frequency: string
          id: string
          is_active: boolean
          item_id: string
          last_performed_date: string | null
          next_due_date: string
          title: string
        }
        Insert: {
          assigned_technician?: string | null
          created_at?: string
          description?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          item_id: string
          last_performed_date?: string | null
          next_due_date: string
          title: string
        }
        Update: {
          assigned_technician?: string | null
          created_at?: string
          description?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          item_id?: string
          last_performed_date?: string | null
          next_due_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_schedules_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          created_at: string
          id: string
          location: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          name?: string
        }
        Relationships: []
      }
      software_inventory: {
        Row: {
          created_at: string
          expiry_date: string | null
          id: string
          item_id: string
          license_key: string | null
          license_type: string | null
          notes: string | null
          software_name: string
          version: string | null
        }
        Insert: {
          created_at?: string
          expiry_date?: string | null
          id?: string
          item_id: string
          license_key?: string | null
          license_type?: string | null
          notes?: string | null
          software_name: string
          version?: string | null
        }
        Update: {
          created_at?: string
          expiry_date?: string | null
          id?: string
          item_id?: string
          license_key?: string | null
          license_type?: string | null
          notes?: string | null
          software_name?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "software_inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      borrowing_status:
        | "Menunggu"
        | "Disetujui"
        | "Ditolak"
        | "Dipinjam"
        | "Dikembalikan"
        | "Pengembalian"
      item_condition: "Baik" | "Rusak Ringan" | "Rusak Berat" | "Diperbaiki"
      item_status: "Aktif" | "Dipinjam" | "Dihapus"
      maintenance_status: "Antrian" | "Dalam Perbaikan" | "Selesai"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      borrowing_status: [
        "Menunggu",
        "Disetujui",
        "Ditolak",
        "Dipinjam",
        "Dikembalikan",
        "Pengembalian",
      ],
      item_condition: ["Baik", "Rusak Ringan", "Rusak Berat", "Diperbaiki"],
      item_status: ["Aktif", "Dipinjam", "Dihapus"],
      maintenance_status: ["Antrian", "Dalam Perbaikan", "Selesai"],
    },
  },
} as const
