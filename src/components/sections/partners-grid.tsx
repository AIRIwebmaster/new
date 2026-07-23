'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';

const partners = [
  { name: 'Lethbridge Public Library', logo: '/images/partners/Lethbridge-Public-library.png', href: 'https://lethlib.ca' },
  { name: 'BIPOC Foundation', logo: '/images/partners/BF-BIPOC-LOGOS-V1-01-1-scaled.png', href: 'https://bipocfoundation.com' },
  { name: 'NordBridge Senior Centre', logo: '/images/partners/NordBridhe.png', href: 'https://nordbridgeseniorcentre.com' },
  { name: 'Destination Exploration', logo: '/images/partners/DE-Logo-Full-Colour-scaled.png', href: 'https://destinationexploration.ca' },
  { name: 'SECA', logo: '/images/partners/SECA-logo_-SVG.svg', href: 'https://seca-ab.ca' },
  { name: 'Lethbridge Chamber of Commerce', logo: '/images/partners/lethbridge-coc.png', href: 'https://lethbridgechamber.com' },
  { name: 'Young Engineers', logo: '/images/partners/ye-logo.png', href: 'https://youngengineers.org/' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PartnersGrid() {
  const [items, setItems] = useState(partners);

  useEffect(() => {
    setItems(shuffle(partners));
  }, []);

  return (
    <div className="grid grid-cols-2 gap-px border border-grey-200 bg-grey-200 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((partner) => (
        <a
          key={partner.name}
          href={partner.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-white px-6 py-8 transition-colors hover:bg-grey-50"
        >
          <Image
            src={partner.logo}
            alt={partner.name}
            width={140}
            height={60}
            className="h-10 w-auto object-contain opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0 md:h-12"
          />
        </a>
      ))}
      <Link
        href="/contact"
        className="flex items-center justify-center bg-primary px-6 py-8 text-sm font-semibold text-white transition-colors hover:bg-primary-600 lg:hidden"
      >
        Partner with AIRI →
      </Link>
    </div>
  );
}
