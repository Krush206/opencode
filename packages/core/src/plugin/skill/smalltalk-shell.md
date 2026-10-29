# GNU Smalltalk Shell Skill

Use this skill when the OpenCode shell is GNU Smalltalk `gst`. The shell tool executes `gst -e '<Smalltalk expression>'`. Do NOT use POSIX bash syntax.

## Activation

When this skill is invoked, ensure the service shell is set to GNU Smalltalk the same way as `opencode service set shell`:

```bash
opencode service set shell "$(command -v gst)"
```

The service command will write the shell preference to the service config and, if the service is running, update the server config via `client.config.update({ shell: ... })`. After activation, confirm with:

```bash
opencode service get shell
```

Only proceed with Smalltalk commands once the shell is confirmed as `gst`.

## Core rules

* The shell is Smalltalk, not bash. No `ls`, `cd`, `grep`, `|`, `>`, `&&`, `$VAR`.
* Every shell command is a valid Smalltalk expression evaluated by `gst -e`.
* Working directory is set via the tool's `workdir` parameter, not `cd`.
* For external POSIX programs, use kernel `ShellUtility` classes.

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

Use kernel `ShellUtility` to launch POSIX commands:

```smalltalk
ShellUtility run: 'echo Hello from GST'
ShellUtility runLines: 'printf "a\nb\nc"'
ShellUtility runStatus: 'true'
```

Kernel utilities:

* `ShellUtility run: aCommand`, `runLines:`, `runStatus:` – wrapper around `Smalltalk system:`
* `ShellCommand` – builder for command strings with arguments, `asString`, `run`

## Common mistakes

* Do not write `ls -la`. Use `ShellUtility run: 'ls -la'` or inspect files via Smalltalk APIs.
* Strings are immutable by default. Use `copy` before `at:put:`.
* No `cd`. Set `workdir` in the shell tool input.
* No pipes/redirection. Use Smalltalk collections and blocks instead.

## When to use this skill

Use when the user has configured `opencode service set shell gst` and the shell tool description says `Commands run on ... using gst`. Prefer Smalltalk idioms and `ShellUtility` for external tools.

## Reference

Official GNU Smalltalk class index: https://www.gnu.org/software/smalltalk/manual-base/html_node/Class-index.html

### Frequently used classes

* **Collection / ArrayedCollection / OrderedCollection** – basic collections
* **Array** – fixed size indexed collection
* **Dictionary / IdentityDictionary** – key/value maps
* **Set / Bag** – unique / multiset collections
* **String / UnicodeString** – text, immutable by default
* **ByteArray / WordArray** – binary data
* **BlockClosure** – closures, `[:arg | ...]`
* **FileDescriptor** – `popen:` for external processes
* **FileStream / ReadStream / WriteStream / PositionableStream** – I/O
* **Point / Rectangle** – geometry
* **Time / Date / DateTime / Duration** – time
* **Process / ProcessorScheduler / Semaphore** – concurrency
* **Exception / Error / ZeroDivide** – error handling
* **Class / Behavior / Metaclass** – meta-object protocol
* **SystemDictionary / Namespace** – global namespace
* **Regex / RegexResults** – pattern matching
* **ShellUtility / ShellCommand** – shell command execution utilities, `ShellUtility run:`, `runLines:`, `runStatus:`, builder `ShellCommand`
* **LLMMessage / LLMChatHistory / LLMPromptBuilder / LLMTokenizer** – LLM helper classes added to kernel: message objects, chat history, prompt builder with `Character cr asString`, and simple tokenizer

Full alphabetical index is available in the manual. Common prefixes:

* `C*` – C interface classes
* `SystemExceptions.*` – error hierarchy
* `VFS.*` – virtual file system
* `Weak*` – weak collection variants

## Base Library Reference `gst-base.html`

The official base library reference at https://www.gnu.org/software/smalltalk/manual-base/gst-base.html documents the complete Smalltalk base class library distributed with GNU Smalltalk.

### Core object model

* **Object**, **UndefinedObject**, **Behavior**, **Class**, **Metaclass**, **ClassDescription**
* **Namespace**, **AbstractNamespace**, **SystemDictionary**, **RootNamespace**
* **Package**, **PackageLoader**, **Autoload**

### Collections

* **Collection**, **SequenceableCollection**, **ArrayedCollection**, **Array**, **OrderedCollection**, **LinkedList**, **Bag**, **Set**, **SortedCollection**, **Dictionary**, **IdentityDictionary**, **Weak*` variants
* **Interval**, **LargeArray**, **LargeArrayedCollection**, **ByteArray**, **WordArray**, **String**, **UnicodeString**, **Symbol**, **Character**, **CharacterArray**

### Streams & I/O

* **Stream**, **PositionableStream**, **ReadStream**, **WriteStream**, **ReadWriteStream**, **FileStream**, **FileDescriptor**, **File**, **FilePath**, **FileSegment**
* **VFS.*** – Virtual File System: `VFS.FileWrapper`, `VFS.ArchiveFile`, `VFS.ZipFile`, `VFS.ArchiveMember`, etc.

### Blocks & control

* **BlockClosure**, **BlockContext**, **CompiledBlock**, **CompiledCode**, **CompiledMethod**, **MethodDictionary**, **MethodContext**, **ContextPart**, **Continuation**
* **Generator**, **Promise**, **DeferredVariableBinding**

### Process & concurrency

* **Process**, **CallinProcess**, **ProcessorScheduler**, **Semaphore**, **RecursionLock**, **SharedQueue**, **Promise**

### Numbers & math

* **Number**, **Magnitude**, **Integer**, **SmallInteger**, **LargeInteger**, **LargePositiveInteger**, **LargeNegativeInteger**, **LargeZeroInteger**, **Float**, **FloatD**, **FloatE**, **FloatQ**, **Fraction**, **ScaledDecimal**, **Random**

### Time & dates

* **Time**, **Date**, **DateTime**, **Duration**

### Geometry

* **Point**, **Rectangle**

### Exceptions

* **Exception**, **Error**, **Notification**, **Warning**, **Halt**
* **ArithmeticError**, **ZeroDivide**, **MessageNotUnderstood**
* **SystemExceptions.*** – `ArgumentOutOfRange`, `IndexOutOfRange`, `InvalidArgument`, `FileError`, `ReadOnlyObject`, `SecurityError`, etc.

### Files & OS

* **FileDescriptor** – `popen: dir:` for external commands
* **Getopt**, **ProcessEnvironment**, **DLD**

### LLM utilities

* **LLMMessage** – role/content message object with `asString`
* **LLMChatHistory** – ordered collection of `LLMMessage`, `addUser:`, `addAssistant:`, `prompt`
* **LLMPromptBuilder** – builder with `system:`, `user:`, `addHistory:`, `build` using `Character cr asString`
* **LLMTokenizer** – simple whitespace tokenizer, `tokenize:`, `count:`

### Text & regex

* **TextCollector**, **UnicodeCharacter**, **UnicodeString**, **Regex**, **RegexResults**

### C interface

* **CObject**, **CArray**, **CPtr**, **CString**, **CStruct**, **CUnion**, **CType`, `CCallable`, `CFunctionDescriptor`, etc.

Use the Class index and Method index in the manual for selector lookup. When in doubt, prefer `ShellUtility` to launch POSIX tools from Smalltalk, and use collections + BlockClosure for data processing instead of shell pipelines.
