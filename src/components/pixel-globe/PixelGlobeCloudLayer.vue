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
};

const CLOUD_COUNT = 22;
const PUSH_RADIUS = 90;
const PUSH_STRENGTH = 42;
const PUSH_DECAY = 0.09;

const clouds = ref<Cloud[]>([]);
const pointerX = ref<number | null>(null);
const pointerY = ref<number | null>(null);
let frameId: number | null = null;
let lastTime = 0;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function initClouds() {
  const items: Cloud[] = [];
  for (let i = 0; i < CLOUD_COUNT; i++) {
    const spriteIdx = Math.floor(Math.random() * CLOUD_SPRITES.length);
    const sprite = CLOUD_SPRITES[spriteIdx];
    const pxSize = Math.round(rand(2.4, 4.8));
    const alpha = rand(0.35, 0.65);
    const cols = sprite[0].length;
    const rows = sprite.length;

    items.push({
      id: i,
      lon: rand(-180, 180),
      lat: rand(-55, 55),
      speed: rand(1, 3),
      sprite: bakeSprite(sprite, pxSize, alpha),
      spriteW: cols * pxSize,
      spriteH: rows * pxSize,
      baseOpacity: alpha,
      pushX: 0,
      pushY: 0,
      screenX: 0,
      screenY: 0,
      screenDepth: 0,
      screenScale: 1,
      visible: false,
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
    c.screenScale = 0.5 + proj.depth * 0.5;

    // cursor repulsion
    if (px !== null && py !== null) {
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
  if (!c.visible) return { display: "none" };

  const x = c.screenX + c.pushX - (c.spriteW * c.screenScale) / 2;
  const y = c.screenY + c.pushY - (c.spriteH * c.screenScale) / 2;

  return {
    transform: `translate(${x}px, ${y}px) scale(${c.screenScale.toFixed(3)})`,
    opacity: (c.baseOpacity * c.screenDepth).toFixed(3),
    width: `${c.spriteW}px`,
    height: `${c.spriteH}px`,
    backgroundImage: `url(${c.sprite})`,
  };
}
</script>

<template>
  <div class="cloud-layer" aria-hidden="true">
    <div
      v-for="c in clouds"
      :key="c.id"
      class="cloud-sprite"
      :style="cloudStyle(c)"
    />
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
  will-change: transform, opacity;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  transform-origin: center center;
}
</style>
