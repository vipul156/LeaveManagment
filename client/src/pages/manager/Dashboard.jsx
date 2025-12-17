"use client"

import { useState, useEffect } from "react"
import Layout from "../../components/Layout"
import { useAuth } from "../../context/AuthContext"
import api from "../../utils/api"
import { Clock, CheckCircle, XCircle, Calendar } from "lucide-react"

const ManagerDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    pendingTeamLeaves: 0,
    approvedTeamLeaves: 0,
    rejectedTeamLeaves: 0,
    myPendingLeaves: 0,
    myLeaveBalance: user.leaveBalance,
  })
  const [recentTeamLeaves, setRecentTeamLeaves] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [teamLeavesRes, myLeavesRes] = await Promise.all([api.get("/leaves/team"), api.get("/leaves/my")])

      const teamLeaves = teamLeavesRes.data
      const myLeaves = myLeavesRes.data

      setStats({
        pendingTeamLeaves: teamLeaves.filter((l) => l.status === "pending").length,
        approvedTeamLeaves: teamLeaves.filter((l) => l.status === "approved").length,
        rejectedTeamLeaves: teamLeaves.filter((l) => l.status === "rejected").length,
        myPendingLeaves: myLeaves.filter((l) => l.status === "pending").length,
        myLeaveBalance: user.leaveBalance,
      })

      setRecentTeamLeaves(teamLeaves.slice(0, 5))
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${styles[status]}`}>{status}</span>
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
          <p className="text-gray-600 mt-1">Manage your team's leave requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Clock} label="Pending Team Leaves" value={stats.pendingTeamLeaves} color="bg-yellow-500" />
          <StatCard
            icon={CheckCircle}
            label="Approved Team Leaves"
            value={stats.approvedTeamLeaves}
            color="bg-green-600"
          />
          <StatCard icon={XCircle} label="Rejected Team Leaves" value={stats.rejectedTeamLeaves} color="bg-red-500" />
          <StatCard
            icon={Calendar}
            label="My Leave Balance"
            value={`${stats.myLeaveBalance} days`}
            color="bg-blue-600"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Team Leave Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTeamLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No team leave requests yet
                    </td>
                  </tr>
                ) : (
                  recentTeamLeaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{leave.user?.name}</p>
                          <p className="text-sm text-gray-500">{leave.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{leave.leaveType}</td>
                      <td className="px-6 py-4 text-gray-700">{leave.daysRequested} day(s)</td>
                      <td className="px-6 py-4">{getStatusBadge(leave.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ManagerDashboard
