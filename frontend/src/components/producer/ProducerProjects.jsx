// src/components/producer/ProducerProjects.jsx
import React from "react";
import ReturnChecklist from "../ReturnChecklist";
import { hasMetaReturn } from "../../state/localProjectStorage";

const initialProjectsByProducer = {
  prod_001: [
    {
      projectId: "proj_001",
      name: "Demo Album One",
      date: "2025-12-01",
      magicLinkSent: false,
      producerReturnReceived: true,
    },
  ],
  prod_002: [
    {
      projectId: "proj_002",
      name: "NFT Release",
      date: "2025-12-15",
      magicLinkSent: false,
      producerReturnReceived: false,
    },
  ],
};

export function ProducerProjects({ producerId, onOpenMiniSite }) {
  const [projectsByProducer, setProjectsByProducer] = React.useState(
    initialProjectsByProducer
  );

  const projects = projectsByProducer[producerId] || [];

  const [form, setForm] = React.useState({
    name: "",
    date: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!form.name) return;

    const newProject = {
      projectId: `proj_${String(projects.length + 1).padStart(3, "0")}`,
      name: form.name,
      date: form.date || "",
      magicLinkSent: false,
      producerReturnReceived: false,
    };

    setProjectsByProducer((prev) => ({
      ...prev,
      [producerId]: [...(prev[producerId] || []), newProject],
    }));

    setForm({ name: "", date: "" });
  };

  const handleSendMagicLink = (projectId) => {
    console.log("Send magic link for", projectId, "to producer", producerId);

    setProjectsByProducer((prev) => {
      const list = prev[producerId] || [];
      const updated = list.map((p) =>
        p.projectId === projectId ? { ...p, magicLinkSent: true } : p
      );
      return { ...prev, [producerId]: updated };
    });
  };

  const handleOpenMini = (projectId) => {
    if (onOpenMiniSite) {
      onOpenMiniSite(projectId);
    }
  };

  return (
    <div>
      <h1>Projects for Producer: {producerId}</h1>

      {/* Create a project */}
      <h2>Create a Project</h2>
      <form onSubmit={handleCreateProject} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Name of project"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <input
          type="date"
          placeholder="Date"
          value={form.date}
          onChange={(e) => handleChange("date", e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
        <button type="submit" style={{ marginLeft: "0.5rem" }}>
          Create
        </button>
      </form>

      {/* Projects list */}
      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>Name of project</th>
            <th>Date</th>
            <th>Magic link</th>
            <th>Open Mini-Site</th>
            <th>Returned Files</th>
            <th>Return status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            // Meta is considered "returned" if either:
            // - storage has a Meta return for this project, OR
            // - the old flag is set (fallback)
            const metaReturned =
              hasMetaReturn(p.projectId) || p.producerReturnReceived;

            return (
              <tr key={p.projectId}>
                <td>{p.name}</td>
                <td>{p.date}</td>

                <td>
                  <button
                    type="button"
                    onClick={() => handleSendMagicLink(p.projectId)}
                  >
                    {p.magicLinkSent
                      ? "Resend magic link"
                      : "Send magic link"}
                  </button>
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() => handleOpenMini(p.projectId)}
                  >
                    Open Mini-Site
                  </button>
                </td>

                <td>
                  <ReturnChecklist metaReturned={metaReturned} />
                </td>

                <td>{metaReturned ? "✅ Received" : "⭕ Waiting"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
        Returned files and status update automatically when the producer
        completes Master Save on the mini-site Meta worksheet.
      </p>
    </div>
  );
}
