import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import { workflowApi } from "../api/index";

type Loading = boolean;

class RootState {
  workflow: any = {};
  allWorkflows: any = [];
  isLoading: Loading = false;
}

class RootGetters extends Getters<RootState> {
  get allWorkflows(): any {
    return this.state.allWorkflows;
  }
  get currentWorkflow(): any {
    return this.state.workflow;
  }
  get isLoading(): Loading {
    return this.state.isLoading;
  }
}

class RootMutations extends Mutations<RootState> {
  mutateLoading(loading: Loading): any {
    this.state.isLoading = loading;
  }
  mutateAllWorkflows(workflows: []): any {
    this.state.allWorkflows = workflows;
  }
  mutateWorkflowById(workflow: {}): any {
    this.state.workflow = workflow;
  }
}

class RootActions extends Actions<
  RootState,
  RootGetters,
  RootMutations,
  RootActions
> {
  async getAllWorkflows() {
    this.commit("mutateLoading", true);
    const response = await workflowApi.getAll();
    this.commit("mutateAllWorkflows", response.data);
    this.commit("mutateLoading", false);
  }

  async getWorkflowById(id: string) {
    this.commit("mutateLoading", true);
    const response = await workflowApi.getById(id);
    this.commit("mutateWorkflowById", response.data);
    this.commit("mutateLoading", false);
  }

  async checkAnswer(step: { stepId: string; answer: string }): Promise<any> {
    const answer = {
      parent: step.stepId,
      answer: step.answer
    };
    const response = await workflowApi.checkAnswer(answer);
    return response;
  }
  async createWorkflow(workflow: any): Promise<any> {
    const response = await workflowApi.createWorkflow(workflow);
    return response;
  }
}

// Экспорт модуля
export default new Module({
  state: RootState,
  getters: RootGetters,
  mutations: RootMutations,
  actions: RootActions
});
