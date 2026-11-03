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

* Set the working directory with the tool's `workdir` parameter. THERE IS NO `cd`.
* Always print results explicitly (`printNl` / `displayNl`). Do not rely on `gst -e` echoing the last expression.
* `displayNl` shows strings without quotes; `printNl` shows the Smalltalk literal form. Use `displayNl` for human-readable output.
* Statements are separated by `.`; temporaries are declared with `| a b |`.
* Smalltalk strings use single quotes; embed one by doubling it (`'it''s'`). Use `Character cr` / `Character nl asString` for line breaks, since `\\n` is not an escape.
* No pipes or redirection. Use collections, blocks and streams.
* Errors print a trace and execution continues with the next statement. Use `Smalltalk quit: 1` after a failure if a nonzero exit status matters.
* Strings from literals may be read-only; call `copy` before `at:put:`.

## ShellUtility rules: LIMITED USE only

**DO NOT use `ShellUtility` when you have better Smalltalk alternatives.** ShellUtility is a last resort for external programs only.

### When to USE ShellUtility

1. **No Smalltalk equivalent exists** - e.g., calling external CLI tools, custom binaries
2. **Accessing external services/files** - when Smalltalk file APIs don't apply
3. **Running system commands** - `git`, `npm`, `curl` for specific operations

### When to AVOID ShellUtility

1. **File reading/writing** - Use `File`, `FileStream`, `FileDescriptor` instead
2. **Directory listing** - Use `Directory` class: `(Directory working) children`
3. **String manipulation** - Use `String` methods, `Collection` operations
4. **Data processing** - Use `select:`, `collect:`, `reject:`, `inject:into:`
5. **Path operations** - Use `File` and `Directory` classes
6. **Simple commands** - `echo`, `printf`, `test` are often unnecessary
7. **Anything you can do with Smalltalk collections**

## Quick reference

### Enumerating all classes and methods

The following procedure prints all available classes and their methods:

```smalltalk
Smalltalk allClassesDo: [ :i | 
  'Class: ' displayNl. 
  i displayNl. 
  Character tab display. 
  '<Class methods>' displayNl. 
  i class selectors do: [ :m | Character tab display. m displayNl. ]. 
  Character tab display. 
  '<Instance methods>' displayNl. 
  i selectors do: [ :m | Character tab display. m displayNl. ]
].
```

This iterates over every class and method in the system. Use with caution as it produces extensive output.

### Basic operations

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
(Directory working) children printNl.
```

Run external programs:

```smalltalk
Smalltalk system: 'ls -la'.                       "output goes to stdout; returns exit status"
(Smalltalk system: 'test -f Makefile') printNl.
```

If you must use ShellUtility (rarely needed), check availability first:

```smalltalk
(Smalltalk includesKey: #ShellUtility) printNl.
```

If it prints `false`, use `Smalltalk system:` or `FileDescriptor popen:dir:` instead.

**NEVER** use `ShellUtility` for:
- Simple echo/printf (use `displayNl`, `printNl`)
- File operations (use `File` class)
- Data manipulation (use Smalltalk collections)
- String processing (use `String` methods)

When in doubt, prefer Smalltalk idioms over ShellUtility.

## Common mistakes

* `ls -la` → `Smalltalk system: 'ls -la'` (only when no Smalltalk equivalent)
* `cat file` → `(File name: 'file') contents`
* Reading directory → `(Directory working) children`
* `ZeroDivisionError` → `ZeroDivide`
* Forgetting `printNl` / `displayNl` and seeing no output.
* Using `cd` instead of `workdir`.
* Using `ShellUtility` when Smalltalk has a better API.

## Reference

* Class index: https://www.gnu.org/software/smalltalk/manual-base/html_node/Class-index.html
* Base library: https://www.gnu.org/software/smalltalk/manual-base/gst-base.html

Useful classes: `Collection`, `OrderedCollection`, `Dictionary`, `Set`, `Bag`, `String`, `Symbol`, `Interval`, `ReadStream`, `WriteStream`, `FileStream`, `File`, `Directory`, `FileDescriptor`, `Date`, `Time`, `DateTime`, `Duration`, `Regex`, `Error`, `ZeroDivide`, `SystemExceptions.*`, `Process`, `Semaphore`.