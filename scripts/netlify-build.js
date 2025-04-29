const fs = require('fs-extra');
const path = require('path');

// Define source and destination directories
const sourcePublicDir = path.join(__dirname, '..', 'public');
const destDir = path.join(__dirname, '..', '.next');

// Ensure the destination directory exists
fs.ensureDirSync(destDir);

// Copy the entire public directory to the .next directory
fs.copySync(sourcePublicDir, destDir, {
  overwrite: true,
  errorOnExist: false,
});

console.log('Successfully copied public assets to .next directory for Netlify deployment');