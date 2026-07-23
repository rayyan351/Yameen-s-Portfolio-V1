export interface SkillCategory {
  category: string;
  items: string[];
}

export const skills: SkillCategory[] = [
  {
    category: 'Core AI & Data Science',
    items: ['PyTorch', 'TensorFlow', 'Python (NumPy, Pandas)', 'Scikit-Learn', 'Deep Learning', 'Computer Vision'],
  },
  {
    category: 'Full-Stack Web Development',
    items: ['TypeScript', 'Next.js', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
  },
  {
    category: 'Creative Technology & Motion',
    items: ['GSAP', 'Lenis (Smooth Scroll)', 'Three.js / WebGL', 'Tailwind CSS', 'Figma', 'Semantic UI design'],
  },
];
