# Default Shell

Restores the shell tool to the system default POSIX shell.

## Activation

**Check the current shell first.** If the shell is currently `gst` (see the `smalltalk-shell` skill), POSIX commands will fail, so run the reset through Smalltalk:

```smalltalk
ShellUtility run: 'opencode service unset shell'
```

(or `Smalltalk system: 'opencode service unset shell'` if `ShellUtility` is unavailable). If the shell is already POSIX, run directly:

```bash
opencode service unset shell
```

Use `opencode service set shell /bin/bash` only if the user wants an explicit shell instead of the system default.

The command updates the service config and, if the service is running, the live server config. The change may apply on the next tool call.

## Verify

```bash
opencode service get shell
```

* Empty output means the default is restored (after `unset`).
* After `set shell /bin/bash`, the output should be `/bin/bash`.

Then confirm the shell actually behaves as POSIX:

```bash
echo ok && ps -p $$ -o comm=
```

If this still fails with Smalltalk errors, wait for the next tool call and retry once, then report the failure to the user.

## Rules

* After the reset, use standard POSIX syntax for all commands.
* Set directories with the tool's `workdir` parameter or `cd` as normal.
