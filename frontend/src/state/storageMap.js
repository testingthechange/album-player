// src/state/storageMap.js
// Central place to define storage paths for projects, users, and public players.
// This is just a mapping helper for now – no real storage yet.

export function projectBasePath(projectId) {
  return `/storage/projects/${projectId}`;
}

export function producerReturnsPath(projectId) {
  return `${projectBasePath(projectId)}/producer_returns`;
}

export function exportsPath(projectId) {
  return `${projectBasePath(projectId)}/exports`;
}

export function userBasePath(userId) {
  return `/storage/users/${userId}`;
}

export function userWalletPath(userId) {
  return `${userBasePath(userId)}/wallet`;
}

export function publicPlayerPath(shareId) {
  return `/public/players/${shareId}`;
}

// Example helper to compute all paths for a project:
export function getProjectStorageMap(projectId, userId, shareId) {
  return {
    projectBase: projectBasePath(projectId),
    producerReturns: producerReturnsPath(projectId),
    exports: exportsPath(projectId),
    userBase: userId ? userBasePath(userId) : null,
    userWallet: userId ? userWalletPath(userId) : null,
    publicPlayer: shareId ? publicPlayerPath(shareId) : null,
  };
}
