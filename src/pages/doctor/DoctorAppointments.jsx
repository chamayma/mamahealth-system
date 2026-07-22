import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaCalendarAlt, FaClock, FaStethoscope, FaHospital, FaStickyNote, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import API from '../../api.js'

const DoctorAppointments = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await API.get(`/appointments/${id}`)
        if (response.data && response.data.success && response.data.data) {
          setAppointment(response.data.data)
        } else {
          toast.error('Failed to load appointment details.')
          navigate('/doctor/appointments')
        }
      } catch (error) {
        console.error(error)
        toast.error('Error fetching appointment details.')
        navigate('/doctor/appointments')
      } finally {
        setLoading(false)
      }
    }
    
    fetchAppointmentDetails()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!appointment) return null

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-success'
      case 'SCHEDULED': return 'bg-warning text-dark'
      case 'COMPLETED': return 'bg-info'
      case 'MISSED': return 'bg-danger'
      default: return 'bg-secondary'
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
                  onClick={() => navigate('/doctor/appointments')}
                  type="button"
                >
                  <FaArrowLeft />
                </button>
                <h3 className="text-white mb-0" style={{ fontFamily: 'Outfit' }}>Appointment Details</h3>
              </div>
              <span className={`badge ${getStatusBadgeClass(appointment.status)} px-3 py-2 fs-6`}>
                {appointment.status || 'UNKNOWN'}
              </span>
            </div>

            {/* Content */}
            <div className="row g-4 text-white">
              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3 p-3 bg-dark-custom rounded">
                  <div className="text-primary fs-4 mt-1"><FaStethoscope /></div>
                  <div>
                    <div className="text-muted small mb-1">Patient Name</div>
                    <div className="fw-bold fs-5">{appointment.motherName}</div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3 p-3 bg-dark-custom rounded">
                  <div className="text-primary fs-4 mt-1"><FaHospital /></div>
                  <div>
                    <div className="text-muted small mb-1">Hospital / Clinic</div>
                    <div className="fw-bold fs-5">{appointment.hospitalName || 'Not Specified'}</div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3 p-3 bg-dark-custom rounded">
                  <div className="text-primary fs-4 mt-1"><FaCalendarAlt /></div>
                  <div>
                    <div className="text-muted small mb-1">Date</div>
                    <div className="fw-bold fs-5">{appointment.appointmentDate}</div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3 p-3 bg-dark-custom rounded">
                  <div className="text-primary fs-4 mt-1"><FaClock /></div>
                  <div>
                    <div className="text-muted small mb-1">Time</div>
                    <div className="fw-bold fs-5">{appointment.appointmentTime}</div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="p-3 bg-dark-custom rounded">
                  <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                    <FaStickyNote className="text-primary" />
                    <span>Purpose</span>
                  </div>
                  <div className="fs-6">{appointment.purpose}</div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="p-3 bg-dark-custom rounded">
                  <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                    <FaStickyNote className="text-primary" />
                    <span>Notes & Instructions</span>
                  </div>
                  <div className="fs-6">{appointment.notes || 'No notes provided.'}</div>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="d-flex justify-content-end gap-3 mt-4 border-top border-color pt-3">
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate(`/doctor/appointments/edit/${id}`)}
              >
                Edit Appointment
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments
