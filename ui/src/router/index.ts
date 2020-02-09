import Vue, { VueConstructor } from "vue";
import VueRouter from "vue-router";
//
import AllWorkflows from "../views/AllWorkflows.vue";
import CreateWf from "../views/CreateWf.vue";
import Workflow from "../views/Workflow.vue";

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
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
