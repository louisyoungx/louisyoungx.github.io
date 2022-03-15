---
layout: Post
title: Linux Training 3 - Vim advanced & Linux tasks & Services
subtitle: Linux培训(三) Vim进阶和Linux任务与服务
author: louisyoungx
date: 2022-01-26
useHeaderImage: true
headerImage: /img/in-post/2022-01-26/header.jpg
headerMask: rgb(14, 21, 5, .2)
permalinkPattern: /post/:year/:month/:day/:slug/
tags:
  - chinese
  - linux
  - training
---

vim进阶操作与宏，crontab定时，自定义服务，环境变量，ssh配置文件，开机自启

<!-- more -->

## vim进阶操作

### 用 VIM 打开文件

#### 如何用 VIM 一次性打开多个文件呢？

现在有多个文件 file1 ，file2 , ... ,filen.

现在举例打开两个文件 file1，file2 

```
vim file1 file2
```

该方式打开文件，显示屏默认显示第一个文件也就是 file1，如何进行文件间的切换呢？

> VIM 的正常模式下（参考上文关于正常模式的描述）按下键盘上的冒号 `：`这时会在显示屏底部出现冒号 `：`（进入了 VIM 的命令模式），然后在输入 ls ，屏幕上会出现打开的所有文件的序号和文件名，我们继续输入冒号 `：` ，然后输入 bn (这里的 n需要做一个解释并不是键盘上的 n ,而是文件序号的代指，如 b1 代表显示屏上切换到第一个文件，b2 代表显示屏上切换到第二个文件)。

```
:ls
```

上面这个命令将会列出 VIM 打开的所有文件。

```
:b2
```

上面的这个命令将会在显示屏上显示第二个文件。

### VIM 的退出

强制保存但是不退出文件

```
:w!
```

退出所有的文件，对所有的文件修改都不做保存

```
:qa!
```

退出文件并保存对文件的修改

```
:x
```

打开另一个文件

```
:e file
```

放弃对文件的所有修改，恢复文件到上次保存的位置

```
:e!
```

另存为 file

```
:saveas file
```

当打开多个文件的时候可以输入 `:bn` 和 `:bp` 进行上一个文件或者下一个文件的切换

```
:bn` 和 `:bp
```

### VIM 的输入模式

#### VIM 的代码提示功能

在编辑模式下 ，快捷键 Ctrl+n 或者 Ctrl+p 会有代码提示功能，我们可以实现快速录入的效果。

### VIM 的命令模式

#### VIM 处理大小写的区分

编辑器将不会区分大小写，如果你进行该设置之后，进行关键字查询如 /target 如果文本中有 target ,Target,....,只要是字符相同不会区分大小写都会进行匹配

```
:set ic
```

该命令用来区分大小写的查询

```
:set noic
```

#### VIM 删除多行文本

n1 和 n2 指的是起始行号和结束行号，d 是删除关键字

```
:n1,n2d
```

#### VIM 处理文本的替换

作用范围分为当前行、全文、选区等等

```
:{作用范围}s/{目标}/{替换}/{替换的标志}
```

将会把当前光标所在行的 target 替换成 handsome

```
:s/target/handsome/g
```

将会把全文中的 target 替换成 handsome

```
:%s/target/handsome/g
```

这里的 n1 和 n2 值得是行号，将会替换掉 n1 到 n2 的所有 target 为 handsome

```
:n1,n2s/target/handsome/g
```

选区，在可视模式下选择区域后输入` : `，VIM 会自动补全为 `:'<,'>`。

```
:'<,'>s/target/handsome/g
```

> 这个操作咋一看起来有点懵逼，这个操作是可视模式 (Visual-mode) 下选区中的替换操作（可视模式下文会谈到），可视模式下输入`：`会自动补全 `:'<,'>` 这个是可视范围下的操作范围，类似于 % 和 n1,n2，代表操作的文本范围，上面的例子就是替换掉可视区域的 target 为 handsome。

下面来谈谈替换的标志。

上文中命令结尾的 `g `即是替换标志之一，表示全局 `global `替换（即替换目标的所有出现）。 还有很多其他有用的替换标志：

空替换标志表示只替换从光标位置开始，目标的第一次出现

作用于当前行，从光标处开始查找替换，仅仅替换第一次匹配 target 的地方为handsome 。

