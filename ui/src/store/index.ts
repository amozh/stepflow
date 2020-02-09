import Vue from "vue";
import * as Vuex from "vuex";
import { createStore } from "vuex-smart-module";
import RootStore from "./root";

Vue.use(Vuex);

export const store = createStore(RootStore, {
  strict: process.env.NODE_ENV !== "production"
});
