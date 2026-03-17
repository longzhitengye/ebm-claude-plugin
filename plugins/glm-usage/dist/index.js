#!/usr/bin/env node
/**
 * GLM Usage Plugin for Claude Code
 * Shows GLM (智谱) Token usage information
 */

import { readStdin } from './stdin.js';

async function main() {
  const stdin = await readStdin();

  if (!stdin) {
    console.log('[glm-usage] GLM Token Usage Plugin');
    console.log('Run /glm-usage:check to see your current usage');
    return;
  }

  // Plugin can be extended here for more functionality
  console.log(JSON.stringify({ success: true }));
}

main().catch(console.error);

/**
 * Read stdin JSON from Claude Code
 */
async function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => {
      try {
        resolve(data.trim() ? JSON.parse(data) : null);
      } catch {
        resolve(null);
      }
    });
    // Timeout if no stdin
    setTimeout(() => resolve(null), 100);
  });
}
