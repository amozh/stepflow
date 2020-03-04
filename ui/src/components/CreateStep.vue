<template>
  <v-card class="pa-5 mb-5" text>
    <h4>Step {{index+1}}</h4>
    <v-form class="text-right" ref="form">
      <v-text-field
        label="Name"
        v-model="step.name"
        prepend-icon="mdi-rename-box"
        :rules="inputRules"
        :disabled="isSave"
      ></v-text-field>
      <v-textarea
        auto-grow
        class="mt-3"
        label="Description"
        v-model="step.description"
        prepend-icon="mdi-card-text"
        :rules="inputRules"
        :disabled="isSave"
      ></v-textarea>
      <v-text-field
        label="Answer"
        v-model="step.answer.answer"
        prepend-icon="mdi-file-question"
        :rules="inputRules"
        :disabled="isSave"
      ></v-text-field>
      <v-flex row class="ma-0">
        <v-btn class="my-4" color="error" @click="deleteStep(index)">
          Delete
          <v-icon right>mdi-cancel</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="isSave" class="my-4" color="primary" @click="isSave=false">
          Edit
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn v-else class="my-4" color="success" @click="saveStep">Save step</v-btn>
      </v-flex>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Provide,
  Prop,
  Emit,
  Inject,
  Ref,
  Watch
} from "vue-property-decorator";
import { CreateWorkflowStepDto } from "@stepflow/shared";
import { ValidationUtils } from "../utils/validation-utils";

@Component
export default class WfStep extends Vue {
  $refs!: {
    form: HTMLFormElement & { validate: () => boolean };
  };

  @Prop() step!: CreateWorkflowStepDto;
  @Prop() index!: number;

  @Provide() inputRules = [ValidationUtils.nonEmptyString];
  @Provide() isSave: boolean = false;

  @Ref("form") readonly form!: HTMLFormElement & { validate: () => boolean };

  @Emit("save-step") saveStep(): CreateWorkflowStepDto | undefined {
    if (this.$refs.form.validate()) {
      this.isSave = true;
      return this.step;
    }
    return undefined;
  }

  @Emit("delete-step")
  deleteStep(): void {
    return
  }
}
</script>