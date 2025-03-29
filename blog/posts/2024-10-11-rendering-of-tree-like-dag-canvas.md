---
layout: Post
title: Rendering of tree-like DAG canvas
subtitle: tree-like Directed Acyclic Graph
author: louisyoungx
date: 2024-10-11
useHeaderImage: true
headerImage: /img/in-post/2024-10-11/header.jpg
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

树形 DAG 的画布渲染方式

<!-- more -->

# 树形 DAG 的画布渲染方式

# 1. 需求概述

DAG 画布需要新增一个带有子画布的容器节点，相比于普通节点具有以下特性：

1. 可以容纳节点和线条
2. 可以根据子节点自适应大小
3. 容器节点可以带动子节点移动，反之亦然

> 本文重点介绍第一点，即如何渲染

# 2. 功能分析

Workflow 整体是有向无环图（DAG）结构，实现容器节点需要在这一结构上加上子图（Sub DAG），组合形成树形有向无环图（Tree-like DAG)。

![DAG](/img/in-post/2024-10-11/dag.jpg)
![Tree-like DAG](/img/in-post/2024-10-11/tree-like-dag.jpg)

改造前自由画布仅支持渲染 DAG 结构，若要渲染树形 DAG，主要需改造以下部分

- Schema 结构：改造为树形 Schema，节点 interface 支持递归结构
- 节点与线条的渲染层：支持多层的节点和线条渲染
- 节点与线条的动态层级计算：支持多层级下对节点与线条的 hover、select 的操作
- 容器节点的特殊渲染：容器节点监听子节点大小变化，调整自身大小

# 3. 技术实现

## 3.1 树形 Schema 结构

为实现树形 DAG 结构的Schema，需要对现有的 Schema 进行改造

### 3.1.1 Schema 定义

Schema 定义引入子节点、子线条概念

```ts
interface WorkflowSchemaJSON {
  nodes: WorkflowNodeJSON[];
  edges: WorkflowEdgeJSON[];
}

interface WorkflowNodeJSON {
  id: string;
  type: string;
+ blocks: WorkflowNodeJSON[]; // 子节点
+ edges: WorkflowEdgeJSON[]; // 子线条
};

interface WorkflowEdgeJSON {
  sourceNodeId: string;
  targetNodeId: string;
}
```

### 3.1.2 Schema 序列化

Schema 的序列化与反序列化支持递归

> 示意代码只表示核心逻辑，屏蔽了业务细节

改造前

```ts
class WorkflowDocument {
  /** Workflow 反序列化 */
  fromJSON(json: WorkflowSchemaJSON): void {
    const { nodes, edges } = json;
    // 创建节点
    nodes.forEach(node => {
      this.createNode(node);
    });
    // 创建线条
    edges.forEach(edge => {
      this.createLine(edge);
    });
  }
  /** 创建节点 */
  createNode(
    nodeJSON: WorkflowNodeJSON
  ): WorkflowNodeEntity {
    // 创建节点
    const node = new WorkflowNodeEntity(nodeJSON);
    return node;
  }
  /** 创建节点 */
  createLine(edgeJSON: WorkflowEdgeJSON): WorkflowLineEntity {
    // 创建线条
    return new WorkflowLineEntity(edgeJSON);
  }
  /** Workflow 序列化 */
  toJSON(): WorkflowSchemaJSON {
    return {
-     // 全部节点和线条统一序列化
-     nodes: this.allNodes.map(node => this.toNodeJSON(node)),
-     edges: this.allLines.map(line => this.toLineJSON(line)),
    };
  }
  /** 节点序列化 */
  toNodeJSON(node: WorkflowNodeEntity): WorkflowNodeJSON {
    // 生成节点JSON
    return {
      id: node.id,
      type: node.type,
    };
  }
  /** 线条序列化 */
  toLineJSON(line: WorkflowLineEntity): WorkflowEdgeJSON {
    // 生成线条JSON
    return {
      sourceNodeId: line.from.id,
      targetNodeId: line.to.id,
    };
  }
}
```

