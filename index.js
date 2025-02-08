import * as THREE from "three";
import { positionLocal } from "three/tsl";
import getLayer from "./libs/getLayer.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const ctrls = new OrbitControls(camera, renderer.domElement);
ctrls.enableDamping = true;

const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 128, 32);

// const vsh = await fetch('./src/vert.glsl');
// const fsh = await fetch('./src/frag.glsl');

// const uniforms = {
//   time: { value: 0.0 },
//   resolution: { value: new THREE.Vector2( w, h )},
// };

const material = new THREE.MeshStandardNodeMaterial({
  // uniforms,
  // vertexShader: await vsh.text(),
  // fragmentShader: await fsh.text()
});
material.colorNode = positionLocal;
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(hemiLight);

// Sprites BG
const sprites = getLayer({
  hue: 0.6,
  numSprites: 8,
  opacity: 0.2,
  radius: 10,
  size: 24,
  z: -10.5,
});
scene.add(sprites);

function animate(t = 0) {
  t *= 0.001;
  requestAnimationFrame(animate);

  // uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height);
  // uniforms.time.value = t;
  renderer.renderAsync(scene, camera);
  ctrls.update();
}

animate();

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);