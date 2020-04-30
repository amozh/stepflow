<template>
  <div>
    <v-form class="text-center" ref="form">
      <v-text-field
        label="Step name"
        v-model="stepName"
        prepend-icon="format_color_text"
        :rules="inputRules"
      ></v-text-field>
      <v-text-field
        label="Step description"
        v-model="stepDescription"
        prepend-icon="description"
        :rules="inputRules"
      ></v-text-field>
      <VJsoneditor class="mt-5" v-model="stepJson"></VJsoneditor>
      <v-flex class="d-flex flex-row mt-10">
        <Slider
          orientation="vertical"
          :steps="currentStep.actions"
          :currentStep="currentAction"
          @open-step="changeCurrentAction"
          @add-new-step="addNewAction"
        />
        <Action
          class="ml-7"
          v-if="currentAction"
          :currentAction="currentAction"
          @remove-action="removeAction"
          @save-current-action="saveCurrenAction"
        />
        <v-card v-else class="text-center" height="300" width="100%">
          <v-card-title class="text-center">Choose action</v-card-title>
        </v-card>
      </v-flex>
      <v-container class="d-flex flex-row btns">
        <v-btn color="error" class="btn" @click="removeStep(currentStep.id, currentStep.depth)">
          Delete step
          <v-icon class="ml-2">delete_forever</v-icon>
        </v-btn>
        <v-btn text class="success btn" @click="saveCurrentStep">
          Save step
          <v-icon class="ml-2">save</v-icon>
        </v-btn>
      </v-container>
    </v-form>
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
import { ICreateWorkflowStepDto, IActionDto } from '@stepflow/shared';
import VJsoneditor from "v-jsoneditor";
import Action from "./Action.vue";
import Slider from "./Slider.vue";
import { ValidationUtils } from "../../utils/validation-utils";

const Mappers = Vue.extend({
  components: {
    VJsoneditor,
    Action,
    Slider
  }
});

@Component
export default class Step extends Mappers {
  @Prop() currentStep!: ICreateWorkflowStepDto;
  @Prop() currentAction!: IActionDto;

  @Provide() inputRules = [ValidationUtils.nonEmptyString];
  @Provide() stepName: string = "";
  @Provide() stepDescription: string = "";
  @Provide() stepJson: any = {};

  @Emit("change-sub-steps")
  changeSubSteps(): void {
    return;
  }

  @Emit("remove-step")
  removeStep(): void {
    return;
  }

  @Emit("save-current-step")
  saveCurrentStep(): ICreateWorkflowStepDto {
    const step = {
      id: this.currentStep.id,
      depth: this.currentStep.depth,
      name: this.stepName,
      description: this.stepDescription,
      input: this.stepJson,
      actions: this.currentStep.actions,
      steps: this.currentStep.steps
    };
    return step;
  }

  @Emit("change-current-action")
  changeCurrentAction(): void {
    return;
  }

  @Emit("add-new-action")
  addNewAction(): void {
    return;
  }

  @Emit("remove-action")
  removeAction(): void {
    return;
  }

  @Emit("save-current-action")
  saveCurrenAction(): void {
    return;
  }

  @Watch("currentStep")
  changeStepInfo(val: boolean, oldVal: boolean) {
    this.stepName = this.currentStep.name;
    this.stepDescription = this.currentStep.description;
    this.stepJson = this.currentStep.input;
  }

  mounted() {
    this.stepName = this.currentStep.name;
    this.stepDescription = this.currentStep.description;
    this.stepJson = this.currentStep.input;
  }
}
</script>

<style scoped>
.btns {
  justify-content: space-around;
}
.btn {
  width: 250px;
  height: 45px;
}
</style>