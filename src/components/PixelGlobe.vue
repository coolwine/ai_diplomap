<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";

import { getLocalizedCountryName, getLocalizedGroup } from "../data/locale";
import { RELATION_LEVELS, getAllRelations } from "../data/relations";
import { syncSeoMetadata } from "../lib/seo";
import {
  countryContainsPoint,
  loadWorldCountries,
  type Coordinate,
  type CountryFeature,
} from "../data/worldCountries";
import { useGlobeViewStore } from "../stores/globeView";
import PixelGlobeCloudLayer from "./pixel-globe/PixelGlobeCloudLayer.vue";
import PixelGlobeBootOverlay from "./pixel-globe/PixelGlobeBootOverlay.vue";
import PixelGlobeHologramLayer from "./pixel-globe/PixelGlobeHologramLayer.vue";
import PixelGlobeInfoPanel from "./pixel-globe/PixelGlobeInfoPanel.vue";
import type { CountryInfo } from "./pixel-globe/PixelGlobeInfoPanel.vue";
import PixelGlobeLabelLayer from "./pixel-globe/PixelGlobeLabelLayer.vue";
import PixelGlobeRelationLayer from "./pixel-globe/PixelGlobeRelationLayer.vue";
import PixelGlobeSearchBar from "./pixel-globe/PixelGlobeSearchBar.vue";
import type { SearchableCountry } from "./pixel-globe/PixelGlobeSearchBar.vue";
import type { VisibleLabel, VisibleRelation } from "./pixel-globe/types";

type PointerState = {
  id: number;
  x: number;
  y: number;
};

type Rgb = [number, number, number];
type WorldTexture = {
  colorImageData: ImageData;
  ownerByPixel: Int32Array;
};

const OCEAN_PALETTE: Rgb[] = [
  [6, 17, 29],
  [12, 33, 59],
  [23, 58, 99],
  [36, 90, 148],
];
const ATMOSPHERE_PALETTE: Rgb[] = [
  [20, 38, 66],
  [35, 68, 108],
];
const BORDER_COLOR: Rgb = [18, 28, 14];
const LAND_OUTLINE_COLOR: Rgb = [209, 239, 169];
const BACKGROUND_COLOR: Rgb = [2, 6, 17];
const RELATION_COLORS: Record<string, Rgb> = {
  allied: [126, 240, 184], // #7ef0b8
  friendly: [125, 211, 252], // #7dd3fc
  hostile: [251, 146, 60], // #fb923c
  neutral: [86, 86, 87], // #96999f
  war: [255, 93, 93], // #ff5d5d
};
const LIGHT_DIRECTION = normalizeVector({ x: -0.72, y: -0.22, z: 1 });
const TEXTURE_WIDTH = 1440;
const TEXTURE_HEIGHT = 720;
const INTERACTION_SETTLE_MS = 120;

const globeStore = useGlobeViewStore();
const { zoom, centerLongitude, centerLatitude } = storeToRefs(globeStore);

const stageRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const viewport = ref({ width: 0, height: 0 });
const pointerMap = new Map<number, PointerState>();

let resizeObserver: ResizeObserver | null = null;
let renderFrameId: number | null = null;
let interactionTimerId: number | null = null;
let lastPinchDistance: number | null = null;
let worldTexture: WorldTexture | null = null;
let worldCountries: CountryFeature[] = [];
let isInteracting = false;
let offscreenCanvas: HTMLCanvasElement | null = null;
let offscreenContext: CanvasRenderingContext2D | null = null;
let offscreenImageData: ImageData | null = null;
let bootProgressFrameId: number | null = null;
const globeRadius = ref(0);
let lastRenderRadius = 0;
let lastRenderWidth = 0;
let lastRenderHeight = 0;
let suppressCanvasClick = false;
const dragStartPoint = ref<{ x: number; y: number } | null>(null);
const visibleLabels = ref<VisibleLabel[]>([]);
const visibleRelations = ref<VisibleRelation[]>([]);
const selectedCountryPos = ref<{ x: number; y: number } | null>(null);
const selectedCountryName = ref<string | null>(null);
const focusedInfoPanelCountryName = ref<string | null>(null);
const countriesVersion = ref(0);
const locale = ref("ko");
const isBooting = ref(true);
const loadingProgress = ref(0);

const SEARCH_HIDE_ZOOM = 2.2;
const FORCE_LABEL_AT_MAX_ZOOM = 3.95;
const BOOT_MIN_DURATION_MS = 2500;
const BOOT_COMPLETE_HOLD_MS = 180;
const BOOT_PROGRESS_CAP = 0.94;

const devicePixelRatioValue = computed(() => window.devicePixelRatio || 1);
const selectedCountry = computed(
  () => worldCountries.find((country) => country.name === selectedCountryName.value) ?? null,
);
const searchVisible = computed(() => zoom.value < SEARCH_HIDE_ZOOM);
const hologramPos = computed(() => {
  if (!selectedCountryName.value) return null;
  return selectedCountryPos.value;
});
const selectedCountryInfo = computed<CountryInfo | null>(() => {
  void countriesVersion.value;
  const name = selectedCountryName.value;
  if (!name) return null;
  const country = worldCountries.find((c) => c.name === name);
  if (!country) return null;
  return {
    name: country.name,
    koreanName: country.koreanName,
    localizedName: localizedName(country),
    iso2: country.iso2,
    flagClass: country.iso2 ? `fi fi-${country.iso2.toLowerCase()}` : null,
    continent: country.continent,
    koreanContinent: country.koreanContinent,
    displayGroupEn: country.displayGroupEn,
    displayGroupKo: country.displayGroupKo,
    localizedGroup: localizedGroup(country),
  };
});

