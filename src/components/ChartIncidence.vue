<template>
   <div class="w-full h-full flex items-center justify-center">
      <div v-if="indicatorData[props.indicatorID]" class="rounded-md border-4 w-full flex-col items-center p-2 scrollbar-w-0">
         <div class="flex w-full items-center justify-center py-2">
            <div class="w-1/6 flex items-center justify-center"></div>
            <div class="w-4/6 text-center font-bold text-wrap px-4">{{ indicatorData[props.indicatorID].title }}</div>
            <div class="w-1/6 flex items-center justify-center">
               <div v-if="chartData.datasets[0].data.every((element) => element != null)" class="dropdown flex-col item-center w-full">
                  <button class="dropbtn hover:cursor-pointer hover:bg-[#DDDDDD] border-2 p-2 w-full text-center text-sm">Diagrammtype</button>
                  <div class="dropdown-content w-full text-xs">
                     <a href="#" @click="selectChartType('line')">Line</a>
                     <a href="#" @click="selectChartType('bar')">Bar</a>
                  </div>
               </div>
            </div>
         </div>
         <div class="flex items-center w-full">
            <div class="flex aspect-[2/1] w-full border-gray-200 p-2 justify-center relative">
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

// Track the current chart instance
const myCharts = new Map(); // Use a Map to store multiple chart instances

// Reactive references
const indicatorData = ref({
   title: "",
   labels: [],
   datasets: [{ type: "", label: "", data: [null] }],
});
const chartType = ref("line");
const canvasId = ref(null);
const chartFilter = ref("");
const currApiDataChart = ref([]);
const chartCategories = ref("1");
const chartData = ref({
   title: "",
   labels: [],
   datasets: [{ type: "", label: "", data: [null] }],
});

// Props to receive API data
const props = defineProps({
   indicatorID: {
      type: String,
      required: true,
   },
});

// Computed property for subcategory
const currentSubcategory = computed(() => props.subcategory);

watch(chartType, (newValue) => {
   chartType.value = newValue;
   updateChart();
});

