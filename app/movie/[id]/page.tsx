import { Suspense } from "react"
import { notFound } from "next/navigation"
import Header from "@/components/layout/header"
import MovieDetails from "@/components/movies/movie-details"
import { Skeleton } from "@/components/ui/skeleton"
import LoginRequired from "@/components/auth/login-required"

interface MoviePageProps {
  params: {
    id: string
  }
}

export default function MoviePage({ params }: MoviePageProps) {
  // Validate that the ID is a number
  if (isNaN(Number(params.id))) {
    notFound()
  }

  return (
    <LoginRequired>
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={<MovieDetailsSkeleton />}>
            <MovieDetails id={params.id} />
          </Suspense>
        </div>
      </main>
    </LoginRequired>
  )
}

function MovieDetailsSkeleton() {
  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-8">
      <Skeleton className="h-[450px] w-full rounded-md" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    </div>
  )
}
