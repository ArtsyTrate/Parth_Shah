import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { useRef } from "react";
import type { Group } from "three";

import ancientTemple from "../assets/Ancient Temple.jpg";
import ancientWell from "../assets/Ancient_Well.png";
import ancientWell02 from "../assets/Ancient_Well_02.png";
import ancientWell03 from "../assets/Ancient_Well_03.png";
import ancientWell04 from "../assets/Ancient_Well_04.png";
import fightSequence from "../assets/Shah_Parth_Fight_Sequence.mp4";

const resumeUrl = "https://artsytrate.github.io/Parth_Shah/Parth_Shah_Resume_3D.pdf";

const services = [
  ["3D Modeling", "Assets, props and production-ready hard-surface work."],
  ["Environment Art", "World building, set dressing, lighting and presentation."],
  ["Character Animation", "Body mechanics, performance, timing and polish."],
  ["Motion Design", "3D + 2D motion, compositing and visual storytelling."],
];

const projects = [
  { title: "Ancient Temple", category: "Environment Art", image: ancientTemple, href: "#ancient-temple", featured: true },
  { title: "Ancient Well", category: "3D Modeling", image: ancientWell, href: "#ancient-well", featured: false },
];

const tools = ["Maya", "Blender", "ZBrush", "Substance Painter", "Unreal Engine", "Arnold", "Redshift", "After Effects", "Premiere Pro"];

function HeroModel() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.04;
  });

  return (
    <Float speed={1} rotationIntensity={0.12} floatIntensity={0.35}>
      <group ref={group}>
        <mesh rotation={[0.4, 0.4, 0]}>
          <boxGeometry args={[2.5, 1.5, 2.15]} />
          <meshStandardMaterial color="#151515" metalness={0.55} roughness={0.24} />
        </mesh>
        <mesh position={[0, 0.98, 0]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[2.18, 1.12, 0.1]} />
          <meshStandardMaterial color="#f4f4f4" emissive="#2a2a2a" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0, -1.08, 0]}>
          <boxGeometry args={[2.85, 0.14, 1.72]} />
          <meshStandardMaterial color="#222222" metalness={0.45} roughness={0.32} />
        </mesh>
      </group>
    </Float>
  );
}

function HeroCanvas() {
  return (
    <Canvas camera={{ position: [5.8, 2.7, 6], fov: 28 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.38} />
      <hemisphereLight intensity={0.22} groundColor="#000000" />
      <spotLight position={[-8, 12, 6]} intensity={2.3} angle={0.22} penumbra={1} />
      <pointLight position={[4, 2, 4]} intensity={0.8} color="#ffffff" />
      <HeroModel />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2.35} />
    </Canvas>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
    </motion.div>
  );
}

function App() {
  return (
    <div className="app-shell">
      <header className="navbar">
        <a className="brand" href="#home">PARTH SHAH</a>
        <nav>
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
          <a href={resumeUrl} target="_blank" rel="noreferrer">Resume ↗</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <img className="hero-media" src={ancientTemple} alt="Ancient Temple environment artwork" />
          <div className="hero-overlay" />
          <div className="hero-copy">
            <p className="hero-kicker">3D GENERALIST · MOTION DESIGNER</p>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
              Building worlds<br />through 3D craft.
            </motion.h1>
            <motion.p className="hero-summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
              I create environments, assets, animation and motion graphics for games, animation and cinematic experiences.
            </motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}>
              <a href="#work">View work</a>
              <a href={resumeUrl} target="_blank" rel="noreferrer">Resume ↗</a>
            </motion.div>
          </div>
          <div className="hero-canvas" aria-hidden="true"><HeroCanvas /></div>
          <a className="scroll-label" href="#about">Scroll to explore ↓</a>
        </section>

        <section className="section dark-section" id="about">
          <SectionTitle eyebrow="Introduction" title="Overview" />
          <p className="intro-copy">
            I&apos;m a 3D Generalist and Motion Designer with experience across modeling, texturing, environment art, rigging, animation, lighting, rendering and compositing. I enjoy taking ideas from blockout to final presentation and balancing visual quality with production constraints.
          </p>
          <div className="service-grid">
            {services.map(([title, text], index) => (
              <motion.article key={title} className="service-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section dark-section" id="work">
          <SectionTitle eyebrow="Selected work" title="Projects" />
          <p className="intro-copy">A selection of environment, modeling and animation work presented as the primary visual experience.</p>
          <div className="project-grid editorial-grid">
            {projects.map((project, index) => (
              <motion.a key={project.title} href={project.href} className={`project-card ${project.featured ? "featured" : ""}`} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
                <img src={project.image} alt={project.title} />
                <div className="project-caption"><p>{project.category}</p><h3>{project.title}</h3><span>View project ↗</span></div>
              </motion.a>
            ))}
            <motion.a href="#fight-sequence" className="project-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }}>
              <video src={fightSequence} autoPlay muted loop playsInline preload="metadata" />
              <div className="project-caption"><p>Character Animation</p><h3>Fight Sequence</h3><span>View project ↗</span></div>
            </motion.a>
          </div>
        </section>

        <section className="section light-section tech-section">
          <SectionTitle eyebrow="Tools I work with" title="Software" />
          <div className="tool-grid">
            {tools.map((tool, index) => <span key={tool}><b>{String(index + 1).padStart(2, "0")}</b>{tool}</span>)}
          </div>
        </section>

        <section className="section dark-section experience-section" id="experience">
          <SectionTitle eyebrow="What I have done so far" title="Experience" />
          <div className="timeline">
            <div className="timeline-item"><small>2021 — 2023</small><div><h3>Motion Graphics Designer</h3><p>Nutcracker Digital · Mumbai</p></div></div>
            <div className="timeline-item"><small>2024 — 2026</small><div><h3>M.A. 3D Animation</h3><p>DePaul University · Chicago</p></div></div>
            <div className="timeline-item"><small>2025 — 2026</small><div><h3>Vice President</h3><p>DePaul ACM SIGGRAPH Student Chapter</p></div></div>
          </div>
        </section>

        <section className="project-detail cinematic-detail" id="ancient-temple">
          <img src={ancientTemple} alt="Ancient Temple environment" />
          <div className="detail-overlay">
            <p>Environment Art</p>
            <h2>Ancient Temple</h2>
            <span>Architectural modeling, carved details, cinematic lighting and reflective water presentation.</span>
          </div>
        </section>

        <section className="project-detail split-detail" id="ancient-well">
          <div className="well-grid">{[ancientWell, ancientWell02, ancientWell03, ancientWell04].map((src, i) => <img key={src} src={src} alt={`Ancient Well ${i + 1}`} />)}</div>
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
            <div className="contact-globe"><HeroCanvas /></div>
          </div>
        </section>
      </main>

      <footer><span>© 2026 Parth Shah</span><span>3D Generalist · Motion Designer</span></footer>
    </div>
  );
}

export default App;
