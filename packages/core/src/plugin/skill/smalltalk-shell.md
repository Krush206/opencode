# GNU Smalltalk Shell

When the shell is `gst`, the shell tool runs `gst -e '<Smalltalk code>'`. Every command must be valid Smalltalk. POSIX syntax (`ls`, `cd`, `grep`, `|`, `>`, `&&`, `$VAR`) does not work.

## Activation

Run these while the **current** shell is still POSIX:

```bash
GST="$(command -v gst)" && [ -n "$GST" ] && opencode service set shell "$GST"
```

If `gst` is not found, stop and tell the user to install GNU Smalltalk. Do not set an empty shell.

Then verify **using Smalltalk**, because the shell has already changed:

```smalltalk
ShellUtility run: 'opencode service get shell'
```

Proceed only if the output is the path to `gst`. If the tool still behaves like POSIX, the new config may apply on the next tool call; retry once before reporting a failure. To go back, use the `default-shell` skill.

## Core rules

* Set the working directory with the tool's `workdir` parameter. There is no `cd`.
* Always print results explicitly (`printNl` / `displayNl`). Do not rely on `gst -e` echoing the last expression.
* `displayNl` shows strings without quotes; `printNl` shows the Smalltalk literal form. Use `displayNl` for human-readable output.
* Statements are separated by `.`; temporaries are declared with `| a b |`.
* Smalltalk strings use single quotes; embed one by doubling it (`'it''s'`). Use `Character cr` / `Character nl asString` for line breaks, since `\\n` is not an escape.
* No pipes or redirection. Use collections, blocks and streams.
* Errors print a trace and execution continues with the next statement. Use `Smalltalk quit: 1` after a failure if a nonzero exit status matters.
* Strings from literals may be read-only; call `copy` before `at:put:`.

## Quick reference

```smalltalk
'Hello' displayNl.
(3 + 4) printNl.
((1 to: 10) collect: [:n | n squared]) printNl.
((1 to: 10) select: [:n | n odd]) printNl.
((1 to: 100) inject: 0 into: [:sum :n | sum + n]) printNl.
```

Control flow:

```smalltalk
| x i sum |
x := 42.
(x > 40) ifTrue: ['big' displayNl] ifFalse: ['small' displayNl].
i := 1. sum := 0.
[i <= 5] whileTrue: [sum := sum + i. i := i + 1].
sum printNl.
```

Collections:

```smalltalk
| d |
d := Dictionary new.
d at: #foo put: 'bar'.
(d at: #foo ifAbsent: ['none']) displayNl.
```

Exceptions (note `ZeroDivide`, not `ZeroDivisionError`):

```smalltalk
([1 / 0] on: ZeroDivide do: [:e | e messageText displayNl. -1]) printNl.
[nil foo] on: MessageNotUnderstood do: [:e | e return: 0].
```

## Files and processes

Verify these selectors against the installed gst version if one fails:

```smalltalk
(File name: 'notes.txt') exists printNl.
(File name: 'notes.txt') contents displayNl.
Directory working displayNl.
```

Run external programs:

```smalltalk
Smalltalk system: 'ls -la'.                       "output goes to stdout; returns exit status"
(Smalltalk system: 'test -f Makefile') printNl.
```

If the environment provides the custom `ShellUtility` / `ShellCommand` classes, prefer them for running POSIX commands:

```smalltalk
ShellUtility run: 'echo Hello from GST'.
ShellUtility runLines: 'printf "a\nb\nc"'.
ShellUtility runStatus: 'true'.
```

Check availability first: `(Smalltalk includesKey: #ShellUtility) printNl`. If it prints `false`, use `Smalltalk system:` or `FileDescriptor popen:dir:` instead. Likewise, the `LLM*` helper classes are not part of stock gst.

## Common mistakes

* `ls -la` → `Smalltalk system: 'ls -la'` (or `ShellUtility run:`).
* `ZeroDivisionError` → `ZeroDivide`.
* Forgetting `printNl` / `displayNl` and seeing no output.
* Using `cd` instead of `workdir`.

## Reference

* Class index: https://www.gnu.org/software/smalltalk/manual-base/html_node/Class-index.html
* Base library: https://www.gnu.org/software/smalltalk/manual-base/gst-base.html

Useful classes: `Collection`, `OrderedCollection`, `Dictionary`, `Set`, `Bag`, `String`, `Symbol`, `Interval`, `ReadStream`, `WriteStream`, `FileStream`, `File`, `Directory`, `FileDescriptor`, `Date`, `Time`, `DateTime`, `Duration`, `Regex`, `Error`, `ZeroDivide`, `SystemExceptions.*`, `Process`, `Semaphore`.