// Импорт базовых классов
import { Module } from "vuex-smart-module";
import WorkflowStore from "./modules/workflow";

export default new Module({
  modules: {
    WorkflowStore
  }
});
