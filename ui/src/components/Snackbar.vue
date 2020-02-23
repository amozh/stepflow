<template>
  <v-snackbar class="mb-5" v-model="isOpen" :timeout="3000">
    {{snackbarText}}
    <v-btn color="white" text @click="isOpen = false">Close</v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import { Vue, Component, Provide, Prop, Watch } from "vue-property-decorator";

@Component
export default class Snackbar extends Vue {
  @Provide() isOpen: boolean = false;

  @Watch("snackbar")
  snackbarDiff(val: any, oldVal: any) {
    this.isOpen = this.snackbar;
  }

  @Prop() snackbar: boolean;
  @Prop() snackbarText: string;
}
</script>
