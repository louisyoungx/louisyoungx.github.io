---
layout: post
title: Vue.js - Renderer Module
subtitle: Deep Dive Renderer Modules of Vue.js
author: "louisyoungx"
date: 2021-12-26
header_img: /img/in-post/2021-12-26/header.jpg
catalog: true
tags:
  - english
  - web
  - vue.js
  - principle
  - render
  - javascript
---

[`中文版本`](https://juejin.cn/post/7046015093875671076)

This article is mainly about how vue renderer module work, and a lightweight renderer is given as an example.

<!-- more -->

In this article, will introduce `VDOM` and the structure of the `VDOM`, then will explain how to convert the `VDOM` to a `Real DOM`, next will show how vue diff the new and old `VDOM` to patch the `DOM`. Finally will give the benefits of using VDOM.

You can get the source code with the Online Demo: [CodePen - Renderer Module of Vue.js](https://codepen.io/louisyoungx/pen/yLzPGME)

## What is `VDOM`?

`VDOM` means Virtual DOM.
Let's compare real DOM and virtual DOM.

It's a real dom

```html
<div class="red">
    <h1 id="title">Hello, world!</h1>
    <p>How are you</p>
</div>
```

and the virtual dom equivalent of this real dom is

```json
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

So how vue transform this `VDOM` to a real dom?

## The structure of the `VDOM`

The VDOM could be as simple as a string.

> ```json
> 'div'
> ```
>
> VDOM also can be a object with three keys

- `tag`: String(required)
- `props`: Object | null
- `children`: List<Object|String>

### Tag

A tag is required. And the type of tag should be a String.

> ```json
> tag: 'div'
> ```

### Props

Props has two situation

- instance of Object

  > ```json
  > props: {
  >  class: 'red',
  > }
  > ```

- not exist

  > ```json
  > props: null
  > ```


### Children

Children has three type of situations

- The value can be a string

  > ```json
  > children: 'Hello, world!'
  > ```

- The value also can be a array

  > ```json
  > children: [
  >  'Hello, world!',
  >  {
  >      tag: 'p',
  >      children: ['How are you']
  >  }
  > ]
  > ```

- not exist

  > ```json
  > children: null
  > ```

## How to convert the `VDOM` to the `real DOM`?

As we discussed before, we need to discuss all possible scenarios, including the different types of the three keys listed above.

### `VDOM` in `Vue.js`

Here is a vdom in vue

> ⚠️ Please notice that this `VDOM` is different from the previous `VDOM`, it's vnode wrapped with `h` function.

```javascript
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

And the HTML body is now like this

```html
<div id="app"></div>
```

### Why `vdom node` is wrapped in a **`h`** function ?

`h` means `Hyperscript`, stands for *"script that generates HTML structures"*

It will help us to create the `VDOM` object, so we don't have to write `tag`, `props`, `children` key name over and over again.

The `h` function is like

```javascript
function h(tag, props, children) {
    return {
        tag,
        props,
        children,
    };
}
```


### Mount `VDOM` to `DOM`

We need a root dom node to mount dom that created by us. 

```javascript
const root = document.getElementById("app")
```

Next we need a `mount` function to help us create real dom node and mount them to their container dom node.

```javascript
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
            element.setAttribute(attr, value);
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

## Patch the `DOM` while `VDOM` update

Diff the new vdom to the old vdom and patch the real dom.

### Compare the tag

If the tag of new vdom and old vdom is different, replace the entire dom node.

### Compare the props

- find out the newly added prop, and add it to the dom
- find out the prop no longer exists, and remove it from the dom

### Compare the children

There are four type combinations of new and old vdom children

| new children | old children |
| ------------ | ------------ |
| String       | String       |
| String       | Array        |
| Array        | Array        |
| Array        | String       |

We need to handle all possible combinations.

### `patch` function

```javascript
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

## Benefits of using `VDOM`

### Why Vue3 still using VDOM?

Vue3 has made a lot of optimizations to the patch function.

Compare to our lightweight demo, Vue3 optimize vnode with the `:key` attribute in `v-for` template syntax (corresponding to lines 56 to 71 of our patch function)

And Vue3 can also skip the `props`, `children` part if it's not necessary. At the same time, the block optimization essentially avoids having to call this on most of the nodes.

> Evan You: In reality, the update is so performant

Otherwise, vdom can let us directly use render function syntax, which is much more flexible that the template syntax. This capability has proven to be really useful and important for library authors.

So Vue3 decided to stick to virtual DOM because of the benefits that it provides, and at the same time vue team is still trying to leverage the compiler to make the diffing as efficient as possible.

In conclusion, compare to generate direct imperative DOM operations, Vue provide the same class of performance, and the same time still provide the ability to drop down to use a more flexible language to express logic.

> Evan You: The goal to have the best of both worlds is achieved in Vue3 that into a certain degree.


## Get source code

You can get the final code with this
**Online Demo**

[CodePen - Renderer Module of Vue.js](https://codepen.io/louisyoungx/pen/yLzPGME)

> All knowledge points are extracted from [Evan You's Vue Mastery Course](https://www.vuemastery.com/courses/vue3-deep-dive-with-evan-you/), so if there are errors in this article, ~~it must be Evan You's mistake~~ please point out errors in the comments section.