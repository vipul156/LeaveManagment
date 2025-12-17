"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Home, Users, FileText, Calendar, Settings, LogOut, Menu, X, ClipboardList } from "lucide-react"
import { useState } from "react"

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const getNavItems = () => {
    const baseItems = [
      { path: `/${user.role}`, icon: Home, label: "Dashboard" },
      { path: `/${user.role}/my-leaves`, icon: Calendar, label: "My Leaves" },
      { path: `/${user.role}/policies`, icon: FileText, label: "Leave Policies" },
    ]

    if (user.role === "admin") {
      return [
        ...baseItems,
        { path: "/admin/users", icon: Users, label: "Users" },
        { path: "/admin/all-leaves", icon: ClipboardList, label: "All Leave Requests" },
        { path: "/admin/manage-policies", icon: Settings, label: "Manage Policies" },
      ]
    }

    if (user.role === "manager") {
      return [...baseItems, { path: "/manager/team-leaves", icon: ClipboardList, label: "Team Leaves" }]
    }

    return baseItems
  }

  const navItems = getNavItems()

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path
    return (
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon className="w-5 h-5" />
        <span className="font-medium">{item.label}</span>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg">Leave Management</h1>
        <div className="w-10" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r z-50 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="font-bold text-xl text-blue-600">LMS</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

export default Layout
