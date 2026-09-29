import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import ancientTemple from "../assets/Ancient Temple.jpg";
import ancientWell from "../assets/Ancient_Well.png";
import ancientWell02 from "../assets/Ancient_Well_02.png";
import ancientWell03 from "../assets/Ancient_Well_03.png";
import ancientWell04 from "../assets/Ancient_Well_04.png";
import alarmClockPreview from "../assets/Alarm_Clock/3.jpg";
import alarmClockRender1 from "../assets/Alarm_Clock/1.jpg";
import alarmClockRender5 from "../assets/Alarm_Clock/5.jpg";
import alarmClockDetail1 from "../assets/Alarm_Clock/!_U1_V1.jpg";
import alarmClockDetail2 from "../assets/Alarm_Clock/!_U2_V1.jpg";
import alarmClockDetail3 from "../assets/Alarm_Clock/!_U3_V1.jpg";
import alarmClockDetail4 from "../assets/Alarm_Clock/!_U4_V1.jpg";
import alarmClockTextured from "../assets/Alarm_Clock/Textured 2.mp4";
import alarmClockWireframe from "../assets/Alarm_Clock/Wireframe.mp4";
import wellTurntable from "../assets/Well_Turn Table.mp4";
import fightSequence from "../assets/Shah_Parth_Fight_Sequence.mp4";
import resumeUrl from "../Parth_Shah_Resume_3D.pdf?url";
import "./carousel.css";

type DetailMedia =
  | { type: "video"; src: string; alt: string; poster?: string }
  | { type: "image"; src: string; alt: string };

type ShowcaseProject = {
  slug: string;
  title: string;
  category: string;
  cover: string;
  coverType: "image" | "video";
  description: string;
  detail: string;
  media: DetailMedia[];
};

const ancientWellMedia: DetailMedia[] = [
  { type: "video", src: wellTurntable, alt: "Ancient Well 360 degree turntable", poster: ancientWell },
  { type: "image", src: ancientWell, alt: "Ancient Well render view 1" },
  { type: "image", src: ancientWell02, alt: "Ancient Well render view 2" },
  { type: "image", src: ancientWell03, alt: "Ancient Well render view 3" },
  { type: "image", src: ancientWell04, alt: "Ancient Well render view 4" },
];

const alarmClockMedia: DetailMedia[] = [
  { type: "video", src: alarmClockTextured, alt: "Alarm Clock textured turntable", poster: alarmClockPreview },
  { type: "video", src: alarmClockWireframe, alt: "Alarm Clock wireframe turntable", poster: alarmClockPreview },
  { type: "image", src: alarmClockPreview, alt: "Alarm Clock final render 3" },
  { type: "image", src: alarmClockRender1, alt: "Alarm Clock final render 1" },
  { type: "image", src: alarmClockRender5, alt: "Alarm Clock final render 5" },
  { type: "image", src: alarmClockDetail1, alt: "Alarm Clock detail view 1" },
  { type: "image", src: alarmClockDetail2, alt: "Alarm Clock detail view 2" },
  { type: "image", src: alarmClockDetail3, alt: "Alarm Clock detail view 3" },
  { type: "image", src: alarmClockDetail4, alt: "Alarm Clock detail view 4" },
];

const showcaseProjects: ShowcaseProject[] = [
  {
    slug: "ancient-temple",
    title: "Ancient Temple",
    category: "Environment Art",
    cover: ancientTemple,
    coverType: "image",
    description: "A cinematic environment study focused on architectural modeling, carved surfaces, atmosphere, lighting and reflective water.",
    detail: "Architectural modeling, carved details, cinematic lighting and reflective water presentation.",
    media: [{ type: "image", src: ancientTemple, alt: "Ancient Temple environment artwork" }],
  },
  {
    slug: "ancient-well",
    title: "Ancient Well",
    category: "3D Modeling",
    cover: ancientWell,
    coverType: "image",
    description: "A detailed prop study exploring layered wood construction, stonework, rope, shingles and pulley mechanics.",
    detail: "A modeling and sculpting study focused on layered wood construction, stonework, rope details and pulley mechanics.",
    media: ancientWellMedia,
  },
  {
    slug: "alarm-clock",
    title: "Alarm Clock",
    category: "3D Modeling",
    cover: alarmClockPreview,
    coverType: "image",
    description: "A hard-surface modeling and texturing study presented through final renders, textured and wireframe turntables, and detail views.",
    detail: "A hard-surface modeling and texturing study presented through final renders, textured and wireframe turntables, and close-up detail views.",
    media: alarmClockMedia,
  },
  {
    slug: "fight-sequence",
    title: "Fight Sequence",
    category: "Character Animation",
    cover: fightSequence,
    coverType: "video",
    description: "A body-mechanics performance focused on weight, recovery poses, timing and a fourth-wall comedy beat.",
    detail: "Body mechanics, weight, recovery poses and comedic timing with a fourth-wall beat.",
    media: [{ type: "video", src: fightSequence, alt: "Fight Sequence character animation" }],
  },
];

