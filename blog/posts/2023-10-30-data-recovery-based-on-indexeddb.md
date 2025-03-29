---
layout: Post
title: Data recovery based on IndexedDB
subtitle: protect user data at low cost
author: louisyoungx
date: 2023-10-30
useHeaderImage: true
headerImage: /img/in-post/2023-10-30/header.jpg
headerMask: rgb(14, 21, 5, .2)
permalinkPattern: /post/:year/:month/:day/:slug/
tags:
  - technology
  - chinese
  - indexeddb
  - javascript
---

IndexedDB 历史数据恢复工具

<!-- more -->

# IndexedDB 历史数据恢复工具

## 概述

> 一句话介绍：将用户编辑历史记录存储在浏览器 `indexeddb` 数据库中

在 2B 业务中客户的数据安全尤为重要，底线是用户数据不能有任何丢失，这需要多重措施来保证。

业务上缺少数据恢复机制，用户数据丢失，误删除或升级场景，产生脏数据都可能会导致业务场景无法正常运转，需要从头重新配置，复杂业务配置下会浪费大量人力。

**Why: 为什么要做？**

用户数据丢失是红线，需要有机制确保用户数据永不丢失，并能低成本进行恢复。

**Goals: 目标是什么？**

1. 存储层的撤销和重做操作：页面编辑历史记录使用户能够撤销之前的操作并回到先前的状态。如果用户犯了一个错误或者想要恢复到之前的一个时间点，他们可以通过撤销和重做操作来实现这一点，而不需要手动逐步撤销并重新执行操作。
2. 审查和审计：页面编辑历史记录提供了一种审查和审计更改的方式。可以记录每个用户的编辑行为，包括修改的内容、时间戳和相关信息。这对于追踪和监控用户行为、回溯更改并解决潜在的问题非常有用。
3. 错误修复和恢复：如果用户在编辑过程中发生了错误，页面编辑历史记录可以帮助恢复到之前的正确状态。用户可以查看历史记录，找到并恢复到他们认为是正确的状态，从而避免长时间的重做操作或重新开始编辑过程。
4. 问题定位：提供下载历史数据并发送给开发者，能在不同环境对页面数据进行还原，帮助定位页面错误数据问题。

| **功能点**   | **描述**                                 |
| ------------ | ---------------------------------------- |
| 修改历史     | 记录用户每一步操作的历史，可应用历史版本 |
| 辅助信息     | 特征值，修改时间，客户端ID               |
| 容量占用检测 | 防溢出，按照一定策略自动清理过期历史数据 |
| 预览         | 预览指定历史版本                         |
| 下载         | 打包下载浏览器数据库中所有历史版本       |


## 名词术语

| **术语**  | **描述**                                   |
| --------- | ------------------------------------------ |
| IndexedDB | 浏览器本地数据库，用于存储大量的结构化数据 |

## 前期调研

- [MDN - IndexedDB API](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)

## 过期清理规则

综合最多124条历史记录

- 分钟级别（最多60条）
- 小时钟级别（最多12条）
- 天级别（最多30条）
- 月级别（最多12条）

| 分钟级别 | 一分钟前 |
| -------- | -------- |
|          | 二分钟前 |
|          | 三分钟前 |
|          | ...      |
| 小时级别 | 一小时前 |
|          | 二小时前 |
|          | 三小时前 |
|          | ...      |
| 天级别   | 一天前   |
|          | 二天前   |
|          | 三天前   |
| 月级别   | ...      |
|          | 一月     |
|          | 二月     |
|          | 三月     |

## 表结构

### info

| **字段**        | **类型** | **描述**          |
| --------------- | -------- | ----------------- |
| id              | string   | 主键，页面 API ID |
| createTime      | number   | 创建时间          |
| updateTime      | number   | 更新时间          |
| lastestRecordId | string   | 最新记录 ID       |
| count           | number   | 记录总数          |

### record

