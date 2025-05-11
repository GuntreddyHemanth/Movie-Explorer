"use client"

import { useMovie } from "@/context/movie-context"
import MovieGrid from "./movie-grid"

export default function FavoriteMovies() {
  const { favorites } = useMovie()

  return <MovieGrid movies={favorites} title="Your Favorite Movies" />
}
