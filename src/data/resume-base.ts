/**
 * Base resume data for the Interactive Resume Builder.
 * This data supplements the skills/projects/timeline data files
 * with resume-specific info (header, education, summary).
 */

export const RESUME_HEADER = {
  name: 'Robert Blaylock',
  title: 'Senior Software Engineer',
  email: 'robert@rblaylock.dev',
  website: 'rblaylock.dev',
  location: 'Counce, Tennessee',
};

export const RESUME_SUMMARY =
  'Senior Software Engineer specializing in full-stack web development, 3D web experiences, and React/Next.js applications. Transitioned from restaurant operations leadership into software engineering, bringing a unique blend of technical depth and team leadership. Passionate about building tools that help people, mentoring developers, and pushing the boundaries of what the web can do.';

export const RESUME_EDUCATION = [
  {
    institution: 'Persevere',
    credential: 'Full Stack Web Development Certificate',
    years: '2021–2022',
    description:
      'Intensive coding bootcamp covering JavaScript, React, Node.js, databases, and deployment.',
  },
];

export type ResumeCategory = 'frontend' | 'backend' | '3d' | 'fullstack' | 'leadership';

export const RESUME_CATEGORIES: { id: ResumeCategory; label: string; description: string }[] = [
  {
    id: 'frontend',
    label: 'Frontend Development',
    description: 'React, Next.js, Vue, Tailwind, accessibility',
  },
  {
    id: 'backend',
    label: 'Backend Development',
    description: 'Node.js, APIs, databases, authentication',
  },
  { id: '3d', label: '3D & WebGL', description: 'Three.js, R3F, GLSL shaders, interactive 3D' },
  { id: 'fullstack', label: 'Full Stack', description: 'End-to-end application development' },
  {
    id: 'leadership',
    label: 'Leadership & Strategy',
    description: 'Team leadership, project management, mentoring',
  },
];

/** Maps resume categories to skill category IDs for filtering */
export const CATEGORY_TO_SKILLS: Record<ResumeCategory, string[]> = {
  frontend: ['frontend'],
  backend: ['backend'],
  '3d': ['frontend'], // 3D skills are under frontend category
  fullstack: ['frontend', 'backend', 'devops'],
  leadership: ['strategic', 'workspace'],
};
