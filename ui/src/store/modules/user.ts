import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import { userApi } from "../api/index";

class RootState {
    user: any = {};
    allUsers: any = [];
    loggedIn: boolean = false;
    userLoading: boolean = false;
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
    get allUsers(): any {
        return this.state.allUsers
    }
    get userLoading(): boolean {
        return this.state.userLoading;
    }
}

class RootMutations extends Mutations<RootState> {
    mutateUser(user: any): any {
        return this.state.user = user
    }
    mutateLoggedIn(isLogged: boolean): boolean {
        return this.state.loggedIn = isLogged
    }
    mutateAllUsers(allUsers: any): any {
        return this.state.allUsers = allUsers
    }
    mutateLoading(loading: boolean): boolean {
        return this.state.userLoading = loading;
    }
}

class RootActions extends Actions<
    RootState,
    RootGetters,
    RootMutations,
    RootActions
    > {
    async login(user: { username: string; password: string }): Promise<any> {
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

    async createUser(user: { username: string; password: string }): Promise<any> {
        try {
            return await userApi.createUser(user)
        } catch (e) {
            return e
        }
    }

    async getAllUsers(): Promise<any> {
        this.commit("mutateLoading", true);
        try {
            const response = await userApi.getAllUsers()
            this.commit("mutateAllUsers", response.data)
            this.commit("mutateLoading", false);
        } catch (e) {
            this.commit("mutateLoading", false);
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