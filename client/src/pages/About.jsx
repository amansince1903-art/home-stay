import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

export default function About() {
  return (
    <>
      <PageHeader 
        label="Our Story" 
        title='A Home with <em class="italic" style="color:#F2A830;">a Story</em>' 
        subtitle="Where Army legacy meets mountain serenity — the DAISY DALE story of warmth, heritage, and hospitality." 
      />

      {/* Story */}
      <section className="py-20 px-6 md:px-14 bg-ivory">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="text-saffron text-base opacity-50 tracking-[0.3rem] my-2">✦ ✦ ✦</div>
            <h2 className="font-serif text-3xl md:text-4xl font-normal leading-tight">
              Nestled in the Dehradun Foothills,<br/>
              <em className="italic text-saffron">A Living Tribute to Legacy</em>
            </h2>
            <p className="text-mud text-sm leading-relaxed mt-4 font-hind">
              DAISY DALE is more than a boutique homestay — it is a living tribute to legacy, warmth, and quiet mountain hospitality. Nestled in the peaceful foothills of Dehradun, every corner reflects a heritage where stories of courage meet the calm of nature, and guests are welcomed not as visitors, but as part of an extended family.
            </p>
            <p className="text-mud text-sm leading-relaxed mt-3 font-hind">
              Surrounded by fresh mountain air, gentle hills, and timeless serenity, the space offers a rare balance of comfort, reflection, and belonging. Here, hospitality is personal — conversations over evening tea, shared stories by the garden, and thoughtful attention to every detail create an experience that feels authentic and deeply human.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-sm border border-parchment">
              <div className="text-3xl mb-3">🏔</div>
              <h3 className="font-serif text-xl mb-2">Mountain Serenity</h3>
              <p className="text-mud text-sm font-hind leading-relaxed">
                Wake up to sunrise views over the hills, breathe in fresh mountain air, and experience the peaceful rhythm of slow living in nature's embrace.
              </p>
            </div>
            <div className="bg-white p-6 rounded-sm border border-parchment">
              <div className="text-3xl mb-3">🎖</div>
              <h3 className="font-serif text-xl mb-2">Army Legacy</h3>
              <p className="text-mud text-sm font-hind leading-relaxed">
                Rooted in values of discipline, integrity, and care, our family's Army background brings a unique warmth and trusted environment to every stay.
              </p>
            </div>
            <div className="bg-white p-6 rounded-sm border border-parchment">
              <div className="text-3xl mb-3">🍳</div>
              <h3 className="font-serif text-xl mb-2">Homemade Cuisine</h3>
              <p className="text-mud text-sm font-hind leading-relaxed">
                Fresh, comforting meals inspired by regional flavors and home-style cooking. Every dish is prepared with care and served with love.
              </p>
            </div>
            <div className="bg-white p-6 rounded-sm border border-parchment">
              <div className="text-3xl mb-3">💚</div>
              <h3 className="font-serif text-xl mb-2">Personal Touch</h3>
              <p className="text-mud text-sm font-hind leading-relaxed">
                From warm welcomes to evening conversations, travel guidance to flexible hosting — every interaction is tailored to make you feel at home.
              </p>
            </div>
          </div>

          <div className="bg-parchment p-8 rounded-sm">
            <h3 className="font-serif text-2xl mb-4 text-center">Guest Experience</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm font-hind text-mud">
              <div className="flex items-start gap-2">
                <span className="text-saffron">✓</span>
                <span>Warm Personal Welcome</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-saffron">✓</span>
                <span>Heritage Storytelling</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-saffron">✓</span>
                <span>Boutique Comfort Stay</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-saffron">✓</span>
                <span>Local & Homemade Cuisine</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-saffron">✓</span>
                <span>Nature & Slow Living</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-saffron">✓</span>
                <span>Personalized Guest Care</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-saffron">✓</span>
                <span>Evening Connection Moments</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-saffron">✓</span>
                <span>Safe & Trusted Environment</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-mud text-base font-hind italic mb-6">
              "At DAISY DALE, guests don't just stay — they pause, reconnect, and carry back memories of warmth, stories, and the quiet grace of the hills."
            </p>
            <Link to="/booking" className="inline-block bg-saffron text-white text-sm font-hind tracking-widest uppercase px-8 py-3 rounded-sm hover:bg-saf-dark transition-all no-underline">
              Book Your Stay
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
