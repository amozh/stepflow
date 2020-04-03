<template>
  <div>
    <div :class="orientation==='horizontal'? 'd-flex flex-row':'d-flex flex-column'">
      <v-card
        class="py-4 ma-3 pointer"
        v-for="(step, stepIndex) in steps"
        :key="stepIndex"
        @click="openStep(stepIndex, step)"
        :class="currentStepIndex===stepIndex?'current_step':''+'py-4 ma-3 pointer'"
      >
        <h4>{{step.name}}</h4>
      </v-card>
      <!-- <h1>{{maxDepth}}</h1> -->
      <v-icon x-large class="pointer" @click="addStep(maxDepth)">mdi-plus</v-icon>
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

@Component
export default class StepsSlider extends Vue {
  @Prop() steps!: any[];
  @Prop() currentStepIndex!: number;
  @Prop() orientation!: string;
  @Prop() breadcrumbs!: any[];

  @Provide() maxDepth: number = 1;

  @Emit("add-step")
  addStep(): void {
    return;
  }
  @Emit("open-step")
  openStep(): void {
    return;
  }
  beforeUpdate() {
    console.log(this.steps, "steps");
    if (this.breadcrumbs) {
      this.maxDepth = this.breadcrumbs[this.breadcrumbs.length - 1].depth + 1;
    } else {
      this.maxDepth = 1;
    }
  }
}
</script>
<style scoped>
.pointer {
  cursor: pointer;
}
.current_step {
  background-color: #1976d2;
  color: white;
}
</style>