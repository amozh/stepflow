<template>
  <div class="d-flex flex-row">
    <div
      v-for="(crumb, crumbIndex) in breadcrumbs"
      :key="crumbIndex"
      :class="crumbIndex+1===breadcrumbs.length ?'d-flex current':'d-flex pointer' "
    >
      <h3 @click="toCrumb(crumb)">{{crumb.text}}</h3>
      <v-icon v-if="breadcrumbs.length !== crumbIndex+1">mdi-chevron-right</v-icon>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Provide,
  Emit,
  Ref
} from "vue-property-decorator";

// const Mappers = Vue.extend({});
@Component
export default class BreadCrumbs extends Vue {
  @Prop() breadcrumbs: any;

  @Emit("to-crumb")
  toCrumb(): void {
    return;
  }
}
</script>
<style scoped>
.pointer {
  cursor: pointer;
}
.current {
  color: #a2a9b0;
  cursor: default;
}
</style>