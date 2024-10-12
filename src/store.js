import { createStore } from "vuex";
import { ref } from "vue";
import { Store } from "vuex/dist/vuex.cjs.js";

function transformAndSortData(data) {
   const result = {};

   Object.values(data).forEach((item) => {
      const category = item.category;
      if (!result[category]) {
         result[category] = {};
      }
      result[category][item.nameJson] = item;
   });

   for (const category in result) {
      result[category] = Object.fromEntries(Object.entries(result[category]).sort(([a], [b]) => a.localeCompare(b)));
   }

   return result;
}

function transformAndSortSubcategory(data) {
   const groupedData = {};

   Object.keys(data).forEach((mainCategory) => {
      groupedData[mainCategory] = {};
      Object.keys(data[mainCategory]).forEach((key) => {
         const item = data[mainCategory][key];
         if (!groupedData[mainCategory][item.subcategory]) {
            groupedData[mainCategory][item.subcategory] = {};
         }
         groupedData[mainCategory][item.subcategory][key] = item;
      });
   });

   const sortedData = Object.keys(groupedData).reduce((acc, mainCategory) => {
      acc[mainCategory] = Object.keys(groupedData[mainCategory])
         .sort()
         .reduce((subAcc, subCategory) => {
            subAcc[subCategory] = groupedData[mainCategory][subCategory];
            return subAcc;
         }, {});
      return acc;
   }, {});

   return sortedData;
}

const store = createStore({
   state() {
      return {
         selectedSubcategoriesGlobal: ref(10),
         sidebarVisible: ref(false),
         apiDataList: null,
         selectedSubcategories: ref([]),
         indicatore: ref(),
         economicDecision: ref(),
      };
   },
   mutations: {
      setApiData(state, data) {
         state.apiDataList = data;
      },
      updateSelectedSubcategories(state, selectedSubcategories) {
         state.selectedSubcategories = selectedSubcategories;
      },
      toggleSidebar(state) {
         state.sidebarVisible = !state.sidebarVisible;
      },
   },
   actions: {
      fetchData(context) {
         fetch("https://economy-dashboard-germany.denniscodeworld.de/api/list")
            .then((response) => {
               if (!response.ok) {
                  throw new Error("Network response was not ok");
               }
               return response.json();
            })
            .then((result) => {
               let sortResult = transformAndSortSubcategory(transformAndSortData(result));
               context.commit("setApiData", sortResult);
            })
            .catch((error) => {
               console.error("Fetch error:", error);
               // Optionale Fehlerbehandlung z.B. Zeige eine Fehlermeldung im UI an
               context.commit("setApiError", error.message);
            });
      },
   },
   getters: {
      apiDataList(state) {
         return state.apiDataList;
      },
      selectedSubcategories(state) {
         return state.selectedSubcategories;
      },
      sidebarVisible(state) {
         return state.sidebarVisible.value;
      },
   },
});

export default store;

