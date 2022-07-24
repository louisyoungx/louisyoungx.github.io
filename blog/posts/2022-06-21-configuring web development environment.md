---
layout: Post
title: Configuring the Web Development Environment
subtitle: Prepare your dev env in MacOS/Windows
author: louisyoungx
date: 2022-06-21
useHeaderImage: true
headerImage: /img/in-post/2022-06-21/header.jpg
headerMask: rgb(14, 21, 5, .2)
permalinkPattern: /post/:year/:month/:day/:slug/
tags:
  - technology
  - chinese
  - web
---

在 MacOS/Windows 上配置前端开发环境

<!-- more -->

# 在 MacOS/Windows 上配置前端开发环境

> - *MacOS用户* [➡ MacOS必要准备](#macos)
> - *Windows用户* [➡ Windows必要准备](#windows)

## 准备

<div id="macos"></div>

### *MacOS* 必要准备

1. 打开终端shell运行以下命令, 安装[Homebrew](https://brew.sh/)

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. 安装完成后重启shell

3. 输入以下命令安装 `wget` 和 `curl`

```shell
brew install wget curl
```

4. [➡ 配置前端开发环境](#configure)

<div id="windows"></div>

### *Windows* 必要准备

1. 开启Linux子系统（在Windows上默认关闭），必须重启

> 📌 `控制面板` > `程序` > `启用或关闭Windows功能` > **打开以下功能**
> -	Hyper-V
> - 适用于Linux的Windows子系统

2. 在微软应用商店安装 `Windows Terminal` 与 `Ubuntu`

> ⚠️ 此处不要下载以下带版本后缀的Ubuntu，例如：
> - Ubuntu 22.04 LTS 
> - Ubuntu 20.04.4 LTS
> - Ubuntu 18.04.5 LTS

3. 下载Linux内核更新包，[点此下载适用于 x64 计算机的 WSL2 Linux 内核更新包](https://www.catalog.update.microsoft.com/Search.aspx?q=wsl)
4. **以管理员身份** 打开 `Windows Terminal` 并输入命令查看版本

```shell
wsl --set-version Ubuntu 2
wsl -l -v
```

此时若看到以下输出，WSL2安装成功

```shell
  NAME      STATE           VERSION
* Ubuntu    Running         2
```

> 💡 使用WSL1版本的Linux子系统会导致一些x64二进制文件无法被正确执行

5. Linux子系统切换为WSL2后，再次打开Windows Terminal，并在标签栏中选择并打开Ubuntu Shell，初次登录需要配置好账号密码

6. 输入以下命令更新apt包

```shell
sudo apt update
sudo apt upgrade
sudo apt autoremove
```

7. 安装 `wget` 与 `curl`

```shell
sudo apt install wget curl
```

8. [➡ 配置前端开发环境](#configure)

<div id="configure"></div>

9. (Tips: 通过Linux子系统访问Windows文件系统)

Windows文件系统被挂载在Linux子系统的/mnt目录下，Windows的硬盘盘符在此目录下通过文件夹的形式呈现

```shell
cd /mnt    # 切换到 /mnt 目录
ls         # 查看Windows盘符
cd c       # 进入C盘
ls -l      # 查看C盘内容
pwd        # 查看此时路径
```

> 💡 由于Linux的文件系统是ext4，而Windows的文件系统是NTFS，因此若通过Linux子系统对Windows文件系统进行大量IO操作很容易导致阻塞。例如通过Linux子系统在Windows文件系统下运行npm install

## 配置前端开发环境

1. 安装 `nvm`

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

此时nvm不在环境变量中，需要重启shell

2. 安装 `node`

```shell
nvm ls
nvm install --lts
node --version
npm --version
```

3. 切换默认node版本为稳定版

```shell
nvm alias default lts/gallium
nvm use lts/gallium
```

4. 安装yarn与pnpm包管理器

```shell
npm install --global yarn
npm install --global pnpm
```

5. 修改镜像源

切换默认镜像源为淘宝源

```shell
npm config set registry https://registry.npmmirror.com/
yarn config set registry https://registry.npmmirror.com/
pnpm config set registry https://registry.npmmirror.com/
```

> ⚠️ 国内镜像源可能会导致部分包无法安装
>
> 可选镜像源列表:
> - 淘宝源 *(国内推荐)* - https://registry.npmmirror.com/
> - npm官方源 *(npm默认)* - https://registry.npmjs.org/
> - yarn官方源 *(yarn默认)* - https://registry.yarnpkg.com/
> - cnpm源 - http://r.cnpmjs.org/
> - nj源 - https://registry.nodejitsu.com/
> - npmMirror源 - https://skimdb.npmjs.com/registry/
> - edunpm源 - http://registry.enpmjs.org/
> - 腾讯云源 - http://mirrors.cloud.tencent.com/npm/
> - 字节源 - https://bnpm.byted.org/

## 安装zsh（可选）

1. 安装zsh

macos自带zsh，windows的ubuntu子系统需要先通过以下命令安装zsh
  
```shell
sudo apt install zsh
```

2. 切换默认shell到zsh

```shell
chsh -s /bin/zsh
/bin/zsh
```

3. 安装oh-my-zsh

```shell
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## 设置全局Git（可选）

macos与windows的ubuntu子系统都预置了git, 因此无需安装

```shell
git config --global credential.helper store
git config --global user.name 你的用户名
git config --global user.password 你的密码
git config --global user.password 你的邮箱
```