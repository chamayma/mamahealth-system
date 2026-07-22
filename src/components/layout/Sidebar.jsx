import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  FaHeartbeat, 
  FaHome, 
  FaCalendarAlt, 
  FaPills, 
  FaBell, 
  FaUser, 
  FaUsers, 
  FaUserMd, 
  FaChartBar
} from 'react-icons/fa'
import logoImg from '../../assets/images/logo.webp'

const Sidebar = ({ isOpen, onCloseSidebar }) => {
  const role = localStorage.getItem('role') || 'MOTHER'

  const menuItems = {
    MOTHER: [
      { path: '/mother', label: 'Dashboard', icon: <FaHome /> },
      { path: '/mother/profile', label: 'My Profile', icon: <FaUser /> },
      { path: '/mother/recovery', label: 'Log Recovery', icon: <FaHeartbeat /> },
      { path: '/mother/appointment', label: 'Appointments', icon: <FaCalendarAlt /> },
      { path: '/mother/medication', label: 'Medications', icon: <FaPills /> },
      { path: '/mother/notification', label: 'Notifications', icon: <FaBell /> },
    ],
    DOCTOR: [
      { path: '/doctor', label: 'Dashboard', icon: <FaHome /> },
      { path: '/doctor/profile', label: 'My Profile', icon: <FaUserMd /> },
      { path: '/doctor/mothers', label: 'Mothers (Patients)', icon: <FaUsers /> },
      { path: '/doctor/notifications', label: 'Send Alerts', icon: <FaBell /> },
    ],
    ADMIN: [
      { path: '/admin', label: 'Dashboard', icon: <FaHome /> },
      { path: '/admin/doctors', label: 'Manage Doctors', icon: <FaUserMd /> },
      { path: '/admin/mothers', label: 'Mothers List', icon: <FaUsers /> },
      { path: '/admin/reports', label: 'Analytics Reports', icon: <FaChartBar /> },
    ]
  }

  const activeRoleItems = menuItems[role] || []

  return (
    <>
      {/* Mobile Sidebar backdrop */}
      {isOpen && (
        <div 
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 998 }}
          onClick={onCloseSidebar}
        />
      )}
      
      <aside className={`sidebar-container ${isOpen ? 'show' : ''}`}>
        <div className="sidebar-logo d-flex align-items-center" style={{ padding: '1rem' }}>
          <img src={logoImg} alt="MamaHealth" className="me-2" style={{ maxHeight: '32px', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>MamaHealth</span>
        </div>
        
        <ul className="sidebar-menu">
          {activeRoleItems.map((item, index) => (
            <li key={index} className="sidebar-menu-item" onClick={onCloseSidebar}>
              <NavLink 
                to={item.path} 
                end={item.path === '/mother' || item.path === '/doctor' || item.path === '/admin'} 
                className="sidebar-link"
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div className="text-muted small">Version 1.0.0</div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
