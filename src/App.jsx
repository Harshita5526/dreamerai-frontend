import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowDown, ArrowRight, ArrowUpRight, Bell, Check, ChevronDown, Compass,
  Copy, Download, Heart, Image as ImageIcon, Layers, Menu, MousePointer2,
  Play, Plus, Search, Send, Sparkles, WandSparkles, X, Zap
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'

const art = [
  { title: 'Neon Reverie', type: 'Cyberpunk', image: 'photo-1519608487953-e999c86e7455', tone: 'violet' },
  { title: 'Cloud Kingdom', type: 'Fantasy', image: 'photo-1462331940025-496dfbfc7564', tone: 'blue' },
  { title: 'Electric Bloom', type: 'Abstract', image: 'photo-1534447677768-be436bb09401', tone: 'pink' },
  { title: 'Quiet Horizon', type: 'Landscape', image: 'photo-1470770841072-f978cf4d019e', tone: 'cyan' },
  { title: 'Dreaming in Color', type: 'Portrait', image: 'photo-1534528741775-53994a69daeb', tone: 'pink' },
  { title: 'Midnight Drive', type: 'Cyberpunk', image: 'photo-1519608487953-e999c86e7455', tone: 'blue' },
  { title: 'Otherworld', type: 'Fantasy', image: 'photo-1500530855697-b586d89ba3ee', tone: 'violet' },
  { title: 'Liquid Light', type: 'Abstract', image: 'photo-1500462918059-b1a0cb512f1d', tone: 'pink' },
]
const chartData = [
  { day: 'Mon', creations: 18 }, { day: 'Tue', creations: 24 }, { day: 'Wed', creations: 21 },
  { day: 'Thu', creations: 37 }, { day: 'Fri', creations: 31 }, { day: 'Sat', creations: 48 },
  { day: 'Sun', creations: 42 },
]
const imageUrl = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`

function Reveal({ children, className = '', delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: .7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}

function ProgressRing({ value, label, color = '#c45cff' }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => setShown(value), 350)
    return () => clearTimeout(timer)
  }, [value])
  return <div className="ring-stat">
    <div className="ring" style={{ '--progress': `${shown * 3.6}deg`, '--ring-color': color }}>
      <div className="ring-inner"><strong>{shown}%</strong></div>
    </div>
    <span>{label}</span>
  </div>
}

function TiltCard({ item, index, onSelect }) {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const move = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setTilt({ x: ((e.clientY - r.top) / r.height - .5) * -12, y: ((e.clientX - r.left) / r.width - .5) * 12 })
  }
  return <motion.button
    ref={ref} className="art-card" onMouseMove={move} onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    onClick={() => onSelect(item)} style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06, duration: .5 }}
    aria-label={`Open ${item.title}`}>
    <img src={imageUrl(item.image, 700)} alt={item.title} loading="lazy" />
    <div className="card-shade" />
    <div className="card-info"><div><span>{item.type}</span><h3>{item.title}</h3></div><span className="card-open"><ArrowUpRight size={17}/></span></div>
    <span className="card-sheen" />
  </motion.button>
}

function App() {
  const [activeNav, setActiveNav] = useState('Home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [generated, setGenerated] = useState(false)
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [liked, setLiked] = useState([])
  const [toast, setToast] = useState('')
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 130])
  const heroOpacity = useTransform(scrollYProgress, [0, .8], [1, .15])
  const categories = ['All', 'Fantasy', 'Cyberpunk', 'Abstract', 'Landscape', 'Portrait']
  const filtered = art.filter(item => (category === 'All' || item.type === category) && `${item.title} ${item.type}`.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    const ids = ['home', 'create', 'gallery', 'studio']
    const onScroll = () => {
      const current = ids.map(id => document.getElementById(id)).filter(Boolean).filter(el => el.getBoundingClientRect().top < 160).pop()
      if (current) setActiveNav(({ home: 'Home', create: 'Create', gallery: 'Gallery', studio: 'Studio' })[current.id] || 'Home')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2400)
  }
  const goTo = (name) => {
    setActiveNav(name)
    setMobileOpen(false)
    document.getElementById(name.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
  }
  const generate = () => {
    if (!prompt.trim()) { notify('Describe your idea first ✨'); return }
    setGenerated(true)
    notify('Your concept is ready to explore ✨')
  }
  const toggleLike = (title) => setLiked(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title])

  return <div className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="noise" />
    <header className="topbar">
      <a className="brand" href="#home" onClick={() => goTo('Home')}><span className="brand-mark"><Sparkles size={19}/></span>Dreamer<span>AI</span></a>
      <nav className={mobileOpen ? 'nav-links open' : 'nav-links'}>
        {['Home', 'Create', 'Gallery', 'Studio'].map(name => <button key={name} className={activeNav === name ? 'nav-link active' : 'nav-link'} onClick={() => goTo(name)}>{name}</button>)}
        <button className="nav-link" onClick={() => notify('Pricing plans are coming soon')}>Pricing</button>
      </nav>
      <div className="top-actions"><button className="icon-button search-button" aria-label="Focus gallery search" onClick={() => { goTo('Gallery'); document.getElementById('gallery-search')?.focus() }}><Search size={18}/></button><button className="button button-primary top-cta" onClick={() => goTo('Create')}>Start creating <ArrowUpRight size={16}/></button><button className="icon-button mobile-menu" aria-label="Toggle menu" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X/> : <Menu/>}</button></div>
    </header>

    <main>
      <section id="home" className="hero section-wrap" ref={heroRef}>
        <motion.div className="hero-copy" style={{ opacity: heroOpacity }}>
          <motion.div className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}><span className="pulse-dot"/> AI-POWERED CREATIVE STUDIO</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .2 }}>Turn your ideas<br/>into stunning<br/><span className="gradient-text">visuals.</span></motion.h1>
          <motion.p className="hero-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}>A playground for your imagination. Explore bold styles, discover new worlds, and bring your wildest ideas to life.</motion.p>
          <div className="prompt-box"><WandSparkles size={19}/><input value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()} placeholder="Describe what you want to create..." aria-label="Describe an image"/><button className="prompt-send" onClick={generate} aria-label="Generate concept"><ArrowRight size={20}/></button></div>
          <div className="hero-tags"><span><ImageIcon size={15}/> Text to image</span><span><Layers size={15}/> Style remix</span><span><Zap size={15}/> Instant ideas</span></div>
          <button className="scroll-cue" onClick={() => goTo('Gallery')}><span><ArrowDown size={15}/></span> Scroll to explore</button>
        </motion.div>
        <motion.div className="hero-art" style={{ y: heroY }}>
          <div className="hero-orbit orbit-a"/><div className="hero-orbit orbit-b"/>
          <motion.div className="floating-card floating-main" animate={{ y: [0, -12, 0], rotate: [-2, 1, -2] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}><img src={imageUrl('photo-1534528741775-53994a69daeb', 900)} alt="Dreamlike portrait artwork"/><span className="image-label"><Sparkles size={13}/> Dream portrait</span></motion.div>
          <motion.div className="floating-card floating-small floating-landscape" animate={{ y: [0, 12, 0], rotate: [5, 2, 5] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}><img src={imageUrl('photo-1470770841072-f978cf4d019e', 500)} alt="Dreamlike mountain landscape"/></motion.div>
          <motion.div className="floating-card floating-small floating-neon" animate={{ y: [0, -10, 0], rotate: [-7, -3, -7] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}><img src={imageUrl('photo-1519608487953-e999c86e7455', 500)} alt="Neon dreamscape"/></motion.div>
          <motion.div className="floating-card floating-tiny floating-cat" animate={{ y: [0, 8, 0], rotate: [4, 8, 4] }} transition={{ duration: 5, repeat: Infinity }}><img src={imageUrl('photo-1573865526739-10659fec78a5', 300)} alt="Curious cat"/></motion.div>
          <div className="float-note note-top"><span className="note-icon"><Sparkles size={16}/></span><div><b>Dream it.</b><small>Make it real.</small></div></div>
          <div className="float-note note-bottom"><span className="note-dot"/> <div><b>Creative flow</b><small>Ideas without limits</small></div></div>
        </motion.div>
      </section>

      <section className="marquee-strip" aria-label="Creative tools"><div className="marquee-track">{Array.from({ length: 2 }).map((_, i) => <div className="marquee-set" key={i}>{['IMAGINE WITHOUT LIMITS', '✳', 'MAKE SOMETHING NEW', '✦', 'YOUR NEXT BIG IDEA', '✳'].map((x, j) => <span key={j}>{x}</span>)}</div>)}</div></section>

      <section id="create" className="create-section section-wrap">
        <Reveal className="section-heading"><div><div className="eyebrow"><span className="pulse-dot"/> YOUR CREATIVE PLAYGROUND</div><h2>One prompt. <span className="gradient-text">Infinite worlds.</span></h2><p>Start with a thought. Give it a little magic.</p></div><div className="heading-icon"><WandSparkles size={25}/></div></Reveal>
        <div className="create-grid">
          <Reveal className="generator-panel">
            <div className="panel-top"><span className="panel-label"><span className="status-dot"/> PROMPT LAB</span><span className="tiny-pill">BETA <Sparkles size={11}/></span></div>
            <label htmlFor="prompt-main">What are we imagining today?</label>
            <textarea id="prompt-main" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="A glass city floating above lavender clouds at sunset, cinematic lighting..." />
            <div className="prompt-options"><span>Try a mood</span>{['Dreamy', 'Cinematic', 'Surreal'].map((m, i) => <button key={m} onClick={() => setPrompt(['A dreamy glass city above lavender clouds, soft ethereal light','A cinematic neon city in the rain, dramatic lighting','A surreal garden where planets bloom like flowers'][i])}>{m}</button>)}</div>
            <div className="generator-bottom"><span><span className="tiny-spark">✦</span> Good things start with a prompt</span><button className="button button-primary" onClick={generate}><Sparkles size={16}/> Create concept <ArrowRight size={16}/></button></div>
          </Reveal>
          <Reveal className="preview-panel" delay={.12}>
            <div className="preview-top"><span>{generated ? 'CONCEPT BOARD · READY' : 'YOUR CANVAS'}</span><span className="preview-live"><span/> {generated ? 'Concept saved locally' : 'Waiting for inspiration'}</span></div>
            <div className="preview-image">
              <img src={imageUrl(generated ? 'photo-1470770841072-f978cf4d019e' : 'photo-1462331940025-496dfbfc7564', 1000)} alt="Concept preview" />
              <div className="preview-image-overlay"/>
              <div className="preview-copy"><span className="tiny-pill"><Sparkles size={12}/> {generated ? 'YOUR NEW IDEA' : 'A LITTLE INSPIRATION'}</span><h3>{generated ? 'A world of your own.' : 'Imagine the impossible.'}</h3><p>{generated ? prompt : 'Your next favorite creation starts with a single thought.'}</p></div>
              <div className="preview-actions"><button className="icon-button" aria-label="Copy prompt" onClick={() => { navigator.clipboard?.writeText(prompt || 'Imagine the impossible'); notify('Prompt copied') }}><Copy size={16}/></button><button className="icon-button" aria-label="Download preview" onClick={() => notify('Preview images are demo artwork; connect an image API to download generated art')}><Download size={16}/></button></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="gallery" className="gallery-section section-wrap">
        <Reveal className="section-heading gallery-heading"><div><div className="eyebrow"><span className="pulse-dot"/> THE INSPIRATION FEED</div><h2>Explore the <span className="gradient-text">unexpected.</span></h2><p>A collection of ideas from all across the imagination.</p></div><button className="text-link" onClick={() => { setCategory('All'); setQuery('') }}>View all creations <ArrowRight size={16}/></button></Reveal>
        <div className="gallery-controls"><div className="filter-list">{categories.map(c => <button key={c} className={category === c ? 'filter-chip selected' : 'filter-chip'} onClick={() => setCategory(c)}>{c}</button>)}</div><label className="gallery-search"><Search size={16}/><input id="gallery-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search creations..." /></label></div>
        <div className="art-grid">{filtered.map((item, index) => <div className="art-grid-item" key={item.title}><TiltCard item={item} index={index} onSelect={setSelected}/><button className={liked.includes(item.title) ? 'like-button liked' : 'like-button'} aria-label={`Like ${item.title}`} onClick={() => toggleLike(item.title)}><Heart size={17} fill={liked.includes(item.title) ? 'currentColor' : 'none'}/></button></div>)}</div>
        {filtered.length === 0 && <div className="empty-state"><Search size={25}/><p>No creations found. Try another search.</p><button className="text-link" onClick={() => { setQuery(''); setCategory('All') }}>Clear filters</button></div>}
      </section>

      <section id="studio" className="studio-section section-wrap">
        <Reveal className="section-heading"><div><div className="eyebrow"><span className="pulse-dot"/> YOUR CREATIVE UNIVERSE</div><h2>Ideas in motion. <span className="gradient-text">Progress in color.</span></h2><p>Your imaginary studio, with a few delightful details.</p></div></Reveal>
        <div className="studio-grid">
          <Reveal className="studio-card chart-card"><div className="studio-card-head"><div><span className="muted-label">THIS WEEK</span><h3>Your creative rhythm</h3></div><span className="growth-badge">↗ 24.8%</span></div><div className="chart-summary"><strong>248</strong><span>creative explorations</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 12, right: 5, left: -25, bottom: 0 }}><defs><linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c35bff" stopOpacity={.38}/><stop offset="100%" stopColor="#8d5cff" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false}/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8f8ba8', fontSize: 11 }}/><YAxis hide/><Tooltip contentStyle={{ background: '#15112a', border: '1px solid #4c3276', borderRadius: 12, color: '#fff' }} cursor={{ stroke: '#bd65ff', strokeDasharray: '4 4' }}/><Area type="monotone" dataKey="creations" stroke="#d36aff" strokeWidth={2.5} fill="url(#chartGlow)" activeDot={{ r: 5, fill: '#fff', stroke: '#ca5dff', strokeWidth: 3 }} animationDuration={1600}/></AreaChart></ResponsiveContainer></div><div className="chart-footer"><span><span className="legend-dot"/> Creations</span><span>Updated just now</span></div></Reveal>
          <Reveal className="studio-card progress-card" delay={.1}><div className="studio-card-head"><div><span className="muted-label">YOUR SKILL TREE</span><h3>Creative milestones</h3></div><Compass size={19} className="muted-icon"/></div><p className="progress-intro">Little steps make extraordinary things.</p><div className="rings-row"><ProgressRing value={78} label="Exploration" color="#c45cff"/><ProgressRing value={64} label="Style range" color="#6e8cff"/><ProgressRing value={92} label="Consistency" color="#ff75ca"/></div><div className="milestone"><span className="milestone-icon"><Zap size={17}/></span><div><b>You're on a creative streak</b><small>3 days in a row — keep going!</small></div><ArrowUpRight size={17}/></div></Reveal>
          <Reveal className="studio-card quote-card" delay={.18}><div className="quote-spark"><Sparkles size={22}/></div><span className="muted-label">A NOTE FOR YOUR NEXT IDEA</span><blockquote>“Creativity is intelligence having fun.”</blockquote><p>Keep exploring. Your next great idea might be one happy accident away.</p><button className="button button-glass" onClick={() => goTo('Create')}>Make something <ArrowRight size={16}/></button><div className="quote-orb"/></Reveal>
        </div>
      </section>

      <section className="final-cta section-wrap">
        <div className="cta-orb orb-left"/><div className="cta-orb orb-right"/>
        <Reveal className="cta-content"><span className="eyebrow"><Sparkles size={14}/> YOUR NEXT IDEA IS WAITING</span><h2>Make room for <span className="gradient-text">wonder.</span></h2><p>Start with a spark. See where it takes you.</p><button className="button button-primary button-large" onClick={() => goTo('Create')}>Enter the prompt lab <ArrowRight size={17}/></button></Reveal>
      </section>
    </main>
    <footer className="footer section-wrap"><a className="brand" href="#home" onClick={() => goTo('Home')}><span className="brand-mark"><Sparkles size={17}/></span>Dreamer<span>AI</span></a><span>Made for the beautifully curious.</span><button className="back-top" onClick={() => goTo('Home')}>Back to top ↑</button></footer>

    {selected && <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}><motion.div className="art-modal" role="dialog" aria-modal="true" aria-label={selected.title} onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: .92, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }}><button className="modal-close icon-button" onClick={() => setSelected(null)} aria-label="Close artwork"><X size={19}/></button><img src={imageUrl(selected.image, 1200)} alt={selected.title}/><div className="modal-caption"><div><span className="muted-label">{selected.type} · DREAMERAI GALLERY</span><h2>{selected.title}</h2></div><button className={liked.includes(selected.title) ? 'button button-primary' : 'button button-glass'} onClick={() => toggleLike(selected.title)}><Heart size={16} fill={liked.includes(selected.title) ? 'currentColor' : 'none'}/> {liked.includes(selected.title) ? 'Saved' : 'Save artwork'}</button></div></motion.div></div>}
    {toast && <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><Check size={17}/>{toast}</motion.div>}
  </div>
}

export default App
