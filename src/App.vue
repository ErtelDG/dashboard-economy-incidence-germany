<script setup>
import Dashboard from "./components/Dashboard.vue";

import { ref, onMounted, onUnmounted } from "vue";

// Reaktiver Zustand für die Orientierung
const isPortrait = ref(false);

// Funktion zur Überprüfung der Ausrichtung
function checkOrientation() {
   isPortrait.value = window.innerHeight > window.innerWidth;
}

// Lifecycle-Hooks in script setup
onMounted(() => {
   checkOrientation(); // Initiale Überprüfung der Ausrichtung
   window.addEventListener("resize", checkOrientation); // Event-Listener hinzufügen
});

onUnmounted(() => {
   window.removeEventListener("resize", checkOrientation); // Event-Listener entfernen
});
</script>

<template id="rotate-message" style="display: none">
   <div>
      <!--       <div v-if="!isPortrait" id="rotate-message" class="w-screen h-screen">
         <p class="p-8">Bitte drehen Sie Ihr Gerät ins Querformat, um das Dashboard und die Diagramme optimal anzuzeigen.</p>
         <div class="phone">
            <div class="screen"></div>
         </div>
      </div>
      <div v-else> -->
      <div class="w-full h-full">
         <Dashboard></Dashboard>
      </div>
      <!-- </div> -->
   </div>
</template>

<style scoped>
#rotate-message {
   display: block;
   text-align: center;
   background-color: lightyellow;
   padding: 20px;
   font-size: 18px;
   color: red;
}

/* Handy-Container */
.phone {
   width: 100px;
   height: 180px;
   border: 5px solid #333;
   border-radius: 20px;
   position: relative;
   margin: 20px auto;
   animation: rotatePhone 5s infinite ease-in-out;
   transform-origin: 50% 60%;
}

/* Bildschirm des Handys */
.screen {
   width: 80px;
   height: 140px;
   background-color: #ddd;
   border-radius: 15px;
   margin: 10px auto;
}

/* Animation für das Handy (Drehbewegung) */
@keyframes rotatePhone {
   0% {
      transform: rotate(0deg);
   }
   25% {
      transform: rotate(90deg);
   }
   50% {
      transform: rotate(0deg);
   }
   75% {
      transform: rotate(-90deg);
   }
   100% {
      transform: rotate(0deg);
   }
}
</style>
