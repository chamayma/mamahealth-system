import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaCalendarAlt, FaArrowLeft, FaSave } from 'react-icons/fa'
import API from '../../api.js'

const CreateAppointments = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preSelectedMotherId = searchParams.get('motherId')

  const [mothers, setMothers] = useState([])
  const [motherId, setMotherId] = useState(preSelectedMotherId || '')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [purpose, setPurpose] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchingMo, setFetchingMothers] = useState(true)

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
        setFetchingMothers(false) // Wait, setFetchingMothers(false) is the correct React hook!
      }
    }
    fetchMothers()
  }, [preSelectedMotherId])

  const validateForm = () => {
    const purposeRegex = /^[A-Za-z0-9 .,'()\-]+$/
    const notesRegex = /^[A-Za-z0-9 .,'()\-]*$/

    if (!motherId) {
      toast.warning('Please select a mother.')
      return false
    }
    if (!appointmentDate) {
      toast.warning('Appointment date is required.')
      return false
    }
    const selectedDate = new Date(appointmentDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      toast.warning('Appointment date cannot be in the past.')
      return false
    }
    if (!appointmentTime) {
      toast.warning('Appointment time is required.')
      return false
    }
    if (!purpose || purpose.trim() === '') {
      toast.warning('Purpose is required.')
      return false
    }
    if (!purposeRegex.test(purpose)) {
      toast.warning('Purpose contains invalid characters.')
      return false
    }
    if (notes && !notesRegex.test(notes)) {
      toast.warning('Notes contain invalid characters.')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const payload = {
        motherId: parseInt(motherId),
        appointmentDate,
        appointmentTime: appointmentTime + ':00', // Backend expects HH:mm:ss format
        purpose,
        notes,
      }
      const response = await API.post('/appointments', payload)
      if (response.data && response.data.success) {
        toast.success('Appointment scheduled successfully!')
        if (preSelectedMotherId) {
          navigate(`/doctor/mothers/${preSelectedMotherId}`)
        } else {
          navigate('/doctor/appointments')
        }
      } else {
        toast.error(response.data.message || 'Failed to schedule appointment.')
      }
    } catch (error) {
      console.error(error)
      let errorMsg = 'Error scheduling appointment.'
      if (error.response?.data) {
        const data = error.response.data
        if (data.errors && typeof data.errors === 'object') {
          errorMsg = Object.values(data.errors).join(' ')
        } else if (data.message) {
          errorMsg = data.message
        }
      }
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
                  onClick={() => preSelectedMotherId ? navigate(`/doctor/mothers/${preSelectedMotherId}`) : navigate('/doctor/appointments')}
                  type="button"
                >
                  <FaArrowLeft />
                </button>
                <h3 className="text-white mb-0">Schedule Appointment</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                
                {/* Select Mother */}
                <div className="col-md-12">
                  <label className="form-label text-muted small" htmlFor="mother-select">Select Patient (Mother)</label>
                  <select
                    id="mother-select"
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

                {/* Appointment Date */}
                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="appt-date">Appointment Date</label>
                  <input
                    type="date"
                    id="appt-date"
                    className="form-control form-control-custom"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                  />
                </div>

                {/* Appointment Time */}
                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="appt-time">Appointment Time</label>
                  <input
                    type="time"
                    id="appt-time"
                    className="form-control form-control-custom"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  />
                </div>

                {/* Purpose */}
                <div className="col-md-12">
                  <label className="form-label text-muted small" htmlFor="appt-purpose">Purpose / Reason</label>
                  <input
                    type="text"
                    id="appt-purpose"
                    className="form-control form-control-custom"
                    placeholder="e.g. 2-Week Postnatal General Checkup"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                  />
                </div>

                {/* Notes */}
                <div className="col-md-12">
                  <label className="form-label text-muted small" htmlFor="appt-notes">Notes / Instructions</label>
                  <textarea
                    id="appt-notes"
                    rows="4"
                    className="form-control form-control-custom"
                    placeholder="Enter special check instructions for the mother..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
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
                        <span>Schedule Appointment</span>
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

export default CreateAppointments
