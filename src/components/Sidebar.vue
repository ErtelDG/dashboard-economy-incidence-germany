<template>
   <!-- sidebar -->
   <div
      :class="[
         'fixed over inset-x-0 left-0 h-full w-80 bg-gray-800 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0',
         store.state.sidebarVisible ? 'translate-x-0' : '-translate-x-full',
      ]"
   >
      <div class="custom-height flex flex-col flex-1 overflow-scroll px-2">
         <div class="">
            <div class="flex flex-col flex-1 overflow-y-auto text-white">
               <nav class="flex-1 bg-gray-800">
                  <div v-for="(subcategories, category) in sortedCategories" :key="category">
                     <div class="text-white px-1 py-2" to="/ChartContent">
                        <button @click="toggleCategory(category)" class="flex items-center justify-between w-full text-left">
                           {{ category }}
                           <svg
                              v-if="isCategoryOpen(category)"
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-6 w-6 transition-transform duration-300 ease-in-out hover:scale-125"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                           >
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 15l-7-7-7 7" />
                           </svg>
                           <svg
                              v-else
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-6 w-6 transition-transform duration-300 ease-in-out hover:scale-125"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                           >
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                           </svg>
                        </button>
                        <div v-if="isCategoryOpen(category)">
                           <div v-for="(items, subcategory) in subcategories" :key="subcategory">
                              <div class="text-white pl-4 py-2">
                                 <button @click="toggleSubcategory(subcategory)" class="flex items-center justify-between w-full text-left">
                                    {{ subcategory }}
                                    <svg
                                       v-if="isSubcategoryOpen(subcategory)"
                                       xmlns="http://www.w3.org/2000/svg"
                                       class="h-6 w-6 transition-transform duration-300 ease-in-out hover:scale-125"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       stroke="currentColor"
                                    >
                                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 15l-7-7-7 7" />
                                    </svg>
                                    <svg
                                       v-else
                                       xmlns="http://www.w3.org/2000/svg"
                                       class="h-6 w-6 transition-transform duration-300 ease-in-out hover:scale-125"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       stroke="currentColor"
                                    >
                                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                 </button>
                                 <div v-if="isSubcategoryOpen(subcategory)">
                                    <div v-for="item in items" :key="item.id">
                                       <div class="text-white pl-4 py-2 flex items-center hover:cursor-pointer">
                                          <input
                                             type="checkbox"
                                             :value="item.id"
                                             :checked="isChecked(item.id)"
                                             @change="handleCheckboxChange(item.id)"
                                             class="mr-3 hover:cursor-pointer"
                                          />
                                          {{ item.title }}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </nav>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();
const sortedCategories = ref("");

// Watch for changes in apiDataList
watch(
   () => store.getters.apiDataList,
   (newData) => {
      if (newData) {
         sortedCategories.value = newData;
      }
   },
   { immediate: true }
);

// Dispatch fetchData action on component mount
onMounted(() => {
   store.dispatch("fetchData");
});

// Emits definieren
const emit = defineEmits(["toggle-sidebar"]);

// Methode zum Umschalten der Sidebar-Sichtbarkeit
function toggleSidebar() {
   store.commit("toggleSidebar");
}

// Verfolgung der offenen Kategorien und Subkategorien
const openCategories = ref(new Set());
const openSubcategories = ref(new Set());

// Methode zum Umschalten der Kategorie
const toggleCategory = (category) => {
   if (openCategories.value.has(category)) {
      openCategories.value.delete(category);
   } else {
      openCategories.value.add(category);
   }
};

// Methode zum Umschalten der Subkategorie
const toggleSubcategory = (subcategory) => {
   if (openSubcategories.value.has(subcategory)) {
      openSubcategories.value.delete(subcategory);
   } else {
      openSubcategories.value.add(subcategory);
   }
};

// Überprüfen, ob eine Kategorie/Subkategorie geöffnet ist
const isCategoryOpen = (category) => {
   return openCategories.value.has(category);
};

const isSubcategoryOpen = (subcategory) => {
   return openSubcategories.value.has(subcategory);
};

// Methode zum Überprüfen, ob eine ID ausgewählt ist
const isChecked = (id) => {
   return store.getters.selectedSubcategories.includes(id);
};

// Methode zum Verarbeiten von Checkbox-Änderungen
const handleCheckboxChange = (id) => {
   const selectedSubcategories = [...store.getters.selectedSubcategories];
   const index = selectedSubcategories.indexOf(id);
   if (index === -1) {
      // ID ist nicht im Array, hinzufügen
      selectedSubcategories.push(id);
   } else {
      // ID ist im Array, entfernen
      selectedSubcategories.splice(index, 1);
   }
   store.commit("updateSelectedSubcategories", selectedSubcategories);
};
</script>
<style scoped>
.custom-height {
   height: calc(100vh - 4rem);
   scrollbar-width: none;
}
</style>
