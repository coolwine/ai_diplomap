<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{
  viewport: { width: number; height: number };
  globeRadius: number;
  centerLon: number;
  centerLat: number;
}>();

/* ------------------------------------------------------------------ */
/*  Pixel-art cloud sprite generator                                   */
/* ------------------------------------------------------------------ */

// Each sprite is a 2D grid: 1 = filled, 0 = empty.
// Designed to look like classic pixel-art clouds.
const CLOUD_SPRITES: number[][][] = [
  // ── small puffy (7x4) ──
  [
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
  ],
  // ── wide flat (10x4) ──
  [
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // ── tall bumpy (9x5) ──
  [
    [0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
  ],
  // ── tiny (5x3) ──
  [
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
  ],
  // ── large fluffy (12x6) ──
  [
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  ],
];

/** Render a sprite to a tiny canvas and return its data URL */
function bakeSprite(sprite: number[][], pixelSize: number, alpha: number): string {
  const rows = sprite.length;
  const cols = sprite[0].length;
  const w = cols * pixelSize;
  const h = rows * pixelSize;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!sprite[r][c]) continue;

      // Edges are slightly dimmer to give depth
      const isEdge =
        r === 0 ||
        r === rows - 1 ||
        c === 0 ||
        c === cols - 1 ||
        !sprite[r - 1]?.[c] ||
        !sprite[r + 1]?.[c] ||
        !sprite[r][c - 1] ||
        !sprite[r][c + 1];

      const isTop = r === 0 || !sprite[r - 1]?.[c];
      const brightness = isTop ? 255 : isEdge ? 230 : 245;
      const a = isEdge ? alpha * 0.75 : alpha;

      ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${a})`;
      ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
    }
  }
  return canvas.toDataURL();
}

/* ------------------------------------------------------------------ */
/*  Cloud state                                                        */
/* ------------------------------------------------------------------ */

type Cloud = {
  id: number;
  lon: number;
  lat: number;
  speed: number;
  /** pre-baked sprite data URL */
  sprite: string;
  spriteW: number;
  spriteH: number;
  baseOpacity: number;
  pushX: number;
  pushY: number;
  /** projected screen position (updated each frame) */
  screenX: number;
  screenY: number;
  screenDepth: number;
  screenScale: number;
  visible: boolean;
  dissipating: boolean;
  dissipateStart: number;
  dissipateDuration: number;
  gone: boolean;
  particles: SmokeParticle[];
};

type SmokeParticle = {
  id: number;
  size: number;
  originX: number;
  originY: number;
  driftX: number;
  driftY: number;
  scaleBoost: number;
  maxOpacity: number;
  delay: number;
};

const CLOUD_COUNT = 22;
const PUSH_RADIUS = 90;
const PUSH_STRENGTH = 42;
const PUSH_DECAY = 0.09;
const DISSIPATE_DURATION_MS = 1050;

const clouds = ref<Cloud[]>([]);
const pointerX = ref<number | null>(null);
const pointerY = ref<number | null>(null);
let frameId: number | null = null;
let lastTime = 0;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createSmokeParticles(spriteW: number, spriteH: number) {
  const particleCount = Math.round(rand(6, 10));
  const particles: SmokeParticle[] = [];

  for (let index = 0; index < particleCount; index += 1) {
    const size = rand(spriteH * 0.3, spriteH * 0.62);
    particles.push({
      id: index,
      size,
      originX: rand(spriteW * 0.12, spriteW * 0.88 - size),
      originY: rand(spriteH * 0.08, spriteH * 0.72 - size * 0.4),
      driftX: rand(-spriteW * 0.9, spriteW * 0.9),
      driftY: rand(-spriteH * 1.3, spriteH * 0.4),
      scaleBoost: rand(0.35, 1.05),
      maxOpacity: rand(0.3, 0.58),
      delay: rand(0, 0.2),
    });
  }

  return particles;
}

function initClouds() {
  const items: Cloud[] = [];
  for (let i = 0; i < CLOUD_COUNT; i++) {
    const spriteIdx = Math.floor(Math.random() * CLOUD_SPRITES.length);
    const sprite = CLOUD_SPRITES[spriteIdx];
    const pxSize = Math.round(rand(4, 7));
    const alpha = rand(0.35, 0.65);
    const cols = sprite[0].length;
    const rows = sprite.length;
    const spriteW = cols * pxSize;
    const spriteH = rows * pxSize;

    items.push({
      id: i,
      lon: rand(-180, 180),
      lat: rand(-55, 55),
      speed: rand(1, 3),
      sprite: bakeSprite(sprite, pxSize, alpha),
      spriteW,
      spriteH,
      baseOpacity: alpha,
      pushX: 0,
      pushY: 0,
      screenX: 0,
      screenY: 0,
      screenDepth: 0,
      screenScale: 1,
      visible: false,
      dissipating: false,
      dissipateStart: 0,
      dissipateDuration: DISSIPATE_DURATION_MS,
      gone: false,
      particles: createSmokeParticles(spriteW, spriteH),
    });
  }
  clouds.value = items;
}

/* ------------------------------------------------------------------ */
/*  Projection                                                         */
/* ------------------------------------------------------------------ */

function deg2rad(v: number) {
  return (v * Math.PI) / 180;
}

function project(lon: number, lat: number) {
  const latR = deg2rad(lat);
  const lonR = deg2rad(lon);
  const cLatR = deg2rad(props.centerLat);
  const cLonR = deg2rad(props.centerLon);
  const dLon = lonR - cLonR;

  const cosLat = Math.cos(latR);
  const sinLat = Math.sin(latR);
  const cosCLat = Math.cos(cLatR);
  const sinCLat = Math.sin(cLatR);
  const cosDLon = Math.cos(dLon);

  const vis = sinCLat * sinLat + cosCLat * cosLat * cosDLon;
  if (vis <= 0.02) return null;

  const r = props.globeRadius * 1.04;
  const x = r * cosLat * Math.sin(dLon);
  const y = r * (cosCLat * sinLat - sinCLat * cosLat * cosDLon);

  return {
    x: props.viewport.width / 2 + x,
    y: props.viewport.height / 2 - y,
    depth: vis,
  };
}

/* ------------------------------------------------------------------ */
/*  Animation loop                                                     */
/* ------------------------------------------------------------------ */

function tick(now: number) {
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 0.016;
  lastTime = now;

  const items = clouds.value;
  const px = pointerX.value;
  const py = pointerY.value;

  for (const c of items) {
    if (c.gone) {
      c.visible = false;
      continue;
    }

    c.lon += c.speed * dt;
    if (c.lon > 180) c.lon -= 360;
    if (c.lon < -180) c.lon += 360;

    const proj = project(c.lon, c.lat);
    if (!proj) {
      c.visible = false;
      continue;
    }

    c.visible = true;
    c.screenX = proj.x;
    c.screenY = proj.y;
    c.screenDepth = proj.depth;
    c.screenScale = 0.68 + proj.depth * 0.68;

    if (c.dissipating && now - c.dissipateStart >= c.dissipateDuration) {
      c.gone = true;
      c.visible = false;
      continue;
    }

    // cursor repulsion
    if (!c.dissipating && px !== null && py !== null) {
      const dx = c.screenX + c.pushX - px;
      const dy = c.screenY + c.pushY - py;
      const dist = Math.hypot(dx, dy);
      if (dist < PUSH_RADIUS && dist > 0.5) {
        const force = ((PUSH_RADIUS - dist) / PUSH_RADIUS) * PUSH_STRENGTH * dt * 8;
        c.pushX += (dx / dist) * force;
        c.pushY += (dy / dist) * force;
      }
    }

    c.pushX *= 1 - PUSH_DECAY;
    c.pushY *= 1 - PUSH_DECAY;
  }

  frameId = requestAnimationFrame(tick);
}

/* ------------------------------------------------------------------ */
/*  Pointer tracking                                                   */
/* ------------------------------------------------------------------ */

function onPointerMove(e: PointerEvent) {
  pointerX.value = e.clientX;
  pointerY.value = e.clientY;
}
function onPointerLeave() {
  pointerX.value = null;
  pointerY.value = null;
}

function dissipateCloud(cloud: Cloud) {
  if (cloud.gone || cloud.dissipating) {
    return;
  }

  cloud.dissipating = true;
  cloud.dissipateStart = performance.now();
  cloud.pushX *= 0.35;
  cloud.pushY *= 0.35;
}

onMounted(() => {
  initClouds();
  frameId = requestAnimationFrame(tick);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerleave", onPointerLeave);
});

onBeforeUnmount(() => {
  if (frameId !== null) cancelAnimationFrame(frameId);
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerleave", onPointerLeave);
});

/* ------------------------------------------------------------------ */
/*  Style helper                                                       */
/* ------------------------------------------------------------------ */

function cloudStyle(c: Cloud): Record<string, string> {
  if (!c.visible || c.gone) return { display: "none" };

  const progress = getDissipateProgress(c);
  const scale = c.screenScale * (1 + progress * 0.14);

  const x = c.screenX + c.pushX - (c.spriteW * scale) / 2;
  const y = c.screenY + c.pushY - (c.spriteH * scale) / 2 - progress * 8;

  return {
    transform: `translate(${x}px, ${y}px) scale(${scale.toFixed(3)})`,
    width: `${c.spriteW}px`,
    height: `${c.spriteH}px`,
  };
}

function getDissipateProgress(cloud: Cloud) {
  if (!cloud.dissipating) {
    return 0;
  }

  return Math.min((performance.now() - cloud.dissipateStart) / cloud.dissipateDuration, 1);
}

function cloudBodyStyle(c: Cloud): Record<string, string> {
  const progress = getDissipateProgress(c);

  return {
    backgroundImage: `url(${c.sprite})`,
    opacity: (c.baseOpacity * c.screenDepth * (1 - progress)).toFixed(3),
    filter: `blur(${(progress * 3.5).toFixed(2)}px)`,
  };
}

function smokeParticleStyle(c: Cloud, particle: SmokeParticle): Record<string, string> {
  const progress = getDissipateProgress(c);
  const localProgress = Math.max(0, Math.min((progress - particle.delay) / (1 - particle.delay), 1));
  const opacity = c.baseOpacity * c.screenDepth * particle.maxOpacity * (1 - localProgress);

  return {
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    left: `${particle.originX}px`,
    top: `${particle.originY}px`,
    opacity: opacity.toFixed(3),
    transform: `translate(${(particle.driftX * localProgress).toFixed(2)}px, ${(particle.driftY * localProgress).toFixed(2)}px) scale(${(1 + particle.scaleBoost * localProgress).toFixed(3)})`,
    filter: `blur(${(0.8 + localProgress * 4.4).toFixed(2)}px)`,
  };
}
</script>

<template>
  <div class="cloud-layer" aria-hidden="true">
    <div
      v-for="c in clouds"
      :key="c.id"
      class="cloud-sprite"
      :class="{ 'cloud-sprite--dissipating': c.dissipating }"
      :style="cloudStyle(c)"
      @click.stop="dissipateCloud(c)"
      @pointerdown.stop
    >
      <div class="cloud-sprite__body" :style="cloudBodyStyle(c)" />
      <div v-if="c.dissipating" class="cloud-sprite__smoke">
        <span
          v-for="particle in c.particles"
          :key="particle.id"
          class="cloud-sprite__particle"
          :style="smokeParticleStyle(c, particle)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cloud-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.cloud-sprite {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: auto;
  cursor: pointer;
  will-change: transform, opacity;
  transform-origin: center center;
  user-select: none;
}

.cloud-sprite__body,
.cloud-sprite__smoke,
.cloud-sprite__particle {
  position: absolute;
  inset: 0;
}

.cloud-sprite__body {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  transform-origin: center center;
}

.cloud-sprite__smoke {
  pointer-events: none;
}

.cloud-sprite__particle {
  inset: auto;
  border-radius: 999px;
  background:
    radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.8), rgba(240, 246, 255, 0.34) 52%, rgba(227, 235, 248, 0) 100%);
  mix-blend-mode: screen;
  will-change: transform, opacity, filter;
}

.cloud-sprite--dissipating {
  cursor: default;
}
</style>
