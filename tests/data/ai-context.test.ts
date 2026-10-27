import { buildSystemPrompt } from '@/data/ai-context';
import { PROJECTS } from '@/data/projects';
import { ACTIVE_PROJECTS } from '@/data/activeProjects';
import { TIMELINE_DATA } from '@/data/timeline';
import { ZONE_DEFS } from '@/data/zones';
import { getTotalSkillCount } from '@/data/skills';

describe('buildSystemPrompt', () => {
  const prompt = buildSystemPrompt();

  it('includes the forge persona and on-topic rules', () => {
    expect(prompt).toContain('You are the Forge Spirit');
    expect(prompt).toContain('I only know about the smith who built this forge');
  });

  it('includes every completed and active project', () => {
    for (const p of PROJECTS) expect(prompt).toContain(p.name);
    for (const p of ACTIVE_PROJECTS) expect(prompt).toContain(p.name);
  });

  it('includes the career timeline', () => {
    for (const t of TIMELINE_DATA) expect(prompt).toContain(t.org);
  });

  it('includes the skill count and every zone id for navigation', () => {
    expect(prompt).toContain(`Skills (${getTotalSkillCount()} total)`);
    for (const id of Object.keys(ZONE_DEFS)) expect(prompt).toContain(`id: ${id}`);
  });

  it('documents the action tokens the chat panel understands', () => {
    expect(prompt).toContain('[[action:contact]]');
    expect(prompt).toContain('[[action:resume]]');
    expect(prompt).toContain('[[zone:');
  });

  it('is deterministic so it can be prompt-cached', () => {
    expect(buildSystemPrompt()).toBe(prompt);
  });
});
