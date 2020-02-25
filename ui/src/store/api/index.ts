import axios from "axios";
import { CreateWorkflowDto, UserDto, UserGroupDto } from '@stepflow/shared';

const instance = axios.create({
  baseURL: "http://localhost:4000/"
});

export const workflowApi = {
  getAll() {
    return instance.get("workflows");
  },
  getById(id: string) {
    return instance.get(`workflows/${id}`);
  },
  checkAnswer(answer: any ) { //--fix 
    return instance.post("answer", answer);
  },
  createWorkflow(workflow: CreateWorkflowDto) {
    return instance.post("workflows", workflow);
  }
};

export const userApi = {
  getUserById(id: string) {
    return instance.get(`user/${id}`)
  },
  getAllUsers() {
    return instance.get("user")
  },
  createUser(user: any ) { //fix UserDto
    return instance.post("user", user)
  },
  updateUser(user: UserDto, id: string) {
    return instance.put(`user/${id}`, user)
  },
  deleteUser(id: string) {
    return instance.delete(`user/${id}`)
  },
  login(user: any) { //fix UserDto
    return instance.post("user/login", user)
  }
}

export const groupApi = {
  getGroupById(id: string) {
    return instance.get(`group/${id}`)
  },
  getGroupsByUserId(id:string){
    return instance.get(`group/user/${id}`)
  },
  createUser(group: UserGroupDto) {
    return instance.post("group", group)
  },
  updateGroup(newGroupInfo: { group: UserGroupDto, id: string }) {
    return instance.put(`group/${newGroupInfo.id}`, newGroupInfo.group)
  },
  deleteGroup(id: string) {
    return instance.delete(`group/${id}`)
  },
  
}
