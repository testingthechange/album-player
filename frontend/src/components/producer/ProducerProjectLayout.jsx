// src/components/producer/ProducerProjectLayout.jsx
import React from "react";
import { HomePage } from "../Home/HomePage";
import MetaPage from "../Meta/MetaPage";
import { SongsPage } from "../Songs/SongsPage";
import { createInitialProjectsState } from "../../state/projectState";
import MiniMeta from "../mini/MiniMeta";

/**
 * For now we only use createInitialProjectsState().
 * Everything is in-memory on the frontend while we're in dev.
 */

function createDefaultProjects() {
  return createInitialProjectsState();
}

export function ProducerProjectLayout({
  projectId,
  showDashboardButton = true,
  onGoDashboard,
}) {
  const [tab, setTab] = React.useState("home");

  // Overall project state (all projects for this producer)
  const [projectState, setProjectState] = React.useState(() =>
    createDefaultProjects()
  );

  const projects = projectState.projects || [];

  const projectIndex = Math.max(
    0,
    projects.findIndex((p) => p.projectId === projectId)
  );

  const currentProject = projects[projectIndex] || projects[0];

  // If no project at all, just bail out cleanly
  if (!currentProject) {
    return <div>No project found.</div>;
  }

  // ---- UPDATE HELPERS ------------------------------------------------------

  const handleProjectUpdate = (partial) => {
    setProjectState((prev) => {
      const prevProjects = prev.projects || [];
      if (!prevProjects.length) return prev;

      const idx = Math.max(
        0,
        prevProjects.findIndex((p) => p.projectId === projectId)
      );
      const target = prevProjects[idx] || prevProjects[0];

      const updatedProject = { ...target, ...partial };
      const nextProjects = [...prevProjects];
      nextProjects[idx] = updatedProject;

      return { ...prev, projects: nextProjects };
    });
  };

  const handleSongTitlesChangeFromHome = (updatedSongs) => {
    handleProjectUpdate({ songs: updatedSongs });
  };

  // ---- META MASTER STATUS --------------------------------------------------

  // Meta master save can be tracked either as:
  // - flat fields (metaMasterSaved, metaMasterSavedAt), or
  // - inside meta.masterSaved (from MetaPage).
  const metaFromProject = currentProject.meta || {};
  const metaMasterSavedFlag =
    currentProject.metaMasterSaved || metaFromProject.masterSaved || false;
  const metaMasterSaved = !!metaMasterSavedFlag;

  const metaMasterSavedAt =
    currentProject.metaMasterSavedAt || metaFromProject.masterSavedAt || null;

  // ---- RENDER HELPERS ------------------------------------------------------

  const renderHeaderBar = () => (
    <div
      style={{
        marginBottom: "0.75rem",
        padding: "0.5rem 0.75rem",
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
      }}
    >
      <div>
        <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
          Project ID: <strong>{currentProject.projectId}</strong>
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
          {currentProject.title || "Untitled project"}
        </div>
        <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
          Artist:{" "}
          <strong>{currentProject.artistName || "Unknown artist"}</strong>
        </div>
      </div>

      {showDashboardButton && (
        <button
          type="button"
          onClick={onGoDashboard}
          style={{
            padding: "0.35rem 0.9rem",
            borderRadius: "4px",
            border: "1px solid #666",
            backgroundColor: "#f5f5f5",
            cursor: "pointer",
            fontSize: "0.85rem",
            whiteSpace: "nowrap",
          }}
        >
          Back to Dashboard
        </button>
      )}
    </div>
  );

  const renderTabs = () => (
    <div style={{ marginBottom: "0.75rem" }}>
      <button
        type="button"
        onClick={() => setTab("home")}
        style={{
          marginRight: "0.5rem",
          padding: "0.3rem 0.8rem",
          borderRadius: "4px",
          border: tab === "home" ? "2px solid #333" : "1px solid #aaa",
          backgroundColor: tab === "home" ? "#e0e0ff" : "#f5f5f5",
          cursor: "pointer",
          fontSize: "0.85rem",
        }}
      >
        Home
      </button>

      <button
        type="button"
        onClick={() => setTab("meta")}
        style={{
          marginRight: "0.5rem",
          padding: "0.3rem 0.8rem",
          borderRadius: "4px",
          border: tab === "meta" ? "2px solid #333" : "1px solid #aaa",
          backgroundColor: tab === "meta" ? "#e0ffe0" : "#f5f5f5",
          cursor: "pointer",
          fontSize: "0.85rem",
        }}
      >
        Meta
      </button>

      <button
        type="button"
        onClick={() => setTab("songs")}
        style={{
          marginRight: "0.5rem",
          padding: "0.3rem 0.8rem",
          borderRadius: "4px",
          border: tab === "songs" ? "2px solid #333" : "1px solid #aaa",
          backgroundColor: tab === "songs" ? "#ffe0f5" : "#f5f5f5",
          cursor: "pointer",
          fontSize: "0.85rem",
        }}
      >
        Songs
      </button>
    </div>
  );

  // Checklist cell helper
  const checklistCellStyle = (filled) => ({
    width: "1.7rem",
    height: "1.2rem",
    border: "1px solid #999",
    borderRadius: "2px",
    textAlign: "center",
    fontSize: "0.85rem",
    lineHeight: "1.1rem",
    backgroundColor: filled ? "#20b84f" : "#fff",
    color: filled ? "#fff" : "#000",
  });

  const renderReturnedFilesChecklist = () => {
    // We only have Meta wired up right now.
    // Others are placeholders for future integration.
    const songCols = Array.from({ length: 9 }).map((_, i) => `Song ${i + 1}`);

    return (
      <div
        style={{
          marginBottom: "1rem",
          border: "1px solid #999",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            padding: "0.35rem 0.6rem",
            borderBottom: "1px solid #999",
            fontWeight: 600,
          }}
        >
          Returned files checklist
        </div>

        <div style={{ display: "flex" }}>
          {/* Left: inner mini-table for categories vs songs */}
          <div style={{ flex: 1, borderRight: "1px solid #999" }}>
            <div
              style={{
                padding: "0.3rem 0.6rem",
                fontWeight: 600,
                borderBottom: "1px solid #ddd",
              }}
            >
              Returned files
            </div>

            <div
              style={{
                overflowX: "auto",
                padding: "0.35rem 0.6rem 0.6rem",
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  minWidth: "100%",
                  fontSize: "0.85rem",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        paddingRight: "0.75rem",
                        paddingBottom: "0.25rem",
                      }}
                    />
                    {songCols.map((label) => (
                      <th
                        key={label}
                        style={{
                          textAlign: "center",
                          padding: "0 0.2rem 0.25rem",
                          whiteSpace: "nowrap",
                          fontWeight: 500,
                        }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Album row – placeholder */}
                  <tr>
                    <td
                      style={{
                        paddingRight: "0.75rem",
                        paddingTop: "0.1rem",
                        paddingBottom: "0.1rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Album
                    </td>
                    {songCols.map((label) => (
                      <td key={label} style={{ padding: "0.1rem 0.2rem" }}>
                        <div style={checklistCellStyle(false)} />
                      </td>
                    ))}
                  </tr>

                  {/* Extended row – placeholder */}
                  <tr>
                    <td
                      style={{
                        paddingRight: "0.75rem",
                        paddingTop: "0.1rem",
                        paddingBottom: "0.1rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Extended
                    </td>
                    {songCols.map((label) => (
                      <td key={label} style={{ padding: "0.1rem 0.2rem" }}>
                        <div style={checklistCellStyle(false)} />
                      </td>
                    ))}
                  </tr>

                  {/* NFT row – placeholder */}
                  <tr>
                    <td
                      style={{
                        paddingRight: "0.75rem",
                        paddingTop: "0.1rem",
                        paddingBottom: "0.1rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      NFT
                    </td>
                    {songCols.map((label) => (
                      <td key={label} style={{ padding: "0.1rem 0.2rem" }}>
                        <div style={checklistCellStyle(false)} />
                      </td>
                    ))}
                  </tr>

                  {/* Meta row – ONLY thing that’s wired up in dev */}
                  <tr>
                    <td
                      style={{
                        paddingRight: "0.75rem",
                        paddingTop: "0.1rem",
                        paddingBottom: "0.1rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Meta
                    </td>
                    {songCols.map((label, idx) => (
                      <td key={label} style={{ padding: "0.1rem 0.2rem" }}>
                        {/* For now we just light up the FIRST column when Meta is Master Saved. */}
                        <div style={checklistCellStyle(metaMasterSaved && idx === 0)}>
                          {metaMasterSaved && idx === 0 ? "✓" : ""}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Return status column with a check box only */}
          <div style={{ width: "190px" }}>
            <div
              style={{
                padding: "0.35rem 0.6rem",
                borderBottom: "1px solid #999",
                fontWeight: 600,
              }}
            >
              Return status
            </div>
            <div
              style={{
                padding: "0.6rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Big box with check only if Meta Master Save is done */}
              <div
                style={{
                  width: "2.2rem",
                  height: "2.2rem",
                  borderRadius: "4px",
                  border: "2px solid #333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  backgroundColor: metaMasterSaved ? "#20b84f" : "#fff",
                  color: metaMasterSaved ? "#fff" : "#000",
                }}
              >
                {metaMasterSaved ? "✓" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Tiny footer note so we remember what’s wired up */}
        <div
          style={{
            padding: "0.25rem 0.6rem 0.4rem",
            fontSize: "0.75rem",
            opacity: 0.8,
          }}
        >
          In this dev build, the checklist and status only turn green when{" "}
          <strong>Meta Master Save</strong> has been completed on the Meta page.
        </div>
      </div>
    );
  };

  // ---- MAIN RENDER ---------------------------------------------------------

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0.75rem" }}>
      {renderHeaderBar()}

      {renderReturnedFilesChecklist()}

      {renderTabs()}

      {/* Tab content */}
      {tab === "home" && (
        <HomePage
          project={currentProject}
          onSongTitlesChange={handleSongTitlesChangeFromHome}
          onProjectUpdate={handleProjectUpdate}
        />
      )}

      {tab === "meta" && (
  <MiniMeta projectId={projectId} onMasterSave={handleMetaMasterSave} />
)}



      {tab === "songs" && (
        <SongsPage
          project={currentProject}
          onProjectUpdate={handleProjectUpdate}
          showDashboardButton={showDashboardButton}
          onGoDashboard={onGoDashboard}
        />
      )}

      {/* Optional display of when Meta was master saved, just for debugging */}
      {metaMasterSavedAt && (
        <div
          style={{
            marginTop: "0.75rem",
            fontSize: "0.75rem",
            opacity: 0.8,
            textAlign: "right",
          }}
        >
          Meta master saved at: {metaMasterSavedAt}
        </div>
      )}
    </div>
  );
}

export default ProducerProjectLayout;
