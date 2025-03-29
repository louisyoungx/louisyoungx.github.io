---
layout: Post
title: Collect external resource references from DSL
subtitle: establish node-code reference relationship
author: louisyoungx
date: 2023-05-19
useHeaderImage: true
headerImage: /img/in-post/2023-05-19/header.jpg
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

通过 DSL 收集外部资源引用

<!-- more -->

# 通过 DSL 收集外部资源引用

## 1. 概述

无代码页面搭建器在搭建页面时，需要用到许多外部提供的资源，如元数据、流程、低代码、权限、openapi、外部数据源、其他页面、自定义组件等。因此需要将页面资源与其他外部资源建立引用关系，防止出现在未解除引用关系的情况下，资源被删除失效或资源被篡改属性导致页面无法按照预期进行渲染的情况。

在此方案中，将为页面搭建器设计一种相比目前更加全面的外部资源引用关系。目标是通过扩展引用收集模块的功能，使其能够提取更多关于外部资源引用的信息，从而更好地满足业务需求。

![External Resources](/img/in-post/2023-05-19/external-resources.png)



## 2. 思路

但随着无代码页面搭建器业务发展，逐渐面临以下几个难题：

1. **需要收集的外部资源类型多：** Data的元数据引用信息、低代码的自定义JS、ProCode的外部数据源信息、自定义组件信息、自定义的流程。
2. **外部资源引用信息的要求各不相同：** 几乎每一个业务都有特化，有些要求收集精确定位信息、有些要求标记所属子页面、有些要求需要带上数据的CRUD标记。
3. **组件自身的数据不全在DSL**：有部分在外置数据中，在遍历组件时需要不断去其他模块中取数据。
4. **一些Schema数据太过特化无法解析出引用数据**：一些特定DSL在没有开发者帮助的情况下是很难识别出其中引用的全部外部资源的。

针对以上问题，有两个解法思路：

1. 数据协议设计上对数据做分层
2. 数据生产方式上采用插件化的形式

## 3. 协议

> 数据协议设计上对数据做分层

![Data Protocol Layers](/img/in-post/2023-05-19/data-protocol-layers.png)

在外部引用收集模块需要产生以下格式的数据

**类型：**

```tsx
/** 领域模型数据 */
export interface DomainSpecificModel {
  /** 领域模型中的特定资源 */
  specificSources: ISpecificSource[]
  /** 领域模型中的领域特定Schema */
  specificSchemas: ISpecificSchema[]
}

/** 领域特定资源类型枚举 */
export enum SpecificSourceType {
  /** 对象 */
  Object = 'object',
  /** 对象字段 */
  ObjectField = 'field',
  /** 记录 */
  Record = 'record',
  /** 流程 */
  Workflow = 'workflow',
  /** 变量 */
  variable = 'variable',
  /** 页面 */
  Page = 'page',
  /** 无代码组件 */
  noCodeComponent = 'nocode_component',
  /** AI机器人 */
  AIAgent = 'ai_agent',
  /** 评论 */
  Comment = 'comment',
  /** 低代码：自定义HTML组件 */
  HtmlComponent = 'html_component',
  /** 低代码：自定义JS动作 */
  JSAction = 'js_action',
  /** 外部数据源 */
  datasource = 'datasource',
}

/** 领域特定资源 */
export interface ISpecificSource {
  /** 领域特定资源类型 */
  type: SpecificSourceType
  /** 领域特定资源标识符 */
  identification: ISpecificReferenceIdentification
  /** 领域辅助信息*/
  information?: ISpecificInformation
}

/** 领域特定资源标识符 */
export interface ISpecificReferenceIdentification {
  /** 资源唯一标识 */
  apiId: string
  /** （环境内）资源唯一标识 */
  id: number
  /** 关联标识 */
  relatedApiId?: {
    /** 目前只有field资源需要这一信息 */
    objectApiId?: string
  }
}

/** 领域特定Schema枚举 */
export enum SpecificSchemaType {
  /** 条件 */
  Condition = 'condition',
  /** 公式 */
  Formula = 'formula',
  /** 图表/报表 */
  Chart = 'chart',
}

/** 领域特定Schema */
export interface ISpecificSchema {
  /** 领域特定Schema类型 */
  type: SpecificSchemaType
  /** Schema结构不感知 */
  schema: unknown
  /** Schema关联的资源，可能无法提取 */
  relatedSources?: ISpecificSource[]
  /** 领域辅助信息*/
  information?: ISpecificInformation
}

/** 领域辅助信息 */
export interface ISpecificInformation {
  /** 定位器 */
  locator?: ISpecificLocator
  /** 子页面 */
  subPage?: ISpecificSubPage
  /** crud类型 */
  crud?: 'Create' | 'Read' | 'Update' | 'Delete'
  /** 在uidl中的JSONPath路径 */
  jsonPath?: string
  /** 展示名称 */
  displayName: I18n
}

/** 领域定位信息 */
export interface ISpecificLocator {
  /** 定位类型，结构跟着locatorType变 */
  locatorType: 'Component' | 'ComponentProperty'
  /** 所属组件ID */
  componentId: string
  /** 所属组件类型 */
  componentType: string
  /** 所属组件属性唯一标识 */
  propertyId: string
}

/** 领域子页面信息 */
export interface ISpecificSubPage {
  /** 子页面唯一Key */
  key: string
  /** 子页面组件ID */
  componentId: string
  /** 子页面所在导航组件ID */
  containerComponentId: string
  /** 子页面层级 */
  level: number
  /** 直接上级子页面Key */
  prev?: string
  /** 直接下级子页面Key */
  next?: string
  /** 同级所有子页面Key */
  sameLevelKeys: string[]
  /** 同级最高优先级子页面Key */
  topLevelKey: string
}

```

