import { useState, useRef, useEffect } from 'react'

export default function GuestSelector({ onChange }) {
  const [open, setOpen] = useState(false)
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 })
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const update = (key, val) => {
    const mins = { adults: 1, children: 0, infants: 0 }
    const maxs = { adults: 10, children: 10, infants: 5 }
    const newVal = Math.min(maxs[key], Math.max(mins[key], val))
    const updated = { ...guests, [key]: newVal }
    setGuests(updated)
    onChange && onChange(updated)
  }

  const total = guests.adults + guests.children + guests.infants

  const label = [
    `${guests.adults} Adult${guests.adults > 1 ? 's' : ''}`,
    guests.children > 0 ? `${guests.children} Child${guests.children > 1 ? 'ren' : ''}` : null,
    guests.infants > 0  ? `${guests.infants} Infant${guests.infants > 1 ? 's' : ''}` : null,
  ].filter(Boolean).join(', ')

  const rows = [
    { key: 'adults',   label: 'Adults',   sub: 'Above 18 years' },
    { key: 'children', label: 'Children', sub: '12 – 18 years'  },
    { key: 'infants',  label: 'Infant',   sub: '0 – 11 years'   },
  ]

  return (
    <div ref={ref} className="relative flex flex-col gap-1 flex-1 min-w-[160px]">
      <label className="text-turmeric text-[0.6rem] tracking-widest uppercase font-hind">Guests</label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="bg-white/10 border border-white/20 text-white px-3 py-2.5 text-sm rounded-sm outline-none font-hind text-left flex items-center justify-between hover:bg-white/15 transition-colors"
      >
        <span>👤 {label}</span>
        <span className="text-white/50 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl z-50 w-72 overflow-hidden"
          style={{ border: '1px solid #F0E6D0' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-serif text-lg font-semibold text-ink">Select Guests</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-xl bg-transparent border-none cursor-pointer leading-none"
            >✕</button>
          </div>

          {/* Rows */}
          <div className="px-5 py-3 divide-y divide-gray-100">
            {rows.map(({ key, label, sub }) => (
              <div key={key} className="flex items-center justify-between py-4">
                <div>
                  <div className="font-semibold text-sm text-ink">{label}</div>
                  <div className="text-xs text-gray-400 font-hind">{sub}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => update(key, guests[key] - 1)}
                    className="w-8 h-8 rounded-full border-2 border-gray-300 text-gray-500 font-bold text-lg flex items-center justify-center hover:border-saffron hover:text-saffron transition-colors bg-transparent cursor-pointer leading-none"
                  >−</button>
                  <span className="w-5 text-center font-semibold text-ink">{guests[key]}</span>
                  <button
                    type="button"
                    onClick={() => update(key, guests[key] + 1)}
                    className="w-8 h-8 rounded-full border-2 border-gray-300 text-gray-500 font-bold text-lg flex items-center justify-center hover:border-saffron hover:text-saffron transition-colors bg-transparent cursor-pointer leading-none"
                  >+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-100">
            <span className="text-xs text-gray-400 font-hind">{total} guest{total > 1 ? 's' : ''} selected</span>
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