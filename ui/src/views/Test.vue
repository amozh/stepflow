<template>
  <div class="container">
    <GenerateContent />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import GenerateContent from "../components/GenerateContent.vue"

const Mappers = Vue.extend({
  components: {
    GenerateContent
  }
});

@Component
export default class Test extends Mappers {

}
</script>
