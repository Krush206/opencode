# Default Shell Skill

Use this skill to use the default shell configuration.

## Activation

When this skill is invoked, reset the service shell to the default using the same mechanism as `opencode service unset shell`:

```bash
opencode service unset shell
```

or explicitly set a POSIX shell:

```bash
opencode service set shell /bin/bash
```

The command will write the shell preference to the service config and, if the service is running, update the server config via `client.config.update({ shell: null })`. After reset, confirm with:

```bash
opencode service get shell
```

An empty result means the shell is back to the default.

## Core rules

* The shell tool will use the system default POSIX shell.
* All subsequent shell commands will be executed via the system default shell.
* Use standard POSIX syntax for commands.

## When to use

Use this skill when you want the shell tool to use the default system shell. It is the counterpart to the `smalltalk-shell` skill activation.