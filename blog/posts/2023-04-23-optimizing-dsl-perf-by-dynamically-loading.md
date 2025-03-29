---
layout: Post
title: Optimizing DSL performance by dynamically loading
subtitle: Optimizing the loading speed of large no-code applications
author: louisyoungx
date: 2023-04-23
useHeaderImage: true
headerImage: /img/in-post/2023-04-23/header.jpg
headerMask: rgb(14, 21, 5, .2)
permalinkPattern: /post/:year/:month/:day/:slug/
tags:
  - technology
  - chinese
  - builder
  - dsl
  - react.js
  - javascript
---

通过导航动态加载 DSL 性能优化

<!-- more -->

# 通过导航动态加载 DSL 性能优化

## 1. 概述

### 1.1  简介

在大型无代码应用中，DSL 体积较大是常见的问题。为了提高页面的性能和加载速度需要对 DSL 进行拆分。

DSL 拆分是指将大型 DSL 拆分为小的 DSL 片段，并将其分别存储在缓存中，并页面加载期间动态获取部分片段。

当一个无代码页面由多个子页面组成时，只有需要渲染的子页面以及其父级节点的 DSL 片段会在运行时渲染，其余 DSL 片段则用户点击对应子页面后进行懒加载。

运行时 DSL 拆分技术是一种可行的解决方案。通过将 DSL 拆分为多个片段，可以根据需要动态加载并渲染页面的部分内容，从而提高页面的加载速度和性能。

![DSL Tree](/img/in-post/2023-04-23/dsl-tree.png)

### 1.2 需解决的问题

在大型无代码应用中，有以下问题是运行时 DSL 体积过大带来的：

- **请求响应时间过长**：大型 DSL 会包含大量的数据，因此会导致请求和响应的时间变长。
- **处理时长过久，内存占用过高**：解析和处理大型 DSL 可能需要处理很长时间并消耗大量的内存，会导致低配电脑出现崩溃和长时间卡顿。
- **性能下降**：在处理大型 DSL 时，由于数据量大，会导致性能下降，影响用户体验。

### 1.3 专业名词

| 名词             | **解释**                                             |
| ---------------- | ---------------------------------------------------- |
| DSL 主体片段     | 从根节点到叶子导航节点的完整链路，不包含未加载节点。 |
| DSL 片段         | 以导航单位，将 DSL 切片。                            |
| DSL 前序路径索引 | 记录该导航片段的父级导航 ID 与后继导航 ID。          |
| DSL 前序路径     | 指定一个节点，用于生成从根节点到叶子结点的唯一路径。 |

### 1.4 功能点

| **功能点**       | **描述**                                                     |
| ---------------- | ------------------------------------------------------------ |
| DSL 拆分         | 在页面运行时根据导航层级关系将 DSL 拆分成片段，仅返回当前页面及其父级页面的 DSL 片段 |
| DSL 片段异步加载 | 除当前页面及其父级页面的 DSL 片段外，其余片段在用户点击后懒加载，减小首屏 DSL 请求体积，加快首屏渲染速度 |

### 1.5 预期收益

DSL 拆分的目的是将一个大型页面的 DSL 按照子页面的粒度进行拆分，使得在页面加载时只需加载当前子页面所需要的 DSL 片段，减小首屏 DSL 请求体积，加快首屏渲染速度。

DSL 拆分的优势包括：

- **减小首屏 DSL 请求体积**：通过将大型页面的 DSL 按照导航维度子页面进行拆分，可以减小页面加载时的 DSL 请求体积，加快首屏渲染速度，提升用户体验。
- **精细控制页面加载**：只加载当前子页面所需要的 DSL 片段，减小带宽消耗。
- **提升页面渲染速度**：通过减小页面加载时的 DSL 请求体积和控制页面的加载，可以提升页面的渲染速度，加快页面的交互响应速度，提升用户体验。

### 1.6 运行流程

DSL 拆分的实现主要包括以下几个步骤：

1. **DSL 切片**：将整体 DSL 以导航页为单位拆分为小的 DSL 片段。
2. **存储 DSL 片段**：将 DSL 片段存储在缓存中，在后续的页面加载期间使用。
3. **记录 DSL 片段路径**：在缓存中记录每个 DSL 片段节点的前序路径，从当前节点指向前驱与后继节点。
4. **生成完整路径**：根据页面内子页之间的前序路径记录生成完整的 DSL 路径，获取从根节点到叶子节点的唯一路径。
5. **拼接 DSL 主体片段**：根据完整的 DSL 路径，拼接出完整的 DSL 片段，并返回给前端。
6. **拼接 DSL 片段**：用户点击导航页触发子页面懒加载，此时动态拿取 DSL 片段并合并到 DSL 主体上。

