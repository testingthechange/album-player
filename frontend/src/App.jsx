// src/App.jsx
import React from "react";
import "./App.css";

import { ProducerDashboard } from "./components/producer/ProducerDashboard";
import { ProducerProjects } from "./components/producer/ProducerProjects";
import { CreateProducer } from "./components/producer/CreateProducer";

import { MiniSiteHeader } from "./components/mini/MiniSiteHeader";
import { ProducerProjectLayout } from "./components/producer/ProducerProjectLayout";

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const magicTest = urlParams.get("magicTest") === "true";

  const [view, setView] = React.useState("dashboard");
  const [currentProducerId, setCurrentProducerId] =
    React.useState("prod_001");
  const [currentProjectId, setCurrentProjectId] =
    React.useState("proj_001");

  const isMiniView = view === "miniSite" || magicTest;

  const handleSelectProducer = (producerId) => {
    setCurrentProducerId(producerId);
    setView("producerProjects");
  };

  const handleOpenProject = (projectId) => {
    setCurrentProjectId(projectId);
    setView("miniSite");
  };

  const handleOpenMiniFromDashboard = () => {
    setView("miniSite");
  };

  // Header title on the right
  const headerTitle = isMiniView ? "Mini-Site" : "Producer";

  return (
    <div style={{ padding: "1rem" }}>
      {/* Top header bar – hidden for magic-link mode */}
      {!magicTest && (
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => setView("dashboard")}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setView("producers")}
            >
              Producers
            </button>
            <button
              type="button"
              onClick={() => setView("miniSite")}
            >
              Mini-Site
            </button>
          </div>

          <div
            style={{
              fontSize: "1.35rem",
              fontWeight: 700,
            }}
          >
            {headerTitle}
          </div>
        </header>
      )}

      {/* MAIN CONTENT */}

      {/* Dashboard */}
      {!magicTest && view === "dashboard" && (
        <ProducerDashboard
          onOpenMiniSiteFromDashboard={handleOpenMiniFromDashboard}
        />
      )}

      {/* Producers list / create */}
      {!magicTest && view === "producers" && (
        <CreateProducer onSelectProducer={handleSelectProducer} />
      )}

      {/* Projects for a producer */}
      {!magicTest && view === "producerProjects" && (
        <ProducerProjects
          producerId={currentProducerId}
          onOpenMiniSite={handleOpenProject}
        />
      )}

      {/* Mini-Site in admin mode OR magic-link mode */}
      {isMiniView && (
        <div>
          {/* In magic-link mode, show its own title since header is hidden */}
          {magicTest && <h1>Mini-Site</h1>}

          <MiniSiteHeader
            mode={magicTest ? "magic" : "admin"}
            projectId={currentProjectId}
            producerName={magicTest ? "Magic-Link Producer" : "Demo Producer"}
            expiresAt={magicTest ? "2025-12-31" : ""}
          />

          <ProducerProjectLayout
            projectId={currentProjectId}
            showDashboardButton={!magicTest}
            onGoDashboard={() => setView("dashboard")}
          />
        </div>
      )}
    </div>
  );
}

export default App;