function resolveCountryByIso2(iso2: string) {
  const c = worldCountries.find((w) => w.iso2 === iso2);
  if (!c) return null;
  return {
    name: c.name,
    localizedName: localizedName(c),
    flagClass: c.iso2 ? `fi fi-${c.iso2.toLowerCase()}` : null,
  };
}

const searchableCountries = computed<SearchableCountry[]>(() => {
  void countriesVersion.value;
  const loc = locale.value;
  return worldCountries.map((c) => ({
    localizedName: getLocalizedCountryName(c.iso2, loc, c.koreanName),
    name: c.name,
    shortName: c.shortName,
    iso2: c.iso2,
    label: c.label,
  }));
});

function localizedName(country: CountryFeature): string {
  return getLocalizedCountryName(country.iso2, locale.value, country.koreanName);
}

function localizedGroup(country: CountryFeature): string {
  return getLocalizedGroup(country.displayGroupKo, country.displayGroupEn, locale.value);
}

watch([zoom, centerLongitude, centerLatitude, viewport], () => {
  scheduleRender();
});

watch(selectedCountryName, () => {
  scheduleRender();
});

watch([selectedCountryInfo, locale], ([country, currentLocale]) => {
  syncSeoMetadata(currentLocale, country);
});

onMounted(async () => {
  if (!stageRef.value) {
    return;
  }

  syncSeoMetadata(locale.value, selectedCountryInfo.value);
  const bootStartedAt = performance.now();
  startBootProgress();

  try {
    // Warm relation data alongside country geometry so the loading UI tracks real boot work.
    void getAllRelations().length;

    const countries = await loadWorldCountries();
    const remainingBootTime = Math.max(
      0,
      BOOT_MIN_DURATION_MS - (performance.now() - bootStartedAt),
    );

    if (remainingBootTime > 0) {
      await wait(remainingBootTime);
    }

    loadingProgress.value = Math.max(loadingProgress.value, 0.97);
    worldCountries = countries;
    worldTexture = createWorldTexture(worldCountries);
    countriesVersion.value += 1;

    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = Math.max(1, Math.floor(entry.contentRect.width));
      const height = Math.max(1, Math.floor(entry.contentRect.height));

      viewport.value = { width, height };
      scheduleRender();
    });

    const initialBounds = stageRef.value.getBoundingClientRect();
    viewport.value = {
      width: Math.max(1, Math.floor(initialBounds.width)),
      height: Math.max(1, Math.floor(initialBounds.height)),
    };

    resizeObserver.observe(stageRef.value);
    scheduleRender();
    loadingProgress.value = 1;

    await wait(BOOT_COMPLETE_HOLD_MS);
    isBooting.value = false;
  } catch (error) {
    console.error("[AI DIPLOMAP] Failed to initialize globe data.", error);
    isBooting.value = false;
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  pointerMap.clear();

  if (renderFrameId !== null) {
    cancelAnimationFrame(renderFrameId);
  }

  if (interactionTimerId !== null) {
    window.clearTimeout(interactionTimerId);
  }

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }

  if (bootProgressFrameId !== null) {
    cancelAnimationFrame(bootProgressFrameId);
  }
});

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

function startBootProgress() {
  const startedAt = performance.now();

  const step = (now: number) => {
    const elapsedRatio = Math.min((now - startedAt) / BOOT_MIN_DURATION_MS, 1);
    const targetProgress = Math.min(elapsedRatio * BOOT_PROGRESS_CAP, BOOT_PROGRESS_CAP);
    loadingProgress.value = Math.max(loadingProgress.value, targetProgress);

    if (isBooting.value && loadingProgress.value < BOOT_PROGRESS_CAP) {
      bootProgressFrameId = requestAnimationFrame(step);
      return;
    }

    bootProgressFrameId = null;
  };

  bootProgressFrameId = requestAnimationFrame(step);
}

function normalizeVector(vector: { x: number; y: number; z: number }) {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1;

  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}

function wrapLongitude(value: number) {
  return ((((value + 180) % 360) + 360) % 360) - 180;
}

function getCountryPalette(index: number) {
  const palettes: Rgb[][] = [
    [
      [55, 90, 49],
      [77, 119, 66],
      [115, 165, 95],
      [155, 204, 130],
    ],
    [
      [52, 87, 48],
      [73, 111, 64],
      [109, 156, 88],
      [151, 201, 124],
    ],
    [
      [62, 95, 43],
      [85, 121, 60],
      [121, 169, 82],
      [163, 208, 113],
    ],
    [
      [53, 91, 60],
      [75, 120, 83],
      [112, 162, 111],
      [151, 196, 145],
    ],
  ];

  return palettes[index % palettes.length];
}

function textureXFromLongitude(lon: number) {
  return ((wrapLongitude(lon) + 180) / 360) * TEXTURE_WIDTH;
}

function textureYFromLatitude(lat: number) {
  return ((90 - lat) / 180) * TEXTURE_HEIGHT;
}

function traceTextureRing(context: CanvasRenderingContext2D, ring: Coordinate[], xOffset = 0) {
  let drawing = false;
  let previousX: number | null = null;

  for (const point of ring) {
    const x = textureXFromLongitude(point.lon) + xOffset;
    const y = textureYFromLatitude(point.lat);

    if (previousX !== null && Math.abs(x - previousX) > TEXTURE_WIDTH / 2) {
      drawing = false;
    }

    if (!drawing) {
      context.moveTo(x, y);
      drawing = true;
    } else {
      context.lineTo(x, y);
    }

    previousX = x;
  }

  if (drawing) {
    context.closePath();
  }
}

