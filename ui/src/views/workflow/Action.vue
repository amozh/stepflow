<template>
  <v-form class="text-left" ref="form">
    <v-text-field
      label="Action name"
      v-model="actionName"
      prepend-icon="format_color_text"
      :rules="inputRules"
    ></v-text-field>
    <v-text-field
      label="Action description"
      v-model="actionDescription"
      prepend-icon="description"
      :rules="inputRules"
    ></v-text-field>
    <v-select prepend-icon="apps" label="Action type" v-model="actionType" :items="TYPES"></v-select>
    <v-text-field
      label="Action alias"
      v-model="actionAlias"
      prepend-icon="comment"
      :rules="inputRules"
    ></v-text-field>
    <JavaScriptEditor
      :currentCode="currentAction.body"
      :currentAction="currentAction"
      @change-js="changeJs"
    />
    <v-container class="d-flex flex-row btns">
      <v-btn color="error" @click="removeAction(currentAction.id)">
        Delete action
        <v-icon class="ml-2">delete_forever</v-icon>
      </v-btn>
      <v-btn class="success" width="200" @click="saveCurrenAction">
        Save action
        <v-icon class="ml-2">save</v-icon>
      </v-btn>
    </v-container>
  </v-form>
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
import { ValidationUtils } from "../../utils/validation-utils";
import JavaScriptEditor from "../../components/JavaScriptEditor.vue";

export enum ActionType {
  ON_START = "ON_START",
  ON_SUBMIT = "ON_SUBMIT",
  ON_COMPLETE = "ON_COMPLETE",
  CUSTOM = "CUSTOM"
}

const Mappers = Vue.extend({
  components: {
    JavaScriptEditor
  }
});

@Component
export default class Action extends Mappers {
  @Prop() currentAction!: any;

  @Provide() inputRules = [ValidationUtils.nonEmptyString];
  @Provide() actionName: string = "";
  @Provide() actionDescription: string = "";
  @Provide() actionAlias: string = "";
  @Provide() actionBody: string = "";
  @Provide() actionType: ActionType = ActionType.ON_START;
  @Provide() TYPES: string[] = [
    ActionType.ON_START,
    ActionType.ON_SUBMIT,
    ActionType.ON_COMPLETE,
    ActionType.CUSTOM
  ];

  @Watch("currentAction")
  changeCurrentAction(val: boolean, oldVal: boolean) {
    this.actionName = this.currentAction.name;
    this.actionType = this.currentAction.actionType;
    this.actionDescription = this.currentAction.description;
    this.actionAlias = this.currentAction.alias;
    this.actionBody = this.currentAction.body;
  }

  @Emit("remove-action")
  removeAction(): void {
    return;
  }

  @Emit("save-current-action")
  saveCurrenAction(): any {
    const action = {
      id: this.currentAction.id,
      name: this.actionName,
      actionType: this.actionType,
      description: this.actionDescription,
      alias: this.actionAlias,
      body: this.actionBody
    };
    return action;
  }

  changeJs(code: string) {
    this.actionBody = code;
  }

  mounted() {
    this.actionName = this.currentAction.name;
    this.actionType = this.currentAction.actionType;
    this.actionDescription = this.currentAction.description;
    this.actionAlias = this.currentAction.alias;
    this.actionBody = this.currentAction.body;
  }
}
</script>
<style scoped>
form {
  width: 100%;
}
.btns {
  justify-content: space-around;
}
</style>