<template>
<v-container class="d-flex flex-row">
  <v-slide-group outlined class="pa-5" show-arrows>
    <div class="d-flex flex-row">
      <v-slide-item
        class="py-4 px-10 ma-3 pointer"
        v-for="(step, stepIndex) in steps"
        :key="stepIndex"
      >
        <v-card
          @click="openStep(stepIndex,  step)"
          :class="currentStepIndex===stepIndex?'current_step':''+'py-4 px-10 ma-3 pointer'"
        >
          <h4>{{step.name}}</h4>
        </v-card>
      </v-slide-item>
    </div>
  </v-slide-group>
  <v-icon
        x-large
        class="pointer add-icon"
        @click="addStep(steps[0] !== undefined?steps[0].depth:1)"
      >mdi-plus
  </v-icon>
</v-container>
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
import BreadCrumbs from "./BreadCrumbs.vue";

const Mappers = Vue.extend({
  components: {
    BreadCrumbs
  }
});
@Component
export default class StepsSlider extends Mappers {
  @Prop() steps!: any[];
  @Prop() currentStepIndex!: number;

  @Emit("add-step")
  addStep(): void {
    return;
  }
  @Emit("open-step")
  openStep(): void {
    return;
  }
}
</script>
<style scoped>
.pointer {
  cursor: pointer;

}
.add-icon{
  align-items: center;
  justify-content: center;
}
.current_step {
  background-color: #1976d2;
  color: white;
}
</style>