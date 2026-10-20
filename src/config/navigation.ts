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
    ],
  },
  {
    title: 'Programs',
    key: 'programs',
    href: '/programs',
    children: [
      {
        title: 'AI Literacy Online',
        key: 'aiLiteracy',
        href: '/programs#ai-literacy',
        children: [
          { title: 'AI with Seniors', key: 'forSeniors', href: '/programs/seniors' },
          { title: 'Code & AI Club', key: 'codeAiClub', href: '/programs/code-ai-club' },
        ],
      },
      { title: 'Responsible Adoption', key: 'responsibleAdoption', href: '/programs#responsible-adoption' },
      { title: 'Technical Implementation', key: 'technicalImplementation', href: '/programs#technical-implementation' },
    ]
  },
  {
    title: 'Opportunities',
    key: 'opportunities',
    href: '#',
    children: [
      {
        title: 'Volunteer/Internship',
        key: 'volunteer',
        href: '/volunteer',
        // description: 'Custom AI & automation for businesses',
        // descriptionKey: 'operationalIntelligenceDesc',
      },
      {
        title: 'Careers',
        key: 'careers',
        href: '/career',
        // description: 'Custom AI & automation for businesses',
        // descriptionKey: 'operationalIntelligenceDesc',
      },
      
    ],
  },
  // { title: 'Volunteer', key: 'volunteer', href: '/volunteer' },
  // { title: 'Careers', key: 'careers', href: '/career' },
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
    // { title: 'Code & AI Club', key: 'codeAiClub', href: '/register-codeaiclub' },
  ],
  programs: [
    { title: 'AI Literacy Online', key: 'aiLiteracy', href: '/programs#ai-literacy' },
    { title: 'Responsible Adoption', key: 'responsibleAdoption', href: '/programs#responsible-adoption' },
    { title: 'Technical Implementation', key: 'technicalImplementation', href: '/programs#technical-implementation' },
  ],
};
