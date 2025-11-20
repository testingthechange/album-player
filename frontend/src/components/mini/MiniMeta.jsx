import React from "react";
import { saveMetaReturn, loadMetaReturn } from "../../state/localProjectStorage";

/**
 * MiniMeta
 *
 * Props:
 * - projectId: string (required) – which project this meta belongs to
 * - onMasterSave?: (projectId, metaData) => void (optional) – notify parent
 */
export default function MiniMeta({ projectId, onMasterSave }) {
  // Basic meta fields – expand as needed
  const [albumTitle, setAlbumTitle] = React.useState("");
  const [artistName, setArtistName] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState(null);

  // When the component mounts, try to load any previously saved meta
  React.useEffect(() => {
    if (!projectId) return;

    const saved = loadMetaReturn(projectId);
    if (saved) {
      setAlbumTitle(saved.albumTitle || "");
      setArtistName(saved.artistName || "");
      setNotes(saved.notes || "");
      if (saved.savedAt) {
        setSavedAt(saved.savedAt);
      }
    }
  }, [projectId]);

  const handleMasterSave = (e) => {
    e.preventDefault();
    if (!projectId) {
      console.warn("MiniMeta: missing projectId, cannot save");
      return;
    }

    setSaving(true);

    const metaData = {
      albumTitle,
      artistName,
      notes,
      savedAt: new Date().toISOString(),
    };

    // 1) Save locally (beta storage)
    saveMetaReturn(projectId, metaData);

    // 2) Notify parent / app state if provided
    if (onMasterSave) {
      onMasterSave(projectId, metaData);
    }

    setSavedAt(metaData.savedAt);
    setSaving(false);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Meta Worksheet</h2>
      <p style={{ fontSize: "0.9rem", color: "#555" }}>
        Project ID: <strong>{projectId}</strong>
      </p>

      <form onSubmit={handleMasterSave}>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Album Title{" "}
            <input
              type="text"
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              style={{ marginLeft: "0.5rem", width: "250px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Artist Name{" "}
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              style={{ marginLeft: "0.5rem", width: "250px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Notes{" "}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              style={{ marginLeft: "0.5rem", width: "300px" }}
            />
          </label>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Master Save"}
        </button>
      </form>

      {savedAt && (
        <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "green" }}>
          Last saved at: {new Date(savedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
