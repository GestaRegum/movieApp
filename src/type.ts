interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: Date | number;
  vote_average: number;
  genre_ids: number[];
  rating?: number;
}

interface MovieCardType {
  movie: Movie
}

interface Search {
  query: string;
}

interface Genres {
  id: number;
  name: string;
}

export type { Movie, Search, Genres, MovieCardType };
