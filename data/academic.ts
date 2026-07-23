export interface EducationItem {
  id: string;
  year: string;
  degree: string;
  school: string;
  status: string;
}

export interface CredentialItem {
  id: string;
  shortName: string;
  provider: string;
  title: string;
  date: string;
}

export interface RecognitionItem {
  id: string;
  title: string;
  provider: string;
  description: string;
  date: string;
}

export const educationItems: EducationItem[] = [
  {
    id: "edu-1",
    year: "2023 – 2026",
    degree: "BSc (Hons) Computer Science — First Class",
    school: "London South Bank University",
    status: "Completed"
  },
  {
    id: "edu-2",
    year: "2020 – 2023",
    degree: "A Levels & GCSEs",
    school: "Brentwood Independent School",
    status: "Completed"
  },
  {
    id: "edu-3",
    year: "Aug 2024",
    degree: "Quantum Summer School",
    school: "UK Government",
    status: "Special Program"
  }
];

export const credentialItems: CredentialItem[] = [
  {
    id: "cred-1",
    shortName: "LSBU AWARDS",
    provider: "LSBU Group",
    title: "LSBU Group Education Awards 2026 – Shortlisted, Student of the Year",
    date: "Jun 2026"
  },
  {
    id: "cred-2",
    shortName: "CLAUDE",
    provider: "Anthropic",
    title: "Claude Code In Action",
    date: "Jun 2026"
  },
  {
    id: "cred-3",
    shortName: "INCLUSIVITY",
    provider: "London South Bank University",
    title: "Student Inclusivity Award",
    date: "Feb 2026"
  },
  {
    id: "cred-4",
    shortName: "FESTIVAL",
    provider: "Bright Network",
    title: "Bright Network FESTIVAL 2025",
    date: "Sep 2025"
  },
  {
    id: "cred-5",
    shortName: "LIFE SUPPORT",
    provider: "Caring for Care",
    title: "Basic Life Support Awareness Level 2",
    date: "Jul 2025"
  },
  {
    id: "cred-6",
    shortName: "INTERNSHIP",
    provider: "Bright Network",
    title: "Internship Experience UK (IEUK 2025)",
    date: "Jul 2025"
  },
  {
    id: "cred-7",
    shortName: "SANTANDER",
    provider: "Santander Open Academy",
    title: "Introduction to Generative AI",
    date: "May 2025"
  },
  {
    id: "cred-8",
    shortName: "MSFT EMBRACE",
    provider: "Microsoft",
    title: "Microsoft Embrace Program Certificate",
    date: "Dec 2024"
  },
  {
    id: "cred-9",
    shortName: "MSFT EMBRACE",
    provider: "Microsoft",
    title: "Microsoft Embrace Program",
    date: "Nov 2024"
  },
  {
    id: "cred-10",
    shortName: "EVOLVE!",
    provider: "SimVenture",
    title: "Evolve! 2024 Certificate of Achievement",
    date: "Nov 2024"
  },
  {
    id: "cred-11",
    shortName: "BA FORAGE",
    provider: "Forage",
    title: "British Airways — Data Science Job Simulation",
    date: "Sep 2024"
  },
  {
    id: "cred-12",
    shortName: "QUANTUM",
    provider: "Government Program",
    title: "UK Government Quantum Summer School",
    date: "Aug 2024"
  },
  {
    id: "cred-13",
    shortName: "LSBU BOOTCAMP",
    provider: "London South Bank University",
    title: "AI and Machine Learning Bootcamp",
    date: "Jul 2024"
  },
  {
    id: "cred-14",
    shortName: "POWER BI",
    provider: "LinkedIn",
    title: "Learning Power BI Desktop",
    date: "May 2024"
  },
  {
    id: "cred-15",
    shortName: "SQL",
    provider: "Sololearn",
    title: "Introduction to SQL",
    date: "May 2024"
  },
  {
    id: "cred-16",
    shortName: "GITHUB",
    provider: "LinkedIn",
    title: "Benefits of GitHub Community",
    date: "Apr 2024"
  }
];

export const recognitionItems: RecognitionItem[] = [
  {
    id: "rec-1",
    title: "LSBU Group Education Awards 2026 – Shortlisted, Student of the Year",
    provider: "LSBU Group",
    description: "Shortlisted for Student of the Year at the LSBU Group Education Awards 2026 — recognising outstanding academic achievement, community contribution and impact throughout my time at the university.",
    date: "Jun 2026"
  },
  {
    id: "rec-2",
    title: "Student Inclusivity Award",
    provider: "LSBU — School of Computer Science & Digital Technologies",
    description: "Awarded for championing inclusivity throughout my three years at LSBU — supporting peers, building community, and carrying these values into every project and collaboration.",
    date: "3 February 2026"
  }
];
