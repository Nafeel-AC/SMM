import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '..', 'src', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create placeholder blog images
const blogImages = [
  'blog-1.jpg',
  'blog-2.jpg', 
  'blog-3.jpg',
  'blog-4.jpg',
  'blog-5.jpg',
  'blog-6.jpg'
];

console.log('Creating placeholder blog images...');

// Create simple SVG placeholders for blog images
blogImages.forEach((imageName, index) => {
  const svgContent = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="200" fill="#f0f0f0"/>
    <text x="200" y="100" font-family="Arial" font-size="16" text-anchor="middle" fill="#666">
      Blog Image ${index + 1}
    </text>
  </svg>`;
  
  const filePath = path.join(assetsDir, imageName.replace('.jpg', '.svg'));
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created: ${filePath}`);
});

console.log('Blog images created successfully!');
console.log('Note: These are SVG placeholders. Replace with actual images for production.');
