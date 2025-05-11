import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { MovieProvider } from "@/context/movie-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Movie Explorer - Discover Your Favorite Films",
  description: "Search for movies, view details, and discover trending films",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <MovieProvider>{children}</MovieProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
