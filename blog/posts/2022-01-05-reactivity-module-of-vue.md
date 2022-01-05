---
layout: post
title: Vue.js - Reactivity Module
subtitle: Deep Dive into Reactivity Module of Vue.js
author: "louisyoungx"
date: 2022-01-05
header_img: /img/in-post/2022-01-05/header.jpg
catalog: true
tags:
  - english
  - web
  - vue.js
  - principle
  - reactive
  - javascript
---

This article is mainly about how vue reactivity module work, and lightweight reactivity module of vue2 & vue3 is given as an example.

<!-- more -->

In this article, I will introduce what is `reactivity`, how `activeEffect` and `watchEffect` work, then will building a reactivity demo from scratch, then will show how vue2 use `Object.defineProperty`  convert the normal data into a reactive data. Next will explain why vue3 use `Proxy` instead of `Object.defineProperty`, why vue3 store dependences in `WeakMap`, and the defference of `WeakMap` and `Map`.

## What is reactive data in Vue

Reactive data in vue means, once you change the value of it, will automatically trigger(notify) and rerun functions(dependences) that be collected in its subscribers set.

```javascript
// create a reactive object
const msg = new Dependence('This is a message')

watchEffect(() => {
    // This anonymous function is the dependence that needs to be collected
    console.log(msg.value) // OUTPUT - This is a message
})
// if change the value of msg, the dependence function will rerun
msg.value = 'Message updated' // OUTPUT - Message updated
```

## Building reactivity from scratch

So how does Vue do dependency collection?

