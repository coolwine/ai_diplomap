<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";

import { LEADERS } from "../../data/leaders";
import {
  RELATION_LEVELS,
  getAllNationRelations,
  getRepresentativeLevel,
  parseNationKey,
  type AiOpinion,
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
  representativeLevel: RelationLevel;
  color: string;
  label: string;
  targetIso2: string;
  targetName: string;
  targetLocalizedName: string;
  targetFlagClass: string | null;
  opinions: AiOpinion[];
  hasDivergence: boolean;
  majorityLevel: RelationLevel;
};

const props = defineProps<{
  country: CountryInfo | null;
  focusRelationCountryName?: string | null;
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
const ALL_RELATIONS_FILTER = "__all__";

const selectedRelationTarget = ref(ALL_RELATIONS_FILTER);
const focusedRelationCardName = ref<string | null>(null);
const relationCardRefs = new Map<string, HTMLDivElement>();
let focusHighlightTimer: ReturnType<typeof setTimeout> | null = null;

function checkDivergence(opinions: AiOpinion[]): boolean {
  if (opinions.length <= 1) return false;
  return !opinions.every((o) => o.level === opinions[0].level);
}

function getMajorityLevel(opinions: AiOpinion[]): RelationLevel {
  const counts = new Map<RelationLevel, number>();
  for (const o of opinions) {
    counts.set(o.level, (counts.get(o.level) ?? 0) + 1);
  }
  let maxLevel = opinions[0].level;
  let maxCount = 0;
  for (const [level, count] of counts) {
    if (count > maxCount) {
      maxCount = count;
      maxLevel = level;
    }
  }
  return maxLevel;
}

function getFlagEmoji(iso2: string) {
  return String.fromCodePoint(...iso2.split("").map((char) => 127397 + char.charCodeAt(0)));
}

const relations = computed<RelationEntry[]>(() => {
  if (!props.country?.iso2) return [];
  const iso2 = props.country.iso2;
  const all = getAllNationRelations();
  const entries: RelationEntry[] = [];

  for (const rel of all) {
    const [a, b] = parseNationKey(rel.nationKey);
    const counterpartIso2 = a === iso2 ? b : b === iso2 ? a : null;
    if (!counterpartIso2) continue;

    const resolved = props.resolveCountry(counterpartIso2);
    if (!resolved) continue;

    const level = getRepresentativeLevel(rel.opinions);
    const meta = RELATION_LEVELS[level];
    const hasDivergence = checkDivergence(rel.opinions);
    entries.push({
      representativeLevel: level,
      color: meta.color,
      label: meta.label,
      targetIso2: counterpartIso2,
      targetName: resolved.name,
      targetLocalizedName: resolved.localizedName,
      targetFlagClass: resolved.flagClass,
      opinions: rel.opinions,
      hasDivergence,
      majorityLevel: getMajorityLevel(rel.opinions),
    });
  }

  // Divergent opinions first, then by level order
  entries.sort((a, b) => {
    if (a.hasDivergence !== b.hasDivergence) return a.hasDivergence ? -1 : 1;
    return LEVEL_ORDER.indexOf(a.representativeLevel) - LEVEL_ORDER.indexOf(b.representativeLevel);
  });
  return entries;
});

const relationOptions = computed(() =>
  [...relations.value]
    .sort((a, b) => a.targetLocalizedName.localeCompare(b.targetLocalizedName))
    .map((relation) => ({
      value: relation.targetName,
      label: `${getFlagEmoji(relation.targetIso2)} ${relation.targetIso2} · ${relation.targetLocalizedName}`,
    })),
);

const filteredRelations = computed(() => {
  if (selectedRelationTarget.value === ALL_RELATIONS_FILTER) {
    return relations.value;
  }
  return relations.value.filter((relation) => relation.targetName === selectedRelationTarget.value);
});

const divergentRelations = computed(() => filteredRelations.value.filter((r) => r.hasDivergence));
const consensusRelations = computed(() => filteredRelations.value.filter((r) => !r.hasDivergence));

const leader = computed(() => {
  if (!props.country) return null;
  return LEADERS[props.country.iso2 ?? ""] ?? null;
});

watch(
  () => props.country?.iso2,
  () => {
    selectedRelationTarget.value = ALL_RELATIONS_FILTER;
    focusedRelationCardName.value = null;
  },
);

watch(
  () => props.focusRelationCountryName,
  async (countryName) => {
    if (focusHighlightTimer) {
      clearTimeout(focusHighlightTimer);
      focusHighlightTimer = null;
    }

    if (!countryName || !relations.value.some((relation) => relation.targetName === countryName)) {
      focusedRelationCardName.value = null;
      return;
    }

    if (
      selectedRelationTarget.value !== ALL_RELATIONS_FILTER &&
      selectedRelationTarget.value !== countryName
    ) {
      selectedRelationTarget.value = countryName;
    }

    await nextTick();

    const card = relationCardRefs.get(countryName);
    if (!card) {
      return;
    }

    focusedRelationCardName.value = countryName;
    card.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    focusHighlightTimer = setTimeout(() => {
      if (focusedRelationCardName.value === countryName) {
        focusedRelationCardName.value = null;
      }
      focusHighlightTimer = null;
    }, 2200);
  },
);

function setRelationCardRef(countryName: string, element: Element | null) {
  if (element instanceof HTMLDivElement) {
    relationCardRefs.set(countryName, element);
    return;
  }

  relationCardRefs.delete(countryName);
}

function handleCountryClick(countryName: string) {
  emit("select-country", countryName);
}
</script>

<template>
  <Transition name="panel">
    <div v-if="country" class="info-panel">
      <button class="info-panel-close" @click="emit('close')">&times;</button>

      <div class="info-panel-header">
        <span v-if="country.flagClass" class="info-panel-flag" :class="country.flagClass" />
        <div class="info-panel-titles">
          <div class="info-panel-name">{{ country.localizedName }}</div>
          <div class="info-panel-name-en">{{ country.name }}</div>
        </div>
      </div>

      <div v-if="leader" class="info-panel-leader">
        <img :src="leader.image" :alt="leader.name" class="info-panel-leader-photo" />
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
        <div v-if="country.iso2" class="info-panel-meta-row">
          <span class="info-panel-meta-label">ISO</span>
          <span class="info-panel-meta-value info-panel-iso">{{ country.iso2 }}</span>
        </div>
      </div>

      <div v-if="relations.length > 0" class="info-panel-relations">
        <div class="info-panel-filter">
          <label class="info-panel-filter-label" for="relation-country-filter"
            >Country filter</label
          >
          <select
            id="relation-country-filter"
            v-model="selectedRelationTarget"
            class="info-panel-filter-select"
          >
            <option :value="ALL_RELATIONS_FILTER">All countries ({{ relations.length }})</option>
            <option v-for="option in relationOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Divergent section -->
        <template v-if="divergentRelations.length > 0">
          <div class="info-panel-section-title info-panel-section-divergent">
            <span class="info-panel-section-icon">&#9888;</span>
            AI 의견 차이
            <span class="info-panel-divergent-count">{{ divergentRelations.length }}</span>
          </div>
          <div class="info-panel-relation-list">
            <div
              v-for="item in divergentRelations"
              :key="item.targetName"
              class="info-panel-relation-card is-divergent"
              :class="{ 'is-focused': focusedRelationCardName === item.targetName }"
              :ref="(element) => setRelationCardRef(item.targetName, element)"
            >
              <div class="info-panel-relation-header">
                <button
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
              <div class="info-panel-ai-opinions">
                <div
                  v-for="opinion in item.opinions"
                  :key="opinion.ai"
                  class="info-panel-ai-row"
                  :class="{ 'is-minority': opinion.level !== item.majorityLevel }"
                >
                  <span
                    class="info-panel-ai-badge"
                    :style="{ borderColor: RELATION_LEVELS[opinion.level].color }"
                  >
                    <span
                      class="info-panel-ai-dot"
                      :style="{ background: RELATION_LEVELS[opinion.level].color }"
                    />
                    <span class="info-panel-ai-name">{{ opinion.ai }}</span>
                    <span
                      class="info-panel-ai-level"
                      :style="{ color: RELATION_LEVELS[opinion.level].color }"
                      >{{ RELATION_LEVELS[opinion.level].label }}</span
                    >
                  </span>
                  <span v-if="opinion.comment" class="info-panel-ai-comment">{{
                    opinion.comment
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Consensus section -->
        <template v-if="consensusRelations.length > 0">
          <div class="info-panel-section-title">AI 의견 일치</div>
          <div class="info-panel-relation-list">
            <div
              v-for="item in consensusRelations"
              :key="item.targetName"
              class="info-panel-relation-card is-consensus"
              :class="{ 'is-focused': focusedRelationCardName === item.targetName }"
              :ref="(element) => setRelationCardRef(item.targetName, element)"
            >
              <div class="info-panel-relation-header">
                <button
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
              <div class="info-panel-ai-opinions">
                <div v-for="opinion in item.opinions" :key="opinion.ai" class="info-panel-ai-row">
                  <span
                    class="info-panel-ai-badge"
                    :style="{ borderColor: RELATION_LEVELS[opinion.level].color }"
                  >
                    <span
                      class="info-panel-ai-dot"
                      :style="{ background: RELATION_LEVELS[opinion.level].color }"
                    />
                    <span class="info-panel-ai-name">{{ opinion.ai }}</span>
                    <span
                      class="info-panel-ai-level"
                      :style="{ color: RELATION_LEVELS[opinion.level].color }"
                      >{{ RELATION_LEVELS[opinion.level].label }}</span
                    >
                  </span>
                  <span v-if="opinion.comment" class="info-panel-ai-comment">{{
                    opinion.comment
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div v-else class="info-panel-no-relations">No relation data</div>
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
  gap: 14px;
}

.info-panel-filter {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  background: rgba(42, 60, 42, 0.2);
  border-radius: 6px;
  border: 1px solid rgba(126, 240, 184, 0.08);
}

.info-panel-filter-label {
  font-size: 10px;
  font-family: monospace;
  text-transform: uppercase;
  color: rgba(138, 171, 138, 0.7);
  letter-spacing: 0.5px;
}

.info-panel-filter-select {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid rgba(126, 240, 184, 0.12);
  background: rgba(10, 18, 28, 0.9);
  color: #d1efaa;
  font-size: 12px;
  font-family: inherit;
  outline: none;
}

.info-panel-filter-select:focus {
  border-color: rgba(126, 240, 184, 0.35);
  box-shadow: 0 0 0 2px rgba(126, 240, 184, 0.08);
}

.info-panel-section-title {
  font-size: 10px;
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(138, 171, 138, 0.5);
  border-bottom: 1px solid rgba(126, 240, 184, 0.08);
  padding-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-panel-section-divergent {
  color: rgba(255, 200, 100, 0.8);
  border-bottom-color: rgba(255, 200, 100, 0.15);
}

.info-panel-section-icon {
  font-size: 12px;
}

.info-panel-divergent-count {
  margin-left: auto;
  background: rgba(255, 200, 100, 0.15);
  color: rgba(255, 200, 100, 0.9);
  padding: 0 6px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
  line-height: 16px;
}

.info-panel-relation-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-panel-relation-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 10px;
  background: rgba(42, 60, 42, 0.15);
  border: 1px solid rgba(126, 240, 184, 0.06);
  border-radius: 6px;
  transition:
    border-color 0.3s,
    background 0.3s;
}

.info-panel-relation-card.is-divergent {
  background: rgba(255, 200, 100, 0.04);
  border-color: rgba(255, 200, 100, 0.18);
}

.info-panel-relation-card.is-consensus {
  padding: 8px 10px;
}

.info-panel-relation-card.is-focused {
  border-color: rgba(126, 240, 184, 0.55);
  box-shadow:
    0 0 0 1px rgba(126, 240, 184, 0.25),
    0 0 18px rgba(126, 240, 184, 0.18);
  animation: relation-card-focus 0.9s ease;
  scroll-margin-block: 96px;
}

.info-panel-relation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.info-panel-relation-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0;
  font-size: 11px;
  color: #c8e0c8;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
  font-family: inherit;
  text-align: left;
}

.info-panel-relation-item:hover {
  color: #d1efaa;
}

.info-panel-consensus-badge {
  font-size: 9px;
  font-family: monospace;
  font-weight: 600;
  padding: 1px 7px;
  border: 1px solid;
  border-radius: 3px;
  opacity: 0.6;
  white-space: nowrap;
  flex-shrink: 0;
}

.info-panel-ai-opinions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-panel-ai-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-panel-ai-row.is-minority {
  background: rgba(255, 200, 100, 0.04);
  border-radius: 4px;
  padding: 2px 4px;
  margin: 0 -4px;
}

.info-panel-ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  font-size: 9px;
  background: rgba(20, 30, 20, 0.5);
  border: 1px solid rgba(126, 240, 184, 0.12);
  border-radius: 3px;
  transition: all 0.3s;
  align-self: flex-start;
}

.is-minority > .info-panel-ai-badge {
  background: rgba(255, 200, 100, 0.08);
  border-width: 2px;
  box-shadow: 0 0 6px rgba(255, 200, 100, 0.15);
}

.info-panel-ai-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

.is-minority > .info-panel-ai-badge .info-panel-ai-dot {
  width: 6px;
  height: 6px;
  box-shadow: 0 0 4px currentColor;
}

.info-panel-ai-name {
  color: rgba(200, 224, 200, 0.5);
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.is-minority > .info-panel-ai-badge .info-panel-ai-name {
  color: rgba(255, 220, 150, 0.8);
}

.info-panel-ai-level {
  font-weight: 600;
}

.is-minority > .info-panel-ai-badge .info-panel-ai-level {
  font-weight: 700;
}

.info-panel-ai-comment {
  font-size: 10px;
  color: rgba(200, 224, 200, 0.55);
  line-height: 1.4;
  padding-left: 14px;
}

.is-minority > .info-panel-ai-comment {
  color: rgba(255, 220, 150, 0.65);
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

@keyframes relation-card-focus {
  0% {
    transform: scale(0.985);
    background: rgba(126, 240, 184, 0.18);
  }

  45% {
    transform: scale(1.01);
    background: rgba(126, 240, 184, 0.14);
  }

  100% {
    transform: scale(1);
  }
}

/* Transition */
.panel-enter-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.panel-leave-active {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
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
