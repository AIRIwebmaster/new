'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';

const photos = [
  {
    src: '/images/code-ai-club/signal-2026-08-11-22-45-41-763_014.jpg',
    alt: 'Students taking part in a Code and AI Club learning activity',
  },
  {
    src: '/images/code-ai-club/signal-2026-08-11-22-45-41-763_013.jpg',
    alt: 'Students participating in a hands-on coding and AI session',
  },
  {
    src: '/images/code-ai-club/signal-2026-08-11-22-45-41-763_012.jpg',
    alt: 'Young learners exploring technology at the Code and AI Club',
  },
  {
    src: '/images/code-ai-club/signal-2026-08-11-22-45-41-763_011.jpg',
    alt: 'Students learning and collaborating during the Code and AI Club',
  },
];

export function CodeAIClubPhotoGallery() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => {
    setActive((index) => (index + 1) % photos.length);
  }, []);

  const prev = useCallback(() => {
    setActive((index) => (index - 1 + photos.length) % photos.length);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') prev();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, next, prev]);

  return (
    <section className="bg-grey-50" aria-label="Code and AI Club photo gallery">
      <div className="container py-16 md:py-20">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-h2">Code &amp; AI Club — Photo Gallery</h2>
            <p className="mt-2 text-sm text-grey">
              A look at our students learning, experimenting and creating together.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous photo"
              onClick={prev}
              className="rounded-full border border-grey-200 bg-white p-3 hover:border-primary"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={next}
              className="rounded-full border border-grey-200 bg-white p-3 hover:border-primary"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((offset) => {
            const index = (active + offset) % photos.length;
            return (
              <button
                key={index}
                type="button"
                aria-label={`Open photo ${index + 1} of ${photos.length}`}
                onClick={() => {
                  setActive(index);
                  setOpen(true);
                }}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-grey-200 text-left"
              >
                <img
                  src={photos[index].src}
                  alt={photos[index].alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-3 right-3 rounded-full bg-black/65 p-2 text-white">
                  <Expand size={17} />
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-center text-sm text-grey" aria-live="polite">
          {active + 1} / {photos.length} · Select any photo to enlarge
        </p>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Expanded Code and AI Club photo gallery"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-10"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const distance = event.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(distance) > 50) distance < 0 ? next() : prev();
            touchStartX.current = null;
          }}
        >
          <button
            type="button"
            aria-label="Close gallery"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-20 rounded-full bg-white/15 p-3 text-white hover:bg-white/25"
          >
            <X />
          </button>
          <button
            type="button"
            aria-label="Previous image"
            onClick={prev}
            className="absolute left-3 z-20 rounded-full bg-white/15 p-3 text-white hover:bg-white/25 sm:left-8"
          >
            <ChevronLeft />
          </button>
          <div className="flex h-[78vh] w-[88vw] max-w-6xl items-center justify-center">
            <img
              src={photos[active].src}
              alt={photos[active].alt}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className="absolute right-3 z-20 rounded-full bg-white/15 p-3 text-white hover:bg-white/25 sm:right-8"
          >
            <ChevronRight />
          </button>
          <p className="absolute bottom-4 text-sm text-white/80" aria-live="polite">
            {active + 1} / {photos.length}
          </p>
        </div>
      )}
    </section>
  );
}
