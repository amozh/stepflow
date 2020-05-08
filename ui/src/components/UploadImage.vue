<template>
  <p>UploadImage</p>
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
export default class UploadImage extends Vue {
@Provide() tab: any = null;
}
</script>

<style scoped>

</style>