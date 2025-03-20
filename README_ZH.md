# @ckpack/git-dl

[English](./README.md) | [简体中文](./README_ZH.md)

用于从 GitHub 仓库下载特定内容的命令行工具。它允许你指定仓库的所有者和名称、输出目录、分支、子路径、glob 表达式等参数，方便地下载你需要的文件

> GitHub 对于未认证的用户会有速率限制 <https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api> 你可以在环境变量中添加 `GITHUB_TOKEN` 或者 `-t`避免超出限制, 你可以在 <https://github.com/settings/personal-access-tokens> 创建 `GITHUB_TOKEN`

# 安装

```shell
npm install -g @ckpack/git-dl
```

# 使用方法

```shell
git-dl [options] [command] <owner/repo> [output-dir]
```

参数说明：

-   `<owner/repo>`：必填，GitHub 仓库的所有者和名称，格式为 `owner/repo`，例如 `ckvv/github-download`。
-   `[output-dir]`：可选，下载文件的输出目录，若不指定则会使用默认目录。

选项说明：

-  `-V`，`--version` 输出版本号
-  `-b`，`--branch <字符>` 分支名称（默认值：“main”）
-  `-s`，`--subpath <字符>` 子路径
-  `-g`，`--glob <字符>` 通配符表达式
-  `-d`，`--debug`显示调试日志
-  `-t`，`--token <字符>` GitHub 令牌
-  `-h`，`--help` 显示命令的帮助信息

示例：

```shell
# 下载 ckvv/git-dl
git-dl ckvv/git-dl

# 下载 ckvv/git-dl 到 my_dir
git-dl ckvv/git-dl ./my_dir

# 仅下载 ckvv/git-dl 中的 src 目录
git-dl ckvv/template -s src

# 仅下载 ckvv/git-dl 中的 ts 文件
git-dl ckvv/template -g "**.ts"

# 使用 GITHUB_TOKEN
git-dl ckvv/template -g "**.ts" -t "YOUR_GITHUB_TOKEN"

# 显示命令的帮助
git-dl -h
```
