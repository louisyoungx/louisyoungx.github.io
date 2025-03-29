---
layout: Post
title: DAG canvas nodes snapping
subtitle: how nodes snap to each other
author: louisyoungx
date: 2024-09-11
useHeaderImage: true
headerImage: /img/in-post/2024-09-11/header.jpg
headerMask: rgb(14, 21, 5, .2)
permalinkPattern: /post/:year/:month/:day/:slug/
tags:
  - technology
  - chinese
  - workflow
  - dag
  - javascript
---

DAG 画布实现节点吸附与对齐

<!-- more -->

# DAG 画布实现节点吸附与对齐

## 1. 需求概述

| 功能点     | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| 边缘吸附   | 边缘吸附帮助用户更容易排列整齐的元素当用户移动节点时，会检测该节点是否接近其他节点的边缘。如果节点靠近这些边缘，会自动将元素 "吸附" 到最近的边缘。吸附距离有一个阈值，只有当节点与边缘的距离小于这个阈值时，吸附才会生效。![Snap Action](/img/in-post/2024-09-11/snap-action.png) |
| 等距排列   | 等距排列帮助用户识别出具有相同间距的节点序列，并在下一个预测间距位置进行吸附。确保节点之间的空间分布一致，从而提高工作流整体 UI 的一致性和可读性。![Align Action](/img/in-post/2024-09-11/align-action.png) |
| 辅助线渲染 | 产生吸附或对齐时需要渲染出辅助线 ![Snap Line Render](/img/in-post/2024-09-11/snap-line-render.png) |

## 2. 整体方案

### 2.1 拖拽吸附

吸附需在拖拽时触发，因此拖拽时节点坐标计算，要在当前鼠标坐标的基础上加上一个吸附的偏移量。

由于吸附服务在独立的插件包，拖拽服务无法直接依赖吸附服务，因此只能采用注册位置调整函数的方式。

在 `WorkflowDragService` 增加 `registerPosAdjuster` 方法

```ts
class WorkflowDragService {
  public registerPosAdjuster(adjuster: PosAdjuster): Disposable
}
```

位置调整函数接收两个参数

- `selectedNodes` 当前拖拽的节点实体
- `position` 当前拖拽所有节点所组成矩形的左上角坐标

返回值为偏移量 `{x: number, y: number}`

```ts
type PosAdjuster = (params: {
  selectedNodes: WorkflowNodeEntity[];
  position: {x: number, y: number};
}) => {x: number, y: number};
```

![Selected Nodes Position](/img/in-post/2024-09-11/selected-nodes-position.png)

拖拽中的节点坐标加上位置调整函数返回的偏移量，造成节点被吸附的效果

```ts
// 1. 获取偏移量
const offset = posAdjuster({selectedNodes, position: mousePos});
// 2. 计算节点坐标
const newPosition = {
  x: mousePos.x + offset.x,
  y: mousePos.y + offset.y,
};
// 3. 应用节点坐标
node.updatePosition(newPosition);
```

### 2.2 吸附插件包

吸附功能集成到一个可插拔的画布插件包 `@flow-ide-editor/free-snap-plugin`

插件包主要包含

- 吸附服务 `WorkflowSnapService`，负责计算吸附偏移量
- 吸附渲染层 `WorkflowSnapLayer`，负责渲染吸附辅助线
- 吸附插件配置 `createFreeSnapPlugin`，负责接收业务层配置项，注册服务与渲染层

业务方只需引入即可使用吸附功能

```ts
import { createFreeSnapPlugin } from '@flow-ide-editor/free-snap-plugin';
const editorProps = {
  plugins: () => [createFreeSnapPlugin()]
}
```

### 2.3 吸附服务

`WorkflowSnapService` 用于监听拖拽，计算吸附偏移量，产生吸附事件。

运行流程：

一、向 `WorkflowDragService` 注册位置调整函数

```ts
  private mountListener(): void {
    const dragAdjusterDisposer = this.dragService.registerPosAdjuster(params =>
      this.snapping(params),
    );
    this.disposers.push(dragAdjusterDisposer);
  }
```

二、计算吸附偏移量

1. 获取吸附目标矩形信息 (x, y, width, height)

```ts
   const selectedBounds = this.getBounds(selectedNodes);
   const rect = new Rectangle(position.x, position.y, selectedBounds.width, selectedBounds.height);
```

2. 计算等距排列偏移量

```ts
   const { alignOffset, alignRects, alignSpacing } = this.calcAlignOffset({
     selectedNodes,
     rect,
     alignThreshold: this.options.edgeThreshold,
   });
```

3. 计算边缘吸附偏移量

```ts
   const { snapOffset, snapEdgeLines } = this.calcSnapOffset({
     selectedNodes,
     rect,
     edgeThreshold: this.options.edgeThreshold,
   });
```

4. 将边缘吸附偏移量与等距排列偏移量合并最终偏移量

```ts
   const offset: IPoint = {
     x: snapOffset.x || alignOffset.x,
     y: snapOffset.y || alignOffset.y,
   };
```

5. 获取吸附后目标矩形信息

```ts
    const snapRect = new Rectangle(
      position.x + offset.x,
      position.y + offset.y,
      rect.width,
      rect.height,
    );
```

