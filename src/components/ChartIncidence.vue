<template>
   <div class="w-full h-full flex items-center justify-center">
      <div v-if="indicatorData[props.indicatorID]" class="rounded-md border-4 w-full flex-col items-center p-2 scrollbar-w-0 md:text-base text-xs">
         <div class="flex w-full items-center justify-center py-2">
            <div class="w-1/6 flex items-center justify-center border rounded-md">
               <div
                  v-for="(value, index) in chartCategories"
                  :key="value"
                  @click="chartFilterDuration = value"
                  :class="[
                     'w-1/3 h-8 cursor-pointer text-center text-xs flex items-center justify-center',
                     chartFilterDuration === value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black',
                     index === 0 ? 'rounded-l-md' : '', // Abrunden der linken Box
                     index === chartCategories.length - 1 ? 'rounded-r-md' : '', // Abrunden der rechten Box
                  ]"
               >
                  <!-- Input radio (visually hidden) -->
                  <input type="radio" :id="`${canvasId}@@@${value}`" :value="value" v-model="chartFilterDuration" class="hidden" />
                  <!-- Label showing the years -->
                  <label
                     :for="`${canvasId}@@@${value}`"
                     :class="[
                        'w-4/5 h-4/5 cursor-pointer flex justify-center items-center',
                        chartFilterDuration === value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black',
                     ]"
                  >
                     {{ value }}
                  </label>
               </div>
            </div>

            <div class="w-4/6 text-center font-bold text-wrap px-2">{{ indicatorData[props.indicatorID].title }}</div>
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
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12l4 4L19 7" />
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
         <!--    <div class="hidden flex w-full items-center justify-around py-2">
            <div class="w-2/6 flex items-center justify-center">
               <div class="dropdown flex-col item-center w-full">
                  <button class="dropbtn hover:cursor-pointer hover:bg-[#DDDDDD] border-2 p-2 w-full rounded-md">
                     Zeitraum {{ chartFilterDuration }} Jahre
                  </button>
                  <div class="dropdown-content w-full">
                     <div v-for="value in chartCategories" :key="value">
                        <div class="break-words hyphens-auto text-xs">
                           <input type="radio" :id="`${canvasId}@@@${value}`" :value="value" v-model="chartFilterDuration" />
                           <label :for="`${canvasId}@@@${value}`">{{ value }} Jahre</label>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="w-2/6 flex items-center justify-center">
               <div v-if="chartType" class="dropdown flex-col item-center w-full">
                  <button class="dropbtn hover:cursor-pointer hover:bg-[#DDDDDD] border-2 p-2 w-full text-center rounded-md">
                     Diagrammtype {{ chartType.charAt(0).toUpperCase() + chartType.slice(1) }}
                  </button>
                  <div class="dropdown-content w-full text-xs">
                     <a href="#" @click="selectChartType('line')">Line</a>
                     <a href="#" @click="selectChartType('bar')">Bar</a>
                  </div>
               </div>
            </div>
         </div> -->
         <div class="flex items-center w-full">
            <div class="flex aspect-[2/1] w-full border-gray-200 justify-center relative">
               <div class="w-full">
                  <canvas :id="canvasId"></canvas>
               </div>
            </div>
         </div>
      </div>

      <div v-else class="w-full h-[28.5rem] flex justify-center items-center rounded-md border-4">
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
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import Chart from "chart.js/auto";
import { isProxy, toRaw } from "vue";

const myCharts = new Map();

const indicatorData = ref({
   title: "",
   data: [], // Leere Struktur initialisieren
   datasets: [{ label: "", data: [null] }],
});
const chartType = ref("line");
const canvasId = ref(null);
const chartFilterDuration = ref(5);
const currApiDataChart = ref([]);
const chartCategories = ref([1, 3, 5]);
const chartData = ref({
   title: "",
   labels: [],
   datasets: [{ type: "", label: "", data: [null] }],
});

const fontSize = ref(16);

setInterval(() => {
   let size = window.innerWidth;
   if (size >= 1920) {
      fontSize.value = 16;
   } else if (size >= 1080) {
      fontSize.value = 14;
   } else if (size >= 720) {
      fontSize.value = 12;
   } else {
      fontSize.value = 10;
   }
}, 1000);

watch(fontSize, () => {
   updateChart();
});

const props = defineProps({
   indicatorID: {
      type: String,
      required: true,
   },
});

const currentSubcategory = computed(() => props.subcategory);

watch(chartType, (newValue) => {
   chartType.value = newValue;
   updateChart();
});

