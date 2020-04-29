<template>
  <div class="container">
    executedWorkflow: {{executedWorkflow.wfStepsExecution[0].stepViewJson}}
    <div
      v-for="(el,index) in executedWorkflow.wfStepsExecution[0].stepViewJson.stepViewElement"
      :key="el.component.id"
    >
      <div v-if="el.component.componentType === 'test'">
        <p>{{el.component.data.question}}</p>
        <v-radio-group v-model="radioAnswers[index]">
          <v-radio
            v-for="(option) in el.component.data.options"
            :key="option.id"
            :label="option.value"
            :value="`${index+1}:${option.value}`"
          ></v-radio>
        </v-radio-group>
        {{radioAnswers}}
      </div>

      <div v-if="el.component.componentType === 'button'">
        <input @click="submit" type="submit" :value="el.component.label" class="button" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Provide } from "vue-property-decorator";
// import WorkflowStore from "../store/modules/workflow";
import { workflowMapper } from "../store/modules/workflow";
import {
  ICreateWorkflowStepDto,
  AnswerDto,
  IAnswerResult
} from "@stepflow/shared";
import axios from "axios";
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
  @Provide() radioAnswers: any = [];
  async submit() {
    if (
      this.executedWorkflow.wfStepsExecution[0].stepViewJson.stepViewElement[0]
        .onClick === "submit"
    ) {
      axios.put("http://localhost:4000/wf-executions/step/submit/1", {
        submitInfo: this.radioAnswers
      });
    }
  }

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
.button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 16px 32px;
  text-decoration: none;
  margin: 4px 2px;
  cursor: pointer;
}
</style>