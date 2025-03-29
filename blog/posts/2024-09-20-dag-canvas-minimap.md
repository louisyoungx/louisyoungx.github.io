---
layout: Post
title: DAG canvas minimap
subtitle: using Canvas 2D to implement minimap
author: louisyoungx
date: 2024-09-20
useHeaderImage: true
headerImage: /img/in-post/2024-09-20/header.jpg
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

使用 Canvas 2D 实现 DAG 画布缩略图

<!-- more -->

# 使用 Canvas 2D 实现 DAG 画布缩略图

## 1. 需求概述

| 功能点         | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| 实时展示节点   | 缩略图需要能够展示工作流现有节点位置，以及实时反应节点添加、删除、移动等操作![Canvas Minimap](/img/in-post/2024-09-20/canvas-minimap.png) |
| 展示可视窗口   | 缩略图需能展示当前用户可视窗口在整体画布上的范围![Viewport Area](/img/in-post/2024-09-20/viewport-area.png) |
| 可拖动窗口导航 | 用户可以通过在缩略图上拖动视窗框来快速定位到工作流的特定位置 |

## 2. 技术选型

| 渲染类型         | 兼容性    | 性能      | 优点分析                                                     | 缺点分析                                                     | 选用 / 弃用原因                                              |
| :--------------- | :-------- | :-------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| HTML 渲染        | 很好⭐️⭐️⭐️⭐️⭐️ | 较差⭐️⭐️    | 易于理解和使用支持浏览器原生事件可被 DOM 搜索与操作          | 大量元素和复杂布局会导致性能下降对复杂图形交互处理能力有限   | 不适合绘制复杂图形节点多了会有性能问题                       |
| Canvas 2D 渲染 ✅ | 较好⭐️⭐️⭐️⭐️  | 较好⭐️⭐️⭐️⭐️  | 性能好设备兼容性好同屏幕承载图形量中等简单图形，图片渲染较快 | 复杂路径较（矢量图形绘制 API 较陈旧，不适合绘制较复杂的矢量图形）特效（阴影、模糊、图层混合模式）渲染较慢文字测量与渲染较慢 | 浏览器原生 API 支持，代码管理方便，无需三方库支持https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API缩略图渲染属于非多边形，且不涉及图层叠加特效，这种情况下性能与 WebGL 差不多 |
| SVG 渲染         | 较好⭐️⭐️⭐️⭐️  | 中等⭐️⭐️⭐️   | 可在任何分辨率下被高质量打印支持浏览器原生事件可被 DOM 搜索与操作 | 同屏承载图形少渲染速度较慢，变换图形容易掉帧特效渲染较慢，各浏览器器有差异无法进行局部绘制 | 能承载的元素有限节点多了会有性能问题相比 Canvas 2D 相比没有优势 |
| WebGL 渲染       | 中等⭐️⭐️⭐️   | 很好⭐️⭐️⭐️⭐️⭐️ | 复杂图形（多边形较多）渲染速度快特效（阴影、模糊、图层混合）处理快 | 单个页面承载 WebGL 画布数量有限制（不同浏览器器有不同，8～16个） | API 复杂，难以理解，一般都会引用 Skia CanvasKit 这种三方库 https://github.com/google/skiaWebGL 要与 WASM 配合才能获取较好的性能，相比 JS 会有 3-6 倍的性能提升，但在缩略图这个场景是大材小用了 |
| WebGPU 渲染      | 极差⭐️     | 原生∞     | 性能与原生平台调用 DirectX、Vulkan、Metal的引擎接近多线程渲染 | 目前标准刚制定，移动端设备均不支持                           | 生产环境不可用                                               |

## 3. 产品调研

> 不支持缩略图：
>
> Salesforce / Voiceflow / n8n / Microsoft Copilot Studio / BuildShip / Figma / Xmind / ComfyUI / 飞书文档画板

