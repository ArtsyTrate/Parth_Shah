import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
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
  { title: "Ancient Temple", category: "Environment Art", image: ancientTemple, href: "#ancient-temple" },
  { title: "Ancient Well", category: "3D Modeling", image: ancientWell, href: "#ancient-well" },
];

const tools = ["Maya", "Blender", "ZBrush", "Substance Painter", "Unreal Engine", "Arnold", "Redshift", "After Effects", "Premiere Pro"];

function HeroModel() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.18;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.5}>
      <group ref={group}>
        <mesh castShadow rotation={[0.4, 0.4, 0]}>
          <boxGeometry args={[2.4, 1.45, 2.1]} />
          <meshStandardMaterial color="#15152b" metalness={0.48} roughness={0.24} />
        </mesh>
        <mesh position={[0, 0.95, 0]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[2.15, 1.1, 0.12]} />
          <meshStandardMaterial color="#915eff" emissive="#2c184a" emissiveIntensity={0.7} />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <boxGeometry args={[2.8, 0.16, 1.7]} />
          <meshStandardMaterial color="#202039" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, -1.32, 0.1]}>
          <cylinderGeometry args={[0.25, 0.38, 0.55, 32]} />
          <meshStandardMaterial color="#915eff" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

function HeroCanvas() {
  return (
    <Canvas camera={{ position: [5.8, 2.8, 6], fov: 28 }} dpr={[1, 1.6]} shadows>
      <ambientLight intensity={0.42} />
      <hemisphereLight intensity={0.35} groundColor="#05050d" />
      <spotLight position={[-8, 12, 6]} intensity={2.7} angle={0.24} penumbra={1} castShadow />
      <pointLight position={[4, 2, 4]} intensity={1.8} color="#915eff" />
      <HeroModel />
      <Sparkles count={70} scale={10} size={1.2} speed={0.3} opacity={0.5} color="#c9b7ff" />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2.35} />
    </Canvas>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
    </motion.div>
  );
}

function App() {
  return (
    <div className="app-shell">
      <header className="navbar">
        <a className="brand" href="#home">PARTH SHAH <span>| 3D GENERALIST</span></a>
        <nav>
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
          <a href={resumeUrl} target="_blank" rel="noreferrer">Resume</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="hero-rail"><span></span><i></i></div>
            <div>
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
                Hi, I&apos;m <b>Parth Shah</b>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
                I create 3D environments, assets, animation and motion graphics for games, animation and cinematic experiences.
              </motion.p>
            </div>
          </div>
          <div className="hero-canvas"><HeroCanvas /></div>
          <a className="mouse-scroll" href="#about"><span></span></a>
        </section>

        <section className="section" id="about">
          <SectionTitle eyebrow="Introduction" title="Overview." />
          <p className="intro-copy">
            I&apos;m a 3D Generalist and Motion Designer with experience across modeling, texturing, environment art, rigging, animation, lighting, rendering and compositing. I enjoy taking ideas from blockout to final presentation and balancing visual quality with production constraints.
          </p>
          <div className="service-grid">
            {services.map(([title, text], index) => (
              <motion.article key={title} className="service-card" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
                <div className="service-icon">0{index + 1}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section" id="work">
          <SectionTitle eyebrow="My work" title="Projects." />
          <p className="intro-copy">A selection of environment, modeling and animation work. Each project focuses on production-ready 3D craft, presentation and storytelling.</p>
          <div className="project-grid">
            {projects.map((project, index) => (
              <motion.a key={project.title} href={project.href} className="project-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
                <img src={project.image} alt={project.title} />
                <div><p>{project.category}</p><h3>{project.title}</h3><span>View project ↗</span></div>
              </motion.a>
            ))}
            <motion.a href="#fight-sequence" className="project-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.16 }}>
              <video src={fightSequence} autoPlay muted loop playsInline preload="metadata" />
              <div><p>Character Animation</p><h3>Fight Sequence</h3><span>View project ↗</span></div>
            </motion.a>
          </div>
        </section>

        <section className="section tech-section">
          <SectionTitle eyebrow="Tools I work with" title="Software." />
          <div className="tool-orbits">
            {tools.map(tool => <span key={tool}>{tool}</span>)}
          </div>
        </section>

        <section className="section experience-section">
          <SectionTitle eyebrow="What I have done so far" title="Experience." />
          <div className="timeline">
            <div className="timeline-item"><span></span><div><h3>Motion Graphics Designer</h3><p>Nutcracker Digital · Mumbai</p><small>2021 — 2023</small></div></div>
            <div className="timeline-item"><span></span><div><h3>M.A. 3D Animation</h3><p>DePaul University · Chicago</p><small>2024 — 2026</small></div></div>
            <div className="timeline-item"><span></span><div><h3>Vice President</h3><p>DePaul ACM SIGGRAPH Student Chapter</p><small>2025 — 2026</small></div></div>
          </div>
        </section>

        <section className="project-detail" id="ancient-temple">
          <img src={ancientTemple} alt="Ancient Temple environment" />
          <div><p>Environment Art</p><h2>Ancient Temple</h2><p>Architectural modeling, carved details, cinematic lighting and reflective water presentation.</p></div>
        </section>

        <section className="project-detail split" id="ancient-well">
          <div className="well-grid">{[ancientWell, ancientWell02, ancientWell03, ancientWell04].map((src, i) => <img key={src} src={src} alt={`Ancient Well ${i + 1}`} />)}</div>
          <div><p>3D Modeling</p><h2>Ancient Well</h2><p>A modeling and sculpting study focused on layered wood construction, stonework, rope details and pulley mechanics.</p></div>
        </section>

        <section className="project-detail" id="fight-sequence">
          <video src={fightSequence} controls playsInline preload="metadata" />
          <div><p>Character Animation</p><h2>Fight Sequence</h2><p>Body mechanics, weight, recovery poses and comedic timing with a fourth-wall beat.</p></div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="contact-card">
            <div>
              <SectionTitle eyebrow="Get in touch" title="Contact." />
              <p>I&apos;m open to 3D artist, environment artist, animation and motion design opportunities.</p>
              <a className="contact-email" href="mailto:shahparth1003@gmail.com">shahparth1003@gmail.com</a>
              <div className="contact-links">
                <a href="https://parth__shah.artstation.com/projects" target="_blank" rel="noreferrer">ArtStation</a>
                <a href="https://www.linkedin.com/in/parth-shah-3d-animator" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={resumeUrl} target="_blank" rel="noreferrer">Resume</a>
              </div>
            </div>
            <div className="contact-globe"><HeroCanvas /></div>
          </div>
        </section>
      </main>

      <footer>© 2026 Parth Shah · 3D Generalist & Motion Designer</footer>
    </div>
  );
}

export default App;
