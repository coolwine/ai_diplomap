<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { VisibleRelation } from "./types";
import RelationWar from "./relations/RelationWar.vue";
import RelationHostile from "./relations/RelationHostile.vue";
import RelationAllied from "./relations/RelationAllied.vue";
import RelationFriendly from "./relations/RelationFriendly.vue";
import RelationNeutral from "./relations/RelationNeutral.vue";

const props = defineProps<{
  selectedCountryName: string | null;
  viewport: { width: number; height: number };
  visibleRelations: VisibleRelation[];
}>();

const emit = defineEmits<{
  (event: "focus-relation", countries: { source: string; target: string } | null): void;
}>();

const STAGGER_MS = 180;
const revealKey = ref(0);
const focusedKey = ref<string | null>(null);

const hasFocus = computed(() => focusedKey.value !== null);

watch(
  () => props.selectedCountryName,
  () => {
    revealKey.value += 1;
    focusedKey.value = null;
    emit("focus-relation", null);
  },
);

function relationKey(relation: VisibleRelation) {
  return `${relation.sourceName}-${relation.targetName}`;
}

function handleRelationClick(relation: VisibleRelation) {
  const key = relationKey(relation);
  const isDeselect = focusedKey.value === key;
  focusedKey.value = isDeselect ? null : key;

  emit(
    "focus-relation",
    isDeselect ? null : { source: relation.sourceName, target: relation.targetName },
  );
}

function isFocused(relation: VisibleRelation) {
  return focusedKey.value === relationKey(relation);
}

function isDimmed(relation: VisibleRelation) {
  return hasFocus.value && !isFocused(relation);
}

const getRelationComponent = (level: string) => {
  switch (level) {
    case "war":
      return RelationWar;
    case "hostile":
      return RelationHostile;
    case "allied":
      return RelationAllied;
    case "friendly":
      return RelationFriendly;
    default:
      return RelationNeutral;
  }
};
</script>

<template>
  <svg
    class="globe-relation-layer"
    :viewBox="`0 0 ${viewport.width} ${viewport.height}`"
    preserveAspectRatio="none"
  >
    <defs>
      <filter id="relationGlow">
        <feGaussianBlur stdDeviation="2.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g :key="revealKey">
      <g
        v-for="(relation, index) in visibleRelations"
        :key="`${relation.sourceName}-${relation.targetName}`"
        :class="[
          'relation-group',
          `relation-group--${relation.level}`,
          'relation-stagger',
          {
            'relation-group--focused': isFocused(relation),
            'relation-group--dimmed': isDimmed(relation),
          },
        ]"
        :style="{ animationDelay: `${index * STAGGER_MS}ms` }"
        filter="url(#relationGlow)"
        @click.stop="handleRelationClick(relation)"
      >
        <!-- Dynamic Relation Component -->
        <component :is="getRelationComponent(relation.level)" :relation="relation" />

        <!-- Common Relation Label -->
        <g
          class="relation-center-tag"
          :transform="`translate(${relation.labelX} ${relation.labelY})`"
        >
          <rect
            class="relation-center-tag-bg"
            rx="10"
            ry="10"
            :class="`relation-center-tag-bg--${relation.level}`"
            :x="-(relation.labelWidth / 2)"
            y="-12"
            :width="relation.labelWidth"
            height="24"
          />
          <text class="relation-center-tag-text" text-anchor="middle" dominant-baseline="middle">
            <tspan>[{{ relation.sourceKoreanName }}]</tspan>
            <tspan :fill="relation.color" font-weight="900">({{ relation.label }})</tspan>
            <tspan>[{{ relation.targetKoreanName }}]</tspan>
          </text>
        </g>
      </g>
    </g>
  </svg>
</template>
