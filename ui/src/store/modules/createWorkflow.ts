import { Getters, Mutations, Actions, Module, createMapper } from "vuex-smart-module";
import { v4 as uuidv4 } from "uuid";
import { workflowApi } from "../api/index";

interface ICreateWorkflowDto {
  id: null,
  name: string,
  depth: number,
  description: string,
  input: JSON | any,
  steps: ICreateStepDto[]
}
interface ICreateStepDto {
  id: string,
  name: string,
  description: string,
  input: JSON | any,
  depth: number,
  actions: ICreateActionDto[],
  steps: ICreateStepDto[]
}

interface IWorkflowInfoDto {
  name: string,
  description: string,
  input: any
}

interface ICrumbDto {
  step: any | null,
  depth: number,
  text: string
}

interface ICreateActionDto {
  id: string,
  name: string,
  actionType: ActionType,
  description: string,
  alias: string,
  body: string
}
interface IWorkflowCreatedStatus {
  success: boolean | null,
  text: string
}

export enum ActionType {
  ON_START = "ON_START",
  ON_SUBMIT = "ON_SUBMIT",
  ON_COMPLETE = "ON_COMPLETE",
  CUSTOM = "CUSTOM"
}

class RootState {
  workflow: ICreateWorkflowDto = {
    id: null,
    name: "Workflow_1",
    depth: 0,
    description:
      "Using display utilities you can turn any element into a flexbox container transforming direct children elements into flex items. Using additional flex property utilities, you can customize their interaction even further.",
    input: {
      // wfInput: "someJson"
    },
    steps: [
      // {
      //   id: uuidv4(),
      //   name: "first_1",
      //   description: "first step description",
      //   input: {},
      //   depth: 1,
      //   actions: [],
      //   steps: [
      //     {
      //       id: uuidv4(),
      //       name: "FIRST_SUB_STEP",
      //       description: "first sub step with depth 2",
      //       input: {},
      //       depth: 2,
      //       actions: [],
      //       steps: []
      //     }
      //   ]
      // },
      {
        id: uuidv4(),
        name: "depth_2",
        description: "step with depth 2 some description",
        input: {
          a: 51,
          b: 14
        },
        steps: [],
        depth: 1,
        actions: [
          {
            id: "93adw12adwad",
            name: "first_ACTION",
            actionType: ActionType.ON_START,
            description: "first ACTION description",
            alias: "action alias 999",
            body: "function fn(a,b){return a+b};  res = fn(a,b);"
          }
        ]
      },
      {
        id: uuidv4(),
        name: "depth_3",
        description: "some description of step with  with the greatest depth",
        input: {
          a: 61,
          b: 10
        },
        steps: [],
        depth: 1,
        actions: [
          {
            id: "u8qaowajdawd",
            name: "first_ACTION",
            actionType: ActionType.ON_START,
            description: "first ACTION description",
            alias: "action alias 12415",
            body: "function fn(a,b){return a+b};  res = fn(a,b);"
          },
          // {
          //   id: "19adpldnw7189",
          //   name: "second_ACTION",
          //   actionType: ActionType.ON_SUBMIT,
          //   description: "second ACTION description 123123",
          //   alias: "action alias 888",
          //   body: "function fn(a,b){return a+b};  res = fn(a,b);"
          // }
        ]
      }
    ]
  }
  currentStep: ICreateStepDto | null = null
  currentSteps: ICreateStepDto[] = []
  currentAction: ICreateActionDto | null = null
  workflowInfo: IWorkflowInfoDto | {} = {}
  workflowStatus: IWorkflowCreatedStatus = {
    success: null,
    text: ""
  }
  breadCrumbs: any[] = [{
    step: null,
    depth: 0,
    text: this.workflow.name
  }]
}

