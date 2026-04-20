import { createApp } from "vue";
import { createPinia } from "pinia";
import "flag-icons/css/flag-icons.min.css";

import App from "./App.vue";
import { initializeGoogleAnalytics } from "./lib/analytics";
import "./style.css";

const app = createApp(App);

initializeGoogleAnalytics();
app.use(createPinia());
app.mount("#app");
