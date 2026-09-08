import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { useRef } from "react";
import type { Mesh } from "three";

import ancientTemple from "../assets/Ancient Temple.jpg";
import ancientWell from "../assets/Ancient_Well.png";
import fightSequence from "../assets/Shah_Parth_Fight_Sequence.mp4";

const navItems = [
  ["Work", "#work"],
  ["Projects", "#projects"],
  ["About", "#about"],
  ["Contact", "#contact"],
];

function HeroObject() {
  const mesh = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.13;
    mesh.current.rotation.y += delta * 0.2;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.16;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.45} floatIntensity={0.4}>
      <mesh ref={mesh} castShadow>
        <icosahedronGeometry args={[1.9, 2]} />
        <meshStandardMaterial color="#d9ff4f" roughness={0.28} metalness={0.35} wireframe />
      </mesh>
    </Float>
  );
}

function HeroCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.6]}>
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 5, 4]} intensity={2.2} />
      <pointLight position={[-4, -2, 3]} intensity={1.4} />
      <HeroObject />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
    </Canvas>
  );
}

function App() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top">PARTH <span>SHAH</span></a>
        <nav className="nav-links">
          {navItems.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
          <a href="Parth_Shah_Resume_3D.pdf" target="_blank" rel="noreferrer">Resume</a>
          <a href="https://www.linkedin.com/in/parth-shah-3d-animator" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero3d">
          <div className="hero-copy">
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">3D GENERALIST · MOTION DESIGNER</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }}>
              BUILDING <em>WORLDS</em><br />IN 3D.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }} className="hero-description">
              Modeling, environment art, animation, lighting, rendering and motion — presented through an interactive 3D portfolio experience.
            </motion.p>
          </div>
          <div className="hero-canvas" aria-label="Interactive 3D artwork"><HeroCanvas /></div>
          <a className="scroll-cue" href="#work">SCROLL ↓</a>
        </section>

        <section className="section" id="work">
          <div className="section-head"><span>01</span><h2>Selected Work</h2></div>
          <div className="work-grid">
            <motion.article whileHover={{ y: -8 }} className="work-card large">
              <img src={ancientTemple} alt="Ancient Temple environment" />
              <div><p>Environment Modelling</p><h3>Ancient Temple</h3></div>
            </motion.article>
            <motion.article whileHover={{ y: -8 }} className="work-card">
              <img src={ancientWell} alt="Ancient Well modeling project" />
              <div><p>Modelling</p><h3>Ancient Well</h3></div>
            </motion.article>
            <motion.article whileHover={{ y: -8 }} className="work-card">
              <video src={fightSequence} autoPlay muted loop playsInline />
              <div><p>Character Animation</p><h3>Fight Sequence</h3></div>
            </motion.article>
          </div>
        </section>

        <section className="section" id="projects">
          <div className="section-head"><span>02</span><h2>Projects</h2></div>
          <div className="discipline-list">
            {["Modelling", "Environment Modelling", "Animation", "Character Animation", "Motion Graphics"].map((item, index) => (
              <motion.div key={item} initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .04 }}>
                <span>0{index + 1}</span><strong>{item}</strong><b>↗</b>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="section about" id="about">
          <div className="section-head"><span>03</span><h2>About</h2></div>
          <div className="about-grid">
            <p className="about-lead">I’m Parth Shah, a 3D Generalist and Motion Designer creating digital worlds through technical craft and visual storytelling.</p>
            <div>
              <p>My work spans 3D modeling, environment art, animation, texturing, lighting, rendering and compositing.</p>
              <p>Currently completing my Master’s in 3D Animation at DePaul University, I’m seeking opportunities across games, animation, motion design and creative technology.</p>
            </div>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="section-head"><span>04</span><h2>Contact</h2></div>
          <p>Have a project, role, or collaboration in mind?</p>
          <a className="email" href="mailto:shahparth1003@gmail.com">shahparth1003@gmail.com ↗</a>
          <div className="socials">
            <a href="https://parth__shah.artstation.com/projects" target="_blank" rel="noreferrer">ArtStation ↗</a>
            <a href="https://www.linkedin.com/in/parth-shah-3d-animator" target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href="Parth_Shah_Resume_3D.pdf" target="_blank" rel="noreferrer">Resume ↗</a>
          </div>
        </section>
      </main>

      <footer>© 2026 PARTH SHAH · 3D GENERALIST & MOTION DESIGNER</footer>
    </div>
  );
}

export default App;
