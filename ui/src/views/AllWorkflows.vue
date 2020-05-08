<template>
  <div class="container">
    <div v-if="isLoading" class="text-center mt-10">
      <v-progress-circular indeterminate :size="60" color="primary"></v-progress-circular>
    </div>
    <div v-else>
      <WorkflowCards data-cy="wf-card" workflowType="default" :workflows="allWorkflows" title="Workflows" />
      <WorkflowCards
        workflowType="execution"
        :workflows="allExecutionWorkflows"
        title="Execution Workflows"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { workflowMapper } from "../store/modules/workflow";
import UserStore from "../store/modules/user";
import WorkflowCards from "../components/WorkflowCards.vue";

const Mappers = Vue.extend({
  components: {
    WorkflowCards
  },
  computed: {
    ...workflowMapper.mapGetters([
      "allWorkflows",
      "allExecutionWorkflows",
      "isLoading"
    ])
  },
  methods: {
    ...workflowMapper.mapActions({
      getAllWorkflows: "getAllWorkflows",
      getAllExecutionWorkflows: "getAllExecutionWorkflows"
    })
  }
});

@Component
export default class AllWorkFlows extends Mappers {
  async mounted() {
    await this.getAllWorkflows();
    await this.getAllExecutionWorkflows();
  }
}
</script>
