# GNU Smalltalk Shell

When the shell is `gst`, the shell tool runs `gst -e '<Smalltalk code>'`. Every command must be valid Smalltalk. POSIX syntax (`ls`, `cd`, `grep`, `|`, `>`, `&&`, `$VAR`) does not work.

Every example below was executed against the installed `gst`. Prefer them over guessing: GNU Smalltalk's String and Directory APIs are small, and plausible names such as `children`, `trimBlanks`, or `includesSubstring:` do not exist.

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

`ShellUtility run:` answers the command's stdout as a String, including its trailing newline. Proceed only if the output is the path to `gst`. If the tool still behaves like POSIX, the new config may apply on the next tool call; retry once before reporting a failure. To go back, use the `default-shell` skill.

## Core rules

* Set the working directory with the tool's `workdir` parameter. There is no `cd` command.
* Always print results explicitly (`printNl` / `displayNl`). Do not rely on `gst -e` echoing the last expression.
* `displayNl` shows strings without quotes; `printNl` shows the Smalltalk literal form. Use `displayNl` for human-readable output.
* Statements are separated by `.`; temporaries are declared with `| a b |`.
* Smalltalk strings use single quotes; embed one by doubling it (`'it''s'`). There is no `\n` escape — use `Character cr asString`.
* No pipes or redirection. Use collections, blocks and streams.
* An uncaught error prints a backtrace and then **execution continues with the next statement**. It does not stop the script and it does not set a nonzero exit code. Use `ObjectMemory quit: 1` after a failure if a nonzero exit status matters.
* Each shell tool call starts a fresh `gst`, so state such as the working directory does not carry over between calls.

## Running external programs

```smalltalk
Smalltalk system: 'ls -la'   "runs the command; its output goes straight to stdout"
```

`Smalltalk system:` answers a **raw wait status**, not an exit code: `0` for success, `256` for exit 1, `768` for exit 3. Decode it with `bitShift: -8`:

```smalltalk
(Smalltalk system: 'test -f Makefile') printNl.              "0 when present, 256 when absent"
((Smalltalk system: 'git status') bitShift: -8) printNl.     "actual exit code"
```

`ShellUtility` answers a String instead, which is what you want when you need to read the output:

```smalltalk
ShellUtility run: 'git rev-parse HEAD'          "answers stdout as a String"
ShellUtility runStatus: 'git status'            "writes stdout through, answers a Boolean"
ShellUtility runLines: 'git log --oneline -5'   "answers an Array of lines"
```

`FileDescriptor popen:dir:` runs a command and returns a readable stream:

```smalltalk
(FileDescriptor popen: 'echo popen-ok' dir: '/tmp') contents displayNl.
```

## Files and processes

```smalltalk
(File name: 'notes.txt') exists printNl.        "true / false"
(File name: 'notes.txt') size printNl.
(File name: 'notes.txt') isDirectory printNl.
(File name: 'notes.txt') contents displayNl.    "whole file as a String"
```

Reading and writing a file with streams:

```smalltalk
| in out |
in := (File name: 'notes.txt') readStream.
in contents displayNl.
in close.

out := (File name: 'notes.txt') writeStream.
out nextPutAll: 'line1'; cr; nextPutAll: 'line2'.
out close.
```

`FileDescriptor open:mode:` is the other way to open a file for writing:

```smalltalk
| f |
f := FileDescriptor open: '/tmp/out.txt' mode: 'w'.
f nextPutAll: 'text'; cr.
f close.
```

`FileStream` has no file-creation methods (`forceNewFileNamed:` does not exist here), and `File` has no class-side constructor other than `name:` and `path:`.

Listing a directory — note that the methods live on `File`/`FilePath`, not on `Directory`, and that the selector is `entries`, not `children`:

```smalltalk
Directory working printNl.              "<File /path/to/cwd>"
Directory workingName displayNl.        "/path/to/cwd"
(File name: '.') entries printNl.       "Array of File/Directory, includes '.' and '..'"
(File name: '.') entryNames printNl.    "Array of String"
(File name: '.') files printNl.         "Array of File only"
Directory home printNl.                 "<File /root> — whatever $HOME is here"
Directory temporary printNl.            "<File /tmp>"
```

`Directory working` answers a `File`, not a `Directory`, and `Directory` understands neither `name:` nor `children`. To address another directory, build a `File`:

```smalltalk
(File name: '/etc') entryNames printNl.
```

To change directory inside the current `gst` process, use `Directory working:`. It answers the `Directory` class itself, and the change lasts only for this shell call:

```smalltalk
Directory working: '/tmp'.
Directory working printNl.              "<File /tmp>"
```

Creating and removing files:

```smalltalk
File remove: '/tmp/scratch.txt'.
File touch: '/tmp/scratch.txt'.
File rename: '/tmp/a.txt' to: '/tmp/b.txt'.
```

## Strings

Verified working on `String`:

```smalltalk
'Hello' asUppercase displayNl.                    "HELLO"
('  a b  ' subStrings: ' ') printNl.               "OrderedCollection ('a' 'b')"
('a,b,,c' tokenize: ',') printNl.                  "('a' 'b' '' 'c')"
'a b' lines printNl.                              "('a b')"
('hello' copyFrom: 2 to: 4) printNl.               "'ell'"
('hello' endsWith: 'llo') printNl.                 "true"
('hello' indexOfSubCollection: 'ell' startingAt: 1) printNl.  "2; 0 when absent"
('hello' matchRegex: 'h.*') printNl.               "true; anchored at the start"
('hello' , ' world') displayNl.                    "hello world"
```

