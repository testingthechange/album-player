// src/routes.js
// Central route map for admin app, mini-site, and future public player.
// Right now this is just documentation + helpers (no router yet).

export const ROUTES = {
  // Admin views (internal)
  adminDashboard: "/",
  adminProjects: "/projects",
  adminCreateProducer: "/producers/create",

  // Mini-site (admin view -> uses React state for now)
  adminMiniSite: "/mini-site", // internal-only "view" inside the SPA

  // Magic-link mini-site entry (what producers actually click)
  // Example: /mini/proj_001?token=XYZ
  producerMiniSite: (projectId = ":projectId") => `/mini/${projectId}`,

  // Public commercial player (future)
  // Example: /player/share_abc123
  publicPlayer: (shareId = ":shareId") => `/player/${shareId}`,

  // Auth / login (future)
  login: "/login",
};

// Helper to build magic-link URLs (frontend planning only)
export function buildMagicLinkUrl(baseUrl, projectId, token) {
  const url = new URL(ROUTES.producerMiniSite(projectId), baseUrl);
  if (token) {
    url.searchParams.set("token", token);
  }
  return url.toString();
}

// Example builder for public player URL
export function buildPublicPlayerUrl(baseUrl, shareId) {
  return new URL(ROUTES.publicPlayer(shareId), baseUrl).toString();
}
