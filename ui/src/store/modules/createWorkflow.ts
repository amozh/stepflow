import { Getters, Mutations, Actions, Module, createMapper } from "vuex-smart-module";
import { v4 as uuidv4 } from "uuid";
// import { workflowApi } from "../api/index";

interface ICreateStepDto {
  id: string,
  name: string,
  description: string,
  input: JSON | any,
  depth: number,
  actions: any[],
  steps: ICreateStepDto[]
}

export enum ActionType {
  ON_START = "ON_START",
  ON_SUBMIT = "ON_SUBMIT",
  ON_COMPLETE = "ON_COMPLETE",
  CUSTOM = "CUSTOM"
}

class RootState {
  workflow: any = {
    id: null,
    name: "Workflow_1",
    depth: 0,
    description:
      "Using display utilities you can turn any element into a flexbox container transforming direct children elements into flex items. Using additional flex property utilities, you can customize their interaction even further.",
    input: {
      wfInput: "someJson"
    },
    steps: [
      {
        id: uuidv4(),
        name: "first_1",
        description: "first step description",
        input: {},
        depth: 1,
        actions: [],
        steps: [
          {
            id: uuidv4(),
            name: "FIRST_SUB_STEP",
            description: "first sub step with depth 2",
            input: {},
            depth: 2,
            actions: [],
            steps: []
          }
        ]
      },
      {
        id: uuidv4(),
        name: "depth_2",
        description: "step with depth 2 some description",
        input: { second: "depth" },
        steps: [],
        depth: 1,
        actions: [
          {
            id: "93adw12adwad",
            name: "first_ACTION",
            actionType: ActionType.ON_START,
            description: "first ACTION description",
            alias: "action alias 999",
            body: "let summ = (a,b) => { return a+b }"
          }
        ]
      },
      {
        id: uuidv4(),
        name: "depth_3",
        description: "some description of step with  with the greatest depth",
        input: {},
        steps: [],
        depth: 1,
        actions: [
          {
            id: "u8qaowajdawd",
            name: "first_ACTION",
            actionType: ActionType.ON_START,
            description: "first ACTION description",
            alias: "action alias 12415",
            body: "let summ = (a,b) => { return a+b }"
          },
          {
            id: "19adpldnw7189",
            name: "second_ACTION",
            actionType: ActionType.ON_SUBMIT,
            description: "second ACTION description 123123",
            alias: "action alias 888",
            body: "let summ = (a,b) => { return a+b }"
          }
        ]
      }
    ]
  }
  currentStep: ICreateStepDto | null = null
  currentSteps: ICreateStepDto[] = []
  currentAction: any | null = null
  // currentActions:
  workflowInfo: any = {}
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
  get currentAction(): any {
    return this.state.currentAction
  }
}

class RootMutations extends Mutations<RootState> {
  mutateWorkflowInfo(workflowInfo: { name: string, description: string, input: any }): any {
    this.state.workflow.name = workflowInfo.name
    this.state.workflow.description = workflowInfo.description
    this.state.workflow.input = workflowInfo.input
    const crumb = {
      step: null,
      depth: 0,
      text: workflowInfo.name
    }
    return this.addBreadCrumbs(crumb)
  }

  mutateCurrentStep(step: any): any {
    this.mutateCurrentAction(null) // ОПЯТЬ ЖЕ, ВЫЗВАТЬ ОБЕ МУТАЦИИ В ОДНОМ ЭКШЕНЕ
    return this.state.currentStep = step
  }

  mutateCurrentAction(action: any): any {
    return this.state.currentAction = action
  }

  mutateCurrentSteps(steps: any): any {
    return this.state.currentSteps = steps
  }

  addAction(): any {
    const action: any = {
      id: uuidv4(),
      name: "New action",
      actionType: ActionType.ON_START,
      description: "",
      alias: `Alias ${uuidv4()}`,
      body: ""
    }
    return this.state.currentStep?.actions.push(action)
  }

  saveAction(updatedAction: any): any {
    const actionIndexById: number | undefined = this.state.currentStep?.actions
      .findIndex(action => action.id === updatedAction.id)
    if (actionIndexById !== -1) {
      this.state.currentStep?.actions.splice(actionIndexById!, 1, updatedAction)
    }
  }

  deleteAction(actionId: string): null {
    console.log(actionId, "actionId")
    const actionIndexById: number | undefined = this.state.currentStep?.actions
      .findIndex(action => action.id === actionId)
    console.log(actionIndexById, "actionIndexById")
    if (actionIndexById !== -1) {
      this.state.currentStep?.actions.splice(actionIndexById!, 1)
    }
    return this.state.currentAction = null
  }

  addStep(depth: number): any {
    const step = {
      id: uuidv4(),
      depth,
      name: "New step",
      description: "",
      input: {},
      actions: [],
      steps: []
    }
    return this.state.currentSteps.push(step)
  }

  saveStep(updatedStep: any): any {
    const parentStep = this.state.breadCrumbs.find(br => br.depth === updatedStep.depth - 1)
    if (parentStep.step) {
      const stepIndexById = parentStep.step.steps.findIndex((step: any) => step.id === updatedStep.id)
      parentStep.step.steps.splice(stepIndexById, 1, updatedStep)
    } else {
      const stepIndexById = this.state.workflow.steps.findIndex((step: any) => step.id === updatedStep.id)
      this.state.workflow.steps.splice(stepIndexById, 1, updatedStep)
    }
    const crumb = {
      step: updatedStep,
      depth: updatedStep.depth,
      text: updatedStep.name
    }
    return this.addBreadCrumbs(crumb)
  }

  deleteStep(stepInfo: { stepId: string, stepDepth: number }): void {
    const { stepId, stepDepth } = stepInfo
    const parentStep = this.state.breadCrumbs.find(br => br.depth === stepDepth - 1)
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

  addBreadCrumbs(breadCrumb: any): any {
    const indexByDepth: number = this.state.breadCrumbs.findIndex(
      br => br.depth === breadCrumb.depth
    );
    if (indexByDepth !== -1) {
      this.state.breadCrumbs.splice(indexByDepth, 1);
    }
    return this.state.breadCrumbs.push(breadCrumb);
  }

  toBreadCrumb(breadCrumb: any): void {
    this.filterBreadCrumbs(breadCrumb.depth)
    if (breadCrumb.step) {
      this.mutateCurrentStep(breadCrumb.step)
      this.mutateCurrentSteps(breadCrumb.step.steps)
    } else {
      this.mutateCurrentStep(null)
      this.mutateCurrentSteps(this.state.workflow.steps)
    }
  }

  filterBreadCrumbs(breadCrumbDepth: number): any[] {
    return this.state.breadCrumbs = this.state.breadCrumbs
      .filter(br => br.depth <= breadCrumbDepth)
      .sort((a, b) => {
        return a.depth - b.depth;
      });
  }
}

class RootActions extends Actions<
  RootState,
  RootGetters,
  RootMutations,
  RootActions
  > {
  // НУЖНО ВЫЗЫВАТЬ ЭКШЕНЫ, А ПОТОМ В НИХ УЖЕ ВЫЗЫВАТЬ СРАЗУ НЕСКОЛЬКО МУТАЦИЙ
}

const createWorkflowStore = new Module({
  state: RootState,
  getters: RootGetters,
  mutations: RootMutations,
  actions: RootActions
});

export const createWorkflowMapper = createMapper(createWorkflowStore)

export default createWorkflowStore