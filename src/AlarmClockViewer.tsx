import { Canvas } from "@react-three/fiber";
import { Bounds, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  DoubleSide,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from "three";

import alarmClockUrl from "../assets/Alarm_Clock/Alarm_Clock.glb?url";
import base1001 from "../assets/Alarm_Clock/web/BaseColor.1001.webp";
import base1002 from "../assets/Alarm_Clock/web/BaseColor.1002.webp";
import base1003 from "../assets/Alarm_Clock/web/BaseColor.1003.webp";
import rough1001 from "../assets/Alarm_Clock/web/Roughness.1001.webp";
import rough1002 from "../assets/Alarm_Clock/web/Roughness.1002.webp";
import rough1003 from "../assets/Alarm_Clock/web/Roughness.1003.webp";
import metal1001 from "../assets/Alarm_Clock/web/Metalness.1001.webp";
import metal1002 from "../assets/Alarm_Clock/web/Metalness.1002.webp";
import metal1003 from "../assets/Alarm_Clock/web/Metalness.1003.webp";
import normal1001 from "../assets/Alarm_Clock/web/Normal.1001.webp";
import normal1002 from "../assets/Alarm_Clock/web/Normal.1002.webp";
import normal1003 from "../assets/Alarm_Clock/web/Normal.1003.webp";
import dialUrl from "../assets/Alarm_Clock/web/Dial.png";
import "./model-viewer.css";

type Tile = 1001 | 1002 | 1003;

const tileByObject: Record<string, Tile> = {
  Body: 1001,
  Hand_Bolt: 1002,
  Hours: 1002,
  Minute: 1002,
  Seconds: 1002,
  Ring_Support: 1002,
  Back_Knob: 1003,
  Back_Panel: 1003,
  bell: 1003,
  Bell_Support: 1003,
  polySurface5: 1003,
  polySurface6: 1003,
  polySurface1: 1003,
  polySurface2: 1003,
  polySurface3: 1003,
  polySurface4: 1003,
  Hammer: 1003,
  polySurface9: 1003,
  Leg_left: 1003,
  Leg_Right: 1003,
};

function configureTexture(texture: Texture, colorTexture = false) {
  texture.flipY = false;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.anisotropy = 4;
  if (colorTexture) texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
}

function AlarmClockModel() {
  const { scene } = useGLTF(alarmClockUrl);
  const textures = useTexture({
    base1001,
    base1002,
    base1003,
    rough1001,
    rough1002,
    rough1003,
    metal1001,
    metal1002,
    metal1003,
    normal1001,
    normal1002,
    normal1003,
    dial: dialUrl,
  });

  const materials = useMemo(() => {
    configureTexture(textures.base1001, true);
    configureTexture(textures.base1002, true);
    configureTexture(textures.base1003, true);
    configureTexture(textures.dial, true);
    configureTexture(textures.rough1001);
    configureTexture(textures.rough1002);
    configureTexture(textures.rough1003);
    configureTexture(textures.metal1001);
    configureTexture(textures.metal1002);
    configureTexture(textures.metal1003);
    configureTexture(textures.normal1001);
    configureTexture(textures.normal1002);
    configureTexture(textures.normal1003);

    const tileTextures = {
      1001: { base: textures.base1001, rough: textures.rough1001, metal: textures.metal1001, normal: textures.normal1001 },
      1002: { base: textures.base1002, rough: textures.rough1002, metal: textures.metal1002, normal: textures.normal1002 },
      1003: { base: textures.base1003, rough: textures.rough1003, metal: textures.metal1003, normal: textures.normal1003 },
    } as const;

    const makeTileMaterial = (tile: Tile) => {
      const set = tileTextures[tile];
      return new MeshStandardMaterial({
        map: set.base,
        roughnessMap: set.rough,
        metalnessMap: set.metal,
        normalMap: set.normal,
        roughness: 1,
        metalness: 1,
        side: DoubleSide,
      });
    };

    return {
      1001: makeTileMaterial(1001),
      1002: makeTileMaterial(1002),
      1003: makeTileMaterial(1003),
      dial: new MeshStandardMaterial({
        map: textures.dial,
        roughness: 0.5,
        metalness: 0,
        side: DoubleSide,
      }),
      glass: new MeshPhysicalMaterial({
        color: "#f3f6f8",
        roughness: 0.07,
        metalness: 0,
        transmission: 1,
        ior: 1.45,
        thickness: 0.04,
        transparent: true,
        opacity: 0.38,
        side: DoubleSide,
      }),
    };
  }, [textures]);

  const model = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      const cleanName = child.name.replace(/\.\d+$/, "");
      const tile = tileByObject[cleanName];

      if (tile) {
        child.material = materials[tile];
        child.castShadow = true;
        child.receiveShadow = true;
        return;
      }

      if (cleanName === "Time_Space") {
        child.material = materials.dial;
        return;
      }

      if (cleanName === "Glass1") {
        child.material = materials.glass;
      }
    });

    return clone;
  }, [materials, scene]);

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
          <span>PBR textured · Drag to rotate · Scroll to zoom</span>
        </div>
        <div className="model-viewer-actions">
          <button type="button" onClick={() => setAutoRotate((value) => !value)} aria-pressed={autoRotate}>
            {autoRotate ? "Pause rotation" : "Auto rotate"}
          </button>
          <button type="button" onClick={() => setResetKey((value) => value + 1)}>Reset view</button>
        </div>
      </div>

      <div className="model-viewer-stage" aria-label="Interactive textured Alarm Clock 3D model">
        {hasEnteredView ? (
          <Canvas
            key={resetKey}
            camera={{ position: [4.5, 2.8, 5.5], fov: 35 }}
            dpr={[1, 1.5]}
            frameloop={isInView && autoRotate ? "always" : "demand"}
            gl={{ antialias: true, alpha: false }}
            shadows
          >
            <color attach="background" args={["#0d0f11"]} />
            <ambientLight intensity={0.75} />
            <hemisphereLight intensity={0.75} groundColor="#08090a" />
            <directionalLight position={[5, 7, 5]} intensity={3.4} castShadow />
            <directionalLight position={[-4, 3, -3]} intensity={1.6} />
            <pointLight position={[0, 2, 5]} intensity={1.6} />

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
          <div className="model-viewer-loading">3D model and textures load when this section enters view.</div>
        )}
      </div>
    </div>
  );
}
