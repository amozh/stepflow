<template>
  <div class="container">
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

@Component
export default class AssignWorkflow extends Vue {
  @Provide() groups: any = [];
  @Provide() workflows: any = [];
  @Provide() selectedGroup: any = [];
  @Provide() selectedWorkflow: any = [];

  @Prop() getAllWorkflows: any;
  @Prop() allWorkflows: any;
  @Prop() workflowsLoading: boolean;
  @Prop() userGroups: any;
  @Prop() updateGroup: any;

  @Ref("form") readonly form!: any;

  @Emit()
  async submit() {
    if (this.$refs.form.validate()) {
      // Фильтрация workflows по тем id, которые содержит массив selectedWorkflow
      const assignedWf = this.allWorkflows.filter(
        wf => wf.id === wf.id && this.selectedWorkflow.includes(wf.id)
      );
      const group = {
        workflows: assignedWf
      };
      await this.updateGroup({ group, id: this.selectedGroup });
    }
  }
  async mounted() {
    await this.getAllWorkflows();
    this.groups = this.userGroups;
    this.workflows = this.allWorkflows;
  }
}
</script>
