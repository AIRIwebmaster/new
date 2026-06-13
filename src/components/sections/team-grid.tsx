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
    name: 'Sidney Shapiro',
    role: 'Business Analytics',
    photo: '/images/team/sidney-shapiro.png',
    bio: 'Assistant Professor of Business Analytics at the Dhillon School of Business, University of Lethbridge. PhD in Multi/Interdisciplinary Studies.',
    linkedin: 'https://www.linkedin.com/in/sidneyshapiro/',
    fullBio: 'Sidney Shapiro is an Assistant Professor of Business Analytics at the Dhillon School of Business, University of Lethbridge, where he joined the faculty in 2023. He earned his PhD in Multi/Interdisciplinary Studies from Laurentian University, specializing in social network analytics. Prior to his academic appointment, he spent over a decade in data science leadership roles, including as a data science team manager in the occupational health and safety sector, where he led projects involving business intelligence, data engineering, machine learning, and automation.',
  },
  {
    name: 'Janelle Marietta',
    role: 'Research & Partnerships',
    photo: '/images/team/janelle-marietta.jpeg',
    bio: '15+ years guiding not-for-profit organizations across Canada. Doctoral researcher and instructor at University of Lethbridge.',
    linkedin: 'https://www.linkedin.com/in/janellemarietta/',
    fullBio: 'Janelle Marietta is a recognized leader with 15+ years of experience guiding not-for-profit organizations across Canada. She is an active researcher in the areas of social marketing, not-for-profit marketing/management, immigration settlement, and community-based participatory research.\n\nJanelle is also a doctoral researcher and instructor at the University of Lethbridge Dhillon Business School, where she teaches courses such as consumer behavior, social marketing, not-for-profit marketing, services marketing, and business research methods. She has served on many boards, supporting Local Immigration Partnerships, Economic Development, Community Social Development, and initiatives such as the Alberta Living Wage Network. She has a keen interest in how technology and innovation can support the not-for-profit sector in building stronger communities.',
  },
  {
    name: 'Osasu Imarhiagbe',
    role: 'AI & Technology',
    photo: '/images/team/osasu-imarhiagbe.jpg',
    bio: 'Computer Scientist and Machine Learning Engineer working at the intersection of AI in health and security.',
    linkedin: 'https://www.linkedin.com/in/osasumwen/',
    fullBio: "Osasu Imarhiagbe is a Computer Scientist, Machine Learning Engineer, and technology entrepreneur specializing in applied artificial intelligence, machine learning, and intelligent systems. His work focuses on developing responsible AI solutions for healthcare, public safety, and education, with expertise spanning multimodal AI, large language models, computer vision, and intelligent decision-support systems. Osasu holds an MSc in Computer Science from the University of Lethbridge, where his research advanced boundary-aware deep learning architectures and spatial-temporal transformer models for medical imaging and schizophrenia analysis. His work has been presented at international conferences and contributes to the growing field of trustworthy and human-centered artificial intelligence. \n\nBeyond academia, Osasu serves as the Founder and CEO of Xyricon Technologies Inc., a Canadian technology company focused on advancing innovative AI-driven solutions. His professional experience spans machine learning, software engineering, cloud-native systems, intelligent automation, and the deployment of production-scale AI applications. He has led multidisciplinary initiatives that bridge research and industry, translating emerging technologies into practical solutions with real-world impact. \n\nAs a member of AIRI Foundation's leadership team, Osasu brings a unique perspective shaped by research, entrepreneurship, and community engagement. He is passionate about advancing responsible AI adoption, expanding access to AI education, fostering innovation, and ensuring that emerging technologies are developed in ways that are ethical, inclusive, and beneficial to society.",
  },
  {
    name: 'Ignatius Ezeani',
    role: 'Advisor',
    photo: '/images/team/ignatius-ezeani.jpeg',
    bio: 'Research Fellow at Lancaster University. Former Visiting Researcher at Microsoft Research Africa.',
    linkedin: 'https://www.linkedin.com/in/ignatiusezeani/',
    fullBio: 'Ignatius Ezeani is a Research Fellow at the School of Computer Science, Lancaster University, and formerly a Visiting Researcher at Microsoft Research Africa. Ezeani’s work focuses on developing tools and methods to process and empower underrepresented languages through advanced AI techniques. His notable projects include the pioneering Igbo-English Machine Translation initiative, which has set new benchmarks in the evaluation and accessibility of African language resources.\n\nThroughout his career, Dr. Ezeani has passionately promoted diversity and inclusion in the technology sector and regularly collaborates with cross-disciplinary teams driving innovation in machine learning, language technology, and spatial humanities, ensuring that resource-scarce communities have access to cutting-edge AI advancements. Through his technical advisement and mentoring, Dr. Ezeani inspires new generations of researchers and is actively engaged in global AI communities through Deep Learning Indaba, Masakhane, and Black in AI, championing African and underrepresented voices in the future of AI.',
  },
  {
    name: 'Gurpreet Singh',
    role: 'ML & Ethics Lead',
    photo: '/images/team/gurpreet-singh.jpg',
    bio: 'Machine learning expert focused on ethical AI challenges. Director at Oxford Learning Lethbridge.',
    linkedin: 'https://www.linkedin.com/in/gursainipreet/',
    fullBio: 'Gurpreet Singh is a machine learning expert whose work focuses on the critical ethical challenges of modern artificial intelligence and its domain applications. He advocates for frameworks that prioritize transparency, fairness, and accountability, urging a shift from a focus on mere innovation to a deep consideration of AI’s societal impact. A key component of his approach is advancing AI literacy, empowering individuals and communities with the knowledge to critically engage with the technologies that shape their lives.\n\nBeyond academia, Gurpreet is a results-driven leader who has made a significant impact through his roles as Director at Oxford Learning Lethbridge and active member of the Alberta Anti Racism Advisory Council, where he champions equity, diversity, and inclusion in both business and community settings. He is deeply committed to addressing the use of personal data and AI in healthcare and the risks of algorithmic bias to minority, at-risk, and underrepresented communities.',
  },
  {
    name: 'James Yékú',
    role: 'Advisor',
    photo: '/images/team/james-yeku.jpg',
    bio: 'Associate professor at the University of Kansas. Author and researcher in postcolonial digital humanities and African literature.',
    linkedin: 'https://www.linkedin.com/in/james-ye%CC%81ku%CC%81-aa44b421a',
    fullBio: 'James Yékú holds a PhD in English from the University of Saskatchewan and is an associate professor at the University of Kansas, where he teaches courses in postcolonial digital humanities and African literature. He is the author of the monographs The Algorithmic Age of Personality: African Literature and Cancel Culture and Cultural Netizenship: Social Media, Popular Culture, and Performance in Nigeria, as well as two poetry books and a nonfiction collection.\n\nHe is a joint winner of the Pius Adesanmi Early Career Research Excellence Award of the Canadian African Studies Association and a recipient of the Alexander von Humboldt fellowship. James lives in Lawrence, Kansas.',
  },
  {
    name: 'Presley Ifukor',
    role: 'Advisor',
    photo: '/images/team/presley-ifukor.jpg',
    bio: 'Chair and Research Director at the Alberta Centre for Emerging Democracies. Expert in AI, computational linguistics, and professional training.',
    linkedin: 'https://ca.linkedin.com/in/presley-ifukor-44a52a22a',
    fullBio: 'Presley Ifukor is Chair and Research Director at the Alberta Centre for Emerging Democracies. He brings substantial leadership, research, and consulting experience, with deep technical expertise in artificial intelligence, professional training, and computational linguistics.\n\nA German Academic Exchange Service (DAAD) alumnus, Dr. Ifukor earned graduate degrees in Cognitive Science and linguistics, focusing on AI-driven projects such as computing analogies, knowledge representation, and intelligent tutoring systems in mathematics. He has also served as a Visiting Scholar at Rutgers University and Boston University in the USA.',
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

export function TeamGrid() {
  const [selected, setSelected] = useState<TeamMember | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 divide-x divide-y divide-grey-200 border border-grey-200 lg:grid-cols-4">
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
