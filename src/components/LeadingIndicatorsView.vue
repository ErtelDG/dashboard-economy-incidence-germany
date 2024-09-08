<template>
   <div class="flex flex-col flex-1 overflow-y-auto scrollbar-w-0 w-full relative">
      <div class="w-full flex flex-col flex-1">
         <div class="w-full h-full flex flex-wrap justify-around items-start px-2 py-4 custom-height overflow-hidden">
            <div v-for="indicatorID in indicatorsID" :key="indicatorID" class="mb-4 w-[48rem]">
               <ChartIncidence :indicatorID="indicatorID" />
            </div>
            <div v-if="indicatorsID.length % 2 == 1" class="mb-4 w-[48rem]"></div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, watch } from "vue";
import ChartIncidence from "./ChartIncidence.vue";
import { useStore } from "vuex";

const store = useStore();
const indicatorsID = ref([]);

//data: Das JSON-Objekt, das durchsucht werden soll.
//nameJsonValue: Der gesuchte Wert für den Schlüssel "nameJson".
function findObjectWithNameJson(data, nameJsonValue) {
   // Überprüfen, ob das aktuelle Objekt ein Objekt oder ein Array ist
   if (typeof data === "object" && data !== null) {
      // Überprüfen, ob das aktuelle Objekt den Schlüssel "nameJson" enthält und der Wert übereinstimmt
      if (data.hasOwnProperty("nameJson") && data.nameJson === nameJsonValue) {
         return data;
      }

      // Wenn es ein Objekt ist, iteriere über seine Schlüssel
      for (let key in data) {
         if (data.hasOwnProperty(key)) {
            let result = findObjectWithNameJson(data[key], nameJsonValue);
            if (result) {
               return result;
            }
         }
      }
   }

   // Falls das aktuelle Objekt ein Array ist, iteriere über die Elemente
   if (Array.isArray(data)) {
      for (let item of data) {
         let result = findObjectWithNameJson(item, nameJsonValue);
         if (result) {
            return result;
         }
      }
   }

   // Rückgabe von null, wenn kein passendes Objekt gefunden wurde
   return null;
}

watch(
   () => store.state.indicatore,
   (newData, oldData) => {
      try {
         let examples = newData.leadingIndicators.example;
         indicatorsID.value = [];
         let apiDataList = store.state.apiDataList;
         examples.forEach((element) => {
            let res = findObjectWithNameJson(apiDataList, element.nameJson);
            indicatorsID.value.push(res.id);
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
