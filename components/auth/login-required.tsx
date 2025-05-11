"use client"

import type React from "react"
import { useAuth } from "@/context/auth-context"
import LoginForm from "./login-form"

export default function LoginRequired({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  // If still loading, show nothing to prevent flash
  if (loading) {
    return null
  }

  // If not logged in, show login form
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <LoginForm />
      </div>
    )
  }

  // If logged in, show children
  return children
}
