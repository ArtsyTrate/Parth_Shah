import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";

import ancientTemple from "../assets/Ancient Temple.jpg";
import ancientWell from "../assets/Ancient_Well.png";
import ancientWell02 from "../assets/Ancient_Well_02.png";
import ancientWell03 from "../assets/Ancient_Well_03.png";
import ancientWell04 from "../assets/Ancient_Well_04.png";
import wellTurntable from "../assets/Well_Turn Table.mp4";
import fightSequence from "../assets/Shah_Parth_Fight_Sequence.mp4";
import resumeUrl from "../Parth_Shah_Resume_3D.pdf?url";
import "./carousel.css";

const showcaseProjects = [
  {
    title: "Ancient Temple",
    category: "Environment Art",
    href: "#ancient-temple",
    media: [ancientTemple],
    type: "image" as const,
    description: "A cinematic environment study focused on architectural modeling, carved surfaces, atmosphere, lighting and reflective water.",
  },
  {
    title: "Ancient Well",
    category: "3D Modeling",
    href: "#ancient-well",
    media: [ancientWell, ancientWell02, ancientWell03, ancientWell04],
    type: "image" as const,
    description: "A detailed prop study exploring layered wood construction, stonework, rope, shingles and pulley mechanics.",
  },
  {
    title: "Fight Sequence",
    category: "Character Animation",
    href: "#fight-sequence",
    media: [fightSequence],
    type: "video" as const,
    description: "A body-mechanics performance focused on weight, recovery poses, timing and a fourth-wall comedy beat.",
  },
];

const tools = ["Maya", "Blender", "ZBrush", "Substance Painter", "Unreal Engine", "Arnold", "Redshift", "After Effects", "Premiere Pro"];

const ancientWellMedia = [
  { type: "video" as const, src: wellTurntable, alt: "Ancient Well 360 degree turntable", poster: ancientWell },
  { type: "image" as const, src: ancientWell, alt: "Ancient Well render view 1" },
  { type: "image" as const, src: ancientWell02, alt: "Ancient Well render view 2" },
  { type: "image" as const, src: ancientWell03, alt: "Ancient Well render view 3" },
  { type: "image" as const, src: ancientWell04, alt: "Ancient Well render view 4" },
];

type DetailMedia = (typeof ancientWellMedia)[number];

function HeroModel() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.1;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.035;
  });

  return (
    <Float speed={0.9} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={group}>
        <mesh rotation={[0.4, 0.4, 0]}>
          <boxGeometry args={[2.5, 1.5, 2.15]} />
          <meshStandardMaterial color="#18191b" metalness={0.55} roughness={0.24} />
        </mesh>
        <mesh position={[0, 0.98, 0]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[2.18, 1.12, 0.1]} />
          <meshStandardMaterial color="#f0f1f3" emissive="#28292c" emissiveIntensity={0.32} />
        </mesh>
        <mesh position={[0, -1.08, 0]}>
          <boxGeometry args={[2.85, 0.14, 1.72]} />
          <meshStandardMaterial color="#242528" metalness={0.45} roughness={0.32} />
        </mesh>
      </group>
    </Float>
  );
}

function HeroCanvas() {
  return (
    <Canvas camera={{ position: [5.8, 2.7, 6], fov: 28 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.38} />
      <hemisphereLight intensity={0.22} groundColor="#090a0b" />
      <spotLight position={[-8, 12, 6]} intensity={2.3} angle={0.22} penumbra={1} />
      <pointLight position={[4, 2, 4]} intensity={0.8} color="#ffffff" />
      <HeroModel />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2.35} />
    </Canvas>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.55 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="section-title"
    >
      <p>{eyebrow}</p>
      <h2>{title}</h2>
    </motion.div>
  );
}

