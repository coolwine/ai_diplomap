<template>
  <main class="app-shell" aria-label="AI DIPLOMAP main content">
    <section class="sr-only" aria-label="AI DIPLOMAP overview">
      <h1>AI DIPLOMAP</h1>
      <p>
        AI DIPLOMAP is an interactive web app for exploring diplomatic relations on a world map.
      </p>
      <p>
        Compare country relationships, inspect regional groupings, and review how multiple AI
        models interpret global affairs.
      </p>
    </section>
    <PixelGlobe />
  </main>
  <footer class="app-footer" aria-label="External links">
    <a href="https://github.com/coolwine/ai_diplomap" target="_blank" rel="noopener noreferrer">
      GitHub
    </a>
    <span class="app-footer-separator">|</span>
    <a href="https://buymeacoffee.com/coolwinekio" target="_blank" rel="noopener noreferrer">
      Buy me a coffee
    </a>
  </footer>
</template>

<script setup lang="ts">
import PixelGlobe from "./components/PixelGlobe.vue";
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

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
