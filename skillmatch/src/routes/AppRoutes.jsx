import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/common/LoadingSpinner'
import HomePage from '../pages/HomePage'
import JobListingsPage from '../pages/JobListingsPage'
import JobDetailPage from '../pages/JobDetailPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import GraduateDashboardPage from '../pages/GraduateDashboardPage'
import CompanyDashboardPage from '../pages/CompanyDashboardPage'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import CompaniesPage from '../pages/CompaniesPage'
import CompanyPage from '../pages/CompanyPage'
import CategoriesPage from '../pages/CategoriesPage'
import AboutPage from '../pages/AboutPage'
import NotFoundPage from '../pages/NotFoundPage'

const HOME = { graduate: '/graduate/dashboard', company: '/company/dashboard', admin: '/admin/dashboard' }

function Protected({ role, children }) {
  const { profile, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="page"><LoadingSpinner text="กำลังตรวจสอบสิทธิ์..." /></div>
  if (!profile) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (profile.role !== role) return <Navigate to={HOME[profile.role]} replace />
  return children
}

function GuestOnly({ children }) {
  const { profile, loading } = useAuth()
  if (loading) return <div className="page"><LoadingSpinner /></div>
  return profile ? <Navigate to={HOME[profile.role]} replace /> : children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs" element={<JobListingsPage />} />
      <Route path="/search" element={<JobListingsPage />} />
      <Route path="/jobs/:jobId" element={<JobDetailPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="/companies/:companyId" element={<CompanyPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
      <Route path="/graduate/dashboard" element={<Protected role="graduate"><GraduateDashboardPage /></Protected>} />
      <Route path="/company/dashboard" element={<Protected role="company"><CompanyDashboardPage /></Protected>} />
      <Route path="/admin/dashboard" element={<Protected role="admin"><AdminDashboardPage /></Protected>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
