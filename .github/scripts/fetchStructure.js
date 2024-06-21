const { Octokit } = require("@octokit/rest");
const fs = require('fs');
const yaml = require('js-yaml');

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const owner = 'YOUR_GITHUB_USERNAME';
const repo = 'YOUR_REPOSITORY_NAME';
const pathToFolder = 'paths';

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
                if (item) {
                    const node = {
                        name: item.name,
                        path: item.path,
                        type: item.type,
                        children: []
                    };
                    categoryNode.children.push(node);
                    assignedItems.add(item.name);

                    if (item.type === 'dir') {
                        stack.push({ path: item.path, parent: node.children });
                    }
                }
            });
        }

        // Process remaining items in alphabetical order
        const remainingItems = contents.filter(item => !assignedItems.has(item.name));
        remainingItems.sort((a, b) => a.name.localeCompare(b.name));

        remainingItems.forEach(item => {
            const node = {
                name: item.name,
                path: item.path,
                type: item.type,
                children: []
            };
            parent.push(node);
            if (item.type === 'dir') {
                stack.push({ path: item.path, parent: node.children });
            }
        });
    }

    fs.writeFileSync('structure.json', JSON.stringify(result, null, 2));
}

fetchFolderStructure().catch(err => console.error(err));
