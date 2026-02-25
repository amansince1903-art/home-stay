export default function PageHeader({ label, title, subtitle }) {
  return (
    <div className="booking-bg pt-36 pb-16 px-6 text-center">
      <span className="section-label text-saffron">{label}</span>
      <div className="text-turmeric text-lg tracking-[0.6rem] opacity-60 my-2">✦ ✦ ✦</div>
      <h1
        className="font-serif text-4xl md:text-5xl font-normal"
        style={{ color: 'white' }}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {subtitle && (
        <p className="text-white/60 text-sm font-hind mt-3 max-w-xl mx-auto">{subtitle}</p>
      )}
    </div>
  )
}