store.state.indicatore = {
   leadingIndicators: {
      indicator: "Frühindikatoren",
      description:
         "Frühindikatoren helfen dabei, die zukünftige Entwicklung einer Volkswirtschaft möglichst präzise einzuschätzen. Obwohl diese indikatoren immer ein gewisses Maß an Spekulation enthalten, geben sie einen Einblick in den aktuellen Trend. So können beispielsweise die Gewinnerwartungen von Unternehmen als guter indicator für den zukünftigen Verlauf der Konjunkturkurve dienen.",
      example: [
         {
            indicator: "Auftragseingangsindex",
            description:
               "Zeigt die Nachfrage nach neuen Aufträgen in der Industrie. Ein Anstieg weist auf zukünftiges Wirtschaftswachstum hin, ein Rückgang signalisiert eine mögliche Abschwächung.",
            nameJson: "umsatzindex_investitionsgueter_ausland_bv41",
         },
         {
            indicator: "Baugenehmigungen",
            description:
               "Spiegelt die Anzahl der genehmigten Bauprojekte wider, was auf zukünftige Bautätigkeit hinweist. Ein Anstieg signalisiert bevorstehendes Wachstum im Baugewerbe.",
            nameJson: "baugenehmigungen_neue_gebaeude_originalwert",
         },
         {
            indicator: "Lkw-Maut-Fahrleistungsindex",
            description:
               "Misst die Veränderung im Güterverkehr auf den Straßen. Ein hohes Verkehrsaufkommen deutet auf gesteigerte wirtschaftliche Aktivität hin.",
            nameJson: "lkw_maut_fahrleistungsindex_bv41",
         },
         {
            indicator: "Gemeldete Stellen",
            description:
               "Reflektiert die Anzahl der offenen Stellen und die Nachfrage nach Arbeitskräften, was auf künftige Arbeitsmarktentwicklungen und wirtschaftliche Dynamik hinweist.",
            nameJson: "gemeldete_stellen_bv41",
         },
         {
            indicator: "Erzeugerpreise",
            description:
               "Erfasst die Preisentwicklung bei produzierten Waren auf Herstellerebene. Ein Anstieg kann auf zukünftige Inflation hinweisen, da höhere Kosten oft an Verbraucher weitergegeben werden.",
            nameJson: "erzeugerpreise_gewerblicher_produkte_bv41",
         },
         {
            indicator: "Produktionsindex",
            description: "Zeigt die Produktionsentwicklung im verarbeitenden Gewerbe. Eine Zunahme deutet auf steigende wirtschaftliche Aktivität hin.",
            nameJson: "produktionsindex_produzierendes_gewerbe_originalwert",
         },
      ],
      link: "/LeadingIndicators",
   },
   presenceIndicators: {
      indicator: "Präsenzindikatoren",
      description:
         "Der bedeutendste Präsenzindikator ist zweifelsohne das Wirtschaftswachstum, das anhand des realen Bruttoinlandsprodukts (BIP) gemessen wird.",
      example: [
         {
            indicator: "Arbeitslosenquote",
            description: "Gibt die aktuelle Anzahl der Arbeitslosen im Verhältnis zur Erwerbsbevölkerung an und zeigt den Zustand des Arbeitsmarkts.",
            nameJson: "arbeitslose_bv41",
         },
         {
            indicator: "Außenhandelsbilanz",
            description:
               "Zeigt die Differenz zwischen Exporten und Importen und reflektiert die internationale Wettbewerbsfähigkeit sowie die Nachfrage nach Gütern und Dienstleistungen.",
            nameJson: "aussenhandel_indizes_termsoftrade_originalwert",
         },
         {
            indicator: "Baugewerbe",
            description: "Gibt Auskunft über die aktuelle Bautätigkeit und Investitionen im Bauwesen, ein wichtiger Sektor für die Gesamtwirtschaft.",
            nameJson: "produktionsindex_bauhauptgewerbe_insgesamt_bv41",
         },
         {
            indicator: "Bruttoinlandsprodukt (BIP)",
            description:
               "Misst die gesamte wirtschaftliche Leistung eines Landes in einem bestimmten Zeitraum und ist der zentrale indicator für den aktuellen Stand der Konjunktur.",
            nameJson: "bruttoinlandsprodukt_originalwert",
         },
         {
            indicator: "Einzelhandel",
            description: "Die aktuellen Umsätze im Einzelhandel geben Aufschluss über den Konsum und die Nachfrage der Verbraucher.",
            nameJson: "einzelhandel_umsatz_wirtschaftszweige_preisbereinigt_originalwert",
         },
         {
            indicator: "Erwerbstätige",
            description: "Zeigt die Anzahl der Beschäftigten und gibt Einblick in die Beschäftigungslage und den Zustand des Arbeitsmarkts.",
            nameJson: "ilo_arbeitsmarktstatistik_erwerbstaetige_erwerbslose_bereinigt",
         },
         {
            indicator: "Gastgewerbe",
            description:
               "Reflektiert die Aktivität im Gastgewerbe, vor allem im Bereich Tourismus und Dienstleistungen, und gibt Aufschluss über den aktuellen Konsum in diesem Sektor.",
            nameJson: "gastgewerbeumsatz_real_bv41",
         },
         {
            indicator: "Großhandel",
            description: "Misst die Umsätze im Großhandel und zeigt die aktuelle Nachfrage nach Gütern entlang der Lieferkette.",
            nameJson: "grosshandelsumsatz_real_bv41",
         },
         {
            indicator: "Umsatzindex",
            description:
               "Erfasst die aktuelle Entwicklung der Umsätze in verschiedenen Branchen und gibt einen Hinweis auf die allgemeine wirtschaftliche Aktivität.",
            nameJson: "umsatzindex_verarb_gewerbe_originalwert",
         },
         {
            indicator: "Verbraucherpreise",
            description:
               "Misst die Preisveränderungen für Konsumgüter und Dienstleistungen und gibt Aufschluss über die Inflation und die Kaufkraft der Verbraucher.",
            nameJson: "verbraucherpreisindex_gesamtindex_bv41",
         },
      ],
      link: "/PresenceIndicators",
   },
   laggingIndicators: {
      indicator: "Spätindikatoren",
      description:
         "Spätindikatoren dienen dazu, die konjunkturelle Entwicklung im Nachhinein zu erklären oder zu beschreiben. Einer der wichtigsten indikatoren in diesem Bereich ist die Entwicklung der Arbeitslosenzahlen",
      example: [
         {
            indicator: "Arbeitskosten",
            description:
               "Gibt die durchschnittlichen Kosten pro Arbeitskraft an, die in der Regel erst steigen, nachdem sich die Wirtschaft erholt hat und die Nachfrage nach Arbeitskräften zunimmt.",
            nameJson: "arbeitskostenindex_bv41",
         },
         {
            indicator: "Bruttoanlageinvestitionen",
            description:
               "Reflektieren Investitionen in langlebige Güter und Anlagen, die erst nachträglich getätigt werden, wenn Unternehmen die wirtschaftliche Erholung wahrnehmen.",
            nameJson: "bruttoanlageinvestitionen_preisbereinigt_originalwert",
         },
         {
            indicator: "Einfuhrpreise",
            description: "Erfassen die Preise von importierten Gütern, die mit einer Verzögerung auf globale Angebots- und Nachfragetrends reagieren.",
            nameJson: "einfuhrpreisindex_bv41",
         },
         {
            indicator: "Einzelhandel",
            description:
               "Die Umsätze im Einzelhandel können auch nachlaufend sein, da sich die Kaufgewohnheiten der Verbraucher erst nach einer gewissen Zeit an die wirtschaftlichen Bedingungen anpassen.",
            nameJson: "einzelhandelsumsatz_real_bv41",
         },
         {
            indicator: "Großhandel",
            description:
               "Die Großhandelsumsätze folgen oft den wirtschaftlichen Trends mit einer gewissen Verzögerung, da sie von der Nachfrage in nachgelagerten Sektoren abhängig sind.",
            nameJson: "grosshandelsumsatz_real_bv41",
         },
         {
            indicator: "Verbraucherpreise",
            description:
               "Misst die Preisveränderungen für Konsumgüter. Inflation tritt oft nachträglich auf, wenn sich Produktionskosten und Löhne bereits verändert haben.",
            nameJson: "verbraucherpreisindex_gesamtindex_bv41",
         },
      ],
      link: "/LaggingIndicators",
   },
};

