<template>
  <tr>
    <td class="text-left ml-5">{{ user.username }}</td>
    <td class="pl-12">
      <v-checkbox v-model="checkbox"></v-checkbox>
    </td>
  </tr>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Provide,
  Ref,
  Emit,
  Prop,
  Watch
} from "vue-property-decorator";
import { IUserGroupDto,UserDto } from '@stepflow/shared';

@Component
export default class UserTr extends Vue {
  @Provide() checkbox: boolean = false;

  @Prop() addToGroup!: any; //fix
  @Prop() user!: UserDto;

  // Когда значение в чекбоксе поменяется, выполнится коллбэк, который передаст id юзера и значение чекбокса
  @Watch("checkbox")
  userGroupsDiff(val: any, oldVal: any) {
    this.addToGroup(this.user.id, this.checkbox);
  }
}
</script>
