<template>
  <v-app class="grey">
    <v-layout class="grey lighten-4">
      <v-app-bar-nav-icon class="black--text" large></v-app-bar-nav-icon>
      <v-btn to="/about" color="primary" width="100">
        About
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn to="/" width="100" color="error">Home</v-btn>

      <transition name="fade">
        <router-view></router-view>
      </transition>
    </v-layout>
  </v-app>
</template>
<script lang="ts">
import Vue from "vue";

export default {
  name: "app"
};
</script>

<style lang="scss" scoped>
@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons";
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.15s;
}

.fade-enter-active {
  transition-delay: 0.15s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
