import React from "react";

export function MixPlayerShell({ songTitles }) {
  return (
    <div>
      <h2>Mix Player (Shell)</h2>
      <p>
        No audio engine yet – this is just a planning UI wired to the same song
        titles as the rest of the mini-site.
      </p>

      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>#</th>
            <th>Song Title</th>
            <th>Include in Mix?</th>
          </tr>
        </thead>
        <tbody>
          {songTitles.map((title, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{title || <em>(empty)</em>}</td>
              <td>
                <input type="checkbox" defaultChecked />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "1rem" }}>
        <button type="button">
          ▶️ Preview Mix (placeholder)
        </button>
      </div>
    </div>
  );
}
