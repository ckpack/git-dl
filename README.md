# @ckpack/git-dl

[English](./README.md) | [简体中文](./README_ZH.md)

A command-line tool used to download specific content from GitHub repositories. It allows you to specify parameters such as the owner and name of the repository, the output directory, the branch, the subpath, the glob expression, etc., making it convenient to download the files you need.

> GitHub has rate limits for unauthenticated users <https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api>. You can add `GITHUB_TOKEN` to the environment variables or use the `-t` option to avoid exceeding the limits. You can create `GITHUB_TOKEN` at <https://github.com/settings/personal-access-tokens>

# 安装

```shell
npm install -g @ckpack/git-dl
```

# 使用方法

```shell
git-dl [options] [command] <owner/repo> [output-dir]
```

参数说明：

-   `<owner/repo>`：Required. The owner and name of the GitHub repository, in the format of `owner/repo`, for example, `ckvv/git-dl`.
-   `[output-dir]`：Optional. The output directory for the downloaded files. If not specified, the default directory will be used.

选项说明：

+ `-V`, `--version`         output the version number
+ `-b`, `--branch <char>`   branch name (default: "main")
+ `-s`, `--subpath <char>`  subpath
+ `-g`, `--glob <char>`     glob expressions
+ `-d`, `--debug `          show debug log
+ `-t`, `--token <char>`    github token
+ `-h`, `--help`            display help for command

示例：

```shell
# download ckvv/git-dl
git-dl ckvv/git-dl

# download ckvv/git-dl to my_dir
git-dl ckvv/git-dl ./my_dir

# Only download the src directory in ckvv/git-dl
git-dl ckvv/template -s src

# Only download the .ts files in ckvv/git-dl
git-dl ckvv/template -g "**.ts"

# USE GITHUB_TOKEN
git-dl ckvv/template -g "**.ts" -t "YOUR_GITHUB_TOKEN"

# Show the help for the command
git-dl -h
```
