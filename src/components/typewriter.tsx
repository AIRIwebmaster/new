'use client';

import { useEffect, useState } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
}

export default function Typewriter({
  text,
  speed = 60,
  delay = 2000,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting && index <= text.length) {
      timeout = setTimeout(() => {
        setDisplayed(text.slice(0, index));
        setIndex((prev) => prev + 1);
      }, speed);
    }

    if (!isDeleting && index > text.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, delay);
    }

    if (isDeleting && index >= 0) {
      timeout = setTimeout(() => {
        setDisplayed(text.slice(0, index));
        setIndex((prev) => prev - 1);
      }, speed / 2);
    }

    if (isDeleting && index < 0) {
      setIsDeleting(false);
      setIndex(0);
    }

    return () => clearTimeout(timeout);
  }, [index, isDeleting, text, speed, delay]);

  return (
    <span className="inline-flex items-center">
      <span>{displayed}</span>

      {/* blinking cursor */}
      <span className="ml-1 inline-block w-[2px] animate-pulse bg-white">
        &nbsp;
      </span>
    </span>
  );
}