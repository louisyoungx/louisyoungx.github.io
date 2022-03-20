---
layout: Post
title: Linux Training 4 - Customizing Vim & Getting started with shell programming
subtitle: Linux培训(四) 定制vim与shell入门
author: louisyoungx
date: 2022-01-27
useHeaderImage: true
headerImage: /img/in-post/2022-01-27/header.jpg
headerMask: rgb(14, 21, 5, .2)
permalinkPattern: /post/:year/:month/:day/:slug/
hide: true
tags:
  - technology
  - chinese
  - linux
  - training
---

自定义vimrc与常用插件，vscode vim，网络配置，awk语言详解，shell脚本入⻔

<!-- more -->

## 自定义vimrc配置与vim常用开发插件

1. 编辑器设置
2. 界面设置
3. 恢复光标位置
4. 基本的映射
5. Vim-Plug 插件
   需要在命令行执行以下命令安装vim-plug

```shell
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

7. 插件环境

## vscode vim插件配置

1. 安装vim插件
2. 配置vimrc地址

```shell
$HOME/.vim/vimrc
```

1. 配置settings.json

```json
"vim.useSystemClipboard": true,
"vim.cursorStylePerMode.insert": "line",
"vim.cursorStylePerMode.normal": "underline",
"vim.cursorStylePerMode.replace": "block-outline",
"vim.cursorStylePerMode.visual": "line",
"vim.cursorStylePerMode.visualline": "line",
"vim.cursorStylePerMode.visualblock": "line",
"vim.handleKeys":{
  "<D-c>": false,
  "<shift-alt>": false,
},
```

## 网络配置（网络属性/网络状态）

### 查看网络配置

  * Windows 系统：ipconfig
  * Linux 系统：ip / ifconfig

### Linux 网络环境配置

#### 自动获取 IP

用户登录后，通过界面来设置自动获取 IP。

缺点: Linux 启动后，每次自动获取的 IP 地址可能不一样。这个不适用于服务器，因为服务器 IP 是需要固定的。

#### 固定 IP

通过修改配置文件来指定 IP

配置文件根据网卡不同名字有所区别，但文件路径一致：/etc/sysconfig/network-scripts/，常见的配置文件名有
ifcfg-eth0 或者 ifcfg-ens33，可以通过 ifconfig 查看后缀。

以 ifcfg-ens33 为例，配置文件需要修改的内容如后面的代码块所示。

修改后，重启网络服务或者重启系统生效：service network restart 或者 reboot

```shell
BOOTPROTO=static # 静态 IP
IPADDR=192.168.59.134 # 本机 IP 地址
NETMASK=255.255.255.0 # 子网掩码
GATEWAY=192.168.59.2 # 默认网关
DNS1=8.8.8.8 # 域名解析器
DNS2=8.8.4.4
```

### 设置主机名和 hosts 映射

#### 设置主机名

* 为了方便记忆，可以给 Linux 系统主机设置主机名，也可以根据需要修改主机名（大数据用到）。
* 使用 hostname 查看当前主机名
* 如需修改在文件 /etc/hostname 编辑即可
* 修改后，重启系统生效

#### 设置 hosts 映射 

hosts 映射可以使主机名和系统 IP 地址建立映射联系，即通过主机名就可以连接到某个主机系统，省去了 IP 地址的麻烦。  
hosts 是一个文本文件，用来记录 IP 和 Hostname（主机名）的映射关系。  
除去 hosts 文件，DNS 是互联网上作为域名和 IP 地址相互映射的一个分布式数据库。Domain Name System
的缩写，翻译过来就是域名系统。

*Windows* ：在 C:\Windows\System32\drivers\etc\hosts
文件中指定即可。如192.168.130.23 Windows-PC

*Linux* ：在 /etc/hosts 文件中指定即可。如192.168.100.13 CentOS-PC

## awk语言详解

awk是一个强大的文本分析工具，相对于grep的查找，sed的编辑，awk在其对数据分析并生成报告时，显得尤为强大。简单来说awk就是把文件逐行的读入，以空格为默认分隔符将每行切片，切开的部分再进行各种分析处理。

awk有3个不同版本: awk、nawk和gawk，未作特别说明，一般指gawk，gawk 是 AWK 的 GNU 版本。

awk其名称得自于它的创始人 Alfred Aho 、Peter Weinberger 和 Brian Kernighan 姓氏的首个字母。实际上 AWK 的确拥有自己的语言： AWK 程序设计语言 ， 三位创建者已将它正式定义为“样式扫描和处理语言”。它允许您创建简短的程序，这些程序读取输入文件、为数据排序、处理数据、对输入执行计算以及生成报表，还有无数其他的功能。

### 使用方法

```shell
awk '{pattern + action}' {filenames}
```

尽管操作可能会很复杂，但语法总是这样，其中 pattern 表示 AWK 在数据中查找的内容，而 action 是在找到匹配内容时所执行的一系列命令。花括号（{}）不需要在程序中始终出现，但它们用于根据特定的模式对一系列指令进行分组。 pattern就是要表示的正则表达式，用斜杠括起来。

> awk语言的最基本功能是在文件或者字符串中基于指定规则浏览和抽取信息，awk抽取信息后，才能进行其他文本操作。完整的awk脚本通常用来格式化文本文件中的信息。

通常，awk是以文件的一行为处理单位的。awk每接收文件的一行，然后执行相应的命令，来处理文本。

### 调用awk

有三种方式调用awk

1.命令行方式
awk [-F field-separator] 'commands' input-file(s)
其中，commands 是真正awk命令，[-F域分隔符]是可选的。 input-file(s) 是待处理的文件。
在awk中，文件的每一行中，由域分隔符分开的每一项称为一个域。通常，在不指名-F域分隔符的情况下，默认的域分隔符是空格。

2.shell脚本方式
将所有的awk命令插入一个文件，并使awk程序可执行，然后awk命令解释器作为脚本的首行，一遍通过键入脚本名称来调用。
相当于shell脚本首行的：#!/bin/sh
可以换成：#!/bin/awk

3.将所有的awk命令插入一个单独文件，然后调用：
awk -f awk-script-file input-file(s)
其中，-f选项加载awk-script-file中的awk脚本，input-file(s)跟上面的是一样的。

本章重点介绍命令行方式。

### 入门实例

假设last -n 5的输出如下

```shell
last -n 5 仅取出前五行
root     pts/1  192.168.1.100 Tue Feb 10 11:21  still logged in
root     pts/1  192.168.1.100 Tue Feb 10 00:46 - 02:28 (01:41)
root     pts/1  192.168.1.100 Mon Feb 9 11:41 - 18:30 (06:48)
dmtsai   pts/1  192.168.1.100 Mon Feb 9 11:41 - 11:41 (00:00)
root     tty1                   Fri Sep 5 14:09 - 14:10 (00:01)
```

如果只是显示最近登录的5个帐号

```shell
last -n 5 | awk  '{print $1}'
root
root
root
dmtsai
root
```

awk工作流程是这样的：读入有’n’换行符分割的一条记录，然后将记录按指定的域分隔符划分域，填充域，`$0`则表示所有域,`$1`表示第一个域,`$n`表示第n个域。默认域分隔符是”空白键” 或 “键”,所以`$1`表示登录用户，`$3`表示登录用户ip,以此类推。

如果只是显示/etc/passwd的账户

```shell
cat /etc/passwd |awk  -F ':'  '{print $1}'  
root
daemon
bin
sys
```

这种是`awk+action`的示例，每行都会执行`action{print $1}`。

`-F`指定域分隔符为`:`。

如果只是显示/etc/passwd的账户和账户对应的shell,而账户与shell之间以tab键分割

```shell
cat /etc/passwd |awk  -F ':'  '{print $1"t"$7}'
root    /bin/bash
daemon  /bin/sh
bin     /bin/sh
sys     /bin/sh
```

如果只是显示/etc/passwd的账户和账户对应的shell,而账户与shell之间以逗号分割,而且在所有行添加列名name,shell,在最后一行添加”blue,/bin/nosh”。

```shell
cat /etc/passwd |awk  -F ':' 'BEGIN {print "name,shell"}  {print $1","$7} END {print "blue,/bin/nosh"}'
name,shell
root,/bin/bash
daemon,/bin/sh
bin,/bin/sh
sys,/bin/sh
....
blue,/bin/nosh
```

awk工作流程是这样的：先执行BEGING，然后读取文件，读入有/n换行符分割的一条记录，然后将记录按指定的域分隔符划分域，填充域，`$0`则表示所有域,`$1`表示第一个域,`$n`表示第n个域,随后开始执行模式所对应的动作action。接着开始读入第二条记录······直到所有的记录都读完，最后执行END操作。

搜索/etc/passwd有root关键字的所有行

```shell
awk -F: '/root/' /etc/passwd
root:x:0:0:root:/root:/bin/bash
```

这种是pattern的使用示例，匹配了pattern(这里是root)的行才会执行action(没有指定action，默认输出每行的内容)。

搜索支持正则，例如找root开头的: awk -F: ‘/^root/’ /etc/passwd

搜索/etc/passwd有root关键字的所有行，并显示对应的shell

```shell
awk -F: '/root/{print $7}' /etc/passwd            
/bin/bash
```

这里指定了`action{print $7}`

### awk内置变量

awk有许多内置变量用来设置环境信息，这些变量可以被改变，下面给出了最常用的一些变量。

> ARGC 命令行参数个数
> ARGV 命令行参数排列
> ENVIRON 支持队列中系统环境变量的使用
> FILENAME awk浏览的文件名
> FNR 浏览文件的记录数
> FS 设置输入域分隔符，等价于命令行 -F选项
> NF 浏览记录的域的个数
> NR 已读的记录数
> OFS 输出域分隔符
> ORS 输出记录分隔符
> RS 控制记录分隔符

此外,`$0`变量是指整条记录。`$1`表示当前行的第一个域,`$2`表示当前行的第二个域,……以此类推

统计/etc/passwd:文件名，每行的行号，每行的列数，对应的完整行内容:

```shell
awk  -F ':'  '{print "filename:" FILENAME ",linenumber:" NR ",columns:" NF ",linecontent:"$0}' /etc/passwd
filename:/etc/passwd,linenumber:1,columns:7,linecontent:root:x:0:0:root:/root:/bin/bash
filename:/etc/passwd,linenumber:2,columns:7,linecontent:daemon:x:1:1:daemon:/usr/sbin:/bin/sh
filename:/etc/passwd,linenumber:3,columns:7,linecontent:bin:x:2:2:bin:/bin:/bin/sh
filename:/etc/passwd,linenumber:4,columns:7,linecontent:sys:x:3:3:sys:/dev:/bin/sh
```

使用printf替代print,可以让代码更加简洁，易读

```shell
awk  -F ':' '{printf("filename:%10s,linenumber:%s,columns:%s,linecontent:%sn",FILENAME,NR,NF,$0)}'/etc/passwd
```

### print和printf

awk中同时提供了print和printf两种打印输出的函数。

其中print函数的参数可以是变量、数值或者字符串。字符串必须用双引号引用，参数用逗号分隔。如果没有逗号，参数就串联在一起而无法区分。这里，逗号的作用与输出文件的分隔符的作用是一样的，只是后者是空格而已。

printf函数，其用法和c语言中printf基本相似,可以格式化字符串,输出复杂时，printf更加好用，代码更易懂。

### awk编程

#### 变量和赋值

除了awk的内置变量，awk还可以自定义变量。

下面统计/etc/passwd的账户人数

```shell
awk '{count++;print $0;} END{print "user count is ", count}' /etc/passwd
root:x:0:0:root:/root:/bin/bash
......
user count is 40
```

count是自定义变量。之前的action{}里都是只有一个print,其实print只是一个语句，而action{}可以有多个语句，以;号隔开。

这里没有初始化count，虽然默认是0，但是妥当的做法还是初始化为0:

```shell
awk 'BEGIN {count=0;print "[start]user count is ", count} {count=count+1;print $0;} END{print "[end]user count is ", count}' /etc/passwd
[start]user count is 0
root:x:0:0:root:/root:/bin/bash
...
[end]user count is 40
```

统计某个文件夹下的文件占用的字节数

```shell
ls -l |awk 'BEGIN {size=0;} {size=size+$5;} END{print "[end]size is ", size}'
[end]size is 8657198
```

如果以M为单位显示:

```shell
ls -l |awk 'BEGIN {size=0;} {size=size+$5;} END{print "[end]size is ", size/1024/1024,"M"}'
[end]size is 8.25889 M
```

注意，统计不包括文件夹的子目录。

#### 条件语句

awk中的条件语句是从C语言中借鉴来的，见如下声明方式：

```C++
if (expression) {
 statement;
 statement;
 ... ...
}
 