function ProjectCarousel() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = showcaseProjects.length;
  const activeProject = showcaseProjects[activeIndex];
  const previewMedia = activeProject.media[0];

  const next = () => setActiveIndex((current) => (current + 1) % total);
  const previous = () => setActiveIndex((current) => (current - 1 + total) % total);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const timer = window.setInterval(next, 6500);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  return (
    <div
      className="project-carousel"
      tabIndex={0}
      aria-label="Selected project carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") previous();
        if (event.key === "ArrowRight") next();
      }}
    >
      <div className="carousel-stage" aria-live="polite">
        <div className="carousel-topline">
          <span className="carousel-counter">{String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          <span className="carousel-hint">Drag, swipe, use arrows or ← → keys</span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            className="carousel-slide"
            key={activeProject.title}
            initial={reduceMotion ? false : { opacity: 0, x: 70 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -70 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            drag={reduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) next();
              if (info.offset.x > 70) previous();
            }}
          >
            <div className="carousel-media">
              {activeProject.type === "video" ? (
                <video src={previewMedia} autoPlay muted loop playsInline preload="metadata" />
              ) : (
                <img src={previewMedia} alt={activeProject.title} />
              )}
            </div>

            <div className="carousel-copy">
              <p className="carousel-meta">{activeProject.category}</p>
              <h3>{activeProject.title}</h3>
              <p className="carousel-description">{activeProject.description}</p>
              <a className="carousel-project-link" href={activeProject.href}>Explore project ↗</a>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="carousel-controls">
        <div className="carousel-arrows">
          <button className="carousel-arrow" type="button" onClick={previous} aria-label="Previous project">←</button>
          <button className="carousel-arrow" type="button" onClick={next} aria-label="Next project">→</button>
        </div>
        <div className="carousel-dots" aria-label="Choose project">
          {showcaseProjects.map((project, index) => (
            <button
              key={project.title}
              className={`carousel-dot ${index === activeIndex ? "active" : ""}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${project.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
      </div>

      <div className="carousel-thumbs" aria-label="Project links">
        {showcaseProjects.map((project, index) => (
          <a
            key={project.title}
            href={project.href}
            className={`carousel-thumb ${index === activeIndex ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Open ${project.title} project details`}
          >
            <div className="carousel-thumb-media">
              {project.type === "video" ? (
                <video src={project.media[0]} muted playsInline preload="metadata" />
              ) : (
                <img src={project.media[0]} alt="" loading="lazy" />
              )}
            </div>
            <span>{project.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function ProjectDetailCarousel({ title, media }: { title: string; media: DetailMedia[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const requestId = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const total = media.length;
  const activeMedia = media[activeIndex];

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.45),
      { threshold: [0, 0.45, 0.75] },
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || activeMedia.type !== "video") return;

    if (isInView) {
      video.muted = true;
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [activeIndex, activeMedia.type, isInView]);

  useEffect(() => {
    const adjacent = [
      media[(activeIndex + 1) % total],
      media[(activeIndex - 1 + total) % total],
    ];

    adjacent.forEach((item) => {
      if (item.type !== "image") return;
      const image = new Image();
      image.decoding = "async";
      image.src = item.src;
      image.decode?.().catch(() => undefined);
    });
  }, [activeIndex, media, total]);

  const showMedia = (index: number) => {
    if (index === activeIndex || isSwitching) return;

    const normalizedIndex = (index + total) % total;
    const target = media[normalizedIndex];
    const nextRequest = requestId.current + 1;
    requestId.current = nextRequest;

    if (target.type === "video") {
      setActiveIndex(normalizedIndex);
      return;
    }

    setIsSwitching(true);
    const image = new Image();
    image.decoding = "async";
    image.src = target.src;

    const ready = image.decode ? image.decode().catch(() => undefined) : Promise.resolve();
    ready.finally(() => {
      if (requestId.current !== nextRequest) return;
      setActiveIndex(normalizedIndex);
      setIsSwitching(false);
    });
  };

  const next = () => showMedia(activeIndex + 1);
  const previous = () => showMedia(activeIndex - 1);

  return (
    <div
      className="detail-carousel"
      tabIndex={0}
      aria-label={`${title} media carousel`}
      aria-busy={isSwitching}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") previous();
        if (event.key === "ArrowRight") next();
      }}
    >
      <div
        ref={stageRef}
        className={`detail-carousel-stage ${isSwitching ? "is-switching" : ""} ${activeMedia.type === "video" ? "has-video" : ""}`}
        onPointerDown={(event) => {
          pointerStart.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const start = pointerStart.current;
          pointerStart.current = null;
          if (!start || isSwitching) return;

          const deltaX = event.clientX - start.x;
          const deltaY = event.clientY - start.y;
          const horizontalSwipe = Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
          if (!horizontalSwipe) return;

          if (deltaX < 0) next();
          if (deltaX > 0) previous();
        }}
        onPointerCancel={() => {
          pointerStart.current = null;
        }}
      >
        {activeMedia.type === "video" ? (
          <video
            ref={videoRef}
            src={activeMedia.src}
            poster={activeMedia.poster}
            muted
            loop
            controls
            playsInline
            preload="metadata"
            aria-label={activeMedia.alt}
          />
        ) : (
          <img
            src={activeMedia.src}
            alt={activeMedia.alt}
            loading="eager"
            decoding="async"
            draggable={false}
          />
        )}

        <div className="detail-carousel-counter">
          {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>

        <div className="detail-carousel-arrows">
          <button type="button" onClick={previous} disabled={isSwitching} aria-label={`Previous ${title} media`}>←</button>
          <button type="button" onClick={next} disabled={isSwitching} aria-label={`Next ${title} media`}>→</button>
        </div>
      </div>

      <div className="detail-carousel-dots" aria-label={`Choose ${title} media`}>
        {media.map((item, index) => (
          <button
            key={item.src}
            type="button"
            className={index === activeIndex ? "active" : ""}
            onClick={() => showMedia(index)}
            disabled={isSwitching}
            aria-label={item.type === "video" ? `Show ${title} turntable` : `Show ${title} render ${index}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="navbar">
        <a className="brand" href="#home" aria-label="Parth Shah portfolio home">PARTH SHAH</a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
          <a href="https://www.linkedin.com/in/parth-shah-3d-animator" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href={resumeUrl} target="_blank" rel="noreferrer">Resume ↗</a>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" id="home">
          <motion.img
            className="hero-media"
            src={ancientTemple}
            alt="Ancient Temple environment artwork"
            initial={reduceMotion ? false : { scale: 1.055 }}
            animate={reduceMotion ? undefined : { scale: 1.01 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="hero-overlay" />
          <div className="hero-copy">
            <p className="hero-kicker">3D Generalist · Motion Designer</p>
            <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              Building worlds<br />through 3D craft.
            </motion.h1>
            <motion.p className="hero-summary" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.6 }}>
              I create environments, assets, animation and motion graphics for games, animation and cinematic experiences.
            </motion.p>
            <motion.div className="hero-actions" initial={reduceMotion ? false : { opacity: 0 }} animate={reduceMotion ? undefined : { opacity: 1 }} transition={{ delay: 0.24, duration: 0.5 }}>
              <a href="#work">View work</a>
              <a href={resumeUrl} target="_blank" rel="noreferrer">Resume ↗</a>
            </motion.div>
          </div>
          <div className="hero-canvas" aria-hidden="true"><HeroCanvas /></div>
          <a className="scroll-label" href="#about">Scroll to explore ↓</a>
        </section>

        <section className="section dark-section" id="about">
          <div className="section-lead">
            <SectionTitle eyebrow="Introduction" title="Overview" />
            <p className="intro-copy">
              I&apos;m a 3D Generalist and Motion Designer with experience across modeling, texturing, environment art, rigging, animation, lighting, rendering and compositing. I enjoy taking ideas from blockout to final presentation and balancing visual quality with production constraints.
            </p>
          </div>
        </section>

        <section className="section dark-section work-section" id="work">
          <div className="section-lead offset-lead">
            <SectionTitle eyebrow="Selected work" title="Projects" />
            <p className="intro-copy">Environment art, modeling and animation presented with the artwork doing most of the talking.</p>
          </div>
          <ProjectCarousel />
        </section>

        <section className="section light-section tech-section">
          <div className="section-lead narrow-lead">
            <SectionTitle eyebrow="Tools I work with" title="Software" />
          </div>
          <div className="tool-grid">
            {tools.map((tool, index) => <span key={tool}><b>{String(index + 1).padStart(2, "0")}</b>{tool}</span>)}
          </div>
        </section>

        <section className="section dark-section experience-section" id="experience">
          <div className="experience-layout">
            <div className="experience-heading"><SectionTitle eyebrow="Experience" title="Selected timeline" /></div>
            <div className="timeline">
              <motion.div className="timeline-item" initial={reduceMotion ? false : { opacity: 0, x: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }}>
                <small>2026</small><div><h3>Student Volunteer</h3><p>SIGGRAPH 2026 · Los Angeles</p></div>
              </motion.div>
              <motion.div className="timeline-item" initial={reduceMotion ? false : { opacity: 0, x: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.06 }}>
                <small>2025 — 2026</small><div><h3>Vice President</h3><p>DePaul ACM SIGGRAPH Student Chapter</p></div>
              </motion.div>
              <motion.div className="timeline-item" initial={reduceMotion ? false : { opacity: 0, x: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }}>
                <small>2024 — 2026</small><div><h3>M.A. 3D Animation</h3><p>DePaul University · Chicago</p></div>
              </motion.div>
              <motion.div className="timeline-item" initial={reduceMotion ? false : { opacity: 0, x: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.18 }}>
                <small>2021 — 2023</small><div><h3>Motion Graphics Designer</h3><p>Nutcracker Digital · Mumbai</p></div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="project-detail cinematic-detail" id="ancient-temple">
          <img src={ancientTemple} alt="Ancient Temple environment" loading="lazy" />
          <div className="detail-overlay">
            <p>Environment Art</p>
            <h2>Ancient Temple</h2>
            <span>Architectural modeling, carved details, cinematic lighting and reflective water presentation.</span>
          </div>
        </section>

        <section className="project-detail split-detail" id="ancient-well">
          <ProjectDetailCarousel title="Ancient Well" media={ancientWellMedia} />
          <div className="detail-copy"><p>3D Modeling</p><h2>Ancient Well</h2><span>A modeling and sculpting study focused on layered wood construction, stonework, rope details and pulley mechanics.</span></div>
        </section>

        <section className="project-detail cinematic-detail" id="fight-sequence">
          <video src={fightSequence} controls playsInline preload="metadata" />
          <div className="detail-overlay">
            <p>Character Animation</p>
            <h2>Fight Sequence</h2>
            <span>Body mechanics, weight, recovery poses and comedic timing with a fourth-wall beat.</span>
          </div>
        </section>

        <section className="section dark-section contact-section" id="contact">
          <div className="contact-card">
            <div>
              <SectionTitle eyebrow="Get in touch" title="Contact" />
              <p>I&apos;m open to 3D artist, environment artist, animation and motion design opportunities.</p>
              <a className="contact-email" href="mailto:shahparth1003@gmail.com">shahparth1003@gmail.com</a>
              <div className="contact-links">
                <a href="https://parth__shah.artstation.com/projects" target="_blank" rel="noreferrer">ArtStation ↗</a>
                <a href="https://www.linkedin.com/in/parth-shah-3d-animator" target="_blank" rel="noreferrer">LinkedIn ↗</a>
                <a href={resumeUrl} target="_blank" rel="noreferrer">Resume ↗</a>
              </div>
            </div>
            <div className="contact-globe" aria-hidden="true"><HeroCanvas /></div>
          </div>
        </section>
      </main>

      <footer><span>© 2026 Parth Shah</span><span>3D Generalist · Motion Designer</span></footer>
    </div>
  );
}

export default App;
