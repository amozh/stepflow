<template>
  <div>
    <div class="container">
      <v-form class="text-center" width="500" ref="form">
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
        <VJsoneditor :rules="inputRules" class="mt-5" v-model="stepJson"></VJsoneditor>
        <v-flex class="d-flex flex-row">
          <StepsSlider
            class="l-10"
            :steps="actions"
            @add-step="addAction"
            @open-step="openAction"
            :orientation="'vertical'"
            :currentStepIndex="currentAction&&currentAction.actionIndex"
          />
          <Action
            v-if="(currentAction)"
            :currentAction="currentAction"
            @delete-action="deleteAction"
            @save-action="saveAction"
            :autoSave="autoSave"
          />
          <v-card class="center pt-8" width="100%" height="100" outlined v-else>ADD ACTIONS</v-card>
        </v-flex>
        <v-container class="d-flex flex-row btns">
          <v-btn color="error" @click="deleteStep(currentStep.stepIndex, currentStep.step.depth)">
            Delete
            <v-icon class="ml-2">delete_forever</v-icon>
          </v-btn>
          <v-btn
            text
            class="success"
            width="200"
            @click="saveStep({name:stepName, description:stepDescription, input:stepJson, depth: currentStep.step.depth}, currentStep.stepIndex)"
          >
            Save step
            <v-icon class="ml-2">save</v-icon>
          </v-btn>
        </v-container>
      </v-form>
    </div>
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
import StepsSlider from "./StepsSlider.vue";
import { ValidationUtils } from "../../utils/validation-utils";
import Action from "./Action.vue";

export enum ActionType {
  ON_START = "ON_START",
  ON_SUBMIT = "ON_SUBMIT",
  ON_COMPLETE = "ON_COMPLETE",
  CUSTOM = "CUSTOM"
}

const Mappers = Vue.extend({
  components: {
    VJsoneditor,
    StepsSlider,
    Action
  }
});
@Component
export default class Step extends Mappers {
  @Provide() inputRules = [ValidationUtils.nonEmptyString];
  @Provide() stepJson: any = {};
  @Provide() stepName: string = "";
  @Provide() stepDescription: string = "";
  @Provide() currentAction: any = null;
  @Provide() actions: any[] = [];

  @Prop() currentStep: any;
  @Prop() autoSave: boolean;

  @Emit("delete-step")
  deleteStep(): void {
    return;
  }

  @Emit("save-step")
  saveStep(
    step: object,
    stepIndex: number
  ): { step: object; stepIndex: number } {
    return { step, stepIndex };
  }

  @Watch("currentStep")
  watchCurrentStep(val: any, oldVal: any) {
    if (this.currentStep.step.actions[0] !== undefined) {
      this.currentAction = {
        action: this.currentStep.step.actions[0],
        actionIndex: 0
      };
    } else {
      this.currentAction = null;
    }
    this.stepName = this.currentStep.step.name;
    this.stepDescription = this.currentStep.step.description;
    this.stepJson = this.currentStep.step.input;
    this.actions = this.currentStep.step.actions;
  }

  addAction(): any {
    return this.actions.push({
      name: `Random action :${Math.floor(Math.random() * 100)}`,
      alias: `alias:${Math.floor(Math.random() * 100)}`
    });
  }

  openAction(actionIndex: number, action: any): void {
    this.currentAction = { action, actionIndex };
  }

  deleteAction(actionIndex: number): null {
    this.actions.splice(actionIndex, 1);
    return (this.currentAction = null);
  }

  saveAction({ action, actionIndex }): void {
    console.log(action, actionIndex, "action, actionIndex");
    this.actions.splice(actionIndex, 1, action);
  }

  beforeUpdate() {
    if (this.autoSave) {
      this.saveStep(
        {
          name: this.stepName,
          description: this.stepDescription,
          input: this.stepJson,
          actions: this.actions,
          depth: this.currentStep.step.depth
        },
        this.currentStep.stepIndex
      );
    }
  }

  mounted() {
    if (this.currentStep.step.actions[0] !== undefined) {
      this.currentAction = {
        action: this.currentStep.step.actions[0],
        actionIndex: 0
      };
    } else {
      this.currentAction = null;
    }
    this.stepName = this.currentStep.step.name;
    this.stepDescription = this.currentStep.step.description;
    this.stepJson = this.currentStep.step.input;
    this.actions = this.currentStep.step.actions;
  }
}
</script>

<style lang="scss" scoped>
.btns {
  justify-content: space-around;
}
</style>