| **字段**      | **类型**                                                     | **描述**                       |
| ------------- | ------------------------------------------------------------ | ------------------------------ |
| id            | string                                                       | 主键，历史记录的ID             |
| createTime    | number                                                       | 创建时间                       |
| host          | string                                                       | 所属页面的 API ID              |
| longTerm      | boolean                                                      | 持久化标识（是否可被自动清除） |
| clientId      | number                                                       | 客户端 ID                      |
| tag           | `enum TimeTag {  /** 一分钟内 */  Minute = 'minute',  /** 一小时内 */  Hour = 'hour',  /** 一天内 */  Day = 'day',  /** 一月内 */  Month = 'month',  /** 一年内 */  Year = 'year',  /** 最后一个 */  Latest = 'latest',  /** 即将清理 */  Deprecated = 'deprecated', }` | 标记                           |
| computingTime | number                                                       | 特征计算时间（毫秒）           |
| eigenvalue    | string                                                       | 特征值（HASH: SHA1）           |
| bytes         | number                                                       | 字节大小                       |

### schema

| **字段** | **类型** | **描述**           |
| -------- | -------- | ------------------ |
| id       | string   | 主键，历史记录的ID |
| schema   | unknown  | 页面数据快照       |

## 整体架构

MVVM

- Model: `TimeMachineModel`
- ViewModel: `TimeMachineVM`
- View: `TimeMachinePanel`

## **接口定义**

### ITimeMachineModel

#### **接口描述**

时间机器模型

#### **接口定义**

```ts
/** 时间机器模型 */
export interface ITimeMachineModel {
  /** 客户端实例 ID */
  private clientId: string;
  /** IndexedDB 实例 */
  private db: TimeMachineDB;
  /** 生成随机 SHA1 Hash值 */
  private async id(): Promise<string>
  /** 创建一条数据记录 */
  public async create(params: ITimeRecordParams): Promise<boolean>
  /** 更新一条数据记录 */
  public async update(params: Partial<ITimeRecordParams> & { id: string }): Promise<boolean>
  /** 删除一条数据记录 */
  public async delete(id: string): Promise<void>
  /** 获取一条数据记录 */
  public async get(id: string): Promise<ITimeData | undefined>
  /** 获取页面信息与最后一条记录 */
  public async hostInfo(host: string): Promise<HostInfo | undefined>
  /** 获取所有记录 */
  public async getAll(host: string): Promise<ITimeRecord[]>
  /** 存储配额百分比 */
  public async quotaPercent(): number
  /**
   * 存储配额溢出检测
   * 占比超过2%且小于3%：删除最早20条（跳过最后一条、收藏记录、非即将清除记录）
   * 占比超过3%且小于4%：删除最早50条（跳过最后一条、收藏记录、非即将清除记录）
   * 占比超过4%且小于5%：删除最早50条（跳过最后一条、收藏记录、非即将清除记录）
   * 占比超过5%且小于10%：删除最早50条（跳过最后一条与收藏记录），并清空所有即将清除的记录
   */
  private async quotaExceedCheck(): void
  /**
   * 清除最早 n 条记录
   * @param n 清除条数
   * @param skipLatest 是否跳过最后一条
   * @param skipLongTerm 是否跳过收藏记录
   */
  private async clearEarliestNRecords(params: {
    n: number;
    skipLatest?: boolean;
    skipLongTerm?: boolean;
    skipNotDeprecated?: boolean;
  }): Promise<void>
  /** 清理所有即将清除的记录 */
  public async cleanDeprecatedRecords(): Promise<void>
  /**
   * 整理记录，除去长期备份，最多126次备份，如超出则按以下规则过滤
   * 一小时内（60次）：每分钟备份
   * 一天内（24次）：每小时备份
   * 一月内（30次）：每天备份
   * 一年内（12次）：每月备份
   */
  public async tidy(params: ITimeRecord): Promise<void> 
  /** 更新记录信息 */
  private async info(params: ITimeRecord): Promise<void>
  /** 计算所有记录特征 */
  public async eigenvalueComputing(): Promise<{
    missionComputingTime: number;
    missionBytes: number;
  }>
  /**
   * 计算特征值
   * @param {string} id - 特征值计算的标识符
   * @returns - 包含特征值、字节大小和计算时间的 Promise 对象
   */
  private async recordEigenvalueComputing(id: string): Promise<TimeRecordComputationResult>
```

#### **接口实现**

