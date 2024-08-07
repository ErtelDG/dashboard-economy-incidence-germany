<template>
   <h5>Chart component</h5>
   <div v-for="api in apiData" :key="id">
      {{ Object.keys(api.data).length }}
      <canvas ref="myChart" width="400" height="200"></canvas>
   </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Chart, registerables } from "chart.js";

// Registriere die Chart.js Komponenten
Chart.register(...registerables);

// Referenz auf das Canvas-Element
const myChart = ref(null);

onMounted(() => {
   const ctx = myChart.value.getContext("2d");
   new Chart(ctx, {
      type: "line",
      data: {
         labels: ["Januar", "Februar", "März", "April", "Mai"],
         datasets: [
            {
               label: "Linie 1",
               data: [10, 20, 15, 25, 30],
               borderColor: "rgba(75, 192, 192, 1)",
               backgroundColor: "rgba(75, 192, 192, 0.2)",
               fill: true,
            },
            {
               label: "Linie 2",
               data: [20, 10, 30, 15, 25],
               borderColor: "rgba(255, 99, 132, 1)",
               backgroundColor: "rgba(255, 99, 132, 0.2)",
               fill: true,
            },
         ],
      },
      options: {
         scales: {
            y: {
               beginAtZero: true,
            },
         },
      },
   });
});

const props = defineProps({
   apiData: {
      apiData: Object,
      required: true,
   },
});
</script>
