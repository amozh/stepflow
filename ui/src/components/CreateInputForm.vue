
<template>
  <v-form
    ref="form"
    lazy-validation
  >
    <v-select
      :items="inputTypes"
      :rules="[v => !!v || 'Item is required']"
      label="Input type:"
      v-model="inputType"
      required
    ></v-select>

    <v-text-field
      :counter="25"
      label="Name"
      v-model="inputName"
      required
    ></v-text-field>

    <v-text-field
      :counter="25"
      label="Value"
      v-model="inputValue"
      required
    ></v-text-field>

    <v-btn
      color="success"
      class="mr-4"
      @click="addNewInput"
    >
      Add input
    </v-btn>

    <v-btn
      color="error"
    >
      Delete
    </v-btn>

  </v-form>
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
import { createWorkflowMapper } from "../store/modules/createWorkflow";

const Mappers = Vue.extend({
  methods: {
    ...createWorkflowMapper.mapMutations({
      addInput: "addInput"
    })
  }
});


@Component
export default class CreateInputForm extends Mappers {
@Provide() tab: any = null;
@Provide() inputTypes: any = [
  'text',
  'submit',
  'date',
  'number',
  'url'
];
@Provide() inputType: any = '';
@Provide() inputName: any = '';
@Provide() inputValue: any = '';

addNewInput() {
  const newInput = {
    component:{
      id: Number(Math.random),
      componentType: "input-set",
      data: [
        { type: this.inputType, label: this.inputValue, value: this.inputValue },
      ]
    }
  }
  return this.addInput(newInput);
}
}
</script>

<style scoped>

</style>