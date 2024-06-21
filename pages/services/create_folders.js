const fs = require('fs');
const yaml = require('yaml');
const path = require('path');

// Read the YAML file
const file = fs.readFileSync('map.yml', 'utf8');
const data = yaml.parse(file);

// Function to create folders recursively
const createFolders = (basePath, folders) => {
    folders.forEach(folder => {
        const folderPath = path.join(basePath, folder);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            console.log(`Created folder: ${folderPath}`);
        }
    });
};

// Base path where folders will be created
const basePath = path.join(__dirname, './');

// Iterate over each key in the YAML file and create folders
for (const key in data) {
    const folders = data[key];
    createFolders(basePath, folders);
}

console.log('Folder creation complete.');
