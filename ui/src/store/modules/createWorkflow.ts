import { Getters, Mutations, Actions, Module, createMapper } from "vuex-smart-module";
import { v4 as uuidv4 } from "uuid";
import { workflowApi } from "../api/index";
import {
  ICreateWorkflowDto,
  ICreateWorkflowStepDto,
  IWorkflowInfoDto,
  ICrumbDto,
  IActionDto,
  IWorkflowCreatedStatus,
  ActionType,
  IStepViewElement,
  IStepViewJson
} from '@stepflow/shared';

class RootState {
  stepViewElements: IStepViewElement[] = [
    // {
    //   component: {
    //     id: 2,
    //     componentType: "json"
    //   }
    // },
    // {
    //   component: {
    //     id: 1,
    //     componentType: "test",
    //     data: {
    //       question: "First question",
    //       options: [
    //         { value: "First option", isCorrect: true },
    //         { value: "Second option", isCorrect: false },
    //         { value: "Third option", isCorrect: false }
    //       ]
    //     }
    //   }
    // },
    // {
    //   component: {
    //     id: 3,
    //     componentType: "button",
    //     label: "Кнопка123",
    //   },
    //   onClick: "submit",
    //   data: [{ source: "input" }]
    // }
  ]
  stepViewJson: IStepViewJson = {
    elements: this.stepViewElements
  }
  workflow: ICreateWorkflowDto = {
    id: null,
    name: "Workflow_123",
    depth: 0,
    description:
      "Using display utilities you can turn any element into a flexbox container transforming direct children elements into flex items. Using additional flex property utilities, you can customize their interaction even further.",
    input: {
      // wfInput: "someJson"
    },
    steps: [
      {
        id: uuidv4(),
        name: "depth_2",
        description: "step with depth 2 some description",
        stepViewJson: {
          stepViewElements: []
        },
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
            alias: "action alias 999123",
            body: "function fn(a,b){return a+b};  res = fn(a,b);"
          }
        ]
      },
      {
        id: uuidv4(),
        name: "depth_3",
        description: "some description of step with  with the greatest depth",
        stepViewJson: {
          stepViewElements: []
        },
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
            alias: "action alias 12415654",
            body: "function fn(a,b){return a+b};  res = fn(a,b);"
          }
        ]
      }
    ]
  }
  currentStep: ICreateWorkflowStepDto | null = null
  currentSteps: ICreateWorkflowStepDto[] = []
  currentAction: IActionDto | null = null
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
  get stepViewElements(): IStepViewElement {
    return this.state.stepViewElements
  }
  get stepViewJson(): IStepViewJson {
    return this.state.stepViewJson
  }
  get workflow(): ICreateWorkflowDto {
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
  get currentStep(): ICreateWorkflowStepDto | null {
    return this.state.currentStep
  }
  get currentSteps(): ICreateWorkflowStepDto[] {
    return this.state.currentSteps
  }
  get maxDepth(): number {
    return this.state.breadCrumbs[this.state.breadCrumbs.length - 1].depth + 1;
  }
  get currentAction(): IActionDto | null {
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

  mutateCurrentStep(step: any): ICreateWorkflowStepDto {
    return this.state.currentStep = step
  }

  mutateCurrentAction(action: any): IActionDto {
    return this.state.currentAction = action
  }

  mutateCurrentSteps(steps: ICreateWorkflowStepDto[]): ICreateWorkflowStepDto[] {
    return this.state.currentSteps = steps
  }

  mutateStepViewElement(stepViewJson: any): any {
    if (stepViewJson.stepViewElements.length) {
      console.log("mutate stepView")
      return this.state.stepViewElements = stepViewJson.stepViewElements
    }
  }

  addAction(): void {
    const action: IActionDto = {
      id: uuidv4(),
      name: "New action",
      actionType: ActionType.ON_START,
      description: "",
      alias: `Alias ${uuidv4()}`,
      body: ""
    }
    this.state.currentStep?.actions.push(action)
  }

  saveAction(updatedAction: IActionDto): void {
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
    const step: ICreateWorkflowStepDto = {
      id: uuidv4(),
      depth,
      name: "New step",
      description: "some description",
      input: {},
      stepViewJson: {
        stepViewElements: []
      },
      actions: [],
      steps: []
    }
    this.state.currentSteps.push(step)
  }

  saveStep(updatedStep: ICreateWorkflowStepDto): ICreateWorkflowStepDto[] {
    const parentStep: ICrumbDto = this.state.breadCrumbs.find(br => br.depth === updatedStep.depth - 1)
    if (parentStep.step) {
      const stepIndexById: number = parentStep.step.steps
        .findIndex((step: ICreateWorkflowStepDto) => step.id === updatedStep.id)
      return parentStep.step.steps.splice(stepIndexById, 1, updatedStep)
    } else {
      const stepIndexById: number = this.state.workflow.steps
        .findIndex((step: ICreateWorkflowStepDto) => step.id === updatedStep.id)
      return this.state.workflow.steps.splice(stepIndexById, 1, updatedStep)
    }
  }

  deleteStep(stepInfo: { stepId: string, stepDepth: number }): void {
    const { stepId, stepDepth } = stepInfo
    const parentStep: ICrumbDto = this.state.breadCrumbs.find(br => br.depth === stepDepth - 1)
    this.filterBreadCrumbs(parentStep.depth)
    if (parentStep.step) {
      parentStep.step.steps = parentStep.step.steps.filter((step: ICreateWorkflowStepDto) => step.id !== stepId)
      this.mutateCurrentStep(parentStep.step)
      this.mutateCurrentSteps(parentStep.step.steps)
    } else {
      this.state.workflow.steps = this.state.workflow.steps.filter((step: ICreateWorkflowStepDto) => step.id !== stepId)
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

  // ------------------------------------
  addQuestion(newQuestion: any): void {
    this.state.stepViewElements.push(newQuestion)
  }
  addText(newText: string): void {
    this.state.stepViewElements.push(newText)
  }
  addInput(newInput: any): void {
    this.state.stepViewElements.push(newInput)
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
  goToStep(step: ICreateWorkflowStepDto): void {
    if (step.actions && step.actions.length) {
      this.commit("mutateCurrentAction", step.actions[0])
      this.commit("mutateCurrentStep", step)
    } else {
      this.commit("mutateCurrentAction", null)
      this.commit("mutateCurrentStep", step)
    }
  }
  saveStep(updatedStep: ICreateWorkflowStepDto): void {
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
      parentStep.step.steps = parentStep.step.steps.filter((step: ICreateWorkflowStepDto) => step.id !== stepId)
      this.commit("mutateCurrentStep", parentStep.step)
      this.commit("mutateCurrentSteps", parentStep.step.steps)
    } else {
      this.state.workflow.steps = this.state.workflow.steps.filter((step: ICreateWorkflowStepDto) => step.id !== stepId)
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
  saveAction(updatedAction: IActionDto): void {
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