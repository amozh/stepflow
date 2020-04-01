<template>
  <div>
    <div class="container">
      <v-form class="text-center" width="500" ref="form">
        <v-text-field
          class
          label="Step name"
          v-model="stepName"
          prepend-icon="format_color_text"
          :rules="inputRules"
        ></v-text-field>
        <v-text-field
          class
          label="Step description"
          v-model="stepDescription"
          prepend-icon="description"
          :rules="inputRules"
        ></v-text-field>
        <VJsoneditor :rules="inputRules" class="mt-5" v-model="stepJson"></VJsoneditor>

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
          Save
          <v-icon class="ml-2">save</v-icon>
        </v-btn>
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
import { ValidationUtils } from "../../utils/validation-utils";

const Mappers = Vue.extend({
  components: {
    VJsoneditor
  }
});
@Component
export default class Step extends Mappers {
  @Provide() inputRules = [ValidationUtils.nonEmptyString];
  @Provide() stepJson: any = {};
  @Provide() stepName: string = "";
  @Provide() stepDescription: string = "";
  // @Provide() objTest: {} = {
  //   string: Math.random()
  // };

  @Prop() currentStep: any;
  @Prop() autoSave: boolean;

  @Emit("delete-step")
  deleteStep(): void {
    return;
  }

  @Emit("save-step")
  saveStep(step, stepIndex): { step: object; stepIndex: number } {
    return { step, stepIndex };
  }

  @Watch("currentStep")
  watchCurrentStep(val: any, oldVal: any) {
    this.stepName = this.currentStep.step.name;
    this.stepDescription = this.currentStep.step.description;
    this.stepJson = this.currentStep.step.input;
  }

  beforeUpdate() {
    if (this.autoSave) {
      this.saveStep(
        {
          name: this.stepName,
          description: this.stepDescription,
          input: this.stepJson,
          depth: this.currentStep.step.depth
        },
        this.currentStep.stepIndex
      );
    }
  }

  mounted() {
    this.stepName = this.currentStep.step.name;
    this.stepDescription = this.currentStep.step.description;
    this.stepJson = this.currentStep.step.input;
  }
}
</script>