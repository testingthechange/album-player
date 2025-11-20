export default function ReturnChecklist({ metaReturned }) {
  const Item = ({ label, done }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
      <span>{done ? "✅" : "⭕"}</span>
      <span>{label}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* REAL item */}
      <Item label="Meta" done={metaReturned} />

      {/* PLACEHOLDERS for future */}
      <Item label="Songs" done={false} />
      <Item label="Mix Notes" done={false} />
      <Item label="Artwork" done={false} />
    </div>
  );
}
