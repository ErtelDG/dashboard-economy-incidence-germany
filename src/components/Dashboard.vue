<script setup>
import { ref } from "vue";
import Sidebar from "./Sidebar.vue";
import MainContent from "./MainContent.vue";
</script>

<template>
   <div class="flex min-h-screen bg-gray-100">
      <!-- sidebar -->
      <Sidebar />

      <!-- Main content -->
      <MainContent />
   </div>
</template>

<style scoped>
/* Hier können zusätzliche Stile hinzugefügt werden */
</style>
