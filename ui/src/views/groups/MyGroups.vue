<template>
  <div v-if="groupsLoading" class="text-center mt-10">
    <v-progress-circular indeterminate :size="60" color="primary"></v-progress-circular>
    <h4 class="mt-3 font-weight-black" :size="20">Groups loading</h4>
  </div>
  <div v-else>
    <h4 class="pa-4" v-if="!loggedIn && userGroups.length===0">You have no groups</h4>
    <v-card v-else v-for="group in userGroups" :key="group.id" outlined class="pa-4 mb-6">
      <v-flex>
        <v-flex row class="ma-0">
          <h3>{{group.groupName}}</h3>
          <v-spacer></v-spacer>
          <v-icon
            color="red"
            size="30"
            @click="removeGroup(group.id)"
            title="Delete group"
          >mdi-delete-outline</v-icon>
        </v-flex>
        <v-simple-table>
          <thead>
            <tr>
              <th class="text-left">Group wokrflows</th>
              <th class="text-left">Create date</th>
            </tr>
          </thead>
          <tbody v-if="group.workflows.length">
            <tr v-for="wf in group.workflows" :key="wf.id" @click="toWorkflow(wf.id)">
              <td>{{ wf.name }}</td>
              <td>{{wf.created}}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <h4 class="ma-4">There are no workflows in this group</h4>
          </tbody>
        </v-simple-table>
      </v-flex>
    </v-card>
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
import { ICreateWorkflowDto, IUserGroupDto } from "@stepflow/shared";

@Component
export default class MyGroups extends Vue {
  @Prop() getAllWorkflows!: () => ICreateWorkflowDto[];
  @Prop() loggedIn!: boolean;
  @Prop() userGroups!: IUserGroupDto[];
  @Prop() removeGroup!: (id: string) => void;
  @Prop() toWorkflow!: (id: string) => string;
  @Prop() groupsLoading!: boolean;
}
</script>
