"use client"

import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from "react"
import type { Movie } from "@/types/movie"
import { fetchTrendingMovies as fetchTrending, searchMovies as searchMoviesApi } from "@/lib/tmdb-api"

interface MovieContextType {
  trendingMovies: Movie[]
  trendingPage: number
  trendingHasMore: boolean
  trendingLoading: boolean
  setTrendingPage: (page: number) => void
  fetchTrendingMovies: (page?: number) => Promise<void>

  searchResults: Movie[]
  searchQuery: string
  searchPage: number
  searchHasMore: boolean
  searchLoading: boolean
  setSearchPage: (page: number) => void
  searchMovies: (query: string, page?: number) => Promise<void>

  favorites: Movie[]
  toggleFavorite: (movie: Movie) => void
  isFavorite: (id: number) => boolean
}

const MovieContext = createContext<MovieContextType | undefined>(undefined)

export function MovieProvider({ children }: { children: ReactNode }) {
  // Trending movies state
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [trendingPage, setTrendingPage] = useState(1)
  const [trendingHasMore, setTrendingHasMore] = useState(true)
  const [trendingLoading, setTrendingLoading] = useState(false)

  // Search results state
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchPage, setSearchPage] = useState(1)
  const [searchHasMore, setSearchHasMore] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)

  // Favorites state
  const [favorites, setFavorites] = useState<Movie[]>([])

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error)
      }
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  // Fetch trending movies
  const fetchTrendingMovies = useCallback(async (page = 1) => {
    try {
      setTrendingLoading(true)
      const data = await fetchTrending(page)

      if (page === 1) {
        setTrendingMovies(data.results)
      } else {
        setTrendingMovies((prev) => [...prev, ...data.results])
      }

      setTrendingHasMore(data.page < data.total_pages)
      setTrendingLoading(false)
    } catch (error) {
      console.error("Error fetching trending movies:", error)
      setTrendingLoading(false)
    }
  }, [])

  // Search movies
  const searchMovies = useCallback(async (query: string, page = 1) => {
    if (!query.trim()) return

    try {
      setSearchLoading(true)

      if (page === 1) {
        setSearchQuery(query)
        setSearchPage(1)
      }

      const data = await searchMoviesApi(query, page)

      if (page === 1) {
        setSearchResults(data.results)
      } else {
        setSearchResults((prev) => [...prev, ...data.results])
      }

      setSearchHasMore(data.page < data.total_pages)
      setSearchLoading(false)
    } catch (error) {
      console.error("Error searching movies:", error)
      setSearchLoading(false)
    }
  }, [])

  // Toggle favorite
  const toggleFavorite = useCallback((movie: Movie) => {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.id === movie.id)

      if (exists) {
        return prev.filter((m) => m.id !== movie.id)
      } else {
        return [...prev, movie]
      }
    })
  }, [])

  // Check if movie is favorite
  const isFavorite = useCallback(
    (id: number) => {
      return favorites.some((movie) => movie.id === id)
    },
    [favorites],
  )

  return (
    <MovieContext.Provider
      value={{
        trendingMovies,
        trendingPage,
        trendingHasMore,
        trendingLoading,
        setTrendingPage,
        fetchTrendingMovies,

        searchResults,
        searchQuery,
        searchPage,
        searchHasMore,
        searchLoading,
        setSearchPage,
        searchMovies,

        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </MovieContext.Provider>
  )
}

export function useMovie() {
  const context = useContext(MovieContext)
  if (context === undefined) {
    throw new Error("useMovie must be used within a MovieProvider")
  }
  return context
}
