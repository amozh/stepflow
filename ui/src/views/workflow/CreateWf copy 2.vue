<template>
  <div class="container">
    <!-- ------------------------------------------------------------ -->
    <!-- <v-breadcrumbs :items="breadCrumbsWorkflow" ref="breadCrumb">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>-->
    <div v-for="(bread, index) in breadCrumbsWorkflow" :key="bread.wfStepIndex">
      <div class="d-flex ma-0" @click="breadFunc(index)">
        <p class="ma-0">{{bread.text}}</p>
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </div>

    <!-- ------------------------------------------------------------ -->
    <v-flex>
      <v-sheet outlined class="mt-5" elevation="2" max-width="100%">
        <v-slide-group outlined v-model="activeStep" class="pa-5" show-arrows>
          <v-slide-item
            v-for="(step, index) in workflow.steps"
            :key="`${index}`"
            v-slot:default="{ active, toggle }"
          >
            <v-card
              :color="active ? 'primary' : 'grey lighten-2'"
              class="ma-4"
              height="50"
              width="150"
              @click="openStep(toggle, active, index, step.name)"
            >
              <v-row outlined class="fill-height" align="center" justify="center">
                <v-scale-transition>
                  <h4>
                    {{step.name}}
                    <br />
                    Index: {{index}}!
                  </h4>
                </v-scale-transition>
              </v-row>
            </v-card>
          </v-slide-item>
          <v-icon x-large class="pointer-x" @click="addStep">mdi-plus</v-icon>
        </v-slide-group>
        <v-expand-transition>
          <v-sheet v-if="activeStep != null" color="grey lighten-4" height="auto" tile>
            <v-row class="fill-height" align="center" justify="center">
              <h3 class="title">Selected step: {{ activeStep }}</h3>
              <!-- <h1>Index:{{index}}</h1> -->
              <p></p>
            </v-row>
            <v-btn color="error" @click="deleteStep(activeStep)">Delete</v-btn>
          </v-sheet>
          <v-sheet v-else class="pa-10">
            <h3>{{workflow.name}}</h3>
            <p>{{workflow.description}}</p>
            <v-text-field class label="Title" v-model="wfName" prepend-icon="mdi-subtitles-outline"></v-text-field>
            <v-text-field
              class
              label="Title"
              v-model="wfDescription"
              prepend-icon="mdi-subtitles-outline"
            ></v-text-field>
            <VJsoneditor v-model="json"></VJsoneditor>
          </v-sheet>
        </v-expand-transition>
      </v-sheet>
    </v-flex>
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

const Mappers = Vue.extend({
  components: {
    VJsoneditor
  }
});
@Component
export default class CreateWorkflow extends Mappers {
  @Provide() workflow: any = {
    name: "Workflow_1",
    description: "Some description",
    steps: [{ name: "first_1" }, { name: "second_2" }, { name: "third_3" }]
  };
  @Provide() json: any = { hello: "any" };
  @Provide() activeStep: null = null;
  @Provide() breadCrumbsWorkflow = [];
  @Provide() wfName: string = "";
  @Provide() wfDescription: string = "";

  @Ref("breadCrumb") breadCrumb!: HTMLInputElement;

  addStep() {
    this.workflow.steps.push({ name: "random step" });
  }

  breadFunc(index: number): void {
    if (index === 0) {
      this.breadCrumbsWorkflow.splice(1);
      this.activeStep = null;
    }
  }

  deleteStep(index: number): void {
    const breadCrumbIndex: number = this.breadCrumbsWorkflow.findIndex(
      br => br.wfStepIndex === index
    );
    if (breadCrumbIndex !== -1) {
      this.breadCrumbsWorkflow.splice(breadCrumbIndex, 1);
    }
    this.workflow.steps.splice(index, 1);
  }

  openStep(toggle, active, index, stepName) {
    //  console.log(this.breadCrumbsWorkflow.length, "dlinna")
    // Переписать всю логику добавления/удаления
    // Попробовать при каждом выборе передовать сюда заново степ и все его подстепы
    // to:"javascript:console.log('wdjavascript:')"
    // href: "()=>console.log('wdjavascript:')"
    // href: "javascript:console.log('wdjavascript:')"

    this.breadCrumbsWorkflow = [
      {
        text: this.workflow.name,
        disabled: false,
        wfStepIndex: null
      }
    ];

    const breadCrumbIndex: number = this.breadCrumbsWorkflow.findIndex(
      br => br.wfStepIndex === index
    );

    if (!active) {
      this.breadCrumbsWorkflow.push({
        text: stepName,
        disabled: true,
        wfStepIndex: index
      });
    } else {
      if (breadCrumbIndex !== -1) {
        this.breadCrumbsWorkflow.splice(breadCrumbIndex, 1);
      }
    }
    toggle();
  }

  mounted() {
    this.breadCrumbsWorkflow.push({
      text: this.workflow.name,
      disabled: false,
      wfStepIndex: null
    });
  }
}
</script>
<style scoped>
.pointer-x {
  cursor: pointer;
}
</style>