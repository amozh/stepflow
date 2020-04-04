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
        <v-btn text class="error" width="200">
          Delete
          <v-icon class="ml-2">delete_forever</v-icon>
        </v-btn>
        <v-btn
          text
          class="success"
          width="200"
          @click="saveWfInfo({name:wfName, description:wfDescription, input:wfJson})"
        >
          Save
          <v-icon class="ml-2">save</v-icon>
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
  Ref
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
  @Provide() inputRules = [ValidationUtils.nonEmptyString];
  @Provide() wfJson: any = { hello: "any" };
  @Provide() wfName: string = "";
  @Provide() wfDescription: string = "";

  @Prop() workflow!: any;
  @Prop() autoSave!: boolean;

  @Emit("save-wf-info")
  saveWfInfo({
    name,
    description,
    input
  }): { name: string; description: string; input: JSON } {
    return { name, description, input };
  }

  beforeUpdate() {
    this.wfJson = this.workflow;
    if (this.autoSave) {
      this.saveWfInfo({
        name: this.wfName,
        description: this.wfDescription,
        input: this.wfJson
      });
    }
  }

  mounted() {
    this.wfName = this.workflow.name;
    this.wfDescription = this.workflow.description;
    this.wfJson = this.workflow.input;
  }
}
</script>

<style scoped>
.btns {
  justify-content: space-around;
}
</style>