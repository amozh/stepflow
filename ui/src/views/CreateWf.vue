<template>
  <div class="container">
    <BreadCrumbs :breadcrumbs="breadcrumbs" @to-crumb="toCrumb" />
    <v-switch v-model="autoSave" class="mx-2" label="Autosave"></v-switch>
    <StepsSlider
      :steps="workflow.steps"
      @add-step="addStep"
      @open-step="openStep"
      :breadcrumbs="breadcrumbs"
      @to-crumb="toCrumb"
      :currentStepIndex="currentStep&&currentStep.stepIndex"
    />
    <Step
      v-if="(currentStep)"
      :currentStep="currentStep"
      @delete-step="deleteStep"
      @save-step="saveStep"
      :autoSave="autoSave"
    />
    <WorkflowInfo v-else :workflow="workflow" />
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
import VJsoneditor from "v-jsoneditor";
import BreadCrumbs from "./workflow/BreadCrumbs.vue";
import StepsSlider from "./workflow/StepsSlider.vue";
import WorkflowInfo from "./workflow/WorkflowInfo.vue";
import Step from "./workflow/Step.vue";

const Mappers = Vue.extend({
  components: {
    VJsoneditor,
    BreadCrumbs,
    StepsSlider,
    WorkflowInfo,
    Step
  }
});

@Component
export default class CreateWorkflow extends Mappers {
  @Provide() workflow: any = {
    name: "Workflow_1",
    depth: 0,
    description:
      "Using display utilities you can turn any element into a flexbox container transforming direct children elements into flex items. Using additional flex property utilities, you can customize their interaction even further.",
    steps: [
      {
        name: "first_1",
        description: "first step description",
        input: {},
        depth: 1
      },
      // { name: "second_2", depth: 1 },
      // { name: "third_3", depth: 1 }, // сабстепы будут получать инкремент к глубине их степа-родителя
      {
        name: "depth_2",
        description: "step with depth 2 some description",
        input: { second: "depth" },
        depth: 2
      },
      {
        name: "depth_3",
        description: "some description of step with  with the greatest depth",
        input: {},
        depth: 3
      }
    ]
  };
  @Provide() breadcrumbs: any = [];
  @Provide() currentStep: any = null;
  @Provide() autoSave: boolean = false;

  addStep(stepDepth: number = 1): any[] {
    return this.workflow.steps.push({
      name: `RandomStep:${Math.floor(Math.random() * 100)}`,
      depth: stepDepth
    });
  }

  saveStep({ step, stepIndex }): void {
    this.workflow.steps.splice(stepIndex, 1, step);
  }

  deleteStep(stepIndex: number, stepDepth: number): void {
    this.breadcrumbs = this.breadcrumbs.filter(br => br.depth < 1);
    this.workflow.steps.splice(stepIndex, 1);
    this.currentStep = null;
  }

  openStep(stepIndex: number, step: any): void {
    const indexByDepth: number = this.breadcrumbs.findIndex(
      br => br.depth === step.depth
    );
    if (indexByDepth !== -1) {
      this.breadcrumbs.splice(indexByDepth, 1);
    }
    this.breadcrumbs.push({
      text: step.name,
      depth: step.depth,
      stepInfo: { step, stepIndex }
    });

    // Отфильтрует все элементы массива, глубина которых больше текущего степа. Отсортирует по увеличению глубины
    this.breadcrumbs = this.breadcrumbs
      .filter(br => br.depth <= step.depth)
      .sort((a, b) => {
        return a.depth - b.depth;
      });
    this.currentStep = { step, stepIndex };
  }

  toCrumb(crumb): void {
    this.breadcrumbs = this.breadcrumbs.filter(br => br.depth <= crumb.depth);
    if (crumb.depth === 0) {
      this.currentStep = null;
    } else {
      this.currentStep = crumb.stepInfo;
    }
  }

  mounted() {
    this.breadcrumbs.push({
      text: this.workflow.name,
      depth: this.workflow.depth
    });
  }
}
</script>
<style scoped>
.pointer {
  cursor: pointer;
}
</style>