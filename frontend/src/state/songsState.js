// src/state/songsState.js
// Shared shape for song titles + locks (no backend yet)

export const createEmptySongsState = () => ({
  titles: Array(9).fill(""),
  locks: Array(9).fill(false),
});

export const setSongTitle = (state, index, value) => {
  const next = { ...state, titles: [...state.titles] };
  next.titles[index] = value;
  return next;
};

export const toggleSongLock = (state, index) => {
  const next = { ...state, locks: [...state.locks] };
  next.locks[index] = !next.locks[index];
  return next;
};
