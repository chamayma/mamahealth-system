import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaBell, FaArrowLeft, FaSave } from 'react-icons/fa'
import API from '../../api.js'

const CreateNotification = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preSelectedMotherId = searchParams.get('motherId')

  const [mothers, setMothers] = useState([])
  const [motherId, setMotherId] = useState(preSelectedMotherId || '')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState('GENERAL')
  const [loading, setLoading] = useState(false)
  const [fetchingMothers, setFetchingMothers] = useState(true)

  useEffect(() => {
    const fetchMothers = async () => {
      try {
        const response = await API.get('/mothers/all')
        if (response.data && response.data.success && response.data.data) {
          setMothers(response.data.data)
          if (!preSelectedMotherId && response.data.data.length > 0) {
            setMotherId(response.data.data[0].id)
          }
        }
      } catch (error) {
        console.error(error)
        toast.error('Failed to load mothers dropdown list.')
      } finally {
        setFetchingMothers(false)
      }
    }
    fetchMothers()
  }, [preSelectedMotherId])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!motherId || !title || !message || !type) {
      toast.warning('Please complete all required fields.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        motherId: parseInt(motherId),
        title,
        message,
        type,
      }
      const response = await API.post('/notifications', payload)
      if (response.data && response.data.success) {
        toast.success('Alert broadcasted successfully!')
        if (preSelectedMotherId) {
          navigate(`/doctor/mothers/${preSelectedMotherId}`)
        } else {
          navigate('/doctor/notifications')
        }
      } else {
        toast.error(response.data.message || 'Failed to broadcast alert.')
      }
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || 'Error broadcasting alert.'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="premium-card">
            
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between border-bottom border-color pb-3 mb-4">
              <div className="d-flex align-items-center gap-3">
                <button 
                  className="btn btn-secondary-custom p-2" 
                  onClick={() => preSelectedMotherId ? navigate(`/doctor/mothers/${preSelectedMotherId}`) : navigate('/doctor/notifications')}
                  type="button"
                >
                  <FaArrowLeft />
                </button>
                <h3 className="text-white mb-0">Broadcast Alert</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                
                {/* Select Mother */}
                <div className="col-md-12">
                  <label className="form-label text-muted small" htmlFor="alert-mother-select">Select Patient (Mother)</label>
                  <select
                    id="alert-mother-select"
                    className="form-select form-control-custom text-white"
                    value={motherId}
                    onChange={(e) => setMotherId(e.target.value)}
                    required
                    style={{ background: '#1a152e' }}
                    disabled={!!preSelectedMotherId}
                  >
                    {preSelectedMotherId ? (
                      <option value={preSelectedMotherId}>
                        Pre-selected Patient
                      </option>
                    ) : (
                      mothers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.fullName}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Title */}
                <div className="col-md-8">
                  <label className="form-label text-muted small" htmlFor="alert-title">Alert Title</label>
                  <input
                    type="text"
                    id="alert-title"
                    className="form-control form-control-custom"
                    placeholder="e.g. Danger Alert: Pain Level Check"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Type */}
                <div className="col-md-4">
                  <label className="form-label text-muted small" htmlFor="alert-type">Category</label>
                  <select
                    id="alert-type"
                    className="form-select form-control-custom text-white"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                    style={{ background: '#1a152e' }}
                  >
                    <option value="GENERAL">General Alert</option>
                    <option value="MEDICATION">Medication Alert</option>
                    <option value="APPOINTMENT">Appointment Alert</option>
                    <option value="RECOVERY">Recovery Alert</option>
                  </select>
                </div>

                {/* Message */}
                <div className="col-md-12">
                  <label className="form-label text-muted small" htmlFor="alert-msg">Alert Message</label>
                  <textarea
                    id="alert-msg"
                    rows="4"
                    className="form-control form-control-custom"
                    placeholder="Enter the broadcast message detailing instructions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                {/* Submit */}
                <div className="col-md-12 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary-custom w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" />
                    ) : (
                      <>
                        <FaSave />
                        <span>Broadcast Alert</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateNotification
