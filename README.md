# Terminal Assistant

A lightweight AI assistant that works directly inside your terminal.  
Invoke it with `@bot` to translate natural language requests into executable terminal commands.

The assistant **does not execute anything automatically**.  
It generates commands, shows them to you for review, and only runs them after you approve them.

This makes it useful for automation while still keeping full control over your environment.

---

## Overview

Working in the terminal often requires remembering complex commands, flags, and workflows.  
Terminal Assistant allows you to simply describe what you want to do, and it will generate the necessary commands for you.

Instead of searching documentation or copying commands from the internet, you can ask the assistant directly inside your shell.

The assistant acts as a **command planner** rather than an autonomous executor. Every command is visible and requires explicit approval before execution.

---

## How It Works

1. A request is made using the `@bot` trigger inside the terminal.
2. The assistant interprets the request and generates the required shell commands.
3. The commands are presented to the user.
4. The user reviews and approves the commands.
5. Approved commands are executed in the current terminal session.

This workflow ensures transparency and safety while still allowing powerful automation.

