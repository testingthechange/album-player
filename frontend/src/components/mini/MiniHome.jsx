import React from "react";

export function MiniHome({ songTitles, onChangeTitle }) {
  const rows = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div>
      <h2>Home (Mini-Site)</h2>
      <p>Type song titles here – they will auto-appear in Meta, Songs, and Mix.</p>

      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>#</th>
            <th>Song Title</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((n, idx) => (
            <tr key={n}>
              <td>{n}</td>
              <td>
                <input
                  type="text"
                  placeholder={`Song ${n} title`}
                  style={{ width: "100%" }}
                  value={songTitles[idx] || ""}
                  onChange={(e) => onChangeTitle(idx, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
