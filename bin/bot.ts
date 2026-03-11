#!/usr/bin/env node
import { plan } from "../core/planner.js";
import readline from "readline";
import { execute } from "../core/executor.js";

function permission(permission:string):boolean{
    if(permission.trim().toLowerCase()==="yes" || permission.trim().toLowerCase()==="y" || permission.trim().toLowerCase()==="ye")return true;
    else return false;
}

function askPermission(): Promise<boolean> {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("\nType yes/no to continue: ", answer => {
      rl.close();
      resolve(permission(answer));
    });
  });
}

const args = process.argv.slice(2);
const input = args.join(" ").trim();

if (!input) {
  console.error("Usage: @bot <request>");
  process.exit(1);
}
if(input.includes("BOT_KEY")){
    
}

(async () => {
  try {
    const proposal = await plan(input,process.env.SHELL as string);

    console.log("\nProposed Commands:");
    proposal.commands.forEach(c => console.log("  ", c));

    console.log("\nRisks:");
    proposal.risks.forEach(r => console.log(" -", r));
    const approved = await askPermission();
if (!approved) {
  console.log("Aborted.");
  process.exit(0);
}

  console.log("\nExecuting...\n");
  const fullCommand = proposal.commands.join(" && ");
 const result = await execute(fullCommand);

  if (result.stdout) {
    console.log("STDOUT:");
    console.log(result.stdout);
  }

  if (result.stderr) {
    console.error("STDERR:");
    console.error(result.stderr);
  }
  console.log("Exit code:", result.exitCode);
  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();
