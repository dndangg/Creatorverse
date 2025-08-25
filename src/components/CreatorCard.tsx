import { Link } from "react-router-dom";

type CreatorProps = {
  name: string;
  url: string;
  description: string;
  imageURL?: string;
  editHref?: string;
};

export default function CreatorCard({
  name,
  url,
  description,
  imageURL,
  editHref,
}: CreatorProps) {
  return (
    <article
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        backgroundColor: "#1e1e1e",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
      }}
    >
      {/* Text */}
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: 8 }}>{name}</h3>
        <p style={{ marginBottom: 12 }}>{description}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <a href={url} target="_blank" rel="noreferrer" style={{ color: "#61dafb" }}>
            Visit Channel
          </a>
          {editHref && (
            <Link to={editHref} style={{ color: "#61dafb" }}>
              Edit
            </Link>
          )}
        </div>
      </div>

      {/* Image on right */}
      {imageURL && (
        <div
          style={{
            flexShrink: 0,
            width: 150,
            height: 150,
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <img
            src={imageURL}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}
    </article>
  );
}