class RootGetters extends Getters<RootState> {
  get workflow(): any {
    return this.state.workflow;
  }
  get workflowInfo(): any {
    const info = {
      stepId: this.state.workflow.id,
      name: this.state.workflow.name,
      description: this.state.workflow.description,
      input: this.state.workflow.input,
      depth: this.state.workflow.depth
    }
    return info
  }
  get breadCrumbs(): any {
    return this.state.breadCrumbs
  }
  get currentStep(): ICreateStepDto | null {
    return this.state.currentStep
  }
  get currentSteps(): ICreateStepDto[] {
    return this.state.currentSteps
  }
  get maxDepth(): number {
    return this.state.breadCrumbs[this.state.breadCrumbs.length - 1].depth + 1;
  }
  get currentAction(): ICreateActionDto | null {
    return this.state.currentAction
  }
  get workflowStatus(): IWorkflowCreatedStatus {
    return this.state.workflowStatus
  }
}

class RootMutations extends Mutations<RootState> {
  mutateWorkflowInfo(workflowInfo: IWorkflowInfoDto): void {
    this.state.workflow.name = workflowInfo.name
    this.state.workflow.description = workflowInfo.description
    this.state.workflow.input = workflowInfo.input
  }

  mutateCurrentStep(step: any): ICreateStepDto {
    return this.state.currentStep = step
  }

  mutateCurrentAction(action: any): ICreateActionDto {
    return this.state.currentAction = action
  }

  mutateCurrentSteps(steps: ICreateStepDto[]): ICreateStepDto[] {
    return this.state.currentSteps = steps
  }

  addAction(): void {
    const action: ICreateActionDto = {
      id: uuidv4(),
      name: "New action",
      actionType: ActionType.ON_START,
      description: "",
      alias: `Alias ${uuidv4()}`,
      body: ""
    }
    this.state.currentStep?.actions.push(action)
  }

  saveAction(updatedAction: ICreateActionDto): void {
    const actionIndexById: number | undefined = this.state.currentStep?.actions
      .findIndex(action => action.id === updatedAction.id)
    if (actionIndexById !== -1) {
      this.state.currentStep?.actions.splice(actionIndexById!, 1, updatedAction)
    }
  }

  deleteAction(actionId: string): null {
    const actionIndexById: number | undefined = this.state.currentStep?.actions
      .findIndex(action => action.id === actionId)
    if (actionIndexById !== -1) {
      this.state.currentStep?.actions.splice(actionIndexById!, 1)
    }
    return this.state.currentAction = null
  }

  addStep(depth: number): void {
    const step: ICreateStepDto = {
      id: uuidv4(),
      depth,
      name: "New step",
      description: "",
      input: {},
      actions: [],
      steps: []
    }
    this.state.currentSteps.push(step)
  }

  saveStep(updatedStep: ICreateStepDto): void {
    const parentStep: ICrumbDto = this.state.breadCrumbs.find(br => br.depth === updatedStep.depth - 1)
    if (parentStep.step) {
      const stepIndexById: number = parentStep.step.steps.findIndex((step: any) => step.id === updatedStep.id)
      parentStep.step.steps.splice(stepIndexById, 1, updatedStep)
    } else {
      const stepIndexById: number = this.state.workflow.steps.findIndex((step: any) => step.id === updatedStep.id)
      this.state.workflow.steps.splice(stepIndexById, 1, updatedStep)
    }
  }

  deleteStep(stepInfo: { stepId: string, stepDepth: number }): void {
    const { stepId, stepDepth } = stepInfo
    const parentStep: ICrumbDto = this.state.breadCrumbs.find(br => br.depth === stepDepth - 1)
    this.filterBreadCrumbs(parentStep.depth)
    if (parentStep.step) {
      parentStep.step.steps = parentStep.step.steps.filter((step: any) => step.id !== stepId)
      this.mutateCurrentStep(parentStep.step)
      this.mutateCurrentSteps(parentStep.step.steps)
    } else {
      this.state.workflow.steps = this.state.workflow.steps.filter((step: any) => step.id !== stepId)
      this.mutateCurrentStep(null)
      this.mutateCurrentSteps(this.state.workflow.steps)
    }
  }

