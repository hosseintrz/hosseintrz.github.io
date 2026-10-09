#!/usr/bin/env node
/**
 * WCAG AA contrast gate: parses src/styles/tokens.css, builds every
 * theme x accent combination, and verifies all text pairs meet 4.5:1.
 * Fails (exit 1) below AA. Run via `pnpm contrast`; part of `pnpm check` and CI.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8');

const THEMES = ['dark', 'light'];
const ACCENTS = ['violet', 'cyan', 'lime', 'amber', 'rose', 'mono'];

// ---- parse tokens.css into (selector, declarations) blocks ----
const cssClean = css.replace(/\/\*[\s\S]*?\*\//g, '');
const blocks = [];
const blockRe = /([^{}]+)\{([^{}]*)\}/g;
for (const [, sel, body] of cssClean.matchAll(blockRe)) {
  const decls = {};
  for (const decl of body.split(';')) {
    const idx = decl.indexOf(':');
    if (idx === -1) continue;
    const prop = decl.slice(0, idx).trim();
    const value = decl.slice(idx + 1).trim();
    if (prop.startsWith('--')) decls[prop] = value;
  }
  if (Object.keys(decls).length) blocks.push({ selector: sel.trim(), decls });
}

// ---- color parsing ----
function parseColor(value) {
  const v = value.trim();
  if (v.startsWith('#')) {
    let hex = v.slice(1);
    if (hex.length === 4) hex = [...hex].map((c) => c + c).join('');
    if (hex.length !== 6) return null;
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const rgb = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (rgb) return [+rgb[1], +rgb[2], +rgb[3]];
  return null;
}

function srgbChannel(c) {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

function luminance([r, g, b]) {
  return 0.2126 * srgbChannel(r) + 0.7152 * srgbChannel(g) + 0.0722 * srgbChannel(b);
}

function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

// ---- build each combination's variable map ----
function varsFor(theme, accent) {
  const vars = {};
  const apply = (block) => Object.assign(vars, block.decls);
  for (const b of blocks) if (b.selector === ':root') apply(b);
  if (theme === 'light') {
    for (const b of blocks) if (b.selector === "[data-theme='light']") apply(b);
  }
  if (accent !== 'violet') {
    for (const b of blocks) if (b.selector === `[data-accent='${accent}']`) apply(b);
    if (theme === 'light') {
      for (const b of blocks)
        if (b.selector === `[data-accent='${accent}'][data-theme='light']`) apply(b);
    }
  }
  return vars;
}

// text/background pairs that must meet 4.5:1 (normal text AA)
const PAIRS = [
  ['text-1', 'surface-0'],
  ['text-1', 'surface-1'],
  ['text-2', 'surface-0'],
  ['text-2', 'surface-1'],
  ['text-2', 'surface-2'],
  ['text-3', 'surface-0'],
  ['text-3', 'surface-1'],
  ['text-3', 'surface-2'],
  ['accent', 'surface-0'],
  ['accent', 'surface-1'],
  ['accent-contrast', 'accent'],
  ['success', 'surface-0'],
  ['warn', 'surface-0'],
  ['danger', 'surface-0'],
];

const MIN = 4.5;
let failures = 0;

for (const theme of THEMES) {
  for (const accent of ACCENTS) {
    const vars = varsFor(theme, accent);
    const label = `${theme}/${accent}`;
    const missing = ['surface-0', 'surface-1', 'surface-2', 'accent'].filter(
      (t) => !vars[`--${t}`] || !parseColor(vars[`--${t}`])
    );
    if (missing.length) {
      console.error(`FAIL ${label}: unparseable tokens for ${missing.join(', ')}`);
      failures++;
      continue;
    }
    for (const [fg, bg] of PAIRS) {
      const fgColor = parseColor(vars[`--${fg}`]);
      const bgColor = parseColor(vars[`--${bg}`]);
      if (!fgColor || !bgColor) {
        console.error(`FAIL ${label}: cannot evaluate ${fg} on ${bg}`);
        failures++;
        continue;
      }
      const ratio = contrast(fgColor, bgColor);
      if (ratio < MIN) {
        console.error(
          `FAIL ${label}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1 (needs ${MIN}:1)`
        );
        failures++;
      }
    }
    console.log(`ok   ${label}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} contrast failure(s). Fix the tokens in src/styles/tokens.css.`);
  process.exit(1);
}
console.log('\nAll theme x accent combinations pass WCAG AA (4.5:1).');