<template>
  <div class="text-center">
    <v-card v-if="stepViewElements.length" class="ma-0 px-10 py-2">
      <div v-for="el in stepViewElements" :key="el.component.id">
        <div v-if="el.component.componentType == 'test'">
          <p>{{el.component.data.question}}</p>
          <div v-for="option in el.component.data.options" :key="option.id">
            <v-checkbox :label="option.value"></v-checkbox>
          </div>
        </div>
        <v-btn
          v-if="el.component.componentType === 'button'"
          color="primary"
          class="button"
        >{{el.component.label}}</v-btn>
        <VJsoneditor v-if="el.component.componentType === 'json'" class="mt-5"></VJsoneditor>
      </div>
    </v-card>
    <v-card v-else>
      <h3 class="py-3">Here it will be located your vue-components</h3>
    </v-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Provide, Ref, Emit } from "vue-property-decorator";
import { createWorkflowMapper } from "../store/modules/createWorkflow";
import { IStepViewElement, IStepViewJson } from "@stepflow/shared";
import VJsoneditor from "v-jsoneditor";

const Mappers = Vue.extend({
  components: { VJsoneditor },
  computed: {
    ...createWorkflowMapper.mapGetters(["stepViewElements", "stepViewJson"])
  }
});

@Component
export default class Sandbox extends Mappers {}
</script>