function delay(ms) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

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
      let rawData = indicatorData.value[canvasId.value]["data"];
      if (isProxy(rawData)) {
         rawData = toRaw(rawData);
      }

      const filterRowData = rawData.filter((item) => {
         const dateString = item["Datum"];
         const dateParts = dateString.split("/");
         const dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
         const currentDate = new Date();
         const lastYearsAgo = new Date();
         let period = chartFilterDuration.value;

         lastYearsAgo.setFullYear(currentDate.getFullYear() - period);
         return dateObject >= lastYearsAgo;
      });

      const hasNonNullNonUndefined = !filterRowData.every((element) => element === null || element === undefined);

      if (hasNonNullNonUndefined) {
         filterRowData.forEach((element, index, array) => {
            if (typeof element === "string" && element.includes(",")) {
               let convertedElement = parseFloat(element.replace(",", "."));
               array[index] = convertedElement;
            } else if (typeof element === "string") {
               array[index] = parseFloat(element);
            }
         });

         let xDate = [];

         filterRowData.forEach((oneDate) => {
            xDate.push(oneDate["Datum"]);
         });

         const columns = Object.keys(filterRowData[0]);

         const matrix = [columns];

         filterRowData.forEach((obj) => {
            const row = columns.map((column) => obj[column]);
            matrix.push(row);
         });

         const headers = matrix[0];

         xDate = matrix.slice(1).map((row) => row[0]);

         const datasets = headers.slice(1).map((header, index) => {
            const data = matrix.slice(1).map((row) => row[index + 1]);

            return {
               label: header,
               data: data,
               pointRadius: 2,
               pointHoverRadius: 5,
               fill: false,
            };
         });

         const initialVisibleDatasetIndex = 0;

         datasets.forEach((dataset, index) => {
            if (index !== initialVisibleDatasetIndex) {
               dataset.hidden = true; // Verberge alle außer den ersten Datensatz
            }
         });

         datasets.forEach((dataset) => {
            dataset.data = dataset.data.map((value) => {
               if (typeof value === "string") {
                  return parseFloat(value.replace(",", "."));
               }
               return value;
            });
         });

         const newChart = new Chart(chartElement, {
            type: chartType.value,
            data: {
               labels: xDate,
               datasets: datasets,
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

         myCharts.set(canvasId.value, newChart);

         /*          // Update the custom legend dropdown
         updateLegendDropdown(datasets); */
      }
   }
}

// Funktion, um Dropdown-Optionen für die Legende zu aktualisieren
function updateLegendDropdown(datasets) {
   const dropdown = document.getElementById("chartLegendDropdown");
   dropdown.innerHTML = `<option value="">Wähle eine Legende aus</option>`; // Leeren Dropdown

   datasets.forEach((dataset, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.text = dataset.label;
      dropdown.appendChild(option);
   });
}

// Funktion, um die Sichtbarkeit der Datensätze basierend auf der Dropdown-Auswahl zu steuern
function updateChartDatasetVisibility(selectElement) {
   const chart = myCharts.get(canvasId.value);
   const selectedIndex = selectElement.value;

   if (chart && selectedIndex !== "") {
      chart.data.datasets.forEach((dataset, index) => {
         dataset.hidden = index !== parseInt(selectedIndex);
      });
      chart.update();
   }
}

async function getIncidenceData(IncId) {
   try {
      const response = await fetch(`http://localhost:5600/data?id=${IncId}`);
      const data = await response.json();

      const keysToCheck = Object.keys(data.data[0]);
      let keysToRemove = [];

      keysToCheck.forEach((key) => {
         const allNull = data.data.every((entry) => entry[key] === null);
         if (allNull) {
            keysToRemove.push(key);
         }
      });

      data.data.forEach((entry) => {
         keysToRemove.forEach((key) => {
            delete entry[key];
         });
      });

      Object.keys(data.data).forEach((element) => {
         Object.keys(data.data[element]).forEach((element2) => {
            if (element2.includes("VerÃ¤nderung") || element2.includes("gegenÃ¼ber")) {
               let correctedElement2 = element2.replace("VerÃ¤nderung", "Veränderung").replace("gegenÃ¼ber", "gegenüber");
               data.data[element][correctedElement2] = data.data[element][element2];
               delete data.data[element][element2];
            }
         });
      });

      data.data = data.data.map((entry) => {
         if (entry.hasOwnProperty("Datum")) {
            let newEntry = { Datum: entry["Datum"] };
            delete entry["Datum"];
            return { ...newEntry, ...entry };
         }
         return entry;
      });
      let cleanedText = data.title.replace("(Öffnet neues Fenster)", "").trim();
      data.title = cleanedText;

      indicatorData.value[IncId] = data;
   } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
   }
}

watch(
   () => chartFilterDuration.value,
   (newValue) => {
      updateChart();
   },
   { immediate: true }
);

onMounted(async () => {
   while (props.indicatorID == (null || undefined)) {
      console.log("Warte auf daten");
      await delay(2000);
   }
   canvasId.value = props.indicatorID;
   await getIncidenceData(props.indicatorID);
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
   border-radius: 0.25rem;
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
</style>
