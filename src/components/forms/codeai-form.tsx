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

const registrationSchema = z.object({
  studentName: z.string().min(2, 'Student name must be at least 2 characters'),
  studentAge: z.string().min(1, 'Please enter student age'),
  parentName: z.string().min(2, 'Parent name must be at least 2 characters'),
  parentEmail: z.string().email('Please enter a valid email address'),
  parentPhone: z.string().min(7, 'Please enter a valid phone number'),
  experienceLevel: z.string().min(1, 'Please select experience level'),
  howHeard: z.string().optional().or(z.literal('')),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const inputClass = 'w-full border border-grey-200 bg-white px-4 py-3 text-sm text-foreground placeholder:text-grey-light focus:border-primary focus:outline-none';

export function CodeAIRegistrationForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [formState, setFormState] = useState<{
    status: 'idle' | 'submitting' | 'success' | 'error';
    message?: string;
  }>({ status: 'idle' });
  const handleVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleExpire = useCallback(() => setTurnstileToken(''), []);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { studentName: '', studentAge: '', parentName: '', parentEmail: '', parentPhone: '', experienceLevel: '', howHeard: '' },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setFormState({ status: 'submitting' });
    try {
      const res = await fetch('/api/register-codeai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, studentAge: parseInt(data.studentAge, 10), turnstileToken }),
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

        <p className="text-xs font-semibold uppercase tracking-wide text-grey">Student Information</p>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField control={form.control} name="studentName" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Student Name*</FormLabel>
              <FormControl><input className={inputClass} placeholder="Student's full name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="studentAge" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Age*</FormLabel>
              <FormControl><input className={inputClass} type="number" min={10} max={18} placeholder="8-16" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="experienceLevel" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Experience Level*</FormLabel>
            <FormControl>
              <CustomSelect
                value={field.value}
                onChange={field.onChange}
                placeholder="Select level"
                options={[
                  { value: 'none', label: 'No experience' },
                  { value: 'beginner', label: 'Some experience (Scratch, etc.)' },
                  { value: 'intermediate', label: 'Intermediate (basic coding)' },
                ]}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="border-t border-grey-200 pt-6">
          <p className="mb-6 text-xs font-semibold uppercase tracking-wide text-grey">Parent / Guardian Information</p>
          <div className="space-y-6">
            <FormField control={form.control} name="parentName" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Parent/Guardian Name*</FormLabel>
                <FormControl><input className={inputClass} placeholder="Full name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField control={form.control} name="parentEmail" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email*</FormLabel>
                  <FormControl><input className={inputClass} type="email" placeholder="parent@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="parentPhone" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Phone*</FormLabel>
                  <FormControl><input className={inputClass} type="tel" placeholder="+1 (555) 123-4567" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>
        </div>

        <FormField control={form.control} name="howHeard" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">How did you hear about us?</FormLabel>
            <FormControl>
              <CustomSelect
                value={field.value ?? ''}
                onChange={field.onChange}
                placeholder="Select option"
                options={[
                  { value: 'social-media', label: 'Social Media' },
                  { value: 'school', label: 'School' },
                  { value: 'library', label: 'Library' },
                  { value: 'friend', label: 'Friend or Family' },
                  { value: 'community', label: 'Community Center' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Turnstile onVerify={handleVerify} onExpire={handleExpire} />

        <button
          type="submit"
          disabled={formState.status === 'submitting' || !turnstileToken}
          className="bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
        >
          {formState.status === 'submitting' ? 'Registering...' : 'Register now'}
        </button>
      </form>
    </Form>
  );
}
