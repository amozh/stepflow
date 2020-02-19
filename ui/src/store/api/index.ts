import axios from "axios";
import { CreateWorkflowDto } from '@stepflow/shared';
import { AnswerDto } from '@stepflow/shared';

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
