<template>
  <!-- sidebar -->
  <div
    :class="[
      'fixed inset-y-0 left-0 w-80 bg-gray-800 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0',
      props.sidebarVisible ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="flex items-center justify-between h-16 bg-gray-900">
      <span class="text-white font-bold text-center uppercase w-full">Economy Incidence Germany</span>
      <button @click="toggleSidebar" class="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden px-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
    <div class="flex flex-col flex-1 overflow-y-auto">
      <div class="px-4 py-6">
        <div class="flex flex-col flex-1 overflow-y-auto">
          <nav class="flex-1 px-2 py-4 bg-gray-800">
            <template v-for="(subcategories, category) in sortedCategories" :key="category">
              <div class="text-white px-4 py-2 uppercase">
                <button @click="toggleCategory(category)" class="flex items-center justify-between w-full text-left">
                  {{ category }}
                  <svg v-if="isCategoryOpen(category)" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <transition name="fade">
                <div v-if="isCategoryOpen(category)" class="pl-4">
                  <template v-for="subcategory in subcategories" :key="subcategory">
                    <a href="#" class="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      {{ subcategory }}
                    </a>
                  </template>
                </div>
              </transition>
            </template>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed, watch, ref } from 'vue';
import { useStore } from 'vuex';

// Props empfangen
const props = defineProps({
  sidebarVisible: {
    type: Boolean,
    required: true,
  },
});

// Emits definieren
const emit = defineEmits(['toggle-sidebar']);

// Vuex Store verwenden
const store = useStore();

// Methode zum Umschalten der Sidebar-Sichtbarkeit
const toggleSidebar = () => {
  emit('toggle-sidebar');
};

// Verfolgung der offenen Kategorien
const openCategories = ref(new Set());

// Methode zum Umschalten der Kategorie
const toggleCategory = (category) => {
  if (openCategories.value.has(category)) {
    openCategories.value.delete(category);
  } else {
    openCategories.value.add(category);
  }
};

// Überprüfen, ob eine Kategorie geöffnet ist
const isCategoryOpen = (category) => {
  return openCategories.value.has(category);
};

// Daten vorbereiten und sortieren
const prepareSidebarData = (apiData) => {
  if (typeof apiData !== 'object' || apiData === null) {
    console.warn('Expected apiData to be an object, but got:', apiData);
    return {};
  }

  const categories = {};

  Object.keys(apiData).forEach((key) => {
    const item = apiData[key];
    const category = item.category || 'Uncategorized';
    const subcategory = item.subcategory || 'No Subcategory';

    if (!categories[category]) {
      categories[category] = new Set();
    }

    categories[category].add(subcategory);
  });

  return Object.keys(categories)
    .sort()
    .reduce((acc, category) => {
      acc[category] = Array.from(categories[category]).sort();
      return acc;
    }, {});
};

// Computed properties
const sortedCategories = ref({});

// Watcher für API-Daten
watch(
  () => store.getters.apiDataList,
  (newData) => {
    if (newData) {
      sortedCategories.value = prepareSidebarData(newData);
    }
  },
  { immediate: true }
);
</script>


<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>

