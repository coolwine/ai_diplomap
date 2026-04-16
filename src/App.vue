<template>
  <PixelGlobe />
  <footer class="app-footer">
    <a href="https://github.com/coolwine/ai_diplomap" target="_blank" rel="noopener noreferrer">
      GitHub
    </a>
    <span class="app-footer-separator">·</span>
    <a href="https://buymeacoffee.com/coolwinekio" target="_blank" rel="noopener noreferrer">
      ☕ Buy me a coffee
    </a>
  </footer>
</template>

<script setup lang="ts">
import PixelGlobe from "./components/PixelGlobe.vue";
</script>

<style scoped>
.app-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 8px 0;
  pointer-events: none;
  z-index: 100;
}

.app-footer a {
  pointer-events: auto;
  color: rgba(255, 255, 255, 0.45);
  font-size: 12px;
  text-decoration: none;
  transition: color 0.2s;
}

.app-footer a:hover {
  color: rgba(255, 255, 255, 0.85);
}

.app-footer-separator {
  color: rgba(255, 255, 255, 0.3);
  margin: 0 6px;
  font-size: 12px;
}
</style>
