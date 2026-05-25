import { z } from 'zod';
import { sharedSchemas } from './shared';

export const businessSchema = z.object({
  organizationName: sharedSchemas.organization,
  fullName: sharedSchemas.fullName,
  email: sharedSchemas.email,
  phone: sharedSchemas.phone,
  organizationType: z.enum(
    [
      'Private company',
      'Non-profit',
      'Government/Public sector',
      'Healthcare',
      'Education institution',
      'Manufacturing',
      'Other',
    ],
    {
      required_error: 'Please select organization type',
    }
  ),
  organizationTypeOther: z.string().optional().or(z.literal('')),
  challenge: z.enum(
    [
      'Team overwhelmed with repetitive work',
      'Need to understand AI options',
      "Tried AI tools but they didn't work",
      'Want to build internal AI capability',
      'Other',
    ],
    {
      required_error: 'Please select your biggest challenge',
    }
  ),
  challengeOther: z.string().optional().or(z.literal('')),
  peopleAffected: z.enum(['1-10', '11-50', '51-200', '200+'], {
    required_error: 'Please select number of people affected',
  }),
  timeline: z.enum(
    [
      'Exploring options (3-6 months)',
      'Need to start soon (1-3 months)',
      'Urgent (within 1 month)',
    ],
    {
      required_error: 'Please select timeline',
    }
  ),
  additionalInfo: z
    .string()
    .max(500, 'Message must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

export type BusinessFormData = z.infer<typeof businessSchema>;