function rgbToCss([red, green, blue]: Rgb) {
  return `rgb(${red} ${green} ${blue})`;
}

function createWorldTexture(countries: CountryFeature[]) {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = TEXTURE_WIDTH;
  textureCanvas.height = TEXTURE_HEIGHT;
  const ownerCanvas = document.createElement("canvas");
  ownerCanvas.width = TEXTURE_WIDTH;
  ownerCanvas.height = TEXTURE_HEIGHT;

  const textureContext = textureCanvas.getContext("2d", { willReadFrequently: true });
  const ownerContext = ownerCanvas.getContext("2d", { willReadFrequently: true });

  if (!textureContext || !ownerContext) {
    return null;
  }

  textureContext.clearRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  ownerContext.clearRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  textureContext.lineJoin = "round";
  textureContext.lineWidth = 1.25;
  textureContext.strokeStyle = rgbToCss(BORDER_COLOR);
  ownerContext.lineJoin = "round";

  countries.forEach((country, countryIndex) => {
    textureContext.beginPath();
    ownerContext.beginPath();

    for (const polygon of country.polygons) {
      for (const ring of polygon) {
        traceTextureRing(textureContext, ring, -TEXTURE_WIDTH);
        traceTextureRing(textureContext, ring, 0);
        traceTextureRing(textureContext, ring, TEXTURE_WIDTH);
        traceTextureRing(ownerContext, ring, -TEXTURE_WIDTH);
        traceTextureRing(ownerContext, ring, 0);
        traceTextureRing(ownerContext, ring, TEXTURE_WIDTH);
      }
    }

    textureContext.fillStyle = rgbToCss(getCountryPalette(countryIndex)[1]);
    const ownerId = countryIndex + 1;
    const ownerRed = ownerId & 255;
    const ownerGreen = (ownerId >> 8) & 255;
    const ownerBlue = (ownerId >> 16) & 255;
    ownerContext.fillStyle = `rgb(${ownerRed} ${ownerGreen} ${ownerBlue})`;
    textureContext.fill("evenodd");
    ownerContext.fill("evenodd");
    textureContext.stroke();
  });

  const colorImageData = textureContext.getImageData(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  const ownerImageData = ownerContext.getImageData(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  const ownerByPixel = new Int32Array(TEXTURE_WIDTH * TEXTURE_HEIGHT);
  const { data: ownerData } = ownerImageData;

  for (let pixelIndex = 0; pixelIndex < ownerByPixel.length; pixelIndex += 1) {
    const offset = pixelIndex * 4;
    const alpha = ownerData[offset + 3];

    if (alpha === 0) {
      ownerByPixel[pixelIndex] = -1;
      continue;
    }

    const ownerId =
      ownerData[offset] + (ownerData[offset + 1] << 8) + (ownerData[offset + 2] << 16);
    ownerByPixel[pixelIndex] = ownerId - 1;
  }

  return {
    colorImageData,
    ownerByPixel,
  };
}

function projectToGeo(x: number, y: number) {
  const rho = Math.hypot(x, y);
  const centerLat = degreesToRadians(centerLatitude.value);
  const centerLon = degreesToRadians(centerLongitude.value);

  if (rho < 1e-6) {
    return {
      lat: centerLatitude.value,
      lon: centerLongitude.value,
    };
  }

  const clampedRho = Math.min(1, rho);
  const c = Math.asin(clampedRho);
  const sinC = Math.sin(c);
  const cosC = Math.cos(c);

  const latitude = Math.asin(
    cosC * Math.sin(centerLat) + (y * sinC * Math.cos(centerLat)) / clampedRho,
  );
  const longitude =
    centerLon +
    Math.atan2(x * sinC, clampedRho * Math.cos(centerLat) * cosC - y * Math.sin(centerLat) * sinC);

  return {
    lat: (latitude * 180) / Math.PI,
    lon: wrapLongitude((longitude * 180) / Math.PI),
  };
}

function projectGeoToScreen(
  point: Coordinate,
  radiusInPixels: number,
  width: number,
  height: number,
) {
  const latitude = degreesToRadians(point.lat);
  const longitude = degreesToRadians(point.lon);
  const centerLat = degreesToRadians(centerLatitude.value);
  const centerLon = degreesToRadians(centerLongitude.value);
  const deltaLon = longitude - centerLon;
  const cosLatitude = Math.cos(latitude);
  const sinLatitude = Math.sin(latitude);
  const cosCenterLat = Math.cos(centerLat);
  const sinCenterLat = Math.sin(centerLat);
  const cosDeltaLon = Math.cos(deltaLon);
  const visible = sinCenterLat * sinLatitude + cosCenterLat * cosLatitude * cosDeltaLon;

  if (visible <= 0) {
    return null;
  }

  const x = radiusInPixels * cosLatitude * Math.sin(deltaLon);
  const y =
    radiusInPixels * (cosCenterLat * sinLatitude - sinCenterLat * cosLatitude * cosDeltaLon);

  return {
    depth: visible,
    x: width / 2 + x,
    y: height / 2 - y,
  };
}

function projectGeoToScreenOrHorizon(
  point: Coordinate,
  radiusInPixels: number,
  width: number,
  height: number,
) {
  const projected = projectGeoToScreen(point, radiusInPixels, width, height);

  if (projected) {
    return projected;
  }

  const latitude = degreesToRadians(point.lat);
  const longitude = degreesToRadians(point.lon);
  const centerLat = degreesToRadians(centerLatitude.value);
  const centerLon = degreesToRadians(centerLongitude.value);
  const deltaLon = longitude - centerLon;
  const cosLatitude = Math.cos(latitude);
  const sinLatitude = Math.sin(latitude);
  const cosCenterLat = Math.cos(centerLat);
  const sinCenterLat = Math.sin(centerLat);
  let x = radiusInPixels * cosLatitude * Math.sin(deltaLon);
  let y =
    radiusInPixels * (cosCenterLat * sinLatitude - sinCenterLat * cosLatitude * Math.cos(deltaLon));
  let length = Math.hypot(x, y);

  if (length < 1e-6) {
    x = radiusInPixels;
    y = 0;
    length = radiusInPixels;
  }

  const scale = (radiusInPixels * 0.985) / length;

  return {
    depth: 0,
    x: width / 2 + x * scale,
    y: height / 2 - y * scale,
  };
}

function buildRelationPath(sourceX: number, sourceY: number, targetX: number, targetY: number) {
  const geometry = getRelationCurveGeometry(sourceX, sourceY, targetX, targetY);

  return `M ${sourceX} ${sourceY} Q ${geometry.controlX} ${geometry.controlY} ${targetX} ${targetY}`;
}

function getRelationCurveGeometry(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
) {
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const distance = Math.hypot(dx, dy) || 1;
  const normalX = -dy / distance;
  const normalY = dx / distance;
  const curveStrength = Math.min(110, distance * 0.18);
  const controlX = midX + normalX * curveStrength;
  const controlY = midY + normalY * curveStrength;
  const curvePointX = 0.25 * sourceX + 0.5 * controlX + 0.25 * targetX;
  const curvePointY = 0.25 * sourceY + 0.5 * controlY + 0.25 * targetY;

  return {
    controlX,
    controlY,
    labelX: curvePointX + normalX * 12,
    labelY: curvePointY + normalY * 12,
  };
}

function mixChannel(channel: number, factor: number) {
  return Math.round(clamp(channel * factor, 0, 255));
}

function setPixel(buffer: Uint8ClampedArray, offset: number, color: Rgb) {
  buffer[offset] = color[0];
  buffer[offset + 1] = color[1];
  buffer[offset + 2] = color[2];
  buffer[offset + 3] = 255;
}

function getPaletteColor(palette: Rgb[], brightness: number, dither = 0) {
  const index = Math.floor(clamp(brightness + dither, 0, 0.999) * palette.length);
  return palette[index] ?? palette[palette.length - 1];
}

function ensureRenderSurface(width: number, height: number) {
  if (!offscreenCanvas) {
    offscreenCanvas = document.createElement("canvas");
    offscreenContext = offscreenCanvas.getContext("2d");
  }

  if (!offscreenCanvas || !offscreenContext) {
    return null;
  }

  if (offscreenCanvas.width !== width || offscreenCanvas.height !== height) {
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    offscreenImageData = offscreenContext.createImageData(width, height);
  } else if (!offscreenImageData) {
    offscreenImageData = offscreenContext.createImageData(width, height);
  }

  return {
    canvas: offscreenCanvas,
    context: offscreenContext,
    imageData: offscreenImageData,
  };
}

function sampleTextureColor(point: Coordinate) {
  if (!worldTexture) {
    return null;
  }

  const textureX = clamp(Math.floor(textureXFromLongitude(point.lon)), 0, TEXTURE_WIDTH - 1);
  const textureY = clamp(Math.floor(textureYFromLatitude(point.lat)), 0, TEXTURE_HEIGHT - 1);
  const pixelIndex = textureY * TEXTURE_WIDTH + textureX;
  const offset = pixelIndex * 4;
  const { data } = worldTexture.colorImageData;

  if (data[offset + 3] === 0) {
    return null;
  }

  return {
    blue: data[offset + 2],
    green: data[offset + 1],
    countryIndex: worldTexture.ownerByPixel[pixelIndex] ?? -1,
    isBorder:
      data[offset] === BORDER_COLOR[0] &&
      data[offset + 1] === BORDER_COLOR[1] &&
      data[offset + 2] === BORDER_COLOR[2],
    red: data[offset],
  };
}

function overlaps(a: DOMRect, b: DOMRect) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function buildVisibleLabels(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  radiusInPixels: number,
  activeCountryRelationMap: Map<string, string> | null,
) {
  const forceShowNames = zoom.value >= FORCE_LABEL_AT_MAX_ZOOM;
  const secondaryFontFamily = '"Courier New", monospace';
  const primaryFontSize = Math.round(clamp(9 + zoom.value * 2, 9, 15));
  const secondaryFontSize = Math.max(8, primaryFontSize - 2);
  const lineGap = 2;
  const placedRects: DOMRect[] = [];
  const zoomBoost = isInteracting ? 0.25 : 0;
  if (selectedCountryName.value) {
    const selected = worldCountries.find((c) => c.name === selectedCountryName.value);
    if (selected) {
      const projected = projectGeoToScreen(selected.label, radiusInPixels, width, height);
      selectedCountryPos.value = projected ? { x: projected.x, y: projected.y } : null;
    } else {
      selectedCountryPos.value = null;
    }
  } else {
    selectedCountryPos.value = null;
  }

  const labelCandidates = worldCountries
    .filter((country) => forceShowNames || zoom.value >= country.minZoom + zoomBoost)
    .map((country) => {
      const projected = projectGeoToScreen(country.label, radiusInPixels, width, height);

      if (!projected) {
        return null;
      }

      const isSelected = country.name === selectedCountryName.value;
      const relationLevel = activeCountryRelationMap?.get(country.name);
      const isActive = isSelected || !!relationLevel || !activeCountryRelationMap;

      return {
        areaScore: country.areaScore,
        continent: country.continent,
        countryName: country.name,
        displayGroupEn: country.displayGroupEn,
        displayGroupKo: localizedGroup(country),
        depth: projected.depth,
        englishName: country.shortName,
        flagClass: country.iso2 ? `fi fi-${country.iso2.toLowerCase()}` : null,
        key: `${country.iso2 ?? country.name}-${country.shortName}`,
        koreanContinent: country.koreanContinent,
        koreanName: localizedName(country),
        labelPriority: country.labelPriority,
        smallCountryBoost: clamp(180 / Math.max(country.areaScore, 18), 0, 8),
        isActive,
        relationLevel,
        x: projected.x,
        y: projected.y,
      };
    })
    .filter((country): country is NonNullable<typeof country> => country !== null)
    .sort((left, right) => {
      if (right.labelPriority !== left.labelPriority) {
        return right.labelPriority - left.labelPriority;
      }

      if (right.smallCountryBoost !== left.smallCountryBoost) {
        return right.smallCountryBoost - left.smallCountryBoost;
      }

      if (right.areaScore !== left.areaScore) {
        return right.areaScore - left.areaScore;
      }

      return right.depth - left.depth;
    });

  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  const nextLabels: VisibleLabel[] = [];

  for (const candidate of labelCandidates) {
    const iconPadding = candidate.flagClass ? primaryFontSize + 6 : 0;
    const primaryText = `${candidate.koreanName} (${candidate.displayGroupKo})`;
    context.font = `700 ${primaryFontSize}px ${secondaryFontFamily}`;
    const primaryWidth = context.measureText(primaryText).width;
    let secondaryWidth = 0;
    let textHeight = primaryFontSize;

    if (!forceShowNames) {
      context.font = `600 ${secondaryFontSize}px ${secondaryFontFamily}`;
      secondaryWidth = context.measureText(
        `${candidate.englishName} 쨌 ${candidate.displayGroupEn}`,
      ).width;
      textHeight = primaryFontSize + secondaryFontSize + lineGap;
    }

    const textWidth = Math.max(primaryWidth + iconPadding, secondaryWidth);
    const rect = new DOMRect(
      candidate.x - textWidth / 2 - 5,
      candidate.y - textHeight / 2 - 4,
      textWidth + 10,
      textHeight + 8,
    );

    const edgeMargin = Math.min(Math.max(0, (zoom.value - 1.5) * 40), 100);

    if (
      rect.x < edgeMargin ||
      rect.y < edgeMargin ||
      rect.x + rect.width > width - edgeMargin ||
      rect.y + rect.height > height - edgeMargin
    ) {
      continue;
    }

    if (!forceShowNames && placedRects.some((placedRect) => overlaps(rect, placedRect))) {
      continue;
    }

    if (!forceShowNames) {
      placedRects.push(rect);
    }

    nextLabels.push({
      continent: candidate.continent,
      countryName: candidate.countryName,
      displayGroupEn: candidate.displayGroupEn,
      displayGroupKo: candidate.displayGroupKo,
      englishName: candidate.englishName,
      flagClass: candidate.flagClass,
      forceShowNameOnly: forceShowNames,
      key: candidate.key,
      koreanContinent: candidate.koreanContinent,
      koreanName: candidate.koreanName,
      isActive: candidate.isActive,
      relationLevel: candidate.relationLevel,
      x: candidate.x,
      y: candidate.y,
    });
  }

  context.restore();
  visibleLabels.value = nextLabels;
}

function buildVisibleRelations(width: number, height: number, radiusInPixels: number) {
  if (
    !selectedCountry.value ||
    worldCountries.length === 0 ||
    width === 0 ||
    height === 0 ||
    radiusInPixels <= 0
  ) {
    visibleRelations.value = [];
    return;
  }

  const relations = getAllRelations().filter(
    (relation) =>
      relation.source === selectedCountry.value?.iso2 ||
      relation.target === selectedCountry.value?.iso2,
  );
  const pairMap = new Map<string, ReturnType<typeof getAllRelations>[number]>();

  for (const relation of relations) {
    const pairKey = [relation.source, relation.target].sort().join("::");

    if (!pairMap.has(pairKey)) {
      pairMap.set(pairKey, relation);
    }
  }

  visibleRelations.value = [...pairMap.values()]
    .map((relation) => {
      const counterpartIso2 =
        relation.source === selectedCountry.value?.iso2 ? relation.target : relation.source;
      const sourceCountry = selectedCountry.value;
      const targetCountry = worldCountries.find((country) => country.iso2 === counterpartIso2);

      if (!sourceCountry || !targetCountry) {
        return null;
      }

      const sourceProjection = projectGeoToScreenOrHorizon(
        sourceCountry.label,
        radiusInPixels,
        width,
        height,
      );
      const targetProjection = projectGeoToScreenOrHorizon(
        targetCountry.label,
        radiusInPixels,
        width,
        height,
      );
      const meta = RELATION_LEVELS[relation.level];
      const distance = Math.hypot(
        targetProjection.x - sourceProjection.x,
        targetProjection.y - sourceProjection.y,
      );
      const curve = getRelationCurveGeometry(
        sourceProjection.x,
        sourceProjection.y,
        targetProjection.x,
        targetProjection.y,
      );
      const srcName = localizedName(sourceCountry);
      const tgtName = localizedName(targetCountry);
      const relationText = `${srcName} (${meta.label}) ${tgtName}`;

      return {
        color: meta.color,
        label: meta.label,
        labelWidth: clamp(140 + relationText.length * 5.6, 184, 320),
        labelX: curve.labelX,
        labelY: curve.labelY,
        level: relation.level,
        motionDuration: `${clamp(distance / 45, 4.2, 9.6).toFixed(2)}s`,
        path: buildRelationPath(
          sourceProjection.x,
          sourceProjection.y,
          targetProjection.x,
          targetProjection.y,
        ),
        relationText,
        sourceBadgeWidth: clamp(44 + srcName.length * 9, 56, 148),
        sourceName: sourceCountry.name,
        sourceKoreanName: srcName,
        sourceX: sourceProjection.x,
        sourceY: sourceProjection.y,
        targetBadgeWidth: clamp(44 + tgtName.length * 9, 56, 148),
        targetKoreanName: tgtName,
        targetName: targetCountry.name,
        targetX: targetProjection.x,
        targetY: targetProjection.y,
      };
    })
    .filter((relation): relation is VisibleRelation => relation !== null);

  // Collision avoidance: offset overlapping center tags vertically
  const TAG_HEIGHT = 28;
  const TAG_MIN_GAP = 4;

  for (let i = 1; i < visibleRelations.value.length; i++) {
    const current = visibleRelations.value[i];

    for (let j = 0; j < i; j++) {
      const placed = visibleRelations.value[j];
      const dx = Math.abs(current.labelX - placed.labelX);
      const dy = Math.abs(current.labelY - placed.labelY);

      if (dx < (current.labelWidth + placed.labelWidth) / 2 && dy < TAG_HEIGHT + TAG_MIN_GAP) {
        const shiftDirection = current.labelY >= placed.labelY ? 1 : -1;
        current.labelY = placed.labelY + shiftDirection * (TAG_HEIGHT + TAG_MIN_GAP);
      }
    }
  }
}

function getActiveCountryRelationMap() {
  if (!selectedCountry.value) {
    return null;
  }

  const selectedIso2 = selectedCountry.value.iso2;
  const relationMap = new Map<string, string>(); // iso2 -> level

  for (const relation of getAllRelations()) {
    if (relation.source === selectedIso2) {
      relationMap.set(relation.target, relation.level);
    }
    if (relation.target === selectedIso2) {
      relationMap.set(relation.source, relation.level);
    }
  }

  const activeCountryRelationMap = new Map<string, string>(); // countryName -> level
  for (const country of worldCountries) {
    const level = relationMap.get(country.iso2);
    if (level) {
      activeCountryRelationMap.set(country.name, level);
    }
  }

  return activeCountryRelationMap;
}

function scheduleRender() {
  if (renderFrameId !== null) {
    return;
  }

  renderFrameId = requestAnimationFrame(() => {
    renderFrameId = null;
    render();
  });
}

function markInteraction() {
  isInteracting = true;

  if (interactionTimerId !== null) {
    window.clearTimeout(interactionTimerId);
  }

  interactionTimerId = window.setTimeout(() => {
    isInteracting = false;
    interactionTimerId = null;
    scheduleRender();
  }, INTERACTION_SETTLE_MS);
}

function render() {
  const canvas = canvasRef.value;
  const { width, height } = viewport.value;

  if (!canvas || width === 0 || height === 0 || !worldTexture) {
    return;
  }

  const dpr = devicePixelRatioValue.value;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const outputContext = canvas.getContext("2d");

  if (!outputContext) {
    return;
  }

  const pixelSize = isInteracting
    ? Math.max(3, Math.floor(Math.min(width, height) / 220))
    : Math.max(2, Math.floor(Math.min(width, height) / 360));
  const logicalWidth = Math.max(1, Math.floor(width / pixelSize));
  const logicalHeight = Math.max(1, Math.floor(height / pixelSize));
  const renderSurface = ensureRenderSurface(logicalWidth, logicalHeight);

  if (!renderSurface) {
    return;
  }

  const { canvas: pixelCanvas, context, imageData } = renderSurface;
  const buffer = imageData.data;
  const centerX = logicalWidth / 2;
  const centerY = logicalHeight / 2;
  const radius = Math.min(logicalWidth, logicalHeight) * 0.3 * zoom.value;
  const radiusInPixels = radius * pixelSize;
  const activeCountryRelationMap = getActiveCountryRelationMap();
  lastRenderRadius = radiusInPixels;
  globeRadius.value = radiusInPixels;
  lastRenderWidth = width;
  lastRenderHeight = height;

  for (let yIndex = 0; yIndex < logicalHeight; yIndex += 1) {
    for (let xIndex = 0; xIndex < logicalWidth; xIndex += 1) {
      const offset = (yIndex * logicalWidth + xIndex) * 4;
      const x = (xIndex + 0.5 - centerX) / radius;
      const y = (centerY - (yIndex + 0.5)) / radius;
      const distance = Math.hypot(x, y);

      if (distance > 1.08) {
        setPixel(buffer, offset, BACKGROUND_COLOR);
        continue;
      }

      if (distance > 1) {
        const atmosphereBand = (1.08 - distance) / 0.08;
        setPixel(
          buffer,
          offset,
          getPaletteColor(ATMOSPHERE_PALETTE, clamp(atmosphereBand * 0.9, 0, 0.95)),
        );
        continue;
      }

      const z = Math.sqrt(1 - distance * distance);
      const point = projectToGeo(x, y);
      const lighting = clamp(
        z * LIGHT_DIRECTION.z + x * LIGHT_DIRECTION.x + y * LIGHT_DIRECTION.y,
        -1,
        1,
      );
      const sampledColor = sampleTextureColor(point);

      if (!sampledColor) {
        const oceanBrightness = clamp(0.26 + (lighting + 1) * 0.34, 0, 0.98);
        const dither = ((xIndex + yIndex) & 1) === 0 ? -0.03 : 0.03;
        setPixel(buffer, offset, getPaletteColor(OCEAN_PALETTE, oceanBrightness, dither));
        continue;
      }

      const brightnessFactor = sampledColor.isBorder
        ? 0.88 + ((lighting + 1) / 2) * 0.28
        : 0.58 + ((lighting + 1) / 2) * 0.72;
      const coastlineBoost = distance > 0.985 ? 1.08 : 1;
      const countryName =
        sampledColor.countryIndex >= 0
          ? (worldCountries[sampledColor.countryIndex]?.name ?? null)
          : null;
      const isSelected = countryName !== null && countryName === selectedCountryName.value;
      const relationLevel =
        countryName !== null ? activeCountryRelationMap?.get(countryName) : null;
      const isActive = isSelected || !!relationLevel || !activeCountryRelationMap;
      const isFocusTarget =
        !focusedRelationCountries.value ||
        (countryName !== null && focusedRelationCountries.value.has(countryName));

      const selectionBoost = isSelected ? 1.24 : isActive ? 1.04 : 1;
      const focusDim = isFocusTarget ? 1 : 0.28;
      const dimFactor = (isActive ? 1 : sampledColor.isBorder ? 0.38 : 0.3) * focusDim;
      const brightness = brightnessFactor * coastlineBoost * selectionBoost * dimFactor;

      let r = sampledColor.red;
      let g = sampledColor.green;
      let b = sampledColor.blue;

      if (relationLevel && RELATION_COLORS[relationLevel]) {
        const [relR, relG, relB] = RELATION_COLORS[relationLevel];
        r = relR;
        g = relG;
        b = relB;
      }

      buffer[offset] = mixChannel(r, brightness);
      buffer[offset + 1] = mixChannel(g, brightness);
      buffer[offset + 2] = mixChannel(b, brightness);
      buffer[offset + 3] = 255;
    }
  }

  context.putImageData(imageData, 0, 0);

  outputContext.setTransform(1, 0, 0, 1, 0, 0);
  outputContext.scale(dpr, dpr);
  outputContext.imageSmoothingEnabled = false;
  outputContext.fillStyle = rgbToCss(BACKGROUND_COLOR);
  outputContext.fillRect(0, 0, width, height);
  outputContext.drawImage(pixelCanvas, 0, 0, width, height);

  outputContext.strokeStyle = rgbToCss(LAND_OUTLINE_COLOR);
  outputContext.lineWidth = 1;
  outputContext.beginPath();
  outputContext.arc(width / 2, height / 2, radiusInPixels - 0.5, 0, Math.PI * 2);
  outputContext.stroke();

  buildVisibleLabels(outputContext, width, height, radiusInPixels, activeCountryRelationMap);
  buildVisibleRelations(width, height, radiusInPixels);
}

function getDistanceBetweenPointers() {
  const pointers = [...pointerMap.values()];

  if (pointers.length < 2) {
    return null;
  }

  return Math.hypot(pointers[0].x - pointers[1].x, pointers[0].y - pointers[1].y);
}

function handlePointerDown(event: PointerEvent) {
  const canvas = canvasRef.value;

  if (!canvas) {
    return;
  }

  canvas.setPointerCapture(event.pointerId);
  pointerMap.set(event.pointerId, {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
  });
  dragStartPoint.value = {
    x: event.clientX,
    y: event.clientY,
  };
  markInteraction();

  if (pointerMap.size === 2) {
    lastPinchDistance = getDistanceBetweenPointers();
  }
}

function handlePointerMove(event: PointerEvent) {
  const current = pointerMap.get(event.pointerId);

  if (!current) {
    return;
  }

  const nextPoint = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
  };

  pointerMap.set(event.pointerId, nextPoint);
  if (dragStartPoint.value) {
    const dragDistance = Math.hypot(
      event.clientX - dragStartPoint.value.x,
      event.clientY - dragStartPoint.value.y,
    );

    if (dragDistance > 5) {
      suppressCanvasClick = true;
    }
  }
  markInteraction();

  if (pointerMap.size === 1) {
    globeStore.rotateBy(event.clientX - current.x, event.clientY - current.y);
    return;
  }

  const currentDistance = getDistanceBetweenPointers();

  if (!currentDistance || !lastPinchDistance) {
    lastPinchDistance = currentDistance;
    return;
  }

  globeStore.scaleZoom(currentDistance / lastPinchDistance);
  lastPinchDistance = currentDistance;
}

function handlePointerUp(event: PointerEvent) {
  pointerMap.delete(event.pointerId);
  markInteraction();

  if (pointerMap.size < 2) {
    lastPinchDistance = null;
  }

  if (pointerMap.size === 0) {
    dragStartPoint.value = null;
    if (suppressCanvasClick) {
      window.setTimeout(() => {
        suppressCanvasClick = false;
      }, 0);
    }
  }
}

function handleWheel(event: WheelEvent) {
  event.preventDefault();
  suppressCanvasClick = true;
  markInteraction();

  globeStore.scaleZoom(event.deltaY < 0 ? 1.12 : 0.9);

  window.setTimeout(() => {
    suppressCanvasClick = false;
  }, 0);
}

const SELECT_ZOOM = 2.1;
const ANIMATE_DURATION = 400;
let animationFrameId: number | null = null;

function animateViewTo(targetLon: number, targetLat: number, targetZoom: number) {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }

  const startLon = globeStore.centerLongitude;
  const startLat = globeStore.centerLatitude;
  const startZoom = zoom.value;
  const startTime = performance.now();

  let deltaLon = targetLon - startLon;

  if (deltaLon > 180) {
    deltaLon -= 360;
  } else if (deltaLon < -180) {
    deltaLon += 360;
  }

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / ANIMATE_DURATION, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    globeStore.centerLongitude = startLon + deltaLon * ease;
    globeStore.centerLatitude = startLat + (targetLat - startLat) * ease;
    globeStore.setZoom(startZoom + (targetZoom - startZoom) * ease);

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(step);
    } else {
      animationFrameId = null;
    }
  }

  animationFrameId = requestAnimationFrame(step);
}

