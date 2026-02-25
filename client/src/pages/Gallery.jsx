import { useState } from 'react'
import PageHeader from '../components/PageHeader'

const images = [
  { src: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80', alt: 'Taj Mahal, Agra', large: true },
  { src: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80', alt: 'Varanasi Ghats' },
  { src: 'https://images.unsplash.com/photo-1583340806474-a2fab0a46f9e?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1583340806474-a2fab0a46f9e?w=600&q=80', alt: 'Haveli Interior' },
  { src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', alt: 'Lucknow' },
  { src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', alt: 'Heritage Room' },
  { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', alt: 'Bedroom' },
  { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80', alt: 'Garden Kothi' },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', alt: 'Prayagraj' },
  { src: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',    thumb: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80', alt: 'Morning Agra' },
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null) // null or image src string

  return (
    <>
      <PageHeader
        label="Photo Gallery"
        title='Life at <em class="italic" style="color:#F2A830;">Haveli Stay</em>'
        subtitle="Glimpses of heritage architecture, vibrant UP culture, and the warmth of our home."
      />

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.93)' }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-7 text-white text-4xl leading-none bg-transparent border-none cursor-pointer hover:opacity-60"
            onClick={() => setLightbox(null)}
          >✕</button>
          <img src={lightbox} alt="" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <section className="bg-ink py-16 px-4 md:px-10">
        <div className="gallery-grid max-w-5xl mx-auto">
          {images.map((img, i) => (
            <div
              key={i}
              className={`gallery-item${img.large ? ' gallery-item--large' : ''}`}
              onClick={() => setLightbox(img.src)}
            >
              <img src={img.thumb} alt={img.alt} />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300" style={{ zIndex: 2 }}>
                <span className="text-white text-4xl">🔍</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}