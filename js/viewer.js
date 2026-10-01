import * as THREE from "three";

const stage = document.getElementById("stage");
const canvas = document.getElementById("viewer");

if (stage && canvas) init();

async function init() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (err) {
    stage.classList.add("no-webgl");
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 0.8, 0.1, 50);
  camera.position.set(0, 0.2, 9.4);

  scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x2e376b, 1.1));
  const key = new THREE.DirectionalLight(0xfff1d6, 2.4);
  key.position.set(4, 6, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8fa2ff, 1.5);
  rim.position.set(-5, 2, -4);
  scene.add(rim);

  /* One material per viewport mode. "Shaded" uses each mesh's own material. */
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xcfd7f0,
    wireframe: true,
    transparent: true,
    opacity: 0.85
  });
  const clayMaterial = new THREE.MeshStandardMaterial({ color: 0x9aa6d4, roughness: 1, metalness: 0 });
  const marbleMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf1f3fb,
    roughness: 0.35,
    metalness: 0.05,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25
  });

  const pivot = new THREE.Group();
  scene.add(pivot);

  const modelUrl = window.SITE && window.SITE.modelUrl;
  let subject = null;

  if (modelUrl) {
    try {
      const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
      const gltf = await new GLTFLoader().loadAsync(modelUrl);
      subject = gltf.scene;
      const box = new THREE.Box3().setFromObject(subject);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const scale = 3.6 / Math.max(size.x, size.y, size.z);
      subject.scale.setScalar(scale);
      subject.position.sub(center.multiplyScalar(scale));

      /* Imported models are usually PBR, so give them a soft studio environment to reflect. */
      try {
        const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      } catch (envErr) {
        console.warn("Could not create the studio environment.", envErr);
      }
    } catch (err) {
      console.warn("Could not load model, showing the sample column instead.", err);
      subject = null;
    }
  }

  if (!subject) subject = buildColumn(marbleMaterial);
  pivot.add(subject);

  /* ---------- Viewport modes ---------- */

  const buttons = Array.from(stage.querySelectorAll("[data-mode]"));
  let introTimers = [];

  function setMode(mode) {
    scene.overrideMaterial = mode === "wire" ? wireMaterial : mode === "clay" ? clayMaterial : null;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
  }

  function cancelIntro() {
    introTimers.forEach(clearTimeout);
    introTimers = [];
  }

  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      cancelIntro();
      setMode(b.dataset.mode);
    })
  );

  /* The page opens on the bare mesh, then builds up to the finished look. */
  if (reduceMotion) {
    setMode("shaded");
  } else {
    setMode("wire");
    introTimers.push(setTimeout(() => setMode("clay"), 1700));
    introTimers.push(setTimeout(() => setMode("shaded"), 3300));
  }

  /* ---------- Rotation: drag, inertia, keyboard, idle spin ---------- */

  let rotY = -0.5;
  let rotX = 0.12;
  let velY = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    cancelIntro();
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    velY = dx * 0.008;
    rotY += velY;
    rotX = Math.max(-0.6, Math.min(0.6, rotX + dy * 0.005));
  });
  const endDrag = () => {
    dragging = false;
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  canvas.addEventListener("keydown", (e) => {
    const handled = { ArrowLeft: [-0.2, 0], ArrowRight: [0.2, 0], ArrowUp: [0, -0.1], ArrowDown: [0, 0.1] }[e.key];
    if (!handled) return;
    e.preventDefault();
    rotY += handled[0];
    rotX = Math.max(-0.6, Math.min(0.6, rotX + handled[1]));
  });

  /* ---------- Sizing and render loop ---------- */

  function resize() {
    const { clientWidth: w, clientHeight: h } = stage;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  let onScreen = true;
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
  }).observe(stage);

  let last = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    if (!onScreen || document.hidden) {
      last = now;
      return;
    }
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if (!dragging) {
      velY *= 0.94;
      rotY += velY;
      if (!reduceMotion) rotY += 0.35 * dt;
    }
    pivot.rotation.set(rotX, rotY, 0);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}

/* A classical column, built from a few primitives so the mesh reads clearly in wireframe. */
function buildColumn(material) {
  const group = new THREE.Group();
  const add = (geometry, y) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = y;
    group.add(mesh);
  };

  add(new THREE.BoxGeometry(1.7, 0.28, 1.7, 3, 1, 3), -1.5);
  add(new THREE.CylinderGeometry(0.78, 0.82, 0.22, 24, 1), -1.25);
  add(new THREE.TorusGeometry(0.6, 0.09, 10, 28).rotateX(Math.PI / 2), -1.08);
  add(new THREE.CylinderGeometry(0.46, 0.56, 2.5, 20, 14), 0.1);
  add(new THREE.TorusGeometry(0.46, 0.08, 10, 28).rotateX(Math.PI / 2), 1.38);
  add(new THREE.CylinderGeometry(0.78, 0.5, 0.4, 24, 2), 1.62);
  add(new THREE.BoxGeometry(1.6, 0.22, 1.6, 3, 1, 3), 1.93);

  group.position.y = -0.2;
  return group;
}
