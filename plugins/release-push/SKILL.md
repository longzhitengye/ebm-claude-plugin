---
name: release-push
description: 发布版本的时候,修改版本号,生成 changelog,并且 push 到远程仓库. 只通过`/release-push` 命令触发.
---
## Instructions
### Step 1: 判断项目语言
  - 读取 `references/languages.md`，检查项目根目录下存在哪个标识文件，确定项目类型。
### Step 2: 更新版本号
  - 根据 `Step 1` 得到的项目类型,从对应的文件中得到版本号,询问用户要bump的类型(major/minor/patch),更新版本号.
### Step 3: 如果没有`CHANGELOG.md`,建立一个.
### Step 4: 查找上一个 `chore(release)` commit。
  - 如果找到，比较该 commit 到 HEAD 之间的变更，生成 changelog。
  - 如果没有，从前一个 commit 开始比较，然后生成 changelog。
  - 将内容写入 `CHANGELOG.md`。
### Step 5: 执行`git add -A`.
### Step 6: 生成 conventional commit，格式为 `chore(release): v新版本号`。
### Step 7: 如果有远程仓,提交到远程仓.