The parentheses are load-bearing: `'x' endsWith: 'llo' printNl` sends `printNl` to `'llo'` (unary binds first), prints `'llo'`, and throws the boolean away. See Precedence gotchas.

Not available in this build — do not use them:

`trimBlanks`, `capitalized`, `beginsWith:`, `findTokens:`, `words`, `reversed`, `includesSubstring:`, `includesSubString:`.

Use `subStrings:`/`substrings` to split and strip whitespace, and `indexOfSubCollection:startingAt:` for substring search.

`matchRegex:` answers a Boolean, so it is safe in a condition. The `=~` operator answers a `MatchingRegexResults` object instead, which raises `did not understand #ifTrue:ifFalse:` if you treat it as one:

```smalltalk
('abc' =~ 'b') ifTrue: [ 'y' ] ifFalse: [ 'n' ].   "raises an error"
('abc' matchRegex: 'b') ifTrue: [ 'y' ] ifFalse: [ 'n' ].   "no error; answers false here because it is anchored"
```

## Precedence gotchas

Unary messages bind tighter than binary `,`, so without parentheses only the right side is printed:

```smalltalk
'a', Character cr asString, 'b' displayNl.        "prints only 'b'"
('a', Character cr asString, 'b') displayNl.      "prints a, then a newline, then b"
```

Adjacent keywords form a **single** message sent to the receiver, so two separate keyword messages need parentheses:

```smalltalk
Smalltalk system: 'true' bitShift: -8.            "error: did not understand #system:bitShift:"
(Smalltalk system: 'true') bitShift: -8.          "0"
```

Precedence runs unary first, then binary `,`, then keyword messages. Parenthesize whenever one message's result must be the receiver of another.

## Enumerating all classes and methods

```smalltalk
Smalltalk allClassesDo: [ :i |
  i displayNl.
  Character tab display.
  '<Class methods>' displayNl.
  i class selectors do: [ :m | Character tab display. m displayNl. ].
  Character tab display.
  '<Instance methods>' displayNl.
  i selectors do: [ :m | Character tab display. m displayNl. ]
].
```

This iterates over every class and method in the system (about 180 classes here) and produces extensive output.

## Control flow and collections

```smalltalk
| x i sum |
x := 42.
(x > 40) ifTrue: ['big' displayNl] ifFalse: ['small' displayNl].
i := 1. sum := 0.
[i <= 5] whileTrue: [sum := sum + i. i := i + 1].
sum printNl.
((1 to: 10) collect: [:n | n squared]) printNl.
((1 to: 100) inject: 0 into: [:sum :n | sum + n]) printNl.
```

```smalltalk
| d |
d := Dictionary new.
d at: #foo put: 'bar'.
(d at: #foo ifAbsent: ['none']) displayNl.
```

Exceptions — the class is `ZeroDivide`, not `ZeroDivisionError`:

```smalltalk
([1 / 0] on: ZeroDivide do: [:e | e messageText displayNl. -1]) printNl.
[nil foo] on: MessageNotUnderstood do: [:e | 'unknown selector' displayNl].
```

## Exiting

```smalltalk
ObjectMemory quit: 0.    "exit 0"
ObjectMemory quit: 1.    "exit 1"
ObjectMemory abort.      "quit and dump core"
```

There is no `Smalltalk quit:`. `ObjectMemory quit:` is the exit mechanism, and it ends the process immediately — statements after it never run.

## ShellUtility: last resort

Prefer Smalltalk APIs. Reach for `ShellUtility` only for external CLI tools with no Smalltalk equivalent (`git`, `npm`, `curl`, `ls`).

Do **not** use it for:

* File or directory work — `File`, `Directory` cover it
* Printing — `displayNl` / `printNl`
* Data or string manipulation — `select:`, `collect:`, `inject:into:`, `subStrings:`

## Common mistakes

* `Directory working children` → `(File name: '.') entries`
* `Directory name: 'path'` → `File name: 'path'` (`Directory` has no `name:`)
* `Smalltalk quit: 1` → `ObjectMemory quit: 1`
* `Smalltalk system:` exit code → decode with `bitShift: -8`
* `trimBlanks` / `includesSubstring:` → not available; see Strings
* `cat file` → `(File name: 'file') contents`
* `ZeroDivisionError` → `ZeroDivide`
* Forgetting `printNl` / `displayNl` and seeing no output
* Using `cd` instead of `workdir`
* Using `ShellUtility` when Smalltalk has a better API

## Reference

* Base library: https://www.gnu.org/software/smalltalk/manual-base/gst-base.html
* Class index: https://www.gnu.org/software/smalltalk/manual-base/html_node/Class-index.html

See the `smalltalk-reference` skill for the local copy of the GNU Smalltalk library reference.

Useful classes: `Collection`, `OrderedCollection`, `Dictionary`, `Set`, `Bag`, `String`, `Symbol`, `Interval`, `ReadStream`, `WriteStream`, `File`, `Directory`, `FileDescriptor`, `FilePath`, `Date`, `Time`, `DateTime`, `Duration`, `Regex`, `Error`, `ZeroDivide`, `MessageNotUnderstood`, `ObjectMemory`, `ShellUtility`, `Process`, `Semaphore`.
