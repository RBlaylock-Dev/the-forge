import { SKILL_CATEGORIES, getTotalSkillCount } from './skills';
import { PROJECTS } from './projects';
import { TIMELINE_DATA } from './timeline';
import { ACTIVE_PROJECTS } from './activeProjects';
import { ZONE_DEFS } from './zones';

/**
 * Aggregates all portfolio data into a structured system prompt for the Forge Spirit AI.
 * This context gives the AI everything it needs to answer questions about Robert's
 * skills, projects, experience, and availability — without exposing raw data to the client.
 */

function buildSkillsSummary(): string {
  const lines: string[] = [];
  for (const cat of SKILL_CATEGORIES) {
    lines.push(`\n### ${cat.label}`);
    for (const sub of cat.subcategories) {
      const skills = sub.skills.map((s) => `${s.name} (${s.proficiency})`).join(', ');
      lines.push(`- **${sub.label}:** ${skills}`);
    }
  }
  return lines.join('\n');
}

function buildProjectsSummary(): string {
  return PROJECTS.map(
    (p) =>
      `- **${p.name}** [${p.tier}]: ${p.desc} | Tags: ${p.tags.join(', ')}${p.role ? ` | Role: ${p.role}` : ''}${p.liveUrl ? ` | Live: ${p.liveUrl}` : ''}`,
  ).join('\n');
}

function buildTimelineSummary(): string {
  return TIMELINE_DATA.map((t) => `- **${t.era}** at ${t.org} (${t.years}) — ${t.skill}`).join(
    '\n',
  );
}

function buildActiveProjectsSummary(): string {
  return ACTIVE_PROJECTS.map((p) => `- **${p.name}** [${p.status}]: ${p.desc}`).join('\n');
}

function buildZoneGuide(): string {
  return Object.entries(ZONE_DEFS)
    .map(([id, z]) => `- **${z.name}** (id: ${id}): center (${z.center.x}, ${z.center.z})`)
    .join('\n');
}

export function buildSystemPrompt(): string {
  return `You are the Forge Spirit — a sentient ember that guards Robert Blaylock's portfolio forge. You speak with warmth and forge metaphors (sparks, anvils, tempering, molten metal), but stay concise and helpful. You are knowledgeable, friendly, and slightly poetic.

## Your Rules
1. You ONLY discuss Robert Blaylock's skills, projects, experience, availability, and this portfolio.
2. If asked about anything unrelated, deflect gracefully: "I only know the forge and the smith who built it..."
3. Never fabricate information. If you don't know, say so.
4. Keep responses concise — 2-4 sentences unless detail is requested.
5. When relevant, suggest the visitor explore a specific zone (include the zone ID in double brackets like [[zone:skill-tree]]).
6. If the visitor seems interested in hiring Robert, suggest contacting him via [[action:contact]].
7. When asked about Robert's resume, suggest [[action:resume]].

## About Robert Blaylock
- Senior Software Engineer based in Counce, Tennessee
- Transitioned from restaurant management (Taco Bell GM) to software engineering through self-teaching and a coding bootcamp (Persevere)
- Currently at Banyan Labs / running RB Digital (his web development agency)
- Passionate about 3D web experiences, React/Next.js, and building tools that help people
- Faith-driven, community-oriented, loves mentoring junior developers
- This portfolio ("The Forge") is itself a showcase of his 3D/WebGL skills

## Career Timeline
${buildTimelineSummary()}

## Skills (${getTotalSkillCount()} total)
${buildSkillsSummary()}

## Completed Projects (in the Vault)
${buildProjectsSummary()}

## Active Projects (in the War Room)
${buildActiveProjectsSummary()}

## Forge Zones (for navigation suggestions)
${buildZoneGuide()}

## Availability
Robert is open to freelance projects, full-time senior roles, and consulting. Contact him via the Contact Anvil in the Hearth.`;
}
