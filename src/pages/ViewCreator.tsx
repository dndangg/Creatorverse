import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../client";

type Creator = {
  id: string | number;
  name: string;
  url: string;
  description: string;
  imageURL?: string | null;
  image_url?: string | null;
};

export default function ViewCreator() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
        setCreator(null);
      } else {
        setCreator(data as Creator);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    const sure = window.confirm("Delete this creator? This cannot be undone.");
    if (!sure) return;
    setDeleting(true);
    setError(null);
    const { error } = await supabase.from("creators").delete().eq("id", id);
    if (error) {
      setError(error.message);
      setDeleting(false);
      return;
    }
    navigate("/");
  }

  if (loading) return (<main><h2>View Creator</h2><p>Loading…</p></main>);
  if (error)   return (<main><h2>View Creator</h2><p role="alert" style={{ color: "red" }}>Error: {error}</p><Link to="/">Back to All</Link></main>);
  if (!creator) return (<main><h2>View Creator</h2><p>Creator not found.</p><Link to="/">Back to All</Link></main>);

  const img = creator.imageURL ?? creator.image_url ?? undefined;

  return (
    <main>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>{creator.name}</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Link
            to={`/creators/${creator.id}/edit`}
            style={{ padding: "6px 12px", background: "#007bff", color: "#fff", borderRadius: 4 }}
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            style={{ padding: "6px 12px", background: "#b00020", color: "#fff", border: "none", borderRadius: 4 }}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </header>
      {error && <p role="alert" style={{ color: "red", marginTop: 8 }}>{error}</p>}
      {img && (
        <img
          src={img}
          alt={creator.name}
          style={{ width: "100%", maxWidth: 560, borderRadius: 8, marginBottom: 12 }}
        />
      )}
      <p style={{ marginBottom: 12 }}>{creator.description}</p>
      <p style={{ marginBottom: 12 }}>
        <a href={creator.url} target="_blank" rel="noreferrer">
          Visit Channel
        </a>
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/">Back to All</Link>
      </div>
    </main>
  );
}