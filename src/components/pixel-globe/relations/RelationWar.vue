<script setup lang="ts">
import type { VisibleRelation } from "../types";

defineProps<{
  relation: VisibleRelation;
}>();
</script>

<template>
  <g class="relation-group-details">
    <path
      class="relation-arc relation-arc-glow"
      :d="relation.path"
      :stroke="relation.color"
      stroke-width="8"
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

    <!-- War: Bomb from source to target -->
    <g class="relation-bomb">
      <g class="relation-bomb-smoke">
        <circle class="relation-bomb-smoke-puff relation-bomb-smoke-puff--1" cx="-18" cy="-1.5" r="2.8" />
        <circle class="relation-bomb-smoke-puff relation-bomb-smoke-puff--2" cx="-23" cy="1.4" r="3.3" />
        <circle class="relation-bomb-smoke-puff relation-bomb-smoke-puff--3" cx="-29" cy="-0.4" r="3.9" />
      </g>
      <g class="relation-bomb-shape">
        <path class="relation-bomb-tail" d="M -10 -2.3 L -3 -1.5 L -3 1.5 L -10 2.3 Z" />
        <path class="relation-bomb-fin" d="M -8.3 -2.2 L -12.6 -5.2 L -9.4 -0.8 Z" />
        <path class="relation-bomb-fin" d="M -8.3 2.2 L -12.6 5.2 L -9.4 0.8 Z" />
        <path class="relation-bomb-body" d="M -4.2 -3.4 L 3.2 -3.4 C 7.1 -3.4 10.4 -1.4 11.9 0 C 10.4 1.4 7.1 3.4 3.2 3.4 L -4.2 3.4 C -5.8 2.6 -6.6 1.2 -6.6 0 C -6.6 -1.2 -5.8 -2.6 -4.2 -3.4 Z" />
        <circle class="relation-bomb-cap" cx="10.4" cy="0" r="1.6" />
        <circle class="relation-bomb-highlight" cx="3.6" cy="-1.1" r="1" />
      </g>
      <animateMotion
        :dur="relation.motionDuration"
        repeatCount="indefinite"
        :path="relation.path"
        keyPoints="0;1;1"
        keyTimes="0;0.5;1"
        calcMode="linear"
        rotate="auto"
      />
      <animate
        attributeName="opacity"
        :dur="relation.motionDuration"
        repeatCount="indefinite"
        values="1;1;0;0"
        keyTimes="0;0.49;0.5;1"
        calcMode="linear"
      />
    </g>

    <!-- War: Bomb from target to source (return) -->
    <g class="relation-bomb relation-bomb--return">
      <g class="relation-bomb-smoke">
        <circle class="relation-bomb-smoke-puff relation-bomb-smoke-puff--1" cx="-18" cy="-1.5" r="2.8" />
        <circle class="relation-bomb-smoke-puff relation-bomb-smoke-puff--2" cx="-23" cy="1.4" r="3.3" />
        <circle class="relation-bomb-smoke-puff relation-bomb-smoke-puff--3" cx="-29" cy="-0.4" r="3.9" />
      </g>
      <g class="relation-bomb-shape">
        <path class="relation-bomb-tail" d="M -10 -2.3 L -3 -1.5 L -3 1.5 L -10 2.3 Z" />
        <path class="relation-bomb-fin" d="M -8.3 -2.2 L -12.6 -5.2 L -9.4 -0.8 Z" />
        <path class="relation-bomb-fin" d="M -8.3 2.2 L -12.6 5.2 L -9.4 0.8 Z" />
        <path class="relation-bomb-body" d="M -4.2 -3.4 L 3.2 -3.4 C 7.1 -3.4 10.4 -1.4 11.9 0 C 10.4 1.4 7.1 3.4 3.2 3.4 L -4.2 3.4 C -5.8 2.6 -6.6 1.2 -6.6 0 C -6.6 -1.2 -5.8 -2.6 -4.2 -3.4 Z" />
        <circle class="relation-bomb-cap" cx="10.4" cy="0" r="1.6" />
        <circle class="relation-bomb-highlight" cx="3.6" cy="-1.1" r="1" />
      </g>
      <animateMotion
        :dur="relation.motionDuration"
        repeatCount="indefinite"
        :path="relation.path"
        keyPoints="1;1;0"
        keyTimes="0;0.5;1"
        calcMode="linear"
        rotate="auto"
      />
      <animate
        attributeName="opacity"
        :dur="relation.motionDuration"
        repeatCount="indefinite"
        values="0;0;1;1"
        keyTimes="0;0.49;0.5;1"
        calcMode="linear"
      />
    </g>

    <!-- War: Target tag -->
    <g class="relation-target-tag" :transform="`translate(${relation.targetX + 14} ${relation.targetY - 20})`">
      <g class="relation-target-tag-card">
        <rect class="relation-target-tag-bg" rx="8" ry="8" x="0" y="-10" :width="relation.targetBadgeWidth" height="20" />
        <text class="relation-target-tag-text" x="10" y="4">{{ relation.targetKoreanName }}</text>
      </g>
    </g>

    <!-- War: Impact at target -->
    <g class="relation-impact" :transform="`translate(${relation.targetX} ${relation.targetY})`">
      <circle class="relation-impact-core" r="1.2">
        <animate attributeName="r" :dur="relation.motionDuration" repeatCount="indefinite" values="1.2;1.2;1.8;0.8;1.2" keyTimes="0;0.86;0.9;0.96;1" />
        <animate attributeName="opacity" :dur="relation.motionDuration" repeatCount="indefinite" values="0;0;1;0;0" keyTimes="0;0.84;0.9;0.97;1" />
      </circle>
      <circle class="relation-impact-ring relation-impact-ring--1" r="2">
        <animate attributeName="r" :dur="relation.motionDuration" repeatCount="indefinite" values="2;2;3;13;2" keyTimes="0;0.84;0.88;0.98;1" />
        <animate attributeName="opacity" :dur="relation.motionDuration" repeatCount="indefinite" values="0;0;0.95;0;0" keyTimes="0;0.84;0.88;0.98;1" />
      </circle>
      <circle class="relation-impact-ring relation-impact-ring--2" r="1.4">
        <animate attributeName="r" :dur="relation.motionDuration" repeatCount="indefinite" values="1.4;1.4;2.2;9.5;1.4" keyTimes="0;0.85;0.9;0.98;1" />
        <animate attributeName="opacity" :dur="relation.motionDuration" repeatCount="indefinite" values="0;0;0.7;0;0" keyTimes="0;0.85;0.9;0.98;1" />
      </circle>
    </g>

    <!-- War: Impact at source (return) -->
    <g class="relation-impact relation-impact--return" :transform="`translate(${relation.sourceX} ${relation.sourceY})`">
      <circle class="relation-impact-core" r="1.2">
        <animate attributeName="r" :dur="relation.motionDuration" repeatCount="indefinite" values="1.2;1.2;1.2;1.8;0.8;1.2" keyTimes="0;0.34;0.84;0.9;0.96;1" />
        <animate attributeName="opacity" :dur="relation.motionDuration" repeatCount="indefinite" values="0;0;0;1;0;0" keyTimes="0;0.34;0.84;0.9;0.97;1" />
      </circle>
      <circle class="relation-impact-ring relation-impact-ring--1" r="2">
        <animate attributeName="r" :dur="relation.motionDuration" repeatCount="indefinite" values="2;2;2;3;13;2" keyTimes="0;0.34;0.84;0.88;0.98;1" />
        <animate attributeName="opacity" :dur="relation.motionDuration" repeatCount="indefinite" values="0;0;0;0.95;0;0" keyTimes="0;0.34;0.84;0.88;0.98;1" />
      </circle>
      <circle class="relation-impact-ring relation-impact-ring--2" r="1.4">
        <animate attributeName="r" :dur="relation.motionDuration" repeatCount="indefinite" values="1.4;1.4;1.4;2.2;9.5;1.4" keyTimes="0;0.35;0.85;0.9;0.98;1" />
        <animate attributeName="opacity" :dur="relation.motionDuration" repeatCount="indefinite" values="0;0;0;0.7;0;0" keyTimes="0;0.35;0.85;0.9;0.98;1" />
      </circle>
    </g>
  </g>
</template>
