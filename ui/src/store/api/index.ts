import axios from "axios";
import { ICreateWorkflowDto, UserDto, IUserGroupDto, IUserGroupBaseDto } from '@stepflow/shared';

const api = axios.create({
  baseURL: "http://localhost:4000/"
});

export const workflowApi = {
  getAll() {
    return api.get("workflows");
  },
  getAllExecution() {
    return api.get("wf-executions")
  },
  getById(id: string) {
    return api.get(`workflows/${id}`);
  },
  getExecutionWorkflow(id: string) {
    return api.get(`wf-executions/${id}`)
  },
  executeWorkflow(id: string) {
    return api.post("wf-executions", { workflowId: id })
  },
  createWorkflow(workflow: ICreateWorkflowDto) {
    return api.post("workflows", workflow);
  },
};

export const userApi = {
  getUserById(id: string) {
    return api.get(`user/${id}`)
  },
  getAllUsers() {
    return api.get("user")
  },
  createUser(user: UserDto) {
    return api.post("user", user)
  },
  updateUser(user: UserDto, id: string) {
    return api.put(`user/${id}`, user)
  },
  deleteUser(id: string) {
    return api.delete(`user/${id}`)
  },
  login(user: UserDto) {
    return api.post("user/login", user)
  },
  getUserGroups(id: number) {
    return api.get(`user/group/${id}`)
  }
}

export const groupApi = {
  getGroupById(id: string) {
    return api.get(`group/${id}`)
  },
  getGroupsByUserId(id: string) {
    return api.get(`group/user/${id}`)
  },
  createGroup(group: IUserGroupBaseDto) {
    return api.post("group", group)
  },
  updateGroup(newGroupInfo: { group: IUserGroupDto, id: string }) {
    return api.put(`group/${newGroupInfo.id}`, newGroupInfo.group)
  },
  deleteGroup(id: string) {
    return api.delete(`group/${id}`)
  },
}

export const actionsApi = {
  workflowOnLoad(id: string) {
    return api.get(`/wf-executions/load/${id}`)
  },
  workflowOnStart(id: string) {
    return api.put(`wf-executions/step/start/${id}`)
  },
  workflowOnSubmit(submitInfo: { id: number, submitInfo: any }):
    Promise<{ renderStepId: string, wfExecutionState: JSON }> {
    return api.put(`wf-executions/step/submit/${submitInfo.id}`, { submitInfo: submitInfo.submitInfo })
  },
  // workflowOnComplete(completeInfo: { id: string, completeInfo: any }) {
  //   return api.put(`wf-executions/step/submit/${completeInfo.id}`, completeInfo.completeInfo)
  // },
  // workflowOnCustom() {
  //   return
  // }
}
