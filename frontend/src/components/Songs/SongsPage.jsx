import React from "react";

// Lock button styling helper
function getLockButtonStyle(locked) {
  return {
    minWidth: "5rem",
    fontSize: "0.8rem",
    padding: "0.2rem 0.6rem",
    borderRadius: "4px",
    border: "1px solid",
    borderColor: locked ? "#d33" : "#2f8f3c",
    backgroundColor: locked ? "#ffe5e5" : "#e6ffea",
    color: locked ? "#700" : "#084c10",
    cursor: "pointer",
  };
}

// Build 9 extended songs (same shape as Home Section 2)
function buildExtendedSongs(project) {
  const incoming = project.extendedSongs || [];
  const max = 9;
  return Array.from({ length: max }).map((_, i) => {
    const existing = incoming[i] || {};
    const n = i + 1;
    return {
      songId: existing.songId || `ext-${n}`,
      title: existing.title || "",
      filePath: existing.filePath || "",
      locked: !!existing.locked,
    };
  });
}

/**
 * Build per-song bridge sheets:
 * - 9 “song pages”
 * - For each page N (0–8), make rows connecting that mother song
 *   to the remaining child songs.
 *
 * Data stored in project.songBridgeSheets (optional) as:
 *  [
 *    [ { id, fromIndex, toIndex, bridgeFilePath, locked }, ... ], // song 1 page
 *    [ ... ], // song 2 page
 *    ...
 *  ]
 */
function buildSongBridgeSheets(project) {
  const incoming = project.songBridgeSheets || [];
  const maxSongs = 9;
  const sheets = [];

  for (let motherIndex = 0; motherIndex < maxSongs; motherIndex += 1) {
    const existingSheet = incoming[motherIndex] || [];
    const rows = [];

    for (let childIndex = 0; childIndex < maxSongs; childIndex += 1) {
      if (childIndex === motherIndex) continue;

      const existingRow =
        existingSheet.find(
          (r) =>
            typeof r === "object" &&
            r != null &&
            r.fromIndex === motherIndex &&
            r.toIndex === childIndex
        ) || {};

      const id =
        existingRow.id ||
        `song-${motherIndex + 1}-to-${childIndex + 1}`;

      rows.push({
        id,
        fromIndex: motherIndex,
        toIndex: childIndex,
        bridgeFilePath: existingRow.bridgeFilePath || "",
        locked: !!existingRow.locked,
      });
    }

    sheets.push(rows);
  }

  return sheets;
}

/**
 * Web Audio helpers – build a single WAV from multiple URLs
 * Used for Player 2 mix preview.
 */
async function buildMixFromUrls(urls) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContextClass();

  const buffers = [];
  for (const url of urls) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    buffers.push(audioBuffer);
  }

  const concatBuffer = concatAudioBuffers(audioContext, buffers);
  const wavArrayBuffer = audioBufferToWav(concatBuffer);
  const blob = new Blob([wavArrayBuffer], { type: "audio/wav" });
  const objectUrl = URL.createObjectURL(blob);
  return objectUrl;
}

function concatAudioBuffers(audioContext, buffers) {
  const sampleRate = audioContext.sampleRate;
  const numChannels = Math.max(...buffers.map((b) => b.numberOfChannels));
  const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);

  const output = audioContext.createBuffer(numChannels, totalLength, sampleRate);

  let offset = 0;
  buffers.forEach((buffer) => {
    for (let channelIndex = 0; channelIndex < numChannels; channelIndex += 1) {
      const outChannel = output.getChannelData(channelIndex);
      const inChannel =
        buffer.getChannelData(
          Math.min(channelIndex, buffer.numberOfChannels - 1)
        );
      outChannel.set(inChannel, offset);
    }
    offset += buffer.length;
  });

  return output;
}

