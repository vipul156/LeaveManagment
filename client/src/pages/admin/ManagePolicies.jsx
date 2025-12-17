"use client"

import { useState, useEffect } from "react"
import Layout from "../../components/Layout"
import api from "../../utils/api"
import { Plus, Edit2, Trash2, X, FileText } from "lucide-react"

const ManagePolicies = () => {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxDaysPerYear: 10,
    carryForward: false,
    isActive: true,
  })

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const response = await api.get("/policies")
      setPolicies(response.data)
    } catch (error) {
      console.error("Error fetching policies:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPolicy) {
        await api.put(`/policies/${editingPolicy._id}`, formData)
      } else {
        await api.post("/policies", formData)
      }
      fetchPolicies()
      closeModal()
    } catch (error) {
      alert(error.response?.data?.message || "Error saving policy")
    }
  }

  const handleDelete = async (policyId) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return

    try {
      await api.delete(`/policies/${policyId}`)
      fetchPolicies()
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting policy")
    }
  }

  const openEditModal = (policy) => {
    setEditingPolicy(policy)
    setFormData({
      name: policy.name,
      description: policy.description,
      maxDaysPerYear: policy.maxDaysPerYear,
      carryForward: policy.carryForward,
      isActive: policy.isActive,
    })
    setShowModal(true)
  }

  const openCreateModal = () => {
    setEditingPolicy(null)
    setFormData({
      name: "",
      description: "",
      maxDaysPerYear: 10,
      carryForward: false,
      isActive: true,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingPolicy(null)
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
            <h1 className="text-2xl font-bold text-gray-900">Leave Policies</h1>
            <p className="text-gray-600 mt-1">Define and manage leave policies</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Policy
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy) => (
            <div key={policy._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${policy.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                >
                  {policy.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{policy.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{policy.description || "No description"}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Max Days/Year:</span>
                  <span className="font-medium text-gray-900">{policy.maxDaysPerYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Carry Forward:</span>
                  <span className="font-medium text-gray-900">{policy.carryForward ? "Yes" : "No"}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => openEditModal(policy)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(policy._id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {policies.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No policies yet</h3>
            <p className="text-gray-500 mt-1">Create your first leave policy to get started</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{editingPolicy ? "Edit Policy" : "Create Policy"}</h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Policy Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., Annual Leave"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    rows={3}
                    placeholder="Describe this leave policy..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Days Per Year</label>
                  <input
                    type="number"
                    value={formData.maxDaysPerYear}
                    onChange={(e) => setFormData({ ...formData, maxDaysPerYear: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    min={1}
                    required
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="carryForward"
                    checked={formData.carryForward}
                    onChange={(e) => setFormData({ ...formData, carryForward: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="carryForward" className="text-sm text-gray-700">
                    Allow carry forward to next year
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Policy is active
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingPolicy ? "Save Changes" : "Create Policy"}
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

export default ManagePolicies
