import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaPills, FaArrowLeft, FaSave } from 'react-icons/fa'
import API from '../../api.js'

const CreateMedication = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preSelectedMotherId = searchParams.get('motherId')

  const [mothers, setMothers] = useState([])
  const [motherId, setMotherId] = useState(preSelectedMotherId || '')
  const [medicationName, setMedicationName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  const [instructions, setInstructions] = useState('')
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

  const validateForm = () => {
    const textRegex = /^[A-Za-z0-9 .,'()\-]+$/
    const freqRegex = /^[A-Za-z0-9 /,.'()\-]+$/
    const instructionsRegex = /^[A-Za-z0-9 .,'()\-]*$/

    if (!motherId) {
      toast.warning('Please select a mother.')
      return false
    }
    if (!medicationName || medicationName.trim() === '') {
      toast.warning('Medication name is required.')
      return false
    }
    if (!textRegex.test(medicationName)) {
      toast.warning('Medication name contains invalid characters.')
      return false
    }
    if (!dosage || dosage.trim() === '') {
      toast.warning('Dosage is required.')
      return false
    }
    if (!textRegex.test(dosage)) {
      toast.warning('Dosage contains invalid characters.')
      return false
    }
    if (!frequency || frequency.trim() === '') {
      toast.warning('Frequency is required.')
      return false
    }
    if (!freqRegex.test(frequency)) {
      toast.warning('Frequency contains invalid characters.')
      return false
    }
    if (!startDate) {
      toast.warning('Start date is required.')
      return false
    }
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedStart = new Date(startDate)
    if (selectedStart < today) {
      toast.warning('Start date cannot be in the past.')
      return false
    }
    if (!endDate) {
      toast.warning('End date is required.')
      return false
    }
    const selectedEnd = new Date(endDate)
    if (selectedEnd < selectedStart) {
      toast.warning('End date cannot be before the start date.')
      return false
    }
    if (instructions && !instructionsRegex.test(instructions)) {
      toast.warning('Instructions contain invalid characters.')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const payload = {
        motherId: parseInt(motherId),
        medicationName,
        dosage,
        frequency,
        startDate,
        endDate,
        instructions,
      }
      const response = await API.post('/medications', payload)
      if (response.data && response.data.success) {
        toast.success('Medication prescribed successfully!')
        if (preSelectedMotherId) {
          navigate(`/doctor/mothers/${preSelectedMotherId}`)
        } else {
          navigate('/doctor/medications')
        }
      } else {
        toast.error(response.data.message || 'Failed to prescribe medication.')
      }
    } catch (error) {
      console.error(error)
      let errorMsg = 'Error prescribing medication.'
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
                  onClick={() => preSelectedMotherId ? navigate(`/doctor/mothers/${preSelectedMotherId}`) : navigate('/doctor/medications')}
                  type="button"
                >
                  <FaArrowLeft />
                </button>
                <h3 className="text-white mb-0">Prescribe Medication</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                
                {/* Select Mother */}
                <div className="col-md-12">
                  <label className="form-label text-muted small" htmlFor="med-mother-select">Select Patient (Mother)</label>
                  <select
                    id="med-mother-select"
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

                {/* Medication Name */}
                <div className="col-md-12">
                  <label className="form-label text-muted small" htmlFor="med-name">Medication Name</label>
                  <input
                    type="text"
                    id="med-name"
                    className="form-control form-control-custom"
                    placeholder="e.g. Paracetamol"
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                    required
                  />
                </div>

                {/* Dosage */}
                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="med-dosage">Dosage</label>
                  <input
                    type="text"
                    id="med-dosage"
                    className="form-control form-control-custom"
                    placeholder="e.g. 500mg / 1 Tablet"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    required
                  />
                </div>

                {/* Frequency */}
                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="med-freq">Frequency</label>
                  <input
                    type="text"
                    id="med-freq"
                    className="form-control form-control-custom"
                    placeholder="e.g. Twice daily"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    required
                  />
                </div>

                {/* Start Date */}
                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="med-start-date">Start Date</label>
                  <input
                    type="date"
                    id="med-start-date"
                    className="form-control form-control-custom"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                {/* End Date */}
                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="med-end-date">End Date</label>
                  <input
                    type="date"
                    id="med-end-date"
                    className="form-control form-control-custom"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>

                {/* Instructions */}
                <div className="col-md-12">
                  <label className="form-label text-muted small" htmlFor="med-instructions">Intake Instructions</label>
                  <textarea
                    id="med-instructions"
                    rows="3"
                    className="form-control form-control-custom"
                    placeholder="e.g. Take after meals with plenty of water."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
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
                        <span>Prescribe Medication</span>
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

export default CreateMedication
