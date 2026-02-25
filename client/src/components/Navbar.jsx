import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/',        label: 'Home' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-ink/90 backdrop-blur-md border-b border-white/10 ${scrolled ? 'scrolled' : ''}`}>
      <div className="bg-maroon text-white text-xs text-center py-1.5 tracking-widest font-hind">
        📞 +91 98765 43210 &nbsp;|&nbsp; ✉ info@havelistay.in &nbsp;|&nbsp; 🕐 Open Daily 7AM – 10PM
      </div>

      <div className="flex items-center justify-between px-6 md:px-14 py-3">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-saffron text-2xl">🏛</span>
          <div>
            <div className="font-serif text-xl text-white leading-none">Haveli Stay</div>
            <div className="text-[0.55rem] tracking-[0.2em] text-turmeric uppercase font-hind">Uttar Pradesh Heritage</div>
          </div>
        </Link>

        <ul className="hidden md:flex gap-7 list-none items-center">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`text-sm font-hind tracking-wider no-underline transition-colors
                  ${pathname === link.to ? 'text-saffron' : 'text-white/80 hover:text-saffron'}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {user ? (
            <>
              <li>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-white/80 hover:text-saffron text-sm font-hind tracking-wider no-underline">
                  {user.role === 'admin' ? 'Admin' : 'Dashboard'}
                </Link>
              </li>
              <li>
                <button onClick={logout} className="text-white/80 hover:text-saffron text-sm font-hind tracking-wider bg-transparent border-none cursor-pointer">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-white/80 hover:text-saffron text-sm font-hind tracking-wider no-underline">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/booking" className="bg-saffron text-white text-sm font-hind tracking-wider px-5 py-2 rounded-sm hover:bg-saf-dark transition-colors no-underline">
                  Book Now
                </Link>
              </li>
            </>
          )}
        </ul>

        <button
          onClick={() => setMobileOpen(o => !o)}
          className="md:hidden text-white text-2xl bg-transparent border-none cursor-pointer"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileOpen && (
        <ul className="flex flex-col list-none bg-ink border-t border-white/10 md:hidden">
          {navLinks.map(link => (
            <li key={link.to} className="border-b border-white/10">
              <Link
                to={link.to}
                className={`block px-6 py-3.5 text-sm font-hind no-underline
                  ${pathname === link.to ? 'text-saffron' : 'text-white/80'}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {user ? (
            <>
              <li className="border-b border-white/10">
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="block px-6 py-3.5 text-white/80 text-sm font-hind no-underline">
                  {user.role === 'admin' ? 'Admin' : 'Dashboard'}
                </Link>
              </li>
              <li>
                <button onClick={logout} className="block w-full text-left px-6 py-3.5 text-white/80 text-sm font-hind bg-transparent border-none">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="border-b border-white/10">
                <Link to="/login" className="block px-6 py-3.5 text-white/80 text-sm font-hind no-underline">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/booking" className="block px-6 py-3.5 text-saffron text-sm font-hind no-underline">
                  Book Now →
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  )
}