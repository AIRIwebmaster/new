'use client';

import { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FormMessageProps {
  type: 'success' | 'error';
  message: string;
}

export function FormMessage({ type, message }: FormMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      // Smooth scroll to message
      messageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // Screen reader announcement
      messageRef.current.setAttribute('role', 'alert');
      messageRef.current.setAttribute('aria-live', 'polite');
    }
  }, [message]);

  return (
    <div
      ref={messageRef}
      className={cn(
        'mb-6 flex animate-fade-in items-start gap-3 rounded-lg p-4',
        type === 'success'
          ? 'border border-green-200 bg-green-50 text-green-900'
          : 'border border-red-200 bg-red-50 text-red-900'
      )}
    >
      {type === 'success' ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
      )}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
