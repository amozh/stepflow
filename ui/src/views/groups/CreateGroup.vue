<template>
  <div class="container">
    <Snackbar :snackbar="snackbar" :snackbarText="snackbarText" />
    <div v-if="isLoading" class="text-center mt-10">
      <v-progress-circular indeterminate :size="60" color="primary"></v-progress-circular>
    </div>
    <v-form v-else class="text-center" width="500" ref="form">
      <v-text-field
        class
        label="Group name"
        v-model="groupName"
        prepend-icon=" mdi-account-group-outline"
        :rules="inputRules"
      ></v-text-field>
      <v-card outlined class="pa-4">
        <v-simple-table>
          <thead>
            <tr>
              <th class="text-left">Username</th>
              <th class="text-left">Add user to group</th>
            </tr>
          </thead>
          <tbody>
            <UserTr v-for="user in allUsers" :key="user.id" :user="user" :addToGroup="addToGroup" />
          </tbody>
        </v-simple-table>
      </v-card>
      <v-btn text class="primary mt-6" width="200" @click="submit">Create group</v-btn>
    </v-form>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Provide,
  Ref,
  Emit,
  Prop
} from "vue-property-decorator";
import UserTr from "../../components/UserTr.vue";
import Snackbar from "../../components/Snackbar.vue";
import { ICreateWorkflowDto,
IUserGroupDto,
UserDto,
UserEntityDto,
IEntityUserDto,
IUserGroupBaseDto
} from '@stepflow/shared';

const Mappers = Vue.extend({
  components: {
    UserTr,
    Snackbar
  }
});

@Component
export default class CreateGroup extends Mappers {
  @Provide() groupName: string = "";
  @Provide() usersInGroup: Set<any> = new Set(); //Использую Set, чтобы все значения будущего массива были уникальные
  @Provide() snackbar: boolean = false;
  @Provide() snackbarText: string = "";
  @Provide() inputRules = [
    (v: string) => (v && v.length >= 0) || "Field is required"
  ];

  @Prop() createGroup!: (group: IUserGroupBaseDto) => IUserGroupDto;
  @Prop() allUsers!: UserEntityDto[];
  @Prop() getAllUsers!: () => IEntityUserDto[];
  @Prop() isLoading!: boolean;

  @Ref("form") readonly form!: HTMLInputElement;

  @Emit()
  async submit() {
    const users = Array.from(this.usersInGroup);
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate() && users.length) {
      const group = {
        groupName: this.groupName,
        users
      };
      await this.createGroup(group);
      this.snackbarText = `Group ${this.groupName} has been created`;
      this.snackbar = true;
    }
  }

  @Emit()
  addToGroup(userId: number, checked: boolean): void {
    // Найди юзера и, если checked === true, добавь в Set
    const user = this.allUsers.find(u => u.id === userId);
    if (checked) {
      this.usersInGroup.add(user);
    } else {
      this.usersInGroup.delete(user);
    }
  }

  mounted() {
    this.getAllUsers();
  }
}
</script>
