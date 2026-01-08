export interface SearchMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string; 
  Type?: string;
}

export interface SearchResponse {
  Search?: SearchMovie[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
}


export type WatchlistMovie = Pick<
  SearchMovie,
  "imdbID" | "Title" | "Year" | "Poster"
>;
