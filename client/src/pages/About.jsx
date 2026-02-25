import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import useReveal from '../components/useReveal'

const team = [
  { name: 'Nawab Arjun Singh',   role: 'Host & Owner',        avatar: 'https://i.pravatar.cc/80?img=11', bio: 'Descendant of the original haveli family. Arjun brings 25 years of hosting expertise and endless stories about Lucknow\'s royal past.' },
  { name: 'Sunita Devi',         role: 'Head Chef',            avatar: 'https://i.pravatar.cc/80?img=47', bio: 'Master of Awadhi cuisine with recipes passed down four generations. Her biryani and korma are legendary among our guests.' },
  { name: 'Ravi Kumar',          role: 'Heritage Tour Guide',  avatar: 'https://i.pravatar.cc/80?img=15', bio: 'Expert in UP history, architecture and culture. Ravi turns every walk through the old city into a living history lesson.' },
]

const timeline = [
  { year: '1887', event: 'Haveli built by Nawab Faiz Ali Khan during the reign of Wajid Ali Shah.' },
  { year: '1947', event: 'Post-independence, the haveli remains within the family across three generations.' },
  { year: '1999', event: 'The Singh family begins welcoming guests — first homestay in the neighbourhood.' },
  { year: '2010', event: 'Awarded Best Heritage Homestay by UP Tourism Board.' },
  { year: '2024', event: 'Over 500 guests hosted. Now welcoming visitors from 60+ countries.' },
]

export default function About() {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal()

  return (
    <>
      <PageHeader label="Our Story" title='A Century of <em class="italic" style="color:#F2A830;">Heritage</em>' subtitle="From a royal nawabi family to your home away from home — the Haveli Stay story." />

      {/* Story */}
      <section className="py-20 px-6 md:px-14 pattern-bg">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div ref={r1} className="reveal">
            <span className="section-label">The Haveli</span>
            <div className="text-saffron text-base opacity-50 tracking-[0.3rem] my-2">✦ ✦ ✦</div>
            <h2 className="font-serif text-3xl md:text-4xl font-normal leading-tight">Built in 1887,<br/><em className="italic text-saffron">Still Standing Proud</em></h2>
            <p className="text-mud text-sm leading-relaxed mt-4 font-hind">Nestled in the narrow galis of old Lucknow, Haveli Stay was commissioned by Nawab Faiz Ali Khan in 1887. Its soaring Mughal arches, carved jali screens, and open inner courtyard tell stories of the Nawabi era — a time of poetry, culture, and refined living.</p>
            <p className="text-mud text-sm leading-relaxed mt-3 font-hind">Through independence, partition, and the many changes of modern India, the haveli has stood as a silent witness. Today, it stands restored and welcoming — offering every guest not just a room, but a chapter of living history.</p>
            <Link to="/booking" className="inline-block mt-6 bg-saffron text-white text-sm font-hind tracking-widest uppercase px-8 py-3 rounded-sm hover:bg-saf-dark transition-all no-underline">Book Your Stay</Link>
          </div>
          <div ref={r2} className="reveal relative">
            <img src="/src/assets/images/hero-bg.png" alt="Haveli" className="w-full h-96 object-cover rounded-sm shadow-xl" />
            <div className="absolute -bottom-4 -left-4 bg-maroon text-white p-4 text-center rounded-sm">
              <div className="font-serif text-3xl font-bold">1887</div>
              <div className="text-[0.6rem] tracking-widest uppercase font-hind mt-0.5">Year Built</div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 md:px-14 bg-ivory">
        <div ref={r3} className="reveal max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label">Our Journey</span>
            <div className="text-saffron text-lg tracking-[0.6rem] opacity-50 my-2">✦ ✦ ✦</div>
            <h2 className="font-serif text-4xl font-normal">Through the <em className="italic text-saffron">Years</em></h2>
          </div>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-saffron/20" />
            <div className="space-y-8">
              {timeline.map(t => (
                <div key={t.year} className="flex gap-6 items-start">
                  <div className="w-14 text-right shrink-0">
                    <span className="font-serif text-saffron font-semibold text-lg">{t.year}</span>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-saffron border-4 border-ivory shrink-0 mt-1" style={{ marginLeft: '-0.6rem' }} />
                  <p className="text-mud text-sm leading-relaxed font-hind pt-0.5">{t.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 md:px-14 bg-parchment">
        <div ref={r4} className="reveal">
          <div className="text-center mb-12">
            <span className="section-label">Meet the Family</span>
            <div className="text-saffron text-lg tracking-[0.6rem] opacity-50 my-2">✦ ✦ ✦</div>
            <h2 className="font-serif text-4xl font-normal">The People Behind <em className="italic text-saffron">Haveli Stay</em></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map(m => (
              <div key={m.name} className="bg-ivory p-6 rounded-sm text-center shadow-sm border border-parchment">
                <img src={m.avatar} alt={m.name} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-saffron/20 object-cover" />
                <h3 className="font-serif text-lg font-semibold">{m.name}</h3>
                <div className="text-saffron text-xs tracking-widest uppercase font-hind mt-0.5 mb-3">{m.role}</div>
                <p className="text-mud text-xs leading-relaxed font-hind">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}