// Hilfsfunktion für die Verzögerung
function delay(ms) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to initialize and update the chart
async function updateChart() {
   let chartElement = null;

   while (chartElement === null) {
      chartElement = document.getElementById(canvasId.value);
      await delay(100);
   }
   console.log(chartElement);
   if (chartElement) {
      // Destroy the old chart if it exists
      if (myCharts.has(canvasId.value)) {
         myCharts.get(canvasId.value).destroy();
         myCharts.delete(canvasId.value);
      }
      console.log(indicatorData.value[canvasId.value]);
      const hasNonNullNonUndefined = !indicatorData.value[canvasId.value].data.every((element) => element === null || element === undefined);

      if (hasNonNullNonUndefined) {
         indicatorData.value[canvasId.value].data.forEach((element, index, array) => {
            if (typeof element === "string" && element.includes(",")) {
               let convertedElement = parseFloat(element.replace(",", "."));
               array[index] = convertedElement;
            } else if (typeof element === "string") {
               array[index] = parseFloat(element);
            }
         });

         let xDate = [];
         let yData = [];
         let yDataItems;

         indicatorData.value[canvasId.value].data.forEach((oneDate) => {
            xDate.push(oneDate["Datum"]);
         });
         console.log(xDate);

         const columns = Object.keys(indicatorData.value[canvasId.value].data[0]);

         // Erzeuge die Matrix, wobei die erste Zeile die Spaltennamen enthält
         const matrix = [columns];

         // Füge jede Datenzeile zur Matrix hinzu
         indicatorData.value[canvasId.value].data.forEach((obj) => {
            const row = columns.map((column) => obj[column]);
            matrix.push(row);
         });

         // Extrahiere die Spaltennamen
         const headers = matrix[0];

         // Extrahiere die Datumswerte (x-Achse Labels)
         xDate = matrix.slice(1).map((row) => row[0]);

         // Erstelle ein Dataset für jeden Indikator (außer 'Datum', also ab Index 1)
         const datasets = headers.slice(1).map((header, index) => {
            // index + 1, da der erste Index 0 die "Datum"-Spalte ist
            const data = matrix.slice(1).map((row) => row[index + 1]);

            return {
               label: header, // Der Name des Indikators
               data: data, // Die Werte für diesen Indikator
               pointRadius: 2,
               pointHoverRadius: 5,
               fill: false, // Damit die Linien nicht gefüllt sind (falls es ein Liniendiagramm ist)
            };
         });

         // Wähle den Datensatz, der am Anfang sichtbar sein soll (z.B. der erste Datensatz)
         const initialVisibleDatasetIndex = 0; // Zeige nur den ersten Datensatz

         // Setze die anderen Datensätze auf 'hidden' bei der Initialisierung
         datasets.forEach((dataset, index) => {
            if (index !== initialVisibleDatasetIndex) {
               dataset.hidden = true; // Verstecke alle Datensätze außer dem ersten
            }
         });

         // Wandle alle Komma-Werte in Zahlen mit Punkt um und speichere sie als Floats
         datasets.forEach((dataset) => {
            dataset.data = dataset.data.map((value) => {
               if (typeof value === "string") {
                  // Ersetze Komma durch Punkt und konvertiere zu Float
                  return parseFloat(value.replace(",", "."));
               }
               return value; // Wenn es schon eine Zahl ist, nichts ändern
            });
         });

         const newChart = new Chart(chartElement, {
            type: chartType.value, // Der Diagrammtyp (z.B. 'line')
            data: {
               labels: xDate, // Die x-Achse (Datumswerte)
               datasets: datasets, // Alle Datasets für die Indikatoren
            },
            options: {
               responsive: true,
               plugins: {
                  legend: {
                     onClick: function (e, legendItem, legend) {
                        // Holen der aktuellen Sichtbarkeit des angeklickten Datensatzes
                        const ci = legend.chart;
                        const index = legendItem.datasetIndex;

                        // Setze alle Datensätze auf unsichtbar
                        ci.data.datasets.forEach(function (dataset, i) {
                           if (i === index) {
                              // Zeige den angeklickten Datensatz
                              dataset.hidden = false;
                           } else {
                              // Verstecke alle anderen Datensätze
                              dataset.hidden = true;
                           }
                        });

                        // Aktualisiere den Chart
                        ci.update();
                     },
                  },
               },
            },
         });

         // Store the new chart instance
         myCharts.set(canvasId.value, newChart);
      }
   }
}

// Watchers
/* watch(chartFilter, (newFilter) => {
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
}); */

// Hilfsfunktion für die Verzögerung
/* function delay(ms) {
   return new Promise((resolve) => setTimeout(resolve, ms));
} */

async function getIncidenceData(IncId) {
   try {
      const response = await fetch(`http://localhost:5600/data?id=${IncId}`);
      const data = await response.json();
      Object.keys(data.data).forEach((element) => {
         Object.keys(data.data[element]).forEach((element2) => {
            if (element2.includes("VerÃ¤nderung") || element2.includes("gegenÃ¼ber")) {
               let correctedElement2 = element2.replace("VerÃ¤nderung", "Veränderung").replace("gegenÃ¼ber", "gegenüber");
               data.data[element][correctedElement2] = data.data[element][element2];
               delete data.data[element][element2];
            }
         });
      });
      indicatorData.value[IncId] = data; // Speichern Sie die Daten im reaktiven Objekt
   } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
   }
}

watch(
   () => props.indicatorID,
   async (newData) => {
      console.log(newData);
      //canvasId.value = `${newData.category}-${newData.id}`;
      //chartData.value.title = newData.title;
      //chartCategories.value = newData.data;
      //currApiDataChart.value = newData;

      //if (!chartFilter.value) {
      //   chartFilter.value = chartCategories.value[0];
      //}

      // updateChart();
   },
   { immediate: true }
);

onMounted(async () => {
   while (props.indicatorID == (null || undefined)) {
      console.log("Warte auf daten"); // Sollte in der Schleife ausgeführt werden
      await delay(2000); // Wartezeit
   }
   canvasId.value = props.indicatorID;
   await getIncidenceData(props.indicatorID);
   console.log(indicatorData.value);
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