> 在示意图中，对于Nav3导航节点：
>
>
> 前驱：`Root`节点
>
> 后继：`Nav3.1`节点
>
> DSL主体：`Root -> Nav3 -> Nav3.1`
>
> 可拼接的DSL片段：`[Nav1, Nav2, Nav1.1, Nav1.2]`
>

![Page Navigation](/img/in-post/2023-04-23/page-nav.png)

### 1.7 潜在影响

- 运行时 DSL 解析只解析一部分
- 导航切换时动态加载 DSL 片段
- 子页面之间相互引用组件值在运行时无法加载

## 2. 技术实现

### 2.1 DSL 拆分成片段

DSL 片段的存储方式可以采用一个包含多个键值对的对象进行存储，每个键值对都是一个子页面的 DSL 片段。

在存储（缓存）内，DSL 片段被保存在一个名为 `PageDSLStore` 的对象中，其中键是子页面的 ID，值是子页面的 DSL 片段。

同时，还可以通过记录前序路径索引来生成从根节点到叶子节点的唯一路径，便于后续生成 DSL 主体。

下图是 DSL 拆分的示意图，可以看出，整个页面的 DSL 被分割成多个片段，其中包括了整个页面的 DSL、导航组件的 DSL 以及各个子页面的 DSL 片段。每个子页面的 DSL 片段都被存储在 `PageDSLStore` 对象中。

存储（缓存）内将 DSL 拆分为片段

```tsx
/** 子页面ID */
type SubPageId = string
/** 子页面DSL片段 */
type DSLSnippet = DSLNode
/** 子页面存储 */
type PageDSLStore = Record<SubPageId, DSLNode>

// 存储（缓存）内
const subPageSplitStore: PageDSLStore = {
  Root: {...},
  Nav_1: {...},
  Nav_1_1: {...},
  Nav_1_2: {...},
  Nav_2: {...},
  Nav_3: {...},
  Nav_3_1: {...},
  Nav_3_2: {...},
}

```

![DSL Cache](/img/in-post/2023-04-23/dsl-cache.png)

### 2.2 片段存储与子页清空处理

> 在 Demo 中的处理方式非常 Hack，需要把children中的内容替换为一个 div 作为占位符，在这个 div 的 props 有一个占位字符串来标记所属导航页 ID，这是因为不采用 div 直接替换成占位字符串会页面直接显示出字符串内容。
>

这是一个最简单的导航页场景，每个导航子页都带有一个 `SimpleText` 组件，导航页1的内容是 `Nav.1` 以此类推。

- 导航页1：`Nav.1`
- 导航页2：`Nav.2`
- 导航页3：`Nav.3`

处理方式是直接清空导航子页的 `children` 字段。

### 2.3 生成前序路径索引

在 DSL 拆分方案中，为了能够快速生成指定子页面的 DSL 片段，需要使用前序路径索引。前序路径是指从根节点到叶子节点的路径，用于表示页面中的节点层次关系。而前序路径索引则是在存储（缓存）中记录子页面之间的前序路径信息，用于生成从根节点到叶子结点的唯一路径。

```tsx
/** 子页面前后节点信息 */
interface PathNode {
  prev?: SubPageId,
  next?: SubPageId
}
/** 子页面的前序路径 */
type PreOrderPath = Record<SubPageId, PathNode>

// 存储（缓存）内
const preOrderPath: PreOrderPath = {
  Root: {
    next: 'Nav_1',
  },
  Nav_1: {
    prev: 'Root',
    next: 'Nav_1_1',
  },
  Nav_1_1: {
    prev: 'Nav_1',
  },
  Nav_1_2: {
    prev: 'Nav_1',
  },
  Nav_2: {
    prev: 'Root',
  },
  Nav_3: {
    prev: 'Root',
    next: 'Nav_3_1',
  },
  Nav_3_1: {
    prev: 'Nav_3',
  },
  Nav_3_2: {
    prev: 'Nav_3',
  },
}

```

![Predecessor Path Index](/img/in-post/2023-04-23/pre-path-index.png)

### 2.4 DSL 主体片段渲染

> 与 Demo 处理方式保持一致
>

当用户首次访问页面时，需要根据当前定位到导航 ID 来生成根节点到叶子结点的 DSL 主体片段。过程包括：

