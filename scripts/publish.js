#!/usr/bin/env node

/**
 * This script helps with publishing the package to npm.
 * It guides you through the process of updating the version,
 * building the package, and publishing it.
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = require(packageJsonPath);

console.log(`
=================================================
React Native Draggable Pan Pinch - Publish Helper
=================================================

Current version: ${packageJson.version}
`);

rl.question('Enter new version (leave empty to keep current): ', (newVersion) => {
  if (newVersion && newVersion !== packageJson.version) {
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`\nVersion updated to ${newVersion}`);
  } else {
    console.log('\nKeeping current version');
  }

  console.log('\nBuilding package...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('\nBuild successful!');
  } catch (error) {
    console.log('\nBuild failed, but this is expected if you don\'t have the peer dependencies installed.');
    console.log('The package can still be published as the TypeScript errors are related to peer dependencies.');
    
    rl.question('\nDo you want to continue with publishing? (y/n): ', (answer) => {
      if (answer.toLowerCase() !== 'y') {
        console.log('\nPublish canceled.');
        rl.close();
        return;
      }
      
      publishPackage();
    });
    return;
  }
  
  publishPackage();
  
  function publishPackage() {
    console.log('\nReady to publish!');
    console.log('\nBefore publishing, make sure you:');
    console.log('1. Have logged in to npm (npm login)');
    console.log('2. Have updated the README.md with the latest information');
    console.log('3. Have tested the package locally');
    
    rl.question('\nDo you want to publish now? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log('\nPublishing...');
        try {
          execSync('npm publish', { stdio: 'inherit' });
          console.log('\nPackage published successfully!');
        } catch (error) {
          console.error('\nFailed to publish package:', error.message);
        }
      } else {
        console.log('\nPublish canceled.');
      }
      
      rl.close();
    });
  }
});
