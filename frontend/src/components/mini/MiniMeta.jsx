import React from "react";

export function MiniMeta({ songTitles }) {
  return (
    <div>
      <h2>Meta</h2>
      <p>This page auto-reads song titles from the Home tab.</p>

      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>#</th>
            <th>Song Title</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {songTitles.map((title, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{title || <em>(empty)</em>}</td>
              <td>
                <textarea
                  placeholder="Notes (placeholder)"
                  style={{ width: "100%", height: "40px" }}
                  disabled
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

