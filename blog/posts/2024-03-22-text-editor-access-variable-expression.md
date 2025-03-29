---
layout: Post
title: Text editor access variable expression
subtitle: slate.js variable reference expression
author: louisyoungx
date: 2024-03-22
useHeaderImage: true
headerImage: /img/in-post/2024-03-22/header.jpg
headerMask: rgb(14, 21, 5, .2)
permalinkPattern: /post/:year/:month/:day/:slug/
tags:
  - technology
  - chinese
  - javascript
  - slate.js
---

文本编辑接入变量引用表达式

<!-- more -->

# 文本编辑接入变量引用表达式

## 1. 需求点
| 功能点                                        | 描述                                                         |
| --------------------------------------------- | ------------------------------------------------------------ |
| 输入 <span v-pre>`{{`</span> 时推荐可用变量                      | 下拉框中包含当前节点的输入值，以及输入值所引用变量的子集所构成的变量树 ![1-1](/img/in-post/2024-03-22/1-1.png) |
| 对于合法表达式展示蓝色高亮                    | key1 能在输入中找到，且其引用的变量子级中存在 Key12，则为合法![1-2](/img/in-post/2024-03-22/1-2.png) |
| 输入字符高亮，并过滤无关参数                  | 对变量树进行过滤，仅保留其中相关的变量节点 ![1-3](/img/in-post/2024-03-22/1-3.png) |
| 输入 `.` 后仅推荐其子变量                     | ![1-4](/img/in-post/2024-03-22/1-4.png)对变量树进行层级裁剪，仅保留已选中变量的子级变量树 |
| 光标返回前级 `.` 之后可以重新推荐其子级变量树 | 变量推荐仅关注光标之前的字符串，忽略光标后的字符串 ![1-5](/img/in-post/2024-03-22/1-5.png) |                                                             |

## 2. 名词解释

| 术语   | 描述                                                         |
| ------ | ------------------------------------------------------------ |
| Slate  | https://github.com/ianstormtaylor/slateSlate 是一个可定制的富文本编辑器框架。本需求底层编辑器基于 Slate 进行开发。 |
| AST    | AST，全称为抽象语法树（Abstract Syntax Tree），是源代码语法结构的一种树状抽象表示。它使用树状的结构来表达编程语言构造的层次关系，每个节点代表着源码中的一个结构元素。本需求中类似 <span v-pre>`{{``array[0].objectKey``}}`</span> 的文本会被解析成 AST 在系统内部流通。 |
| 变量树 | workflow 节点上下文中可被消费的变量所构成的一颗树，可被 UI 所描述 ![2-1](/img/in-post/2024-03-22/2-1.png) |

## 3. 整体设计

由于交互逻辑复杂，代码结构需要按照 MVVM 进行视图和逻辑分离
![3 Framework](/img/in-post/2024-03-22/framework.png)

### 3.1 编辑器模型 `EditorModel`

- 属性
  - `editor`： SlateEditor 示例
  - `variableTree`： 可选变量的树数据结构
  - `value`： 当前文本框内的值
- 方法
  - `on`： 监听指定事件
  - `emit`： 触发指定事件

```ts
interface IExpressionEditorModel {
  readonly editor: SlateEditor;
  variableTree: ExpressionEditorTreeNode[];
  value: ExpressionEditorLine[];
  on<T extends ExpressionEditorEvent>(
    event: T,
    callback: (params: ExpressionEditorEventParams<T>) => void,
  ): ExpressionExpressionEventDisposer;
  emit<T extends ExpressionEditorEvent>(
    event: T,
    params: ExpressionEditorEventParams<T>,
  ): void;
}
```

- 事件
  - `Change`： 值变更
  - `Select`： 光标变化
  - `Dispose`： 销毁

```ts
enum ExpressionEditorEvent {
  Change = 'change',
  Select = 'select',
  Dispose = 'dispose',
}

type ExpressionEditorEventParams<T extends ExpressionEditorEvent> = {
  [ExpressionEditorEvent.Change]: ExpressionEditorLine[];
  [ExpressionEditorEvent.Select]: {
    content: string;
    offset: number;
    path: number[];
  };
  [ExpressionEditorEvent.Dispose]: undefined;
}[T];
```

