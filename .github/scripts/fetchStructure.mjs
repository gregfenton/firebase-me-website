import { Octokit } from "@octokit/rest";
import fs from 'fs';
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

    const filePath = 'structure.json';
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2));

    // Commit and push the structure.json file
    const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref: 'heads/main'
    });

    const { data: blobData } = await octokit.git.createBlob({
        owner,
        repo,
        content: fs.readFileSync(filePath, 'utf8'),
        encoding: 'utf-8'
    });

    const { data: treeData } = await octokit.git.createTree({
        owner,
        repo,
        base_tree: refData.object.sha,
        tree: [{
            path: filePath,
            mode: '100644',
            type: 'blob',
            sha: blobData.sha
        }]
    });

    const { data: commitData } = await octokit.git.createCommit({
        owner,
        repo,
        message: 'Update structure.json',
        tree: treeData.sha,
        parents: [refData.object.sha]
    });

    await octokit.git.updateRef({
        owner,
        repo,
        ref: 'heads/main',
        sha: commitData.sha
    });
}

fetchFolderStructure().catch(err => console.error(err));
