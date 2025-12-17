import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminUsers from "./pages/admin/Users"
import AdminAllLeaves from "./pages/admin/AllLeaves"
import AdminPolicies from "./pages/admin/ManagePolicies"
import AdminMyLeaves from "./pages/admin/MyLeaves"
import AdminViewPolicies from "./pages/admin/ViewPolicies"
import ManagerDashboard from "./pages/manager/Dashboard"
import ManagerTeamLeaves from "./pages/manager/TeamLeaves"
import ManagerMyLeaves from "./pages/manager/MyLeaves"
import ManagerViewPolicies from "./pages/manager/ViewPolicies"
import EmployeeDashboard from "./pages/employee/Dashboard"
import EmployeeMyLeaves from "./pages/employee/MyLeaves"
import EmployeeViewPolicies from "./pages/employee/ViewPolicies"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/all-leaves"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminAllLeaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-policies"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPolicies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/my-leaves"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminMyLeaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/policies"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminViewPolicies />
              </ProtectedRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/team-leaves"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerTeamLeaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/my-leaves"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerMyLeaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/policies"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerViewPolicies />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/my-leaves"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeMyLeaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/policies"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeViewPolicies />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
