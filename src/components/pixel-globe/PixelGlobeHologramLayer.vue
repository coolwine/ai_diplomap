<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { LEADERS } from "../../data/leaders";

const props = defineProps<{
  selectedCountryName: string | null;
  x: number;
  y: number;
  visible: boolean;
}>();

const show = ref(false);
const imageLoaded = ref(false);

const leaderImage = computed(() => {
  if (!props.selectedCountryName) return null;
  return LEADERS[props.selectedCountryName]?.image ?? null;
});

watch(
  () => props.selectedCountryName,
  (name) => {
    show.value = false;
    imageLoaded.value = false;
    if (name && LEADERS[name]) {
      show.value = true;
    }
  },
);

function onImageLoad() {
  imageLoaded.value = true;
}
</script>

<template>
  <div
    v-if="show && leaderImage && visible"
    class="hologram-container"
    :class="{ 'is-loaded': imageLoaded }"
    :style="{
      left: `${x}px`,
      top: `${y}px`,
    }"
  >
    <div class="hologram-body">
      <div class="hologram-glow" />
      <div class="hologram-image-wrapper">
        <img
          :src="leaderImage"
          class="hologram-image"
          alt="Leader"
          @load="onImageLoad"
        >
      </div>
      <div class="hologram-scanlines" />
      <div class="hologram-flicker" />
      <div class="hologram-edge" />
    </div>
    <div class="hologram-beam">
      <div class="hologram-beam-inner" />
    </div>
  </div>
</template>

<style scoped>
.hologram-container {
  position: absolute;
  transform: translate(-50%, -100%);
  pointer-events: none;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.hologram-container.is-loaded {
  opacity: 1;
  animation: hologram-appear 0.8s ease-out;
}

.hologram-body {
  position: relative;
  animation: hologram-float 3s ease-in-out infinite;
}

.hologram-glow {
  position: absolute;
  inset: -8px;
  border-radius: 10px;
  background: radial-gradient(ellipse at center, rgba(0, 255, 255, 0.15), transparent 70%);
  filter: blur(8px);
  animation: glow-pulse 2.5s ease-in-out infinite;
}

.hologram-image-wrapper {
  position: relative;
  width: 90px;
  height: 120px;
  overflow: hidden;
  border-radius: 6px;
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    white 6%,
    white 88%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    white 6%,
    white 88%,
    transparent 100%
  );
}

.hologram-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  filter: brightness(1.4) contrast(1.2) saturate(0.15) sepia(0.3) hue-rotate(160deg) drop-shadow(0 0 4px rgba(0, 255, 255, 0.5));
  opacity: 0.85;
}

.hologram-scanlines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 255, 255, 0.06) 2px,
    rgba(0, 255, 255, 0.06) 4px
  );
  pointer-events: none;
  border-radius: 6px;
  animation: scanline-scroll 8s linear infinite;
}

.hologram-flicker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 255, 255, 0.08) 0%,
    transparent 40%,
    transparent 60%,
    rgba(0, 255, 255, 0.05) 100%
  );
  animation: hologram-flicker 3s ease-in-out infinite;
  pointer-events: none;
  border-radius: 6px;
}

.hologram-edge {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 6px;
  box-shadow:
    inset 0 0 12px rgba(0, 255, 255, 0.08),
    0 0 12px rgba(0, 255, 255, 0.12);
}

.hologram-beam {
  width: 50px;
  height: 20px;
  display: flex;
  justify-content: center;
  position: relative;
  margin-top: -2px;
}

.hologram-beam-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 255, 255, 0.18),
    rgba(0, 255, 255, 0.02)
  );
  clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
  filter: blur(3px);
  animation: beam-pulse 2s ease-in-out infinite;
}

@keyframes hologram-appear {
  0% {
    opacity: 0;
    transform: translate(-50%, -90%) scaleY(0.3);
    filter: brightness(3) blur(4px);
  }
  50% {
    filter: brightness(1.5) blur(1px);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -100%) scaleY(1);
    filter: brightness(1) blur(0);
  }
}

@keyframes hologram-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes hologram-flicker {
  0%, 100% {
    opacity: 0.4;
  }
  15% {
    opacity: 0.1;
  }
  30% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.2;
  }
  70% {
    opacity: 0.5;
  }
  85% {
    opacity: 0.15;
  }
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes scanline-scroll {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100px;
  }
}

@keyframes beam-pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scaleX(1);
  }
  50% {
    opacity: 1;
    transform: scaleX(1.2);
  }
}
</style>
