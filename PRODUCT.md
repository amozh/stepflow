# What is Stepflow
It is an application which is built around the concept of reusable "workflows".  
It allows to build and execute a process of almost any complexity.  

### Terms
* **Process** - some real life activity which needs to be automated. 
Simplest example is an exam for students with all it's restrictions and grades.
* **Workflow** - represents a definition of a process. From the implementation perspective it is a container 
for actions (steps) which defines general information about the process.
* **Workflow step** - represents an action or a logically independent part of the process - set of actions.
Each step has own *context* and *callbacks*. 
* **Step context** - think about it as a store (like Redux store) 
which can be accessed and modified by the step and all it's nested steps.
* **Callback** - javascript code which is executed on the backend at a specific stage a step execution.
Callback has access to the step's (and all parent steps) context and to integrations (like Email)

# Architecture
One of the real world examples:  
![Stepflow - New implementation](https://drive.google.com/file/d/1kAVc2h5-hsZT-P-QVfssdhyc7cN1vdOx/view?usp=sharing)  
[Original diagram](https://www.lucidchart.com/invitations/accept/60c54599-16e9-409a-b90b-fee93a08fa0e)

[Entities diagram](https://www.lucidchart.com/invitations/accept/28dc4f8f-3055-427f-92df-e6121c3804ee)

# MVP 1
* Create workflows with steps with context and callbacks
    * Step types
        * Test (question with multiple answer option where user should choose 1)
        * Input (allows user to enter some text)
        * Html template 
          (allows an author of a workflow to defined an html template which will be populated with values from context)
* Execute workflows with callbacks and context