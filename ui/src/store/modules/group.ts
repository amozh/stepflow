import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import { groupApi } from "../api/index";

class RootState {

}

class RootGetters extends Getters<RootState> {

}

class RootMutations extends Mutations<RootState> {

}

class RootActions extends Actions<
    RootState,
    RootGetters,
    RootMutations,
    RootActions
    > {
    async deleteGroup(id: string) {
        try {
            await groupApi.deleteGroup(id)
        } catch (e) {
            console.log(e)
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