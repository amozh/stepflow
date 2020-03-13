import Vue, { VueConstructor } from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import AllWorkflows from "../views/AllWorkflows.vue";
import CreateWf from "../views/CreateWf.vue";
import Workflow from "../views/Workflow.vue";
import Login from '../views/Login.vue';
import CreateUser from "../views/CreateUser.vue";
import Groups from "../views/groups/Groups.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    name: "all_workflows",
    component: AllWorkflows
  },
  {
    path: "/create",
    name: "create_wf",
    component: CreateWf
  },
  {
    path: "/workflow/:id",
    name: "workflow",
    component: Workflow
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/create_user",
    name: "create_user",
    component: CreateUser
  },
  {
    path: "/groups",
    name: "groups",
    component: Groups
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
