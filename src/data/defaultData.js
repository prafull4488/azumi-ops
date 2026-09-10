export const DEFAULT_DATA = {
  hero: {
    eyebrow: 'Your Space · Your Story · Our Design',
    line1: 'Azumi Designs',
    line2: 'Architecture & Interiors',
    sub: 'A woman-led architecture and interior design studio, shaping homes around light, material and the way you actually live.',
    scrollHint: 'Scroll to explore',
    image: '/images/hero/HeroImage.png',
    video: '/images/hero/AzumiDesigns-web.mp4',
    caption: 'Kadilkar Residence — a brick-jaali façade lit for the evening.'
  },
  projects: [
    { title: 'Kadilkar Residence', type: 'Completed', location: 'Residence', one: 'A three-storey home fronted by a perforated brick jaali that glows after dark.', image: '/images/hero/HeroImage2.jpeg', gallery: [
      '/images/hero/HeroImage2.jpeg', '/images/hero/HeroImage.png'
    ] },
    { title: 'Amma Manne', type: 'Completed', location: 'Family Home', one: 'A family house wrapped around fort-view terraces and open sit-outs.', image: '/images/projects/Amma%20Manne/Render.jpeg', gallery: [
      '/images/projects/Amma%20Manne/Render.jpeg', '/images/projects/Amma%20Manne/Side_view.jpg', '/images/projects/Amma%20Manne/Fortview_terrace.jpeg', '/images/projects/Amma%20Manne/Terrace.jpg', '/images/projects/Amma%20Manne/Terrace1.jpg', '/images/projects/Amma%20Manne/Sidewalk.jpeg', '/images/projects/Amma%20Manne/Living.jpeg'
    ] },
    { title: 'Avshata', type: 'Completed', location: 'Interior', one: 'A layered interior of living, dining and a mezzanine bar counter.', image: '/images/projects/Avshata/Living1.JPG', gallery: [
      '/images/projects/Avshata/Living1.JPG', '/images/projects/Avshata/Living2.JPG', '/images/projects/Avshata/Living3.JPG', '/images/projects/Avshata/Bedroom1.JPG', '/images/projects/Avshata/Bedroom2.JPG', '/images/projects/Avshata/Bedroom3.JPG', '/images/projects/Avshata/Kitchen.JPG', '/images/projects/Avshata/BarCounter.JPG', '/images/projects/Avshata/Mezzanine.JPG', '/images/projects/Avshata/Partition.JPG', '/images/projects/Avshata/Mirror.JPG', '/images/projects/Avshata/Wallpaper.jpg', '/images/projects/Avshata/DSCF3412.JPG'
    ] },
    { title: 'Coastal Chic', type: 'Completed', location: 'Interior', one: 'Breezy, light-filled rooms in a relaxed coastal palette.', image: '/images/projects/Costal%20Chic/Living.jpg', gallery: [
      '/images/projects/Costal%20Chic/Living.jpg', '/images/projects/Costal%20Chic/Balcony.jpeg', '/images/projects/Costal%20Chic/Bedroom1.png', '/images/projects/Costal%20Chic/Bedroom2.png', '/images/projects/Costal%20Chic/Dining1.png', '/images/projects/Costal%20Chic/Dining2.png'
    ] },
    { title: 'Serene Dreams', type: 'Ongoing', location: 'Interior', one: 'A calm, restful bedroom scheme in soft neutral tones.', image: '/images/projects/Serene%20Dreams/B.png', gallery: [
      '/images/projects/Serene%20Dreams/B.png', '/images/projects/Serene%20Dreams/C.png', '/images/projects/Serene%20Dreams/D.png', '/images/projects/Serene%20Dreams/E.png'
    ] },
    { title: 'Bengaluru Manne', type: 'Ongoing', location: 'City Home', one: 'A compact city home with warm dining and living spaces.', image: '/images/projects/Bengaluru%20Manne/Living.jpeg', gallery: [
      '/images/projects/Bengaluru%20Manne/Living.jpeg', '/images/projects/Bengaluru%20Manne/Dining.jpeg', '/images/projects/Bengaluru%20Manne/Washroom.jpeg', '/images/projects/Bengaluru%20Manne/Collage.jpeg'
    ] },
    { title: 'Modern Comfort', type: 'Ongoing', location: 'Interior', one: 'Clean-lined bedrooms and kitchen tuned for everyday comfort.', image: '/images/projects/Modern%20Comfort/M%20bedroom.png', gallery: [
      '/images/projects/Modern%20Comfort/M%20bedroom.png', '/images/projects/Modern%20Comfort/M%20bedroom%201.png', '/images/projects/Modern%20Comfort/Kitchen%201.png'
    ] },
    { title: 'Miraki', type: 'Ongoing', location: 'Interior', one: 'Considered flooring and material detailing for a serene bedroom.', image: '/images/projects/Miraki/Master_bedroom_flooring.jpeg', gallery: [
      '/images/projects/Miraki/Master_bedroom_flooring.jpeg', '/images/projects/Miraki/Flooring%20%281%29.jpeg', '/images/projects/Miraki/Flooring%20%282%29.jpeg'
    ] }
  ],
  about: {
    statementPre: 'Architecture that begins with ',
    statementEm: 'listening',
    statementPost: '.',
    body: 'Azumi is a woman-led architecture and interior design studio, creating thoughtful spaces shaped by context, material, light and the people who inhabit them.',
    pillars: [
      { title: 'Context', text: 'Every site has a slope, a wind direction, a neighbour and a history. We start there, before we start drawing.' },
      { title: 'Material', text: 'Brick, laterite, lime, timber and stone age the way the climate asks them to — we design with that, not against it.' },
      { title: 'Living', text: "A plan is only good once it's lived in. We design for the ordinary hours, not just the photographs." }
    ]
  },
  services: [
    { title: 'Architecture', body: 'Homes, villas, holiday homes and new-build projects, designed from the first sketch to the working drawing.', image: '/images/services/Architectural.jpeg' },
    { title: 'Interior Design', body: 'Residential and selected hospitality interiors — layouts, materials, furniture and lighting, considered together.', image: '/images/services/Interiors.jpeg' },
    { title: 'Turnkey', body: 'From design development through execution, with one team accountable for the space you actually receive.', image: '/images/services/Turnkey.jpeg' },
    { title: 'Vastu-informed Planning', body: 'Contemporary design with considered spatial planning, for clients who want both.', image: '/images/services/Vastu.jpeg' }
  ],
  processSteps: [
    { title: 'Conversation', text: 'Understanding you, your site and your ambitions.', tags: ['Architecture', 'Interior', 'Turnkey', 'Vastu'] },
    { title: 'Concept', text: 'Translating ideas into spatial direction.', tags: ['Architecture', 'Interior', 'Turnkey', 'Vastu'] },
    { title: 'Design', text: 'Plans, materials, details and decisions.', tags: ['Architecture', 'Interior', 'Turnkey'] },
    { title: 'Build', text: 'Coordinating design intent through execution.', tags: ['Turnkey'] },
    { title: 'Handover', text: 'A considered space, ready to live in.', tags: ['Architecture', 'Interior', 'Turnkey'] }
  ],
  founder: {
    name: 'Sindhu Kodihal',
    role: 'Founder & Principal Architect',
    photo: '/images/Sindhu/Profile.jpeg',
    statement: 'I started Azumi because I kept meeting people who wanted a home that felt like theirs, not a home that happened to be built. Our work is slow on purpose — small enough that I know the site, the mason and the client by name.',
    practice: '38 projects across homes, villas and interiors',
    focus: 'Residential architecture, material detailing, Vastu-informed planning',
    available: 'Taking new projects from October'
  },
  goa: [
    { label: 'brick', image: '/images/hero/HeroImage2.jpeg', height: 460 },
    { label: 'laterite', image: '/images/projects/Amma%20Manne/Side_view.jpg', height: 380 },
    { label: 'sit-outs', image: '/images/projects/Amma%20Manne/Sidewalk.jpeg', height: 320 },
    { label: 'timber', image: '/images/projects/Avshata/BarCounter.JPG', height: 440 },
    { label: 'terraces', image: '/images/projects/Amma%20Manne/Terrace1.jpg', height: 340 },
    { label: 'vegetation', image: '/images/projects/Amma%20Manne/Fortview_terrace.jpeg', height: 420 },
    { label: 'natural light', image: '/images/projects/Avshata/Living3.JPG', height: 300 },
    { label: 'indoor / outdoor', image: '/images/projects/Amma%20Manne/Terrace.jpg', height: 440 }
  ],
  journal: [
    { tag: 'Getting Started', title: 'Building a Home: Where Should You Start?', excerpt: 'Before the design, before the drawings — the questions worth answering first.', date: 'Aug 2026', read: '5 min read', image: '/images/journal/SiteVisit1.jpeg' },
    { tag: 'Budgets', title: 'What Does It Cost to Build a House in 2026?', excerpt: 'A realistic range by scope, and where the money actually goes.', date: 'Jul 2026', read: '7 min read', image: '/images/journal/1777807167653.png' },
    { tag: 'Villas', title: '5 Things to Know Before Designing a Villa', excerpt: 'From flood plains to fencing laws — the practical side of villa design.', date: 'Jul 2026', read: '6 min read', image: '/images/journal/Interiors.jpeg' },
    { tag: 'Vastu', title: 'Vastu + Contemporary Architecture: Can They Work Together?', excerpt: 'How we plan for Vastu without giving up a modern layout.', date: 'Jun 2026', read: '4 min read', image: '/images/services/Vastu.jpeg' },
    { tag: 'Materials', title: "Choosing Materials for a Coastal Climate", excerpt: "What actually holds up to monsoon, salt air and heat — and what doesn't.", date: 'Jun 2026', read: '6 min read', image: '/images/journal/Execution.jpeg' },
    { tag: 'Approvals', title: 'Panchayat Approvals: A Plain-English Guide', excerpt: 'What gets submitted, in what order, and how long it typically takes.', date: 'May 2026', read: '8 min read', image: '/images/journal/Turnkey.jpeg' }
  ],
  faq: [
    { q: 'Where do you take on projects?', a: "Across Goa and Karnataka. We occasionally take select projects elsewhere; write to us with the location and we'll let you know." },
    { q: "What's a realistic budget range?", a: 'Most homes we design range widely by scope and finish level. Share your site size and rough brief and we\u2019ll give you an honest range early on.' },
    { q: 'How do design fees work?', a: 'Fees are typically a percentage of construction cost, phased across concept, design development and execution — outlined clearly in your proposal.' },
    { q: 'How long does a project take?', a: 'A typical home takes 3–5 months of design and 10–14 months to build, depending on size and site conditions.' },
    { q: 'Do you design with Vastu principles?', a: 'Yes — on request, we plan with Vastu-informed guidelines alongside a contemporary layout, without compromising either.' },
    { q: 'Do you offer turnkey execution?', a: 'Yes, for clients who want one team accountable from design through handover — including contractors and site supervision.' },
    { q: 'Who handles approvals?', a: 'We prepare and coordinate Panchayat and other statutory approvals as part of the design phase, working with your legal team where needed.' },
    { q: 'Can you work with clients based elsewhere?', a: 'Regularly. We run design reviews over video call and share detailed site updates, with visits timed around key milestones.' },
    { q: 'Do you visit the site before starting?', a: 'Always. A first site visit happens before any design work begins — it shapes almost everything that follows.' },
    { q: "What's the smallest project you take on?", a: "We generally take on full homes and larger interior projects; for smaller renovations, write in and we'll be upfront about fit." }
  ],
  contact: {
    address: 'North Goa, India',
    email: 'hello@azumidesigns.co.in',
    phone: '+91 98765 43210',
    hours: 'Mon–Sat, 10:00–18:00 IST'
  }
};
