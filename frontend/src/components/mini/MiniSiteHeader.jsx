import React from "react";

export function MiniSiteHeader({ mode, projectId, producerName, expiresAt }) {
  const isMagic = mode === "magic";

  const handleExitMagic = () => {
    // Drop query string and go back to normal app root
    window.location.href = "/";
  };

  return (
    <div style={{ marginBottom: "1rem", fontSize: "0.9rem", opacity: 0.85 }}>
      <div>
        <strong>Project:</strong> {projectId || "(unknown)"}
      </div>
      <div>
        <strong>Producer:</strong> {producerName || "(magic-link)"}
      </div>
      {expiresAt && (
        <div>
          <strong>Link expires:</strong> {expiresAt}
        </div>
      )}
      {isMagic && (
        <div style={{ marginTop: "0.25rem", color: "red" }}>
          Magic-link mode (dashboard hidden)
          {" · "}
          <button
            type="button"
            onClick={handleExitMagic}
            style={{
              border: "none",
              background: "none",
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
              padding: 0,
              marginLeft: "4px",
            }}
          >
            Exit magic mode
          </button>
        </div>
      )}
    </div>
  );
}
