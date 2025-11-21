// src/components/producer/ProducerProjectLayout.jsx
import React from "react";
import { HomePage } from "../Home/HomePage";
import MiniMeta from "../mini/MiniMeta";
import { SongsPage } from "../Songs/SongsPage";
import { createInitialProjectsState } from "../../state/projectState";

function createDefaultProjects() {
  return createInitialProjectsState();
}

export function ProducerProjectLayout({
  projectId,
  showDashboardButton = true,
  onGoDashboard,
}) {
  const [tab, setTab] = React.useState("home");

  const [projectState, setProjectState] = React.useState(() =>
    createDefaultProjects()
  );

  const projects = projectState.projects || [];
  const projectIndex = Math.max(
    0,
    projects.findIndex((p) => p.projectId === projectId)
  );
  const currentProject = projects[projectIndex] || projects[0];

  if (!currentProject) {
    return <div>No project found.</div>;
  }

  const handleProjectUpdate = (partial) => {
    setProjectState((prev) => {
      const prevProjects = prev.projects || [];
      const idx = Math.max(
        0,
        prevProjects.findIndex((p) => p.projectId === projectId)
      );
      const updated = { ...prevProjects[idx], ...partial };
      const next = [...prevProjects];
      next[idx] = updated;
      return { ...prev, projects: next };
    });
  };

  // ---- STATUS FLAGS --------------------------------------------------------
  const homeMasterSaved = !!currentProject.homeMasterSaved;
  const songsMasterSaved = !!currentProject.songsMasterSaved;

  const metaFromProject = currentProject.meta || {};
  const metaMasterSaved =
    !!currentProject.metaMasterSaved ||
    !!(metaFromProject && metaFromProject.masterSaved);

  // ---- CHECKLIST CELL STYLE ------------------------------------------------
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

  // ---- RETURNED FILES CHECKLIST --------------------------------------------
  const renderReturnedFilesChecklist = () => {
    const songCols = Array.from({ length: 9 }).map((_, i) => `Song ${i + 1}`);

    return (
      <div style={{ marginBottom: "1rem", border: "1px solid #999", borderRadius: "4px" }}>
        <div style={{ padding: "0.35rem 0.6rem", borderBottom: "1px solid #999", fontWeight: 600 }}>
          Returned files checklist
        </div>

        <div style={{ display: "flex" }}>
          {/* LEFT SIDE GRID */}
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

            <div style={{ overflowX: "auto", padding: "0.35rem 0.6rem 0.6rem" }}>
              <table style={{ borderCollapse: "collapse", minWidth: "100%", fontSize: "0.85rem" }}>
                <thead>
                  <tr>
                    <th style={{ paddingRight: "0.75rem" }} />
                    {songCols.map((label) => (
                      <th key={label} style={{ textAlign: "center" }}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>

                  {/* ⭐ Album (Home Master Save) */}
                  <tr>
                    <td style={{ paddingRight: "0.75rem", whiteSpace: "nowrap" }}>Album</td>
                    {songCols.map((label, idx) => (
                      <td key={label}>
                        <div style={checklistCellStyle(homeMasterSaved && idx === 0)}>
                          {homeMasterSaved && idx === 0 ? "✓" : ""}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* ⭐ Extended (Songs Master Save) */}
                  <tr>
                    <td style={{ paddingRight: "0.75rem", whiteSpace: "nowrap" }}>Extended</td>
                    {songCols.map((label, idx) => (
                      <td key={label}>
                        <div style={checklistCellStyle(songsMasterSaved && idx === 0)}>
                          {songsMasterSaved && idx === 0 ? "✓" : ""}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* NFT Placeholder */}
                  <tr>
                    <td style={{ paddingRight: "0.75rem" }}>NFT</td>
                    {songCols.map((label) => (
                      <td key={label}>
                        <div style={checklistCellStyle(false)} />
                      </td>
                    ))}
                  </tr>

                  {/* ⭐ Meta (Meta Master Save) */}
                  <tr>
                    <td style={{ paddingRight: "0.75rem" }}>Meta</td>
                    {songCols.map((label, idx) => (
                      <td key={label}>
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

          {/* RIGHT SIDE STATUS BOX */}
          <div style={{ width: "190px" }}>
            <div style={{ padding: "0.35rem 0.6rem", borderBottom: "1px solid #999", fontWeight: 600 }}>
              Return status
            </div>

            <div style={{ padding: "0.6rem", display: "flex", justifyContent: "center" }}>
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
                  backgroundColor:
                    homeMasterSaved || songsMasterSaved || metaMasterSaved
                      ? "#20b84f"
                      : "#fff",
                  color:
                    homeMasterSaved || songsMasterSaved || metaMasterSaved
                      ? "#fff"
                      : "#000",
                }}
              >
                {homeMasterSaved || songsMasterSaved || metaMasterSaved ? "✓" : ""}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem", opacity: 0.8 }}>
          Album → Home Master Save • Extended → Songs Master Save • Meta → Meta Master Save
        </div>
      </div>
    );
  };

  // ---- MAIN RENDER ---------------------------------------------------------
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0.75rem" }}>
      {renderReturnedFilesChecklist()}

      {/* Tabs */}
      <div style={{ marginBottom: "0.75rem" }}>
        <button onClick={() => setTab("home")} style={{ marginRight: "0.5rem" }}>Home</button>
        <button onClick={() => setTab("meta")} style={{ marginRight: "0.5rem" }}>Meta</button>
        <button onClick={() => setTab("songs")}>Songs</button>
      </div>

      {tab === "home" && (
        <HomePage project={currentProject} onProjectUpdate={handleProjectUpdate} />
      )}

      {tab === "meta" && (
        <MiniMeta projectId={projectId} onMasterSave={(id, data) =>
          handleProjectUpdate({
            metaMasterSaved: true,
            metaMasterSavedAt: data.savedAt,
            meta: { ...data, masterSaved: true, masterSavedAt: data.savedAt }
          })
        } />
      )}

      {tab === "songs" && (
        <SongsPage project={currentProject} onProjectUpdate={handleProjectUpdate} />
      )}
    </div>
  );
}

export default ProducerProjectLayout;
