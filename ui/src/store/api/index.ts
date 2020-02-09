import axios from "axios";

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
  checkAnswer(answer: any) {
    return instance.post("answer", answer);
  },
  createWorkflow(workflow: any) {
    return instance.post("workflows", workflow);
  }
};
