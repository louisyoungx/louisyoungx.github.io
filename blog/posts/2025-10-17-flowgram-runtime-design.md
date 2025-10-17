---
layout: Post
title: FlowGram.AI Runtime Design
subtitle: DDD - Domain driven design
author: louisyoungx
date: 2025-10-17
useHeaderImage: true
headerImage: /img/in-post/2025-10-17/header.jpg
headerMask: rgb(14, 21, 5, .2)
permalinkPattern: /post/:year/:month/:day/:slug/
tags:
  - technology
  - chinese
  - workflow
  - dag
  - canvas
  - javascript
---

FlowGram 运行时设计

<!-- more -->

# FlowGram 运行时设计

阅读本文需要对 FlowGram.AI 工作流框架有一定了解
- 官网：[https://flowgram.ai](https://flowgram.ai)
- GitHub：[https://github.com/bytedance/flowgram.ai](https://github.com/bytedance/flowgram.ai)

本文只关注如何设计运行时，不关注具体 API 和工程实现，如有需要请查阅：
- 运行时 API 文档：[https://flowgram.ai/guide/runtime/introduction.html](https://flowgram.ai/guide/runtime/introduction.html)
- 运行时示例代码：[https://github.com/bytedance/flowgram.ai/tree/main/packages/runtime/js-core](https://github.com/bytedance/flowgram.ai/tree/main/packages/runtime/js-core)

## 运行时介绍

### **What** - 什么是 FlowGram 运行时？

FlowGram 运行时是一个 “工作流运行时引擎” 的参考实现，与自由布局最佳实践 [Free Layout Demo](https://flowgram.ai/examples/free-layout/free-feature-overview.html) 配套使用，用于解析与执行基于图结构的工作流，内置支持开始节点 `Start`、结束节点 `End`、大模型节点 `LLM`、分支节点 `Condition`、循环节点 `Loop` 等多种节点类型。

当前 FlowGram 运行时定位为 Demo（非 SDK），主要目标是提供运行时的设计与实现参考，帮助开发者学习、修改并扩展以满足自有业务场景。

![Runtime demo](/img/in-post/2025-10-17/runtime-demo.gif)

### **Why** - 为什么要做 FlowGram 运行时？

FlowGram 的工作流编排功能非常强大，但有很多开发者深入使用后发现，他们找不到任何关于如何将工作流运行起来的示例或者教程。项目开源早期有很多 issue 反馈了这个难题，交流群也有很多这类讨论。

运行时诉求相关 issues：
- [\[Github issue\] Can a runnable demo be added?](https://github.com/bytedance/flowgram.ai/issues/56)
- [\[Github issue\] flowgram 编排结果如何转化成 python 可执行对象](https://github.com/bytedance/flowgram.ai/issues/206)
- [\[Github issue\] 请问扣子调试那块代码可以开放吗。](https://github.com/bytedance/flowgram.ai/issues/219)
- [\[Github issue\]如何实现节点的业务逻辑，目前官方的示例和文档都侧重在节点创建与展示方面，运行时的业务逻辑如何实现的教程都没有](https://github.com/bytedance/flowgram.ai/issues/276)
- [\[Github issue\] RuntimeService 文档补充，期望补充最佳实践](https://github.com/bytedance/flowgram.ai/issues/379)
- [\[Github issue\] 期望测试试运行的最佳实践能够增加mock看有mock数据，并且补充一下runtime-plugins的说明文档](https://github.com/bytedance/flowgram.ai/issues/385)

> 常见问题：
>
> **Q：为什么选择 TypeScript 版本作为首个运行时 Demo，而非 Python / Go？**
> A：TypeScript 实现的运行时可在浏览器运行。由于我们的官方文档 / Demo 是 Serverless 方式部署的，想要让用户直接能看到运行的效果，就需要让运行时能直接跑在浏览器中。虽然可以用 WASM 这类方式来让 Golang 运行在浏览器，但最简单的方式还是直接用 JavaScript 实现运行时。
>
> **Q：为什么没有使用 Eino 框架？**
> A：后续规划中的 Go 版本运行时 Demo 我们会使用 Eino 框架 + Hertz 框架实现，目前 TypeScript 版本运行时在内部集成了 LangChain JS 库作为替代。
>
> **Q：为什么运行时不基于 [Coze Workflow Backend](https://github.com/coze-dev/coze-studio/tree/main/backend) 进行修改？**
> A：简而言之，Coze 运行时是精装修房，而 FlowGram 运行时是毛坯房。Coze 运行时适合那些基于 Coze 小修小改的项目，FlowGram 运行时适合对自定义程度要求很高的业务。
>
> 在 FlowGram 运行时刚启动的阶段，我尝试用 Coze Backend “裁剪” 出一个可运行最简工作流的程序，在摸索尝试几天之后我放弃了，因为 Coze 工作流深度集成在 Coze 平台中，想要从中将最简的工作流执行引擎 “裁剪” 出来，比重新实现一个运行时的工作量更大，并且过程中需要伴随非常多不可逆的改动，后续不能跟随 Coze 的版本进行迭代，会有质量风险。

### **How** - 实现 FlowGram 运行时的基本思路。

工作流 `Workflow` 是由节点 `Node` 与边 `Edge` 构成的有向图，描述任务的执行顺序与数据/控制流。工作流数据 `Schema` 以 JSON 形式呈现，无论是工作流的数据持久化还是执行，都以此为载体。

下方是一个简化的工作流 Schema JSON，展示 `Start → LLM → End` 的基本结构与数据流，可以让我们对 Schema 有一个初步的了解。

节点 `Node` 是基本执行单元，类型包括 `Start`、`End`、`LLM`、`Condition`、`Loop` 等，每个节点拥有各自的配置和行为。

边 `Edge` 表示节点之间的连接关系与数据/控制流的传递方向，决定执行路径与数据流向。

```json
{
  "nodes": [
    { "id": "start", "type": "Start", "data": { "input": "Hello FlowGram" } },
    { "id": "llm", "type": "LLM", "data": { "systemPrompt": "You are assistant", "userPrompt": "{{start.input}}" } },
    { "id": "end", "type": "End", "data": {} }
  ],
  "edges": [
    { "sourceNodeID": "start", "targetNodeID": "llm" },
    { "sourceNodeID": "llm", "targetNodeID": "end" }
  ]
}
```

因此工作流运行时的基本思路是

1. 校验：检查 `Schema` 格式是否符合规范。
2. 建模：解析工作流 `Schema`，对工作流进行建模。使用遍历 `Schema` 依次构建节点和线条的模型。
3. 运行：从开始节点 `Start` 开始，根据边的连接关系找到下一个节点。调用节点执行器，传入输入和执行上下文，返回输出。执行过程中，根据节点类型的不同，可能会有条件判断、循环迭代等控制流程。当到达结束节点 `End` 时，工作流执行完成。

## 使用 DDD 设计运行时

> 在字节内部的 3DHub 平台了解更多 DDD 的知识：https://3dhub.bytedance.net

领域驱动设计 DDD (Domain-Driven Design) 是在处理复杂业务时常用的一种思想和方法论，不是一种架构。

### Step.0 什么是 DDD？

**核心概念：**

- 领域 `Domain`：独立的业务模块，常用于作为部署最小单位。本文中 FlowGram 运行时是一整个领域，在实践中也建议与其他业务代码在领域层面进行隔离
- 实体 `Entity`：带有唯一身份标识 ID，具有生命周期，可封装业务逻辑，数据可进行更新
- 值对象 `Value Object`：数据不可变，由数据本身作为其标识
- 限界上下文 `Bounded Context`（BC）：语义边界，在代码组织中可以表示为一个目录名称，也可以不做表示
- 聚合根 `Aggregate`：一堆实体和值对象所在的容器，具有生命周期，可封装业务逻辑
- 领域服务 `Domain Service`：无法归属于具体实体，属于领域内的业务逻辑，通常是无状态的
- 领域事件 `Domain Event`：记录领域中发生的具有业务意义的事件，如任务创建、节点开始执行、结束执行等，可通过其他领域服务进行监听，或通过事件总线传递到其他域
- 仓储 `Repository`：聚合的持久化抽象

**标准流程：**

1. 明确领域范围与业务目标
2. 进行事件风暴讨论
3. 建立统一语言（Ubiquitous Language）
4. 识别聚合、实体、值对象
5. 划分限界上下文并定义上下文映射关系
6. 定义领域服务与领域事件
7. 明确仓储
8. 形成领域内的整体设计

**结合架构：**

DDD 在落地过程中可根据场景选择合适的架构。FlowGram 运行时 Demo 是分层架构 `Layered`，从外向内依次是接口层 `API`，应用层 `Application`，领域层 `Domain`，所有层共用基础层 `Infrastructure`；节点注册部分可以重构为六边形架构 `Hexagonal` 以强化对外拓展能力；试运行部分可以使用 `CQRS` 架构进行读写分离；项目部署可以使用微服务架构 `MicroServices`。具体架构取决于场景和工程实践。

**使用** **DDD** **设计 FlowGram 运行时**

在了解 DDD 之后，接下来我们将使用 DDD 来设计 FlowGram 运行时。

### Step.1 确定领域范围与目标

解释并执行 Workflow Schema 这个 JSON 文件，通过一个输入值获取一个输出值，并完整记录下运行过程中节点状态（输入/输出/状态/时序）。

### Step.2 进行事件风暴

> 在白板上想到什么就写什么，不用在意逻辑关系

- 用户编辑工作流会保存为 **Schema**，其中包含节点 **Node**、线条 **Edge**、端口 **Port** 数据。
- 通过 Schema 与任务输入 **WorkflowInputs** 触发一次任务 **Task** 运行。
- 任务运行结束后会产生任务输出 **WorkflowOutputs**。
- 任务开始运行，需要先进行工作流建模 **Modeling**，对 Schema 和任务输入进行校验 **Validation**，需要使用编译器 **Compiler** 将 Schema 编译为文档数据模型 **Document**。
- 建模后需要通过运行时引擎 **Engine** 进行执行，需要有容器存储任务输入 **IOAggregate**。
- 执行具体节点时需要根据其类型从 IoC 容器 **Container** 中找到具体的节点执行器 **Executor**。
- 节点执行的入参为节点输入 **NodeInputs**，节点输入的生成需要解析值绑定 **ValueBinding** 来从运行上下文 **ExecutionContext** 中的变量作用域链 **VariableScopeChain** 中获取到变量 **Variable**。
- 用户可以通过任务查询到工作流运行的报告 **Report**，报告中包含任务状态 **TaskStatus**，节点状态 **NodeStatus**，节点数据的快照 **Snapshot**。
- 节点执行完成后会返回节点输出 **NodeOutputs** 与可选的下一个分支 **branch**，引擎拿到节点输出后将其解析为节点变量保存入变量作用域中，更新节点状态，并更新节点快照。
- 如果 Schema 校验出错，变量解析错误，或者节点运行失败，都需要生成一条错误消息 **Message**。

### Step.3 确立统一语言

> 提取出事件中的名词并明确概念，确保交流沟通、代码实现、技术文档中的用词一致

- ModelingContext 建模上下文
- ExecutionContext 执行上下文
- Schema 工作流图
- Container IoC容器
- Engine 运行时引擎
- Compiler 编译服务
- Validation 校验服务
- Executor 执行服务
- Node 节点
- Edge 边
- Port 端口
- Document 文档模型
- Task 单次运行任务
- WorkflowInputs 运行输入
- WorkflowOutputs 运行输出
- IOAggregate 输入输出集合
- IORepository 输入输出持久化
- Variable 变量
- VariableScope 变量作用域
- ValueBinding 值绑定
- Snapshot 快照
- SnapshotAggregate 快照集合
- SnapshotRepository 快照持久化
- Status 运行状态
- StatusAggregate 状态集合
- StatusRepository 状态持久化
- Message 消息
- MessageAggregate 消息集合
- MessageRepository 消息持久化
- Report 任务报告
- Reporter 报告生成

### Step.4 聚合/实体/值对象划分

- 实体：Node, Edge, Port, Variable, Snapshot, Status
- 值对象：Schema, WorkflowInputs, WorkflowOutputs, ValueBinding, Message, Report
- 聚合根：Document, Task, IOAggregate, VariableScope, SnapshotAggregate, StatusAggregate, MessageAggregate

![聚合/实体/值对象划分](/img/in-post/2025-10-17/aggregate.png)

### Step.5 限界上下文划分

- Workflow Modeling BC
  - 实体：Node, Edge, Port
  - 值对象：Schema, WorkflowInputs, WorkflowOutputs
  - 聚合根：Document
- Workflow Execution BC
  - 实体：Variable, Snapshot, Status
  - 值对象：ValueBinding, Message, Report
  - 聚合根：Task, IOAggregate, VariableScope, SnapshotAggregate, StatusAggregate, MessageAggregate

![限界上下文划分](/img/in-post/2025-10-17/bounded-context.png)

### Step.6 领域服务划分，确立领域事件

领域服务：Container, Engine, Compiler, Validation, Executor, Reporter
领域事件：
1. Validating 触发校验
2. Validated 完成校验
3. ValidationFailed 校验失败
4. Compiling 触发编译
5. Compiled 完成编译
6. CompileFailed 编译失败
7. Invoking 触发引擎运行
8. Invoked 引擎完成运行
9. InvokeFailed 引擎执行失败
10. Executing 触发节点执行
11. Executed 完成节点执行
12. ExecutionFailed 节点执行失败

### Step.7 仓储划分

找出需要持久化的聚合，划分对应的仓储。

需要注意在结合架构落地代码时领域层 `Domain` 应该只依赖仓储的接口，仓储具体代码实现应放到基础层 `Infrastructure`，通过这种方式确保作为业务核心逻辑的领域层不依赖任何其他层，从而保证其代码的纯粹性。

仓储：IORepository, SnapshotRepository, StatusRepository, MessageRepository

## 运行时整体设计

在上一节中，我们识别了工作流运行时领域内的实体、值对象、聚合根，并划分出了两个限界上下文，并划分了领域服务和仓储，确立了领域事件。接下来可以使用以上概念进行整体设计。

### 统一语言

| 变量名             | 名称           | 类型       | 概念                                                                                                                                       |
| :----------------- | :------------- | :--------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| ModelingContext    | 建模上下文     | 限界上下文 | 校验并解析工作流 Schema，建立工作流文档模型                                                                                                |
| ExecutionContext   | 执行上下文     | 限界上下文 | 执行工作流，维护任务状态、记录节点执行信息等                                                                                               |
| Container          | IoC 容器       | 领域服务   | 包含所有领域服务                                                                                                                           |
| Engine             | 运行时引擎     | 领域服务   | 核心服务，定义工作流运行逻辑                                                                                                               |
| Compiler           | 编译服务       | 领域服务   | 解析 Schema，对节点、线条、端口进行建模                                                                                                    |
| Validation         | 校验服务       | 领域服务   | 校验 Schema 结构和约束                                                                                                                     |
| Executor           | 节点执行服务   | 领域服务   | 可注册节点执行器，根据节点类型，调用对应的执行器，执行节点逻辑                                                                             |
| Reporter           | 报告生成       | 领域服务   | 可生成任务报告                                                                                                                             |
| Document           | 文档模型       | 聚合根     | 可读取任务中节点、线条、端口数据                                                                                                           |
| Task               | 单次运行任务   | 聚合根     | 一次工作流运行实例，可获取到运行实例，运行上下文                                                                                           |
| IOAggregate        | 输入输出集合   | 聚合根     | 任务输入与任务输出的绑定与解析                                                                                                             |
| VariableScope      | 变量作用域     | 聚合根     | 包含作用域中所有变量的集合，可形成作用域链                                                                                                 |
| SnapshotAggregate  | 快照集合       | 聚合根     | 包含任务中所有快照                                                                                                                         |
| StatusAggregate    | 状态集合       | 聚合根     | 包含任务中所有状态                                                                                                                         |
| MessageAggregate   | 消息集合       | 聚合根     | 包含任务中所有消息                                                                                                                         |
| Node               | 节点           | 实体       | 图中的一个可执行或说明性元素，如 start、http、llm、condition、loop、group、comment、end。                                                  |
| Edge               | 线条           | 实体       | 连接两个节点并指明端口的有向边，决定控制流与数据流                                                                                         |
| Port               | 端口           | 实体       | 节点的输入/输出接口，定义值绑定与类型约束                                                                                                  |
| Variable           | 变量           | 实体       | 任务中可被赋值和引用的变量，用于存储和传递数据                                                                                             |
| Snapshot           | 快照           | 实体       | 记录节点输入、输出、表单数据、分支数据                                                                                                     |
| Status             | 运行状态       | 实体       | 任务或者节点的状态，包含开始时间、结束时间，类型有待执行 `pending`，执行中 `processing`，成功 `succeeded`，失败 `failed`，取消 `cancelled` |
| Schema             | DAG 图数据     | 值对象     | 由节点（Node）与边（Edge）构成，遵循 [Workflow Schema 协议](https://flowgram.ai/guide/runtime/schema.html) 中的结构与约束                  |
| WorkflowInputs     | 任务输入       | 值对象     | 工作流单次运行的输入值                                                                                                                     |
| WorkflowOutputs    | 任务输出       | 值对象     | 工作流单次运行产生的输出                                                                                                                   |
| ValueBinding       | 值绑定         | 值对象     | 有常量 `constant`，引用 `ref`，模版 `template` 三种形式                                                                                    |
| Message            | 消息           | 值对象     | 任务执行中产生的消息，类型包括日志 `log`，信息 `info`，调试 `debug`，错误 `error`，警告 `warning`                                          |
| Report             | 任务报告       | 值对象     | 根据查询生成的一次任务报告，包含当前任务状态、输入、输出、所有节点快照、所有消息                                                           |
| IORepository       | 输入输出持久化 | 仓储       | 存储和查询任务输入输出                                                                                                                     |
| SnapshotRepository | 快照持久化     | 仓储       | 存储和查询任务快照                                                                                                                         |
| StatusRepository   | 状态持久化     | 仓储       | 存储和查询任务状态                                                                                                                         |
| MessageRepository  | 消息持久化     | 仓储       | 存储和查询任务消息                                                                                                                         |

### 架构图

![架构图](/img/in-post/2025-10-17/architecture.png)

### 依赖关系

![依赖关系](/img/in-post/2025-10-17/dependency.jpg)

### 执行流程

将编译后的工作流文档按节点与边的拓扑顺序执行，并在任务级别维护变量、绑定、状态、快照与消息。

![执行流程](/img/in-post/2025-10-17/execution.jpg)

**总体阶段**

1. 编译：将工作流定义编译为运行时文档（Nodes/Edges/Ports、Schema、IO 绑定规则），构建可执行图
2. 校验：按 Schema 做结构与类型校验（required、properties、连接合法性）
3. 执行：创建 Task（VariableScope、IOAggregate、SnapshotAggregate、StatusAggregate、MessageAggregate），按拓扑调度节点
4. 收尾与报告：合并状态、快照、输入输出，生成 Report，由 Reporter 导出

**任务初始化**

- 变量作用域 VariableScope：保存全局变量与各迭代的局部变量（locals）
- IOAggregate：维护输入/输出及 ValueBinding 规则（constant/ref/template/expression）
- 状态与快照：每个节点的开始/成功/失败状态；记录输入、输出与变量的快照；消息用于日志与错误说明。

**调度与执行准则**

- 从起始节点开始，沿边推进至下游节点；就绪节点可并行执行（无数据/控制依赖时）
- 每次执行节点时：
  - 解析输入绑定（见绑定解析）
  - 调用节点实现（如 LLM、条件、循环控制等）
  - 写回输出到变量作用域与 IOAggregate
  - 更新状态、快照与消息
  - 将下游节点标记为就绪（满足其输入依赖）

**解析值绑定（ValueBinding）**

- constant：直接常量值
- ref：引用作用域或其他节点的输出，如引用起始节点的 questions 或某节点的 result
- template：字符串模板，支持 {{path}} 插值，例如使用循环局部变量 index、item 组装提示词；

**循环与条件控制**

- 循环节点：对输入集合逐项迭代，Engine 为每次迭代建立 locals（index、item），并与全局作用域隔离
- 条件节点：按多分支条件求值，命中分支后沿对应端口（if_xxx）继续执行
- continue 节点：跳过当前迭代的剩余节点，进入下一项
- break 节点：提前终止循环，直接结束循环块
- 块起止（block-start/block-end）：标记子流程边界，用于收敛本轮迭代的输出

**状态、快照与消息**

- 每个节点都会记录：开始（running）、成功（succeeded）或失败（failed）等状态
- 快照包含输入、输出与关键变量的截面，便于审计与重放
- 消息用于记录执行日志与异常

**执行示例**

![执行示例](/img/in-post/2025-10-17/execution-example.png)

1. Start 节点产生输出 questions，作为后续循环的迭代输入
2. 调度进入 Loop，Engine 逐项迭代并建立 locals（index, item）
3. 条件判断：
  - 当 index <= 2：命中 continue，跳过本轮
  - 当 index > 6：命中 break，提前结束循环
  - 其他情况：进入 LLM 节点
4. LLM 节点：解析常量型参数（模型名、API 主机、温度等），模板型参数引用 locals（index, item）合成提示词，执行后产出 result
5. 循环输出聚合：将每次有效迭代的 result 收集为 results
6. End 节点：接收来自 Loop 的 results 作为最终输出，任务收尾并生成报告

