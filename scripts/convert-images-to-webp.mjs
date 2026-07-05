/**
 * Converts PNG/JPEG files in public/images to WebP.
 * Run manually: npm run images:webp
 * Runs automatically before production builds (prebuild).
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const SOURCE_EXT = new Set(['.png', '.jpg', '.jpeg']);
const WEBP_QUALITY = 85;

function collectSourceFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(fullPath, files);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (SOURCE_EXT.has(ext)) files.push(fullPath);
  }
  return files;
}

async function convertFile(filePath) {
  const ext = path.extname(filePath);
  const webpPath = filePath.slice(0, -ext.length) + '.webp';
  const sourceStat = fs.statSync(filePath);
  const webpExists = fs.existsSync(webpPath);

  if (webpExists) {
    const webpStat = fs.statSync(webpPath);
    if (webpStat.mtimeMs >= sourceStat.mtimeMs) {
      fs.unlinkSync(filePath);
      console.log(`Removed stale source (WebP up to date): ${path.relative(process.cwd(), filePath)}`);
      return;
    }
  }

  await sharp(filePath).webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(webpPath);
  fs.unlinkSync(filePath);
  const before = sourceStat.size;
  const after = fs.statSync(webpPath).size;
  const saved = Math.round((1 - after / before) * 100);
  console.log(
    `Converted ${path.relative(process.cwd(), filePath)} → ${path.relative(process.cwd(), webpPath)} (−${saved}%)`
  );
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    console.log('Created public/images — add PNG/JPEG files, then run npm run images:webp');
    return;
  }

  const files = collectSourceFiles(IMAGES_DIR);
  if (files.length === 0) {
    console.log('No PNG/JPEG files to convert in public/images');
    return;
  }

  for (const file of files) {
    await convertFile(file);
  }

  console.log('Done. Reference images as /images/name.webp in code.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
