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

  // Special handling for Google verification file
  const googleVerificationFile = path.join(sourcePublicDir, 'google1d5e63a1dc05ed54.html');
  if (fs.existsSync(googleVerificationFile)) {
    fs.copySync(googleVerificationFile, path.join(destDir, 'google1d5e63a1dc05ed54.html'), {
      overwrite: true,
    });
    console.log('Successfully copied Google verification file to .next directory');
  }

  console.log('Successfully copied public assets to .next directory for Netlify deployment');
} catch (error) {
  console.error('Error during Netlify build script:', error);
  // Don't exit with error code to prevent build failure
  console.log('Continuing build process despite errors...');
}