if (expression) {
 statement;
} else {
 statement2;
}
 
if (expression) {
 statement1;
} else if (expression1) {
 statement2;
} else {
 statement3;
}
```

统计某个文件夹下的文件占用的字节数,过滤4096大小的文件(一般都是文件夹):

```shell
ls -l |awk 'BEGIN {size=0;print "[start]size is ", size} {if($5!=4096){size=size+$5;}} END{print "[end]size is ", size/1024/1024,"M"}'
[end]size is 8.22339 M
```

#### 循环语句

awk中的循环语句同样借鉴于C语言，支持while、do/while、for、break、continue，这些关键字的语义和C语言中的语义完全相同。

#### 数组

因为awk中数组的下标可以是数字和字母，数组的下标通常被称为关键字(key)。值和关键字都存储在内部的一张针对key/value应用hash的表格里。由于hash不是顺序存储，因此在显示数组内容时会发现，它们并不是按照你预料的顺序显示出来的。数组和变量一样，都是在使用时自动创建的，awk也同样会自动判断其存储的是数字还是字符串。一般而言，awk中的数组用来从记录中收集信息，可以用于计算总和、统计单词以及跟踪模板被匹配的次数等等。

显示/etc/passwd的账户

```shell
awk -F ':' 'BEGIN {count=0;} {name[count] = $1;count++;}; END{for (i = 0; i ' /etc/passwd
0 root
1 daemon
2 bin
3 sys
4 sync
5 games
......
```

这里使用for循环遍历数组

awk编程的内容极多，这里只罗列简单常用的用法，更多请参考 [http://www.gnu.org/software/gawk/manual/gawk.html](http://www.gnu.org/software/gawk/manual/gawk.html)

## Shell 编程

Linux 运维工程师在进行服务器集群管理时，需要编写 Shell 程序来进行服务器管理。

对于 JavaEE 和 Python 程序员来说，工作的需要，会要求你编写一些 Shell
脚本进行程序或者是服务器的维护，比如编写一个定时备份数据库的脚本。

对于大数据程序员来说，需要编写 Shell 程序来管理集群。

### Shell 是什么

Shell 是一个命令行解释器，它为用户提供了一个向 Linux 内核发送请求以便运行程序的界面系统级程序，用户可以用 Shell
来启动、挂起、停止甚至是编写一些程序。

### Shell 脚本的执行方式

脚本格式要求

* 脚本以`#!/bin/bash` 开头
* 脚本需要有可执行权限

