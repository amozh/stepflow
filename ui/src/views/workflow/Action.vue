<template>
  <v-form class="full_width" ref="form">
    <v-container class="d-flex flex-row btns">
      <v-btn color="error" @click="deleteAction(currentAction.actionIndex)">
        Delete action
        <v-icon class="ml-2">delete_forever</v-icon>
      </v-btn>
      <v-btn
        class="success"
        width="200"
        @click="saveAction({
          name: actionName, 
          description:actionDescription, 
          body: actionJson, 
          alias: actionAlias,
          actionType: actionType
          },
          currentAction.actionIndex
          )"
      >
        Save action
        <v-icon class="ml-2">save</v-icon>
      </v-btn>
    </v-container>
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
      :jscode="actionJson"
      :currentCode="currentAction.action.body"
      :currentAction="currentAction"
      @change-js="changeJs"
    />
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
import VJsoneditor from "v-jsoneditor";
import { ValidationUtils } from "../../utils/validation-utils";
import JavaScriptEditor from "../../components/JavaScriptEditor.vue";

const Mappers = Vue.extend({
  components: {
    VJsoneditor,
    JavaScriptEditor
  }
});

export enum ActionType {
  ON_START = "ON_START",
  ON_SUBMIT = "ON_SUBMIT",
  ON_COMPLETE = "ON_COMPLETE",
  CUSTOM = "CUSTOM"
}

@Component
export default class Form extends Mappers {
  @Provide() inputRules = [ValidationUtils.nonEmptyString];
  @Provide() actionName: string = "";
  @Provide() actionDescription: string = "";
  @Provide() actionAlias: string = "";
  @Provide() actionJson: any = "";
  @Provide() actionType: ActionType = ActionType.ON_START;
  @Provide() TYPES: string[] = [
    ActionType.ON_START,
    ActionType.ON_SUBMIT,
    ActionType.ON_COMPLETE,
    ActionType.CUSTOM
  ];

  @Prop() currentAction!: any;
  @Prop() autoSave: boolean;

  @Watch("currentAction")
  watchCurrentAction(val: any, oldVal: any) {
    this.actionName = this.currentAction.action.name;
    this.actionType = this.currentAction.action.actionType;
    this.actionDescription = this.currentAction.action.description;
    this.actionAlias = this.currentAction.action.alias;
    this.actionJson = this.currentAction.action.body;
  }

  @Emit("delete-action")
  deleteAction(actionIndex): void {
    return;
  }

  @Emit("save-action")
  saveAction(
    action: object,
    actionIndex: number
  ): { action: object; actionIndex: number } {
    console.log(this.actionJson, "actionJson");
    return { action, actionIndex };
  }

  changeJs(code: string) {
    this.actionJson = code;
  }

  beforeUpdate() {
    if (this.autoSave) {
      this.saveAction(
        {
          name: this.actionName,
          actionType: this.actionType,
          description: this.actionDescription,
          alias: this.actionAlias,
          body: this.actionJson
        },
        this.currentAction.actionIndex
      );
    }
  }

  mounted() {
    this.actionName = this.currentAction.action.name;
    this.actionType = this.currentAction.action.actionType;
    this.actionDescription = this.currentAction.action.description;
    this.actionAlias = this.currentAction.action.alias;
    this.actionJson = this.currentAction.action.body;
  }
}
</script>
<style lang="scss" scoped>
form {
  text-align: left;
  width: 100%;
}
.btns {
  justify-content: space-around;
}
</style>