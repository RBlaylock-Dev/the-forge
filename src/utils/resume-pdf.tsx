import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { Skill, Project } from '@/types';
import { TIMELINE_DATA } from '@/data/timeline';
import { RESUME_HEADER, RESUME_SUMMARY, RESUME_EDUCATION } from '@/data/resume-base';
import { PROFICIENCY_LEVELS } from '@/data/skills';

// ── Fonts ───────────────────────────────────────────────────

Font.register({
  family: 'Cinzel',
  src: 'https://fonts.gstatic.com/s/cinzel/v23/8vIU7ww63mVu7gtR-kwKxNvkNOjw-tbnfY3lCQ.ttf',
  fontWeight: 700,
});

Font.register({
  family: 'Rajdhani',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/rajdhani/v15/LDIxapCSOBg7S-QT7p4JM-S_Fuo.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/rajdhani/v15/LDI2apCSOBg7S-QT7pb0EPOqeeHkkbIx.ttf',
      fontWeight: 600,
    },
  ],
});

// ── Styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Rajdhani',
    fontSize: 10,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#c4813a',
    paddingBottom: 10,
    marginBottom: 15,
  },
  name: {
    fontFamily: 'Cinzel',
    fontSize: 22,
    color: '#0a0806',
    fontWeight: 700,
  },
  title: {
    fontSize: 12,
    color: '#c4813a',
    marginTop: 2,
    fontWeight: 600,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
    fontSize: 9,
    color: '#666666',
  },
  sectionTitle: {
    fontFamily: 'Cinzel',
    fontSize: 12,
    color: '#c4813a',
    fontWeight: 700,
    marginTop: 14,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e8d5c0',
    paddingBottom: 3,
  },
  summary: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.5,
    marginBottom: 4,
  },
  skillGroup: {
    marginBottom: 6,
  },
  skillGroupLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: '#4a3d30',
    marginBottom: 2,
  },
  skillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  skillChip: {
    fontSize: 8,
    color: '#4a3d30',
    backgroundColor: '#f5ede4',
    padding: '2 6',
    borderRadius: 3,
  },
  proficiency: {
    fontSize: 7,
    color: '#999999',
  },
  projectItem: {
    marginBottom: 8,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 600,
    color: '#1a1a1a',
  },
  projectTier: {
    fontSize: 8,
    color: '#c4813a',
  },
  projectDesc: {
    fontSize: 9,
    color: '#444444',
    lineHeight: 1.4,
    marginTop: 1,
  },
  projectRole: {
    fontSize: 8,
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 1,
  },
  projectTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginTop: 2,
  },
  tag: {
    fontSize: 7,
    color: '#c4813a',
    backgroundColor: '#fdf5ec',
    padding: '1 4',
    borderRadius: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timelineYears: {
    width: 80,
    fontSize: 9,
    color: '#999999',
  },
  timelineContent: {
    flex: 1,
  },
  timelineEra: {
    fontSize: 10,
    fontWeight: 600,
    color: '#1a1a1a',
  },
  timelineOrg: {
    fontSize: 9,
    color: '#666666',
  },
  educationItem: {
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 7,
    color: '#cccccc',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 6,
  },
});

// ── PDF Document Component ──────────────────────────────────

interface ResumePDFProps {
  skills: Skill[];
  projects: Project[];
}

export function ResumePDF({ skills, projects }: ResumePDFProps) {
  // Group skills by subcategory
  const skillGroups = new Map<string, Skill[]>();
  for (const skill of skills) {
    if (!skillGroups.has(skill.subcategory)) skillGroups.set(skill.subcategory, []);
    skillGroups.get(skill.subcategory)!.push(skill);
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{RESUME_HEADER.name}</Text>
          <Text style={styles.title}>{RESUME_HEADER.title}</Text>
          <View style={styles.contactRow}>
            <Text>{RESUME_HEADER.email}</Text>
            <Text>{RESUME_HEADER.website}</Text>
            <Text>{RESUME_HEADER.location}</Text>
          </View>
        </View>

        {/* Summary */}
        <Text style={styles.summary}>{RESUME_SUMMARY}</Text>

        {/* Skills */}
        {skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            {Array.from(skillGroups.entries()).map(([group, groupSkills]) => (
              <View key={group} style={styles.skillGroup}>
                <Text style={styles.skillGroupLabel}>{group}</Text>
                <View style={styles.skillRow}>
                  {groupSkills.map((s) => (
                    <Text key={s.id} style={styles.skillChip}>
                      {s.name}{' '}
                      <Text style={styles.proficiency}>
                        ({PROFICIENCY_LEVELS[s.proficiency].label})
                      </Text>
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Notable Projects</Text>
            {projects.map((p) => (
              <View key={p.name} style={styles.projectItem}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                  <Text style={styles.projectName}>{p.name}</Text>
                  <Text style={styles.projectTier}>{p.tier}</Text>
                </View>
                <Text style={styles.projectDesc}>{p.desc}</Text>
                {p.role && <Text style={styles.projectRole}>{p.role}</Text>}
                <View style={styles.projectTags}>
                  {p.tags.map((tag) => (
                    <Text key={tag} style={styles.tag}>
                      {tag}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Timeline */}
        <View>
          <Text style={styles.sectionTitle}>Experience</Text>
          {[...TIMELINE_DATA].reverse().map((t) => (
            <View key={t.era} style={styles.timelineItem}>
              <Text style={styles.timelineYears}>{t.years}</Text>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineEra}>{t.era}</Text>
                <Text style={styles.timelineOrg}>{t.org}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Education */}
        <View>
          <Text style={styles.sectionTitle}>Education</Text>
          {RESUME_EDUCATION.map((ed) => (
            <View key={ed.institution} style={styles.educationItem}>
              <Text style={{ fontSize: 10, fontWeight: 600 }}>{ed.credential}</Text>
              <Text style={{ fontSize: 9, color: '#666666' }}>
                {ed.institution} &bull; {ed.years}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Generated from The Forge — rblaylock.dev</Text>
      </Page>
    </Document>
  );
}
