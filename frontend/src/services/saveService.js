// src/services/saveService.js
// Placeholder "backend" call for Master Save.
// Later: replace with real fetch() / axios() to Spring Boot.

export function saveProducerReturn(projectId, payload) {
  console.log("[saveService] Saving producer return for project:", projectId, payload);

  // Fake async call for now
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate backend response
      resolve({
        ok: true,
        projectId,
        savedAt: new Date().toISOString(),
      });
    }, 500);
  });
}
