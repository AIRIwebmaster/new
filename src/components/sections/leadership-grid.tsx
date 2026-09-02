'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Linkedin } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  photo: string;
  bio: string;
  linkedin: string;
  fullBio: string;
}

const team: TeamMember[] = [
  {
    name: 'Frank Onuh',
    role: 'Executive Director',
    photo: '/images/team/frank-onuh.jpg',
    bio: 'Executive Director of AIRI Foundation and a member of Alberta Machine Intelligence Institute. Extensive leadership and R&D experience in Applied Generative AI.',
    linkedin: 'https://www.linkedin.com/in/frank-onuh/',
    fullBio: 'Frank Onuh is the Executive Director of AIRI Foundation and a member of Alberta Machine Intelligence Institute. He has extensive leadership and R&D experience in Applied Generative AI and misinformation studies.\n\nFrank is a consistent voice in AI ethics and digital empowerment and has designed and led major cross-sectoral projects that span AI literacy and capacity building, including designing low-cost AI-powered auto systems. As part of this work on de-biasing GenAI outputs, he developed the AI Bias Detection Canvas, a structured framework for identifying and mitigating algorithmic inequities. Frank has facilitated digital training partnerships that help provide training to BIPOC professionals in the data science and AI fields across Canada.',
  },
  {
    name: 'Dr. Jannatul Maowa',
    role: 'Director of Programs and Research',
    photo: '/images/team/jannatul.png',
    bio: 'Dr. Jannatul Maowa is the Director of Programs at AIRI Foundation, where she provides strategic leadership for the development and delivery of research-informed programs, funding initiatives, institutional partnerships, program evaluation and knowledge mobilization.',
    linkedin: 'https://www.linkedin.com/in/jannatul-maowa',
    fullBio: 'She is also a Postdoctoral Fellow at the University of Lethbridge and holds a PhD in Theoretical and Computational Science, specializing in optimization algorithms for dynamic flow networks. Her current research focuses on power-system optimization, grid resilience, renewable-energy integration and machine-learning approaches to optimal power flow. With more than a decade of university teaching and research experience across Canada and Bangladesh, Dr. Maowa brings deep expertise in optimization, machine learning, computational modelling and data-driven problem-solving. Her interdisciplinary background enables her to connect rigorous scientific research with the design of practical solutions to complex societal and technological challenges.',
  },
  
];

function ProfileOverlay({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center bg-white/80 text-grey transition-colors hover:text-foreground"
          aria-label="Close profile"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col lg:flex-row">
          <div className="relative hidden w-56 flex-shrink-0 bg-grey-100 lg:block">
            <Image
              src={member.photo}
              alt={member.name}
              fill
              className="object-cover object-top"
              sizes="224px"
            />
          </div>
          <div className="flex-1 p-6 sm:p-8">
            <h3 className="text-h3">{member.name}</h3>
            <p className="mt-1 text-sm font-semibold text-primary">{member.role}</p>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-grey transition-colors hover:text-primary"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </div>

        <div className="border-t border-grey-200 p-6 sm:p-8">
          {member.fullBio.split('\n\n').map((paragraph, i) => (
            <p key={i} className="mb-4 text-sm leading-relaxed text-grey last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LeadershipGrid() {
  const [selected, setSelected] = useState<TeamMember | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 divide-x divide-y divide-grey-200 border border-grey-200 lg:grid-cols-2">
        {team.map((member) => (
          <button
            key={member.name}
            onClick={() => setSelected(member)}
            className="group p-5 text-left sm:p-6"
          >
            <div className="relative mx-auto mb-4 aspect-square w-28 overflow-hidden rounded-full bg-grey-100 sm:w-32">
              <Image
                src={member.photo}
                alt={member.name}
                fill
                className="object-cover object-top grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-105"
                sizes="128px"
              />
            </div>
            <h3 className="text-center text-[15px] font-semibold group-hover:text-primary">{member.name}</h3>
            {/* <p className="mt-0.5 text-center text-sm text-grey group-hover:text-primary">{member.role}</p> */}
          </button>
        ))}
      </div>

      {selected && (
        <ProfileOverlay member={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
