<template>
  <div class="d-flex flex-row">
    <div
      v-for="(crumb, crumbIndex) in breadCrumbs"
      data-cy='bread-crumbs'
      :key="crumbIndex"
      :class="crumbIndex+1===breadCrumbs.length ?'d-flex current':'d-flex parent'"
    >
      <h2 class="ma-3" @click="toBreadCrumb(crumb)">{{crumb.text}}</h2>
      <v-icon v-if="breadCrumbs.length !== crumbIndex+1">mdi-chevron-right</v-icon>
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
  Ref,
  Watch
} from "vue-property-decorator";

@Component
export default class BreadCrumbs extends Vue {
  @Prop() breadCrumbs!: any;
  @Prop() toBreadCrumb!: any;
}
</script>
<style scoped>
.parent {
  color: #1976d2;
  cursor: pointer;
}
.current {
  color: #a2a9b0;
  cursor: default;
}
</style>