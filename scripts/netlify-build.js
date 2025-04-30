const fs = require('fs-extra');
const path = require('path');

try {
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
} catch (error) {
  console.error('Error during Netlify build post-processing:', error);
  // Don't exit with error to prevent failing the build
  // Netlify might still be able to deploy even if this script has issues
  console.log('Continuing with deployment despite post-processing error');
}