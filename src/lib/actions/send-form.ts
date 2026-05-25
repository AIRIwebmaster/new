'use server';

import { z } from 'zod';
import { verifyTurnstile } from '@/lib/turnstile';
import type { FormSubmissionResult } from '@/types';

async function submitForm<T extends z.ZodType>(
  schema: T,
  data: unknown
): Promise<FormSubmissionResult> {
  try {
    const rawData = data as Record<string, unknown>;
    const turnstileToken = rawData?.turnstileToken;
    if (typeof turnstileToken !== 'string' || !turnstileToken) {
      return { success: false, message: 'Please complete the verification' };
    }
    const verified = await verifyTurnstile(turnstileToken);
    if (!verified) {
      return { success: false, message: 'Verification failed. Please try again.' };
    }

    const { turnstileToken: _removed, ...formData } = rawData;
    schema.parse(formData);

    return {
      success: true,
      message: 'Form submitted successfully!',
    };
  } catch (error) {
    console.error('Form submission error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Please check your form inputs',
        error: error.errors[0].message,
      };
    }

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function submitWorkshopForm(data: unknown) {
  const { workshopSchema } = await import('@/lib/validations/workshop');
  return submitForm(workshopSchema, data);
}

export async function submitCommunityForm(data: unknown) {
  const { communitySchema } = await import('@/lib/validations/community');
  return submitForm(communitySchema, data);
}

export async function submitBusinessForm(data: unknown) {
  const { businessSchema } = await import('@/lib/validations/business');
  return submitForm(businessSchema, data);
}
