<template>
  <div class="container">
    <Snackbar :snackbar="workflowStatus.success" :snackbarText="workflowStatus.text" />
    <BreadCrumbs :breadCrumbs="breadCrumbs" :toBreadCrumb="toBreadCrumb" />
    <Slider
      orientation="horizontal"
      :steps="currentSteps"
      @add-new-step="addNewStep"
      @open-step="openStep"
      :maxDepth="maxDepth"
    />
    <WorkflowInfo
      v-if="currentStep===null"
      :workflowInfo="workflowInfo"
      @change-workflow-info="changeWorkflowInfo"
      @create-new-workflow="createNewWorkflow"
    />
    <Step
      v-else
      :currentStep="currentStep"
      :currentAction="currentAction"
      @change-sub-steps="changeSubSteps"
      @remove-step="removeStep"
      @save-current-step="saveCurrentStep"
      @change-current-action="changeCurrentAction"
      @add-new-action="addNewAction"
      @remove-action="removeAction"
      @save-current-action="saveCurrenAction"
    />
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Provide,
  Emit,
  Ref,
  Watch
} from "vue-property-decorator";
import {
  ICreateWorkflowDto,
  ICreateWorkflowStepDto,
  IWorkflowInfoDto,
  ICrumbDto,
  IActionDto,
  IWorkflowCreatedStatus,
  ActionType
} from "@stepflow/shared";
import { createWorkflowMapper } from "../store/modules/createWorkflow";
import WorkflowInfo from "./workflow/WokrflowInfo.vue";
import Slider from "./workflow/Slider.vue";
import BreadCrumbs from "./workflow/BreadCrumbs.vue";
import Step from "./workflow/Step.vue";
import Snackbar from "../components/Snackbar.vue";

const Mappers = Vue.extend({
  computed: {
    ...createWorkflowMapper.mapGetters([
      "workflow",
      "breadCrumbs",
      "currentStep",
      "currentSteps",
      "workflowInfo",
      "maxDepth",
      "currentAction",
      "workflowStatus"
    ])
  },
  methods: {
    ...createWorkflowMapper.mapMutations({
      addBreadCrumbs: "addBreadCrumbs",
      mutateCurrentSteps: "mutateCurrentSteps",
      addStep: "addStep",
      mutateCurrentAction: "mutateCurrentAction",
      addAction: "addAction",
      deleteAction: "deleteAction"
    }),
    ...createWorkflowMapper.mapActions({
      createWorkflow: "createWorkflow",
      changeWorkflowDescription: "changeWorkflowDescription",
      goToStep: "goToStep",
      deleteStep: "deleteStep",
      toBreadCrumb: "toBreadCrumb",
      saveStep: "saveStep",
      saveAction: "saveAction"
    })
  },
  components: {
    WorkflowInfo,
    Slider,
    BreadCrumbs,
    Step,
    Snackbar
  }
});

@Component
export default class CreateWorkflow extends Mappers {
  changeWorkflowInfo(
    workflowInfo: IWorkflowInfoDto
  ): Promise<IWorkflowInfoDto> {
    return this.changeWorkflowDescription(workflowInfo);
  }

  addNewStep(depth: number): void {
    return this.addStep(depth);
  }

  saveCurrentStep(
    step: ICreateWorkflowStepDto
  ): Promise<ICreateWorkflowStepDto[]> {
    return this.saveStep(step);
  }

  removeStep(stepId: string, stepDepth: number): Promise<void> {
    return this.deleteStep({ stepId, stepDepth });
  }

  changeCurrentAction(action: IActionDto): void {
    return this.mutateCurrentAction(action);
  }

  addNewAction(): void {
    return this.addAction();
  }

  removeAction(actionId: string): void {
    return this.deleteAction(actionId);
  }

  saveCurrenAction(updatedAction: IActionDto): Promise<void> {
    return this.saveAction(updatedAction);
  }

  createNewWorkflow(): Promise<ICreateWorkflowDto> {
    return this.createWorkflow();
  }

  openStep(step: ICreateWorkflowStepDto): void {
    const breadCrumb = {
      step,
      depth: step.depth,
      text: step.name
    };
    this.addBreadCrumbs(breadCrumb);
    this.goToStep(step);
    this.mutateCurrentSteps(step.steps); //передаст слайдеру, актуальные для этого степа сабстепы
  }

  changeSubSteps(steps: ICreateWorkflowStepDto[]): void {
    return this.mutateCurrentSteps(steps);
  }

  mounted() {
    this.mutateCurrentSteps(this.workflow.steps);
  }
}
</script>