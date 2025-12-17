"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api from "../utils/api"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password })
    const { token, ...userData } = response.data

    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setUser(userData)

    return userData
  }

  const register = async (name, email, password, department) => {
    const response = await api.post("/auth/register", { name, email, password, department })
    const { token, ...userData } = response.data

    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setUser(userData)

    return userData
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