脚本的常用执行方式

* 给要执行的脚本文件，添加可执行权限
* 直接用 sh 脚本文件名 命令执行，不用赋予脚本可执行权限

### Shell 变量介绍

Linux 中 Shell 的变量分为系统变量和用户自定义变量。

系统变量：`$HOME`、`$PWD`、`$SHELL`、`$USER` 等等，比如：`echo $HOME` 等等。

显示当前 Shell 中所有变量：set

### Shell 变量定义

定义变量：变量=值 （注意等号两侧没有空格）

撤销变量：unset 变量

声明静态变量：readonly 变量。注意：该变量不能 unset

### 定义变量的规则

变量名称可以由字母、数字和下划线组成，但是不能以数字开头。

等号两侧不能有空格

变量名称一般习惯为大写，这是一个规范，遵守即可

### 将命令的返回值赋给变量

1. 通过反引号，运行里面的命令，并把结果返回给变量 A

```shell
A=`date`
```

2. 通过`$(命令)`，运行里面的命令
```shell
A=$(date)
```

### Shell 变量快速入门

```shell
#!/bin/bash
#案例1：定义变量 A
A=100
#输出变量需要加上$
echo A=$A
echo "A=$A"
#案例2：撤销变量 A
unset A
echo "A=$A"
#案例3：声明静态的变量 B=2，不能 unset
readonly B=2
echo "B=$B"
#执行 unset B 命令，会报错
#案例 4：将指令返回的结果赋给变量
C=`date`
D=$(date)
echo "C=$C"
echo "D=$D"
```

