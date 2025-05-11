import { Suspense } from "react"
import Header from "@/components/layout/header"
import TrendingMovies from "@/components/movies/trending-movies"
import SearchResults from "@/components/movies/search-results"
import { Skeleton } from "@/components/ui/skeleton"
import LoginRequired from "@/components/auth/login-required"

export default function Home() {
  return (
    <LoginRequired>
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={<TrendingMoviesSkeleton />}>
            <TrendingMovies />
          </Suspense>
          <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResults />
          </Suspense>
        </div>
      </main>
    </LoginRequired>
  )
}

function TrendingMoviesSkeleton() {
  return (
    <div className="mb-10">
      <Skeleton className="h-10 w-48 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-64 w-full rounded-md" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
      </div>
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div>
      <Skeleton className="h-10 w-48 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-64 w-full rounded-md" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
      </div>
    </div>
  )
}
