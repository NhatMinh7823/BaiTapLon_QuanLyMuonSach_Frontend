import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Import Bootstrap and dependencies
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "popper.js/dist/umd/popper.min.js";
import "bootstrap/dist/js/bootstrap.min.js";

// Import Font Awesome
import "@fortawesome/fontawesome-free/css/all.min.css";

// Global styles
import "./assets/styles.css";

createApp(App).use(router).mount("#app");