1. 用户访问页面，从 URL 提取目标导航 ID，如没有指定导航则默认为 Root 节点。
2. 根据前序路径索引，从目标导航ID，向前找到根节点 Root，向后找到叶子结点ID。
3. 根据根节点到叶子结点的节点路径来生成 DSL 主体节点路径。
4. 根据 DSL 主体节点路径从根节点 DSL 片段往下不断拼接子节点 DSL 片段，生成 DSL 主体片段。
5. 将 DSL 主体片段交给运行时进行解析，生成组件并挂载到页面上。
- UML Source Code
  
    ```tsx
    @startuml
    
    actor 用户
    participant 基座
    participant 运行时
    participant DSL拆分工具
    database DSL存储
    
    autonumber
    
    用户 -> 基座: 访问页面
    基座 -> 基座: 提取目标导航ID
    基座 -> DSL拆分工具: 请求根节点DSL片段
    activate DSL拆分工具
    DSL拆分工具 -> DSL存储: 获取前序路径索引
    DSL拆分工具 -> DSL拆分工具: 生成DSL主体ID路径
    DSL拆分工具 -> DSL存储: 查询各节点DSL片段
    DSL拆分工具 -> DSL拆分工具: 拼接DSL主体片段
    DSL拆分工具 -> 基座: 返回根节点DSL片段
    deactivate
    基座 -> 运行时: 将DSL主体片段交给Runtime
    activate 运行时
    运行时 -> 运行时: 解析DSL生成组件并挂载
    deactivate
    
    @enduml
    ```
    

![Render UML](/img/in-post/2023-04-23/render-uml.png)

### 2.5 DSL 片段增量加载

> Demo中DSL拼接在前端实现，因此如果DSL拆分服务后续移到编译服务或UIService，将会需要维护两套DSL拼接逻辑，因此本次优化为统一由DSL拆分服务负责DSL拼接。
>
>
> 并且在Demo中，拼接片段由导航组件的hooks触发，在特定情况下会多次运行，且可能造成循环。
>

用户点击导航页触发导航切换时，需要动态请求这一导航页的DSL片段，并将DSL片段拼接到当前页面的DSL中。

![Incremental loading of DSL fragments](/img/in-post/2023-04-23/dsl-loading.png)

实现步骤如下：

1. 触发导航页切换。
2. 根据前序路径索引，生成目标导航页的 DSL 主体 ID 路径。
3. 过滤掉路径中已加载的节点，检查过滤后的节点是否为空。
4. 如果过滤后的节点不为空，则请求剩余节点的 DSL 片段。
5. 根据节点路径来生成 DSL 片段。
6. 调用运行时创建 `appendNode` API，传入将 DSL 片段与上级节点 ID。
- UML Source Code
  
    ```tsx
    @startuml
    
    actor 用户
    participant 运行时
    participant 业务层
    participant DSL拆分服务
    
    autonumber
    
    用户 -> 业务层: 触发导航页切换
    activate 业务层
    业务层 -> 业务层: 生成目标导航页DSL主体ID路径
    业务层 -> 业务层: 过滤已加载节点
    业务层 -> DSL拆分服务: 请求DSL片段
    activate DSL拆分服务
    DSL拆分服务 -> DSL拆分服务: 生成DSL片段
    DSL拆分服务 -> 业务层: 返回DSL片段
    deactivate DSL拆分服务
    业务层 -> 运行时: 调用appendNode API
    activate 运行时
    运行时 -> 运行时: 解析新添加节点的DSL，生成组件并挂载
    deactivate
    
    @enduml
    ```
    

![DSL Loading UML](/img/in-post/2023-04-23/dsl-loading-uml.png)

这里有个缓存逻辑，业务层会维护一个 `NodeCached` 来标记已经加载的节点

```tsx
type NodeCached = Record<FragmentId, boolean>
```

### 2.6 DSL拆分服务接口定义

