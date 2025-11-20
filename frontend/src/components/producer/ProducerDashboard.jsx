// src/components/producer/ProducerDashboard.jsx
import React from "react";
import { createInitialProjectsState } from "../../state/projectState";

export function ProducerDashboard({ onOpenMiniSiteFromDashboard }) {
  const [projectState] = React.useState(createInitialProjectsState());
  const projects = projectState.projects || [];

  const handleOpenMini = () => {
    if (onOpenMiniSiteFromDashboard) {
      onOpenMiniSiteFromDashboard();
    }
  };

  return (
    <div>
      <h1>Producer Dashboard</h1>

      {/* Top controls */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <button type="button" onClick={handleOpenMini}>
          Open Mini-Site
        </button>
      </div>

      {/* Projects table */}
      <table
        border="1"
        cellPadding="6"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Project</th>
            <th>Artist</th>
            <th>Producer</th>
            <th>Status</th>
            <th>Producer Return</th>
            <th style={{ width: "26rem" }}>File Return Checklist</th>
            <th style={{ width: "10rem" }}>Return Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            const metaDone = !!p.metaMasterSaved || !!p.metaReturnReceived;

            return (
              <tr key={p.projectId}>
                <td>{p.title}</td>
                <td>{p.artistName}</td>
                <td>{p.assignedProducerName}</td>

                {/* Old status (you can refine later) */}
                <td>{p.producerReturnReceived ? "In Progress" : "Draft"}</td>

                {/* Old icon (placeholder) */}
                <td>{p.producerReturnReceived ? "✅" : "⭕"}</td>

                {/* FILE RETURN CHECKLIST (visual only for now) */}
                <td>
                  <div
                    style={{
                      border: "2px solid #000",
                      padding: "0.45rem 0.6rem",
                      fontSize: "0.85rem",
                      display: "inline-block",
                      minWidth: "240px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        marginBottom: "0.25rem",
                      }}
                    >
                      Returned files
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.35rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {/* Meta – first, and bold because it’s the one wired up */}
                      <span>
                        <strong>Meta</strong>
                      </span>
                      <span>· Album</span>
                      <span>· Extended songs</span>
                      <span>· NFT mix</span>
                      <span>· Song 1</span>
                      <span>· Song 2</span>
                      <span>· Song 3</span>
                      <span>· Song 4</span>
                      <span>· Song 5</span>
                      <span>· Song 6</span>
                      <span>· Song 7</span>
                      <span>· Song 8</span>
                      <span>· Song 9</span>
                    </div>
                  </div>
                </td>

                {/* RETURN STATUS – only Meta is truly wired to logic right now */}
                <td>
                  <div style={{ fontSize: "0.85rem" }}>
                    <div style={{ marginBottom: "0.25rem" }}>
                      <span style={{ fontWeight: 600 }}>Meta:</span>{" "}
                      {metaDone ? (
                        <span style={{ color: "#0a7a28" }}>✅ Received</span>
                      ) : (
                        <span style={{ color: "#999" }}>⬜ Pending</span>
                      )}
                    </div>

                    {/* The rest are placeholders for later integration */}
                    <div style={{ opacity: 0.75 }}>
                      <div>Album: ⬜ Pending</div>
                      <div>Extended: ⬜ Pending</div>
                      <div>NFT mix: ⬜ Pending</div>
                      <div>Songs 1–9: ⬜ Pending</div>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
