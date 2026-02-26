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

const images = [
  { src: galleryImage, thumb: galleryImage, alt: 'Haveli Gallery View', large: true },
  { src: haveliOutdoor, thumb: haveliOutdoor, alt: 'Haveli Outdoor' },
  { src: room1, thumb: room1, alt: 'Heritage Room 1' },
  { src: outdoor1, thumb: outdoor1, alt: 'Outdoor Area 1' },
  { src: room2, thumb: room2, alt: 'Heritage Room 2' },
  { src: dinningArea, thumb: dinningArea, alt: 'Dining Area' },
  { src: outdoor2, thumb: outdoor2, alt: 'Outdoor Area 2' },
  { src: room3, thumb: room3, alt: 'Heritage Room 3' },
  { src: gallery2, thumb: gallery2, alt: 'Gallery View 2' },
  { src: room4, thumb: room4, alt: 'Heritage Room 4' },
  { src: dinning2, thumb: dinning2, alt: 'Dining Area 2' },
  { src: outdoor3, thumb: outdoor3, alt: 'Outdoor Area 3' },
  { src: room5, thumb: room5, alt: 'Heritage Room 5' },
  { src: dinning3, thumb: dinning3, alt: 'Dining Area 3' },
  { src: room6, thumb: room6, alt: 'Heritage Room 6' },
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