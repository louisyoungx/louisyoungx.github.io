---
layout: post
title: Dypend - dynamically add dependencies
subtitle: 一行代码动态加载Python库依赖
author: "louisyoungx"
date: 2021-12-10
header_img: /img/in-post/2021-12-10/header.jpg
catalog: true
tags:
  - chinese
  - python
  - dynamic
  - dependence
  - auto
---

前几天在一个开源项目里遇到好多用户反馈，不会安装依赖，或者执行 `pip install -r requirements.txt` 没有反应。

<!-- more -->

可能造成的原因有很多种，一一排查起来也很麻烦。

想一劳永逸解决这个问题，一般大家都是到 `site-packages` 里面把所需要的包导出来，放到项目根目录。

但这样终究太过粗糙，不符合Python优雅的个性。

所以我就想，能不能动态引入包，如果没有的话，再调用 `pip` 下载。最后也差不多实现了我的设想。

[GitHub - Dypend: Load dependent libraries dynamically.](https://github.com/louisyoungx/dypend)

我大概查了一下，现在好像没有人用过这个方案，我自己使用感觉还是很方便的，分享给大家。

> 虽然想打成library给大家下载的，后来想到这又要依赖pip，违背了做动态依赖的本意
>
> 所以我推荐是使用 `快速开始 - 注入代码运行` 中的方式

## 快速开始

### 通过 `pip` 安装运行

在 `PyPI` 下载 `dypend`依赖包

```shell
pip install dypend
```

在本地生成 `requirements.txt` 依赖文件

```shell
pip freeze >  requirements.txt
```

在项目的入口文件的最上层引入 `dypend` ，不用更改任何其他代码

```python
import dypend
```

这时 `dypend`会检查你的Python环境中是否都有 `requirements.txt` 中的包，如果没有， `dypend`会调用 `pip`下载。

### 注入代码运行

在本地生成 `requirements.txt` 依赖文件

```shell
pip freeze >  requirements.txt
```

在项目的入口文件的最上层添加如下代码，不用更改任何其他代码

```python
import os
import re
REQUIREMENTS = os.getcwd() + '/requirements.txt'
def getDepends():
    requirements = open(REQUIREMENTS, 'r')
    libs = requirements.readlines()
    libList = []
    for lib in libs:
        try:
            name = re.search("^.+(?===)", lib).group(0)
            version = re.search("(?<===).+$", lib).group(0)
            libDict = {
                "name": name,
                "version": version
            }
            libList.append(libDict)
        except:
            continue
    return libList
def importLib():
    """Load python dependent libraries dynamically"""

    libList = getDepends()

    from pip._internal import main as pip_main
    import importlib

    def install(package):
        pip_main(['install', package])

    createVar = locals()

    for lib in libList:
        print(lib)
        try:
            createVar[lib["name"]] = importlib.import_module(lib["name"])
        except Exception as e:
            try:
                install(f'{lib["name"]}=={lib["version"]}')
                createVar[lib["name"]] = importlib.import_module(lib["name"])
            except Exception as e:
                print(e)
importLib
```

这时dypend会检查你的Python环境中是否都有 `requirements.txt` 中的包，如果没有，你会看到depend帮你自动下载。