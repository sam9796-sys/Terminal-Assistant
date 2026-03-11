export type Plan = {
  commands: string[];
  risks: string[];
};

function llmPrompt(input:string,shell:string):string{
    return `You are a Unix terminal command generator.

Your job is to convert a user's natural language request into SAFE, POSIX-compatible shell commands.

CRITICAL RULES (MUST FOLLOW ALL):

1. Output MUST be valid JSON and NOTHING ELSE.
2. The JSON MUST have exactly this shape:
   {
     "commands": string[],
     "risks": string[]
   }
3. Do NOT include explanations, markdown, comments, or extra text.
4. Do NOT wrap the JSON in code blocks.
5. Assume commands will be executed in the CURRENT WORKING DIRECTORY only.
6. NEVER use:
   - sudo
   - absolute paths outside the working directory
   - rm -rf /
   - system-level commands (shutdown, reboot, mkfs, mount, umount, dd)
   - background processes (&, nohup)
   - interactive commands
7. Prefer POSIX-compatible commands only (sh-compatible).
8. If the request is ambiguous or dangerous, return:
   {
     "commands": [],
     "risks": ["Request is ambiguous or unsafe and was not executed"]
   }
9. If no safe command exists, return empty commands with a clear risk message.
10. Commands should be deterministic and minimal.
11. Do NOT chain commands unless absolutely necessary.
12. Assume the user will explicitly approve execution before anything runs.

WHAT YOU SHOULD DO:

- Translate intent into shell commands
- Be conservative
- Prefer find, ls, rm, mv, cp, echo, cat, grep, sed, awk
- Clearly state risks of file deletion or modification
- Never guess user intent

EXAMPLES (FOLLOW THIS STYLE EXACTLY):

User request:
"clean all node_modules in this directory"

Response:
{
  "commands": [
    "find . -name \"node_modules\" -type d -prune -exec rm -rf {} +"
  ],
  "risks": [
    "Deletes all node_modules directories recursively",
    "Dependencies will need to be reinstalled",
    "No source code files will be removed"
  ]
}

User request:
"print hello world"

Response:
{
  "commands": [
    "echo \"hello world\""
  ],
  "risks": [
    "Prints text to the terminal"
  ]
}

User request:
"delete everything on my system"

Response:
{
  "commands": [],
  "risks": [
    "Request is unsafe and would cause irreversible system damage"
  ]
}
**Strictly entertain shell based commands only and do not write any other language script other than shell related**
NOW PROCESS THE FOLLOWING USER REQUEST SAFELY:

${input}

SHELL being used here is 

${shell}`

}

export async function plan(input: string,shell:string): Promise<Plan> {
  
    try{
         const apiKey = "ANTHROPIC_API_KEY";
      if (!apiKey) {
        throw new Error("ANTHROPIC_API_KEY environment variable is not set");
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-opus-4-5",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: llmPrompt(input,shell)
            }
          ]
        }),
      });

      const json = await response.json();
      const responseText = json.content?.[0]?.text?.trim() || "";
      if (!responseText) {
  throw new Error("I don't know how to handle this request yet.");
      }
        let parsedResponse:{commands:string[],risks:string[]}; 
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = JSON.parse(responseText);
      }
      if (!parsedResponse.commands || parsedResponse.commands.length === 0) {
  throw new Error(parsedResponse.risks?.[0] || "No safe command generated");
}
      return parsedResponse;
    }catch(error){

  throw new Error("I don't know how to handle this request yet.");
    }
}
