<script setup>
import { ref, watch, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import Chart from "./Chart.vue";
import "../router";

const store = useStore();

const selectedSubcategories = ref([]);

watch(
   () => store.state.selectedSubcategories,
   (newData, oldData) => {
      selectedSubcategories.value = [];
      newData.forEach((element) => {
         selectedSubcategories.value.push(element);
      });
      store.state.selectedSubcategoriesGlobal = selectedSubcategories.length;
   },
   { immediate: true }
);

const apiData = reactive({});

const fetchData = async (id) => {
   try {
      const response = await fetch(`http://localhost:5600/data?id=${id}`);
      const data = await response.json();
      Object.keys(data.data).forEach((element) => {
         Object.keys(data.data[element]).forEach((element2) => {
            if (element2.includes("VerÃ¤nderung") || element2.includes("gegenÃ¼ber")) {
               let correctedElement2 = element2.replace("VerÃ¤nderung", "Veränderung").replace("gegenÃ¼ber", "gegenüber");
               data.data[element][correctedElement2] = data.data[element][element2];
               delete data.data[element][element2];
            }
         });
      });
      apiData[id] = data;
   } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
   }
};

const removeData = (id) => {
   delete apiData[id];
};

const debounce = (func, delay) => {
   let timeout;
   return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
   };
};

const handleChanges = debounce((newValue, oldValue) => {
   const newIds = newValue.filter((id) => !oldValue.includes(id));
   const removedIds = oldValue.filter((id) => !newValue.includes(id));

   newIds.forEach((id) => fetchData(id));

   removedIds.forEach((id) => removeData(id));
}, 300);

watch(() => store.getters.selectedSubcategories, handleChanges, { deep: true });

onMounted(() => {
   const initialIds = store.getters.selectedSubcategories;
   initialIds.forEach((id) => fetchData(id));
});

function toggleSidebar() {
   store.commit("toggleSidebar");
}

import Sidebar from "./Sidebar.vue";
</script>

<template>
   <div class="flex w-full h-full">
      <div class="h-full">
         <Sidebar />
      </div>
      <div class="flex flex-col flex-1 overflow-y-auto scrollbar-w-0 w-full relative">
         <div class="w-full flex flex-wrap px-2 py-4 overflow-hidden justify-center gap-x-4">
            <div v-for="subcategory in selectedSubcategories" :key="subcategory" class="mb-4 md:w-[48rem]">
               <Chart v-if="apiData[subcategory]" :subcategory="subcategory" :apiData="apiData[subcategory]" />
               <div v-if="!apiData[subcategory]" class="w-full h-[28.5rem] flex justify-center items-center rounded-md border-4">
                  <div>
                     <button
                        type="button"
                        class="inline-flex items-center px-4 py-2 font-semibold leading-6 shadow rounded-md text-white bg-gray-800 transition ease-in-out duration-150 cursor-not-allowed"
                        disabled=""
                     >
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                           <path
                              class="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                           ></path>
                        </svg>
                        Bitte warten, Daten werden geladen...
                     </button>
                  </div>
               </div>
            </div>
            <div v-if="selectedSubcategories.length % 2 == 1" class="mb-4 w-[48rem]"></div>
            <div v-if="selectedSubcategories.length === 0" class="pt-8 max-w-[48rem] flex flex-col">
               <div role="alert" class="rounded border-s-4 border-red-500 bg-red-50 p-4 max-w-96">
                  <strong class="block font-medium text-red-800">Keine Kategorie ausgewählt.</strong>

                  <div class="mt-2 text-sm text-red-700">
                     <p class="py-2">Bitte mindestens einen Kategorie auswählen, um einen Chart anzeigen zu lassen.</p>
                     <p class="lg:hidden block py-2">← Links über das Menü Icon!</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
.scrollbar-w-0 {
   scrollbar-width: none;
}
</style>
