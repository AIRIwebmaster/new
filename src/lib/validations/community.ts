import { z } from 'zod';
import { sharedSchemas } from './shared';

export const communitySchema = z.object({
  organizationName: z.string().min(2, 'Organization/group name is required'),
  fullName: sharedSchemas.fullName,
  role: z.enum(
    [
      'Program coordinator',
      'Executive director',
      'Community worker',
      'Volunteer coordinator',
      'Other',
    ],
    {
      required_error: 'Please select your role',
    }
  ),
  roleOther: z.string().optional().or(z.literal('')),
  email: sharedSchemas.email,
  phone: sharedSchemas.phone,
  organizationType: z.enum(
    [
      'Community center',
      'Library',
      'Settlement/Newcomer services',
      'Senior center',
      'Faith-based organization',
      'Youth program',
      'Cultural organization',
      'Other',
    ],
    {
      required_error: 'Please select organization type',
    }
  ),
  organizationTypeOther: z.string().optional().or(z.literal('')),
  whoYouServe: z.array(z.string()).min(1, 'Please select at least one group'),
  whoYouServeOther: z.string().optional().or(z.literal('')),
  lookingFor: z.enum(
    [
      'Training sessions for our community members',
      'Workshop series',
      'Train-the-trainer program',
      'Partnership for ongoing programming',
      'One-time event',
      'Other',
    ],
    {
      required_error: 'Please select what you are looking for',
    }
  ),
  lookingForOther: z.string().optional().or(z.literal('')),
  participants: z.enum(
    [
      'Small group (5-15)',
      'Medium group (15-30)',
      'Large group (30+)',
      'Ongoing with different groups',
    ],
    {
      required_error: 'Please select number of participants',
    }
  ),
  additionalInfo: z
    .string()
    .max(500, 'Message must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

export type CommunityFormData = z.infer<typeof communitySchema>;
