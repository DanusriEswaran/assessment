// src/main.ts
import { createApp } from "vue"; // Vue core library
import { createPinia } from "pinia"; // State management library
import App from "./App.vue"; // Root Vue component
import router from "./router"; // Vue Router for routing

// Bootstrap & FontAwesome for UI styling and icons
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

// Vuetify for Material Design components and styles
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(createPinia()); // Use Pinia for state management
app.use(router); // Use Vue Router
app.use(vuetify); // Use Vuetify for UI components
app.mount("#app"); // Mount Vue app to DOM
