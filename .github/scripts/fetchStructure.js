const { Octokit } = require("@octokit/rest");
const fs = require('fs');

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

        for (const content of contents) {
            const node = {
                name: content.name,
                path: content.path,
                type: content.type,
                children: []
            };
            parent.push(node);

            if (content.type === 'dir') {
                stack.push({ path: content.path, parent: node.children });
            }
        }
    }

    fs.writeFileSync('structure.json', JSON.stringify(result, null, 2));
}

fetchFolderStructure().catch(err => console.error(err));
