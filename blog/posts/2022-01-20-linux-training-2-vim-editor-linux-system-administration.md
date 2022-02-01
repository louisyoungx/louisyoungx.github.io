---
layout: post
title: Linux Training 2 - Vim editor & Linux system administration
subtitle: Linux培训(二) Vim编辑器与Linux系统管理
author: "louisyoungx"
date: 2022-01-20
header_img: /img/in-post/2022-01-20/header.jpg
catalog: true
tags:
  - chinese
  - linux
  - training
---

vi与vim常用操作，进程管理，系统性能，文件权限，编译安装

<!-- more -->

> **[How do I exit the Vim editor?](https://stackoverflow.com/questions/11828270/how-do-i-exit-the-vim-editor)**
>
> *StackOverflow* 一个近**九年**之久的问题，浏览量累计达**250万次**。

## vi/vim 的关系

### vi是小型化的vim (很久以前)

以前的Linux发行版中，vi默认版本是vim的small version编译版本，很多功能都没有包括。vim特指huge编译版本，包含很多丰富功能。

### vi=vim (现在)

查看vi版本

```shell
➜  ~ vi --version
VIM - Vi IMproved 8.2 (2019 Dec 12, compiled Nov 13 2021 05:04:57)
macOS version - x86_64
Included patches: 1-2671, 3402, 3409, 3428, 3489
Compiled by root@apple.com
Normal version without GUI.
```

查看vim版本

```shell
➜  ~ vim --version
VIM - Vi IMproved 8.2 (2019 Dec 12, compiled Nov 13 2021 05:04:57)
macOS version - x86_64
Included patches: 1-2671, 3402, 3409, 3428, 3489
Compiled by root@apple.com
Normal version without GUI.
```

查看两者执行文件路径

```shell
➜  ~ which vi
/usr/bin/vi
➜  ~ which vim
/usr/bin/vim
```

查看两者关系

```shell
➜  ~ ll /usr/bin | grep vi
lrwxr-xr-x  1 root   wheel     3B 12  8 07:39 vi -> vim
-rwxr-xr-x  1 root   wheel   4.5M 12  8 07:39 vim
```

## vim基础操作

### 认识 VIM

> 刚开始用 VIM 打开文件的时候，需要从宏观的去了解一下 VIM 这个编辑器。

VIM 常用的有四个模式，: 

- 正常模式 (Normal-mode)
- 插入模式 (Insert-mode)
- 命令模式 (Command-mode)
- 可视模式 (Visual-mode)

#### 什么是正常模式 (Normal-mode) ？

正常模式一般用于浏览文件，也包括一些复制、粘贴、删除等操作。这时击键时，一些组合键就是 vim 的功能键，而不会在文本中键入对应的字符。

> 在这个模式下，我们可以通过键盘在文本中快速移动光标，光标范围从小到大是字符、单词、行、句子、段落和屏幕。启动 VIM 后默认位于正常模式。不论是什么模式，按一下 `<Esc> `键 ( 有时可能需要按两下，插入模式按一下 `Esc` ，就会切换到正常模式，命令模式或者可视模式下执行完操作以后，就会自动进入正常模式，如果进入命令模式或者可视模式没有执行任何操作，按两下 `Esc` 即可 )都会进入正常模式。
>
> 下面的三个模式都是过键盘上相应的键位去触发的。

#### 什么是插入模式 (Insert-mode)

在正常模式中按下个别字母键 (后面会详细介绍)，会进入插入模式。

例如按 `i` 键会进行插入模式。该模式启动以后，就会进入编辑状态，通过键盘输入内容。

#### 什么是命令模式 (Command-mode)

在正常模式中，按下`: ` (冒号)键或者`/`  (斜杠)，会进入命令模式。在命令模式中可以执行一些输入并执行一些 VIM 或插件提供的指令，就像在shell里一样。这些指令包括设置环境、文件操作、调用某个功能等等。

#### 什么是可视模式 (Visual-mode)

> 在正常模式按下`v, V, <Ctrl>+v`，可以进入可视模式。可视模式中的操作有点像拿鼠标进行操作，选择文本的时候有一种鼠标选择的即视感，有时候会很方便。
>
> 以上是关于 VIM 四种模式的解读，我们在使用 VIM 操作文本的时候，编辑区底部一般都会显示当前处于什么模式下 (插入模式会有 INSERT 提示，可视模式会有 VISUAL 或者 VISUAL LINE 的提示)。
>
> 当对 VIM 有了感觉之后 ，个人认为 VIM 只有两个模式，便于理解 (纯个人见解，用熟 VIM 以后，应该会赞同这个理解): 
>
> - 操作模式
> - 编辑模式

一个好的编辑器我们无非就使用它的两个功能: 

1、通过一些快捷键操作编辑器实现我们的功能: 复制，粘贴，删除，查询等

2、我们用来编辑，输入内容进入编辑器。

VIM 有一个很重要的按键需要一开始就做出说明，那就是键盘中的 `<ESC>` ,这个按键用来切换模式，该按键可以快速切换到正常模式.

`<ESC>` 这个按键有点特殊，它脱离了主键盘区，每次操作这个按键的时候都会有些繁琐。估计很多使用 VIM 的人都会有这个痛点，因此有了一个解决方案，`control + [` 这两个按键取代 `<ESC>`。 

> 曾经很长一段时间我都是用 `control + [ `用来取代 `<ESC>` ，但是还是感觉有些难受？

VIM 有一个配置文件，在 linux 系统中，该配置文件是 .vimrc , 该文件位于 ～ 目录下面  (～ 目录是家目录，也就是用户目录)，是一个隐藏文件，如果该文件不存在可以手动创建一个。

.vimrc 可以有很多配置，例如显示行号，快捷键配置，插件配置等等。VIM 很多个性化的设置都离不开这个配置文件。**很多vim使用者认为 .vimrc 有一个特别重要的配置，那就是配置如下的一行: **

```text
 #将ESC键映射为两次j键                                      
inoremap jj <Esc>
```

> 这个配置是将 `<ESC>` 功能键用 jj (连续按两次 j) 来取代。这个配置可以很大程度提高 VIM 的使用效率，下文的讲解我都会用 jj 来取代键盘上的 `<ESC>`。



### 用 VIM 打开文件

#### 如何用 VIM 去打开一个文件呢？

现在假如有一个文件 `config.yaml` ,只需要在文件前面加上 vim 关键字就好: 

```
vim config.yaml
```

上面这个命令将会打开 config.yaml 这个文件，config.yaml 是指你想要编辑的文件名。

> 进阶操作
>
> - 用 VIM 打开文件

### VIM 的退出

> VIM 的最终操作就是 VIM 的退出，如何进行 VIM 的有效退出呢？下面针对 VIM 的退出来做一下说明: 

保存当前对文件的修改，但是不退出文件

```
:w 
```

退出文件，对文件的修改不做保存

```
:q!
```

退出文件并保存对文件的修改

```
:wq
```

> 以上的命令都是在命令行模式下的操作 (也就是输入冒号 `: `紧接着输入相应的字符命令如 `:q!` 就会执行退出操作)。在这里要推荐一个常用的操作就是 `ZZ` , 当你对文件进行了修改，需要保存退出，那么可以在键盘上快速的键入两个大写的 Z (ZZ),这样文件就会快速的保存退出了 。

> 进阶操作
>
> - VIM 的退出

### VIM 的插入模式 (Insert-mode)

> 编辑器的主要功能就是输入文本，编辑文本，很多编辑器在打开文件的时候就可以通过键盘录入文字，但是 VIM 有稍许的不同，刚刚接触 VIM 的时候是很难对 VIM 进行编辑操作的，记得我在刚接触它的时候是很崩溃的，但是你接触久了，了解的多了，也就理解如此设计的美妙之处。

#### 如何使用 VIM 编辑文本？

vim在插入模式下才能进行文本编辑

> 这里有必要再强调一下，在使用 VIM 打开文件的时候，这时候的状态是正常模式 (Normal-mode),请务必记住这个模式，如果你不确定当前是否处在正常模式，请连续按两下键盘上的 `jj` (这个 `jj` 需要读者去做相应的配置，上文有做过讲解)，VIM 处理编辑文本需要从正常模式(Normal)切换到插入模式(Insert-mode),进入插入模式的时候你应该会在屏幕底部看到 INSERT 的提示，这时候就可以编辑文本了。

#### 如何从正常模式进入插入模式呢？

请记住下面几个常用启动录入文本的键盘字符 `i,I,a,A,o,O,s,S` 。

- `i`是在光标所在的字符之前插入需要录入的文本。
- `I` 是在光标所在行的行首插入需要录入的文本。
- `a` 是在光标所在的字符之后插入需要录入的文本。
- `A` 是在光标所在行的行尾插入需要录入的文本。
- `o` 是光标所在行的下一行行首插入需要录入的文本。
- `O` 是光标所在行的上一行行首插入需要录入的文本。
- `s` 删除光标所在处的字符然后插入需要录入的文本。
- `S` 删除光标所在行，在当前行的行首开始插入需要录入的文本。

> 还有一个可能经常用到的就是 `cw` ，删除从光标处开始到该单词结束的所有字符，然后插入需要录入的文本 (这个命令是两个字符的合体 cw )。

> 进阶操作
>
> - 代码提示

### VIM 的命令模式 (Command-mode)

> 关于命令模式上文有提到过，下面主要来列举几个常用的命令模式操作 (命令输入完以后，需要按下 Enter 键去执行命令): 

#### 文本的行号设置

显示行号

```
:set nu
```

取消行号

```
:set nonu
```

定位到 n 行

```
:n
```

#### VIM 进行关键字的查找。

```
/{目标字符串}
```

如 `:/div` 会在文本中匹配 `div` 的地方高亮。

查找文本中匹配的目标字符串，查到以后，输入键盘上的 n 会去寻找下一个匹配，N 会去寻找上一个匹配。

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

> 进阶操作
>
> - VIM 处理大小写的区分
> - VIM 删除多行文本
> - VIM 处理文本的替换
> - VIM 执行 Linux 命令
> - VIM 执行命令，并且添加结果至操作文本光标处
> - 定义快捷键

### VIM 的正常模式 (Normal-mode)

VIM 正常模式下，主要进行的操作有光标的移动，复制文本，删除文本，粘贴文本等。

#### 快速移动光标

几个重要的快捷键

快捷键 `h,j,k,l` 这几个按键主要是用来快速移动光标的，`h` 是向左移动光标，`l` 是向右移动光标，`j`是向下移动光标，`k` 是向上移动光标，`h , j , k ,l` 在主键盘区完全可以取代键盘上的 `↑ ,↓ ,← , →` 的功能。

##### 在当前行上移动光标

- `0 `移动到行头
- `^` 移动到本行的第一个不是 blank 字符
- `$` 移动到行尾
- `g_` 移动到本行最后一个不是 blank 字符的位置
- `w` 光标移动到下一个单词的开头
- `e` 光标移动到下一个单词的结尾
- `fa` 移动到本行下一个为 a 的字符处，fb 移动到下一个为 b 的字符处
- `nfa` 移动到本行光标处开始的第 n 个 字符为 a 的地方 (n 是 1，2，3，4 ... 数字)
- `Fa` 同 `fa` 一样，光标移动方向同 `fa` 相反
- `nFa` 同 `nfa` 类似，光标移动方向同 `nfa`相反
- `ta` 移动光标至 a 字符的前一个字符
- `nta` 移动到第二个 a 字符的前一个字符处
- `Ta` 同 `ta` 移动光标方向相反
- `nTa` 同 `nta` 移动光标方向相反
- `;` 和`,` 当使用 f, F, t ,T, 关键字指定字符跳转的时候，使用 `；`可以快速跳转到写一个指定的字符，`, `是跳到前一个指定的字符

##### 跨行移动光标

- `nG `光标定位到第 n 行的行首
- `gg `光标定位到第一行的行首
- `G `光标定位到最后一行的行首
- `H `光标定位到当前屏幕的第一行行首
- `M` 光标移动到当前屏幕的中间
- `L` 光标移动到当前屏幕的尾部
- `zt` 把当前行移动到当前屏幕的最上方，也就是第一行
- `zz` 把当前行移动到当前屏幕的中间
- `zb` 把当前行移动到当前屏幕的尾部
- `%` 匹配括号移动，包括 ( , { , [ 需要把光标先移动到括号上
- `*` 和 `#` 匹配光标当前所在的单词，移动光标到下一个 (或者上一个)匹配的单词 ( `*` 是下一个，`#` 是上一个)

##### 翻页操作

`ctrl+f` 查看下一页内容

`ctrl+b` 查看上一页内容

#### VIM 的复制，粘贴 ，删除

> 三个重要的快捷键 `d` , `y` , `p`

##### d键

`d` 是删除的意思，通常搭配一个字符 ( 删除范围 ) 实现删除功能，常用的如下: 

- `dw` 删除一个单词
- `dnw` 删除 n 个单词，
- `dfa` 删除光标处到下一个 a 的字符处 ( fa 定位光标到 a 处 )
- `dnfa` 删除光标处到第 n 个 a 的字符处
- `dd` 删除一整行
- `ndd` 删除光标处开始的 n 行
- `d$` 删除光标到本行的结尾
- `dH` 删除屏幕显示的第一行文本到光标所在的行
- `dG` 删除光标所在行到文本的结束

##### y键

`y` 是复制的意思，通常搭配一个字符 (复制范围)实现复制的功能，常用的如下: 

```
yw` 复制一个单词，还有 `ynw
yfa` 复制光标到下一个 a 的字符处,还有`ynfa
yy` 复制一行，还有 `nyy
```

- `y$` 复制光标到本号的结尾
- `yH` 复制屏幕显示的第一行文本到光标所在的行
- `yG` 复制光标所在行到文本的结束

##### p键

`p` ，`P`是粘贴的意思，当执行完复制或者粘贴的命令以后，VIM 会把文本寄存起来。

- `p` 在光标后开始粘贴
- `P` 大写的 P 光标前开始粘贴

#### 撤销操作和恢复

`u` 撤销刚才的操作

`ctrl + r` 恢复撤销操作

#### 删除字符操作和替换

`x` 删除光标当前所在的字符

`r` 替换掉光标当前所在的字符

`R` 替换掉从光标开始以后的所有字符，除非 `<ESC >` 退出，或者 `jj`  (代替 `<ESC>` 上文有提到)退出。

> 进阶操作
>
> - 大小写转换
> - VIM 的重复命令

### VIM 可视化模式 (Visual-mode)

> 按 v,V,Ctrl+v 进入可视化模式

- `v` 字符可视化，按下键盘上的v以后，屏幕底部应该会有一个 VISUAl 的提示，操作 h,j,k,l就选中文本，继续按 v 退出可视化模式。

- `V` 行可视化，按下键盘上的 V 以后，屏幕底部应该有一个 VISUAL LINE 的提示，操作 j,k 可以向上或者向下以行为单位选中文本，继续按下 V 退出可视化模式。

- `Ctrl+v` 块状可视化，按下键盘上的 Ctrl+v 以后，屏幕底部应该会有一个提示 VISUALBLOCK ，可以通过 h,j,k,l 块状的操作选择区域，这是很多编辑器都不可以做到的，继续按下 Ctrl+v 会退出可视化模式。

#### 可视化模式下操作文本

可视化模式下选择操作区域以后，
按下 d会删除选择的区域，
按下 y 会复制选择的区域，按下 p 会粘贴选择的区域。

> 进阶操作
>
> - 可视化模式下 v 的特殊操作
> - 块区域下的特殊操作



> 进阶操作
>
> - VIM 的宏录制



## 进程管理

在 Linux 中，每个执行的程序 (代码)都称为一个进程。每一个进程都分配一个 ID 号，即进程号，PID。

> 每个进程都可能以两种方式存在的。前台与后台，所谓前台进程就是用户目前的屏幕上可以进行操作的。后台进程则是实际在操作，但由于屏幕上无法看到的进程，通常使用后台方式执行。

一般系统的服务都是以后台进程的方式存在，而且都会常驻在系统中，直到关机才才结束。

### 显示系统执行的进程


  * ps -aux: 显示当前终端所有进程。
  * ps -aux | more: 配合 more 命令，分屏显示进程信息，便于查看。
  * ps -aux | grep 特定服务: 配合 grep 命令，查看特定的进程信息。比如 ps -aux | grep sshd。
  * ps -ef: 以全格式显示当前所有的进程，也可以查看进程的父进程，父进程符号为 PPID。
  * ps -ef | grep 特定服务: 配合 grep 命令，查看特定进程的父进程。比如 ps -ef | grep sshd。

### 终止进程 kill 和 killall


  * kill [选项] 进程号: 通过进程号杀死进程。
  * killall 进程名称: 通过进程名称杀死进程，也支持通配符。杀死该进程的同时，该进程下的子进程也会被杀死。
  * 常用选项: -9表示强制进程立即停止。
  * 常用实例
    * 踢掉某个非法登录用户: ps -aux | grep sshd 查看登录用户的进程号，后 kill 登录用户的进程号。
    * 终止远程登录服务 sshd，在适当时候再次重启 sshd 服务: kill sshd对应的进程号，再运行 /bin/systemctl
      start sshd.service
    * 终止多个 gedit 编辑器: killall gedit。
    * 强制杀掉一个终端: kill -9 bash对应的进程号

### 查看进程树 pstree


  * pstree [选项]: 可以更加直观的来看进程信息。
  * 常用选项: -p 显示进程的 PID，-u 显示进程的所属用户。
  * pstree -p: 树状的形式显示进程的 PID。
  * pstree -u: 树状的形式显示进程的用户。

## 系统性能

### 总体系统资源性能

可以实时监控系统性能资源占用情况: 

```shell
➜  ~ top
Processes: 461 total, 2 running, 459 sleeping, 1654 threads            12:24:31
Load Avg: 1.75, 1.76, 1.77  CPU usage: 3.67% user, 3.79% sys, 92.53% idle
SharedLibs: 651M resident, 100M data, 130M linkedit.
MemRegions: 64642 total, 2851M resident, 282M private, 1716M shared.
PhysMem: 14G used (2845M wired), 2199M unused.
VM: 16T vsize, 3098M framework vsize, 0(0) swapins, 0(0) swapouts.
Networks: packets: 473883/218M in, 434146/142M out.
Disks: 296545/4553M read, 117220/2058M written.

PID   COMMAND      %CPU TIME     #TH   #WQ  #PORT MEM    PURG   CMPR PGRP PPID
760   iTerm2       17.3 01:26.52 10    7    372   98M    49M    0B   760  1
161   WindowServer 15.5 30:22.08 17    6    1490- 580M-  152M   0B   161  1
2117  top          4.8  00:00.63 1/1   0    26    3928K  0B     0B   2117 2085
1250  Electron     4.3  03:33.36 30    2    465   78M    72K    0B   1250 1
0     kernel_task  4.1  07:10.25 212/8 0    0     487M   0B     0B   0    0
329   com.apple.Ap 2.7  03:22.17 3     2    228   1540K  0B     0B   329  1
343   TouchBarServ 1.2  03:07.88 5     2    728-  28M-   5888K  0B   343  1
864   WeChat       0.9  02:18.05 41    14   915   144M   17M    0B   864  1
155   corebrightne 0.6  00:56.95 9     8    148   1688K  0B     0B   155  1
1697  com.apple.We 0.5  04:35.54 15    3    103   125M   13M    0B   1697 1
543   ClashX       0.5  00:58.84 25    2    254   28M-   84K+   0B   543  1
1511  com.apple.We 0.3  00:13.39 9     3    92    207M   30M    0B   1511 1
92    logd         0.2  00:27.93 4     3    1468  5748K  0B     0B   92   1
405   Safari       0.1  01:38.03 9     3    896-  179M   14M    0B   405  1
1291  Code Helper  0.1  00:32.03 20    1    153   38M    0B     0B   1250 1250
```

进入交互模式后:

输入`M`，进程列表按内存使用大小降序排序;

输入`P`，进程列表按CPU使用大小降序排序；

> `top`第三行显示当前系统的，其中有两个值很关键:
>
> **id**: 空闲CPU时间百分比，如果这个值过低，表明系统CPU存在瓶颈；
>
> **wa**: 等待I/O的CPU时间百分比，如果这个值过高，表明IO存在瓶颈；

> 常用升级版 - htop
>
> `yum install htop`
>
> `apt install htop`

### 查看内存信息

free命令 - 显示系统使用和空闲的内存情况，包括物理内存、交互区内存(swap)和内核缓冲区内存

查看内存实时情况 

- free –h （以G为单位）
- free –m （以M为单位）
- free （以K为单位）
- free –s 10（间隔10s刷新一次）周期性查看内存使用情况

```
➜  ~ free -h
              total        used        free      shared  buff/cache   available
Mem:           1.8G        869M         99M        6.3M        869M        770M
Swap:            0B          0B          0B
```

**说明: **

| 字段       | 说明                                          |
| :--------- | :-------------------------------------------- |
| Mem        | 行(第二行)是内存的使用情况。                  |
| Swap       | 行(第三行)是交换空间的使用情况。              |
| total      | 列显示系统总的可用物理内存和交换空间大小。    |
| used       | 列显示已经被使用的物理内存和交换空间。        |
| free       | 列显示还有多少物理内存和交换空间可用使用。    |
| shared     | 列显示被共享使用的物理内存大小。              |
| buff/cache | 列显示被 buffer 和 cache 使用的物理内存大小。 |
| available  | 列显示还可以被应用程序使用的物理内存大小。    |

### 查看硬盘信息情况

查询系统整体磁盘使用情况: df -h

查询指定目录的磁盘占用情况: du -h /指定目录


| 选项           | 含义                       |
| -------------- | -------------------------- |
| -s             | 指定目录占用大小汇总       |
| -h             | 带计量单位                 |
| -a             | 含文件                     |
| \--max-depth=1 | 子目录深度为1              |
| -c             | 列出明细的同时，增加汇总值 |

```shell
➜  ~ df -h
Filesystem                         Size   Used  Avail Capacity iused      ifree %iused  Mounted on
/dev/disk1s5s1                    325Gi   15Gi  277Gi     6%  577263 2903858320    0%   /
devfs                             190Ki  190Ki    0Bi   100%     659          0  100%   /dev
/dev/disk1s4                      325Gi   20Ki  277Gi     1%       0 2903858320    0%   /System/Volumes/VM
/dev/disk1s2                      325Gi  259Mi  277Gi     1%     810 2903858320    0%   /System/Volumes/Preboot
/dev/disk1s6                      325Gi  344Ki  277Gi     1%      15 2903858320    0%   /System/Volumes/Update
/dev/disk1s1                      325Gi   32Gi  277Gi    11%  789223 2903858320    0%   /System/Volumes/Data
ntfs://disk0s3/BOOTCAMP           141Gi  105Gi   36Gi    75%       1          0  100%   /Volumes/BOOTCAMP
map auto_home                       0Bi    0Bi    0Bi   100%       0          0  100%   /System/Volumes/Data/home
```

### 常用工具

#### htop

htop是top的升级版,允许用户监视系统上运行的进程及其完整的命令行

- 系统不会自带，根据不过系统来进行安装

- 支持用户交互，可以通过鼠标来kill进程而不用通过输入其PID，支持用鼠标上下拖动，且不同的颜色代表不同的意思。

- 允许用户根据CPU，内存和时间间隔对进程进行排序

##### htop安装

```shell
sudo apt install htop # ubuntu
sudo yum install htop # centos
```

##### htop使用

```shell
htop
```

##### htop字段说明

- PID – 描述进程的ID号
- USER – 描述进程的所有者（谁跑的）
- PRI – 描述Linux内核查看的进程优先级
- NI – 描述由用户或root重置的进程优先级
- VIR – 它描述进程正在使用的虚拟内存 （virtual memory）
- RES – 描述进程正在消耗的物理内存（physical memory）
- SHR – 描述进程正在使用的共享内存（shared memory）
- S – 描述流程的当前状态 (state)
- CPU％ – 描述每个进程消耗的CPU百分比
- MEM％ – 描述每个进程消耗的内存百分比
- TIME+ – 显示自流程开始执行以来的时间
- Command –它与每个进程并行显示完整的命令执行 (比如/usr/lib/R)

##### htop快捷键

- `u` – 用于显示特定用户拥有的所有进程。

- `P` –用于基于高CPU消耗对进程进行排序。

- `M` –用于基于高内存消耗对进程进行排序。

- `T` –用于根据时间段对过程进行排序。

- `h` –用于打开帮助窗口并查看此处未提及的更多快捷方式。

##### htop深入了解

帮助： `htop -h`

更细致的解释：`man htop`

#### iostat

iostat *(I/O Statistics, 输入/输出统计)*

用于报告中央处理器（CPU）统计信息和整个系统、适配器、tty 设备、磁盘和 CD-ROM 的输入/输出统计信息，默认显示了与vmstat相同的cpu使用信息

##### iostat安装

```shell
sudo apt install sysstat # ubuntu
sudo yum install sysstat # centos
```

##### iostat选项

| -C       | 显示CPU使用情况       |
| :------- | :-------------------- |
| -d       | 显示磁盘使用情况      |
| -k       | 以KB为单位显示        |
| -m       | 以M为单位显示         |
| -N       | 显示磁盘阵列(LVM)信息 |
| -n       | 显示NFS               |
| -p[磁盘] | 显示磁盘和分区的情况  |
| -t       | 显示终端和CPU的信息   |
| -x       | 显示详细信息          |
| -V       | 显示版本信息          |

##### iostat示例

```shell
➜  ~ iostat
Linux 3.10.0-1160.11.1.el7.x86_64 (VM-4-8-centos)       2022年01月20日  _x86_64_        (1 CPU)

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           3.53    0.00    1.34    0.10    0.00   95.03

Device:            tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn
vda               3.28        16.94        21.39   50570422   63876336
scd0              0.00         0.00         0.00        864          0
```

##### avg-cpu 属性值说明

- %user：CPU处在用户模式下的时间百分比。

- %nice：CPU处在带NICE值的用户模式下的时间百分比。

- %system：CPU处在系统模式下的时间百分比。

- %iowait：CPU等待输入输出完成时间的百分比。

- %steal：管理程序维护另一个虚拟处理器时，虚拟CPU的无意识等待时间百分比。

- %idle：CPU空闲时间百分比。

##### Device 属性值说明

- rrqm/s: 每秒进行 merge 的读操作数目。即 rmerge/s
- wrqm/s: 每秒进行 merge 的写操作数目。即 wmerge/s
- r/s: 每秒完成的读 I/O 设备次数。即 rio/s
- w/s: 每秒完成的写 I/O 设备次数。即 wio/s
- rsec/s: 每秒读扇区数。即 rsect/s
- wsec/s: 每秒写扇区数。即 wsect/s
- rkB/s: 每秒读K字节数。是 rsect/s 的一半，因为每扇区大小为512字节。
- wkB/s: 每秒写K字节数。是 wsect/s 的一半。
- avgrq-sz: 平均每次设备I/O操作的数据大小 (扇区)。
- avgqu-sz: 平均I/O队列长度。
- await: 平均每次设备I/O操作的等待时间 (毫秒)。
- svctm: 平均每次设备I/O操作的服务时间 (毫秒)。
- %util: 一秒中有百分之多少的时间用于 I/O 操作，即被io消耗的cpu百分比

#### vmstat

vmstat *(Virtual Meomory Statistics, 虚拟内存统计)*

是Linux中监控内存的常用工具,可对操作系统的虚拟内存、进程、CPU等的整体情况进行监视。

##### vmstat的常规用法:

- `vmstat`

  查看内存情况

- `vmstat <interval-times>`

  即每隔`<interval-times>`秒采样一次，共采样times次，如果省略times,则一直采集数据，直到用户使用`<ctrl>+c`手动停止为止。

##### vmstat选项

| 选项              | 含义                                                         |
| :---------------- | :----------------------------------------------------------- |
| -fs               | -f: 显示从启动到目前为止，系统复制（fork）的程序数，此信息是从 /proc/stat 中的 processes 字段中取得的。-s: 将从启动到目前为止，由一些事件导致的内存变化情况列表说明。 |
| -S 单位           | 令输出的数据显示单位，例如用 K/M 取代 bytes 的容量。         |
| -d                | 列出硬盘有关读写总量的统计表。                               |
| -p 分区设备文件名 | 查看硬盘分区的读写情况。                                     |

##### vmstat 示例

```shell
➜  ~ vmstat 5
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 6  0      0  76104 216256 696208    0    0    17    21    4    3  4  1 95  0  0
 1  0      0  75832 216256 696236    0    0     0   114 1442 2912  3  1 95  0  0
 0  0      0  75848 216256 696240    0    0     0    14 1365 2801  3  1 96  0  0
 1  0      0  75800 216256 696244    0    0     0    90 1414 2873  3  1 95  0  0
```

## 组与文件权限

### 组的基本操作

#### 用户组的创建

groupadd 组名

当某个用户创建了一个文件后，默认这个文件的所在组就是该用户所在的组。

创建新用户的同时，指定用户所在的组: useradd -g 用户所在组 用户名。

#### 修改文件/目录所在组


  * chgrp 修改后的组名 文件名: 改变文件所在组。
  * chgrp -R 修改后的组名 目录: 改变目录所在组，-R 表示使其目录下所有子文件或目录递归生效。

#### 修改文件/目录所有者


  * chown 修改后的所有者名 文件名: 改变文件所有者
  * chown -R 修改后的所有者名 目录: 改变目录所有者，-R 表示使其目录下所有子文件或目录递归生效。

#### 修改用户所在组


  * usermod -g 修改后的组名 用户名: 修改用户所在组。
  * usermod -d 修改后的目录 用户名: 修改用户登录的初始目录。

### 权限的基本介绍

例如 ls -alh 显示的内容如下:   
 -rwxrw-r-- 5 louis  staff   160B  1 14 14:46 Documents

  * `0位`: 表示文件类型。d: 目录，-: 普通文件，l: 链接，c: 字符设备文件 (鼠标、键盘)，b: 块设备 (硬盘)。
  * `1-3位`: 确定所有者 (所有者，User)拥有的权限。-
  * `4-6位`: 确定所属组 (同用户组，Group)拥有的权限。
  * `7-9位`: 确定其他用户 (Other)拥有的权限。
  * `5`: 硬连接数或目录: 子目录数
  * `louis`: 所有者名
  * `staff`: 在的组名
  * `160B`: 文件大小，如果是文件夹，显示128B
  * `1 14 14:46`: 最后修改日期 (1月14日 14时46分)
  * `Documents`: 文件名或目录

#### rwx 详解

rwx 作用于文件

  * r (可读，read): 可以读取，查看。
  * w (可写，write): 可以修改，但是不可以删除该文件，删除一个文件的前提条件是对该文件所在的目录有写权限。
  * x (可执行，execute): 可以被执行。


rwx 作用于目录

  * r (可读，read): 可以读取，使用ls查看目录内容。
  * w (可写，write): 可以在目录内创建、删除、重命名文件。
  * x (可执行，execute): 可以进入该目录，使用 cd 进入。

#### 修改文件/目录的权限

方式一: + 、-、= 变更权限，规则: 

- u (所有者)
- g (所有组)
- o (其它人)
- a (所有人，u、g、o 的总和)

chmod u=rwx,g=rx,o=x 文件名或者目录: 所有者读写执行的权限，所在组读执行权限，其它组执行权限。

chmod o+w 文件名或者目录: 其它组增加写权限。

chmod a-x 文件名或者目录: 所有人去除执行权限。



方式二: 通过数字变更权限，规则: 

- r=4
- w=2
- x=1
- rwx=4+2+1=7

chmod u=rwx,g=rx,o=x 文件名或者目录 相当于 chmod 751 文件名或者目录

## 编译安装软件

### 编译安装 ffmpeg

1. 进入tmp目录

```shell
cd /tmp
```

2. 下载 ffmpeg-4.2.2.tar.bz2

```shell
wget https://ffmpeg.org/releases/ffmpeg-4.2.2.tar.bz2
```

3. 解压 ffmpeg

```shell
tar -jxvf ffmpeg-4.2.2.tar.bz2
```

4. 进入解压后ffmpeg文件夹

```shell
cd ffmpeg-4.2.2
```

5. 配置项目

```shell
./configure --disable-x86asm
```

6. 编译

> 生成可执行文件

```shell
make
```

7. 安装

> 将可执行文件添加到系统可执行环境中

```shell
sudo make install
```

> 如果没有sudo权限

```shell
➜  /tmp/ffmpeg-4.2.2 make install
INSTALL	install-progs-yes
INSTALL	ffmpeg
INSTALL	ffprobe
install: cannot create regular file '/usr/local/bin/ffmpeg': Permission denied
install: cannot create regular file '/usr/local/bin/ffprobe': Permission denied
make: *** [fftools/Makefile:46: install-progs] Error 1
```

原因: `/usr/local/bin/` 目录的权限是 `drwxr-xr-x.`

9. 查看可执行文件

安装成功后 `ffmpeg` 可执行文件在 `/usr/local/bin/`

```shell
➜  ~ ls /usr/local/bin/
chardetect  cloud-init      easy_install      ffmpeg   jsondiff   jsonpointer
cloud-id    cloud-init-per  easy_install-3.6  ffprobe  jsonpatch  jsonschema
```

10. 查看用法

```shell
ffmpeg -h
```

11. 总体流程

```shell
# 进入tmp目录
cd /tmp
# 下载 ffmpeg-4.2.2
wget https://ffmpeg.org/releases/ffmpeg-4.2.2.tar.bz2
# 解压 ffmpeg 
tar -jxvf ffmpeg-4.2.2.tar.bz2
# 进入解压后文件夹
cd ffmpeg-4.2.2
# 配置项目
./configure --disable-x86asm
# 编译
make
# 安装
sudo make install
# 执行
ffmpeg
```

