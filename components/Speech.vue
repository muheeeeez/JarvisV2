<template>
  <client-only>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button default-href="/"></ion-back-button>
      </ion-buttons>
      <ion-button @click="playAudio">Play Audio and Lip sync</ion-button>
      <ion-button @click="toggleChat" slot="end">Chat Now</ion-button>
    </ion-toolbar>
    <ion-page class="page">
      <div class="progress-bar-container" ref="progressBarContainer">
        <label for="progress-bar">Loading...</label>
        <progress id="progress-bar" value="0" max="100"></progress>
      </div>
      <div>
        <div class="scene-container">
          <canvas ref="experience"></canvas>
        </div>
      </div>
      <transition name="slide-up">
        <Text v-if="showChat" @close="toggleChat" />
      </transition>
    </ion-page>
  </client-only>
</template>
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
import Text from "./Text.vue";
import { useMicrophone } from "../utils/microphone";
const { stopRecording, startRecording } = useMicrophone();

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
const showChat = ref(false);
function toggleChat() {
  showChat.value = !showChat.value;
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
  // startRecording();
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

<style scoped>
.scene-container {
  width: 100%;
  height: 100vh;
}
.scene-container canvas {
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
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
}
</style>
