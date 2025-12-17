"use client"

import { useState, useEffect } from "react"
import Layout from "../../components/Layout"
import api from "../../utils/api"
import { Check, X, Filter, Search } from "lucide-react"

const AdminAllLeaves = () => {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [remarks, setRemarks] = useState({})

  useEffect(() => {
    fetchLeaves()
  }, [])

  const fetchLeaves = async () => {
    try {
      const response = await api.get("/leaves/all")
      setLeaves(response.data)
    } catch (error) {
      console.error("Error fetching leaves:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (leaveId, status) => {
    try {
      await api.patch(`/leaves/${leaveId}/status`, {
        status,
        remarks: remarks[leaveId] || "",
      })
      fetchLeaves()
      setRemarks({ ...remarks, [leaveId]: "" })
    } catch (error) {
      alert(error.response?.data?.message || "Error updating leave status")
    }
  }

  const filteredLeaves = leaves.filter((leave) => {
    const matchesFilter = filter === "all" || leave.status === filter
    const matchesSearch =
      leave.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${styles[status]}`}>{status}</span>
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
          <h1 className="text-2xl font-bold text-gray-900">All Leave Requests</h1>
          <p className="text-gray-600 mt-1">Review and manage all leave requests</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or leave type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No leave requests found
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{leave.user?.name}</p>
                          <p className="text-sm text-gray-500">
                            {leave.user?.role} - {leave.user?.department}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{leave.leaveType}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-700">
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          </p>
                          <p className="text-sm text-gray-500">{leave.daysRequested} day(s)</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 max-w-xs truncate">{leave.reason}</p>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(leave.status)}</td>
                      <td className="px-6 py-4">
                        {leave.status === "pending" ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Remarks (optional)"
                              value={remarks[leave._id] || ""}
                              onChange={(e) => setRemarks({ ...remarks, [leave._id]: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStatusUpdate(leave._id, "approved")}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(leave._id, "rejected")}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            {leave.approvedBy && <p>By: {leave.approvedBy?.name}</p>}
                            {leave.remarks && <p>Remarks: {leave.remarks}</p>}
                          </div>
                        )}
                      </td>
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

export default AdminAllLeaves
