export interface Requirement {
  id?: string;
  description?: string;
  skill?: string;
  subSkill?: string;
  userStory?: string;
  epic?: string;
  priority?: string;
  components?: string;
  plannedReleaseDate?: string;
  actualReleaseDate?: string;
  requirementStatus?: string;
  createdAt?: string | null;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
  status?: string | null;
  comments?: any[];
}

export enum RequirementStatus {
    OPEN,
    IN_PROGRESS,
    REVIEW,
    DONE
}