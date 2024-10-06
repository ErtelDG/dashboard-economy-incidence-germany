<script setup>
import { ref, watch, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import "../router";
import { RouterView } from "vue-router";

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
   <div class="flex flex-col flex-1 overflow-y-auto scrollbar-w-0 w-full relative h-full">
      <div class="w-full flex flex-col flex-1">
         <div class="w-full h-full flex flex-wrap items-start overflow-hidden">
            <router-view v-slot="{ Component }">
               <keep-alive>
                  <component :is="Component" />
               </keep-alive>
            </router-view>
         </div>
      </div>
   </div>
</template>

<style scoped>
.scrollbar-w-0 {
   scrollbar-width: none;
}
.custom-height {
   height: calc(100vh - 8rem);
}
</style>
