<template>
  HIER WEITER!!!!!!!
   <div class="flex flex-col flex-1 overflow-y-auto scrollbar-w-0 w-full relative">
      <div class="w-full flex flex-col flex-1">
         <div class="w-full h-full flex flex-wrap justify-around items-start px-2 py-4 custom-height overflow-hidden">
            <div v-for="indicator in indicators && !indicators" :key="indicator" class="mb-4 w-[48rem]">
               <Chart v-if="indicatorData[indicator]" :indicator="indicator" :indicatorData="indicatorData[indicator]" />
               <div v-if="!indicatorData[indicator]" class="w-full h-[28.5rem] flex justify-center items-center rounded-md border-4">
                  <div>
                     <button
                        type="button"
                        class="inline-flex items-center px-4 py-2 font-semibold leading-6 shadow rounded-md text-white bg-gray-800 transition ease-in-out duration-150 cursor-not-allowed"
                        disabled=""
                     >
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                           <path
                              class="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                           ></path>
                        </svg>
                        Bitte warten, Daten werden geladen...
                     </button>
                  </div>
               </div>
            </div>
            <div v-if="indicators.length % 2 == 1" class="mb-4 w-[48rem]"></div>
            <div v-if="indicators.length === 0">
               <div role="alert" class="rounded border-s-4 border-red-500 bg-red-50 p-4">
                  <strong class="block font-medium text-red-800">Keine Kategorie ausgewählt.</strong>

                  <p class="mt-2 text-sm text-red-700">
                     Aktuell ist keine Kategorie ausgewählt. Bitte mindestens einen Kategorie auswählen, um einen Chart anzeigen zu lassen.
                  </p>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import Chart from "./Chart.vue";
import { useStore } from "vuex";

const store = useStore();
const indicators = ref();
const indicatorData = ref({});

watch(
   () => store.state.indicatore,
   (newData, oldData) => {
      indicators.value = newData.leadingIndicators.example;
   },
   { immediate: true }
);
</script>

<style scoped>
.tile-footer-module_link__FmOx3 {
   display: none;
}
</style>
