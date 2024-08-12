<script setup>
import { ref, watch, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import Chart from "./Chart.vue";

// Holen Sie sich den Store
const store = useStore();

// Holen Sie sich den Getter für selectedSubcategories
const selectedSubcategories = ref(store.getters.selectedSubcategories);

// Reaktive Variable für die API-Daten
const apiData = reactive({});

// Methode zum Abrufen von Daten basierend auf der ID
const fetchData = async (id) => {
   try {
      const response = await fetch(`https://economy-incidence-germany.denniscodeworld.de/data?id=${id}`);
      const data = await response.json();
      apiData[id] = data; // Speichern Sie die Daten im reaktiven Objekt
   } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
   }
};

// Methode zum Entfernen von Daten
const removeData = (id) => {
   delete apiData[id];
};

// Debounce-Funktion
const debounce = (func, delay) => {
   let timeout;
   return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
   };
};

// Methode zum Handhaben von Änderungen in selectedSubcategories
const handleChanges = debounce((newValue, oldValue) => {
   const newIds = newValue.filter((id) => !oldValue.includes(id));
   const removedIds = oldValue.filter((id) => !newValue.includes(id));

   // Neue IDs abrufen
   newIds.forEach((id) => fetchData(id));

   // Entfernte IDs verwerfen
   removedIds.forEach((id) => removeData(id));
}, 300); // Debounce-Verzögerung von 300ms

// Beobachten Sie Änderungen an selectedSubcategories
watch(() => store.getters.selectedSubcategories, handleChanges, { deep: true });

// Initiale Datenabruf
onMounted(() => {
   const initialIds = store.getters.selectedSubcategories;
   initialIds.forEach((id) => fetchData(id));
});

// Sidebar-Toggle-Methode
function toggleSidebar() {
   store.commit("toggleSidebar");
}
</script>

<template>
   <div class="flex flex-col flex-1 overflow-y-auto">
      <div class="flex items-center justify-between h-16 bg-white border-b border-gray-200">
         <div class="flex items-center px-4">
            <button @click="toggleSidebar" class="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
               </svg>
            </button>
         </div>
         <div class="flex items-center px-4 w-full">
            <span class="text-lg font-medium text-gray-800">Dashboard</span>
         </div>
      </div>
      <div class="">
         <h1 class="text-4xl font-semibold text-gray-800 w-full text-center py-4">Welcome to the Dashboard</h1>
         <div class="w-full flex flex-wrap justify-around p-2">
            <div v-for="(data, id) in apiData" :key="id" class="mb-4">
               <Chart :apiData="data" />
            </div>
         </div>
         <!--            <pre>{{ data }}</pre>-->
         <!-- Zeigt die Daten für jede ID an -->
      </div>
   </div>
</template>

<style scoped></style>
