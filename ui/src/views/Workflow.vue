<template>
  <div class="container">

    executedWorkflow: {{executedWorkflow}}
    <!-- executedWorkflow: {{executedWorkflow.wfStepsExecution[0].status}}
    renderIndex: {{renderIndex}}
    <div
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
        {{radioAnswers}}
      </div>

      <div v-if="el.component.componentType === 'button'">
        <input @click="wrapper" type="submit" :value="el.component.label" class="button" />
      </div>
      
      <div v-if="el.component.componentType === 'json'">
        <VJsoneditor class="mt-5" v-model="stepJson"></VJsoneditor>
      </div>
    </div>-->
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
  @Provide() stepJson: any = {"darova": "ku"};
  @Provide() renderIndex: any = 0;

  async submit() {
    if (
      this.executedWorkflow.wfStepsExecution[0].stepViewJson.stepViewElement[5]
        .onClick === "submit"
    ) {
      axios.put("http://localhost:4000/wf-executions/step/submit/1", {
        submitInfo: this.radioAnswers
      });
      console.log('after submit')
    }
     
  }
  changeView(){
    console.log('changeViewStarted')
    // if (this.executedWorkflow.wfStepsExecution[this.renderIndex].status == "COMPLETE") {
    //   console.log(this.renderIndex);
    //   this.renderIndex = this.renderIndex+1;
    //   console.log(this.renderIndex);
    // }
    this.renderIndex = this.renderIndex+1;
    console.log('changeViewFinised, renderIndex = ',this.renderIndex)
  }

  async wrapper(){
    console.log('before wrapper')
    this.submit().then(()=>this.changeView());
    console.log('after wrapper')
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
    const { id, type } = this.$route.query;
    console.log("id, type:", id, type);
    if (type === "default") {
      const wfId = await this.executeWorkflow(id.toString());
      console.log('wfExecution:',wfId);
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
