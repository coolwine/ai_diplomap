<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  progress: number;
  visible: boolean;
}>();

const LOADING_STAGES = [
  { max: 0.18, label: "SITE SYSTEMS" },
  { max: 0.44, label: "RELATION MATRIX" },
  { max: 0.74, label: "WORLD DATA" },
  { max: 0.94, label: "PIXEL RASTER" },
  { max: 1, label: "READY" },
] as const;

const normalizedProgress = computed(() => Math.min(Math.max(props.progress, 0), 1));
const loadingPercent = computed(() => Math.round(normalizedProgress.value * 100));
const loadingStage = computed(
  () => LOADING_STAGES.find((stage) => normalizedProgress.value <= stage.max)?.label ?? "READY",
);
const litSegments = computed(() => Math.round(normalizedProgress.value * 24));
</script>

<template>
  <Transition name="boot-overlay">
    <div v-if="visible" class="boot-overlay" aria-live="polite">
      <div class="boot-panel">
        <div class="boot-panel-chip">BOOT SEQUENCE</div>
        <h2 class="boot-panel-title">AI DIPLOMAP</h2>
        <p class="boot-panel-copy">Mapping site relations and world data...</p>
        <div class="boot-panel-stage-row">
          <span class="boot-panel-stage">{{ loadingStage }}</span>
          <span class="boot-panel-percent">{{ loadingPercent }}%</span>
        </div>
        <div
          class="boot-progress-shell"
          role="progressbar"
          aria-label="Loading diplomacy map"
          :aria-valuenow="loadingPercent"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div class="boot-progress-track">
            <div class="boot-progress-fill" :style="{ width: `${normalizedProgress * 100}%` }" />
            <div class="boot-progress-grid" aria-hidden="true">
              <span
                v-for="segment in 24"
                :key="segment"
                class="boot-progress-cell"
                :class="{ 'is-lit': segment <= litSegments }"
              />
            </div>
          </div>
        </div>
        <div class="boot-panel-caption">
          Diplomatic links, country geometry, and render cache are being initialized.
        </div>
        <div class="boot-panel-pixels" aria-hidden="true">
          <span
            v-for="pixel in 12"
            :key="pixel"
            class="boot-panel-pixel"
            :style="{ animationDelay: `${pixel * 80}ms` }"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.boot-overlay {
  position: absolute;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at 50% 35%, rgba(126, 240, 184, 0.08), transparent 22%),
    linear-gradient(180deg, rgba(2, 6, 17, 0.7), rgba(2, 6, 17, 0.9));
  backdrop-filter: blur(4px);
}

.boot-panel {
  position: relative;
  width: min(460px, 100%);
  padding: 20px 20px 18px;
  border: 4px solid #2a3c2a;
  background:
    linear-gradient(180deg, rgba(12, 24, 37, 0.98), rgba(5, 12, 22, 0.98)),
    #07111b;
  box-shadow:
    0 0 0 4px rgba(8, 18, 31, 0.94),
    12px 12px 0 rgba(2, 6, 17, 0.72),
    0 0 28px rgba(90, 138, 90, 0.16);
  image-rendering: pixelated;
  overflow: hidden;
}

.boot-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.04) 0 2px,
    transparent 2px 6px
  );
  opacity: 0.18;
  pointer-events: none;
}

.boot-panel > * {
  position: relative;
  z-index: 1;
}

.boot-panel-chip {
  display: inline-flex;
  padding: 2px 8px;
  margin-bottom: 12px;
  border: 2px solid rgba(126, 240, 184, 0.32);
  background: rgba(18, 36, 28, 0.72);
  color: #b8e0b8;
  font-family: "Courier New", monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.boot-panel-title {
  margin: 0;
  color: #d8ffd2;
  font-family: "Courier New", monospace;
  font-size: clamp(28px, 7vw, 40px);
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-shadow:
    0 0 12px rgba(126, 240, 184, 0.22),
    0 2px 0 rgba(0, 0, 0, 0.55);
}

.boot-panel-copy {
  margin: 10px 0 18px;
  color: rgba(214, 227, 255, 0.74);
  font-family: "Courier New", monospace;
  font-size: 12px;
  letter-spacing: 0.06em;
}

.boot-panel-stage-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.boot-panel-stage,
.boot-panel-percent {
  color: #d1efaa;
  font-family: "Courier New", monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.boot-panel-percent {
  color: #7ef0b8;
}

.boot-progress-shell {
  padding: 6px;
  border: 3px solid #24352a;
  background: rgba(4, 10, 18, 0.94);
  box-shadow:
    inset 0 0 0 2px rgba(8, 18, 31, 0.92),
    6px 6px 0 rgba(2, 6, 17, 0.6);
}

.boot-progress-track {
  position: relative;
  height: 28px;
  border: 2px solid #162430;
  background:
    linear-gradient(180deg, rgba(4, 10, 18, 0.92), rgba(8, 18, 31, 0.96)),
    #06101a;
  overflow: hidden;
}

.boot-progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background:
    linear-gradient(180deg, rgba(180, 255, 213, 0.28), transparent 35%),
    repeating-linear-gradient(90deg, #7ef0b8 0 14px, #66d89d 14px 28px);
  box-shadow:
    inset 0 0 0 2px rgba(214, 255, 232, 0.18),
    0 0 16px rgba(126, 240, 184, 0.28);
  transition: width 0.18s linear;
}

.boot-progress-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(24, minmax(0, 1fr));
  gap: 2px;
  height: 100%;
  padding: 2px;
}

.boot-progress-cell {
  border: 1px solid rgba(4, 10, 18, 0.65);
  background: rgba(14, 28, 20, 0.46);
}

.boot-progress-cell.is-lit {
  background: rgba(255, 255, 255, 0.08);
}

.boot-panel-caption {
  margin-top: 12px;
  color: rgba(200, 224, 200, 0.62);
  font-size: 11px;
  line-height: 1.55;
}

.boot-panel-pixels {
  display: flex;
  gap: 6px;
  margin-top: 14px;
}

.boot-panel-pixel {
  width: 10px;
  height: 10px;
  border: 1px solid rgba(214, 255, 232, 0.18);
  background: rgba(42, 80, 42, 0.3);
  box-shadow: 0 0 0 1px rgba(5, 12, 24, 0.55);
  animation: boot-pixel-blink 1.2s steps(2, end) infinite;
}

.boot-overlay-enter-active,
.boot-overlay-leave-active {
  transition: opacity 0.28s ease;
}

.boot-overlay-enter-from,
.boot-overlay-leave-to {
  opacity: 0;
}

@keyframes boot-pixel-blink {
  0%,
  100% {
    transform: translateY(0);
    background: rgba(42, 80, 42, 0.3);
  }

  50% {
    transform: translateY(-1px);
    background: #7ef0b8;
    box-shadow:
      0 0 0 1px rgba(5, 12, 24, 0.55),
      0 0 10px rgba(126, 240, 184, 0.34);
  }
}

@media (max-width: 640px) {
  .boot-panel {
    padding: 18px 16px 16px;
  }

  .boot-panel-title {
    font-size: 28px;
    letter-spacing: 0.12em;
  }

  .boot-panel-copy,
  .boot-panel-stage,
  .boot-panel-percent,
  .boot-panel-caption {
    font-size: 11px;
  }

  .boot-progress-track {
    height: 24px;
  }
}
</style>
