"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Film, Heart, LogOut, Search, User } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/context/auth-context"
import { useMovie } from "@/context/movie-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ModeToggle } from "./mode-toggle"

export default function Header() {
  const router = useRouter()
  const { theme } = useTheme()
  const { user, logout } = useAuth()
  const { searchMovies } = useMovie()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      searchMovies(searchQuery)
      // Save to local storage
      localStorage.setItem("lastSearch", searchQuery)
      router.push("/")
    }
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Film className="h-6 w-6" />
            <span className="text-xl font-bold">Movie Explorer</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex w-1/2 mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for movies..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="ml-2">
              Search
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <Link href="/favorites">
              <Button variant="ghost" size="icon" title="Favorites">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  <span>{user?.username}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for movies..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full mt-2">
            Search
          </Button>
        </form>
      </div>
    </header>
  )
}
