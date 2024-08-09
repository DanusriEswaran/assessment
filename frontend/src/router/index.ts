// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Registration from "../views/Registration.vue";
import Login from "../views/Login.vue";
import Dashboard from "../views/userdashboard.vue";
import home from "../views/home.vue";
import AdminTask from "../views/admintask.vue";
const routes = [
  {
    path: "/registration",
    name: "registration",
    component: Registration,
  },
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/userdashboard",
    name: "userdashboard",
    component: Dashboard,
  },
  {
    path: "/home",
    name: "home",
    component: home,
  },
  {
    path: "/admintask",
    name: "admintask",
    component: AdminTask,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
