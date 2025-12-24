const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Fix permissions on Unix systems (ignored on Windows)
const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
if (fs.existsSync(vitePath)) {
  try {
    fs.chmodSync(vitePath, '755');
    console.log('Fixed vite permissions');
  } catch (e) {
    console.log('Could not fix permissions (might be Windows)');
  }
}

// Run vite build
console.log('Running vite build...');
execSync('npx vite build', { stdio: 'inherit' });
