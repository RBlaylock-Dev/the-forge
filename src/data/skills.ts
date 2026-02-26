import type { SkillCategory } from '@/types';

export const SKILL_DATA: SkillCategory[] = [
  {
    name: 'Frontend',
    color: 0x44dd88,
    skills: [
      { name: 'React / Next.js', level: 5 },
      { name: 'TypeScript', level: 4 },
      { name: 'Three.js / R3F', level: 5 },
      { name: 'GLSL Shaders', level: 4 },
      { name: 'Vue.js', level: 4 },
      { name: 'Tailwind CSS', level: 5 },
      { name: 'HTML / CSS', level: 5 },
    ],
  },
  {
    name: 'Backend',
    color: 0x4488dd,
    skills: [
      { name: 'Node.js / Express', level: 4 },
      { name: 'PostgreSQL', level: 4 },
      { name: 'MongoDB', level: 3 },
      { name: 'Supabase', level: 4 },
      { name: 'REST APIs', level: 5 },
      { name: 'PHP', level: 3 },
    ],
  },
  {
    name: 'DevOps',
    color: 0xdd8844,
    skills: [
      { name: 'Docker', level: 4 },
      { name: 'Git / GitFlow', level: 5 },
      { name: 'CI/CD', level: 3 },
      { name: 'AWS', level: 3 },
      { name: 'Vercel', level: 4 },
      { name: 'Apache', level: 3 },
    ],
  },
];
