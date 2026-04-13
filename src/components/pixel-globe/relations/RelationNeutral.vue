<script setup lang="ts">
import type { VisibleRelation } from "../types";

defineProps<{
  relation: VisibleRelation;
}>();
</script>

<template>
  <g class="relation-group-details">
    <path
      class="relation-arc"
      :d="relation.path"
      :stroke="relation.color"
      stroke-width="3"
      stroke-linecap="round"
      fill="none"
      stroke-dasharray="9 7"
    />
  </g>
</template>