```
:s/target/handsome
```

替换掉文件中所有行第一次出现 target 的地方为 handsome 。

```
:%s/target/handsome
```

i 表示大小写不敏感查找，I 表示大小写敏感：

替换掉所有行第一个出现 target (不区分大小写) 为 handsome 。

```
:%s/target/handsome/i
```

替换掉所有行出现 target (不区分大小写) 为 handsome 。

```
:%s/target/handsome/gi
```

c 表示需要确认，例如全局查找"target"替换为"handsome"并且需要确认：

```
:%s/target/handsome/gc
```

#### VIM 执行 Linux 命令

```
:!command
```

`:` 后面紧跟着 `!` ，`!` 后面紧跟着 linux 命令（ command 指操作 Linux 系统的一系列命令，如创建文件，新建文件夹，查询文件的属性的等），例子如下，

```
:!date
```

执行 date 命令显示时间，执行完命令以后按下键盘上的 Enter 就会返回到文件。

#### VIM 执行命令，并且添加结果至操作文本光标处

```
:r !command
```

: 后面紧跟着 r , r 后面是空格，紧接着是 !command( command 解释同上)，例子如下，

```
:r !date 
```

执行 date 命令显示时间，并且添加命令结果到文本中。

#### 定义快捷键

下面举例说明：

```
:map ^M I#<ESC>
```

上面的例子也就是通过快捷键 `Ctrl + m` 在文件光标处所在行的行首插入 # （ # 代表注释）。

`:` 后面的 map 是关键字 ，后面是 key 和 value 。

key 对应的是 ^M ， 这个 key 需要强调一下 ^M 是 Ctrl + v + m 打出来的（按下这三个键，VIM 会显示成 ^M ）,^M 代表快捷键是`Ctrl + m` , Ctrl + v + n 就是 ^N ,代表快捷键是 Ctrl + n 。Ctrl + v + x 就是 ^X (这里的 x 是代表 26 个字母中的任意一个) 代表快捷键 `Ctrl + x`。

value 对应的是 `I#<ESC>`,表示按下快捷键以后执行的相应操作，`I` 是切换光标至行首并切换到编辑模式，`#`是行首输入的内容（ # 是VIM 文件中的注释符号 ），`<ESC>` 是退出编辑模式。 

举例如下：

`:map ^D Ahelloworld<ESC>`表示在文件的光标所在行的行尾，添加 helloworld 字符串，按住组合键 ctrl + d 就会执行操作。

### VIM 的正常模式（Normal-model）

#### 大小写转换

- ~ 将光标下的字母改变大小写
- 3~ 将光标位置开始的3个字母改变其大小写
- g~~ 改变当前行字母的大小写
- gUU 将当前行的字母改成大写
- guu 将当前行的字母全改成小写
- 3gUU 将从光标开始到下面3行字母改成大写
- gUw 将光标下的单词改成大写。
- guw 将光标下的单词改成小写

#### VIM 的重复命令

. 该命令是重复上一个操作的命令
`n<command>`重复某个命令 n 次，
如 10p复制 10 次，10dd 删除十次。

### VIM 可视化模式（Visual-mode)

#### 可视化模式下 v 的特殊操作

当操作的文本光标在 “”，‘’ ，（），{} ，[（双引号，单引号，小括号，大括号，中括号）
当中的时候,可以通过 va"选中 ”“ 内的所有内容包括双引号 ，vi" 选中 "" 内的所有内容，不包括 ""。va,vi 会快速选择区域，va 后面会紧跟一个区域结束标志，a 会选中结束符标志，i 就不会。例子如下：

"hello world [VI**M** is so strong],{we all can master vim skill}"

假设当前光标定位在上面的文本 M 处：
va] 操作将会选中以下文本（加粗部分）：
“hello world***[VIM is so strong]***,{we all can master vim skill}“
vi] 操作将会选中如下的区域，没有包含 []：
“hello world [***VIM is so strong\***],{we all can master vim skill}“

#### 块区域下的特殊操作

Ctrl+v 选中块区域以后，按下大写的 I 或者 A 可以在区域的前面或者后面输入内容，按下 jj 或者 `<ESC>`,可以看到选中的区域前面或者后面会有输入的内容。

## crontab 定时任务

### 任务调度概念