store.state.economicDecision = {
   p1: {
      headline: "Weshalb sind Konjunkturindikatoren von Bedeutung?",
      paragraphs: [
         "Konjunkturindikatoren liefern wesentliche Daten und Vergleichswerte, die es ermöglichen, die wirtschaftliche Entwicklung einer Volkswirtschaft zu bewerten. Sie sind unverzichtbar für die Wirtschaftswissenschaften, da sie Prognosen, Analysen und descriptionen des aktuellen Wirtschaftsgeschehens ermöglichen und dem Staat die Grundlage für die Ausgestaltung seiner Konjunkturpolitik bieten.",
         "In Unternehmen gewinnen Konjunkturindikatoren besonders bei längeren Planungszyklen an Bedeutung. Vor allem Betriebe im sekundären (z. B. Industrie und produzierendes Gewerbe) und tertiären Sektor (Dienstleistungen) sind auf langfristige Planungen angewiesen, die stark von der konjunkturellen Lage abhängen. Dies gilt insbesondere für den Aufbau von Produktion und Kompetenzen, da hier oft mit langen Amortisationszeiten gerechnet wird und die Kapazitäten optimal ausgelastet sein müssen.",
      ],
   },
   p2: {
      headline: "Die Relevanz von Konjunkturindikatoren",
      paragraphs: [
         "Wirtschaftssubjekte wie Unternehmen, Medien und Studierende der Wirtschaftswissenschaften benötigen verlässliche Messgrößen, um komplexe wirtschaftliche Zusammenhänge wie die konjunkturelle Entwicklung anschaulich darzustellen.",
         "Daher berechnen sowohl das Statistische Bundesamt als auch Wirtschaftsforschungsinstitute regelmäßig indikatoren, die es den Interessengruppen ermöglichen, die wirtschaftliche Lage schnell zu überblicken und präzise einzuschätzen. Damit diese indikatoren eine hohe Aussagekraft besitzen, werden sie in möglichst kurzen Zeitabständen erhoben, in der Regel quartalsweise oder monatlich.",
         "Um langfristige Vergleiche zu ermöglichen und den Zahlen mehr Aussagekraft zu verleihen, müssen die indikatoren als sogenannte „lange Reihen“ vorliegen, das heißt, sie müssen über mehrere Jahre hinweg erfasst und ausgewertet werden. Nur so lässt sich die konjunkturelle Entwicklung mit ihren verschiedenen Phasen in Form einer Konjunkturkurve darstellen.",
         "In Deutschland ist es vor allem das Statistische Bundesamt, das die Aufgabe hat, ein umfassendes Bild der Wirtschaftsstruktur und der wirtschaftlichen Entwicklung zu zeichnen und eine fortlaufende Konjunkturdescription zu liefern.",
      ],
   },
   p3: {
      headline: "Chronologische Einteilung der Konjunkturindikatoren",
      paragraphs: [
         "Konjunkturindikatoren sind Kennzahlen, die dazu dienen, die Entwicklung einer Volkswirtschaft über einen bestimmten Zeitraum hinweg abzubilden oder zu beschreiben. Sie liefern wichtige Zahlenwerte und Vergleichsreihen für die Prognose, description und Analyse der Konjunktur.",
         "Konjunkturindikatoren können vor, während und nach einem bestimmten Ereignis oder einer Konjunkturphase erfasst werden.",
      ],
   },
};
