import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const deployDir = process.env.PUBLISH_DIR || 'deploy';  // Directory for deployment
const filesToCopy = ['index.html', '404.html', 'structure.json', 'favicon.ico'];
const pathToPages = 'pages';  // Directory containing the markdown files
const pathToAssets = 'assets';  // Directory containing assets
const publishBranch = 'gh-pages';  // Branch for GitHub Pages

function copyDirectory(src, dest, filterFn = () => true) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    entries.forEach(entry => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath, filterFn);
        } else if (filterFn(entry.name)) {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

function fetchCNAME() {
    try {
        execSync(`git fetch origin ${publishBranch}`);
        execSync(`git checkout origin/${publishBranch} -- CNAME`);
        if (fs.existsSync('CNAME')) {
            fs.copyFileSync('CNAME', path.join(deployDir, 'CNAME'));
            console.log('CNAME file preserved.');
        }
    } catch (error) {
        console.log('No existing CNAME file found or error during fetch:', error.message);
    }
}

function ensureStructureJsonExists() {
    if (!fs.existsSync('structure.json')) {
        throw new Error('structure.json file does not exist. Ensure it is created before running the deployment script.');
    }
}

function buildAndDeploy() {
    // Ensure the structure.json file exists
    ensureStructureJsonExists();

    // Ensure the deployment directory exists
    fs.mkdirSync(deployDir, { recursive: true });

    // Fetch and preserve the existing CNAME file
    fetchCNAME();

    // Copy specific files to the deployment directory
    filesToCopy.forEach(file => {
        fs.copyFileSync(file, path.join(deployDir, file));
    });

    // Copy markdown files and assets to the deployment directory
    copyDirectory(pathToPages, path.join(deployDir, pathToPages), name => name.endsWith('.md'));
    copyDirectory(pathToAssets, path.join(deployDir, pathToAssets));

    console.log(`Build and deployment files copied successfully to ${deployDir}`);
}

buildAndDeploy();
