"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Heart, Play } from "lucide-react"
import { useMovie } from "@/context/movie-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Movie, MovieDetails as MovieDetailsType, Cast, Video } from "@/types/movie"
import { fetchMovieDetails, fetchMovieCredits, fetchMovieVideos } from "@/lib/tmdb-api"

interface MovieDetailsProps {
  id: string
}

export default function MovieDetails({ id }: MovieDetailsProps) {
  const { toggleFavorite, isFavorite } = useMovie()
  const [movie, setMovie] = useState<MovieDetailsType | null>(null)
  const [cast, setCast] = useState<Cast[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const favorite = isFavorite(Number(id))

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [movieData, creditsData, videosData] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieCredits(id),
          fetchMovieVideos(id),
        ])

        setMovie(movieData)
        setCast(creditsData.cast.slice(0, 10))

        // OMDb doesn't provide trailers, so we'll set an empty array
        setVideos([])

        setLoading(false)
      } catch (err) {
        console.error("Error fetching movie details:", err)
        setError("Failed to load movie details. Please try again later.")
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error || !movie) {
    return <div className="text-center py-10 text-red-500">{error || "Movie not found"}</div>
  }

  const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.svg?height=750&width=500"

  const trailer = videos.length > 0 ? videos[0] : null

  const handleToggleFavorite = () => {
    const movieForFavorite: Movie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      overview: movie.overview,
    }
    toggleFavorite(movieForFavorite)
  }

  return (
    <div>
      {backdropUrl && (
        <div className="relative w-full h-[300px] md:h-[400px] -mx-4 -mt-8 mb-8">
          <Image
            src={backdropUrl || "/placeholder.svg"}
            alt={movie.title}
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      <Link href="/" className="inline-flex items-center mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Movies
      </Link>

      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div>
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={posterUrl || "/placeholder.svg"}
              alt={movie.title}
              fill
              priority
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
          <Button variant={favorite ? "default" : "outline"} className="w-full mt-4" onClick={handleToggleFavorite}>
            <Heart className={`mr-2 h-4 w-4 ${favorite ? "fill-current" : ""}`} />
            {favorite ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{movie.title}</h1>

          <div className="flex flex-wrap gap-2 mt-2 mb-4">
            {movie.genres.map((genre) => (
              <Badge key={genre.id} variant="secondary">
                {genre.name}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <span>{movie.runtime} min</span>
            <span className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              {movie.vote_average.toFixed(1)}/10
            </span>
          </div>

          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="mb-6">{movie.overview}</p>

          {movie.title && (
            <div className="mb-6">
              <Button variant="outline" asChild>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " trailer")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Search for Trailer on YouTube
                </a>
              </Button>
            </div>
          )}

          <Tabs defaultValue="cast">
            <TabsList>
              <TabsTrigger value="cast">Cast</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="cast" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {cast.map((person) => (
                  <div key={person.id} className="text-center">
                    <div className="relative aspect-square mb-2">
                      <Image
                        src={
                          person.profile_path
                            ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                            : "/placeholder.svg?height=200&width=200"
                        }
                        alt={person.name}
                        fill
                        className="rounded-full object-cover"
                        sizes="(max-width: 768px) 50vw, 100px"
                      />
                    </div>
                    <p className="font-medium text-sm">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.character}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movie.director && (
                  <div>
                    <h3 className="font-semibold mb-2">Director</h3>
                    <p>{movie.director}</p>
                  </div>
                )}
                {movie.writer && (
                  <div>
                    <h3 className="font-semibold mb-2">Writer</h3>
                    <p>{movie.writer}</p>
                  </div>
                )}
                {movie.rated && (
                  <div>
                    <h3 className="font-semibold mb-2">Rated</h3>
                    <p>{movie.rated}</p>
                  </div>
                )}
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Production</h3>
                    <ul className="list-disc list-inside">
                      {movie.production_companies.map((company, index) => (
                        <li key={index}>{company.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {movie.production_countries && movie.production_countries.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Country</h3>
                    <ul className="list-disc list-inside">
                      {movie.production_countries.map((country, index) => (
                        <li key={index}>{country.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {movie.original_language && (
                  <div>
                    <h3 className="font-semibold mb-2">Language</h3>
                    <p>{movie.original_language}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
