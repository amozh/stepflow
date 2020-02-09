<template>
  <div class="home">
    <h1>{{hello}}</h1>
    <v-btn class="ma-2" tile outlined color="success">
      <v-icon left>mdi-pencil</v-icon>Edit
    </v-btn>
    <span class="group pa-2">
      <v-icon>home</v-icon>
      <v-icon>event</v-icon>
      <v-icon>info</v-icon>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from "vue-property-decorator";

@Component
export default class About extends Vue {
  @Provide() hello: string = "Home page";
}
</script>
