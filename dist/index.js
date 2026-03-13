#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
const program = new Command();
async function display_fetched_activity(username) {
    const overall_data = await fetch(`https://api.github.com/users/${username}/events`);
    const json = await overall_data.json();
    if (JSON.stringify(json) === "{}") {
        return;
    }
    fs.writeFileSync("results.json", JSON.stringify(json));
    const pushCounts = {};
    const pullCounts = {};
    for (const event of json) {
        if (event.type === "PushEvent") {
            const repoName = event.repo.name;
            pushCounts[repoName] = (pushCounts[repoName] ?? 0) + 1;
        }
    }
    for (const event of json) {
        if (event.type === "PullRequestEvent") {
            pullCounts[event.repo.name] = (pullCounts[event.repo.name] ?? 0) + 1;
        }
    }
    console.log("Output: ");
    for (const repoName in pushCounts) {
        console.log(`    - Made ${pushCounts[repoName]} git pushes to ${repoName}`);
    }
    for (const repoName in pullCounts) {
        console.log(`    - Made ${pullCounts[repoName]} git pulls from ${repoName}`);
    }
}
program
    .argument("<username>", "")
    .action((username) => {
    display_fetched_activity(username).then();
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map