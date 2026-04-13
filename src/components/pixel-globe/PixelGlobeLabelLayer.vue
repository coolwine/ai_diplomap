<script setup lang="ts">
import { computed } from "vue";

import type { VisibleLabel, VisibleRelation } from "./types";

const props = defineProps<{
  selectedCountryName: string | null;
  visibleLabels: VisibleLabel[];
  visibleRelations: VisibleRelation[];
}>();

const emit = defineEmits<{
  (event: "select-country", countryName: string): void;
}>();

const activeRelation = computed(
  () =>
    props.visibleRelations.find(
      (relation) =>
        relation.sourceName === props.selectedCountryName ||
        relation.targetName === props.selectedCountryName,
    ) ?? null,
);

function handleLabelClick(countryName: string) {
  emit("select-country", countryName);
}
</script>

<template>
  <div class="globe-label-layer">
    <div
      v-for="label in visibleLabels"
      :key="label.key"
      class="globe-label"
      :class="{
        'is-selected': label.countryName === selectedCountryName,
        'is-dimmed': !label.isActive,
      }"
      :style="{
        left: `${label.x}px`,
        top: `${label.y}px`,
      }"
      @click="handleLabelClick(label.countryName)"
    >
      <div class="globe-label-primary">
        <span
          v-if="label.flagClass"
          class="globe-flag"
          :class="label.flagClass"
        />
        <span>{{ label.koreanName }} ({{ label.displayGroupKo }})</span>
        <span
          v-if="label.relationLevel === 'friendly'"
          class="globe-label-heart"
        >
          ❤️
        </span>
      </div>
      <div class="globe-label-secondary">
        {{ label.englishName }} · {{ label.displayGroupEn }}
      </div>
      <div
        v-if="label.countryName === selectedCountryName && activeRelation"
        class="globe-label-relation"
        :style="{ color: activeRelation.color }"
      >
        {{ activeRelation.label }}
      </div>
    </div>
  </div>
</template>
