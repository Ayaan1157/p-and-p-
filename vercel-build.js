const fs = require('fs');
const path = require('path');

const SOURCE_DIR = '.';
const OUTPUT_DIR = 'dist';

const SKIP = new Set([
  '.git',
  '.tanstack',
  '.workspace',
  'node_modules',
  'dist',
  '.vercel',
  'dev-server.js',
  'vercel-build.js',
  'package.json',
  'package-lock.json',
  '.gitignore',
  'vercel.json'
]);

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP.has(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
}

copyDir(SOURCE_DIR, OUTPUT_DIR);
console.log(`Build complete: ${OUTPUT_DIR}/`);
