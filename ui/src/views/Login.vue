<template>
  <div class="container">
    <h1 class="subheading text-center">Login page</h1>
    <v-snackbar class="mb-5" v-model="snackbar" :timeout="2000">
      Login or password is incorrect
      <v-btn color="white" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
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
      <v-btn text class="primary mt-6" width="200" @click="submit">Login</v-btn>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Ref, Emit } from "vue-property-decorator";
import UserStore from "../store/modules/user";

const Mappers = Vue.extend({
  computed: {
    ...UserStore.mapGetters([ "userInfo", "loggedIn"])
  },
  methods: {
    ...UserStore.mapActions({
      login: "login"
    })
  }
});

@Component
export default class LoginLogout extends Mappers {
  @Provide() username: string = "";
  @Provide() password: string = "";
  @Provide() snackbar: boolean = false;
  @Provide() inputRules = [
    (v: string) => (v && v.length >= 0) || "Field is required"
  ];

  @Ref("form") readonly form!: any;

  @Emit()
  async submit() {
    if(!this.loggedIn){
      this.snackbar = true
    }
    if (this.$refs.form.validate()) {
      const user = {
        username: this.username,
        password: this.password
      };
      await this.login(user);
      this.loggedIn && this.$router.push("/");
    }
  }
}
</script>
