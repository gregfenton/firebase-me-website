import { Octokit } from "@octokit/rest";
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const repository = process.env.GITHUB_REPOSITORY;
if (!repository) {
    console.error('GITHUB_REPOSITORY environment variable is not set');
    process.exit(1);
} else {
    console.log(`GITHUB_REPOSITORY: ${repository}`);
}

const [owner, repo] = repository.split('/');
if (!owner || !repo) {
    console.error('GITHUB_REPOSITORY environment variable is not correctly formatted');
    process.exit(1);
}

const pathToFolder = 'pages';  // Update the directory to 'pages'

async function fetchFolderStructure() {
    const result = [];
    const stack = [{ path: pathToFolder, parent: result }];

    while (stack.length) {
        const { path: currentPath, parent } = stack.pop();
        const { data: contents } = await octokit.repos.getContent({
            owner,
            repo,
            path: currentPath
        });

        // Check for the presence of map.yml
        const mapFile = contents.find(item => item.name === 'map.yml');
        let categoryOrder = {};
        let assignedItems = new Set();

        if (mapFile) {
            // Fetch and parse map.yml
            const { data: mapContent } = await octokit.repos.getContent({
                owner,
                repo,
                path: `${currentPath}/map.yml`
            });
            const decodedContent = Buffer.from(mapContent.content, 'base64').toString('utf-8');
            const parsedMap = yaml.load(decodedContent);
            categoryOrder = parsedMap;
        }

        // Process items based on the order in map.yml
        for (const category in categoryOrder) {
            const categoryItems = categoryOrder[category];
            const categoryNode = {
                name: category,
                type: 'category',
                children: []
            };
            parent.push(categoryNode);

            categoryItems.forEach(name => {
                const item = contents.find(content => content.name === name);
                if (item && item.type === 'file' && item.name.endsWith('.md')) {
                    const node = {
                        name: item.name,
                        path: item.path,
                        type: item.type,
                        children: []
                    };
                    categoryNode.children.push(node);
                    assignedItems.add(item.name);
                } else if (item && item.type === 'dir') {
                    const node = {
                        name: item.name,
                        path: item.path,
                        type: item.type,
                        children: []
                    };
                    categoryNode.children.push(node);
                    assignedItems.add(item.name);
                    stack.push({ path: item.path, parent: node.children });
                }
            });
        }

        // Process remaining items in alphabetical order
        const remainingItems = contents.filter(item => !assignedItems.has(item.name));
        remainingItems.sort((a, b) => a.name.localeCompare(b.name));

        remainingItems.forEach(item => {
            if (item.type === 'file' && item.name.endsWith('.md')) {
                const node = {
                    name: item.name,
                    path: item.path,
                    type: item.type,
                    children: []
                };
                parent.push(node);
            } else if (item.type === 'dir') {
                const node = {
                    name: item.name,
                    path: item.path,
                    type: item.type,
                    children: []
                };
                parent.push(node);
                stack.push({ path: item.path, parent: node.children });
            }
        });
    }

    const filePath = 'structure.json';
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2));

    console.log('structure.json generated successfully');
}

fetchFolderStructure().catch(err => console.error(err));
