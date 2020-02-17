<template>
  <nav>
    <v-app-bar app class="primary" outlined>
      <v-app-bar-nav-icon class="white--text" large @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn class="white--text ma-2" text route to="/create">
        <v-icon class="mr-2">mdi-file-document-box-plus-outline</v-icon>New workflow
      </v-btn>
      <v-btn class="white--text ma-2" text route to="/">
        <v-icon class="mr-2">mdi-collapse-all</v-icon>All workflows
      </v-btn>
      <v-btn v-if="true" class="white--text ma-2" width="120" text route to="/me">
        <v-icon class="mr-2">mdi-login-variant</v-icon>Login
      </v-btn>
      <v-btn v-else class="white--text ma-2" width="120" text route to="/me">
        <v-icon class="mr-2">mdi-logout-variant</v-icon>Logout
      </v-btn>
     </v-app-bar>
    <v-navigation-drawer app v-model="drawer" class="primary" temporary>
      <v-layout column align-center>
        <v-btn class="white--text mt-10" text route to="/">
          <v-icon class="mr-2">mdi-collapse-all</v-icon>All workflows
        </v-btn>
        <v-btn class="white--text mt-5" text route to="/create">
          <v-icon class="mr-2">mdi-file-document-box-plus-outline</v-icon>New workflow
        </v-btn>
        <v-btn class="white--text mt-5" text route to="/create_user">
          <v-icon class="mr-2">mdi-account-multiple-plus-outline</v-icon>Create new user
        </v-btn>
      </v-layout>
    </v-navigation-drawer>
  </nav>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

export default Vue.extend({
  data() {
    return {
      drawer: false
    };
  }
});
</script>

<style>
</style>