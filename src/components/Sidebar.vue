<template>
   <div
      :class="[
         'inset-x-0 left-0 h-full  bg-gray-800 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 lg:z-0',
         store.state.sidebarVisible ? 'translate-x-0 w-80' : 'lg:w-80 w-16',
      ]"
   >
      <div class="scrollbar-width-noneflex flex-col flex-1 relative">
         <div
            :class="[
               'absolute z-10 top-0 w-full flex  justify-end hover:cursor-pointer hover:bg-gray-700',
               store.state.sidebarVisible ? 'bg-gray-700 border-b border-gray-200' : 'bg-gray-900',
            ]"
            @click="toggleSidebar"
         >
            <div
               :class="[
                  'flex lg:hidden items-center justify-center h-12 w-16    scrollbar-width',
                  store.state.sidebarVisible ? 'bg-gray-700' : 'bg-gray-800  hover:bg-gray-700',
               ]"
            >
               <div class="text-gray-500 focus:outline-none focus:text-gray-500 lg:hidden px-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
               </div>
            </div>
         </div>
         <div class="px-2 py-4 heigt-scroll scrollbar-width-none overflow-y-auto">
            <div class="flex flex-col flex-1">
               <nav class="flex-1 bg-gray-800">
                  <div v-for="(subcategories, category) in sortedCategories" :key="category">
                     <div :class="['px-1 py-2', store.state.sidebarVisible ? 'text-white' : 'hidden lg:block lg:text-white']" to="/ChartContent">
                        <button
                           @click="toggleCategory(category)"
                           :class="[' items-center justify-between w-full text-left', store.state.sidebarVisible ? 'flex' : 'lg:flex hidden']"
                        >
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
                              <div :class="['pl-4 py-2']">
                                 <button
                                    @click="toggleSubcategory(subcategory)"
                                    :class="['flex items-center justify-between w-full text-left', store.state.sidebarVisible ? 'flex' : 'lg:flex hidden']"
                                 >
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
                                       <div :class="['pl-4 py-2 flex items-center hover:cursor-pointer']">
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
const categories = ref([]);
const sortedCategories = ref("");

watch(
   () => store.getters.apiDataList,
   (newData) => {
      if (newData) {
         sortedCategories.value = newData;
      }
      const sortedKeys = Object.keys(sortedCategories.value).sort();
      const sortedObj = {};
      if (sortedKeys != null && sortedObj != null) {
         sortedKeys.forEach((key) => {
            sortedObj[key] = sortedCategories.value[key];
         });
         sortedCategories.value = sortedObj;
      }
   },
   { immediate: true }
);

onMounted(() => {
   store.dispatch("fetchData");
});

const emit = defineEmits(["toggle-sidebar"]);

function toggleSidebar() {
   store.commit("toggleSidebar");
}

const openCategories = ref(new Set());
const openSubcategories = ref(new Set());

const toggleCategory = (category) => {
   if (openCategories.value.has(category)) {
      openCategories.value.delete(category);
   } else {
      openCategories.value.add(category);
   }
};

const toggleSubcategory = (subcategory) => {
   if (openSubcategories.value.has(subcategory)) {
      openSubcategories.value.delete(subcategory);
   } else {
      openSubcategories.value.add(subcategory);
   }
};

const isCategoryOpen = (category) => {
   return openCategories.value.has(category);
};

const isSubcategoryOpen = (subcategory) => {
   return openSubcategories.value.has(subcategory);
};

const isChecked = (id) => {
   return store.getters.selectedSubcategories.includes(id);
};

const handleCheckboxChange = (id) => {
   const selectedSubcategories = [...store.getters.selectedSubcategories];
   const index = selectedSubcategories.indexOf(id);
   if (index === -1) {
      selectedSubcategories.push(id);
   } else {
      selectedSubcategories.splice(index, 1);
   }
   store.commit("updateSelectedSubcategories", selectedSubcategories);
};
</script>
<style scoped>
.scrollbar-width-none {
   scrollbar-width: none;
}

.heigt-scroll {
   height: calc(100vh - 8rem);
}
</style>
