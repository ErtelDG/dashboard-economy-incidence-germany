<template>
   <div class="w-full h-full flex items-start justify-center">
      <div v-if="chartCategories[0]" class="rounded-md border-4 w-11/12 sm:w-full flex-col items-center p-2 scrollbar-w-0">
         <div class="flex w-full items-center justify-center py-2">
            <div class="w-1/6 flex items-center justify-center">
               <div class="dropdown flex-col item-center w-full">
                  <button class="dropbtn hover:cursor-pointer hover:bg-[#DDDDDD] border-2 p-2 w-full text-sm rounded-md">Kategorie</button>
                  <div class="dropdown-content w-full">
                     <div v-for="(value, category) in chartCategories[10]" :key="category">
                        <div
                           v-if="
                              category !== 'Datum' &&
                              !isNaN(parseFloat(String(value).replace(',', '.'))) &&
                              isFinite(parseFloat(String(value).replace(',', '.')))
                           "
                        >
                           <div class="break-words hyphens-auto text-xs">
                              <input type="radio" :id="`${category}@@@${subcategory}`" :value="category" v-model="chartFilter" />
                              <label :for="`${category}@@@${subcategory}`">{{ category }}</label>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="w-4/6 text-center font-bold text-wrap px-4">{{ chartData.title }}</div>
            <!--  <div class="w-1/6 flex items-center justify-center">
               <div v-if="chartData.datasets[0].data.every((element) => element != null)" class="dropdown flex-col item-center w-full">
                  <button class="dropbtn hover:cursor-pointer hover:bg-[#DDDDDD] border-2 p-2 w-full text-center text-sm rounded-md">Diagrammtype</button>
                  <div class="dropdown-content w-full text-xs">
                     <a href="#" @click="selectChartType('line')">Line</a>
                     <a href="#" @click="selectChartType('bar')">Bar</a>
                  </div>
               </div>
            </div> -->
            <div class="w-1/6 flex items-center justify-center">
               <div v-if="chartType" class="flex items-center justify-center gap-x-2 w-full">
                  <!-- Line Chart Symbol -->
                  <div
                     @click="selectChartType('line')"
                     :class="['rounded-md border cursor-pointer', chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200']"
                     class="flex justify-center items-center w-8 h-8"
                  >
                     <!-- Icon for Line Chart (you can replace this with an actual icon) -->
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4/5 h-4/5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v18h18M4 14l4-5 5 5 6-9" />
                     </svg>
                  </div>

                  <!-- Bar Chart Symbol -->
                  <div
                     @click="selectChartType('bar')"
                     :class="['rounded-md border cursor-pointer', chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200']"
                     class="flex justify-center items-center w-8 h-8"
                  >
                     <!-- Icon for Bar Chart (small, fitting within w-2 h-2) -->
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4/5 h-4/5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h4v10H3V10zm7-5h4v15h-4V5zm7 8h4v7h-4v-7z" />
                     </svg>
                  </div>
               </div>

               <!--               <div v-if="chartType" class="dropdown flex-col item-center w-full">
                  <button class="dropbtn hover:cursor-pointer hover:bg-[#DDDDDD] border-2 p-2 w-full text-center text-sm rounded-md">
                     {{ chartType.charAt(0).toUpperCase() + chartType.slice(1) }}
                  </button>
                  <div class="dropdown-content w-full text-xs">
                     <a href="#" @click="selectChartType('line')">Line</a>
                     <a href="#" @click="selectChartType('bar')">Bar</a>
                  </div>
               </div> -->
            </div>
         </div>
         <div class="flex items-center w-full">
            <div class="flex aspect-[2/1] w-full border-gray-200 p-2 justify-center relative">
               <div
                  v-if="!chartData.datasets[0].data.every((element) => element != null)"
                  class="text-center flex items-center justify-center font-bold absolute inset-0"
               >
                  <div class="flex items-center px-4 py-2 shadow rounded-md text-white bg-gray-800">
                     &#8593; Bitte Kategorie auswählen um Chart anzeigen zu lassen.
                  </div>
               </div>
               <div class="w-full">
                  <canvas :id="canvasId"></canvas>
               </div>
            </div>
         </div>
      </div>
      <div v-else class="w-full min-h-full flex justify-center items-center"></div>
   </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import Chart from "chart.js/auto";

