import { WatchlistMovie } from "@/types/movies";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type PropsWithChildren,
} from "react";
import Toast from "react-native-toast-message";
import { loadWatchlist, saveWatchlist, WatchlistRecord } from "./watchlistStorage";

type State = {
  items: WatchlistRecord;
  hydrated: boolean; 
};

type Action =
  | { type: "HYDRATE"; payload: WatchlistRecord }
  | { type: "TOGGLE"; payload: WatchlistMovie }
  | { type: "SET"; payload: WatchlistRecord };

const initialState: State = { items: {}, hydrated: false };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.payload, hydrated: true };

    case "SET":
      return { ...state, items: action.payload };

    case "TOGGLE": {
      const movie = action.payload;
      const exists = Boolean(state.items[movie.imdbID]);
      const next: WatchlistRecord = { ...state.items };

      if (exists) {
        delete next[movie.imdbID];
      } else {
        next[movie.imdbID] = movie;
      }

      return { ...state, items: next };
    }

    default:
      return state;
  }
}

type WatchlistContextValue = {
  hydrated: boolean;
  items: WatchlistRecord;
  ids: Set<string>;
  list: WatchlistMovie[];
  isSaved: (id: string) => boolean;
  toggle: (movie: WatchlistMovie) => void;
  clear: () => void;
};

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 1) Hydrate once on app start
  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await loadWatchlist();
      if (mounted) dispatch({ type: "HYDRATE", payload: stored });
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 2) Derived data memoized
  const ids = useMemo(() => new Set(Object.keys(state.items)), [state.items]);
  const list = useMemo(() => Object.values(state.items), [state.items]);

  const isSaved = useCallback((id: string) => ids.has(id), [ids]);

  // 3) Optimistic toggle plus persist in background
  const toggle = useCallback((movie: WatchlistMovie) => {
    dispatch({ type: "TOGGLE", payload: movie });


  }, []);

  // 4) Persist whenever items change 
  useEffect(() => {
    if (!state.hydrated) return;
    saveWatchlist(state.items).catch(() => {
      Toast.show({
        type: 'error',
        text1: 'Error saving watchlist',
        text2: 'Your changes could not be saved. Please try again.',
        position: 'top',
        visibilityTime: 2000,
      })
    });
  }, [state.items, state.hydrated]);

  const clear = useCallback(() => {
    dispatch({ type: "SET", payload: {} });
  }, []);

  const value = useMemo<WatchlistContextValue>(
    () => ({
      hydrated: state.hydrated,
      items: state.items,
      ids,
      list,
      isSaved,
      toggle,
      clear,
    }),
    [state.hydrated, state.items, ids, list, isSaved, toggle, clear]
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider");
  return ctx;
}
