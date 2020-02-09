<template>
  <div class="container">
    <div v-if="isLoading" class="text-center mt-10">
      <v-progress-circular indeterminate :size="60" color="primary"></v-progress-circular>
    </div>
    <div v-else>
      <v-flex class="text-center">
        <h1 class="subheading mb-5">{{currentWorkflow.name}}</h1>
        <p>{{currentWorkflow.description}}</p>
      </v-flex>
      <Step
        :step="step"
        :index="index"
        v-for="(step, index) in currentWorkflow.steps"
        :key="step.id"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import WorkflowStore from "../store/modules/workflow";
import Step from "../components/Step.vue";

const Mappers = Vue.extend({
  components: { Step },
  computed: {
    ...WorkflowStore.mapGetters(["currentWorkflow", "isLoading"])
  },
  methods: {
    ...WorkflowStore.mapActions({
      getWorkflowById: "getWorkflowById"
    })
  }
});
@Component
export default class Workflow extends Mappers {
  mounted() {
    this.getWorkflowById(this.$route.params.id);
  }
}
</script>
<style lang="scss" scoped>
</style>