### 设置环境变量

#### 基本语法

* `export 变量名=变量值`：将 Shell 变量输出为环境变量
* `source 配置文件`：让修改后的配置文件立即生效
* `echo $变量名`：查询环境变量的值

#### 快速入门

```shell
#通过编辑 /etc/profile 文件配置 JDK 环境变量，要增加以下命令
export JAVA_HOME=/usr/local/java/jdk1.8.0_261
export PATH=$JAVA_HOME/bin:$PATH
#保存退出 /etc/profile 文件后，执行 source /etc/profile 命令使修改后的配置文件生效
```
Shell 脚本多行注释

```shell
:<<!
需要注释的第一行内容
需要注释的第二行内容
!
```

### 位置参数变量

当我们执行一个 Shell 脚本时，如果希望获取到命令行的参数信息，就可以使用到位置参数变量，比如 ./myshell.sh 100 200 ,
这个就是一个执行 shell 的命令行，可以在 myshell 脚本中获取到参数信息。

#### 基本语法

* `$n`：`n` 为数字，`$0` 代表命令本身，`$1-$9` 代表第一到第九个参数，十以上的参数需要用大括号，如`${10}`
* `$*`：代表命令行中所有的参数，$*把所有的参数看成一个整体
* `$@`：代表命令行中所有的参数，不过该命令是把每个参数区分对待
* `$#`：代表命令行中所有参数的个数

