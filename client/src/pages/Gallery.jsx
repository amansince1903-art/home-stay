import { useState } from 'react'
import PageHeader from '../components/PageHeader'

// Import local images
import galleryImage from '../assets/images/gallery image.jpg'
import gallery2 from '../assets/images/gallery 2.jpg'
import haveliOutdoor from '../assets/images/haveli outdoor.jpg'
import outdoor1 from '../assets/images/outdoor  1.jpg'
import outdoor2 from '../assets/images/outdoor 2.jpg'
import outdoor3 from '../assets/images/outdoor 3.jpg'
import room1 from '../assets/images/room 1.jpg'
import room2 from '../assets/images/room 2.png'
import room3 from '../assets/images/room 3.jpg'
import room4 from '../assets/images/room 4.png'
import room5 from '../assets/images/room 5.png'
import room6 from '../assets/images/-room 6.jpg'
import dinning2 from '../assets/images/dinning 2.jpg'
import dinning3 from '../assets/images/dinning 3.jpg'
import dinningArea from '../assets/images/dinning area.jpg'
// New DAISY DALE images
import d2 from '../assets/images/d2.jpeg'
import d3 from '../assets/images/d3.png'
import d4 from '../assets/images/d4.jpg'
import daisyStay3 from '../assets/images/daisy stay 3.jpg'

const images = [
  { src: daisyStay3, thumb: daisyStay3, alt: 'DAISY DALE Exterior', large: true },
  { src: d2, thumb: d2, alt: 'DAISY DALE View' },
  { src: d3, thumb: d3, alt: 'DAISY DALE Garden' },
  { src: d4, thumb: d4, alt: 'DAISY DALE Property' },
  { src: galleryImage, thumb: galleryImage, alt: 'Mountain View' },
  { src: haveliOutdoor, thumb: haveliOutdoor, alt: 'Outdoor Area' },
  { src: room1, thumb: room1, alt: 'Bedroom 1' },
  { src: outdoor1, thumb: outdoor1, alt: 'Garden Area 1' },
  { src: room2, thumb: room2, alt: 'Bedroom 2' },
  { src: dinningArea, thumb: dinningArea, alt: 'Dining Area' },
  { src: outdoor2, thumb: outdoor2, alt: 'Garden Area 2' },
  { src: room3, thumb: room3, alt: 'Bedroom 3' },
  { src: gallery2, thumb: gallery2, alt: 'Gallery View' },
  { src: room4, thumb: room4, alt: 'Bedroom 4' },
  { src: dinning2, thumb: dinning2, alt: 'Dining Space' },
  { src: outdoor3, thumb: outdoor3, alt: 'Garden Area 3' },
  { src: room5, thumb: room5, alt: 'Bedroom 5' },
  { src: dinning3, thumb: dinning3, alt: 'Dining Hall' },
  { src: room6, thumb: room6, alt: 'Bedroom 6' },
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null) // null or image src string

  return (
    <>
      <PageHeader
        label="Photo Gallery"
        title='Life at <em class="italic" style="color:#F2A830;">DAISY DALE</em>'
        subtitle="Glimpses of mountain serenity, warm hospitality, and the peaceful beauty of our Dehradun home."
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