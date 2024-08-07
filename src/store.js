import { createStore } from "vuex";
import { ref } from "vue";

function transformAndSortData(data) {
   const result = {};

   Object.values(data).forEach((item) => {
      const category = item.category;
      if (!result[category]) {
         result[category] = {};
      }
      result[category][item.nameJson] = item;
   });

   // Sort the objects within each category
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
         sidebarVisible: ref(false),
         apiDataList: null,
         selectedSubcategories: [],
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
         var requestOptions = {
            method: "GET",
            redirect: "follow",
         };

         fetch("https://economy-incidence-germany.denniscodeworld.de/list", requestOptions)
            .then((response) => response.json())
            .then((result) => {
               let sortResult = transformAndSortSubcategory(transformAndSortData(result));
               context.commit("setApiData", sortResult);
            })
            .catch((error) => console.log("error", error));
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
