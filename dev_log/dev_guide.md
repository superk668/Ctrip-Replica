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

问题及建议：
    1. 不建议ai使用gemini，他的性能比较差，容易生成大量报错，而且会进入思考死循环
    2. 我大概能明白当前工作流的意思，但是在实际操作中存在很多问题，先生成的UI界面，在后续的工作流中，agent基本都不会考虑，比如我遇到了这样的情况，UI界面生成的十分完美，后续工作流一切正常，测试样例也全通过，但是在实际的页面中，UI界面仍然是静态的，要求ai解决这个问题发现，原来ai是设计了另一套完全不一样的前端接口，完全没有考虑目前UI界面的情况。所以后来我试着改了下agent的prompt，让他结合UI生成接口这些什么的（但这只是个尝试，因为我不清楚全都改动是否会对之前生成的代码产生影响，但是只改一个agent还是没什么用，后续如果要改进建议在每个agent中提及一下），不过目前这个想法我是支持的，先生成UI界面，这样避免了之前会出现的很多抽象问题
    3. 所以我目前的建议是，想出一套可行的方法，围绕UI集成，比如根据最先的UI生成需求、接口、测试等等，因为这些是实实在在可控的，而且最容易得到反馈，所以后续的建议就是考虑改进prompt，让ai加强UI意识；或者可以进一步规范化，比如对UI界面的代码进行规范化，让需求文档和接口描述贴近规范化的UI进行生成，后端也可以为UI服务。
    4. gpt5功能确实强，基本不会生成什么带有报错的东西，所以test_runner我还没用过，但是指令遵循确实是一个毛病，我估计前面我改prompt效果不明显跟这个可能有关，因为 我并没有大刀阔斧很规范的在prompt中提及UI意识，所以以gpt的惯性，它大概率是遗忘了的。