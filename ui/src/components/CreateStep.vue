<template>
  <v-card class="pa-5 mb-5" text>
    <h4>Step {{index+1}}</h4>
    <v-form class="text-right" ref="form">
      <v-text-field
        label="Name"
        v-model="name"
        prepend-icon="mdi-rename-box"
        :rules="inputRules"
        :disabled="isSave"
      ></v-text-field>
      <v-textarea
        auto-grow
        class="mt-3"
        label="Description"
        v-model="description"
        prepend-icon="mdi-card-text"
        :rules="inputRules"
        :disabled="isSave"
      ></v-textarea>
      <v-text-field
        label="Answer"
        v-model="answer"
        prepend-icon="mdi-file-question"
        :rules="inputRules"
        :disabled="isSave"
      ></v-text-field>
      <v-flex row class="ma-0">
        <!-- <v-btn class="my-4" color="error" @click="deleteStep(index)">
          Delete
          <v-icon right>mdi-cancel</v-icon>
        </v-btn>-->
        <v-spacer></v-spacer>
        <v-btn v-if="isSave" class="my-4" color="primary" @click="isSave=false">
          Edit
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn v-else class="my-4" color="success" @click="addNewStep">Save step</v-btn>
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
  Ref
} from "vue-property-decorator";
import { CreateWorkflowStepDto } from '@stepflow/shared';

const Mappers = Vue.extend({});

@Component
export default class WfStep extends Mappers {
  @Prop() saveStep: any;
  // @Prop() deleteStep: any;
  @Prop() inputRules!: [];
  @Prop() step!: CreateWorkflowStepDto; 
  @Prop() index!: number;

  @Provide() name: string = "";
  @Provide() description: string = "";
  @Provide() answer: string = "";
  @Provide() isSave: boolean = false;

  @Ref("form") readonly form!: HTMLInputElement;

  @Emit()
  addNewStep(): void {
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      const newStep = {
        name: this.name,
        description: this.description,
        answer: {
          answer: this.answer
        }
      };
      this.saveStep(newStep, this.index);
      this.isSave = true;
    }
  }

  mounted() {
    if (this.step) {
      this.name = this.step.name;
      this.description = this.step.description;
      this.answer = this.step.answer.answer;
    }
  }
}
</script>
<style lang="scss" scoped>
</style>