```ts
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type DBSubscriber, type DBUnSubscriber } from '../db';
import { TimeTag } from './constant';
import { TimeMachineDB } from './db';
import { TimeMachineUtils } from './utils';

import type {
  ITimeRecordParams,
  ITimeRecord,
  ITimeData,
  HostInfo,
  TimeRecordComputationResult,
} from './type';

/** 时间机器模型 */
export class TimeMachineModel implements ITimeMachineModel {
  private clientId: string;
  private db: TimeMachineDB;
  constructor(protected identification: string) {
    this.clientId = TimeMachineUtils.uuid();
    this.db = new TimeMachineDB(this.identification);
  }

  /** 初始化回调函数注册 */
  public created(callback: DBSubscriber): DBUnSubscriber {
    return this.db.createdCallback(callback);
  }

  /** 生成随机 SHA1 Hash值 */
  private async id(): Promise<string> {
    const sha1 = await TimeMachineUtils.sha1(TimeMachineUtils.uuid());
    return sha1;
  }

  /** 创建一条数据记录 */
  public async create(params: ITimeRecordParams): Promise<boolean> {
    // @ts-ignore
    const { schema, ...recordParams } = params;
    const id = await this.id();
    const duplicated = await this.db.record.has(id);
    if (duplicated) {
      return false;
    }
    const record: ITimeRecord = {
      ...recordParams,
      id,
      name: params.host,
      createTime: TimeMachineUtils.time(),
      tag: TimeTag.Latest,
      clientId: this.clientId,
      longTerm: false,
    };
    await this.db.record.add(record);
    await this.db.schema.add({
      id,
      schema,
    });
    // 异步处理
    this.quotaExceedCheck();
    this.info(record);
    this.tidy(record);
    return true;
  }

  /** 更新一条数据记录 */
  public async update(params: Partial<ITimeRecordParams> & { id: string }): Promise<boolean> {
    // @ts-ignore
    const { id } = params;
    const exist = await this.db.record.has(id);
    if (!exist) {
      return false;
    }
    this.db.record.put(params);
    return true;
  }

  /** 删除一条数据记录 */
  public async delete(id: string): Promise<void> {
    await this.db.record.delete(id);
    await this.db.schema.delete(id);
  }

  /** 获取一条数据记录 */
  public async get(id: string): Promise<ITimeData | undefined> {
    const record = await this.db.record.get(id);
    if (!record) {
      return undefined;
    }
    const { schema } = await this.db.schema.get(id);
    return {
      ...record,
      schema,
    };
  }

  /** 获取页面信息与最后一条记录 */
  public async hostInfo(host: string): Promise<HostInfo | undefined> {
    const info = await this.db.info.get(host);
    if (!info) {
      return undefined;
    }
    const latestRecord = await this.db.record.get(info.latestRecordId);
    const latestSchema = await this.db.schema.get(info.latestRecordId);
    return {
      ...info,
      latestRecord: {
        ...latestRecord,
        schema: latestSchema.schema,
      },
    };
  }

  /** 获取所有记录 */
  public async getAll(host: string): Promise<ITimeRecord[]> {
    const records = await this.db.record.search(host);
    return records;
  }

  /** 存储配额百分比 */
  public async quotaPercent() {
    const percent = await TimeMachineUtils.quotaPercent();
    return percent * 50;
  }

  /**
   * 存储配额溢出检测
   * 占比超过2%且小于3%：删除最早20条（跳过最后一条、收藏记录、非即将清除记录）
   * 占比超过3%且小于4%：删除最早50条（跳过最后一条、收藏记录、非即将清除记录）
   * 占比超过4%且小于5%：删除最早50条（跳过最后一条、收藏记录、非即将清除记录）
   * 占比超过5%且小于10%：删除最早50条（跳过最后一条与收藏记录），并清空所有即将清除的记录
   */
  private async quotaExceedCheck() {
    const estimatePercent = await TimeMachineUtils.quotaPercent();
    if (estimatePercent > 2 && estimatePercent <= 3) {
      // 占比超过2%且小于3%：删除最早20条（跳过最后一条、收藏记录、非即将清除记录）
      this.clearEarliestNRecords({
        n: 30,
        skipLatest: true,
        skipLongTerm: true,
        skipNotDeprecated: true,
      });
    } else if (estimatePercent > 3 && estimatePercent <= 4) {
      // 占比超过3%且小于4%：删除最早50条（跳过最后一条、收藏记录、非即将清除记录）
      this.clearEarliestNRecords({
        n: 50,
        skipLatest: true,
        skipLongTerm: true,
        skipNotDeprecated: true,
      });
    } else if (estimatePercent > 4 && estimatePercent <= 5) {
      // 占比超过4%且小于5%：删除最早50条（跳过最后一条、收藏记录、非即将清除记录）
      this.clearEarliestNRecords({
        n: 50,
        skipLatest: true,
        skipLongTerm: true,
        skipNotDeprecated: false,
      });
    } else if (estimatePercent > 5 && estimatePercent <= 10) {
      // 占比超过5%且小于10%：删除最早50条（跳过最后一条与收藏记录），并清空所有即将清除的记录
      await Promise.all([
        this.clearEarliestNRecords({
          n: 50,
          skipLatest: true,
          skipLongTerm: true,
          skipNotDeprecated: false,
        }),
        this.cleanDeprecatedRecords(),
      ]);
    } else if (estimatePercent > 10) {
      // 占比超过10%：删除最早100条，并清空所有即将清除的记录
      await Promise.all([
        this.clearEarliestNRecords({
          n: 100,
          skipLatest: false,
          skipLongTerm: false,
          skipNotDeprecated: false,
        }),
        this.cleanDeprecatedRecords(),
      ]);
    }
  }

  /**
   * 清除最早 n 条记录
   * @param n 清除条数
   * @param skipLatest 是否跳过最后一条
   * @param skipLongTerm 是否跳过收藏记录
   */
  private async clearEarliestNRecords(params: {
    n: number;
    skipLatest?: boolean;
    skipLongTerm?: boolean;
    skipNotDeprecated?: boolean;
  }): Promise<void> {
    const { n, skipLatest = false, skipLongTerm = false, skipNotDeprecated = false } = params;
    // 页面所有记录
    const dbRecords = await this.db.record.getAll();
    if (dbRecords.length <= n) {
      // 记录不足 n 条，不做处理
      return;
    }
    // 根据时间从远到近排序
    const records = dbRecords.sort((a, b) => a.createTime - b.createTime);
    // 删除最早的 n 条记录
    let shouldDeleteLength = n;
    for (let i = 0; i < shouldDeleteLength; i += 1) {
      const record = records[i];
      if (!record) {
        // 没有更多记录了
        break;
      } else if (skipLatest && record.tag === TimeTag.Latest) {
        // 最后一条不删
        shouldDeleteLength += 1;
      } else if (skipLongTerm && record.longTerm) {
        // 收藏记录不删
        shouldDeleteLength += 1;
      } else if (skipNotDeprecated && record.tag !== TimeTag.Deprecated) {
        // 非即将删除的记录不删
        shouldDeleteLength += 1;
      } else {
        this.delete(record.id);
      }
    }
  }

  /** 清理所有即将清除的记录 */
  public async cleanDeprecatedRecords(): Promise<void> {
    const dbRecords = await this.db.record.getAll();
    // 所有即将清除的记录
    const deprecatedRecords = dbRecords.filter((record) => record.tag === TimeTag.Deprecated);
    deprecatedRecords.forEach((record) => {
      this.delete(record.id);
    });
  }

  /**
   * 整理记录，除去长期备份，最多126次备份，如超出则按以下规则过滤
   * 一小时内（60次）：每分钟备份
   * 一天内（24次）：每小时备份
   * 一月内（30次）：每天备份
   * 一年内（12次）：每月备份
   */
  public async tidy(params: ITimeRecord): Promise<void> {
    // 页面所有记录
    const dbRecords = await this.db.record.search(params.host);
    // 根据时间从进到远排序
    const sortedRecords = dbRecords.sort((a, b) => b.createTime - a.createTime);
    // 设置最新记录标记
    this.db.record.put({
      ...sortedRecords[0],
      tag: TimeTag.Latest,
    });
    // 去除掉最新的一个
    const records = sortedRecords.slice(1);
    // 当前时间
    const currentTime = params.createTime;
    // 豁免清除个数
    let skipDeprecateCount = 0;

    // 定义时间常量
    const ONE_SECOND = 1000;
    const ONE_MINUTE = 60 * ONE_SECOND;
    const ONE_HOUR = 60 * ONE_MINUTE;
    const ONE_DAY = 24 * ONE_HOUR;
    const ONE_MONTH = 30 * ONE_DAY;
    const ONE_YEAR = 12 * ONE_MONTH;

    // 记录每个时间单位的最后一个记录的时间戳
    let lastSecondTime = Number.MAX_SAFE_INTEGER;
    let lastMinuteTime = Number.MAX_SAFE_INTEGER;
    let lastHourTime = Number.MAX_SAFE_INTEGER;
    let lastDayTime = Number.MAX_SAFE_INTEGER;
    let lastMonthTime = Number.MAX_SAFE_INTEGER;

    // 处理每个记录
    records.forEach((record) => {
      // 长期保存的记录不处理
      if (record.longTerm) {
        return;
      }
      let tag: TimeTag | undefined;
      if (
        currentTime - record.createTime >= Number.MIN_SAFE_INTEGER &&
        lastSecondTime - ONE_SECOND >= record.createTime &&
        currentTime - record.createTime <= ONE_MINUTE
      ) {
        tag = TimeTag.Minute;
        lastSecondTime = record.createTime;
      } else if (
        currentTime - record.createTime > ONE_MINUTE &&
        lastMinuteTime - ONE_MINUTE >= record.createTime &&
        currentTime - record.createTime <= ONE_HOUR
      ) {
        tag = TimeTag.Hour;
        lastMinuteTime = record.createTime;
      } else if (
        currentTime - record.createTime > ONE_HOUR &&
        lastHourTime - ONE_HOUR >= record.createTime &&
        currentTime - record.createTime <= ONE_DAY
      ) {
        tag = TimeTag.Day;
        lastHourTime = record.createTime;
      } else if (
        currentTime - record.createTime > ONE_DAY &&
        lastDayTime - ONE_DAY >= record.createTime &&
        currentTime - record.createTime <= ONE_MONTH
      ) {
        tag = TimeTag.Month;
        lastDayTime = record.createTime;
      } else if (
        currentTime - record.createTime > ONE_MONTH &&
        lastMonthTime - ONE_MONTH >= record.createTime &&
        currentTime - record.createTime <= ONE_YEAR
      ) {
        tag = TimeTag.Year;
        lastMonthTime = record.createTime;
      } else if (skipDeprecateCount < 126) {
        // 豁免清除
        skipDeprecateCount += 1;
        tag = TimeTag.Deprecated;
      } else {
        // 如果当前时间单位的记录数已经超出限制，则删除当前记录并跳过
        this.delete(record.id);
        return;
      }
      if (tag !== record.tag) {
        // tag需要更新
        this.db.record.put({
          ...record,
          tag,
        });
      }
    });
  }

  /** 更新记录信息 */
  private async info(params: ITimeRecord): Promise<void> {
    const hostExist = await this.db.info.has(params.host);
    if (!hostExist) {
      // 不存在新建一个
      const createTime = TimeMachineUtils.time();
      await this.db.info.add({
        id: params.host,
        latestRecordId: params.id,
        createTime,
        updateTime: createTime,
        count: 0,
      });
    }
    const info = await this.db.info.get(params.host);
    this.db.info.put({
      id: info.id,
      latestRecordId: params.id,
      count: info.count + 1,
      updateTime: TimeMachineUtils.time(),
    });
  }

  /** 计算所有记录特征 */
  public async eigenvalueComputing(): Promise<{
    missionComputingTime: number;
    missionBytes: number;
  }> {
    const dbRecords = await this.db.record.getAll();
    // 过滤出未计算特征的记录
    const noComputationRecords = dbRecords.filter(
      (record) => !record.eigenvalue || !record.bytes || !record.computingTime
    );
    // 计算结果
    const results: TimeRecordComputationResult[] = await Promise.all(
      noComputationRecords.map((record) => this.recordEigenvalueComputing(record.id))
    );
    // 写入库
    await Promise.all(results.map((result) => this.update(result)));
    // 本次计算耗时
    const missionComputingTime = results.reduce((time, result) => {
      return time + result.computingTime;
    }, 0);
    // 本次计算字节
    const missionBytes = results.reduce((bytes, result) => {
      return bytes + result.bytes;
    }, 0);
    return {
      missionComputingTime,
      missionBytes,
    };
  }

  /**
   * 计算特征值
   * @param {string} id - 特征值计算的标识符
   * @returns - 包含特征值、字节大小和计算时间的 Promise 对象
   */
  private async recordEigenvalueComputing(id: string): Promise<TimeRecordComputationResult> {
    const { schema } = await this.db.schema.get(id); // 不计算查询耗时

    const startTime = performance.now(); // 开始计算
    const content = JSON.stringify(schema);
    const eigenvalue = await TimeMachineUtils.sha1(content);
    const bytes = TimeMachineUtils.bytes(content);

    const endTime = performance.now(); // 结束计算
    const computingTime = endTime - startTime;
    return {
      id,
      eigenvalue,
      bytes,
      computingTime,
    };
  }
}
```

