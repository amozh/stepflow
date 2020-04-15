import { Module } from "vuex-smart-module";
import WorkflowStore from "./modules/workflow";
import UserStore from "./modules/user";
import GroupStore from "./modules/group";
import CreateWorkflowStore from "./modules/createWorkflow"

export default new Module({
  modules: {
    WorkflowStore,
    UserStore,
    GroupStore,
    CreateWorkflowStore
  }
});