<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="questionField"
      :counter="100"
      label="Enter question"
      required
    ></v-text-field>

    <!-- <v-select
      :items="fontFamily"
      :rules="[v => !!v || 'Item is required']"
      label="Font type:"
      required
    ></v-select>

    <v-subheader class="pl-0">Font size</v-subheader>
    <v-slider
      thumb-label="always"
      min="1"
      max="100"
    ></v-slider> -->

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
            label="Enter variant"
            v-model="variant_id[count-1]"
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

        <!-- <v-text-field
          label="Value must match"
        ></v-text-field> -->

        <!-- <v-btn
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
        </v-btn> -->
      </v-col>
    </v-row>    

    <v-col
      cols="12"
      md="4"
    >
    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="addQuestion"
    >
      Add question
    </v-btn>

    <!-- <v-btn
      color="error"
      class="mr-4"
    >
      Delete 
    </v-btn> -->
    </v-col>

  </v-form>
</template>

<script lang="ts">
import { Vue, Component, Provide, Emit } from "vue-property-decorator";

@Component
export default class AddQuestionForm extends Vue {
  @Provide() tab: any = null;
  @Provide() counter: any = 25;
  @Provide() counts: any = 0;
  @Provide() valid: any = true;
  @Provide() questionField: any = '';
  @Provide() variant_id: any = [
  ];

  @Emit("addQuestion") addQuestion(){
    return(this.questionField, this.variant_id)
  }
}
</script>

<style scoped>

</style>