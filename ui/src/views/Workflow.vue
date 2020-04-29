<template>
  <div class="container">
    executedWorkflow: {{executedWorkflow}}
    ////////////////
    <!-- <div v-if="isLoading" class="text-center mt-10">
      <v-progress-circular indeterminate :size="60" color="primary"></v-progress-circular>
    </div>
    <div v-else>
      <v-flex class="text-center">
        <h1 class="subheading mb-5">{{currentWorkflow.name}}</h1>
        <p>{{currentWorkflow.description}}</p>
      </v-flex>
      <Step
        :step="step"
        :index="index"
        v-for="(step, index) in currentWorkflow.steps"
        :key="step.id"
        :result="result"
      />
    </div> -->
    <div v-for="el in executedWorkflow.wfStepsExecution[0].stepViewJson.stepViewElement" :key="el.component.id">

      <div v-if="el.component.componentType == 'test'">
        <p>{{el.component.data.question}}</p>
        <div v-for="option in el.component.data.options" :key="option.id">
          <v-checkbox
            :label="option.value"
          ></v-checkbox>
        </div>
      </div>

      <div v-if="el.component.componentType == 'button'">
        <input type="submit" :value="el.component.label" class="button">
      </div>
    </div>

  </div>
</template>
<script lang="ts">
import { Vue, Component, Provide } from "vue-property-decorator";
// import WorkflowStore from "../store/modules/workflow";
import { workflowMapper } from "../store/modules/workflow";
import { ICreateWorkflowStepDto, AnswerDto, IAnswerResult } from "@stepflow/shared";
import Step from "../components/Step.vue";

const Mappers = Vue.extend({
  components: { Step },
  computed: {
    ...workflowMapper.mapGetters([
      "currentWorkflow",
      "executedWorkflow",
      "isLoading"
    ])
  },
  methods: {
    ...workflowMapper.mapActions({
      getWorkflowById: "getWorkflowById",
      // checkAnswer: "checkAnswer",
      executeWorkflow: "executeWorkflow",
      getExecutionWorkflow: "getExecutionWorkflow"
    })
  }
});

@Component
export default class Workflow extends Mappers {
  @Provide() result: IAnswerResult = {};

  // async sendAnswer(answer: any): Promise<void> {
  //   if (answer) {
  //     const response = await this.checkAnswer(answer);
  //     this.result = {
  //       result: response.data,
  //       stepId: answer.stepId
  //     };
  //   }
  // }

  async mounted() {
    // await this.getWorkflowById(this.$route.params.id);
    await this.executeWorkflow(this.$route.params.id); // определиться с условиями для вызова этого метода
    await this.getExecutionWorkflow(this.$route.params.id);
  }
}
</script>

<style scoped>
  .button{
      background-color: #4CAF50;
    border: none;
    color: white;
    padding: 16px 32px;
    text-decoration: none;
    margin: 4px 2px;
    cursor: pointer;
  }
</style>