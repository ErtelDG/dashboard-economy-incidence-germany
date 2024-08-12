<template>
   <div class="rounded-md border-4 w-full flex-col items-center p-2 scrollbar-w-0">
      <div class="w-full text-center text-lg font-bold py-4">{{ chartData.title }}</div>
      <div class="flex items-center">
         <table class="text-wrap w-1/6 border-gray-200 p-2">
            <tr>
               <th class="text-lg border-2 border-solid border-[#dddddd]">Kategorie</th>
            </tr>
            <tr v-for="category in chartCategories" :key="category" class="border-2 border-solid border-[#dddddd]">
               <div v-if="category !== 'Datum'" class="border-2 flex gap-2 p-2 border-solid border-[#dddddd]">
                  <input type="checkbox" :id="category" :name="category" />
                  <label :for="category">{{ category }}</label>
               </div>
            </tr>
         </table>
         <div class="flex aspect-[2/1] w-5/6 border-gray-200 p-2 justify-center">
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

const chartFilter = ref([]);

const chartData = {
   title: "Monatliche Verkäufe",
   labels: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli"],
   datasets: [
      {
         label: "2023 Verkäufe",
         data: [120, 150, 180, 220, 200, 230, 250],
         borderColor: "rgba(75, 192, 192, 1)",
         backgroundColor: "rgba(75, 192, 192, 0.2)",
         fill: true,
      },
      {
         label: "2022 Verkäufe",
         data: [100, 140, 160, 200, 180, 210, 240],
         borderColor: "rgba(153, 102, 255, 1)",
         backgroundColor: "rgba(153, 102, 255, 0.2)",
         fill: true,
      },
   ],
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
const chartCategories = ref([]);

watch(
   () => props.apiData,
   (newData) => {
      if (chartData != null && newData != null) {
         chartData.title = newData.title;
         console.log("newData ----------------->>> ");
         chartCategories.value = Object.keys(newData.data[0]);

         /*         newData.data.forEach((df) => {
            const key = Object.keys(df);
            console.log(key) */
         /* key.forEach((key) => {console.log(chartFilter.value.find(key)) })
            key.forEach((key) => {
               if (key == "Datum") {
                  chartData.labels.push(df[key]);
               } else {
                 // console.log(key);
               }
            }); 
         });*/
      }

      currApiDataChart.value = newData;
      console.log("-----> AKTUELLE WERT VON urrApiDataChart <-----", currApiDataChart.value);
   },
   { immediate: true }
);
</script>

<style scoped>
tr:nth-child(even) {
   background-color: #dddddd;
}
.scrollbar-w-0 {
   scrollbar-width: none;
}
</style>
