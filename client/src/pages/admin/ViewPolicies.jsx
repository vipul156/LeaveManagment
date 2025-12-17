"use client"

import { useState, useEffect } from "react"
import Layout from "../../components/Layout"
import api from "../../utils/api"
import { FileText, Check, X } from "lucide-react"

const ViewPolicies = () => {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)

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
          <h1 className="text-2xl font-bold text-gray-900">Leave Policies</h1>
          <p className="text-gray-600 mt-1">Company leave policies and entitlements</p>
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
              <p className="text-gray-600 text-sm mb-4">{policy.description || "No description available"}</p>

              <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Maximum Days/Year</span>
                  <span className="font-semibold text-gray-900">{policy.maxDaysPerYear} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Carry Forward</span>
                  {policy.carryForward ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Check className="w-4 h-4" /> Yes
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500">
                      <X className="w-4 h-4" /> No
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {policies.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No policies available</h3>
            <p className="text-gray-500 mt-1">Leave policies will appear here once created</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ViewPolicies
