import { z } from 'zod';

export const sharedSchemas = {
  fullName: z.string().min(2, 'Name must be at least 2 characters'),

  email: z.string().email('Please enter a valid email address'),

  phone: z
    .string()
    .regex(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      'Please enter a valid phone number'
    )
    .optional()
    .or(z.literal('')),

  organization: z.string().min(2, 'Organization name is required'),

  message: z
    .string()
    .max(500, 'Message must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
};