6. 触发吸附事件

```ts
    this.snapEmitter.fire({
      snapRect,
      snapEdgeLines,
      alignRects,
      alignSpacing,
    });
```

7. 返回偏移量信息

### 2.4 吸附渲染层

`WorkflowSnapLayer` 用于在拖拽节点时显示对齐和吸附效果的视觉指引。

运行流程：

1. 初始化与监听

   - 在组件挂载时，监听`WorkflowSnapService`发出的`onSnap`事件，获取吸附事件的相关数据

   - 提取和计算需要显示的边缘吸附线和对齐线的位置信息，进行状态管理

2. 对齐线与边缘线的渲染

   - 实现`renderAlignLines`和`renderEdgeLines`两个方法，分别处理对齐线和边缘吸附线的 React 元素渲染

   - 遍历边缘吸附线和对齐线的数组，生成对应的线条UI

### 2.5 偏移量计算

#### 2.5.1 边缘吸附偏移

1. 获取可吸附节点：当前画布上所有节点，过滤掉拖拽节点、与拖拽节点非同级节点、根节点、屏幕可视范围外节点
2. 对节点进行排序，按照节点中心点坐标与当前目标矩形中心点坐标的距离，从近到远排列

![Edge Snap Offset](/img/in-post/2024-09-11/edge-snap-offset.png)

```ts
  private getAvailableNodes(params: {
    targetNodes: WorkflowNodeEntity[];
    targetRect: Rectangle;
  }): WorkflowNodeEntity[] {
    const { targetNodes, targetRect } = params;

    const targetCenter = targetRect.center;
    const targetContainerId = targetNodes[0].parent?.id ?? this.document.root.id;

    const disabledNodeIds = targetNodes.map(n => n.id);
    disabledNodeIds.push(FlowNodeBaseType.ROOT);
    const availableNodes = this.nodes
      .filter(n => n.parent?.id === targetContainerId)
      .filter(n => !disabledNodeIds.includes(n.id))
      .sort((nodeA, nodeB) => {
        const nodeCenterA = nodeA.getData(FlowNodeTransformData)!.bounds.center;
        const nodeCenterB = nodeB.getData(FlowNodeTransformData)!.bounds.center;
        // 距离越近优先级越高
        const distanceA =
          Math.abs(nodeCenterA.x - targetCenter.x) + Math.abs(nodeCenterA.y - targetCenter.y);
        const distanceB =
          Math.abs(nodeCenterB.x - targetCenter.x) + Math.abs(nodeCenterB.y - targetCenter.y);
        return distanceA - distanceB;
      });
    return availableNodes;
  }
```

3. 获取可吸附线条，且线条是根据节点从近到远排序
   1. 水平线 (Y)
   1. 垂直线 (X)
   1. 中心水平线 (Y)
   1. 中心垂直线 (X)

![Can Snap Line](/img/in-post/2024-09-11/can-snap-line.png)

```ts
interface SnapLine {
  x?: number;
  y?: number;
  sourceNodeId: string;
}
interface SnapHorizontalLine extends SnapLine {
  y: number;
}
interface SnapVerticalLine extends SnapLine {
  x: number;
}
interface SnapMidHorizontalLine extends SnapLine {
  y: number;
}
interface SnapMidVerticalLine extends SnapLine {
  x: number;
}
interface SnapLines {
  horizontal: SnapHorizontalLine[];
  vertical: SnapVerticalLine[];
  midHorizontal: SnapMidHorizontalLine[];
  midVertical: SnapMidVerticalLine[];
}
```

4. 找到目标矩形上边缘、下边缘、左边缘、右边缘、中心水平、中心垂直，共六个场景分别对应最近的吸附线
5. 判断各个场景最近吸附线与边缘之间的距离是否大于业务层配置的阈值
6. 距离 < 阈值即为生效的吸附线
7. 生效的吸附线坐标减去边缘坐标即为偏移量

![Activated Line](/img/in-post/2024-09-11/active-snap-line.png)

#### 2.5.2 等距排列偏移

1. 获取可吸附节点：当前画布上所有节点，过滤掉拖拽节点、与拖拽节点非同级节点、根节点
2. 对节点进行排序，按照节点中心点坐标与当前目标矩形中心点坐标的距离，从近到远排列
3. 获取上、下、左、右四个方向上与目标矩形方向上有相交的节点

![Find Intersect Nodes](/img/in-post/2024-09-11/find-intersect-nodes.png)

```ts
interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AlignRect {
  rect: Rectangle;
  sourceNodeId: string;
}

interface AlignRects {
  top: AlignRect[];
  bottom: AlignRect[];
  left: AlignRect[];
  right: AlignRect[];
}
```

4. 过滤出单个方向上存在两个以上节点，且最近的两个节点之间不存在重叠方向

![Filter Directions](/img/in-post/2024-09-11/filter-directions.png)

5. 获取过滤后方向上的的最近两节点间距，即为方向间距

![Align Distance](/img/in-post/2024-09-11/align-distance.png)

6. 根据方向间距推测出目标吸附线

7. 距离 < 阈值即为生效的吸附线

8. 生效的吸附线坐标减去边缘坐标即为偏移量

![Align Distance](/img/in-post/2024-09-11/active-align-line.png)

