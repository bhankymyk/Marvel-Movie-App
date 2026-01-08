import { WatchlistMovie } from "@/types/movies";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "watchlist:v1";

export type WatchlistRecord = Record<string, WatchlistMovie>;

export async function loadWatchlist(): Promise<WatchlistRecord> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;

    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed as WatchlistRecord;
  } catch {
    return {};
  }
}

export async function saveWatchlist(next: WatchlistRecord): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}
