<script setup lang="ts">
import { computed } from "vue";

import { LEADERS } from "../../data/leaders";
import {
  RELATION_LEVELS,
  getAllRelations,
  type RelationLevel,
} from "../../data/relations";

export type CountryInfo = {
  name: string;
  koreanName: string;
  localizedName: string;
  iso2: string | null;
  flagClass: string | null;
  continent: string;
  koreanContinent: string;
  displayGroupEn: string;
  displayGroupKo: string;
  localizedGroup: string;
};

type RelationEntry = {
  level: RelationLevel;
  color: string;
  label: string;
  targetName: string;
  targetLocalizedName: string;
  targetFlagClass: string | null;
};

const props = defineProps<{
  country: CountryInfo | null;
  resolveCountry: (iso2: string) => {
    name: string;
    localizedName: string;
    flagClass: string | null;
  } | null;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "select-country", countryName: string): void;
}>();

const LEVEL_ORDER: RelationLevel[] = ["allied", "friendly", "neutral", "hostile", "war"];

const relations = computed<RelationEntry[]>(() => {
  if (!props.country?.iso2) return [];
  const iso2 = props.country.iso2;
  const all = getAllRelations();
  const entries: RelationEntry[] = [];

  for (const rel of all) {
    let counterpartIso2: string | null = null;
    if (rel.source === iso2) counterpartIso2 = rel.target;
    else if (rel.target === iso2) counterpartIso2 = rel.source;
    else continue;

    const resolved = props.resolveCountry(counterpartIso2);
    if (!resolved) continue;

    const meta = RELATION_LEVELS[rel.level];
    entries.push({
      level: rel.level,
      color: meta.color,
      label: meta.label,
      targetName: resolved.name,
      targetLocalizedName: resolved.localizedName,
      targetFlagClass: resolved.flagClass,
    });
  }

  entries.sort(
    (a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level),
  );
  return entries;
});

const groupedRelations = computed(() => {
  const groups: { level: RelationLevel; label: string; color: string; items: RelationEntry[] }[] = [];
  const map = new Map<RelationLevel, RelationEntry[]>();

  for (const entry of relations.value) {
    if (!map.has(entry.level)) map.set(entry.level, []);
    map.get(entry.level)!.push(entry);
  }

  for (const level of LEVEL_ORDER) {
    const items = map.get(level);
    if (!items) continue;
    const meta = RELATION_LEVELS[level];
    groups.push({ level, label: meta.label, color: meta.color, items });
  }

  return groups;
});

const leader = computed(() => {
  if (!props.country) return null;
  return LEADERS[props.country.name] ?? null;
});

function handleCountryClick(countryName: string) {
  emit("select-country", countryName);
}
</script>

<template>
  <Transition name="panel">
    <div
      v-if="country"
      class="info-panel"
    >
      <button
        class="info-panel-close"
        @click="emit('close')"
      >
        &times;
      </button>

      <div class="info-panel-header">
        <span
          v-if="country.flagClass"
          class="info-panel-flag"
          :class="country.flagClass"
        />
        <div class="info-panel-titles">
          <div class="info-panel-name">{{ country.localizedName }}</div>
          <div class="info-panel-name-en">{{ country.name }}</div>
        </div>
      </div>

      <div
        v-if="leader"
        class="info-panel-leader"
      >
        <img
          :src="leader.image"
          :alt="leader.name"
          class="info-panel-leader-photo"
        >
        <div class="info-panel-leader-info">
          <div class="info-panel-leader-name">{{ leader.name }}</div>
          <div class="info-panel-leader-title">{{ leader.title }}</div>
        </div>
      </div>

      <div class="info-panel-meta">
        <div class="info-panel-meta-row">
          <span class="info-panel-meta-label">Region</span>
          <span class="info-panel-meta-value">{{ country.localizedGroup }}</span>
        </div>
        <div
          v-if="country.iso2"
          class="info-panel-meta-row"
        >
          <span class="info-panel-meta-label">ISO</span>
          <span class="info-panel-meta-value info-panel-iso">{{ country.iso2 }}</span>
        </div>
      </div>

      <div
        v-if="groupedRelations.length > 0"
        class="info-panel-relations"
      >
        <div class="info-panel-section-title">Relations</div>
        <div
          v-for="group in groupedRelations"
          :key="group.level"
          class="info-panel-relation-group"
        >
          <div
            class="info-panel-relation-level"
            :style="{ color: group.color }"
          >
            <span
              class="info-panel-relation-dot"
              :style="{ background: group.color }"
            />
            {{ group.label }}
          </div>
          <div class="info-panel-relation-list">
            <button
              v-for="item in group.items"
              :key="item.targetName"
              class="info-panel-relation-item"
              @click="handleCountryClick(item.targetName)"
            >
              <span
                v-if="item.targetFlagClass"
                class="info-panel-relation-flag"
                :class="item.targetFlagClass"
              />
              <span>{{ item.targetLocalizedName }}</span>
            </button>
          </div>
        </div>
      </div>

      <div
        v-else
        class="info-panel-no-relations"
      >
        No relation data
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.info-panel {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  background: rgba(5, 14, 26, 0.92);
  border-left: 1px solid rgba(126, 240, 184, 0.15);
  backdrop-filter: blur(12px);
  z-index: 30;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 20px 16px;
  gap: 16px;
  scrollbar-width: thin;
  scrollbar-color: rgba(126, 240, 184, 0.2) transparent;
}

