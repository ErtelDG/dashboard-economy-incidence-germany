<template>
   <canvas :id="canvasId"></canvas>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import Chart, { Ticks } from "chart.js/auto";
import "chartjs-adapter-date-fns";

const myCharts = new Map();
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

async function updateChart() {
   console.log("async function updateChart()");
   let chartElement = null;

   while (chartElement === null) {
      chartElement = document.getElementById(canvasId.value);
      await new Promise((resolve) => setTimeout(resolve, 100));
   }

   if (chartElement) {
      if (myCharts.has(canvasId.value)) {
         myCharts.get(canvasId.value).destroy();
         myCharts.delete(canvasId.value);
      }

      const hasNonNullNonUndefined = chartData.value.datasets.some((dataset) => dataset.data.some((element) => element !== null && element !== undefined));

      if (hasNonNullNonUndefined) {
         try {
            const newChart = new Chart(chartElement, {
               type: chartType.value,
               data: chartData.value,
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
                        type: "time",
                        time: {
                           unit: "day",
                           tooltipFormat: "ll",
                        },
                        ticks: {
                           autoSkip: true,
                           maxTicksLimit: 3,
                           callback: function (value, index, values) {
                              const date = new Date(value);
                              return date.getFullYear();
                           },
                           autoSkip: true,
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

            myCharts.set(canvasId.value, newChart);
         } catch (error) {
            console.error("Fehler beim Erstellen des Charts:", error);
         }
      }
   } else {
      console.warn("Canvas-Element nicht gefunden.");
   }
}

const props = defineProps({
   stockTicker: {
      type: Object,
      required: true,
   },
});

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
   const currentYear = new Date().getFullYear();

   const uniqueDates = Array.from(new Set(results.flatMap((result) => result.data.data.map((entry) => entry.date))))
      .sort()
      .filter((date) => {
         const year = new Date(date).getFullYear();
         return year >= currentYear - 2; 
      });

   const chartData = {
      title: "Aktienindex",
      labels: uniqueDates,
      datasets: results.map((result) => ({
         type: "line",
         label: result.symbol,
         data: uniqueDates.map((date) => {
                        const entry = result.data.data.find((e) => e.date === date);
            return entry ? entry.price : null; 
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
            return { symbol: element, data }; 
         })
      );

      chartData.value = prepareChartData(results);

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
</style>
