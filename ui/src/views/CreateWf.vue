<template>
  <div class="container">
    <Snackbar :snackbar="snackbar" :snackbarText="snackbarText" />
    <h1 class="subheading text-center">Create a new workflow</h1>
    <v-form class="text-center" ref="form">
      <v-text-field
        class
        label="Title"
        v-model="title"
        prepend-icon="mdi-subtitles-outline"
        :rules="inputRules"
      ></v-text-field>
      <v-text-field
        class
        label="Description"
        v-model="description"
        prepend-icon="mdi-format-text"
        :rules="inputRules"
      ></v-text-field>
      <CreateStep
        :key="step.id"
        :step="step"
        :inputRules="inputRules"
        :saveStep="saveStep"
        v-for="(step, index) in steps"
        :index="index"
        :deleteStep="deleteStep"
        :saveAllSteps="saveAllSteps"
      />
      <v-btn @click="addStep" class="mr-10" width="200" color="primary">Add new step</v-btn>
      <v-btn
        text
        class="success mx-0"
        width="200"
        @click="submit"
        :disabled="!steps.length"
      >Create workflow</v-btn>
    </v-form>
    <!-- <v-progress-circular indeterminate :size="60" color="primary"></v-progress-circular> -->
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
import WorkflowStore from "../store/modules/workflow";
import CreateStep from "../components/CreateStep.vue";
import Snackbar from "../components/Snackbar.vue";

const Mappers = Vue.extend({
  components: {
    CreateStep,
    Snackbar
  },
  methods: {
    ...WorkflowStore.mapActions({
      createWorkflow: "createWorkflow"
    })
  }
});
@Component
export default class CreateWorkflow extends Mappers {
  @Provide() title: string = "";
  @Provide() description: string = "";
  @Provide() snackbar: boolean = false;
  @Provide() snackbarText: string = "";
  @Provide() saveAllSteps: boolean = false;
  @Provide() inputRules = [
    (v: string) => (v && v.length >= 0) || "Field is required"
  ];
  @Provide() steps: any = [];

  @Ref("form") readonly form!: any;

  @Emit()
  addStep() {
    this.steps.push({
      id: Math.random(),
      name: "",
      description: "",
      answer: {
        answer: ""
      }
    });
  }
  @Emit()
  saveStep(newStep: any, index: number): void {
    this.steps.splice(index, 1, newStep);
  }

  @Emit()
  async submit(): Promise<void> {
    // Проверит все ли дочерние элементы формы (степы) проходят валидацию
    const validateSteps: boolean[] = this.$refs.form.$children.map(
      (child, index) => {
        if (![0, 1, 2, 3].some(e => e === index)) {
          return child.form.validate();
        } else {
          return true;
        }
      }
    );
    if (
      this.$refs.form.validate() &&
      validateSteps.every(e => e === true) &&
      this.steps.length
    ) {
      // Переведёт isSave в true в каждом step, что добавит их в массив steps
      this.saveAllSteps = true;
      const workflow = {
        name: this.title,
        description: this.description,
        steps: this.steps
      };
      await this.createWorkflow(workflow);
      this.snackbar = true;
      this.snackbarText = `Workflow "${this.title}" has been created`;
      this.$router.push("/");
    }
  }
  @Emit()
  deleteStep(id: any): void {
    this.steps = this.steps.filter((step: any) => step.id !== id);
  }

  mounted() {
    //При монтировании добавляется первый пустой степ
    this.steps.push({
      id: Math.random(),
      name: "",
      description: "",
      answer: {
        answer: ""
      }
    });
  }
}
</script>
