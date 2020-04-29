<template>
  <div>
    <div id="sandbox">
      <div v-for="el in stepViewElement" :key="el.component.id">

        <div v-if="el.component.componentType == 'test'">
          <p>{{el.component.data.question}}</p>
          <div v-for="option in el.component.data.options" :key="option.id">
            <v-checkbox
              :label="option.value"
            ></v-checkbox>
          </div>
        </div>

        <div v-if="el.component.componentType == 'input-set'">
          <div v-for="data in el.component.data" :key="data.id">
            <input :type="data.type" :value="data.value">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">

import { Vue, Component, Provide, Ref, Emit } from "vue-property-decorator";
import { createWorkflowMapper } from "../store/modules/createWorkflow";
import { IStepViewElement, IStepViewJson } from '@stepflow/shared';

const Mappers = Vue.extend({
  computed: {
    ...createWorkflowMapper.mapGetters([
      "stepViewElement",
      "stepViewJson"
    ])
  }
});

@Component
export default class Sandbox extends Mappers {

}
</script>

<style scoped>
  #sandbox {
    height: 500px;
    margin: 10px 100px;
    justify-content: center;
    background-color: rgb(255, 255, 255);
    border: 3px solid #adb3f7;
    border-radius: 2% 6% 5% 4% / 1% 1% 2% 4%;
    background: #ffffff;
  }
</style>