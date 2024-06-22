import fs from 'fs';
import path from 'path';

const deployDir = process.env.PUBLISH_DIR || 'docs';  // Directory for deployment
const filesToCopy = ['index.html', '404.html'];
const pathToPages = 'pages';  // Directory containing the markdown files
const pathToAssets = 'assets';  // Directory containing assets

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

function buildAndDeploy() {
    // Ensure the deployment directory exists
    fs.mkdirSync(deployDir, { recursive: true });

    // Copy specific files to the deployment directory
    filesToCopy.forEach(file => {
        fs.copyFileSync(file, path.join(deployDir, file));
    });

    // Copy markdown files from the pages directory to the deployment directory
    copyDirectory(pathToPages, path.join(deployDir, pathToPages), name => name.endsWith('.md'));

    // Copy the entire assets directory to the deployment directory
    copyDirectory(pathToAssets, path.join(deployDir, pathToAssets));

    console.log(`Build and deployment files copied successfully to ${deployDir}`);
}

buildAndDeploy();
