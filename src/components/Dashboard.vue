<script setup>
import { ref } from "vue";
import Sidebar from "./Sidebar.vue";
import MainContent from "./MainContent.vue";

// Zustand für die Sidebar-Sichtbarkeit
const sidebarVisible = ref(false);

// Methode zum Umschalten der Sidebar-Sichtbarkeit
const toggleSidebar = () => {
   sidebarVisible.value = !sidebarVisible.value;
};
</script>

<template>
   <div class="flex min-h-screen bg-gray-100">
      <!-- sidebar -->
      <Sidebar :sidebarVisible="sidebarVisible" @toggle-sidebar="toggleSidebar" />

      <!-- Main content -->
      <MainContent />
   </div>
</template>

<style scoped>
/* Hier können zusätzliche Stile hinzugefügt werden */
</style>
