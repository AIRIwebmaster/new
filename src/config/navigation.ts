export interface NavItem {
  title: string;
  key: string;
  href: string;
  description?: string;
  descriptionKey?: string;
  disabled?: boolean;
  external?: boolean;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  { title: 'Home', key: 'home', href: '/' },
  {
    title: 'About',
    key: 'about',
    href: '/about',
    children: [
      {
        title: 'About AIRI',
        key: 'aboutAiri',
        href: '/about',
        description: 'What makes AIRI unique',
        descriptionKey: 'aboutAiriDesc',
      },
      {
        title: 'Leadership',
        key: 'leadership',
        href: '/about#leadership',
        description: 'Meet the Team Behind AIRI',
        descriptionKey: 'leadershipDesc',
      },
      {
        title: 'Our Impact',
        key: 'ourImpact',
        href: '/about#impact',
        description: 'Our Impact in the Community',
        descriptionKey: 'ourImpactDesc',
      },
      {
        title: 'Insights',
        key: 'insights',
        href: '/insights',
        description: 'News, updates and stories',
        descriptionKey: 'insightsDesc',
      },
    ],
  },
  {
    title: 'Programs',
    key: 'programs',
    href: '/programs',
    children: [
      {
        title: 'AI for Professionals',
        key: 'forProfessionals',
        href: '/programs/professionals',
        description: 'Workshops & AI Solutions for Organizations',
        descriptionKey: 'forProfessionalsDesc',
      },
      {
        title: 'Code & AI Club',
        key: 'codeAiClub',
        href: '/programs/code-ai-club',
        description: 'Youth coding program for Grades 6–9',
        descriptionKey: 'codeAiClubDesc',
      },
      {
        title: 'AI for New Canadians',
        key: 'forNewCanadians',
        href: '/programs/new-canadians',
        description: 'Civic and cultural AI literacy',
        descriptionKey: 'forNewCanadiansDesc',
      },
      {
        title: 'AI for Seniors',
        key: 'forSeniors',
        href: '/programs/seniors',
        description: 'Accessible AI education for seniors',
        descriptionKey: 'forSeniorsDesc',
      },
    ],
  },
  {
    title: 'Solutions',
    key: 'solutions',
    href: '/solutions',
    children: [
      {
        title: 'Operational Intelligence',
        key: 'operationalIntelligence',
        href: '/solutions#operational',
        description: 'Custom AI & automation for businesses',
        descriptionKey: 'operationalIntelligenceDesc',
      },
      {
        title: 'Civic & Cultural AI Literacy',
        key: 'civicAiLiteracy',
        href: '/solutions#civic',
        description: 'Community AI education programs',
        descriptionKey: 'civicAiLiteracyDesc',
      },
      {
        title: 'Applied R&D',
        key: 'appliedRd',
        href: '/solutions#research',
        description: 'Implementation-ready AI systems',
        descriptionKey: 'appliedRdDesc',
      },
    ],
  },
  { title: 'Volunteer', key: 'volunteer', href: '/volunteer' },
  { title: 'Careers', key: 'careers', href: '/career' },
  { title: 'Contact', key: 'contact', href: '/contact' },
];

export const footerNav = {
  quickLinks: [
    { title: 'Home', key: 'home', href: '/' },
    { title: 'Programs', key: 'programs', href: '/programs' },
    { title: 'About Us', key: 'about', href: '/about' },
    { title: 'Contact', key: 'contact', href: '/contact' },
  ],
  opportunities: [
    { title: 'Volunteer & Internship', key: 'volunteerInternship', href: '/volunteer' },
    { title: 'Careers', key: 'careers', href: '/career' },
    { title: 'Code & AI Club', key: 'codeAiClub', href: '/register-codeaiclub' },
  ],
  programs: [
    { title: 'AI for Professionals', key: 'forProfessionals', href: '/programs/professionals' },
    { title: 'Code & AI Club', key: 'codeAiClub', href: '/programs/code-ai-club' },
    { title: 'AI for New Canadians', key: 'forNewCanadians', href: '/programs/new-canadians' },
    { title: 'AI for Seniors', key: 'forSeniors', href: '/programs/seniors' },
  ],
};
