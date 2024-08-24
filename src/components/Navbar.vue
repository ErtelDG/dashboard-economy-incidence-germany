<template>
   <!-- Navigation Links -->
   <div class="flex items-center justify-between h-full border-b border-gray-200 bg-gray-900 w-full">
      <div
         class="flex md:hidden items-center justify-between h-16 w-16 bg-gray-900 border-b border-r border-gray-200 hover:bg-gray-500 hover:cursor-pointer scrollbar-width"
      >
         <button @click="toggleSidebar" class="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden px-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
         </button>
      </div>
      <RouterLink class="hover:bg-gray-500 hover:cursor-pointer flex items-center justify-center h-full text-white font-bold text-center w-80" to="/"
         >Konjunkturindikatoren Deutschland</RouterLink
      >
      <div class="flex items-center justify-center h-full text-white font-bold text-center">
         <RouterLink
            v-for="item in NavData"
            :key="item[1]"
            :to="item[1]"
            class="hover:bg-gray-500 hover:cursor-pointer flex items-center justify-center h-full text-white font-bold text-center "
            :class="store.state.selectedSubcategories.length === 0 ? 'nav-links-3ele' : 'nav-links-4ele'"
            active-class="bg-gray-700"
            exact-active-class="bg-gray-900"
         >
            {{ item[0] }}
         </RouterLink>
         <RouterLink
            v-if="store.state.selectedSubcategories.length > 0"
            class="hover:bg-gray-500 hover:cursor-pointer flex items-center justify-center h-full text-white font-bold text-center nav-links-4ele"
            active-class="bg-gray-700"
            exact-active-class="bg-gray-900"
            to="/ChartContent"         >
            {{ store.state.selectedSubcategories.length }} Charts ausgewählt
         </RouterLink>
      </div>
   </div>
</template>

<script setup>
import { useStore } from "vuex";
import { ref } from "vue";

// Daten für die Navigation
const NavData = ref([
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
