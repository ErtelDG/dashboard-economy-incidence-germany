<script setup>
import { ref, watch, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import Chart from "./Chart.vue";
import "../router";

// Holen Sie sich den Store
const store = useStore();

// Holen Sie sich den Getter für selectedSubcategories
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

// Reaktive Variable für die API-Daten
const apiData = reactive({});

// Methode zum Abrufen von Daten basierend auf der ID
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
   <div class="flex flex-col flex-1 overflow-y-auto scrollbar-w-0 w-full relative">
      <div class="w-full flex flex-col flex-1">
         <div class="w-full h-full flex flex-wrap justify-around items-start px-2 py-4 custom-height overflow-hidden">
            <div v-for="subcategory in selectedSubcategories" :key="subcategory" class="mb-4 w-[48rem]">
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
            <div v-if="selectedSubcategories.length === 0">
               <div role="alert" class="rounded border-s-4 border-red-500 bg-red-50 p-4">
                  <strong class="block font-medium text-red-800">Keine Kategorie ausgewählt.</strong>

                  <p class="mt-2 text-sm text-red-700">
                     Aktuell ist keine Kategorie ausgewählt. Bitte mindestens einen Kategorie auswählen, um einen Chart anzeigen zu lassen.
                  </p>
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
