export type ExecutionResult = {
    stdout: string;
    stderr: string;
    exitCode: number | null;
};
export declare function execute(command: string): Promise<ExecutionResult>;
//# sourceMappingURL=executor.d.ts.map