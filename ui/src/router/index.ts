import Vue, { VueConstructor } from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home as VueConstructor<Vue>
  },
  {
    path: "/about",
    name: "about",
    component: About as VueConstructor<Vue>
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
