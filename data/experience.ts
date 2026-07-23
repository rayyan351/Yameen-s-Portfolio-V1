export interface ClientEngagement {
  name: string;
  url: string;
  scope: string[];
}

export interface CareerRole {
  role: string;
  organisation: string;
  dates: string;
  contribution?: string;
  indexCode?: string;
}

export interface ExperienceChapter {
  id: string;
  index: string;
  year: string;
  chapter: string;
  category: string;
  roles: CareerRole[];
  summary: string;
  achievements?: string[];
  capabilities: string[];
  ongoingStatus: boolean;
  highlightStat?: {
    value: string;
    label: string;
  };
  clientEngagements?: ClientEngagement[];
}

export const experienceData: ExperienceChapter[] = [
  {
    id: 'foundation',
    index: '01',
    year: '2020',
    chapter: 'Foundation',
    category: 'ROLE',
    roles: [
      {
        role: 'Customer Service Specialist',
        organisation: 'Youshiko LTD',
        dates: 'Jan 2020 – Present'
      }
    ],
    summary: 'Built a foundation in customer communication, commercial operations and data-informed decision-making.',
    achievements: [
      'Resolve more than 200 monthly customer enquiries',
      'Improved retention by approximately 15%',
      'Manage Amazon, eBay and Shopify datasets',
      'Use Python, Excel, Pandas and scikit-learn',
      'Present Power BI dashboards to guide strategy'
    ],
    capabilities: ['DATA ANALYSIS', 'CUSTOMER SERVICE', 'POWER BI', 'PYTHON', 'STATISTICS'],
    ongoingStatus: true
  },
  {
    id: 'community-development',
    index: '02',
    year: '2024',
    chapter: 'Community & Development',
    category: 'COMMUNITY',
    roles: [
      {
        role: 'CSI Ambassador',
        organisation: 'London South Bank University',
        dates: 'Jul 2024 – May 2026',
        contribution: 'Representing university initiatives, mentoring peers, and leading community-focused workshops.',
        indexCode: '02A'
      },
      {
        role: 'Mentee — Microsoft Embrace Program',
        organisation: 'Microsoft',
        dates: 'Oct 2024 – Dec 2024',
        contribution: 'Gained insights into engineering culture, ethical AI, and cloud technology stacks.',
        indexCode: '02B'
      },
      {
        role: 'Welfare Committee',
        organisation: 'London SouthHack',
        dates: 'Nov 2024 – Jun 2026',
        contribution: 'Fostered inclusive hackathon environments and supported student wellness initiatives.',
        indexCode: '02C'
      }
    ],
    summary: 'Fostering peer success and tech inclusion through leadership, mentoring, and community initiatives.',
    capabilities: ['WORKSHOP DEVELOPMENT', 'PUBLIC SPEAKING', 'MENTORING', 'COMMUNITY MANAGEMENT', 'TEAM COLLABORATION', 'ETHICAL AI'],
    ongoingStatus: false
  },
  {
    id: 'research-industry',
    index: '03',
    year: '2025',
    chapter: 'Research & Industry Exposure',
    category: 'RESEARCH',
    roles: [
      {
        role: 'Technology & Engineering Virtual Intern',
        organisation: 'IEUK — Bright Network',
        dates: 'Jul 2025',
        contribution: 'Industry workshops led by Google, Cisco, JLR and Lloyds on engineering practices.',
        indexCode: '03A'
      },
      {
        role: 'Student Researcher',
        organisation: 'London South Bank University',
        dates: 'Jul 2025 – Sep 2025',
        contribution: 'LRS2 multimodal speech and visual-alignment research; ERD audio, video, transcripts.',
        indexCode: '03B'
      },
      {
        role: 'Insight Day Participant',
        organisation: 'Mako Trading — Aleto Foundation Partnership',
        dates: 'Sep 2025',
        contribution: 'Exposure to fintech, trading systems, and graduate pathways.',
        indexCode: '03C'
      }
    ],
    summary: 'Deepening theoretical knowledge and industry understanding through active research and corporate exploration.',
    achievements: [
      'Industry workshops led by Google, Cisco, JLR and Lloyds',
      'AI applications, project management and problem-solving',
      'LRS2 multimodal speech and visual-alignment research',
      'Dataset, metadata and annotation analysis',
      'Entity-Relationship Diagram for audio, video and transcripts',
      'Exposure to fintech, trading systems and graduate pathways'
    ],
    capabilities: ['PYTHON', 'DATA SCIENCE', 'RESEARCH', 'AI LITERACY', 'FINTECH', 'TECHNICAL COMMUNICATION'],
    ongoingStatus: false
  },
  {
    id: 'production-engineering',
    index: '04',
    year: '2025',
    chapter: 'Production Engineering',
    category: 'PRODUCTION',
    roles: [
      {
        role: 'Full-Stack Software Engineer — Project-Based',
        organisation: 'Host Family Stay · Part-time',
        dates: 'Oct 2025 – Dec 2025'
      }
    ],
    summary: 'Built responsive and accessible React interfaces, integrated Supabase/PostgreSQL, and optimized queries.',
    achievements: [
      'Built responsive and accessible React interfaces',
      'Used Tailwind CSS',
      'Reduced page-load times by approximately 20%',
      'Integrated Supabase and PostgreSQL',
      'Optimised database queries',
      'Implemented secure authentication',
      'Delivered stakeholder requirements',
      'Used modular architecture and Git workflows'
    ],
    capabilities: ['REACT', 'TAILWIND', 'SUPABASE', 'POSTGRESQL', 'REST APIs', 'WCAG', 'GIT'],
    highlightStat: {
      value: '−20%',
      label: 'PAGE-LOAD TIME'
    },
    ongoingStatus: false
  },
  {
    id: 'freelance-practice',
    index: '05',
    year: '2026',
    chapter: 'Freelance Practice',
    category: 'PRACTICE',
    roles: [
      {
        role: 'Freelance Web Developer',
        organisation: 'London, UK · Remote',
        dates: 'Dec 2025 – Present'
      }
    ],
    summary: 'Delivering end-to-end web-development solutions for local businesses, from initial scoping through deployment and client handover.',
    capabilities: [
      'REACT',
      'NODE.JS',
      'WORDPRESS',
      'ELEMENTOR',
      'AI CHATBOT',
      'AUTOMATED PIPELINES',
      'TOAST API',
      'LOCAL SEO',
      'SCHEMA.ORG',
      'SECURITY',
      'RESPONSIVE DESIGN',
      'ACCESSIBILITY'
    ],
    ongoingStatus: true,
    clientEngagements: [
      {
        name: 'MKP London LTD',
        url: 'https://mkplondon.co.uk/',
        scope: [
          'Multi-branch Post Office website',
          'AI customer-service chatbot',
          'Automated Royal Mail, Evri and DPD pricing',
          'Local SEO',
          'Structured data',
          'Security hardening'
        ]
      },
      {
        name: 'Infinitum Education',
        url: 'https://www.infinitumeducation.com/',
        scope: [
          'Multi-page WordPress website',
          'International Foundation Programme landing page',
          'FAQ',
          'Online application',
          'Terms pages',
          'SEO copy',
          'Reusable Elementor components',
          'Multi-stakeholder delivery'
        ]
      },
      {
        name: 'Gup Shup Chit Chat Chai',
        url: 'https://gupshupchitchatchai.com/',
        scope: [
          'Nine-page React and Node.js website',
          'Toast POS',
          'Reservations and loyalty integrations',
          'Live opening status',
          'Local SEO and schema',
          'Responsive design',
          'Accessibility',
          'Instagram, gallery and Google Maps integration',
          'Hosting, domain and SSL setup'
        ]
      }
    ]
  }
];
