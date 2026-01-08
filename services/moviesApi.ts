import type { SearchMovie, SearchResponse } from "@/types/movies";

const OMDB_BASE_URL = "https://www.omdbapi.com/";

export async function searchMovies(
  query: string,
  signal?: AbortSignal
): Promise<SearchMovie[]> {
  const q = query.trim();
  if (!q) return [];

  const url = new URL(OMDB_BASE_URL);
  url.searchParams.set("s", q);
  url.searchParams.set("apikey", process.env.EXPO_PUBLIC_OMDB_API_KEY ?? "");

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);

  const data = (await res.json()) as SearchResponse;

  if (data.Response === "False") {
    const err = (data.Error ?? "").toLowerCase();

    if (err.includes("not found")) return [];

    throw new Error(data.Error || "Request failed");
  }

  return data.Search ?? [];
}
