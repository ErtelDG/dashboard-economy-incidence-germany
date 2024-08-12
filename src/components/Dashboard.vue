<script setup>
import { ref } from "vue";
import Sidebar from "./Sidebar.vue";
import MainContent from "./MainContent.vue";
</script>

<template>
   <div class="flex min-h-screen bg-gray-100 scrollbar-w-0">
      <!-- sidebar -->
      <div class="sticky top-0">
         <Sidebar />
      </div>
      <!-- Main content -->
      <MainContent />
   </div>
</template>

<style scoped>
.scrollbar-w-0 {
   scrollbar-width: none;
}
</style>
