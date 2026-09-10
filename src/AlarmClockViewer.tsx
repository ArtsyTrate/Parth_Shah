import { Canvas } from "@react-three/fiber";
import { Bounds, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

import alarmClockUrl from "../assets/Alarm_Clock/Alarm_Clock.glb?url";
import "./model-viewer.css";

function AlarmClockModel() {
  const { scene } = useGLTF(alarmClockUrl);
  const model = useMemo(() => scene.clone(true), [scene]);

  return <primitive object={model} />;
}

export default function AlarmClockViewer() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0.08;
        setIsInView(visible);
        if (entry.isIntersecting) setHasEnteredView(true);
      },
      { threshold: [0, 0.08, 0.3], rootMargin: "220px 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="model-viewer" ref={rootRef}>
      <div className="model-viewer-bar">
        <div>
          <strong>Interactive 3D</strong>
          <span>Drag to rotate · Scroll to zoom</span>
        </div>
        <div className="model-viewer-actions">
          <button type="button" onClick={() => setAutoRotate((value) => !value)} aria-pressed={autoRotate}>
            {autoRotate ? "Pause rotation" : "Auto rotate"}
          </button>
          <button type="button" onClick={() => setResetKey((value) => value + 1)}>Reset view</button>
        </div>
      </div>

      <div className="model-viewer-stage" aria-label="Interactive Alarm Clock 3D model">
        {hasEnteredView ? (
          <Canvas
            key={resetKey}
            camera={{ position: [4.5, 2.8, 5.5], fov: 35 }}
            dpr={[1, 1.5]}
            frameloop={isInView && autoRotate ? "always" : "demand"}
            gl={{ antialias: true, alpha: false }}
          >
            <color attach="background" args={["#0d0f11"]} />
            <ambientLight intensity={1.15} />
            <hemisphereLight intensity={1.1} groundColor="#08090a" />
            <directionalLight position={[5, 7, 5]} intensity={3.1} />
            <directionalLight position={[-4, 3, -3]} intensity={1.35} />
            <pointLight position={[0, 2, 5]} intensity={1.4} />

            <Suspense fallback={null}>
              <Bounds fit clip observe margin={1.25}>
                <AlarmClockModel />
              </Bounds>
            </Suspense>

            <OrbitControls
              makeDefault
              autoRotate={autoRotate && isInView}
              autoRotateSpeed={0.75}
              enablePan={false}
              enableDamping
              dampingFactor={0.06}
              minDistance={1}
              maxDistance={12}
              minPolarAngle={0.2}
              maxPolarAngle={Math.PI / 1.72}
            />
          </Canvas>
        ) : (
          <div className="model-viewer-loading">3D model loads when this section enters view.</div>
        )}
      </div>
    </div>
  );
}
