---
title: 动态规划
createTime: 2025/04/22 14:48:57
permalink: /examples/52opwjv2/
---

思路：找到**状态转移方程**

## 例题

<https://leetcode.cn/problems/2AoeFn/>

一个机器人位于一个 `m x n` 网格的左上角 （起始点在下图中标记为 “Start” ）。

机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。

问总共有多少条不同的路径？

### 解题思路

1. 确定状态转移方程

   - 状态：`dp[i][j]` 表示机器人到达 `(i, j)` 位置的路径数（重点在于找到不同的 `i` 和 `j` 之间的关系）
   - 状态转移方程：`dp[i][j] = dp[i-1][j] + dp[i][j-1]`

2. 确定特殊状态

   - `i===0` 或 `j===0` 时，`dp[i][j] = 1`

3. 确定边界条件

   - `i < 0` 或 `j < 0` 时，`dp[i][j] = 0`

@[code js :collapsed-lines](./index.js)
