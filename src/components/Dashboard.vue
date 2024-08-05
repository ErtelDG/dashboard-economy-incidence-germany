   <script setup>
   import { ref } from "vue";
   import Sidebar from "./Sidebar.vue";

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
         <div class="flex flex-col flex-1 overflow-y-auto">
            <div class="flex items-center justify-between h-16 bg-white border-b border-gray-200">
               <div class="flex items-center px-4">
                  <button @click="toggleSidebar" class="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                     </svg>
                  </button>
               </div>
               <div class="flex items-center px-4">
                  <span class="text-lg font-medium text-gray-800">Dashboard</span>
               </div>
            </div>
            <div class="p-4">
               <!-- Hier kommt der Hauptinhalt hin -->
               <h1 class="text-2xl font-semibold text-gray-800">Welcome to the Dashboard</h1>
              
            </div>
         </div>
      </div>
   </template>

   <style scoped>
   /* Hier können zusätzliche Stile hinzugefügt werden */
   </style>
