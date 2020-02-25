<template>
  <div class="container">
    <h1 class="subheading text-center">Create user page</h1>
    <Snackbar :snackbar="snackbar" :snackbarText="snackbarText" />
    <v-form class="text-center" width="500" ref="form">
      <v-text-field
        class
        label="Username"
        v-model="username"
        prepend-icon="mdi-account-circle-outline"
        :rules="inputRules"
      ></v-text-field>
      <v-text-field
        class
        label="Password"
        v-model="password"
        prepend-icon="mdi-account-key-outline"
        :rules="inputRules"
      ></v-text-field>
      <v-btn text class="primary mt-6" width="200" @click="submit">Create user</v-btn>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Ref, Emit } from "vue-property-decorator";
import UserStore from "../store/modules/user";
import Snackbar from "../components/Snackbar.vue";

const Mappers = Vue.extend({
  components: {
    Snackbar
  },
  methods: {
    ...UserStore.mapActions({
      createUser: "createUser"
    })
  }
});
@Component
export default class CreateUser extends Mappers {
  @Provide() username: string = "";
  @Provide() password: string = "";
  @Provide() snackbar: boolean = false;
  @Provide() snackbarText: string = "";
  @Provide() inputRules = [
    (v: string) => (v && v.length >= 0) || "Field is required"
  ];
  @Ref("form") readonly form!: HTMLInputElement;
  @Emit()
  async submit() {
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      const user = {
        username: this.username,
        password: this.password
      };
      const res = await this.createUser(user);
      this.snackbar = true;
      if (res.status === 201) {
        this.snackbarText = `User ${this.username} created`;
        this.username = "";
        this.password = "";
      } else {
        this.snackbarText = "Such user already exists";
      }
    }
  }
}
</script>