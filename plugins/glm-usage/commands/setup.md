---
description: Configure claude-hud to show GLM (智谱) Token usage
---

# glm-usage:setup

Configure claude-hud to display GLM Token usage in the status line.

## What this does

1. Updates `~/.claude/settings.json` to add the GLM label command to claude-hud
2. Updates `~/.claude/plugins/claude-hud/config.json` to use compact layout
3. Creates the GLM label script

## Steps

### Step 1: Check if claude-hud is installed

First, check if the user has claude-hud installed by looking for its directory.

!`ls -d ~/.claude/plugins/cache/claude-hud/claude-hud/*/ 2>/dev/null | sort -V | tail -1`

If not found, tell the user they need to install claude-hud first:
```
❌ claude-hud not found. Please install it first:

/plugin marketplace add jarrodwatts/claude-hud
/plugin install claude-hud
```

### Step 2: Find the claude-hud directory

Get the latest claude-hud directory path.

### Step 3: Update settings.json

Read the current `~/.claude/settings.json` and update the statusLine command to include the --extra-cmd parameter.

The command should be:
```
plugin_dir=$(ls -d ~/.claude/plugins/cache/claude-hud/claude-hud/*/ 2>/dev/null | sort -V | tail -1); exec /opt/homebrew/bin/bun ${plugin_dir}dist/index.js --extra-cmd='/opt/homebrew/bin/bun ~/.claude/plugins/cache/ebm-universal-plugins/glm-usage/dist/label.mjs'
```

Use the Edit tool to update the file.

### Step 4: Update claude-hud config

Ensure `~/.claude/plugins/claude-hud/config.json` has:
```json
{
  "lineLayout": "compact"
}
```

Create the file if it doesn't exist, or update it if it does.

### Step 5: Create the label script

Copy the label script to the correct location.

!`mkdir -p ~/.claude/plugins/claude-hud`
!`cat > ~/.claude/plugins/claude-hud/glm-usage-label.mjs << 'SCRIPT'
#!/usr/bin/env node
import https from 'https';
import fs from 'fs';

const CACHE_FILE = process.env.HOME + '/.claude/plugins/claude-hud/.glm-usage-cache.json';
const CACHE_TTL = 5 * 60 * 1000;

try {
  if (fs.existsSync(CACHE_FILE)) {
    const stats = fs.statSync(CACHE_FILE);
    if (Date.now() - stats.mtimeMs < CACHE_TTL) {
      console.log(fs.readFileSync(CACHE_FILE, 'utf8'));
      process.exit(0);
    }
  }
} catch (e) {}

const baseUrl = process.env.ANTHROPIC_BASE_URL || '';
const authToken = process.env.ANTHROPIC_AUTH_TOKEN || '';

if (!baseUrl || !authToken || !baseUrl.includes('bigmodel.cn')) {
  console.log('{"label": ""}');
  process.exit(0);
}

const baseDomain = baseUrl.includes('bigmodel.cn') ? \`\${new URL(baseUrl).protocol}//\${new URL(baseUrl).host}\` : '';
const url = \`\${baseDomain}/api/monitor/usage/quota/limit\`;

https.get(url, { headers: { 'Authorization': authToken, 'Content-Type': 'application/json' }, timeout: 5000 }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const result = JSON.parse(data);
        const limit = result?.data?.limits?.find(l => l.type === 'TOKENS_LIMIT');
        if (limit && typeof limit.percentage === 'number') {
          const output = JSON.stringify({ label: \`🔥 \${Math.round(limit.percentage)}%\` });
          fs.writeFileSync(CACHE_FILE, output);
          console.log(output);
        } else {
          console.log('{"label": ""}');
        }
      } catch (e) {
        console.log('{"label": ""}');
      }
    } else {
      console.log('{"label": ""}');
    }
    process.exit(0);
  });
}).on('error', () => {
  console.log('{"label": ""}');
  process.exit(0);
});
SCRIPT`

### Step 6: Make the script executable

!`chmod +x ~/.claude/plugins/claude-hud/glm-usage-label.mjs`

### Step 7: Done

Tell the user to restart Claude Code:

```
✅ Configuration complete!

Restart Claude Code to see GLM usage in your HUD:

[Opus] │ my-project git:(main)
Context ░░░░░░░░░░ 0% | 🔥 6%
                     ^^^^^
                  GLM usage
```
