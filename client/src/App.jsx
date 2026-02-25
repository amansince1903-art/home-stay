import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppBtn from './components/WhatsAppBtn'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import NewBooking from './pages/NewBooking'
import Gallery from './pages/Gallery'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <AuthProvider>
      <div className="font-body bg-ivory text-ink overflow-x-hidden">
        <Navbar />
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/rooms"   element={<Rooms />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about"   element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/booking" element={
            <ProtectedRoute>
              <NewBooking />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
        <WhatsAppBtn />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AuthProvider>
  )
}
