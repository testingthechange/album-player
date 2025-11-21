// src/components/producer/ProducerDashboard.jsx
import React from "react";
import { createInitialProjectsState } from "../../state/projectState";
import {
  hasMetaReturn,
  hasSongsReturn,
} from "../../state/localProjectStorage";

export function ProducerDashboard({ onOpenMiniSiteFromDashboard }) {
  const [projectState] = React.useState(createInitialProjectsState);
  const projects = projectState.projects || [];

  const handleOpenMini = () => {
    if (onOpenMiniSiteFromDashboard) {
      onOpenMiniSiteFromDashboard();
    }
  };

  return (
    <div>
      <h1>Producer Dashboard</h1>

      <button
        type="button"
        onClick={handleOpenMini}
        style={{ marginBottom: "0.75rem" }}
      >
        Open Mini-Site
      </button>

      <table
        border="1"
        cellPadding="6"
        cellSpacing="0"
        style={{ width: "100%", fontSize: "0.9rem" }}
      >
        <thead>
          <tr>
            <th>Project</th>
            <th>Artist</th>
            <th>Producer</th>
            <th>Status</th>
            <th>Producer Return</th>
            <th>File Return Checklist</th>
            <th>Return Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            const projectId = p.projectId;

            // Meta + Songs (Extended) return flags from storage or in-memory
            const metaReturned =
              hasMetaReturn(projectId) || p.producerReturnReceived;

            const songsReturned =
              hasSongsReturn(projectId) || !!p.songsMasterSaved;

            // Overall "producer return" – any section returned
            const anyReturned = metaReturned || songsReturned;

            return (
              <tr key={projectId}>
                <td>{p.title || p.projectName || "Untitled project"} </td>
                <td>{p.artistName || "Unknown artist"}</td>
                <td>{p.assignedProducerName || p.producerName || "Producer"}</td>
                <td>{p.status || "Draft"}</td>

                {/* Producer Return column */}
                <td style={{ textAlign: "center" }}>
                  {anyReturned ? "✅" : "⭕"}
                </td>

                {/* File Return Checklist column */}
                <td>
                  <div
                    style={{
                      border: "1px solid black",
                      padding: "4px",
                      fontSize: "0.85rem",
                    }}
                  >
                    <div>
                      <strong>Returned files</strong>
                    </div>

                    <div style={{ marginTop: "2px" }}>
                      <strong>Meta</strong>:{" "}
                      {metaReturned ? "✅ Returned" : "⬜ Pending"}
                    </div>

                    <div style={{ marginTop: "2px" }}>
                      <strong>Extended (Songs)</strong>:{" "}
                      {songsReturned ? "✅ Returned" : "⬜ Pending"}
                    </div>

                    <div style={{ marginTop: "2px" }}>
                      Album · NFT · Other rows TBD
                    </div>
                  </div>
                </td>

                {/* Return Status column */}
                <td>
                  <div style={{ fontSize: "0.8rem", color: "#444" }}>
                    <div>
                      <strong>Meta:</strong>{" "}
                      {metaReturned ? "✅ Returned" : "⬜ Pending"}
                    </div>
                    <div>
                      <strong>Extended (Songs):</strong>{" "}
                      {songsReturned ? "✅ Returned" : "⬜ Pending"}
                    </div>
                    <div>Album: ⬜ Pending</div>
                    <div>NFT: ⬜ Pending</div>
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

export default ProducerDashboard;
