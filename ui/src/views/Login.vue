<template>
  <div class="container">
    <h1 class="subheading text-center">Login page</h1>
    <v-snackbar class="mb-5" v-model="snackbar" :timeout="2000">
      Login or password is incorrect
      <v-btn color="white" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-form class="text-center" width="500" ref="form" :lazy-validation="true">
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
import { userMapper } from "../store/modules/user";
import { ValidationUtils } from "../utils/validation-utils";

const Mappers = Vue.extend({
  computed: {
    ...userMapper.mapGetters(["userInfo", "loggedIn"])
  },
  methods: {
    ...userMapper.mapActions({
      login: "login"
    })
  }
});

@Component
export default class LoginLogout extends Mappers {
  @Provide() username: string = "";
  @Provide() password: string = "";
  @Provide() snackbar: boolean = false;
  @Provide() inputRules = [ValidationUtils.nonEmptyString];

  @Ref("form") readonly form!: HTMLInputElement;

  @Emit()
  async submit() {
    if (!this.loggedIn) {
      this.snackbar = true;
    }
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      const user = {
        username: this.username,
        password: this.password
      };
      await this.login(user);
      this.$router.push("/");
    }
  }
}
</script>
