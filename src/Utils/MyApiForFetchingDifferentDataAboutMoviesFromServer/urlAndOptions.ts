export const urlImageMovie: string = 'https://image.tmdb.org/t/p/original/';

export const urlForGenres: string = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
export const guestSessionUrl: string = 'https://api.themoviedb.org/3/authentication/guest_session/new';

export const urlForSearchMovie = (query: string, cur: number): string => {
  return `https://api.themoviedb.org/3/search/movie?query=${query}&page=${cur}`;
};

export const urlForRating = (filmId: number, sessionId: string | null): string => {
  return `https://api.themoviedb.org/3/movie/${filmId}/rating?guest_session_id=${sessionId}`;
};

export const urlForMyRateMovie = (sessionId: string | null, page: number): string => {
  return `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?language=en-US&page=${page}&sort_by=created_at.asc`;
};

export const optionsApiForGet = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OGFlNWZiMmJmMThhZDM3YzM2MDU4ZDM4ZjAwNTYxYiIsIm5iZiI6MTczMjcxNDkyNC4zNDkyNzU4LCJzdWIiOiI2NzQ3MTA2NTI5Y2EwZWVhMzA1MDc3ZDQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.cx6UvdwL_3oRV2HEzeAiez5FM_DYbhAMPBwRuoYvv94',
  },
};

export const optionsForRating = (value: number) => {
  const isDeleting = value === 0;
  const method = isDeleting ? 'DELETE' : 'POST';

  const options = {
    method,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OGFlNWZiMmJmMThhZDM3YzM2MDU4ZDM4ZjAwNTYxYiIsIm5iZiI6MTczMjcxMDUwMS4zOTEsInN1YiI6IjY3NDcxMDY1MjljYTBlZWEzMDUwNzdkNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cEK91n3NznOxH2QoYFzzvhCSepkfderr5bVzjh3KsBU',
    },
    ...(isDeleting ? {} : { body: JSON.stringify({ value }) }),
  };

  return options;
};
