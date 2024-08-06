// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Registration from "../views/Registration.vue";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";

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
    path: "/home",
    name: "home",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
