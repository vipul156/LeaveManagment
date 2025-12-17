"use client"

import { useState, useEffect } from "react"
import Layout from "../../components/Layout"
import { useAuth } from "../../context/AuthContext"
import api from "../../utils/api"
import { Plus, X, Trash2 } from "lucide-react"

const ManagerMyLeaves = () => {
  const { user } = useAuth()
  const [leaves, setLeaves] = useState([])
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [leavesRes, policiesRes] = await Promise.all([api.get("/leaves/my"), api.get("/policies")])
      setLeaves(leavesRes.data)
      setPolicies(policiesRes.data.filter((p) => p.isActive))
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post("/leaves", formData)
      fetchData()
      setShowModal(false)
      setFormData({ leaveType: "", startDate: "", endDate: "", reason: "" })
    } catch (error) {
      alert(error.response?.data?.message || "Error creating leave request")
    }
  }

  const handleCancel = async (leaveId) => {
    if (!window.confirm("Are you sure you want to cancel this leave request?")) return

    try {
      await api.delete(`/leaves/${leaveId}`)
      fetchData()
    } catch (error) {
      alert(error.response?.data?.message || "Error cancelling leave")
    }
  }

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Leave Requests</h1>
            <p className="text-gray-600 mt-1">
              Leave Balance: <span className="font-semibold text-blue-600">{user.leaveBalance} days</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">Manager leaves require Admin approval</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Apply Leave
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No leave requests yet
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-700">{leave.leaveType}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-700">
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          </p>
                          <p className="text-sm text-gray-500">{leave.daysRequested} day(s)</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{leave.reason}</td>
                      <td className="px-6 py-4">{getStatusBadge(leave.status)}</td>
                      <td className="px-6 py-4">
                        {leave.status === "pending" && (
                          <button
                            onClick={() => handleCancel(leave._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Cancel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        {leave.status !== "pending" && leave.remarks && (
                          <p className="text-sm text-gray-500">Remarks: {leave.remarks}</p>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Apply Leave Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Apply for Leave</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                  <select
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="">Select leave type</option>
                    {policies.map((policy) => (
                      <option key={policy._id} value={policy.name}>
                        {policy.name} (Max: {policy.maxDaysPerYear} days)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    rows={3}
                    placeholder="Reason for leave..."
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ManagerMyLeaves
