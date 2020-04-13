<template>
<div :class="orientation==='vertical'? 'd-flex flex-column':'d-flex flex-row'">
  <div :class="orientation==='vertical'? 'd-flex flex-column':'d-flex flex-row scroll-x-wrapper'">
    <v-card
      v-for="step in steps"
      :key="step.id"
      @click="openStep(step)"
      :class="step===currentStep?'current-step pt-0 py-4 ma-3 pointer':'pt-0 py-4 ma-3 pointer'"
      class="scroll-x"
      hover
    >
      <v-card-title height="100">{{step.name}}</v-card-title>
    </v-card>
  </div>
  <div class="plus-icon">
    <v-icon x-large class="pointer" @click="addNewStep(maxDepth)">mdi-plus</v-icon>
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
import { ICreateWorkflowStepDto } from '@stepflow/shared';

@Component
export default class Slider extends Vue {
  @Prop() orientation!: string;
  @Prop() steps!: ICreateWorkflowStepDto[];
  @Prop() maxDepth!: number;
  @Prop() currentStep!: string;

  @Emit("add-new-step")
  addNewStep(): void {
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
.current-step {
  background-color: #1976d2;
  color: white;
}
.scroll-x-wrapper {
  overflow-x:auto;
}
.scroll-x {
  min-height: 100px;
  min-width: 150px;
}
.plus-icon {
  display: flex;
  justify-content: center;
  align-self: center; 
}
.plus-icon button {
  height: 40px;
}
</style>