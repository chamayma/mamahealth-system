import 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

// Auth Pages
import Login from './pages/auth/Login.jsx'
import Signup from './pages/auth/Signup.jsx'

// Protected Route & Layout
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import DashboardLayout from './components/layout/DashboardLayout.jsx'

// Mother Pages
import MotherDashboard from './pages/mother/MotherDashboard.jsx'
import MotherProfile from './pages/mother/MotherProfile.jsx'
import EditMotherProfile from './pages/mother/EditMotherProfile.jsx'
import Recovery from './pages/mother/Recovery.jsx'
import Appointment from './pages/mother/Appointment.jsx'
import Medication from './pages/mother/Medication.jsx'
import Notification from './pages/mother/Notification.jsx'

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx'
import DoctorProfile from './pages/doctor/DoctorProfile.jsx'
import CreateDoctorProfile from './pages/doctor/CreateDoctorProfile.jsx'
import EditDoctorProfile from './pages/doctor/EditDoctorProfile.jsx'
import Mothers from './pages/doctor/Mothers.jsx'
import MotherDetails from './pages/doctor/MotherDetails.jsx'
import ManageAppointments from './pages/doctor/ManageAppointments.jsx'
import CreateAppointments from './pages/doctor/CreateAppointments.jsx'
import EditAppointment from './pages/doctor/EditAppointment.jsx'
import DoctorMedications from './pages/doctor/DoctorMedications.jsx'
import CreateMedication from './pages/doctor/CreateMedication.jsx'
import EditMedication from './pages/doctor/EditMedication.jsx'
import DoctorNotification from './pages/doctor/DoctorNotification.jsx'
import CreateNotification from './pages/doctor/CreateNotification.jsx'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminDoctors from './pages/admin/AdminDoctors.jsx'
import CreateDoctor from './pages/admin/CreateDoctor.jsx'
import EditDoctor from './pages/admin/EditDoctor.jsx'
import AdminMothers from './pages/admin/AdminMothers.jsx'
import AdminMotherDetails from './pages/admin/AdminMotherDetails.jsx'
import AdminReports from './pages/admin/AdminReports.jsx'
import AdminActivities from './pages/admin/AdminActivities.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Mother Protected Routes */}
        <Route
          path="/mother"
          element={
            <ProtectedRoute allowedRoles={['MOTHER']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MotherDashboard />} />
          <Route path="profile" element={<MotherProfile />} />
          <Route path="edit-profile" element={<EditMotherProfile />} />
          <Route path="recovery" element={<Recovery />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="medication" element={<Medication />} />
          <Route path="notification" element={<Notification />} />
        </Route>

        {/* Doctor Protected Routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DoctorDashboard />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="create-profile" element={<CreateDoctorProfile />} />
          <Route path="edit-profile" element={<EditDoctorProfile />} />
          <Route path="mothers" element={<Mothers />} />
          <Route path="mothers/:id" element={<MotherDetails />} />
          <Route path="appointments" element={<ManageAppointments />} />
          <Route path="appointments/create" element={<CreateAppointments />} />
          <Route path="appointments/edit/:id" element={<EditAppointment />} />
          <Route path="medications" element={<DoctorMedications />} />
          <Route path="medications/create" element={<CreateMedication />} />
          <Route path="medications/edit/:id" element={<EditMedication />} />
          <Route path="notifications" element={<DoctorNotification />} />
          <Route path="notifications/create" element={<CreateNotification />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="doctors/create" element={<CreateDoctor />} />
          <Route path="doctors/edit/:id" element={<EditDoctor />} />
          <Route path="mothers" element={<AdminMothers />} />
          <Route path="mothers/:id" element={<AdminMotherDetails />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="activities" element={<AdminActivities />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  )
}

export default App