// Track the current chart instance
const myCharts = new Map(); // Use a Map to store multiple chart instances

// Reactive references
const chartType = ref("line");
const canvasId = ref(null);
const chartFilter = ref("");
const currApiDataChart = ref([]);
const chartCategories = ref([]);
const chartData = ref({
   title: "",
   labels: [],
   datasets: [{ type: "", label: "", data: [null] }],
});

const fontSize = ref(16);

setInterval(() => {
   let size = window.innerWidth;
   if (size >= 1920) {
      fontSize.value = 14;
   } else if (size >= 1080) {
      fontSize.value = 12;
   } else if (size >= 720) {
      fontSize.value = 10;
   } else {
      fontSize.value = 8;
   }
}, 1000);

watch(fontSize, () => {
   updateChart();
});

// Computed property for subcategory
const currentSubcategory = computed(() => props.subcategory);

watch(chartType, (newValue) => {
   chartType.value = newValue;
   updateChart();
});

// Function to initialize and update the chart
async function updateChart() {
   let chartElement = null;

   while (chartElement === null) {
      chartElement = document.getElementById(canvasId.value);
      await delay(100);
   }

   if (chartElement) {
      // Destroy the old chart if it exists
      if (myCharts.has(canvasId.value)) {
         myCharts.get(canvasId.value).destroy();
         myCharts.delete(canvasId.value);
      }
      const hasNonNullNonUndefined = !chartData.value.datasets[0].data.every((element) => element === null || element === undefined);

      if (hasNonNullNonUndefined) {
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
                     pointRadius: 1,
                     pointHoverRadius: 5,
                     fill: false,
                  },
               ],
            },
            options: {
               maintainAspectRatio: false,
               responsive: true,
               scales: {
                  x: {
                     ticks: {
                        padding: 8,
                        align: "center",
                        maxTicksLimit: 6,
                        autoSkip: true, // Automatisches Überspringen von Ticks aktivieren
                        maxRotation: 0, // Maximal 0 Grad Rotation (horizontal)
                        minRotation: 0, // Minimal 0 Grad Rotation (horizontal)
                        font: {
                           size: fontSize.value,
                        },
                     },
                  },
                  y: {
                     ticks: {
                        padding: 4,
                        font: {
                           size: fontSize.value,
                        },
                     },
                  },
               },
               plugins: {
                  legend: {
                     display: false, // Deaktiviert die Standardlegende von Chart.js
                  },
               },
               layout: {
                  padding: {
                     left: window.innerWidth * 0.01,
                     right: window.innerWidth * 0.01,
                     top: window.innerHeight * 0.02,
                     bottom: window.innerHeight * 0.02,
                  },
               },
            },
         });

         // Store the new chart instance
         myCharts.set(canvasId.value, newChart);
      }
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
   if (newFilter && currApiDataChart.value.data.length > 0) {
      const labels = [];
      const data = [];

      currApiDataChart.value.data.forEach((element) => {
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
      while (!newData && !newData.subcategory) {
         await delay(2000);
      }
      canvasId.value = `${newData.category}-${newData.id}`;
      chartData.value.title = newData.title;
      chartCategories.value = newData.data;
      currApiDataChart.value = newData;

      if (!chartFilter.value) {
         chartFilter.value = chartCategories.value[0];
      }

      updateChart();
   },
   { immediate: true }
);

onMounted(async () => {
   while (Object.keys(props.apiData).length <= 0 && props.apiData.id == (null || undefined)) {
      console.log("Warte auf daten"); // Sollte in der Schleife ausgeführt werden
      await delay(2000); // Wartezeit
   }

   updateChart();
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
.dropdown-content a,
.dropdown-content label {
   color: black;
   text-decoration: none;
   display: block;
   padding: 0.5rem;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover,
.dropdown-content label:hover {
   background-color: #f1f1f1;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
   display: block;
}

/* Hide radio buttons */
input[type="radio"] {
   display: none;
}

/* Style labels to look like links */
label {
   cursor: pointer;
   color: black;
   text-decoration: none;
   display: block;
   padding: 0.5rem;
}

/* Change color of labels on hover */
label:hover {
   background-color: #f1f1f1;
}

/* Change color of selected label */
input[type="radio"]:checked + label {
   background-color: #ddd;
}
</style>
