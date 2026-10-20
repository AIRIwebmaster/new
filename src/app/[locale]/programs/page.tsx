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
      id: 'ai-literacy', title: 'Littératie en IA en ligne',
      intro: 'Aider les personnes et les organisations à comprendre l’IA.',
      paragraphs: [
        'AIRI rend l’IA compréhensible grâce à un apprentissage accessible, ancré dans la vie quotidienne. Nous aidons les gens à explorer le fonctionnement de l’IA et ce qu’elle peut accomplir.',
        'Nos programmes accueillent des personnes de différents horizons et niveaux d’expérience. Grâce à des activités guidées et à des discussions, elles développent les connaissances nécessaires pour poser des questions éclairées et reconnaître l’influence de l’IA sur leur vie.'
      ],
      focusTitle: 'Ce que nous faisons',
      points: [
        ['Expliquer les bases', 'Aider les participants à comprendre l’IA et à reconnaître où ils la rencontrent déjà.'],
        ['Offrir un apprentissage pratique', 'Utiliser des activités guidées pour explorer les outils d’IA et leurs applications.'],
        ['Développer la compréhension', 'Apprendre à remettre en question les réponses de l’IA et à reconnaître les erreurs, les biais et les contenus trompeurs.'],
        ['Relier l’IA à la vie quotidienne', 'Explorer son influence sur le travail, l’apprentissage et l’accès à l’information.']
      ]
    },
    {
      id: 'responsible-adoption', title: 'Adoption responsable',
      intro: 'Aider les Canadiens à utiliser l’IA de manière responsable, sûre et efficace.',
      paragraphs: [
        'L’adoption de l’IA commence par comprendre où elle peut être utile et ce que son utilisation exige. AIRI aide les particuliers, les entreprises et les organisations, y compris les organismes sans but lucratif, à faire des choix éclairés et à utiliser l’IA avec confiance.',
        'Nous aidons les gens à évaluer leur préparation, à choisir les outils appropriés et à établir des pratiques claires. Notre approche relie les besoins quotidiens à la compréhension des capacités, des limites et des risques de l’IA.'
      ],
      focusTitle: 'Ce que nous faisons',
      points: [
        ['Évaluer la préparation', 'Repérer les utilisations pertinentes de l’IA ainsi que les compétences, ressources et mesures de protection nécessaires.'],
        ['Guider le choix des outils', 'Évaluer les outils d’IA selon les besoins, notamment l’accessibilité, la confidentialité et le coût.'],
        ['Établir des pratiques responsables', 'Élaborer des consignes pour protéger les renseignements, vérifier les réponses de l’IA et maintenir une supervision humaine.'],
        ['Soutenir l’utilisation quotidienne', 'Aider les équipes à intégrer l’IA au travail avec des attentes claires quant à son utilisation.'],
        ['Renforcer la confiance', 'Offrir une formation pratique pour reconnaître les limites de l’IA et déterminer quand son utilisation convient.']
      ]
    },
    {
      id: 'technical-implementation', title: 'Mise en œuvre technique',
      intro: 'AIRI travaille avec les communautés et les organisations pour comprendre leurs besoins et créer des solutions d’IA qui y répondent.',
      paragraphs: [
        'Notre travail commence par la compréhension des personnes qui utiliseront la solution et du contexte dans lequel elle fonctionnera. Nous évaluons où l’IA peut apporter une valeur ajoutée, puis concevons et mettons en œuvre des outils adaptés aux flux de travail existants et aux ressources disponibles.'
      ],
      focusTitle: 'Nos priorités',
      points: [
        ['Solutions d’IA personnalisées', 'Développer des outils répondant aux besoins précis des communautés et des organisations.'],
        ['Intégration aux flux de travail', 'Intégrer l’IA aux opérations quotidiennes pour réduire les tâches répétitives et améliorer l’accès à l’information.'],
        ['Conception inclusive', 'Rendre les solutions accessibles aux personnes ayant différentes capacités et expériences techniques.'],
        ['Mise en œuvre responsable', 'Intégrer la protection de la vie privée et la responsabilité dans la conception et l’utilisation des solutions.']
      ]
    }
  ] : [
    {
      id: 'ai-literacy', title: 'AI Literacy Online',
      intro: 'Helping people and organizations understand AI.',
      paragraphs: [
        'AIRI makes AI understandable through accessible learning grounded in everyday life. We help people explore how AI works and what it can do.',
        'Our programs welcome learners with different backgrounds and levels of experience. Through guided activities and discussion, participants build the knowledge to ask informed questions and recognize how AI affects their lives.'
      ],
      focusTitle: 'What We Do',
      points: [
        ['Explain the basics', 'Help learners understand AI and recognize where they already encounter it.'],
        ['Provide hands-on learning', 'Use guided activities to explore AI tools and their applications.'],
        ['Develop understanding', 'Teach participants to question AI outputs and recognize errors, bias, and misleading content.'],
        ['Connect AI to everyday life', 'Explore its influence on work, learning, and access to information.']
      ]
    },
    {
      id: 'responsible-adoption', title: 'Responsible Adoption',
      intro: 'Helping Canadians use AI responsibly, safely, and effectively.',
      paragraphs: [
        'AI adoption begins with understanding where it can help and what its use requires. AIRI supports individuals, businesses, and organizations—including non-profits—to make informed choices about AI and use it with confidence.',
        'We help people assess their readiness, choose appropriate tools, and establish clear practices for their use. Our approach connects everyday needs with an understanding of AI’s capabilities, limitations, and risks.'
      ],
      focusTitle: 'What We Do',
      points: [
        ['Assess readiness', 'Identify relevant uses for AI and the skills, resources, and safeguards needed to support adoption.'],
        ['Guide tool selection', 'Help people evaluate AI tools against their needs, including accessibility, privacy, and cost.'],
        ['Establish responsible practices', 'Develop guidance for protecting information, checking AI outputs, and maintaining human oversight.'],
        ['Support everyday use', 'Help teams introduce AI into their work with clear expectations for when and how to use it.'],
        ['Build confidence', 'Deliver hands-on training that helps people recognize AI’s limitations and judge when its use is appropriate.']
      ]
    },
    {
      id: 'technical-implementation', title: 'Technical Implementation',
      intro: 'AIRI works with communities and organizations to understand their needs and build AI solutions that address them.',
      paragraphs: [
        'Our work begins with understanding the people who will use a solution and the setting in which it will operate. We assess where AI can provide value, then design and implement tools that fit existing workflows and available resources.'
      ],
      focusTitle: 'Our Focus',
      points: [
        ['Custom AI solutions', 'Developing tools that address specific community and organizational needs.'],
        ['Workflow integration', 'Incorporating AI into everyday operations to reduce repetitive work and improve access to information.'],
        ['Inclusive design', 'Making solutions accessible to people with different abilities and levels of technical experience.'],
        ['Responsible implementation', 'Building privacy and accountability into how solutions are developed and used.']
      ]
    }
  ];
  return (
    <>
      <PageHero title={fr ? 'Nos programmes' : 'Our Programs'} subtitle={fr ? 'Promouvoir la littératie en IA et son adoption responsable grâce à des programmes fondés sur des données probantes et à une mise en œuvre technique guidée par les besoins des communautés.' : 'Advancing AI literacy and responsible adoption through evidence-informed programs and technical implementation guided by community needs.'} breadcrumbs={[{ label: fr ? 'Accueil' : 'Home', href: '/' }, { label: fr ? 'Programmes' : 'Programs' }]} />
      {areas.map((area, index) => (
        <section key={area.id} id={area.id} className={`scroll-mt-20 border-t border-grey-200 ${index % 2 ? 'bg-grey-50' : 'bg-white'}`}>
          <div className="container py-16 md:py-24">
            <h2 className="mb-4 text-h2">{area.title}</h2>
            <p className="mb-5 text-h4">{area.intro}</p>
            <div className="max-w-3xl space-y-4 text-body text-grey">{area.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            <h3 className="mb-5 mt-10 text-h4">{area.focusTitle}</h3>
            <ul className="grid max-w-4xl gap-4 md:grid-cols-2">
              {area.points.map(([label, description]) => <li key={label} className="flex gap-3 text-sm text-grey"><span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" /><span><strong className="text-foreground">{label}:</strong> {description}</span></li>)}
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
