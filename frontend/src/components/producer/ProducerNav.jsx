import React from "react";

export function ProducerNav({ mode = "admin", onNavChange }) {
  const isAdmin = mode === "admin" || mode === "mini";

  if (!isAdmin) {
    return null;
  }

  return (
    <nav style={{ marginBottom: "1rem" }}>
      <button type="button" onClick={() => onNavChange("dashboard")}>
        Dashboard
      </button>
      <button
        type="button"
        style={{ marginLeft: "0.5rem" }}
        onClick={() => onNavChange("producers")}
      >
        Producers
      </button>
    </nav>
  );
}
