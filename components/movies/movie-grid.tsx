"use client"

import { useRef, useEffect } from "react"
import MovieCard from "./movie-card"
import { Button } from "@/components/ui/button"
import type { Movie } from "@/types/movie"

interface MovieGridProps {
  movies: Movie[]
  title: string
  onLoadMore?: () => void
  hasMore?: boolean
  loading?: boolean
}

export default function MovieGrid({ movies, title, onLoadMore, hasMore = false, loading = false }: MovieGridProps) {
  const observerTarget = useRef(null)

  useEffect(() => {
    if (!onLoadMore || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          onLoadMore()
        }
      },
      { threshold: 1.0 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [onLoadMore, hasMore, loading])

  if (movies.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground">No movies found</p>
      </div>
    )
  }

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {onLoadMore && (
        <div className="mt-8 text-center">
          {hasMore ? (
            <>
              <Button onClick={onLoadMore} disabled={loading} className="mx-auto">
                {loading ? "Loading..." : "Load More"}
              </Button>
              <div ref={observerTarget} className="h-4" />
            </>
          ) : (
            <p className="text-muted-foreground">No more movies to load</p>
          )}
        </div>
      )}
    </div>
  )
}
