---
layout: Post
title: Hierarchical design of business event domains
subtitle: Event-Driven Architecture
author: louisyoungx
date: 2023-11-03
useHeaderImage: true
headerImage: /img/in-post/2023-11-03/header.jpg
headerMask: rgb(14, 21, 5, .2)
permalinkPattern: /post/:year/:month/:day/:slug/
tags:
  - technology
  - chinese
  - eda
  - javascript
---

业务上的事件领域分层设计

<!-- more -->

# 业务上的事件领域分层设计

## 背景

- [事件驱动架构-EDA（Event-Driven Architecture）](https://en.wikipedia.org/wiki/Event-driven_architecture)

## 领域设计

- 领域：Business 事件领域 `BusinessEventDomain`
- 应用服务：
    - Business 设计器事件服务 `BusinessDesignerEventService`
    - Business 运行时事件服务 `BusinessRuntimeEventService`
- 限界上下文
    - 事件总线
        - 领域服务：`EventBus`
        - 实体
            - 事件队列：`EventQueue`
        - 值对象
            - 事件内容：`EventContent`
    - 事件中心
        - 领域服务：`EventCenter`
            - 事件处理插件：`EventHandler`
        - 实体：
            - 事件实体：`EventEntity`
    - 事件分发
        - 领域服务：`EventDispatcher`
            - 事件监听插件：`EventLister`
    - 事件存储
        - 领域服务：`EventStore`

## 分层架构

![Framework](/img/in-post/2023-11-03/framework.png)

## 概念

### 应用层

- `BusinessEventService`：面向具体业务场景对外提供接口。其余业务服务通过接口来注册为 EDA 事件生产者和消费者
    - `BusinessDesignerEventService`：面向设计器业务场景。
    - `BusinessRuntimeEventService`：面向运行时业务场景。

### 领域层

- `EventBus`：负责事件内容`EventContent`的接收与缓存。
- `EventCenter`：提供用于处理事件流的 API，将事件传递给进行事件处理插件`EventHandlers`进行处理，并生成领域事件实体。`EventEntity`. 将这些领域事件实体保存到`EventStore`中。
- `EventStore`：将事件实体持久化，支撑事件溯源。事件存储是恢复和弹性的关键架构模式。
- `EventDispatcher`：接受领域事件实体，并转发给具体的事件监听插件`EventListeners`。

### 消费者

- `EventHandler`：对所有原始事件内容进行预处理或触发副作用。
- `EventListener`：对具体事件进行监听并触发副作用。

## 接口类型

### 事件实体 `BusinessEventEntity`

事件实体是一个用于封装事件的对象。包含了事件的名称、命名空间和有效负载等信息。

```ts
/** Business 事件的唯一标识符类型 */
export type BusinessEventID = string;
/** Business 事件的符号类型 */
export type BusinessEventSymbol = string | symbol;

/** Business 事件的名称类型 */
export type BusinessEventName = string | symbol;
/** Business 事件的命名空间类型 */
export type BusinessEventNamespace = string | symbol;
/** Business 事件的来源类型 */
export type BusinessEventSource = string | symbol;
/** Business 事件的负载 */
export type BusinessEventPayload<T> = T;
/** BusinessEventDisposer 是一个函数类型，用于取消事件监听。 */
export type BusinessEventDisposer = () => void;

/** Business 事件的基本信息 */
export type BusinessEventInfo = {
  name: BusinessEventName;
  namespace?: BusinessEventNamespace;
  source?: BusinessEventSource;
};

/** Business 事件的信息和有效负载 */
export type BusinessEventContent<T> = BusinessEventInfo & {
  payload: BusinessEventPayload<T>;
};

/** Business 事件的指标 */
export type BusinessEventMetrics = {
  fireTime: number;
  applyTime: number;
  applyIndex: number;
};

/** Business 事件的实体，包含信息、有效负载和度量指标 */
export type BusinessEventEntity<T> = BusinessEventContent<T> &
  BusinessEventMetrics & {
    id: BusinessEventID;
  };

```

### 事件服务 `BusinessEventService`

事件服务负责对外透出API，提供了对事件的触发和监听功能。允许用户触发特定的事件，并提供了注册事件监听器以侦听事件的能力。

```ts
/**
 * IBusinessEventService 定义了 Business 事件服务的接口。
 */
export interface IBusinessEventService {
  /** 事件中心 */
  readonly center: IBusinessEventCenter;

  /**
   * 触发事件。
   * @param {BusinessEventContent<T>} event - 要触发的事件对象。
   * @template T - 事件的有效负载类型。
   */
  fire<T>(event: BusinessEventContent<T>): void;

  /**
   * 监听事件。
   * @param {BusinessEventName} name - 要监听的事件名称。
   * @returns {Promise<T>} - 表示监听操作的结果，返回 Promise。
   * @template T - 事件的有效负载类型。
   */
  on<T>(name: BusinessEventName): Promise<T>;

  /**
   * 监听事件，并提供取消监听的方法。
   * @param {BusinessEventInfo} to - 要监听的事件信息。
   * @param {(payload: T) => void} callback - 事件回调函数，接收事件的有效负载作为参数。
   * @returns {BusinessEventDisposer} - 用于取消事件监听的函数。
   * @template T - 事件的有效负载类型。
   */
  listen<T>(to: BusinessEventInfo, callback: (payload: T) => void): BusinessEventDisposer;
}

```

### 事件总线 `EventBus`

事件总线是一个缓存机制，用于在系统中缓冲事件。使用namespace进行分割管道，管道中事件会存在调用顺序。

```ts
/**
 * IBusinessEventBus 定义了 Business 事件总线的接口。
 */
export interface IBusinessEventBus {
  /** 事件中心 */
  readonly center: IBusinessEventCenter;
  /** 事件总线中的管道映射 */
  readonly pipelines: Map<BusinessEventNamespace, IBusinessEventPipeline>;

  /**
   * 推送事件到事件总线。
   * @param {BusinessEventContent<T>} event - 要推送的事件对象。
   * @template T - 事件的有效负载类型。
   */
  push<T>(event: BusinessEventContent<T>): void;
}

```

### 事件中心 `EventCenter`

事件中心用于集中管理和协调事件，充当事件调度器，负责将事件路由到相应的处理器或监听器。

```ts
/**
 * IBusinessEventCenter 定义了 Business 事件中心的接口。
 */
export interface IBusinessEventCenter {
  /** 模块 */
  readonly module: {
    /** 事件总线 */
    bus: IBusinessEventBus;
    /** 事件存储 */
    store: IBusinessEventStore;
    /** 事件分发器 */
    dispatcher: IBusinessEventDispatcher;
  };
  /** 插件 */
  readonly plugin: {
    /** 事件监听器 */
    listeners: Map<BusinessEventNamespace, IBusinessEventListener>;
    /** 事件处理器 */
    handlers: Map<BusinessEventNamespace, IBusinessEventHandler>;
  };

  /**
   * 触发事件。
   * @param {BusinessEventContent<T>} event - 要触发的事件对象。
   * @template T - 事件的有效负载类型。
   */
  fire<T>(event: BusinessEventContent<T>): void;

  /**
   * 应用事件。
   * @param {BusinessEventContent<T>} event - 要应用的事件对象。
   * @template T - 事件的有效负载类型。
   */
  apply<T>(event: BusinessEventContent<T>): void;
}

```

### 事件存储 `EventStore`

事件存储是一个持久化存储事件的组件。它用于将事件保存在持久化存储介质中，以便后续的查询和回放。事件存储提供了存储和检索事件的接口，可以保留事件的历史记录和状态变更。

```ts
/**
 * IBusinessEventStore 定义了 Business 事件存储的接口。
 */
export interface IBusinessEventStore {
  /**
   * 存储事件到事件存储。
   * @param {BusinessEventEntity<T>} event - 要存储的事件对象。
   * @returns {Promise<void>} - 表示存储操作的 Promise。
   * @template T - 事件的有效负载类型。
   */
  save<T>(event: BusinessEventEntity<T>): Promise<void>;

  /**
   * 从事件存储中检索事件。
   * @returns {Promise<Array<BusinessEventEntity<unknown>>>} - 表示检索操作的 Promise，返回事件对象数组。
   */
  retrieve(): Promise<Array<BusinessEventEntity<unknown>>>;
}

```

### 事件分发器 `EventDispatcher`

事件分发器是负责将事件分发给对应的事件处理器的组件。它接收来自事件中心的事件，并将其传递给注册的事件处理器进行处理。事件分发器根据事件的类型和目标处理器的注册信息，将事件分发给相应的处理器进行处理。

```ts
/**
 * IBusinessEventDispatcher 定义了 Business 事件分发器的接口。
 */
export interface IBusinessEventDispatcher {
  /**
   * 监听器的映射，用于存储命名空间和对应的监听器。
   */
  readonly listeners: Map<BusinessEventNamespace, IBusinessEventListener>;

  /**
   * 分发事件到相应的监听器。
   * @param {BusinessEventEntity<T>} event - 要分发的事件对象。
   * @template T - 事件的有效负载类型。
   */
  dispatch<T>(event: BusinessEventEntity<T>): void;
}

```

### 事件处理器 `EventHandler`

事件处理器是用于处理所有事件的插件，会注册到事件中心上，接收所有事件并执行相应的处理逻辑。事件处理器可以根据事件的有效负载进行副作用操作。

```ts
/**
 * IBusinessEventHandler 定义了 Business 事件处理器的接口。
 */
export interface IBusinessEventHandler {
  /** 处理器名称 */
  readonly name: BusinessEventSymbol;

  /**
   * 处理事件。
   * @param {BusinessEventContent<T>} event - 要处理的事件内容。
   * @returns {void | Promise<void>} - 表示处理操作的结果，可以是 void 或 Promise<void>。
   * @template T - 事件的有效负载类型。
   */
  handle<T>(event: BusinessEventContent<T>): void | Promise<void>;
}

```

### 事件监听器 `EventListener`

事件监听器是用于监听特定类型事件的插件，注册到事件分发器上，接收特定类型的事件并执行相应的回调函数。事件监听器通常用于触发事件后需要执行一些特定操作的场景。

```ts
/**
 * IBusinessEventListener 定义了 Business 事件监听器的接口。
 */
export interface IBusinessEventListener {
  /** 监听器名称 */
  readonly name: BusinessEventSymbol;
  /** 监听器所监听的事件信息 */
  readonly listenTo: BusinessEventInfo;
  /** 取消事件监听的方法 */
  readonly dispose: BusinessEventDisposer;

  /**
   * 事件触发时的回调函数。
   * @param {unknown} payload - 事件的有效负载。
   */
  on(payload: unknown): void;
}

```

## 例子

### Case 1 触发与监听事件

```ts
const emitter: BusinessEventService

// 触发数据加载完成事件
emitter.fire({
  name: 'DataLoaded',
  payload: data,
})

// 监听事件（异步）
const data = await emitter.on('DataLoaded')

// 监听事件（回调）
const disposer = emitter.listen('DataLoaded', (data) => data)

```

### Case 2 事件监听插件

```ts
// 数据加载完成插件
class DataLoadedEventListener extends IBusinessEventListener {
  name: 'DataLoadedEventListener',
  listenTo: {
    name: 'DataLoaded',
  },
  on(data): Promise<void> {
    console.log('data loaded: ', data)
  }
}

```

### Case 3 事件处理插件

```ts
// 事件信息打印处理插件
class PrintEventHandler extends IBusinessEventHandler {
  name: 'PrintEventHandler',
  handle(event: BusinessEventContent): Promise<void> {
    // 所有事件都会打印下来
    console.log(event)
    // 对事件数据进行处理
    event.printed = true
  }
}

```