import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaPills, FaCheck, FaInfoCircle, FaCalendarCheck } from 'react-icons/fa'
import API from '../../api.js'

const Medication = () => {
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMedications = async () => {
    try {
      const response = await API.get('/medications/me')
      if (response.data && response.data.success && response.data.data) {
        setMedications(response.data.data)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to load medications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedications()
  }, [])

  const handleMarkCompleted = async (id) => {
    try {
      const response = await API.patch(`/medications/${id}/complete`)
      if (response.data && response.data.success) {
        toast.success('Medication marked as completed!')
        fetchMedications()
      } else {
        toast.error(response.data.message || 'Failed to complete medication.')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error completing medication.')
    }
  }

  const activeMeds = medications.filter(m => m.status === 'ACTIVE')
  const completedMeds = medications.filter(m => m.status === 'COMPLETED')

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
      <div className="mb-4">
        <h1 className="h3 text-white mb-0" style={{ fontFamily: 'Outfit' }}>My Prescribed Medications</h1>
        <span className="text-muted small">View your active prescriptions and log daily intakes</span>
      </div>

      <div className="row g-4">
        
        {/* Active Medications */}
        <div className="col-lg-6">
          <div className="premium-card h-100">
            <h3 className="h5 text-white mb-4 d-flex align-items-center gap-2" style={{ fontFamily: 'Outfit' }}>
              <FaPills className="text-warning" />
              <span>Active Prescriptions</span>
            </h3>

            {activeMeds.length > 0 ? (
              <div className="row g-3">
                {activeMeds.map((med) => (
                  <div key={med.id} className="col-12">
                    <div className="bg-white bg-opacity-5 p-3 rounded-3 border border-color d-flex flex-column justify-content-between h-100">
                      <div>
                        <div className="d-flex justify-content-between align-items-start">
                          <h4 className="h6 text-white mb-1 fw-bold">{med.medicationName}</h4>
                          <span className="badge bg-warning text-dark">Active</span>
                        </div>
                        <div className="text-muted small mb-2">
                          <strong>Dosage:</strong> {med.dosage}
                        </div>
                        <div className="text-muted small mb-2">
                          <strong>Frequency:</strong> {med.frequency}
                        </div>
                        <div className="text-muted small mb-2">
                          <strong>Prescribed By:</strong> {med.doctorName || 'Doctor'}
                        </div>
                        {med.instructions && (
                          <div className="text-muted small mb-2">
                            <strong>Instructions:</strong> {med.instructions}
                          </div>
                        )}

                      </div>
                      <button
                        className="btn btn-sm btn-primary-custom w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => handleMarkCompleted(med.id)}
                      >
                        <FaCheck />
                        <span>Mark as Completed</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted py-5">
                <FaCheck size={36} className="mb-2 text-success opacity-40" />
                <div>No active medications. All clear!</div>
              </div>
            )}

          </div>
        </div>

        {/* Completed Medications */}
        <div className="col-lg-6">
          <div className="premium-card h-100">
            <h3 className="h5 text-white mb-4 d-flex align-items-center gap-2" style={{ fontFamily: 'Outfit' }}>
              <FaCalendarCheck className="text-success" />
              <span>Completed Log</span>
            </h3>

            {completedMeds.length > 0 ? (
              <div className="row g-3">
                {completedMeds.map((med) => (
                  <div key={med.id} className="col-12">
                    <div className="bg-white bg-opacity-5 p-3 rounded-3 border border-color opacity-75">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h4 className="h6 text-white mb-0 fw-bold">{med.medicationName}</h4>
                        <span className="badge bg-success">Completed</span>
                      </div>
                      <div className="text-muted small">
                        <div><strong>Dosage:</strong> {med.dosage}</div>
                        <div><strong>Frequency:</strong> {med.frequency}</div>
                        <div><strong>Prescribed By:</strong> {med.doctorName || 'Doctor'}</div>
                        {med.instructions && (
                          <div><strong>Instructions:</strong> {med.instructions}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted py-5">
                <FaPills size={36} className="mb-2 opacity-30" />
                <div>No completed medication records.</div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  )
}

export default Medication
