<template>
   <canvas :id="canvasId"></canvas>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import Chart, { Ticks } from "chart.js/auto";
import "chartjs-adapter-date-fns";

// Track the current chart instance
const myCharts = new Map(); // Use a Map to store multiple chart instances

// Reactive references
const chartType = ref("line");
const canvasId = ref("stockChart5");
Chart.defaults.elements.line["borderWidth"] = 1;

const chartData = ref({
   title: "Indizes",
   labels: ["Tag 1"],
   datasets: [
      {
         type: "line",
         label: "DAX",
         data: [15300],
      },
   ],
});

// Function to initialize and update the chart
async function updateChart() {
   console.log("async function updateChart()");
   let chartElement = null;

   // Warte, bis das Canvas-Element im DOM verfügbar ist
   while (chartElement === null) {
      chartElement = document.getElementById(canvasId.value);
      await new Promise((resolve) => setTimeout(resolve, 100)); // Verzögerung von 100ms
   }

   if (chartElement) {
      // Zerstöre das alte Chart, falls vorhanden
      if (myCharts.has(canvasId.value)) {
         myCharts.get(canvasId.value).destroy();
         myCharts.delete(canvasId.value);
      }

      // Überprüfe, ob es gültige Datenpunkte gibt
      const hasNonNullNonUndefined = chartData.value.datasets.some((dataset) => dataset.data.some((element) => element !== null && element !== undefined));

      if (hasNonNullNonUndefined) {
         // Erstelle ein neues Chart
         try {
            const newChart = new Chart(chartElement, {
               type: chartType.value, // Typ des Charts (z.B. 'line')
               data: chartData.value, // Verwende das reaktive chartData-Objekt
               options: {
                  responsive: true,
                  plugins: {
                     title: {
                        display: true,
                        text: chartData.value.title,
                     },
                  },
                  scales: {
                     x: {
                        offset: true,
                        title: {
                           display: true,
                           text: "Jahr",
                        },
                        type: "time", // Verwende den Zeitachsentyp
                        time: {
                           unit: "day", // Zeitintervall für die Datenpunkte
                           tooltipFormat: "ll", // Format für das Tooltip
                        },
                        ticks: {
                           autoSkip: true, // Automatisch Ticks überspringen
                           maxTicksLimit: 3,
                           callback: function (value, index, values) {
                              // Extrahiere nur das Jahr aus dem Datumswert
                              const date = new Date(value);
                              return date.getFullYear(); // Zeigt nur das Jahr an
                           },
                           autoSkip: true, // Automatisch Labels überspringen, wenn es zu viele gibt
                        },
                     },
                     y: {
                        title: {
                           display: true,
                        },
                     },
                  },
               },
            });

            // Speichere die neue Chart-Instanz
            myCharts.set(canvasId.value, newChart);
         } catch (error) {
            console.error("Fehler beim Erstellen des Charts:", error);
         }
      }
   } else {
      console.warn("Canvas-Element nicht gefunden.");
   }
}

// Props to receive API data
const props = defineProps({
   stockTicker: {
      type: Object,
      required: true,
   },
});

// Define an asynchronous function
async function fetchData(URL) {
   try {
      const response = await fetch(URL, { method: "GET", redirect: "follow" });

      if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result;
   } catch (error) {
      console.error("Fetch error:", error);
      throw error;
   }
}

function prepareChartData(results) {
   // Get the current year
   const currentYear = new Date().getFullYear();

   // Extrahiere alle einzigartigen Datumswerte aus den Daten
   const uniqueDates = Array.from(new Set(results.flatMap((result) => result.data.data.map((entry) => entry.date))))
      .sort()
      .filter((date) => {
         const year = new Date(date).getFullYear();
         return year >= currentYear - 2; // Keep only the last three years
      });

   // Erstelle die chartData-Struktur
   const chartData = {
      title: "Aktienindex",
      labels: uniqueDates,
      datasets: results.map((result) => ({
         type: "line",
         label: result.symbol,
         data: uniqueDates.map((date) => {
            // Finde den Preis für das aktuelle Datum
            const entry = result.data.data.find((e) => e.date === date);
            return entry ? entry.price : null; // null, falls kein Preis für dieses Datum vorhanden ist
         }),
         borderWidth: 1,
         pointRadius: 0,
         fill: false,
      })),
   };

   return chartData;
}

onMounted(async () => {
   try {
      const results = await Promise.all(
         Object.keys(props.stockTicker).map(async (element) => {
            const requestURL = `http://127.0.0.1:5601/stock/?symbol=${element}`;
            const data = await fetchData(requestURL);
            return { symbol: element, data }; // Return the symbol and the fetched data
         })
      );

      chartData.value = prepareChartData(results);

      // Update the chart with new data
      await updateChart(chartData.value);
   } catch (error) {
      console.error("Error processing stock tickers:", error);
   }
});
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
