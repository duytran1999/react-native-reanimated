const API_KEY = "167b0f1047ab31d9cccc7fbc847e518b";

const URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;

export const UrlCastMovie = (id_movie) => {
  return `http://api.themoviedb.org/3/movie/${id_movie}/casts?api_key=${API_KEY}`;
};

export const UrlImageCast = (imagePath) => {
  return `https://image.tmdb.org/t/p/w500/${imagePath}`;
};

export const getCastOfMovie = async (id_movie) => {
  const url = UrlCastMovie(id_movie);
  const { id, cast } = await fetch(url).then((movie) => movie.json());
  const list_cast = cast.map(
    ({ id, adult, name, original_name, profile_path, cast_id, character }) => ({
      key: id,
      adult,
      name,
      original_name,
      img_profile_path: profile_path
        ? UrlImageCast(profile_path)
        : "https://img.icons8.com/ios-glyphs/90/000000/user--v1.png",
      cast_id,
      character,
    })
  );
  return list_cast;
};

const genres = {
  12: "Adventure",
  14: "Fantasy",
  16: "Animation",
  18: "Drama",
  27: "Horror",
  28: "Action",
  35: "Comedy",
  36: "History",
  37: "Western",
  53: "Thriller",
  80: "Crime",
  99: "Documentary",
  878: "Science Fiction",
  9648: "Mystery",
  10402: "Music",
  10749: "Romance",
  10751: "Family",
  10752: "War",
  10770: "TV Movie",
};

const URL_IMAGE_POSTER = (path) => {
  return `https://image.tmdb.org/t/p/w440_and_h660_face${path}`;
};

const URL_IMAGE_BACKDROP = (path) => {
  return `https://image.tmdb.org/t/p/w370_and_h556_multi_faces${path}`;
};

export const getMovie = async () => {
  const { results, page } = await fetch(URL).then((movie) => movie.json());
  const movies = results.map(
    ({
      id,
      original_title,
      poster_path,
      backdrop_path,
      vote_average,
      overview,
      release_date,
      genre_ids,
    }) => ({
      key: id,
      title: original_title,
      poster: URL_IMAGE_POSTER(poster_path),
      backdrop: URL_IMAGE_BACKDROP(backdrop_path),
      rating: vote_average,
      description: overview,
      releaseDate: release_date,
      genre: genre_ids.map((item) => genres[item]),
    })
  );
  return movies;
};
