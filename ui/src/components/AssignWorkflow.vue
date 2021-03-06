<template>
  <div class="container">
    <Snackbar :snackbar="snackbar" :snackbarText="snackbarText" />
    <div v-if="workflowsLoading" class="text-center mt-10">
      <v-progress-circular indeterminate :size="60" color="primary"></v-progress-circular>
    </div>
    <v-form v-else class="text-center" width="500" ref="form">
      <!-- <v-col cols="12" sm="6"> -->
      <v-select
        v-model="selectedGroup"
        :items="groups"
        item-text="groupName"
        item-value="id"
        label="Groups"
      ></v-select>
      <v-select
        v-model="selectedWorkflow"
        :items="workflows"
        item-text="name"
        item-value="id"
        chips
        label="Workflows"
        multiple
      ></v-select>
      <v-btn
        text
        class="primary"
        width="200"
        @click="submit"
      >Assign workflow{{selectedWorkflow.length>1?"s":""}}</v-btn>
    </v-form>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Provide,
  Ref,
  Emit,
  Prop
} from "vue-property-decorator";
import Snackbar from "./Snackbar.vue";
import { CreateWorkflowDto,UserGroupDto } from '@stepflow/shared';

const Mappers = Vue.extend({
  components: {
    Snackbar
  }
});

@Component
export default class AssignWorkflow extends Mappers {
  @Provide() groups: UserGroupDto[] = [];
  @Provide() workflows: CreateWorkflowDto[] = [];
  @Provide() selectedGroup: UserGroupDto[] = [];
  @Provide() selectedWorkflow: CreateWorkflowDto[] = [];
  @Provide() snackbarText: string = "";
  @Provide() snackbar: boolean = false;

  @Prop() getAllWorkflows!: any; //fix
  @Prop() allWorkflows!: CreateWorkflowDto[];
  @Prop() workflowsLoading!: boolean;
  @Prop() userGroups!: UserGroupDto[];
  @Prop() updateGroup!: any; //fix

  @Ref("form") readonly form!: HTMLInputElement;

  @Emit()
  async submit() {
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      // Фильтрация workflows по тем id, которые содержит массив selectedWorkflow
      const assignedWf = this.allWorkflows.filter(
        wf => wf.id === wf.id && this.selectedWorkflow.includes(wf.id)
      );
      const group = {
        workflows: assignedWf
      };
      await this.updateGroup({ group, id: this.selectedGroup });
      this.snackbarText = `${this.selectedWorkflow.length} workflow${
        this.selectedWorkflow.length > 1 ? "s" : ""
      } has been assigned to this group`;
      this.snackbar = true;
    }
  }
  async mounted() {
    await this.getAllWorkflows();
    this.groups = this.userGroups;
    this.workflows = this.allWorkflows;
  }
}
</script>
