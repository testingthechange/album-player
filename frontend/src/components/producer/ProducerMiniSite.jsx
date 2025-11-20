// src/components/producer/ProducerMiniSite.jsx
import React from "react";
import { ProducerProjectLayout } from "./ProducerProjectLayout";

/**
 * Dev Mini-Site wrapper.
 * This uses the new Home / Meta / Songs layout and shared project state.
 */
export function ProducerMiniSite() {
  return (
    <div>
      <ProducerProjectLayout />
    </div>
  );
}
