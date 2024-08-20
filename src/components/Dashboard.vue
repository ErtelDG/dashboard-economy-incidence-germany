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

      <div class="w-full flex main-content-heigt-to-vh">
         <!-- sidebar -->
         <div class="w-80 h-full">
            <Sidebar />
         </div>
         <!-- Main content -->
         <div class="w-full main-content-heigt-to-vh">
            <div class="main-content"><MainContent /></div>
            <div class="h-16"><FooterView /></div>
         </div>
      </div>
   </div>
</template>

<style scoped>
.scrollbar-w-0 {
   scrollbar-width: none;
}
.main-content {
   min-height: calc(100% - 4rem);
}

.main-content-heigt-to-vh {
   height: calc(100vh - 4rem);
   scrollbar-width: none;
   overflow: scroll;
}
</style>
