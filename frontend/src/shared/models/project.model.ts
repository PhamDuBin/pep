// =============================================================================
// PROJECT MODEL
// =============================================================================

export interface Project {
  id: string;
  name: string;
  description?: string;
  isSelected: boolean;
  createdAt?: Date;
}
