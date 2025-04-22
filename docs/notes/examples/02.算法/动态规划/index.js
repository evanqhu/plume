const uniquePaths = (m, n) => {
  // 1. 初始化 dp 数组
  const dp = Array.from({ length: m }, () => Array(n).fill(0));

  // 2. 初始化边界条件
  for (let i = 0; i < m; i++) {
    dp[i][0] = 1;
  }
  for (let j = 0; j < n; j++) {
    dp[0][j] = 1;
  }

  // 3. 状态转移
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }

  // 4. 返回结果
  return dp[m - 1][n - 1];
};


const uniquePaths2 = (m, n) => {
  const dp = []

  for (let i = 0; i < m; i++) {
    dp.push([])
    for (let j = 0; j < n; j++) {
      if (i === 0 || j === 0) {
        dp[i][j] = 1
      } else {
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
      }
    }
  }

  return dp[m - 1][n - 1]
};