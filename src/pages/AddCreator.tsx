import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../client";

type CreatorForm = {
  name: string;
  url: string;
  description: string;
  imageURL?: string;
};

export default function AddCreator() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreatorForm>({
    name: "",
    url: "",
    description: "",
    imageURL: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error } = await supabase.from("creators").insert([
      {
        name: form.name.trim(),
        url: form.url.trim(),
        description: form.description.trim(),
        image_url: form.imageURL?.trim() || null,
      },
    ]);

    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }

    // When, go back to the main page and it will refresh
    navigate("/");
  }

  return (
    <main>
      <h2>Add Creator</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="url" placeholder="Channel URL" value={form.url} onChange={handleChange} required />
        <input name="imageURL" placeholder="Image URL (optional)" value={form.imageURL} onChange={handleChange} />
        <textarea name="description" placeholder="Description" rows={4} value={form.description} onChange={handleChange} required />
        {error && <p role="alert" style={{ color: "red" }}>{error}</p>}
        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" disabled={submitting}>{submitting ? "Adding…" : "Add Creator"}</button>
          <Link to="/">Cancel</Link>
        </div>
      </form>
    </main>
  );
}