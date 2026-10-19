import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHero } from '@/components/sections/page-hero';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Programs',
  description: 'Advancing AI literacy and responsible adoption through evidence-informed programs and technical implementation guided by community needs.',
};

export default async function ProgramsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale === 'fr';

  const areas = fr ? [
    {
      id: 'ai-literacy', title: 'Littératie en IA',
      intro: 'Aider les personnes et les organisations à comprendre l’intelligence artificielle.',
      text: 'AIRI rend l’IA compréhensible grâce à un apprentissage accessible, ancré dans la vie quotidienne. Les participants explorent le fonctionnement de l’IA, ses possibilités, ses erreurs et ses limites.',
      points: ['Expliquer les bases de l’IA', 'Offrir des activités pratiques', 'Reconnaître les erreurs, les biais et les contenus trompeurs', 'Relier l’IA à la vie quotidienne'],
    },
    {
      id: 'responsible-adoption', title: 'Adoption responsable',
      intro: 'Aider les Canadiens à utiliser l’IA de façon responsable, sécuritaire et efficace.',
      text: 'Nous aidons les personnes, les entreprises et les organismes à évaluer leurs besoins et leur préparation, à choisir les outils appropriés et à établir des pratiques claires.',
      points: ['Évaluer la préparation', 'Guider le choix des outils', 'Établir des pratiques responsables', 'Soutenir l’utilisation quotidienne', 'Renforcer la confiance'],
    },
    {
      id: 'technical-implementation', title: 'Mise en œuvre technique',
      intro: 'Créer des solutions d’IA adaptées aux besoins des communautés et des organisations.',
      text: 'Nous commençons par comprendre les personnes qui utiliseront la solution et le contexte dans lequel elle fonctionnera, puis nous concevons et mettons en œuvre les outils adaptés.',
      points: ['Solutions d’IA personnalisées', 'Intégration aux flux de travail', 'Conception inclusive', 'Protection des données et responsabilité'],
    },
  ] : [
    {
      id: 'ai-literacy', title: 'AI Literacy',
      intro: 'Helping people and organizations understand AI.',
      text: 'AIRI makes AI understandable through accessible learning grounded in everyday life. Our programs welcome learners with different backgrounds and levels of experience, building the knowledge to ask informed questions and recognize how AI affects their lives.',
      points: ['Explain the basics of AI', 'Provide hands-on learning', 'Recognize errors, bias, and misleading content', 'Connect AI to everyday life'],
    },
    {
      id: 'responsible-adoption', title: 'Responsible Adoption',
      intro: 'Helping Canadians use AI responsibly, safely, and effectively.',
      text: 'AIRI supports individuals, businesses, and organizations, including non-profits, to assess their readiness, choose appropriate tools, and establish responsible practices with a clear understanding of AI capabilities, limitations, and risks.',
      points: ['Assess readiness', 'Guide tool selection', 'Establish responsible practices', 'Support everyday use', 'Build confidence'],
    },
    {
      id: 'technical-implementation', title: 'Technical Implementation',
      intro: 'Building AI solutions shaped by community and organizational needs.',
      text: 'We begin by understanding the people who will use a solution and the setting in which it will operate. We assess where AI can provide value, then design and implement tools that fit existing workflows and available resources.',
      points: ['Custom AI solutions', 'Workflow integration', 'Inclusive design', 'Responsible implementation with privacy and accountability'],
    },
  ];
  return (
    <>
      <PageHero title={fr ? 'Nos programmes' : 'Our Programs'} subtitle={fr ? 'Promouvoir la littératie en IA et son adoption responsable grâce à des programmes fondés sur des données probantes et à une mise en œuvre technique guidée par les besoins des communautés.' : 'Advancing AI literacy and responsible adoption through evidence-informed programs and technical implementation guided by community needs.'} breadcrumbs={[{ label: fr ? 'Accueil' : 'Home', href: '/' }, { label: fr ? 'Programmes' : 'Programs' }]} />
      {areas.map((area, index) => (
        <section key={area.id} id={area.id} className={`scroll-mt-20 border-t border-grey-200 ${index % 2 ? 'bg-grey-50' : 'bg-white'}`}>
          <div className="container py-16 md:py-24">
            <h2 className="mb-4 text-h2">{area.title}</h2>
            <p className="mb-5 text-h4">{area.intro}</p>
            <p className="max-w-3xl text-body text-grey">{area.text}</p>
            <h3 className="mb-5 mt-10 text-h4">{fr ? 'Ce que nous faisons' : 'What We Do'}</h3>
            <ul className="grid max-w-4xl gap-4 md:grid-cols-2">
              {area.points.map((point) => <li key={point} className="flex gap-3 text-sm text-grey"><span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />{point}</li>)}
            </ul>
            {index === 0 && <div className="mt-12">
              <h3 className="mb-5 text-h4">{fr ? 'Programmes actuels' : 'Current Programs'}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Link href="/programs/seniors" className="group border border-grey-200 bg-white p-6 transition-colors hover:border-primary"><h4 className="mb-2 text-h4">{fr ? 'L’IA avec les aînés' : 'AI with Seniors'}</h4><p className="text-sm text-grey">{fr ? 'Aider les personnes âgées à comprendre l’IA grâce à des activités guidées adaptées à leur vie quotidienne.' : 'Helping older adults understand AI through guided learning and activities relevant to their everyday lives.'}</p><ArrowRight className="mt-4 h-5 w-5 text-primary" /></Link>
                <Link href="/programs/code-ai-club" className="group border border-grey-200 bg-white p-6 transition-colors hover:border-primary"><h4 className="mb-2 text-h4">{fr ? 'Club Code & IA' : 'Code & AI Club'}</h4><p className="text-sm text-grey">{fr ? 'Initier les jeunes au codage et à l’IA grâce à des projets créatifs.' : 'Introducing young learners to coding and AI through creative projects and hands-on exploration.'}</p><ArrowRight className="mt-4 h-5 w-5 text-primary" /></Link>
              </div>
            </div>}
          </div>
        </section>
      ))}
    </>
  );
}