.info-panel-close {
  position: absolute;
  top: 10px;
  right: 12px;
  background: none;
  border: none;
  color: rgba(200, 224, 200, 0.5);
  font-size: 22px;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
  transition: color 0.2s;
}

.info-panel-close:hover {
  color: rgba(200, 224, 200, 0.9);
}

.info-panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 24px;
}

.info-panel-flag {
  width: 36px;
  height: 27px;
  border-radius: 3px;
  flex-shrink: 0;
  background-size: cover;
}

.info-panel-titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.info-panel-name {
  font-size: 16px;
  font-weight: 700;
  color: #d1efaa;
  line-height: 1.3;
  word-break: keep-all;
}

.info-panel-name-en {
  font-size: 11px;
  font-family: monospace;
  color: rgba(214, 227, 255, 0.6);
  line-height: 1.3;
}

.info-panel-leader {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(42, 60, 42, 0.2);
  border-radius: 6px;
  border: 1px solid rgba(126, 240, 184, 0.08);
}

.info-panel-leader-photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  object-position: top center;
  border: 2px solid rgba(126, 240, 184, 0.2);
  flex-shrink: 0;
}

.info-panel-leader-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.info-panel-leader-name {
  font-size: 13px;
  font-weight: 600;
  color: #d1efaa;
}

.info-panel-leader-title {
  font-size: 10px;
  font-family: monospace;
  text-transform: uppercase;
  color: rgba(138, 171, 138, 0.7);
  letter-spacing: 0.5px;
}

.info-panel-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  background: rgba(42, 60, 42, 0.2);
  border-radius: 6px;
  border: 1px solid rgba(126, 240, 184, 0.08);
}

.info-panel-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-panel-meta-label {
  font-size: 10px;
  font-family: monospace;
  text-transform: uppercase;
  color: rgba(138, 171, 138, 0.7);
  letter-spacing: 0.5px;
}

.info-panel-meta-value {
  font-size: 12px;
  color: #c8e0c8;
}

.info-panel-iso {
  font-family: monospace;
  font-weight: 700;
  letter-spacing: 1px;
  color: rgba(126, 240, 184, 0.6);
}

.info-panel-relations {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-panel-section-title {
  font-size: 10px;
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(138, 171, 138, 0.5);
  border-bottom: 1px solid rgba(126, 240, 184, 0.08);
  padding-bottom: 6px;
}

.info-panel-relation-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-panel-relation-level {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
}

.info-panel-relation-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.info-panel-relation-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding-left: 12px;
}

.info-panel-relation-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  font-size: 11px;
  color: #c8e0c8;
  background: rgba(42, 60, 42, 0.25);
  border: 1px solid rgba(126, 240, 184, 0.1);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  font-family: inherit;
}

.info-panel-relation-item:hover {
  background: rgba(42, 80, 42, 0.45);
  border-color: rgba(126, 240, 184, 0.25);
}

.info-panel-relation-flag {
  width: 14px;
  height: 10px;
  border-radius: 1px;
  flex-shrink: 0;
  background-size: cover;
}

.info-panel-no-relations {
  font-size: 12px;
  color: rgba(138, 171, 138, 0.4);
  font-style: italic;
  text-align: center;
  padding: 12px 0;
}

/* Transition */
.panel-enter-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.panel-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.panel-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.panel-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Mobile: bottom sheet */
@media (max-width: 640px) {
  .info-panel {
    right: 0;
    left: 0;
    top: auto;
    bottom: 0;
    width: 100%;
    max-height: 50vh;
    border-left: none;
    border-top: 1px solid rgba(126, 240, 184, 0.15);
    border-radius: 14px 14px 0 0;
    padding: 16px 16px 24px;
  }

  .panel-enter-from {
    transform: translateY(100%);
    opacity: 0;
  }

  .panel-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
}
</style>
