<script setup>
import Dashboard from "./components/Dashboard.vue";
</script>

<template>
   <div class="w-screen min-h-screen h-screen scrollbar-w-0 overflow-scroll">
      <Dashboard></Dashboard>
   </div>
</template>

<style scoped>
.scrollbar-w-0 {
   scrollbar-width: none;
}
</style>
