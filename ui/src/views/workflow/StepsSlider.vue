<template>
  <div>
    <!-- <BreadCrumbs :breadcrumbs="breadcrumbs" @to-crumb="toCrumb" /> -->
    <div class="d-flex flex-row">
      <v-card
        class="py-4 px-10 ma-3 pointer"
        v-for="(step, stepIndex) in steps"
        :key="stepIndex"
        @click="openStep(stepIndex,  step)"
      >
        <p>{{step.name}}</p>
      </v-card>
      <v-icon
        x-large
        class="pointer"
        @click="addStep(steps[0] !== undefined?steps[0].depth:1)"
      >mdi-plus</v-icon>
    </div>
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
import BreadCrumbs from "./BreadCrumbs.vue";

const Mappers = Vue.extend({
  components: {
    BreadCrumbs
  }
});
@Component
export default class StepsSlider extends Mappers {
  @Prop() steps!: any[];

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
</style>