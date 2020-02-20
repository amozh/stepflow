<template>
  <div class="container">
    <h1 class="subheading text-center">Groups</h1>
    <v-tabs background-color="#f5f5f5" v-model="tab" slider-size="3">
      <v-tab>My groups</v-tab>
      <!-- Если пользователь является админом, он видит больше вкладок, чем обычный студент (студент не увидит вкладку создания) -->
      <v-tab v-if="true">Create group</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" background-color="#f5f5f5" class="pa-6">
      <v-tab-item>
        <h4 class="pa-4" v-if="loggedIn && userGroups.length===0">You have no groups</h4>
        <v-card v-else v-for="group in userGroups" :key="group.id" outlined class="pa-4">
          <v-flex>
            <v-flex row class="ma-0">
              <h3>{{group.groupName}}</h3>
              <v-spacer></v-spacer>
              <v-icon color="red" size="30" @click="deleteGroup(group.id)">mdi-delete-outline</v-icon>
            </v-flex>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">Group wokrflows</th>
                  <th class="text-left">Create date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="wf in group.workflows" :key="wf.id" @click="toWorkflow(wf.id)">
                  <td>{{ wf.name }}</td>
                  <td>{{wf.created}}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-flex>
        </v-card>
        <Wokrflow />
      </v-tab-item>
      <v-tab-item>2</v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Ref, Emit } from "vue-property-decorator";
import Wokrflow from "../components/Workflow.vue";
import UserStore from "../store/modules/user";
import GroupStore from "../store/modules/group";

const Mappers = Vue.extend({
  components: {
    Wokrflow
  },
  computed: {
    ...UserStore.mapGetters(["userGroups", "loggedIn"])
  },
  methods: {
    ...GroupStore.mapActions({
      deleteGroup: "deleteGroup"
    })
  }
});

@Component
export default class Groups extends Mappers {
  @Provide() tab: any = null;

  @Emit()
  toWorkflow(id) {
    this.$router.push(`/workflow/${id}`);
  }
}
</script>
