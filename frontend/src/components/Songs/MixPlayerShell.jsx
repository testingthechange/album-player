// src/components/Songs/MixPlayerShell.jsx
import React from "react";

export function MixPlayerShell({ songs }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const hasSongs = songs && songs.length > 0;
  const currentSong = hasSongs ? songs[currentIndex] : null;

  const goNext = () => {
    if (!hasSongs) return;
    setCurrentIndex((prev) =>
      prev + 1 < songs.length ? prev + 1 : 0
    );
  };

  const goPrev = () => {
    if (!hasSongs) return;
    setCurrentIndex((prev) =>
      prev - 1 >= 0 ? prev - 1 : songs.length - 1
    );
  };

  if (!hasSongs) {
    return (
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "0.75rem",
          fontSize: "0.9rem",
          opacity: 0.8,
        }}
      >
        No songs configured yet. Add songs in Home/Songs to test the player
        shell.
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "0.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div style={{ fontSize: "0.9rem", opacity: 0.75 }}>
        Mix Player (dev shell)
      </div>

      <div>
        <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>Now showing</div>
        <div style={{ fontSize: "1rem", fontWeight: 600 }}>
          {currentSong?.title || "(Untitled song)"}
        </div>
        <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
          Index: {currentIndex + 1} / {songs.length}
        </div>
        <div style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
          File path:{" "}
          <span style={{ fontFamily: "monospace" }}>
            {currentSong?.filePath || "(no file path yet)"}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="button" onClick={goPrev}>
          ◀ Prev
        </button>
        <button type="button" onClick={goNext}>
          Next ▶
        </button>
      </div>

      <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
        Future: this box becomes your adaptive album player.
      </div>
    </div>
  );
}
