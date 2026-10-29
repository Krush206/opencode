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
* Do not guess class or selector names. The installed gst version and any custom kernel additions determine what exists, so check with the "Discovering classes and selectors" section below before using something unfamiliar, and after any `doesNotUnderstand` or "undeclared variable" error.
* Always print results explicitly (`printNl` / `displayNl`). Do not rely on `gst -e` echoing the last expression.
* `displayNl` shows strings without quotes; `printNl` shows the Smalltalk literal form. Use `displayNl` for human-readable output.
* Statements are separated by `.`; temporaries are declared with `| a b |`.
* Smalltalk strings use single quotes; embed one by doubling it (`'it''s'`). Use `Character cr` / `Character nl asString` for line breaks, since `\n` is not an escape.
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

If one of these selectors fails, look it up with the snippets in "Discovering classes and selectors" below:

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

## Discovering classes and selectors

gst is a live image, so the running system can answer "what exists?" directly. Use these snippets instead of relying on memory or the class lists in this file. Edit only the first assignment(s) of each snippet (marked `"<- edit"`).

Output can be large. Filter first, and cap long lists with `first: (n min: x size)`.

If quoting breaks because the tool wraps the code in a POSIX shell, save the snippet to a file in the working directory and run `FileStream fileIn: 'discover.st'`.

**1. Environment: version and custom additions**

```smalltalk
Smalltalk version displayNl.
#(#ShellUtility #ShellCommand #LLMMessage #LLMChatHistory #LLMPromptBuilder #LLMTokenizer) do: [:n |
    (n , ': ' , (Smalltalk includesKey: n) printString) displayNl].
```

**2. List classes, optionally filtered by a name fragment**

```smalltalk
| filter names |
filter := 'Stream'.    "<- edit; use '' for every class"
names := Set new.
Object withAllSubclasses do: [:c |
    (filter isEmpty or: [(c printString indexOfSubCollection: filter) > 0])
        ifTrue: [names add: c printString]].
names asSortedCollection do: [:n | n displayNl].
```

Classes in namespaces print with their prefix (for example `SystemExceptions.InvalidValue`) and can be referenced that way directly.

**3. Describe one class: comment, hierarchy, selectors**

```smalltalk
| cls sels |
cls := OrderedCollection.    "<- edit; namespaced classes work too, e.g. SystemExceptions.InvalidValue"
sels := [:c | c selectors isNil
    ifTrue: [#()]
    ifFalse: [c selectors asSortedCollection asArray]].
('Class: ' , cls printString) displayNl.
('Category: ' , cls category displayString) displayNl.
('Comment: ' , cls comment displayString) displayNl.
('Superclasses: ' , cls allSuperclasses printString) displayNl.
('Instance variables: ' , cls allInstVarNames printString) displayNl.
'--- instance-side selectors defined here ---' displayNl.
(sels value: cls) do: [:s | s displayNl].
'--- class-side selectors defined here ---' displayNl.
(sels value: cls class) do: [:s | s displayNl].
```

To include inherited selectors, replace `sels value: cls` with `cls allSelectors asSortedCollection`.

**4. Search selectors across all classes by name fragment**

```smalltalk
| frag hits |
frag := 'addFirst';    "<- edit"
hits := Set new.
Object withAllSubclasses do: [:c |
    c selectors isNil ifFalse: [
        c selectors do: [:s |
            (s indexOfSubCollection: frag) > 0
                ifTrue: [hits add: c printString , '>>' , s]]]].
hits asSortedCollection do: [:h | h displayNl].
```

**5. Quick checks and source lookup**

```smalltalk
(OrderedCollection canUnderstand: #addFirst:) printNl.          "does the class understand it?"
(3 respondsTo: #printString:) printNl.                          "does this object respond to it?"
(OrderedCollection whichClassIncludesSelector: #do:) printNl.   "which class in the chain defines it?"
(Object withAllSubclasses select: [:c | c includesSelector: #do:]) printNl.   "all implementors"
(OrderedCollection >> #addFirst:) methodSourceString displayNl. "read the source"
(OrderedCollection >> #addFirst:) methodCategory displayNl.
```

**Workflow:** (1) run snippet 1 once per session; (2) find the class with snippet 2; (3) list its selectors with snippet 3, or search by fragment with snippet 4; (4) confirm with `canUnderstand:` before calling, and read the source with `>>` when behavior is unclear. If a selector shown here is absent from the output, trust the output: the installed version differs.

## Common mistakes

* `ls -la` → `Smalltalk system: 'ls -la'` (or `ShellUtility run:`).
* `ZeroDivisionError` → `ZeroDivide`.
* Forgetting `printNl` / `displayNl` and seeing no output.
* Using `cd` instead of `workdir`.

## Reference

* Class index: https://www.gnu.org/software/smalltalk/manual-base/html_node/Class-index.html
* Base library: https://www.gnu.org/software/smalltalk/manual-base/gst-base.html

Useful classes: `Collection`, `OrderedCollection`, `Dictionary`, `Set`, `Bag`, `String`, `Symbol`, `Interval`, `ReadStream`, `WriteStream`, `FileStream`, `File`, `Directory`, `FileDescriptor`, `Date`, `Time`, `DateTime`, `Duration`, `Regex`, `Error`, `ZeroDivide`, `SystemExceptions.*`, `Process`, `Semaphore`.
