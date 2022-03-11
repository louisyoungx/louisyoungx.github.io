---
layout: Post
title: Stora - reactive storage
subtitle: Simple Python state storage
author: louisyoungx
date: 2021-12-08
useHeaderImage: true
headerImage: /img/in-post/2021-12-08/header.jpg
headerMask: rgb(14, 21, 5, .2)
permalinkPattern: /post/:year/:month/:day/:slug/
tags:
  - english
  - python
  - library
  - reactive
  - storage
  - state
  - json
  - dict
  - auto
  - save
---

[`English Version`](https://rocke.top/post/2021/12/09/stora-reactive-storage-lib/) | [`中文版本`](https://rocke.top/post/2021/12/09/stora-reactive-storage-lib/)

When I learning source code of vue.js, I found it has a reactive data, you can trigger something if you change the reactive data, like do some state manage. so I'm wondering if python could do some interesting things like that.

<!-- more -->

Then I made Stora, means Storage and Reactive.

[GitHub - Stora: A simple, reactive local storage library](https://github.com/louisyoungx/stora)

Stora allows you to save dict to local extremely easily. There’s no need to manually open file and read, or save file after change your dict data — but nowadays, just editor the state, and Stora will automatically save for you!

You can use `pip install stora` to install Stora package from pypi.

Stora will save data as `state.json` in **current working directory**.

```python
from stora import stora
apple = {"name": "Apple", "price": "10", "size": "small"}
s = stora(apple)
print(s.state) # {"name": "Apple", "price": "10", "size": "small"}
```

> **PS:** *You can also decide the filename and filepath.*
>
> ```python
> s = stora(apple, filename='apple.json', filepath='~/.data/')
> ```

Now open `state.json`, you will see:

```json
{
    "name": "Apple",
    "price": "10",
    "size": "small"
}
```

If change the `s.state`, you will find `state.json` also changed!

```python
s.state["name"] = "Banana"
s.state["price"] = "20"
```

Data in `state.json`

```json
{
    "name": "Banana",
    "price": "20",
    "size": "small"
}
```

