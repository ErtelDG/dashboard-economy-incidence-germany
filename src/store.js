// store.js
import { createStore } from "vuex";

const store = createStore({
   state() {
      return {
         apiDataList: null,
      };
   },
   mutations: {
      setApiData(state, data) {
         state.apiDataList = data;
      },
   },
   actions: {
      fetchData(context) {
         var requestOptions = {
            method: "GET",
            redirect: "follow",
         };

         fetch("https://economy-incidence-germany.denniscodeworld.de/list", requestOptions)
            .then((response) => response.json()) // Ändere text() zu json(), wenn die API JSON zurückgibt
            .then((result) => {
               context.commit("setApiData", result); // Speichere die Daten im State
            })
            .catch((error) => console.log("error", error));
      },
   },
   getters: {
      apiDataList(state) { 
         return state.apiDataList;
      },
   },
});

store.dispatch("fetchData");

export default store;
