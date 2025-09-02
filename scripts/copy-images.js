import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyImages() {
    try {
        const srcAssetsPath = path.join(__dirname, '../src/assets');
        const publicAssetsPath = path.join(__dirname, '../public/assets');

        // Ensure the public/assets directory exists
        await fs.ensureDir(publicAssetsPath);

        // Copy all files from src/assets to public/assets
        await fs.copy(srcAssetsPath, publicAssetsPath, {
            overwrite: true,
            filter: (src, dest) => {
                // Filter to only copy image files and exclude certain directories if needed
                const ext = path.extname(src).toLowerCase();
                const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico'];

                // If it's a directory, allow it
                if (fs.statSync(src).isDirectory()) {
                    return true;
                }

                // If it's an image file, allow it
                return imageExtensions.includes(ext);
            }
        });

        console.log('✅ Images copied successfully from src/assets to public/assets');
    } catch (error) {
        console.error('❌ Error copying images:', error);
        process.exit(1);
    }
}

copyImages();
