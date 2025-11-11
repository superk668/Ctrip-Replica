This is a step by step guide to help you build the Ctrip project from scratch by applying the multi-agent workflow. The prompt for each agent is given in the dev_log/agent_prompt directory.

** IMPORTANT NOTE**: Given that TRAE no longer support claude models, and that GPT-5-high sometimes have issues in instruction following, it is recommended to keep an eye on the model you use.

## Step 1: UI replication
Apply **Web Constructor** with the given prompt. Input the screenshot of the UI to be replicated, and also it is recommended to add another screenshot of the core area to ensure the main elements are accurately replicated. 

The page should be added to frontend/src directory. You can run the following command to start the frontend server:
```
cd frontend
npm run dev
```

**DEV TODO**: improve the prompt to improve the zero-shot replication performance.

Suggestion: 
You may implement the reusable components first (which will be stored in frontend/src/components directory) and apply it to other pages to ensure the consistency of the bottom bar.

## Step 2: Requirement Formulation
You may use existing requirement documents, or formulate your own requirements by applying the **Requirement Generator** whose prompt has been given. All requirements should be stored in dev_log/requirement.md.

**Suggestion**: It is recommended to apply Gemini-2.5-Pro to generate the requirement document.

To ensure the edge cases are covered, it is STRONGLY RECOMMENDED to manually polish the requirement document.

**DEV TODO**: find a systematic way to include all cases in the requirement document, based on the interaction of flow and the traversal of the UI.

**Suggestion**: You may read requirements/login_register_requirement.md as a reference.

## Step 3: Interface Design
Apply **Interface Designer** with the given prompt. Input the requirement document to be designed. The designed interface should be stored in .artifacts.

**Suggestion**: It is recommended to apply Gemini-2.5-Pro to design the interface.


## Step 4: Test Generation
Apply **Test Generator** with the given prompt. Input the requirement document and the interface to be tested. The generated tests should be stored in frontend/test and backend/test directory.


## Step 5: Code Generation (zero-shot)
Apply **Developer** with the given prompt. Input the requirement document, the interface to be implemented and the already implemented UI part. The generated code should be stored in frontend/src and backend directory.

**Suggestion**: It is recommended to apply GPT-5-high to generate the code.

## Step 6: Trial and Error
Apply **Test Runner** with the given prompt. The agent should be able to iteratively run the tests, read the output and then modify the code accordingly, until all tests pass.

**Suggestion**: It is REQUIRED to apply GPT-5-high to generate the code.

## Step 7: Manual Modification
After the trial and error process, you may manually modify the code to ensure the correctness of the implementation. 

**Problem**:
    以下请记录你在具体实现过程中，在agent进行自我迭代后，仍然遇到的问题，以及你对于通过回退，修改prompt使得能够实现直接生成正确代码的尝试。

## Step 7: Assemble the pages
**TODO**: design a agent to assemble the pages. This is not implemented for now, as there are not many finished pages yet.

