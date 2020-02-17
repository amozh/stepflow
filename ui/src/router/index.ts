import Vue, { VueConstructor } from "vue";
import VueRouter from "vue-router";
//
import AllWorkflows from "../views/AllWorkflows.vue";
import CreateWf from "../views/CreateWf.vue";
import Workflow from "../views/Workflow.vue";
import LoginLogout from '../views/LoginLogout.vue'
import CreateUser from "../views/CreateUser.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "all_workflows",
    component: AllWorkflows as VueConstructor<Vue>
  },
  {
    path: "/create",
    name: "create_wf",
    component: CreateWf as VueConstructor<Vue>
  },
  {
    path: "/workflow/:id",
    name: "workflow",
    component: Workflow as VueConstructor<Vue>
  },
  {
    path: "/me",
    name:"user_page",
    component: LoginLogout as VueConstructor<Vue>
  },
  {
    path: "/create_user",
    name:"create_user",
    component: CreateUser as VueConstructor<Vue>
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
