import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../client";

type CreatorForm = {
  name: string;
  url: string;
  description: string;
  imageURL?: string;
};

export default function EditCreator() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<CreatorForm>({
    name: "",
    url: "",
    description: "",
    imageURL: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the existing creator
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
      } else if (data) {
        setForm({
          name: data.name ?? "",
          url: data.url ?? "",
          description: data.description ?? "",
          imageURL: data.imageURL ?? data.image_url ?? "",
        });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from("creators")
      .update({
        name: form.name.trim(),
        url: form.url.trim(),
        description: form.description.trim(),
        image_url: form.imageURL?.trim() || null,
      })
      .eq("id", id);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    navigate(`/creators/${id}`);
  }

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

  if (loading) {
    return (
      <main>
        <h2>Edit Creator</h2>
        <p>Loading…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h2>Edit Creator</h2>
        <p role="alert" style={{ color: "red" }}>{error}</p>
        <Link to={id ? `/creators/${id}` : "/"}>Back</Link>
      </main>
    );
  }

  return (
    <main>
      <h2>Edit Creator</h2>
      <p>Editing ID: <strong>{id}</strong></p>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="url"
          placeholder="Channel URL"
          value={form.url}
          onChange={handleChange}
          required
        />
        <input
          name="imageURL"
          placeholder="Image URL (optional)"
          value={form.imageURL}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          required
        />
        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" disabled={saving || deleting}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || saving}
            style={{ background: "#b00020", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 4 }}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
          <Link to={`/creators/${id}`}>Cancel</Link>
        </div>
      </form>
    </main>
  );
}