import { saveMetaReturn } from "../../storage"; // adjust path if needed

import React from "react";

// Re-use the same lock button look as Home
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

// Build a safe initial meta object from whatever is on project.meta
function buildInitialMeta(project) {
  const incoming = project.meta || {};

  const album = incoming.album || {};
  const songs = incoming.songs || [];

  const songRows = Array.from({ length: 9 }).map((_, i) => {
    const existing = songs[i] || {};
    const n = i + 1;
    return {
      id: existing.id || `meta-song-${n}`,
      name: existing.name || "",
      songwriter: existing.songwriter || "",
      writtenBy: existing.writtenBy || "",
      producedBy: existing.producedBy || "",
      engineer: existing.engineer || "",
      other: existing.other || "",
      bpm: existing.bpm || "",
      genre: existing.genre || "",
      miscNotes: existing.miscNotes || "",
      locked: !!existing.locked,
    };
  });

  return {
    album: {
      name: album.name || "",
      artistName: album.artistName || "",
      genre: album.genre || "",
      date: album.date || "",
      locked: !!album.locked,
    },
    songs: songRows,
    masterSaved: !!incoming.masterSaved,
    masterSavedAt: incoming.masterSavedAt || null,
  };
}

export default function MetaPage({ project, onProjectUpdate }) {
  const [meta, setMeta] = React.useState(() => buildInitialMeta(project));

  React.useEffect(() => {
    setMeta(buildInitialMeta(project));
  }, [project.meta]);

  const masterSaved = !!meta.masterSaved;

  const allSongLocked = meta.songs.every((s) => !!s.locked);
  const albumLocked = !!meta.album.locked;
  const allLocked = albumLocked && allSongLocked;

  // ---------- helpers to update local state ----------
  const updateAlbumField = (field, value) => {
    if (masterSaved || meta.album.locked) return;
    setMeta((prev) => ({
      ...prev,
      album: {
        ...prev.album,
        [field]: value,
      },
    }));
  };

  const toggleAlbumLock = () => {
    if (masterSaved) return;
    setMeta((prev) => ({
      ...prev,
      album: {
        ...prev.album,
        locked: !prev.album.locked,
      },
    }));
  };

  const updateSongField = (index, field, value) => {
    if (masterSaved) return;
    setMeta((prev) => {
      const songs = prev.songs.map((s, i) =>
        i === index && !s.locked ? { ...s, [field]: value } : s
      );
      return { ...prev, songs };
    });
  };

  const toggleSongLock = (index) => {
    if (masterSaved) return;
    setMeta((prev) => {
      const songs = prev.songs.map((s, i) =>
        i === index ? { ...s, locked: !s.locked } : s
      );
      return { ...prev, songs };
    });
  };

  // ---------- tier 1: Save draft (internal only) ----------
  const handleSaveDraft = () => {
    if (!onProjectUpdate) return;
    onProjectUpdate({
      meta,
      metaMasterSaved: meta.masterSaved || false,
      metaMasterSavedAt: meta.masterSavedAt || null,
    });
    window.alert("Meta draft saved locally to this project.");
  };

  // ---------- tier 2: Master Save ----------
const handleMasterSave = () => {
  if (!allLocked) {
    window.alert(
      "To Master Save Meta, all album and song rows must be locked.\n\n" +
        "Lock Album Meta and all 9 Song Meta blocks first."
    );
    return;
  }

  // First confirmation
  const first = window.confirm(
    "Meta Master Save will lock in this metadata for Block Radius.\n\n" +
      "Are you sure you want to continue?"
  );
  if (!first) return;

  // Second confirmation (last chance)
  const second = window.confirm(
    "Last chance!\n\nAfter this Meta Master Save, values are treated as final " +
      "for this version and sent to Block Radius.\n\nAre you absolutely sure?"
  );
  if (!second) return;

  const now = new Date().toISOString();

  const nextMeta = {
    ...meta,
    masterSaved: true,
    masterSavedAt: now,
  };

  setMeta(nextMeta);

  if (onProjectUpdate) {
    onProjectUpdate({
      meta: nextMeta,
      metaMasterSaved: true,
      metaMasterSavedAt: now,
      // *** this is what drives the green check on the Projects page ***
      metaReturnReceived: true,
      metaReturnReceivedAt: now,
    });
  }

  window.alert("Meta Master Save complete. (Simulated send to Block Radius.)");
};


  // ---------- render helpers ----------
  const renderAlbumMeta = () => (
    <section
      style={{
        marginBottom: "1.5rem",
        padding: "0.75rem 1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <h3 style={{ margin: 0 }}>Album Meta</h3>
        <button
          type="button"
          onClick={toggleAlbumLock}
          style={getLockButtonStyle(meta.album.locked)}
          disabled={masterSaved}
        >
          {meta.album.locked ? "Locked" : "Unlocked"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "160px 1fr",
          rowGap: "0.5rem",
          columnGap: "0.75rem",
          alignItems: "center",
        }}
      >
        <label>Name of Album:</label>
        <input
          type="text"
          value={meta.album.name}
          onChange={(e) => updateAlbumField("name", e.target.value)}
          disabled={meta.album.locked || masterSaved}
          style={{ width: "100%", padding: "0.3rem" }}
        />

        <label>Artist name:</label>
        <input
          type="text"
          value={meta.album.artistName}
          onChange={(e) => updateAlbumField("artistName", e.target.value)}
          disabled={meta.album.locked || masterSaved}
          style={{ width: "100%", padding: "0.3rem" }}
        />

        <label>Genre:</label>
        <input
          type="text"
          value={meta.album.genre}
          onChange={(e) => updateAlbumField("genre", e.target.value)}
          disabled={meta.album.locked || masterSaved}
          style={{ width: "100%", padding: "0.3rem" }}
        />

        <label>Date:</label>
        <input
          type="text"
          placeholder="YYYY-MM-DD or free text"
          value={meta.album.date}
          onChange={(e) => updateAlbumField("date", e.target.value)}
          disabled={meta.album.locked || masterSaved}
          style={{ width: "100%", padding: "0.3rem" }}
        />
      </div>
    </section>
  );

  const renderSongMetaRow = (song, index) => (
    <section
      key={song.id}
      style={{
        marginBottom: "1rem",
        padding: "0.75rem 1rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.4rem",
        }}
      >
        <h4 style={{ margin: 0 }}>Song {index + 1}</h4>
        <button
          type="button"
          onClick={() => toggleSongLock(index)}
          style={getLockButtonStyle(song.locked)}
          disabled={masterSaved}
        >
          {song.locked ? "Locked" : "Unlocked"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "160px 1fr",
          rowGap: "0.35rem",
          columnGap: "0.75rem",
          alignItems: "center",
          fontSize: "0.9rem",
        }}
      >
        <label>Name of song</label>
        <input
          type="text"
          value={song.name}
          onChange={(e) =>
            updateSongField(index, "name", e.target.value)
          }
          disabled={song.locked || masterSaved}
          style={{ width: "100%", padding: "0.25rem" }}
        />

        <label>Songwriter +</label>
        <input
          type="text"
          placeholder="Songwriter name(s)"
          value={song.songwriter}
          onChange={(e) =>
            updateSongField(index, "songwriter", e.target.value)
          }
          disabled={song.locked || masterSaved}
          style={{ width: "100%", padding: "0.25rem" }}
        />

        <label>Written by +</label>
        <input
          type="text"
          placeholder="Written by credit(s)"
          value={song.writtenBy}
          onChange={(e) =>
            updateSongField(index, "writtenBy", e.target.value)
          }
          disabled={song.locked || masterSaved}
          style={{ width: "100%", padding: "0.25rem" }}
        />

        <label>Produced by +</label>
        <input
          type="text"
          placeholder="Producer name(s)"
          value={song.producedBy}
          onChange={(e) =>
            updateSongField(index, "producedBy", e.target.value)
          }
          disabled={song.locked || masterSaved}
          style={{ width: "100%", padding: "0.25rem" }}
        />

        <label>Engineer +</label>
        <input
          type="text"
          placeholder="Engineer credit(s)"
          value={song.engineer}
          onChange={(e) =>
            updateSongField(index, "engineer", e.target.value)
          }
          disabled={song.locked || masterSaved}
          style={{ width: "100%", padding: "0.25rem" }}
        />

        <label>Other +</label>
        <input
          type="text"
          placeholder="Other credits"
          value={song.other}
          onChange={(e) =>
            updateSongField(index, "other", e.target.value)
          }
          disabled={song.locked || masterSaved}
          style={{ width: "100%", padding: "0.25rem" }}
        />

        <label>BPM</label>
        <input
          type="text"
          value={song.bpm}
          onChange={(e) =>
            updateSongField(index, "bpm", e.target.value)
          }
          disabled={song.locked || masterSaved}
          style={{ width: "100%", padding: "0.25rem" }}
        />

        <label>Genre</label>
        <input
          type="text"
          value={song.genre}
          onChange={(e) =>
            updateSongField(index, "genre", e.target.value)
          }
          disabled={song.locked || masterSaved}
          style={{ width: "100%", padding: "0.25rem" }}
        />

        <label>Misc notes:</label>
        <textarea
          rows={2}
          value={song.miscNotes}
          onChange={(e) =>
            updateSongField(index, "miscNotes", e.target.value)
          }
          disabled={song.locked || masterSaved}
          style={{ width: "100%", padding: "0.25rem", resize: "vertical" }}
        />
      </div>
    </section>
  );

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {renderAlbumMeta()}

      {/* Song meta blocks */}
      {meta.songs.map((song, index) => renderSongMetaRow(song, index))}

      {/* Save / Master Save bar */}
      <div
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          backgroundColor: "#fdfdfd",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={handleSaveDraft}
            style={{
              padding: "0.35rem 0.9rem",
              borderRadius: "4px",
              border: "1px solid #888",
              backgroundColor: "#f5f5f5",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
            disabled={masterSaved}
          >
            Save draft
          </button>

          <button
            type="button"
            onClick={handleMasterSave}
            style={{
              padding: "0.35rem 0.9rem",
              borderRadius: "4px",
              border: "1px solid #900",
              backgroundColor: masterSaved ? "#ddd" : "#ffdddd",
              cursor: masterSaved ? "default" : "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
            disabled={masterSaved}
          >
            {masterSaved ? "Meta master saved" : "Meta Master Save"}
          </button>
        </div>

        <div style={{ fontSize: "0.8rem", textAlign: "right" }}>
          <div>
            Album locked:{" "}
            <strong>{albumLocked ? "Yes" : "No"}</strong> · Songs locked:{" "}
            <strong>{allSongLocked ? "Yes" : "No"}</strong>
          </div>
          {meta.masterSavedAt && (
            <div style={{ marginTop: "0.15rem", opacity: 0.8 }}>
              Master saved at: {meta.masterSavedAt}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
