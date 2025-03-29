---
layout: Post
title: Component-based thinking in no-code
subtitle: Comparison of React, Vue, and Web Components design ideas
author: louisyoungx
date: 2023-01-08
useHeaderImage: true
headerImage: /img/in-post/2023-01-08/header.jpg
headerMask: rgb(14, 21, 5, .2)
permalinkPattern: /post/:year/:month/:day/:slug/
tags:
  - technology
  - chinese
  - builder
  - vue.js
  - react.js
  - javascript
---

无代码中的组件化思想

<!-- more -->

# 无代码中的组件化思想

通过对React，Vue，Web Components组件设计思想的归纳来思考无代码组件。

> 通过现有社区的组件化方案引申出对无代码组件的思考。

## 1. 组件化思想

组件化是什么，将内部高度耦合的业务合并到一个独立封闭的环境内，与外部环境相互隔离，仅通过暴露的有限接口与外界交互。无论是`React`，`Vue`，`Web Components`都是根据这一*高**内聚**，低耦合*的思想产生的组件的概念，甚至代码组织上也非常类似。

`Web Components`的代码结构和`React Class Component`很相似，而视图描述又接近`Vue Template`。`React Hooks`和`Vue Composition API`非常类似。虽然设计上各有不同，但本质都是对**视图**，**状态**，和**逻辑**的封装，最后实现一定程度的**可复用性**。

`Web Component`由于是`HTML`的原生特性，因此可以在`React`组件和`Vue`组件内无缝调用。甚至基于以上的共同特征，`React`组件和`Vue`组件可以互相调用。

> 通过这个库可以实现`React`与`Vue`组件相互调用，代码仅仅几百行
>
> https://github.com/akxcv/vuera

## 2. 组件特性

虽然`React`，`Vue`，`Web Components`的思想是共通的，有很多共同点，但他们也有各自的特点。

### 2.1 共同点

- 组件具有属性（`Property`），外界通过向组件传参来与组件通信
- 组件不向外部暴露实现细节，仅通过属性暴露有限个API
- 组件都可维护自己的视图实现

### 2.2 Web Components

- 没有状态管理，内部状态完全交给`JavaScript Class State`
- 组件内部可以维护视图实现，但也可以从`DOM`上获取模版作为组件视图

### 2.3 React

- 组件内部可以创建组件运行时的不可变状态 `useState`
- 当函数状态（`props`, `state`）变动时，触发组件重新渲染

### 2.4 Vue

- 组件内部可以创建组件运行时的可变状态 `reactive` | `ref`
- 组件状态与视图是相互绑定的
- 组件状态更新时，触发视图部分更新

## 3. 组件示例

> 和本文关系不大，见附录：组件示例

## 4. 无代码组件

1. 组件单一性职责(纯组件)
2. 组件属性强类型
3. 数据状态与组件在协议上解耦合
4. 单一引用源
5. 引用数据扁平化与查询全异步
6. 状态与操作

### 4.1 组件单一职责

组件需要最大程度地保证单一职责，一个组件只应该做一件事情。

组件不能具有副作用，内部实现不能对外部有依赖。例如组件内部不应该主动调用API。

组件内部的状态应该在任何时候都是可确定的，根据`props`入参即可完全确定一个组件的内部状态。`Props => State`

组件与外部依赖有关和会产生副作用的内部属性都必须暴露到属性申明上。例如组件输入框的value更改时会触发一次search请求，那这个value需要在组件属性上有所体现，以便数据源对这一属性进行监听，并对组件重新渲染。

### 4.2 组件属性强类型

> 还有一种弱类型方案，所有组件属性底层都是表达式（Retool方案）

组件属性带有强类型。无代码组件之间不能进行通信，但能在一个组件的属性上对另一个组件属性值进行引用，这需要组件属性的类型被事先确定，且类型之间需要严格匹配。

> 类型校验实现参考 https://github.com/microsoft/TypeScript/issues/27024

