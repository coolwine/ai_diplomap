<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { SUPPORTED_LOCALES, getSearchPlaceholder } from "../../data/locale";

export type SearchableCountry = {
  localizedName: string;
  name: string;
  shortName: string;
  iso2: string | null;
  label: { lat: number; lon: number };
};

const props = defineProps<{
  countries: SearchableCountry[];
  locale: string;
  visible: boolean;
}>();

const emit = defineEmits<{
  (event: "select-country", name: string): void;
  (event: "navigate-to", point: { lat: number; lon: number }): void;
  (event: "change-locale", locale: string): void;
}>();

const query = ref("");
const isFocused = ref(false);
const selectedIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);

const placeholder = computed(() => getSearchPlaceholder(props.locale));

const results = computed(() => {
  const q = query.value.trim().toLowerCase();

  if (q.length === 0) {
    return [];
  }

  return props.countries
    .filter(
      (c) =>
        c.localizedName.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q),
    )
    .slice(0, 6);
});

const showDropdown = computed(
  () => isFocused.value && query.value.trim().length > 0 && results.value.length > 0,
);

watch(query, () => {
  selectedIndex.value = 0;
});

function selectResult(country: SearchableCountry) {
  emit("select-country", country.name);
  emit("navigate-to", country.label);
  query.value = "";
  isFocused.value = false;
  inputRef.value?.blur();
}

function handleKeydown(event: KeyboardEvent) {
  if (!showDropdown.value) {
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
  } else if (event.key === "Enter") {
    event.preventDefault();
    const selected = results.value[selectedIndex.value];

    if (selected) {
      selectResult(selected);
    }
  } else if (event.key === "Escape") {
    query.value = "";
    isFocused.value = false;
    inputRef.value?.blur();
  }
}

function handleBlur() {
  setTimeout(() => {
    isFocused.value = false;
  }, 150);
}

function getFlagClass(iso2: string | null) {
  if (!iso2) {
    return null;
  }

  return `fi fi-${iso2.toLowerCase()}`;
}
</script>

<template>
  <Transition name="search-bar">
    <div v-if="visible" class="search-panel">
      <div class="locale-selector">
        <button
          v-for="loc in SUPPORTED_LOCALES"
          :key="loc.code"
          class="locale-btn"
          :class="{ 'is-active': locale === loc.code }"
          @click="emit('change-locale', loc.code)"
        >
          {{ loc.label }}
        </button>
      </div>
      <div class="search-title">
        <span class="search-title-icon">&#9670;</span>
        <span class="search-title-text">AI DIPLOMAP</span>
        <span class="search-title-icon">&#9670;</span>
      </div>
      <div class="search-box">
        <div class="search-box-inner">
          <span class="search-box-icon">&#9740;</span>
          <input
            ref="inputRef"
            v-model="query"
            class="search-input"
            type="text"
            aria-label="Search country"
            :placeholder="placeholder"
            spellcheck="false"
            autocomplete="off"
            @focus="isFocused = true"
            @blur="handleBlur"
            @keydown="handleKeydown"
          />
        </div>
        <Transition name="search-dropdown">
          <div v-if="showDropdown" class="search-dropdown">
            <div
              v-for="(country, index) in results"
              :key="country.name"
              class="search-result"
              :class="{ 'is-active': index === selectedIndex }"
              @mousedown.prevent="selectResult(country)"
              @mouseenter="selectedIndex = index"
            >
              <span
                v-if="getFlagClass(country.iso2)"
                class="search-result-flag"
                :class="getFlagClass(country.iso2)!"
              />
              <span class="search-result-local">{{ country.localizedName }}</span>
              <span class="search-result-english">{{ country.shortName }}</span>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>
