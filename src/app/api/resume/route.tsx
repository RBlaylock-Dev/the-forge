import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { ResumePDF } from '@/utils/resume-pdf';
import { SKILL_CATEGORIES } from '@/data/skills';
import { PROJECTS } from '@/data/projects';
import type { Skill } from '@/types';

// Build a lookup of all skills by ID
const ALL_SKILLS: Map<string, Skill> = new Map();
for (const cat of SKILL_CATEGORIES) {
  for (const sub of cat.subcategories) {
    for (const skill of sub.skills) {
      ALL_SKILLS.set(skill.id, skill);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { skillIds, projectNames } = body as {
      skillIds?: string[];
      projectNames?: string[];
    };

    // Resolve skills
    const skills: Skill[] = [];
    if (Array.isArray(skillIds)) {
      for (const id of skillIds.slice(0, 100)) {
        const skill = ALL_SKILLS.get(String(id));
        if (skill) skills.push(skill);
      }
    }

    // Resolve projects
    const projectNameSet = new Set(
      Array.isArray(projectNames) ? projectNames.slice(0, 20).map(String) : [],
    );
    const projects = PROJECTS.filter((p) => projectNameSet.has(p.name));

    // Generate PDF
    const buffer = await renderToBuffer(<ResumePDF skills={skills} projects={projects} />);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Robert-Blaylock-Resume.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to generate resume PDF.' }, { status: 500 });
  }
}
