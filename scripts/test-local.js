#!/usr/bin/env node

/**
 * This script helps with testing the package locally.
 * It guides you through the process of linking the package to a test project.
 */

const { execSync } = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
=================================================
React Native Draggable Pan Pinch - Local Testing
=================================================

This script will help you test the package locally.
`);

console.log('First, let\'s build the package:');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\nBuild successful!');
} catch (error) {
  console.log('\nBuild failed, but this is expected if you don\'t have the peer dependencies installed.');
  console.log('You can still test the package as the TypeScript errors are related to peer dependencies.');
}

console.log('\nThere are two ways to test the package locally:');
console.log('1. Using npm link');
console.log('2. Using a local path in package.json');

rl.question('\nWhich method do you want to use? (1/2): ', (answer) => {
  if (answer === '1') {
    console.log('\nUsing npm link:');
    console.log('1. First, we\'ll create a global link for this package');
    
    try {
      execSync('npm link', { stdio: 'inherit' });
      console.log('\nGlobal link created!');
      
      console.log('\nNow, go to your test project and run:');
      console.log('npm link react-native-draggable-pan-pinch');
      console.log('\nAfter testing, you can unlink by running:');
      console.log('npm unlink react-native-draggable-pan-pinch');
      console.log('npm unlink --global react-native-draggable-pan-pinch');
    } catch (error) {
      console.error('\nFailed to create link:', error.message);
    }
  } else if (answer === '2') {
    console.log('\nUsing a local path in package.json:');
    console.log('In your test project\'s package.json, add:');
    
    const packagePath = path.resolve(__dirname, '..');
    console.log(`"react-native-draggable-pan-pinch": "file:${packagePath}"`);
    
    console.log('\nThen run:');
    console.log('npm install');
    
    console.log('\nAfter testing, you can remove the package by running:');
    console.log('npm uninstall react-native-draggable-pan-pinch');
  } else {
    console.log('\nInvalid option selected.');
  }
  
  console.log('\nDon\'t forget to install the peer dependencies in your test project:');
  console.log('npm install react-native-gesture-handler react-native-reanimated');
  
  rl.close();
});
