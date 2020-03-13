import { Getters, Mutations, Actions, Module, createMapper } from "vuex-smart-module";
import { groupApi, userApi } from "../api/index";
import { IUserGroupDto, IUserGroupBaseDto } from '@stepflow/shared';

class RootState {
    userGroups: IUserGroupDto[] = []
    groupsLoading: boolean = false
}

class RootGetters extends Getters<RootState> {
    get userGroups(): IUserGroupDto[] {
        return this.state.userGroups
    }
    get groupsLoading(): boolean {
        return this.state.groupsLoading;
    }
}
class RootMutations extends Mutations<RootState> {
    mutateUserGroups(groups: IUserGroupDto[]): IUserGroupDto[] {
        return this.state.userGroups = groups
    }
    mutateLoading(loading: boolean): boolean {
        return this.state.groupsLoading = loading;
    }
    addNewGroup(newGroup: IUserGroupDto): IUserGroupDto[] {
        return this.state.userGroups = [...this.state.userGroups, newGroup]
    }
    deleteGroupInStore(id: string): IUserGroupDto[] {
        return this.state.userGroups = this.state.userGroups.filter(g => g.id !== id)
    }
    updateGroup(group: IUserGroupDto): IUserGroupDto[] {
        const currentGroup = this.state.userGroups.find(g => g.id === group.id)
        const updatedGroup = Object.assign(currentGroup, group)
        const index = this.state.userGroups.indexOf(group)
        return this.state.userGroups.splice(index, 1, updatedGroup)
    }
    destroyGroups(): void[] {
        return this.state.userGroups = []
    }
}

class RootActions extends Actions<
    RootState,
    RootGetters,
    RootMutations,
    RootActions
    > {
    async getMyGroups(id: number): Promise<any> {
        this.commit("mutateLoading", true)
        try {
            const response = await userApi.getUserGroups(id)
            this.commit("mutateUserGroups", response.data)
            this.commit("mutateLoading", false);
        } catch (e) {
            this.commit("mutateLoading", false);
            throw new Error(e);
        }
    }

    async deleteGroup(id: string): Promise<any> {
        try {
            const res = await groupApi.deleteGroup(id);
            if (res) {
                this.commit("deleteGroupInStore", id)
            }
        } catch (e) {
            throw new Error(e);
        }
    }

    async createGroup(
        group: IUserGroupBaseDto
    ): Promise<void> {
        try {
            const response = await groupApi.createGroup(group);
            this.commit("addNewGroup", response.data)
        } catch (e) {
            throw new Error(e);
        }
    }

    async updateGroup(
        group: {
            id: string,
            group: IUserGroupDto
        }
    ): Promise<void> {
        try {
            const response = await groupApi.updateGroup(group);
            this.commit("updateGroup", response.data)
        } catch (e) {
            throw new Error(e);
        }
    }

}
// Экспорт модуля
const groupStore = new Module({
    state: RootState,
    getters: RootGetters,
    mutations: RootMutations,
    actions: RootActions
});

export const groupMapper = createMapper(groupStore)

export default groupStore