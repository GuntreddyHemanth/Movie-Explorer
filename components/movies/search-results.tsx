"use client"

import { useEffect } from "react"
import { useMovie } from "@/context/movie-context"
import MovieGrid from "./movie-grid"

export default function SearchResults() {
  const { searchResults, searchQuery, searchPage, searchHasMore, searchLoading, setSearchPage, searchMovies } =
    useMovie()

  useEffect(() => {
    // Load last search from localStorage on initial render
    const lastSearch = localStorage.getItem("lastSearch")
    if (lastSearch && searchResults.length === 0 && !searchQuery) {
      searchMovies(lastSearch)
    }
  }, [searchResults.length, searchQuery, searchMovies])

  const handleLoadMore = () => {
    setSearchPage(searchPage + 1)
    searchMovies(searchQuery, searchPage + 1)
  }

  if (!searchQuery || searchResults.length === 0) {
    return null
  }

  return (
    <MovieGrid
      movies={searchResults}
      title={`Search Results for "${searchQuery}"`}
      onLoadMore={handleLoadMore}
      hasMore={searchHasMore}
      loading={searchLoading}
    />
  )
}
