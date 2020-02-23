<template>
  <div class="container">
    <h1 class="subheading text-center">Groups</h1>
    <Snackbar :snackbar="snackbar" :snackbarText="snackbarText" />
    <v-tabs background-color="#f5f5f5" v-model="tab" slider-size="3">
      <v-tab>My groups</v-tab>
      <!-- Если пользователь является админом, он будет видеть больше вкладок, чем обычный студент -->
      <v-tab v-if="true">Create group</v-tab>
      <v-tab v-if="true">Assign workflow</v-tab>
    </v-tabs>
    <!-- Вынести этот таб в отдельный компонент -->
    <v-tabs-items v-model="tab" background-color="#f5f5f5" class="pa-6">
      <v-tab-item>
        <h4 class="pa-4" v-if="loggedIn && groups.length===0">You have no groups</h4>
        <v-card v-else v-for="group in groups" :key="group.id" outlined class="pa-4 mb-6">
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
        <Wokrflow />
      </v-tab-item>
      <v-tab-item>
        <CreateGroup
          :createGroup="createGroup"
          :getAllUsers="getAllUsers"
          :allUsers="allUsers"
          :isLoading="userLoading"
        />
      </v-tab-item>
      <v-tab-item>
        <AssignWorkflow
          :getAllWorkflows="getAllWorkflows"
          :allWorkflows="allWorkflows"
          :workflowsLoading="isLoading"
          :userGroups="userGroups"
          :updateGroup="updateGroup"
        />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Provide,
  Ref,
  Emit,
  Watch
} from "vue-property-decorator";
import Wokrflow from "../components/Workflow.vue";
import AssignWorkflow from "../components/AssignWorkflow.vue";
import CreateGroup from "../components/CreateGroup.vue";
import UserStore from "../store/modules/user";
import GroupStore from "../store/modules/group";
import WorkflowStore from "../store/modules/workflow";
import Snackbar from "../components/Snackbar.vue";

const Mappers = Vue.extend({
  components: {
    Wokrflow,
    CreateGroup,
    AssignWorkflow,
    Snackbar
  },
  computed: {
    ...UserStore.mapGetters([
      "userGroups",
      "loggedIn",
      "allUsers",
      "userLoading"
    ]),
    ...WorkflowStore.mapGetters(["allWorkflows", "isLoading"])
  },
  methods: {
    ...GroupStore.mapActions({
      deleteGroup: "deleteGroup",
      createGroup: "createGroup",
      updateGroup: "updateGroup"
    }),
    ...UserStore.mapActions({
      getAllUsers: "getAllUsers"
    }),
    ...WorkflowStore.mapActions({ getAllWorkflows: "getAllWorkflows" })
  }
});

@Component
export default class Groups extends Mappers {
  @Provide() tab: any = null;
  @Provide() groups: any = [];
  @Provide() snackbar: boolean = false;
  @Provide() snackbarText: string = "";

  @Watch("userGroups")
  async userGroupsDiff(val: any, oldVal: any) {
    this.groups = this.userGroups;
  }

  @Emit()
  toWorkflow(id) {
    this.$router.push(`/workflow/${id}`);
  }

  @Emit()
  async removeGroup(id) {
    const name = this.groups.find(g => g.id === id).groupName
    this.snackbar = true;
    this.snackbarText = `Group ${name} has been deleted`;
 
    this.groups = this.groups.filter(group => group.id !== id);
    await this.deleteGroup(id);
  }

  async mounted() {
    this.groups = this.userGroups;
  }
}
</script>