## 4. 模块

> 数据生产方式上采用插件化的形式

引用收集模块需要创建一个能够处理各种数据结构，资源引用的插件化和带有辅助信息生成遍历器。每一部分都作为一个独立的模块，可以方便测试和维护。同时模块化的设计可以提高代码的可读性和可扩展性。

![Framework](/img/in-post/2023-05-19/framework.png)

- UML Source Code

  ```bash
  @startuml
  
  interface IDomainTraverser {
      +traverse()
      +applyPlugins()
  }
  
  class TraversalContext {
    libs: Record<string, TraversalLib>
    specificSources: Array<ISpecificSource>
    specificSchemas: Array<ISpecificSchema>
    value: unknown
    key?: string | number | boolean
    index?: number
    container: Object | Array
    parent: TraversalContext
    depth: number
    information: { subpage, locator ... }
  }
  
  interface ICollectPlugin {
      -name: string
      -enableInfo?: Array<IInfoProvider>
      +isApplicable(): boolean
      +process(ctx)
  }
  
  interface IInfoProvider {
      -name: string
      +provide(ctx)
  }
  
  interface IPathFinder {
      -name: string
      +shouldEnter(): boolean
      +enter(ctx)
  }
  
  class DomainTraverser implements IDomainTraverser {
      -collectPluginManager: CollectPluginManager
      -infoProviderManager: InfoProviderManager
      -pathFinderManager: PathFinderManager
      +traverse()
      +applyPlugins()
  }
  
  class CollectPluginManager {
      -collectPlugins: Array<ICollectPlugin>
      +register(plugin: ICollectPlugin)
      +getPlugins(): ICollectPlugin[]
  }
  
  class InfoProviderManager {
      -infoProviders: Array<IInfoProvider>
      +register(provide: IInfoProvider)
      +getProviders(): IInfoProvider[]
  }
  
  class PathFinderManager {
      -pathFinders: Array<IPathFinder>
      +register(pathFinder: IPathFinder)
      +getPathFinders(): IPathFinder[]
  }
  
  InfoProviderManager "1" --> "1" TraversalContext: inject
  DomainTraverser "1" <-- "1" PathFinderManager: enter
  CollectPluginManager "1" --> "*" ICollectPlugin : manage
  DomainTraverser "1" --> "*" TraversalContext : create
  TraversalContext "*" --> "1" CollectPluginManager: inject
  InfoProviderManager "1" --> "*" IInfoProvider : manage
  PathFinderManager "1" --> "*" IPathFinder : manage
  
  ICollectPlugin <|-- APlugin
  ICollectPlugin <|-- BPlugin
  ICollectPlugin <|-- CPlugin
  
  IInfoProvider <|-- AProvider
  IInfoProvider <|-- BProvider
  IInfoProvider <|-- CProvider
  
  IPathFinder <|-- AFinder
  IPathFinder <|-- BFinder
  IPathFinder <|-- CFinder
  
  @enduml
  ```

![Processing UML](/img/in-post/2023-05-19/processing-uml.png)

### 4.1 遍历器 `IDomainTraverser`