系统在某个时间执行的特定的命令或程序。  

  * 系统工作：有些重要的工作必须周而复始地执行。如病毒扫描等；
  * 个别用户工作：个别用户可能希望执行某些程序，比如对 mysql 数据库的备份。

### 基本语法

#### 快速入门

##### 任务要求

每一分钟自动调用 ls -l /etc >> /tmp/to.txt

##### 操作步骤

* 执行 crontab -e 命令
* 接着输入自动调度命令到调度文件（/etc/crontab），即 */1 * * * * ls –l /etc/ >> /tmp/to.txt
* 保存退出调度文件

#### 5个占位符说明

| 占位符  | 含义               | 范围                    |
| ------- | ------------------ | ----------------------- |
| 第一个* | 一小时中的第几分钟 | 0-59                    |
| 第二个* | 一天中的第几小时   | 0-23                    |
| 第三个* | 一月中的第几天     | 1-31                    |
| 第四个* | 一年中的第几月     | 1-12                    |
| 第五个* | 一周中的星期几     | 0-7（0和7都代表星期日） |

#### 特殊符号说明

| 特殊符号 | 含义                                                         |
| -------- | ------------------------------------------------------------ |
| *        | 代表任何时间。比如第一个*就代表一小时中每分钟都执行一次的意思。 |
| ,        | 代表不连续的时间。比如`0 8,12,16 * * *`命令代表每天的8点0分，12点0分，16点0分都执行一次命令。 |
| -        | 代表连续的时间范围。比如`0 5 * * 1-6`命令代表在周一到周六的凌晨5点0分执行命令。 |
| _        | 代表每隔多久执行一次。比如`_ /10 * * * *`命令代表每隔10分钟就执行一次命令。 |

#### 特定时间执行任务案例

| 特定时间       | 含义                                                         |
| -------------- | ------------------------------------------------------------ |
| `45 22 * * *`  | 在每天22点45分执行命令。                                     |
| `0 17 * * 1`   | 每周一的17点0分执行命令。                                    |
| `0 5 1,15 * *` | 每月1号和15号的凌晨5点0分执行命令。                          |
| `40 4 * * 1-5` | 每周一到周五的凌晨4点40分执行命令。                          |
| `*/10 4 * * *` | 每天的凌晨4点，每隔10分钟执行一次命令。                      |
| `0 0 1,15 * 1` | 每月1号和15号，每周一的0点0分都会执行命令。注意：星期几和几号最好不要同时出现，因为定义的都是天，容易让管理员混乱。 |

#### crontab 任务调度实例

1. 每隔1分钟，将当前日期和日历都追加到 `/home/mycal` 文件中。

* `vim /home/my.sh` 写入内容 `date >> /home/mycal` 和 `cal >> /home/mycal`
* 给 `my.sh` 增加执行权限，`chmod u+x /home/my.sh`
* 执行 `crontab -e` 命令，增加 `*/1 * * * * /home/my.sh`
* 保存退出调度文件

2. 每天凌晨2:00，将 mysql 数据库 testdb，备份到文件 mydb.bak 中。提示指令：`mysqldump -u root -p 密码 数据库 > /home/mydb.bak`

* 执行 `crontab -e` 命令
* 增加 `0 2 * * * mysqldump -u root -proot testdb > /home/mydb.bak`
* 保存退出调度文件

#### crontab 常用选项

| 选项 | 描述                          |
| ---- | ----------------------------- |
| -e   | 编辑 crontab 定时任务         |
| -l   | 查询 crontab 任务             |
| -r   | 删除当前用户所有 crontab 任务 |

>  * crontab -r: 终止任务调度。
>  * crontab –l：列出当前所有任务调度。
>  * service crontab restart：重启任务调度。

## 服务管理（service / systemctl）

服务本质就是进程，但是是运行在后台的，通常都会监听某个端口，等待其它程序的请求，比如 (mysql、sshd、防火墙等)，因此又称为守护进程

### service

`service`命令用于管理`Linux`操作系统中服务的命令。

这个命令不是在所有的`linux`发行版本中都有。主要是在`redhat`、`fedora`、`mandriva`和`centos`中。

service 服务名 [start | stop | restart | reload | status]

> 在 CentOS 7.0 后 不再使用 service ,而是 systemctl（后面专门介绍）。

