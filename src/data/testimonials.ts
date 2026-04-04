export type TestimonialRelationship = 'colleague' | 'client' | 'mentor' | 'mentee' | 'collaborator';

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  relationship: TestimonialRelationship;
  linkedinUrl?: string;
  projectId?: string;
}

// Add real testimonials here. The Wall of Voices will render automatically
// once entries are added. Each needs: id, quote, author, role, company, relationship.
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'testimonial-1',
    quote:
      "I've had the opportunity to learn from Robert Blaylock, and I truly appreciate how he thinks about building applications — practical, thoughtful, and focused on real impact.",
    author: 'Megan Williams',
    role: 'Junior Developer',
    company: 'Banyan Labs',
    relationship: 'mentee',
  },
];
