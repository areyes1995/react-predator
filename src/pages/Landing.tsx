import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: { transcript: string }[][]; resultIndex: number }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

/* ──────────────── Scroll Reveal ──────────────── */
function Reveal({ children, delay }: { children: React.ReactNode; delay?: number | string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRevealed(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      data-reveal
      className={`transition-[opacity,transform] duration-700 ease-out ${revealed ? 'revealed opacity-100 translate-y-0' : 'opacity-0 translate-y-7'}`}
      style={{ transitionDelay: delay ? (typeof delay === 'number' ? delay / 1000 + 's' : delay) : '0s' }}
    >
      {children}
    </div>
  );
}

/* ──────────────── CountUp ──────────────── */
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const t0 = performance.now();
    const dur = 1600;
    const step = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(target * ease));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);
  return (
    <span ref={ref}>
      {count.toLocaleString('es-PE')}{suffix}
    </span>
  );
}

/* ═══════════════ PRELOADER ═══════════════ */
function Preloader({ booted }: { booted: boolean }) {
  return (
    <div className="fixed inset-0 z-[100] bg-ink-950 flex items-center justify-center transition-opacity duration-700"
         style={{ opacity: booted ? 0 : 1, pointerEvents: booted ? 'none' : 'auto' }}>
      <div className="text-center">
        <div className="text-5xl mb-6 anim-float inline-block">🪐</div>
        <p className="font-mono text-xs tracking-[0.35em] text-cyan-300/80 mb-4">INICIALIZANDO UAPAVERSE</p>
        <div className="w-56 h-[3px] bg-slate-800 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
               style={{ width: booted ? '100%' : '0%', transition: 'width 900ms' }}></div>
        </div>
        <p className="font-mono text-[10px] text-slate-600 mt-3">STANDS · IA CORE · ROLLOUT v2.0</p>
      </div>
    </div>
  );
}

/* ═══════════════ NAVBAR ═══════════════ */
function Navbar({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="fixed top-0 left-0 h-[3px] z-[90] bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-400"
           style={{ width: (function(){ const h=document.documentElement; return (h.scrollTop/(h.scrollHeight-h.clientHeight))*100; })() + '%' }}></div>
      <header className={`fixed top-0 inset-x-0 z-[80] transition-all duration-500 ${scrolled ? 'glass border-b border-white/5 py-3' : 'py-5 border-b border-transparent'}`}>
        <nav className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center font-display font-bold text-ink text-sm shadow-lg shadow-violet-500/30 group-hover:rotate-6 transition-transform">
              U
              <span className="absolute -inset-1 rounded-xl bg-gradient-to-br from-cyan-400/40 to-violet-500/40 blur-md -z-10"></span>
            </div>
            <span className="font-display font-semibold tracking-tight text-white">UAPA<span className="grad-text">verse</span></span>
          </a>
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <a href="#plataforma" className="nav-link text-slate-300 hover:text-white transition">Plataforma</a>
            <a href="#recorrido" className="nav-link text-slate-300 hover:text-white transition">Recorrido</a>
            <a href="#asistente" className="nav-link text-slate-300 hover:text-white transition">Asistente IA</a>
            <a href="#analitica" className="nav-link text-slate-300 hover:text-white transition">Analítica</a>
            <a href="#arquitectura" className="nav-link text-slate-300 hover:text-white transition">Arquitectura</a>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-cyan-300 transition px-3 py-2">Ingresar</a>
            <a href="#final"
               className="text-sm font-semibold text-ink bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 px-5 py-2.5 rounded-lg shadow-lg shadow-violet-600/30 transition hover:-translate-y-0.5">
              Crear cuenta
            </a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[5px]" aria-label="Menú">
            <span className={`block w-6 h-[2px] bg-white rounded transition ${menuOpen && 'rotate-45 translate-y-[7px]'}`}></span>
            <span className={`block w-6 h-[2px] bg-white rounded transition ${menuOpen && '-rotate-45 -translate-y-[1px]'}`}></span>
          </button>
        </nav>
        <div className={`lg:hidden glass border-b border-white/5 mt-2 ${menuOpen ? '' : 'hidden'}`}>
          <div className="px-6 py-6 space-y-4 text-base font-medium flex flex-col">
            <a href="#plataforma" onClick={() => setMenuOpen(false)} className="hover:text-cyan-300 transition">Plataforma</a>
            <a href="#recorrido" onClick={() => setMenuOpen(false)} className="hover:text-cyan-300 transition">Recorrido</a>
            <a href="#asistente" onClick={() => setMenuOpen(false)} className="hover:text-cyan-300 transition">Asistente IA</a>
            <a href="#analitica" onClick={() => setMenuOpen(false)} className="hover:text-cyan-300 transition">Analítica</a>
            <a href="#arquitectura" onClick={() => setMenuOpen(false)} className="hover:text-cyan-300 transition">Arquitectura</a>
            <a href="#final" onClick={() => setMenuOpen(false)} className="mt-2 text-center font-semibold text-ink bg-gradient-to-r from-cyan-400 to-violet-500 py-3 rounded-lg">Crear cuenta</a>
          </div>
        </div>
      </header>
    </>
  );
}

