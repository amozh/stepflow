<template>
  <div class="mb-4">
    <h1 class="subheading text-center">{{title}}</h1>
    <div v-if="workflows.length">
      <v-card v-for="(workflow, index) in workflows" :key="workflow.id">
        <v-flex class="pa-5 mt-4 d-flex justify-space-between">
          <div class="mr-12">
            <h3 class="grey--text">{{index+1}} {{workflow.name}}</h3>
            <p>{{workflow.description}}</p>
          </div>
          <v-btn
            v-if="!workflow.status || workflow.status==='NOT_STARTED'"
            large
            color="success"
            outlined
            :to="'/workflow/'+workflow.id"
          >Start</v-btn>
          <v-btn
            large
            color="warning"
            outlined
            v-else-if="!workflow.status || workflow.status==='COMPLETE'"
          >Completed</v-btn>
          <v-btn v-else large color="primary" outlined :to="'/workflow/'+workflow.id">Open</v-btn>
        </v-flex>
        <h4 class="pa-5 primary--text">Progress: {{workflow.state}}</h4>
      </v-card>
    </div>
    <h3 v-else class="subheading text-center mt-4">No {{title}}</h3>
  </div>
</template>
<script lang="ts">
import {
  Vue,
  Component,
  Provide,
  Prop,
  Emit,
  Inject,
  Watch
} from "vue-property-decorator";

@Component
export default class WorkflowCards extends Vue {
  @Prop() workflows!: any;
  @Prop() title!: string;
}
</script>