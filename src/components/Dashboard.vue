<script setup>
import Sidebar from "./Sidebar.vue";
import Navbar from "./Navbar.vue";
import MainContent from "./MainContent.vue";
import FooterView from "./FooterView.vue";
</script>

<template>
   <div class="h-screen w-screen bg-gray-100">
      <!-- Nav main -->
      <div class="h-16 w-full">
         <Navbar />
      </div>

      <!-- Main content -->
      <div class="w-full main-content-heigt-to-vh">
         <MainContent />
      </div>

      <!-- Footer content -->
      <div class="h-16 w-full"><FooterView /></div>
   </div>
</template>

<style scoped>
.scrollbar-w-0 {
   scrollbar-width: none;
}

.main-content-heigt-to-vh {
   height: calc(100vh - 8rem);
   scrollbar-width: none;
   overflow: scroll;
}
</style>
