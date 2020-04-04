<template>
  <div>
    <!-- Horizontal Slider -->
    <div v-if="orientation ==='horizontal'">
      <v-container :class="orientation==='horizontal'? 'd-flex flex-row':'d-flex flex-column'" >
        <v-slide-group outlined class="pa-5" show-arrows>
          <div :class="orientation==='horizontal'? 'd-flex flex-row':'d-flex flex-column'">
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
    </div>

    <!-- Vertical Slider -->
    <div v-if="orientation ==='vertical'" class="d-flex flex-column">
      <v-card
        class="py-4 ma-3 pointer"
        v-for="(step, stepIndex) in steps"
        :key="stepIndex"
        @click="openStep(stepIndex, step)"
        :class="currentStepIndex===stepIndex?'current_step':''+'py-4 ma-3 pointer'"
      >
        <h4>{{step.name}}</h4>
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