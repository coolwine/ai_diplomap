<script setup lang="ts">
import type { VisibleRelation } from "../types";

defineProps<{
  relation: VisibleRelation;
}>();
</script>

<template>
  <g class="relation-group-details">
    <path
      class="relation-arc relation-arc-glow relation-arc-glow--allied"
      :d="relation.path"
      :stroke="relation.color"
      stroke-width="10"
      stroke-linecap="round"
      fill="none"
    />
    <path
      class="relation-arc relation-arc--allied"
      :d="relation.path"
      :stroke="relation.color"
      stroke-width="3"
      stroke-linecap="round"
      fill="none"
      stroke-dasharray="4 8"
    />

    <!-- Allied: sparkle particles -->
    <g v-for="sparkleIndex in 5" :key="`sparkle-${sparkleIndex}`" class="relation-sparkle">
      <circle class="relation-sparkle-dot" r="1.6" />
      <animateMotion
        :dur="`${3 + sparkleIndex * 0.7}s`"
        repeatCount="indefinite"
        :path="relation.path"
        :begin="`${sparkleIndex * 0.6}s`"
        calcMode="linear"
      />
    </g>

    <!-- Allied: shield traveling along the path -->
    <g class="relation-shield">
      <g class="relation-shield-shape">
        <path class="relation-shield-body" d="M 0 -7.5 L 6.5 -4 L 6 3 L 0 7.5 L -6 3 L -6.5 -4 Z" />
        <path class="relation-shield-inner" d="M 0 -5.5 L 4.8 -3 L 4.4 2.2 L 0 5.5 L -4.4 2.2 L -4.8 -3 Z" />
        <path class="relation-shield-star" d="M 0 -3 L 0.9 -0.9 L 3 -0.6 L 1.4 0.8 L 1.8 3 L 0 2 L -1.8 3 L -1.4 0.8 L -3 -0.6 L -0.9 -0.9 Z" />
      </g>
      <animateMotion
        :dur="relation.motionDuration"
        repeatCount="indefinite"
        :path="relation.path"
        keyPoints="0;1;0"
        keyTimes="0;0.5;1"
        calcMode="linear"
        rotate="auto"
      />
    </g>

    <!-- Allied: badge tags at endpoints -->
    <g class="relation-allied-tag" :transform="`translate(${relation.targetX + 14} ${relation.targetY - 20})`">
      <rect class="relation-allied-tag-bg" rx="10" ry="10" x="0" y="-10" :width="relation.targetBadgeWidth + 16" height="20" />
      <text class="relation-allied-tag-icon" x="8" y="5">&#9733;</text>
      <text class="relation-allied-tag-text" x="20" y="4">{{ relation.targetKoreanName }}</text>
    </g>

    <!-- Allied: pulse ring at source -->
    <g class="relation-allied-pulse" :transform="`translate(${relation.sourceX} ${relation.sourceY})`">
      <circle class="relation-allied-pulse-ring relation-allied-pulse-ring--1" r="4" />
      <circle class="relation-allied-pulse-ring relation-allied-pulse-ring--2" r="4" />
    </g>

    <!-- Allied: pulse ring at target -->
    <g class="relation-allied-pulse" :transform="`translate(${relation.targetX} ${relation.targetY})`">
      <circle class="relation-allied-pulse-ring relation-allied-pulse-ring--1" r="4" />
      <circle class="relation-allied-pulse-ring relation-allied-pulse-ring--2" r="4" />
    </g>
  </g>
</template>
