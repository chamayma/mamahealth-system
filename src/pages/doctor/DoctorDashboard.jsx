import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUsers, FaHeartbeat, FaCalendarAlt, FaPills, FaChartBar } from 'react-icons/fa'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts'
import API from '../../api.js'
import StatCard from '../../components/common/StatCard.jsx'

const DoctorDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadDashboard = async () => {
    try {
      // 1. Load Stats
      try {
        const statsRes = await API.get('/doctors/dashboard')
        if (statsRes.data && statsRes.data.success) {
          setStats(statsRes.data.data)
        }
      } catch (err) {
        console.log('Error fetching stats.', err)
        // If doctor profile is not created yet, they'll get 404
        if (err.response && err.response.status === 404) {
          toast.warning('Please create your doctor profile first.')
          navigate('/doctor/create-profile')
          return
        }
      }





    } catch (error) {
      console.error(error)
      toast.error('Unexpected error loading dashboard.')
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
  const chartData = stats ? [
    { name: 'Patients', value: stats.totalMothers || 0, color: '#0ea5e9' },
    { name: 'Reports', value: stats.recoveryReports || 0, color: '#ef4444' },
    { name: 'Prescriptions', value: stats.activeMedications || 0, color: '#10b981' },
    { name: 'Appointments', value: stats.upcomingAppointments || 0, color: '#06b6d4' }
  ] : []

  return (
    <div className="container-fluid">
      
      {/* Title */}
      <div className="mb-4">
        <h1 className="h3 text-white mb-0" style={{ fontFamily: 'Outfit' }}>Doctor Dashboard</h1>
        <span className="text-muted small">Monitor maternal recovery metrics and manage clinic operations</span>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <StatCard 
            title="Total Patients (Mothers)"
            value={stats?.totalMothers || 0}
            icon={<FaUsers />}
            variant="primary"
            description="Active postpartum mothers"
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Total Recovery Reports"
            value={stats?.recoveryReports || 0}
            icon={<FaHeartbeat />}
            variant="danger"
            description="Cumulative daily log records"
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Active Prescriptions"
            value={stats?.activeMedications || 0}
            icon={<FaPills />}
            variant="success"
            description="Medications being monitored"
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Upcoming Checkups"
            value={stats?.upcomingAppointments || 0}
            icon={<FaCalendarAlt />}
            variant="info"
            description="Total scheduled clinic visits"
          />
        </div>
      </div>

      {/* Chart Section */}
      <div className="row mb-4">
        <div className="col-lg-8 col-12">
          <div className="premium-card h-100">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle me-3">
                <FaChartBar size={20} />
              </div>
              <h5 className="mb-0" style={{ fontFamily: 'Outfit', fontWeight: 600 }}>Workload Overview</h5>
            </div>
            
            <div style={{ height: '350px', width: '100%' }}>
              {stats ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} tickMargin={10} />
                    <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} allowDecimals={false} />
                    <RechartsTooltip 
                      cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                      {chartData.map((entry, index) => (
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

export default DoctorDashboard