组件属性分为公开与私有，默认属性为私有，私有属性只有组件自身能够访问，公开属性会暴露给用户，且能够在其他相同类型的组件属性中对这一属性进行「引用」。

组件属性分为可变与不可变，默认不可变。注意这里的不可变是在Runtime侧，而非设计器搭建时。

组件拥有自身属性的所有权，能对属性进行修改，但组件不能修改引用属性的值。

> PS：此处我认为的类型不是Type，而是可以挂载各种Trait方法的Struct，参考Rust

### 4.3 数据状态与组件定义在协议上解耦合

组件定义：组件的视图，组件的属性定义

数据状态：UIDL，页面结构，页面中组件实例的属性配置

> 即使是在写代码时，我们抽离出一个组件后，不会把这个组件的实现和业务代码存放在一起，而是会将组件的代码统一存放到各个模块共享的`components/`目录，使用时再通过`import`导入。
>
> ```TypeScript
> // 业务代码
> import { MyComponent } from '@kunlun/shared-components'
> 
> <MyComponent title="Hello" />
> ```

### 4.4 单一引用数据源

数据源会对页面上所有页面内引用数据与外部引用数据进行管理，这里的「数据源」是指「引用数据源系统」，非引用数据并不交给这一系统维护。

页面中所有引用数据都必须交给数据源统一维护，每一个页面/子页面/复合组件都会有一个数据源实例。数据源的作用域仅限他所在的页面/子页面/复合组件。

数据源会对引用数据进行管理，如果该引用数据是一个可变的组件属性，则需要对所有这一值进行监听，观察到变更则对引用这一值的组件状态进行更新。

数据源暴露对引用数据进行更改的API，也需要提供对这一更改操作作用相反的API（撤销）。

数据源会托管页面内的引用数据。对于外部数据引用，数据源仅进行代理，且不能缓存。

数据源托管的页面内的引用数据属于页面状态的一部分，当有操作直接修改这一状态时，数据源应直接对页面状态进行更新，并对引用值进行更新。

数据源本身应该是无状态的，数据源不应该在页面数据中存储任何数据，仅会在页面初始化时建立引用索引。

### 4.5 引用数据扁平化与查询全异步

数据源托管的页面内引用数据的存储必须是扁平的，不能存在层级关系。

引用数据的读取必须全是异步的，即便这一引用数据就存储在当前应用中。

这能确保对引用数据读取方式的一致性。

### 4.6 状态与操作

> 考虑到撤销/重做功能，状态管理应借鉴`Redux`方案

#### 4.6.1 统一状态管理与操作

组件实例的每一个属性配置都是该示例的一个状态。不同于写代码时可以在不同的作用域下定义很多状态，在无代码场景下，组件状态处于页面作用域，每个组件都可以访问到此页面下所有公开的属性。

如果某个状态对应的属性是可变的，可以对这一状态进行操作，所有操作都会挂载在类型Struct的Trait方法上。

#### 4.6.2 可变状态不能直接修改

组件实例内可变状态也是不可被直接修改的，否则可能会导致一些引用这一状态的组件值不会被更新。

可变状态的修改只能通过与类型Struct关联的Trait方法上的操作实现。

#### 4.6.3 操作创建新的状态

每次操作前的状态和操作后的状态都是两个不同的状态。

并且有状态栈对每一步操作的状态进行保存。

#### 4.6.4 操作类别

- 普通数据操作直接重置上一操作的状态，并通过数据源系统更新引用值
- 引用数据操作，通过数据源系统提供的操作取反API
- 副作用操作(状态未记录且不可取反)

#### 4.6.5 状态更改引发视图更改

每次组件状态更改都会引起该组件以及引用这一值的组件重新渲染。

## 附录：组件示例

### 1. Web Components 示例

