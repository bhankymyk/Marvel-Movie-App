import { useCallback, useEffect, useRef, useState } from "react";
import Toast from "react-native-toast-message";
import { searchMovies } from "../services/moviesApi";
import type { SearchMovie } from "../types/movies";

type UseMoviesState = {
  query: string;
  input: string;
  movies: SearchMovie[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
};

export function useMovies(initialQuery = "Marvel") {
  const [state, setState] = useState<UseMoviesState>({
    query: initialQuery,
    input: initialQuery,
    movies: [],
    loading: true,
    refreshing: false,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const runFetch = useCallback(async (q: string, mode: "load" | "refresh") => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({
      ...prev,
      loading: mode === "load",
      refreshing: mode === "refresh",
      error: null,
    }));

    try {
      const movies = await searchMovies(q, controller.signal);
      const unique = Array.from(
        new Map(movies.map((m) => [m.imdbID, m] as const)).values()
      );
      setState((prev) => ({
        ...prev,
        movies: unique,
        loading: false,
        refreshing: false,
        error: null,
      }));

      if (mode === "refresh") {
        Toast.show({
          type: "success",
          text1: "Movies refreshed",
          position: "top",
          visibilityTime: 2000,
        });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      if (message.toLowerCase().includes("aborted")) return;

      setState((prev) => ({
        ...prev,
        movies: [],
        loading: false,
        refreshing: false,
        error: message,
      }));
    }
  }, []);

  useEffect(() => {
    runFetch(state.query, "load");
    return () => abortRef.current?.abort();
  }, [runFetch, state.query]);

  const setInput = useCallback((text: string) => {
    setState((prev) => ({ ...prev, input: text }));
  }, []);

const submitSearch = useCallback(() => {
  const next = state.input.trim();
  setState((prev) => ({ ...prev, query: next || "Marvel", error: null }));
}, [state.input]);

const search = useCallback((term: string) => {
  const next = term.trim();
  setState((prev) => ({
    ...prev,
    input: next,
    query: next || "Marvel",
    error: null,
  }));
}, []);



  const refresh = useCallback(() => {
    runFetch(state.query, "refresh");
  }, [runFetch, state.query]);

  return {
    ...state,
    setInput,
    submitSearch,
    refresh,
    search,
  };
}
