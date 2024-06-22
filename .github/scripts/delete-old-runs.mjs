import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const owner = 'your-username';  // replace with your GitHub username or organization name
const repo = 'your-repository';  // replace with your repository name
const workflow_id = 'your-workflow-id';  // replace with your workflow ID or filename

async function deleteOldWorkflowRuns() {
    try {
        const { data: workflowRuns } = await octokit.actions.listWorkflowRuns({
            owner,
            repo,
            workflow_id,
            per_page: 100,
        });

        const runsToDelete = workflowRuns.workflow_runs.slice(3);  // Keep only the latest 3 runs

        for (const run of runsToDelete) {
            await octokit.actions.deleteWorkflowRun({
                owner,
                repo,
                run_id: run.id
            });
            console.log(`Deleted workflow run ID: ${run.id}`);
        }

        console.log('Old workflow runs deleted successfully.');
    } catch (error) {
        console.error('Error deleting old workflow runs:', error);
    }
}

deleteOldWorkflowRuns();
