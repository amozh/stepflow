import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import { userApi } from "../api/index";

class RootState {
    responseError: string = "";
    user: any = {};
    loggedIn: boolean = false;
}

class RootGetters extends Getters<RootState> {
    get responseError(): string {
        return this.state.responseError
    }
    get userInfo(): any {
        return this.state.user
    }
    get loggedIn(): boolean {
        return this.state.loggedIn
    }
}

class RootMutations extends Mutations<RootState> {
    // AxiosResponse<any>
    mutateError(errorMessage: string): string {
        return this.state.responseError = errorMessage
    }
    mutateUser(user: {}): any {
        return this.state.user = user
    }
    mutateLoggedIn(statusCode: string): boolean | undefined {
        if (statusCode === "201") {
            return this.state.loggedIn = true
        }
    }
}

class RootActions extends Actions<
    RootState,
    RootGetters,
    RootMutations,
    RootActions
    > {
    async login(user: { username: string; password: string }) {
        // console.log(user, "user")
        const response = await userApi.login(user)
        // console.log(await userApi.login(user), "await")
        console.log(response, "response")
        this.commit("mutateError", response.data.message)
        this.commit("mutateLoggedIn", response.data.statusCode)
        this.commit("mutateUser", response.data)
    }
}
// Экспорт модуля
export default new Module({
    state: RootState,
    getters: RootGetters,
    mutations: RootMutations,
    actions: RootActions
});