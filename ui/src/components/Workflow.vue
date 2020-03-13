<template>
  <v-flex>
    <v-card
      v-for="(workflow, index) in workflows"
      :key="workflow.id"
      router
      :to="'/workflow/'+workflow.id"
    >
      <v-flex class="pa-4 my-4">
        <h3 class="grey--text">{{index+1}} {{workflow.name}}</h3>
        <p>{{workflow.description}}</p>
      </v-flex>
    </v-card>
  </v-flex>
</template>
    
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { IWorkflowEntityDto } from "@stepflow/shared";

@Component
export default class Groups extends Vue {
  @Prop() readonly workflows!: IWorkflowEntityDto[];
}
</script>
