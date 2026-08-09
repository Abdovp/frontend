/**
 * Optimize existing WebP images to reduce file size
 * Targets: Reduce images to web-appropriate sizes
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

// Image optimization targets
const OPTIMIZATIONS = [
  {
    input: 'garden-sprinkler.webp',
    maxWidth: 1200,
    quality: 80,
    targetSize: '~200KB'
  },
  {
    input: 'sprinkler-solution.webp',
    maxWidth: 1200,
    quality: 80,
    targetSize: '~250KB'
  },
  {
    input: 'sprinkler-pain.webp',
    maxWidth: 1200,
    quality: 80,
    targetSize: '~200KB'
  },
  {
    input: 'sprinkler-how.webp',
    maxWidth: 1200,
    quality: 80,
    targetSize: '~150KB'
  }
];

async function optimizeImage(config) {
  const inputPath = path.join(IMAGES_DIR, config.input);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`⏭️  Skipping ${config.input} - not found`);
    return;
  }

  const stats = fs.statSync(inputPath);
  const originalSizeKB = Math.round(stats.size / 1024);

  console.log(`\n📸 Optimizing ${config.input}...`);
  console.log(`   Original: ${originalSizeKB} KB`);
  console.log(`   Target: ${config.targetSize}`);

  // Create backup
  const backupPath = inputPath.replace('.webp', '.backup.webp');
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(inputPath, backupPath);
    console.log(`   ✅ Backup created`);
  }

  try {
    await sharp(inputPath)
      .resize(config.maxWidth, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: config.quality,
        effort: 6 // Higher effort = better compression (0-6)
      })
      .toFile(inputPath.replace('.webp', '.optimized.webp'));

    // Replace original with optimized
    fs.renameSync(
      inputPath.replace('.webp', '.optimized.webp'),
      inputPath
    );

    const newStats = fs.statSync(inputPath);
    const newSizeKB = Math.round(newStats.size / 1024);
    const savings = Math.round(((originalSizeKB - newSizeKB) / originalSizeKB) * 100);

    console.log(`   ✅ Optimized: ${newSizeKB} KB (${savings}% smaller)`);
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    // Restore from backup if optimization failed
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, inputPath);
    }
  }
}

async function main() {
  console.log('🎨 Starting image optimization...\n');
  
  for (const config of OPTIMIZATIONS) {
    await optimizeImage(config);
  }
  
  console.log('\n✨ Image optimization complete!\n');
  console.log('💡 Backups saved as *.backup.webp');
  console.log('   If images look good, you can delete the backups.\n');
}

main().catch(console.error);
