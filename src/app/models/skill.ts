export interface Skill {
    id?: number;              // Optional: useful if your backend assigns database IDs
  mainSkill: string;        // e.g., "Java"
  subSkill: string;         // e.g., "Stream"
  skillCategory: string;    // e.g., "BACKEND"
}
