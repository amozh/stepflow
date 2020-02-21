<template>
  <div class="container">
    <h1 class="subheading text-center">Create group component</h1>
    <div v-if="isLoading" class="text-center mt-10">
      <v-progress-circular indeterminate :size="60" color="primary"></v-progress-circular>
    </div>
    <v-form v-else class="text-center" width="500" ref="form">
      <v-text-field
        class
        label="Group name"
        v-model="groupName"
        prepend-icon=" mdi-account-group-outline"
        :rules="inputRules"
      ></v-text-field>
      <!-- <v-select
        v-model="users"
        :items="states"
        label="Select users"
        multiple
        chips
        hint=""
        persistent-hint
      ></v-select>-->
      <v-card outlined class="pa-4">
        <v-simple-table>
          <thead>
            <tr>
              <th class="text-left">Username</th>
              <th class="text-left">Add to group</th>
            </tr>
          </thead>
          <tbody>
            <!-- Перенести в отдельный компонент. Считывать по клику id и checked каждого юзера, а потом вернуть в этот компонент -->
            <tr v-for="user in allUsers" :key="user.id" @click="getVal(checkbox1, user.id)">
              <td class="text-left ml-5">{{ user.username }}</td>
              <td>
                <v-checkbox v-model="checkbox1"></v-checkbox>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>
      <v-btn text class="primary mt-6" width="200" @click="submit">Create group</v-btn>
    </v-form>
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
// import UserStore from "../store/modules/user";

// const Mappers = Vue.extend({
//   computed: {
//     // ...UserStore.mapGetters(["userInfo", "loggedIn"])
//   },
//   methods: {
//     // ...UserStore.mapActions({
//     //   login: "login"
//     // })
//   }
// });

@Component
export default class CreateGroup extends Vue {
  @Provide() groupName: string = "";
  @Provide() checkbox1: any = false; // "Стейт" селекта

  @Provide() inputRules = [
    (v: string) => (v && v.length >= 0) || "Field is required"
  ];

  @Prop() createGroup: any;
  @Prop() allUsers: any;
  @Prop() getAllUsers: any;
  @Prop() isLoading: boolean;

  @Ref("form") readonly form!: any;

  @Emit()
  async submit() {
    if (this.$refs.form.validate()) {
      console.log(this.groupName);
    }
  }
  //
  @Emit()
  getVal(checked: boolean, id: string) {
    console.log(checked, id);
  }

  mounted() {
    this.getAllUsers();
    // this.states = this.allUsers.map(user => {
    //   return user.username;
    // });
    // console.log(this.states, this.users)
    // console.log(this.allUsers, "allUsers")
  }
}
</script>
