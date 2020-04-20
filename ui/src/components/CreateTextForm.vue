<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="name"
      :counter="100"
      :rules="descriptionRules"
      label="Text"
      required
    ></v-text-field>

  <v-btn
    :disabled="!valid"
    color="success"
    class="mr-4"
  >
    Add new label
  </v-btn>

  <v-btn
    color="error"
    class="mr-4"
  >
    Delete 
  </v-btn>

  </v-form>
</template>

<script lang="ts">
import { Vue, Component, Provide } from "vue-property-decorator";

@Component
export default class CreateTextForm extends Vue {
  @Provide() tab: any = null;
  @Provide() valid: any = true;
  @Provide() name: any = '';
  @Provide() descriptionRules: any = [
    v => !!v || 'Name is required',
    v => (v && v.length <= 100) || 'Description must be less than 100 characters',
  ]

}
</script>

<style scoped>

</style>