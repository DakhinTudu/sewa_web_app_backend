import { z } from 'zod';

export const LoginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;

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

