<template>
   <div class="flex flex-col flex-1 overflow-y-auto scrollbar-w-0 w-full relative">
      <div class="w-full flex flex-col flex-1">
         <div class="w-full h-full flex flex-wrap justify-center gap-x-16 gap-y-8 items-start px-2 py-4 custom-height overflow-hidden">
            <div v-if="indicatorsID.length == 0" class="w-full h-[28.5rem] flex justify-center items-center">
               <PlsWait></PlsWait>
            </div>
            <div v-for="indicatorID in indicatorsID" :key="indicatorID" class="my-4 w-11/12 sm:w-[48rem]">
               <ChartIncidence :indicatorID="indicatorID" />
            </div>
            <div v-if="indicatorsID.length % 2 == 1" class="mb-4 w-full sm:w-[48rem]"></div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import ChartIncidence from "./ChartIncidence.vue";
import PlsWait from "./PlsWait.vue";
import { useStore } from "vuex";

const store = useStore();
const indicatorsID = ref([]);
const watchStoreIndicator = ref(store.state.indicatore);

function findObjectWithNameJson(data, nameJsonValue) {
   if (typeof data === "object" && data !== null) {
      if (data.hasOwnProperty("nameJson") && data.nameJson === nameJsonValue) {
         return data;
      }

      for (let key in data) {
         if (data.hasOwnProperty(key)) {
            let result = findObjectWithNameJson(data[key], nameJsonValue);
            if (result) {
               return result;
            }
         }
      }
   }

   if (Array.isArray(data)) {
      for (let item of data) {
         let result = findObjectWithNameJson(item, nameJsonValue);
         if (result) {
            return result;
         }
      }
   }

   return null;
}

watch(
   () => watchStoreIndicator.value,
   async (newData, oldData) => {
      try {
         store.dispatch("fetchData");
         let examples = newData.presenceIndicators.example;
         indicatorsID.value = [];

         let maxWaitTime = 10000; 
         let intervalTime = 2000;
         let elapsedTime = 0;

         let apiDataList = store.state.apiDataList;

         while (apiDataList == null && elapsedTime < maxWaitTime) {
            await new Promise((resolve) => setTimeout(resolve, intervalTime));
            apiDataList = store.state.apiDataList;
            elapsedTime += intervalTime;
         }

         if (apiDataList == null) {
            console.warn("apiDataList nach 10 Sekunden noch null!");
            return;
         }

         examples.forEach((element) => {
            let res = findObjectWithNameJson(apiDataList, element.nameJson);
            if (res != null) {
               indicatorsID.value.push(res.id);
            }
         });
      } catch (error) {
         console.error(error);
      }
   },
   { immediate: true }
);
</script>

<style scoped>
.tile-footer-module_link__FmOx3 {
   display: none;
}
</style>
