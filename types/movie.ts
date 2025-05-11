export interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  overview: string
}

export interface MovieDetails extends Movie {
  backdrop_path: string | null
  genres: Genre[]
  runtime: number
  status: string
  tagline: string
  budget: number
  revenue: number
  original_language: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  // OMDb specific fields
  director?: string
  actors?: string
  writer?: string
  rated?: string
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
}

export interface MovieResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}
