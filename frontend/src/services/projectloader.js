// src/services/projectLoader.js
// Placeholder project loader.
// Later: replace with real API calls to Spring Boot.

import { createInitialProjectsState } from "../state/projectState";

export function loadProjectById(projectId) {
  console.log("[projectLoader] Loading project:", projectId);

  // For now, use local initial state
  const initial = createInitialProjectsState();
  const project =
    initial.projects.find((p) => p.projectId === projectId) || null;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: !!project,
        project,
      });
    }, 300);
  });
}
