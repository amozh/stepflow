<template>
  <div>
    <GenerateContentTabs />
    <div id="sandbox">
      <div v-for="el in StepViewElement" :key="el.component.id">

        <div v-if="el.component.componentType == 'test'">
          <p>{{el.component.data.question}}</p>
          <div v-for="option in el.component.data.options" :key="option.id">
            <v-checkbox
              :label="option.value"
            ></v-checkbox>
          </div>
        </div>

        <div v-if="el.component.componentType == 'input-set'">
          <p>{{el.component.inputs.question}}</p>
          <div v-for="input in el.component.inputs" :key="input.id">
            <input :type="input.type">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">

import { Vue, Component, Provide, Ref, Emit } from "vue-property-decorator";
import GenerateContentTabs from "../components/GenerateContentTabs.vue"

const Mappers = Vue.extend({
  components: {
    GenerateContentTabs
  }
});

@Component
export default class GenerateContent extends Mappers {
  
  @Provide() StepViewElement: any = [{
    component: {
      id:1,
      componentType: "test",
      data: {
        question: "First question",
        options: [
          { value: "First option", isCorrect: true},
          { value: "Second option", isCorrect: false},
          { value: "Third option", isCorrect: false}
        ]
      }
    }
  },
  {
    component:{
      id:2,
      componentType: "input-set",
      inputs: [
        { type: "submit", label: "Button input" },
        { type: "text", label: "Text input"}
      ]
    }
  }]

  @Provide() StepViewJson: any = {
    elements:this.StepViewElement
  }

  addQuestion(q) {
    alert(q)
    console.log('q')
  }

}
</script>

<style scoped>
  #sandbox {
    height: 500px;
    margin: 10px 100px;
    justify-content: center;
    background-color: rgb(255, 255, 255);
    border: 3px solid #adb3f7;
    border-radius: 2% 6% 5% 4% / 1% 1% 2% 4%;
    background: #ffffff;
  }
</style>