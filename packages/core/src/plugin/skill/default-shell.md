# Default Shell Skill

Use this skill to restore the default POSIX shell behavior.

## Activation

Run these while the **current** shell is Smalltalk:

```bash
opencode service unset shell
```

Then verify **using Smalltalk**, because the shell has already changed:

```smalltalk
ShellUtility run: 'opencode service get shell'
```

An empty output means the shell is back to the default POSIX shell.

## Core rules

* The shell tool will use the system default POSIX shell.
* All subsequent shell commands will be executed via the system default shell.
* Use standard POSIX syntax for commands.

## When to use

Use this skill when you want the shell tool to use the default system shell again. It is the counterpart to the `smalltalk-shell` skill.

## Reference

* Service commands: `opencode service set shell <path>`, `opencode service get shell`, `opencode service unset shell`.