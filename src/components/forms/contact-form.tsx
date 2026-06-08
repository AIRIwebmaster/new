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

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().or(z.literal('')),
  organization: z.string().optional().or(z.literal('')),
  enquiryType: z.string().min(1, 'Please select an enquiry type'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const inputClass = 'w-full border border-grey-200 bg-white px-4 py-3 text-sm text-foreground placeholder:text-grey-light focus:border-primary focus:outline-none';

export function ContactForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [formState, setFormState] = useState<{
    status: 'idle' | 'submitting' | 'success' | 'error';
    message?: string;
  }>({ status: 'idle' });
  const handleVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleExpire = useCallback(() => setTurnstileToken(''), []);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      organization: '',
      enquiryType: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setFormState({ status: 'submitting' });
    try {
      const res = await fetch('/api/contact', {
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
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Full Name*</FormLabel>
                <FormControl>
                  <input className={inputClass} placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Email*</FormLabel>
                <FormControl>
                  <input className={inputClass} type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Phone</FormLabel>
                <FormControl>
                  <input className={inputClass} type="tel" placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Organization</FormLabel>
                <FormControl>
                  <input className={inputClass} placeholder="Your organization" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="enquiryType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Subject*</FormLabel>
              <FormControl>
                <CustomSelect
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select a subject"
                  options={[
                    { value: 'Workflow and Process Automation', label: 'Workflow and Process Automation' },
                    { value: 'Custom Software Development', label: 'Custom Software Development' },
                    { value: 'Corporate AI Training and Consulting', label: 'Corporate AI Training and Consulting' },
                    { value: 'Academic and AI Research Inquiries', label: 'Academic and AI Research Inquiries' },
                    { value: 'Code and AI Creators Club', label: 'Code and AI Creators Club' },
                    { value: 'Seniors AI Literacy and Workshops', label: 'Seniors AI Literacy and Workshops' },
                    { value: 'Partnership and Collaboration Opportunities', label: 'Partnership and Collaboration Opportunities' },
                    { value: 'Careers Co-ops and Volunteering', label: 'Careers Co-ops and Volunteering' },
                    { value: 'General Enquiries', label: 'General Enquiries' },
                  ]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Comments*</FormLabel>
              <FormControl>
                <textarea
                  className={`${inputClass} min-h-[140px] resize-y`}
                  placeholder="Tell us about your needs, goals, or questions..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Turnstile onVerify={handleVerify} onExpire={handleExpire} />

        <button
          type="submit"
          disabled={formState.status === 'submitting' || !turnstileToken}
          className="bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
        >
          {formState.status === 'submitting' ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </Form>
  );
}
