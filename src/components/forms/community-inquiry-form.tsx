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

const communitySchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required'),
  yourName: z.string().min(2, 'Your name is required'),
  role: z.string().min(2, 'Your role is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().or(z.literal('')),
  whoServed: z.string().min(1, 'Please select who you primarily serve'),
  lookingFor: z.string().min(1, 'Please select what you are looking for'),
  participantCount: z.string().min(1, 'Please select expected participants'),
  preferredTiming: z.string().min(1, 'Please select preferred timing'),
  additionalInfo: z.string().max(500).optional().or(z.literal('')),
});

type CommunityFormData = z.infer<typeof communitySchema>;

const inputClass = 'w-full border border-grey-200 bg-white px-4 py-3 text-sm text-foreground placeholder:text-grey-light focus:border-primary focus:outline-none';

export function CommunityInquiryForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [formState, setFormState] = useState<{
    status: 'idle' | 'submitting' | 'success' | 'error';
    message?: string;
  }>({ status: 'idle' });
  const handleVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleExpire = useCallback(() => setTurnstileToken(''), []);

  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      organizationName: '',
      yourName: '',
      role: '',
      email: '',
      phone: '',
      whoServed: '',
      lookingFor: '',
      participantCount: '',
      preferredTiming: '',
      additionalInfo: '',
    },
  });

  const onSubmit = async (data: CommunityFormData) => {
    setFormState({ status: 'submitting' });
    try {
      const res = await fetch('/api/community-inquiry', {
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

        <FormField control={form.control} name="organizationName" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Organization / Group Name*</FormLabel>
            <FormControl><input className={inputClass} placeholder="Your organization or group" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField control={form.control} name="yourName" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Your Name*</FormLabel>
              <FormControl><input className={inputClass} placeholder="Full name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="role" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Your Role / Position*</FormLabel>
              <FormControl><input className={inputClass} placeholder="e.g. Program Director" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Email Address*</FormLabel>
              <FormControl><input className={inputClass} type="email" placeholder="you@organization.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
              <FormControl><input className={inputClass} type="tel" placeholder="+1 (555) 123-4567" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="whoServed" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Who do you primarily serve?*</FormLabel>
            <FormControl>
              <CustomSelect
                value={field.value}
                onChange={field.onChange}
                placeholder="Select audience"
                options={[
                  { value: 'youth', label: 'Youth' },
                  { value: 'adults', label: 'Adults' },
                  { value: 'seniors', label: 'Seniors' },
                  { value: 'newcomers', label: 'Newcomers / Immigrants' },
                  { value: 'general', label: 'General community members' },
                  { value: 'staff', label: 'Staff / Volunteers' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="lookingFor" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">What are you looking for?*</FormLabel>
            <FormControl>
              <CustomSelect
                value={field.value}
                onChange={field.onChange}
                placeholder="Select option"
                options={[
                  { value: 'ai-solution', label: 'Help develop and integrate AI solution' },
                  { value: 'intro-session', label: 'One-time introductory session' },
                  { value: 'workshop-series', label: 'Short workshop series' },
                  { value: 'train-trainer', label: 'Train-the-trainer program' },
                  { value: 'ongoing', label: 'Ongoing partnership / recurring sessions' },
                  { value: 'custom-program', label: 'Help designing a custom program' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField control={form.control} name="participantCount" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Expected Participants*</FormLabel>
              <FormControl>
                <CustomSelect
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select range"
                  options={[
                    { value: 'under-15', label: 'Fewer than 15' },
                    { value: '15-30', label: '15 – 30' },
                    { value: '30-75', label: '30 – 75' },
                    { value: '75-150', label: '75 – 150' },
                    { value: '150+', label: '150+' },
                  ]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="preferredTiming" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Preferred Timing*</FormLabel>
              <FormControl>
                <CustomSelect
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select timing"
                  options={[
                    { value: 'within-month', label: 'Within the next month' },
                    { value: '1-3-months', label: '1 – 3 months' },
                    { value: '3-6-months', label: '3 – 6 months' },
                    { value: 'exploring', label: 'Not sure / exploring options' },
                  ]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="additionalInfo" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Anything else we should know?</FormLabel>
            <FormControl>
              <textarea className={`${inputClass} min-h-[100px] resize-y`} placeholder="Tell us about your community or goals..." maxLength={500} {...field} />
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
