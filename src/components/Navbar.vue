<template>
   <!-- Navigation Links -->
   <div class="flex items-center justify-between h-full border-b border-gray-200 bg-gray-900 w-full">
      <div
         class="flex lg:hidden items-center justify-center h-16 w-16 bg-gray-900 border-b border-r border-gray-200 hover:bg-gray-500 hover:cursor-pointer scrollbar-width"
      >
         <button @click="toggleSidebar" class="text-gray-500 focus:outline-none focus:text-gray-700 lg:hidden px-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
         </button>
      </div>
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
