<template>
  <codemirror class="left" v-model="code" :options="cmOptions" @input="onCmCodeChange" />
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Provide,
  Emit,
  Watch
} from "vue-property-decorator";
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
// language
import "codemirror/mode/javascript/javascript.js";
// theme css
import "codemirror/theme/monokai.css";
import "codemirror/theme/darcula.css";
import "codemirror/theme/yeti.css";
// keyMap
import "codemirror/mode/clike/clike.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/keymap/sublime.js";

const Mappers = Vue.extend({
  components: {
    codemirror
  }
});
@Component
export default class JavaScriptEditor extends Mappers {
  @Prop() currentCode!: string;
  @Prop() currentAction!: any;

  @Provide() code: null | string = null;
  @Provide() cmOptions: any = {
    tabSize: 4,
    styleActiveLine: false,
    lineNumbers: true,
    styleSelectedText: false,
    line: true,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
    mode: "text/javascript",
    hintOptions: {
      completeSingle: false
    },
    keyMap: "sublime",
    matchBrackets: true,
    showCursorWhenSelecting: true,
    theme: "darcula",
    extraKeys: { Ctrl: "autocomplete" }
  };

  // onCmBlur(cm) {
  //   console.log("cm blur!", cm);
  // }
  // onCmFocus(cm) {
  //   console.log("cm focus!", cm);
  // }
  // onCmReady(cm) {
  //   console.log("cm ready!", cm);
  // }

  @Emit("change-js")
  changeJs(code: string): void {
    return;
  }

  @Watch("currentAction")
  changeCode(val: any, oldVal: any) {
    this.code = this.currentCode;
  }

  onCmCodeChange(cm) {
    this.changeJs(this.code);
  }

  mounted() {
    this.code = this.currentCode;
  }
}
</script>