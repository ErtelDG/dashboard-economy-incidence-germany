<template>
   <div class="w-full h-full px-4 py-2 flex flex-col gap-8">
      <p v-for="(value, name, index) in LeadingIndictors" :key="index">{{ value }}</p>
   </div>
</template>

<script setup>
import { ref } from "vue";

const LeadingIndictors = ref([
   "Aktienindex",
   "Auftragseingänge",
   "Einzelhandelsumsätze",
   "Geldmengenwachstum",
   "Geschäftsklimaindex",
   "Gewinnerwartungen",
   "Lagerbestände",
]);
</script>
