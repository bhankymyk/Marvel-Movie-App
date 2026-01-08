# Movie Discovery & Watchlist App

A mobile application built with React Native (Expo) that allows users to browse trending movies from the OMDb API and save them to a persistent local watchlist.

## Features

-  Search movies by title
-  Browse movie results with poster, title, and year
-  Save movies to watchlist with offline persistence
-  Optimistic UI updates for instant feedback
-  Pull-to-refresh functionality
-  Clean empty state designs
-  Modern UI with Tailwind CSS (NativeWind)
-  Performance optimizations with React.memo and hooks

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (for testing on physical device) or iOS Simulator/Android Emulator

## Getting Started

### 1. Clone the repository

```bash
git clone 
cd trending-movies
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Get your free OMDb API key from [ https://www.omdbapi.com/apikey.aspx?hl=en-GB]( https://www.omdbapi.com/apikey.aspx?hl=en-GB) and add it to your `.env` file:

```
EXPO_PUBLIC_OMDB_API_KEY=your_api_key_here
```

### 4. Start the development server

```bash
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan the QR code with Expo Go app (iOS/Android)

## Project Structure

```
trending-movies/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx        # Tab navigation configuration
│   │   ├── index.tsx           # Movie Search screen
│   │   └── watchlist.tsx       # Watchlist screen
│   └── _layout.tsx             # Root layout with providers
├── components/
│   └── movieCard.tsx           # Reusable movie card component
├── hooks/
│   └── useMovies.ts            # Custom hook for movie search logic
├── services/
│   └── moviesApi.ts                 # OMDb API integration
├── types/
│   └── movies.ts                 # TypeScript type definitions
├── utilities/
│   ├── WatchlistContext.tsx    # Global watchlist state management
│   └── watchlistStorage.ts     # AsyncStorage persistence layer
└── .env                        # Environment variables (not committed)
```

## Architecture Decisions

### State Management

I chose **React Context API with useReducer** for global watchlist state management because:

1. **Simplicity:** The app has a single shared state (watchlist) - Context is sufficient without the overhead of Redux or Zustand
2. **Performance:** Combined with React.memo and useCallback, prevents unnecessary re-renders
3. **Predictable updates:** useReducer pattern makes state transitions clear and testable
4. **Separation of concerns:** Business logic (reducer) is separate from UI components

### Folder Structure

- **`app/`** - Expo Router file-based routing with tab navigation
- **`components/`** - Reusable, presentational components (MovieCard)
- **`hooks/`** - Custom React hooks for business logic (useMovies for search)
- **`services/`** - External API integrations (MoviesApi)
- **`utilities/`** - App-wide utilities (storage, context providers)
- **`types/`** - Shared TypeScript type definitions

This structure separates concerns by layer (presentation, business logic, data access) making the codebase maintainable and testable.

### Component Design

- **Functional components only** with modern React Hooks
- **Memoization strategy:**
  - `React.memo` on MovieCard to prevent re-renders when parent updates
  - `useCallback` for event handlers passed as props
  - `useMemo` for expensive computations (poster fallback generation)
- **Performance optimizations:**
  - FlatList with `removeClippedSubviews`, `initialNumToRender`, `windowSize`, `getItemLayout` and `maxToRenderPerBatch`
  - Abort controllers to cancel in-flight API requests when searching rapidly

## Persistent Storage Implementation

### How It Works

The watchlist persists across app restarts using **AsyncStorage** with an optimistic UI pattern:

1. **Storage Layer** ([utilities/watchlistStorage.ts](utilities/watchlistStorage.ts))
   - Uses `@react-native-async-storage/async-storage`
   - Stores watchlist as a JSON object: `{ [imdbID]: WatchlistMovie }`
   - Key: `"watchlist:v1"`

2. **Context Provider** ([utilities/WatchlistContext.tsx](utilities/WatchlistContext.tsx))
   - **On mount:** Hydrates state from AsyncStorage
   - **On toggle:** Updates UI immediately (optimistic), then persists in background
   - **On error:** Shows toast notification if save fails
   - Uses `useReducer` for predictable state updates

3. **Critical Test: App Restart**
   - When app is killed and reopened, `WatchlistProvider` loads data from AsyncStorage
   - Loading state prevents flickering (shows spinner until hydrated)
   - All saved movies appear exactly as they were before

### Why This Approach

- **Optimistic UI:** Users see instant feedback without waiting for storage operations
- **Reliability:** Persistence happens in useEffect, ensuring it's called after every state change
- **Error handling:** Failed saves show user-facing error messages (toast notifications)
- **Type safety:** TypeScript types ensure data integrity between storage and UI

### Testing the Persistence

1. Add movies to your watchlist
2. Force quit the app (swipe up from recent apps)
3. Reopen the app
4. Navigate to Watchlist tab - all movies should still be there

## API Integration

### OMDb API

- **Endpoint:** `https://www.omdbapi.com/`
- **Method:** Search by title (`?s=<query>&apikey=<key>`)
- **Response handling:**
  - Success: Returns array of movies
  - "Not found": Treated as empty results (not an error)
  - Other errors: Displayed to user with retry option
- **Abort controllers:** Cancels previous requests when user types rapidly

### Error States

- **API failure:** Shows error message with "Try again" button
- **No results:** Suggests popular search terms with quick-search chips
- **Network timeout:** Gracefully handled with user feedback

## Technologies Used

- **React Native** (0.81.5) - Cross-platform mobile framework
- **Expo** (~54.0) - Development platform and tooling
- **Expo Router** (6.0) - File-based navigation with tabs
- **TypeScript** (5.9) - Type safety
- **NativeWind** (4.2) - Tailwind CSS for React Native
- **AsyncStorage** (2.2) - Local persistence
- **React Native Toast Message** (2.3) - User notifications

## Performance Optimizations

1. **React.memo** on MovieCard prevents unnecessary re-renders
2. **useCallback** for stable function references (isSaved, toggle, renderItem)
3. **useMemo** for expensive computations (poster fallback, derived lists)
4. **FlatList optimizations:**
   - `removeClippedSubviews` - Unmounts off-screen items
   - `initialNumToRender={8}` - Renders 8 items initially
   - `windowSize={7}` - Keeps 7 viewports in memory
   - `maxToRenderPerBatch={10}` - Batches rendering for smoother scrolling
5. **Abort controllers** cancel redundant API calls
6. **Unique key extraction** via useCallback prevents re-renders


## Bonus Features Implemented

 **Optimistic UI** - Instant bookmark updates while saving in background
 **Pull-to-Refresh** - Swipe down to refresh movie list
 **Empty States** - Clean designs for no results and empty watchlist
 **Performance** - React.memo, useMemo, useCallback throughout
 **Search Functionality** - Search bar with suggestions and quick-search chips