#### 快速入门

```shell
#!/bin/bash
echo "0=$0 1=$1 2=$2"
echo "命令行所有传入的参数=$*"
echo "$@"
echo "参数的个数=$#"
```

### 预定义变量

Shell 设计者事先已经定义好的变量，可以直接在 Shell 脚本中使用

#### 基本语法

* `$$`：当前进程的进程号
* `$!`：后台运行的最后一个进程的进程号
* `$?`：最后一次执行的命令的返回状态。如果这个变量的值为 0，证明上一个命令正确执行；如果这个变量的值为非0（具体是哪个数，由命令自己来决定），则证明上一个命令执行不正确

#### 快速入门

```shell
#!/bin/bash
echo "当前进程号=$$"
#后台方式运行 myShell.sh
./myShell.sh &
echo "最后的的进程号=$!"
echo "执行的值=$?"
```

### 运算符

在 Shell 中进行各种运算操作。

#### 基本语法

* `$((运算式))\`或`$[运算式]`
* 或 `expr m + n` 注意 `expr` 运算符间要有空格
* expr `\*`，`/`，`%` 分别代表乘，除，取余

#### 快速入门

```shell
#!/bin/bash
#案例1：计算（2+3）X4 的值
#使用第一种方式
RES1=$(((2+3)*4))
echo "res1=$RES1"
#使用第二种方式
RES2=$[(2+3)*4]
echo "res2=$RES2"
#使用第三种方式
TEMP=`expr 2 + 3`
RES3=`expr $TEMP \* 4`
echo "temp=$TEMP"
echo "res3=$RES3"
echo "执行的值=$?"
#案例2：请求出命令行的两个参数[整数]的和
SUM=$[$1+$2]
echo "sum=$SUM"
```

### 条件判断

#### 判断语句 

[ condition ]（注意 condition 前后要有空格），非空返回 true，可使用$?验证（0 为 true，>1 为 false）

#### 常用判断条件

##### 字符串比较

| 选项 | 含义           |
| ---- | -------------- |
| =    | 字符串是否相等 |

##### 两个整数的比较

| 选项 | 含义     |
| ---- | -------- |
| -lt  | 小于     |
| -le  | 小于等于 |
| -eq  | 等于     |
| -gt  | 大于     |
| -ge  | 大于等于 |
| -ne  | 不等于   |

##### 按照文件权限进行判断

| 选项 | 含义         |
| ---- | ------------ |
| -r   | 有读的权限   |
| -w   | 有写的权限   |
| -x   | 有执行的权限 |

##### 按照文件类型进行判断

| 选项 | 含义                         |
| ---- | ---------------------------- |
| -f   | 文件存在并且是一个常规的文件 |
| -e   | 文件存在                     |
| -d   | 文件存在并是一个目录         |

#### 快速入门

```shell
#!/bin/bash
#案例1：“ok”是否等于“ok”
#判断语句：是否 =
if [ "ok" == "ok" ]
then
      echo "equal"
fi
#案例2：23是否大于等于22
#判断语句：使用 -ge
if [ 23 -ge 22 ]
then
      echo "大于"
fi
#案例3：/root/shcode/aaa.txt 目录中的文件是否存在
#判断语句：使用 -f
if [ -f /root/shcode/aaa.txt ]
then
      echo "存在"
fi
#其他案例
if [ edu ]
then
      echo "hello, edu"
fi
```

### if 判断

#### 基本语法

```shell
if [ 条件判断式 ]
then
      程序
fi
```

或者

```shell
if [ 条件判断式 ]
then
      程序
elif [ 条件判断式 ]
then
      程序
fi
```

#### 注意事项 

[ 条件判断式 ]中括号和条件判断式之间必须有空格，if 与 [ 之间也有空格

#### 快速入门

```shell
#!/bin/bash
#案例：编写一个 Shell 程序，如果输入的参数，大于等于60，则输出“及格了”，如果小于60，则输出 “不及格”
if [ $1 -ge 60 ]
then
      echo "及格了"
