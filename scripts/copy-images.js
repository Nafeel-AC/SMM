// This script will help you copy image assets from src to public folder
// to ensure they are properly served in production

// Instructions:
// 1. You need to manually copy these files:
//    - From: ./src/assets/feature-1.png  To: ./public/assets/features/feature-1.png
//    - From: ./src/assets/feature-2.png  To: ./public/assets/features/feature-2.png
//    - From: ./src/assets/feature-3.png  To: ./public/assets/features/feature-3.png
//    - From: ./src/assets/feature-4.png  To: ./public/assets/features/feature-4.png
//
//    - From: ./src/assets/audience-img-1.jpg  To: ./public/assets/target-audience/content-creators.jpg
//    - From: ./src/assets/audience-img-2.jpg  To: ./public/assets/target-audience/small-business.jpg
//    - From: ./src/assets/audience-img-3.jpg  To: ./public/assets/target-audience/freelancers.jpg
//    - From: ./src/assets/audience-img-4.jpg  To: ./public/assets/target-audience/marketing-agencies.jpg
//
// You can run this with Node.js if you have fs-extra installed:
// npm install fs-extra
// node ./scripts/copy-images.js

import fs from 'fs-extra';
import path from 'path';

// Array of images to copy
const imagesToCopy = [
    // Features
    { src: './src/assets/feature-1.png', dest: './public/assets/features/feature-1.png' },
    { src: './src/assets/feature-2.png', dest: './public/assets/features/feature-2.png' },
    { src: './src/assets/feature-3.png', dest: './public/assets/features/feature-3.png' },
    { src: './src/assets/feature-4.png', dest: './public/assets/features/feature-4.png' },

    // Target audience
    { src: './src/assets/audience-img-1.jpg', dest: './public/assets/target-audience/content-creators.jpg' },
    { src: './src/assets/audience-img-2.jpg', dest: './public/assets/target-audience/small-business.jpg' },
    { src: './src/assets/audience-img-3.jpg', dest: './public/assets/target-audience/freelancers.jpg' },
    { src: './src/assets/audience-img-4.jpg', dest: './public/assets/target-audience/marketing-agencies.jpg' },
];

// Ensure directories exist
fs.ensureDirSync('./public/assets/features');
fs.ensureDirSync('./public/assets/target-audience');

// Copy each image
imagesToCopy.forEach(({ src, dest }) => {
    try {
        fs.copySync(src, dest);
        console.log(`✅ Copied: ${src} -> ${dest}`);
    } catch (err) {
        console.error(`❌ Error copying ${src}: ${err.message}`);
    }
});

console.log('Image copying process complete!');
