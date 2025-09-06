import z from "zod";

export const LoginSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export const OTPCodeSchema = z.object({
  code: z.string().min(1, "OTP code is required"),
});

export const VerifyPhoneOTPSchema = LoginSchema.pick({
  phoneNumber: true,
}).extend(OTPCodeSchema.shape);

export const OnBoardUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  businessEmail: z.email("Invalid business email address"),
  companyName: z.string().min(1, "Company name is required"),
});

export const VerifyEmailOTPSchema = OnBoardUserSchema.pick({
  businessEmail: true,
}).extend(OTPCodeSchema.shape);

export const OnBoardOAuthUserSchema = LoginSchema.extend({
  companyName: z.string().min(1, "Company name is required"),
});

export type LoginSchema = z.infer<typeof LoginSchema>;
export type VerifyPhoneOTPSchema = z.infer<typeof VerifyPhoneOTPSchema>;
export type OnBoardUserSchema = z.infer<typeof OnBoardUserSchema>;
export type VerifyEmailOTPSchema = z.infer<typeof VerifyEmailOTPSchema>;
export type OnBoardOAuthUserSchema = z.infer<typeof OnBoardOAuthUserSchema>;
