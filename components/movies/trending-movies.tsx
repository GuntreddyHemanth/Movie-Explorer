"use client"

import { useEffect } from "react"
import { useMovie } from "@/context/movie-context"
import MovieGrid from "./movie-grid"

export default function TrendingMovies() {
  const { trendingMovies, fetchTrendingMovies, trendingPage, setTrendingPage, trendingHasMore, trendingLoading } =
    useMovie()

  useEffect(() => {
    if (trendingMovies.length === 0) {
      fetchTrendingMovies()
    }
  }, [trendingMovies.length, fetchTrendingMovies])

  const handleLoadMore = () => {
    setTrendingPage(trendingPage + 1)
    fetchTrendingMovies(trendingPage + 1)
  }

  return (
    <MovieGrid
      movies={trendingMovies}
      title="Trending Movies"
      onLoadMore={handleLoadMore}
      hasMore={trendingHasMore}
      loading={trendingLoading}
    />
  )
}