service 指令管理的服务在 /etc/init.d 查看，即 ls -l /etc/init.d 命令。

#### service 基本语法

service 服务名 [start | stop | restart | reload | status]

service 管理指令示例

```shell
# 查看所有服务当前的运行状态
service --status-all

# 查看指定服务（vsftpd）的运行状态
service vsftpd status

# 停止指定服务（vsftpd）
service vsftpd stop

# 启动指定服务（vsftpd）
service vsftpd start

# 重启网络服务
service network restart
```

#### 服务的运行级别  

Linux 系统有7种运行级别（runlevel）：常用的是级别3和5。

* 运行级别 0：系统停机状态，系统默认运行级别不能设为0，否则不能正常启动。
* 运行级别 1：单用户工作状态，root 权限，用于系统维护，禁止远程登陆。
* 运行级别 2：多用户状态(没有 NFS)，不支持网络。
* 运行级别 3：完全的多用户状态(有 NFS)，登陆后进入控制台命令行模式。
* 运行级别 4：系统未使用，保留。
* 运行级别 5：X11 控制台，登陆后进入图形 GUI 模式
* 运行级别 6：系统正常关闭并重启，默认运行级别不能设为6，否则不能正常启动。

CentOS 7后运行级别说明

* 在 /etc/initab 进行了简化，multi-user.target 等同于运行级别3，graphical.target
  等同于运行级别5。
* systemctl get-default：获取当前的运行级别；
* systemctl set-default multi-user.target：将默认运行级别设置为 mulit-user。

### chkconfig

`chkconfig`实用程序是一个命令行工具。

在指定运行级别下启动所选服务，以及列出所有可用服务及其当前设置。

从启动中启用或禁用服务。（需要sudo权限）

所有的服务脚本位于`/etc/init.d`文件中，可通过` ls -l /etc/init.d `查看。

`chkconfig` 重新设置服务自启动或关闭后，需要重启机器才能生效。  

> 注意：CentOS 7.0之后，很多服务使用 systemctl 管理。

#### 基本语法

* chkconfig --list | grep 服务名
* chkconfig 服务名 --list
* chkconfig --level 5 服务名 on/off

#### 应用实例

* 将 sshd 服务在运行级别5下设置为不自动启动：chkconfig --level 5 sshd off
* 显示当前系统所有服务的各个运行级别的运行状态：chkconfig --list
* 将 network 服务在运行级别3下设置为不自动启动：chkconfig --level 3 network off

### systemctl 管理指令

#### 基本语法

* systemctl [start | stop | restart | status] 服务名
* service 指令管理的服务在 /usr/lib/systemd/system 查看，即 ls -l
  /usr/lib/systemd/system 命令。


* systemctl 设置服务自启动状态
  * systemctl list-unit-files| grep 服务名：查看服务开机启动状态，使用 grep 进行过滤。
  * systemctl enable 服务名：设置服务开机自启动。
  * systemctl disenable 服务名：关闭服务开机自启动。
  * systemctl is-enable 服务名：查询某个服务是否开机自启动。


* 查看服务名
  * 使用 ls -l /usr/lib/systemd/system 命令查看需要的服务名。


* 服务运行级别
  * systemctl [start | stop] 服务名 一般在运行级别3和5执行，没有再作具体区分。

#### 应用案例  

查看当前防火墙的状况，关闭防火墙和重启防火墙。

* 使用 ls -l /usr/lib/systemd/system 命令查看防火墙服务名为 firewalld.service。
* systemctl status firewalld
* systemctl stop firewalld
* systemctl start firewalld

#### 细节讨论

* 关闭或启用防火墙后，立即生效。
* 这种方式只是临时生效，当重启系统后，还是回归以前对服务的设置。
* 如果设置某个服务自启动或关闭永久生效，要使用 systemctl [enable/disable] 服务名。

## 环境变量

Linux是一个多用户的操作系统。多用户意味着每个用户登录系统后，都有自己专用的运行环境。而这个环境是由一组变量所定义,这组变量被称为环境变量。用户可以对自己的环境变量进行修改以达到对环境的要求。

> 环境变量顾名思义就是系统启动后整个运行环境的配置变量。记录了系统的一些基本信息包括可执行文件路径，用户，HOME路径，SHELL类型等等。通过env命令可以查看系统的当前所有环境变量。

