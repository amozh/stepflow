<template>
  <v-container>
    <v-row
      justify="space-between"
    >
      <v-col
        cols="12"
        md="4"
      >
        <v-form ref="form" v-for="count in counts" :key="count">
          <v-text-field
            :counter="counter"
            label="First name"
          ></v-text-field>
        </v-form>
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-subheader class="pl-0">Count of inputs</v-subheader>
        <v-slider
          v-model="counts"
          thumb-label="always"
          min="0"
          max="10"
        ></v-slider>

        <v-text-field
          label="Value must match"
        ></v-text-field>

        <v-btn
          color="success"
          class="mr-4"
        >
          Add variants
        </v-btn>

        <v-btn
          color="error"
          class="mr-4"
        >
          Delete 
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Provide } from "vue-property-decorator";

@Component
export default class VariantsForm extends Vue {
@Provide() tab: any = null;
@Provide() firstVariant: any = "";
@Provide() counter: any = 25;
@Provide() counts: any = 0;
}
</script>

<style scoped>

</style>