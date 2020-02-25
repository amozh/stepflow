<template>
  <div class="container">
    <h1 class="subheading text-center">Groups</h1>
    <Snackbar :snackbar="snackbar" :snackbarText="snackbarText" />
    <!-- Если пользователь является админом, он будет видеть больше вкладок, чем обычный студент -->
    <v-tabs background-color="#f5f5f5" v-model="tab" slider-size="3">
      <v-tab>My groups</v-tab>
      <v-tab v-if="true">Create group</v-tab>
      <v-tab v-if="true">Assign workflow</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" background-color="#f5f5f5" class="pa-6">
      <v-tab-item>
        <MyGroups
          :loggedIn="loggedIn"
          :groups="groups"
          :removeGroup="removeGroup"
          :toWorkflow="toWorkflow"
        />
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
import MyGroups from "../components/MyGroups.vue";

const Mappers = Vue.extend({
  components: {
    Wokrflow,
    CreateGroup,
    AssignWorkflow,
    Snackbar,
    MyGroups
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
  userGroupsDiff(val: any, oldVal: any) {
    this.groups = this.userGroups;
  }

  @Emit()
  toWorkflow(id) {
    this.$router.push(`/workflow/${id}`);
  }

  @Emit()
  async removeGroup(id) {
    const name = this.groups.find(g => g.id === id).groupName;
    this.snackbar = true;
    this.snackbarText = `Group ${name} has been deleted`;

    this.groups = this.groups.filter(group => group.id !== id); //Удаление группы в ui
    await this.deleteGroup(id); //Удаление группы на сервере
  }

  async mounted() {
    this.groups = this.userGroups;
  }
}
</script>
