import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import { groupApi } from "../api/index";

// class RootState {
// }

// class RootGetters extends Getters<RootState> {
// }

// class RootMutations extends Mutations<RootState> {
// }

class RootActions extends Actions<
    // RootState,
    // RootGetters,
    // RootMutations,
    RootActions
    > {
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
    // state: RootState,
    // getters: RootGetters,
    // mutations: RootMutations,
    actions: RootActions
});