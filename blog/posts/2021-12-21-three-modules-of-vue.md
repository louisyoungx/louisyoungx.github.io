---
layout: post
title: Vue.js - Three Core Modules
subtitle: Three Core Modules of vue.js
author: "louisyoungx"
date: 2021-12-21
header_img: /img/in-post/2021-12-21/header.jpg
catalog: true
tags:
  - english
  - web
  - vue.js
  - principle
  - javascript
---

Reactivity Module, Compiler Module, Renderer Module

<!-- more -->

## Three core modules

- Reactivity Module
- Compiler Module
- Renderer Module

<img src="/img/in-post/2021-12-21/core-modules.png" alt="core-modules" style="zoom:33%;" />

### Reactivity Module

Reactivity module create JavaScript reactive objects that can be watched for changes.

When code which uses these objects are run they're tracked, so they can be run later if the reactive object changes.

 

<img src="/img/in-post/2021-12-21/reactivity-module.png" alt="reactivity-module" style="zoom:33%;" />



### Compiler Module

Compiler module takes HTML templates and compiles then into render functions.

<img src="/img/in-post/2021-12-21/compiler-module.png" alt="compiler-module" style="zoom:33%;" />

### Renderer Module

Renderer module takes three phases

- Render Phase
- Mount Phase
- Patch Phase

#### Render Phase

The render function is called and it returns a virtual DOM node.

<img src="/img/in-post/2021-12-21/render-phase.png" alt="render-phase" style="zoom:33%;" />

#### Mount Phase

The render takes the virtual DOM node and makes DOM JavaScript calls to create a web page.

<img src="/img/in-post/2021-12-21/mount-phase.png" alt="mount-phase" style="zoom:33%;" />

#### Patch Phase

The render takes the old virtual node and the new virtual node, compares the two and updates only the parts of the web page that have changed using DOM JavaScript calls.

<img src="/img/in-post/2021-12-21/patch-phase.png" alt="patch-phase" style="zoom:33%;" />



## Running Process

- First, the compiler changes the HTML into a render function.

- Then the reactive objects are initialized using the reactivity module.

- Next, the render module enter the render phase.

- Render invokes the render function, whice references the reactive object.

- Observer now watch this reactive object for changes, and the render function returns a vitural DOM node.

- Next, in the mount phase, the mount function is called, using the virtual DOM node to create the web page.

- Lastly, if any changes happen to our reactive object, whice is being watched, the render invokes the render function again, creating a new virtual DOM node.

- Both the new and the old one Virtual DOM node, get sent into the patch function, which then makes updates to our webpage as needed.

