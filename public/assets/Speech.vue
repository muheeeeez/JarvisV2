<template>
  <client-only>
    <ion-page class="page">
      <!-- Container for the canvas and the overlayed button -->
      <div class="scene-container">
        <!-- Your Three.js canvas -->
        <canvas ref="experience"></canvas>

        <!-- Overlay Button -->
        <button class="overlay-button" @click="playAudio">
          Play Audio and Lip Sync
        </button>
      </div>

      <!-- You can include additional buttons or elements below if needed -->
      <ion-button @click="updateChat">Chat Now</ion-button>
    </ion-page>
  </client-only>
</template>

<!-- <style scoped>

.page {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}
/* ion-card {
  height: 200px;
  width: 200px;
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
} */
ion-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 65vw;
  margin: 0 auto;
}
.container {
  display: flex;
  flex-direction: column;
  gap: 150px;
}
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
.progress-bar-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
#progress-bar {
  width: 30%;
  margin-top: 1rem;
  height: 1rem;
}
label {
  color: white;
  font-size: 1.5rem;
}
button {
  margin: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}
button:hover {
  background-color: #0056b3;
}
</style> -->
<style scoped>
/* Ensure the container is positioned relative so that the absolute positioning of the button is relative to this container */
.scene-container {
  position: relative;
  width: 100%;
  height: 100vh; /* or another height that suits your layout */
}

/* Style for your canvas; ensure it fills the container */
.scene-container canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* The overlay button styles */
.overlay-button {
  position: absolute;
  top: 20px; /* Adjust the position as needed */
  right: 20px; /* Adjust the position as needed */
  z-index: 10; /* Ensure it sits above the canvas */
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

.overlay-button:hover {
  background-color: #0056b3;
}
</style>
<script setup lang="ts">
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  AmbientLight,
  DirectionalLight,
  Object3D,
  AnimationMixer,
  Clock,
  FileLoader,
} from "three";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { ref, computed, onMounted, nextTick } from "vue";
import { useWindowSize } from "@vueuse/core";
import { defineEmits } from "vue";
type VisemeKey = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "X";

interface MouthCue {
  start: number;
  end: number;
  value: VisemeKey;
}
interface LipSyncData {
  metadata: {
    soundFile: string;
    duration: number;
  };
  mouthCues: MouthCue[];
}
const corresponding: Record<VisemeKey, string> = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};
interface MyGLTF {
  scene: THREE.Group;
  scenes: THREE.Group[];
  animations: THREE.AnimationClip[];
  cameras: THREE.Camera[];
}
let renderer: WebGLRenderer | null = null;
let controls: OrbitControls | null = null;
let mixer: AnimationMixer | null = null;
let loadedModel: Object3D | null = null;
const clock = new Clock();
const experience = ref<HTMLCanvasElement | null>(null);
const progressBarContainer = ref<HTMLDivElement | null>(null);
const { width, height } = useWindowSize();
const aspectRatio = computed(() => width.value / height.value);
const scene = new Scene();
const textureLoader = new TextureLoader();
const backgroundTexture = textureLoader.load("assets/images/office.jpg");
scene.background = backgroundTexture;
const ambientLight = new AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
const animations: Record<string, THREE.AnimationAction> = {};
const loadingManager = new THREE.LoadingManager();
const emit = defineEmits(["toggle-false"]);
function updateChat() {
  emit("toggle-false");
}

