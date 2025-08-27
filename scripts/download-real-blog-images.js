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

// Real blog images with relevant SMM marketing themes
const blogImages = [
  {
    filename: 'blog-1.jpg',
    url: 'https://images.unsplash.com/photo-1611162617213-9d7c39fa9e4f?w=800&h=400&fit=crop&crop=center',
    description: 'Video content and social media engagement'
  },
  {
    filename: 'blog-2.jpg',
    url: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&h=400&fit=crop&crop=center',
    description: 'Social media marketing and business growth'
  },
  {
    filename: 'blog-3.jpg',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=center',
    description: 'Analytics and data measurement'
  },
  {
    filename: 'blog-4.jpg',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&crop=center',
    description: 'Trends and industry insights'
  },
  {
    filename: 'blog-5.jpg',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&crop=center',
    description: 'Community management and team collaboration'
  },
  {
    filename: 'blog-6.jpg',
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&crop=center',
    description: 'Digital advertising and marketing strategies'
  }
];

console.log('Downloading real blog images...');

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

// Download all images
const downloadAllImages = async () => {
  try {
    // Remove old SVG placeholders first
    for (let i = 1; i <= 6; i++) {
      const svgPath = path.join(assetsDir, `blog-${i}.svg`);
      if (fs.existsSync(svgPath)) {
        fs.unlinkSync(svgPath);
        console.log(`🗑️  Removed: blog-${i}.svg`);
      }
    }
    
    // Download new images
    for (const image of blogImages) {
      await downloadImage(image.url, image.filename);
    }
    
    console.log('\n🎉 All blog images downloaded successfully!');
    console.log('📸 Images are now high-quality, professional photos related to SMM marketing');
    
  } catch (error) {
    console.error('❌ Error downloading images:', error.message);
    
    // If download fails, create better placeholder images
    console.log('\n🔄 Creating enhanced placeholder images...');
    createEnhancedPlaceholders();
  }
};

// Create enhanced placeholder images if download fails
const createEnhancedPlaceholders = () => {
  const enhancedSVGs = [
    {
      filename: 'blog-1.svg',
      content: `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#grad1)"/>
        <circle cx="200" cy="200" r="80" fill="rgba(255,255,255,0.1)"/>
        <circle cx="600" cy="200" r="60" fill="rgba(255,255,255,0.1)"/>
        <text x="400" y="180" font-family="Arial" font-size="24" text-anchor="middle" fill="white" font-weight="bold">
          Video Content
        </text>
        <text x="400" y="210" font-family="Arial" font-size="16" text-anchor="middle" fill="white">
          Social Media Engagement
        </text>
        <text x="400" y="350" font-family="Arial" font-size="12" text-anchor="middle" fill="rgba(255,255,255,0.7)">
          Professional SMM Marketing Blog
        </text>
      </svg>`
    },
    {
      filename: 'blog-2.svg',
      content: `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f093fb;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f5576c;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#grad2)"/>
        <rect x="150" y="150" width="100" height="100" fill="rgba(255,255,255,0.1)" rx="10"/>
        <rect x="300" y="150" width="100" height="100" fill="rgba(255,255,255,0.1)" rx="10"/>
        <rect x="450" y="150" width="100" height="100" fill="rgba(255,255,255,0.1)" rx="10"/>
        <text x="400" y="180" font-family="Arial" font-size="24" text-anchor="middle" fill="white" font-weight="bold">
          SMM Panels
        </text>
        <text x="400" y="210" font-family="Arial" font-size="16" text-anchor="middle" fill="white">
          Business Growth
        </text>
        <text x="400" y="350" font-family="Arial" font-size="12" text-anchor="middle" fill="rgba(255,255,255,0.7)">
          Professional SMM Marketing Blog
        </text>
      </svg>`
    },
    {
      filename: 'blog-3.svg',
      content: `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#grad3)"/>
        <circle cx="400" cy="200" r="120" fill="rgba(255,255,255,0.1)"/>
        <circle cx="400" cy="200" r="80" fill="rgba(255,255,255,0.1)"/>
        <circle cx="400" cy="200" r="40" fill="rgba(255,255,255,0.1)"/>
        <text x="400" y="180" font-family="Arial" font-size="24" text-anchor="middle" fill="white" font-weight="bold">
          Analytics
        </text>
        <text x="400" y="210" font-family="Arial" font-size="16" text-anchor="middle" fill="white">
          Campaign Success
        </text>
        <text x="400" y="350" font-family="Arial" font-size="12" text-anchor="middle" fill="rgba(255,255,255,0.7)">
          Professional SMM Marketing Blog
        </text>
      </svg>`
    },
    {
      filename: 'blog-4.svg',
      content: `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#43e97b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#38f9d7;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#grad4)"/>
        <polygon points="400,100 500,200 400,300 300,200" fill="rgba(255,255,255,0.1)"/>
        <polygon points="400,120 480,200 400,280 320,200" fill="rgba(255,255,255,0.1)"/>
        <text x="400" y="180" font-family="Arial" font-size="24" text-anchor="middle" fill="white" font-weight="bold">
          Trends
        </text>
        <text x="400" y="210" font-family="Arial" font-size="16" text-anchor="middle" fill="white">
          Industry Insights
        </text>
        <text x="400" y="350" font-family="Arial" font-size="12" text-anchor="middle" fill="rgba(255,255,255,0.7)">
          Professional SMM Marketing Blog
        </text>
      </svg>`
    },
    {
      filename: 'blog-5.svg',
      content: `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fa709a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#fee140;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#grad5)"/>
        <circle cx="300" cy="200" r="50" fill="rgba(255,255,255,0.1)"/>
        <circle cx="500" cy="200" r="50" fill="rgba(255,255,255,0.1)"/>
        <circle cx="400" cy="200" r="50" fill="rgba(255,255,255,0.1)"/>
        <text x="400" y="180" font-family="Arial" font-size="24" text-anchor="middle" fill="white" font-weight="bold">
          Community
        </text>
        <text x="400" y="210" font-family="Arial" font-size="16" text-anchor="middle" fill="white">
          Management
        </text>
        <text x="400" y="350" font-family="Arial" font-size="12" text-anchor="middle" fill="rgba(255,255,255,0.7)">
          Professional SMM Marketing Blog
        </text>
      </svg>`
    },
    {
      filename: 'blog-6.svg',
      content: `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#a8edea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#fed6e3;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#grad6)"/>
        <rect x="200" y="150" width="400" height="100" fill="rgba(255,255,255,0.1)" rx="20"/>
        <text x="400" y="180" font-family="Arial" font-size="24" text-anchor="middle" fill="white" font-weight="bold">
          Digital Advertising
        </text>
        <text x="400" y="210" font-family="Arial" font-size="16" text-anchor="middle" fill="white">
          Marketing Strategies
        </text>
        <text x="400" y="350" font-family="Arial" font-size="12" text-anchor="middle" fill="rgba(255,255,255,0.7)">
          Professional SMM Marketing Blog
        </text>
      </svg>`
    }
  ];
  
  enhancedSVGs.forEach(svg => {
    const filePath = path.join(assetsDir, svg.filename);
    fs.writeFileSync(filePath, svg.content);
    console.log(`✨ Created enhanced placeholder: ${svg.filename}`);
  });
  
  console.log('\n🎨 Enhanced placeholder images created with professional gradients and themes');
};

// Start the download process
downloadAllImages();
