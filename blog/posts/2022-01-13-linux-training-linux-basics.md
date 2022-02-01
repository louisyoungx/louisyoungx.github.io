---
layout: post
title: Linux Training 1 - Linux Basics
subtitle: Linux培训(一) Linux基础操作
author: "louisyoungx"
date: 2022-01-13
header_img: /img/in-post/2022-01-13/header.jpg
catalog: true
tags:
  - chinese
  - linux
  - training
---

各linux发行版特点，安装wsl2，virtualbox虚拟机，yum和apt，常用指令，安全习惯，vi与vim基础操作

<!-- more -->

## Linux基础知识

**Linux 主要应用领域**：服务器

**Linux 创作者**： Linus Torvalds

**Linux 主要发行版**：Ubuntu, Debain, Fedora, CentOS, RedHat

### 主要发行版与优缺点（按劝退程度排行）

#### Ubuntu

国内乃至全球热门的Linux发行版。也是各种推荐入门Linux爱好者安装的一个Linux发行版。它的特点主要有以下：

- 安装简单，包管理器很完善
- 对一些专有驱动支持比较好，例如显卡驱动
- 社区也非常活跃，个人用户确实很多，几乎遇到的问题都可以找到答案，所以从市面上看的确比较大众化。
- 版本更新较快，基本半年一个版本

#### Debian

几大基础发行版之一，Ubuntu就是基于Debian的。它的基本有如下特点：

- **Free**，**最符合开源精神的发行版**。
- 不求新，但求稳。软件包通常选择比较稳定的版本而不是最新的版本
- 系统的开发维护完全是由社区驱动的
- APT软件包管理
- 图形化安装方式对新手友好

>  默认不包含任何专有驱动

#### Fedora

`Fedora`其实和`RedHat`也同属一个派系，背后的支撑企业也是红帽子公司。但是`Fedora`是免费发行版，而且更加侧重于新技术的试验和加持，因此稳定性方面的考量较`CentOS`会稍微次要一些。

- **YUM**包管理（新的包管理方式正在研发中）
- 新技术吸纳较快，所以喜欢尝试新技术的可以选择它
- 官网提供多种桌面环境镜像，可以满足不同桌面喜好的用户（默认是Gnome）
- 由红帽赞助支撑
- 基本半年发布一个新版本
- 图形化安装对新手友好

> **Fedora** 作为实验版本，快速迭代更新各种新功能；而这些特性被评估为稳定版本以后则会添加到 RHEL 中

#### Arch Linux

每一个骨灰级Linux桌面用户的最终选择。`Arch`的确比较适合好奇心强的人尝鲜，它的官方`Wiki`做得好，`AUR`仓库很繁荣，适合`DIY`玩家去折腾，确实也吸引了不少粉丝。

- **轻量级，**从选择键盘布局到分区硬盘到安装引导全部由你决定，所以不像前面几个发行版一样会预装一些常用软件
- pacman软件包管理工具
- **灵活，整个系统完全由你说了算，当然你得有对应的能力**
- **完备的WIKI，**从安装到使用再到故障排除非常之详细
- **WIKI中文化程度很高**

#### CentOS

`CentOS`可以理解为是基于`RedHat`商业版系统的社区编译重发布版，完全开源免费，因此相较于其他一些免费的`Linux`发行版会更加稳定，也因此一般企业里常用作服务器操作系统。

- 稳定

> 12 月 8 日，CentOS 项目宣布，CentOS 8 将于 2021 年底结束，而 CentOS 7 将在其生命周期结束后停止维护。
>
> CentOS 官方发文称 CentOS Stream 才是 CentOS 项目的未来，在接下来的一年里，将逐步把开发工作的重心从 CentOS 往 CentOS Stream 转移。
>
> 注意⚠️ `CentOS Stream` 不能用于企业生产环境！

#### RedHat

`RHEL（Red Hat Enterprise Linux）`毕竟是商业版`Linux`系统，一般多用于企业生产环境，提供完善的商业支持，在性能、稳定性方面也有很大的保障。

- 稳定
- 有红帽公司的商业支持（顶级）

## Windows Linux子系统与WSL2

1. 开启linux子系统（在windows上默认关闭），必须重启

> 控制面板 > 程序 > 启用或关闭Windows功能 > 适用于Linux的Windows子系统 > 重启

2. 在微软应用商店安装 `Windows Terminal` 与 `Ubuntu` (各版本均可)

