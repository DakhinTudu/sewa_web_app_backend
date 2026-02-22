import { z } from 'zod';

export const LoginSchema = z.object({
    login: z.string().min(1, 'Email or username is required'),
    password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;

export const ForgotPasswordEmailSchema = z.object({
    email: z.string().email('Invalid email address'),
});
export type ForgotPasswordEmailValues = z.infer<typeof ForgotPasswordEmailSchema>;

export const ResetPasswordSchema = z
    .object({
        email: z.string().email('Invalid email'),
        otp: z.string().length(6, 'OTP must be 6 digits'),
        newPassword: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(6, 'Please confirm your password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

// Member Registration Schema
export const RegisterMemberSchema = z.object({
    username: z.string().min(4, "Username must be at least 4 chars"),
    password: z.string().min(6, "Password must be at least 6 chars"),
    email: z.string().email("Invalid email"),
    fullName: z.string().min(1, "Full Name is required"),
    phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
    organization: z.string().optional(),
    designation: z.string().optional(),
    address: z.string().optional(),
});

export type RegisterMemberFormValues = z.infer<typeof RegisterMemberSchema>;

// Student Registration Schema
export const RegisterStudentSchema = z.object({
    username: z.string().min(4, "Username must be at least 4 chars"),
    password: z.string().min(6, "Password must be at least 6 chars"),
    email: z.string().email("Invalid email"),
    fullName: z.string().min(1, "Full Name is required"),
    phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
    institute: z.string().min(1, "Institute is required"),
    course: z.string().min(1, "Course is required"),
});

export type RegisterStudentFormValues = z.infer<typeof RegisterStudentSchema>;

