<template>
  <div class="container">
    <div v-if="!executedWorkflow.wfStepsExecution" class="text-center mt-10">
      <v-progress-circular indeterminate :size="60" color="primary"></v-progress-circular>
    </div>

    <div
      v-else
      v-for="(el,index) in executedWorkflow.wfStepsExecution[renderIndex].stepViewJson.stepViewElement"
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
      {{executedWorkflow.wfStepsExecution[0].stepViewJson.stepViewElement}}
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
import { Vue, Component, Provide, Prop } from "vue-property-decorator";
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
      "currentWorkflow",
      "executedWorkflow",
      "isLoading"
    ])
  },
  methods: {
    ...workflowMapper.mapActions({
      getWorkflowById: "getWorkflowById",
      executeWorkflow: "executeWorkflow",
      getExecutionWorkflow: "getExecutionWorkflow"
    })
  }
});

@Component
export default class Workflow extends Mappers {
  @Prop() workflowType!: any;
  @Provide() result: IAnswerResult = {};
  @Provide() radioAnswers: any = [];
  @Provide() stepJson: any = {};
  @Provide() renderIndex: any = 0;

  async submit() {
    let res;
    const submitButton = this.executedWorkflow.wfStepsExecution[
      this.renderIndex
    ].stepViewJson.stepViewElement.find(
      e => e.onClick && e.onClick === "submit"
    );
    if (submitButton) {
      res = await axios.put(
        "http://localhost:4000/wf-executions/step/submit/1",
        {
          submitInfo: this.radioAnswers
        }
      );
      if (res.data.finalStatus === "COMPLETE") {
        this.renderIndex = this.renderIndex + 1;
        this.stepJson = {
          ...res.data.finalState
        };
      }
    }
  }

  async mounted() {
    const { id, type } = this.$route.query;
    if (type === "default") {
      const wfId = await this.executeWorkflow(id.toString());
      await this.getExecutionWorkflow(wfId);
    } else {
      await this.getExecutionWorkflow(id.toString());
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