const tools = ["Maya", "Blender", "ZBrush", "Substance Painter", "Unreal Engine", "Arnold", "Redshift", "After Effects", "Premiere Pro"];

function projectHref(slug: string) {
  return `?project=${slug}`;
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
              {activeProject.coverType === "video" ? (
                <video src={activeProject.cover} autoPlay muted loop playsInline preload="metadata" />
              ) : (
                <img src={activeProject.cover} alt={activeProject.title} />
              )}
            </div>

            <div className="carousel-copy">
              <p className="carousel-meta">{activeProject.category}</p>
              <h3>{activeProject.title}</h3>
              <p className="carousel-description">{activeProject.description}</p>
              <a className="carousel-project-link" href={projectHref(activeProject.slug)}>View project details ↗</a>
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
            href={projectHref(project.slug)}
            className={`carousel-thumb ${index === activeIndex ? "active" : ""}`}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            aria-label={`Open ${project.title} project details`}
          >
            <div className="carousel-thumb-media">
              {project.coverType === "video" ? (
                <video src={project.cover} muted playsInline preload="metadata" />
              ) : (
                <img src={project.cover} alt="" loading="lazy" />
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

function SingleProjectMedia({ project }: { project: ShowcaseProject }) {
  const media = project.media[0];

  return (
    <div className={`project-page-frame ${media.type === "video" ? "has-video" : ""}`}>
      {media.type === "video" ? (
        <video src={media.src} controls playsInline preload="metadata" aria-label={media.alt} />
      ) : (
        <img src={media.src} alt={media.alt} />
      )}
    </div>
  );
}

function ProjectDetailPage({ project }: { project: ShowcaseProject }) {
  const projectIndex = showcaseProjects.findIndex((item) => item.slug === project.slug);
  const previousProject = showcaseProjects[(projectIndex - 1 + showcaseProjects.length) % showcaseProjects.length];
  const nextProject = showcaseProjects[(projectIndex + 1) % showcaseProjects.length];

  useEffect(() => {
    document.title = `${project.title} — Parth Shah`;
    window.scrollTo(0, 0);
    return () => {
      document.title = "Parth Shah — 3D Generalist & Motion Designer";
    };
  }, [project.title]);

  return (
    <div className="app-shell project-page-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="navbar project-page-navbar">
        <a className="brand" href="./" aria-label="Parth Shah portfolio home">PARTH SHAH</a>
        <nav aria-label="Project navigation">
          <a href="./#work">← All projects</a>
          <a href="https://www.linkedin.com/in/parth-shah-3d-animator" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href={resumeUrl} target="_blank" rel="noreferrer">Resume ↗</a>
        </nav>
      </header>

      <main id="main-content" className="project-page">
        <section className="project-page-hero">
          <div className="project-page-heading">
            <p className="project-page-eyebrow">
              Project {String(projectIndex + 1).padStart(2, "0")} / {String(showcaseProjects.length).padStart(2, "0")} · {project.category}
            </p>
            <h1>{project.title}</h1>
          </div>
          <div className="project-page-intro">
            <p>{project.description}</p>
            <a href="./#work">← Back to selected work</a>
          </div>
        </section>

        <section className="project-page-media" aria-label={`${project.title} project media`}>
          {project.media.length > 1 ? (
            <ProjectDetailCarousel title={project.title} media={project.media} />
          ) : (
            <SingleProjectMedia project={project} />
          )}
        </section>

        <section className="project-page-details">
          <p className="project-page-detail-label">Project details</p>
          <div>
            <h2>{project.title}</h2>
            <p>{project.detail}</p>
          </div>
        </section>

        <nav className="project-page-pager" aria-label="Browse projects">
          <a href={projectHref(previousProject.slug)}>
            <span>Previous project</span>
            <strong>← {previousProject.title}</strong>
          </a>
          <a href={projectHref(nextProject.slug)}>
            <span>Next project</span>
            <strong>{nextProject.title} →</strong>
          </a>
        </nav>
      </main>

      <footer><span>© 2026 Parth Shah</span><span>3D Generalist · Motion Designer</span></footer>
    </div>
  );
}

function ExperiencePage() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = "Experience — Parth Shah";
    window.scrollTo(0, 0);
    return () => {
      document.title = "Parth Shah — 3D Generalist & Motion Designer";
    };
  }, []);

  const education = [
    {
      period: "2024 — 2026",
      title: "M.A. 3D Animation",
      organization: "DePaul University",
      location: "Chicago",
      description: "Graduate study focused on 3D animation, modeling, environment art and production workflows.",
    },
  ];

  const experience = [
    {
      period: "2026",
      title: "Student Volunteer",
      organization: "SIGGRAPH 2026",
      location: "Los Angeles",
      description: "Supported conference operations while connecting with artists, studios and the wider computer graphics community.",
    },
    {
      period: "2025 — 2026",
      title: "Vice President",
      organization: "DePaul ACM SIGGRAPH Student Chapter",
      location: "Chicago",
      description: "Helped support student chapter activities and the local 3D, animation and computer graphics community.",
    },
    {
      period: "2021 — 2023",
      title: "Motion Graphics Designer",
      organization: "Nutcracker Digital",
      location: "Mumbai",
      description: "Created motion graphics and 3D visual work across digital media projects.",
    },
  ];

  return (
    <div className="app-shell experience-page-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="navbar experience-page-navbar">
        <a className="brand" href="./" aria-label="Parth Shah portfolio home">PARTH SHAH</a>
        <nav aria-label="Experience page navigation">
          <a href="./#work">Projects</a>
          <a href="./#contact">Contact</a>
          <a href="https://www.linkedin.com/in/parth-shah-3d-animator" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href={resumeUrl} target="_blank" rel="noreferrer">Resume ↗</a>
        </nav>
      </header>

      <main id="main-content" className="experience-page">
        <section className="experience-page-hero">
          <p className="experience-page-eyebrow">Background · Education · Experience</p>
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Experience
          </motion.h1>
          <p className="experience-page-lead">
            A focused timeline of my education, creative work and involvement in the 3D and computer graphics community.
          </p>
        </section>

        <section className="experience-page-section" aria-labelledby="education-heading">
          <div className="experience-page-section-heading">
            <p>01</p>
            <h2 id="education-heading">Education</h2>
          </div>
          <div className="experience-page-list">
            {education.map((item) => (
              <motion.article
                className="experience-page-item"
                key={item.title}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
              >
                <small>{item.period}</small>
                <div>
                  <h3>{item.title}</h3>
                  <p className="experience-page-organization">{item.organization} · {item.location}</p>
                  <p className="experience-page-description">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="experience-page-section" aria-labelledby="experience-heading">
          <div className="experience-page-section-heading">
            <p>02</p>
            <h2 id="experience-heading">Experience</h2>
          </div>
          <div className="experience-page-list">
            {experience.map((item, index) => (
              <motion.article
                className="experience-page-item"
                key={item.title}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.05 }}
              >
                <small>{item.period}</small>
                <div>
                  <h3>{item.title}</h3>
                  <p className="experience-page-organization">{item.organization} · {item.location}</p>
                  <p className="experience-page-description">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="experience-page-cta">
          <p>Selected work</p>
          <a href="./#work">View projects →</a>
        </section>
      </main>

      <footer><span>© 2026 Parth Shah</span><span>3D Generalist · Motion Designer</span></footer>
    </div>
  );
}

function HomePage() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = "Parth Shah — 3D Generalist & Motion Designer";
  }, []);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="navbar">
        <a className="brand" href="#home" aria-label="Parth Shah portfolio home">PARTH SHAH</a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#work">Projects</a>
          <a href="?page=experience">Experience</a>
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
          </div>
        </section>
      </main>

      <footer><span>© 2026 Parth Shah</span><span>3D Generalist · Motion Designer</span></footer>
    </div>
  );
}

function App() {
  const params = new URLSearchParams(window.location.search);
  const requestedProject = params.get("project");
  const requestedPage = params.get("page");
  const project = showcaseProjects.find((item) => item.slug === requestedProject);

  if (project) return <ProjectDetailPage project={project} />;
  if (requestedPage === "experience") return <ExperiencePage />;
  return <HomePage />;
}

export default App;
