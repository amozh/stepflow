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
      <VJsoneditor :rules="inputRules" class="mt-5" v-model="wfJson"></VJsoneditor>
      <v-container class="d-flex flex-row btns">
        <v-btn text class="error" width="200" @click="submit">
          Delete
          <v-icon class="ml-2">delete_forever</v-icon>
        </v-btn>
        <v-btn text class="success" width="200" @click="submit">
          Save
          <v-icon class="ml-2">save</v-icon>
        </v-btn>
      </v-container>

      <!-- <h2>{{workflow.name}}</h2>
      <h4>{{workflow.description}}</h4>-->
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

  @Prop() workflow!: any[];

  submit() {
    console.log("submit");
  }

  mounted() {
    // this.workflow
  }
}
</script>

<style scoped>
.btns {
  justify-content: space-around;
}
</style>
