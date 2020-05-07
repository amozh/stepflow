<template>
  <div class="container">
    <div v-if="isLoading" class="text-center mt-10">
      <v-progress-circular indeterminate :size="60" color="primary"></v-progress-circular>
    </div>
    <div
      v-else
      v-for="(el,index) in currentStep.stepViewJson.stepViewElement"
      :key="el.component.id"
    >
      <div v-if="el.component.componentType === 'test'">
        <p>{{el.component.data.question}}</p>
        <v-radio-group v-model="radioAnswers[index]">
          <v-radio
            v-for="(option) in el.component.data.options"
            :key="option.id"
            :label="option.value"
            :value="option"
          ></v-radio>
        </v-radio-group>
      </div>

      <div v-if="el.component.componentType === 'button'">
        <input @click="submit" type="submit" :value="el.component.label" class="button" />
      </div>
      <div v-if="el.component.componentType === 'json'">
        <VJsoneditor class="mt-5" v-model="stepJson"></VJsoneditor>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Provide, Prop, Watch } from "vue-property-decorator";
import { workflowMapper } from "../store/modules/workflow";
import {
  ICreateWorkflowStepDto,
  AnswerDto,
  IAnswerResult
} from "@stepflow/shared";
import axios from "axios";
import Step from "../components/Step.vue";
import VJsoneditor from "v-jsoneditor";

const Mappers = Vue.extend({
  components: { Step, VJsoneditor },
  computed: {
    ...workflowMapper.mapGetters([
      "executedWorkflow",
      "currentWorkflow",
      "wfExecutionState",
      "currentStep",
      "isLoading"
    ])
  },
  methods: {
    ...workflowMapper.mapActions({
      getWorkflowById: "getWorkflowById",
      executeWorkflow: "executeWorkflow",
      getExecutionWorkflow: "getExecutionWorkflow",
      workflowOnLoadAction: "workflowOnLoadAction",
      // getCurrentStep: "getCurrentStep",
      workflowOnSubmitAction: "workflowOnSubmitAction"
    })
  }
});

@Component
export default class Workflow extends Mappers {
  @Provide() radioAnswers: any = [];
  @Provide() stepJson: any = {};
  // @Provide() currentStep: any = {};

  async submit() {
    const submitInfo = {
      id: this.wfExecutionState.renderStepId,
      submitInfo: this.radioAnswers
    };
    await this.workflowOnSubmitAction(submitInfo);
    // Минус 2 потому что нумерация степов начинается с 0, тогда как у renderStepId с 1
    // Ещё -1, чтобы обратиться к предыдущему степу
    const res = await this.workflowOnLoadAction(this.executedWorkflow.id);
    this.stepJson = res.data.wfExecutionState.stepsState[2 - 2];
  }

  async mounted() {
    const { id, type } = this.$route.query;
    if (type === "default") {
      const wfId = await this.executeWorkflow(id.toString());
      await this.getExecutionWorkflow(wfId);
    } else {
      await this.getExecutionWorkflow(id.toString());
    }
    const res = await this.workflowOnLoadAction(this.executedWorkflow.id);
    if (res.data.wfExecutionState.stepsState) {
      this.stepJson = res.data.wfExecutionState.stepsState[2 - 2];
    }
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
