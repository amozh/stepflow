<template>
  <div class="container">
    <h1 class="subheading text-center">All workflows</h1>
    <div v-if="isLoading" class="text-center mt-10">
      <v-progress-circular indeterminate :size="60" color="primary"></v-progress-circular>
    </div>
    <v-card
      v-else
      v-for="(workflow, index) in allWorkflows"
      :key="workflow.id"
      router
      :to="'/workflow/'+workflow.id"
    >
      <v-flex class="pa-4 my-4">
        <h3 class="grey--text">{{index+1}} {{workflow.name}}</h3>
        <p>{{workflow.description}}</p>
      </v-flex>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { workflowMapper } from "../store/modules/workflow";
import UserStore from "../store/modules/user";

const Mappers = Vue.extend({
  computed: {
    ...workflowMapper.mapGetters(["allWorkflows", "isLoading"])
    // ...UserStore.mapGetters(["userInfo"])
  },
  methods: {
    ...workflowMapper.mapActions({
      getAllWorkflows: "getAllWorkflows"
    })
  }
});

@Component
export default class AllWorkFlows extends Mappers {
  mounted() {
    this.getAllWorkflows();
  }
}
</script>
