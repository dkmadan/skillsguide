import { allSkillsList } from './skillsData';

// Derive this from the catalogue so homepage, About, and search cannot drift.
export const trackCount = new Set(allSkillsList.map(skill => skill.slug)).size;
