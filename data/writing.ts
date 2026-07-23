export interface WritingPost {
  id: string;
  categories: string[];
  title: string;
  highlightPhrase: string;
  summary: string;
  date: string;
  readingTime: string;
  linkedInUrl: string;
  articleUrl: string;
}

export const writingPosts: WritingPost[] = [
  {
    id: "post-1",
    categories: ["Award", "University"],
    title: "Awarded the Student Inclusivity Award at LSBU",
    highlightPhrase: "Student Inclusivity Award",
    summary: "Honoured to receive the School of Computer Science and Digital Technologies Award for Student Inclusivity, recognising three years of championing community and supporting peers.",
    date: "3 Feb 2026",
    readingTime: "2 min read",
    linkedInUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7427766478797709312/",
    articleUrl: "https://www.lsbu.ac.uk/stories/yameen-munir-computer-science-and-ai-student"
  },
  {
    id: "post-2",
    categories: ["Web Development", "Case Study", "Freelance"],
    title: "Building a Restaurant Website That Transformed a Local Business",
    highlightPhrase: "Website That Transformed",
    summary: "Discovering Gup Shup, an Indo-Pakistani restaurant with great food but no online presence, I built them a complete digital solution.",
    date: "9 Jan 2026",
    readingTime: "3 min read",
    linkedInUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7415461121396273152/",
    articleUrl: "https://www.lsbu.ac.uk/stories/how-one-student-used-ai-to-explore-the-future-of-jobs"
  },
  {
    id: "post-3",
    categories: ["Full Stack", "React", "Accessibility"],
    title: "A Full-Stack Homestay Exchange Platform, Built Ethically",
    highlightPhrase: "Built Ethically",
    summary: "Collaborated on a full-stack platform connecting international students with hosts — balancing implementation with accessibility, data protection and user trust.",
    date: "27 Dec 2025",
    readingTime: "4 min read",
    linkedInUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7408833104275992577/",
    articleUrl: "https://team-11-homestay-exchange-app.vercel.app/"
  }
];
