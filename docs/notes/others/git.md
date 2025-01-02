---
title: Git
createTime: 2024/12/24 21:39:43
permalink: /others/xvxz48i9/
---

::: note
待处理
:::

## 快速入门指南

### 用户信息

```sh
# 查看 git 版本
git -v

# 每台设备初次使用时的设定
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com

# 查看设置
git config --list
```

### 仓库基础操作

```sh
# 初始化一个仓库
git init

# 克隆一个仓库
git clone <repo directory> [repo name]

# 本地仓库连接到远程仓库 (origin 是默认推荐的远程仓库名称)
git remote add origin <server>

# 取消本地仓库与远程仓库的关联
git remote remove origin

# 添加到暂存区
git add <filename>
git add *

# 移除暂存区
git rm --cached <filename>

# 提交到存储区
git commit -m <msg>

# 推送到远程仓库
git push origin master

# 从远程仓库拉取
git pull origin master

# 显示工作区和暂存区的状态
git status

# 显示远程仓库地址
git remote -v

# 查看提交历史
git log
git log --oneline

# 恢复删除的文件（仅在工作区删除）
git restore <filename>  # 从存储区恢复到工作区

# 恢复删除的文件（存储区中也删除了）
git reset --hard <hash>  # 修改head头，部分提交历史会丢失
git revert <hash>  # 恢复删除的文件，提交历史不会丢失

# 查看指定文件的修改记录
git blame <file>
```

### 分支操作

- 从 main 主分支创建分支的时候，会把 main 上的内容都复制到新分支中，之后在分支上的操作不会互相影响；
- 合并分支时，新分支中删除的文件在 main 中会被删除，新分支添加的文件在 main 中会被添加
- 合并冲突

```sh
# 创建分支
git branch <branchname>

# 查看本地分支
git branch -v

# 查看远程分支
git branch -r

# 切换分支
git checkout <branchname>
git checkout -b <branchname> # 创建并切换到新分支

# 删除分支
git branch -d <branchname>

# 合并分支
git merge <branchname>  # 把 branchname 合并到当前分支

# fetch
git pull = git fetch + git merge
```

### 解决冲突

```sh

```

## Git 的基本使用

### 起始配置

第一次使用 Git 的时候，我们需要配置**姓名**和**邮箱**，让 Git 知道当前开发者的基本信息

```sh
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```

可以使用 `git config --list`或`git config -l` 命令来查看配置信息

### 常用命令

```sh
# 初始化仓库
git init

# 查看仓库状态
git status
git status -s # 简洁模式

# 添加文件到暂存区
git add <file>
git add . # 添加所有文件

# 提交文件到仓库
git commit -m "commit message"

# 删除暂存
git rm --cached <file>

# 对比差异
git diff # 工作区和暂存区的差异
git diff --cached # 暂存区和仓库的差异

# 查看提交历史
git log
git log --oneline # 简洁模式
```

### 版本回退

- 硬回退
  - 将当前分支的 HEAD 指针移到指定的提交
  - 修改暂存区和工作区的文件，与指定提交完全一致
  - 注意： 这种方式会丢失回退之后的代码改动

```sh
git reset --hard <hash>
```

- 软回退
  - 将 HEAD 指针移到指定的提交
  - 暂存区不变，工作区的文件保留当前的改动
  - 通常用于想要重新整理提交

```sh
git reset --soft <hash>
```

- 混合回退
  - 将 HEAD 指针移到指定的提交
  - 暂存区重置，但工作区的文件保留当前改动

```sh
git reset --mixed <hash>
```

- 回滚提交
  - 生成一个新的提交，撤销指定提交的更改
  - 不会修改历史记录，适合在多人协作的情况下使用

```sh
git revert <hash>
```

### 修改提交

```sh
git commit --amend -m "commit message"
```

具有两个功能：

1. 修改最后一次提交的提交信息
2. 将新的修改合并到最后一次提交中

### 忽略文件

::: code-tabs
@tab .gitignore

```plaintext
# 忽略任何路径下的名为 temp 的文件、文件夹
temp

# 忽略任何路径下以 .log 结尾的文件
*.log

# 忽略根目录下的 dist 文件，不会忽略其他目录下的 dist 文件
/dist
```

:::
