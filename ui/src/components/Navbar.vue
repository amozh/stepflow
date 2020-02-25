<template>
  <nav>
    <Snackbar :snackbar="snackbar" :snackbarText="snackbarText" />
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Want to logout?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">Disagree</v-btn>
          <v-btn color="green darken-1" text @click="logoutUser">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-app-bar app class="primary" outlined>
      <v-app-bar-nav-icon class="white--text" large @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn class="white--text ma-2" text route to="/create">
        <v-icon class="mr-2">mdi-file-document-box-plus-outline</v-icon>New workflow
      </v-btn>
      <v-btn class="white--text ma-2" text route to="/">
        <v-icon class="mr-2">mdi-collapse-all</v-icon>All workflows
      </v-btn>
      <v-btn v-if="loggedIn" class="white--text ma-2" width="120" text @click="dialog = true">
        <v-icon class="mr-2" color="red">mdi-logout-variant</v-icon>Logout
      </v-btn>
      <v-btn v-else class="white--text ma-2" width="120" text route to="/login">
        <v-icon class="mr-2" color="green">mdi-login-variant</v-icon>Login
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer" class="primary" temporary column>
      <v-layout column align-inherit class="mx-2">
        <v-btn class="white--text mt-10" text route to="/">
          <v-icon class="mr-2">mdi-collapse-all</v-icon>All workflows
        </v-btn>
        <v-btn class="white--text mt-5" text route to="/create">
          <v-icon class="mr-2">mdi-file-document-box-plus-outline</v-icon>Create new workflow
        </v-btn>
        <v-btn class="white--text mt-5" text route to="/create_user">
          <v-icon class="mr-2">mdi-account-multiple-plus-outline</v-icon>Create new user
        </v-btn>
        <v-btn class="white--text mt-5" text route to="/groups">
          <v-icon class="mr-2">mdi-account-group-outline</v-icon>Groups
        </v-btn>
      </v-layout>
      <v-spacer></v-spacer>
      <v-layout v-if="loggedIn" align-center justify-center class="mt-12">
        <v-avatar color="orange" size="60" class="mr-4">
          <span class="white--text headline">{{userInfo.username[0]}}</span>
        </v-avatar>
        <h3 class="white--text">{{userInfo.username}}</h3>
      </v-layout>
    </v-navigation-drawer>
  </nav>
</template>

<script lang="ts">
import { Vue, Component, Provide, Watch, Emit } from "vue-property-decorator";
import UserStore from "../store/modules/user";
import Snackbar from "./Snackbar.vue";

const Mappers = Vue.extend({
  components: {
    Snackbar
  },
  computed: {
    ...UserStore.mapGetters(["userInfo", "loggedIn"])
  },
  methods: {
    ...UserStore.mapActions({
      login: "login",
      logout: "logout"
    })
  }
});

@Component
export default class Navbar extends Mappers {
  @Provide() drawer: boolean = false;
  @Provide() snackbarText: string = "";
  @Provide() snackbar: boolean = false;
  @Provide() dialog: boolean = false;

  @Watch("loggedIn")
  loginChange(val: string, oldVal: string) {
    this.snackbarText = `Welcome, ${this.userInfo.username}!`;
    this.snackbar = true;
  }

  @Emit()
  logoutUser() {
    this.dialog = false;
    this.logout();
    this.$router.push("/");
  }

  // При монтировании компонента сразу делает логин для юзера с логином "2" и паролем "2"
  // Монтируется здесь, потому что этот компонент доступен во всём приложении и метод отработает в любом случае
  mounted() {
    const user = {
      username: "2",
      password: "2"
    };
    this.login(user).then(() => console.log(this.userInfo, "userInfo"));
  }
}
</script>

<style>
</style>