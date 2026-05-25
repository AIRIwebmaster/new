import { z } from 'zod';
import { sharedSchemas } from './shared';

export const workshopSchema = z.object({
  fullName: sharedSchemas.fullName,
  email: sharedSchemas.email,
  phone: sharedSchemas.phone,
  organization: z.string().optional().or(z.literal('')),
  role: z.string().optional().or(z.literal('')),
  workshop: z.enum(
    [
      'Leadership & Team Building',
      'Community Engagement Strategies',
      'Sustainability & Innovation',
      'Youth Empowerment',
    ],
    {
      required_error: 'Please select a workshop',
    }
  ),
  participants: z.string().min(1, 'Number of participants is required'),
  location: z.string().optional().or(z.literal('')),
  hearAbout: z.string().optional().or(z.literal('')),
  message: sharedSchemas.message,
});

export type WorkshopFormData = z.infer<typeof workshopSchema>;
