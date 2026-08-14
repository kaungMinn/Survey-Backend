import z from 'zod';

export const surveyZodSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone_number: z.string().min(1, "Phone number is required"),
    company_name: z.string().min(1, "Company name is required"),
    designation: z.string().min(1, "Designation is required")
});