  addBreadCrumbs(breadCrumb: ICrumbDto): void {
    const indexByDepth: number = this.state.breadCrumbs.findIndex(
      br => br.depth === breadCrumb.depth
    );
    if (indexByDepth !== -1) {
      this.state.breadCrumbs.splice(indexByDepth, 1);
    }
    this.state.breadCrumbs.push(breadCrumb);
  }

  filterBreadCrumbs(breadCrumbDepth: number): any[] {
    return this.state.breadCrumbs = this.state.breadCrumbs
      .filter(br => br.depth <= breadCrumbDepth)
      .sort((a, b) => {
        return a.depth - b.depth;
      });
  }
  mutateWorkflowCreateStatus(status: number): IWorkflowCreatedStatus {
    if (status === 201) {
      return this.state.workflowStatus = {
        success: true,
        text: `Workflow ${this.state.workflow.name} has been created`
      }
    } else {
      return this.state.workflowStatus = {
        success: false,
        text: "Something went wrong"
      }
    }
  }
}

class RootActions extends Actions<
  RootState,
  RootGetters,
  RootMutations,
  RootActions
  > {
  async createWorkflow(): Promise<any> {
    try {
      const response = await workflowApi.createWorkflow(this.state.workflow);
      this.commit("mutateWorkflowCreateStatus", response.status)
      return response
    } catch (e) {
      throw new Error(e);
    }
  }
  changeWorkflowDescription(workflowInfo: IWorkflowInfoDto): void {
    const crumb: ICrumbDto = {
      step: null,
      depth: 0,
      text: workflowInfo.name
    }
    this.commit("addBreadCrumbs", crumb)
    this.commit("mutateWorkflowInfo", workflowInfo)
  }
  goToStep(step: any): void {
    this.commit("mutateCurrentAction", null)
    this.commit("mutateCurrentStep", step)
  }
  saveStep(updatedStep: ICreateStepDto): void {
    this.commit("saveStep", updatedStep)
    const crumb: ICrumbDto = {
      step: updatedStep,
      depth: updatedStep.depth,
      text: updatedStep.name
    }
    this.commit("addBreadCrumbs", crumb)
  }
  deleteStep(stepInfo: { stepId: string, stepDepth: number }): void {
    const { stepId, stepDepth } = stepInfo
    const parentStep: ICrumbDto = this.state.breadCrumbs.find(br => br.depth === stepDepth - 1)
    this.commit("filterBreadCrumbs", parentStep.depth)
    if (parentStep.step) {
      parentStep.step.steps = parentStep.step.steps.filter((step: any) => step.id !== stepId)
      this.commit("mutateCurrentStep", parentStep.step)
      this.commit("mutateCurrentSteps", parentStep.step.steps)
    } else {
      this.state.workflow.steps = this.state.workflow.steps.filter((step: any) => step.id !== stepId)
      this.commit("mutateCurrentStep", null)
      this.commit("mutateCurrentSteps", this.state.workflow.steps)
    }
  }
  toBreadCrumb(breadCrumb: ICrumbDto): void {
    this.commit("filterBreadCrumbs", breadCrumb.depth)
    if (breadCrumb.step) {
      this.commit("mutateCurrentStep", breadCrumb.step)
      this.commit("mutateCurrentSteps", breadCrumb.step.steps)
    } else {
      this.commit("mutateCurrentStep", null)
      this.commit("mutateCurrentSteps", this.state.workflow.steps)
    }
  }
  saveAction(updatedAction: ICreateActionDto): void {
    this.commit("saveAction", updatedAction)
    const actionById = this.state.currentStep?.actions.find(action => action.id === updatedAction.id)
    this.commit("mutateCurrentAction", actionById)
  }
}

const createWorkflowStore = new Module({
  state: RootState,
  getters: RootGetters,
  mutations: RootMutations,
  actions: RootActions
});

export const createWorkflowMapper = createMapper(createWorkflowStore)

export default createWorkflowStore