import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import { userApi } from "../api/index";

class RootState {
    user: any = {};
    loggedIn: boolean = false;
}

class RootGetters extends Getters<RootState> {
    get userInfo(): any {
        return this.state.user
    }
    get loggedIn(): boolean {
        return this.state.loggedIn
    }
    get userGroups(): any {
        return this.state.user.userGroups
    }
}

class RootMutations extends Mutations<RootState> {
    mutateUser(user: any): any {
        return this.state.user = user
    }
    mutateLoggedIn(isLogged: boolean): boolean {
        return this.state.loggedIn = isLogged
    }
}

class RootActions extends Actions<
    RootState,
    RootGetters,
    RootMutations,
    RootActions
    > {
    async login(user: { username: string; password: string }) {
        try {
            const response = await userApi.login(user)
            this.commit("mutateLoggedIn", true)
            this.commit("mutateUser", response.data)
        } catch (e) {
            console.log(e)
        }
    }

    logout() {
        this.commit("mutateLoggedIn", false)
        this.commit("mutateUser", {})
    }
}
// Экспорт модуля
export default new Module({
    state: RootState,
    getters: RootGetters,
    mutations: RootMutations,
    actions: RootActions
});