elif [ $1 -lt 60 ]
then
      echo "不及格"
fi
```

### case 语句

#### 基本语法

```shell
case $变量名 in
"值 1")
      如果变量的值等于值 1，则执行程序 1
;;
"值 2")
      如果变量的值等于值 2，则执行程序 2
;;
      省略其他分支
*)
      如果变量的值都不是以上的值，则执行此程序
;;
esac
```

#### 快速入门

```shell
#!/bin/bash
#案例：当命令行参数是1时，输出“周一”，是2时，就输出“周二”，其它情况输出“other”
case $1 in
"1")
      echo "周一"
;;
"2")
      echo "周二"
;;
*)
      echo "other"
;;
esac
```

### for 语句

#### for-in 基本语法

```shell
for 变量 in 值1 值2 值3 ...
do
      程序
done
```

#### for-in 快速入门

```shell
#!/bin/bash
#案例：打印命令行输入的参数【可以看出$*和$@的区别】
#注意 $* 是把输入的参数，当作一个整体，所以只会输出一行
for i in "$*"
do
      echo "num is $i"
done
#使用 $@ 是把输入的参数，分别对待，所以有几个参数，就会输出几行
for j in "$@"
do
      echo "num is $j"
done
```

#### for 基本语法

```shell
for (( 初始值;循环控制条件;变量变化 ))
do
      程序
done
```

#### for 快速入门

```shell
#!/bin/bash
#案例：从1加到100的值输出显示
#定义一个变量 SUM
SUM=0
for (( i=1;i<=100;i++ ))
do
      SUM=$[$SUM+i]
done
echo "总和SUM=$SUM"
```

### while 语句

#### 基本语法

```shell
    while [ 条件判断式 ]
    do
          程序
    done
```

#### 注意事项 

[ 条件判断式 ]中括号和条件判断式之间必须有空格，while 与 [ 之间也有空格

#### 快速入门

```shell
    #!/bin/bash
    #案例：从命令行输入一个数 n，统计从 1+...+ n 的值
    SUM=0
    i=0
    while [ $i -le $1 ]
    do
          SUM=$[$i+$SUM]
          i=$[$i+1]
    done
    echo "总和SUM=$SUM"
```

### read 读取控制台输入

#### 基本语法 

read [选项] [参数]

#### 选项 

- `-p`：指定读取值时的提示符；  
- `-t`：指定读取值时等待的时间（秒），如果没有在指定的时间内输入，就不再等待了。

#### 参数 

变量：指定读取值的变量名

#### 快速入门

```shell
#!/bin/bash
#案例1：读取控制台输入一个 NUM1 值
read -p "请输入一个数NUM1=" NUM1
echo "您输入数NUM1=$NUM1"
#案例2：读取控制台输入一个 NUM2 值，在 10 秒内输入
read -t 10 -p "请输入一个数NUM2=" NUM2
echo "您输入数NUM2=$NUM2"
```

### 系统函数

#### basename 基本语法

* basename [pathname] [suffix]：返回完整路径最后 / 的部分，常用于获取文件名。
* basename [string] [suffix]：会删掉所有的前缀包括最后一个（‘/’）字符，然后将字符串显示出来。

选项：  
`suffix` 为后缀，如果 `suffix` 被指定了，`basename` 会将 `pathname` 或 `string` 中的 `suffix` 去掉。

#### dirname 基本语法

##### 功能

返回完整路径最后 / 的前面的部分，常用于返回路径部分。

`dirname` 文件绝对路径：从给定的包含绝对路径的文件名中去除文件名（非目录的部分），然后返回剩下的路径（目录的部分）。

##### 快速入门

案例1：请返回 /home/aaa/test.txt 的 test.txt 部分  
```shell
basename /home/aaa/test.txt
```

案例2：请返回 /home/aaa/test.txt 的 /home/aaa 部分  
```shell
dirname /home/aaa/test.txt
```

### 自定义函数

#### 基本语法

```shell
[ function ] funname[()]
{
      Action;
      [return int;]
}
```

调用直接写函数名：funname [值]

#### 快速入门

```shell
#!/bin/bash
#案例1：计算输入两个参数的和（动态获取），getSum
#定义函数 getSum
function getSum()
{
      SUM=$[$NUM1+$NUM2]
      echo "和是=$SUM"
}
#输入两个值
read -p "请输入一个数NUM1=" NUM1
read -p "请输入一个数NUM2=" NUM2
#调用自定义函数
getSum $NUM1 $NUM2
```