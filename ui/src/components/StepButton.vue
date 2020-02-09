<template>
  <div>
    <v-btn v-if="!answerResult" color="primary" width="100px" @click="sendAnswer">Send</v-btn>
    <v-btn v-else-if="answerResult==='Correct answer'" color="success" width="100px">Correct</v-btn>
    <v-btn v-else color="error" width="100px">Wrong</v-btn>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component
export default class StepButton extends Vue {
  @Prop() answerResult!: string;
  @Prop() sendAnswer!: any;
}
</script>
