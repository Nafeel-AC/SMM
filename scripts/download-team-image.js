import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '..', 'src', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Team image URL - professional team collaboration image
const teamImageUrl = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&crop=center';

console.log('Downloading professional team image...');

// Function to download image
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(assetsDir, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete file on error
      reject(err);
    });
    
    file.on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete file on error
      reject(err);
    });
  });
};

// Download team image
const downloadTeamImage = async () => {
  try {
    // Remove old placeholder image if it exists
    const oldImagePath = path.join(assetsDir, 'team-image.jpg');
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
      console.log('🗑️  Removed old team image');
    }
    
    // Download new team image
    await downloadImage(teamImageUrl, 'team-image.jpg');
    
    console.log('\n🎉 Team image downloaded successfully!');
    console.log('📸 Now using a real, professional team collaboration photo');
    
  } catch (error) {
    console.error('❌ Error downloading team image:', error.message);
    
    // If download fails, create a better placeholder
    console.log('\n🔄 Creating enhanced team placeholder...');
    createTeamPlaceholder();
  }
};

// Create enhanced team placeholder if download fails
const createTeamPlaceholder = () => {
  const svgContent = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="teamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#teamGrad)"/>
    
    <!-- Team members representation -->
    <circle cx="200" cy="200" r="60" fill="rgba(255,255,255,0.2)"/>
    <circle cx="400" cy="200" r="60" fill="rgba(255,255,255,0.2)"/>
    <circle cx="600" cy="200" r="60" fill="rgba(255,255,255,0.2)"/>
    <circle cx="300" cy="350" r="60" fill="rgba(255,255,255,0.2)"/>
    <circle cx="500" cy="350" r="60" fill="rgba(255,255,255,0.2)"/>
    
    <!-- Connection lines -->
    <line x1="260" y1="200" x2="340" y2="200" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
    <line x1="460" y1="200" x2="540" y2="200" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
    <line x1="360" y1="350" x2="440" y2="350" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
    <line x1="200" y1="260" x2="300" y2="290" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
    <line x1="400" y1="260" x2="300" y2="290" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
    <line x1="600" y1="260" x2="500" y2="290" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
    <line x1="400" y1="260" x2="500" y2="290" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
    
    <text x="400" y="150" font-family="Arial" font-size="28" text-anchor="middle" fill="white" font-weight="bold">
      Professional Team
    </text>
    <text x="400" y="180" font-family="Arial" font-size="16" text-anchor="middle" fill="white">
      Collaboration & Excellence
    </text>
    <text x="400" y="520" font-family="Arial" font-size="14" text-anchor="middle" fill="rgba(255,255,255,0.7)">
      SMM Matrix - Your Trusted Partner
    </text>
  </svg>`;
  
  const filePath = path.join(assetsDir, 'team-image.svg');
  fs.writeFileSync(filePath, svgContent);
  console.log('✨ Created enhanced team placeholder: team-image.svg');
  console.log('\n🎨 Enhanced team placeholder created with professional design');
};

// Start the download process
downloadTeamImage();
