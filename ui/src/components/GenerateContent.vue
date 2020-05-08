<template>
  <div>
    <!-- <GenerateContentTabs /> -->
    <Sandbox />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Provide, Ref, Emit } from "vue-property-decorator";
import GenerateContentTabs from "../components/GenerateContentTabs.vue";
import Sandbox from "../components/Sandbox.vue";

const Mappers = Vue.extend({
  components: {
    GenerateContentTabs,
    Sandbox
  }
});

@Component
export default class GenerateContent extends Mappers {}
</script>