| [ReactFlow](https://reactflow.dev/api-reference/components/minimap) | Postman Flows                                                | Dify                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 会一直保持视窗框和所有节点同时显示在缩略图中无法拖动窗口导航![ReactFlow Minimap](/img/in-post/2024-09-20/canvas-minimap.png) | 基于 ReactFlow minimap但在此基础上实现了拖动窗口功能 ![PostmanFlows Minimap](/img/in-post/2024-09-20/canvas-minimap.png) | 基于 ReactFlow minimap保持了原始功能，无法拖动窗口导航![Dify Minimap](/img/in-post/2024-09-20/dify-minimap.png) |

## 4. 技术方案

### 4.1 缩略图插件包

缩略图功能集成到一个可插拔的画布插件包 `@flow-ide-editor/minimap-plugin`

插件包主要包含

- 缩略图服务 `FlowMinimapService`，用于图层处理
- 缩略图渲染层 `FlowMinimapLayer`，用于渲染缩略图
- 缩略图插件配置 `createMinimapPlugin`，负责接收业务层配置项，注册服务与渲染层

业务方只需引入即可使用缩略图功能

```ts
import { createMinimapPlugin } from '@flow-ide-editor/minimap-plugin';
const editorProps = {
  plugins: () => [createMinimapPlugin()]
}
```

### 4.2 缩略图服务

`FlowMinimapService` 用于监听节点变化、绘制 canvas 图层、处理拖拽窗口。

运行流程：

1. 创建 canvas 元素，获取 2D 上下文

```ts
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
  }
```

2. 根据业务配置设置画布各层颜色、画布宽高

```ts
  private setStyle(params?: MinimapServiceOptions) {
    const { className = 'gedit-minimap-canvas', style = {} } = params ?? {};
    this.canvas.className = className;
    this.style = {
      ...style,
      ...MinimapDefaultCanvasStyle,
    };
    this.canvas.width = this.style.canvasWidth;
    this.canvas.height = this.style.canvasHeight;
  }
```

3. 向 EntityManager 注册监听函数

```ts
  private mountListener(): void {
    const entityManagerDisposer = this.entityManager.onEntityChange(() => this.render());
    this.disposers.push(entityManagerDisposer);
  }
```

4. 渲染缩略图各个图层（详见 2.1.3）

5. 处理可视窗口拖动导航（详见 2.1.4）

### 4.3 缩略图渲染流程

**生成渲染上下文**

1. 获取所有节点的矩形数据 (x, y, width, height)
2. 聚合所有节点矩形为渲染矩形
3. 根据窗口大小和窗口偏移计算视图矩形
4. 计算缩略图缩放率，视图矩形相对偏移量
5. 根据缩放率调整各矩形，返回渲染上下文

![Rectangle of Canvas & Viewport](/img/in-post/2024-09-20/canvas-viewport-rect.png)

```ts
/** 矩形 */
interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 缩略图渲染上下文 */
interface MinimapRenderContext {
  /** 画布元素 */
  canvas: HTMLCanvasElement;
  /** 2D 上下文 */
  context2D: CanvasRenderingContext2D;
  /** 所有节点矩形 */
  nodeRects: Rectangle[];
  /** 视图矩形 */
  viewRect: Rectangle;
  /** 渲染矩形 */
  renderRect: Rectangle;
  /** 缩略图缩放率 */
  scale: number;
  /** 视图矩形相对偏移量 */
  offset: {x: number, y: number};
  /** 是否强制过度缩放 */
  isOverScaling: boolean;
}
```

**图层渲染步骤**

1. 第一层：清空画布内容，设置背景色

```ts
// 清空画布
context2D.clearRect(0, 0, canvas.width, canvas.height);

// 设置背景色
context2D.fillStyle = style.canvasBackground;
context2D.fillRect(0, 0, canvas.width, canvas.height);
```

![Minimap Background](/img/in-post/2024-09-20/minimap-bg.png)

2. 第二层：绘制视窗矩形

```ts
context2D.fillStyle = style.viewportBackground;
context2D.fillRect(viewRect.x, viewRect.y, viewRect.width, viewRect.height);
```

![Minimap Viewport](/img/in-post/2024-09-20/minimap-viewport.png)

3. 第三层：绘制节点

```ts
nodeRects.forEach((nodeRect: Rectangle) => {
  context2D.fillStyle = style.nodeColor;
  context2D.roundRect(rect.x, rect.y, rect.width, rect.height, style.nodeRadius);
});
```

![Minimap Nodes](/img/in-post/2024-09-20/minimap-nodes.png)

4. 第四层：绘制蒙层

```ts
context2D.fillStyle = style.overlayColor;

// 上方蒙层
context2D.fillRect(0, 0, canvas.width, (viewRect.y + offset.y) * scale);

// 下方蒙层
context2D.fillRect(
  0,
  (viewRect.y + viewRect.height + offset.y) * scale,
  canvas.width,
  canvas.height - (viewRect.y + viewRect.height + offset.y) * scale,
);

// 左侧蒙层
context2D.fillRect(
  0,
  (viewRect.y + offset.y) * scale,
  (viewRect.x + offset.x) * scale,
  viewRect.height * scale,
);

// 右侧蒙层
context2D.fillRect(
  (viewRect.x + viewRect.width + offset.x) * scale,
  (viewRect.y + offset.y) * scale,
  canvas.width - (viewRect.x + viewRect.width + offset.x) * scale,
  viewRect.height * scale,
);
```

![Minimap](/img/in-post/2024-09-20/minimap.png)

### 4.4 可视窗口拖动导航

1. **监听鼠标按下事件**，以确定是否开始拖动可视视窗。
2. **确定拖动启动条件**，只有当鼠标点击位于可视视窗内部时，才开始拖动。
3. **处理拖动逻辑**，在鼠标移动时更新滚动位置，并重新渲染视窗。
4. **结束拖动**，在鼠标释放后移除相关事件监听，并复位拖动状态。
5. **更新画布滚动位置**，根据拖动的距离更新可视视窗的位置。