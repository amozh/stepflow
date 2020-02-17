// Импорт базовых классов
import { Module } from "vuex-smart-module";
import WorkflowStore from "./modules/workflow";
import UserStore from "./modules/user"

export default new Module({
  modules: {
    WorkflowStore,
    UserStore
  }
});