### 3.2 变量建议视图模型 `SuggestionViewModel`

- 属性
  - `model`： 编辑器模型
  - `playgroundConfig`： 画布配置（用于从中获取画布缩放率）
  - `ref`： 对 React 组件实例的引用
    - `container`： 容器组件
    - `suggestion`： 变量建议组件
    - `tree`： 变量树选择组件
  - `viewState`： 视图数据，控制 UI 表现
    - `visible`： 变量建议组件是否可见
    - `rect`： UI 容器内的相对坐标
- 方法
  - `selectNode`： 变量建议组件中选中变量节点
  - `dispose`： 组件销毁前卸载所有监听器

```ts
interface ISuggestionViewModel {
  readonly model: ExpressionEditorModel;
  readonly playgroundConfig: PlaygroundConfigEntity;
  readonly ref: {
    container: RefObject<HTMLDivElement>;
    suggestion: RefObject<HTMLDivElement>;
    tree: RefObject<Tree>;
  };
  viewState: {
    visible: boolean;
    rect?: {
      top: number;
      left: number;
    };
  };
  variableTree: ExpressionEditorTreeNode[];
  selectNode(node: ExpressionEditorTreeNode): void;
  dispose(): void;
}
```

### 3.3 AST 解析器 `ASTParser`

> 工具函数

- `serialize`： 序列化
- `deserialize`： 反序列化
- `parseLine`： 解析行数据
- `toAST`： 将可用内容解析为抽象语法树
- `splitText`： 将内容切分为片段
- `extractContent`： 从行内容中抽取可用内容

```ts
interface IExpressionEditorASTParser {
  serialize(value: ExpressionEditorLine[]): string;
  deserialize(text: string): ExpressionEditorLine[];
  parseLine(line: { lineContent: string; lineOffset: number }): {
    start: number;
    end: number;
    ast: ExpressionEditorASTNode[];
  };
  toAST(text: string): ExpressionEditorASTNode[];
  splitText(pathString: string): string[];
  extractContent(params: {
    lineContent: string;
    lineOffset: number;
  }): {
    inlineContent: string
    inlineOffset: number
  };
}
```

> AST 节点协议

- 对象键
- 数组索引
- 空

```ts
enum ExpressionEditorASTNodeType {
  ObjectKey = 'object_key',
  ArrayIndex = 'array_index',
  EndEmpty = 'end_empty',
}

type ExpressionEditorASTNode<
  T extends ExpressionEditorASTNodeType = ExpressionEditorASTNodeType,
> = {
  [ExpressionEditorASTNodeType.ObjectKey]: {
    type: ExpressionEditorASTNodeType.ObjectKey;
    index: number;
    objectKey: string;
  };
  [ExpressionEditorASTNodeType.ArrayIndex]: {
    type: ExpressionEditorASTNodeType.ArrayIndex;
    index: number;
    arrayIndex: number;
  };
  [ExpressionEditorASTNodeType.EndEmpty]: {
    type: ExpressionEditorASTNodeType.EndEmpty;
    index: number;
  };
}[T];
```

### 3.4 变量树解析工具 `TreeHelper`

> 工具函数

- `pruning`： 根据当前 AST 路径对完整的树进行剪枝，去除已经选中的层级
- `concatFullPath`： 根据指定变量树节点，计算出完整的变量路径
- `matchTreeBranch`： 根据完整 AST 和完整变量树，尝试找出一条和 AST 相匹配的树枝

```ts
interface IExpressionEditorTreeHelper {
  pruning(params: {
    tree: ExpressionEditorTreeNode[];
    ast: ExpressionEditorASTNode[];
  }): ExpressionEditorTreeNode[];
  concatFullPath(node: ExpressionEditorTreeNode): string;
  matchTreeBranch(params: {
    tree: ExpressionEditorTreeNode[];
    ast: ExpressionEditorASTNode[];
  }): ExpressionEditorTreeNode[] | undefined;
}
```

