#!/usr/bin/env node
/**
 * GLM Usage Label Generator for claude-hud
 * Queries ZHIPU API and returns a JSON label for HUD display
 */

import https from 'https';
import fs from 'fs';

const CACHE_FILE = process.env.HOME + '/.claude/plugins/claude-hud/.glm-usage-cache.json';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Check cache first
try {
  if (fs.existsSync(CACHE_FILE)) {
    const stats = fs.statSync(CACHE_FILE);
    const age = Date.now() - stats.mtimeMs;
    if (age < CACHE_TTL) {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      console.log(JSON.stringify(cached));
      process.exit(0);
    }
  }
} catch (e) {
  // Ignore cache errors
}

const baseUrl = process.env.ANTHROPIC_BASE_URL || '';
const authToken = process.env.ANTHROPIC_AUTH_TOKEN || '';

if (!baseUrl || !authToken) {
  console.log('{"label": ""}');
  process.exit(0);
}

// Only query for ZHIPU platform
if (!baseUrl.includes('open.bigmodel.cn') && !baseUrl.includes('dev.bigmodel.cn')) {
  console.log('{"label": ""}');
  process.exit(0);
}

const parsedBaseUrl = new URL(baseUrl);
const baseDomain = `${parsedBaseUrl.protocol}//${parsedBaseUrl.host}`;
const quotaLimitUrl = `${baseDomain}/api/monitor/usage/quota/limit`;

const queryQuota = () => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(quotaLimitUrl);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname,
      method: 'GET',
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
};

queryQuota()
  .then((result) => {
    if (result && result.data && result.data.limits) {
      const tokenLimit = result.data.limits.find(l => l.type === 'TOKENS_LIMIT');
      if (tokenLimit && typeof tokenLimit.percentage === 'number') {
        const pct = Math.round(tokenLimit.percentage);
        const label = `🔥 ${pct}%`;
        const output = { label };

        // Cache the result
        try {
          fs.writeFileSync(CACHE_FILE, JSON.stringify(output));
        } catch (e) {
          // Ignore
        }

        console.log(JSON.stringify(output));
        process.exit(0);
      }
    }
    console.log('{"label": ""}');
    process.exit(0);
  })
  .catch((err) => {
    // On error, try to return cached value
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
        console.log(JSON.stringify(cached));
        process.exit(0);
      }
    } catch (e) {
      // Ignore
    }
    console.log('{"label": ""}');
    process.exit(0);
  });