环境变量有三种：

- 全局环境变量
- 用户环境变量
- 临时环境变量

> 全局环境变量放在/etc/profile中，这些环境变量对系统中的所有用户都有效;
>
> 用户环境变量放在用户的家目录下也就是./.bashrc (不同的shell会有不同的rc文件,zsh是.zshrc),这些环境变量对该用户有效;
>
> 临时环境变量是在shell上赋值输出的环境变量，只在当前shell有效。

### 全局环境变量

> 对所有用户生效的永久性变量

这类变量对系统内的所有用户都生效，所有用户都可以使用这类变量。作用范围是整个系统。

此文件只在root下才能修改。

```text
# vi /etc/profile
export CLASSPATH=./JAVA_HOME/lib:$JAVA_HOME/jre/lib
```

添加完成后新的环境变量不会立即生效，立即生效需要运行 source /etc/profile ，否则只能在下次重进此用户时才能生效。

### 用户环境变量

> 对单一用户生效的永久性变量

在用户目录下的.bash_profile 文件中添加变量，该文件是隐藏文件，可使用ll -a查看：

```text
whoami 
louis

vi /home/louis/.bash_profile
export CLASSPATH=./JAVA_HOME/lib:$JAVA_HOME/jre/lib 

source /home/louis/.bash_profile
```

> .bashrc 和.bash_profile ，原则上讲设置此类环境变量时在这两个文件任意一个里面添加都是可以的，这两个文件的区别为：.bash_profile是交互式login方式进入bash shell运行，.bashrc是交互式non-login方式进入bash shell运行。
>
> 可以理解为.bash_profile文件只会在用户登录的时候读取一次，而.bashrc在每次打开终端进行一次新的会话时都会读取。

### 临时环境变量

临时有效的环境变量(只针对当前shell有效)

此类环境变量只对当前的shell有效。当我们退出登录或者关闭终端再重新打开时，这个环境变量就会消失。是临时的。

设置方法：命令行下直接使用[export 变量名=变量值] 定义变量。

```text
export NAME="louisyoungx"
echo $NAME
louisyoungx
```

设置环境变量常用命令

- echo 用于打印显示环境变量，如：echo $NAME；
- export 用于设置新的环境变量，如：export NAME='louis'；

更新环境变量 更新环境变量直接重新赋值即可：NAME='test' （注意：变量名前不需要加$）；

- env 显示当前用户的变量；
- set 显示当前shell变量，shell变量包含用户变量；
- unset 删除一个环境变量，如：unset NAME；
- readonly 设置环境变量只读，如：readonly NAME ，只读变量unset无效。



## ssh配置文件

SSH config是Linux系统下针对SSH客户端的一个参数配置方案，可以将一些关于SSH命令的参数放到配置文件中去，执行ssh命令的时候从文件中读取，简化命令行的操作。这篇短博客记录ssh config相关的配置问题和使用方法。

### 概述

SSH 参数配置有3个层次：

1. 命令行参数，如`-p 10086`, `-i /path/to/identity_file` 等选项来设置SSH的端口号或认证证书位置
2. 针对某个用户的配置文件，所在路径为`~/.ssh/config`，默认是不存在的，需要手动创建
3. 针对系统所有用户的配置文件，，所在路径为`/etc/ssh/ssh_config`
   参数重要性的顺序也是1>2>3，即越近的配置重要性越高。这里主要讲述第2种情况下的配置方式，即针对`~/.ssh/config`文件的写法进行说明。

一个示例的文件如下：

```bash
# configuration 1
Host cluster
	HostName 192.168.11.11
	User tom


# configuration 2
Host=aliyun
	Hostname=202.44.2.2
	User tom
```

### 主要的规则

1. 每项配置都是`参数名 参数值`或`参数值=参数名`的形式，其中参数名不区分大小写，而参数值区分大小写，如上面的参数名`HostName`和`Hostname`是同一个参数
2. 不同主机的配置通过`Host`参数来区分，一个配置文件里面可以有针对多个Host的配置
3. 以`#`开头的是注释，会被忽略
4. 同一个Host的配置内部，`参数名 参数值`和`参数值=参数名`的形式可以混用，如上例#2配置所示
   下面详细展开常见的参数类型。

