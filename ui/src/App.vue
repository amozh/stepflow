<template>
  <v-app class="grey lighten-4">
    <v-layout class="grey lighten-4">
      <Navbar />
      <v-content class="mx-4 my-4">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </v-content>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "app",
  components: { Navbar }
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
