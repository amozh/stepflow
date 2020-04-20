
<template>
  <v-form
    ref="form"
    lazy-validation
  >
    <v-select
      :items="inputTypes"
      :rules="[v => !!v || 'Item is required']"
      label="Input type:"
      required
    ></v-select>

    <v-text-field
      :counter="25"
      label="Name"
      required
    ></v-text-field>

    <v-text-field
      :counter="25"
      label="Value"
      required
    ></v-text-field>

    <v-btn
      color="success"
      class="mr-4"

    >
      Add input
    </v-btn>

    <v-btn
      color="error"
    >
      Delete
    </v-btn>
  </v-form>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Provide,
  Prop,
  Emit,
  Inject,
  Watch
} from "vue-property-decorator";

@Component
export default class CreateInputForm extends Vue {
@Provide() tab: any = null;
@Provide() inputTypes: any = [
  'text',
  'button',
  'date',
  'number',
  'url'
];
}
</script>

<style scoped>

</style>