function selectCountry(countryName: string | null) {
  const isDeselect = countryName && selectedCountryName.value === countryName;
  selectedCountryName.value = isDeselect ? null : countryName;
  focusedInfoPanelCountryName.value = null;

  if (!isDeselect && countryName) {
    const country = worldCountries.find((c) => c.name === countryName);

    if (country) {
      const targetZoom = Math.max(zoom.value, SELECT_ZOOM);
      animateViewTo(country.label.lon, country.label.lat, targetZoom);
    }
  }

  scheduleRender();
}

function navigateTo(point: { lat: number; lon: number }) {
  const targetZoom = Math.max(zoom.value, SELECT_ZOOM);
  animateViewTo(point.lon, point.lat, targetZoom);
}

const focusedRelationCountries = ref<Set<string> | null>(null);

function handleFocusRelation(countries: { source: string; target: string } | null) {
  if (countries) {
    focusedRelationCountries.value = new Set([countries.source, countries.target]);
    focusedInfoPanelCountryName.value =
      countries.source === selectedCountryName.value ? countries.target : countries.source;
  } else {
    focusedRelationCountries.value = null;
    focusedInfoPanelCountryName.value = null;
  }

  scheduleRender();
}

function handleLocaleChange(newLocale: string) {
  locale.value = newLocale;
  scheduleRender();
}

