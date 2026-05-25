'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';

export function VideoPlayButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative flex h-32 w-32 flex-shrink-0 items-center justify-center sm:h-40 sm:w-40 md:h-48 md:w-48"
        aria-label="Play introduction video"
      >
        <span className="absolute inset-0 rounded-full border-2 border-primary/20 transition-all group-hover:border-primary/40" />
        <span className="absolute inset-3 rounded-full border border-primary/10 transition-all group-hover:border-primary/25" />
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary transition-transform group-hover:scale-110 sm:h-16 sm:w-16">
          <Play className="ml-1 h-6 w-6 text-white" fill="currentColor" />
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -right-2 -top-10 text-white/80 transition-colors hover:text-white"
              aria-label="Close video"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="relative overflow-hidden bg-black pt-[56.25%]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/d1QolvxB8Pc?autoplay=1"
                title="AIRI Foundation Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