3. 下载Linux内核更新包 [适用于 x64 计算机的 WSL2 Linux 内核更新包](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

4. 以管理员身份打开 `Windows Terminal `并输入命令，并查看版本

```shell
wsl --set-default-version 2
wsl -l -v
```

5. 搜索之前安装的Ubuntu，打开即可

## Linux虚拟机

### Virtualbox 和 CentOS 的安装

[VirtualBox](https://www.virtualbox.org/wiki/VirtualBox) 6.1.30 下载

- [ Windows hosts](https://download.virtualbox.org/virtualbox/6.1.30/VirtualBox-6.1.30-148432-Win.exe)
- [ OS X hosts](https://download.virtualbox.org/virtualbox/6.1.30/VirtualBox-6.1.30-148432-OSX.dmg)
- [Linux distributions](https://www.virtualbox.org/wiki/Linux_Downloads)
- [ Solaris hosts](https://download.virtualbox.org/virtualbox/6.1.30/VirtualBox-6.1.30-148432-SunOS.tar.gz)
- [ Solaris 11 IPS hosts](https://download.virtualbox.org/virtualbox/6.1.30/VirtualBox-6.1.30-148432-Solaris.p5p)

CentOS8.1 ISO: http://mirrors.aliyun.com/centos/8.1.1911/isos/x86_64/CentOS-8.1.1911-x86_64-dvd1.iso
CentOS7 ISO:  http://mirrors.aliyun.com/centos/7/isos/x86_64/CentOS-7-x86_64-DVD-2009.iso

> 可选（需要购买密钥）VMware Workstation 16 Windows下载：https://www.vmware.com/go/getworkstation-win

### Virtualbox的必要配置

1. 设置 `主机键`

   > 工具 > 全局设定 > 热键 > 虚拟电脑 > 主机组合键（设成键盘上有的按键）

2. 进入虚拟机命令行如果鼠标键盘被独占，按 `主机键` 即可退出。

3. 虚拟机界面按 `主机键+C` 即可自动调整分辨率（但菜单消失）

### 安装 CentOS 时，设置自助分区（本例共20G）

- `boot`：引导分区，分配大小为1G（500M也可以）。

- `swap`：交换分区，分配大小2G（虚拟机swap和分配内存一样即可，物理服务器分配按照下面的方案）


    * 运存 < 4GB，swap空间 = 运存大小*2


    * 4GB < 运存 < 16GB，swap空间 = 运存大小


    * 运存 > 16GB，swap空间 = 随意，最好不要为0


- `根分区`：分配大小为剩下的17.5G。安装的软件和文件都在此分区。

### 虚拟机的网络连接模式

**`桥接模式`**：虚拟系统可以和外部系统通讯，虚拟机IP和主机IP处在同一字段。 
若同一网络下有较多计算机接入时，容易造成IP冲突。

**`NAT 模式`**：网络地址转换模式。虚拟系统可以和外部系统通讯。 
通过主机代理上网，虚拟机IP和主机IP不在同一字段。 
 主机产生虚拟网卡，该虚拟网卡和虚拟机IP在同一字段。若同一网络下有较多计算机接入时，不会造成IP冲突。

**`主机模式`**：独立的系统，虚拟系统不可以和外部系统通讯。

### 虚拟机的克隆

如果已经安装了一台 Linux 操作系统，还想要更多的，没有必要再重新安装，只需要克隆就可以。

`方式一`：直接拷贝一份安装好的文件；

`方式二`：使用 Virtualbox 的克隆操作。注意，克隆时，需要先关闭要克隆的 Linux 系统。

### 虚拟机的快照

如果在使用虚拟机系统的时候（比如 Linux系统），想回到原先的一个状态，也就是说担心有些误操作造成系统异常，需要回到原先某个正常运行的状态。Virtualbox 也提供了这样的功能，就叫快照管理。

### 虚拟机的迁移和删除

虚拟系统安装好了，它的本质就是文件（放在文件夹的），因此虚拟系统的迁移很方便，你可以把安装好的虚拟系统这个文件夹整体拷贝或者剪切到另外的位置使用。删除也很简单，用Virtualbox进行彻底删除。

## 常用指令

### 开关机指令

不管是重启系统还是关闭系统，首先要运行 sync 命令，把内存中的数据写到磁盘中。

  * shutdown -h now：立即进行关机
  * shutdown -h 1：1分钟后自动关机（和 shutdown 命令效果一样）
  * shutdown -r now：现在重新启动计算机
  * halt：关机（上面的 -h 就是指 halt）
  * reboot：现在重新启动计算机
  * sync：把内存的数据同步到磁盘


  * 在提示符下输入 logout / exit 即可注销用户。

### 文件系统指令

**ls 指令**

  * ls -alh ：显示包括隐藏的全部文件、列表形式、人性化形式。

**cd 指令**


  * cd ~ ：回到家目录
  * cd ..：回到上一级目录

**mkdir 指令**


  * mkdir 要创建的目录：创建一个目录
  * mkdir -p 要创建的多级目录：创建多级目录

**rmdir 指令**


  * rmdir 要删除的空目录：只能删除空目录
  * rm -rf 要删除的目录：递归、强制删除非空的目录

**cp 指令**


  * cp 源文件 复制后的文件
  * cp -r 源文件目录 复制后的文件目录：递归复制整个文件夹

**mv 指令**


  * mv 原文件名 修改后的文件名：重命名文件
  * mv 原文件或文件目录 移动后的文件目录：移动文件或整个文件夹

**cat 指令**


  * cat：只能浏览文件，而不能修改文件。
  * 为了浏览方便，一般会带上管道命令“| more”。如cat -n 文件名 | more ，实现分页浏览（-n 显示行号）。

**less 指令**

less 用来分屏查看文件内容，它的功能与 more 指令类似，但是比 more 指令更加强大，支持各种显示终端。less
指令在显示文件内容时，并不是一次将整个文件加载之后才显示，而是根据显示需要加载内容，对于显示大型文件具有较高的效率。

  * 命令：less 要查看的文件。

**echo 指令**


  * echo 内容：echo 输出内容到控制台。
  * 使用 echo指令输出环境变量，例如输出当前的环境路径：echo $PATH。

**head 指令**


  * head 文件名：查看文件前10行内容。
  * head -n 5 文件名：查看文件前5行内容，5可以是任意行数。

**tail 指令**


  * tail 文件名：查看文件后10行内容。
  * tail -n 5 文件名：查看文件后5行内容，5可以是任意行数。
  * tail -f 文件名：实时追踪该文档的所有更新，工作经常使用。

**ln 指令**

软链接也叫符号链接，类似于 Windows 里的快捷方式，主要存放了链接其他文件的路径。

  * ln -s 原文件或目录 软链接名：给原文件创建一个软链接。

### 实用指令

**history 指令**

查看已经执行过历史命令,也可以执行历史指令。

  * history：查看已经执行过历史命令。
  * !历史命令行数：执行历史命令行数所对应的命令。

**date 指令**


  * date：显示当前时间.
  * data+%Y：显示当前年份。
  * data+%m：显示当前月份。
  * data+%d：显示当前是哪一天。
  * date "+%Y-%m-%d %H:%M:%S"：显示年月日时分秒。
  * date -s 字符串时间：设置系统时间。

**cal 指令**


  * cal：显示本月日历。

**find 指令**

find 指令将从指定目录向下递归地遍历其各个子目录，将满足条件的文件或者目录显示在终端。

  * find 搜索范围路径 -name 文件名：在搜索范围内按文件名搜索。
  * find 搜索范围路径 -user 用户名：在搜索范围内按用户名搜索。
  * find 搜索范围路径 -size +n：在搜索范围内按文件大小搜索，+n 表示大于 n，-n 表示小于 n，n 表示等于 n，n 的单位可以有
    k、M、G。

### 压缩与解压

**gzip/gunzip 指令**


  * gzip 要压缩的文件：压缩文件，只能将文件压缩为*.gz 类型的文件。
  * gunzip *.gz：解压缩文件命令。
  * 当使用gzip对文件进行压缩后，不会保留原来的文件。

**zip/unzip 指令**


  * zip *.zip 要压缩的文件：压缩文件。
  * zip -r *.zip 要压缩的目录：压缩目录。
  * unzip *.zip：解压缩文件。
  * unzip -d 解压后文件的存放路径 *.zip：指定解压后文件的存放目录。

**tar 指令**

tar指令是打包指令，最后打包后的文件是 *.tar.gz 格式的文件。

  * tar -zcvf *.tar.gz 打包的文件或者目录：打包压缩文件或者目录。
  * tar -zxvf *.tar.gz：解压 *.tar.gz 文件到当前目录。
  * tar -zxvf *.tar.gz -C 解压后文件的存放路径：解压 *.tar.gz 文件到指定目录。

## Linux 目录结构

  * **Linux 目录结构**

Linux 系统的文件结构是采用级层式的树状目录结构，在 Linux 世界里，一切皆文件。Linux 系统里的硬件也转换成了文件的形式。

* `/bin`：是 Binary 的缩写，这个目录存放着是最常使用的命令。
* `/dev`：系统设备文件目录，除cpu外的所有的硬件设备都会抽象成特殊的文件放在这里，虚拟设备也放在这里。
* `/home`： 存放普通用户的主目录。
* `/root`： 该目录为系统管理员，也称作超级权限者的用户主目录。
* `/etc`： 所有系统管理需要的配置文件和子目录。
* `/usr`：一个非常重要的目录，用户的许多应用程序和文件都放在这个目录下。
* `/proc`： 是一个虚拟的目录，它是系统内存的映射。访问这个目录来获取系统信息。
* `/media`：Linux 系统会自动识别一些设备，例如U盘、光驱等等。当识别后，Linux系统会把识别的设备挂载到这个目录下。
* `/mnt`：系统提供该目录是为了让用户临时挂载别的文件系统，可以将外部的储存挂载到 /mnt 上，如 Windows 和 Linux的共享文件夹。
* `/boot`：系统启动文件和内核，在有些发行版中还包括grub，grub是一种通用的启动引导程序。
* `/lib`、`/lib64`：库文件，包含了所有系统和用户需要的程序文件，64表示64位，但实际上除特殊的库，大部分还是链接到了lib目录下。
* `/media`：磁盘设备自动挂载的位置。按照用户分类，每一个用户目录下有其磁盘目录。
* /`opt`：一般存放第三方软件。
* `/sbin`：系统和系统管理员用到的程序工具。
* `/sys`：与proc类似的虚拟文件系统，都是内核提供给用户的接口，可读可写。
* `/tmp`：系统使用的临时空间，重启后会清空。
* `/var`：包含一些用户可变的或临时的文件，比如log文件、邮件队列、网络下载的临时文件等等。

## yum和apt安装软件包的基本操作

### YUM（基于RPM）

#### RPM 包的管理

一种用于互联网下载包的打包及安装工具，它包含在RedHat，CentOS 发行版中。它生成具有.RPM 扩展名的文件。RPM 是 RedHat Package Manager（RedHat 软件包管理工具）的缩写。

  * RPM 包名基本格式  
    RPM 包名：firefox-45.0.1-1.el6.centos.x86_64.rpm
    * 名称：firefox
    * 版本号：45.0.1-1
    * 适用操作系统：el6.centos.x86_64表示64位系统
    * 如果是 i686、i386表示32位系统，noarch 表示通用


  * RPM 包的其它查询指令
    * rpm -qa：查询所安装的所有 rpm 软件包
    * rpm -qa | more：分页显示
    * rpm -qa | grep 软件包名：查询所安装的是否有该软件包
    * rpm -qi 软件包名：查询软件包信息
    * rpm -ql 软件包名：查询软件包中的文件
    * rpm -qf 文件全路径：查询文件所属的软件包，如rpm -qf /etc/passwd


  * 卸载 RPM 包
    * rpm -e RPM 软件包名：-e 代表 earse


  * 细节问题
    * 如果其它软件包依赖于要卸载的软件包，卸载时则会产生错误信息。
    * 如果就是要删除这个 rpm 包，可以增加参数
      --nodeps，就可以强制删除，但是一般不推荐这样做，因为依赖于该软件包的程序可能无法运行。如：rpm -e --nodeps foo，带上
      --nodeps 就是强制删除。


  * 安装 RPM 包
    * rpm -ivh RPM 软件包路径：软件包必须已下载到磁盘
    * 参数说明：i=install 安装、v=verbose 提示、h=hash 进度条

#### YUM包管理器

YUM 是一个 Shell 前端软件包管理器。基于 RPM 包管理，能够从指定的服务器自动下载 RPM
包并且安装，可以自动处理依赖性关系，并且一次安装所有依赖的软件包。使用 YUM 的前提是可以联网。

  * YUM 的基本指令
    * 查询 YUM 服务器是否有需要安装的软件：yum list | grep 软件名
    * 安装指定的 YUM 包：yum install 软件名

### APT包管理器

`apt`简化的 `apt-get` 接口，它是专为交互式使用而设计的。

##### apt update

```text
sudo apt update
```

每次下载或更新本地软件时最好先执行`apt update`指令从服务器更新本地包仓库，从而获取最新版本的软件。

##### apt upgrade

将本地软件更新到仓库中最新版本，执行以下指令

```text
# 更新所有软件
sudo apt upgrade
```

如果只想更新指定软件而非所有软件，执行以下指令

```text
# 找出可更新的软件
apt list --upgradeable
# 更新指定的软件
sudo apt upgrade <package_1> <package_2> ...
```

有些软件更新时需要输入`y/n`确认是否安装，如果不想输入的话可以在`apt upgrade`后面加`-y` Flag

```text
sudo apt upgrade -y
```

通常为了方便，我们将上面提到的`apt update`和`apt upgrade`写在一行

```text
sudo apt update && sudo apt upgrade -y
```

##### apt install

安装指令软件，执行以下指令

```text
sudo apt install <package_1> <package_2> ...
```

有些软件安装时需要输入`y/n`确认是否安装，如果不想输入的话可以在`apt install`后面加`-y` Flag

```text
sudo apt install -y <package_1> <package_2> ...
```

默认情况下`apt install`安装的软件都是最新版本的，如果想安装老版本的软件可以在软件名后面加`=version`

```text
# 安装 mysql-5.7
sudo apt install mysql-server=5.7
```

##### apt remove/purge

删除指定软件，执行以下指令

- apt remove只会删除软件本身，相关配置文件依旧保留
- apt autoremove 删除相关配置文件
- apt purge会将软件和配置信息一起删除

```text
# apt remove只会删除软件本身，相关配置文件依旧保留
sudo apt remove <package_1> <package_2> ...
# 如果执行了上面的指令后，想要删除相关配置文件，只需要执行下面这条指令即可
sudo apt autoremove

# apt purge会将软件和配置信息一起删除
sudo apt purge <package_1> <package_2> ...
```

##### apt list

```text
sudo apt list
```

`apt list`命令会列出所有的软件，包括仓库中的、已安装的和可更新的软件等，但是**不建议直接执行该指令**，最好搭配`grep`命令一起使用

```text
sudo apt list | grep <package_name>
```

如果只想查看已下载的软件，执行以下指令

```text
sudo apt list --installed
```

查看可更新的软件，执行以下指令

```text
sudo apt list --upgradeable
```

##### apt show

```text
sudo apt show <package_name>
```

`apt show`命令会列出软件的包依赖、版本、大小等等信息

## 使用linux需要注意的安全习惯及基本权限管理

1. 不要给普通用户和root设置相同密码。
2. ssh暴露在公网的机器千万不要使用弱密码，ssh必须禁用root用户。

3. 登录时不用 `root` 账号登录。

> 为避免操作失误，可以先用普通用户登录，登录后用 `su 用户名` 命令来切换成系统管理员身份。

4. 如无必要，不要使用`root`用户，而用`sudo`代替

5. 涉及根目录 `/` 的操作一定要有警惕之心。

> **警告**⚠️不要在删目录的时候输成 `sudo rm -rf /*`

6. 合理的命名你的文件

> 只使用字母、数字、连接符(-)和下划线(_)

7. 多用户系统要注意用户权限

## 远程登录到 Linux 服务器

远程登录软件推荐： [Xshell6](https://www.netsarang.com/en/free-for-home-school/), [Xftp](https://www.netsarang.com/en/free-for-home-school/), [Termius](https://termi.us/win)

### 基础用法

在 Linux 系统上 SSH 是非常常用的工具，通过 SSH Client 我们可以连接到运行了 SSH Server 的远程机器上。SSH Client 的基本使用方法是：

```text
ssh user@remote -p port
```

- user 是你在远程机器上的用户名，如果不指定的话默认为当前用户
- remote 是远程机器的地址，可以是 IP，域名，或者是后面会提到的别名
- port 是 SSH Server 监听的端口，如果不指定的话就为默认值 22

例如：

- 用户名 `louis`
- 域名 `foo.bar`
- 端口 `10020`
- 命令

```shell
ssh louis@foo.bar -p 10020
```

### 密钥登录

每次 ssh 都要输入密码是不是很烦呢？与密码验证相对的，是公钥验证。也就是说，要实现免密码登入，首先要设置 SSH 钥匙。

#### 生成本地ssh密钥

执行 ssh-keygen 即可生成 SSH 钥匙，一路回车即可。

```shell
➜  ~ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/louis/.ssh/id_rsa):

Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/louis/.ssh/id_rsa.
Your public key has been saved in /home/louis/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:+++++++++++++++ louis@centos
The key's randomart image is:
+---[RSA 2048]----+
|                 |
|                 |
|                 |
|.o.              |
|X.+.  p S        |
|%R+. . + .       |
|#B= o . o        |
|*N=+ = .         |
|*==+*+*.         |
+----[SHA256]-----+
```

这段话告诉了我们，生成的公钥放在了 ~/.ssh/id_rsa.pub，私钥放在了 ~/.ssh/id_rsa。

#### 把ssh密钥上传到目标服务器

接下来，我们要让远程机器记住我们的**公钥**。最简单的方法是 `ssh-copy-id user@remote -p port`

例如：

```shell
ssh-copy-id louis@foo.bar -p 10020
```

ssh-copy-id 在绝大多数发行版上都有预装，在 Mac 上可以通过 `brew install ssh-copy-id` 一键安装。

#### 配置别名

如果我不想每次登录都输入 `ssh louis@foo.bar -p 10020`

而是想用 `ssh lab` 替代，可以在 ` ~/.ssh/config ` 配置如下

```shell
Host lab
    HostName foo.bar
    User louis
    Port 10020
```

### 传输文件

在两台机之间传输文件可以用 scp，它的地址格式与 ssh 基本相同，都是可以省略用户名和端口，稍微的差别在与指定端口时用的是大写的 -P 而不是小写的。不过，如果你已经配置了别名，那么这都不重要，因为 scp 也支持直接用别名。scp 用起来很简单，看看下面的例子就明白了：

```shell
# 把本地的 /path/to/local/file 文件传输到远程的 /path/to/remote/file
scp -P port /path/to/local/file user@remote:/path/to/remote/file

# 也可以使用别名
scp /path/to/local/file lab:/path/to/remote/file

# 把远程的 /path/to/remote/file 下载到本地的 /path/to/local/file
scp lab:/path/to/remote/file /path/to/local/file

# 远程的默认路径是家目录
# 下面命令把当前目录下的 file 传到远程的 ~/dir/file
scp file lab:dir/file

# 加上 -r 命令可以传送文件夹
# 下面命令可以把当前目录下的 dir 文件夹传到远程的家目录下
scp -r dir lab:

# 别忘了 . 可以用来指代当前目录
# 下面命令可以把远程的 ~/dir 目录下载到当前目录里面
scp -r lab:dir/ .
```

### 服务器ssh安全设置

修改ssh配置文件`sudo vim /etc/ssh/sshd_config`

```shell
# 修改以下几项
Port 10000
# 更改SSH端口，最好改为10000以上，别人扫描到端口的机率也会下降。防火墙要开放配置好的端口号，如果是阿里云服务器，你还需要去阿里云后台配置开发相应的端口才可以，否则登不上哦！如果你觉得麻烦，可以不用改
 
Protocol 2
# 禁用版本1协议, 因为其设计缺陷, 很容易使密码被黑掉。
 
PermitRootLogin no
# 尝试任何情况先都不允许 Root 登录. 生效后我们就不能直接以root的方式登录了，我们需要用一个普通的帐号来登录，然后用su来切换到root帐号，注意 su和su - 是有一点小小区别的。关键在于环境变量的不同，su -的环境变量更全面。
 
PermitEmptyPasswords no
# 禁止空密码登陆。
```

重启 sshd 服务

```shell
service sshd restart
```


## Vi 和 Vim 编辑器基本操作

### 三种模式


  * `一般模式`：用 Vim 打开一个文件就直接进入正常模式（默认模式）。在这个模式中，可以上下左右移动光标、删除整行、复制、粘贴等等。
  * `编辑模式`：在正常模式下，键入 i，I，o，O，a，A，r，R 任何一个字母之后才会进入插入模式。
  * `命令行模式`：在插入模式下，键入 Esc 进入正常模式，再输入 :
    进入命令行模式。在此模式下，可以查询、替换、保存、退出、显示行号等等。

### 基本操作

现在有一个 `config.yaml `文件

1. 用vim编辑器打开该文件，使用方向键移动光标

```shell
vim config.yaml
```

2. 进入编辑模式修改文件，输入`i`即可，使用方向键移动光标

```shell
按i键
```

3. 编辑完成，按 `ESC` 退回到正常模式

```shell
按ESC键
```

4. 按 `:` 键进入命令模式，输入 `wq` 保存退出（w为写入，q为退出）

```shell
按:键
wq
```
