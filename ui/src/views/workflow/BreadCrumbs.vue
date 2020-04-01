<template>
  <v-container class="light placeholder">
    <v-container class="breadcrumb">
      <a
        v-for="(crumb, crumbIndex) in breadcrumbs"
        :key="crumbIndex"
      >
        <h3 @click="toCrumb(crumb)">{{crumb.text}}</h3>
      </a>
    </v-container>
  </v-container>
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

.breadcrumb,
.breadcrumb a {
  height: 33px;
  display: inline-block;
}

.breadcrumb { 
  margin: 0;
  padding: 0;
  border-radius: 3px;
  border-width: 1px;
  border-style: solid;
  overflow: hidden;
  width:auto;
}
.breadcrumb a {
  text-rendering: optimizeLegibility;
  line-height: 33px;
	font-size: 12px;
  font-weight: 300;
	text-decoration: none;
  padding: 0 10px 0 20px;
	position: relative;
}
  .breadcrumb a:first-child {
    padding-left: 16px;
  }
  .breadcrumb a:last-child {
    padding-right: 16px;
    pointer-events: none;
  	cursor: default;
    color: #fff;
  }
  .breadcrumb a:after,
  .breadcrumb a:before { 
  	content: ''; 
  	display: block; 
  	width: 0; 
  	height: 0;
  	border-top: 17px solid transparent;
  	border-bottom: 17px solid transparent;
    border-left: 10px solid transparent;
  	position: absolute;
    margin: auto;
  	top: 0;
    bottom: 0;
  	left: 100%;
  	z-index: 2;
  }
  .breadcrumb a:before { 
    margin-left: 1px;
  	z-index: 1;
  }
  .breadcrumb a:last-child:after,
  .breadcrumb a:last-child:before {
    border: none;
  }

/* LIGHT COLORS */
.light .breadcrumb {
  border-color: #9C9E9E;
}
  .light .breadcrumb a {
    color: #454545;
    background-color: #e5e9e9;
    text-shadow: 0 -1px rgba(255,255,255,.7);
    box-shadow: inset 0 1px 0 #fff;
  } 
    .light .breadcrumb a:after {
      border-left-color: #e5e9e9;
    }
		.light .breadcrumb a:before { 
			border-left-color: #9C9E9E;
		}
		.light .breadcrumb a:hover {
		   background: #EDF1F1;
    }
		.light .breadcrumb a:hover:after {
		  border-left-color: #EDF1F1;
    }
    .light .breadcrumb a:last-child {
      background-color: #d3d7d7;
      box-shadow: inset 0 1px 2px rgba(0,0,0,.2);
    }
</style>