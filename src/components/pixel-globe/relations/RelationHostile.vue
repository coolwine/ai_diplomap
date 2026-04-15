<script setup lang="ts">
import type { VisibleRelation } from "../types";

defineProps<{
  relation: VisibleRelation;
}>();
</script>

<template>
  <g class="relation-group-details">
    <path
      class="relation-arc relation-arc-glow relation-arc-glow--hostile"
      :d="relation.path"
      :stroke="relation.color"
      stroke-width="6"
      stroke-linecap="round"
      fill="none"
    />
    <path
      class="relation-arc"
      :d="relation.path"
      :stroke="relation.color"
      stroke-width="3"
      stroke-linecap="round"
      fill="none"
      stroke-dasharray="9 7"
    />

    <!-- Hostile: danger pulse rings at source -->
    <g
      class="relation-hostile-pulse"
      :transform="`translate(${relation.sourceX} ${relation.sourceY})`"
    >
      <circle class="relation-hostile-pulse-ring relation-hostile-pulse-ring--1" r="4" />
      <circle class="relation-hostile-pulse-ring relation-hostile-pulse-ring--2" r="4" />
    </g>

    <!-- Hostile: danger pulse rings at target -->
    <g
      class="relation-hostile-pulse"
      :transform="`translate(${relation.targetX} ${relation.targetY})`"
    >
      <circle class="relation-hostile-pulse-ring relation-hostile-pulse-ring--1" r="4" />
      <circle class="relation-hostile-pulse-ring relation-hostile-pulse-ring--2" r="4" />
    </g>

    <!-- Hostile: warning bolt traveling along path -->
    <g class="relation-hostile-bolt">
      <g class="relation-hostile-bolt-shape">
        <path
          class="relation-hostile-bolt-icon"
          d="M 1.5 -7 L -2 -0.5 L 1 -0.5 L -1.5 7 L 5 -1.5 L 1.5 -1.5 Z"
        />
      </g>
      <animateMotion
        :dur="relation.motionDuration"
        repeatCount="indefinite"
        :path="relation.path"
        keyPoints="0;1;0"
        keyTimes="0;0.5;1"
        calcMode="linear"
      />
    </g>

    <!-- Hostile: spark particles -->
    <g v-for="sparkIndex in 3" :key="`hostile-spark-${sparkIndex}`" class="relation-hostile-spark">
      <circle class="relation-hostile-spark-dot" r="1.4" />
      <animateMotion
        :dur="`${2.2 + sparkIndex * 0.8}s`"
        repeatCount="indefinite"
        :path="relation.path"
        :begin="`${sparkIndex * 0.5}s`"
        calcMode="linear"
      />
    </g>

    <!-- Hostile: target tag -->
    <g
      class="relation-hostile-tag"
      :transform="`translate(${relation.targetX + 14} ${relation.targetY - 20})`"
    >
      <rect
        class="relation-hostile-tag-bg"
        rx="8"
        ry="8"
        x="0"
        y="-10"
        :width="relation.targetBadgeWidth + 16"
        height="20"
      />
      <text class="relation-hostile-tag-icon" x="8" y="5">&#9889;</text>
      <text class="relation-hostile-tag-text" x="20" y="4">{{ relation.targetKoreanName }}</text>
    </g>
  </g>
</template>
