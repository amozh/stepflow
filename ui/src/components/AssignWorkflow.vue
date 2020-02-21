<template>
  <div class="container">
    <h1 class="subheading text-center">AssignWorkflow component</h1>
    
    </v-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Ref, Emit } from "vue-property-decorator";
// import UserStore from "../store/modules/user";

const Mappers = Vue.extend({
  computed: {
    // ...UserStore.mapGetters(["userInfo", "loggedIn"])
  },
  methods: {
    // ...UserStore.mapActions({
    //   login: "login"
    // })
  }
});

@Component
export default class AssignWorkflow extends Mappers {
  @Provide() inputRules = [
    (v: string) => (v && v.length >= 0) || "Field is required"
  ];

  @Ref("form") readonly form!: any;

  @Emit()
  async submit() {
    if (this.$refs.form.validate()) {
    }
  }
}
</script>
