<template>
  <v-card class="pa-5 mb-5" text>
    <v-flex row class="ma-0">
      <p class="grey--text mr-2">{{index+1}}</p>
      <p>{{step.name}}</p>
    </v-flex>
    <p>{{step.description}}</p>
    <v-flex row class="ma-0">
      <v-text-field
        class="pa-0 mr-5"
        label="Write the answer"
        v-model="answer"
        prepend-icon="mdi-pencil"
        :rules="inputRules"
        :disabled="answerResult !==''"
      ></v-text-field>
      <StepButton :answerResult="answerResult" :sendAnswer="sendAnswer" />
    </v-flex>
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
  Watch
} from "vue-property-decorator";
import WorkflowStore from "../store/modules/workflow";
import StepButton from "../components/StepButton.vue";
import { ValidationUtils } from "../utils/validation-utils";
import { IWorkflowStepDto, AnswerDto, IAnswerResult } from "@stepflow/shared";

const Mappers = Vue.extend({
  components: { StepButton }
});

@Component
export default class Step extends Mappers {
  @Provide() answer: string = "";
  @Provide() answerResult: string = "";
  @Provide() inputRules = [ValidationUtils.nonEmptyString];

  @Prop() step!: IWorkflowStepDto;
  @Prop() index!: number;
  @Prop() result: any;

  @Watch("result")
  changeResult(val: IAnswerResult, oldVal: IAnswerResult) {
    if (this.result.stepId === this.step.id) {
      this.answerResult = this.result.result;
    }
  }

  @Emit("send-answer")
  sendAnswer(): AnswerDto {
    const answer = {
      stepId: this.step.id,
      answer: this.answer
    };
    return answer;
  }
}
</script>