import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa'
import API from '../../api.js'
import logoImg from '../../assets/images/logo.webp'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.warning('Please enter both email and password.')
      return
    }

    setLoading(true)
    try {
      const response = await API.post('/auth/login', { email, password })
      const data = response.data

      if (data && data.success) {
        const { token, role } = data.data
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        localStorage.setItem('email', email)

        toast.success(`Welcome back! Logged in successfully.`)

        // Redirect based on role
        if (role === 'MOTHER') {
          navigate('/mother')
        } else if (role === 'DOCTOR') {
          navigate('/doctor')
        } else if (role === 'ADMIN') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        toast.error(data.message || 'Login failed.')
      }
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || 'Invalid credentials or server error.'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ position: 'relative' }}>
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-4">
          <div className="premium-card p-4 text-center">
            
            {/* Logo */}
            <div className="mb-4">
              <img src={logoImg} alt="MamaHealth Logo" className="img-fluid mb-3" style={{ maxHeight: '80px', objectFit: 'contain' }} />
              <h1 className="h3 text-white font-weight-bold" style={{ fontFamily: 'Outfit' }}>MamaHealth</h1>
              <p className="text-muted small">Postpartum Recovery & Monitoring</p>
            </div>

            <h3 className="h5 text-white mb-4" style={{ fontFamily: 'Outfit', fontWeight: 500 }}>Sign In to your account</h3>

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-3 text-start">
                <label className="form-label text-muted small" htmlFor="email-input">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 border-color text-muted" style={{ borderRadius: '10px 0 0 10px' }}>
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    id="email-input"
                    className="form-control form-control-custom border-start-0"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ borderRadius: '0 10px 10px 0' }}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-4 text-start">
                <label className="form-label text-muted small" htmlFor="password-input">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 border-color text-muted" style={{ borderRadius: '10px 0 0 10px' }}>
                    <FaLock />
                  </span>
                  <input
                    type="password"
                    id="password-input"
                    className="form-control form-control-custom border-start-0"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ borderRadius: '0 10px 10px 0' }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary-custom w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <FaSignInAlt />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/signup" className="text-decoration-none small" style={{ color: 'var(--primary-light)', fontWeight: 500 }}>
                Sign Up
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
