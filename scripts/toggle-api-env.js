#!/usr/bin/env node

/**
 * Toggle API Environment Script
 * 
 * This script toggles between development and production API environments
 * by modifying the .env.local file.
 * 
 * Usage:
 *   node scripts/toggle-api-env.js [env]
 * 
 * Where [env] is one of:
 *   - dev, development: Switch to development environment (localhost:8000)
 *   - prod, production: Switch to production environment (Vercel)
 *   If no argument is provided, it will toggle between the two.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ENV_FILE_PATH = path.join(process.cwd(), '.env.local');
const DEV_MARKER = 'NEXT_PUBLIC_USE_LOCAL_API=true';
const DEV_MARKER_COMMENTED = '# NEXT_PUBLIC_USE_LOCAL_API=true';

// Function to read the current environment file
function readEnvFile() {
  try {
    return fs.readFileSync(ENV_FILE_PATH, 'utf8');
  } catch (error) {
    console.error('Error reading .env.local file:', error.message);
    process.exit(1);
  }
}

// Function to write the updated environment file
function writeEnvFile(content) {
  try {
    fs.writeFileSync(ENV_FILE_PATH, content, 'utf8');
  } catch (error) {
    console.error('Error writing .env.local file:', error.message);
    process.exit(1);
  }
}

// Function to determine the current environment
function getCurrentEnv(content) {
  return content.includes(DEV_MARKER) ? 'development' : 'production';
}

// Function to toggle the environment
function toggleEnv(content, targetEnv) {
  const currentEnv = getCurrentEnv(content);
  
  // If no target environment is specified, toggle between dev and prod
  if (!targetEnv) {
    targetEnv = currentEnv === 'development' ? 'production' : 'development';
  }
  
  // If current environment is already the target, do nothing
  if (currentEnv === targetEnv) {
    console.log(`Already in ${targetEnv} environment.`);
    return content;
  }
  
  // Update the environment file
  if (targetEnv === 'development') {
    return content.replace(DEV_MARKER_COMMENTED, DEV_MARKER);
  } else {
    return content.replace(DEV_MARKER, DEV_MARKER_COMMENTED);
  }
}

// Main function
function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  let targetEnv = null;
  
  if (args.length > 0) {
    const arg = args[0].toLowerCase();
    if (['dev', 'development'].includes(arg)) {
      targetEnv = 'development';
    } else if (['prod', 'production'].includes(arg)) {
      targetEnv = 'production';
    } else {
      console.error('Invalid argument. Use "dev", "development", "prod", or "production".');
      process.exit(1);
    }
  }
  
  // Read the current environment file
  const content = readEnvFile();
  const currentEnv = getCurrentEnv(content);
  
  // Toggle the environment
  const updatedContent = toggleEnv(content, targetEnv);
  
  // Write the updated environment file
  writeEnvFile(updatedContent);
  
  // Determine the new environment
  const newEnv = getCurrentEnv(updatedContent);
  
  // Print the result
  if (currentEnv === newEnv) {
    console.log(`Environment unchanged: ${newEnv}`);
  } else {
    console.log(`Environment switched from ${currentEnv} to ${newEnv}`);
    console.log(`API URL: ${newEnv === 'development' ? 'http://127.0.0.1:8000' : 'https://evolve2p-backend.vercel.app'}`);
  }
}

// Run the main function
main();
