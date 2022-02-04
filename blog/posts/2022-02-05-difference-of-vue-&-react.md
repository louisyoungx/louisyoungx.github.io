---
layout: post
title: Difference of React & Vue
subtitle: The difference between React & Vue design philosophy
author: "louisyoungx"
date: 2022-02-05
header_img: /img/in-post/2022-02-05/header.jpg
catalog: true
tags:
  - english
  - web
  - vue.js
  - react.js
  - principle
  - javascript
---

Just few days ago, I learned functional programming and React. As you know, I’m a Vue developer, So in this article, I gonna talking about the dfference of React & Vue.

<!-- more -->

## Flexibility & Reuse

In terms of flexibility, if React has 90% flexibility, Vue has about 30% flexibility.

My personal understanding of these two framework is:

***React = JavaScript + Functional Programming + JSX***

***Vue = Syntactic Sugers (Vue APIs)***

The flexibility of React is bring by [`JavaScript modules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

Every React component is a [`JavaScript object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), written by [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) syntax (contains state) or [`function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)`syntax (functional component without state).

In comparison, every Vue component is combined by Vue syntax apis *(with `template`, `scirpt`, `styles`),* you need to follow the api syntax that Vue provided to fill in the corresponding views,  data, methods and life cycle hooks. This design philosophy is borrowed from [`HTML`](https://developer.mozilla.org/en-US/docs/Glossary/HTML) labels.

So the impact of this difference is, React is very easy to get started for experienced developers who are familiar with javascript and functional programming, and Vue is easier for web development beginners to get started. 

For team development, the code written by React may have various formats, while the Vue code written by each person is basically the same. The Vue code is easier for the team to maintain than the React code.

In huge web project, the way Vue components organized is more disadvantageous than the **ESM-based** React components which can be split up very thoroughly.

However, the excessive flexibility of React `JSX` leads to a lack of information available for optimization at runtime, we will talk it later.

## Consistency of Views & Data

The main point of modern web framework is **Consistency of Views & Data**

If the Vue is more like automatic transmission. In comparison, React is more like manual transmission.

Vue use a feature named `reactive` to ensure the consistency of data, by contrast React need to manually call `setState` to update the date.

However I would like to clarify, **Two-way binding** for forms is just a **one-way binding** of value + a syntactic sugar for `onChange` event listening.  This isn't really a conceptual difference between React and Vue. Also, **unidirectional dataflow** is not a difference between Vue or React, but a common tacit choice between Vue and React. The core of **unidirectional dataflow** is to avoid the design of component's own state *(reusable in the future)*, and it emphasizes hoisting out the state for centralized management.

## Reactive & setState

**What I really think is the conceptual difference between React and Vue, and the irreversible impact on subsequent design implementations is** that Vue does data interception/proxy, which is more sensitive and accurate in detecting data changes, and indirectly provides great convenience for some subsequent implementations *(e.g. hooks, function based APIs)*. React promotes **functionalism** is a direct **partial re-flash (or *re-rendering*)**, which is more brutal, but simpler, just a refresh. **But React doesn't know when it's "supposed to refresh", and triggering a partial re-render is done by the developer manually calling** `setState`**.**

React `setState` causes partial refreshes. To achieve better performance, React provide the **lifecycle hook** `shouldComponentUpdate` to developers to avoid unnecessary **re-rendering**. In contrast, **Vue is optimized by default due to its dependency tracking:  you move as much data as you want to trigger an update.** **React is not aware of data changes, it  provide** `React.createElement` **to call already generated** `virtual dom`**.** On the other hand, **React merges the setState behavior to compensate for unnecessary updates.** So setState is sometimes updated `asynchronously`, but not always "`asynchronously`".

By design, this cause an additional "**mental burden**" for the developers and raises some potential issues. By comparison, Vue's `reactive` philosophy of data interception and proxying doesn't have similar problems.

**This design difference has a direct impact on the implementation and performance of hooks.**

## Hooks & .value

The underlying of React hook is based on a **chained table** *(`Array`)* implementation, where all hooks are executed sequentially each time a component is rendered.

Because of the **chain table**, the next of each hook points to the next hook, so developers cannot use judgment conditions in different hooks calls. This is because `if` judgment conditions will cause incorrect order, and cause an error.

The following code will report an error:

```jsx
function App() {
	const [name, setName] = useState('lucas')
	if (condition) {
		const [val, setVal] = useState('')
	}
}
```

On the contrary, Vue hooks only registered once. The fundamental reason why Vue can avoid these troubles is that **its reactive of data is based on reactivity, and it proxies the data. It doesn't need a chain of hooks to record, it proxies the data directly**.

And Vue being reactivity has its own problems. For example, `ref()` returns a value wrapper *(wrapped object)*. A wrapper object has only an attribute  `.value`, which points to the value being wrapped internally. We know that in JavaScript, primitive value types such as `string` and `number` have only values, not references. Whether we use `Object.defineProperty`*(Vue2)* or `Proxy`*(Vue3)*, we can't track subsequent changes to primitive variables. So Vue has to return a wrapper object, otherwise it can't proxy and intercept data for basic types. This is a very minor side effect of the design philosophy.

This is an example given by evan:

```jsx
function useMousePosition() {
	const x = ref(0)
	const y = ref(0)
	
	const update = e => {
		x.value = e.pageX
		x.value = e.pageY
	}

	onMounted(() => {
		window.addEventListener('mousemove', update)
	})

	onUnmounted(() => {
		window.removeEventListener('mousemove', update)
	})

	return {x, y}
}
```

## Event

The React event system is large and complex. The events it provide to developers are not native events, they are React wrapped synthetic events, and the most important is **synthetic events are pooling**. This means that different events may share a single synthetic event object. Another detail is that React proxies all events, binding all events to the document.
Also, `this` in the event handler in React does not point to the component instance by default, while `this` in the Vue event handler points to the component instance by default.

## Pre-compilation Optimization

Vue3 proposes the idea of dynamic and static `DOM` diff. The reason why it can do `DOM` diff *(pre-compilation optimization)* is that Vue core can statically analyze the template, when parsing the template, the whole parse process is to use regular expressions to parse the template sequentially, when parsing to the `start tag`, `closure tag` or `text`, it will execute the corresponding callback function respectively, to achieve the purpose of constructing `AST` tree.

Vue needs to do **two-way data binding** and **data interception** or **proxy**, so it needs to statically analyze the template in the `pre-compilation` stage to analyze what data the view depends on, and do some dependencies collecting.

React is all about partial **re-rendering**, which only need to deal with a bunch of recursive `React.createElement` calls, which can't be statically analyzed at the template level.

So the excessive flexibility of React JSX leads to a lack of information available for optimization at runtime.