import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser, FaPhone, FaMapMarkerAlt, FaCalendar, FaHospital, FaTint, FaUserShield, FaEdit, FaPlus } from 'react-icons/fa'
import API from '../../api.js'

const MotherProfile = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  // Creation form state
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [address, setAddress] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [hospitalName, setHospitalName] = useState('Suza Hospital')

  const fetchProfile = async () => {
    try {
      const response = await API.get('/mothers/me')
      if (response.data && response.data.success && response.data.data) {
        setProfile(response.data.data)
      }
    } catch (error) {
      // 404 is expected if profile is not created yet
      console.log('No mother profile found yet.', error)
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

  const handleCreateProfile = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setCreating(true)
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
      const response = await API.post('/mothers', payload)
      if (response.data && response.data.success) {
        toast.success('Profile created successfully!')
        setProfile(response.data.data)
      } else {
        toast.error(response.data.message || 'Failed to create profile.')
      }
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || 'Error creating profile. Please check validation rules.'
      toast.error(errorMsg)
    } finally {
      setCreating(false)
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

  if (profile) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="premium-card">
              <div className="d-flex justify-content-between align-items-center border-bottom border-color pb-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="user-avatar" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                    <FaUser />
                  </div>
                  <div>
                    <h3 className="text-white mb-0">{profile.fullName}</h3>
                    <span className="text-muted small">{profile.email}</span>
                  </div>
                </div>
                <button 
                  className="btn btn-primary-custom d-flex align-items-center gap-2"
                  onClick={() => navigate('/mother/edit-profile')}
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <FaPhone className="text-primary mt-1" />
                    <div>
                      <div className="text-muted small">Phone Number</div>
                      <div className="text-white fw-bold">{profile.phoneNumber}</div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <FaCalendar className="text-primary mt-1" />
                    <div>
                      <div className="text-muted small">Date of Birth</div>
                      <div className="text-white fw-bold">{profile.dateOfBirth}</div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <FaMapMarkerAlt className="text-primary mt-1" />
                    <div>
                      <div className="text-muted small">Home Address</div>
                      <div className="text-white fw-bold">{profile.address}</div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <FaTint className="text-danger mt-1" />
                    <div>
                      <div className="text-muted small">Blood Group</div>
                      <div className="text-white fw-bold">{profile.bloodGroup}</div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <FaUserShield className="text-primary mt-1" />
                    <div>
                      <div className="text-muted small">Emergency Contact</div>
                      <div className="text-white fw-bold">{profile.emergencyContact}</div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <FaCalendar className="text-secondary mt-1" />
                    <div>
                      <div className="text-muted small">Delivery Date</div>
                      <div className="text-white fw-bold">{profile.deliveryDate}</div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="d-flex align-items-start gap-3">
                    <FaHospital className="text-success mt-1" />
                    <div>
                      <div className="text-muted small">Hospital Registered</div>
                      <div className="text-white fw-bold">{profile.hospitalName}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render Creation Form if profile doesn't exist
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="premium-card">
            <div className="border-bottom border-color pb-3 mb-4 text-center">
              <h3 className="text-white">Create Mother Profile</h3>
              <p className="text-muted small">Please complete your health profile to enable postpartum recovery tracking.</p>
            </div>

            <form onSubmit={handleCreateProfile}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="fullname-input">Full Name</label>
                  <input
                    type="text"
                    id="fullname-input"
                    className="form-control form-control-custom"
                    placeholder="e.g. Salma Abdi Naim"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="phone-input">Phone Number (10 digits)</label>
                  <input
                    type="tel"
                    id="phone-input"
                    className="form-control form-control-custom"
                    placeholder="e.g. 0712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="dob-input">Date of Birth</label>
                  <input
                    type="date"
                    id="dob-input"
                    className="form-control form-control-custom"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                </div>

                  <label className="form-label text-muted small" htmlFor="blood-input">Blood Group</label>
                  <select
                    id="blood-input"
                    className="form-select form-control-custom text-white"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    required
                    style={{ background: '#1a152e' }}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>

                <div className="col-md-12">
                  <label className="form-label text-muted small" htmlFor="address-input">Home Address</label>
                  <input
                    type="text"
                    id="address-input"
                    className="form-control form-control-custom"
                    placeholder="e.g. 123 Health St, Nairobi"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="emergency-input">Emergency Contact (10 digits)</label>
                  <input
                    type="tel"
                    id="emergency-input"
                    className="form-control form-control-custom"
                    placeholder="e.g. 0787654321"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small" htmlFor="delivery-input">Delivery Date</label>
                  <input
                    type="date"
                    id="delivery-input"
                    className="form-control form-control-custom"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label text-muted small" htmlFor="hospital-input">Hospital Registered</label>
                  <input
                    type="text"
                    id="hospital-input"
                    className="form-control form-control-custom text-white"
                    placeholder="e.g. City Maternity Hospital"
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
                    disabled={creating}
                  >
                    {creating ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <>
                        <FaPlus />
                        <span>Save Profile</span>
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

export default MotherProfile