改造后

```ts
class WorkflowDocument {
  /** Workflow 反序列化 */
  fromJSON(json: WorkflowSchemaJSON): void {
    const { nodes, edges } = json;
    // 创建节点
    nodes.forEach(node => {
      this.createNode(node);
    });
    // 创建线条
    edges.forEach(edge => {
      this.createLine(edge);
    });
  }
  /** 创建节点 */
  createNode(
    nodeJSON: WorkflowNodeJSON,
    parentNode?: WorkflowNodeEntity,
  ): WorkflowNodeEntity {
    // 创建节点
    const node = new WorkflowNodeEntity(nodeJSON);
+   // 设置父节点
+   if (parentNode) {
+     node.parent = parentNode
+     parentNode.addChild(node);
+   }
+   // 递归创建子节点
+   nodeJSON.blocks.forEach(block => {
+     this.createNode(block, node);
+   });
    return node;
  }
  /** 创建节点 */
  createLine(edgeJSON: WorkflowEdgeJSON): WorkflowLineEntity {
    // 创建线条
    return new WorkflowLineEntity(edgeJSON);
  }
  /** Workflow 序列化 */
  toJSON(): WorkflowSchemaJSON {
+   const rootJSON = this.toNodeJSON(this.root);
    return {
+     nodes: rootJSON.blocks,
+     edges: rootJSON.edges,
    };
  }
  /** 节点序列化 */
  toNodeJSON(node: WorkflowNodeEntity): WorkflowNodeJSON {
+   // 递归生成子节点JSON
+   const blocks = node.children.map(child => this.toNodeJSON(child));
+   // 递归生成子线条JSON
+   const edges = node.children.map(child => this.toLineJSON(child));
    // 生成节点JSON
    return {
      id: node.id,
      type: node.type,
+     blocks,
+     edges,
    };
  }
  /** 线条序列化 */
  toLineJSON(line: WorkflowLineEntity): WorkflowEdgeJSON {
    // 生成线条JSON
    return {
      sourceNodeId: line.from.id,
      targetNodeId: line.to.id,
    };
  }
}
```

## 3.2 多层渲染层

这块是多层级改造遇到的一个难点，想说清楚为什么要采用目前的这种多层渲染方式，本节分为以下部分进行讲解：

1. 画布的渲染层是什么，节点和线条 DOM 结构是怎么样的
2. 目前这种结构在多层级情况下会有什么问题
3. 多层级下的渲染层组织方式

### 3.2.1 画布渲染层

画布上的所有元素，都处于不同层级，改造前有以下渲染层，渲染顺序如右图所示

- 第 1 层：`background-layer` 背景渲染层
  - 背景颜色，圆点所处的层
- 第 2 层：`lines-back-layer` 根级线条渲染层
  - 线条默认情况下所处的层
- 第 3 层：`nodes-layer` 节点渲染层
  - 节点所处的层
- 第 4 层：`lines-front-layer` 置顶线条渲染层
  - 线条被hover或被选中下所处的层，比节点层高
- 第 5 层：`selector-box-layer` 拖选框渲染层
  - 不触发拖选不可见

![Multi Render Layers](/img/in-post/2024-10-11/multi-render-layers.png)

每一个渲染层都是绝对定位的，处于 HTML 结构后面的层会覆盖前面的层

右图对应 Schema

```json
{
    "nodes": [
        {
            "id": "node1",
            "type": "basic"
        },
        {
            "id": "node2",
            "type": "basic"
        },
        {
            "id": "node3",
            "type": "basic"
        },
        {
            "id": "node4",
            "type": "basic"
        }
    ],
    "edges": [
        {
            "source": "node1",
            "target": "node4"
        },
        {
            "source": "node3",
            "target": "node4"
        },
        {
            "source": "node2",
            "target": "node3"
        }
    ]
}
```

