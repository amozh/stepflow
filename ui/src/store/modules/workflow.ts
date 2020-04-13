import { Getters, Mutations, Actions, Module, createMapper } from "vuex-smart-module";
import { workflowApi } from "../api/index";
import { ICreateWorkflowDto, IWorkflowExecutionDto } from '@stepflow/shared';

type Loading = boolean;

class RootState {
  workflow: ICreateWorkflowDto = { name: '', input: JSON, description: "", steps: [] };
  executionWorkflow: any = {}
  allWorkflows: ICreateWorkflowDto[] = [];
  allExecutionWorkflows: any[] = []
  isLoading: Loading = false;
}

class RootGetters extends Getters<RootState> {
  get allWorkflows(): ICreateWorkflowDto[] {
    return this.state.allWorkflows;
  }
  get currentWorkflow(): ICreateWorkflowDto {
    return this.state.workflow;
  }
  get executedWorkflow(): any {
    return this.state.executionWorkflow
  }
  get allExecutionWorkflows(): any[] {
    return this.state.allExecutionWorkflows
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
  mutateAllExecutionWorkflows(executionWorkflows: IWorkflowExecutionDto[]): any {
    return this.state.allExecutionWorkflows = executionWorkflows
  }
  mutateWorkflowById(workflow: ICreateWorkflowDto): void {
    this.state.workflow = workflow;
  }
  mutateExecutionWorkflow(executionWf: IWorkflowExecutionDto): any {
    return this.state.executionWorkflow = executionWf
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
    const workflows = await workflowApi.getAll();
    this.commit("mutateAllWorkflows", workflows.data);
    this.commit("mutateLoading", false);
  }

  async getAllExecutionWorkflows() {
    this.commit("mutateLoading", true);
    const executionWorkflows = await workflowApi.getAllExecution()
    this.commit("mutateAllExecutionWorkflows", executionWorkflows.data);
    this.commit("mutateLoading", false);
  }

  async getWorkflowById(id: string) {
    this.commit("mutateLoading", true);
    const response = await workflowApi.getById(id);
    this.commit("mutateWorkflowById", response.data);
    this.commit("mutateLoading", false);
  }

  async getExecutionWorkflow(id: string): Promise<any> {
    try {
      this.commit("mutateLoading", true);
      const response = await workflowApi.getExecutionWorkflow(id)
      this.commit("mutateExecutionWorkflow", response.data);
      this.commit("mutateLoading", false);
    } catch (e) {
      this.commit("mutateLoading", false);
      throw new Error(e);
    }
  }

  async executeWorkflow(id: string): Promise<any> {
    try {
      this.commit("mutateLoading", true);
      await workflowApi.executeWorkflow(id)
      this.commit("mutateLoading", false);
    } catch (e) {
      this.commit("mutateLoading", false);
      throw new Error(e);
    }
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