function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const numSamples = buffer.length;
  const blockAlign = (numChannels * bitDepth) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const bufferLength = 44 + dataSize;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  let offset = 0;

  function writeString(str) {
    for (let i = 0; i < str.length; i += 1) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
    offset += str.length;
  }

  // RIFF header
  writeString("RIFF");
  view.setUint32(offset, 36 + dataSize, true);
  offset += 4;
  writeString("WAVE");

  // fmt chunk
  writeString("fmt ");
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, format, true);
  offset += 2;
  view.setUint16(offset, numChannels, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, byteRate, true);
  offset += 4;
  view.setUint16(offset, blockAlign, true);
  offset += 2;
  view.setUint16(offset, bitDepth, true);
  offset += 2;

  // data chunk
  writeString("data");
  view.setUint32(offset, dataSize, true);
  offset += 4;

  const channels = [];
  for (let c = 0; c < numChannels; c += 1) {
    channels.push(buffer.getChannelData(c));
  }

  let sampleIndex = 0;
  for (let i = 0; i < numSamples; i += 1) {
    for (let c = 0; c < numChannels; c += 1) {
      const sample = channels[c][i] || 0;
      let s = Math.max(-1, Math.min(1, sample));
      s = s < 0 ? s * 0x8000 : s * 0x7fff;
      view.setInt16(offset + sampleIndex * 2, s, true);
      sampleIndex += 1;
    }
  }

  return arrayBuffer;
}

