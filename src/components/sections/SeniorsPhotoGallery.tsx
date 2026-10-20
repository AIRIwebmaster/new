'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';

const photos = [
  { src: '/images/seniors/IMG_9084.jpg', alt: 'AI with Seniors community learning session' },
  { src: '/images/seniors/IMG_9522.jpg', alt: 'Seniors learning to use digital tools together' },
  { src: '/images/seniors/IMG_9563.jpg', alt: 'AI literacy instructor presenting to seniors' },
  { src: '/images/seniors/IMG_9576.jpg', alt: 'Interactive AI literacy discussion with participants' },
  { src: '/images/seniors/IMG_9807.jpg', alt: 'Senior participant practising digital skills' },
];

export function SeniorsPhotoGallery() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const next = useCallback(() => setActive(i => (i + 1) % photos.length), []);
  const prev = useCallback(() => setActive(i => (i - 1 + photos.length) % photos.length), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') prev();
    };
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = oldOverflow; };
  }, [open, next, prev]);

  let touchX = 0;
  return (
    <section className="bg-grey-50" aria-label="AI with Seniors photo gallery">
      <div className="container py-16 md:py-20">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-h2">AI with Seniors — Photo Gallery</h2>
            <p className="mt-2 text-sm text-grey">Moments from our AI literacy learning sessions.</p>
          </div>
          <div className="flex gap-2">
            <button aria-label="Previous photo" onClick={prev} className="rounded-full border border-grey-200 bg-white p-3 hover:border-primary"><ChevronLeft size={20} /></button>
            <button aria-label="Next photo" onClick={next} className="rounded-full border border-grey-200 bg-white p-3 hover:border-primary"><ChevronRight size={20} /></button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map(offset => {
            const i = (active + offset) % photos.length;
            return (
              <button key={i} type="button" aria-label={`Open photo ${i + 1} of ${photos.length}`} onClick={() => { setActive(i); setOpen(true); }}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-grey-200 text-left">
                <Image src={photos[i].src} alt={photos[i].alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                <span className="absolute bottom-3 right-3 rounded-full bg-black/65 p-2 text-white"><Expand size={17} /></span>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-center text-sm text-grey">{active + 1} / {photos.length} · Select any photo to enlarge</p>
      </div>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Expanded photo gallery"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-10"
          onTouchStart={e => { touchX = e.touches[0].clientX; }}
          onTouchEnd={e => { const dx = e.changedTouches[0].clientX - touchX; if (Math.abs(dx) > 50) dx < 0 ? next() : prev(); }}>
          <button aria-label="Close gallery" onClick={() => setOpen(false)} className="absolute right-4 top-4 z-20 rounded-full bg-white/15 p-3 text-white hover:bg-white/25"><X /></button>
          <button aria-label="Previous image" onClick={prev} className="absolute left-3 z-20 rounded-full bg-white/15 p-3 text-white hover:bg-white/25 sm:left-8"><ChevronLeft /></button>
          <div className="relative h-[78vh] w-[88vw] max-w-6xl">
            <Image src={photos[active].src} alt={photos[active].alt} fill sizes="90vw" className="object-contain" priority />
          </div>
          <button aria-label="Next image" onClick={next} className="absolute right-3 z-20 rounded-full bg-white/15 p-3 text-white hover:bg-white/25 sm:right-8"><ChevronRight /></button>
          <p className="absolute bottom-4 text-sm text-white/80">{active + 1} / {photos.length}</p>
        </div>
      )}
    </section>
  );
}