### 3.5 合法判断 `LineValidator`

> 工具函数

- `findPatterns`： 找出行文本中所有 <span v-pre>`{{}}`</span> 内容对
- `validate`： 根据行文本和变量树，找出其中合法与非法内容的坐标

```ts
export interface IExpressionEditorLineValidator {
  findPatterns(text: string): { start: number; end: number; content: string }[];
  validate(params: {
    lineText: string;
    tree: ExpressionEditorTreeNode[];
  }): {
    start: number;
    end: number;
    valid: boolean;
    message?: string;
  }[];
}
```

## 4. 详细方案

### 4.1 AST 解析

1. **获取开始与结束坐标**

Slate 编辑器的光标变化事件会提供两个信息：当前行文本，光标偏移量

进入计算前需要前置判断：当前偏移是否在开始标识 <span v-pre>`{{` 和结束标识 `}}`</span> 之间，如果不符合就不进入计算。

如果符合条件则获取开始和结束标识的坐标

> 当前行文本： <span v-pre>`输入{{key1.Asia}}`</span>
>
> 光标偏移量： `9`
>
> 开始坐标：`2`
>
> 结束坐标：`15`

![4-1](/img/in-post/2024-03-22/4-1.jpg)

2. **提取内容**

提取括号中内容，并将光标偏移量转换为基于内容的偏移量。

> 提取出内容：`key1.Asia`
>
> 内容偏移量：`5`

![4-2](/img/in-post/2024-03-22/4-2.jpg)

3. **拆分可用内容**

将内容前后空格丢弃，并根据偏移量拆分为可达内容与不可达内容。

- 可达内容，用于计算可用路径
- 不可达内容，直接丢弃

> 可达内容：`key1.`
>
> 不可达内容：`Asia`

![4-3](/img/in-post/2024-03-22/4-3.png)

4. **可达内容拆分**

判断可达内容格式是否合法，仅可包含大小写字母，下划线，合法分隔符。

并根据分隔符 `.` `[` `]`进行拆分。

> 可达内容：`key0.key1.key2[1].key3`
>
> 拆分后：`['key0', 'key1', 'key2', '[1]', 'key3']`

5. **路径转为** **AST**

遍历拆分后路径，对每个字符进行分类。

- 数组索引：以 `[` 开始，`]` 结束，且中间为整形数字的
- 空文本：位于最后一位的空字符串
- 对象键：仅能包含合法字符的字符串

> 当前行文本： <span v-pre>`输入{{China[0].Hangzhou.Xihu}}`</span>
>
> 光标偏移量： `21`
>
> 开始坐标：`2`
>
> 结束坐标：`27`
>
> 提取出内容：`China[0].Hangzhou.Xihu`
>
> 内容偏移量：`18`
>
> 可达内容：`China[0].Hangzhou.`
>
> 不可达内容：`Xihu`
>
> 拆分后：`['China', '[0]', 'Hangzhou', '']`
>
> 解析后 AST：
>
> ```ts
> [
> {
>  type: ExpressionEditorASTNodeType.ObjectKey,
>  index: 0,
>  objectKey: 'China',
> },
> {
>  type: ExpressionEditorASTNodeType.ArrayIndex,
>  index: 1,
>  arrayIndex: 0,
> },
> {
>  type: ExpressionEditorASTNodeType.ObjectKey,
>  index: 2,
>  objectKey: 'Hangzhou',
> },
> {
>  type: ExpressionEditorASTNodeType.EndEmpty,
>  index: 3,
> },
> ];
> ```

### 4.2 变量树解析

1. **节点输入**

使用表单 API 获取节点输入值

- `name`： 参数名
- `keyPath`： 引用变量的路径

