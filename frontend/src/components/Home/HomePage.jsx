// src/components/Home/HomePage.jsx
import React from "react";

export function HomePage({ project, onSongTitlesChange, onProjectUpdate }) {
  const [tempTitle, setTempTitle] = React.useState(project.title || "");
  const [tempArtist, setTempArtist] = React.useState(project.artistName || "");

  const handleChangeTitle = (e) => {
    setTempTitle(e.target.value);
  };

  const handleChangeArtist = (e) => {
    setTempArtist(e.target.value);
  };

  const handleSaveBasic = () => {
    if (!onProjectUpdate) return;
    onProjectUpdate({
      title: tempTitle,
      artistName: tempArtist,
    });
  };

  // ⭐ NEW → Home Master Save (lights up "Album" on checklist)
  const handleHomeMasterSave = () => {
    if (!onProjectUpdate) return;

    const savedAt = new Date().toISOString();
    onProjectUpdate({
      homeMasterSaved: true,
      homeMasterSavedAt: savedAt,
    });
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Home</h2>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Project Title{" "}
          <input
            type="text"
            value={tempTitle}
            onChange={handleChangeTitle}
            style={{ marginLeft: "0.5rem", width: "240px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Artist Name{" "}
          <input
            type="text"
            value={tempArtist}
            onChange={handleChangeArtist}
            style={{ marginLeft: "0.5rem", width: "240px" }}
          />
        </label>
      </div>

      <button onClick={handleSaveBasic} style={{ marginRight: "0.75rem" }}>
        Save Basic Info
      </button>

      {/* ⭐ NEW: Home Master Save */}
      <button onClick={handleHomeMasterSave}>
        Home Master Save
      </button>
    </div>
  );
}

export default HomePage;