`IDomainTraverser` 接口定义了遍历器的基础规范，`DomainTraverser` 类实现了接口，包括：

1. `traverse()`：负责实施具体的遍历逻辑，遍历UI的组件树、页面变量、i18n数据等。
2. `applyPlugins()`：负责对注册的插件进行遍历，只有在 `isApplicable` 返回 `true` 的情况下，才会调用插件的 `process` 方法。

具体的实现将会在实现了该接口的 `DomainTraverser` 类中。`DomainTraverser` 类也维护一`CollectPluginManager` 实例和一个 `InfoProviderManager` 实例，用于管理所有的插件。

### 4.2 遍历上下文 `TraversalContext`

`TraversalContext`类在遍历过程中提供上下文信息。这个上下文信息在遍历的每个节点中是唯一的，包含当前正在处理的节点在整个树结构中的位置信息。以下是每个字段的详细解释：

1. `libs`: 提前注册进来的数据和工具，这些数据和工具在遍历过程中可以被插件或提供者使用。
2. `specificSources`: 遍历过程中找到的所有特定资源，如对象、字段、数据集等元数据。
3. `specificSchemas`: 遍历过程中找到的所有特定Schema。如条件、公式、报表等。
4. `value`: 当前正在处理的节点的值。根据节点的类型，这个值可能是各种不同的数据类型。
5. `key`: 当前节点在其父节点中的键。如果父节点不是一个对象，这个属性值为空。
6. `index`: 当前节点在其父数组中的索引。如果父节点不是一个数组，这个属性值为空。
7. `container`: 当前节点的容器对象，可能是一个对象或数组。
8. `parent`: 指向父级上下文的引用，表示当前节点的父节点的上下文。
9. `depth`: 当前节点在遍历树中的深度。根节点的深度为0，每向下一层，深度就加1。
10. `information`: 存储了一些与当前节点相关的辅助信息，例如所属子页面、定位信息等。这些信息会在`ISpecificSource`和`ISpecificSchema`中用到。

### 4.3 收集插件定义 `ICollectPlugin`

`ICollectPlugin` 接口定义了收集插件的基本规范，包括：

1. `enableInfo`：是否开启额外信息注入，例如定位信息、所属子页面等。
2. `isApplicable(context: TraversalContext)`：确定是否需要执行当前插件的 `process` 方法。
3. `process(context: TraversalContext)`：插件的主要逻辑，对遍历器传递的数据进行处理，然后生成并返回结果。

### 4.4 收集插件管理 `CollectPluginManager`

`CollectPluginManager` 类负责管理所有的插件，有如下方法：

1. `register(plugin: ICollectPlugin)`：用于注册新的插件。
2. `getPlugins()`：返回所有注册的插件。

### 4.5 辅助信息生成器定义 `IInfoProvider`

`IInfoProvider` 接口定义了辅助信息生成器的行为，包括定位信息、所属子页面等。有如下方法：

1. `privide(context: TraversalContext)`：生成辅助信息数据。

### 4.6 辅助信息生成器管理 `InfoProviderManager`

`InfoProviderManager` 类负责管理所有的辅助数据生成器，有如下方法：

1. `register(provider: ICollectPlugin)`：用于注册新的生成器。
2. `getProviders()`：返回所有注册的生成器。

### 4.7 数据寻找器定义 `IPathFinder`

`IPathFinder` 接口定义了遍历时UIDL外置关联数据的寻找器，例如根据i18n的key去i18nJson内对应部分继续遍历，有如下方法：

1. `shouldEnter()`：是否需要进入外置数据遍历
2. `enter(context: TraversalContext)`: 根据给定的上下文在数据源中找到数据的真实位置，继续遍历

### 4.8 数据寻找器管理 `PathFinderManager`

`PathFinderManager` 类负责管理所有的外置关联数据的寻找器，有如下方法：

1. `register(finder: IPathFinder)`：用于注册新的寻找器。
2. `getFinders()`：返回所有注册的寻找器。

### 4.9 遍历跳过检查器 `TraversalSkipChecker`

1. `shouldSkip(context: TraversalContext)`：是否需要跳过这一节点以及所有子节点

## 9. 性能影响

需要遍历整个DSL，并且每次自动保存都会触发一次计算。

所以思路是把这个需求相关的代码写成：

- 对外部无影响，无副作用的
- 只依赖可序列化的数据
- 整体来看是个「纯函数」

所以可以把计算放到web-worker内做，避免阻塞主线程引起界面卡顿。