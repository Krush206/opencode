# GNU Smalltalk Shell Skill

Use this skill when the OpenCode shell is GNU Smalltalk `gst`. The shell tool executes `gst -e '<Smalltalk expression>'`. Do NOT use POSIX bash syntax.

## Core rules

* The shell is Smalltalk, not bash. No `ls`, `cd`, `grep`, `|`, `>`, `&&`, `$VAR`.
* Every shell command is a valid Smalltalk expression evaluated by `gst -e`.
* Working directory is set via the tool's `workdir` parameter, not `cd`.
* For external POSIX programs, use Smalltalk's `FileDescriptor popen:`.

## Basic syntax

```smalltalk
'Hello, world!' displayNl
| x | x := 42. x printNl
10 + 20
```

## Variables and blocks

```smalltalk
| a b |
a := 10. b := 20.
(a + b) printNl
```

```smalltalk
(1 to: 10) collect: [:n | n squared]  "=> (1 4 9 16 25 36 49 64 81 100 )"
(1 to: 10) select: [:n | n odd]       "=> (1 3 5 7 9 )"
(1 to: 100) inject: 0 into: [:sum :n | sum + n]  "=> 5050"
```

## Control flow

```smalltalk
| x |
x := 42.
(x > 40) ifTrue: ['big' printNl] ifFalse: ['small' printNl]

| i sum |
i := 1. sum := 0.
[i <= 5] whileTrue: [sum := sum + i. i := i + 1].
sum printNl
```

## Objects

```smalltalk
| p |
p := Point x: 3 y: 4.
(p x) printNl
(p y) printNl
```

```smalltalk
| dict |
dict := Dictionary new.
dict at: #foo put: 'bar'.
dict at: #baz put: 42.
(dict at: #foo) printNl
```

Mutable strings:
```smalltalk
| s |
s := 'mutable' copy.
s at: 1 put: $M.
s printNl
```

## Time

```smalltalk
| time |
time := Time now.
(time hour) printNl
```

## Exception handling

```smalltalk
| result |
result := [1 / 0] on: ZeroDivisionError do: [:ex | 'division by zero' ].
result printNl
```

## External processes

Use Smalltalk to launch POSIX commands:

```smalltalk
| s |
s := FileDescriptor popen: 'ls' dir: 'r'.
s contents displayNl
```

```smalltalk
| s |
s := FileDescriptor popen: 'echo Hello from GST' dir: 'r'.
s contents displayNl
```

## Common mistakes

* Do not write `ls -la`. Use `FileDescriptor popen: 'ls -la' dir: 'r'` or inspect files via Smalltalk APIs.
* Strings are immutable by default. Use `copy` before `at:put:`.
* No `cd`. Set `workdir` in the shell tool input.
* No pipes/redirection. Use Smalltalk collections and blocks instead.

## When to use this skill

Use when the user has configured `opencode service set shell gst` and the shell tool description says `Commands run on ... using gst`. Prefer Smalltalk idioms and `FileDescriptor popen:` for external tools.
