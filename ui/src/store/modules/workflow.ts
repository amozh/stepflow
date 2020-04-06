import { Getters, Mutations, Actions, Module, createMapper } from "vuex-smart-module";
import { workflowApi } from "../api/index";
import { ICreateWorkflowDto } from '@stepflow/shared';

type Loading = boolean;

class RootState {
  workflow: ICreateWorkflowDto = { name: '', input: JSON, description: "", steps: [] };
  allWorkflows: ICreateWorkflowDto[] = [];
  isLoading: Loading = false;
}

class RootGetters extends Getters<RootState> {
  get allWorkflows(): ICreateWorkflowDto[] {
    return this.state.allWorkflows;
  }
  get currentWorkflow(): ICreateWorkflowDto {
    return this.state.workflow;
  }
  get isLoading(): Loading {
    return this.state.isLoading;
  }
}

class RootMutations extends Mutations<RootState> {
  mutateLoading(loading: Loading): void {
    this.state.isLoading = loading;
  }
  mutateAllWorkflows(workflows: ICreateWorkflowDto[]): void {
    this.state.allWorkflows = workflows;
  }
  mutateWorkflowById(workflow: ICreateWorkflowDto): void {
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
  async createWorkflow(workflow: ICreateWorkflowDto): Promise<any> {
    const response = await workflowApi.createWorkflow(workflow);
    return response;
  }
}

const workflowStore = new Module({
  state: RootState,
  getters: RootGetters,
  mutations: RootMutations,
  actions: RootActions
});

export const workflowMapper = createMapper(workflowStore)

export default workflowStore