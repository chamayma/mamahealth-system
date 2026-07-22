import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { 
  FaPills, 
  FaHeartbeat, 
  FaThermometerHalf, 
  FaHospital, 
  FaExclamationTriangle,
  FaChartLine
} from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'
import API from '../../api.js'
import StatCard from '../../components/common/StatCard.jsx'

const MotherDashboard = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [medications, setMedications] = useState([])
  const [recoveryHistory, setRecoveryHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [profileMissing, setProfileMissing] = useState(false)

  const loadDashboardData = async () => {
    try {
      // 1. Fetch profile
      let userProfile = null
      try {
        const pRes = await API.get('/mothers/me')
        if (pRes.data && pRes.data.success && pRes.data.data) {
          userProfile = pRes.data.data
          setProfile(userProfile)
        } else {
          setProfileMissing(true)
          setLoading(false)
          return
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setProfileMissing(true)
        } else {
          toast.error('Error fetching profile details.')
        }
        setLoading(false)
        return
      }



      // 3. Fetch medications
      try {
        const medRes = await API.get('/medications/me')
        if (medRes.data && medRes.data.success && medRes.data.data) {
          setMedications(medRes.data.data)
        }
      } catch (err) {
        console.log('Error fetching medications.', err)
      }

      // 4. Fetch recovery history
      try {
        const recRes = await API.get('/recovery/me/history')
        if (recRes.data && recRes.data.success && recRes.data.data) {
          // Sort history by date ascending for the chart
          const sorted = recRes.data.data.sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate))
          setRecoveryHistory(sorted)
        }
      } catch (err) {
        console.log('Error fetching recovery logs.', err)
      }

    } catch (error) {
      console.error(error)
      toast.error('Unexpected error loading dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Calculate compliance statistics
  const totalMeds = medications.length
  const completedMeds = medications.filter(m => m.status === 'COMPLETED').length
  const complianceRate = totalMeds > 0 ? Math.round((completedMeds / totalMeds) * 100) : 100

  // Calculate stats from latest recovery entry
  const latestRecovery = recoveryHistory.length > 0 ? recoveryHistory[recoveryHistory.length - 1] : null
  const currentPain = latestRecovery ? latestRecovery.painLevel : 'N/A'
  const currentTemp = latestRecovery ? `${latestRecovery.bodyTemperature}°C` : 'N/A'

  // Prepare chart data for Recharts
  const formattedChartData = recoveryHistory.map(r => ({
    date: new Date(r.recordDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    painLevel: r.painLevel,
    bodyTemp: r.bodyTemperature
  }))

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (profileMissing) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center mt-5">
          <div className="col-md-8 text-center">
            <div className="premium-card p-5">
              <FaExclamationTriangle size={60} className="text-warning mb-4 animate-bounce" />
              <h2 className="text-white mb-3">Profile Incomplete</h2>
              <p className="text-muted mb-4">
                You must complete your mother profile before you can access the dashboard, log recovery metrics, view medications, or confirm appointments.
              </p>
              <Link to="/mother/profile" className="btn btn-primary-custom px-4 py-2">
                Create My Profile Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 text-white mb-0" style={{ fontFamily: 'Outfit' }}>Hello, {profile?.fullName}!</h1>
          <span className="text-muted small">Here is your postpartum recovery monitoring summary</span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <StatCard 
            title="Current Pain Level"
            value={currentPain}
            icon={<FaHeartbeat />}
            variant={latestRecovery && latestRecovery.painLevel > 5 ? 'danger' : 'secondary'}
            description={latestRecovery ? 'From latest logged record' : 'No records logged yet'}
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Body Temperature"
            value={currentTemp}
            icon={<FaThermometerHalf />}
            variant={latestRecovery && latestRecovery.bodyTemperature > 37.8 ? 'danger' : 'primary'}
            description={latestRecovery ? 'From latest logged record' : 'No records logged yet'}
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Medication Compliance"
            value={`${complianceRate}%`}
            icon={<FaPills />}
            variant={complianceRate < 80 ? 'warning' : 'success'}
            description={`${completedMeds} of ${totalMeds} completed`}
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Hospital Registered"
            value={profile?.hospitalName ? (profile.hospitalName.length > 15 ? `${profile.hospitalName.substring(0, 15)}...` : profile.hospitalName) : 'N/A'}
            icon={<FaHospital />}
            variant="info"
            description="Linked treatment center"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="premium-card">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle me-3">
                <FaChartLine size={20} />
              </div>
              <h5 className="mb-0" style={{ fontFamily: 'Outfit', fontWeight: 600 }}>Recovery Progress Trends</h5>
            </div>
            
            {recoveryHistory.length > 0 ? (
              <div style={{ height: '350px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b' }} tickMargin={10} />
                    <YAxis yAxisId="left" stroke="#64748b" tick={{ fill: '#64748b' }} domain={[0, 10]} label={{ value: 'Pain Level (1-10)', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{ fill: '#64748b' }} domain={[35, 42]} label={{ value: 'Temp (°C)', angle: 90, position: 'insideRight', fill: '#64748b' }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="painLevel" name="Pain Level" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line yAxisId="right" type="monotone" dataKey="bodyTemp" name="Body Temperature (°C)" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center text-muted p-5 bg-light rounded" style={{ border: '1px dashed #cbd5e1' }}>
                <p className="mb-0">Log your first daily recovery update to see your progress chart!</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

export default MotherDashboard
