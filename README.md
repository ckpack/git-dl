# @ckpack/git-dl

用于从 GitHub 仓库下载特定内容的命令行工具。它允许你指定仓库的所有者和名称、输出目录、分支、子路径、glob 表达式等参数，方便地下载你需要的文件

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

-   `-b, --branch <char>`：指定要下载的分支名称，默认值为 `main`。
-   `-s, --subpath <char>`：指定要下载的子路径。
-   `-g, --glob <char>`：指定 glob 表达式，用于筛选要下载的文件。
-   `-d, --debug`：启用调试模式，显示详细的调试日志。

示例：

```shell
# 下载 ckvv/git-dl
git-dl ckvv/git-dl

# 仅下载 ckvv/git-dl 中的 src 目录
git-dl ckvv/template -s src

# 仅下载 ckvv/git-dl 中的 ts 文件
git-dl ckvv/template -g "**.ts"

# 显示命令的帮助
git-dl -h
```
