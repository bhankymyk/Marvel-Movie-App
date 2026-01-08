import Ionicons from "@expo/vector-icons/Ionicons";
import React, { memo, useMemo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import type { SearchMovie, WatchlistMovie } from "../types/movies";

type Props = {
  movie: SearchMovie;
  saved: boolean;
  onToggle: (movie: WatchlistMovie) => void;
  savedLabel?: string;
  unsavedLabel?: string;
};

function MovieCardBase({
  movie,
  saved,
  onToggle,
  savedLabel = "Saved ",
  unsavedLabel = "Add to Watchlist",
}: Props) {
  const posterUri = useMemo(() => {
    return movie.Poster && movie.Poster !== "N/A" ? movie.Poster : null;
  }, [movie.Poster]);

  const fallback = useMemo(() => {
    const title = movie.Title?.trim() ?? "";
    const parts = title.split(/\s+/).filter(Boolean);
    const initials =
      parts.length === 0
        ? "?"
        : parts.length === 1
        ? parts[0].slice(0, 2).toUpperCase()
        : (parts[0][0] + parts[1][0]).toUpperCase();

    const colors = [
      "bg-slate-200",
      "bg-stone-200",
      "bg-zinc-200",
      "bg-neutral-200",
      "bg-gray-200",
    ];
    const seed = Array.from(title).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const bg = colors[seed % colors.length];

    return { initials, bg };
  }, [movie.Title]);

  const payload: WatchlistMovie = useMemo(
    () => ({
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
    }),
    [movie.imdbID, movie.Title, movie.Year, movie.Poster]
  );

  return (
    <View className="flex-row gap-3 rounded-2xl bg-white p-3">
      <View className="h-20 w-14 overflow-hidden rounded-lg bg-gray-100">
        {posterUri ? (
          <Image
            source={{ uri: posterUri }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className={`h-full w-full items-center justify-center ${fallback.bg}`}>
            <Text className="text-xs font-semibold text-gray-600">
              {fallback.initials}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold" numberOfLines={1}>
          {movie.Title}
        </Text>
        <Text className="text-sm text-gray-600">{movie.Year}</Text>

        <Pressable
          className={`mt-2 self-start rounded-xl px-3 py-2 ${
            saved ? "bg-gray-200" : "bg-black"
          }`}
          onPress={() => {
            onToggle(payload);

            Toast.show({
              type: "success",
              text1: saved ? "Removed from Watchlist" : "Saved to Watchlist",
              text2: movie.Title,
              position: "top",
              visibilityTime: 1600,
            });
          }}
        >
          <View className="flex-row items-center gap-2">
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={16}
              color={saved ? "#000" : "#fff"}
            />
            <Text className={saved ? "text-black" : "text-white"}>
              {saved ? savedLabel : unsavedLabel}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

export const MovieCard = memo(MovieCardBase);
