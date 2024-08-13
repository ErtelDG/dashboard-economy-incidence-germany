<template>
   <div class="rounded-md border-4 w-full flex-col items-center p-2 scrollbar-w-0">
      <div class="w-full text-center text-lg font-bold py-4">{{ chartData.title }}</div>
      <div class="flex items-center">
         <table class="text-wrap w-1/6 border-gray-200 p-2">
            <tr>
               <th class="text-lg border-2 border-solid border-[#dddddd]">Kategorie</th>
            </tr>
            <tr v-for="category in chartCategories" :key="category" class="border-2 border-solid border-[#dddddd]">
               <td v-if="category !== 'Datum'" class="border-2 p-2 border-solid border-[#dddddd]">
                  <input type="radio" :id="category" :value="category" v-model="chartFilter" />
                  <label :for="category">{{ category }}</label>
               </td>
            </tr>
         </table>
         <div class="flex aspect-[2/1] w-5/6 border-gray-200 p-2 justify-center">
            <div style="width: 800px"><canvas :id="canvasId"></canvas></div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import Chart from "chart.js/auto";

// Track the current chart instance
const myCharts = new Map(); // Use a Map to store multiple chart instances

// Reactive references
const canvasId = ref("");
const chartFilter = ref("");
const currApiDataChart = ref([]);
const chartCategories = ref([]);
const chartData = ref({
   title: "TITEL DEFINIEREN",
   labels: [],
   datasets: [{ label: "Hallo", data: [] }],
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

      // Create a new chart
      const newChart = new Chart(chartElement, {
         type: "bar",
         data: {
            labels: chartData.value.labels,
            datasets: [
               {
                  label: "Acquisitions by year",
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
   apiData: {
      type: Object,
      required: true,
   },
});

// Watchers
watch(chartFilter, (newFilter) => {
   if (newFilter && currApiDataChart.value.data.length > 0) {
      chartData.value.labels = [];
      chartData.value.datasets[0].data = [];
      currApiDataChart.value.data.forEach((element) => {
         chartData.value.labels.push(element["Datum"]);
         chartData.value.datasets[0].data.push(element[newFilter]);
      });

      updateChart();
   }
});

watch(
   () => props.apiData,
   (newData) => {
      if (newData && newData.data) {
         canvasId.value = `${newData.category}-${newData.subcategory}`; // Ensure a unique ID
         chartData.value.title = newData.title;
         chartCategories.value = Object.keys(newData.data[0]);
         currApiDataChart.value = newData;
         updateChart(); // Update chart whenever apiData changes
      }
   },
   { immediate: true }
);

onMounted(() => {
   if (canvasId.value) {
      updateChart(); // Ensure chart is updated when component is mounted
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
</style>
