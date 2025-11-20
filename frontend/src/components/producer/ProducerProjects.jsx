import React from "react";

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
            <th>Returned files checklist</th>
            <th>Return status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.projectId}>
              <td>{p.name}</td>
              <td>{p.date}</td>
              <td>
                <button
                  type="button"
                  onClick={() => handleSendMagicLink(p.projectId)}
                >
                  {p.magicLinkSent ? "Resend magic link" : "Send magic link"}
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
                {/* Boxed returned files area (placeholder) */}
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
                  <div>Album · Extended songs · Song 2 · Song 5 · Song 8</div>
                  <div>NFT · Song 1 · Song 3 · Song 4 · Song 6 · Song 7 · Song 9</div>
                </div>
              </td>
              <td>
                {p.producerReturnReceived ? "✅ Received" : "⭕ Waiting"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
        The boxed area is a placeholder for files/data that come back after the
        producer uses the worksheet and saves Master Save. A green check will
        show when the return is marked as received.
      </p>
    </div>
  );
}
