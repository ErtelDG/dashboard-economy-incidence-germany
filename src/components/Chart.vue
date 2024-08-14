<template>
   <div class="w-full h-full flex items-center justify-center">
      <div v-if="chartCategories[0]" class="rounded-md border-4 w-full flex-col items-center p-2 scrollbar-w-0">
         <div class="flex w-full items-center justify-center py-2">
            <div class="w-1/6 flex items-center justify-center">
               <div v-if="chartData.datasets[0].data.every((element) => element != null)" class="dropdown flex-col item-center">
                  <button class="dropbtn hover:cursor-pointer hover:bg-[#DDDDDD] border-2 px-4 py-2">
                     Chart Type: {{ chartType.charAt(0).toUpperCase() + chartType.slice(1) }}
                  </button>
                  <div class="dropdown-content w-full">
                     <a href="#" @click="selectChartType('line')">Line</a>
                     <a href="#" @click="selectChartType('bar')">Bar</a>
                  </div>
               </div>
            </div>
            <div class="w-5/6 flex justify-center items-center text-xl font-bold">{{ chartData.title }}</div>
         </div>
         <div class="flex items-center w-full">
            <table class="text-wrap w-1/6 border-gray-200 p-2">
               <tr>
                  <th class="text-lg border-2 border-solid border-[#dddddd]">Kategorie</th>
               </tr>
               <tr v-for="(value, category) in chartCategories[0]" :key="category" class="border-2 border-solid border-[#dddddd]">
                  <td v-if="category !== 'Datum'" class="border-2 p-2 border-solid border-[#dddddd] flex gap-2">
                     <input type="radio" :id="category" :value="category" v-model="chartFilter" />
                     <label :for="category">{{ category }}</label>
                  </td>
               </tr>
            </table>
            <div class="flex aspect-[2/1] w-5/6 border-gray-200 p-2 justify-center relative">
               <div
                  v-if="!chartData.datasets[0].data.every((element) => element != null)"
                  class="text-center flex items-center justify-center font-bold absolute inset-0"
               >
                  <div class="flex items-center px-4 py-2 shadow rounded-md text-white bg-gray-800">
                     Bitte eine Kategorie auswählen um Chart anzeigen zu lassen ...
                  </div>
               </div>
               <div class="w-full">
                  <canvas :id="canvasId"></canvas>
               </div>
            </div>
         </div>
      </div>
      <div v-else class="w-full min-h-full flex justify-center items-center">
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
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import Chart from "chart.js/auto";

// Track the current chart instance
const myCharts = new Map(); // Use a Map to store multiple chart instances

// Reactive references
const chartType = ref("line");
const canvasId = ref("");
const chartFilter = ref("");
const currApiDataChart = ref([]);
const chartCategories = ref([]);
const chartData = ref({
   title: "",
   labels: [],
   datasets: [{ type: "", label: "", data: [null] }],
});

// Computed property for subcategory
const currentSubcategory = computed(() => props.subcategory);

watch(chartType, (newValue) => {
   chartType.value = newValue;
   updateChart();
});

// Function to initialize and update the chart
function updateChart() {
   const chartElement = document.getElementById(canvasId.value);
   if (chartElement) {
      // Destroy the old chart if it exists
      if (myCharts.has(canvasId.value)) {
         myCharts.get(canvasId.value).destroy();
         myCharts.delete(canvasId.value);
      }

      chartData.value.datasets[0].data.forEach((element, index, array) => {
         if (typeof element === "string" && element.includes(",")) {
            let convertedElement = parseFloat(element.replace(",", "."));
            array[index] = convertedElement;
         } else if (typeof element === "string") {
            array[index] = parseFloat(element);
         }
      });

      // Create a new chart
      const newChart = new Chart(chartElement, {
         type: chartType.value,
         data: {
            labels: chartData.value.labels,
            datasets: [
               {
                  label: chartData.value.datasets[0].label,
                  data: chartData.value.datasets[0].data,
               },
            ],
         },
      });

      // Store the new chart instance
      myCharts.set(canvasId.value, newChart);
   }
}

// Props to receive API data
const props = defineProps({
   subcategory: {
      type: String,
      required: true,
   },
   apiData: {
      type: Object,
      required: true,
   },
});

// Watchers
watch(chartFilter, (newFilter) => {
   if (newFilter && currApiDataChart.value[currentSubcategory.value].data.length > 0) {
      const labels = [];
      const data = [];

      currApiDataChart.value[currentSubcategory.value].data.forEach((element) => {
         labels.push(element["Datum"]);
         data.push(element[newFilter]);
      });
      chartData.value = {
         ...chartData.value,
         labels,
         datasets: [
            {
               label: chartFilter,
               data,
            },
         ],
      };

      updateChart();
   }
});

// Hilfsfunktion für die Verzögerung
function delay(ms) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

watch(
   () => props.apiData,
   async (newData) => {
      while (!newData || !newData[currentSubcategory.value]) {
         await delay(2000);
      }

      canvasId.value = `${newData[currentSubcategory.value].category}-${currentSubcategory.value}`;
      chartData.value.title = newData[currentSubcategory.value].title;
      chartCategories.value = newData[currentSubcategory.value].data;
      currApiDataChart.value = newData;

      if (!chartFilter.value) {
         chartFilter.value = chartCategories.value[0];
      }

      updateChart();
   },
   { immediate: true }
);

onMounted(() => {
   if (canvasId.value) {
      updateChart(); // Ensure chart is updated when component is mounted
   }
});

const { subcategory } = props;

function selectChartType(type) {
   chartType.value = type;
}
</script>

<style scoped>
tr:nth-child(even) {
   background-color: #dddddd;
}
.scrollbar-w-0 {
   scrollbar-width: none;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
   position: relative;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
   display: none;
   position: absolute;
   background-color: #f9f9f9;
   box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
   z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
   color: black;
   padding: 0.5rem 1rem;
   text-decoration: none;
   display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
   background-color: #f1f1f1;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
   display: block;
}
</style>
