export interface FilmType {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: Date | number;
  vote_average: number;
  genre_ids: number[];
  rating?: number;
}

export interface SearchType {
  guestSessionID: string;
  query: string;
}
