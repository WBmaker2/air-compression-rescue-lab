#!/usr/bin/env node
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative, extname } from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const LIMIT = 500;
const EXTENSIONS = new Set([".ts", ".tsx", ".css"]);
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", "test-results", "playwright-report"]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (SKIP_DIRS.has(entry)) continue;
    const st = statSync(full);
    if (st.isDirectory()) walk(full, files);
    else if (EXTENSIONS.has(extname(entry))) files.push(full);
  }
  return files;
}

const offenders = [];
for (const file of walk(ROOT)) {
  const lines = readFileSync(file, "utf8").split("\n").length;
  if (lines >= LIMIT) offenders.push({ file: relative(ROOT, file), lines });
}

if (offenders.length > 0) {
  for (const { file, lines } of offenders) console.error(`${file}: ${lines} lines (limit ${LIMIT})`);
  process.exit(1);
}
console.log(`check:lines OK — no TS/TSX/CSS file reaches ${LIMIT} lines.`);