function handleCanvasClick(event: MouseEvent) {
  if (suppressCanvasClick) {
    return;
  }

  if (lastRenderRadius <= 0 || worldCountries.length === 0) {
    return;
  }

  const rect = canvasRef.value?.getBoundingClientRect();

  if (!rect) {
    return;
  }

  const localX = event.clientX - rect.left;
  const localY = event.clientY - rect.top;
  const normalizedX = (localX - lastRenderWidth / 2) / lastRenderRadius;
  const normalizedY = (lastRenderHeight / 2 - localY) / lastRenderRadius;

  if (Math.hypot(normalizedX, normalizedY) > 1) {
    return;
  }

  const geoPoint = projectToGeo(normalizedX, normalizedY);
  const hitCountry = worldCountries.find((country) => countryContainsPoint(country, geoPoint));

  if (!hitCountry) {
    return;
  }

  selectCountry(hitCountry.name);
}
</script>

<template>
  <div ref="stageRef" class="globe-stage" :class="{ 'is-booting': isBooting }">
    <canvas
      ref="canvasRef"
      class="globe-canvas"
      aria-label="Interactive world map showing diplomatic relations"
      @click="handleCanvasClick"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerUp"
      @pointerleave="handlePointerUp"
      @wheel="handleWheel"
    />
    <PixelGlobeBootOverlay :visible="isBooting" :progress="loadingProgress" />
    <template v-if="!isBooting">
      <PixelGlobeCloudLayer
        :viewport="viewport"
        :globe-radius="globeRadius"
        :center-lon="centerLongitude"
        :center-lat="centerLatitude"
      />
      <PixelGlobeRelationLayer
        :selected-country-name="selectedCountryName"
        :viewport="viewport"
        :visible-relations="visibleRelations"
        @focus-relation="handleFocusRelation"
      />
      <PixelGlobeHologramLayer
        :selected-country-iso2="selectedCountryInfo?.iso2 ?? null"
        :x="hologramPos?.x ?? 0"
        :y="hologramPos?.y ?? 0"
        :visible="hologramPos !== null"
      />
      <PixelGlobeLabelLayer
        :selected-country-name="selectedCountryName"
        :visible-labels="visibleLabels"
        :visible-relations="visibleRelations"
        :focused-countries="focusedRelationCountries"
        @select-country="selectCountry"
      />
      <PixelGlobeSearchBar
        :countries="searchableCountries"
        :visible="searchVisible"
        :locale="locale"
        @select-country="selectCountry"
        @navigate-to="navigateTo"
        @change-locale="handleLocaleChange"
      />
      <PixelGlobeInfoPanel
        :country="selectedCountryInfo"
        :focus-relation-country-name="focusedInfoPanelCountryName"
        :resolve-country="resolveCountryByIso2"
        @close="selectCountry(null)"
        @select-country="selectCountry"
      />
    </template>
  </div>
</template>