function loadAnimation(name: string, path: string) {
  const fbxLoader = new FBXLoader(loadingManager);
  fbxLoader.load(path, (fbx) => {
    const action = mixer!.clipAction(fbx.animations[0]);
    animations[name] = action;
    if (name === "standing") {
      action.play();
    }
  });
}
function triggerAnimation(name: string) {
  if (animations[name]) {
    Object.values(animations).forEach((action) => action.stop());
    animations[name].reset().play();
  } else {
    console.warn(`Animation '${name}' not found.`);
  }
}
let lipsyncDataRef: LipSyncData | null = null;
let currentAudio: HTMLAudioElement | null = null;
let isLipsyncActive = false;
function playAudio() {
  const fileLoader = new FileLoader();
  fileLoader.load("assets/audio/test.json", (json) => {
    if (typeof json !== "string") {
      console.error("Failed to parse JSON: Data is not a string");
      return;
    }
    lipsyncDataRef = JSON.parse(json);
    currentAudio = new Audio("assets/audio/test.mp3");
    isLipsyncActive = true;
    triggerAnimation("talking");
    currentAudio.play().catch((err) => {
      console.error("Audio play error:", err);
    });
    currentAudio.addEventListener("ended", () => {
      isLipsyncActive = false;
      resetAllMorphTargets();
      triggerAnimation("standing");
    });
  });
}
function updateLipsync() {
  if (!isLipsyncActive || !lipsyncDataRef || !currentAudio || !loadedModel) {
    return;
  }
  const currentTime = currentAudio.currentTime;
  const activeCue = lipsyncDataRef.mouthCues.find(
    (cue) => currentTime >= cue.start && currentTime <= cue.end
  );
  resetAllMorphTargets();
  if (activeCue) {
    const morphTargetName = corresponding[activeCue.value];
    loadedModel.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
          const index = mesh.morphTargetDictionary[morphTargetName];
          if (index !== undefined) {
            mesh.morphTargetInfluences[index] = 1;
          }
        }
      }
    });
  }
}
function resetAllMorphTargets() {
  if (!loadedModel) return;
  const allMorphTargets = Object.values(corresponding);
  loadedModel.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
        for (const morphTargetName of allMorphTargets) {
          const idx = mesh.morphTargetDictionary[morphTargetName];
          if (idx !== undefined) {
            mesh.morphTargetInfluences[idx] = 0;
          }
        }
      }
    }
  });
}
onMounted(async () => {
  await nextTick();
  const progressBar = document.getElementById(
    "progress-bar"
  ) as HTMLProgressElement;
  progressBarContainer.value = document.querySelector(
    ".progress-bar-container"
  ) as HTMLDivElement;
  if (!progressBar || !progressBarContainer.value) {
    console.error("Progress bar or container not found.");
    return;
  }
  loadingManager.onProgress = (url, loaded, total) => {
    console.log(`Loading: ${url} (${loaded}/${total})`);
    progressBar.value = (loaded / total) * 100;
  };
  loadingManager.onLoad = () => {
    console.log("All resources loaded.");
    progressBarContainer.value!.style.display = "none";
    triggerAnimation("waving");
    setTimeout(() => {
      console.log("Stopping waving animation...");
      triggerAnimation("standing");
    }, 3000);
  };
  const gltfLoader = new GLTFLoader(loadingManager);
  gltfLoader.load(
    "assets/images/man.glb",
    (gltf: MyGLTF) => {
      loadedModel = gltf.scene;
      loadedModel.position.set(0, -0.7, 1.5);
      loadedModel.scale.set(1, 1, 1);
      scene.add(loadedModel);
      mixer = new AnimationMixer(loadedModel);
      loadAnimation("standing", "assets/animations/Standing Idle.fbx");
      loadAnimation("waving", "assets/animations/Waving.fbx");
      loadAnimation("thinking", "assets/animations/Thinking.fbx");
      loadAnimation("talking", "assets/animations/Talking.fbx");
      loadAnimation("thankful", "assets/animations/Thankful.fbx");
    },
    undefined,
    (err: unknown) => {
      console.error("Error loading GLTF model:" + err);
    }
  );
  const camera = new PerspectiveCamera(75, aspectRatio.value, 0.1, 1000);
  camera.position.set(0.1, 1, 3);
  camera.lookAt(0, 0, 0);
  scene.add(camera);
  function setRenderer() {
    if (experience.value) {
      renderer = new WebGLRenderer({
        canvas: experience.value,
        antialias: true,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width.value, height.value);
      controls = new OrbitControls(camera, renderer.domElement);
    }
  }
  function loop() {
    if (controls) controls.update();
    if (mixer) mixer.update(clock.getDelta());
    updateLipsync();
    if (renderer) renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  setRenderer();
  if (renderer) loop();
});
</script>
