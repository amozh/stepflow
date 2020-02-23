import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import { groupApi } from "../api/index";

class RootState {
    userGroups: any[] = []
    groupsLoading: boolean = false
}

class RootGetters extends Getters<RootState> {
    get userGroups(): any {
        return this.state.userGroups
    }
    get groupsLoading(): boolean {
        return this.state.groupsLoading;
    }
}

class RootMutations extends Mutations<RootState> {
    mutateUserGroups(groups: any): any {
        return this.state.userGroups = groups
    }
    mutateLoading(loading: boolean): boolean {
        return this.state.groupsLoading = loading;
    }
}

class RootActions extends Actions<
    RootState,
    RootGetters,
    RootMutations,
    RootActions
    > {

    // В будущем эти группы будут приходить не через id, а с помощью переданного токена в заголовке запроса
    async getMyGroups(id: string): Promise<any> {
        this.commit("mutateLoading", true)
        try {
            const response = await groupApi.getGroupsByUserId(id)
            this.commit("mutateUserGroups", response.data)
            this.commit("mutateLoading", false);
        } catch (e) {
            this.commit("mutateLoading", false);
            throw new Error(e)
        }
    }

    async deleteGroup(id: string): Promise<any> {
        try {
            await groupApi.deleteGroup(id)
        } catch (e) {
            throw new Error(e)
        }
    }

    async createGroup(
        group: {
            groupName: string,
            users: Partial<any>,
            workflows: Partial<any>
        }
    ): Promise<any> {
        try {
            return await groupApi.createUser(group)
        } catch (e) {
            throw new Error(e)
        }
    }

    async updateGroup(
        group: {
            groupName: string,
            users: Partial<any>,
            workflows: Partial<any>
        },
        id: string
    ): Promise<any> {
        try {
            return await groupApi.updateGroup(group, id)
        } catch (e) {
            throw new Error(e)
        }
    }
}
// Экспорт модуля
export default new Module({
    state: RootState,
    getters: RootGetters,
    mutations: RootMutations,
    actions: RootActions
});