```tsx
/** 页面 API 的唯一标识 */
type PageApiId = string

/** DSL片段 ID */
type FragmentId = string

/** 一段DSL片段 */
type DSLFragment = DSLElementNode | DSLElementNode[]

/**
 * FragmentInfo 记录 DSL 片段的信息
 */
type FragmentInfo = {
  /** 片段 ID */
  fragmentId: FragmentId
  /** 片段所属导航 ID */
  navId?: string
  /** 前驱节点的片段 ID */
  prev?: FragmentId
  /** 后继节点的片段 ID */
  next?: FragmentId
}

/**
 * PageDSLStore 存储页面的 DSL 数据结构
 */
interface PageDSLStore {
  /** 页面 API 的唯一标识 */
  pageApiId: PageApiId
  /** 页面的 DSL */
  dsl: PageDSL
  /** 存储 DSL 片段的 Map 对象 */
  fragments: Map<FragmentId, DSLFragment>
  /** 标记 DSL 节点的前驱与后继的 Map 对象 */
  fragmentLinkMap: Map<FragmentId, FragmentInfo>
}

/**
 * DSLFragmentService 提供操作 DSL 片段的服务
 */
export interface DSLFragmentService {
  /** 存储页面的 DSL */
  store: Map<PageApiId, PageDSLStore>
  /**
   * 创建页面的 DSL 存储对象
   * @param pageApiId - 页面 API 的唯一标识
   * @param dsl - 页面的 DSL
   * @returns - 页面的 DSL 存储对象
   */
  createStore(pageApiId: PageApiId, dsl: PageDSL): PageDSLStore
  /**
   * 提取指定页面的指定 lineage 对应的 DSL Fragment
   * @param pageApiId - 目标页面的API ID
   * @param lineage - 目标 DSL 片段在树形结构中的路径
   * @returns - 若链路上存在片段，则返回对应的 DSL Fragment；否则返回 undefined
   */
  lineageDSLFragment(
    pageApiId: PageApiId,
    lineage: FragmentId[],
  ): DSLFragment | void
  /**
   * 获取指定片段节点所在链路上的 DSL 主体片段
   * @param pageApiId - 页面 API 的唯一标识
   * @param fragmentId - 片段 ID
   * @returns dsl - DSL 主体片段
   * @returns lineage - 指定片段所在链路
   * @returns restFragment - 除了指定片段所在链路外的其他片段ID
   * @returns rootId - 根节点片段 ID
   */
  fragmentDSL(
    pageApiId: PageApiId,
    fragmentId: FragmentId,
  ): {
    dsl: PageDSL
    lineage: FragmentId[]
    restFragment: FragmentId[]
    rootId: FragmentId
  } | void
}

```

## 3. Q&A

> 常见问题、阅读阶段或者评审阶段现场提出的问题以及解答
>

### **Q：DSL拆分后，跨导航页引用组件变量怎么办？**

子页面可以相互引用内部所属组件属性，会有子页未加载导致被引用的组件值也不能被加载的问题。

- 短期方案不做处理
- 长期方案，希望能识别出子导航之间的依赖关系，同时加载这些子导航

![Cross-page variable references](/img/in-post/2023-04-23/cross-page-var.png)

### **Q：为什么索引不采用标注出节点每一条路径的方式**

A：「标注每一条路径」方式冗余数据多，而且不能识别出节点是否是叶子结点和根节点。

并且根节点比较特殊，经常会被用到，如果不采用「前序索引」需要额外一个常量来存储根节点ID。

**前序索引(*)**

存储空间复杂度：`o(n)`

生成时间复杂度：`o(n)`

查询时间复杂度：`o(n)`

```
const preOrderPath: PreOrderPath = {
  Root: {
    next: 'Nav_1',
  },
  Nav_1: {
    prev: 'Root',
    next: 'Nav_1_1',
  },
  Nav_1_1: {
    prev: 'Nav_1',
  },
  Nav_1_2: {
    prev: 'Nav_1',
  },
  Nav_2: {
    prev: 'Root',
  },
  Nav_3: {
    prev: 'Root',
    next: 'Nav_3_1',
  },
  Nav_3_1: {
    prev: 'Nav_3',
  },
  Nav_3_2: {
    prev: 'Nav_3',
  },
}

```

**标注每一条路径**

存储空间复杂度：`o(n^2)`

生成时间复杂度：`o(n)`

查询时间复杂度：`o(1)`

```
const nodePath: NodePath = {
  Root: ['Root', 'Nav_1', 'Nav_1_1'],
  Nav_1: ['Root', 'Nav_1', 'Nav_1_1'],
  Nav_1_1: ['Root', 'Nav_1', 'Nav_1_1'],
  Nav_1_2: ['Root', 'Nav_1', 'Nav_1_2'],
  Nav_2: ['Root', 'Nav_2'],
  Nav_3: ['Root', 'Nav_3', 'Nav_3_1'],
  Nav_3_1: ['Root', 'Nav_3', 'Nav_3_1'],
  Nav_3_2: ['Root', 'Nav_3', 'Nav_3_2'],
}

```

### **Q：DSL拆分后是存储在浏览器缓存中吗？**

A：在哪里拆分，缓存就在哪里

- 前端拆分：浏览器内存中
- DSL编译服务拆分：CDN / JS
- 后端拆分/设计器拆分：Redis / 数据库

最好是三种方案能相互兼容，互相兜底。
