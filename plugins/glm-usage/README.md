# GLM Usage Plugin

显示智谱 (GLM) API Token 使用量。

## 安装

```bash
/plugin marketplace add https://gitea.ryzes.com/longzhitengye/ebm-claude-plugin.git
/plugin install glm-usage
```

## 配合 claude-hud 使用

1. 安装 claude-hud：
```bash
/plugin marketplace add jarrodwatts/claude-hud
/plugin install claude-hud
```

2. 修改 `~/.claude/settings.json` 中的 statusLine 命令，添加 `--extra-cmd` 参数：

```json
{
  "statusLine": {
    "command": "plugin_dir=$(ls -d ~/.claude/plugins/cache/claude-hud/claude-hud/*/ 2>/dev/null | sort -V | tail -1); exec /opt/homebrew/bin/bun ${plugin_dir}dist/index.js --extra-cmd='$HOME/.claude/plugins/cache/ebm-universal-plugins/glm-usage/dist/label.mjs'"
  }
}
```

3. 修改 `~/.claude/plugins/claude-hud/config.json`，使用 compact 模式：

```json
{
  "lineLayout": "compact"
}
```

4. 重启 Claude Code

你会看到类似这样的显示：

```
[Opus] │ aitoearn-electron git:(main)
Context ░░░░░░░░░░ 0% | 🔥 6%
```

其中 `🔥 6%` 就是你的智谱 Token 使用量（5小时限额）。

## 功能

- 显示 5 小时 Token 限额的使用百分比
- 5 分钟缓存，避免频繁请求
- 仅在使用智谱 API 时显示
- 请求失败时显示缓存值
