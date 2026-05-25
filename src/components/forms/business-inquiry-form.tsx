'use client';

import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CustomSelect } from '@/components/ui/custom-select';
import { Turnstile } from '@/components/ui/turnstile';

const businessSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required'),
  yourName: z.string().min(2, 'Your name is required'),
  workEmail: z.string().email('Please enter a valid email address'),
  whatToImprove: z.string().min(10, 'Please describe what you want to improve').max(500),
  organizationType: z.string().optional().or(z.literal('')),
  biggestChallenge: z.string().max(500).optional().or(z.literal('')),
});

type BusinessFormData = z.infer<typeof businessSchema>;

const inputClass = 'w-full border border-grey-200 bg-white px-4 py-3 text-sm text-foreground placeholder:text-grey-light focus:border-primary focus:outline-none';

export function BusinessInquiryForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [formState, setFormState] = useState<{
    status: 'idle' | 'submitting' | 'success' | 'error';
    message?: string;
  }>({ status: 'idle' });
  const handleVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleExpire = useCallback(() => setTurnstileToken(''), []);

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      organizationName: '',
      yourName: '',
      workEmail: '',
      whatToImprove: '',
      organizationType: '',
      biggestChallenge: '',
    },
  });

  const onSubmit = async (data: BusinessFormData) => {
    setFormState({ status: 'submitting' });
    try {
      const res = await fetch('/api/business-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken }),
      });
      const result = await res.json();
      if (result.success) {
        setFormState({ status: 'success', message: result.message });
        form.reset();
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      } else {
        setFormState({ status: 'error', message: result.message });
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    } catch {
      setFormState({ status: 'error', message: 'Something went wrong. Please try again.' });
    }
  };

  if (formState.status === 'success') {
    return (
      <div ref={formRef} className="border border-primary-200 bg-primary-50 p-6">
        <p className="text-sm font-medium text-primary">{formState.message}</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {formState.status === 'error' && formState.message && (
          <div className="border border-destructive/20 bg-red-50 p-4">
            <p className="text-sm text-destructive">{formState.message}</p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField control={form.control} name="organizationName" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Organization Name*</FormLabel>
              <FormControl><input className={inputClass} placeholder="Your organization" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="yourName" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Your Name*</FormLabel>
              <FormControl><input className={inputClass} placeholder="Full name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="workEmail" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Work Email*</FormLabel>
            <FormControl><input className={inputClass} type="email" placeholder="you@organization.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="whatToImprove" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">What do you want to improve?*</FormLabel>
            <FormControl>
              <textarea className={`${inputClass} min-h-[100px] resize-y`} placeholder="Describe the processes, workflows, or areas you'd like to improve..." maxLength={500} {...field} />
            </FormControl>
            <p className="text-xs text-grey">{field.value?.length || 0} / 500</p>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="organizationType" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Organization Type</FormLabel>
            <FormControl>
              <CustomSelect
                value={field.value ?? ''}
                onChange={field.onChange}
                placeholder="Select type"
                options={[
                  { value: 'private', label: 'Private company' },
                  { value: 'nonprofit', label: 'Non-profit' },
                  { value: 'government', label: 'Government / Public sector' },
                  { value: 'healthcare', label: 'Healthcare' },
                  { value: 'education', label: 'Education institution' },
                  { value: 'manufacturing', label: 'Manufacturing' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="biggestChallenge" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Biggest Challenge or Purpose for the Call</FormLabel>
            <FormControl>
              <textarea className={`${inputClass} min-h-[100px] resize-y`} placeholder="What's the biggest challenge you're facing right now?" maxLength={500} {...field} />
            </FormControl>
            <p className="text-xs text-grey">{field.value?.length || 0} / 500</p>
            <FormMessage />
          </FormItem>
        )} />

        <Turnstile onVerify={handleVerify} onExpire={handleExpire} />

        <button
          type="submit"
          disabled={formState.status === 'submitting' || !turnstileToken}
          className="bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
        >
          {formState.status === 'submitting' ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </Form>
  );
}
