// src/components/producer/ProducerMiniSite.jsx
import React from "react";
import { ProducerProjectLayout } from "./ProducerProjectLayout";

/**
 * Dev Mini-Site wrapper.
 * This uses the new Home / Meta / Songs layout and shared project state.
 *
 * Props:
 * - projectId: string (required) – which project is currently open
 */
export function ProducerMiniSite({ projectId }) {
  return (
    <div>
      <ProducerProjectLayout projectId={projectId} />
    </div>
  );
}
