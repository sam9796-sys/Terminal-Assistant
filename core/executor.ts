import { spawn } from "child_process";

export type ExecutionResult = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
};

export function execute(command: string): Promise<ExecutionResult> {
  return new Promise(resolve => {
    const proc = spawn("sh", ["-c", command], {
      cwd: process.cwd(),
      env: process.env
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", d => (stdout += d.toString()));
    proc.stderr.on("data", d => (stderr += d.toString()));

    proc.on("close", code => {
      resolve({
        stdout,
        stderr,
        exitCode: code
      });
    });
  });
}
