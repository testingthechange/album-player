// src/components/Songs/SongsPage.jsx
import React from "react";
import { saveSongsReturn } from "../../state/localProjectStorage";

export function SongsPage({ project, onProjectUpdate }) {
  const [songs, setSongs] = React.useState(project.songs || []);

  const handleTitleChange = (index, value) => {
    setSongs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], title: value };
      return next;
    });
  };

  const handleSaveSongs = () => {
    if (!onProjectUpdate) return;
    onProjectUpdate({ songs });
  };

  // ⭐ Songs Master Save – lights up "Extended" row in checklist + dashboard
  const handleSongsMasterSave = () => {
    if (!onProjectUpdate) return;
    const savedAt = new Date().toISOString();

    // Update in-memory project state
    onProjectUpdate({
      songs,
      songsMasterSaved: true,
      songsMasterSavedAt: savedAt,
    });

    // Persist in localStorage so Dashboard can see it
    const projectId = project && project.projectId;
    if (projectId) {
      saveSongsReturn(projectId, {
        songs,
        savedAt,
      });
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Songs</h2>

      <table
        style={{
          borderCollapse: "collapse",
          minWidth: "400px",
          marginBottom: "0.75rem",
          fontSize: "0.9rem",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                borderBottom: "1px solid #ccc",
                textAlign: "left",
                padding: "0.35rem",
              }}
            >
              #
            </th>
            <th
              style={{
                borderBottom: "1px solid #ccc",
                textAlign: "left",
                padding: "0.35rem",
              }}
            >
              Title
            </th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr key={song.songId || index}>
              <td
                style={{
                  padding: "0.35rem",
                  borderBottom: "1px solid #eee",
                }}
              >
                {index + 1}
              </td>
              <td
                style={{
                  padding: "0.35rem",
                  borderBottom: "1px solid #eee",
                }}
              >
                <input
                  type="text"
                  value={song.title || ""}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  style={{ width: "260px" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        onClick={handleSaveSongs}
        style={{ marginRight: "0.75rem" }}
      >
        Save Song Titles
      </button>

      {/* ⭐ Songs Master Save */}
      <button type="button" onClick={handleSongsMasterSave}>
        Songs Master Save
      </button>
    </div>
  );
}

export default SongsPage;