示例

![DAG Render Layers](/img/in-post/2024-10-11/dag-render-layers.png)

上图对应 HTML 结构

```html
<div class="playground-pipeline">
    <div class="background-layer"></div>
    <div class="lines-back-layer">
        <div class="node">Node1</div>
        <div class="node">Node2</div>
        <div class="node">Node3</div>
        <div class="node">Node4</div>
    </div>
    <div class="nodes-layer">
        <div class="node">Line1</div>
        <div class="node">Line2</div>
        <div class="node">Line3</div>
    </div>
    <div class="lines-front-layer"></div>
    <div class="selector-box-layer"></div>
</div>
```

> 参考资料：
>
> 绝对定位下不含 z-index 的堆叠顺序
>
> [MDN | Stacking without z-index](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_without_z-index)
>
> [CodePen 示例](https://codepen.io/louisyoungx/pen/JjQeJxe)

### 3.2.2 多层级的问题

从改造前的画布层级可知，线条渲染层分别有两个：

- 根级线条渲染层
- 置顶线条渲染层

分为两层是因为线条在默认的情况下处于节点之下，但在被hover或选中的情况下处于节点之上。

但这种渲染层组织方式在有多层节点的情况下，会导致渲染层的数量随着层级数量递增，即渲染层数量不稳定。

我们推演一下最简单的两层节点情况下，需要的层级：

- 根级线条渲染层（根级的线条）
- 根级节点渲染层（根级的节点）
- 一层容器内线条渲染层（容器节点内的子线条）
- 一层容器内节点渲染层（容器节点内的子节点）
- 置顶线条渲染层
- 置顶节点渲染层

![Tree DAG Render Layers](/img/in-post/2024-10-11/tree-dag-render-layers.png)

随着层级加深，还会出现二层容器、三层容器、四层容器······ 渲染层数量会越来越多。

### 3.2.3 合并线条和节点层

为了确保渲染层数量的稳定性，需要对节点和线条的渲染层进行合并，并通过 css `z-index` 属性控制层级。

右图对应 Schema

```json
{
    "nodes": [
        {
            "id": "Node0",
            "type": "container",
            "blocks": [
                {
                    "id": "SubNode0",
                    "type": "basic"
                },
                {
                    "id": "SubNode1",
                    "type": "basic"
                }
            ],
            "edges": [
                {
                    "source": "SubNode0",
                    "target": "SubNode1"
                }
            ]
        },
        {
            "id": "Node1",
            "type": "basic"
        },
        {
            "id": "Node2",
            "type": "basic"
        }
    ],
    "edges": [
        {
            "source": "Node0",
            "target": "Node2"
        },
        {
            "source": "Node1",
            "target": "Node2"
        }
    ]
}
```

示例

![Node & Line Mixed Layers](/img/in-post/2024-10-11/node-line-layer.png)

上图对应 HTML 结构

```html
<div class="nodes-lines-mixed-layer">
    <div class="node">Node0</div>
    <div class="node">Node1</div>
    <div class="node">Node2</div>
    <div class="node">SubNode0</div>
    <div class="node">SubNode1</div>
    <div class="line">Node0_Node2</div>
    <div class="line">Node1_Node2</div>
    <div class="line">SubNode0_SubNode1</div>
</div>
```

> 这里如果不采用融合节点线条渲染层的方式，而是仍然分为节点层和线条层两层来分别渲染，并采用 z-index 来控制层级，是否可行呢？
>
> 结论是可以正常渲染，但会有不可避免的 badcase
>
> 1. 线条永远在节点之下
> 2. 层级交错时渲染异常

## 3.3 动态层级计算

当所有节点和线条都处于同一渲染层，需要设计一种堆叠计算的算法，来动态调整节点和线条的 css `z-index` 属性，否则浏览器默认会按照元素在 HTML 结构中的顺序来计算默认的堆叠顺序。

> Tips:
>
> - `z-index` 是 CSS 属性 `(-∞, +∞)`
> - `Stacking Index` 堆叠顺序，可以理解为节点和线条之间的高度等级，是一个连续的自然数 `(0, +∞)`

首先是触发计算的条件：

- 节点或线条被 hover 或 select
- 有新建的节点或线条
- 有被删除的节点或线条

其次列举一下堆叠顺序规则：

1. 高层级节点线条的堆叠顺序整体高于低层级节点线条
2. 在同一层级中，线条堆叠顺序低于节点
3. 在同一层级中，线条之间堆叠顺序相等，节点之间后创建的节点在之前的节点之上
4. 被鼠标 Hover 和选中的线条会置于顶层，被选中的节点会置于顶层

根据以上规则，有两种层级计算的方案：

### 3.3.1 方案一：层级计算 `TiersCalc`

**介绍**

这一算法是按照层级来划分堆叠顺序，同一层级之间的节点之间共享同一个堆叠顺序，堆叠顺序只区分节点所在层级，不关注同一层级之间节点的创建顺序，创建顺序导致的堆叠顺序不同则由浏览器默认行为进行控制。

![Tiers Calc](/img/in-post/2024-10-11/tiers-calc.png)

**层级规则**

根节点为 0 层，根节点之上的根级节点为 1 层，根级节点的子节点为 2 层，以此类推。

**遍历方式**

一次性获取画布中所有节点和线条，先遍历节点，再遍历计算线条

**计算方式**

1. 节点堆叠计算

   1. 获取节点所在层级：向上查找父节点，直到空值
   2. 节点堆叠顺序 = 节点层级 * 2
      - 上图 SubNode0 节点，层级为 2，因此其堆叠顺序是 4

2. 线条堆叠计算

   1. 获取线条所在容器的层级
   2. 线条堆叠顺序 = 所在容器层级 * 2 + 1
      - 上图 SubNode0_SubNode1 线条，容器 Node0 层级为 1，因此其堆叠顺序是 3

3. 置顶节点或线条计算

   1. 获取当前最大堆叠顺序 = 最深层级 * 2

   2. 置顶堆叠顺序 = 最大堆叠顺序 + 原堆叠顺序

      - 上图最多 2 层，最大堆叠顺序为 4

      - Node1 节点，原堆叠顺序为 2，因此其置顶堆叠顺序是 6

**优缺点**

- 优点，占用的 z-index 跨度是固定的，在目前固定只有两层情况下跨度仅为 8，对原有代码影响小。
- 缺点：默认情况下，上一层级节点永远在下一层级之上，两个不同容器的子节点，在交错情况下会按照创建顺序排列。

### 3.3.2 方案二：堆叠计算 `StackedCalc`

**介绍**

> 这是发现方案一缺陷后改进的，将会替代方案一

这一算法是根据对画布中节点和线条的 DFS 遍历索引作为其堆叠顺序，各个节点和线条之间的堆叠顺序都是唯一的。

![Stacked Calc](/img/in-post/2024-10-11/stacked-calc.png)

**遍历规则**

1. 按照 DFS 算法进行遍历
2. 同一层级的先遍历线条，再遍历节点
3. 同一层级的元素中，按照创建顺序进行遍历

**计算方式**

1. 线条堆叠计算：当前 DFS 遍历的索引

2. 节点堆叠计算：当前 DFS 遍历的索引

3. 置顶节点或线条计算

   1. 获取当前最大堆叠顺序 = 节点数量 + 线条数量

   2. 置顶堆叠顺序 = 最大堆叠顺序 + 原堆叠顺序

      - 上图共 9 节点，6线条，因此最大堆叠顺序为 15

      - Node1 节点，原堆叠顺序为 8，为此其置顶顺序是 23

**优缺点**

- 优点：不会出现错位。
- 缺点：最大 z-index 随节点和线条个数增加而变大，需要确保代码中不存在硬编码的 z-index。