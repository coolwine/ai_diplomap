import { ref } from "vue";
import { defineStore } from "pinia";

const MIN_ZOOM = 0.85;
const MAX_ZOOM = 4.0;
const MIN_LAT = -72;
const MAX_LAT = 72;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function wrapLongitude(value: number) {
  return ((((value + 180) % 360) + 360) % 360) - 180;
}

export const useGlobeViewStore = defineStore("globeView", () => {
  const zoom = ref(1.8);
  const centerLongitude = ref(127.5);
  const centerLatitude = ref(36.5);

  function setZoom(nextZoom: number) {
    zoom.value = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
  }

  function scaleZoom(multiplier: number) {
    setZoom(zoom.value * multiplier);
  }

  function rotateBy(deltaX: number, deltaY: number) {
    centerLongitude.value = wrapLongitude(centerLongitude.value - deltaX / zoom.value);
    centerLatitude.value = clamp(centerLatitude.value + deltaY / zoom.value, MIN_LAT, MAX_LAT);
  }

  return {
    zoom,
    centerLongitude,
    centerLatitude,
    setZoom,
    scaleZoom,
    rotateBy,
  };
});
