export interface NavItem {
  label: string;
  href: string;
  id: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Testimonials', href: '#testimonials', id: 'testimonials' },
  { label: 'Writing', href: '#writing', id: 'writing' },
  { label: 'Academic', href: '#academic', id: 'academic' },
];
