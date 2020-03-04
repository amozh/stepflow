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
          :userGroups="userGroups"
          :removeGroup="removeGroup"
          :toWorkflow="toWorkflow"
          :groupsLoading="groupsLoading"
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
import Wokrflow from "../../components/Workflow.vue";
import AssignWorkflow from "./AssignWorkflow.vue";
import CreateGroup from "./CreateGroup.vue";
import { groupMapper } from "../../store/modules/group";
import { userMapper } from "../../store/modules/user";
import { workflowMapper } from "../../store/modules/workflow";
import Snackbar from "../../components/Snackbar.vue";
import MyGroups from "./MyGroups.vue";
import { IUserGroupDto } from "@stepflow/shared";

const Mappers = Vue.extend({
  components: {
    Wokrflow,
    CreateGroup,
    AssignWorkflow,
    Snackbar,
    MyGroups
  },
  computed: {
    ...userMapper.mapGetters(["loggedIn", "allUsers", "userLoading", "userId"]),
    ...workflowMapper.mapGetters(["allWorkflows", "isLoading"]),
    ...groupMapper.mapGetters(["userGroups", "groupsLoading"])
  },
  methods: {
    ...groupMapper.mapActions({
      deleteGroup: "deleteGroup",
      createGroup: "createGroup",
      updateGroup: "updateGroup",
      getMyGroups: "getMyGroups"
    }),
    ...userMapper.mapActions({
      getAllUsers: "getAllUsers"
    }),
    ...workflowMapper.mapActions({ getAllWorkflows: "getAllWorkflows" })
  }
});

@Component
export default class Groups extends Mappers {
  @Provide() tab: any = null;
  @Provide() snackbar: boolean = false;
  @Provide() snackbarText: string = "";
  @Emit()
  toWorkflow(id: string) {
    this.$router.push(`/workflow/${id}`);
  }
  async removeGroup(id: string) {
    const group = this.userGroups.find(g => g.id === id);
    if (!group) {
      throw new Error(`Group has not been found by id ${id}`);
    }
    await this.deleteGroup(id);
    const name = group.groupName;
    this.snackbar = true;
    this.snackbarText = `Group ${name} has been deleted`;
  }

  mounted() {
    this.getMyGroups(this.userId);
  }
}
</script>
