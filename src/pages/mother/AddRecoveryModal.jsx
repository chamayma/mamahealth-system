import  { useState } from 'react'
import { toast } from 'react-toastify'
import { FaHeartbeat, FaTimes } from 'react-icons/fa'
import API from '../../api.js'

const AddRecoveryModal = ({ show, onClose, onRefresh }) => {
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0])
  const [painLevel, setPainLevel] = useState(5)
  const [bodyTemperature, setBodyTemperature] = useState(36.6)
  const [woundCondition, setWoundCondition] = useState('NORMAL')
  const [bleedingLevel, setBleedingLevel] = useState('NONE')
  const [mobility, setMobility] = useState('INDEPENDENT')
  const [medicationTaken, setMedicationTaken] = useState(false)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (bodyTemperature < 34.0 || bodyTemperature > 43.0) {
      toast.warning('Temperature must be between 34.0°C and 43.0°C.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        recordDate,
        painLevel: parseInt(painLevel),
        bodyTemperature: parseFloat(bodyTemperature),
        woundCondition,
        bleedingLevel,
        mobility,
        medicationTaken,
        notes: notes.trim(),
      }
      
      const response = await API.post('/recovery', payload)
      if (response.data && response.data.success) {
        toast.success('Recovery record added successfully!')
        onRefresh()
        onClose()
      } else {
        toast.error(response.data.message || 'Failed to save recovery record.')
      }
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || 'Error saving record. Check input formats.'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content text-white" style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
          
          <div className="modal-header border-bottom border-color p-3 d-flex justify-content-between align-items-center">
            <h5 className="modal-title d-flex align-items-center gap-2" style={{ fontFamily: 'Outfit' }}>
              <FaHeartbeat className="text-danger animate-pulse" />
              <span>Log Postpartum Recovery Indicators</span>
            </h5>
            <button type="button" className="btn btn-link text-white p-0 border-0" onClick={onClose} aria-label="Close">
              <FaTimes size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              <div className="row g-3">
                
                {/* Record Date */}
                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="date-input">Record Date</label>
                  <input
                    type="date"
                    id="date-input"
                    className="form-control form-control-custom"
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                    required
                  />
                </div>

                {/* Body Temperature */}
                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="temp-input">Body Temperature (°C)</label>
                  <input
                    type="number"
                    id="temp-input"
                    step="0.1"
                    className="form-control form-control-custom"
                    placeholder="e.g. 36.6"
                    value={bodyTemperature}
                    onChange={(e) => setBodyTemperature(e.target.value)}
                    required
                  />
                </div>

                {/* Pain Level slider */}
                <div className="col-md-12 my-3">
                  <div className="d-flex justify-content-between mb-1">
                    <label className="form-label text-muted small" htmlFor="pain-input">Pain Level (1 = Low, 10 = Severe)</label>
                    <span className="badge bg-danger">{painLevel}</span>
                  </div>
                  <input
                    type="range"
                    id="pain-input"
                    className="form-range"
                    min="1"
                    max="10"
                    value={painLevel}
                    onChange={(e) => setPainLevel(e.target.value)}
                  />
                </div>

                {/* Wound Condition */}
                <div className="col-md-4">
                  <label className="form-label text-muted small" htmlFor="wound-input">Wound Condition</label>
                  <select
                    id="wound-input"
                    className="form-select form-control-custom text-white"
                    value={woundCondition}
                    onChange={(e) => setWoundCondition(e.target.value)}
                    required
                    style={{ background: '#1a152e' }}
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="REDNESS">Redness</option>
                    <option value="SWELLING">Swelling</option>
                    <option value="DISCHARGE">Discharge</option>
                    <option value="BLEEDING">Bleeding</option>
                    <option value="INFECTION">Infection</option>
                  </select>
                </div>

                {/* Bleeding Level */}
                <div className="col-md-4">
                  <label className="form-label text-muted small" htmlFor="bleeding-input">Bleeding Level</label>
                  <select
                    id="bleeding-input"
                    className="form-select form-control-custom text-white"
                    value={bleedingLevel}
                    onChange={(e) => setBleedingLevel(e.target.value)}
                    required
                    style={{ background: '#1a152e' }}
                  >
                    <option value="NONE">None</option>
                    <option value="LIGHT">Light</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="HEAVY">Heavy</option>
                  </select>
                </div>

                {/* Mobility */}
                <div className="col-md-4">
                  <label className="form-label text-muted small" htmlFor="mobility-input">Mobility</label>
                  <select
                    id="mobility-input"
                    className="form-select form-control-custom text-white"
                    value={mobility}
                    onChange={(e) => setMobility(e.target.value)}
                    required
                    style={{ background: '#1a152e' }}
                  >
                    <option value="INDEPENDENT">Independent</option>
                    <option value="NEEDS_ASSISTANCE">Needs Assistance</option>
                    <option value="BED_REST">Bed Rest</option>
                  </select>
                </div>

                {/* Medication Taken Checkbox */}
                <div className="col-md-12 my-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="med-taken-checkbox"
                      checked={medicationTaken}
                      onChange={(e) => setMedicationTaken(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <label className="form-check-label text-white ms-2" htmlFor="med-taken-checkbox" style={{ cursor: 'pointer' }}>
                      I have taken all my prescribed medications today.
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div className="col-md-12">
                  <label className="form-label text-muted small" htmlFor="notes-textarea">Notes / Symptoms</label>
                  <textarea
                    id="notes-textarea"
                    rows="3"
                    className="form-control form-control-custom"
                    placeholder="Enter notes about how you are feeling, specific pain spots, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

              </div>
            </div>

            <div className="modal-footer border-top border-color p-3">
              <button type="button" className="btn btn-secondary-custom" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary-custom px-4" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm" role="status" /> : 'Save Log'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default AddRecoveryModal
