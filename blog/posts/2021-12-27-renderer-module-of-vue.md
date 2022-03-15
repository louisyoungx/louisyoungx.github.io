---
layout: Post
title: Vue.js - Renderer Module
subtitle: Deep Dive into Renderer Modules of Vue.js
author: louisyoungx
date: 2021-12-27
useHeaderImage: true
headerImage: /img/in-post/2021-12-27/header.jpg
headerMask: rgb(14, 21, 5, .2)
permalinkPattern: /post/:year/:month/:day/:slug/
tags:
  - chinese
  - web
  - vue.js
  - principle
  - render
  - javascript
---

[`English Version`](https://rocke.top/post/2021/12/26/renderer-module-of-vue/) | [`中文版本`](https://rocke.top/post/2021/12/27/renderer-module-of-vue/)

本文将以一个轻量级渲染器为例，介绍vue渲染器模块原理。

<!-- more -->

# 深度解析Vue渲染器模块

本文将以一个轻量级渲染器为例，介绍vue渲染器模块原理。

在这篇文章，首先将介绍 `VDOM` 与其结构，然后解释如何将 `VDOM` 转换为 真实 `DOM`，接下来展示`vue`如何根据新旧 `VDOM` 来修补 `DOM`，最后本文例举了使用 `VDOM`的优点。

源代码与在线演示: [CodePen - Renderer Module of Vue.js](https://codepen.io/louisyoungx/pen/yLzPGME)

## **什么是 `VDOM`?**

`VDOM`是指Virtual DOM (虚拟DOM)

这是个真正的DOM

```html
<div class="red">
    <h1 id="title">Hello, world!</h1>
    <p>How are you</p>
</div>
```

这是一个与该DOM对应的虚拟DOM

```jsx
{
    tag: 'div',
    props: {
        class: 'red',
    },
    children: [
        {
            tag: 'h1',
            props: {
                id: 'title',
            },
            children: 'Hello, world!'
        }, {
            tag: 'p',
            children: ['How are you']
        }
    ]
}
```

那么vue如何将这个 `VDOM` 转化为一个真正的 `DOM`？

## **`VDOM` 的结构**

VDOM 可以简单为一个字符串。

> 'div'

VDOM 也可以是一个有三个键的对象：

- `tag`: String(required)
- `props`: Object | null
- `children`: List<Object|String>

### **Tag**

Tag是必须的，Tag的类型应该是一个字符串。

> tag: 'div'

### **Props**

Props 有两种情况

- 类型是 Object

  > props: { class: 'red',}

- 不存在（为null）

  > props: null

### **Children**

Children 有三种情况

- 每项类型是 String

  > children: 'Hello, world!'

- 每项类型是 Array

  > children: [ 'Hello, world!', {     tag: 'p',     children: ['How are you'] }]

- 不存在（为null）

  > children: null

## **如何将 `VDOM` 转换为 `真实DOM` ？**

我们需要根据之前的讨论，在代码中列举所有可能的情况。

### **`Vue.js` 中的 `VDOM`**

这里有一个vue中的vdom

> ⚠️ 请注意这不同于之前提到的VDOM，这里的vnode对象被h函数包裹。

```jsx
const vdom = h(
    "div", // tag
    { // props
        class: "red"
    },
    [ // children
        h("div", null, ["div one"]),
        h("div", null, [
            "div two",
            h("h1", null, "headline one")
            ]
        ),
    ]);
```

而现在的 HTML body 是这样的

```html
<div id="app"></div>
```

### **为什么 `vdom节点` 被包裹在一个 `h` 函数中？**

`h`表示`Hyperscript`，代表 *"生成HTML结构的脚本"* 。

`h`函数将帮助我们创建 `VDOM` 对象，这样我们就不必反复写 `tag` 、`props` 、 `children` 的键名。

`h`函数的简单实现

```jsx
function h(tag, props, children) {
    // if the tag or children is number, change them to string
    if (typeof tag === "number") {
        tag = String(tag)
    } else if (typeof children === "number") {
        children = String(children)
    }
    return {
        tag,
        props,
        children,
    };
}
```

### **挂载 `VDOM` 到目标 `DOM`**

我们需要一个根DOM节点来挂载由VDOM构建的DOM节点

```jsx
const root = document.getElementById("app")
```

接下来我们需要一个 `mount` 函数来帮助我们创建真正的DOM节点，并将它们挂载到容器DOM节点。

```jsx
function mount(vnode, container) {
    let element;

    // is vnode a string
    if (typeof vnode === "string") {
        container.textContent = vnode;
        return;
    } else {
        // if not, create a real dom with value of vnode.tag
        // and store the dom to the vnode object (keep for patch)
        element = (vnode.element = document.createElement(vnode.tag));
    }

    // is props exist
    if (vnode.props) {
        // if exist, set attribute to the dom
        for (let attr in vnode.props) {
            const value = vnode.props[attr];
            // if the attr is function(start with 'on'), add a event listener
            if (attr.startsWith('on')) {
                element.addEventListener(attr.slice(2).toLowerCase(), value)
            } else {
                element.setAttribute(attr, value);
            }
        }
    }

    // is children exist
    if (vnode.children) {
        if (typeof vnode.children === "string") {
            // The value of children is string
            element.textContent = vnode.children;
        } else if (Array.isArray(vnode.children)) {
            // The value of children is array
            for (let child of vnode.children) {
                // Every item of children is a vnode, recurse them with mount function
                mount(child, element);
            }
        }
        container.appendChild(element);
    }
}
```

## **在 `VDOM` 更新时对 `DOM` 进行 `Patch`操作**

将新的VDOM与旧的VDOM进行比较，并patch处理真实的DOM。

### **比较 tag**

如果新的DOM和旧的DOM的tag不同，就替换整个DOM节点。

### **比较 props**

- 找出新添加的prop，并将其添加到DOM中。
- find out the prop no longer exists, and remove it from the dom

### **比较 children**

新与旧VDOM的children有四种类型组合

[Untitled](https://www.notion.so/1cf7876b8a5545d9b45148e0ac0b6294)

我们需要处理所有可能的组合。

### **`patch` 函数**

```jsx
function patch(older, newer) {
    let element = newer.element = older.element;

    // compare the tag
    if (older.tag !== newer.tag) {
        // update the old dom node
        element.innerHTML = ''
        mount(newer, element)
        return
    }

    // compare the props
    const oldProps = older.props || {};
    const newProps = newer.props || {};
    for (let prop in newProps) {
        // find out the newly added prop
        oldValue = oldProps[prop];
        newValue = newProps[prop];
        if (oldValue !== newValue) {
            // if the prop is changed in newer DOM or the prop is newly added
            element.setAttribute(prop, newValue);
        }
    }

    for (let prop in oldProps) {
        // find out the prop no longer exists
        if (!(prop in newProps)) {
            // if the prop is not existed in the newer DOM
            element.removeAttribute(prop);
        }
    }

    // compare the children
    const oldChildren = older.children;
    const newChildren = newer.children;

    if (typeof newChildren === "string") {
        if (typeof oldChildren === "string") {
            // both new children and old children are string
            if (oldChildren !== newChildren) {
                // they are not equal
                element.textContent = newChildren;
            }
        } else if (Array.isArray(oldChildren)) {
            // the new children is string but old children is array
            element.textContent = newChildren; // overwrite the DOM
        }
    } else if (Array.isArray(newChildren)) {
        if (typeof oldChildren === "string") {
            // the new children is array but old children is string
            element.innerHTML = '' // reset this dom node
            for (let child of newChildren) {
                mount(child, element); // recreate the dom nodes with the vnodes in new children
            }
        } else if (Array.isArray(oldChildren)) {
            // both new children and old children are array
            const commonLength = Math.min(oldChildren.length, newChildren.length);
            for (let i = 0; i < commonLength; i++) {
                // Iterate the part that they all have
                patch(oldChildren[i], newChildren[i]);
            }
            if (newChildren.length > oldChildren.length) {
                // if the new children is longer, add the rest vdom node to the dom node
                newChildren.slice(oldChildren.length).forEach(child => {
                    mount(child, element);
                })
            } else {
                oldChildren.slice(newChildren.length).forEach(child => {
                    element.removeChild(child);
                })
            }
        }
    }
}
```

## **使用 `VDOM` 的优点**

### **为什么Vue3仍然使用VDOM？**

vue3 对patch函数做了很多优化。
与我们的轻量级演示相比，Vue3用`v-for`模板语法中的`:key`属性来优化vnode（对应我们的patch函数的第56至71行）

而且Vue3如果没必要的话，可以跳过`props`，`children`部分。同时块优化基本上避免了在大多数节点上调用这部分函数。

> Evan You: In reality, the update is so performant

另一方面，vdom让我们可以直接使用render函数语法，这比模板语法更灵活，而且这个能力对一些库的作者来说是非常重要。

所以Vue3决定坚持使用虚拟DOM，因为它提供了很多好处，同时vue团队还在努力利用编译器使差分尽可能的高效。

总之，与直接生成命令式DOM操作相比，Vue提供了相同级别的性能，同时还提供了降级的能力来使用更灵活的方式表达逻辑。

> Evan You: The goal to have the best of both worlds is achieved in Vue3 that into a certain degree.

## **获取源码**

源代码与在线演示:

[CodePen - Renderer Module of Vue.js](https://codepen.io/louisyoungx/pen/yLzPGME)

> 所有知识点都是提取自 视频 - 尤雨溪深度解析vue3, 所以如果本文有错误的话, 那一定是尤雨溪的错 请在评论区指出。