[Online Demo - Building reactivity from scratch](https://codepen.io/louisyoungx/pen/yLzENNo)

### Save `effect` function to a global variable

There is a global variable called `activeEffect`.

```javascript
let activeEffect // save the function that running in the watchEffect Function
```

The `activeEffect` will save the function that running in a function named `watchEffect`
```javascript
function watchEffect(effect) { // arg effect is a function
    activeEffect = effect
    effect() // effect function should be one synchronous operation
    activeEffect = null
}
```

The arg `effect` of `watchEffect` is a function, the main role of `watchEffect` is:
- Before `effect` run, save this `effect` function to the `activeEffect` variable
- execute the `effect` function
- After `effect` run, set `activeEffect` variable to null

> *Tips: the `effect` function should be a synchronous operation, or the dependence collection won't work as expected*

### `Dependence` class collect `effect` depend

For convenience of understanding, think of `Dependence` as a class.

The `Dependence` class has five methods
- `constructor(value)` - takes a `value` arg as its reactive data
- `get value() ` - rewrite get function of value, to run depend() function before assign.
- `set value()` - rewrite set function of value, to run notify() function after change value
- `depend()` - alias `tracker`, add the dependency function in `activeEffect` to subscriber set
- `notify()` - alias `trigger`, rerun dependency funcntions in subscriber set


```javascript
class Dependence {

    constructor(value) {
        this.subscribers = new Set()
        this._value = value
    }

    get value() {
        this.depend()
        return this._value
    }

    set value(value) {
        this._value = value
        this.notify()
    }

    depend() { // alias - tracker
        // add the function saved in the activeEffect to subscribers
        if (activeEffect) {
            this.subscribers.add(activeEffect)
        }
    }

    notify() { // alias - trigger
        // notify subscriber
        this.subscribers.forEach(effect => {
            effect()
        })
    }
}
```
> *Notice: vue3 extract the `depend` and `notify` logic in to something external,
so that vue can make it reuseable across both `ref` and `reactive` objects.*

### An edge case
A edge case that this demo didn't really cover

[Online Demo - Building reactivity from scratch](https://codepen.io/louisyoungx/pen/yLzENNo)

```javascript
const unlock = new Dependence(true)
const msg = new Dependence('default')

watchEffect(() => {
    if (unlock.value) { // the notify of msg.value is depend on the unlock.value
        console.log(msg.value)
    } else {
        console.log('Locked')
    }
})

msg.value = 'be tracked'

unlock.value = false // the notify of msg.value should not be rerun
msg.value = 'should not be triggered'
unlock.value = true
msg.value = 'should be triggered'
```

even when it's locked, the console.log(msg.value) still be triggered
but the ideal output is nothing
in vue3

before each effect to be run again, we need to clean up its dependency,
so that it recollects its dependencies in fresh.

this is really just say that our current implementation does illustrate the basic ideas,

but it's far from bulletproof in practical-use cases.

so if you're interested, look at the actual source code.

## Reactivity Module of Vue2

[Online Demo - Reactivity Module of Vue2](https://codepen.io/louisyoungx/pen/rNGKVOd)

The actual Dependency module is a little different from our previous demo

let's rewrite the Dependence class
```javascript
class Dependence {
    subscribers = new Set()
    depend() {
        if (activeEffect) {
            this.subscribers.add(activeEffect)
        }
    }
    notify() {
        this.subscribers.forEach(effect => {
            effect()
        })
    }
}
function watchEffect(effect) {
    activeEffect = effect
    effect()
    activeEffect = null
}
```

> *Notice: in vue source code, there is no dependence class, think it a class will make it easier to understand.*

### How Vue2 convert the normal data to a reactive data

In Vue2 Options API, there is a `data` function to store the reactive data

So how vue convert the normal data to a reactive data?

There is a `reactive` function in vue2, it takes a `data` arg,

`reactive` function will traverse all keys in the `data` object, and use `Object.defineProperty()` to rewrite the get and set function.

> *Notice: the reactive data should be an object, the reactive array implementation in vue2 need to change the prototype of `Array`*

```javascript
function reactive(data) {
    Object.keys(data).forEach(key => {
        const dep = new Dependence() // this dep is in a iteration closure
        let value = data[key]
        Object.defineProperty(data, key, {
            get() {
                dep.depend()
                return value
            },
            set(newValue) {
                value = newValue
                dep.notify()
            }
        })
    })
    return data
}
```

> *Notice: the dependence object is saved in a iteration closure*

### Vue2 use `Object.defineProperty` for data hijacking

Vue2 use Object.defineProperty to change the property set/get of Object value

the disadvantage of that is when you add additional properties, need to add them in especially because adding a peoperty doesn't give them automatically getters and setters.

so that vue2 can only convert keys that's already on the object.

## Reactivity Module of Vue3

[Online Demo - Reactivity Module of Vue3](https://codepen.io/louisyoungx/pen/oNGyXbV)

The `Dependence` class implementation of vue3 is the same as vue2.

```javascript
let activeEffect
class Dependence {
    subscribers = new Set()
    depend() {
        if (activeEffect) {
            this.subscribers.add(activeEffect)
        }
    }
    notify() {
        this.subscribers.forEach(effect => {
            effect()
        })
    }
}
function watchEffect(effect) {
    activeEffect = effect
    effect() // effect function should be one synchronous operation
    activeEffect = null
}
```
### Why Vue3 use `Proxy` instead of `Object.defineProperty`

Vue3 use Proxy to handle raw data object.

[Proxy MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

Proxy based implemention, vue are able to detect newly added properties, cause reactivity is on the object, not on the object properties.

Proxy allows to use more trap like `has` or `ownKeys`.

Proxy and it's reativeHandlers works on arrays as well.

The `reactive` function in vue3 is like
```javascript
function reactive(data) {
    return new Proxy(data, reativeHandlers)
}
```

The Proxy need a `reativeHandlers` object.

Why the methods of reativeHandlers return a Reflect?

This is because, when you have objects that with prototypal inheritance, and only in this cases, our receiver and target will actually point to different things.

```javascript
const reativeHandlers = {
    get(target, key, receiver) {
        // get trap
        const dep = getDep(target, key)
        dep.depend()
        return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
        // set trap
        const dep = getDep(target, key)
        const result = Reflect.set(target, key, value, receiver)
        dep.notify()
        return result
    },
    has() {
        // has trap

        // code like:
        // 'msg' in state
        // will trigger this trap
    },
    ownKeys() {
        // ownKeys trap

        // code like:
        // Object.keys(state)
        // will trigger this trap
    }
}
```

In vue2, the dependency subscribers is saved in a iteration closure.

So how vue3 save its dependences?

### Vue3 save dependences in `WeakMap`

Vue3 Save all dependences in a WeakMap

[WeakMap MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
)
#### Why `WeakMap`?

Because a WeakMap can only use objects as keys,
and the nice thing about WeakMap is if this target object itself becomes no longer
accessible from any code, and this target can be garbage collected,
then its associated value entry in the WeakMap will also be garbage collected.

#### Difference of `Map` & `WeakMap`

In comparison, the map it allows you to use anything as a key, and the downside of that is when the key is string or anything, you won't be automatically drop the memory association.

Also, because it doesn't have this garbage collectible property, so the map can be iterated, you can enumerate all the keys.

You can't iterate over WeakMap, because if you can iterate enumerate the keys, the all the keys needs to be essentially kept in a constant reference somewhere, which makes them unable to be garbage collected.


```javascript
const targetMap = new WeakMap() // use WeakMap to storage dependencies of raw data object key property

function getDep(target, key) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Dependence()
        depsMap.set(key, dep)
    }
    return dep
}
```

For each target object, we will have a map, that contains all the deps associated to that object.
[Map MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

## Get source code

Three **Online Demo** with source code

[Online Demo - Building reactivity from scratch](https://codepen.io/louisyoungx/pen/yLzENNo)

[Online Demo - Reactivity Module of Vue2](https://codepen.io/louisyoungx/pen/rNGKVOd)

[Online Demo - Reactivity Module of Vue3](https://codepen.io/louisyoungx/pen/oNGyXbV)

> All knowledge points are extracted from [Evan You's Vue Mastery Course](https://www.vuemastery.com/courses/vue3-deep-dive-with-evan-you/), so if there are errors in this article, ~~it must be Evan You's mistake~~ please point out errors in the comments section.