### 常见参数类型

#### Host

类似昵称，用于标识某个特定的配置，在ssh命令中使用，例如我们想要ssh连接到上例中的#1配置的主机，则在命令行执行如下命令即可：

```text
ssh cluster
```

#### HostName

需要ssh连接过去的主机名，一般是IP地址，也可以用`%h`来替代命令行参数，这种情况由于我用的不多，所以没有深入了解，具体情况可以参考参考链接。

#### User

登录主机的用户名

#### IdentityFile

认证证书文件，默认位置是`~/.ssh/id_rsa`, `~/ssh/id_dsa`等，如果采用默认的证书，可以不用设置此参数，除非你的证书放在某个自定义的目录，那么你就需要设置该参数来指向你的证书

#### Port

SSH访问主机的端口号，默认是22端口，同上，只有在非默认情况下才需要设置该值

#### 其他

别的参数可以在命令行通过`man ssh_config`来查看

### 利用ssh穿越跳板机配置

```shell
Host jumper1    # 代表跳板机 1
    HostName <跳板机1的IP>
    Port 22    # ssh 连接端口
    User username1    # 跳板机 1 的用户名

Host jumper2    # 代表跳板机 2
    HostName <跳板机2的IP>
    Port 22    # ssh 连接端口
    User username2    # 跳板机 2 的用户名
    ProxyJump jumper1

Host target    # 代表目标机器的名字
    HostName <目标机器IP>    # 这个是目标机器的 IP
    Port 22    # 目标机器 ssh 的端口
    User username_target    # 目标机器的用户名
    ProxyJump jumper2
```

### ssh隧道

#### [frp](https://github.com/fatedier/frp/blob/master/README_zh.md)

frp 是一个可用于内网穿透的高性能的反向代理应用，支持 tcp, udp, http, https 协议。
frp 有以下特性：

- frp 比 SSH 隧道功能更多，配置项更多；
- frp 也需要一台外网服务器，并且需要在外网服务器上安装 frps，在本地开发机上安装 frpc；

#### [ngrok](https://ngrok.com)

ngrok 是一个商用的内网穿透工具，它有以下特点：

- 不需要有外网服务器，因为 ngrok 会为你提供；
- 只需要在本地开发机安装 ngrok 客户端，和注册 ngrok 账户；
- 按照服务收费；

## 自定义开机自启程序/脚本

以一个`test.sh`脚本为例，目录`/usr/bin/test.sh`，内容为以下

```bash
DATE=`date '+%Y-%m-%d %H:%M:%S'`
echo "Example service started at ${DATE}"
while :
do
echo "...";
sleep 1000;
done
```

### 通过 crontab 实现

Crontab 可以使用 @reboot 来执行主机启动之后的命令。首先在命令行输入：

```text
crontab -e
```

然后添加以下内容：

```text
@reboot /usr/bin/test.sh
```

或者在启动完成后的指定时间内运行脚本

```text
# 在启动 5 分钟后运行指定脚本
@reboot sleep 300 && /usr/bin/test.sh
```

完成后，这个脚本就可以在重启的时候自动执行了。

### 通过 systemd service 实现

1. 创建一个脚本或者使用可执行文件，使该脚本具有可执行权限：

```bash
sudo chmod +x /usr/bin/test.sh
```

2. 创建一个名为`testservice.service`的`Unit file`来定义一个`systemd`服务：

```bash
[Unit]
Description=Example systemd service.

[Service]
Type=simple
ExecStart=/usr/bin/zsh ~/.local/bin/test.sh

[Install]
WantedBy=multi-user.target
```

3. 将上述`Unit`文件复制到/etc/systemd/system并为其授予权限：

```shell
sudo cp testservice.service /etc/systemd/system/testservice.service
sudo chmod 644 /etc/systemd/system/testservice.service
```

