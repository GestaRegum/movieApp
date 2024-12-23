const urlImageMovie = 'https://image.tmdb.org/t/p/original/';

const optionsApiForGet = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OGFlNWZiMmJmMThhZDM3YzM2MDU4ZDM4ZjAwNTYxYiIsIm5iZiI6MTczMjcxNDkyNC4zNDkyNzU4LCJzdWIiOiI2NzQ3MTA2NTI5Y2EwZWVhMzA1MDc3ZDQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.cx6UvdwL_3oRV2HEzeAiez5FM_DYbhAMPBwRuoYvv94',
  },
};

const optionsApiForPost = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OGFlNWZiMmJmMThhZDM3YzM2MDU4ZDM4ZjAwNTYxYiIsIm5iZiI6MTczMjcxMDUwMS4zOTEsInN1YiI6IjY3NDcxMDY1MjljYTBlZWEzMDUwNzdkNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cEK91n3NznOxH2QoYFzzvhCSepkfderr5bVzjh3KsBU',
  },
};

const urlForSearchMovie = (query: string, cur: number): string => {
  return `https://api.themoviedb.org/3/search/movie?query=${query}&page=${cur}`;
};

const urlForRating = (filmId: number, sessionId: string | null) =>
  `https://api.themoviedb.org/3/movie/${filmId}/rating?guest_session_id=${sessionId}`;

const optionsForRating = (value: number) => {
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

const urlForMyRateMovie = (sessionId: string | null, page: number) => {
  return `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?language=en-US&page=${page}&sort_by=created_at.asc`;
};

const urlForGenres = 'https://api.themoviedb.org/3/genre/movie/list?language=en';

export {
  urlForGenres,
  optionsApiForGet,
  optionsApiForPost,
  urlImageMovie,
  urlForSearchMovie,
  optionsForRating,
  urlForRating,
  urlForMyRateMovie,
};
