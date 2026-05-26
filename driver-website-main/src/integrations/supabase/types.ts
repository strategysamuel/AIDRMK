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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      about_content: {
        Row: {
          content_en: string
          created_at: string
          id: string
          image_url: string | null
          section_key: string
          updated_at: string
        }
        Insert: {
          content_en: string
          created_at?: string
          id?: string
          image_url?: string | null
          section_key: string
          updated_at?: string
        }
        Update: {
          content_en?: string
          created_at?: string
          id?: string
          image_url?: string | null
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          admin_notes: string | null
          created_at: string
          driver_id: string
          id: string
          scheme_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          driver_id: string
          id?: string
          scheme_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          driver_id?: string
          id?: string
          scheme_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "schemes"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          driver_id: string
          file_url: string
          id: string
          type: string
          uploaded_at: string
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          driver_id: string
          file_url: string
          id?: string
          type: string
          uploaded_at?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          driver_id?: string
          file_url?: string
          id?: string
          type?: string
          uploaded_at?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          aadhaar_no: string | null
          accepted_at: string | null
          account_locked_until: string | null
          address: string
          blood_group: string | null
          gender: string | null
          created_at: string
          district: string
          dob: string
          emergency_mobile: string | null
          father_or_husband_name: string | null
          failed_login_attempts: number | null
          has_accepted_terms: boolean
          id: string
          is_verified: boolean
          kyc_status: string | null
          last_failed_login_at: string | null
          license_no: string
          license_valid_till: string
          membership_id: string | null
          membership_plan: string | null
          mobile: string
          name: string
          photo_url: string | null
          pin_hash: string | null
          pincode: string
          selfie_photo_url: string | null
          signature_url: string | null
          state: string
          status: Database["public"]["Enums"]["driver_status"]
          updated_at: string
          user_id: string
          vehicle_types: Database["public"]["Enums"]["vehicle_type"][]
          whatsapp: string | null
        }
        Insert: {
          aadhaar_no?: string | null
          accepted_at?: string | null
          account_locked_until?: string | null
          address: string
          created_at?: string
          district: string
          dob: string
          gender?: string | null
          failed_login_attempts?: number | null
          has_accepted_terms?: boolean
          id?: string
          is_verified?: boolean
          kyc_status?: string | null
          last_failed_login_at?: string | null
          license_no: string
          license_valid_till: string
          membership_id?: string | null
          membership_plan?: string | null
          blood_group?: string | null
          emergency_mobile?: string | null
          pin_hash?: string | null
          father_or_husband_name?: string | null
          mobile: string
          name: string
          photo_url?: string | null
          pincode: string
          selfie_photo_url?: string | null
          signature_url?: string | null
          state?: string
          status?: Database["public"]["Enums"]["driver_status"]
          updated_at?: string
          user_id: string
          vehicle_types?: Database["public"]["Enums"]["vehicle_type"][]
          whatsapp?: string | null
        }
        Update: {
          aadhaar_no?: string | null
          accepted_at?: string | null
          account_locked_until?: string | null
          address?: string
          blood_group?: string | null
          created_at?: string
          district?: string
          dob?: string
          emergency_mobile?: string | null
          father_or_husband_name?: string | null
          gender?: string | null
          failed_login_attempts?: number | null
          has_accepted_terms?: boolean
          id?: string
          is_verified?: boolean
          kyc_status?: string | null
          last_failed_login_at?: string | null
          license_no?: string
          license_valid_till?: string
          membership_id?: string | null
          membership_plan?: string | null
          mobile?: string
          name?: string
          photo_url?: string | null
          pin_hash?: string | null
          pincode?: string
          selfie_photo_url?: string | null
          signature_url?: string | null
          state?: string
          status?: Database["public"]["Enums"]["driver_status"]
          updated_at?: string
          user_id?: string
          vehicle_types?: Database["public"]["Enums"]["vehicle_type"][]
          whatsapp?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          driver_id: string
          id: string
          paid_at: string | null
          payment_type: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          driver_id: string
          id?: string
          paid_at?: string | null
          payment_type: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          driver_id?: string
          id?: string
          paid_at?: string | null
          payment_type?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      pin_reset_otps: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          mobile: string
          otp_hash: string
          used: boolean | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          mobile: string
          otp_hash: string
          used?: boolean | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          mobile?: string
          otp_hash?: string
          used?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          mobile: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id: string
          mobile?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          mobile?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      schemes: {
        Row: {
          benefit_unit: string | null
          category: string
          created_at: string
          description_en: string
          description_hi: string
          description_ta: string
          eligibility_summary_en: string | null
          eligibility_summary_hi: string | null
          eligibility_summary_ta: string | null
          id: string
          is_active: boolean
          level: Database["public"]["Enums"]["scheme_level"]
          max_benefit_amount: number | null
          official_link: string | null
          target_workers: string | null
          title_en: string
          title_hi: string
          title_ta: string
          updated_at: string
        }
        Insert: {
          benefit_unit?: string | null
          category: string
          created_at?: string
          description_en: string
          description_hi: string
          description_ta: string
          eligibility_summary_en?: string | null
          eligibility_summary_hi?: string | null
          eligibility_summary_ta?: string | null
          id?: string
          is_active?: boolean
          level: Database["public"]["Enums"]["scheme_level"]
          max_benefit_amount?: number | null
          official_link?: string | null
          target_workers?: string | null
          title_en: string
          title_hi: string
          title_ta: string
          updated_at?: string
        }
        Update: {
          benefit_unit?: string | null
          category?: string
          created_at?: string
          description_en?: string
          description_hi?: string
          description_ta?: string
          eligibility_summary_en?: string | null
          eligibility_summary_hi?: string | null
          eligibility_summary_ta?: string | null
          id?: string
          is_active?: boolean
          level?: Database["public"]["Enums"]["scheme_level"]
          max_benefit_amount?: number | null
          official_link?: string | null
          target_workers?: string | null
          title_en?: string
          title_hi?: string
          title_ta?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      cleanup_expired_otps: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "driver"
      application_status: "pending" | "approved" | "rejected"
      driver_status: "pending" | "active" | "expired" | "rejected"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      scheme_level: "central" | "state_tn" | "state"
      vehicle_type: "auto" | "taxi" | "lorry" | "bus" | "van" | "other"
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
      app_role: ["admin", "staff", "driver"],
      application_status: ["pending", "approved", "rejected"],
      driver_status: ["pending", "active", "expired", "rejected"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      scheme_level: ["central", "state_tn", "state"],
      vehicle_type: ["auto", "taxi", "lorry", "bus", "van", "other"],
    },
  },
} as const
