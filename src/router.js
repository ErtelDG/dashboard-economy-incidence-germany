import { createMemoryHistory, createRouter } from "vue-router";

import LeadingIndicatorsView from "./components/LeadingIndicatorsView.vue";
import PresenceIndicatorsView from "./components/PresenceIndicatorsView.vue";
import LaggingIndicatorsView from "./components/LaggingIndicatorsView.vue";
import ImportantEconomicIndicatorsView from "./components/ImportantEconomicIndicatorsView.vue";
import ImpressumView from "./components/ImpressumView.vue";
import PrivacyPolicyView from "./components/PrivacyPolicyView.vue";
import ChartContentView from "./components/ChartContentView.vue";

const routes = [
   { path: "/LeadingIndicators", component: LeadingIndicatorsView },
   { path: "/PresenceIndicators", component: PresenceIndicatorsView },
   { path: "/LaggingIndicators", component: LaggingIndicatorsView },
   { path: "/Impressum", component: ImpressumView },
   { path: "/", component: ImportantEconomicIndicatorsView },
   { path: "/PrivacyPolicy", component: PrivacyPolicyView },
   { path: "/ChartContent", component: ChartContentView },
];

const router = createRouter({
   history: createMemoryHistory(),
   routes,
});

export default router;
