<template>
  <v-card class="pa-5 mb-5" text>
    <h4>Step {{index+1}}</h4>
    <v-form class="text-right" ref="form">
      <v-text-field
        label="Name"
        v-model="name"
        prepend-icon="mdi-rename-box"
        :rules="inputRules"
        :disabled="isSave"
      ></v-text-field>
      <v-textarea
        auto-grow
        class="mt-3"
        label="Description"
        v-model="description"
        prepend-icon="mdi-card-text"
        :rules="inputRules"
        :disabled="isSave"
      ></v-textarea>
      <v-text-field
        label="Answer"
        v-model="answer"
        prepend-icon="mdi-file-question"
        :rules="inputRules"
        :disabled="isSave"
      ></v-text-field>
      <v-flex row class="ma-0">
        <v-btn class="my-4" color="error" @click="deleteStep(id)">
          Delete
          <v-icon right>mdi-cancel</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="isSave" class="my-4" color="primary" @click="isSave=false">
          Edit
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn v-else class="my-4" color="success" @click="addNewStep">Save step</v-btn>
      </v-flex>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Provide,
  Prop,
  Emit,
  Inject,
  Ref,
  Watch
} from "vue-property-decorator";

@Component
export default class WfStep extends Vue {
  @Prop() saveStep: any;
  @Prop() deleteStep: any;
  @Prop() inputRules!: [];
  @Prop() step: any;
  @Prop() index: any;
  @Prop() saveAllSteps: boolean;

  @Provide() name: string = "";
  @Provide() description: string = "";
  @Provide() answer: string = "";
  @Provide() id: any = "";
  @Provide() isSave: boolean = false;

  @Ref("form") readonly form!: any;

  @Emit()
  addNewStep(): any {
    if (this.$refs.form.validate()) {
      const newStep = {
        id: this.id,
        name: this.name,
        description: this.description,
        answer: {
          answer: this.answer
        }
      };
      this.saveStep(newStep, this.index);
      this.isSave = true;
    }
  }

  @Watch("saveAllSteps")
  autoSave(val: any, oldVal: any){
    this.addNewStep()
  }

  mounted() {
    const { id, name, description, answer } = this.step;
    if (this.step) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.answer = answer.answer;
    }
  }
}
</script>
<style lang="scss" scoped>
</style>