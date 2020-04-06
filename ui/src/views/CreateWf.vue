<template>
  <div class="container">
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
import { createWorkflowMapper } from "../store/modules/createWorkflow";
import WorkflowInfo from "./workflow/WokrflowInfo.vue";
import Slider from "./workflow/Slider.vue";
import BreadCrumbs from "./workflow/BreadCrumbs.vue";
import Step from "./workflow/Step.vue";

const Mappers = Vue.extend({
  computed: {
    ...createWorkflowMapper.mapGetters([
      "workflow",
      "breadCrumbs",
      "currentStep",
      "currentSteps",
      "workflowInfo",
      "maxDepth",
      "currentAction"
    ])
  },
  methods: {
    ...createWorkflowMapper.mapMutations({
      mutateWorkflowInfo: "mutateWorkflowInfo",
      addBreadCrumbs: "addBreadCrumbs",
      toBreadCrumb: "toBreadCrumb",
      mutateCurrentSteps: "mutateCurrentSteps",
      mutateCurrentStep: "mutateCurrentStep",
      deleteStep: "deleteStep",
      saveStep: "saveStep",
      addStep: "addStep",
      mutateCurrentAction: "mutateCurrentAction",
      addAction: "addAction",
      deleteAction: "deleteAction",
      saveAction: "saveAction"
    })
  },
  components: {
    WorkflowInfo,
    Slider,
    BreadCrumbs,
    Step
  }
});

@Component
export default class CreateWorkflow extends Mappers {
  changeWorkflowInfo(workflowInfo): any {
    return this.mutateWorkflowInfo(workflowInfo);
  }

  addNewStep(depth: number): any {
    return this.addStep(depth);
  }

  saveCurrentStep(step: any): any {
    return this.saveStep(step);
  }

  removeStep(stepId: string, stepDepth: number): any {
    return this.deleteStep({ stepId, stepDepth });
  }

  changeCurrentAction(action: any): any {
    return this.mutateCurrentAction(action);
  }

  addNewAction(): any {
    return this.addAction();
  }

  removeAction(actionId: string): any {
    return this.deleteAction(actionId);
  }

  saveCurrenAction(updatedAction: any): any {
    return this.saveAction(updatedAction);
  }

  openStep(step: any): void {
    const breadCrumb = {
      step,
      depth: step.depth,
      text: step.name
    };
    this.addBreadCrumbs(breadCrumb);
    this.mutateCurrentStep(step); //установит текущий степ
    this.mutateCurrentSteps(step.steps); //передаст слайдеру, актуальные для этого степа сабстепы
    return;
  }

  changeSubSteps(steps: any[]): any {
    return this.mutateCurrentSteps(steps);
  }

  mounted() {
    this.mutateCurrentSteps(this.workflow.steps);
  }
}
</script>