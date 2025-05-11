"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { useMovie } from "@/context/movie-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Movie } from "@/types/movie"

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { toggleFavorite, isFavorite } = useMovie()
  const favorite = isFavorite(movie.id)

  const imageUrl = movie.poster_path || "/placeholder.svg?height=750&width=500"

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Link href={`/movie/${movie.id}`} className="overflow-hidden">
        <div className="aspect-[2/3] relative">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4 flex-grow">
        <Link href={`/movie/${movie.id}`}>
          <h3 className="font-semibold line-clamp-2 hover:underline">{movie.title}</h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <Badge variant="outline">{movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</Badge>
          <Badge variant={movie.vote_average >= 7 ? "default" : "secondary"}>★ {movie.vote_average.toFixed(1)}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant={favorite ? "default" : "outline"}
          size="sm"
          className="w-full"
          onClick={() => toggleFavorite(movie)}
        >
          <Heart className={`mr-2 h-4 w-4 ${favorite ? "fill-current" : ""}`} />
          {favorite ? "Favorited" : "Add to Favorites"}
        </Button>
      </CardFooter>
    </Card>
  )
}
