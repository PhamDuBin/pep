// =============================================================================
// PROJECT COLORS CONSTANT
// =============================================================================

// Four base colors randomly assigned to projects
export const PROJECT_COLORS = [
  "#B65070", // Pink
  "#066A9E", // Blue
  "#BA9C39", // Gold
  "#558A64", // Green
];

/**
 * Get a consistent random color for a project based on its ID
 * Uses a hash function to ensure the same project always gets the same color
 */
export function getProjectColor(projectId: string | number): string {
  let hash = 0;
  const idString = String(projectId);
  for (let i = 0; i < idString.length; i++) {
    const char = idString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; 
  }
  const index = Math.abs(hash) % PROJECT_COLORS.length;
  return PROJECT_COLORS[index];
}