> 想要具体了解Unit文件的可用配置参数，可以查阅[systemd](https://www.freedesktop.org/wiki/Software/systemd/)

4. 启动服务

在命令行输入以下命令启动服务：

```shell
sudo systemctl start testservice
```

使用以下enable命令来确保该服务在系统启动时启动：

```shell
sudo systemctl enable testservice
```

如果想要检查服务状态，使用：

```shell
sudo systemctl status testservice
```

## Tmux

在开始使用 tmux 之前我们需要先了解关于 tmux 的几个名词：

**session, window , pane** 在这里我们就把他们分别叫做会话，窗口，窗格 。

> 通常我们在终端中操作一个任务的时候，一旦终端关闭，任务也就结束了，被强制关闭了，在 tmux 中 使用 session 就可以解决这个问题，我们可以把当前操作的任务隐藏起来，在视觉上让它消失，任务继续执行着，当我们想返回任务做一些操作的时候，它可以很方便的回来，我们通常把上面的操作就做 session 操作，我们可以把 session 给隐藏起来，我们也可以把 session 给真的关掉。
>
> 在 tmux 中有一个窗口的概念，我们可以这样要去理解窗口：当前呈现在我们面前的这一个工作区域就是一个窗口（当前的终端界面），窗口可以被不断切割，切割成一个个小块，这一个个小块我们叫做窗格（pane）,这就是窗口和窗格的概念，我们把它想象成一块大蛋糕可以切成很多小块蛋糕，窗口可以被分割成很多小的窗格。

tmux层级

- session 1
  - window 1
    - subwindow 1
  - window 2
- session 2
  - window 1
    - subwindow 1
    - subwindow 2
- session 3

```text
# tmux的层次：
-session1
---window1
------subwindow1
------subwindow2
------subwindow3
------subwindow4
---window2
-session2
---window3
---window4
```

### 基本操作

#### 安装

Tmux 一般需要自己安装。

```bash
# Ubuntu
sudo apt-get install tmux

# CentOS
sudo yum install tmux
```

#### 启动与退出

安装完成后，键入`tmux`命令，就进入了 Tmux 窗口。

```bash
tmux
```

上面命令会启动 Tmux 窗口，底部有一个状态栏。状态栏的左侧是窗口信息（编号和名称），右侧是系统信息。

按下`Ctrl+d`或者显式输入`exit`命令，就可以退出 Tmux 窗口。

```bash
exit
```

#### 前缀键

> tmux默认的前缀操作都是 ctrl + b （类似screen的 ctrl + a）需要提醒大家的是，所有的快捷键都是ctrl + b，按完松开，再去按下一个功能键，不是一下子全按上

Tmux 窗口有大量的快捷键。所有快捷键都要通过前缀键唤起。默认的前缀键是`Ctrl+b`，即先按下`Ctrl+b`，快捷键才会生效。

举例来说，帮助命令的快捷键是`Ctrl+b ?`。它的用法是，在 Tmux 窗口中，先按下`Ctrl+b`，再按下`?`，就会显示帮助信息。

然后，按下 ESC 键或`q`键，就可以退出帮助。

### 会话管理

#### 新建会话

第一个启动的 Tmux 窗口，编号是`0`，第二个窗口的编号是`1`，以此类推。这些窗口对应的会话，就是 0 号会话、1 号会话。

使用编号区分会话，不太直观，更好的方法是为会话起名。

```bash
tmux new -s <session-name>
```

上面命令新建一个指定名称的会话。

#### 分离会话

在 Tmux 窗口中，按下`Ctrl+b d`或者输入`tmux detach`命令，就会将当前会话与窗口分离。

```bash
tmux detach
```

上面命令执行后，就会退出当前 Tmux 窗口，但是会话和里面的进程仍然在后台运行。

`tmux ls`命令可以查看当前所有的 Tmux 会话。

```bash
tmux ls
# or
tmux list-session
```

#### 接入会话

`tmux attach`命令用于重新接入某个已存在的会话。

```bash
# 使用会话编号
tmux attach -t 0

# 使用会话名称
tmux attach -t <session-name>
```

#### 杀死会话

`tmux kill-session`命令用于杀死某个会话。

```bash
# 使用会话编号
tmux kill-session -t 0

# 使用会话名称
tmux kill-session -t <session-name>
```

#### 切换会话

`tmux switch`命令用于切换会话。

```bash
# 使用会话编号
tmux switch -t 0

# 使用会话名称
tmux switch -t <session-name>
```

#### 重命名会话

`tmux rename-session`命令用于重命名会话。

```bash
tmux rename-session -t 0 <new-name>
```

上面命令将0号会话重命名。

#### 查看现有会话

`tmux ls`命令用于查看现有会话。

```bash
tmux ls
```

#### 会话快捷键

下面是一些会话相关的快捷键。

- `Ctrl+b d`：分离当前会话。
- `Ctrl+b s`：列出所有会话。
- `Ctrl+b $`：重命名当前会话。

### 最简操作流程

综上所述，以下是 Tmux 的最简操作流程。

1. 新建会话`tmux new -s my_session`。
2. 在 Tmux 窗口运行所需的程序。
3. 按下快捷键`Ctrl+b d`将会话分离。
4. 下次使用时，重新连接到会话`tmux attach-session -t my_session`。

### 窗格操作

Tmux 可以将窗口分成多个窗格（pane），每个窗格运行不同的命令。以下命令都是在 Tmux 窗口中执行。

#### 划分窗格

`tmux split-window`命令用来划分窗格。

```bash
# 划分上下两个窗格
tmux split-window

# 划分左右两个窗格
tmux split-window -h
```

#### 移动光标

`tmux select-pane`命令用来移动光标位置。

```bash
# 光标切换到上方窗格
tmux select-pane -U

# 光标切换到下方窗格
tmux select-pane -D

# 光标切换到左边窗格
tmux select-pane -L

# 光标切换到右边窗格
tmux select-pane -R
```

#### 交换窗格位置

`tmux swap-pane`命令用来交换窗格位置。

```bash
# 当前窗格上移
tmux swap-pane -U

# 当前窗格下移
tmux swap-pane -D
```

#### 窗格快捷键

下面是一些窗格操作的快捷键。

- `Ctrl+b %`：划分左右两个窗格。
- `Ctrl+b "`：划分上下两个窗格。
- `Ctrl+b <arrow key>`：光标切换到其他窗格。`<arrow key>`是指向要切换到的窗格的方向键，比如切换到下方窗格，就按方向键`↓`。
- `Ctrl+b ;`：光标切换到上一个窗格。
- `Ctrl+b o`：光标切换到下一个窗格。
- `Ctrl+b {`：当前窗格与上一个窗格交换位置。
- `Ctrl+b }`：当前窗格与下一个窗格交换位置。
- `Ctrl+b Ctrl+o`：所有窗格向前移动一个位置，第一个窗格变成最后一个窗格。
- `Ctrl+b Alt+o`：所有窗格向后移动一个位置，最后一个窗格变成第一个窗格。
- `Ctrl+b x`：关闭当前窗格。
- `Ctrl+b !`：将当前窗格拆分为一个独立窗口。
- `Ctrl+b z`：当前窗格全屏显示，再使用一次会变回原来大小。
- `Ctrl+b Ctrl+<arrow key>`：按箭头方向调整窗格大小。
- `Ctrl+b q`：显示窗格编号。

### 窗口管理

除了将一个窗口划分成多个窗格，Tmux 也允许新建多个窗口。

#### 新建窗口

`tmux new-window`命令用来创建新窗口。

```bash
tmux new-window

# 新建一个指定名称的窗口
tmux new-window -n <window-name>
```

#### 切换窗口

`tmux select-window`命令用来切换窗口。

```bash
# 切换到指定编号的窗口
tmux select-window -t <window-number>

# 切换到指定名称的窗口
tmux select-window -t <window-name>
```

#### 重命名窗口

`tmux rename-window`命令用于为当前窗口起名（或重命名）。

```bash
tmux rename-window <new-name>
```

#### 窗口快捷键

下面是一些窗口操作的快捷键。

- `Ctrl+b c`：创建一个新窗口，状态栏会显示多个窗口的信息。
- `Ctrl+b p`：切换到上一个窗口（按照状态栏上的顺序）。
- `Ctrl+b n`：切换到下一个窗口。
- `Ctrl+b <number>`：切换到指定编号的窗口，其中的`<number>`是状态栏上的窗口编号。
- `Ctrl+b w`：从列表中选择窗口。
- `Ctrl+b ,`：窗口重命名。

### 其他命令

下面是一些其他命令。

```bash
# 列出所有快捷键，及其对应的 Tmux 命令
tmux list-keys

# 列出所有 Tmux 命令及其参数
tmux list-commands

# 列出当前所有 Tmux 会话的信息
tmux info

# 重新加载当前的 Tmux 配置
tmux source-file ~/.tmux.conf
```

