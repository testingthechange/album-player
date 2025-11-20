import React from "react";

export function MiniSongs({ songTitles, songLocks, onToggleLock }) {
  const rows = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div>
      <h2>Songs (Mini-Site)</h2>
      <p>Lock state is shared and controlled by Mini-Site.</p>

      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>#</th>
            <th>Title (auto)</th>
            <th>Locked?</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((n, idx) => (
            <tr key={n}>
              <td>{n}</td>
              <td>{songTitles[idx] || <i>(no title yet)</i>}</td>
              <td>
                <button type="button" onClick={() => onToggleLock(idx)}>
                  {songLocks[idx] ? "🔒 Locked" : "🔓 Unlocked"}
                </button>
              </td>
              <td>
                <textarea
                  placeholder="Song notes"
                  style={{ width: "100%" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
