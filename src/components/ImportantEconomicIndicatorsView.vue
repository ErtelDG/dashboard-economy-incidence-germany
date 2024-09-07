<template>
   <div class="max-w-[64rem] flex justify-center">
      <div class="w-full h-full px-4 py-2 flex flex-col gap-4">
         <div v-for="(value, name, index) in economicDecision" :key="index" class="py-2">
            <span class="flex items-center">
               <span class="h-px flex-1 bg-gradient-to-r from-transparent to-black opacity-50"></span>
               <h1 class="shrink-0 px-4 text-2xl font-bold py-4">{{ value.headline }}</h1>
               <span class="h-px flex-1 bg-gradient-to-l from-transparent to-black opacity-50"></span>
            </span>
            <p v-for="(value2, name2, index2) in value.paragraphs" :key="index2" class="">{{ value2 }}</p>
         </div>

         <span class="flex items-center pt-4">
            <span class="h-px flex-1 bg-gradient-to-r from-transparent to-black opacity-50"></span>
            <h1 class="shrink-0 px-4 text-2xl font-bold py-4">Arten von Konjunkturindicatoren:</h1>
            <span class="h-px flex-1 bg-gradient-to-l from-transparent to-black opacity-50"></span>
         </span>
         <div class="flex justify-center">
            <ul class="list-disc list-inside flex gap-24 text-xl font-semibold">
               <li class="hover:cursor-pointer hover:underline" v-for="(value, name, index) in indicatore" :key="index">
                  <RouterLink :to="value.link">{{ value.indicator }}</RouterLink>
               </li>
            </ul>
         </div>
         <div v-for="(value, name, index) in indicatore" :key="index">
            <span class="flex items-center pt-4">
               <span class="h-px flex-1 bg-gradient-to-r from-transparent to-black opacity-50"></span>
               <h3 class="shrink-0 px-4 text-lg font-semibold py-4">
                  <RouterLink class="hover:cursor-pointer hover:underline" :to="value.link">{{ value.indicator }}</RouterLink>
               </h3>
               <span class="h-px flex-1 bg-gradient-to-l from-transparent to-black opacity-50"></span>
            </span>

            <p class="py-2">
               {{ value.description }}
            </p>
            <div class="overflow-x-auto flex justify-center py-2">
               <table class="w-1/2 divide-y-2 divide-gray-200 bg-gray-100 text-sm">
                  <thead class="ltr:text-left rtl:text-right">
                     <tr>
                        <th class="whitespace-nowrap px-4 py-2 text-gray-900 text-start">
                           <RouterLink class="hover:cursor-pointer hover:underline" :to="value.link">Beispiel: {{ value.indicator }}</RouterLink>
                        </th>
                     </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                     <tr v-for="example in value.example">
                        <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{{ example.indicator }}</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();

const economicDecision = ref();
const indicatore = ref();

watch(
   () => store.state.economicDecision,
   (newData, oldData) => {
      economicDecision.value = newData;
   },
   { immediate: true }
);

watch(
   () => store.state.indicatore,
   (newData, oldData) => {
      indicatore.value = newData;
   },
   { immediate: true }
);
</script>