> 示例节点输入：
>
> ```ts
> [
>  {
>      "name": "ref_obj",
>      "keyPath": [
>          "112561",
>          "G7wWtobsFtDK5iFuf42Ir"
>      ]
>  },
>  {
>      "name": "ref_arr_obj",
>      "keyPath": [
>          "112561",
>          "5l5ZLWh5Tpq9Xbxwl3Sco"
>      ]
>  }
> ]
> ```
>
> ![4-4](/img/in-post/2024-03-22/4-4.png)

2. **节点可引用变量**

通过业务共用 hooks `useNodeAvailableVariablesWithNode` 即可获取到节点上下文中所有可用变量

提取以下变量信息：

- `key`： 变量键
- `name`： 变量名
- `type`： 变量类型
- `children`： 子变量

> 示例：
>
> 这个 LLM 节点可用变量只有 Code 节点的输出
>
> ```ts
> [
>  {
>      "key": "G7wWtobsFtDK5iFuf42Ir",
>      "type": 6,
>      "name": "obj",
>      "children": [
>          {
>              "key": "eI2v6QODCVdt4I4hAzUCz",
>              "type": 1,
>              "name": "obj_str"
>          },
>          {
>              "key": "mActlo6staUc_0nZYdzOx",
>              "type": 4,
>              "name": "obj_num"
>          }
>      ],
>      "nodeTitle": "代码",
>      "nodeId": "112561"
>  },
>  {
>      "key": "5l5ZLWh5Tpq9Xbxwl3Sco",
>      "type": 103,
>      "name": "arr_obj",
>      "children": [
>          {
>              "key": "n4HTnsGzA12EXxlGfqaTU",
>              "type": 1,
>              "name": "arr_obj_str"
>          },
>          {
>              "key": "Ky2sSC0HsKIh-Mpiox5lC",
>              "type": 4,
>              "name": "arr_obj_num"
>          }
>      ],
>      "nodeTitle": "代码",
>      "nodeId": "112561"
>  }
> ]
> ```
>
> ![4-5](/img/in-post/2024-03-22/4-5.png)

3. **完整变量树**

对可用变量树的第一层级进行过滤，仅保留被节点输入所引用的变量及其子变量。

合并输入和过滤后变量树，构造出完整变量树

> 示例：
>
> 可用变量树                                       节点输入
>
> ![4-6](/img/in-post/2024-03-22/4-6.png)
>
> 完整变量树
> ![4-7](/img/in-post/2024-03-22/4-7.png)

4. **展示变量树**

当前 AST 可能包含已经选择的变量，需要提取出这些已选择变量的子集，作为展示变量树

> 示例：
>
> ![4-8](/img/in-post/2024-03-22/4-8.png)

5. **完整路径**

点击变量节点后计算出完整路径，计算方式是：

- 将被点击变量节点推入栈中
- 从被点击变量节点出发，向上不断寻找父级变量，所有父级变量均推入栈中
- 从栈中推出变量获取其名称，拼接到完整路径中

获取到完整路径后，根据 AST 中的开始和结束坐标，替换整个 <span v-pre>`{{表达式}}`</span>

> 示例：
>
> 点击 `obj_num` 节点
>
> ![4-9](/img/in-post/2024-03-22/4-9.png)

### 4.3 行内容合法判断

根据正则 <span v-pre>`/{{(.*?)}}/g`</span> 即可匹配文本中所有表达式，并且能同时获取到表达式的开始和结束坐标。

> 示例：
>
> 行文本：<span v-pre>`first {{foo1.bar1}} second {{foo2.bar2}}`</span>
>
> 1. 表达式：<span v-pre>`{{foo1.bar1}}`</span>，开始坐标：6，结束坐标：19
> 2. 表达式：<span v-pre>`{{foo2.bar2}}`</span>，开始坐标：27，结束坐标：40

1. **AST** **解析**

将匹配到的表达式进行 AST 解析，如果无结果即为非法表达式

1. **匹配变量树分支**

将解析得到的 AST 节点进行遍历，并按照顺序与对应层级的变量树进行匹配，如果每一层级均能匹配到变量，即为合法表达式。

> 示例：
>
> ![4-10](/img/in-post/2024-03-22/4-10.png)

