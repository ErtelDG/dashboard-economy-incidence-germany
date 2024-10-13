<template>
   <div class="w-full h-full flex items-start justify-center text-xxs sm:text-base">
      <div v-if="chartCategories[0]" class="rounded-md border-4 w-11/12 sm:w-full flex-col items-center p-2 scrollbar-w-0">
         <div class="flex w-full items-center justify-center py-2">
            <div class="w-1/6 flex items-center justify-center">
               <div class="dropdown flex-col item-center w-full">
                  <button class="dropbtn hover:cursor-pointer hover:bg-[#DDDDDD] border-2 sm:p-2 w-full rounded-md text-center flex justify-center items-center h-6 sm:h-8">Klasse</button>
                  <div class="dropdown-content sm:w-full rounded-md h-40 sm:h-72 overflow-scroll scrollbar-w-0">
                     <div v-for="(value, category) in chartCategories[10]" :key="category">
                        <div
                           v-if="
                              category !== 'Datum' &&
                              !isNaN(parseFloat(String(value).replace(',', '.'))) &&
                              isFinite(parseFloat(String(value).replace(',', '.')))
                           "
                        >
                           <div class="break-words hyphens-auto hover:cursor-pointer hover:bg-gray-700">
                              <input type="radio" :id="`${category}@@@${subcategory}`" :value="category" v-model="chartFilter" />
                              <label :for="`${category}@@@${subcategory}`">{{ category }}</label>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="w-4/6 text-center font-bold text-wrap px-4">{{ chartData.title }}</div>

            <div class="w-1/6 flex items-center justify-center">
               <div v-if="chartType" class="flex items-center justify-center gap-x-1 sm:gap-x-2 w-full">
                  <div
                     @click="selectChartType('line')"
                     :class="['rounded-md border cursor-pointer ', chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200']"
                     class="flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4/5 h-4/5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v18h18M4 14l4-5 5 5 6-9" />
                     </svg>
                  </div>

                  <div
                     @click="selectChartType('bar')"
                     :class="['rounded-md border cursor-pointer', chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200']"
                     class="flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4/5 h-4/5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h4v10H3V10zm7-5h4v15h-4V5zm7 8h4v7h-4v-7z" />
                     </svg>
                  </div>
               </div>
            </div>
         </div>
         <div class="flex items-center w-full text-xxs sm:text-base">
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

const myCharts = new Map();

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

const fontSize = ref();

setInterval(() => {
   let size = window.innerWidth;
   fontSize.value = size >= 1080 ? 16 : size >= 720 ? 14 : 10;
}, 1000);

watch(fontSize, () => {
   updateChart();
});

const currentSubcategory = computed(() => props.subcategory);

watch(chartType, (newValue) => {
   chartType.value = newValue;
   updateChart();
});

async function updateChart() {
   let chartElement = null;

   while (chartElement === null) {
      chartElement = document.getElementById(canvasId.value);
      await delay(100);
   }

   if (chartElement) {
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

         const currentDate = new Date();
         const fiveYearsAgo = new Date();
         fiveYearsAgo.setFullYear(currentDate.getFullYear() - 3);

         const filteredData = [];
         const filteredLabels = [];

         chartData.value.labels.forEach((label, index) => {
            const [day, month, year] = label.split("/").map(Number);
            const labelDate = new Date(year, month - 1, day);
            if (labelDate >= fiveYearsAgo && labelDate <= currentDate) {
               filteredLabels.push(label);
               filteredData.push(chartData.value.datasets[0].data[index]);
            }
         });

         const newChart = new Chart(chartElement, {
            type: chartType.value,
            data: {
               labels: filteredLabels,
               datasets: [
                  {
                     label: chartData.value.datasets[0].label,
                     data: filteredData,
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
                        padding: 4,
                        align: "center",
                        maxTicksLimit: 3,
                        autoSkip: true,
                        maxRotation: 0,
                        minRotation: 0,
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
                     display: false,
                  },
               },
               layout: {
                  padding: {
                     left: window.innerWidth * 0.01,
                     right: window.innerWidth * 0.01,
                     top: window.innerHeight * 0.01,
                     bottom: window.innerHeight * 0.01,
                  },
               },
            },
         });

         myCharts.set(canvasId.value, newChart);
      }
   }
}

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
      await delay(2000);
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

.dropdown {
   position: relative;
}

.dropdown-content {
   display: none;
   position: absolute;
   background-color: #f9f9f9;
   box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
   z-index: 1;
}

.dropdown-content a,
.dropdown-content label {
   color: black;
   text-decoration: none;
   display: block;
   padding: 0.5rem;
}

.dropdown-content a:hover,
.dropdown-content label:hover {
   background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
   display: block;
}

input[type="radio"] {
   display: none;
}

label {
   cursor: pointer;
   color: black;
   text-decoration: none;
   display: block;
   padding: 0.5rem;
}

label:hover {
   background-color: #f1f1f1;
}

input[type="radio"]:checked + label {
   background-color: #ddd;
}

.scrollbar-w-0 {
   scrollbar-width: none;
}
</style>
