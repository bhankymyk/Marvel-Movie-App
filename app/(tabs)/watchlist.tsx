import { MovieCard } from "@/components/movieCard";
import { WatchlistMovie } from "@/types/movies";
import { useWatchlist } from "@/utilities/WatchlistContext";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";


export default function WatchlistScreen() {
  const router = useRouter();
  const { hydrated, list, toggle } = useWatchlist();

  const renderItem = useCallback(
    ({ item }: { item: WatchlistMovie }) => (
      <MovieCard
        movie={item}
        saved
        onToggle={toggle}
        savedLabel="Remove"
      />
    ),
    [toggle]
  );

  const keyExtractor = useCallback((item: WatchlistMovie) => item.imdbID, []);

  if (!hydrated) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
        <Text className="mt-2 text-gray-600">Loading watchlist…</Text>
      </View>
    );
  }

  if (list.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Text className="text-xl font-semibold">No movies saved yet!</Text>
        <Text className="mt-2 text-center text-gray-600">
          Search for movies and add them to your watchlist.
        </Text>

        <Pressable
          className="mt-5 rounded-2xl bg-black px-5 py-3"
          onPress={() => router.push("/(tabs)")}
        >
          <Text className="text-white">Go to Search</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4">
      <Text className="mb-3 text-lg font-semibold">Your Watchlist</Text>

      <FlatList
        data={list}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className="h-3" />}
        contentContainerStyle={{ paddingBottom: 24 }}
        removeClippedSubviews
        initialNumToRender={8}
        windowSize={7}
      />
    </View>
  );
}
