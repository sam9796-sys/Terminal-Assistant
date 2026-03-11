import path from "path";
const FORBIDDEN_PATTERNS = [
    /\bsudo\b/,
    /\brm\s+-rf\s+\/\b/,
    /\brm\s+-rf\s+\*\b/,
    /\bmkfs\b/,
    /\bdd\b/,
    /\bshutdown\b/,
    /\breboot\b/,
    /\bpoweroff\b/,
    /\bmount\b/,
    /\bumount\b/,
    /\bchown\b/,
    /\bchmod\b/,
    />\s*\/dev\//,
    /\b:\s*\(\s*\)\s*\{/
];
const WARNING_PATTERNS = [
    /\brm\s+-rf\b/,
    /\bfind\b.*-delete\b/
];
export function validateCommand(command) {
    const errors = [];
    const warnings = [];
    const normalized = command.replace(/\s+/g, " ").trim();
    for (const rule of FORBIDDEN_PATTERNS) {
        if (rule.test(normalized)) {
            errors.push(`Blocked dangerous pattern: ${rule}`);
        }
    }
    for (const rule of WARNING_PATTERNS) {
        if (rule.test(normalized)) {
            warnings.push("This command deletes files recursively");
        }
    }
    const tokens = normalized.split(" ");
    for (const t of tokens) {
        if (t.startsWith("/")) {
            const resolved = path.resolve(t);
            const cwd = process.cwd();
            if (!resolved.startsWith(cwd)) {
                errors.push(`Access outside working directory blocked: ${t}`);
            }
        }
    }
    if (normalized.includes(";")) {
        warnings.push("Command chaining detected (`;`)");
    }
    if (normalized.includes("&&")) {
        warnings.push("Multiple commands detected (`&&`)");
    }
    if (normalized.includes("|")) {
        warnings.push("Piping detected (`|`)");
    }
    return {
        ok: errors.length === 0,
        errors,
        warnings
    };
}
//# sourceMappingURL=validator.js.map