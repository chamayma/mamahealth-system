import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser, FaArrowLeft, FaSave } from 'react-icons/fa'
import API from '../../api.js'

const EditMotherProfile = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [address, setAddress] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [emergencyContact, setConfirmEmergencyContact] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [hospitalName, setHospitalName] = useState('Suza Hospital')

  const fetchProfile = async () => {
    try {
      const response = await API.get('/mothers/me')
      if (response.data && response.data.success && response.data.data) {
        const data = response.data.data
        setFullName(data.fullName)
        setPhoneNumber(data.phoneNumber)
        setDateOfBirth(data.dateOfBirth)
        setAddress(data.address)
        setBloodGroup(data.bloodGroup)
        setConfirmEmergencyContact(data.emergencyContact)
        setDeliveryDate(data.deliveryDate)
        setHospitalName('Suza Hospital')
      } else {
        toast.error('Could not load profile. Please create one first.')
        navigate('/mother/profile')
      }
    } catch (error) {
      toast.error('Failed to retrieve profile data.')
      navigate('/mother/profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const validateForm = () => {
    const phoneRegex = /^\d{10}$/
    const nameRegex = /^[A-Za-z .'-]+$/
    const addressRegex = /^[A-Za-z0-9 .,'()\-]+$/
    const bloodRegex = /^[ABO]{1,2}[+-]$/

    if (!nameRegex.test(fullName)) {
      toast.warning('Full name must contain letters and spaces only.')
      return false
    }
    if (!phoneRegex.test(phoneNumber)) {
      toast.warning('Phone number must be exactly 10 digits.')
      return false
    }
    if (!addressRegex.test(address)) {
      toast.warning('Address contains invalid characters.')
      return false
    }
    if (!bloodRegex.test(bloodGroup)) {
      toast.warning('Blood group must be a valid type (e.g. A+, O-, AB+).')
      return false
    }
    if (!phoneRegex.test(emergencyContact)) {
      toast.warning('Emergency contact must be exactly 10 digits.')
      return false
    }
    if (!nameRegex.test(hospitalName)) {
      toast.warning('Hospital name must contain letters and spaces only.')
      return false
    }
    return true
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    try {
      const payload = {
        fullName,
        phoneNumber,
        dateOfBirth,
        address,
        bloodGroup,
        emergencyContact,
        deliveryDate,
        hospitalName,
      }
      const response = await API.put('/mothers/me', payload)
      if (response.data && response.data.success) {
        toast.success('Profile updated successfully!')
        navigate('/mother/profile')
      } else {
        toast.error(response.data.message || 'Failed to update profile.')
      }
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || 'Error updating profile. Please check validation rules.'
      toast.error(errorMsg)
    } finally {
      setSaving(false)
    }
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
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="premium-card">

            {/* Header */}
            <div className="d-flex align-items-center justify-content-between border-bottom border-color pb-3 mb-4">
              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-secondary-custom p-2"
                  onClick={() => navigate('/mother/profile')}
                  type="button"
                >
                  <FaArrowLeft />
                </button>
                <h3 className="text-white mb-0">Edit Profile</h3>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="fullname-edit">Full Name</label>
                  <input
                    type="text"
                    id="fullname-edit"
                    className="form-control form-control-custom"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="phone-edit">Phone Number (10 digits)</label>
                  <input
                    type="tel"
                    id="phone-edit"
                    className="form-control form-control-custom"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="dob-edit">Date of Birth</label>
                  <input
                    type="date"
                    id="dob-edit"
                    className="form-control form-control-custom"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="blood-edit">Blood Group (e.g. A+, O-)</label>
                  <input
                    type="text"
                    id="blood-edit"
                    className="form-control form-control-custom"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label text-muted small" htmlFor="address-edit">Home Address</label>
                  <input
                    type="text"
                    id="address-edit"
                    className="form-control form-control-custom"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="emergency-edit">Emergency Contact (10 digits)</label>
                  <input
                    type="tel"
                    id="emergency-edit"
                    className="form-control form-control-custom"
                    value={emergencyContact}
                    onChange={(e) => setConfirmEmergencyContact(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="delivery-edit">Delivery Date</label>
                  <input
                    type="date"
                    id="delivery-edit"
                    className="form-control form-control-custom"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label text-muted small" htmlFor="hospital-edit">Hospital Registered</label>
                  <input
                    type="text"
                    id="hospital-edit"
                    className="form-control form-control-custom text-white"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    required
                    disabled
                  />
                </div>

                <div className="col-md-12">
                  <button
                    type="submit"
                    className="btn btn-primary-custom w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <>
                        <FaSave />
                        <span>Save Changes</span>
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

export default EditMotherProfile
