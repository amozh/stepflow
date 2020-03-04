import { Getters, Mutations, Actions, Module, createMapper } from "vuex-smart-module";
import { userApi } from "../api";
import { UserDto, IUserGroupDto } from '@stepflow/shared';

class RootState {
    user: any = {};
    allUsers: UserDto[] = [];
    loggedIn: boolean = false;
    userLoading: boolean = false;
    isLogged: boolean = false
}

class RootGetters extends Getters<RootState> {
    get userInfo(): UserDto {
        return this.state.user;
    }
    get userId(): number {
        return this.state.user.id
    }
    get loggedIn(): boolean {
        return this.state.loggedIn;
    }
    get userGroups(): IUserGroupDto[] {
        return this.state.user.userGroups;
    }
    get allUsers(): UserDto[] {
        return this.state.allUsers;
    }
    get userLoading(): boolean {
        return this.state.userLoading;
    }
    get isLogged(): boolean {
        return this.state.isLogged
    }
}

class RootMutations extends Mutations<RootState> {
    mutateUser(user: UserDto | {}): UserDto | {} {
        return this.state.user = user;
    }
    mutateLoggedIn(isLogged: boolean): boolean {
        return this.state.loggedIn = isLogged;
    }
    mutateAllUsers(allUsers: UserDto[]): UserDto[] {
        return this.state.allUsers = allUsers;
    }
    mutateLoading(loading: boolean): boolean {
        return this.state.userLoading = loading;
    }
    mutateIsLogged(loading: boolean): boolean {
        return this.state.isLogged = loading;
    }
}

class RootActions extends Actions<
    RootState,
    RootGetters,
    RootMutations,
    RootActions
    > {
    logout() {
        this.commit("mutateLoggedIn", false);
        this.commit("mutateUser", {});
    }

    async login(user: UserDto): Promise<void> {
        this.commit("mutateIsLogged", true)
        try {
            const response = await userApi.login(user);
            this.commit("mutateLoggedIn", true);
            this.commit("mutateUser", response.data);
            this.commit("mutateIsLogged", false)
        } catch (e) {
            this.commit("mutateIsLogged", false)
            throw new Error(e);
        }
    }

    async createUser(user: UserDto): Promise<any> {
        const res = await userApi.createUser(user)
        return res
    }

    async getAllUsers(): Promise<void> {
        this.commit("mutateLoading", true);
        try {
            const response = await userApi.getAllUsers();
            this.commit("mutateAllUsers", response.data);
            this.commit("mutateLoading", false);
        } catch (e) {
            this.commit("mutateLoading", false);
            throw new Error(e);
        }
    }
}

const userStore = new Module({
    state: RootState,
    getters: RootGetters,
    mutations: RootMutations,
    actions: RootActions
});

export const userMapper = createMapper(userStore)

export default userStore