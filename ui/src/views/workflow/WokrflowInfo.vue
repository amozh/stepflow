<template>
  <div class="container">
    <v-form class="text-center" width="500" ref="form">
      <v-text-field
        class
        label="Wokrkflow name"
        v-model="wfName"
        prepend-icon="format_color_text"
        :rules="inputRules"
      ></v-text-field>
      <v-text-field
        class
        label="Wokrkflow description"
        v-model="wfDescription"
        prepend-icon="description"
        :rules="inputRules"
      ></v-text-field>
      <VJsoneditor :rules="inputRules" class="mt-5" height="500px" v-model="wfJson"></VJsoneditor>
      <v-container class="d-flex flex-row btns">
        <v-btn
          text
          class="success mr-10 btn"
          @click="changeWorkflowInfo({name:wfName, description:wfDescription, input:wfJson})"
        >
          Save Workflow
          <v-icon class="ml-2">save</v-icon>
        </v-btn>
        <v-btn class="success btn" @click="createNewWorkflow">
          Create Workflow
          <v-icon class="ml-2">create_new_folder</v-icon>
        </v-btn>
      </v-container>
    </v-form>
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
export default class WorkflowInfo extends Mappers {
  @Prop() workflowInfo!: any;

  @Provide() inputRules = [ValidationUtils.nonEmptyString];
  @Provide() wfJson: any = { hello: "any" };
  @Provide() wfName: string = "";
  @Provide() wfDescription: string = "";

  @Watch("workflowInfo")
  changeInfo(oldInfo: any, info: any) {
    this.wfName = this.workflowInfo.name;
    this.wfDescription = this.workflowInfo.description;
    this.wfJson = this.workflowInfo.input;
  }

  @Emit("change-workflow-info")
  changeWorkflowInfo(): void {
    return;
  }

  @Emit("create-new-workflow")
  createNewWorkflow(): void {
    return;
  }

  mounted() {
    this.wfName = this.workflowInfo.name;
    this.wfDescription = this.workflowInfo.description;
    this.wfJson = this.workflowInfo.input;
  }
}
</script>

<style scoped>
.btns {
  justify-content: space-around;
}
.btn {
  width: 250px;
}
</style>