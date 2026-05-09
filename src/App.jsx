import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import UsersPage from './pages/UsersPage.jsx'

// Redirect to /login if not logged in
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

// Redirect to / if already logged in
function PublicRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/"      element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
      <Route path="*"      element={<Navigate to="/" replace />} />
    </Routes>
  )
}
