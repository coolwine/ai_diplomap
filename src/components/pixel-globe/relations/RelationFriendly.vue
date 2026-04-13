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

    <!-- Friendly: heart traveling along the path -->
    <g class="relation-heart">
      <path
        class="relation-heart-icon"
        d="M 0 3.2 C -1.5 1.5 -4.5 1.5 -4.5 -1.5 C -4.5 -4.5 -1.5 -4.5 0 -2.5 C 1.5 -4.5 4.5 -4.5 4.5 -1.5 C 4.5 1.5 1.5 1.5 0 3.2 Z"
      />
      <animateMotion
        :dur="relation.motionDuration"
        repeatCount="indefinite"
        :path="relation.path"
        keyPoints="0;1;0"
        keyTimes="0;0.5;1"
        calcMode="linear"
      />
    </g>

    <!-- Friendly: heart particles -->
    <g v-for="heartIndex in 3" :key="`friendly-heart-${heartIndex}`" class="relation-heart-particle">
      <path
        class="relation-heart-icon-small"
        d="M 0 2 C -1 1 -3 1 -3 -1 C -3 -3 -1 -3 0 -1.5 C 1 -3 3 -3 3 -1 C 3 1 1 1 0 2 Z"
      />
      <animateMotion
        :dur="`${2.5 + heartIndex * 0.8}s`"
        repeatCount="indefinite"
        :path="relation.path"
        :begin="`${heartIndex * 0.7}s`"
        calcMode="linear"
      />
    </g>
  </g>
</template>
