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

const volunteerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().or(z.literal('')),
  interest: z.string().min(1, 'Please select an area of interest'),
  availability: z.string().min(1, 'Please select your availability'),
  experience: z.string().optional().or(z.literal('')),
  message: z.string().optional().or(z.literal('')),
});

type VolunteerFormData = z.infer<typeof volunteerSchema>;

const inputClass = 'w-full border border-grey-200 bg-white px-4 py-3 text-sm text-foreground placeholder:text-grey-light focus:border-primary focus:outline-none';

export function VolunteerForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [formState, setFormState] = useState<{
    status: 'idle' | 'submitting' | 'success' | 'error';
    message?: string;
  }>({ status: 'idle' });
  const handleVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleExpire = useCallback(() => setTurnstileToken(''), []);

  const form = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: { fullName: '', email: '', phone: '', interest: '', availability: '', experience: '', message: '' },
  });

  const onSubmit = async (data: VolunteerFormData) => {
    setFormState({ status: 'submitting' });
    try {
      const res = await fetch('/api/volunteer', {
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
          <FormField control={form.control} name="fullName" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Full Name*</FormLabel>
              <FormControl><input className={inputClass} placeholder="Your full name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Email*</FormLabel>
              <FormControl><input className={inputClass} type="email" placeholder="you@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Phone</FormLabel>
            <FormControl><input className={inputClass} type="tel" placeholder="+1 (555) 123-4567" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField control={form.control} name="interest" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Area of Interest*</FormLabel>
              <FormControl>
                <CustomSelect
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select area"
                  options={[
                    { value: 'workshop-facilitator', label: 'Workshop Facilitator' },
                    { value: 'youth-mentor', label: 'Youth Coding Mentor' },
                    { value: 'community-outreach', label: 'Community Outreach' },
                    { value: 'research-assistant', label: 'Research Assistant' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="availability" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Availability*</FormLabel>
              <FormControl>
                <CustomSelect
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select availability"
                  options={[
                    { value: 'weekdays', label: 'Weekdays' },
                    { value: 'evenings', label: 'Evenings' },
                    { value: 'weekends', label: 'Weekends' },
                    { value: 'flexible', label: 'Flexible' },
                  ]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="experience" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Relevant Experience</FormLabel>
            <FormControl><textarea className={`${inputClass} min-h-[80px] resize-y`} placeholder="Briefly describe any relevant skills or experience..." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="message" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Why do you want to volunteer?</FormLabel>
            <FormControl><textarea className={`${inputClass} min-h-[80px] resize-y`} placeholder="Tell us what motivates you..." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Turnstile onVerify={handleVerify} onExpire={handleExpire} />

        <button
          type="submit"
          disabled={formState.status === 'submitting' || !turnstileToken}
          className="bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
        >
          {formState.status === 'submitting' ? 'Submitting...' : 'Submit application'}
        </button>
      </form>
    </Form>
  );
}
