import React from "react";
import { createInitialProjectsState } from "../../state/projectState";

export function ProducerDashboard({ onOpenMiniSiteFromDashboard }) {
  const [projectState] = React.useState(createInitialProjectsState());
  const projects = projectState.projects;

  const handleOpenMini = () => {
    if (onOpenMiniSiteFromDashboard) {
      onOpenMiniSiteFromDashboard();
    }
  };

  return (
    <div>
      <h1>Producer Dashboard</h1>

      <div style={{ marginBottom: "1rem" }}>
        <button type="button" onClick={handleOpenMini}>
          Open Mini-Site
        </button>
      </div>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Project</th>
            <th>Artist</th>
            <th>Producer</th>
            <th>Status</th>
            <th>Producer Return</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.projectId}>
              <td>{p.title}</td>
              <td>{p.artistName}</td>
              <td>{p.assignedProducerName}</td>
              <td>{p.producerReturnReceived ? "In Progress" : "Draft"}</td>
              <td>{p.producerReturnReceived ? "✅" : "⭕"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