export function SongsPage({ project, onProjectUpdate }) {
  // Pull extended songs from project (Section 2 on Home)
  const [extendedSongs, setExtendedSongs] = React.useState(() =>
    buildExtendedSongs(project)
  );

  // Per-song pages: 9 sheets of mother→children bridge rows
  const [songBridgeSheets, setSongBridgeSheets] = React.useState(() =>
    buildSongBridgeSheets(project)
  );

  // Which song page is active (0–8 → Song 1–9)
  const [selectedSongIndex, setSelectedSongIndex] = React.useState(0);

  // Mix preview URLs and messages per row
  const [mixUrls, setMixUrls] = React.useState({}); // { rowId: objectUrl }
  const [mixMessages, setMixMessages] = React.useState({}); // { rowId: string }
  const [mixBuildingRowId, setMixBuildingRowId] = React.useState(null);

  // Audio URLs shared from Home via project.homeAudioUrls
  const audioUrls = project.homeAudioUrls || {};

  // Rebuild extended songs and sheets if project changes
  React.useEffect(() => {
    const ext = buildExtendedSongs(project);
    setExtendedSongs(ext);
    setSongBridgeSheets(buildSongBridgeSheets(project));
  }, [project.extendedSongs, project.songBridgeSheets]);

  // Helper to push updated sheets to project
  const propagateSheets = (updatedSheets) => {
    setSongBridgeSheets(updatedSheets);
    if (onProjectUpdate) {
      onProjectUpdate({ songBridgeSheets: updatedSheets });
    }
  };

  // Change current song page (mother song)
  const handleSongPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (Number.isNaN(value)) return;
    const idx = Math.min(Math.max(value - 1, 0), 8);
    setSelectedSongIndex(idx);
  };

  // Handle bridge upload for a row on current page
  const handleBridgeFileChange = (rowId, files) => {
    const currentSheet = songBridgeSheets[selectedSongIndex] || [];
    const rowIndex = currentSheet.findIndex((r) => r.id === rowId);
    if (rowIndex === -1) return;

    const row = currentSheet[rowIndex];
    if (row.locked) return;
    if (!files || files.length === 0) return;

    const file = files[0];
    const url = URL.createObjectURL(file);

    // Update sheet with file name
    const updatedSheet = currentSheet.map((r) =>
      r.id === rowId ? { ...r, bridgeFilePath: file.name } : r
    );

    const updatedSheets = songBridgeSheets.map((sheet, idx) =>
      idx === selectedSongIndex ? updatedSheet : sheet
    );

    // Save bridge URL into shared homeAudioUrls map on project
    const existingMap = project.homeAudioUrls || {};
    const nextMap = { ...existingMap, [rowId]: url };

    if (onProjectUpdate) {
      onProjectUpdate({
        songBridgeSheets: updatedSheets,
        homeAudioUrls: nextMap,
      });
    }

    setSongBridgeSheets(updatedSheets);
  };

  // Toggle lock/unlock for a row on current page
  const handleToggleLock = (rowId) => {
    const currentSheet = songBridgeSheets[selectedSongIndex] || [];
    const updatedSheet = currentSheet.map((r) =>
      r.id === rowId ? { ...r, locked: !r.locked } : r
    );

    const updatedSheets = songBridgeSheets.map((sheet, idx) =>
      idx === selectedSongIndex ? updatedSheet : sheet
    );

    propagateSheets(updatedSheets);
  };

  // Build mix: Extended (mother) + Bridge + Extended (child)
  const handleBuildMix = async (row) => {
    const motherIndex = row.fromIndex;
    const childIndex = row.toIndex;

    const fromSong = extendedSongs[motherIndex];
    const toSong = extendedSongs[childIndex];

    const fromUrl = fromSong ? audioUrls[fromSong.songId] : null;
    const bridgeUrl = audioUrls[row.id] || null;
    const toUrl = toSong ? audioUrls[toSong.songId] : null;

    let error = "";

    if (!fromUrl) {
      error = `Mother song ${
        motherIndex + 1
      } has no audio. Upload extended audio in Home Section 2 row ${
        motherIndex + 1
      }.`;
    } else if (!bridgeUrl) {
      error = "Bridge has no audio yet. Upload bridge file in this row.";
    } else if (!toUrl) {
      error = `Child song ${
        childIndex + 1
      } has no audio. Upload extended audio in Home Section 2 row ${
        childIndex + 1
      }.`;
    }

    if (error) {
      setMixMessages((prev) => ({
        ...prev,
        [row.id]: error,
      }));
      return;
    }

    setMixBuildingRowId(row.id);
    setMixMessages((prev) => ({
      ...prev,
      [row.id]: "Building mix preview…",
    }));

    try {
      const mixUrl = await buildMixFromUrls([fromUrl, bridgeUrl, toUrl]);

      setMixUrls((prev) => ({
        ...prev,
        [row.id]: mixUrl,
      }));

      const fromTitle = fromSong?.title || `Song ${motherIndex + 1}`;
      const toTitle = toSong?.title || `Song ${childIndex + 1}`;

      setMixMessages((prev) => ({
        ...prev,
        [row.id]: `Mix ready: "${fromTitle}" → Bridge → "${toTitle}".`,
      }));
    } catch (e) {
      console.error("Error building mix preview (Songs page):", e);
      setMixMessages((prev) => ({
        ...prev,
        [row.id]:
          "Error building mix preview in this browser. Try smaller files or another browser.",
      }));
    } finally {
      setMixBuildingRowId(null);
    }
  };

  // Current sheet for the selected song page
  const currentSheet = songBridgeSheets[selectedSongIndex] || [];
  const motherSong = extendedSongs[selectedSongIndex];
  const motherTitle =
    motherSong?.title ||
    `(no title yet for Extended Song ${selectedSongIndex + 1})`;

  return (
    <div>
      {/* Header: Song page dropdown (NO Back to Dashboard) */}
      <section
        style={{
          marginBottom: "1rem",
          padding: "0.75rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Songs – Bridge Builder</h2>
        <p
          style={{
            fontSize: "0.85rem",
            opacity: 0.85,
            marginBottom: "0.75rem",
          }}
        >
          Each <strong>song page</strong> connects a{" "}
          <strong>mother song</strong> to the remaining{" "}
          <strong>child songs</strong> using bridge files. Song titles and
          ordering come from <strong>Section 2 – Extended Songs</strong> on the
          Home page.
        </p>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                marginRight: "0.5rem",
              }}
            >
              Song page:
            </label>
            <select
              value={selectedSongIndex + 1}
              onChange={handleSongPageChange}
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Song {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: "0.85rem", opacity: 0.85 }}>
            Mother song title: <strong>{motherTitle}</strong>
          </div>
        </div>
      </section>

      {/* Bridge table for the selected song page */}
      <section
        style={{
          marginBottom: "1.5rem",
          padding: "0.75rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          Bridge Sheet for Song {selectedSongIndex + 1}
        </h3>
        <p style={{ fontSize: "0.85rem", opacity: 0.85 }}>
          Use this sheet to connect the mother song to each child song with
          a bridge. Player 1 previews only the bridge. Player 2 builds a
          mix preview:
          <br />
          <strong>Extended (mother) + Bridge + Extended (child)</strong>
        </p>

        <table border="1" cellPadding="4" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "3rem" }}>#</th>
              <th style={{ width: "20%" }}>From (Mother)</th>
              <th style={{ width: "20%" }}>To (Child)</th>
              <th style={{ width: "16%" }}>Bridge upload</th>
              <th style={{ width: "18%" }}>Player 1 – Bridge preview</th>
              <th style={{ width: "18%" }}>Player 2 – Mix preview</th>
              <th style={{ width: "9rem" }}>Lock / Unlock</th>
            </tr>
          </thead>
          <tbody>
            {currentSheet.map((row, index) => {
              const locked = !!row.locked;

              const bridgeUrl = audioUrls[row.id];
              const mixUrl = mixUrls[row.id];
              const message = mixMessages[row.id];

              const fromSongLocal = extendedSongs[row.fromIndex];
              const toSongLocal = extendedSongs[row.toIndex];

              const fromLabel = `Song ${row.fromIndex + 1}`;
              const toLabel = `Song ${row.toIndex + 1}`;

              const fromTitle =
                fromSongLocal?.title ||
                `(no title for Extended ${row.fromIndex + 1})`;
              const toTitle =
                toSongLocal?.title ||
                `(no title for Extended ${row.toIndex + 1})`;

              return (
                <tr key={row.id}>
                  {/* Row number */}
                  <td style={{ textAlign: "center" }}>{index + 1}</td>

                  {/* FROM cell */}
                  <td>
                    <div
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <strong>{fromLabel}</strong>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          opacity: 0.75,
                          marginTop: "0.15rem",
                        }}
                      >
                        {fromTitle}
                      </span>
                    </div>
                  </td>

                  {/* TO cell */}
                  <td>
                    <div
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <strong>{toLabel}</strong>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          opacity: 0.75,
                          marginTop: "0.15rem",
                        }}
                      >
                        {toTitle}
                      </span>
                    </div>
                  </td>

                  {/* Bridge upload */}
                  <td>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) =>
                        handleBridgeFileChange(row.id, e.target.files)
                      }
                      disabled={locked}
                    />
                    {row.bridgeFilePath && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          opacity: 0.8,
                          marginTop: "0.2rem",
                        }}
                      >
                        {row.bridgeFilePath}
                      </div>
                    )}
                  </td>

                  {/* Player 1 – Bridge preview */}
                  <td>
                    {bridgeUrl ? (
                      <audio
                        controls
                        src={bridgeUrl}
                        style={{ width: "100%" }}
                        controlsList="nodownload noplaybackrate noremoteplayback"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    ) : (
                      <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                        Upload a bridge file to preview.
                      </span>
                    )}
                  </td>

                  {/* Player 2 – Mix preview */}
                  <td>
                    <div style={{ marginBottom: "0.3rem" }}>
                      <button
                        type="button"
                        onClick={() => handleBuildMix(row)}
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "4px",
                        }}
                        disabled={locked || mixBuildingRowId === row.id}
                      >
                        {mixBuildingRowId === row.id
                          ? "Building mix…"
                          : mixUrl
                          ? "Rebuild mix"
                          : "Build mix"}
                      </button>
                    </div>

                    {mixUrl ? (
                      <audio
                        controls
                        src={mixUrl}
                        style={{ width: "100%" }}
                        controlsList="nodownload noplaybackrate noremoteplayback"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    ) : (
                      <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                        Build the mix preview to get a timeline.
                      </span>
                    )}

                    {message && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          opacity: 0.8,
                          marginTop: "0.2rem",
                        }}
                      >
                        {message}
                      </div>
                    )}
                  </td>

                  {/* Lock / Unlock */}
                  <td style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleToggleLock(row.id)}
                      style={getLockButtonStyle(locked)}
                    >
                      {locked ? "Locked" : "Unlocked"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default SongsPage;
