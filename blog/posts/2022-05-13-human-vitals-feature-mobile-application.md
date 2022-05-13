---
layout: Post
title: Research on human vitals feature mobile application
subtitle: based on fiber optic sensing
author: louisyoungx
date: 2022-05-13
useHeaderImage: true
headerImage: /img/in-post/2022-05-13/header.jpg
headerMask: rgb(14, 21, 5, .2)
permalinkPattern: /post/:year/:month/:day/:slug/
tags:
  - technology
  - chinese
  - web
  - vue.js
  - javascript
---

human vital features Mobile Application using JavaScript programming language based on the principle of fiber optic sensing.

<!-- more -->

# 面向光纤传感的人体生命体特征手机APP研究

## 摘要

人口老龄化和生活水平的提高是当今中国社会发展的重要趋势。心血管疾病的患病率不断上升，给人们的生活带来了严重的健康隐患。智能监测设备和可穿戴设备可用于日常监测人们的生理信号，为疾病的诊断和预防提供重要的参考价值。通过对生理信号特征的评估和研究，可一定程度上对疾病进行预测和防范。因此通过便携式设备实现对脉搏特征的可靠测量对于心血管疾病的预防和诊断，从而降低心血管死亡率有很大的意义。

考虑到移动通信设备同时具有便捷性和可拓展性，本文基于光纤传感脉搏信号采集原理，采用JavaScript技术栈实现了一套高可用的人体生命体特征手机APP与服务器系统。此APP能接收服务器中转的脉搏数据流并据此绘制脉搏波形图，并基于脉搏数据提取人体生物特征，且能基于此类特征进行实时展示或进行历史数据分析。

**关键词**: *光纤传感器；脉搏波特征；血压和脉搏传播时间；APP；JavaScript*

# Research on human vitals feature mobile application based on fiber optic sensing

## Abstract

Nowadays, the important trend of China's development is the aging of the population and the increase of the economic level. People's health suffers from the threat of cardiovascular diseases. Technological health devices can be used to monitor the physiological signals of the human body, which are very informative for the diagnosis and prevention of diseases. The assessment of the physiological signals of the human body can play a role in disease prevention. Therefore the use of portable devices to measure pulse features is significant for the reduction of mortality from cardiovascular diseases.

Considering that the mobile phone has not only convenience but also excellent expandability, this paper writes a highly available human vital features Mobile Application using JavaScript programming language based on the principle of fiber optic sensing. this Mobile Application can receive the pulse data stream relayed by the server and draw the pulse waveform graph, it can also extract features from the pulse data in real time.

**Keywords**:  *optical fiber pulse sensor; pulse wave features; BP and PTT; mobile application; JavaScript*

<!--英文翻译摘要。#现在中国发展的重要趋势是人口老龄化和经济水平的提高。人们的健康遭受心血管疾病的威胁。科技健康设备可用于监测人体的生理信号，对疾病的诊断和预防很有参考意义。对人体的生理信号的评估可以起到预防疾病的作用。因此使用便携式设备来测量脉搏特征对于心血管疾病的死亡率的下降很有意义。#考虑到手机不仅具备便捷性，还有很好的拓展性，本文基于弯曲光纤传感原理，使用JavaScript编程语言编写了一个高可用的人体生命特征APP。此APP能接收服务器中转的脉搏数据流，并绘制脉搏波形图，它还能从脉搏数据中实时提取特征。-->

## 第1章 引言

### 1.1 前言

