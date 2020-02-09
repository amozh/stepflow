<template>
  <div class="about">
    <h1>{{hello}}</h1>
    <div class="text-center">
      <v-icon large color="green darken-2">mdi-domain</v-icon>
      <v-icon large color="blue darken-2">mdi-message-text</v-icon>
      <v-icon large color="purple darken-2">mdi-dialpad</v-icon>
      <v-icon large color="teal darken-2">mdi-email</v-icon>
      <v-icon large color="blue-grey darken-2">mdi-call-split</v-icon>
      <v-icon large color="orange darken-2">mdi-arrow-up-bold-box-outline</v-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from "vue-property-decorator";

@Component
export default class About extends Vue {
  @Provide() hello: string = "About page";
}
</script>
<style lang="scss" scoped>
@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons";
</style>