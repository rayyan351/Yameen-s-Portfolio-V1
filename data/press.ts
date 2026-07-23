export interface PressRecord {
  id: string;
  category: string;
  title: string;
  description: string;
  url: string;
}

export const pressRecords: PressRecord[] = [
  {
    id: "press-1",
    category: "Student Spotlight",
    title: "Yameen Munir — Computer Science and AI Student",
    description: "Student spotlight on my journey in Computer Science & AI at London South Bank University.",
    url: "https://www.linkedin.com/in/yameenmunir"
  },
  {
    id: "press-2",
    category: "Research Feature",
    title: "How One Student Used AI to Explore the Future of Jobs",
    description: "Featured for my dissertation research on AI and the future of work.",
    url: "https://www.linkedin.com/in/yameenmunir"
  }
];
