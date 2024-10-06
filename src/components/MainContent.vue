<script setup>
import { ref, watch, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import "../router";
import { RouterView } from "vue-router";

const store = useStore();
const selectedSubcategories = ref([]);

watch(
   () => store.state.selectedSubcategories,
   (newData, oldData) => {
      selectedSubcategories.value = [];
      newData.forEach((element) => {
         selectedSubcategories.value.push(element);
      });
   },
   { immediate: true }
);

const apiData = reactive({});

const fetchData = async (id) => {
   try {
      const response = await fetch(`https://economy-incidence-germany.denniscodeworld.de/data?id=${id}`);
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
      apiData[id] = data;
   } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
   }
};

const removeData = (id) => {
   delete apiData[id];
};

const debounce = (func, delay) => {
   let timeout;
   return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
   };
};

const handleChanges = debounce((newValue, oldValue) => {
   const newIds = newValue.filter((id) => !oldValue.includes(id));
   const removedIds = oldValue.filter((id) => !newValue.includes(id));
   newIds.forEach((id) => fetchData(id));
   removedIds.forEach((id) => removeData(id));
}, 300);

watch(() => store.getters.selectedSubcategories, handleChanges, { deep: true });

onMounted(() => {
   const initialIds = store.getters.selectedSubcategories;
   initialIds.forEach((id) => fetchData(id));
});
</script>

<template>
   <div class="flex flex-col flex-1 overflow-y-auto scrollbar-w-0 w-full relative h-full">
      <div class="w-full flex flex-col flex-1">
         <div class="w-full h-full flex flex-wrap items-start overflow-hidden">
            <router-view v-slot="{ Component }">
               <keep-alive>
                  <component :is="Component" />
               </keep-alive>
            </router-view>
         </div>
      </div>
   </div>
</template>

<style scoped>
.scrollbar-w-0 {
   scrollbar-width: none;
}
.custom-height {
   height: calc(100vh - 8rem);
}
</style>
