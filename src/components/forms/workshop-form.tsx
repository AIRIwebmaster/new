'use client';

import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workshopSchema, type WorkshopFormData } from '@/lib/validations/workshop';
import { submitWorkshopForm } from '@/lib/actions/send-form';
import { Button } from '@/components/ui/button';
// import { Turnstile } from '@/components/ui/turnstile';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormMessage as InlineMessage } from './form-message';
import { Loader2 } from 'lucide-react';

export function WorkshopForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [formState, setFormState] = useState<{
    status: 'idle' | 'submitting' | 'success' | 'error';
    message?: string;
  }>({ status: 'idle' });
  const handleVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleExpire = useCallback(() => setTurnstileToken(''), []);

  const form = useForm<WorkshopFormData>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      organization: '',
      role: '',
      participants: '',
      location: '',
      hearAbout: '',
      message: '',
    },
  });

  const onSubmit = async (data: WorkshopFormData) => {
    setFormState({ status: 'submitting' });

    try {
      const result = await submitWorkshopForm({ ...data, turnstileToken });

      if (result.success) {
        setFormState({ status: 'success', message: result.message });
        form.reset();
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

        setTimeout(() => {
          setFormState({ status: 'idle' });
        }, 5000);
      } else {
        setFormState({ status: 'error', message: result.message });
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    } catch (error) {
      setFormState({
        status: 'error',
        message: 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <div ref={formRef} className="mx-auto w-full max-w-2xl">
      {formState.status !== 'idle' && formState.message && (
        <InlineMessage
          type={formState.status === 'success' ? 'success' : 'error'}
          message={formState.message}
        />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Organization */}
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <FormControl>
                  <Input placeholder="Your organization" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role / Position</FormLabel>
                <FormControl>
                  <Input placeholder="Your role" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Workshop Selection */}
          <FormField
            control={form.control}
            name="workshop"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Workshop *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Please select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Leadership & Team Building">
                      Leadership & Team Building
                    </SelectItem>
                    <SelectItem value="Community Engagement Strategies">
                      Community Engagement Strategies
                    </SelectItem>
                    <SelectItem value="Sustainability & Innovation">
                      Sustainability & Innovation
                    </SelectItem>
                    <SelectItem value="Youth Empowerment">Youth Empowerment</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Participants */}
          <FormField
            control={form.control}
            name="participants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Participants *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 10-20" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Preferred Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Location / Venue</FormLabel>
                <FormControl>
                  <Input placeholder="City or venue name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* How did you hear about us */}
          <FormField
            control={form.control}
            name="hearAbout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How did you hear about us?</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Social Media, Referral" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Additional Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Message or Note</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us more about your needs..."
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-grey">{field.value?.length || 0} / 250</p>
              </FormItem>
            )}
          />

         

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-600"
          >
            {formState.status === 'submitting' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
