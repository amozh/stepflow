<template>
  <v-app class="grey lighten-4">
    <div v-if="isLogged" class="text-center mt-10">
      <v-progress-circular indeterminate :size="60" color="primary"></v-progress-circular>
    </div>
    <v-layout v-else class="grey lighten-4">
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
import { Vue, Component, Provide, Watch, Emit } from "vue-property-decorator";
import Navbar from "@/components/Navbar.vue";
import { userMapper } from "./store/modules/user";
import { UserDto } from "@stepflow/shared";

const Mappers = Vue.extend({
  components: {
    Navbar
  },
  computed: { ...userMapper.mapGetters(["isLogged"]) },
  methods: { ...userMapper.mapActions({ login: "login" }) }
});
@Component
export default class App extends Mappers {
  created() {
    const user: UserDto = {
      username: "2",
      password: "2"
    };
    this.login(user);
  }
}
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
