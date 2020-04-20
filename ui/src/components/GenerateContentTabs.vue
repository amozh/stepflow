<template>
  <div class="container">
    <v-tabs background-color="#f5f5f5" v-model="tab" slider-size="3">
      <v-tab>Question</v-tab>
      <v-tab v-if="true">Create text/label</v-tab>
      <v-tab v-if="true">Create input</v-tab>
      <v-tab v-if="true">Upload image</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" background-color="#f5f5f5" class="pa-6">
      <v-tab-item>
        <AddQuestionForm />
      </v-tab-item>
      <v-tab-item>
        <CreateTextForm />
      </v-tab-item>
      <v-tab-item>
        <CreateInputForm />
      </v-tab-item>
      <v-tab-item>
        <UploadImage />
      </v-tab-item>
    </v-tabs-items>
  </div>
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
import AddQuestionForm from "../components/AddQuestionForm.vue"
import VariantsForm from "../components/VariantsForm.vue"
import CreateTextForm from "../components/CreateTextForm.vue"
import CreateInputForm from "../components/CreateInputForm.vue"
import UploadImage from "../components/UploadImage.vue"

const Mappers = Vue.extend({
  components: {
    AddQuestionForm,
    VariantsForm,
    CreateTextForm,
    CreateInputForm,
    UploadImage
  }
});

@Component
export default class GenerateContentTabs extends Mappers {
@Provide() tab: any = null;
}
</script>

<style scoped>
  #sandbox {
    height: 500px;
    width: 800px;
    box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
    background-color: rgb(255, 255, 255);
  }
</style>