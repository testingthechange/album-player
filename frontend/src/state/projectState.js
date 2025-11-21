// src/state/projectState.js

// Initial in-memory state for projects.
// Later you can replace this with real backend loading.

export function createInitialProjectsState() {
  return {
    projects: [
      createSampleProject("proj_002"),
      // Add more sample projects if you want:
      // createSampleProject("proj-002"),
    ],
  };
}

function createSampleProject(projectId) {
  const baseSongs = [
    { songId: `${projectId}-song-001`, title: "Song 1" },
    { songId: `${projectId}-song-002`, title: "Song 2" },
    { songId: `${projectId}-song-003`, title: "Song 3" },
  ];

  return {
    // Core identity
    projectId,
    title: "Demo Project",
    artistName: "Demo Artist",
    assignedProducerName: "Demo Producer",

    // Songs (used by Songs page & player later)
    songs: baseSongs.map((s) => ({
      songId: s.songId,
      title: s.title,
      filePath: "",      // e.g. "/storage/users/.../song.wav"
      versionLabel: "",  // e.g. "Main Mix", "Alt"
    })),

    // Song metadata (used by Meta page)
    metaSongs: baseSongs.map((s) => ({
      songId: s.songId,
      title: s.title,
      bpm: "",           // number or string for now
      key: "",           // e.g. "C#m"
      notes: "",         // version notes / comments
    })),

    // NFT / Labs placeholders
    enableNft: false,
    nftCollectionId: "",
    chain: "polygon",

    // Producer return tracking
    producerReturnReceived: false,
    producerReturnTimestamp: null, // ISO string when received

    // Internal-only notes (for future Producer tab)
    internalNotes: "",
  };
}
