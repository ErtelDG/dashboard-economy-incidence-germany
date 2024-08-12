<template>
   <div class="rounded-md border-4 w-[40rem] flex-col items-center">
      <div class="w-full text-center font-semibold py-2">{{ chartData.title }}</div>
      <div class="flex aspect-[2/1] w-full border-gray-200 p-2 justify-center">
         <div class="border-2 h-full w-1/5">ss</div>
         <div class="flex-col justify-center items-center w-4/5 h-full border-2">
            <Line :data="chartData" :options="chartOptions" />
         </div>
      </div>
   </div>
</template>

<script setup>
// DataPage.vue
import { ref, watch } from "vue";
import { Line } from "vue-chartjs";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const chartFilter = ref([])

const chartData = {
   title: "Titel",
   labels: [],
   datasets: [],
};

const chartOptions = {
   responsive: true,
   maintainAspectRatio: false,
};

const props = defineProps({
   apiData: {
      type: Object,
      required: true,
   },
});

const currApiDataChart = ref([]);

watch(
   () => props.apiData,
   (newData) => {
      if (chartData != null && newData != null) {
         chartData.title = newData.title;
         console.log("newData ----------------->>> ");
         newData.data.forEach((df) => {
            const key = Object.keys(df);
            key.forEach((key) => {console.log(chartFilter.value.find(key)) })
            key.forEach((key) => {
               if (key == "Datum") {
                  chartData.labels.push(df[key]);
               } else {
                 // console.log(key);
               }
            });
         });
      }

      currApiDataChart.value = newData;
      console.log(currApiDataChart.value);
   },
   { immediate: true }
);
</script>
