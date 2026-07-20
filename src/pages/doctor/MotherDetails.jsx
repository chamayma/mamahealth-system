import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { 
  FaUser, 
  FaPhone, 
  FaHospital, 
  FaCalendar, 
  FaPlus, 
  FaTrash, 
  FaHeartbeat, 
  FaPills, 
  FaBell, 
  FaCheck, 
  FaTimes, 
  FaArrowLeft,
  FaFileAlt,
  FaCalendarAlt
} from 'react-icons/fa'
import API from '../../api.js'
import Swal from 'sweetalert2'

const MotherDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mother, setMother] = useState(null)
  const [recovery, setRecovery] = useState([])
  const [meds, setMeds] = useState([])
  const [appts, setAppts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('recovery')

  const fetchData = async () => {
    try {
      // 1. Fetch mother profile
      const motherRes = await API.get(`/mothers/${id}`)
      if (motherRes.data && motherRes.data.success) {
        setMother(motherRes.data.data)
      }

      // 2. Fetch recovery history
      const recRes = await API.get(`/recovery/mother/${id}`)
      if (recRes.data && recRes.data.success) {
        const sorted = recRes.data.data.sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate))
        setRecovery(sorted)
      }

      // 3. Fetch medications
      const medRes = await API.get(`/medications/mother/${id}`)
      if (medRes.data && medRes.data.success) {
        setMeds(medRes.data.data)
      }

      // 4. Fetch appointments
      const appRes = await API.get(`/appointments/mother/${id}`)
      if (appRes.data && appRes.data.success) {
        setAppts(appRes.data.data)
      }

    } catch (error) {
      console.error(error)
      toast.error('Failed to load patient file details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleDeleteMedication = async (medId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete this medication prescription?",
      icon: 'warning',
      showCancelButton: true,
      background: '#1a152e',
      color: '#fff',
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await API.delete(`/medications/${medId}`)
          if (response.data && response.data.success) {
            toast.success('Medication prescription deleted.')
            fetchData()
          }
        } catch (error) {
          console.error(error)
          toast.error('Failed to delete medication.')
        }
      }
    })
  }

  const handleDeleteAppointment = async (apptId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete this scheduled appointment?",
      icon: 'warning',
      showCancelButton: true,
      background: '#1a152e',
      color: '#fff',
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await API.delete(`/appointments/${apptId}`)
          if (response.data && response.data.success) {
            toast.success('Appointment deleted.')
            fetchData()
          }
        } catch (error) {
          console.error(error)
          toast.error('Failed to delete appointment.')
        }
      }
    })
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button 
          className="btn btn-secondary-custom p-2"
          onClick={() => navigate('/doctor/mothers')}
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="h3 text-white mb-0" style={{ fontFamily: 'Outfit' }}>Patient File: {mother?.fullName}</h1>
          <span className="text-muted small">Registered email: {mother?.email}</span>
        </div>
      </div>

      <div className="row g-4 mb-4">
        
        {/* Profile Card */}
        <div className="col-lg-12">
          <div className="premium-card h-100">
            <h3 className="h5 text-white mb-4 d-flex align-items-center gap-2" style={{ fontFamily: 'Outfit' }}>
              <FaUser className="text-primary-light" />
              <span>Mother Health Information</span>
            </h3>

            <div className="row">
              <div className="col-md-4 mb-3">
                <strong>Phone Number:</strong>
                <div className="text-white fw-bold">{mother?.phoneNumber}</div>
              </div>
              <div className="col-md-4 mb-3">
                <strong>Date of Birth:</strong>
                <div className="text-white fw-bold">{mother?.dateOfBirth}</div>
              </div>
              <div className="col-md-4 mb-3">
                <strong>Blood Group:</strong>
                <div className="text-white fw-bold">{mother?.bloodGroup}</div>
              </div>
              <div className="col-md-4 mb-3">
                <strong>Delivery Date:</strong>
                <div className="text-white fw-bold">{mother?.deliveryDate}</div>
              </div>
              <div className="col-md-4 mb-3">
                <strong>Emergency Contact:</strong>
                <div className="text-white fw-bold">{mother?.emergencyContact}</div>
              </div>
              <div className="col-md-4 mb-3">
                <strong>Hospital Registered:</strong>
                <div className="text-white fw-bold">{mother?.hospitalName}</div>
              </div>
              <div className="col-md-12">
                <strong>Address:</strong>
                <div className="text-white fw-bold">{mother?.address}</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="row g-4">
        <div className="col-12">
          
          <div className="d-flex gap-2 border-bottom border-color mb-3 pb-2">
            <button 
              className={`btn btn-sm ${activeTab === 'recovery' ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
              onClick={() => setActiveTab('recovery')}
            >
              Recovery Logs ({recovery.length})
            </button>
            <button 
              className={`btn btn-sm ${activeTab === 'meds' ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
              onClick={() => setActiveTab('meds')}
            >
              Medications ({meds.length})
            </button>
            <button 
              className={`btn btn-sm ${activeTab === 'appts' ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
              onClick={() => setActiveTab('appts')}
            >
              Appointments ({appts.length})
            </button>
          </div>

          {/* Recovery tab content */}
          {activeTab === 'recovery' && (
            <div className="premium-card">
              <h3 className="h6 text-white mb-3" style={{ fontFamily: 'Outfit' }}>Patient History Log</h3>
              {recovery.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-custom mb-0">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Pain Level</th>
                        <th>Body Temp</th>
                        <th>Wound Condition</th>
                        <th>Bleeding</th>
                        <th>Mobility</th>
                        <th>Medication Taken</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Show sorted descending in the table */}
                      {[...recovery].reverse().map((rec) => (
                        <tr key={rec.id}>
                          <td className="text-white fw-bold">{rec.recordDate}</td>
                          <td>
                            <span className={`badge ${rec.painLevel > 6 ? 'bg-danger' : 'bg-success'}`}>
                              {rec.painLevel}/10
                            </span>
                          </td>
                          <td className="fw-bold">{rec.bodyTemperature}°C</td>
                          <td>
                            <span className={`badge ${rec.woundCondition === 'NORMAL' ? 'bg-success' : 'bg-danger'}`}>
                              {rec.woundCondition}
                            </span>
                          </td>
                          <td>{rec.bleedingLevel}</td>
                          <td>{rec.mobility.replace('_', ' ')}</td>
                          <td className="text-center">
                            {rec.medicationTaken ? <FaCheck className="text-success" /> : <FaTimes className="text-danger" />}
                          </td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={rec.notes}>
                            {rec.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <FaFileAlt size={48} className="opacity-20 mb-3" />
                  <div>No daily recovery logs recorded.</div>
                </div>
              )}
            </div>
          )}

          {/* Medications tab content */}
          {activeTab === 'meds' && (
            <div className="premium-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h6 text-white mb-0" style={{ fontFamily: 'Outfit' }}>Prescribed Medications</h3>
                <button 
                  className="btn btn-sm btn-primary-custom d-flex align-items-center gap-1"
                  onClick={() => navigate(`/doctor/medications/create?motherId=${id}`)}
                >
                  <FaPlus size={10} />
                  <span>Prescribe</span>
                </button>
              </div>

              {meds.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-custom mb-0">
                    <thead>
                      <tr>
                        <th>Medication Name</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Instructions</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meds.map((med) => (
                        <tr key={med.id}>
                          <td className="text-white fw-bold">{med.medicationName}</td>
                          <td>{med.dosage}</td>
                          <td>{med.frequency}</td>
                          <td>{med.instructions || '-'}</td>
                          <td>
                            <span className={`badge ${med.status === 'COMPLETED' ? 'bg-success' : 'bg-warning text-dark'}`}>
                              {med.status}
                            </span>
                          </td>
                          <td className="text-end">
                            <button 
                              className="btn btn-sm btn-link text-danger p-0 border-0"
                              onClick={() => handleDeleteMedication(med.id)}
                              title="Delete Prescription"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <FaPills size={48} className="opacity-20 mb-3" />
                  <div>No medications prescribed. Click Prescribe to add.</div>
                </div>
              )}
            </div>
          )}

          {/* Appointments tab content */}
          {activeTab === 'appts' && (
            <div className="premium-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h6 text-white mb-0" style={{ fontFamily: 'Outfit' }}>Scheduled Appointments</h3>
                <button 
                  className="btn btn-sm btn-primary-custom d-flex align-items-center gap-1"
                  onClick={() => navigate(`/doctor/appointments/create?motherId=${id}`)}
                >
                  <FaPlus size={10} />
                  <span>Schedule</span>
                </button>
              </div>

              {appts.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-custom mb-0">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Purpose</th>
                        <th>Hospital</th>
                        <th>Status</th>
                        <th>Notes</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appts.map((appt) => (
                        <tr key={appt.id}>
                          <td className="text-white fw-bold">
                            {appt.appointmentDate} at {appt.appointmentTime}
                          </td>
                          <td>{appt.purpose}</td>
                          <td>{appt.hospitalName}</td>
                          <td>
                            <span className={`badge ${
                              appt.status === 'CONFIRMED' ? 'bg-success' : 
                              appt.status === 'SCHEDULED' ? 'bg-warning text-dark' : 
                              appt.status === 'COMPLETED' ? 'bg-info' : 'bg-danger'
                            }`}>
                              {appt.status}
                            </span>
                          </td>
                          <td>{appt.notes || '-'}</td>
                          <td className="text-end">
                            <button 
                              className="btn btn-sm btn-link text-danger p-0 border-0"
                              onClick={() => handleDeleteAppointment(appt.id)}
                              title="Delete Appointment"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <FaCalendarAlt size={48} className="opacity-20 mb-3" />
                  <div>No appointments scheduled. Click Schedule to add.</div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  )
}

export default MotherDetails
