<template>
  <div class="container">
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
      <!-- :deleteStep="deleteStep" -->
      <CreateStep
        :key="index"
        :step="step"
        :inputRules="inputRules"
        :saveStep="saveStep"
        v-for="(step, index) in steps"
        :index="index"
      />

      <v-btn @click="addStep" class="mr-10" width="200" color="primary">Add new step</v-btn>
      <v-btn text class="success mx-0" width="200" @click="submit">Create workflow</v-btn>
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

const Mappers = Vue.extend({
  components: {
    CreateStep
  },
  methods: {
    ...WorkflowStore.mapActions({
      createWorkflow: "createWorkflow"
    })
  }
});
@Component
export default class CreateWorkflow extends Mappers {
  //state
  @Provide() title: string = "";
  @Provide() description: string = "";
  @Provide() inputRules = [
    (v: string) => (v && v.length >= 0) || "Field is required"
  ];
  @Provide() steps: any = [
    {
      name: "",
      description: "",
      answer: ""
    }
  ];

  @Ref("form") readonly form!: any;

  //methods
  @Emit()
  addStep() {
    this.steps.push({
      name: "",
      description: "",
      answer: ""
    });
  }
  @Emit()
  saveStep(newStep: any, index: number) {
    this.steps.splice(index, 1, newStep);
  }

  @Emit()
  async submit() {
    if (this.$refs.form.validate()) {
      const workflow = {
        name: this.title,
        description: this.description,
        steps: this.steps
      };
      await this.createWorkflow(workflow);
      this.$router.push("/");
    }
  }
  // @Emit()
  // deleteStep(stepId: any) {
  //   console.log(stepId);
  //   this.steps = this.steps.filter(
  //     (step: any) => this.steps.indexOf(step) !== stepId
  //   );
  // }
}

</script>


<style lang="scss" scoped>
</style>
