// src/App.tsx
import { useRoutes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// pages (TS will resolve .tsx automatically)
import ShowCreators from "./pages/ShowCreators";
import ViewCreator from "./pages/ViewCreator";
import EditCreator from "./pages/EditCreator";
import AddCreator from "./pages/AddCreator";

// Supabase client
import { supabase } from "./client";

type Creator = {
  id: string;
  name: string;
  url: string;
  description: string;
  imageURL?: string;
  image_url?: string | null; // allow snake_case from DB
};

export default function App() {
  const location = useLocation();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCreators() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase fetch error:", error);
        setError(error.message);
        setCreators([]);
      } else {
        setCreators((data ?? []) as Creator[]);
      }
      setLoading(false);
    }

    loadCreators();
  }, [location.pathname]); // refetch when route changes

  const element = useRoutes([
    { path: "/", element: <ShowCreators creators={creators} loading={loading} error={error} /> }, // main page
    { path: "/creators/new", element: <AddCreator /> },
    { path: "/creators/:id", element: <ViewCreator /> },
    { path: "/creators/:id/edit", element: <EditCreator /> },
    { path: "*", element: <div>Not Found</div> },
  ]);

  return <div className="App">{element}</div>;
}