import { z } from "zod";

// Helper function to calculate age from DOB
const calculateAge = (dob: Date): number => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Driver registration validation schema
export const driverRegistrationSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .regex(/^[a-zA-Z\s.]+$/, "Name can only contain letters, spaces, and periods"),
  
  mobile: z.string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Mobile number must be a valid 10-digit Indian number starting with 6-9"),
  
  whatsapp: z.string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "WhatsApp number must be a valid 10-digit Indian number starting with 6-9")
    .optional()
    .or(z.literal("")),
  
  dob: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Invalid date format",
  }).refine((date) => {
    const age = calculateAge(date);
    return age >= 18 && age <= 100;
  }, "Driver must be between 18 and 100 years old"),
  
  address: z.string()
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must not exceed 500 characters"),
  
  district: z.string()
    .trim()
    .min(2, "District name must be at least 2 characters")
    .max(100, "District name must not exceed 100 characters"),
  
  state: z.string()
    .trim()
    .min(2, "State name is required"),
  
  pincode: z.string()
    .trim()
    .regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  
  license_no: z.string()
    .trim()
    .min(10, "License number is required")
    .max(20, "License number must not exceed 20 characters")
    .regex(/^[A-Z0-9-]+$/, "License number can only contain uppercase letters, numbers, and hyphens"),
  
  blood_group: z.string()
    .trim()
    .min(1, "Blood group is required"),
  
  license_valid_till: z.date({
    required_error: "License expiry date is required",
    invalid_type_error: "Invalid date format",
  }).refine((date) => {
    return date > new Date();
  }, "License must not be expired"),
  
  vehicle_types: z.array(z.string())
    .min(1, "Please select at least one vehicle type"),
  
  aadhaar_no: z.string()
    .trim()
    .regex(/^\d{12}$/, "Aadhaar number must be exactly 12 digits")
    .optional()
    .or(z.literal("")),
  
  pin: z.string()
    .trim()
    .regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
  
  confirm_pin: z.string()
    .trim()
    .regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
  
  has_accepted_terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.pin === data.confirm_pin, {
  message: "PINs do not match",
  path: ["confirm_pin"],
});

export type DriverRegistrationFormData = z.infer<typeof driverRegistrationSchema>;

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must not exceed 255 characters"),
  
  mobile: z.string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Mobile number must be a valid 10-digit Indian number"),
  
  message: z.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must not exceed 1000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// PIN login validation schema
export const pinLoginSchema = z.object({
  mobile: z.string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Mobile number must be a valid 10-digit Indian number starting with 6-9"),
  
  pin: z.string()
    .trim()
    .regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
});

export type PINLoginFormData = z.infer<typeof pinLoginSchema>;

// Forgot PIN - Send OTP validation schema
export const sendOTPSchema = z.object({
  mobile: z.string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Mobile number must be a valid 10-digit Indian number starting with 6-9"),
});

export type SendOTPFormData = z.infer<typeof sendOTPSchema>;

// Forgot PIN - Verify OTP validation schema
export const verifyOTPSchema = z.object({
  otp: z.string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;

// Forgot PIN - Reset PIN validation schema
export const resetPINSchema = z.object({
  newPin: z.string()
    .trim()
    .regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
  
  confirmPin: z.string()
    .trim()
    .regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
}).refine((data) => data.newPin === data.confirmPin, {
  message: "PINs do not match",
  path: ["confirmPin"],
});

export type ResetPINFormData = z.infer<typeof resetPINSchema>;
