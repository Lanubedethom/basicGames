import fs from 'fs';
import path from 'path';

const root = process.cwd();
const srcAssets = path.join(root, 'src', 'assets');
const destAssets = path.join(root, 'dist', 'src', 'assets');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error('Source assets folder does not exist:', src);
    process.exit(1);
  }
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyRecursive(srcAssets, destAssets);
  console.log('Copied assets from', srcAssets, 'to', destAssets);
} catch (err) {
  console.error('Failed to copy assets:', err);
  process.exit(1);
}
