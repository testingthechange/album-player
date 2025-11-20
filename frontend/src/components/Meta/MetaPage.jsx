// src/components/Meta/MetaPage.jsx
import React from "react";

// same lock button styling used on Home
function getLockButtonStyle(locked) {
  return {
    minWidth: "5rem",
    fontSize: "0.8rem",
    padding: "0.2rem 0.6rem",
    borderRadius: "4px",
    border: "1px solid",
    borderColor: locked ? "#d33" : "#2f8f3c",
    backgroundColor: locked ? "#ffe5e5" : "#e6ffea",
    color: locked ? "#700" : "#084c10",
    cursor: "pointer",
  };
}

const makeDefaultAlbumMeta = () => ({
  albumName: "",
  artistName: "",
  genre: "",
  date: "",
  locked: false,
});

export function MetaPage({ project, onProjectUpdate }) {
  // ----- ALBUM META (top card) -----
  const [albumMeta, setAlbumMeta] = React.useState(
    project.albumMeta ? { ...makeDefaultAlbumMeta(), ...project.albumMeta } : makeDefaultAlbumMeta()
  );

  React.useEffect(() => {
    if (project.albumMeta) {
      setAlbumMeta((prev) => ({
        ...prev,
        ...project.albumMeta,
      }));
    }
  }, [project.albumMeta]);

  const updateAlbumMeta = (patch) => {
    setAlbumMeta((prev) => {
      const next = { ...prev, ...patch };
      if (onProjectUpdate) {
        onProjectUpdate({ albumMeta: next });
      }
      return next;
    });
  };

  const handleAlbumFieldChange = (field, value) => {
    if (albumMeta.locked) return; // locked -> no edits
    updateAlbumMeta({ [field]: value });
  };

  const handleAlbumLockToggle = () => {
    updateAlbumMeta({ locked: !albumMeta.locked });
  };

  // ----- SONG META (per-song tables) -----
  // (kept simple; assumes project.songs is the 1–9 list from Home)
  const songs = project.songs || [];

  const handleSongMetaChange = (songIndex, field, value) => {
    // each song gets a nested meta object: song.meta = { songwriter, writtenBy, producedBy, engineer, other, bpm, genre, miscNotes, locked }
    const currentSong = songs[songIndex] || {};
    const currentMeta = currentSong.meta || {};

    if (currentMeta.locked) return;

    const updatedSongs = songs.map((s, i) => {
      if (i !== songIndex) return s;
      return {
        ...s,
        meta: {
          ...makeDefaultSongMeta(),
          ...s.meta,
          [field]: value,
        },
      };
    });

    if (onProjectUpdate) {
      onProjectUpdate({ songs: updatedSongs });
    }
  };

  const handleSongMetaLockToggle = (songIndex) => {
    const updatedSongs = songs.map((s, i) => {
      if (i !== songIndex) return s;
      const meta = { ...makeDefaultSongMeta(), ...s.meta };
      return {
        ...s,
        meta: {
          ...meta,
          locked: !meta.locked,
        },
      };
    });

    if (onProjectUpdate) {
      onProjectUpdate({ songs: updatedSongs });
    }
  };

  return (
    <div>
      {/* ===== Album Meta card with LOCK ===== */}
      <section
        style={{
          marginBottom: "1.5rem",
          padding: "0.75rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fafafd",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "0.75rem",
          }}
        >
          <h3 style={{ margin: 0 }}>Album Meta</h3>

          {/* Lock button for entire Album Meta block */}
          <button
            type="button"
            onClick={handleAlbumLockToggle}
            style={getLockButtonStyle(albumMeta.locked)}
          >
            {albumMeta.locked ? "Locked" : "Unlocked"}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "180px 1fr",
            rowGap: "0.6rem",
            columnGap: "1rem",
            alignItems: "center",
          }}
        >
          <label style={{ fontWeight: 500 }}>Name of Album:</label>
          <input
            type="text"
            value={albumMeta.albumName || ""}
            onChange={(e) => handleAlbumFieldChange("albumName", e.target.value)}
            disabled={albumMeta.locked}
            style={{
              width: "100%",
              padding: "0.35rem 0.5rem",
              backgroundColor: albumMeta.locked ? "#f3f3f3" : "white",
            }}
          />

          <label style={{ fontWeight: 500 }}>Artist name:</label>
          <input
            type="text"
            value={albumMeta.artistName || ""}
            onChange={(e) => handleAlbumFieldChange("artistName", e.target.value)}
            disabled={albumMeta.locked}
            style={{
              width: "100%",
              padding: "0.35rem 0.5rem",
              backgroundColor: albumMeta.locked ? "#f3f3f3" : "white",
            }}
          />

          <label style={{ fontWeight: 500 }}>Genre:</label>
          <input
            type="text"
            value={albumMeta.genre || ""}
            onChange={(e) => handleAlbumFieldChange("genre", e.target.value)}
            disabled={albumMeta.locked}
            style={{
              width: "100%",
              padding: "0.35rem 0.5rem",
              backgroundColor: albumMeta.locked ? "#f3f3f3" : "white",
            }}
          />

          <label style={{ fontWeight: 500 }}>Date:</label>
          <input
            type="text"
            value={albumMeta.date || ""}
            onChange={(e) => handleAlbumFieldChange("date", e.target.value)}
            disabled={albumMeta.locked}
            placeholder="YYYY-MM-DD or free text"
            style={{
              width: "100%",
              padding: "0.35rem 0.5rem",
              backgroundColor: albumMeta.locked ? "#f3f3f3" : "white",
            }}
          />
        </div>
      </section>

      {/* ===== Song-by-song Meta tables (Song 1–9) ===== */}
      {songs.map((song, index) => {
        const n = index + 1;
        const meta = { ...makeDefaultSongMeta(), ...(song.meta || {}) };
        const locked = !!meta.locked;

        return (
          <section
            key={song.songId || `song-meta-${n}`}
            style={{
              marginBottom: "1.25rem",
              padding: "0.75rem 1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <div>
                <h4 style={{ margin: 0 }}>Song {n} Meta</h4>
                <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                  Name: <strong>{song.title || "(no title yet)"}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSongMetaLockToggle(index)}
                style={getLockButtonStyle(locked)}
              >
                {locked ? "Locked" : "Unlocked"}
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                rowGap: "0.4rem",
                columnGap: "1rem",
                alignItems: "center",
              }}
            >
              <label>Songwriter +</label>
              <input
                type="text"
                value={meta.songwriter || ""}
                onChange={(e) =>
                  handleSongMetaChange(index, "songwriter", e.target.value)
                }
                disabled={locked}
                style={songMetaInputStyle(locked)}
                placeholder="Songwriter name(s)"
              />

              <label>Written by +</label>
              <input
                type="text"
                value={meta.writtenBy || ""}
                onChange={(e) =>
                  handleSongMetaChange(index, "writtenBy", e.target.value)
                }
                disabled={locked}
                style={songMetaInputStyle(locked)}
                placeholder="Written by credit(s)"
              />

              <label>Produced by +</label>
              <input
                type="text"
                value={meta.producedBy || ""}
                onChange={(e) =>
                  handleSongMetaChange(index, "producedBy", e.target.value)
                }
                disabled={locked}
                style={songMetaInputStyle(locked)}
                placeholder="Producer name(s)"
              />

              <label>Engineer +</label>
              <input
                type="text"
                value={meta.engineer || ""}
                onChange={(e) =>
                  handleSongMetaChange(index, "engineer", e.target.value)
                }
                disabled={locked}
                style={songMetaInputStyle(locked)}
                placeholder="Engineer credit(s)"
              />

              <label>Other +</label>
              <input
                type="text"
                value={meta.other || ""}
                onChange={(e) =>
                  handleSongMetaChange(index, "other", e.target.value)
                }
                disabled={locked}
                style={songMetaInputStyle(locked)}
                placeholder="Additional credits"
              />

              <label>BPM</label>
              <input
                type="text"
                value={meta.bpm || ""}
                onChange={(e) =>
                  handleSongMetaChange(index, "bpm", e.target.value)
                }
                disabled={locked}
                style={songMetaInputStyle(locked)}
                placeholder="e.g. 120"
              />

              <label>Genre</label>
              <input
                type="text"
                value={meta.genre || ""}
                onChange={(e) =>
                  handleSongMetaChange(index, "genre", e.target.value)
                }
                disabled={locked}
                style={songMetaInputStyle(locked)}
                placeholder="Song-specific genre"
              />

              <label>Misc notes:</label>
              <textarea
                value={meta.miscNotes || ""}
                onChange={(e) =>
                  handleSongMetaChange(index, "miscNotes", e.target.value)
                }
                disabled={locked}
                rows={3}
                style={{
                  ...songMetaInputStyle(locked),
                  resize: "vertical",
                }}
                placeholder="Any extra notes about this song"
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}

// helper for song meta default + styles
function makeDefaultSongMeta() {
  return {
    songwriter: "",
    writtenBy: "",
    producedBy: "",
    engineer: "",
    other: "",
    bpm: "",
    genre: "",
    miscNotes: "",
    locked: false,
  };
}

function songMetaInputStyle(locked) {
  return {
    width: "100%",
    padding: "0.3rem 0.4rem",
    backgroundColor: locked ? "#f3f3f3" : "white",
  };
}

export default MetaPage;
