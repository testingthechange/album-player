// src/components/producer/ProducerProjectLayout.jsx
import React from "react";
import { HomePage } from "../Home/HomePage";
import { MetaPage } from "../Meta/MetaPage";
import { SongsPage } from "../Songs/SongsPage";
import { createInitialProjectsState } from "../../state/projectState";

/**
 * We now use createInitialProjectsState() only.
 * No more load/save draft from state/projectState – it's all in-memory for now.
 */

function createDefaultProjects() {
  // If you ever want a custom default beyond createInitialProjectsState,
  // you can adjust this, but for now we'll just reuse the shared helper.
  return createInitialProjectsState();
}

export function ProducerProjectLayout({
  projectId,
  showDashboardButton = true,
  onGoDashboard,
}) {
  const [tab, setTab] = React.useState("home");

  // Initialize from shared state helper
  const [projectState, setProjectState] = React.useState(() =>
    createDefaultProjects()
  );

  const projects = projectState.projects || [];
  const projectIndex = Math.max(
    0,
    projects.findIndex((p) => p.projectId === projectId)
  );
  const currentProject = projects[projectIndex] || projects[0];

  const handleProjectUpdate = (partial) => {
    setProjectState((prev) => {
      const prevProjects = prev.projects || [];
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

  if (!currentProject) {
    return <div>No project found.</div>;
  }

  return (
    <div>
      {/* Small header for context inside mini-site */}
      <div
        style={{
          marginBottom: "1rem",
          padding: "0.25rem 0.5rem",
          fontSize: "0.85rem",
          borderBottom: "1px solid #ddd",
        }}
      >
        <strong>Project:</strong> {currentProject.title || currentProject.projectId}
        {" · "}
        <strong>Artist:</strong> {currentProject.artistName || "Unknown"}
        {" · "}
        <strong>Producer:</strong>{" "}
        {currentProject.assignedProducerName || "Unknown"}
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          onClick={() => setTab("home")}
          style={{ marginRight: "0.5rem" }}
        >
          Home
        </button>
        <button
          type="button"
          onClick={() => setTab("meta")}
          style={{ marginRight: "0.5rem" }}
        >
          Meta
        </button>
        <button
          type="button"
          onClick={() => setTab("songs")}
          style={{ marginRight: "0.5rem" }}
        >
          Songs
        </button>
      </div>

      {/* Tab content */}
      {tab === "home" && (
        <HomePage
          project={currentProject}
          onSongTitlesChange={handleSongTitlesChangeFromHome}
          onProjectUpdate={handleProjectUpdate}
        />
      )}

      {tab === "meta" && (
        <MetaPage
          project={currentProject}
          onProjectUpdate={handleProjectUpdate}
        />
      )}

      {tab === "songs" && (
        <SongsPage
          project={currentProject}
          onProjectUpdate={handleProjectUpdate}
          showDashboardButton={showDashboardButton}
          onGoDashboard={onGoDashboard}
        />
      )}
    </div>
  );
}
