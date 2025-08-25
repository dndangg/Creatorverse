import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../client";
import CreatorCard from "../components/CreatorCard";

type Creator = {
  id: string | number;
  name: string;
  url: string;
  description: string;
  imageURL?: string | null;
  image_url?: string | null;
};

type ShowCreatorsProps = {
  creators?: Creator[];
  loading?: boolean;
  error?: string | null;
};

export default function ShowCreators({
  creators = [],
  loading,
  error,
}: ShowCreatorsProps) {
  const [items, setItems] = useState<Creator[]>(creators);

  useEffect(() => {
    setItems(creators);
  }, [creators]);

  async function handleDelete(id: string | number) {
    const sure = window.confirm("Delete this creator? This cannot be undone.");
    if (!sure) return;
    const { error } = await supabase.from("creators").delete().eq("id", id);
    if (error) {
      alert(`Error deleting: ${error.message}`);
      return;
    }
    setItems((prev) => prev.filter((c) => String(c.id) !== String(id)));
  }

  const Header = (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2>All Creators</h2>
      <Link to="/creators/new">Add Creator</Link>
    </header>
  );

  if (loading) {
    return (
      <main>
        {Header}
        <p>Loading creators…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        {Header}
        <p role="alert" style={{ color: "red" }}>Error: {error}</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main>
        {Header}
        <p>No creators found.</p>
      </main>
    );
  }

  return (
    <main>
      {Header}
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 16 }}>
        {items.map((c) => (
          <li key={String(c.id)}>
            <CreatorCard
              name={c.name}
              url={c.url}
              description={c.description}
              imageURL={c.imageURL ?? c.image_url ?? undefined}
              editHref={`/creators/${c.id}/edit`}
            />
            {/* Options under each card */}
            <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
              <Link to={`/creators/${c.id}`}>View</Link>
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                style={{ color: "#b00020" }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}