/* ═══════════════ HERO ═══════════════ */
function Hero() {
  const [scrambled, setScrambled] = useState('el UAPAverse');
  const [scrambleDone, setScrambleDone] = useState(false);
  const [liveVisitors, setLiveVisitors] = useState(312);
  const tiltRef = useRef<HTMLDivElement>(null);
  const tiltCardRef = useRef<HTMLDivElement>(null);

  const words = ['el UAPAverse,', 'tu stand. tu mundo.', 'la voz.'];

  useEffect(() => {
    const CH = '!<>-_\\/[]{}=+*^?#·░▒▓';
      let idx = 0;
      let timer: ReturnType<typeof setInterval> | undefined = undefined;
      function decode(word: string) {
      let f = 0;
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        f++;
        let out = '';
        for (let i = 0; i < word.length; i++) {
          if (i < f / 2) out += word[i];
          else out += CH[Math.random() * CH.length | 0];
        }
        setScrambled(out);
        if (f / 2 >= word.length) { if (timer) { clearInterval(timer); timer = undefined; } setScrambled(word); setScrambleDone(true); }
      }, 45);
    }
    decode(words[0]);
    const iv = setInterval(() => {
      idx = (idx + 1) % words.length;
      decode(words[idx]);
    }, 3400);
    return () => { clearInterval(iv); if (timer) clearInterval(timer); };
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setLiveVisitors(prev => {
        const delta = Math.floor(Math.random() * 6 - 2.5) + 1;
        return Math.min(420, Math.max(280, prev + delta));
      });
    }, 2600);
    return () => clearInterval(iv);
  }, []);

  const handleTilt = (e: React.MouseEvent) => {
    const card = tiltCardRef.current;
    if (!card || !window.matchMedia('(hover:hover)').matches) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  };

  const handleTiltLeave = () => {
    const card = tiltCardRef.current;
    if (!card) return;
    card.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1)';
    card.style.transform = '';
    setTimeout(() => { card.style.transition = ''; }, 700);
  };

  const stands = [
    {x:18,y:28,on:1},{x:34,y:46,on:1},{x:52,y:22,on:0},{x:66,y:42,on:1},
    {x:82,y:28,on:1},{x:26,y:70,on:1},{x:48,y:62,on:1},{x:70,y:72,on:0},
    {x:86,y:58,on:1},{x:10,y:52,on:1}
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10 w-full h-full">
        <div className="absolute inset-0 w-full h-full bg-grid"></div>
        <div className="orb absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-violet-600/40"></div>
        <div className="orb absolute top-40 right-0 w-[420px] h-[420px] rounded-full bg-cyan-500/30"></div>
        <div className="orb absolute bottom-0 left-1/3 w-[380px] h-[380px] rounded-full bg-fuchsia-500/20"></div>
        <div className="hero-floor bg-grid-floor absolute w-full h-full"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-950"></div>
      </div>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-14 items-center w-full">
        {/* COPY */}
        <div>
          <Reveal delay={100}>
            <div className="inline-flex items-center gap-2.5 glass border border-white/10 rounded-full px-4 py-1.5 mb-7">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" style={{ animation: 'pulseDot 2s infinite' }}></span>
              </span>
              <span className="font-mono mono-eyebrow text-cyan-300">CADESOFT · FERIA TECNOLÓGICA 2025</span>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="font-display text-white font-bold leading-[1.02] text-5xl sm:text-6xl xl:text-7xl tracking-tight">
              El futuro de la feria<br className="hidden sm:block" />
              tecnológica vive en
              <span className="grad-text block mt-2 min-h-[1.1em]">{scrambleDone ? scrambled : 'el UAPAverse'}</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-lg text-slate-400 max-w-xl leading-relaxed">
              La plataforma inmersiva que centraliza <strong className="text-slate-200">proyectos, stands virtuales y actividades</strong> de CADESOFT.
              Recorrela, explórala y deja que la IA la narre por ti.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#recorrido"
                 className="group relative overflow-hidden font-semibold text-ink bg-gradient-to-r from-cyan-400 to-violet-500 px-7 py-3.5 rounded-xl shadow-xl shadow-violet-600/30 hover:shadow-violet-500/50 transition hover:-translate-y-0.5">
                <span className="relative z-10">Explorar la feria →</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span>
              </a>
              <a href="#asistente"
                 className="font-medium glass border border-white/15 hover:border-cyan-400/50 rounded-xl px-7 py-3.5 transition hover:-translate-y-0.5">
                🎙 Prueba la IA
              </a>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-12 grid grid-cols-3 max-w-md divide-x divide-white/10">
              <div className="pr-4">
                <p className="font-display text-3xl font-bold text-white"><CountUp target={48} /></p>
                <p className="font-mono text-[11px] text-slate-500 mt-1 tracking-wider">STANDS VIRTUALES</p>
              </div>
              <div className="px-4">
                <p className="font-display text-3xl font-bold text-white"><CountUp target={120} /></p>
                <p className="font-mono text-[11px] text-slate-500 mt-1 tracking-wider">PROYECTOS</p>
              </div>
              <div className="pl-4">
                <p className="font-display text-3xl font-bold text-white"><CountUp target={5400} suffix="+" /></p>
                <p className="font-mono text-[11px] text-slate-500 mt-1 tracking-wider">VISITANTES</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* HERO VISUAL */}
        <Reveal delay={250}>
          <div className="relative select-none" ref={tiltRef} onMouseMove={handleTilt} onMouseLeave={handleTiltLeave}>
            <div className="absolute -inset-6 -z-10 bg-gradient-to-tr from-cyan-500/20 via-violet-600/20 to-fuchsia-500/20 blur-2xl rounded-[3rem]"></div>
            <div ref={tiltCardRef} className="tilt glass border border-white/10 rounded-2xl p-5 relative overflow-hidden">
              <div className="scanline"></div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></span>
                <span className="ml-3 font-mono text-[10px] text-slate-500 tracking-widest">UAPAVERSE.HUB — PAVILLÓN PRINCIPAL</span>
                <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400">LIVE × {liveVisitors}</span></span>
              </div>
              <div className="relative rounded-xl bg-ink-950/80 border border-white/5 p-4 h-56 overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-grid opacity-40"></div>
                {stands.map((s, i) => (
                  <div key={i} className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2" style={{ left: s.x + '%', top: s.y + '%' }}>
                    <span className={`block w-2.5 h-2.5 rounded-full mx-auto ${s.on ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
                    {s.on && <span className="absolute inset-0 -m-2 rounded-full bg-cyan-400/40" style={{ animation: 'pulseDot 2.2s infinite', animationDelay: i * 0.3 + 's' }}></span>}
                  </div>
                ))}
                <div className="absolute bottom-3 left-3 font-mono text-[10px] text-cyan-300/80 tracking-wider">▸ 32/48 STANDS ACTIVOS</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="col-span-1 rounded-lg bg-ink/70 border border-white/5 p-3">
                  <p className="font-mono text-[9px] text-slate-500 mb-1.5">TOP PROYECTO</p>
                  <p className="text-[11px] font-semibold text-white leading-tight">AgroSense · IoT</p>
                  <p className="font-mono text-[10px] text-amber-300 mt-1.5">★ 4.9 · 312 pts</p>
                </div>
                <div className="col-span-2 rounded-lg bg-ink/70 border border-white/5 p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 shrink-0 flex items-center justify-center text-ink font-bold text-xs">IA</div>
                  <div>
                    <p className="font-mono text-[9px] text-slate-500">ASISTENTE VIRTUAL</p>
                    <p className="text-[11px] text-slate-300">"¿Cuál stand tiene drones?" <span className="cursor-blink text-cyan-400">▍</span></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="anim-float absolute -left-6 top-10 hidden md:block" style={{ animationDelay: '0.5s' }}>
              <div className="glass border border-cyan-400/30 rounded-xl px-4 py-2.5 shadow-lg shadow-cyan-500/10">
                <p className="font-mono text-[10px] text-cyan-300">🎙 VOZ ACTIVA</p>
                <p className="text-xs text-slate-300 mt-0.5">"Guíame al pabellón IoT"</p>
              </div>
            </div>
            <div className="anim-float absolute -right-4 bottom-16 hidden md:block" style={{ animationDelay: '1.4s' }}>
              <div className="glass border border-fuchsia-400/30 rounded-xl px-4 py-2.5 shadow-lg shadow-fuchsia-500/10">
                <p className="font-mono text-[10px] text-fuchsia-300">📊 EN VIVO</p>
                <p className="text-xs text-slate-300">+127 visitas hoy</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
        <span className="font-mono text-[10px] tracking-[0.3em]">SCROLL</span>
        <span className="w-[1px] h-8 bg-gradient-to-b from-slate-500 to-transparent animate-pulse"></span>
      </div>
    </section>
  );
}

/* ═══════════════ MARQUEE ═══════════════ */
function Marquee() {
  const items = [
    'STANDS VIRTUALES ◆',
    'GESTIÓN DE PROYECTOS ◆',
    'ASISTENTE IA CON VOZ ◆',
    'ROL & PERMISOS ◆',
    'REPORTE & ESTADÍSTICAS ◆',
    'ACCESO SEGURO REMOTO ◆',
  ];
  return (
    <div className="marquee relative border-y border-white/5 bg-ink-900/60 py-4 overflow-hidden">
      <div className="marquee-track flex whitespace-nowrap gap-10 w-max font-mono text-sm text-slate-500">
        {[0, 1].map(n => items.map((item, i) => (
          <span key={`${n}-${i}`} className="px-2">
            <span dangerouslySetInnerHTML={{ __html: item.replace('◆', `<span class="text-cyan-500">◆</span>`)
              .replace('GESTIÓN DE PROYECTOS', 'GESTIÓN DE PROYECTOS <span class="text-violet-500">◆</span>')
              .replace('ASISTENTE IA CON VOZ', 'ASISTENTE IA CON VOZ <span class="text-fuchsia-500">◆</span>')
              .replace('ROL & PERMISOS', 'ROL &amp; PERMISOS <span class="text-cyan-500">◆</span>')
              .replace('REPORTE & ESTADÍSTICAS', 'REPORTE &amp; ESTADÍSTICAS <span class="text-violet-500">◆</span>')
              .replace('ACCESO SEGURO REMOTO', 'ACCESO SEGURO REMOTO <span class="text-fuchsia-500">◆</span>')
            }} />
          </span>
        )))}
      </div>
    </div>
  );
}

/* ═══════════════ OBJETIVOS / BENTO ═══════════════ */
function Objetivos() {
  return (
    <section id="plataforma" className="relative py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <p className="font-mono mono-eyebrow text-cyan-400 mb-4">// 01 · LA PLATAFORMA</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">Seis objetivos.<br /><span className="grad-text">Un solo universo.</span></h2>
            <p className="mt-5 text-slate-400 text-lg">UAPAverse fue diseñada para resolver de forma integral cada reto organizativo de la feria CADESOFT.</p>
          </div>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Reveal delay={100}>
            <article className="neon-card clip-corner bg-ink-800/60 rounded-2xl p-7 md:col-span-2 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-violet-600/20 rounded-full blur-2xl"></div>
              <span className="font-mono text-[10px] text-slate-500 tracking-widest">OBJETIVO 01</span>
              <h3 className="mt-3 font-display text-2xl font-semibold text-white">Arquitectura de gestión</h3>
              <p className="mt-2 text-slate-400 leading-relaxed">Una arquitectura de software modular que administra <strong className="text-slate-200">usuarios, proyectos, stands y actividades</strong> como un ecosistema conectado, escalable y fácil de extender.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-cyan-400/30 text-cyan-300">Usuarios</span>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-cyan-400/30 text-cyan-300">Proyectos</span>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-cyan-400/30 text-cyan-300">Stands</span>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-cyan-400/30 text-cyan-300">Actividades</span>
              </div>
            </article>
          </Reveal>
          <Reveal delay={180}>
            <article className="neon-card clip-corner bg-ink-800/60 rounded-2xl p-7 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-36 h-36 bg-cyan-500/15 rounded-full blur-2xl"></div>
              <span className="font-mono text-[10px] text-slate-500 tracking-widest">OBJETIVO 02</span>
              <h3 className="mt-3 font-display text-xl font-semibold text-white">Proyectos vivos</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">Registro, consulta, actualización y administración de proyectos y participantes con datos siempre frescos.</p>
            </article>
          </Reveal>
          <Reveal delay={260}>
            <article className="neon-card clip-corner bg-ink-800/60 rounded-2xl p-7 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-36 h-36 bg-fuchsia-500/15 rounded-full blur-2xl"></div>
              <span className="font-mono text-[10px] text-slate-500 tracking-widest">OBJETIVO 03</span>
              <h3 className="mt-3 font-display text-xl font-semibold text-white">Entorno inmersivo</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">Recorre la feria, explora stands y consume información técnica y multimedia sin salir de casa.</p>
            </article>
          </Reveal>
          <Reveal delay={340}>
            <article className="neon-card clip-corner bg-ink-800/60 rounded-2xl p-7 md:col-span-2 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-fuchsia-600/20 rounded-full blur-2xl"></div>
              <span className="font-mono text-[10px] text-slate-500 tracking-widest">OBJETIVO 04</span>
              <h3 className="mt-3 font-display text-2xl font-semibold text-white">Inteligencia con voz</h3>
              <p className="mt-2 text-slate-400 leading-relaxed">Asistentes virtuales con <strong className="text-slate-200">reconocimiento y síntesis de voz</strong> que conversan contigo sobre cada proyecto, stand y actividad del evento.</p>
              <div className="mt-4 h-1 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"></div>
              </div>
              <p className="mt-1.5 font-mono text-[10px] text-slate-500 mt-3">STRETCH GOAL · VOICE CORE v1.2</p>
            </article>
          </Reveal>
          <Reveal delay={420}>
            <article className="neon-card clip-corner bg-ink-800/60 rounded-2xl p-7 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl"></div>
              <span className="font-mono text-[10px] text-slate-500 tracking-widest">OBJETIVO 05</span>
              <h3 className="mt-3 font-display text-xl font-semibold text-white">Datos que deciden</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">Mecanismos de administración, reportes y estadísticas para medir participación, interés y desempeño general.</p>
            </article>
          </Reveal>
          <Reveal delay={500}>
            <article className="neon-card clip-corner bg-ink-800/60 rounded-2xl p-7 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl"></div>
              <span className="font-mono text-[10px] text-slate-500 tracking-widest">OBJETIVO 06</span>
              <h3 className="mt-3 font-display text-xl font-semibold text-white">Acceso por roles</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">Autenticación segura y control de permisos por rol: cada usuario ve exactamente lo que le corresponde.</p>
            </article>
          </Reveal>
          <Reveal delay={580}>
            <article className="clip-corner rounded-2xl p-7 bg-gradient-to-br from-cyan-500/10 to-violet-600/10 border border-white/10 relative overflow-hidden hidden lg:block">
              <p className="font-display text-5xl font-bold grad-text">100%</p>
              <p className="mt-2 text-sm text-slate-300">del proceso organizativo, digitalizado y medible.</p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ RECORRIDO / ROLES TABS ═══════════════ */
function Recorrido() {
  const [tab, setTab] = useState(0);
  return (
    <section id="recorrido" className="relative py-28 bg-ink-900/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <p className="font-mono mono-eyebrow text-cyan-400 mb-4">// 02 · UN UNIVERSO, TRES EXPERIENCIAS</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">Tu rol define <span className="grad-text">tu dimensión</span></h2>
            <p className="mt-5 text-slate-400 text-lg">Mismo universo, perspectivas diferentes. Selecciona tu dimensión.</p>
          </div>
        </Reveal>
        <div className="mt-12">
          <div className="flex justify-center gap-3 flex-wrap mb-12">
            {[{l:'🧑‍🎓 Visitante',d:'Explora'},{l:'🚀 Creador',d:'Exhibe'},{l:'🛡️ Organizador',d:'Mide'}].map((t,i) => (
              <button key={i} onClick={() => setTab(i)}
                className={`relative px-6 py-3 rounded-xl font-medium text-sm transition border ${tab === i ? 'text-ink bg-gradient-to-r from-cyan-400 to-violet-500 border-transparent shadow-lg shadow-violet-600/30' : 'text-slate-300 border-white/10 hover:border-cyan-400/40 bg-ink/40'}`}>
                <span>{t.l}</span>
              </button>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              {tab === 0 && (
                <div>
                  <p className="font-mono mono-eyebrow text-cyan-400 mb-3">DIMENSIÓN 01 · VISITANTE</p>
                  <h3 className="font-display text-3xl font-bold text-white">Recorre. Toca. Pregunta.</h3>
                  <p className="mt-4 text-slate-400 leading-relaxed">Entra al pabellón virtual, navega stand a stand, abre demos, descarga recursos y conversa con el asistente de voz sobre cualquier proyecto del evento.</p>
                </div>
              )}
              {tab === 1 && (
                <div>
                  <p className="font-mono mono-eyebrow text-fuchsia-400 mb-3">DIMENSIÓN 02 · CREADOR</p>
                  <h3 className="font-display text-3xl font-bold text-white">Tu stand. Tu narrativa.</h3>
                  <p className="mt-4 text-slate-400 leading-relaxed">Registra tu proyecto, carga demos, videos, documentación técnica y coordina a tu equipo. Todo editable en tiempo real hasta el día del evento.</p>
                </div>
              )}
              {tab === 2 && (
                <div>
                  <p className="font-mono mono-eyebrow text-amber-400 mb-3">DIMENSIÓN 03 · ORGANIZER</p>
                  <h3 className="font-display text-3xl font-bold text-white">El control total.</h3>
                  <p className="mt-4 text-slate-400 leading-relaxed">Vigila métricas en vivo, administra stands, modera contenidos y descarga informes listos para informe de gestión.</p>
                </div>
              )}
            </div>
            <div className="glass border border-white/10 rounded-2xl p-5 relative overflow-hidden h-full min-h-[320px]">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></span>
                <span className="ml-3 font-mono text-[10px] text-slate-500 tracking-widest">
                  {tab === 0 ? 'VISITOR.VIEW' : tab === 1 ? 'CREATOR.CP' : 'ADMIN.ROOT'}
                </span>
              </div>
              {tab === 0 && (
                <div className="space-y-3">
                  <div className="rounded-lg bg-ink/70 border border-cyan-400/20 p-4 flex items-center justify-between">
                    <div><p className="text-sm font-semibold text-white">Stand A-07 · AgroSense</p><p className="font-mono text-[10px] text-slate-500">IOT · AGRICULTURA · ★ 4.9</p></div>
                    <span className="text-xs font-semibold text-cyan-300 border border-cyan-400/40 rounded-lg px-3 py-1.5">Entrar →</span>
                  </div>
                  <div className="rounded-lg bg-ink/70 border border-white/5 p-4 flex items-center justify-between opacity-80">
                    <div><p className="text-sm font-semibold text-white">Stand B-03 · NeuroLink UI</p><p className="font-mono text-[10px] text-slate-500">IA · UX · ★ 4.7</p></div>
                    <span className="text-xs text-slate-400">Entrar →</span>
                  </div>
                  <div className="rounded-lg bg-gradient-to-r from-cyan-500/10 to-violet-600/10 border border-fuchsia-400/30 p-3">
                    <p className="text-xs text-slate-300"><span className="text-fuchsia-300 font-semibold">IA:</span> "¿Quieres que te guíe al pabellón de drones?"</p>
                  </div>
                </div>
              )}
              {tab === 1 && (
                <div className="space-y-3">
                  <div className="rounded-lg bg-ink/70 border border-white/5 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-white">Mi proyecto</p>
                      <span className="font-mono text-[10px] text-emerald-400 border border-emerald-400/40 rounded px-2 py-0.5">● EN LÍNEA</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">AgroSense — riego inteligente con IoT y LLM</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-ink/60 rounded-md py-2"><p className="text-lg font-bold text-white">4</p><p className="font-mono text-[9px] text-slate-500">MEDIA</p></div>
                      <div className="bg-ink/60 rounded-md py-2"><p className="text-lg font-bold text-white">3</p><p className="font-mono text-[9px] text-slate-500">EQUIPO</p></div>
                      <div className="bg-ink/60 rounded-md py-2"><p className="text-lg font-bold text-white">312</p><p className="font-mono text-[9px] text-slate-500">PUNTOS</p></div>
                    </div>
                  </div>
                  <button className="w-full text-xs font-semibold text-ink bg-gradient-to-r from-fuchsia-400 to-violet-500 rounded-lg py-2.5">⚡ Editar stand</button>
                </div>
              )}
              {tab === 2 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center mb-1">
                    <div className="rounded-lg bg-ink/70 border border-white/5 p-3"><p className="text-xl font-bold text-white">23</p><p className="font-mono text-[9px] text-slate-500">STANDS OK</p></div>
                    <div className="rounded-lg bg-ink/70 border border-amber-400/20 p-3"><p className="text-xl font-bold text-amber-300">2</p><p className="font-mono text-[9px] text-slate-500">EN REVISIÓN</p></div>
                    <div className="rounded-lg bg-ink/70 border border-white/5 p-3"><p className="text-xl font-bold text-white">98%</p><p className="font-mono text-[9px] text-slate-500">SLA</p></div>
                  </div>
                  <div className="rounded-lg bg-ink/70 border border-white/5 p-4 space-y-2">
                    <p className="font-mono text-[10px] text-slate-500 mb-1">PERMISOS ACTIVOS</p>
                    <div className="flex justify-between text-xs text-slate-300"><span>org_admin</span><span className="text-emerald-400">✓ total</span></div>
                    <div className="flex justify-between text-xs text-slate-300"><span>project_lead</span><span className="text-cyan-300">✓ edit proyecto</span></div>
                    <div className="flex justify-between text-xs text-slate-300"><span>visitor</span><span className="text-slate-400">✓ read</span></div>
                  </div>
                  <button className="w-full text-xs font-semibold text-amber-200 bg-amber-400/10 border border-amber-400/40 rounded-lg py-2.5">📄 Generar informe PDF</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ ASISTENTE IA ═══════════════ */
function AsistenteIA() {
  const [msgs, setMsgs] = useState<Array<{ from: string; text: string; typing?: boolean }>>([
    { from: 'ia', text: '¡Hola! Soy el asistente de UAPAverse. Pregúntame sobre stands, proyectos o tu rol.' }
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speak, setSpeak] = useState(true);
  const [micMsg, setMicMsg] = useState('');
  const logRef = useRef<HTMLDivElement>(null);

  const recSupport = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  const recRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setMicMsg('Tu navegador no soporta reconocimiento de voz. Escríbeme. 😉'); return; }
    const rec = new SR();
    rec.lang = 'es-PE'; rec.interimResults = false; rec.continuous = false;
    rec.onresult = (e: { results: { transcript: string }[][]; resultIndex: number }) => {
      const txt = e.results?.[0]?.[0]?.transcript || '';
      setListening(false);
      if (txt) { setMsgs(p => [...p, { from: 'me', text: txt }]); setTimeout(() => iaReply(txt), 500); }
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    return () => { try { rec.stop(); } catch(e){} };
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [msgs]);

  // initial typing animation
  useEffect(() => {
    const t1 = setTimeout(() => setMsgs(p => [...p, { from: 'ia', text: '…', typing: true }]), 1200);
    const t2 = setTimeout(() => {
      setMsgs(p => {
        const last = p[p.length - 1];
        if (last.typing) { p[p.length - 1] = { ...last, text: '¿Qué te gustaría explorar hoy? Puedo guiarte por pabellones, o contarte cómo funcionan los roles.', typing: false }; }
        return p;
      });
    }, 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const iaReply = useCallback((q: string) => {
    const s = q.toLowerCase();
    let reply;
    if (/rol|permiso|acceso|cuenta|login|registr/.test(s)) {
      reply = 'Tenemos cuatro roles: Organizador (acceso total), Project Lead (dueño de su proyecto), Estudiante (colabora en equipos) y Visitante (exploración libre). ¿Quieres que te explique uno?';
    } else if (/drone|dron|sky/i.test(s)) {
      reply = 'Vas al pabellón Aéreo en el Stand C-12: "SkyFleet — Drones de precisión". Tienen un live demo cada hora.';
    } else if (/hola|buenas|hey|hi/.test(s)) {
      reply = '¡Hola! Pregúntame "¿Qué stands hay de drones?" o "¿Cómo funciona mi rol?". ';
    } else if (/gracias|thank/.test(s)) {
      reply = '¡Con gusto! Estoy aquí todo el día de la feria.';
    } else if (/proyecto|stand|pavell/.test(s)) {
      reply = 'Hay 48 stands activos en 6 pabellones. El Top 3 del momento: AgroSense (IoT), NeuroLink (IA) y SkyFleet (drones). ¿Te llevo a alguno?';
    } else if (/stat|reporte|dato|anál|analítica/.test(s)) {
      reply = 'Hoy llevamos 5,412 visitantes, 48 stands activos y 2,187 interacciones con IA. Los paneles están en la sección Analítica.';
    } else {
      reply = 'Buena pregunta. En producción respondería con contexto completo del evento. Prueba con "stands de drones", "roles" o "proyectos". ';
    }
    setMsgs(p => [...p, { from: 'ia', text: reply }]);
    speakOut(reply);
  }, []);

  const speakOut = (text: string) => {
    if (!speak || !window.speechSynthesis) return;
    const plain = text.replace(/[«»*_]/g, '');
    const u = new SpeechSynthesisUtterance(plain);
    u.lang = 'es-ES'; u.rate = 1.05;
    const v = speechSynthesis.getVoices().find(v => /es[-_]/.test(v.lang));
    if (v) u.voice = v;
    u.onstart = () => setSpeaking(true);
    u.onend = u.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const send = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setListening(false);
    setMsgs(p => [...p, { from: 'me', text: q }]);
    setInput('');
    setTimeout(() => iaReply(q), 500);
  };

  const toggleMic = () => {
    if (!recRef.current) { setMicMsg('Reconocimiento de voz no disponible aquí. Escríbeme. 😉'); return; }
    if (listening) { try { recRef.current.stop(); } catch(e){} setListening(false); }
    else { try { recRef.current.start(); } catch(e){} setListening(true); }
  };

  const quickChips = ['¿Qué stands hay de drones?', '¿Cómo funciona mi rol?', 'Sorpréndeme'];

  return (
    <section id="asistente" className="relative py-28 overflow-hidden">
      <div className="orb absolute top-20 -right-32 w-[420px] h-[420px] rounded-full bg-fuchsia-600/25"></div>
      <div className="orb absolute bottom-0 -left-32 w-[380px] h-[380px] rounded-full bg-cyan-500/20"></div>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-14 items-center relative">
        <div>
          <Reveal>
            <p className="font-mono mono-eyebrow text-fuchsia-400 mb-4">// 03 · NÚCLEO DE INTELIGENCIA</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">Háblale a la feria.<br /><span className="grad-text">Ella te responde.</span></h2>
            <p className="mt-5 text-slate-400 text-lg leading-relaxed">
              Un asistente virtual con <strong className="text-slate-200">reconocimiento y síntesis de voz</strong>: pregúntale qué stand tiene drones, pide recomendaciones o navega la feria completamente manos-free.
            </p>
          </Reveal>
          <Reveal>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: '🎙', title: 'Reconocimiento de voz', desc: 'Escúchate, transcríbete, respóndete.' },
                { icon: '🔊', title: 'Síntesis de voz', desc: 'Respuestas habladas en español.' },
                { icon: '🧠', title: 'Conocimiento contextual', desc: 'Sabe qué hay en cada stand y actividad.' },
                { icon: '♿', title: 'Inclusivo por diseño', desc: 'Voz, texto o ambos. Sin fricción.' },
              ].map((f, i) => (
                <div key={i} className="neon-card bg-ink-800/60 rounded-xl p-5">
                  <p className="text-2xl mb-2">{f.icon}</p>
                  <p className="font-semibold text-white text-sm">{f.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{f.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="glass border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-2xl shadow-violet-900/40 select-text">
            <div className="scanline"></div>
            <div className="flex items-center gap-4 mb-5">
              <div className="relative w-14 h-14 shrink-0">
                <span className={`absolute inset-0 rounded-full border border-cyan-400/30 ${listening || speaking ? 'animate-ping' : ''}`}></span>
                <div className={`relative w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 flex items-center justify-center text-xl ${speaking ? 'scale-110' : ''}`} style={{ transition: 'transform .3s' }}>🤖</div>
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-white leading-none">UAPAverse Core</p>
                <p className={`font-mono text-[10px] mt-1.5 tracking-widest ${listening ? 'text-cyan-300' : speaking ? 'text-fuchsia-300' : 'text-slate-500'}`}>
                  {listening ? '● ESCUCHANDO…' : speaking ? '◉ SINTETIZANDO…' : '○ LISTA · V2.0'}
                </p>
              </div>
              <button onClick={() => setSpeak(!speak)} className="text-lg" title={speak ? 'Silenciar' : 'Activar voz'}>
                {speak ? '🔊' : '🔇'}
              </button>
            </div>

            <div className={`flex items-center justify-center h-10 mb-4 wave-bars ${listening || speaking ? 'on' : ''}`}>
              {[...Array(12)].map((_, i) => <span key={i} style={{ animationDelay: i * 0.07 + 's' }}></span>)}
            </div>

            <div ref={logRef} className="h-60 overflow-y-auto space-y-3 pr-1 scroll-smooth">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[78%] rounded-xl px-3.5 py-2 text-sm leading-relaxed ${m.from === 'me'
                      ? 'bg-gradient-to-r from-cyan-500/30 to-violet-500/30 border border-cyan-400/30 text-slate-100'
                      : 'bg-ink/80 border border-white/10 text-slate-200'}`}>
                    <span className={`font-mono text-[9px] tracking-widest block mb-0.5 ${m.from === 'me' ? 'text-cyan-300/70' : 'text-fuchsia-300/70'}`}>
                      {m.from === 'me' ? 'TÚ' : 'UAPAVERSE'}
                    </span>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2 flex-wrap">
              {quickChips.map((q, i) => (
                <button key={i} onClick={() => send(q)}
                  className="font-mono text-[10px] px-3 py-1.5 rounded-full border border-white/10 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 transition">
                  {q}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button onClick={toggleMic} disabled={!recSupport}
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 border transition ${listening
                    ? 'bg-cyan-400 text-ink border-cyan-300 shadow-lg shadow-cyan-500/40'
                    : 'bg-ink/60 border-white/10 hover:border-cyan-400/50'}`}>
                🎙
              </button>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Pregúntale a UAPAverse…"
                className="flex-1 bg-ink/70 border border-white/10 focus:border-cyan-400/60 focus:outline-none rounded-xl px-4 py-2.5 text-sm placeholder:text-slate-600" />
              <button onClick={() => send()} className="px-4 h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-ink font-semibold text-sm">→</button>
            </div>
            <p className="font-mono text-[10px] text-slate-600 mt-2">{micMsg}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ ANALÍTICA ═══════════════ */
function Analitica() {
  const [bars, setBars] = useState(
    [
      { label: 'IOT', w: 0, v: 64, active: true },
      { label: 'IA / ML', w: 0, v: 82, active: true },
      { label: 'CYBERSEC', w: 0, v: 54, active: true },
      { label: 'DRONES', w: 0, v: 47, active: true },
      { label: 'WEB APPS', w: 0, v: 71, active: false },
      { label: 'EMBEDDED', w: 0, v: 38, active: true },
    ]
  );
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    bars.forEach((_b, i) => {
      const iv = setTimeout(() => {
        setBars(prev => prev.map((x, j) => j === i ? { ...x, w: x.v } : x));
      }, i * 120);
      return () => clearTimeout(iv);
    });
  }, [started]);

  return (
    <section id="analitica" ref={sectionRef} className="relative py-28 bg-ink-900/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <p className="font-mono mono-eyebrow text-amber-400 mb-4">// 04 · PANEL DE CONTROL</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">La feria, <span className="grad-text">en números</span></h2>
            <p className="mt-5 text-slate-400 text-lg">Reportes y estadísticas en tiempo real para evaluar participación, interés y desempeño.</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="mt-14">
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-1 space-y-5">
                <div className="neon-card bg-ink-800/60 rounded-2xl p-6">
                  <p className="font-mono text-[10px] text-slate-500 tracking-widest mb-2">VISITANTES HOY</p>
                  <p className="font-display text-5xl font-bold text-white">5,412</p>
                  <p className="font-mono text-[11px] text-emerald-400 mt-2">▲ 23.4% vs. feria 2024</p>
                </div>
                <div className="neon-card bg-ink-800/60 rounded-2xl p-6">
                  <p className="font-mono text-[10px] text-slate-500 tracking-widest mb-2">STANDS ACTIVOS</p>
                  <div className="flex items-end gap-3">
                    <p className="font-display text-5xl font-bold text-white">48</p>
                    <p className="font-mono text-[11px] text-cyan-300 mb-2">EN LÍNEA</p>
                  </div>
                </div>
                <div className="neon-card bg-ink-800/60 rounded-2xl p-6">
                  <p className="font-mono text-[10px] text-slate-500 tracking-widest mb-2">INTERACCIONES CON IA</p>
                  <p className="font-display text-5xl font-bold text-white">2,187</p>
                  <p className="font-mono text-[11px] text-slate-400 mt-2">87% satisfacción</p>
                </div>
              </div>
              <div className="lg:col-span-2 neon-card bg-ink-800/60 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono text-[10px] text-slate-500 tracking-widest">VISITAS POR PABELLÓN · TIEMPO REAL</p>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> EN VIVO</span>
                </div>
                <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 items-center">
                  {bars.map((b, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-24 shrink-0 font-mono text-[10px] text-slate-400 text-right">{b.label}</span>
                      <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                             style={{ width: b.w + '%', opacity: b.active ? 1 : 0.5 }}></div>
                      </div>
                      <span className="w-10 font-mono text-[10px] text-slate-500">{b.v}k</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 border-t border-white/5 pt-5 flex items-center justify-between">
                  <p className="font-mono text-[10px] text-slate-500 tracking-widest">TOP 3 PROYECTOS DEL MOMENTO</p>
                  <span className="font-mono text-[10px] text-slate-600">RANKING ACTUALIZA CADA 60s</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-ink/60 border border-white/5 px-4 py-2.5">
                    <p className="text-sm text-slate-200">🥇 AgroSense · IoT para el agro</p><span className="font-mono text-xs text-amber-300">312 pts</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-ink/60 border border-white/5 px-4 py-2.5">
                    <p className="text-sm text-slate-200">🥈 NeuroLink · IA conversacional</p><span className="font-mono text-xs text-slate-400">287 pts</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-ink/60 border border-white/5 px-4 py-2.5">
                    <p className="text-sm text-slate-200">🥉 SkyFleet · Drones de precisión</p><span className="font-mono text-xs text-slate-400">265 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ ARQUITECTURA ═══════════════ */
function Arquitectura() {
  return (
    <section id="arquitectura" className="relative py-28 overflow-hidden">
      <div className="orb absolute top-1/3 -left-40 w-[420px] h-[420px] rounded-full bg-violet-600/20"></div>
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <p className="font-mono mono-eyebrow text-cyan-400 mb-4">// 05 · ARQUITECTURA DE SOFTWARE</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">Diseñado por capas. <span className="grad-text">Construido para escalar.</span></h2>
          </div>
        </Reveal>
        <div className="mt-16 space-y-5">
          <Reveal>
            <div className="neon-card clip-corner bg-ink-800/70 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 sm:items-center relative overflow-hidden">
              <span className="font-mono text-[10px] text-slate-500 tracking-widest w-24 shrink-0">L3 · EXPERIENCIA</span>
              <div className="flex-1">
                <p className="font-display text-xl font-semibold text-white">Capa inmersiva</p>
                <p className="text-sm text-slate-400 mt-1">Web inmersivo, navegación de stands, multimedia, accesibilidad y rendimiento multiplataforma.</p>
              </div>
              <div className="flex gap-2">
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-cyan-400/30 text-cyan-300">3D Stands</span>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-cyan-400/30 text-cyan-300">Responsive</span>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-cyan-400/30 text-cyan-300">A11y</span>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="neon-card clip-corner bg-ink-800/70 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 sm:items-center relative overflow-hidden">
              <span className="font-mono text-[10px] text-slate-500 tracking-widest w-24 shrink-0">L2 · SERVICIOS</span>
              <div className="flex-1">
                <p className="font-display text-xl font-semibold text-white">Core de gestión</p>
                <p className="text-sm text-slate-400 mt-1">APIs de proyectos, stands, actividades, medios y notificaciones. Orquestación de contenido.</p>
              </div>
              <div className="flex gap-2">
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-violet-400/30 text-violet-300">Proyectos</span>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-violet-400/30 text-violet-300">Stands</span>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-violet-400/30 text-violet-300">Actividades</span>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="neon-card clip-corner bg-ink-800/70 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 sm:items-center relative overflow-hidden">
              <span className="font-mono text-[10px] text-slate-500 tracking-widest w-24 shrink-0">L1 · INTELIGENCIA</span>
              <div className="flex-1">
                <p className="font-display text-xl font-semibold text-white">Intelligence + Seguridad</p>
                <p className="text-sm text-slate-400 mt-1">Voz (ASR/TTS), RAG sobre el evento, analítica en tiempo real, autenticación y control de permisos por rol.</p>
              </div>
              <div className="flex gap-2">
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-fuchsia-400/30 text-fuchsia-300">ASR / TTS</span>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-fuchsia-400/30 text-fuchsia-300">RAG</span>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-fuchsia-400/30 text-fuchsia-300">RBAC</span>
              </div>
            </div>
          </Reveal>
          <div className="rounded-2xl p-4 bg-gradient-to-r from-cyan-500/10 via-violet-600/10 to-fuchsia-500/10 border border-white/10 text-center">
            <p className="font-mono text-[11px] tracking-[0.3em] text-slate-400">INFRAESTRUCTURA CLOUD · AUTENTICACIÓN SEGURA · BACKUP · MONITOREO</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ ROLES & PERMISOS ═══════════════ */
function Roles() {
  const roles = [
    { icon: '🛡️', title: 'Organizer', tag: 'ACCESO TOTAL', color: 'text-amber-300', items: ['Gestiona usuarios y permisos', 'Aprobación de stands', 'Reportes y exportación', 'Parámetros globales'] },
    { icon: '👨‍💻', title: 'Project Lead', tag: 'PROPIETARIO', color: 'text-cyan-300', items: ['CRUD de su proyecto', 'Gestión de equipo', 'Multimedia y recursos', 'Métricas de su stand'] },
    { icon: '🎓', title: 'Estudiante', tag: 'CONTRIBUYENTE', color: 'text-violet-300', items: ['Perfil y credenciales', 'Membresía en equipos', 'Publica aportes técnicos', 'Chat del stand'] },
    { icon: '🧑‍🎓', title: 'Visitante', tag: 'EXPLORADOR', color: 'text-fuchsia-300', items: ['Recorrido libre', 'Asistente IA con voz', 'Descarga recursos', 'Vota proyectos'] },
  ];
  return (
    <section className="py-28 bg-ink-900/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <p className="font-mono mono-eyebrow text-emerald-400 mb-4">// 06 · SEGURIDAD & ROLES</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">Cada rol, <span className="grad-text">su dimensión</span></h2>
            <p className="mt-5 text-slate-400 text-lg">Acceso remoto, seguro y organizado con autenticación y control de permisos por rol.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {roles.map((r, i) => (
            <Reveal key={i} delay={80 * i}>
              <div className="neon-card clip-corner bg-ink-800/70 rounded-2xl p-6">
                <div className="text-3xl mb-3">{r.icon}</div>
                <p className="font-display font-semibold text-white">{r.title}</p>
                <p className={`font-mono text-[10px] ${r.color} tracking-widest mt-1 mb-3`}>{r.tag}</p>
                <ul className="text-xs text-slate-400 space-y-1.5">
                  {r.items.map((item, j) => (<li key={j}>✓ {item}</li>))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ FAQ ═══════════════ */
function FAQ() {
  const [open, setOpen] = useState(-1);
  const faqs = [
    { q: '¿Qué es UAPAverse?', a: 'UAPAverse es la plataforma virtual inmersiva de CADESOFT que centraliza la administración de la feria tecnológica: proyectos, stands virtuales, actividades y su comunidad, enlazados por inteligencia artificial.' },
    { q: '¿Necesito instalar algo para visitar?', a: 'No. La plataforma corre en el navegador de forma responsive. Los stands 3D degradan con elegancia a dispositivos modestos.' },
    { q: '¿Puedo usar solo la voz?', a: 'Sí. Reconocimiento y síntesis de voz (Web Speech API) están integrados al asistente. Escríbeme, o dímelo.' },
    { q: '¿Cómo funcionan los permisos?', a: 'Cada cuenta tiene un rol (Organizer, Project Lead, Estudiante, Visitante) que define qué puede ver, editar y administrar. Autenticación remota y segura.' },
    { q: '¿Qué reportes obtengo?', a: 'Participación, visitas por stand, interés de visitantes, interacciones con IA y ranking de proyectos, exportables en un clic.' },
  ];
  return (
    <section className="py-28">
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <p className="font-mono mono-eyebrow text-cyan-400 mb-4">// 07 · PREGUNTAS FRECUENTES</p>
            <h2 className="font-display text-4xl font-bold text-white tracking-tight">Resuelto al instante</h2>
          </div>
        </Reveal>
        <Reveal>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="neon-card bg-ink-800/60 rounded-2xl overflow-hidden">
                <button onClick={() => setOpen(open === i ? -1 : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="font-display font-semibold text-white">{f.q}</span>
                  <span className={`text-cyan-400 transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {open === i && (
                  <div className="overflow-hidden" style={{ maxHeight: open === i ? '200px' : '0px' }}>
                    <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ CTA FINAL ═══════════════ */
function CTA() {
  return (
    <section id="final" className="py-24">
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center border border-white/10"
               style={{ background: 'linear-gradient(135deg, rgba(34,211,238,.12), rgba(139,92,246,.18), rgba(232,121,249,.12))' }}>
            <div className="absolute -top-20 left-1/4 w-72 h-72 bg-cyan-500/25 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-fuchsia-500/25 rounded-full blur-3xl"></div>
            <p className="font-mono mono-eyebrow text-cyan-300 mb-4">¿LISTO PARA ENTRAR AL UNIVERSO?</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              La feria de CADESOFT ya no se visita.<br /><span className="grad-text">Se habita.</span>
            </h2>
            <p className="mt-5 text-slate-300 max-w-xl mx-auto">Crea tu cuenta, registra tu proyecto o simplemente explora. El pabellón virtual está encendido.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a href="#" className="font-semibold text-ink bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 px-8 py-4 rounded-xl shadow-xl shadow-violet-600/30 transition hover:-translate-y-0.5">
                Crear cuenta gratuita
              </a>
              <a href="#" className="font-medium glass border border-white/20 hover:border-cyan-400/50 rounded-xl px-8 py-4 transition hover:-translate-y-0.5">
                Solicitar acceso organizador
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ FOOTER ═══════════════ */
function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-900/60">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center font-display font-bold text-ink text-sm">U</div>
            <span className="font-display font-semibold text-white">UAPA<span className="grad-text">verse</span></span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">Plataforma inmersiva para la gestión integral de la feria tecnológica de CADESOFT. Proyectos, stands, IA con voz y datos en tiempo real.</p>
          <p className="font-mono text-[10px] text-slate-600 mt-4">HECHO CON 🇵🇪 · UAPA · ESCUELA DE INGENIERÍA DE SISTEMAS E INFORMÁTICA</p>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-slate-500 mb-4">PLATAFORMA</p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#plataforma" className="hover:text-cyan-300 transition">Funcionalidades</a></li>
            <li><a href="#asistente" className="hover:text-cyan-300 transition">Asistente IA</a></li>
            <li><a href="#analitica" className="hover:text-cyan-300 transition">Analítica</a></li>
            <li><a href="#arquitectura" className="hover:text-cyan-300 transition">Arquitectura</a></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-slate-500 mb-4">ESTADO</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Sistema en línea</li>
            <li className="flex items-center gap-2 text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> IA Core estable</li>
            <li className="font-mono text-[10px] text-slate-600 mt-2">BUILD 2.0.4-STABLE</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <p>© 2025 UAPAverse · Proyecto CADESOFT</p>
          <p className="font-mono text-[10px]">HECHO EN LA TIERRA · DESPLEGADO AL UAPAVERSE</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════ SPOTLIGHT CURSOR ═══════════════ */
function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !window.matchMedia('(hover:hover)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const handler = (e: MouseEvent) => {
      ref.current?.style.setProperty('--sx', e.clientX + 'px');
      ref.current?.style.setProperty('--sy', e.clientY + 'px');
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return (
    <div ref={ref} id="spotlight"
         className="fixed inset-0 pointer-events-none z-1 mix-blend-screen"
         style={{ background: 'radial-gradient(560px circle at var(--sx, 50%) var(--sy, 40%), rgba(120,120,255,.10), transparent 60%)', transition: 'opacity .4s' }}></div>
  );
}

/* ═══════════════ BACK TO TOP ═══════════════ */
function BackToTop({ show }: { show: boolean }) {
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-[70] w-11 h-11 rounded-full glass border border-white/15 flex items-center justify-center text-cyan-300 hover:border-cyan-400/60 transition ${show ? '' : 'hidden'}`}
      style={{ display: show ? '' : 'none' }}>↑</button>
  );
}

/* ═══════════════ MAIN APP ═══════════════ */
export default function Landing() {
  const [booted, setBooted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [backToTop, setBackToTop] = useState(false);

  useEffect(() => {
    setTimeout(() => setBooted(true), 900);

    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const h = document.documentElement;
      setBackToTop((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="bg-ink-950 text-slate-300 antialiased overflow-x-hidden font-sans">
      <Preloader booted={booted} />
      <Spotlight />
      <Navbar scrolled={scrolled} />
      <BackToTop show={scrolled && backToTop} />

      <main id="top">
        <Hero />
        <Marquee />
        <Objetivos />
        <Recorrido />
        <AsistenteIA />
        <Analitica />
        <Arquitectura />
        <Roles />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
