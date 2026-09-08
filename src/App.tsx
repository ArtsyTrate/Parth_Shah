import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { Group, Mesh } from "three";

import ancientTemple from "../assets/Ancient Temple.jpg";
import ancientWell from "../assets/Ancient_Well.png";
import ancientWell02 from "../assets/Ancient_Well_02.png";
import ancientWell03 from "../assets/Ancient_Well_03.png";
import ancientWell04 from "../assets/Ancient_Well_04.png";
import fightSequence from "../assets/Shah_Parth_Fight_Sequence.mp4";

const resumeUrl = "https://artsytrate.github.io/Parth_Shah/Parth_Shah_Resume_3D.pdf";

const navItems = [
  ["Work", "#work"],
  ["Projects", "#projects"],
  ["About", "#about"],
  ["Contact", "#contact"],
];

const disciplines = [
  ["Modelling", "Ancient Well", "#ancient-well"],
  ["Environment Modelling", "Ancient Temple", "#ancient-temple"],
  ["Animation", "Fight Sequence", "#fight-sequence"],
  ["Character Animation", "Performance & body mechanics", "#fight-sequence"],
  ["Motion Graphics", "Design · Animation · Compositing", "https://parth__shah.artstation.com/projects"],
];

const tools = ["Maya", "Blender", "ZBrush", "Substance Painter", "Unreal Engine", "Arnold", "Redshift", "After Effects", "Premiere Pro"];

function HeroObject() {
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.14;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
    }
    if (core.current) core.current.rotation.z -= delta * 0.2;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.55}>
      <group ref={group}>
        <mesh ref={core} castShadow>
          <icosahedronGeometry args={[1.8, 3]} />
          <meshStandardMaterial color="#d9ff4f" roughness={0.25} metalness={0.5} wireframe />
        </mesh>
        <mesh rotation={[0.6, 0.2, 0.8]}>
          <torusGeometry args={[2.45, 0.025, 12, 180]} />
          <meshStandardMaterial color="#f2f0eb" emissive="#555555" />
        </mesh>
        <mesh rotation={[-0.25, 1.1, -0.3]}>
          <torusGeometry args={[2.15, 0.018, 12, 180]} />
          <meshStandardMaterial color="#8d8d8d" />
        </mesh>
      </group>
    </Float>
  );
}

function HeroCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 40 }} dpr={[1, 1.6]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 4]} intensity={2.4} />
      <pointLight position={[-4, -2, 3]} intensity={1.6} color="#d9ff4f" />
      <HeroObject />
      <Sparkles count={48} scale={7} size={1.2} speed={0.25} opacity={0.35} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.45} minPolarAngle={Math.PI / 2.35} maxPolarAngle={Math.PI / 1.7} />
    </Canvas>
  );
}

const Reveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Parth Shah home">PARTH <span>SHAH</span></a>
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
          <a href={resumeUrl} target="_blank" rel="noreferrer">Resume</a>
          <a href="https://www.linkedin.com/in/parth-shah-3d-animator" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero3d">
          <div className="hero-copy">
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">3D GENERALIST · MOTION DESIGNER</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              BUILDING <em>WORLDS</em><br />IN 3D.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="hero-description">
              I create 3D environments, assets and character animation from concept through final presentation, combining technical craft with visual storytelling.
            </motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <a className="primary-button" href="#work">View work ↘</a>
              <a className="text-link" href={resumeUrl} target="_blank" rel="noreferrer">Resume ↗</a>
            </motion.div>
          </div>
          <div className="hero-canvas" aria-label="Interactive 3D geometric artwork"><HeroCanvas /></div>
          <div className="hero-index">PARTH SHAH / PORTFOLIO 2026</div>
          <a className="scroll-cue" href="#work">SCROLL ↓</a>
        </section>

        <section className="section" id="work">
          <div className="section-head"><span>01</span><h2>Selected Work</h2><p>Environment art, modeling and animation.</p></div>
          <div className="work-grid">
            <motion.a href="#ancient-temple" whileHover={{ y: -8 }} className="work-card large">
              <img src={ancientTemple} alt="Ancient Temple environment" />
              <div><p>01 · Environment Modelling</p><h3>Ancient Temple</h3><span>Architecture · Lighting · Rendering</span></div>
            </motion.a>
            <motion.a href="#ancient-well" whileHover={{ y: -8 }} className="work-card">
              <img src={ancientWell} alt="Ancient Well modeling project" />
              <div><p>02 · Modelling</p><h3>Ancient Well</h3><span>Prop Modeling · Sculpting · Presentation</span></div>
            </motion.a>
            <motion.a href="#fight-sequence" whileHover={{ y: -8 }} className="work-card">
              <video src={fightSequence} autoPlay muted loop playsInline preload="metadata" />
              <div><p>03 · Character Animation</p><h3>Fight Sequence</h3><span>Body Mechanics · Acting · Timing</span></div>
            </motion.a>
          </div>
        </section>

        <section className="project-detail section" id="ancient-temple">
          <Reveal className="project-media landscape"><img src={ancientTemple} alt="Ancient Temple cinematic environment render" /></Reveal>
          <Reveal className="project-copy">
            <p className="eyebrow">01 · 3D ENVIRONMENT</p>
            <h2>Ancient<br /><em>Temple</em></h2>
            <p>A detailed temple environment focused on architectural modeling, carved surface detail, atmospheric lighting, composition and reflective water to create a cinematic interior space.</p>
            <div className="tag-row"><span>Environment Art</span><span>Modeling</span><span>Lighting</span><span>Rendering</span></div>
          </Reveal>
        </section>

        <section className="project-detail section" id="ancient-well">
          <Reveal className="well-gallery">
            {[ancientWell, ancientWell02, ancientWell03, ancientWell04].map((src, index) => <img key={src} src={src} alt={`Ancient Well view ${index + 1}`} loading="lazy" />)}
          </Reveal>
          <Reveal className="project-copy">
            <p className="eyebrow">02 · 3D MODELLING</p>
            <h2>Ancient<br /><em>Well</em></h2>
            <p>A stylized medieval-inspired well built as a modeling and sculpting study, with attention to layered wood construction, stonework, rope detail, roof shingles and pulley mechanics.</p>
            <div className="tag-row"><span>Modeling</span><span>Sculpting</span><span>Prop Design</span><span>Lighting</span></div>
          </Reveal>
        </section>

        <section className="project-detail section" id="fight-sequence">
          <Reveal className="project-media video-frame"><video src={fightSequence} controls playsInline preload="metadata" /></Reveal>
          <Reveal className="project-copy">
            <p className="eyebrow">03 · CHARACTER ANIMATION</p>
            <h2>Fight<br /><em>Sequence</em></h2>
            <p>A character animation centered on recovering after a heavy punch, with a fourth-wall moment added for personality and comedic timing. The shot focuses on body mechanics, weight, posing and readable performance.</p>
            <div className="tag-row"><span>Character Animation</span><span>Body Mechanics</span><span>Acting</span><span>Timing</span></div>
          </Reveal>
        </section>

        <section className="section projects" id="projects">
          <div className="section-head"><span>02</span><h2>Projects</h2><p>Browse by discipline.</p></div>
          <div className="discipline-list">
            {disciplines.map(([name, note, href], index) => (
              <motion.a
                key={name}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
              >
                <span>0{index + 1}</span><strong>{name}</strong><small>{note}</small><b>↗</b>
              </motion.a>
            ))}
          </div>
        </section>

        <section className="section about" id="about">
          <div className="section-head"><span>03</span><h2>About</h2><p>3D craft + motion background.</p></div>
          <div className="about-grid">
            <Reveal><p className="about-lead">I’m Parth Shah, a 3D Generalist and Motion Designer creating digital worlds through technical craft and visual storytelling.</p></Reveal>
            <Reveal className="about-copy">
              <p>My work spans 3D modeling, environment art, animation, texturing, lighting, rendering and compositing. I enjoy moving between the detail of an individual asset and the bigger picture of a complete visual sequence.</p>
              <p>Currently completing my Master’s in 3D Animation at DePaul University, I’m looking for opportunities across games, animation, motion design and creative technology.</p>
              <a className="text-link" href={resumeUrl} target="_blank" rel="noreferrer">View resume ↗</a>
            </Reveal>
          </div>
          <div className="tool-grid">{tools.map(tool => <span key={tool}>{tool}</span>)}</div>
        </section>

        <section className="section contact" id="contact">
          <div className="section-head"><span>04</span><h2>Let’s Work</h2><p>Roles · Projects · Collaboration</p></div>
          <Reveal>
            <p>Have a project, role, or collaboration in mind?</p>
            <a className="email" href="mailto:shahparth1003@gmail.com">shahparth1003@gmail.com ↗</a>
            <div className="socials">
              <a href="https://parth__shah.artstation.com/projects" target="_blank" rel="noreferrer">ArtStation ↗</a>
              <a href="https://www.linkedin.com/in/parth-shah-3d-animator" target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href={resumeUrl} target="_blank" rel="noreferrer">Resume ↗</a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer><span>© 2026 PARTH SHAH</span><span>3D GENERALIST · MOTION DESIGNER</span></footer>
    </div>
  );
}

export default App;
