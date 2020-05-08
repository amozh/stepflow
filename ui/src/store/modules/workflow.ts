import { Getters, Mutations, Actions, Module, createMapper } from "vuex-smart-module";
import { workflowApi, actionsApi } from "../api/index";
import { ICreateWorkflowDto, IWorkflowExecutionDto } from '@stepflow/shared';

type Loading = boolean;

class RootState {
  workflow: ICreateWorkflowDto = { name: '', input: JSON, description: "", steps: [] };
  executionWorkflow: any = {}
  allWorkflows: ICreateWorkflowDto[] = [];
  allExecutionWorkflows: any[] = []
  isLoading: Loading = false;
  //
  currentStep: any = {}
  wfExecutionState: any = {}
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
  get currentStep(): any {
    return this.state.currentStep
  }
  get wfExecutionState(): any {
    return this.state.wfExecutionState
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
  mutateCurrentStep(step: any): any {
    return this.state.currentStep = step
  }
  mutateWfExecutionState(wfExecutionState: any): any {
    return this.state.wfExecutionState = wfExecutionState
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
      const wfExecution = await workflowApi.executeWorkflow(id)
      console.log(wfExecution);
      this.commit("mutateLoading", false);
      return wfExecution.data.id;
    } catch (e) {
      this.commit("mutateLoading", false);
      throw new Error(e);
    }
  }

  getCurrentStep(): void {
    if (this.state.executionWorkflow.wfStepsExecution.length) {
      const currentStepId: string = this.state.wfExecutionState.renderStepId

      const step = this.state.executionWorkflow.wfStepsExecution
        .find((step: any) => step.id === currentStepId)
      this.commit("mutateCurrentStep", step)
    }
  }

  async workflowOnSubmitAction(submitInfo: { id: number, submitInfo: any }): Promise<void> {
    await actionsApi.workflowOnSubmit(submitInfo)
  }

  async workflowOnLoadAction(workflowExecutionId: string): Promise<any> {
    this.commit('mutateLoading', true)
    const wfExecutionState = await actionsApi.workflowOnLoad(workflowExecutionId)
    this.commit("mutateWfExecutionState", wfExecutionState.data)
    this.dispatch("getCurrentStep") //выполнить экшен в экшене с помощью dispatch
    this.commit('mutateLoading', false)
    return wfExecutionState
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