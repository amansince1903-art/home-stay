import { useState, useRef, useEffect } from 'react'

export default function RoomSelector({ onChange, variant = 'dark', value }) {
  const [open, setOpen] = useState(false)
  const [rooms, setRooms] = useState(value || 1)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  // Sync when value changes from outside (URL params)
useEffect(() => {
  if (value) setRooms(value)
}, [value])

  const update = (val) => {
    const newVal = Math.min(6, Math.max(1, val))
    setRooms(newVal)
    onChange && onChange(newVal)
  }

  // Styling based on variant
  const isDark = variant === 'dark'
  const labelClass = isDark 
    ? "text-turmeric text-[0.6rem] tracking-widest uppercase font-hind"
    : "text-ink text-xs tracking-widest uppercase font-hind font-semibold"
  
  const buttonClass = isDark
    ? "bg-white/10 border border-white/20 text-white px-3 py-2.5 text-sm rounded-sm outline-none font-hind text-left flex items-center justify-between hover:bg-white/15 transition-colors"
    : "bg-white border-2 border-saffron text-ink px-3 py-2.5 text-sm rounded-sm outline-none font-hind text-left flex items-center justify-between hover:bg-orange-50 transition-colors shadow-sm"
  
  const arrowClass = isDark ? "text-white/50 text-xs" : "text-saffron text-xs font-bold"

  return (
    <div ref={ref} className="relative flex flex-col gap-1 flex-1 min-w-[160px]">
      <label className={labelClass}>Rooms</label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={buttonClass}
      >
        <span className={isDark ? "" : "font-semibold"}>🏠 {rooms} Room{rooms > 1 ? 's' : ''}</span>
        <span className={arrowClass}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl z-50 w-72 overflow-hidden"
          style={{ border: '1px solid #F0E6D0' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-serif text-lg font-semibold text-ink">Select Rooms</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-xl bg-transparent border-none cursor-pointer leading-none"
            >✕</button>
          </div>

          {/* Room selector */}
          <div className="px-5 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm text-ink">Number of Rooms</div>
                <div className="text-xs text-gray-400 font-hind">Maximum 6 rooms</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => update(rooms - 1)}
                  disabled={rooms <= 1}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 text-gray-500 font-bold text-lg flex items-center justify-center hover:border-saffron hover:text-saffron transition-colors bg-transparent cursor-pointer leading-none disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-500"
                >−</button>
                <span className="w-5 text-center font-semibold text-ink">{rooms}</span>
                <button
                  type="button"
                  onClick={() => update(rooms + 1)}
                  disabled={rooms >= 6}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 text-gray-500 font-bold text-lg flex items-center justify-center hover:border-saffron hover:text-saffron transition-colors bg-transparent cursor-pointer leading-none disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-500"
                >+</button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-100">
            <span className="text-xs text-gray-400 font-hind">{rooms} room{rooms > 1 ? 's' : ''} selected</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-saffron text-white text-sm font-hind tracking-wider uppercase px-6 py-2 rounded-full hover:bg-saf-dark transition-colors border-none cursor-pointer"
            >Done</button>
          </div>
        </div>
      )}
    </div>
  )
}
