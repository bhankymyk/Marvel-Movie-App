import { MovieCard } from "@/components/movieCard";
import { useMovies } from "@/hooks/useMovies";
import { SearchMovie } from "@/types/movies";
import { useWatchlist } from "@/utilities/WatchlistContext";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const SUGGESTIONS = [
  "Marvel",
  "Batman",
  "Star Wars",
  "Harry Potter",
  "Matrix",
  "Avengers",
];
const IMAGE_HEIGHT = 80;
const CARD_PADDING_Y = 24;
const ITEM_HEIGHT = IMAGE_HEIGHT + CARD_PADDING_Y;
const SEPARATOR_HEIGHT = 12;

export default function MovieSearchScreen() {
  const {
    input,
    setInput,
    submitSearch,
    movies,
    loading,
    error,
    refreshing,
    refresh,
    search,
  } = useMovies("Marvel");

  const { isSaved, toggle } = useWatchlist();

  const renderItem = useCallback(
    ({ item }: { item: SearchMovie }) => (
      <MovieCard movie={item} saved={isSaved(item.imdbID)} onToggle={toggle} />
    ),
    [isSaved, toggle]
  );

  const keyExtractor = useCallback((item: SearchMovie) => item.imdbID, []);

  const renderSuggestions = useCallback(
    () => (
      <View className="mt-3 flex-row flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <Pressable
            key={s}
            className="rounded-full bg-white px-4 py-2"
            onPress={() => search(s)}
          >
            <Text className="text-gray-900">{s}</Text>
          </Pressable>
        ))}
      </View>
    ),
    [search]
  );

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4">
      <View className="flex-row gap-2">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Search movies…"
          className="flex-1 rounded-2xl bg-white px-4 py-3"
          returnKeyType="search"
          onSubmitEditing={submitSearch}
        />
        <Pressable
          className="rounded-2xl bg-black px-4 py-3"
          onPress={submitSearch}
        >
          <Text className="text-white">Search</Text>
        </Pressable>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="mt-2 text-gray-600">Loading movies…</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base font-semibold">Couldn’t load movies</Text>
          <Text className="mt-2 text-center text-gray-600">{error}</Text>

          <Pressable
            className="mt-4 rounded-2xl bg-black px-4 py-3"
            onPress={refresh}
          >
            <Text className="text-white">Try again</Text>
          </Pressable>
        </View>
      ) : movies.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-xl font-semibold">No results</Text>
          <Text className="mt-2 text-center text-gray-600">
            Try one of these:
          </Text>

          <View className="w-full">{renderSuggestions()}</View>

          <Pressable
            className="mt-5 rounded-2xl bg-black px-4 py-3"
            onPress={() => search("Marvel")}
          >
            <Text className="text-white">Back to Marvel</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          className="mt-4"
          data={movies}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View className="h-3" />}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshing={refreshing}
          onRefresh={refresh}
          removeClippedSubviews
          initialNumToRender={8}
          windowSize={7}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT + SEPARATOR_HEIGHT,
            offset: (ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
            index,
          })}
          maxToRenderPerBatch={10}
        />
      )}
    </View>
  );
}