**最佳实践**

> 示例

### ITimeRecord

#### **接口描述**

历史记录类型描述

#### **接口定义**

```ts
import type { IDomainSpecificModel } from '../domain-specific-model';
import type { TimeTag } from './constant';
import type { ComponentUIDL } from '@nclc/uidl';

/** 需要存储的记录数据 */
export interface ITimeRecordSchema {
  /** PageConf */
  pageConfs: unknown[];
  /** UIDL */
  uidl: ComponentUIDL;
  /** 领域模型数据 */
  domainSpecificModel: IDomainSpecificModel;
  /** 页面ID */
  pageApiId: string;
  /** 子页面ID */
  subpageApiId: string;
}

/** 传入记录信息 */
export interface ITimeRecordParams {
  /** 所属主体 */
  host: string;
  /** Schema数据 */
  schema: ITimeRecordSchema;
  /** 名称 */
  name?: string;
  /** 描述 */
  description?: string;
  /** 图标 */
  icon?: string;
  /** 版本 */
  version?: string;
  /** 持久化 */
  longTerm?: boolean;
}

/** 异步计算数据（计算前不存在） */
export interface ITimeRecordComputation {
  /** 特征值 */
  eigenvalue: string;
  /** 字节大小 */
  bytes: number;
  /** 计算时间 */
  computingTime: number;
}

/** 自动生成记录细腻下 */
export interface ITimeRecordAutoGen {
  /** 唯一ID */
  id: string;
  /** 创建时间 */
  createTime: number;
  /** 客户端ID */
  clientId: string;
  /** 时间戳 */
  tag: TimeTag;
}

/** 不包含数据的记录 */
export type ITimeRecord = Omit<ITimeRecordParams, 'schema'> &
  ITimeRecordAutoGen &
  Partial<ITimeRecordComputation>;

/** 完整记录 */
export type ITimeData = ITimeRecordParams & ITimeRecordAutoGen;

/** 数据 */
export type ITimeSchema = {
  id: string;
  schema: ITimeRecordSchema;
};

/** 时间机器信息 */
export interface ITimeInfo {
  /** 页面ID */
  id: string;
  /** 最后一条记录ID */
  latestRecordId: string;
  /** 更新时间 */
  createTime: number;
  /** 更新时间 */
  updateTime: number;
  /** 累计 */
  count: number;
}

/** 页面信息 */
export type HostInfo = ITimeInfo & { latestRecord: ITimeRecord & { schema: ITimeRecordSchema } };

/** 单次计算结果 */
export type TimeRecordComputationResult = { id: string } & ITimeRecordComputation;
```

