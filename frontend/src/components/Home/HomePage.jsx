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

// Extended songs builder (9 rows)
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

// Bridges builder (8 rows: Song 1 → Song 2..9)
function buildDefaultBridges(project) {
  const incoming = project.bridges || [];
  const max = 8; // 1→2, 1→3, ... 1→9
  return Array.from({ length: max }).map((_, i) => {
    const existing = incoming[i] || {};
    const n = i + 1;
    return {
      id: existing.id || `bridge-${n}`,
      songIndex: n,
      bridgeFilePath: existing.bridgeFilePath || "",
      locked: !!existing.locked,
    };
  });
}

/**
 * Web Audio helpers – build a single WAV from multiple URLs
 * Used for both NFT mixes and the top playlist player.
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

export function HomePage({ project, onSongTitlesChange, onProjectUpdate }) {
  // SECTION 1 – Album songs (main)
  const [localSongs, setLocalSongs] = React.useState(project.songs || []);

  // SECTION 2 – Extended songs
  const [extendedSongs, setExtendedSongs] = React.useState(() =>
    buildExtendedSongs(project)
  );

  // SECTION 3 – Bridges
  const [bridges, setBridges] = React.useState(() =>
    buildDefaultBridges(project)
  );

  // Shared audio URL pool, serialized onto project.homeAudioUrls
  const [audioUrls, setAudioUrls] = React.useState(
    project.homeAudioUrls || {}
  );

  // Mix preview URLs (Song 1 + Bridge + Song N) for Section 3
  const [mixUrls, setMixUrls] = React.useState({});
  const [mixMessages, setMixMessages] = React.useState(() =>
    Array(8).fill("")
  );
  const [mixBuildingRow, setMixBuildingRow] = React.useState(null);

  // TOP PLAYER STATE – playlist mode + built URL
  const [topMode, setTopMode] = React.useState("album"); // "album" | "extended" | "mix"
  const [topPlayerUrl, setTopPlayerUrl] = React.useState(null);
  const [topBuilding, setTopBuilding] = React.useState(false);
  const [topMessage, setTopMessage] = React.useState("");

  // Sync from project when it changes
  React.useEffect(() => {
    setLocalSongs(project.songs || []);
  }, [project.songs]);

  React.useEffect(() => {
    setExtendedSongs(buildExtendedSongs(project));
  }, [project.extendedSongs]);

  React.useEffect(() => {
    setBridges(buildDefaultBridges(project));
    setMixMessages(Array(8).fill(""));
    setMixBuildingRow(null);
  }, [project.bridges]);

  React.useEffect(() => {
    // if parent updates homeAudioUrls (e.g. from Songs page), keep in sync
    if (project.homeAudioUrls) {
      setAudioUrls(project.homeAudioUrls);
    }
  }, [project.homeAudioUrls]);

  // Helper: update audioUrls locally AND push to project.homeAudioUrls
  const registerAudioUrl = React.useCallback(
    (key, url) => {
      setAudioUrls((prev) => {
        const next = { ...prev, [key]: url };
        if (onProjectUpdate) {
          onProjectUpdate({ homeAudioUrls: next });
        }
        return next;
      });
    },
    [onProjectUpdate]
  );

  // ---------------- SECTION 1 – Album songs ----------------

  const handleSongTitleChange = (index, value) => {
    const n = index + 1;

    const base = localSongs[index] || {
      songId: `song-${n}`,
      title: "",
      filePath: "",
      locked: false,
    };

    if (base.locked) return;

    const updated = [...localSongs];
    updated[index] = { ...base, title: value };

    setLocalSongs(updated);

    if (onSongTitlesChange) onSongTitlesChange(updated);
    if (onProjectUpdate) onProjectUpdate({ songs: updated });
  };

  const handleSongFileChange = (index, files) => {
    const n = index + 1;

    const base = localSongs[index] || {
      songId: `song-${n}`,
      title: "",
      filePath: "",
      locked: false,
    };

    if (base.locked) return;
    if (!files || files.length === 0) return;

    const file = files[0];
    const url = URL.createObjectURL(file);

    const songId = base.songId || `song-${n}`;
    registerAudioUrl(songId, url);

    const updated = [...localSongs];
    updated[index] = { ...base, filePath: file.name };

    setLocalSongs(updated);

    if (onProjectUpdate) onProjectUpdate({ songs: updated });
  };

  const handleToggleSongLock = (index) => {
    const n = index + 1;

    const base = localSongs[index] || {
      songId: `song-${n}`,
      title: "",
      filePath: "",
      locked: false,
    };

    const updated = [...localSongs];
    updated[index] = { ...base, locked: !base.locked };

    setLocalSongs(updated);

    if (onProjectUpdate) onProjectUpdate({ songs: updated });
  };

  // ---------------- SECTION 2 – Extended songs ----------------

  const handleExtTitleChange = (index, value) => {
    const current = extendedSongs[index];
    if (!current) return;
    if (current.locked) return;

    const updated = extendedSongs.map((s, i) =>
      i === index ? { ...s, title: value } : s
    );
    setExtendedSongs(updated);

    if (onProjectUpdate) onProjectUpdate({ extendedSongs: updated });
  };

  const handleExtFileChange = (index, files) => {
    const current = extendedSongs[index];
    if (!current) return;
    if (current.locked) return;
    if (!files || files.length === 0) return;

    const file = files[0];
    const url = URL.createObjectURL(file);

    const songId = current.songId || `ext-${index + 1}`;
    registerAudioUrl(songId, url);

    const updated = extendedSongs.map((s, i) =>
      i === index ? { ...s, filePath: file.name } : s
    );
    setExtendedSongs(updated);

    if (onProjectUpdate) onProjectUpdate({ extendedSongs: updated });
  };

  const handleToggleExtLock = (index) => {
    const updated = extendedSongs.map((s, i) =>
      i === index ? { ...s, locked: !s.locked } : s
    );
    setExtendedSongs(updated);

    if (onProjectUpdate) onProjectUpdate({ extendedSongs: updated });
  };

  // ---------------- SECTION 3 – Bridges + Mix ----------------

  const propagateBridges = (updated) => {
    setBridges(updated);
    if (onProjectUpdate) onProjectUpdate({ bridges: updated });
  };

  const handleBridgeFileChange = (index, files) => {
    const row = bridges[index];
    if (!row) return;
    if (row.locked) return;
    if (!files || files.length === 0) return;

    const file = files[0];
    const url = URL.createObjectURL(file);

    registerAudioUrl(row.id, url);

    const updated = bridges.map((b, i) =>
      i === index ? { ...b, bridgeFilePath: file.name } : b
    );
    propagateBridges(updated);
  };

  const handleToggleBridgeLock = (index) => {
    const updated = bridges.map((b, i) =>
      i === index ? { ...b, locked: !b.locked } : b
    );
    propagateBridges(updated);
  };

  // Player 2 – build single mix: Extended Song 1 + Bridge(N) + Extended Song (N+1)
  const handleBuildMix = async (index) => {
    const row = bridges[index];
    if (!row) return;

    const maxExt = extendedSongs.length;
    if (!extendedSongs || maxExt < 2) {
      setMixMessages((prev) => {
        const next = [...prev];
        next[index] = "Need at least 2 extended songs in Section 2.";
        return next;
      });
      return;
    }

    // FROM is ALWAYS Extended Song 1 (index 0)
    const fromIndex = 0; // Song 1
    // TO is Extended Song (index + 1) → Song 2..9 for rows 0..7
    const toIndex = index + 1;

    if (toIndex >= maxExt) {
      setMixMessages((prev) => {
        const next = [...prev];
        next[index] = `Need extended song ${toIndex + 1} in Section 2.`;
        return next;
      });
      return;
    }

    const fromSong = extendedSongs[fromIndex];
    const toSong = extendedSongs[toIndex];

    const fromUrl = fromSong ? audioUrls[fromSong.songId] : null;
    const bridgeUrl = audioUrls[row.id] || null;
    const toUrl = toSong ? audioUrls[toSong.songId] : null;

    let error = "";

    if (!fromUrl) {
      error =
        "Song 1 (From) has no audio. Upload in Section 2 row 1.";
    } else if (!bridgeUrl) {
      error = "Bridge has no audio yet. Upload bridge file in this row.";
    } else if (!toUrl) {
      error = `Song ${toIndex + 1} (To) has no audio. Upload in Section 2 row ${
        toIndex + 1
      }.`;
    }

    if (error) {
      setMixMessages((prev) => {
        const next = [...prev];
        next[index] = error;
        return next;
      });
      return;
    }

    setMixBuildingRow(index);
    setMixMessages((prev) => {
      const next = [...prev];
      next[index] = "Building mix preview…";
      return next;
    });

    try {
      const mixUrl = await buildMixFromUrls([fromUrl, bridgeUrl, toUrl]);

      setMixUrls((prev) => ({
        ...prev,
        [row.id]: mixUrl,
      }));

      const fromTitle = fromSong?.title || "Song 1";
      const toTitle = toSong?.title || `Song ${toIndex + 1}`;

      setMixMessages((prev) => {
        const next = [...prev];
        next[index] = `Mix ready: "${fromTitle}" → Bridge → "${toTitle}".`;
        return next;
      });
    } catch (e) {
      console.error("Error building mix preview:", e);
      setMixMessages((prev) => {
        const next = [...prev];
        next[index] =
          "Error building mix preview in this browser. Try smaller files or another browser.";
        return next;
      });
    } finally {
      setMixBuildingRow(null);
    }
  };

  // ---------------- TOP PLAYER – build playlist for Album / Extended / NFT Mix ----------------

  const rebuildTopPlaylist = async (mode) => {
    setTopBuilding(true);
    setTopMessage("");
    try {
      let urls = [];

      if (mode === "album") {
        // Use Section 1 songs (up to 9), in order
        urls = Array.from({ length: 9 })
          .map((_, index) => {
            const n = index + 1;
            const song =
              localSongs[index] || {
                songId: `song-${n}`,
              };
            const src = audioUrls[song.songId];
            return src || null;
          })
          .filter(Boolean);

        if (urls.length === 0) {
          setTopPlayerUrl(null);
          setTopMessage(
            "Add album songs in Section 1 (with audio) to build this playlist."
          );
          return;
        }
      } else if (mode === "extended") {
        // Use Section 2 extended songs (up to 9), in order
        urls = extendedSongs
          .map((song) => audioUrls[song.songId])
          .filter(Boolean);

        if (urls.length === 0) {
          setTopPlayerUrl(null);
          setTopMessage(
            "Add extended songs in Section 2 (with audio) to build this playlist."
          );
          return;
        }
      } else if (mode === "mix") {
        // Use Section 3 NFT mixes (rows with built mixUrls), in order
        urls = bridges
          .map((row) => mixUrls[row.id])
          .filter(Boolean);

        if (urls.length === 0) {
          setTopPlayerUrl(null);
          setTopMessage(
            "Build at least one mix in Section 3 to play the NFT mix playlist."
          );
          return;
        }
      }

      const playlistUrl = await buildMixFromUrls(urls);
      setTopPlayerUrl(playlistUrl);

      const label =
        mode === "album"
          ? "Album"
          : mode === "extended"
          ? "Extended"
          : "NFT mix";

      setTopMessage(`Playing ${label} playlist (${urls.length} tracks).`);
    } catch (e) {
      console.error("Error building top playlist:", e);
      setTopPlayerUrl(null);
      setTopMessage(
        "Error building playlist in this browser. Try smaller files or another browser."
      );
    } finally {
      setTopBuilding(false);
    }
  };

  const handleTopModeClick = (mode) => {
    setTopMode(mode);
    rebuildTopPlaylist(mode);
  };

  // ---------------- SECTION 4 – Project NFT settings ----------------

  const handleProjectFieldChange = (field, value) => {
    if (!onProjectUpdate) return;
    onProjectUpdate({ [field]: value });
  };

  const handleNftToggle = (checked) => {
    if (!onProjectUpdate) return;
    onProjectUpdate({ enableNft: checked });
  };

  // ---------------- RENDER ----------------

  return (
    <div>
      {/* TOP-OF-PAGE PLAYLIST PLAYER */}
      <section
        style={{
          marginBottom: "1rem",
          padding: "0.75rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>Playlist Player</h2>
          <p
            style={{
              fontSize: "0.85rem",
              opacity: 0.85,
              margin: "0.25rem 0 0.5rem",
            }}
          >
            Choose <strong>Album</strong>, <strong>Extended</strong>, or{" "}
            <strong>NFT Mix</strong> to build and preview a temporary playlist
            in the browser. This uses the audio from each section.
          </p>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => handleTopModeClick("album")}
              disabled={topBuilding && topMode === "album"}
              style={{
                padding: "0.3rem 0.75rem",
                borderRadius: "4px",
                border:
                  topMode === "album"
                    ? "2px solid #333"
                    : "1px solid #aaa",
                backgroundColor:
                  topMode === "album" ? "#e0e0ff" : "#f5f5f5",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              {topBuilding && topMode === "album"
                ? "Building Album…"
                : "Album"}
            </button>

            <button
              type="button"
              onClick={() => handleTopModeClick("extended")}
              disabled={topBuilding && topMode === "extended"}
              style={{
                padding: "0.3rem 0.75rem",
                borderRadius: "4px",
                border:
                  topMode === "extended"
                    ? "2px solid #333"
                    : "1px solid #aaa",
                backgroundColor:
                  topMode === "extended" ? "#e0ffe0" : "#f5f5f5",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              {topBuilding && topMode === "extended"
                ? "Building Extended…"
                : "Extended"}
            </button>

            <button
              type="button"
              onClick={() => handleTopModeClick("mix")}
              disabled={topBuilding && topMode === "mix"}
              style={{
                padding: "0.3rem 0.75rem",
                borderRadius: "4px",
                border:
                  topMode === "mix" ? "2px solid #333" : "1px solid #aaa",
                backgroundColor:
                  topMode === "mix" ? "#ffe0f5" : "#f5f5f5",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              {topBuilding && topMode === "mix"
                ? "Building NFT mix…"
                : "NFT mix"}
            </button>
          </div>

          {topMessage && (
            <div
              style={{
                marginTop: "0.4rem",
                fontSize: "0.8rem",
                opacity: 0.85,
              }}
            >
              {topMessage}
            </div>
          )}
        </div>

        <div style={{ flex: "0 0 320px" }}>
          {topPlayerUrl ? (
            <audio
              controls
              src={topPlayerUrl}
              style={{ width: "100%" }}
              controlsList="nodownload noplaybackrate noremoteplayback"
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <span style={{ fontSize: "0.8rem", opacity: 0.75 }}>
              Choose a playlist above and make sure the corresponding section
              has audio uploaded.
            </span>
          )}
        </div>
      </section>

      {/* SECTION 1 – Album songs */}
      <section
        style={{
          marginBottom: "1.5rem",
          padding: "0.75rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Section 1 – Album Songs</h3>
        <p style={{ fontSize: "0.85rem", opacity: 0.85 }}>
          Enter your main album tracks. Song titles here feed into the Meta page
          and Songs worksheet. When a row is locked, the title and upload cannot
          be changed.
        </p>

        <table border="1" cellPadding="4" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "3rem" }}>#</th>
              <th>Song title</th>
              <th style={{ width: "11rem" }}>Upload file</th>
              <th style={{ width: "15rem" }}>Player</th>
              <th style={{ width: "9rem" }}>Lock / Unlock</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 9 }).map((_, index) => {
              const n = index + 1;
              const song =
                localSongs[index] || {
                  songId: `song-${n}`,
                  title: "",
                  filePath: "",
                  locked: false,
                };

              const songId = song.songId || `song-${n}`;
              const locked = !!song.locked;
              const audioUrl = audioUrls[songId];

              return (
                <tr key={songId}>
                  <td style={{ textAlign: "center" }}>{n}</td>
                  <td>
                    <input
                      type="text"
                      value={song.title || ""}
                      onChange={(e) =>
                        handleSongTitleChange(index, e.target.value)
                      }
                      placeholder={`Song ${n} name`}
                      style={{
                        width: "100%",
                        padding: "0.25rem",
                        background: locked ? "#f3f3f3" : "white",
                      }}
                      disabled={locked}
                    />
                  </td>
                  <td>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) =>
                        handleSongFileChange(index, e.target.files)
                      }
                      disabled={locked}
                    />
                    {song.filePath && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          marginTop: "0.15rem",
                          opacity: 0.8,
                        }}
                      >
                        {song.filePath}
                      </div>
                    )}
                  </td>
                  <td>
                    {audioUrl ? (
                      <audio
                        controls
                        src={audioUrl}
                        style={{ width: "100%" }}
                        controlsList="nodownload noplaybackrate noremoteplayback"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    ) : (
                      <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                        Upload a file to enable playback.
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleToggleSongLock(index)}
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

      {/* SECTION 2 – Extended Songs */}
      <section
        style={{
          marginBottom: "1.5rem",
          padding: "0.75rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Section 2 – Extended Songs</h3>
        <p style={{ fontSize: "0.85rem", opacity: 0.85 }}>
          Add extended versions of your songs used for Smart Bridge mixes. These
          rows feed into the NFT Mix Bridges table in Section 3 and the Extended
          playlist in the top player.
        </p>

        <table border="1" cellPadding="4" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "3rem" }}>#</th>
              <th>Extended song name</th>
              <th style={{ width: "11rem" }}>Upload file</th>
              <th style={{ width: "15rem" }}>Player</th>
              <th style={{ width: "9rem" }}>Lock / Unlock</th>
            </tr>
          </thead>
          <tbody>
            {extendedSongs.map((song, index) => {
              const songId = song.songId || `ext-${index + 1}`;
              const locked = !!song.locked;
              const audioUrl = audioUrls[songId];

              return (
                <tr key={songId}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      value={song.title || ""}
                      onChange={(e) =>
                        handleExtTitleChange(index, e.target.value)
                      }
                      placeholder={`Extended ${index + 1} name`}
                      style={{
                        width: "100%",
                        padding: "0.25rem",
                        background: locked ? "#f3f3f3" : "white",
                      }}
                      disabled={locked}
                    />
                  </td>
                  <td>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) =>
                        handleExtFileChange(index, e.target.files)
                      }
                      disabled={locked}
                    />
                    {song.filePath && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          marginTop: "0.15rem",
                          opacity: 0.8,
                        }}
                      >
                        {song.filePath}
                      </div>
                    )}
                  </td>
                  <td>
                    {audioUrl ? (
                      <audio
                        controls
                        src={audioUrl}
                        style={{ width: "100%" }}
                        controlsList="nodownload noplaybackrate noremoteplayback"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    ) : (
                      <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                        Upload a file to enable playback.
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleToggleExtLock(index)}
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

      {/* SECTION 3 – NFT Mix Bridges (Song 1 → Songs 2..9) */}
      <section
        style={{
          marginBottom: "1.5rem",
          padding: "0.75rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Section 3 – NFT Mix Bridges</h3>
        <p style={{ fontSize: "0.85rem", opacity: 0.85 }}>
          Each row connects <strong>Song 1</strong> to{" "}
          <strong>Song 2–9</strong> using extended songs from Section 2.
          Player 1 previews only the bridge. Player 2 builds a mix preview:
          <strong> Extended Song 1 + Bridge + Extended Song N</strong>. Built
          mixes also feed the NFT Mix playlist in the top player.
        </p>

        <table border="1" cellPadding="4" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "20%" }}>From</th>
              <th style={{ width: "20%" }}>To</th>
              <th style={{ width: "16%" }}>Bridge upload</th>
              <th style={{ width: "18%" }}>Player 1 – Bridge preview</th>
              <th style={{ width: "18%" }}>Player 2 – Mix preview</th>
              <th style={{ width: "9rem" }}>Lock / Unlock</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, index) => {
              // 8 rows: 1→2, 1→3, ... 1→9
              const existingRow = bridges[index];
              const row =
                existingRow || {
                  id: `bridge-${index + 1}`,
                  songIndex: index + 1,
                  bridgeFilePath: "",
                  locked: false,
                };

              const locked = !!row.locked;
              const audioUrl = audioUrls[row.id];
              const mixUrl = mixUrls[row.id];

              // FROM is always Song 1 (Section 2 row 1)
              const fromLabel = "Song 1";
              const fromSong = extendedSongs[0];
              const fromTitle = fromSong?.title || "(no title yet)";

              // TO is Song 2..9 (Section 2 rows 2..9)
              const toIndex = index + 1; // 1..8
              const toLabel = `Song ${toIndex + 1}`;
              const toSong = extendedSongs[toIndex];
              const toTitle = toSong?.title || "(no title yet)";

              return (
                <tr key={row.id}>
                  {/* FROM – always Song 1 + its Section 2 title */}
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

                  {/* TO – Song 2..9 + its Section 2 title */}
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
                        handleBridgeFileChange(index, e.target.files)
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
                    {audioUrl ? (
                      <audio
                        controls
                        src={audioUrl}
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
                        onClick={() => handleBuildMix(index)}
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "4px",
                        }}
                        disabled={locked || mixBuildingRow === index}
                      >
                        {mixBuildingRow === index
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

                    {mixMessages[index] && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          opacity: 0.8,
                          marginTop: "0.2rem",
                        }}
                      >
                        {mixMessages[index]}
                      </div>
                    )}
                  </td>

                  {/* Lock / Unlock */}
                  <td style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleToggleBridgeLock(index)}
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

      {/* SECTION 4 – Labs & NFT Settings */}
      <section
        style={{
          marginBottom: "1.5rem",
          padding: "0.75rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Section 4 – Labs &amp; NFT Settings</h3>

        <div style={{ marginBottom: "0.5rem" }}>
          <label
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <input
              type="checkbox"
              checked={!!project.enableNft}
              onChange={(e) => handleNftToggle(e.target.checked)}
            />
            <span>Enable NFT / Web3 features (placeholder)</span>
          </label>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label style={{ display: "block", fontSize: "0.85rem" }}>
            NFT Collection ID
          </label>
          <input
            type="text"
            value={project.nftCollectionId || ""}
            onChange={(e) =>
              handleProjectFieldChange("nftCollectionId", e.target.value)
            }
            style={{ width: "100%", padding: "0.25rem" }}
            placeholder="e.g. collection-123"
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.85rem" }}>
            Chain
          </label>
          <input
            type="text"
            value={project.chain || "polygon"}
            onChange={(e) => handleProjectFieldChange("chain", e.target.value)}
            style={{ width: "100%", padding: "0.25rem" }}
            placeholder="polygon, ethereum, etc."
          />
        </div>
      </section>
    </div>
  );
}

export default HomePage;
