const { Octokit } = require("@octokit/rest");
const { context } = require("@actions/github");
const fs = require('fs');
const path = require('path');

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

async function run() {
    const issue = context.payload.issue;

    if (issue.labels.some(label => label.name === 'change-request')) {
        const [articleToChange, linesToChange, proposedChanges] = parseIssueBody(issue.body);
        const branchName = `issue-${issue.number}`;

        // Create or update a branch
        try {
            await octokit.git.getRef({
                owner: context.repo.owner,
                repo: context.repo.repo,
                ref: `heads/${branchName}`
            });

            // Update the branch
            await updateBranch(issue.number, branchName, articleToChange, linesToChange, proposedChanges);
        } catch {
            // Create a new branch
            await createBranch(branchName);

            // Update the branch
            await updateBranch(issue.number, branchName, articleToChange, linesToChange, proposedChanges);
        }

        // Check if the issue is marked as ready for review
        if (issue.labels.some(label => label.name === 'ready-for-review')) {
            // Create a pull request
            await createPullRequest(issue.title, branchName, issue.number);
        }
    }
}

async function createBranch(branchName) {
    await octokit.git.createRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: `refs/heads/${branchName}`,
        sha: context.sha
    });
}

async function updateBranch(issueNumber, branchName, articleToChange, linesToChange, proposedChanges) {
    const filePath = path.join('paths', articleToChange);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const updatedContent = applyChanges(fileContent, linesToChange, proposedChanges);

    // Write the updated content to the file
    fs.writeFileSync(filePath, updatedContent);

    // Commit and push the changes
    await octokit.repos.createOrUpdateFileContents({
        owner: context.repo.owner,
        repo: context.repo.repo,
        path: filePath,
        message: `Apply changes from issue #${issueNumber}`,
        content: Buffer.from(updatedContent).toString('base64'),
        branch: branchName
    });
}

async function createPullRequest(title, branchName, issueNumber) {
    await octokit.pulls.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: title,
        head: branchName,
        base: 'main',
        body: `This PR addresses issue #${issueNumber}`
    });
}

function parseIssueBody(body) {
    const lines = body.split('\n').map(line => line.trim());
    const articleToChange = lines.find(line => line.startsWith('**Article to Change**')).split(': ')[1];
    const linesToChange = lines.find(line => line.startsWith('**Line(s) to Change**')).split(': ')[1];
    const proposedChangesIndex = lines.findIndex(line => line.startsWith('**Proposed Changes**'));
    const proposedChanges = lines.slice(proposedChangesIndex + 1).join('\n').trim();
    return [articleToChange, linesToChange, proposedChanges];
}

function applyChanges(content, linesToChange, changes) {
    const contentLines = content.split('\n');
    const [start, end] = linesToChange.includes('-')
        ? linesToChange.split('-').map(Number)
        : [Number(linesToChange), Number(linesToChange)];
    const updatedLines = [
        ...contentLines.slice(0, start - 1),
        changes,
        ...contentLines.slice(end)
    ];
    return updatedLines.join('\n');
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
