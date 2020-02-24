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
  Inject
} from "vue-property-decorator";
import WorkflowStore from "../store/modules/workflow";
import StepButton from "../components/StepButton.vue";
import { CreateWorkflowStepDto } from '@stepflow/shared';

const Mappers = Vue.extend({
  components: { StepButton },
  methods: {
    ...WorkflowStore.mapActions({
      checkAnswer: "checkAnswer"
    })
  }
});

@Component
export default class Step extends Mappers {
  //state
  @Provide() answer: string = "";
  @Provide() answerResult: string = "";
  @Provide() inputRules = [
    (v: string) => (v && v.length >= 0) || "Field is required"
  ];

  //props
  @Prop() step!:CreateWorkflowStepDto;
  @Prop() index!: number;
  mounted() {}

  //methods
  @Emit()
  async sendAnswer() {
    if (this.answer) {
      const step = {
        stepId: this.step.id,
        answer: this.answer
      };
      const response = await this.checkAnswer(step);
      this.answerResult = response.data;
    }
  }
}
</script>
<style lang="scss" scoped>
</style>