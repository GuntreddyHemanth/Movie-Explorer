// API key should be stored in environment variables
const API_KEY = "f1f56c8e" // Demo key for example

const BASE_URL = "https://www.omdbapi.com"

// Helper function to convert OMDb movie to our Movie type
function convertOMDbMovie(movie: any): any {
  return {
    id: movie.imdbID,
    title: movie.Title,
    poster_path: movie.Poster !== "N/A" ? movie.Poster : null,
    release_date: movie.Year + "-01-01", // OMDb only provides year, so we add a default month/day
    vote_average: movie.imdbRating ? Number.parseFloat(movie.imdbRating) : 0,
    overview: movie.Plot || "No overview available",
  }
}

// Fetch trending/popular movies (OMDb doesn't have trending, so we'll search for popular terms)
export async function fetchTrendingMovies(page = 1) {
  // Popular search terms to simulate trending
  const popularTerms = ["marvel", "star", "action", "2023", "adventure"]
  const randomTerm = popularTerms[Math.floor(Math.random() * popularTerms.length)]

  const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${randomTerm}&type=movie&page=${page}`)

  if (!response.ok) {
    throw new Error("Failed to fetch trending movies")
  }

  const data = await response.json()

  if (data.Response === "False") {
    throw new Error(data.Error || "Failed to fetch trending movies")
  }

  // Get detailed info for each movie to get ratings
  const detailedMovies = await Promise.all(
    data.Search.map(async (movie: any) => {
      const detailResponse = await fetch(`${BASE_URL}/?apikey=${API_KEY}&i=${movie.imdbID}`)
      const detailData = await detailResponse.json()
      return convertOMDbMovie(detailData)
    }),
  )

  return {
    page: page,
    results: detailedMovies,
    total_pages: Math.ceil(Number.parseInt(data.totalResults) / 10), // OMDb returns 10 results per page
    total_results: Number.parseInt(data.totalResults),
  }
}

// Search movies
export async function searchMovies(query: string, page = 1) {
  const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie&page=${page}`)

  if (!response.ok) {
    throw new Error("Failed to search movies")
  }

  const data = await response.json()

  if (data.Response === "False") {
    return {
      page: page,
      results: [],
      total_pages: 0,
      total_results: 0,
    }
  }

  // Get detailed info for each movie to get ratings
  const detailedMovies = await Promise.all(
    data.Search.map(async (movie: any) => {
      const detailResponse = await fetch(`${BASE_URL}/?apikey=${API_KEY}&i=${movie.imdbID}`)
      const detailData = await detailResponse.json()
      return convertOMDbMovie(detailData)
    }),
  )

  return {
    page: page,
    results: detailedMovies,
    total_pages: Math.ceil(Number.parseInt(data.totalResults) / 10), // OMDb returns 10 results per page
    total_results: Number.parseInt(data.totalResults),
  }
}

// Fetch movie details
export async function fetchMovieDetails(movieId: string) {
  const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&i=${movieId}&plot=full`)

  if (!response.ok) {
    throw new Error("Failed to fetch movie details")
  }

  const data = await response.json()

  if (data.Response === "False") {
    throw new Error(data.Error || "Failed to fetch movie details")
  }

  // Convert OMDb format to our MovieDetails format
  return {
    id: data.imdbID,
    title: data.Title,
    poster_path: data.Poster !== "N/A" ? data.Poster : null,
    backdrop_path: null, // OMDb doesn't provide backdrop images
    release_date: data.Released !== "N/A" ? data.Released : data.Year + "-01-01",
    vote_average: data.imdbRating !== "N/A" ? Number.parseFloat(data.imdbRating) : 0,
    overview: data.Plot !== "N/A" ? data.Plot : "No overview available",
    genres: data.Genre !== "N/A" ? data.Genre.split(", ").map((name: string, id: number) => ({ id, name })) : [],
    runtime: data.Runtime !== "N/A" ? Number.parseInt(data.Runtime) : 0,
    status: "Released",
    tagline: data.Awards !== "N/A" ? data.Awards : "",
    budget: 0, // Not provided by OMDb
    revenue: 0, // Not provided by OMDb
    original_language: data.Language !== "N/A" ? data.Language.split(", ")[0] : "en",
    production_companies:
      data.Production !== "N/A" && data.Production
        ? data.Production.split(", ").map((name: string, id: number) => ({
            id,
            name,
            logo_path: null,
            origin_country: "",
          }))
        : [],
    production_countries:
      data.Country !== "N/A" && data.Country
        ? data.Country.split(", ").map((name: string) => ({
            iso_3166_1: "",
            name,
          }))
        : [],
    // Additional OMDb specific fields
    director: data.Director !== "N/A" ? data.Director : "",
    actors: data.Actors !== "N/A" ? data.Actors : "",
    writer: data.Writer !== "N/A" ? data.Writer : "",
    rated: data.Rated !== "N/A" ? data.Rated : "",
  }
}

// Fetch movie credits (cast & crew)
export async function fetchMovieCredits(movieId: string) {
  // OMDb doesn't have a separate credits endpoint, so we'll use the movie details
  const movieDetails = await fetchMovieDetails(movieId)

  // Parse actors string into cast array
  const cast = movieDetails.actors.split(", ").map((name, id) => ({
    id,
    name,
    character: "Character information not available",
    profile_path: null,
  }))

  return { cast }
}

// Fetch movie videos (trailers)
export async function fetchMovieVideos(movieId: string) {
  // OMDb doesn't provide video links, so we'll return an empty array
  // In a real app, you might want to search YouTube API for "[movie title] trailer"
  return { results: [] }
}

// Filter movies by genre (simplified implementation)
export async function filterMoviesByGenre(genreName: string, page = 1) {
  const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${genreName}&type=movie&page=${page}`)

  if (!response.ok) {
    throw new Error("Failed to filter movies by genre")
  }

  const data = await response.json()

  if (data.Response === "False") {
    return {
      page: page,
      results: [],
      total_pages: 0,
      total_results: 0,
    }
  }

  // Get detailed info for each movie
  const detailedMovies = await Promise.all(
    data.Search.map(async (movie: any) => {
      const detailResponse = await fetch(`${BASE_URL}/?apikey=${API_KEY}&i=${movie.imdbID}`)
      const detailData = await detailResponse.json()
      return convertOMDbMovie(detailData)
    }),
  )

  return {
    page: page,
    results: detailedMovies,
    total_pages: Math.ceil(Number.parseInt(data.totalResults) / 10),
    total_results: Number.parseInt(data.totalResults),
  }
}

// Fetch movie genres (OMDb doesn't have a genres endpoint, so we'll provide common ones)
export async function fetchMovieGenres() {
  const commonGenres = [
    { id: 1, name: "Action" },
    { id: 2, name: "Adventure" },
    { id: 3, name: "Animation" },
    { id: 4, name: "Comedy" },
    { id: 5, name: "Crime" },
    { id: 6, name: "Documentary" },
    { id: 7, name: "Drama" },
    { id: 8, name: "Family" },
    { id: 9, name: "Fantasy" },
    { id: 10, name: "History" },
    { id: 11, name: "Horror" },
    { id: 12, name: "Music" },
    { id: 13, name: "Mystery" },
    { id: 14, name: "Romance" },
    { id: 15, name: "Science Fiction" },
    { id: 16, name: "Thriller" },
    { id: 17, name: "War" },
    { id: 18, name: "Western" },
  ]

  return { genres: commonGenres }
}
