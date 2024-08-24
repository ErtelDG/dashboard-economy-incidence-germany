<template>
   <div class="max-w-[64rem] flex justify-center">
      <div class="w-full h-full px-4 py-2 flex flex-col gap-4">
         <div v-for="(value, name, index) in EconomicDecision" :key="index" class="py-2">
            <span class="flex items-center">
               <span class="h-px flex-1 bg-gradient-to-r from-transparent to-black opacity-50"></span>
               <h1 class="shrink-0 px-4 text-2xl font-bold py-4">{{ value.headline }}</h1>
               <span class="h-px flex-1 bg-gradient-to-l from-transparent to-black opacity-50"></span>
            </span>
            <p v-for="(value2, name2, index2) in value.paragraphs" :key="index2" class="">{{ value2 }}</p>
         </div>

         <span class="flex items-center pt-4">
            <span class="h-px flex-1 bg-gradient-to-r from-transparent to-black opacity-50"></span>
            <h1 class="shrink-0 px-4 text-2xl font-bold py-4">Arten von Konjunkturindikatoren:</h1>
            <span class="h-px flex-1 bg-gradient-to-l from-transparent to-black opacity-50"></span>
         </span>
         <div class="flex justify-center">
            <ul class="list-disc list-inside flex gap-24 text-xl font-semibold">
               <li class="hover:cursor-pointer hover:underline" v-for="(value, name, index) in Indicatore" :key="index">
                  <RouterLink :to="value.link">{{ value.indicator }}</RouterLink>
               </li>
            </ul>
         </div>
         <div v-for="(value, name, index) in Indicatore" :key="index">
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
                        <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{{ example }}</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref } from "vue";

const Indicatore = ref({
   LeadingIndicators: {
      indicator: "Frühindikatoren",
      description:
         "Frühindikatoren helfen dabei, die zukünftige Entwicklung einer Volkswirtschaft möglichst präzise einzuschätzen. Obwohl diese Indikatoren immer ein gewisses Maß an Spekulation enthalten, geben sie einen Einblick in den aktuellen Trend. So können beispielsweise die Gewinnerwartungen von Unternehmen als guter Indikator für den zukünftigen Verlauf der Konjunkturkurve dienen.",
      example: ["Aktienindex", "Auftragseingänge", "Einzelhandelsumsätze", "Geldmengenwachstum", "Geschäftsklimaindex", "Gewinnerwartungen", "Lagerbestände"],
      link: "/LeadingIndicators",
   },
   PresenceIndicators: {
      indicator: "Präsenzindikatoren",
      description:
         "Der bedeutendste Präsenzindikator ist zweifelsohne das Wirtschaftswachstum, das anhand des realen Bruttoinlandsprodukts (BIP) gemessen wird.",
      example: ["Bruttoinlandsprodukt (BIP)", "Industrieproduktion", "Kapazitätsauslastung", "Lagerbestände", "Offene Stellen", "Preise", "Sparquote"],
      link: "/PresenceIndicators",
   },
   LaggingIndicators: {
      indicator: "Spätindikatoren",
      description:
         "Spätindikatoren dienen dazu, die konjunkturelle Entwicklung im Nachhinein zu erklären oder zu beschreiben. Einer der wichtigsten Indikatoren in diesem Bereich ist die Entwicklung der Arbeitslosenzahlen",
      example: [
         "Arbeitslosenquote",
         "Bruttoinlandsprodukt (BIP)",
         "Inflationsrate",
         "Insolvenzen",
         "Preisniveauentwicklung",
         "Steuereinnahmen",
         "Zinsniveauentwicklung",
      ],
      link: "/LaggingIndicators",
   },
});

const EconomicDecision = ref({
   p1: {
      headline: "Weshalb sind Konjunkturindikatoren von Bedeutung?",
      paragraphs: [
         "Konjunkturindikatoren liefern wesentliche Daten und Vergleichswerte, die es ermöglichen, die wirtschaftliche Entwicklung einer Volkswirtschaft zu bewerten. Sie sind unverzichtbar für die Wirtschaftswissenschaften, da sie Prognosen, Analysen und Beschreibungen des aktuellen Wirtschaftsgeschehens ermöglichen und dem Staat die Grundlage für die Ausgestaltung seiner Konjunkturpolitik bieten.",
         "In Unternehmen gewinnen Konjunkturindikatoren besonders bei längeren Planungszyklen an Bedeutung. Vor allem Betriebe im sekundären (z. B. Industrie und produzierendes Gewerbe) und tertiären Sektor (Dienstleistungen) sind auf langfristige Planungen angewiesen, die stark von der konjunkturellen Lage abhängen. Dies gilt insbesondere für den Aufbau von Produktion und Kompetenzen, da hier oft mit langen Amortisationszeiten gerechnet wird und die Kapazitäten optimal ausgelastet sein müssen.",
      ],
   },
   p2: {
      headline: "Die Relevanz von Konjunkturindikatoren",
      paragraphs: [
         "Wirtschaftssubjekte wie Unternehmen, Medien und Studierende der Wirtschaftswissenschaften benötigen verlässliche Messgrößen, um komplexe wirtschaftliche Zusammenhänge wie die konjunkturelle Entwicklung anschaulich darzustellen.",
         "Daher berechnen sowohl das Statistische Bundesamt als auch Wirtschaftsforschungsinstitute regelmäßig Indikatoren, die es den Interessengruppen ermöglichen, die wirtschaftliche Lage schnell zu überblicken und präzise einzuschätzen. Damit diese Indikatoren eine hohe Aussagekraft besitzen, werden sie in möglichst kurzen Zeitabständen erhoben, in der Regel quartalsweise oder monatlich.",
         "Um langfristige Vergleiche zu ermöglichen und den Zahlen mehr Aussagekraft zu verleihen, müssen die Indikatoren als sogenannte „lange Reihen“ vorliegen, das heißt, sie müssen über mehrere Jahre hinweg erfasst und ausgewertet werden. Nur so lässt sich die konjunkturelle Entwicklung mit ihren verschiedenen Phasen in Form einer Konjunkturkurve darstellen.",
         "In Deutschland ist es vor allem das Statistische Bundesamt, das die Aufgabe hat, ein umfassendes Bild der Wirtschaftsstruktur und der wirtschaftlichen Entwicklung zu zeichnen und eine fortlaufende Konjunkturbeschreibung zu liefern.",
      ],
   },
   p3: {
      headline: "Chronologische Einteilung der Konjunkturindikatoren",
      paragraphs: [
         "Konjunkturindikatoren sind Kennzahlen, die dazu dienen, die Entwicklung einer Volkswirtschaft über einen bestimmten Zeitraum hinweg abzubilden oder zu beschreiben. Sie liefern wichtige Zahlenwerte und Vergleichsreihen für die Prognose, Beschreibung und Analyse der Konjunktur.",
         "Konjunkturindikatoren können vor, während und nach einem bestimmten Ereignis oder einer Konjunkturphase erfasst werden.",
      ],
   },
});
</script>
