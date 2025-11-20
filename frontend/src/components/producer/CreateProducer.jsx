import React from "react";

const initialProducers = [
  {
    producerId: "prod_001",
    name: "John Doe",
    company: "XXX",
    email: "john@example.com",
    cell: "123",
  },
  {
    producerId: "prod_002",
    name: "Jane Smith",
    company: "YYY",
    email: "jane@example.com",
    cell: "124",
  },
];

export function CreateProducer({ onSelectProducer }) {
  const [producers, setProducers] = React.useState(initialProducers);

  const [form, setForm] = React.useState({
    name: "",
    company: "",
    email: "",
    cell: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name) return;

    const newProducer = {
      producerId: `prod_${String(producers.length + 1).padStart(3, "0")}`,
      ...form,
    };

    setProducers((prev) => [...prev, newProducer]);
    setForm({ name: "", company: "", email: "", cell: "" });
  };

  const handleRowClick = (producerId) => {
    if (onSelectProducer) {
      onSelectProducer(producerId);
    }
  };

  return (
    <div>
      <h1>Producer Page</h1>

      {/* Create a producer */}
      <h2>Create a Producer</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <input
          type="text"
          placeholder="Company"
          value={form.company}
          onChange={(e) => handleChange("company", e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Cell"
          value={form.cell}
          onChange={(e) => handleChange("cell", e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
        <button type="submit" style={{ marginLeft: "0.5rem" }}>
          Create
        </button>
      </form>

      {/* Producer accounts table */}
      <h2>Producer Accounts</h2>
      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Cell</th>
          </tr>
        </thead>
        <tbody>
          {producers.map((p) => (
            <tr
              key={p.producerId}
              style={{ cursor: "pointer" }}
              onClick={() => handleRowClick(p.producerId)}
            >
              <td>{p.producerId}</td>
              <td>{p.name}</td>
              <td>{p.company}</td>
              <td>{p.email}</td>
              <td>{p.cell}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
        Click a producer row to open that producer&apos;s projects page.
      </p>
    </div>
  );
}
