import Header from "@/components/layout/header"
import FavoriteMovies from "@/components/movies/favorite-movies"
import LoginRequired from "@/components/auth/login-required"

export default function FavoritesPage() {
  return (
    <LoginRequired>
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Your Favorite Movies</h1>
          <FavoriteMovies />
        </div>
      </main>
    </LoginRequired>
  )
}