根据世界卫生组织公布的最新数据，2020年全球有1790万人死于心血管疾病，占总死亡人数的31.2%[<sup>[1]</sup>](#reference)。心血管疾病死亡已成为全球死亡的主要原因[<sup>[2]</sup>](#reference)。

根据国家统计局最新公布的数据，我国老龄化问题日益突出。2020年底，我国65岁及以上老年人口占中国总人口的13%。根据报告预测，到2025年我国65岁及以上老年人口比例将达到15%。由于老龄化趋势和工作压力的增加，心血管疾病的风险增加[<sup>[3]</sup>](#reference)。

因此，对心血管疾病的预防和控制就显得尤为重要。

光纤传感器具有无源干扰和抗电磁干扰的优点[<sup>[4]</sup>](#reference)，可从脉搏所导致的压力变化中生成脉搏信号[<sup>[5]</sup>](#reference)。因此可利用光纤传感器生成的脉搏信号构建用于监测生命信号的智能系统，在预防和监测心脏病方面具有重要的实际意义[<sup>[6]</sup>](#reference)。

### 1.2 研究背景及意义

21世纪以来，我国经济持续快速增长，人民生活质量随着经济条件的改善而提高。然而，由于饮食结构不合理、生活节奏加快和人口老龄化，严重威胁人类健康的心血管疾病的发病率和死亡率正在上升[<sup>[7]</sup>](#reference)。心血管疾病是目前威胁人类健康并导致患者致残或死亡的重大疾病[<sup>[8]</sup>](#reference)。美国国家心血管疾病中心于2015年初公布了调查数据，数据显示城乡居民心血管疾病死亡人数居所有疾病之首。目前，我国心血管病患者占我国总人口的20.7%，其中高血压患者占心血管病患者总数的93.1%。2010年，我国高血压病死亡人数为204.3万人，占每年死亡总人数的24.6%。2013年，我国共投入2107亿元用于高血压的研究和治疗。心血管疾病已成为我国健康问题的头号敌人。据调查，人们对高血压的认识水平仅为42.6%。由于心血管疾病易发生突发性暴发，潜伏期长且不易被发现，实时监测对于保障人们的生命安全非常重要[<sup>[9]</sup>](#reference)。

脉搏是表征人体心脏工作和循环系统生理状态的重要信号[<sup>[10]</sup>](#reference)。在心跳过程中，心房、心室和主动脉之间的压力差导致来自心室的血流进入主动脉并以称为脉搏波的波沿主动脉根部传播。从脉搏波中获得的心脏和循环系统的生理和病理信息可作为临床诊断和治疗的依据[<sup>[11]</sup>](#reference)。因此脉搏波的研究一直是国内外医学界关注的焦点[<sup>[12]</sup>](#reference)。现有研究和临床统计表明，反映人体血压、心率、血管弹性、血液粘度等一系列心血管参数可以根据脉搏波形的特征进行区分[<sup>[13]</sup>](#reference)。

许多现代智能监控设备使用光电容积传感器技术。这些传感器技术成本低、体积小、系统结构简单，适用于可穿戴设备。但是光电容积传感器有一些限制，例如传感器信号很容易会受外界信号干扰导致数据错误[<sup>[14]</sup>](#reference)。

![图1.1 用于健康监测的小米智能手环](/img/in-post/2022-05-13/1.1.jpg)
> 图1.1 用于健康监测的小米智能手环

图1.1 显示了当今市场上用于医疗监测的智能手环。手环正面是显示屏，背面是光电容积脉搏传感器(Photoplethysmography，PPG)，用于捕捉脉搏信号。除日期时间等基本信息外，还显示脉搏、睡眠时间、血压等生理物理信息。不足之处在于光电容积法由于手环佩戴方式会导致脉搏信号特征出现缺失，这将影响最终的预测。此外，采用光电容积法的智能穿戴设备无法对脉搏传播速度(Pulse Wave Transmit Velocity，PWV) 这类关键参数进行监测，而PWV这类参数与动脉硬化密切相关，对动脉硬化和心血管疾病的预防起重要作用[<sup>[15]</sup>](#reference)。

基于以上背景，本文以弯曲光纤传感技术为基础结合JavaScript技术，设计了移动APP脉搏监测与实时特征分析系统，用于监测人体桡动脉脉搏波，进行数据可视化展示和关键指标预测，该系统能够较好地还原脉搏波的波形特征，并实现利用脉搏波特征值预测血压和脉搏传播时间(Pulse wave Transmit Time，PTT)。

### 1.3 国内外研究现状

1903年，荷兰医生、生理学家Willem Einthoven发明了弦线式检流计，从而带来了心电图历史上的第一次突破[<sup>[16]</sup>](#reference)。普通的检流计无法检测出被肌肉与骨骼所阻隔的心脏所发出的微弱电流，为了检测心脏的微弱电流，埃因托芬将细导线置于强力磁场中，在磁力的作用下导线会微弱的移动，用光将导线的影子投射到纸上，连续记录下来就可以得到心电图。该装置因电磁铁需要冷却的缘故，重达270公斤，需要5个人进行操作。

Willem Einthoven把心电图中的一系列波分别命名为P波，Q波，R波，S波和T波，并且描述了一些心血管系统疾病的心电图特点。[<sup>[17]</sup>](#reference)

1957年位于美国蒙大拿州海伦娜的霍特研究实验室中的实验物理学家Norman Holter和Bill Glasscock研发了动态心电图，他们在1949年开始研究可穿载式的心脏监测设备，并于1962年开始商业生产动态心电图[<sup>[18]</sup>](#reference)。


在使用动态心电图来研究心脏时，其作法类似一般标准的心电图测量。动态心电图是透过许多接到胸部的电极来记录心脏的电信号。电极会放在骨头的位置，以减少因为肌肉运动造成的假影。电极的数量和位置依动态心电图的型号而不同，大部分的动态心电图会使用三个至八个不等的电极。

虽然我们今天仍然在使用那个时代的理论来分析心电图，但是近年来心电描记术领域已经出现了微小的进展。比如，心电记录仪器已经从实验室中的笨重的设备演变成了今天非常便携的装置，并且计算机心电图分析也参与其中。

2004 年，哈佛传感网络实验室研发了一款集合心电图仪、肌电图仪的综合性无线医疗设备 CodeBlue，该设备的软件具有可拓展性，能够在家庭和医院使用。

![图1.2 Apple Watch Series 4](/img/in-post/2022-05-13/1.2.jpg)
> 图1.2 Apple Watch Series 4

2018年9月12日，苹果公司发布Apple Watch Series 4其具备电极式心率传感器，可为使用者制作其心电图，供医疗人员参考。

虽然我国在远程健康监护仪方面研制的时间短，但是由于我国经济的飞速发展以及老龄化程度越来越高，国家和各大高校以及科研单位开始重视此技术的研究，许多科技工作者开始在此领域展开了研究，并取得了一定的成果[<sup>[19]</sup>](#reference)。而且随着 4G、5G、WI-FI 等通信技术的发展，基于无线网络的远程生理信号监测技术逐渐成为了当前健康监测的主流发展方向[<sup>[20]</sup>](#reference)。

2018年哈尔滨理工大学凌建东研究了基于蓝牙与 Andriod 手机通信的生理监护系统，该系统可在手机移动端上将脉搏波绘制并计算出心率与血压[<sup>[21]</sup>](#reference)。

同年，东南大学邓猛设计了能在服务器进行数据分析的脉搏信号监测系统[<sup>[22]</sup>](#reference)。

2021年6月，赵毅飞设计了基于智能手机的生理参数检测系统[<sup>[23]</sup>](#reference)。

综上所述，将脉搏信号测量分析技术与远程传输、移动监控等技术融为一体，可以设计出针对预防心血管疾病和监护人体健康状况的一套低成本移动健康监护系统。

### 1.4 论文研究内容与结构安排

现有的脉搏波检测系统大多数都依赖于计算机，利用计算机的脉搏波检测系统可以完成较复杂的算法、设计较完善的功能，但由于机体积较大，价格较为昂贵，且不便于携带，限制了仪器的使用范围[<sup>[24]</sup>](#reference)。本文的研究目的是利用蓝牙、移动互联网技术及智能终端构建一种便携式用于远程医疗诊断的脉搏信号检测与监护系统。

大多数现有的脉搏波检测系统都依赖于体积较大，不易携带的计算机。本文的目的是开发一种利用云服务器、互联网标准通信协议和移动智能终端的便携式脉搏信号检测和监测系统。

本文的主要研究内容如下:

1. 光电脉搏传感器的原理实现
2. 单片机通过数模转换将脉搏信号数字化并通过ESP8266模块进行转发
3. 云端服务器接收到信号并进行TCP协议与WebSocket协议的中转
4. 移动智能终端会对接收到的脉搏波进行相应的处理，用户可查看的脉搏波形图，脉搏波幅值和心率等特征信息，或查看相应的历史数据信息

本文共分为六章，具体结构如下:

第1章为绪论部分。本章简要阐述了智能生命体征监测设备发展的必要性，介绍了国内外生命体征监测技术的研究现状。

第2章为脉搏波测量原理。介绍了脉搏波产生的机理与波形特征，阐述了其各自的成因、重要性和测量方法。描述了脉搏波特征信号的意义，为通过脉搏信号的测量来实现健康状况的监护与心血管疾病的预防提供了依据。最后阐述了基于弯曲光纤传感器的脉搏测量方法。

第3章为光纤脉搏传感系统的设计。主要设计了一种基于弯曲光纤传感头的小型化脉搏测量系统，包括半导体光源、光纤传感器、光电探测器、MCU系统模块、放大滤波电路、WIFI无线通信模块。介绍了光纤脉搏传感信号采集的设计，完成对脉搏信号的采集任务，并通过网络连接云服务器完成与移动终端 APP 的交互。整个装置具有小体积、低功耗、便于携带的优点。

第4章为服务器架构，服务与部署。本章将逐一讲述各服务的原理、架构模式、设计原因。服务端整体程序采用云服务技术与容器化技术进行部署，因此本章也将简略介绍云服务技术与容器化技术的设计和优势。

第5章为软件系统设计。本章详述了智能手机APP的软件设计，介绍了Web开发技术以及采用的关键技术。然后介绍了软件总体架构设计，以及APP的各部分界面设计进行了详细介绍，最后介绍了软件系统中最核心的部分，即对脉搏数据流的处理与特征算法介绍。

第6章为结论与展望。对之前所做的工作做了一个简短的回顾，并指出了未来进一步的研究方向。

## 第2章 脉搏波测量原理

### 2.1 心电系统和脉搏波的产生原理

心电系统对心脏的功能至关重要，其对心率起决定性作用并协调和组织了心脏肌肉的跳动。心电系统的异常可导致心率过快或过慢，严重甚至会导致心肌和瓣膜的异常。

心脏会产生自己的电信号（也称为心电脉冲），可以通过在胸部放置电极来记录，这些记录的波形被称为心电图（Electrocardiogram, ECG）。首先每个心电脉冲产生一次心跳，单位时间内的心电脉冲数量决定了心率。当电信号 "扩散 "到整个心脏时，会触发心肌以正确的顺序收缩，从而协调每次心跳，确保心脏尽可能有效地工作。心脏的电信号是由一个位于右心房的上部被称为窦房结的微小结构产生的。

心电脉冲从窦房结传到右心房和左心房使两个心房收缩，并将其负载的血液推向左右心室。

![图2.1 心脏电气系统的组成部分](/img/in-post/2022-05-13/2.1.jpg)
> 图2.1 心脏电气系统的组成部分

图2.1 展示了心脏电气系统的组成部分，包括窦房结(SN)和房室结(AV结)。从电学的角度来看，可以认为心脏被分为两部分: 心房(上腔)和心室(下腔)。分隔心房和心室的是一块纤维组织(图中标为房室盘)。这种不导电的组织可以防止心房和心室之间的电信号在房室结之外通过。

图中结构部分对应:

- SN = 窦房结
- AVN = 房室结
- RA = 右心房
- LA=左心房
- RV = 右心室
- LV=左心室
- TV=三尖瓣(将右心房和右心室分开的瓣膜)
- MV = 二尖瓣(将左心房和左心室分开的瓣膜)

### 2.2 脉搏波特征点的意义

心脏单次射血入主动脉的过程对应脉冲波的一个周期。每个周期的脉搏波中包含许多特征点，可以反映心血管系统的弹性和外周血管阻力。时间差和幅值就是脉搏波的特征值，一个周期内的主要特征点如图2.2所示:

![图2.2 单个周期的脉搏波形](/img/in-post/2022-05-13/2.2.jpg)
> 图2.2 单个周期的脉搏波形

各特征点的意义是:

1. a点是单个脉搏波周期的起点。是心脏收缩的初始阶段，为动脉内血液的释放做准备。处于周期的最低点。相邻周期中a点之间的时间差为一个脉冲周期。
2. b点为主脉搏波的峰值点。为一个周期的最大振幅点。此时心脏收缩程度最大，相应的收缩压也最高。 a-b 段在整个脉搏周期中更陡峭，在此期间心脏继续通过动脉泵血。
3. d点是潮波的峰值点。此时心输出量的强度减慢，心脏收缩到最小的体积。然后血压逐渐下降。潮波通常出现在主波波峰之后，其幅度略低于主波峰的幅度。
4. e点是重博波谷点，标志着心脏射血完成，射血过程放缓，代表主动脉瓣逐渐关闭的过程。
5. f点是重博波峰点，代表心脏开始舒张，血液回流，动脉再次膨胀。

心脏向动脉射血，血液在动脉中以脉搏波的形式继续传播，因而脉搏波除了受心脏的影响之外，还受到主动脉和各级分支动脉的影响，这也导致了不同个体的脉搏波具有不同的波形特征[<sup>[25]</sup>](#reference)。

### 2.3 ECG和PPG心电信号图

现有的对心脏监测的方法有两种，即ECG与光电容积脉搏波描记法（PPG）。

ECG是通过在心脏附近的胸部放置电极进行收集，这些电极测量每个心动周期中心脏的电激活情况。ECG的优点是直接测量心脏的心电信号，干扰较少，信号准确。主要的缺点是测量ECG的胸部电极不适合用于便携移动的持久化测量中。

PPG采用一个光学传感器来测量每次心跳时血液在动脉和毛细血管中灌注时皮肤颜色的变化，通常使用指尖或手腕上的便携装置进行测量。PPG 方法的优点是成本低、可携带、轻量化。然而与心电图测量相比，PPG 更易受环境影响，相比ECG往往包含更多噪音，使得分析更加困难。

### 2.4 基于弯曲光纤传感器的脉搏测量方法

近年来，利用弯曲光纤传感器监测人体生理信号受到了广泛关注。弯曲的光纤压力传感器具有灵敏、解调简单的优点，可以成功地还原脉搏波的特性。因此，本文中采用了基于弯曲光纤传感器头获取桡动脉处的脉搏波。

![图2.3 弯曲光纤示意图](/img/in-post/2022-05-13/2.3.jpg)
> 图2.3 弯曲光纤示意图

弯曲光纤传感器头是通过将单模光纤弯曲一定角度制成的[<sup>[26]</sup>](#reference)。传感器是基于光纤宏弯损耗的原理。当光纤弯曲到一定角度时，光信号继续沿着光纤的纤芯传播，其余的则沿着光纤的纤芯传播。光通过纤芯渗入弯曲外壳，降低了另一端的输出光输出功率。也称为弯曲光纤损耗。光纤的曲率半径远大于纤芯直径，因此传输以宏弯损耗为主。

根据光弯曲损耗原理制成的传感器属于强度调制光纤传感器。即外部信号的变化直接调制光强。随着外部信号的变化，光的强度也会发生变化。因此只需要检查输出光的强度变化，即可据实现外部信号的测量。


### 2.5 本章小结

作为理论基础的阐述，本章介绍了心电系统的作用机理，以及脉搏波生理特征参数的意义。接着介绍了基于弯曲光纤技术的脉搏波测量方法。

## 第3章 光纤脉搏传感系统

### 3.1 光纤脉搏传感系统简介

本章将详细讲述光纤脉搏传感系统的构成，以及各模块如何组成整体相互协作，以及各自模块所发挥的作用。

![图3.1 光纤传感系统架构图](/img/in-post/2022-05-13/3.1.jpg)
> 图3.1 光纤传感系统架构图

图3.1为光纤传感系统为本文采用光纤传感系统架构图，光纤传感系统主要由信号采集系统和信号处理系统组成。

信号采集系统包括: 半导体光源、光纤传感头、光电探测器。

信号处理系统包括: MCU系统模块、放大滤波电路、WIFI无线通信模块。

### 3.2 信号采集系统

信号采集系统由半导体光源、光纤传感头、光电探测器，本章将重点介绍光纤脉搏传感信号采集系统的构成，器件选取与系统搭建。

#### 3.2.1 半导体光源

光源是传感器的信号生成部分。由于本系统的目标使用场景要求小型化、便携化，故此本系统选用的光源为上海嘉慧光电子技术有限公司生产的单模同轴激光二极管光源 (1550nm DFB SM coaxial laser diode)。

该光源有如下优点:

1. 信号稳定。该型号光源输出光信号稳定，产生的波长为 1550nm 的光信号信噪比高。
2. 功耗低。该光源功耗较低，工作电压为1.2V。供电简单，仅需一粒1.2v纽扣电池即可正常工作。
3. 体积小。该光源相对于其他光源，驱动电路简单小巧，适用于微型化系统。

![图3.2 激光二极管光源](/img/in-post/2022-05-13/3.2.jpg)
> 图3.2 激光二极管光源

#### 3.2.2 弯曲光纤传感头

本文使用的弯曲光纤传感头采用普通单模裸光纤制成。根据第2章介绍的弯曲损耗原理可知，弯曲半径越小，灵敏度越大，损耗越大。考虑到其灵敏度和损耗对实验的影响，本文制作的弯曲光纤传感头的弯曲半径为3mm。为了保证传感头的能够在日常生活中长期使用，本文针对传感头进行了如下包装设计:

1. 使用内置弯曲光纤传感头的魔术带作为固定带。
2. 采用触感和柔软度接近人体皮肤的硅胶作为接触面。
3. 选择一条细布条作为魔术带和硅胶之间的连接，缠绕在硅胶周围并用胶水固定。
4. 将单模光纤弯曲到3mm的弯曲半径并粘在一块薄布上，使用UV胶固定硬化。

封装的触摸头显著提高了其使用寿命并提高了测量效果，并且具有小型化和便携化的优点。其结构示意图如图3.3所示。

![图3.3 弯曲光纤传感头](/img/in-post/2022-05-13/3.3.jpg)
> 图3.3 弯曲光纤传感头

#### 3.2.3 光电探测器

光电探测器的主要功能是将光信号转换为电信号。市场上的探测器种类繁多，其性能对信噪比有直接影响。本文选用InGaAs PIN 光电二极管，该型号器件具有如下优点:

1. 灵敏度高，仅为 1mV/mW
2. 暗电流小，外接供电电压小
3. 适用于小型化的系统，工作部分尺寸为 1 mm。

![图3.4 FC 接口型 InGaAs PIN 光电二极管](/img/in-post/2022-05-13/3.4.jpg)
> 图3.4 FC 接口型 InGaAs PIN 光电二极管

### 3.3 信号处理系统

MCU系统是整个脉搏传感系统的中心，其主要功能是接收光纤脉搏传感器的信号并控制其运行状态，并将处理后的信号通过TCP协议传输到云服务器。

本系统对脉搏信号的测定有便携性，轻量化和实时性的要求，因此对控制器有以下要求:

1. 具有高分辨率的ADC功能，可以准确地接收和转换弯曲光纤传感器检测到的信号。
2. 适配丰富的通讯接口，必须支持TCP网络传输，可以支持蓝牙通讯扩展。
3. 具有数字信号处理和浮点运算功能，可对采集到的脉冲信号进行处理和分析。
4. 体积小，芯片尺寸不宜过大，可作为可穿戴设备的处理中心。
5. 低功耗，可随身携带可穿戴设备进行长期监测。

最终本文采用了STM32F103C8T6作为处理器，这是一款32位ARM Cortex-M STM32系列内核微控制器，该芯片为48针外壳，内置定时器等资源，内置12位ADC。具有低成本、高性能、低功耗、高集成度等诸多优点。使用该芯片作为脉搏传感器整个节点的控制芯片，不仅可以利用其卓越的性能满足功能需求。因其内置了ADC芯片，系统不需要使用额外的ADC芯片，满足了采集单元小尺寸和低功耗的要求。

### 3.4 本章小节

本章介绍了光纤脉搏传感系统的两大主要组成部分: 信号采集系统和信号处理系统。本章详细介绍了信号采集系统的各个组成部分，包括半导体光源、弯曲光纤传感头、光电探测器，并简略介绍各部分工作原理。并大致介绍了信号处理系统及其核心部分MCU系统。

## 第4章 服务器架构，服务与部署

> 服务器端代码 - [https://github.com/louisyoungx/tcp-transfer-server](https://github.com/louisyoungx/tcp-transfer-server)

### 4.1 服务器架构概述

脉搏传感系统和客户端之间通过服务器进行连接，这相比目前主流的蓝牙连接有几个非常显著的优点:

- 连接方便快捷。传统蓝牙连接方式每次打开客户端都要与传感器进行蓝牙配对和连接，而通过服务器中转架构只需打开手机即可查看脉搏波形。
- 云端数据保存。无需担心用户不小心清空软件数据。
- 借用云端算力进行云计算数据分析。移动端算力并不足以运行基于机器学习和深度学习的脉搏波病理分析的模型。
- 成本低廉。由于云服务的普及推广，上云不仅方便稳定，还具有带宽大且价格低廉的优点。

本文所设计的服务端程序的基于Turbon基础架构与基于B/S模式(浏览器服务器模式)进行设计，以 VSCode 为软件开发平台，采用Python作为开发语言，Nginx作为Web服务器。借助Turbon框架的store模块对用户数据进行储存。在设计模式上，采用了宏服务模式。主要服务包括API服务、协议转换与转发服务。本章将会逐一讲述各服务的原理、架构模式、设计原因。服务端整体程序采用云服务技术与容器化技术进行部署，因此本章也将简略介绍云服务技术与容器化技术的设计和优势。

### 4.2 基础架构

Turbon是本文作者自研的All in One Python项目运行基础框架，无需安装任何第三方库， 内置纯Python原生实现的多进程http服务器，可通过内置restful web api或网页查看本地日志，可自定义web模版, 可定时执行代码，可动态加载依赖包，可进行消息通知，可定义服务器api查看运行状态，可进行持久化存储，有完善的日志与配置系统。

Turbon框架的组织方式秉持模块化的思想，各模块之间高内聚，低耦合。

各模块功能列表:

- `Config`
  - `config.yaml` - 配置信息
  - `config` - 对config.ini中数据进行读取与初始化
  - `direct` - 字典转对象，通过点直接访问配置属性
- `Core`
  - `core` - 程序执行的入口
- `Depend`
  - `load_depend` - 导入依赖
  - `import_lib` - 动态加载依赖
- `Logger`
  - `Log_Files` - 存储日志文件
  - `logger` - 日志模块
  - `progress` - 进度条模块
- `Message`
  - `message` - 消息传递接口，可通过QQ机器人与邮箱发送信息
- `Scheduler`
  - `scheduler` - 批量执行任务模块
  - `task` - 单任务定时执行模块
- `Server`
  - `api` - 自定义api
  - `handler` - 包含主要的HTTP请求处理
  - `router` - api路由函数
  - `server` - 用于配置并启动服务器线程
  - `url` - 用于路由配置
- `Static`
  - 静态文件存放目录
- `Storage`
  - `storage` - 数据持久化存储
  - `reactive` - 实现数据响应式
- `TEST`
  - 一些测试文件
- `runserver`
  - `Turbon`启动入口

可通过配置文件对各模块进行功能开关和对应控制。

```yaml
Information:
  project: Turbon
  version: 1.0.0-beta
  author: Louis·Young
  time: 2021-07-27

Debug: # 调试设置(用于测试Core中代码)
  open: false # 开启Debug后无视Scheduler只会执行Core.core.main函数中代码

Server: # 服务器设置(用于提供静态文件和api)
  open: true # 是否启用服务器
  name: Turbon-Server # 服务器名
  version: 1.0.0-beta # 服务器版本
  port: 12000 # 运行端口号
  local_host: 0.0.0.0 # 用于启动项目的局域网IP
  server_host: localhost # 填写服务器域名
  process_mode: false # 是否开启多进程
  process_count: 4 # 进程数量
  static_path: /Static

Logger: # 日志设置(用于日志系统)
  file_name: turbon.log # 日志文件名
  file_path: /Logger/Log_Files/ # 日志文件地址
  count: 1 # 日志文件个数
  max_bytes: 10485760 # 单个日志文件的大小
  clear_up: true # 每次启动程序是否清理日志文件中内容
  colorful: true  # 命令行色彩输出
  server_logger: false # 开启 Server 的详细日志记录

Storage: # 本地存储设置(用于状态持久化存储)
  name: state.json # 存储文件名
  path: /Storage/ # 存储地址

Depend: # 依赖管理模块(用于动态引入依赖库)
  open: true
  file: requirements.txt
  path: /

Scheduler: # 调度器设置(用于定时执行)
  open: false # 是否开启定时执行
  skip_weekend: true # 周末不执行任务
  time: # 任务执行时间
    - "18:00:00"
    - "19:00:00"
    - "20:00:00"

Message: # 消息发送设置(用于通知)
  open: false # 是否开启消息通知，开启后会自动发送到设置好的Mirai QQ消息服务器
  target_server: ip.address:port # 通知服务器，当前使用Mirai服务
```

所有采用Turbon框架开发的程序都会通过一个单一Python程序的形式呈现。

```python
import Depend
from concurrent.futures import ProcessPoolExecutor
from Core import core
from Logger import logger
from Scheduler import Scheduler
from Config import config
from Server import server
from threading import Thread


def running():
    PROCESS_MODE = config.Server.process_mode
    SCHEDULER = config.Scheduler.open
    SERVER = config.Server.open
    if not SCHEDULER:
        thread_core = Thread(target=core)
        thread_core.start()
    else:  # 调度器开启后core函数将被scheduler调度器代理，开启定时执行core
        startTime = config.Scheduler.time
        skipWeekend = config.Scheduler.skip_weekend
        scheduler = Scheduler(task=core, startTime=startTime, skipWeekend=skipWeekend)
    if SERVER:
        if PROCESS_MODE:
            work_count = config.Server.process_count
            server_process(work_count)
        else:
            thread_server = Thread(target=server)
            thread_server.start()


def server_process(work_count=4):
    with ProcessPoolExecutor(work_count) as pool:
        for i in range(work_count):
            pool.submit(server())


if __name__ == "__main__":
    DEBUG = config.Debug.open
    if DEBUG:
        logger.info("\n===== DEBUG MODE =====")
        core()
    else:
        running()
```



Turbon框架的稳定性经过大型项目的考验，是值得信赖的。

> Turbon框架代码 - [https://github.com/louisyoungx/turbon](https://github.com/louisyoungx/turbon)

### 4.3 API服务

本服务端的API服务采用RESTful API的通信模式，服务端API服务主要包括登录鉴权API与数据通信API，由Turbon框架的Server模块提供支持。

API是一套用于构建和整合应用软件的定义和协议，也被称为信息提供者和信息使用者之间的协议。API确定调用端需要获取的信息和响应端需要回应的内容。例如，本服务端的API服务设计可以由客户端提供一个用户的ID，并由服务端回复一个包括历史脉搏数据的列表。

API也看作是用户与他们想要获得的服务器资源或服务之间的联系人，即一个组织分享资源和信息的方式。API同时也需要确保用户访问和内容传输的安全性，所以也要承担决定谁可以访问什么服务或资源的权限，即需要具备控制和认证的功能。例如，本服务端在获取用户数据和建立通信之前需要用户先进行登录操作，这需要由客户端通过API服务向服务器请求权限，如果认证通过，服务器又会通过API返回一个对应该用户的Cookie作为凭证，如果认证不通过，服务器会返回一个拒绝信息。

REST是REpresentational State Transfer的首字母缩略词，代表表示状态转移，由计算机科学家Roy Fielding创建。RESTful API即符合REST架构风格约束的应用编程接口，是一种分布式超媒体系统的架构风格。RESTful使程序的API通信更快、更轻，可扩展性更强，非常适合物联网和移动应用开发[<sup>[27]</sup>](#reference)。

在本文项目中，所有服务器和客户端之间的通信都是通过REST风格的API进行传输通信的，即通过RESTful API进行通信。因此本文中开发的API符合这些标准:

- 客户与服务器分离，通过HTTP协议进行通信求。
- 客户与服务器之间的通信无状态，每个请求都是没有联系的独立请求。
- 数据可缓存，精简客户端与服务器之间不必要的互动。
- 组件之间的统一接口，信息以标准形式传输。
- 所请求资源可识别。即客户端可以通过收到的描述对资源进行操作，这要求响应中表示包含足够的信息，即资源的可识别性。

### 4.4 协议转换与转发服务

光纤脉搏传感器与移动APP客户端无法直接进行通信，需要服务器进行数据中转，即通过服务器传递脉搏传感器与移动APP客户端之间的数据。并且由于光纤脉搏传感器与移动APP客户端的通信协议不同，故此需要服务器进行协议转换才能进行对应连接。

在协议转换与转发服务中，光纤脉搏传感器与移动APP客户端被抽象为两个对象，详见下表:

| 概念     | 实际对应       | 通信协议   |
| -------- | -------------- | ---------- |
| Sender   | 光纤脉搏传感器 | TCP        |
| Receiver | 移动APP客户端  | WebSockect |

Sender与服务器通过 TCP 通信协议进行数据传输，当完成三次握手协议后数据能正常在两者之间进行传输。而Receiver与服务器之间是通过 WebSocket 通信协议进行数据传输，完成 WebSocket 握手后，数据通过服务器进行协议转换并将在两者之间正常传输。

#### 4.4.1 TCP协议

在光纤脉搏传感器的可选网络协议中，可选协议有TCP和UDP。本节将对TCP与UDP协议进行对比，说明本文挑选TCP作为光纤脉搏传感器与服务器之间的传输协议是出于哪些考量，并详细描述TCP协议连接传输的过程原理。

TCP协议[<sup>[28]</sup>](#reference)(传输控制协议)是面向连接的，一旦建立了连接，数据就可以双向传输。TCP有内建的错误检查系统可以检查出出错的数据包，并且可以保证数据将按照发送的顺序传递，这使得TCP成为传输静止图像、数据文件和网页等信息的完美协议。但尽管TCP非常地可靠，更繁琐的反馈机制也导致了更大的开销，对网络传输的可用带宽作出了限制。

UDP协议(用户数据报协议)是一种更简单、无连接的互联网协议，不需要数据包错误检查和丢包重新传输。使用UDP协议无需付出建立连接、维持连接或终止连接的开销，数据被持续地发送给接受端，但并不确保数据是否被接受端是否收到，也不确保接收端收到的数据包顺序的正确与否。UDP的特性不适用于发送电子邮件、查看网页或下载文件，但对于网络直播，大流量视频或并行网络传输等实时通信来说是当仁不让的首选。

下表对TCP与UDP各自特点做了对比:

| 特点           | TCP                                                        | UDP                              |
| -------------- | ---------------------------------------------------------- | -------------------------------- |
| 连接状态       | 面向连接，需要已建立的连接来传输数据，传输完成后应关闭连接 | 无连接，无需打开、维护或终止连接 |
| 数据排序       | 确保数据包排序正确                                         | 数据包可能是乱序的               |
| 确保数据包到达 | 可以保证将数据包全部传输到目的地                           | 无法保证数据全部到达             |
| 数据的重新传输 | 重新传输丢失的数据包                                       | 没有丢包重传                     |
| 错误检查       | 完善的错误检查和数据确认                                   | 使用校验和的基本错误检查机制     |
| 速度           | 比UDP慢                                                    | 比TCP快                          |
| 使用场景       | HTTP、SMTP、POP、FTP等协议中广泛使用                       | 视频会议、网络视频、DNS、VoIP等  |

由于在本项目中，即脉搏信号的传输中，对数据包的顺序，数据的正确性和数据包的完整性都有要求，否则可能造成脉搏波形紊乱，特征错误和数据预测出现严重错误结果，因此不可靠的UDP传输不能用于脉搏信号的传输。

TCP协议的运行可划分为三个阶段: 连接创建(connection establishment)、数据传送(data transfer)和连接终止(connection termination)。

TCP用三次握手(three-way handshake)过程创建一个连接。通常由服务器端打开一个套接字(socket)监听来自客户端的连接，即被动打开(passive open)。服务器端被打开，客户端就能开始创建主动打开(active open)。

服务器端执行了listen函数后，就在服务器上创建起两个队列:

- SYN队列: 存放完成了二次握手的结果。 队列长度由listen函数的参数backlog指定。
- ACCEPT队列: 存放完成了三次握手的结果。队列长度由listen函数的参数backlog指定。

三次握手协议的过程:

1. 客户端(通过执行connect函数)向服务器端发送一个SYN包，请求一个主动打开。该包携带客户端为这个连接请求而设定的随机数A作为消息序列号。
2. 服务器端收到一个合法的SYN包后，把该包放入SYN队列中；回送一个SYN/ACK。ACK的确认码应为A+1，SYN/ACK包本身携带一个随机产生的序号B。
3. 客户端收到SYN/ACK包后，发送一个ACK包，该包的序号被设定为A+1，而ACK的确认码则为B+1。然后客户端的connect函数成功返回。当服务器端收到这个ACK包的时候，把请求帧从SYN队列中移出，放至ACCEPT队列中；这时accept函数如果处于阻塞状态，可以被唤醒，从ACCEPT队列中取出ACK包，重新创建一个新的用于双向通信的sockfd，并返回。

![图4.1 TCP连接创建](/img/in-post/2022-05-13/4.1.jpg)
> 图4.1 TCP连接创建

在TCP的数据传送状态，很多重要的机制保证了TCP的可靠性和强壮性: 使用序号，对收到的TCP报文段进行排序以及检测重复的数据；使用校验和检测报文段的错误，即无错传输；使用确认和计时器来检测和纠正丢包或延时；流控制(Flow control)；拥塞控制(Congestion control)；丢失包的重传。

![图4.2 TCP数据包结构](/img/in-post/2022-05-13/4.2.jpg)
> 图4.2 TCP数据包结构

服务端Sender核心代码:

```python
def handleSend(client):
    while True:
        try:  # recieving valid messages from client
            message = client.recv(1024).decode()
            broadcast(message)
        except:
            client.close()
            print("====== Send Close ======")
            broadcast('Send Closed')
            break
```

#### 4.4.2 WebSocket协议

在移动APP客户端与服务器的网络连接中，可选通信方式有最前沿的WebSocket技术和主流的HTTP轮询请求技术。本节将对WebSocket与HTTP轮询请求进行对比，说明本文挑选WebSocket作为移动APP客户端与服务器的网络连接中的通信方式是出于哪些考量，并详细描述WebSocket协议连接传输的过程原理。

HTTP轮询本质上是原始轮询技术，即向服务器发出重复请求，这会造成会严重的资源浪费，因为每个新HTTP连接都要重新建立，HTTP查询头需要被重新解析，并且必须对新数据进行重新查询，服务器还需要重新生成和交付一个一般不包含新数据响应。然后需要花时间关闭连接并清理连接资源。

![图4.3 HTTP轮询请求](/img/in-post/2022-05-13/4.3.jpg)
> 图4.3 HTTP轮询请求

WebSocket[<sup>[29]</sup>](#reference)是建立在设备的TCP/IP协议栈之上的一个新的传输层。其目的是为网络应用程序开发者提供一个本质上近似于原始的TCP通信层，同时也新增一些措施来消除网络传输的一些弊端。并且基于WebSocket的网络传输非常安全，带有有额外的安全加密。

![图4.4 WebSocket连接](/img/in-post/2022-05-13/4.4.jpg)
> 图4.4 WebSocket连接

总体来说，WebSocket是移动APP客户端与服务器的网络通信中更好的选择。长时间的HTTP轮询对服务器的资源消耗更大，而WebSocket对服务器的占用极轻。

建立Websocket连接需要通过浏览器发出请求，之后服务器进行回应，这个过程通常称为握手(Handshaking)。握手以HTTP请求开始，约定进行协议升级，并在HTTP连接所在端口建立WebSocket连接。一旦建立了连接，通信就切换到不符合HTTP协议的双向二进制协议。连接建立后，客户端和服务器可以在全双工模式下来回发送WebSocket数据或文本帧。WebSocket的传输被描述为消息，其中一条消息可以选择分割成几个数据帧。通过对协议的扩展，也可以用于同时复用几个数据流。

WebSocket的优点有:

- 全双工异步消息传递。客户端和服务器都可以独立且主动地将信息流传给对方。
- 兼容性好。WebSocket可通过大多数防火墙而不需要重新配置。
- 安全性高。基于来源的加密安全模型。

服务端Receiver核心代码:

```python
def handleReceive(Receiver):
    while True:
        try:  # recieving valid messages from client
            message = Receiver.client.recv(1024)
            broadcast(message)
        except:  # removing receivers
            receivers.remove(Receiver)
            Receiver.client.close()
            print("====== Receive Close ======")
            broadcast('Receive Closed')
            break
```

#### 4.4.3 并发连接与转发

协议转换与转发服务的并发连接模型有两种选择，即多线程模型和多进程模型。本节将会讲述多线程模型和多进程模型的概念和区别，以及本文项目选用多线程模型进行连接服务的原因。

多进程是指一个系统能够并发地运行多个处理器，每个处理器可以运行一个或多个进程。多进程使单个处理器复制全部代码、数据和文件，开销比多线程更大。多进程对CPU多核心计算很有优势，比如计算量大的任务。

![图4.5 多进程模型](/img/in-post/2022-05-13/4.5.jpg)
> 图4.5 多进程模型

多线程是指一个处理器并发执行多个线程的能力，每个线程运行一个程序。在多线程中，每个线程共享相同的代码、数据和文件，只是在不同的寄存器和堆栈上运行，也因此多线程对I/O操作有很大优势，比如从文件系统，网络或数据库中读取数据。

![图4.6 多线程模型](/img/in-post/2022-05-13/4.6.jpg)
> 图4.6 多线程模型

协议转换与转发服务的特点是一个I/O操作特别大的服务，但并非一个计算量很大的计算密集型服务，因此综上原因采取多线程模型，每个Sender和Receiver的连接都会建立一个新的线程，以免阻塞主线程。并且多线程模型还给协议转换与转发服务带来一个优点是，每个线程可以共享数据段数据，即可以共用一个全局变量来作为消息队列，这避免了多进程中I/O锁的问题，大大简化了代码工作量。

#### 4.4.4 服务器转发运行流程

1. 光纤传感系统通过TCP协议连接上服务器进行数据传输，服务器启动一个Sender线程，准备接受数据。
2. APP客户端通过HTTP协议连接服务器，并与服务器协商升级为WebSocket协议进行数据接收，服务器启动一个Receiver线程，准备发送数据。
3. 服务器将所有从Receiver接受到的数据加入一个缓存列表中。
4. 服务器将缓存中的数据发送到APP客户端。

转发服务主程序:

```python
def main(): # 接受多个receiver作为数据源
    allow = '' # 允许的ip地址
    global receivers
    receivers = []
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # socket对象实例化
    server.bind((allow, port)) # 在socket对象上绑定端口
    server.listen() # 开始监听
    while True:
        client, address = server.accept()
        key = client.recv(1024)
        try:
            value = key.decode()
            print(value)
        except:
            print(f'ERROR MESSAGE: {key}')
            value = ""
        if "GET / HTTP/1.1" in value: # TCP连接，进入Receiver处理流程
            try:
                Receiver = WebSocket(client)
                Receiver.init(key)
            except:
                continue
            try:
                info = client.recv(8096)
            except Exception as e:
                info = "None"
            body = Receiver.unpackage(info)
            Receiver.send('Success')
            receivers.append(Receiver)
            Receive_Thread = threading.Thread(target=handleReceive, args=(Receiver,))
            Receive_Thread.start()
            continue
        else: # WebSocket连接，进入Sender处理流程
            client.send('Success'.encode())
            Send_Thread = threading.Thread(target=handleSend, args=(client,))
            Send_Thread.start()
```

### 4.5 服务部署

本文服务端采用云服务技术和容器化技术相结合的方式作为程序的部署平台。与传统部署方式相比，云服务技术和容器化技术相结合的方式具备稳定性，可拓展性，可移植性等诸多优点，是现在各个互联网服务所采用的最前沿最完善的一套解决方案。本节将分别对云服务和容器化技术做一个简要的介绍，并描述本项目在具体部署中如何结合这两种技术来组成部署平台。

#### 4.5.1 云服务

云服务器是一种集中的服务器资源，通过互联网托管和提供，并由多个用户按需访问。云服务器可以执行与传统物理服务器相同的所有功能，提供处理能力、存储和应用。

云服务器可以位于世界的任何地方，通过云计算环境远程提供服务。相比之下，传统的专用服务器硬件通常设置在场所内，供一个组织独家使用。

云服务器采用基础设施即服务(IaaS)模式。采用IaaS的组织不需要拥有和管理他们自己的硬件；他们可以从通过公共云按需提供资源的第三方那里提供硬件。

云服务器已经彻底改变了IT行业。无数的公司已经从传统的、集中的服务器和基础设施设置中转移出来，以适应这种改变行业规则的技术。有四个主要的优点推动了这种转变。

- 可负担性。对公司来说，使用由第三方供应商管理的云服务器比购买和维护他们自己的基础设施要便宜得多。公司在与他人共享服务器资源时，可以从规模经济中获益，而且他们只需为他们使用的资源付费。
- 方便维护。公共云资源通常可以在几分钟内完成配置，并通过一个控制面板或API轻松管理。当IT团队不再需要在企业内部维护复杂的基础设施时，他们的资源就被释放出来用于其他任务。用户可以从任何地方访问数据。
- 可扩展性。随着计算和数据存储需求的变化，云服务器可以快速响应，扩大或缩小规模以满足需求。
- 可靠性。云服务器可以提供与专用服务器相同的性能。由于云在一个共享环境中的多个服务器上运行，即使一个组件出现故障，服务也可以继续。

![图4.7 云服务概念图](/img/in-post/2022-05-13/4.7.jpg)
> 图4.7 云服务概念图

#### 4.5.2 容器化

容器化是将软件代码与运行代码所需的操作系统库和依赖关系打包，以创建一个单一的轻量级可执行文件，即容器，并在任何基础设施上稳定运行。容器比虚拟机(VM)更便携、更节省资源，已经成为现代云原生应用事实上的部署单元。

容器化使开发人员能够更快、更安全地创建和部署应用程序。用传统的方法，代码是在一个特定的计算环境中开发的，当转移到一个新的地方时，往往会导致错误和误差。例如，当开发人员将代码从桌面计算机转移到虚拟机(VM)或从Linux转移到Windows操作系统时。容器化通过将应用程序代码与运行所需的相关配置文件、库和依赖关系捆绑在一起而消除了这个问题。这个单一的软件包或容器被从主机操作系统中抽象出来，因此，每个单独的容器都是独立的，可以在任何平台或云上运行。

容器化和流程隔离的概念实际上已有几十年的历史，但2013年开源的Docker引擎的出现[<sup>[30]</sup>](#reference)，即一个具有简单开发者工具和通用打包方法的容器行业标准加速了这项技术的采用。时至今日，越来越多的企业正使用容器化来创建新的应用程序，并为云计算对现有的应用程序进行现代化。在IBM最近的一项调查中，61%的容器使用者报告说，在过去两年中，他们建立的新应用中有50%或更多使用了容器；64%的使用者预计在未来两年中，他们现有的应用中有50%或更多被放入容器。


容器通常被称为 "轻量级"，所有容器共享机器的操作系统内核，不需要付出在每个应用程序中关联操作系统的开销。容器的容量比虚拟机更小，所需的启动时间也更短，在相同的计算容量上运行时，相比运行单个虚拟机，可以运行更多的容器。这推动了更高的服务器效率，反过来也降低了服务器和许可成本。

最重要的是，容器化使应用程序可以 "一次编写，随处运行"。这种可移植性加快了开发速度，防止云供应商锁定，并提供其他明显的好处，如故障隔离，易于管理，简化安全等(见下文)。

容器化为开发者和开发团队提供了很大的便利，在开发和生产部署过程中都有不可替代的优势，具体总结为以下内容:

- 可移植性。容器创建了一个可执行的软件包，它脱离了主机操作系统(不绑定或依赖)，因此是可移植的，能够在任何平台或云中统一和一致地运行。
- 故障隔离。每个容器化的应用程序都是隔离的，并且独立于其他应用程序运行。一个容器的故障不会影响任何其他容器的继续运行。开发团队可以在一个容器内识别和纠正任何技术问题，而不需要在其他容器内进行任何停机。另外，容器引擎可以利用任何操作系统的安全隔离技术--如SELinux访问控制--来隔离容器内的故障。
- 易于管理。容器编排平台可以自动安装、扩展和管理容器化工作负载和服务。容器协调平台可以减轻管理任务，如扩展容器化应用程序，推出应用程序的新版本，并提供监控、日志和调试等功能。Kubernetes[<sup>[31]</sup>](#reference)，也许是目前最流行的容器编排系统，是一项开源技术(最初由谷歌开源，基于他们的内部项目Borg)，最初将Linux容器功能自动化。Kubernetes与许多容器引擎一起工作，如Docker，但它也与任何符合开放容器倡议(OCI)标准的容器镜像格式和运行时间的容器系统一起工作。
- 安全性。作为容器的应用程序的隔离本身就可以防止恶意代码的入侵影响其他容器或主机系统。此外，可以定义安全权限，以自动阻止不需要的组件进入容器或限制与不必要的资源的通信。

#### 4.5.3 云服务和容器化技术协同部署

基于以上优点以及行业趋势，本文中服务器采用腾讯云提供的通用性轻量应用服务器。规格是CPU 1核心，内存2GB，系统盘60G SSD，带宽6Mbps。具有价格低，网络带宽大，性能合格，系统和网络稳定可靠的优点。

并且本文在云服务的基础上将服务器程序容器化，本文使用的容器引擎是Docker容器。

使用Docker容器将服务器程序程序整体封装成一个单一的可执行软件包，将应用程序代码与所有相关的配置文件、库和运行所需的依赖性捆绑在一起。这确保了服务运行的环境稳定性并进一步确保了整体服务的稳定运行。

## 第5章 软件系统设计

> 软件系统代码 - [https://github.com/louisyoungx/pulse-connect-analyse](https://github.com/louisyoungx/pulse-connect-analyse)

### 5.1 软件系统设计概述

本章详述了智能手机APP的软件设计，首先介绍了Web开发技术，并介绍了锁采用的关键技术。然后介绍了软件总体架构设计，以及APP的各部分界面设计进行了详细介绍，最后介绍了软件系统中最核心的部分，即对脉搏数据流的处理与特征算法介绍。

### 5.2 技术选型与原因

Web开发技术是现在最流行的跨平台开发技术，本文项目采用现代Web开发技术来达到跨平台的目的。因此本节将简要Web开发技术和现代Web开发技术，并基于此例举了本文的技术选型。

#### 5.2.1 Web开发技术简介

Web技术是一项面向网站，应用程序与客户端的开发技术。相比于原生开发技术如iOS和Android开发技术，Web技术可以运行在所有平台上，包括常见的Windows、MacOS、Linux、iOS和Android，因此Web技术被广泛用于开发跨平台应用。

Web开发基于三个关键技术，HTML、CSS、JavaScript。HTML是超文本标记语言的缩写，是网络开发所需的基本技术之一，为应用提供基础结构。CSS为层叠样式表的缩写，定义了基于HTML结构的各个元素外观，包括应用页面布局、颜色、字体和元素定位。JavaScript是Web开发的标准编程语言，可以让静态的应用变成可以交互的动态应用。

#### 5.2.2 现代Web开发技术

原生JavaScript有很大的局限性，现代基于WebPack和NPM的JavaScript的生态比编程语言本身更重要，各种JavaScript的框架和库通过提供工具，平台和语法大大简化了开发工作的繁琐性。因此在现代Web开发中常常使用三个最受欢迎的JavaScript框架进行开发，分别是Vue、React、Angular[<sup>[32]</sup>](#reference)。本文项目中使用Vue进行开发。

Vue是一个开源的渐进式框架，主要用于构建网页界面和单页应用程序，渐进式框架这一概念来自于Vue被设计成可逐步渐进学习或使用。Vue可以非常便捷地开发复杂的单页应用程序，在编写应用程序时，Vue提供的数据绑定和数据驱动的开发方式相比于传统开发方式直接处理DOM(Document Object Model)来说更直观更高效。

Vue的优点有:

1. 轻量级。Vue包大小仅18KB。
2. 上手简单。学习Angular或React库需要非常了解JSX或TypeScript。Vue只需要了解是HTML、CSS和JavaScript方面的基本知识。
3. 有完整的工具链。Vue有一套强大的端到端开发测试的工具，包括插件管理系统Vite、浏览器调试工具devtools、服务端渲染Nuxt、状态管理工具VueX、路由管理Vue-Router。

#### 5.2.3 技术选型

综上所述，本文项目出于跨平台的原因选用Web技术对应用程序进行开发，最终APP不仅可以运行在Web浏览器，还能运行在iOS、Android等移动平台。并且考虑到技术的先进性，采用了现在最前沿的Web开发技术。

本项目采用现代Web开发技术进行开发。包管理器是最主流的NPM，打包器是目前最流行的WebPack。主体JavaScript框架是Vue；状态管理工具选用VueX；路由管理选用Vue-Router；考虑到脉搏信号需要实时绘制，采用功能完善的重量级图表库ECharts作为插件；考虑到UI的现代性，采用Vant作为主题UI框架。

### 5.3 软件架构设计

```shell
.
├── package.json
├── node_modules
├── public
├── src
│   ├── App.vue
│   ├── components
│   ├── main.js
│   ├── router.js
│   ├── store.js
│   └── views
│       ├── home.vue
│       ├── chart.vue
│       ├── settings.vue
│       └── user.vue
└── README.md
```

由于采用WebPack打包工具，所有本项目架构分布为标准WebPack文件组织方式。

public目录存放不会被WebPack打包的静态文件，如图片，静态页面模版，manifest.json网站描述，robots.txt爬虫规则限制。

README.md文件中是本项目的详细描述以及如何部署代码，及对应的使用方法。

package.json中存放了描述，NPM管理包的描述与运行打包所需运行的命令。在scripts项中的start是启动开发服务器的选项，build是构建开发服务器的选项；dependencies中是包依赖，其中安装了本文技术选型中所罗列的依赖包，包括vant、echarts、vue、vue-router、vuex。devDependencies是开发包依赖，其中安装了开发时所需的辅助依赖包。所有第三方依赖包都是用NPM安装在node_modules目录中。

```json
{
  "name": "pulse-connect-analyse",
  "version": "1.2.0",
  "scripts": {
    "start": "vue-cli-service serve",
    "build": "vue-cli-service build --report"
  },
  "dependencies": {
    "echarts": "^5.0.0",
    "vant": "^3.4.8",
    "vue": "^3.2.33",
    "vue-router": "^4.0.14",
    "vuex": "^4.0.2",
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "~4.5.0",
    "@vue/cli-plugin-pwa": "~4.5.0",
    "@vue/cli-plugin-router": "~4.5.0",
    "@vue/cli-plugin-vuex": "~4.5.0",
    "@vue/cli-service": "~4.5.0",
    "@vue/compiler-sfc": "^3.0.0",
    "compression-webpack-plugin": "^1.1.12",
    "sass": "^1.27.0",
    "sass-loader": "^10.0.4"
  }
}
```

src目录是WebPack的打包入口，内部存放的都是开发文件，需要经过WebPack打包。

store.js是状态管理定义文件，其中定义了所有全局持久化状态。

router.js是路由定义文件，其中存放了路由定义文件，在次文件中定义了各页面所处路径。

```javascript
import { createRouter, createWebHashHistory } from 'vue-router'
import home from '@/views/home/index'

const routes = [
  {
    path: '/',
    name: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: home
  },
  {
    path: '/chart',
    name: 'chart',
    component: import ('@/views/chart/index')
  },
  {
    path: '/user',
    name: 'user',
    component: import ("@/views/user/index")
  },
  {
    path: '/settings',
    name: 'settings',
    component: import ("@/views/settings/index")
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
```

App.vue是Vue主视图的打包入口，在其中引入了路由视图作为主视图。views目录中存放Vue开发的所有子视图；home.vue定义了主页界面；chart.vue定义了实时图表界面；settings.vue定义了设置界面；user.vue定义了用户界面。components目录是视图开发中所用到的通用组件所存放的位置。

main.js是全局包引入文件，是WebPack在src目录的打包入口，从次文件中通过ESM(ECMA Script Module)引入了以上提到的路由、状态管理、UI组件库，并在最后使用Vue包的createApp函数创建一个Vue实例，并挂载上引入的Module。

```javascript
import { createApp } from 'vue'
import App from './App.vue';
import router from './router'
import store from './store'
import vant from 'vant'
import 'vant/lib/index.css';

const PCA = createApp(App);
PCA.use(store).use(router).use(vant).mount('#app')
```

### 5.4 软件主要界面

软件部分的主要界面分别是负责历史数据管理和复现的主页界面，负责实时记录显示的图表界面，负责管理全局配置的设置界面。本节将逐一描述各界面运行流程与原理。

#### 5.4.1 主页界面

> 主页代码 - [https://github.com/louisyoungx/pulse-connect-analyse/blob/master/src/views/home/index.vue](https://github.com/louisyoungx/pulse-connect-analyse/blob/master/src/views/home/index.vue)

主页的主要功能有浏览存储的历史数据列表，对历史数据的操作选项，对历史数据的回放选项。因此基于以上功能进行页面设计，主页页面上分为上下两部分，上半部分为图表，下半部分根据功能变化。在浏览存储的历史数据列表时显示历史数据，对历史数据的回放切换到特征数据显示和回放暂停等按钮的显示。这个页面显示的切换依赖于一个isPlayback页面状态变量。

![图5.1 存储的历史数据列表](/img/in-post/2022-05-13/5.1.jpg)
> 图5.1 存储的历史数据列表

存储的历史数据列表中的数据来自于负责实时记录显示的图表界面如图5.1所示，这依赖于VueX状态管理实现。在store.js状态管理中定义了一个recording列表负责存储历史数据，每条历史数据都是一个JavaScript对象，拥有name、record、startTime、endTime四个键。name是每条数据的唯一标识符，负责区分数据；record为脉搏数据的记录列表；startTime与endTime为开始时间和结束时间，主要用于时长显示和回放时的时间轴刻度显示。

![图5.2 历史数据的操作选项](/img/in-post/2022-05-13/5.2.jpg)
> 图5.2 历史数据的操作选项

历史数据的操作选项包括回放和删除如图5.2所示。这涉及recording历史数据列表的索引查询，因此在每次调用回放函数startPlayback()和删除函数recordingDelete()时都需传入该条数据所处的索引。回放操作即把记录对象的record列表中的脉搏数据放入display执行栈中，并把页面状态isPlayback切换到true。删除操作即移除recording列表中索引处的记录。

![图5.3 历史数据的回放](/img/in-post/2022-05-13/5.3.jpg)
> 图5.3 历史数据的回放

历史数据的回放与复现如图5.3所示)。回放功能有关闭、暂停、重播的选项，这些功能都基于对数据流处理实现，具体将在5.5节中详细介绍。

图中心跳定义是数据窗口内的心跳次数，数据宽度120，频率10HZ，说明数据列表中的时间长度是12秒，在12秒内发生了20次心跳，等价于在60秒内会发生100次心跳。

#### 5.4.2 图表界面

> 图表界面代码 - [https://github.com/louisyoungx/pulse-connect-analyse/blob/master/src/views/chart/index.vue](https://github.com/louisyoungx/pulse-connect-analyse/blob/master/src/views/chart/index.vue)

图表界面负责从服务器接收实时脉搏数据，并将数据绘制成实时脉搏波形，调用5.5节中讲述的脉搏数据处理模块对特征值进行计算，并将特征值绘制到脉搏波形图上。图表界面由上下两部分组成，上半部分是负责显示波形和特征点的图表，下半部分是显示特征数据的界面，根据对脉搏波形数据的处理和计算，能从中获取出脉搏波的频率、幅值、心跳次数、心率等特征并进行实时显示，同时也显示服务器和特征选项的一些信息。

![图5.4 图表界面](/img/in-post/2022-05-13/5.4.jpg)
> 图5.4 图表界面

由于移动端APP的图形性能限制，本文对图表界面做了性能优化，即图表的处理采取了图表数据处理和图表显示更新分离的方式。图表的数据处理即每次从WebSocket获取到脉搏数据，加入到脉搏数据列表中并计算脉搏特征的操作。而本文根据对移动端APP的图形性能的研究发现，移动端APP的图形性能并不足以支撑每次更新数据都同步进行一次图表更新，这是因为图表的更新相当于是对图表的重新绘制，需要消耗大量的图形计算算力，因此在短时间内对图表进行多次更新会造成APP的延迟与卡顿，在数据频率大的情况下甚至会造成APP失去响应，即宕机。

另外本文还发现，不同移动端APP的浮点数计算能力有很大差异，因此脉搏列表的数据量，即每次参与计算所需的脉搏节点数量，也对APP性能有很大影响。

针对以上情况，需要在APP中对图表更新频率作出限制，对此新增了三个参数来控制图表的刷新速率与脉搏列表的数据量，分别是width(数据宽度)、number(图表单次更新节点个数)、flash(图表更新时间)。通过width可以限制脉搏列表的数据量与图表宽度；number需要与发送端同步，为每次更新的脉搏节点个数；flash为图表刷新时间，以毫秒为单位。

#### 5.4.3 设置界面

> 设置界面代码 - [https://github.com/louisyoungx/pulse-connect-analyse/blob/master/src/views/settings/Settings.vue](https://github.com/louisyoungx/pulse-connect-analyse/blob/master/src/views/settings/Settings.vue)

在设置界面可以对数据显示宽度，单次更新个数，更新间隔时间，是否显示特征值，是否启动动画，服务器域名/IP，服务器端口等进行配置。

![图5.5 设置界面](/img/in-post/2022-05-13/5.5.jpg)
> 图5.5 设置界面

由于Vue组件存在作用域，组件作用域内的变量仅限组件内以及自组件可访问，并且变量的生命周期会在组件销毁后结束，无法持久化保存，因此设置界面功能实现依赖于VueX状态管理并进行持久化支持。VueX规定组件无法直接修改state，因此需要通过mutations对操作进行定义，本文实现的保存方式是在用户点击保存按钮后，将组件内变量通过VueX的mutations操作saveSettings()函数保存到VueX到state内。

### 5.5 脉搏数据处理与显示

脉搏数据的处理与显示流程需要经历对数据的初始化，对图表的实例化，与服务器建立WebSocket连接并开始接受数据流，对数据流进行预处理，并进行数据特征计算。

#### 5.5.1 数据初始化

数据初始化用到了Vue提供的created生命周期钩子，这代表所有初始化操作都是在组件实例初始化完毕且虚拟DOM被渲染成真实DOM之前进行操作。这是由ECharts图表特性决定的，一旦真实DOM渲染完毕意味着图表宽度和特征值这类数据已经固定了，因此图表宽度和特征值这类数据需要在此之前就获取完毕，所以所有数据初始化操作都需要在图表初始化之前完成，即在created生命周期钩子内完成。

在created生命周期内主要做两件事，一是从VueX的state中获取设置数据，二是针对各个设置数据进行预处理。因此created生命周期主要完成如下步骤:

1. 从state状态管理中将数据显示宽度，单次更新个数，更新间隔时间，是否显示特征值，是否启动动画，服务器域名/IP，服务器端口等数据读入内存之中待用。
2. 将数据显示宽度，单次更新个数，更新间隔时间的类型从字符串转为数字。
3. 将域名和端口拼接为可用网络地址。
4. 根据特征值是否开启选项对图表选项进行初始化设置。

#### 5.5.2 图表实例化

图表实例化用到了Vue提供的mounted生命周期钩子，这代表此时的虚拟DOM已经被渲染成真实DOM，也因此ECharts图表才可以根据真实DOM进行挂载，即初始化ECharts图表实例。因此mounted生命周期主要完成如下步骤:

1. 按需引入echarts主模块、折线图、提示框和标题组件。
2. 并基于准备好的dom，初始化echarts实例。
3. 根据之前读入的数据显示宽度，进行数据填充，向脉搏列表中推入幅值为0的初始化数据。
4. 图表实例化完成后，调用主函数进入WebSocket连接与数据流预处理的流程。

#### 5.5.3 建立WebSocket连接与数据流预处理

WebSocket连接与数据流预处理是在主函数流程中，即完成数据初始化和图表实例化之后。首先程序将会使用之前准备好的服务器地址，并实例化一个WebSocket连接对象，并对此连接进行监听，一旦接收到event，即对此event中的脉搏数据进行预处理，即形成一个数据流的预处理。预处理包括如下步骤:

1. 判断是否是首次连接，如果是拿到第一个数据，将该数据填充到图表中。
2. 判断当前是否处于录制状态，若处于录制状态，将脉搏数据添加进录制记录列表中。
3. 对当前秒数进行叠加，根据总时间计算当前数据发送频率。
4. 将数据推入脉搏数据列表中，并向时间轴推入当前时间。
5. 调用脉搏特征计算的流程。

#### 5.5.4 脉搏特征计算

本节将简要介绍脉搏特征计算带有的数据预处理算法FIR滤波器和峰值检测方法。

针对离散时间的数字信号N阶滤波器，输出序列的每一个值都是最近输入的加权和:
$$
y[n] = b_{0}x[n] + b_{1}x[n-1] + \cdot\cdot\cdot + b_{N}x[n-N] \\
= \sum\limits_{i=0}^N b_{i} \cdot x[n-i]
$$

其中

- $x[n]$是输入信号
- $y[n]$是输出信号
- $N$是滤波器阶数。$N^{th}$阶滤波器表示在右边有$N+1$项
- $b_i$是$N^{th}$阶FIR滤波器在第$i$时间($0≤i≤N$)的脉冲响应。若滤波器是直接型的FIR滤波器，则$b_i$也就是滤波器的系数。

计算也称为离散卷积。

上述项中的$x[n−i]$常称为tap(抽头)，依数字延迟线的结构而定，在许多实现或方块图中，会将延迟输入进行乘法运算。

滤波器的冲激响应定义为有限区间内的非零值。包括零值在内，冲激响应是无限数列:
$$
h[n] = \sum\limits_{i=0}^N b_{i} \cdot \delta[n - 1] = \left\{
\begin{array}{rl}
b_n & 0≤n≤N\\
0 & \text{其他情况}
\end{array} \right.
$$
若FIR滤波器是非因果的，其冲激响应上的非零值范围可能从$n=0$前就开始。

FIR滤波器有以下的优点:

- 不需要反馈，因此舍去误差不会因为连续的加总而累计。每一次的计算其相对误差都是一样的，因此在实现上比较简单。
- 稳定，因为其输出是有限个输入值乘以有限倍数的和，因此不会大于$\sum |b_i|$乘以输入的最大值。

FIR滤波器的主要缺点是在CPU上的运算量大。

峰值检测使用一个自适应阈值以适应脉搏波形的形态和振幅变化，然后进行离群点检测和剔除。为了识别心跳，在每个数据点的两边用一个心跳周期长度的窗口来计算窗口中振幅的平均值。并在信号振幅大于移动平均值的区间内进行峰值寻找，此处有两种获得峰值位置的方法。在第一种方法中，峰值位置被简单地认为是寻找区间中的最高点，这个办法的计算步骤很少，因此计算很快，但其准确性取决于信号的采样率，采样率越高，结果越准确。第二种方法是对区间内的信号使用曲线光滑处理来采样和插值，然后对处理后的信号求出最大值，这比方法一计算量更大，但这种方法即使在低采样率的情况下也很准确。出于移动端计算性能的考虑，在本文中采取方法一。

## 第6章 结论与展望

本文开篇简要阐述了智能生命体征监测设备发展的必要性，介绍了国内外生命体征监测技术的研究现状。接下来脉搏波测量原理。介绍了脉搏波产生的机理与波形特征，阐述了其各自的成因、重要性和测量方法，基于弯曲光纤传感器的脉搏测量方法。然后简要讲述了光纤脉搏传感系统的设计。详细介绍了项目中服务器架构，服务与部署，各服务的原理与设计原因，并简略介绍云服务技术与容器化技术的设计和优势。最后重点介绍了APP的软件系统设计，详述了智能手机APP的软件设计，介绍了Web开发技术以及采用的关键技术，并对APP的各部分界面设计以及脉搏数据流的处理与特征算法进行了详细描述。

在APP的主页历史数据的选项中预留了插件拓展位，通过此处可以很便捷地为APP添加新的脉搏数据分析方法。在服务器中通过Turbon框架的支持，可以很方便地添加新的扩展API，并且Python语言天然可以引入很多科学计算的包，可以对客户端上传的数据进行分析。

本项目的未来工作有以下几个方向:

1. 在JavaScript上实现SVM向量机预测脉搏波流速PWV和动态血压值ABP。
2. 在服务器端使用Python深度学习进行脉搏疾病分类，使用MIMIC疾病数据库作为训练数据集。
3. 在JavaScript实现心跳间隔测量，并根据呼吸时的心率变化来预测呼吸频率。

<div id="reference"></div>

## 参考文献

 - [1] W. H. Organization et al., World Health Statistic 2020. Organization, 2020.
 - [2] World Health Organization The Top 10 Causes of Death. 2019.
 - [3] 胡生寿.中国心血管健康与疾病报告2019概要[J].中国循环杂志,2020,35(9):833-854.
 - [4] 黄丽卿。基于光电容积脉搏波的心率变异度检测方法研究[D]。北京，北京工业大学，2013。
 - [5] 肖登，万生鹏，尹玺，刘恒，熊新中，张思军。“基于弯曲光纤传感头的脉搏采集系统，”激光与光电子学进展，2021，58(05):119-125。
 - [6] World Health Organization . mHealth: New Horizons for Health through Mobile Technologies. World Health Organization; Geneva, Switzerland: 2011.
 - [7] 中国心血管健康与疾病报告编写组。中国心血管健康与疾病报 2019 概要[J]。心脑血管病防治，2020,20(5):437-450.
 - [8] M. F. ORourke and J. Hashimoto, “Mechanical factors in arterial aging: A clinical perspective,” J. Am. Coll. Cardiol., vol. 50, no. 1, pp. 1 – 13, 2007.
 - [9] Primary Expert Committee on Hypertension Management, “The 2017 Chinese guidelines for the management of hyperten- sion,” Chinese Circulation Journal, vol. 32, pp. 1041–1048, 2017.
 - [10] 罗志昌, 张松, 杨益民. 脉搏波工程分析与临床应用[M].北京:科学出版社,2006(05):18-20.
 - [11] Shin, H.; Min, S.D. Feasibility study for the non-invasive blood pressure estimation based on ppg morphology: Normotensive subject study. Biomed. Eng. Online 2017, 16, 1–14.
 - [12] Sun. G, Takemi.M, Yasuyuki.W, et al. Vital-SCOPE: Design and Evaluation of a Smart Vital Sign Monitor for Simultaneous Measurement of Pulse Rate, Respiratory Rate, and Body Temperature for Patient Monitoring[J]. Journal of Sensors,2018, 2018:1-7.
 - [13] 罗志昌, 张松, 杨文鸣, 杨子彬. 脉搏波波形特征信息的研究[J].北京工业大学学 报,1996(01):71-79.
 - [14] Elgendi, M.; Liang, Y.; Ward, R. Toward Generating More Diagnostic Features from Photoplethysmogram Waveforms. Diseases 2018, 6, 20. 
 - [15] Kunze.C, Grossmann.U, Stork.W, et al. Application of ubiquitous computing in personal health monitoring system[J]. Biomedizinische Technik. Biomedical engineering,2002,47 supply 1Pt 1:360-362.
 - [16] Willem Einthoven. Die galvanometrisehe Registrirung des mensehlichen Elektrokardiogramms, zu- gleich eine Beurtheilung tier Anwendung des Capillar-Elektrometers in tier Physiologiel. PhysiologischesLaboratorium in Leyden, 1903.
 - [17] Cooper, J. K. Electrocardiography 100 years ago. Origins, pioneers, and contributors. The New England Journal of Medicine. 1986.
 - [18] Hilbel, Thomas; Thomas M Helms; Gerd Mikus; Hugo A Katus; Christian Zugck. Telemetry in the clinical setting. Herzschrittmachertherapie & Elektrophysiologie. 2008. 
 - [19] F. S. Cattivelli and H. Garudadri, “Noninvasive cuffless estimation of blood pressure from pulse arrival time and heart rate with adaptive calibration,” in Wearable and Implantable Body Sensor Networks, 2009. BSN 2009. Sixth International Workshop on. IEEE, 2009, pp. 114–119.
 - [20] 曹奕涛, 淳莉, 邹富强. 基于无线传感器网络的脉搏波形采集和辅助诊断系统[J].物联网 技术,2016,6(05):85-88+9366
 - [21] 凌建东. 基于脉搏波的人体健康监护系统研究[D].哈尔滨理工大学,2018.
 - [22] 邓猛. 基于智能手机的脉搏信号检测与监护系统[D].东南大学,2018.
 - [23] 赵毅飞. 基于 Android 可穿戴生理参数检测系统的设计与实现[D].长春理工大学,2021.
 - [24] Leitão.C, Antunes.P, André.P, et al. Central arterial pulse waveform acquisition with a portable penlike opticalfiber sensor[J]. Blood Pressure Monitoring,2015,20(1):43-46.
 - [25] 张宇彤. 基于脉搏检测的人体健康状况分析与诊断系统[D].2019,兰州交通大学.
 - [26] 王雪, 王锡芝, 辛圣杰. 光纤传感技术的制造与应用[J].集成电路应用,2022,39(01):248-249.
 - [27] Shaohua Wang, Iman Keivanloo, Ying Zou. How Do Developers React to RESTful API Evolution. Service-Oriented Computing. 2014.
 - [28] Marina del Rey. Transmission Control protocol. Information Sciences Institute, University of Southern California, September 1981.
 - [29] Google, Inc. The WebSocket Protocol. Internet Engineering Task Force, December 2011.
 - [30] Charles Anderson. Docker [Software engineering]. IEEE Software, 2015.
 - [31] Jay Shah, Dushyant Dubaria. Building Modern Clouds: Using Docker, Kubernetes & Google Cloud Platform. IEEE (CCWC), March 2019.
 - [32] 李洁.主流 JavaScript 框架-Angular、React 和 Vue 使用体会[J].电脑迷，2019,01(01):85.

## 致谢

在光电专业学习是一个不断试错、不断前进的过程。实际上，我刚经历大一入学学习是很不顺利的，面临着学习方法，学习环境，目标改变带来的困惑和压力，也有跟不上理科课程而对自己信心的打击。

但当想要放弃的时候，这又如何不是对自己的考验呢，完善与提升自己不就是不断战胜自己的过程么。我逐渐尝试参加进学院的创新创业和科研活动。

万生鹏老师指引我进实验室，完成基于光纤传感的脉搏测量项目的跨平台应用“脉搏悦动”与对不同协议适配转换的服务器端架构设计。朱泉水老师引导我构思和完成物联网三小项目“基于树莓派的云端智能锁”。陈果老师帮助我参与到学院工作的建设，完成了学院挂科学生课业帮扶系统的前后端搭建，完成了学院青年大学习未做通知和新冠疫情未打卡名单这些自动化项目，而且很荣幸拿到了学院“技术顾问”的称号。

对于我来说，本科学习期间期间提升最大的就是发现问题并解决问题的能力，这个过程虽然很艰难，但是所有的付出终究会有所收获。

最后，我也很感谢学校中很多优秀的老师和同学们给予我的帮助和支持。