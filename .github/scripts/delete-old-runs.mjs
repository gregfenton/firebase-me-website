import { Octokit } from "@octokit/rest";
import { execSync } from 'child_process';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_REPOSITORY_OWNER;
const repo = process.env.GITHUB_REPOSITORY.split('/')[1];
const workflowName = 'Build and Deploy to GitHub Pages'; // Adjust if your workflow name is different
const maxRunsToKeep = 3;

async function deleteOldWorkflowRuns() {
    try {
        // Get the list of workflows
        const workflows = await octokit.actions.listRepoWorkflows({
            owner,
            repo,
        });

        // Find the workflow ID by name
        const workflow = workflows.data.workflows.find(wf => wf.name === workflowName);
        if (!workflow) {
            throw new Error(`Workflow with name "${workflowName}" not found.`);
        }

        const workflowId = workflow.id;

        // List all workflow runs for the specified workflow
        const { data: { workflow_runs } } = await octokit.actions.listWorkflowRuns({
            owner,
            repo,
            workflow_id: workflowId,
            per_page: 100,
        });

        // Delete old workflow runs
        const runsToDelete = workflow_runs.slice(maxRunsToKeep);
        for (const run of runsToDelete) {
            await octokit.actions.deleteWorkflowRun({
                owner,
                repo,
                run_id: run.id,
            });
            console.log(`Deleted workflow run ${run.id}`);
        }
    } catch (error) {
        console.error('Error deleting old workflow runs:', error);
    }
}

deleteOldWorkflowRuns();
