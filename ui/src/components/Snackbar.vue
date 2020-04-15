<template>
  <v-snackbar class="mb-5" v-model="isOpen">
    {{snackbarText}}
    <v-btn color="white" text @click="isOpen = false">Close</v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import { Vue, Component, Provide, Prop, Watch } from "vue-property-decorator";

@Component
export default class Snackbar extends Vue {
  @Provide() isOpen: boolean = false;

  @Prop() snackbar!: boolean;
  @Prop() snackbarText!: string;

  closeSnackbar() {
    this.isOpen = false;
  }

  @Watch("snackbar")
  snackbarDiff(val: boolean, oldVal: boolean) {
    this.isOpen = this.snackbar;
    setTimeout(() => {
      this.closeSnackbar();
    }, 3000);
  }
}
</script>
