<template>
   <!-- Navigation Links -->
   <div class="flex items-center justify-between h-full border-b border-gray-200 bg-gray-900 w-full">
      <div class="flex items-center justify-center w-full h-full text-white font-bold text-center">
         <RouterLink
            v-for="item in navData"
            :key="item[1]"
            :to="item[1]"
            class="hover:bg-gray-500 hover:cursor-pointer flex items-center justify-center h-full text-white font-bold text-center w-1/5"
            active-class="bg-gray-700"
            exact-active-class="bg-gray-900"
         >
            {{ item[0] }}
         </RouterLink>
      </div>
   </div>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, watch } from "vue";

// Daten für die Navigation
const navData = ref([
   ["Einzelne Indikatoren Deutschland", "/ChartContent"],
   ["Indikatoren", "/"],
   ["Frühindikatoren", "/LeadingIndicators"],
   ["Präsenzindikatoren", "/PresenceIndicators"],
   ["Spätindikatoren", "/LaggingIndicators"],
]);

// Zugriff auf den Vuex-Store
const store = useStore();

// Methode zum Umschalten der Sidebar
function toggleSidebar() {
   store.commit("toggleSidebar");
}
</script>

<style scoped>
.nav-links-4ele {
   width: calc((100vw - 20rem) / 4);
}
.nav-links-3ele {
   width: calc((100vw - 20rem) / 3);
}
</style>
