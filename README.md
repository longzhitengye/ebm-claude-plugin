# EBM Universal Plugins

Claude Code 插件集合，提供开发工具和效率增强。

## 插件

### glm-usage

在 Claude Code HUD 状态栏显示智谱 (GLM) Token 用量。

- 显示 5 小时 Token 配额使用百分比 (`🔥 6%`)
- 5 分钟缓存，避免频繁请求
- 仅在使用智谱 API 时显示
- API 失败时优雅降级，使用缓存值

安装后运行 `/glm-usage:setup` 自动配置。

### release-push

自动化版本发布流程：修改版本号、生成 CHANGELOG、提交并推送到远程仓库。

- 自动检测项目类型（Node.js / Flutter）
- 支持 major / minor / patch 版本升级
- 生成 `CHANGELOG.md`
- 以 `chore(release): v{version}` 格式提交

安装后在项目目录运行 `/release-push`。

## 安装

```bash
# 添加 marketplace
/plugin marketplace add longzhitengye/ebm-claude-plugin

# 安装插件
/plugin install glm-usage
/plugin install release-push
```

## 项目结构

```
plugins/
├── glm-usage/          # Token 用量监控
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── commands/       # 命令定义
│   ├── dist/           # 运行时代码
│   └── package.json
└── release-push/       # 发布自动化
    ├── .claude-plugin/
    │   └── plugin.json
    ├── references/     # 参考文档
    └── SKILL.md        # 技能定义
```

## License

MIT