### ITimeMachineVM

#### **接口描述**

时间机器视图模型

#### **接口定义**

```ts
/** 数据 */
type TimeMachineVMStore = {
  records: ITimeRecord[];
  conflicts: ITimeRecord[];
  domainSpecificModel: IDomainSpecificModel;
  updateTime: number;
  saveCount: number;
  quotaPercent: number;
  totalBytes: number;
};

/** 时间机器视图模型 */
export interface ITimeMachineVM {
  /** 页面 ID */
  public readonly pageId: string;
  /** 模型 */
  public model: TimeMachineModel;
  /** 状态 */
  public store: TimeMachineVMStore
  /** 应用记录 */
  public async apply(record: ITimeRecord): Promise<void>
  /** 删除记录 */
  public async delete(record: ITimeRecord): Promise<void>
  /** 收藏 */
  public async longTermSwitch(record: ITimeRecord): Promise<void>
  /** 刷新 */
  public async refresh(): Promise<void>
  /** 计算特征 */
  private async computing(): Promise<void>
  /** 格式化时间戳 */
  private formatDateString(time: number): string
  /** 格式化字节 */
  private formatBytes(byteSize: number): string
  /** 冲突检测 */
  private conflictChecking(records: ITimeRecord[]): ITimeRecord[]
}
```

## 方案缺陷

1. 历史数据存于本地浏览器，如果用户清除浏览器缓存，历史记录也将被清除。
2. 无法看到其他用户编辑的版本。
3. 存储的历史版本有限制。
