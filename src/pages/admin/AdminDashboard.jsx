import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUsers, FaUserMd, FaHeartbeat, FaCalendarAlt, FaPills, FaBell, FaClipboardList, FaChartPie, FaChartLine } from 'react-icons/fa'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts'
import API from '../../api.js'
import StatCard from '../../components/common/StatCard.jsx'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadDashboard = async () => {
    try {
      // 1. Fetch dashboard stats
      const dashRes = await API.get('/admin/dashboard')
      if (dashRes.data && dashRes.data.success) {
        setDashboard(dashRes.data.data)
      }

    } catch (error) {
      console.error(error)
      toast.error('Failed to load admin dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const userChartData = dashboard ? [
    { name: 'Admins', value: dashboard.totalUsers - dashboard.totalDoctors - dashboard.totalMothers || 0, color: '#f59e0b' },
    { name: 'Doctors', value: dashboard.totalDoctors || 0, color: '#06b6d4' },
    { name: 'Mothers', value: dashboard.totalMothers || 0, color: '#10b981' }
  ] : []

  const activityChartData = dashboard ? [
    { name: 'Appointments', value: dashboard.totalAppointments || 0, color: '#10b981' },
    { name: 'Prescriptions', value: dashboard.totalMedications || 0, color: '#f59e0b' },
    { name: 'Logs', value: dashboard.totalRecoveries || 0, color: '#ef4444' },
    { name: 'Alerts', value: dashboard.totalNotifications || 0, color: '#64748b' }
  ] : []

  return (
    <div className="container-fluid">
      
      {/* Title */}
      <div className="mb-4">
        <h1 className="h3 text-white mb-0" style={{ fontFamily: 'Outfit' }}>Admin Operations Dashboard</h1>
        <span className="text-muted small">System wide auditing metrics and user profile databases</span>
      </div>

      {/* Grid rows */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <StatCard 
            title="Total Registered Users"
            value={dashboard?.totalUsers || 0}
            icon={<FaUsers />}
            variant="primary"
            description="System user credentials"
          />
        </div>
        <div className="col-md-4">
          <StatCard 
            title="Active Doctors"
            value={dashboard?.totalDoctors || 0}
            icon={<FaUserMd />}
            variant="info"
            description="Licensed medical professionals"
          />
        </div>
        <div className="col-md-4">
          <StatCard 
            title="Enrolled Mothers"
            value={dashboard?.totalMothers || 0}
            icon={<FaUsers />}
            variant="secondary"
            description="Postpartum recovery monitoring"
          />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <StatCard 
            title="Appointments"
            value={dashboard?.totalAppointments || 0}
            icon={<FaCalendarAlt />}
            variant="success"
            description="Total scheduled consultations"
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Prescriptions"
            value={dashboard?.totalMedications || 0}
            icon={<FaPills />}
            variant="warning"
            description="Medication tracking compliance"
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Recovery Logs"
            value={dashboard?.totalRecoveries || 0}
            icon={<FaHeartbeat />}
            variant="danger"
            description="Daily metrics reported"
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Notifications Sent"
            value={dashboard?.totalNotifications || 0}
            icon={<FaBell />}
            variant="secondary"
            description="Broadcast alerts"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4 mb-4">
        {/* User Distribution Chart */}
        <div className="col-lg-6">
          <div className="premium-card h-100">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle me-3">
                <FaChartPie size={20} />
              </div>
              <h5 className="mb-0" style={{ fontFamily: 'Outfit', fontWeight: 600 }}>User Distribution</h5>
            </div>
            
            <div style={{ height: '300px', width: '100%' }}>
              {dashboard ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userChartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} tickMargin={10} />
                    <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} allowDecimals={false} />
                    <RechartsTooltip 
                      cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                      {userChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Activity Chart */}
        <div className="col-lg-6">
          <div className="premium-card h-100">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-success bg-opacity-10 text-success p-2 rounded-circle me-3">
                <FaChartLine size={20} />
              </div>
              <h5 className="mb-0" style={{ fontFamily: 'Outfit', fontWeight: 600 }}>System Activity</h5>
            </div>
            
            <div style={{ height: '300px', width: '100%' }}>
              {dashboard ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityChartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} tickMargin={10} />
                    <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} allowDecimals={false} />
                    <RechartsTooltip 
                      cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                      {activityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AdminDashboard