```HTML
<!DOCTYPE html>
<html>

<head>
  <title>Custom Element</title>
</head>

<body>
  <div>
    <h1>Web Component Test</h1>
    <!-- 在文档上暂存表述一个模版 -->
    <template id="studentTemplate">
      <style>
        li {
          color: cyan;
          list-style: none;
        }
      </style>
      <li>
        <span class="name-label">名称：</span>
        <span class="name"></span>
        <span>｜</span>
        <span class="score-label">成绩：</span>
        <span class="score"></span>
      </li>
    </template>
    <test-element></test-element>
    <!-- 在这里挂载模版实例 -->
    <ul id="students"></ul>
  </div>

  <script type="text/javascript">
    class TestElement extends HTMLElement {
      constructor() {
        super()
        // 创建一个shadow DOM来对样式做隔离
        const shadowDOMRoot = this.attachShadow({
          mode: "open"
        })
        this.shadowDOMRoot = shadowDOMRoot
      }
      connectedCallback() {
        const students = [{
            name: "小张",
            score: 90
          },
          {
            name: "小王",
            score: 70
          },
          {
            name: "小李",
            score: 85
          },
          {
            name: "小朱",
            score: 90
          },
          {
            name: "小刘",
            score: 75
          },
        ]

        students.forEach(student => {
          const template = document.getElementById("studentTemplate")
          const templateContent = template.content.cloneNode(true)
          this.shadowDOMRoot.appendChild(
          templateContent) // 向shadow DOM注册模版内容

          this.shadowDOMRoot.querySelector('.name').innerHTML = student.name
          this.shadowDOMRoot.querySelector('.score').innerHTML = student.score

          document.getElementById("students").appendChild(this.shadowDOMRoot) // 向列表添加元素
        })
      }
    }
    // 注册自定义组件元素
    customElements.define('test-element', TestElement)
  </script>
</body>

</html>
```

### 2. React Components 示例

```TypeScript
import { action, makeObservable, observable } from 'mobx'
import React, { type FC, useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react'

// 全局状态
export class GlobalState {
  public initialized = false
  public unmounted = false
  // 状态响应式
  constructor() {
    makeObservable(this, {
      initialized: observable,
      disposed: observable,
      setup: action,
      dispose: action,
    })
  }
  // 全局状态初始化
  public setup() {
    this.initialized = true
  }
  // 全局状态卸载
  public dispose() {
    this.unmounted = true
  }
}

// 组件入参类型定义
export type MyComponentProps = {
  title: string
  globalState: GlobalState // 全局状态作为入参传入
}

// 组件视图逻辑定义
export const MyComponent: FC<MyComponentProps> = observer((props: MyComponentProps) => {
    console.log('组件重新渲染') // 生命周期：重新渲染
    const { title, globalState } = props
    const [value, setValue] = useState<number>(0) // 计数

  // 生成一个函数
  const buttonHandler = useCallback(() => {
    setValue(value + 1)
    // 声明依赖项
  }, [value])

  useEffect(() => {
    console.log('组件初始化') // 生命周期：初始化
    globalState.setup() // 更改全局状态
    return () => {
      globalState.dispose() // 更改全局状态
      console.log('组件卸载') // 生命周期：卸载
    }
    // 没有依赖，只会运行一次
  }, [])

    return (
        <div>
            <h1>{title}</h1>
            <button onClick={buttonHandler} className='button'>
                已点击 {value} 次
            </button>
        </div>
    )
})

// 通过mobx提供的全局状态，可以实现组件间数据消费
export const StateComponent: FC<{ globalState: GlobalState }> = observer(
  ({ globalState }) => {
    return <p>当前初始化状态：{globalState.initialized ? '未初始化' : '已初始化'}</p>
  },
)
```

### 3. Vue Components 示例

```TypeScript
<script setup>
  import {
    ref,
    onMounted
  } from 'vue'

  const count = ref(0)

  const increment = () => {
    count.value++
  }

  onMounted(() => {
    console.log(`初始化值是 ${count.value}`)
  })
</script>

<template>
  <button @click="increment">点击计数: {{ count }}</button>
</template>
```