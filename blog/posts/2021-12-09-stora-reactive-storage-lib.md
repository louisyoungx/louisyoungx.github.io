---
layout: SubPost
title: Stora - reactive storage
subtitle: 超简单的Python状态存储库
author: louisyoungx
date: 2021-12-09
useHeaderImage: true
headerImage: /img/in-post/2021-12-09/header.jpg
headerMask: rgb(14, 21, 5, .2)
permalinkPattern: /post/:year/:month/:day/:slug/
tags:
  - chinese
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

前几天在学Vue.js的源码，发现数据的响应式很有意思，对数据进行修改能触发自定义的操作。所以我在想能否用这样的特性在Python上做个有意思的小工具。

<!-- more -->

然后我写了Stora，一个帮你保存字典数据到本地的Python库

[GitHub - Stora: A simple, reactive local storage library](https://github.com/louisyoungx/stora)

通过Stora保存数据非常简单，不需要手动操作文件api。你只需要更改字典中的数据，Stora就会自动帮你保存到本地的文件。

保存的文件名默认为 `state.json`，文件的存储路径默认为当前执行路径

### 安装

```shell
pip install stora
```

### 通过例子快速入门

```python
from stora import stora
apple = {"name": "Apple", "price": "10", "size": "small"}
s = stora(apple)
print(s.state) # {"name": "Apple", "price": "10", "size": "small"}
```

> **PS:**  你也可以自己决定文件名和路径，比如：\
> `s = stora(apple, filename='apple.json', filepath='~/.data/')`

现在你会发现执行目录中有一个 `state.json`, 你会看到文件中内容已经被修改了。

```json
{
    "name": "Apple",
    "price": "10",
    "size": "small"
}
```

下一次你在同一个路径下初始化一个stora对象，stora将会搜索默认路径下有没有一个叫 state.json 的文件，如果有的话会尝试读取里面的数据并返回一个响应式的字典。

```python
from stora import stora
s = stora()
print(s.state) # {"name": "Apple", "price": "10", "size": "small"}
```

取值和赋值操作是和字典一样的

```python
# Fetching
print(s.state['name']) # Apple
print(s.state['price']) # 10
# Assignment
s.state['name'] = 'Banana'
s.state['price'] = 20
```

这时打开state.json会发现内容改变了

```json
{
    "name": "Banana",
    "price": "20",
    "size": "small"
}
```

但是这里有个容易引起困惑的机制，如果已经有存储了数据的state.json，而你在初始化的时候再次对他赋值，返回的stora状态会是state.json中读取的数据，而非初始化的数据。

```python
from stora import stora
apple = {"name": "Apple", "price": "10", "size": "small"}
s = stora(apple)
print(s.state) # {"name": "Banana", "price": "20", "size": "small"}
```

这是为了防止数据丢失，所以已经存储在现有文件中的数据会有更高的优先级。

但你也可以通过强制重写来初始化stora，或者给stora一个不一样的文件名或路径

```python
s1 = stora(apple, force=True) # 强制重写
s2 = stora(apple, filename='apple-10.json') # 定义不一样的文件名或路径
```

### 求求给个Star吧

更详细的快速开始在[GitHub - Stora: A simple, reactive local storage library](http://link.zhihu.com/?target=https%3A//github.com/louisyoungx/stora)

如果觉得不错就给个star吧！