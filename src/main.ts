import { createApp } from "vue";
import { createPinia } from "pinia";
import "flag-icons/css/flag-icons.min.css";

import App from "./App.vue";
import "./style.css";

const app = createApp(App);

app.use(createPinia());
app.mount("#app");
