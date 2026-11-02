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

## Common mistakes

* `ls -la` → `Smalltalk system: 'ls -la'` (only when no Smalltalk equivalent)
* `cat file` → `(File name: 'file') contents`
* Reading directory → `(Directory working) children`
* `ZeroDivisionError` → `ZeroDivide`
* Forgetting `printNl` / `displayNl` and seeing no output.
* Using `cd` instead of `workdir`.
* Using `ShellUtility` when Smalltalk has a better API.

---
# GNU Smalltalk Library Reference

This document describes the class libraries that are distributed
together with the GNU Smalltalk programming language.

> Permission is granted to copy, distribute and/or modify this
> document under the terms of the GNU Free Documentation License,
> Version 1.2 or any later version published by the Free Software
> Foundation; with no Invariant Sections, with no Front-Cover Texts,
> and with no Back-Cover Texts.  A copy of the license is included in
> the section entitled "GNU Free Documentation License".

## 1 Base classes

### 1.1 AbstractNamespace

**Namespace:** Smalltalk · **Superclass:** [BindingDictionary](#110-bindingdictionary) · **Category:** Language-Implementation

I am a special form of dictionary.  Classes hold on an instance of
me; it is called their 'environment'.

#### 1.1.1 AbstractNamespace class: instance creation

**`new`**

Disabled - use #new to create instances

**`primNew: parent name: spaceName`**

Private - Create a new namespace with the given name and parent,
and add to the parent a key that references it.

#### 1.1.2 AbstractNamespace: accessing

**`allAssociations`**

Answer a Dictionary with all of the associations in the receiver
and each of its superspaces (duplicate keys are associated to the
associations that are deeper in the namespace hierarchy)

**`allBehaviorsDo: aBlock`**

Evaluate aBlock once for each class and metaclass in the namespace.

**`allClassObjectsDo: aBlock`**

Evaluate aBlock once for each class and metaclass in the namespace.

**`allClassesDo: aBlock`**

Evaluate aBlock once for each class in the namespace.

**`allMetaclassesDo: aBlock`**

Evaluate aBlock once for each metaclass in the namespace.

**`classAt: aKey`**

Answer the value corrisponding to aKey if it is a class.  Fail if
either aKey is not found or it is associated to something different
from a class.

**`classAt: aKey ifAbsent: aBlock`**

Answer the value corrisponding to aKey if it is a class.  Evaluate
aBlock and answer its result if either aKey is not found or it is
associated to something different from a class.

#### 1.1.3 AbstractNamespace: compiling

**`addSharedPool: aDictionary`**

Import the given bindings for classes compiled with me as
environment.

**`import: aDictionary`**

Import the given bindings for classes compiled with me as
environment.

**`removeSharedPool: aDictionary`**

Remove aDictionary from my list of direct pools.

**`sharedPoolDictionaries`**

Answer the shared pools (not names) imported for my classes.

#### 1.1.4 AbstractNamespace: copying

**`copyEmpty: newSize`**

Answer an empty copy of the receiver whose size is newSize

**`whileCurrentDo: aBlock`**

Evaluate aBlock with the current namespace set to the receiver.
Answer the result of the evaluation.

#### 1.1.5 AbstractNamespace: namespace hierarchy

**`addSubspace: aSymbol`**

Create a namespace named aSymbol, add it to the receiver's
subspaces, and answer it.

**`allSubassociationsDo: aBlock`**

Invokes aBlock once for every association in each of the receiver's
subspaces.

**`allSubspaces`**

Answer the direct and indirect subspaces of the receiver in a Set

**`allSubspacesDo: aBlock`**

Invokes aBlock for all subspaces, both direct and indirect.

**`allSuperspacesDo: aBlock`**

Evaluate aBlock once for each of the receiver's superspaces

**`includesClassNamed: aString`**

Answer whether the receiver or any of its superspaces include the
given class - note that this method (unlike #includesKey:) does not
require aString to be interned and (unlike #includesGlobalNamed:)
only returns true if the global is a class object.

**`includesGlobalNamed: aString`**

Answer whether the receiver or any of its superspaces include the
given key - note that this method (unlike #includesKey:) does not
require aString to be interned but (unlike #includesClassNamed:)
returns true even if the global is not a class object.

**`removeSubspace: aSymbol`**

Remove my subspace named aSymbol from the hierarchy.

**`selectSubspaces: aBlock`**

Return a Set of subspaces of the receiver satisfying aBlock.

**`selectSuperspaces: aBlock`**

Return a Set of superspaces of the receiver satisfying aBlock.

**`siblings`**

Answer all the other children of the same namespace as the
receiver.

**`siblingsDo: aBlock`**

Evaluate aBlock once for each of the other root namespaces, passing
the namespace as a parameter.

**`subspaces`**

Answer the receiver's direct subspaces

**`subspacesDo: aBlock`**

Invokes aBlock for all direct subspaces.

**`superspace`**

Answer the receiver's superspace.

**`superspace: aNamespace`**

Set the superspace of the receiver to be 'aNamespace'.  Also adds
the receiver as a subspace of it.

**`withAllSubspaces`**

Answer a Set containing the receiver together with its direct and
indirect subspaces

**`withAllSubspacesDo: aBlock`**

Invokes aBlock for the receiver and all subclasses, both direct and
indirect.

#### 1.1.6 AbstractNamespace: overrides for superspaces

**`inheritedKeys`**

Answer a Set of all the keys in the receiver and its superspaces

**`set: key to: newValue`**

Assign newValue to the variable named as specified by 'key'.  This
method won't define a new variable; instead if the key is not found
it will search in superspaces and raising an error if the variable
cannot be found in any of the superspaces.  Answer newValue.

**`set: key to: newValue ifAbsent: aBlock`**

Assign newValue to the variable named as specified by 'key'.  This
method won't define a new variable; instead if the key is not found
it will search in superspaces and evaluate aBlock if it is not
found.  Answer newValue.

**`values`**

Answer a Bag containing the values of the receiver

#### 1.1.7 AbstractNamespace: printing

**`name`**

Answer the receiver's name

**`name: aSymbol`**

Change the receiver's name to aSymbol

**`nameIn: aNamespace`**

Answer Smalltalk code compiling to the receiver when the current
namespace is aNamespace

**`printOn: aStream`**

Print a representation of the receiver

**`storeOn: aStream`**

Store Smalltalk code compiling to the receiver

#### 1.1.8 AbstractNamespace: testing

**`isNamespace`**

Answer 'true'.

**`isSmalltalk`**

Answer 'false'.

### 1.2 AlternativeObjectProxy

**Namespace:** Smalltalk · **Superclass:** [DumperProxy](#168-dumperproxy) · **Category:** Streams-Files

I am a proxy that uses the same ObjectDumper to store an object
which is not the object to be dumped, but from which the dumped
object can be reconstructed.  I am an abstract class, using me
would result in infinite loops because by default I try to store
the same object again and again.  See the method comments for more
information

#### 1.2.1 AlternativeObjectProxy class: instance creation

**`acceptUsageForClass: aClass`**

The receiver was asked to be used as a proxy for the class aClass.
Answer whether the registration is fine.  By default, answer true
except if AlternativeObjectProxy itself is being used.

**`on: anObject`**

Answer a proxy to be used to save anObject.  IMPORTANT: this method
MUST be overridden so that the overridden version sends #on: to
super passing an object that is NOT the same as anObject
(alternatively, you can override #dumpTo:, which is what NullProxy
does), because that would result in an infinite loop!  This also
means that AlternativeObjectProxy must never be used directly -
only as a superclass.

#### 1.2.2 AlternativeObjectProxy: accessing

**`object`**

Reconstruct the object stored in the proxy and answer it.  A
subclass will usually override this

**`object: theObject`**

Set the object to be dumped to theObject.  This should not be
overridden.

**`primObject`**

Reconstruct the object stored in the proxy and answer it.  This
method must not be overridden

### 1.3 ArithmeticError

**Namespace:** Smalltalk · **Superclass:** [Error](#171-error) · **Category:** Language-Exceptions

An ArithmeticError exception is raised by numeric classes when a
program tries to do something wrong, such as extracting the square
root of a negative number.

#### 1.3.1 ArithmeticError: description

**`description`**

Answer a textual description of the exception.

**`isResumable`**

Answer true.  Arithmetic exceptions are by default resumable.

### 1.4 Array

**Namespace:** Smalltalk · **Superclass:** [ArrayedCollection](#15-arrayedcollection) · **Category:** Collections-Sequenceable

My instances are objects that have array-like properties: they are
directly indexable by integers starting at 1, and they are fixed in
size.  I inherit object creation behavior messages such as #with:,
as well as iteration and general access behavior from
SequenceableCollection.

#### 1.4.1 Array class: instance creation

**`from: anArray`**

Answer anArray, which is expected to be an array specified with a
brace-syntax expression per my inherited protocol.

#### 1.4.2 Array: built ins

**`at: anIndex ifAbsent: aBlock`**

Answer the index-th indexed instance variable of the receiver

**`replaceFrom: start to: stop with: byteArray startingAt: replaceStart`**

Replace the characters from start to stop with new characters whose
ASCII codes are contained in byteArray, starting at the
replaceStart location of byteArray

#### 1.4.3 Array: mutating objects

**`multiBecome: anArray`**

Transform every object in the receiver in each corresponding object
in anArray.  anArray and the receiver must have the same size

#### 1.4.4 Array: printing

**`isLiteralObject`**

Answer whether the receiver is expressible as a Smalltalk literal.

**`printOn: aStream`**

Print a representation for the receiver on aStream

**`storeLiteralOn: aStream`**

Store a Smalltalk literal compiling to the receiver on aStream

**`storeOn: aStream`**

Store Smalltalk code compiling to the receiver on aStream

#### 1.4.5 Array: testing

**`isArray`**

Answer 'true'.

### 1.5 ArrayedCollection

**Namespace:** Smalltalk · **Superclass:** [SequenceableCollection](#1151-sequenceablecollection) · **Category:** Collections-Sequenceable

My instances are objects that are generally fixed size, and are
accessed by an integer index.  The ordering of my instance's
elements is determined externally; I will not rearrange the order
of the elements.

#### 1.5.1 ArrayedCollection class: instance creation

**`join: aCollection`**

Where aCollection is a collection of SequenceableCollections,
answer a new instance with all the elements therein, in order.

**`join: aCollection separatedBy: sepCollection`**

Where aCollection is a collection of SequenceableCollections,
answer a new instance with all the elements therein, in order, each
separated by an occurrence of sepCollection.

**`new: size withAll: anObject`**

Answer a collection with the given size, whose elements are all set
to anObject

**`streamContents: aBlock`**

Create a ReadWriteStream on an empty instance of the receiver; pass
the stream to aBlock, then retrieve its contents and answer them.

**`with: element1`**

Answer a collection whose only element is element1

**`with: element1 with: element2`**

Answer a collection whose only elements are the parameters in the
order they were passed

**`with: element1 with: element2 with: element3`**

Answer a collection whose only elements are the parameters in the
order they were passed

**`with: element1 with: element2 with: element3 with: element4`**

Answer a collection whose only elements are the parameters in the
order they were passed

**`with: element1 with: element2 with: element3 with: element4 with: element5`**

Answer a collection whose only elements are the parameters in the
order they were passed

**`withAll: aCollection`**

Answer a collection whose elements are the same as those in
aCollection

#### 1.5.2 ArrayedCollection: basic

**`, aSequenceableCollection`**

Answer a new instance of an ArrayedCollection containing all the
elements in the receiver, followed by all the elements in
aSequenceableCollection

**`add: value`**

This method should not be called for instances of this class.

**`atAll: keyCollection`**

Answer a collection of the same kind returned by #collect:, that
only includes the values at the given indices.  Fail if any of the
values in keyCollection is out of bounds for the receiver.

**`copyFrom: start to: stop`**

Answer a new collection containing all the items in the receiver
from the start-th and to the stop-th

**`copyWith: anElement`**

Answer a new instance of an ArrayedCollection containing all the
elements in the receiver, followed by the single item anElement

**`copyWithout: oldElement`**

Answer a copy of the receiver to which all occurrences of
oldElement are removed

#### 1.5.3 ArrayedCollection: built ins

**`size`**

Answer the size of the receiver

#### 1.5.4 ArrayedCollection: compiler

**`literalEquals: anObject`**

Not commented.

**`literalHash`**

Not commented.

#### 1.5.5 ArrayedCollection: copying Collections

**`copyReplaceAll: oldSubCollection with: newSubCollection`**

Answer a new collection in which all the sequences matching
oldSubCollection are replaced with newSubCollection

**`copyReplaceFrom: start to: stop with: replacementCollection`**

Answer a new collection of the same class as the receiver that
contains the same elements as the receiver, in the same order,
except for elements from index 'start' to index 'stop'.

If start \< stop, these are replaced by the contents of the
replacementCollection.  Instead, If start = (stop + 1), like in
'copyReplaceFrom: 4 to: 3 with: anArray', then every element of the
receiver will be present in the answered copy; the operation will
be an append if stop is equal to the size of the receiver or, if it
is not, an insert before index 'start'.

**`copyReplaceFrom: start to: stop withObject: anObject`**

Answer a new collection of the same class as the receiver that
contains the same elements as the receiver, in the same order,
except for elements from index 'start' to index 'stop'.

If start \< stop, these are replaced by stop-start+1 copies of
anObject.  Instead, If start = (stop + 1), then every element of
the receiver will be present in the answered copy; the operation
will be an append if stop is equal to the size of the receiver or,
if it is not, an insert before index 'start'.

**`reverse`**

Answer the receivers' contents in reverse order

#### 1.5.6 ArrayedCollection: enumerating the elements of a collection

**`collect: aBlock`**

Answer a new instance of an ArrayedCollection containing all the
results of evaluating aBlock passing each of the receiver's
elements

**`reject: aBlock`**

Answer a new instance of an ArrayedCollection containing all the
elements in the receiver which, when passed to aBlock, answer false

**`select: aBlock`**

Answer a new instance of an ArrayedCollection containing all the
elements in the receiver which, when passed to aBlock, answer true

**`with: aSequenceableCollection collect: aBlock`**

Evaluate aBlock for each pair of elements took respectively from
the receiver and from aSequenceableCollection; answer a collection
of the same kind of the receiver, made with the block's return
values.  Fail if the receiver has not the same size as
aSequenceableCollection.

#### 1.5.7 ArrayedCollection: sorting

**`sorted`**

Return a copy of the receiver sorted according to the default sort
block, which uses #\<= to compare items.

**`sorted: sortBlock`**

Return a copy of the receiver sorted according to the given sort
block, which accepts pair of items and returns true if the first
item is less than the second one.

#### 1.5.8 ArrayedCollection: storing

**`storeOn: aStream`**

Store Smalltalk code compiling to the receiver on aStream

#### 1.5.9 ArrayedCollection: streams

**`writeStream`**

Answer a WriteStream streaming on the receiver

### 1.6 Association

**Namespace:** Smalltalk · **Superclass:** [LookupKey](#1105-lookupkey) · **Category:** Language-Data types

My instances represent a mapping between two objects.  Typically,
my "key" object is a symbol, but I don't require this.  My "value"
object has no conventions associated with it; it can be any object
at all.

#### 1.6.1 Association class: basic

**`key: aKey value: aValue`**

Answer a new association with the given key and value

#### 1.6.2 Association: accessing

**`environment`**

Answer nil.  This is present to achieve polymorphism with instances
of VariableBinding.

**`environment: aNamespace`**

Do nothing.  This is present to achieve polymorphism with instances
of VariableBinding.

**`key: aKey value: aValue`**

Set the association's key to aKey, and its value to aValue

**`value`**

Answer the association's value

**`value: aValue`**

Set the association's value to aValue

#### 1.6.3 Association: finalization

**`mourn`**

Finalize the receiver

#### 1.6.4 Association: printing

**`printOn: aStream`**

Put on aStream a representation of the receiver

#### 1.6.5 Association: storing

**`storeOn: aStream`**

Put on aStream some Smalltalk code compiling to the receiver

#### 1.6.6 Association: testing

**`= anAssociation`**

Answer whether the association's key and value are the same as
anAssociation's, or false if anAssociation is not an Association.
As a special case, identical values are considered equal even if #=
returns false (as is the case for NaN floating-point values).

**`hash`**

Answer an hash value for the receiver

### 1.7 Autoload

**Namespace:** Smalltalk · **Superclass:** none · **Category:** Examples-Useful tools

I am not a part of the normal Smalltalk kernel class system.  I
provide the ability to do late ("on-demand") loading of class
definitions.  Through me, you can define any class to be loaded
when any message is sent to the class itself (such as to create an
instance) or to its metaclass (such as #methodsFor: to extend it
with class-side methods).

#### 1.7.1 Autoload class: instance creation

**`class: nameSymbol from: fileNameString`**

Make Smalltalk automatically load the class named nameSymbol from
fileNameString when needed

**`class: nameSymbol in: aNamespace from: fileNameString`**

Make Smalltalk automatically load the class named nameSymbol and
residing in aNamespace from fileNameString when needed

**`class: nameSymbol in: aNamespace loader: anObject`**

Make Smalltalk automatically load the class named nameSymbol and
residing in aNamespace.  When the class is needed, anObject will be
sent #autoload.  By default, instances of FilePath and Package can
be used.

**`class: nameSymbol loader: anObject`**

Make Smalltalk automatically load the class named nameSymbol.  When
the class is needed, anObject will be sent #autoload.  By default,
instances of FilePath and Package can be used.

#### 1.7.2 Autoload: accessing

**`class`**

We need it to access the metaclass instance, because that's what
will load the file.

**`doesNotUnderstand: aMessage`**

Load the class and resend the message to it

### 1.8 Bag

**Namespace:** Smalltalk · **Superclass:** [Collection](#137-collection) · **Category:** Collections-Unordered

My instances are unordered collections of objects.  You can think
of me as a set with a memory; that is, if the same object is added
to me twice, then I will report that that element has been stored
twice.

#### 1.8.1 Bag class: basic

**`new`**

Answer a new instance of the receiver

**`new: size`**

Answer a new instance of the receiver, with space for size distinct
objects

#### 1.8.2 Bag: adding

**`add: newObject`**

Add an occurrence of newObject to the receiver.  Answer newObject.
Fail if newObject is nil.

**`add: newObject withOccurrences: anInteger`**

If anInteger \> 0, add anInteger occurrences of newObject to the
receiver.  If anInteger \< 0, remove them.  Answer newObject.  Fail
if newObject is nil.

#### 1.8.3 Bag: enumerating the elements of a collection

**`asSet`**

Answer a set with the elements of the receiver

**`do: aBlock`**

Evaluate the block for all members in the collection.

#### 1.8.4 Bag: extracting items

**`sortedByCount`**

Answer a collection of counts with elements, sorted by decreasing
count.

#### 1.8.5 Bag: printing

**`printOn: aStream`**

Put on aStream a representation of the receiver

#### 1.8.6 Bag: removing

**`remove: oldObject ifAbsent: anExceptionBlock`**

Remove oldObject from the collection and return it.  If can't be
found, answer instead the result of evaluationg anExceptionBlock

#### 1.8.7 Bag: storing

**`storeOn: aStream`**

Put on aStream some Smalltalk code compiling to the receiver

#### 1.8.8 Bag: testing collections

**`= aBag`**

Answer whether the receiver and aBag contain the same objects

**`hash`**

Answer an hash value for the receiver

**`includes: anObject`**

Answer whether we include anObject

**`occurrencesOf: anObject`**

Answer the number of occurrences of anObject found in the receiver

**`size`**

Answer the total number of objects found in the receiver

### 1.9 Behavior

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Implementation

I am the parent class of all "class" type methods.  My instances
know about the subclass/superclass relationships between classes,
contain the description that instances are created from, and hold
the method dictionary that's associated with each class.  I provide
methods for compiling methods, modifying the class inheritance
hierarchy, examining the method dictionary, and iterating over the
class hierarchy.

#### 1.9.1 Behavior: accessing class hierarchy

**`allSubclasses`**

Answer the direct and indirect subclasses of the receiver in a Set

**`allSuperclasses`**

Answer all the receiver's superclasses in a collection

**`subclasses`**

Answer the direct subclasses of the receiver in a Set

**`superclass`**

Answer the receiver's superclass (if any, otherwise answer nil)

**`withAllSubclasses`**

Answer a Set containing the receiver together with its direct and
indirect subclasses

**`withAllSuperclasses`**

Answer the receiver and all of its superclasses in a collection

#### 1.9.2 Behavior: accessing instances and variables

**`allClassVarNames`**

Return all the class variables understood by the receiver

**`allInstVarNames`**

Answer the names of every instance variables the receiver contained
in the receiver's instances

**`allInstances`**

Returns a set of all instances of the receiver

**`allSharedPoolDictionaries`**

Return the shared pools defined by the class and any of its
superclasses, in the correct search order.

**`allSharedPools`**

Return the names of the shared pools defined by the class and any
of its superclasses, in the correct search order.

**`classPool`**

Answer the class pool dictionary.  Since Behavior does not support
classes with class variables, we answer an empty one; adding
variables to it results in an error.

**`classVarNames`**

Answer all the class variables for instances of the receiver

**`indexOfInstVar: aString`**

Answer the index of aString in the fixed instance variables of the
instances of the receiver, or 0 if the variable is missing.

**`indexOfInstVar: aString ifAbsent: aBlock`**

Answer the index of aString in the fixed instance variables of the
instances of the receiver, or 0 if the variable is missing.

**`instVarNames`**

Answer an Array containing the instance variables defined by the
receiver

**`instanceCount`**

Return a count of all the instances of the receiver

**`sharedPools`**

Return the names of the shared pools defined by the class

**`subclassInstVarNames`**

Answer the names of the instance variables the receiver inherited
from its superclass

#### 1.9.3 Behavior: accessing the method dictionary

**`>> selector`**

Return the compiled method associated with selector, from the local
method dictionary.  Error if not found.

**`allSelectors`**

Answer a Set of all the selectors understood by the receiver

**`compiledMethodAt: selector`**

Return the compiled method associated with selector, from the local
method dictionary.  Error if not found.

**`compiledMethodAt: selector ifAbsent: aBlock`**

Return the compiled method associated with selector, from the local
method dictionary.  Evaluate aBlock if not found.

**`formattedSourceStringAt: selector`**

Answer the method source code as a formatted string (if available)
for the given selector.  Requires package Parser.

**`lookupAllSelectors: aSelector`**

Answer a Set of all the compiled method associated with selector.
from the local method dictionary and all of the superclasses.

**`lookupSelector: aSelector`**

Return the compiled method associated with selector, from the local
method dictionary or one of a superclass; return nil if not found.

**`parseTreeFor: selector`**

Answer the parse tree for the given selector, or nil if there was
an error.  Requires the Parser package to be loaded.

**`selectorAt: method`**

Return selector for the given CompiledMethod

**`selectors`**

Answer a Set of the receiver's selectors

**`sourceCodeAt: selector`**

Answer source code (if available) for the given selector.

**`sourceCodeAt: selector ifAbsent: aBlock`**

Answer source code (if available) for the given selector.

**`sourceMethodAt: selector`**

This is too dependent on the original implementation

#### 1.9.4 Behavior: built ins

**`basicNewInFixedSpace`**

Create a new instance of a class with no indexed instance
variables.  The instance is guaranteed not to move across garbage
collections.  Like #basicNew, this method should not be overridden.

**`basicNewInFixedSpace: numInstanceVariables`**

Create a new instance of a class with indexed instance variables.
The instance has numInstanceVariables indexed instance variables.
The instance is guaranteed not to move across garbage collections.
Like #basicNew:, this method should not be overridden.

**`flushCache`**

Invalidate the method cache kept by the virtual machine.  This
message should not need to be called by user programs.

**`methodsFor: category ifTrue: condition`**

Compile the following code inside the receiver, with the given
category, if condition is true; else ignore it

**`primCompile: code`**

Compile the code, a string or readable stream, with no category.
Fail if the code does not obey Smalltalk syntax.  Answer the
generated CompiledMethod if it does.

Do not send this in user code; use #compile: or related methods
instead.

**`primCompile: code ifError: aBlock`**

As with #primCompile:, but evaluate aBlock (passing the file name,
line number and description of the error) if the code does not obey
Smalltalk syntax.

Do not send this in user code; use #compile:ifError: or related
methods instead.

**`someInstance`**

Private - Answer the first instance of the receiver in the object
table

#### 1.9.5 Behavior: builtin

**`basicNew`**

Create a new instance of a class with no indexed instance
variables; this method must not be overridden.

**`basicNew: numInstanceVariables`**

Create a new instance of a class with indexed instance variables.
The instance has numInstanceVariables indexed instance variables;
this method must not be overridden.

**`new`**

Create a new instance of a class with no indexed instance variables

**`new: numInstanceVariables`**

Create a new instance of a class with indexed instance variables.
The instance has numInstanceVariables indexed instance variables.

#### 1.9.6 Behavior: compilation

**`scopeDictionary`**

Answer the dictionary that is used when the receiver is before a
period in Smalltalk source code.

#### 1.9.7 Behavior: compilation (alternative)

**`methods`**

Don't use this, it's only present to file in from Smalltalk/V

**`methodsFor`**

Don't use this, it's only present to file in from Dolphin Smalltalk

**`methodsFor: category ifFeatures: features`**

Start compiling methods in the receiver if this implementation of
Smalltalk has the given features, else skip the section

**`methodsFor: category stamp: notUsed`**

Don't use this, it's only present to file in from Squeak

**`privateMethods`**

Don't use this, it's only present to file in from IBM Smalltalk

**`publicMethods`**

Don't use this, it's only present to file in from IBM Smalltalk

#### 1.9.8 Behavior: compiling

**`compilerClass`**

Return the class that will be used to compile the parse nodes into
bytecodes.

#### 1.9.9 Behavior: compiling methods

**`methodsFor: aCategoryString`**

Calling this method prepares the parser to receive methods to be
compiled and installed in the receiver's method dictionary.  The
methods are put in the category identified by the parameter.

**`poolResolution`**

Answer a PoolResolution class to be used for resolving pool
variables while compiling methods on this class.

#### 1.9.10 Behavior: creating a class hierarchy

**`addSubclass: aClass`**

Add aClass asone of the receiver's subclasses.

**`removeSubclass: aClass`**

Remove aClass from the list of the receiver's subclasses

**`superclass: aClass`**

Set the receiver's superclass.

#### 1.9.11 Behavior: enumerating

**`allInstancesDo: aBlock`**

Invokes aBlock for all instances of the receiver

**`allSubclassesDo: aBlock`**

Invokes aBlock for all subclasses, both direct and indirect.

**`allSubinstancesDo: aBlock`**

Invokes aBlock for all instances of each of the receiver's
subclasses.

**`allSuperclassesDo: aBlock`**

Invokes aBlock for all superclasses, both direct and indirect.

**`selectSubclasses: aBlock`**

Return a Set of subclasses of the receiver satisfying aBlock.

**`selectSuperclasses: aBlock`**

Return a Set of superclasses of the receiver satisfying aBlock.

**`subclassesDo: aBlock`**

Invokes aBlock for all direct subclasses.

**`withAllSubclassesDo: aBlock`**

Invokes aBlock for the receiver and all subclasses, both direct and
indirect.

**`withAllSuperclassesDo: aBlock`**

Invokes aBlock for the receiver and all superclasses, both direct
and indirect.

#### 1.9.12 Behavior: evaluating

**`evalString: aString to: anObject`**

Answer the stack top at the end of the evaluation of the code in
aString.  The code is executed as part of anObject

**`evalString: aString to: anObject ifError: aBlock`**

Answer the stack top at the end of the evaluation of the code in
aString.  If aString cannot be parsed, evaluate aBlock (see
compile:ifError:).  The code is executed as part of anObject

**`evaluate: code`**

Evaluate Smalltalk expression in 'code' and return result.

**`evaluate: code ifError: block`**

Evaluate 'code'.  If a parsing error is detected, invoke 'block'

**`evaluate: code notifying: requestor`**

Evaluate Smalltalk expression in 'code'.  If a parsing error is
encountered, send #error: to requestor

**`evaluate: code to: anObject`**

Evaluate Smalltalk expression as part of anObject's method
definition

**`evaluate: code to: anObject ifError: block`**

Evaluate Smalltalk expression as part of anObject's method
definition.  This method is used to support Inspector expression
evaluation.  If a parsing error is encountered, invoke error block,
'block'

#### 1.9.13 Behavior: instance creation

**`newInFixedSpace`**

Create a new instance of a class without indexed instance
variables.  The instance is guaranteed not to move across garbage
collections.  If a subclass overrides #new, the changes will apply
to this method too.

**`newInFixedSpace: numInstanceVariables`**

Create a new instance of a class with indexed instance variables.
The instance has numInstanceVariables indexed instance variables.
The instance is guaranteed not to move across garbage collections.
If a subclass overrides #new:, the changes will apply to this
method too.

#### 1.9.14 Behavior: instance variables

**`addInstVarName: aString`**

Add the given instance variable to instance of the receiver

**`instanceVariableNames: instVarNames`**

Set the instance variables for the receiver to be those in
instVarNames

**`removeInstVarName: aString`**

Remove the given instance variable from the receiver and recompile
all of the receiver's subclasses

#### 1.9.15 Behavior: method dictionary

**`addSelector: selector withMethod: compiledMethod`**

Add the given compiledMethod to the method dictionary, giving it
the passed selector.  Answer compiledMethod

**`compile: code`**

Compile method source.  If there are parsing errors, answer nil.
Else, return a CompiledMethod result of compilation

**`compile: code ifError: block`**

Compile method source.  If there are parsing errors, invoke
exception block, 'block' passing file name, line number and error.
Return a CompiledMethod result of compilation

**`compile: code notifying: requestor`**

Compile method source.  If there are parsing errors, send #error:
to the requestor object, else return a CompiledMethod result of
compilation

**`compileAll`**

Recompile all selectors in the receiver.  Ignore errors.

**`compileAll: aNotifier`**

Recompile all selectors in the receiver.  Notify aNotifier by
sending #error: messages if something goes wrong.

**`compileAllSubclasses`**

Recompile all selector of all subclasses.  Notify aNotifier by
sending #error: messages if something goes wrong.

**`compileAllSubclasses: aNotifier`**

Recompile all selector of all subclasses.  Notify aNotifier by
sending #error: messages if something goes wrong.

**`createGetMethod: what`**

Create a method accessing the variable 'what'.

**`createGetMethod: what default: value`**

Create a method accessing the variable 'what', with a default value
of 'value', using lazy initialization

**`createSetMethod: what`**

Create a method which sets the variable 'what'.

**`decompile: selector`**

Decompile the bytecodes for the given selector.

**`defineAsyncCFunc: cFuncNameString withSelectorArgs: selectorAndArgs args: argsArray`**

Please lookup the part on the C interface in the manual.  This
method is deprecated, you should use the asyncCCall:args:
attribute.

**`defineCFunc: cFuncNameString withSelectorArgs: selectorAndArgs returning: returnTypeSymbol args: argsArray`**

Please lookup the part on the C interface in the manual.  This
method is deprecated, you should use the cCall:returning:args:
attribute.

**`edit: selector`**

Open Emacs to edit the method with the passed selector, then
compile it

**`methodDictionary`**

Answer the receiver's method dictionary.  Don't modify the method
dictionary unless you exactly know what you're doing

**`methodDictionary: aDictionary`**

Set the receiver's method dictionary to aDictionary

**`recompile: selector`**

Recompile the given selector, answer nil if something goes wrong or
the new CompiledMethod if everything's ok.

**`recompile: selector notifying: aNotifier`**

Recompile the given selector.  If there are parsing errors, send
\#error: to the aNotifier object, else return a CompiledMethod
result of compilation

**`removeSelector: selector`**

Remove the given selector from the method dictionary, answer the
CompiledMethod attached to that selector

**`removeSelector: selector ifAbsent: aBlock`**

Remove the given selector from the method dictionary, answer the
CompiledMethod attached to that selector.  If the selector cannot
be found, answer the result of evaluating aBlock.

**`selectorsAndMethodsDo: aBlock`**

Evaluate aBlock, passing for each evaluation a selector that's
defined in the receiver and the corresponding method.

#### 1.9.16 Behavior: parsing class declarations

**`parseInstanceVariableString: variableString`**

As with #parseVariableString:, but answer symbols that name the
variables instead of strings.

**`parseVariableString: aString`**

Answer an array of instance variable names.  aString should specify
these in traditional file-in 'instanceVariableNames' format.
Signal an error if aString contains something other than valid
Smalltalk variables.

#### 1.9.17 Behavior: pluggable behavior (not yet implemented)

**`debuggerClass`**

Answer which class is to be used to debug a chain of contexts which
includes the receiver.  nil means 'do not debug'; other classes are
sent #debuggingPriority and the one with the highest priority is
picked.

**`decompilerClass`**

Answer the class that can be used to decompile methods, or nil if
there is none (as is the case now).

**`evaluatorClass`**

Answer the class that can be used to evaluate doits, or nil if
there is none (as is the case now).

**`parserClass`**

Answer the class that can be used to parse methods, or nil if there
is none (as is the case now).

#### 1.9.18 Behavior: printing hierarchy

**`hierarchyIndent`**

Answer the indent to be used by #printHierarchy - 4 by default

**`printFullHierarchy`**

Print my full hierarchy (i.e.  all my superclasses and subclasses)
on the terminal.

**`printHierarchy`**

Print my entire subclass hierarchy on the terminal.

#### 1.9.19 Behavior: source code

**`formattedSourceStringAt: aSelector ifAbsent: aBlock`**

Answer the method source code as a formatted string.  Requires
package Parser.

#### 1.9.20 Behavior: still unclassified

**`allSharedPoolDictionariesDo: aBlock`**

Answer the shared pools visible from methods in the metaclass, in
the correct search order.

**`parseNodeAt: selector`**

Available only when the Parser package is loaded-Answer an
RBMethodNode that compiles to my method named by selector.

**`updateInstanceVars: variableArray shape: shape`**

Update instance variables and instance spec of the class and all
its subclasses.  variableArray lists the new variables, including
inherited ones.

#### 1.9.21 Behavior: support for lightweight classes

**`article`**

Answer an article ('a' or 'an') which is ok for the receiver's name

**`asClass`**

Answer the first superclass that is a full-fledged Class object

**`environment`**

Answer the namespace that this class belongs to - the same as the
superclass, since Behavior does not support namespaces yet.

**`name`**

Answer the class name; this prints to the name of the superclass
enclosed in braces.  This class name is used, for example, to print
the receiver.

**`nameIn: aNamespace`**

Answer the class name when the class is referenced from aNamespace
\- a dummy one, since Behavior does not support names.

**`printOn: aStream in: aNamespace`**

Answer the class name when the class is referenced from aNamespace
\- a dummy one, since Behavior does not support names.

**`securityPolicy`**

Not commented.

**`securityPolicy: aSecurityPolicy`**

This method should not be called for instances of this class.

#### 1.9.22 Behavior: testing functionality

**`isBehavior`**

Answer 'true'.

#### 1.9.23 Behavior: testing the class hierarchy

**`includesBehavior: aClass`**

Returns true if aClass is the receiver or a superclass of the
receiver.

**`inheritsFrom: aClass`**

Returns true if aClass is a superclass of the receiver

**`kindOfSubclass`**

Return a string indicating the type of class the receiver is

**`shape`**

Answer the symbolic shape of my instances.

**`shape: shape`**

Give the provided shape to the receiver's instances.  The shape can
be nil, or one of #byte #int8 #character #short #word #ushort #int
\#uint #int64 #uint64 #utf32 #float #double or #pointer.  In
addition, the special value #inherit means to use the shape of the
superclass; note however that this is a static setting, and
subclasses that used #inherit are not mutated when the superclass
adopts a different shape.

#### 1.9.24 Behavior: testing the form of the instances

**`instSize`**

Answer how many fixed instance variables are reserved to each of
the receiver's instances

**`isBits`**

Answer whether my instances' variables are immediate, non-OOP
values.

**`isFixed`**

Answer whether the receiver's instances have no indexed instance
variables

**`isIdentity`**

Answer whether x = y implies x == y for instances of the receiver

**`isImmediate`**

Answer whether, if x is an instance of the receiver, x copy == x

**`isPointers`**

Answer whether the instance variables of the receiver's instances
are objects

**`isVariable`**

Answer whether the receiver's instances have indexed instance
variables

#### 1.9.25 Behavior: testing the method dictionary

**`canUnderstand: selector`**

Returns true if the instances of the receiver understand the given
selector

**`hasMethods`**

Return whether the receiver has any methods defined

**`includesSelector: selector`**

Returns true if the local method dictionary contains the given
selector

**`scopeHas: name ifTrue: aBlock`**

If methods understood by the receiver's instances have access to a
symbol named 'name', evaluate aBlock

**`whichClassIncludesSelector: selector`**

Answer which class in the receiver's hierarchy contains the
implementation of selector used by instances of the class (nil if
none does)

**`whichSelectorsAccess: instVarName`**

Answer a Set of selectors which access the given instance variable

**`whichSelectorsAssign: instVarName`**

Answer a Set of selectors which read the given instance variable

**`whichSelectorsRead: instVarName`**

Answer a Set of selectors which read the given instance variable

**`whichSelectorsReferTo: anObject`**

Returns a Set of selectors that refer to anObject

**`whichSelectorsReferToByteCode: aByteCode`**

Return the collection of selectors in the class which reference the
byte code, aByteCode

### 1.10 BindingDictionary

**Namespace:** Smalltalk · **Superclass:** [Dictionary](#164-dictionary) · **Category:** Language-Implementation

I am a special form of dictionary that provides special ways to
access my keys, which typically begin with an uppercase letter;
also, my associations are actually VariableBinding instances.

My keys are (expected to be) symbols, so I use == to match searched
keys to those in the dictionary - this is done expecting that it
brings a bit more speed.

#### 1.10.1 BindingDictionary: accessing

**`define: aSymbol`**

Define aSymbol as equal to nil inside the receiver.  Fail if such a
variable already exists (use #at:put: if you don't want to fail)

**`doesNotUnderstand: aMessage`**

Try to map unary selectors to read accesses to the Namespace, and
one-argument keyword selectors to write accesses.  Note that: a)
this works only if the selector has an uppercase first letter; and
b) 'aNamespace Variable: value' is the same as 'aNamespace set:
\#Variable to: value', not the same as 'aNamespace at: #Variable
put: value' -- the latter always refers to the current namespace,
while the former won't define a new variable, instead searching in
superspaces (and raising an error if the variable cannot be found).

**`environment`**

Answer the environment to which the receiver is connected.  This
can be the class for a dictionary that holds class variables, or
the super-namespace.  In general it is used to compute the
receiver's name.

**`environment: anObject`**

Set the environment to which the receiver is connected.  This can
be the class for a dictionary that holds class variables, or the
super-namespace.  In general it is used to compute the receiver's
name.

**`import: aSymbol from: aNamespace`**

Add to the receiver the symbol aSymbol, associated to the same
value as in aNamespace.  Fail if aNamespace does not contain the
given key.

**`name`**

Answer the receiver's name, which by default is the same as the
name of the receiver's environment.

**`nameIn: aNamespace`**

Answer the receiver's name when referred to from aNamespace; by
default the computation is deferred to the receiver's environment.

#### 1.10.2 BindingDictionary: basic & copying

**`= arg`**

Answer whether the receiver is equal to arg.  The equality test is
by default the same as that for equal objects.  = must not fail;
answer false if the receiver cannot be compared to arg

**`hash`**

Answer an hash value for the receiver.  This is the same as the
object's #identityHash.

#### 1.10.3 BindingDictionary: copying

**`copy`**

Answer the receiver.

**`copyEmpty: newSize`**

Answer an empty copy of the receiver whose size is newSize

**`copyEmptyForCollect`**

Answer an empty copy of the receiver which is filled in to compute
the result of #collect:

**`copyEmptyForCollect: size`**

Answer an empty copy of the receiver which is filled in to compute
the result of #collect:

**`deepCopy`**

Answer the receiver.

**`shallowCopy`**

Answer the receiver.

#### 1.10.4 BindingDictionary: forward declarations

**`at: key put: value`**

Store value as associated to the given key.  If any, recycle
Associations temporarily stored by the compiler inside the
'Undeclared' dictionary.

#### 1.10.5 BindingDictionary: printing

**`printOn: aStream in: aNamespace`**

Print the receiver's name when referred to from aNamespace; by
default the computation is deferred to the receiver's environment.

#### 1.10.6 BindingDictionary: testing

**`species`**

Answer 'IdentityDictionary'.

### 1.11 BlockClosure

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Implementation

I am a factotum class.  My instances represent Smalltalk blocks,
portions of executeable code that have access to the environment
that they were declared in, take parameters, and can be passed
around as objects to be executed by methods outside the current
class.  Block closures are sent a message to compute their value
and create a new execution context; this property can be used in
the construction of control flow methods.  They also provide some
methods that are used in the creation of Processes from blocks.

#### 1.11.1 BlockClosure class: instance creation

**`block: aCompiledBlock`**

Answer a BlockClosure that activates the passed CompiledBlock.

**`block: aCompiledBlock receiver: anObject`**

Answer a BlockClosure that activates the passed CompiledBlock with
the given receiver.

**`block: aCompiledBlock receiver: anObject outerContext: aContext`**

Answer a BlockClosure that activates the passed CompiledBlock with
the given receiver.

**`numArgs: args numTemps: temps bytecodes: bytecodes depth: depth literals: literalArray`**

Answer a BlockClosure for a new CompiledBlock that is created using
the passed parameters.  To make it work, you must put the
BlockClosure into a CompiledMethod's literals.

#### 1.11.2 BlockClosure class: testing

**`isImmediate`**

Answer whether, if x is an instance of the receiver, x copy == x

#### 1.11.3 BlockClosure: accessing

**`argumentCount`**

Answer the number of arguments passed to the receiver

**`block`**

Answer the CompiledBlock which contains the receiver's bytecodes

**`block: aCompiledBlock`**

Set the CompiledBlock which contains the receiver's bytecodes

**`finalIP`**

Answer the last instruction that can be executed by the receiver

**`fixTemps`**

This should fix the values of the temporary variables used in the
block that are ordinarily shared with the method in which the block
is defined.  Not defined yet, but it is not harmful that it isn't.
Answer the receiver.

**`initialIP`**

Answer the initial instruction pointer into the receiver.

**`method`**

Answer the CompiledMethod in which the receiver lies

**`numArgs`**

Answer the number of arguments passed to the receiver

**`numTemps`**

Answer the number of temporary variables used by the receiver

**`outerContext`**

Answer the method/block context which is the immediate outer of the
receiver

**`outerContext: containingContext`**

Set the method/block context which is the immediate outer of the
receiver

**`receiver`**

Answer the object that is used as 'self' when executing the
receiver (if nil, it might mean that the receiver is not valid
though...)

**`receiver: anObject`**

Set the object that is used as 'self' when executing the receiver

**`stackDepth`**

Answer the number of stack slots needed for the receiver

#### 1.11.4 BlockClosure: built ins

**`cull: arg1`**

Evaluate the receiver, passing arg1 as the only parameter if the
receiver has parameters.

**`cull: arg1 cull: arg2`**

Evaluate the receiver, passing arg1 and arg2 as parameters if the
receiver accepts them.

**`cull: arg1 cull: arg2 cull: arg3`**

Evaluate the receiver, passing arg1, arg2 and arg3 as parameters if
the receiver accepts them.

**`value`**

Evaluate the receiver passing no parameters

**`value: arg1`**

Evaluate the receiver passing arg1 as the only parameter

**`value: arg1 value: arg2`**

Evaluate the receiver passing arg1 and arg2 as the parameters

**`value: arg1 value: arg2 value: arg3`**

Evaluate the receiver passing arg1, arg2 and arg3 as the parameters

**`valueWithArguments: argumentsArray`**

Evaluate the receiver passing argArray's elements as the parameters

#### 1.11.5 BlockClosure: control structures

**`repeat`**

Evaluate the receiver 'forever' (actually until a return is
executed or the process is terminated).

**`whileFalse`**

Evaluate the receiver until it returns true

**`whileFalse: aBlock`**

Evaluate the receiver.  If it returns false, evaluate aBlock and
restart

**`whileTrue`**

Evaluate the receiver until it returns false

**`whileTrue: aBlock`**

Evaluate the receiver.  If it returns true, evaluate aBlock and
restart

#### 1.11.6 BlockClosure: exception handling

**`ifError: aBlock`**

Evaluate the receiver; when #error: is called, pass to aBlock the
receiver and the parameter, and answer the result of evaluating
aBlock.  If another exception is raised, it is passed to an outer
handler; if no exception is raised, the result of evaluating the
receiver is returned.

**`on: anException do: aBlock`**

Evaluate the receiver; when anException is signaled, evaluate
aBlock passing a Signal describing the exception.  Answer either
the result of evaluating the receiver or the parameter of a
Signal\>\>#return:

**`on: e1 do: b1 on: e2 do: b2`**

Evaluate the receiver; when e1 or e2 are signaled, evaluate
respectively b1 or b2, passing a Signal describing the exception.
Answer either the result of evaluating the receiver or the argument
of a Signal\>\>#return:

**`on: e1 do: b1 on: e2 do: b2 on: e3 do: b3`**

Evaluate the receiver; when e1, e2 or e3 are signaled, evaluate
respectively b1, b2 or b3, passing a Signal describing the
exception.  Answer either the result of evaluating the receiver or
the parameter of a Signal\>\>#return:

**`on: e1 do: b1 on: e2 do: b2 on: e3 do: b3 on: e4 do: b4`**

Evaluate the receiver; when e1, e2, e3 or e4 are signaled, evaluate
respectively b1, b2, b3 or b4, passing a Signal describing the
exception.  Answer either the result of evaluating the receiver or
the parameter of a Signal\>\>#return:

**`on: e1 do: b1 on: e2 do: b2 on: e3 do: b3 on: e4 do: b4 on: e5 do: b5`**

Evaluate the receiver; when e1, e2, e3, e4 or e5 are signaled,
evaluate respectively b1, b2, b3, b4 or b5, passing a Signal
describing the exception.  Answer either the result of evaluating
the receiver or the parameter of a Signal\>\>#return:

#### 1.11.7 BlockClosure: multiple process

**`fork`**

Create a new process executing the receiver and start it

**`forkAt: priority`**

Create a new process executing the receiver with given priority and
start it

**`forkWithoutPreemption`**

Evaluate the receiver in a process that cannot be preempted.  If
the receiver expect a parameter, pass the current process.

**`newProcess`**

Create a new process executing the receiver in suspended state.
The priority is the same as for the calling process.  The receiver
must not contain returns

**`newProcessWith: anArray`**

Create a new process executing the receiver with the passed
arguments, and leave it in suspended state.  The priority is the
same as for the calling process.  The receiver must not contain
returns

**`valueWithoutInterrupts`**

Evaluate aBlock and delay all interrupts that are requested to the
active process during its execution to after aBlock returns.

**`valueWithoutPreemption`**

Evaluate the receiver with external interrupts disabled.  This
effectively disables preemption as long as the block does not
explicitly yield control, wait on semaphores, and the like.

#### 1.11.8 BlockClosure: overriding

**`copy`**

Answer the receiver.

**`deepCopy`**

Answer a shallow copy.

#### 1.11.9 BlockClosure: testing

**`hasMethodReturn`**

Answer whether the block contains a method return

#### 1.11.10 BlockClosure: unwind protection

**`ensure: aBlock`**

Evaluate the receiver; when any exception is signaled exit
returning the result of evaluating aBlock; if no exception is
raised, return the result of evaluating aBlock when the receiver
has ended

**`ifCurtailed: aBlock`**

Evaluate the receiver; if its execution triggers an unwind which
truncates the execution of the block ('curtails' the block),
evaluate aBlock.  The three cases which can curtail the execution
of the receiver are: a non-local return in the receiver, a
non-local return in a block evaluated by the receiver which returns
past the receiver itself, and an exception raised and not resumed
during the execution of the receiver.

**`valueWithUnwind`**

Evaluate the receiver.  Any errors caused by the block will cause a
backtrace, but execution will continue in the method that sent
\#valueWithUnwind, after that call.  Example: \[ 1 / 0 \]
valueWithUnwind.  'unwind works!'  printNl.

Important: this method is public, but it is intended to be used in
very special cases (as a rule of thumb, use it only when the
corresponding C code uses the \_gst\_prepare\_execution\_environment
and \_gst\_finish\_execution\_environment functions).  You should
usually rely on #ensure: and #on:do:.

### 1.12 BlockContext

**Namespace:** Smalltalk · **Superclass:** [ContextPart](#141-contextpart) · **Category:** Language-Implementation

My instances represent executing Smalltalk blocks, which are
portions of executeable code that have access to the environment
that they were declared in, take parameters, and result from
BlockClosure objects created to be executed by methods outside the
current class.  Block contexts are created by messages sent to
compute a closure's value.  They contain a stack and also provide
some methods that can be used in inspection or debugging.

#### 1.12.1 BlockContext: accessing

**`caller`**

Answer the context that called the receiver

**`home`**

Answer the MethodContext to which the receiver refers, or nil if it
has been optimized away

**`isBlock`**

Answer whether the receiver is a block context

**`isDisabled`**

Answers false, because contexts that are skipped when doing a
return are always MethodContexts.  BlockContexts are removed from
the chain whenever a non-local return is done, while MethodContexts
need to stay there in case there is a non-local return from the
\#ensure: block.

**`isEnvironment`**

To create a valid execution environment for the interpreter even
before it starts, GST creates a fake context whose selector is nil
and which can be used as a marker for the current execution
environment.  Answer whether the receiver is that kind of context
(always false, since those contexts are always MethodContexts).

**`isUnwind`**

Answers whether the context must continue execution even after a
non-local return (a return from the enclosing method of a block, or
a call to the #continue: method of ContextPart).  Such contexts are
created only by #ensure: and are always MethodContexts.

**`nthOuterContext: n`**

Answer the n-th outer block/method context for the receiver

**`outerContext`**

Answer the outer block/method context for the receiver

#### 1.12.2 BlockContext: debugging

**`isInternalExceptionHandlingContext`**

Answer whether the receiver is a context that should be hidden to
the user when presenting a backtrace.  Such contexts are never
blocks, but check the rest of the chain.

#### 1.12.3 BlockContext: printing

**`printOn: aStream`**

Print a representation for the receiver on aStream

### 1.13 Boolean

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Data types

I have two instances in the Smalltalk system: true and false.  I
provide methods that are conditional on boolean values, such as
conditional execution and loops, and conditional testing, such as
conditional and and conditional or.  I should say that I appear to
provide those operations; my subclasses True and False actually
provide those operations.

#### 1.13.1 Boolean class: testing

**`isIdentity`**

Answer whether x = y implies x == y for instances of the receiver

**`isImmediate`**

Answer whether, if x is an instance of the receiver, x copy == x

#### 1.13.2 Boolean: basic

**`& aBoolean`**

This method's functionality should be implemented by subclasses of
Boolean

**`and: aBlock`**

This method's functionality should be implemented by subclasses of
Boolean

**`eqv: aBoolean`**

This method's functionality should be implemented by subclasses of
Boolean

**`ifFalse: falseBlock`**

This method's functionality should be implemented by subclasses of
Boolean

**`ifFalse: falseBlock ifTrue: trueBlock`**

This method's functionality should be implemented by subclasses of
Boolean

**`ifTrue: trueBlock`**

This method's functionality should be implemented by subclasses of
Boolean

**`ifTrue: trueBlock ifFalse: falseBlock`**

This method's functionality should be implemented by subclasses of
Boolean

**`not`**

This method's functionality should be implemented by subclasses of
Boolean

**`or: aBlock`**

This method's functionality should be implemented by subclasses of
Boolean

**`xor: aBoolean`**

This method's functionality should be implemented by subclasses of
Boolean

**`| aBoolean`**

This method's functionality should be implemented by subclasses of
Boolean

#### 1.13.3 Boolean: C hacks

**`asCBooleanValue`**

This method's functionality should be implemented by subclasses of
Boolean

#### 1.13.4 Boolean: overriding

**`deepCopy`**

Answer the receiver.

**`shallowCopy`**

Answer the receiver.

#### 1.13.5 Boolean: storing

**`isLiteralObject`**

Answer whether the receiver is expressible as a Smalltalk literal.

**`storeLiteralOn: aStream`**

Store on aStream some Smalltalk code which compiles to the receiver

**`storeOn: aStream`**

Store on aStream some Smalltalk code which compiles to the receiver

### 1.14 ByteArray

**Namespace:** Smalltalk · **Superclass:** [ArrayedCollection](#15-arrayedcollection) · **Category:** Collections-Sequenceable

My instances are similar to strings in that they are both
represented as a sequence of bytes, but my individual elements are
integers, where as a String's elements are characters.

#### 1.14.1 ByteArray class: instance creation

**`fromCData: aCObject size: anInteger`**

Answer a ByteArray containing anInteger bytes starting at the
location pointed to by aCObject

#### 1.14.2 ByteArray: basic

**`= aCollection`**

Answer whether the receiver's items match those in aCollection

**`indexOf: anElement startingAt: anIndex`**

Answer the first index \> anIndex which contains anElement.  Invoke
exceptionBlock and answer its result if no item is found

**`indexOf: anElement startingAt: anIndex ifAbsent: exceptionBlock`**

Answer the first index \> anIndex which contains anElement.  Invoke
exceptionBlock and answer its result if no item is found

#### 1.14.3 ByteArray: built ins

**`asCData: aCType`**

Allocate memory with malloc for a copy of the receiver, and return
it converted to a CObject with the given type

**`at: anIndex ifAbsent: aBlock`**

Answer the index-th indexed instance variable of the receiver

**`byteAt: index`**

Answer the index-th indexed instance variable of the receiver

**`byteAt: index put: value`**

Store the 'value' byte in the index-th indexed instance variable of
the receiver

**`hash`**

Answer an hash value for the receiver

**`replaceFrom: start to: stop with: aByteArray startingAt: replaceStart`**

Replace the characters from start to stop with the bytes contained
in aByteArray (which, actually, can be any variable byte class),
starting at the replaceStart location of aByteArray

**`replaceFrom: start to: stop withString: aString startingAt: replaceStart`**

Replace the characters from start to stop with the ASCII codes
contained in aString (which, actually, can be any variable byte
class), starting at the replaceStart location of aString

#### 1.14.4 ByteArray: CObject

**`asCData`**

Allocate memory with malloc for a copy of the receiver, and return
a pointer to it as a CByte.

**`castTo: type`**

Give access to the receiver as a value with the given CType.

#### 1.14.5 ByteArray: converting

**`asString`**

Answer a String whose character's ASCII codes are the receiver's
contents

**`asUnicodeString`**

Answer a UnicodeString whose character's codes are the receiver's
contents.  This is not implemented unless you load the I18N
package.

#### 1.14.6 ByteArray: more advanced accessing

**`charAt: index`**

Access the C char at the given index in the receiver.  The value is
returned as a Smalltalk Character.  Indices are 1-based just like
for other Smalltalk access.

**`charAt: index put: value`**

Store as a C char the Smalltalk Character or Integer object
identified by 'value', at the given index in the receiver, using
sizeof(char) bytes - i.e.  1 byte.  Indices are 1-based just like
for other Smalltalk access.

**`doubleAt: index`**

Access the C double at the given index in the receiver.  Indices
are 1-based just like for other Smalltalk access.

**`doubleAt: index put: value`**

Store the Smalltalk Float object identified by 'value', at the
given index in the receiver, writing it like a C double.  Indices
are 1-based just like for other Smalltalk access.

**`floatAt: index`**

Access the C float at the given index in the receiver.  Indices are
1-based just like for other Smalltalk access.

**`floatAt: index put: value`**

Store the Smalltalk Float object identified by 'value', at the
given index in the receiver, writing it like a C float.  Indices
are 1-based just like for other Smalltalk access.

**`intAt: index`**

Access the C int at the given index in the receiver.  Indices are
1-based just like for other Smalltalk access.

**`intAt: index put: value`**

Store the Smalltalk Integer object identified by 'value', at the
given index in the receiver, using sizeof(int) bytes.  Indices are
1-based just like for other Smalltalk access.

**`longAt: index`**

Access the C long int at the given index in the receiver.  Indices
are 1-based just like for other Smalltalk access.

**`longAt: index put: value`**

Store the Smalltalk Integer object identified by 'value', at the
given index in the receiver, using sizeof(long) bytes.  Indices are
1-based just like for other Smalltalk access.

**`longDoubleAt: index`**

Access the C long double at the given index in the receiver.
Indices are 1-based just like for other Smalltalk access.

**`longDoubleAt: index put: value`**

Store the Smalltalk Float object identified by 'value', at the
given index in the receiver, writing it like a C double.  Indices
are 1-based just like for other Smalltalk access.

**`objectAt: index`**

Access the Smalltalk object (OOP) at the given index in the
receiver.  Indices are 1-based just like for other Smalltalk
access.

**`objectAt: index put: value`**

Store a pointer (OOP) to the Smalltalk object identified by
'value', at the given index in the receiver.  Indices are 1-based
just like for other Smalltalk access.

**`shortAt: index`**

Access the C short int at the given index in the receiver.  Indices
are 1-based just like for other Smalltalk access.

**`shortAt: index put: value`**

Store the Smalltalk Integer object identified by 'value', at the
given index in the receiver, using sizeof(short) bytes.  Indices
are 1-based just like for other Smalltalk access.

**`stringAt: index`**

Access the string pointed by the C 'char \*' at the given index in
the receiver.  Indices are 1-based just like for other Smalltalk
access.

**`stringAt: index put: value`**

Store the Smalltalk String object identified by 'value', at the
given index in the receiver, writing it like a \*FRESHLY ALLOCATED\*
C string.  It is the caller's responsibility to free it if
necessary.  Indices are 1-based just like for other Smalltalk
access.

**`ucharAt: index`**

Access the C unsigned char at the given index in the receiver.  The
value is returned as a Smalltalk Character.  Indices are 1-based
just like for other Smalltalk access.

**`ucharAt: index put: value`**

Store as a C char the Smalltalk Character or Integer object
identified by 'value', at the given index in the receiver, using
sizeof(char) bytes - i.e.  1 byte.  Indices are 1-based just like
for other Smalltalk access.

**`uintAt: index`**

Access the C unsigned int at the given index in the receiver.
Indices are 1-based just like for other Smalltalk access.

**`uintAt: index put: value`**

Store the Smalltalk Integer object identified by 'value', at the
given index in the receiver, using sizeof(int) bytes.  Indices are
1-based just like for other Smalltalk access.

**`ulongAt: index`**

Access the C unsigned long int at the given index in the receiver.
Indices are 1-based just like for other Smalltalk access.

**`ulongAt: index put: value`**

Store the Smalltalk Integer object identified by 'value', at the
given index in the receiver, using sizeof(long) bytes.  Indices are
1-based just like for other Smalltalk access.

**`unsignedCharAt: index`**

Access the C unsigned char at the given index in the receiver.  The
value is returned as a Smalltalk Character.  Indices are 1-based
just like for other Smalltalk access.

**`unsignedCharAt: index put: value`**

Store as a C char the Smalltalk Character or Integer object
identified by 'value', at the given index in the receiver, using
sizeof(char) bytes - i.e.  1 byte.  Indices are 1-based just like
for other Smalltalk access.

**`unsignedIntAt: index`**

Access the C unsigned int at the given index in the receiver.
Indices are 1-based just like for other Smalltalk access.

**`unsignedIntAt: index put: value`**

Store the Smalltalk Integer object identified by 'value', at the
given index in the receiver, using sizeof(int) bytes.  Indices are
1-based just like for other Smalltalk access.

**`unsignedLongAt: index`**

Access the C unsigned long int at the given index in the receiver.
Indices are 1-based just like for other Smalltalk access.

**`unsignedLongAt: index put: value`**

Store the Smalltalk Integer object identified by 'value', at the
given index in the receiver, using sizeof(long) bytes.  Indices are
1-based just like for other Smalltalk access.

**`unsignedShortAt: index`**

Access the C unsigned short int at the given index in the receiver.
Indices are 1-based just like for other Smalltalk access.

**`unsignedShortAt: index put: value`**

Store the Smalltalk Integer object identified by 'value', at the
given index in the receiver, using sizeof(short) bytes.  Indices
are 1-based just like for other Smalltalk access.

**`ushortAt: index`**

Access the C unsigned short int at the given index in the receiver.
Indices are 1-based just like for other Smalltalk access.

**`ushortAt: index put: value`**

Store the Smalltalk Integer object identified by 'value', at the
given index in the receiver, using sizeof(short) bytes.  Indices
are 1-based just like for other Smalltalk access.

#### 1.14.7 ByteArray: storing

**`isLiteralObject`**

Answer whether the receiver is expressible as a Smalltalk literal.

**`storeLiteralOn: aStream`**

Put a Smalltalk literal evaluating to the receiver on aStream.

**`storeOn: aStream`**

Put Smalltalk code evaluating to the receiver on aStream.

### 1.15 CAggregate

**Namespace:** Smalltalk · **Superclass:** [CObject](#136-cobject) · **Category:** Language-C interface

#### 1.15.1 CAggregate class: accessing

**`alignof`**

Answer the receiver's instances required aligment

**`sizeof`**

Answer the receiver's instances size

#### 1.15.2 CAggregate: accessing

**`elementType`**

Answer the type over which the receiver is constructed.

### 1.16 CallinProcess

**Namespace:** Smalltalk · **Superclass:** [Process](#1134-process) · **Category:** Language-Processes

I represent a unit of computation for which external C code
requested execution, so I must store the returned value once my
computation terminates and I must not survive across image saves
(since those who invoked me no longer exist).  I am otherwise
equivalent to a Process.

#### 1.16.1 CallinProcess: debugging

**`detach`**

Continue running the receiver as a normal Process, and return nil
from the callin.

### 1.17 CArray

**Namespace:** Smalltalk · **Superclass:** [CAggregate](#115-caggregate) · **Category:** Language-C interface

#### 1.17.1 CArray: accessing

**`alignof`**

Answer the receiver's required aligment

**`sizeof`**

Answer the receiver's size

### 1.18 CArrayCType

**Namespace:** Smalltalk · **Superclass:** [CPtrCType](#144-cptrctype) · **Category:** Language-C interface

#### 1.18.1 CArrayCType class: instance creation

**`elementType: aCType`**

This method should not be called for instances of this class.

**`elementType: aCType numberOfElements: anInteger`**

Answer a new instance of CPtrCType that maps an array whose
elements are of the given CType, and whose size is exactly
anInteger elements (of course, anInteger only matters for
allocation, not for access, since no out-of-bounds protection is
provided for C objects).

**`from: type`**

Private - Called by CType\>\>from: for arrays

#### 1.18.2 CArrayCType: accessing

**`alignof`**

Answer the alignment of the receiver's instances

**`numberOfElements`**

Answer the number of elements in the receiver's instances

**`sizeof`**

Answer the size of the receiver's instances

#### 1.18.3 CArrayCType: basic

**`= anObject`**

Return whether the receiver and anObject are equal.

**`hash`**

Return a hash code for the receiver.

#### 1.18.4 CArrayCType: storing

**`storeOn: aStream`**

As with super.

### 1.19 CBoolean

**Namespace:** Smalltalk · **Superclass:** [CByte](#120-cbyte) · **Category:** Language-C interface

I return true if a byte is not zero, false otherwise.

#### 1.19.1 CBoolean class: conversion

**`type`**

Answer a CType for the receiver

#### 1.19.2 CBoolean: accessing

**`value`**

Get the receiver's value - answer true if it is != 0, false if it
is 0.

**`value: aBoolean`**

Set the receiver's value - it's the same as for CBytes, but we get
a Boolean, not a Character

### 1.20 CByte

**Namespace:** Smalltalk · **Superclass:** [CUChar](#153-cuchar) · **Category:** Language-C interface

You know what a byte is, don't you?!?

#### 1.20.1 CByte class: conversion

**`cObjStoredType`**

Nothing special in the default case - answer a CType for the
receiver

**`type`**

Answer a CType for the receiver

#### 1.20.2 CByte: accessing

**`cObjStoredType`**

Nothing special in the default case - answer the receiver's CType

**`value`**

Answer the value the receiver is pointing to.  The returned value
is a SmallInteger

**`value: aValue`**

Set the receiver to point to the value, aValue (a SmallInteger).

### 1.21 CCallable

**Namespace:** Smalltalk · **Superclass:** [CObject](#136-cobject) · **Category:** Language-C interface

I am not part of the Smalltalk definition.  My instances contain
information about C functions that can be called from within
Smalltalk, such as number and type of parameters.  This information
is used by the C callout mechanism to perform the actual call-out
to C routines.

#### 1.21.1 CCallable class: instance creation

**`for: aCObject returning: returnTypeSymbol withArgs: argsArray`**

Answer a CFunctionDescriptor with the given address, return type
and arguments.  The address will be reset to NULL upon image save
(and it's the user's task to figure out a way to reinitialize it!)

#### 1.21.2 CCallable: accessing

**`isValid`**

Answer whether the object represents a valid function.

**`returnType`**

Not commented.

#### 1.21.3 CCallable: calling

**`asyncCall`**

Perform the call-out for the function represented by the receiver.
The arguments (and the receiver if one of the arguments has type
\#self or #selfSmalltalk) are taken from the parent context.
Asynchronous call-outs don't return a value, but if the function
calls back into Smalltalk the process that started the call-out is
not suspended.

**`asyncCallNoRetryFrom: aContext`**

Perform the call-out for the function represented by the receiver.
The arguments (and the receiver if one of the arguments has type
\#self or #selfSmalltalk) are taken from the base of the stack of
aContext.  Asynchronous call-outs don't return a value, but if the
function calls back into Smalltalk the process that started the
call-out is not suspended.  Unlike #asyncCallFrom:, this method
does not attempt to find functions in shared objects.

**`callInto: aValueHolder`**

Perform the call-out for the function represented by the receiver.
The arguments (and the receiver if one of the arguments has type
\#self or #selfSmalltalk) are taken from the parent context, and the
the result is stored into aValueHolder.  aValueHolder is also
returned.

**`callNoRetryFrom: aContext into: aValueHolder`**

Perform the call-out for the function represented by the receiver.
The arguments (and the receiver if one of the arguments has type
\#self or #selfSmalltalk) are taken from the base of the stack of
aContext, and the result is stored into aValueHolder.  aValueHolder
is also returned.  Unlike #callFrom:into:, this method does not
attempt to find functions in shared objects.

#### 1.21.4 CCallable: restoring

**`link`**

Rebuild the object after the image is restarted.

### 1.22 CCallbackDescriptor

**Namespace:** Smalltalk · **Superclass:** [CCallable](#121-ccallable) · **Category:** Language-C interface

I am not part of the Smalltalk definition.  My instances are able
to convert blocks into C functions that can be passed to C.

#### 1.22.1 CCallbackDescriptor class: instance creation

**`for: aBlock returning: returnTypeSymbol withArgs: argsArray`**

Answer a CCallbackDescriptor with the given block, return type and
arguments.

#### 1.22.2 CCallbackDescriptor: accessing

**`block`**

Answer the block of the function represented by the receiver.

**`block: aBlock`**

Set the block of the function represented by the receiver.

#### 1.22.3 CCallbackDescriptor: restoring

**`link`**

Make the address of the function point to the registered address.

### 1.23 CChar

**Namespace:** Smalltalk · **Superclass:** [CScalar](#145-cscalar) · **Category:** Language-C interface

#### 1.23.1 CChar class: accessing

**`alignof`**

Answer the receiver's instances required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's instances
scalar type

**`sizeof`**

Answer the receiver's instances size

#### 1.23.2 CChar: accessing

**`alignof`**

Answer the receiver's required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's scalar type

**`sizeof`**

Answer the receiver's size

#### 1.23.3 CChar: conversion

**`asByteArray: size`**

Convert size bytes pointed to by the receiver to a String

**`asString`**

Convert the data pointed to by the receiver, up to the first NULL
byte, to a String

**`asString: size`**

Convert size bytes pointed to by the receiver to a String

### 1.24 CCompound

**Namespace:** Smalltalk · **Superclass:** [CObject](#136-cobject) · **Category:** Language-C interface

#### 1.24.1 CCompound class: instance creation

**`gcNew`**

Allocate a new instance of the receiver, backed by
garbage-collected storage.

**`new`**

Allocate a new instance of the receiver.  To free the memory after
GC, remember to call #addToBeFinalized.

#### 1.24.2 CCompound class: subclass creation

**`alignof`**

Answer 1, the alignment of an empty struct

**`classPragmas`**

Return the pragmas that are written in the file-out of this class.

**`compileSize: size align: alignment`**

Private - Compile sizeof and alignof methods

**`declaration`**

Return the description of the fields in the receiver class.

**`declaration: array`**

This method's functionality should be implemented by subclasses of
CCompound

**`declaration: array inject: startOffset into: aBlock`**

Compile methods that implement the declaration in array.  To
compute the offset after each field, the value of the old offset
plus the new field's size is passed to aBlock, together with the
new field's alignment requirements.

**`emitFieldNameTo: str for: name`**

Private - Emit onto the given stream the code for adding the given
selector to the CCompound's #examineOn: method.

**`newStruct: structName declaration: array`**

The old way to create a CStruct.  Superseded by
\#subclass:declaration:...

**`sizeof`**

Answer 0, the size of an empty struct

**`subclass: structName declaration: array classVariableNames: cvn poolDictionaries: pd category: category`**

Create a new class with the given name that contains code to
implement the given C struct.  All the parameters except 'array'
are the same as for a standard class creation message; see
documentation for more information

#### 1.24.3 CCompound: debugging

**`examineOn: aStream`**

Print the contents of the receiver's fields on aStream

**`fieldSelectorList`**

Answer a list of selectors whose return values should be printed by
\#examineOn:.

### 1.25 CDouble

**Namespace:** Smalltalk · **Superclass:** [CScalar](#145-cscalar) · **Category:** Language-C interface

#### 1.25.1 CDouble class: accessing

**`alignof`**

Answer the receiver's instances required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's instances
scalar type

**`sizeof`**

Answer the receiver's instances size

#### 1.25.2 CDouble: accessing

**`alignof`**

Answer the receiver's required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's scalar type

**`sizeof`**

Answer the receiver's size

### 1.26 CFloat

**Namespace:** Smalltalk · **Superclass:** [CScalar](#145-cscalar) · **Category:** Language-C interface

#### 1.26.1 CFloat class: accessing

**`alignof`**

Answer the receiver's instances required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's instances
scalar type

**`sizeof`**

Answer the receiver's instances size

#### 1.26.2 CFloat: accessing

**`alignof`**

Answer the receiver's required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's scalar type

**`sizeof`**

Answer the receiver's size

### 1.27 CFunctionDescriptor

**Namespace:** Smalltalk · **Superclass:** [CCallable](#121-ccallable) · **Category:** Language-C interface

I am not part of the Smalltalk definition.  My instances contain
information about C functions that can be called from within
Smalltalk, such as number and type of parameters.  This information
is used by the C callout mechanism to perform the actual call-out
to C routines.

#### 1.27.1 CFunctionDescriptor class: instance creation

**`for: funcName returning: returnTypeSymbol withArgs: argsArray`**

Answer a CFunctionDescriptor with the given function name, return
type and arguments.  funcName must be a String.

#### 1.27.2 CFunctionDescriptor class: testing

**`addressOf: function`**

Answer whether a function is registered (on the C side) with the
given name or is dynamically loadable.

**`isFunction: function`**

Answer whether a function is registered (on the C side) with the
given name.

#### 1.27.3 CFunctionDescriptor: accessing

**`name`**

Answer the name of the function (on the C side) represented by the
receiver

**`name: aString`**

Set the name of the function (on the C side) represented by the
receiver

#### 1.27.4 CFunctionDescriptor: printing

**`printOn: aStream`**

Print a representation of the receiver onto aStream

#### 1.27.5 CFunctionDescriptor: restoring

**`link`**

Make the address of the function point to the registered address.

### 1.28 Character

**Namespace:** Smalltalk · **Superclass:** [Magnitude](#1107-magnitude) · **Category:** Language-Data types

My instances represent the 256 characters of the character set.  I
provide messages to translate between integers and character
objects, and provide names for some of the common unprintable
characters.

Character is always used (mostly for performance reasons) when
referring to characters whose code point is between 0 and 127.
Above 127, instead, more care is needed: Character refers to bytes
that are used as part of encoding of a character, while
UnicodeCharacter refers to the character itself.

#### 1.28.1 Character class: built ins

**`asciiValue: anInteger`**

Returns the character object corresponding to anInteger.  Error if
anInteger is not an integer, or not in 0..127.

**`codePoint: anInteger`**

Returns the character object, possibly an UnicodeCharacter,
corresponding to anInteger.  Error if anInteger is not an integer,
or not in 0..16r10FFFF.

**`value: anInteger`**

Returns the character object corresponding to anInteger.  Error if
anInteger is not an integer, or not in 0..255.

#### 1.28.2 Character class: constants

**`backspace`**

Returns the character 'backspace'

**`bell`**

Returns the character 'bel'

**`cr`**

Returns the character 'cr'

**`eof`**

Returns the character 'eof', also known as 'sub'

**`eot`**

Returns the character 'eot', also known as 'Ctrl-D'

**`esc`**

Returns the character 'esc'

**`ff`**

Returns the character 'ff', also known as 'newPage'

**`lf`**

Returns the character 'lf', also known as 'nl'

**`newPage`**

Returns the character 'newPage', also known as 'ff'

**`nl`**

Returns the character 'nl', also known as 'lf'

**`nul`**

Returns the character 'nul'

**`space`**

Returns the character 'space'

**`tab`**

Returns the character 'tab'

#### 1.28.3 Character class: initializing lookup tables

**`initialize`**

Initialize the lookup table which is used to make case and
digit-to-char conversions faster.  Indices in Table are ASCII
values incremented by one.  Indices 1-256 classify chars (0 =
nothing special, 2 = separator, 48 = digit, 55 = uppercase, 3 =
lowercase), indices 257-512 map to lowercase chars, indices 513-768
map to uppercase chars.

#### 1.28.4 Character class: instance creation

**`digitValue: anInteger`**

Returns a character that corresponds to anInteger.  0-9 map to
$0-$9, 10-35 map to $A-$Z

#### 1.28.5 Character class: testing

**`isImmediate`**

Answer whether, if x is an instance of the receiver, x copy == x

#### 1.28.6 Character: built ins

**`= char`**

Boolean return value; true if the characters are equal

**`asInteger`**

Returns the integer value corresponding to self.  #codePoint,
\#asciiValue, #value, and #asInteger are synonyms.

**`asciiValue`**

Returns the integer value corresponding to self.  #codePoint,
\#asciiValue, #value, and #asInteger are synonyms.

**`codePoint`**

Returns the integer value corresponding to self.  #codePoint,
\#asciiValue, #value, and #asInteger are synonyms.

**`value`**

Returns the integer value corresponding to self.  #codePoint,
\#asciiValue, #value, and #asInteger are synonyms.

#### 1.28.7 Character: coercion methods

**`* aNumber`**

Returns a String with aNumber occurrences of the receiver.

**`asLowercase`**

Returns self as a lowercase character if it's an uppercase letter,
otherwise returns the character unchanged.

**`asString`**

Returns the character self as a string.  Only valid if the
character is between 0 and 255.

**`asSymbol`**

Returns the character self as a symbol.

**`asUnicodeString`**

Returns the character self as a Unicode string.

**`asUppercase`**

Returns self as a uppercase character if it's an lowercase letter,
otherwise returns the character unchanged.

#### 1.28.8 Character: comparing

**`< aCharacter`**

Compare the character's ASCII value.  Answer whether the receiver's
is the least.

**`<= aCharacter`**

Compare the character's ASCII value.  Answer whether the receiver's
is the least or their equal.

**`> aCharacter`**

Compare the character's ASCII value.  Answer whether the receiver's
is the greatest.

**`>= aCharacter`**

Compare the character's ASCII value.  Answer whether the receiver's
is the greatest or their equal.

#### 1.28.9 Character: converting

**`asCharacter`**

Return the receiver, since it is already a character.

**`digitValue`**

Returns the value of self interpreted as a digit.  Here, 'digit'
means either 0-9, or A-Z, which maps to 10-35.

#### 1.28.10 Character: printing

**`displayOn: aStream`**

Print a representation of the receiver on aStream.  Unlike
\#printOn:, this method strips the leading dollar.

**`printOn: aStream`**

Print a representation of the receiver on aStream

**`storeLiteralOn: aStream`**

Store on aStream some Smalltalk code which compiles to the receiver

#### 1.28.11 Character: storing

**`isLiteralObject`**

Answer whether the receiver is expressible as a Smalltalk literal.

**`storeOn: aStream`**

Store Smalltalk code compiling to the receiver on aStream

#### 1.28.12 Character: testing

**`isAlphaNumeric`**

True if self is a letter or a digit

**`isDigit`**

True if self is a 0-9 digit

**`isDigit: radix`**

Answer whether the receiver is a valid character in the given
radix.

**`isLetter`**

True if self is an upper- or lowercase letter

**`isLowercase`**

True if self is a lowercase letter

**`isPathSeparator`**

Returns true if self is a path separator ($/ or $\\ under Windows,
$/ only under Unix systems including Mac OS X).

**`isPunctuation`**

Returns true if self is one of '.,:;!?'

**`isSeparator`**

Returns true if self is a space, cr, tab, nl, or newPage

**`isUppercase`**

True if self is uppercase

**`isVowel`**

Returns true if self is a, e, i, o, or u; case insensitive

#### 1.28.13 Character: testing functionality

**`isCharacter`**

Answer True.  We're definitely characters

### 1.29 CharacterArray

**Namespace:** Smalltalk · **Superclass:** [ArrayedCollection](#15-arrayedcollection) · **Category:** Collections-Text

My instances represent a generic textual (string) data type.  I
provide accessing and manipulation methods for strings.

#### 1.29.1 CharacterArray class: basic

**`fromString: aCharacterArray`**

Make up an instance of the receiver containing the same characters
as aCharacterArray, and answer it.

**`lineDelimiter`**

Answer a CharacterArray which one can use as a line delimiter.
This is meant to be used on subclasses of CharacterArray.

#### 1.29.2 CharacterArray class: multibyte encodings

**`isUnicode`**

Answer whether the receiver stores bytes (i.e.  an encoded form) or
characters (if true is returned).

#### 1.29.3 CharacterArray: basic

**`valueAt: anIndex ifAbsent: aBlock`**

Answer the ascii value of the anIndex-th character of the receiver,
or evaluate aBlock and answer the result if the index is out of
range.

#### 1.29.4 CharacterArray: built ins

**`valueAt: index`**

Answer the ascii value of index-th character variable of the
receiver

**`valueAt: index put: value`**

Store (Character value: value) in the index-th indexed instance
variable of the receiver

#### 1.29.5 CharacterArray: comparing

**`< aCharacterArray`**

Return true if the receiver is less than aCharacterArray, ignoring
case differences.

**`<= aCharacterArray`**

Returns true if the receiver is less than or equal to
aCharacterArray, ignoring case differences.  If is receiver is an
initial substring of aCharacterArray, it is considered to be less
than aCharacterArray.

**`= aString`**

Answer whether the receiver's items match those in aCollection

**`> aCharacterArray`**

Return true if the receiver is greater than aCharacterArray,
ignoring case differences.

**`>= aCharacterArray`**

Returns true if the receiver is greater than or equal to
aCharacterArray, ignoring case differences.  If is aCharacterArray
is an initial substring of the receiver, it is considered to be
less than the receiver.

**`indexOf: aCharacterArray matchCase: aBoolean startingAt: anIndex`**

Answer an Interval of indices in the receiver which match the
aCharacterArray pattern.  # in aCharacterArray means 'match any
character', \* in aCharacterArray means 'match any sequence of
characters'.  The first item of the returned interval is \>=
anIndex.  If aBoolean is false, the search is case-insensitive,
else it is case-sensitive.  If no Interval matches the pattern,
answer nil.

**`match: aCharacterArray`**

Answer whether aCharacterArray matches the pattern contained in the
receiver.  # in the receiver means 'match any character', \* in
receiver means 'match any sequence of characters'.

**`match: aCharacterArray ignoreCase: aBoolean`**

Answer whether aCharacterArray matches the pattern contained in the
receiver.  # in the receiver means 'match any character', \* in
receiver means 'match any sequence of characters'.  The case of
alphabetic characters is ignored if aBoolean is true.

**`sameAs: aCharacterArray`**

Returns true if the receiver is the same CharacterArray as
aCharacterArray, ignoring case differences.

#### 1.29.6 CharacterArray: converting

**`asByteArray`**

Return the receiver, converted to a ByteArray of ASCII values

**`asClassPoolKey`**

Return the receiver, ready to be put in a class pool dictionary

**`asGlobalKey`**

Return the receiver, ready to be put in the Smalltalk dictionary

**`asInteger`**

Parse an Integer number from the receiver until the input character
is invalid and answer the result at this point

**`asLowercase`**

Returns a copy of self as a lowercase CharacterArray

**`asNumber`**

Parse a Number from the receiver until the input character is
invalid and answer the result at this point

**`asPoolKey`**

Return the receiver, ready to be put in a pool dictionary

**`asString`**

But I already am a String!  Really!

**`asSymbol`**

Returns the symbol corresponding to the CharacterArray

**`asUnicodeString`**

Answer a UnicodeString whose character's codes are the receiver's
contents This is not implemented unless you load the I18N package.

**`asUppercase`**

Returns a copy of self as an uppercase CharacterArray

**`fileName`**

But I don't HAVE a file name!

**`filePos`**

But I don't HAVE a file position!

**`isNumeric`**

Answer whether the receiver denotes a number

**`trimSeparators`**

Return a copy of the reciever without any spaces on front or back.
The implementation is protected against the 'all blanks' case.

#### 1.29.7 CharacterArray: multibyte encodings

**`encoding`**

Answer the encoding used by the receiver.

**`isUnicode`**

Answer whether the receiver stores bytes (i.e.  an encoded form) or
characters (if true is returned).

**`numberOfCharacters`**

Answer the number of Unicode characters in the receiver.  This is
not implemented unless you load the I18N package.

#### 1.29.8 CharacterArray: still unclassified

**`withUnixShellEscapes`**

Answer the receiver with special shell characters converted to a
backslash sequence.

**`withWindowsShellEscapes`**

Answer the receiver with Windows shell characters escaped properly.

#### 1.29.9 CharacterArray: string processing

**`% aCollection`**

Answer the receiver with special escape sequences replaced by
elements of aCollection.  %n (1\<=n\<=9, A\<=n\<=Z) are replaced by the
n-th element of aCollection (A being the 10-th element and so on
until the 35th).  %(string) sequences are accessed as strings,
which makes sense only if aCollection is a Dictionary or
LookupTable.  In addition, the special pattern
%\<trueString\|falseString\>n or %\<trueString\|falseString\>(string) is
replaced with one of the two strings depending on the element of
aCollection being true or false.  The replaced elements are
'displayed' (i.e.  their displayString is used).

**`bindWith: s1`**

Answer the receiver with every %1 replaced by the displayString of
s1

**`bindWith: s1 with: s2`**

Answer the receiver with every %1 or %2 replaced by s1 or s2,
respectively.  s1 and s2 are 'displayed' (i.e.  their displayString
is used) upon replacement.

**`bindWith: s1 with: s2 with: s3`**

Answer the receiver with every %1, %2 or %3 replaced by s1, s2 or
s3, respectively.  s1, s2 and s3 are 'displayed' (i.e.  their
displayString is used) upon replacement.

**`bindWith: s1 with: s2 with: s3 with: s4`**

Answer the receiver with every %1, %2, %3 or %4 replaced by s1, s2,
s3 or s4, respectively.  s1, s2, s3 and s4 are 'displayed' (i.e.
their displayString is used) upon replacement.

**`bindWithArguments: aCollection`**

Answer the receiver with special escape sequences replaced by
elements of aCollection.  %n (1\<=n\<=9, A\<=n\<=Z) are replaced by the
n-th element of aCollection (A being the 10-th element and so on
until the 35th).  %(string) sequences are accessed as strings,
which makes sense only if aCollection is a Dictionary or
LookupTable.  In addition, the special pattern
%\<trueString\|falseString\>n or %\<trueString\|falseString\>(string) is
replaced with one of the two strings depending on the element of
aCollection being true or false.  The replaced elements are
'displayed' (i.e.  their displayString is used).

**`contractTo: smallSize`**

Either return myself, or a copy shortened to smallSize characters
by inserting an ellipsis (three dots: ...)

**`lines`**

Answer an Array of Strings each representing one line in the
receiver.

**`linesDo: aBlock`**

Evaluate aBlock once for every newline delimited line in the
receiver, passing the line to the block.

**`subStrings`**

Answer an OrderedCollection of substrings of the receiver.  A new
substring start at the start of the receiver, or after every
sequence of white space characters

**`subStrings: sep`**

Answer an OrderedCollection of substrings of the receiver.  A new
substring start at the start of the receiver, or after every
occurrence of one of the characters in sep

**`substrings`**

Answer an OrderedCollection of substrings of the receiver.  A new
substring start at the start of the receiver, or after every
sequence of white space characters.  This message is preserved for
backwards compatibility; the ANSI standard mandates 'subStrings',
with an uppercase s.

**`substrings: sep`**

Answer an OrderedCollection of substrings of the receiver.  A new
substring start at the start of the receiver, or after every
occurrence of one of the characters in sep.  This message is
preserved for backwards compatibility; the ANSI standard mandates
'subStrings:', with an uppercase s.

**`withShellEscapes`**

Answer the receiver with special shell characters converted to a
backslash sequence.

#### 1.29.10 CharacterArray: testing functionality

**`isCharacterArray`**

Answer 'true'.

### 1.30 CInt

**Namespace:** Smalltalk · **Superclass:** [CScalar](#145-cscalar) · **Category:** Language-C interface

#### 1.30.1 CInt class: accessing

**`alignof`**

Answer the receiver's required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's instances
scalar type

**`sizeof`**

Answer the receiver's size

#### 1.30.2 CInt: accessing

**`alignof`**

Answer the receiver's instances required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's scalar type

**`sizeof`**

Answer the receiver's instances size

### 1.31 Class

**Namespace:** Smalltalk · **Superclass:** [ClassDescription](#132-classdescription) · **Category:** Language-Implementation

I am THE class object.  My instances are the classes of the system.
I provide information commonly attributed to classes: namely, the
class name, class comment (you wouldn't be reading this if it
weren't for me), a list of the instance variables of the class, and
the class category.

#### 1.31.1 Class class: initialize

**`initialize`**

Perform the special initialization of root classes.

#### 1.31.2 Class: accessing instances and variables

**`addClassVarName: aString`**

Add a class variable with the given name to the class pool
dictionary.

**`addClassVarName: aString value: valueBlock`**

Add a class variable with the given name to the class pool
dictionary, and evaluate valueBlock as its initializer.

**`addSharedPool: aDictionary`**

Add the given shared pool to the list of the class' pool
dictionaries

**`allClassVarNames`**

Answer the names of the variables in the receiver's class pool
dictionary and in each of the superclasses' class pool dictionaries

**`bindingFor: aString`**

Answer the variable binding for the class variable with the given
name

**`category`**

Answer the class category

**`category: aString`**

Change the class category to aString

**`classPool`**

Answer the class pool dictionary

**`classPragmas`**

Return the pragmas that are written in the file-out of this class.

**`classVarNames`**

Answer the names of the variables in the class pool dictionary

**`comment`**

Answer the class comment

**`comment: aString`**

Change the class name

**`environment`**

Answer 'environment'.

**`environment: aNamespace`**

Set the receiver's environment to aNamespace and recompile
everything

**`initialize`**

redefined in children (?)

**`initializeAsRootClass`**

Perform special initialization reserved to root classes.

**`name`**

Answer the class name

**`removeClassVarName: aString`**

Removes the class variable from the class, error if not present, or
still in use.

**`removeSharedPool: aDictionary`**

Remove the given dictionary to the list of the class' pool
dictionaries

**`sharedPools`**

Return the names of the shared pools defined by the class

**`superclass: aClass`**

Set the receiver's superclass.

#### 1.31.3 Class: filing

**`fileOutDeclarationOn: aFileStream`**

File out class definition to aFileStream.  Requires package Parser.

**`fileOutOn: aFileStream`**

File out complete class description: class definition, class and
instance methods.  Requires package Parser.

#### 1.31.4 Class: instance creation

**`extend`**

Redefine a version of the receiver in the current namespace.  Note:
this method can bite you in various ways when sent to system
classes; read the section on namespaces in the manual for some
examples of the problems you can encounter.

**`inheritShape`**

Answer whether subclasses will have by default the same shape as
this class.  The default is false.

**`subclass: classNameString`**

Define a subclass of the receiver with the given name.  If the
class is already defined, don't modify its instance or class
variables but still, if necessary, recompile everything needed.

**`subclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames category: categoryNameString`**

Define a fixed subclass of the receiver with the given name,
instance variables, class variables, pool dictionaries and
category.  If the class is already defined, if necessary, recompile
everything needed.

**`variable: shape subclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames category: categoryNameString`**

Define a variable subclass of the receiver with the given name,
shape, instance variables, class variables, pool dictionaries and
category.  If the class is already defined, if necessary, recompile
everything needed.  The shape can be one of #byte #int8 #character
\#short #ushort #int #uint #int64 #uint64 #utf32 #float #double or
\#pointer.

**`variableByteSubclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames category: categoryNameString`**

Define a byte variable subclass of the receiver with the given
name, instance variables (must be "), class variables, pool
dictionaries and category.  If the class is already defined, if
necessary, recompile everything needed.

**`variableSubclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames category: categoryNameString`**

Define a variable pointer subclass of the receiver with the given
name, instance variables, class variables, pool dictionaries and
category.  If the class is already defined, if necessary, recompile
everything needed.

**`variableWordSubclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames category: categoryNameString`**

Define a word variable subclass of the receiver with the given
name, instance variables (must be "), class variables, pool
dictionaries and category.  If the class is already defined, if
necessary, recompile everything needed.

#### 1.31.5 Class: instance creation - alternative

**`categoriesFor: method are: categories`**

Don't use this, it is only present to file in from IBM Smalltalk

**`subclass: classNameString classInstanceVariableNames: stringClassInstVarNames instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

**`subclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

**`variableByteSubclass: classNameString classInstanceVariableNames: stringClassInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

**`variableByteSubclass: classNameString classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

**`variableLongSubclass: classNameString classInstanceVariableNames: stringClassInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

**`variableLongSubclass: classNameString classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

**`variableSubclass: classNameString classInstanceVariableNames: stringClassInstVarNames instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

**`variableSubclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

#### 1.31.6 Class: pragmas

**`pragmaHandlerFor: aSymbol`**

Answer the (possibly inherited) registered handler for pragma
aSymbol, or nil if not found.

**`registerHandler: aBlock forPragma: pragma`**

While compiling methods, on every encounter of the pragma with the
given name, call aBlock with the CompiledMethod and an array of
pragma argument values.

#### 1.31.7 Class: printing

**`article`**

Answer an article ('a' or 'an') which is ok for the receiver's name

**`printOn: aStream`**

Print a representation of the receiver on aStream

**`storeOn: aStream`**

Store Smalltalk code compiling to the receiver on aStream

#### 1.31.8 Class: saving and loading

**`binaryRepresentationVersion`**

Answer a number \>= 0 which represents the current version of the
object's representation.  The default implementation answers zero.

**`convertFromVersion: version withFixedVariables: fixed indexedVariables: indexed for: anObjectDumper`**

This method is called if a VersionableObjectProxy is attached to a
class.  It receives the version number that was stored for the
object (or nil if the object did not use a VersionableObjectProxy),
the fixed instance variables, the indexed instance variables, and
the ObjectDumper that has read the object.  The default
implementation ignores the version and simply fills in an instance
of the receiver with the given fixed and indexed instance variables
(nil if the class instances are of fixed size).  If instance
variables were removed from the class, extras are ignored; if the
class is now fixed and used to be indexed, indexed is not used.

**`nonVersionedInstSize`**

Answer the number of instance variables that the class used to have
when objects were stored without using a VersionableObjectProxy.
The default implementation answers the current instSize.

#### 1.31.9 Class: security

**`check: aPermission`**

Not commented.

**`securityPolicy`**

Answer 'securityPolicy'.

**`securityPolicy: aSecurityPolicy`**

Not commented.

#### 1.31.10 Class: still unclassified

**`allSharedPoolDictionariesDo: aBlock`**

Answer the shared pools visible from methods in the metaclass, in
the correct search order.

**`fileOutHeaderOn: aFileStream`**

Not commented.

#### 1.31.11 Class: testing

**`= aClass`**

Returns true if the two class objects are to be considered equal.

#### 1.31.12 Class: testing functionality

**`asClass`**

Answer the receiver.

**`isClass`**

Answer 'true'.

### 1.32 ClassDescription

**Namespace:** Smalltalk · **Superclass:** [Behavior](#19-behavior) · **Category:** Language-Implementation

My instances provide methods that access classes by category, and
allow whole categories of classes to be filed out to external disk
files.

#### 1.32.1 ClassDescription: compiling

**`compile: code classified: categoryName`**

Compile code in the receiver, assigning the method to the given
category.  Answer the newly created CompiledMethod, or nil if an
error was found.

**`compile: code classified: categoryName ifError: block`**

Compile method source and install in method category, categoryName.
If there are parsing errors, invoke exception block, 'block' (see
compile:ifError:).  Return the method

**`compile: code classified: categoryName notifying: requestor`**

Compile method source and install in method category, categoryName.
If there are parsing errors, send an error message to requestor

#### 1.32.2 ClassDescription: conversion

**`asClass`**

This method's functionality should be implemented by subclasses of
ClassDescription

**`asMetaclass`**

Answer the metaclass associated to the receiver

**`binding`**

Answer a VariableBinding object whose value is the receiver

#### 1.32.3 ClassDescription: copying

**`copy: selector from: aClass`**

Copy the given selector from aClass, assigning it the same category

**`copy: selector from: aClass classified: categoryName`**

Copy the given selector from aClass, assigning it the given
category

**`copyAll: arrayOfSelectors from: class`**

Copy all the selectors in arrayOfSelectors from class, assigning
them the same category they have in class

**`copyAll: arrayOfSelectors from: class classified: categoryName`**

Copy all the selectors in arrayOfSelectors from aClass, assigning
them the given category

**`copyAllCategoriesFrom: aClass`**

Copy all the selectors in aClass, assigning them the original
category

**`copyCategory: categoryName from: aClass`**

Copy all the selectors in from aClass that belong to the given
category

**`copyCategory: categoryName from: aClass classified: newCategoryName`**

Copy all the selectors in from aClass that belong to the given
category, reclassifying them as belonging to the given category

#### 1.32.4 ClassDescription: filing

**`fileOut: fileName`**

Open the given file and to file out a complete class description to
it.  Requires package Parser.

**`fileOutCategory: categoryName to: fileName`**

File out all the methods belonging to the method category,
categoryName, to the fileName file.  Requires package Parser.

**`fileOutOn: aFileStream`**

File out complete class description: class definition, class and
instance methods.  Requires package Parser.

**`fileOutSelector: selector to: fileName`**

File out the given selector to fileName.  Requires package Parser.

#### 1.32.5 ClassDescription: organization of messages and classes

**`classify: aSelector under: aString`**

Put the method identified by the selector aSelector under the
category given by aString.

**`createGetMethod: what`**

Create a method accessing the variable 'what'.

**`createGetMethod: what default: value`**

Create a method accessing the variable 'what', with a default value
of 'value', using lazy initialization

**`createSetMethod: what`**

Create a method which sets the variable 'what'.

**`defineAsyncCFunc: cFuncNameString withSelectorArgs: selectorAndArgs args: argsArray`**

See documentation.  This function is deprecated, you should use the
\<asyncCCall: ...  \> special syntax instead.

**`defineCFunc: cFuncNameString withSelectorArgs: selectorAndArgs returning: returnTypeSymbol args: argsArray`**

See documentation.  This function is deprecated, you should use the
\<asyncCCall: ...  \> special syntax instead.

**`removeCategory: aString`**

Remove from the receiver every method belonging to the given
category

**`whichCategoryIncludesSelector: selector`**

Answer the category for the given selector, or nil if the selector
is not found

#### 1.32.6 ClassDescription: parsing class declarations

**`addSharedPool: aDictionary`**

Add the given shared pool to the list of the class' pool
dictionaries

**`import: aDictionary`**

Add the given shared pool to the list of the class' pool
dictionaries

#### 1.32.7 ClassDescription: printing

**`classVariableString`**

This method's functionality should be implemented by subclasses of
ClassDescription

**`instanceVariableString`**

Answer a string containing the name of the receiver's instance
variables.

**`nameIn: aNamespace`**

Answer the class name when the class is referenced from aNamespace

**`printOn: aStream in: aNamespace`**

Print on aStream the class name when the class is referenced from
aNamespace

**`sharedVariableString`**

This method's functionality should be implemented by subclasses of
ClassDescription

#### 1.32.8 ClassDescription: still unclassified

**`fileOutCategory: category toStream: aFileStream`**

File out all the methods belonging to the method category,
category, to aFileStream.  Requires package Parser.

**`fileOutSelector: aSymbol toStream: aFileStream`**

File out all the methods belonging to the method category,
category, to aFileStream.  Requires package Parser.

### 1.33 CLong

**Namespace:** Smalltalk · **Superclass:** [CScalar](#145-cscalar) · **Category:** Language-C interface

#### 1.33.1 CLong class: accessing

**`alignof`**

Answer the receiver's instances required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's instances
scalar type

**`sizeof`**

Answer the receiver's instances size

#### 1.33.2 CLong: accessing

**`alignof`**

Answer the receiver's required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's scalar type

**`sizeof`**

Answer the receiver's size

### 1.34 CLongDouble

**Namespace:** Smalltalk · **Superclass:** [CScalar](#145-cscalar) · **Category:** Language-C interface

#### 1.34.1 CLongDouble class: accessing

**`alignof`**

Answer the receiver's instances required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's instances
scalar type

**`sizeof`**

Answer the receiver's instances size

#### 1.34.2 CLongDouble: accessing

**`alignof`**

Answer the receiver's required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's scalar type

**`sizeof`**

Answer the receiver's size

### 1.35 CLongLong

**Namespace:** Smalltalk · **Superclass:** [CScalar](#145-cscalar) · **Category:** Language-C interface

#### 1.35.1 CLongLong class: accessing

**`alignof`**

Answer the receiver's instances required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's instances
scalar type

**`sizeof`**

Answer the receiver's instances size

#### 1.35.2 CLongLong: accessing

**`alignof`**

Answer the receiver's required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's scalar type

**`sizeof`**

Answer the receiver's size

### 1.36 CObject

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-C interface

I am not part of the standard Smalltalk kernel class hierarchy.  My
instances contain values that are not interpreted by the Smalltalk
system; they frequently hold "pointers" to data outside of the
Smalltalk environment.  The C callout mechanism allows my instances
to be transformed into their corresponding C values for use in
external routines.

#### 1.36.1 CObject class: conversion

**`type`**

Nothing special in the default case - answer a CType for the
receiver

#### 1.36.2 CObject class: instance creation

**`address: anInteger`**

Answer a new object pointing to the passed address, anInteger

**`alloc: nBytes`**

Allocate nBytes bytes and return an instance of the receiver

**`gcAlloc: nBytes`**

Allocate nBytes bytes and return an instance of the receiver

**`gcNew: nBytes`**

Allocate nBytes bytes and return an instance of the receiver

**`new`**

Answer a new object pointing to NULL.

**`new: nBytes`**

Allocate nBytes bytes and return an instance of the receiver

#### 1.36.3 CObject class: primitive allocation

**`alloc: nBytes type: cTypeObject`**

Allocate nBytes bytes and return a CObject of the given type

**`gcAlloc: nBytes type: cTypeObject`**

Allocate nBytes bytes and return a CObject of the given type

#### 1.36.4 CObject class: subclass creation

**`inheritShape`**

Answer whether subclasses will have by default the same shape as
this class.  The default is true for the CObject hierarchy.

#### 1.36.5 CObject: accessing

**`address`**

Answer the address the receiver is pointing to.  The address can be
absolute if the storage is nil, or relative to the Smalltalk object
in #storage.  In this case, an address of 0 corresponds to the
first instance variable.

**`address: anInteger`**

Set the receiver to point to the passed address, anInteger

**`isAbsolute`**

Answer whether the object points into a garbage-collected Smalltalk
storage, or it is an absolute address.

**`printOn: aStream`**

Print a representation of the receiver

**`storage`**

Answer the storage that the receiver is pointing into, or nil if
the address is absolute.

**`storage: anObject`**

Change the receiver to point to the storage of anObject.

**`type: aCType`**

Set the receiver's type to aCType.

#### 1.36.6 CObject: basic

**`= anObject`**

Return true if the receiver and aCObject are equal.

**`hash`**

Return a hash value for anObject.

#### 1.36.7 CObject: C data access

**`at: byteOffset put: aValue type: aType`**

Store aValue as data of the given type from byteOffset bytes after
the pointer stored in the receiver

**`at: byteOffset type: aType`**

Answer some data of the given type from byteOffset bytes after the
pointer stored in the receiver

**`free`**

Free the receiver's pointer and set it to null.  Big trouble hits
you if the receiver doesn't point to the base of a malloc-ed area.

#### 1.36.8 CObject: conversion

**`castTo: aType`**

Answer another CObject, pointing to the same address as the
receiver, but belonging to the aType CType.

**`narrow`**

This method is called on CObjects returned by a C call-out whose
return type is specified as a CType; it mostly allows one to change
the class of the returned CObject.  By default it does nothing, and
that's why it is not called when #cObject is used to specify the
return type.

**`type`**

Answer a CType for the receiver

#### 1.36.9 CObject: finalization

**`finalize`**

To make the VM call this, use #addToBeFinalized.  It frees
automatically any memory pointed to by the CObject.  It is not
automatically enabled because big trouble hits you if you use #free
and the receiver doesn't point to the base of a malloc-ed area.

#### 1.36.10 CObject: pointer-like behavior

**`+ anInteger`**

Return another instance of the receiver's class which points at
&receiver\[anInteger\] (or, if you prefer, what 'receiver +
anInteger' does in C).

**`- intOrPtr`**

If intOrPtr is an integer, return another instance of the
receiver's class pointing at &receiver\[-anInteger\] (or, if you
prefer, what 'receiver - anInteger' does in C). If it is the same
class as the receiver, return the difference in chars, i.e.  in
bytes, between the two pointed addresses (or, if you prefer, what
'receiver - anotherCharPtr' does in C)

**`addressAt: anIndex`**

Return a new CObject of the element type, corresponding to an
object that is anIndex places past the receiver (remember that
CObjects represent pointers and that C pointers behave like
arrays).  anIndex is zero-based, just like with all other C-style
accessing.

**`at: anIndex`**

Dereference a pointer that is anIndex places past the receiver
(remember that CObjects represent pointers and that C pointers
behave like arrays).  anIndex is zero-based, just like with all
other C-style accessing.

**`at: anIndex put: aValue`**

Store anIndex places past the receiver the passed Smalltalk object
or CObject 'aValue'; if it is a CObject is dereferenced: that is,
this method is equivalent either to cobj\[anIndex\]=aValue or
cobj\[anIndex\]=\*aValue.  anIndex is zero-based, just like with all
other C-style accessing.

In both cases, aValue should be of the element type or of the
corresponding Smalltalk type (that is, a String is ok for an array
of CStrings) to avoid typing problems which however will not be
signaled because C is untyped.

**`decr`**

Adjust the pointer by sizeof(dereferencedType) bytes down (i.e.
\-receiver)

**`decrBy: anInteger`**

Adjust the pointer by anInteger elements down (i.e.  receiver -=
anInteger)

**`incr`**

Adjust the pointer by sizeof(dereferencedType) bytes up (i.e.
\++receiver)

**`incrBy: anInteger`**

Adjust the pointer by anInteger elements up (i.e.  receiver +=
anInteger)

#### 1.36.11 CObject: testing

**`isNull`**

Return true if the receiver points to NULL.

#### 1.36.12 CObject: testing functionality

**`isCObject`**

Answer 'true'.

### 1.37 Collection

**Namespace:** Smalltalk · **Superclass:** [Iterable](#194-iterable) · **Category:** Collections

I am an abstract class.  My instances are collections of objects.
My subclasses may place some restrictions or add some definitions
to how the objects are stored or organized; I say nothing about
this.  I merely provide some object creation and access routines
for general collections of objects.

#### 1.37.1 Collection class: instance creation

**`from: anArray`**

Convert anArray to an instance of the receiver.  anArray is
structured such that the instance can be conveniently and fully
specified using brace-syntax, possibly by imposing some additional
structure on anArray.

**`join: aCollection`**

Answer a collection formed by treating each element in aCollection
as a 'withAll:' argument collection to be added to a new instance.

**`with: anObject`**

Answer a collection whose only element is anObject

**`with: firstObject with: secondObject`**

Answer a collection whose only elements are the parameters in the
order they were passed

**`with: firstObject with: secondObject with: thirdObject`**

Answer a collection whose only elements are the parameters in the
order they were passed

**`with: firstObject with: secondObject with: thirdObject with: fourthObject`**

Answer a collection whose only elements are the parameters in the
order they were passed

**`with: firstObject with: secondObject with: thirdObject with: fourthObject with: fifthObject`**

Answer a collection whose only elements are the parameters in the
order they were passed

**`withAll: aCollection`**

Answer a collection whose elements are all those in aCollection

#### 1.37.2 Collection class: multibyte encodings

**`isUnicode`**

Answer true; the receiver is able to store arbitrary Unicode
characters.

#### 1.37.3 Collection: adding

**`add: newObject`**

Add newObject to the receiver, answer it

**`addAll: aCollection`**

Adds all the elements of 'aCollection' to the receiver, answer
aCollection

#### 1.37.4 Collection: compiler

**`literalEquals: anObject`**

Not commented.

**`literalHash`**

Not commented.

#### 1.37.5 Collection: concatenating

**`join`**

Answer a new collection like my first element, with all the
elements (in order) of all my elements, which should be
collections.

I use my first element instead of myself as a prototype because my
elements are more likely to share the desired properties than I am,
such as in:

\#('hello, ' 'world') join =\> 'hello, world'

#### 1.37.6 Collection: converting

**`asArray`**

Answer an Array containing all the elements in the receiver

**`asBag`**

Answer a Bag containing all the elements in the receiver

**`asByteArray`**

Answer a ByteArray containing all the elements in the receiver

**`asOrderedCollection`**

Answer an OrderedCollection containing all the elements in the
receiver

**`asRunArray`**

Answer the receiver converted to a RunArray.  If the receiver is
not ordered the order of the elements in the RunArray might not be
the #do: order.

**`asSet`**

Answer a Set containing all the elements in the receiver with no
duplicates

**`asSortedCollection`**

Answer a SortedCollection containing all the elements in the
receiver with the default sort block - \[ :a :b \| a \<= b \]

**`asSortedCollection: aBlock`**

Answer a SortedCollection whose elements are the elements of the
receiver, sorted according to the sort block aBlock

**`asString`**

Answer a String containing all the elements in the receiver

**`asUnicodeString`**

Answer a UnicodeString containing all the elements in the receiver

#### 1.37.7 Collection: copying Collections

**`copyReplacing: targetObject withObject: newObject`**

Copy replacing each object which is = to targetObject with
newObject

**`copyWith: newElement`**

Answer a copy of the receiver to which newElement is added

**`copyWithout: oldElement`**

Answer a copy of the receiver to which all occurrences of
oldElement are removed

#### 1.37.8 Collection: copying SequenceableCollections

**`, anIterable`**

Append anIterable at the end of a copy of the receiver (using
\#add:), and answer a new collection

#### 1.37.9 Collection: enumeration

**`anyOne`**

Answer an unspecified element of the collection.

**`beConsistent`**

This method is private, but it is quite interesting so it is
documented.  It ensures that a collection is in a consistent state
before attempting to iterate on it; its presence reduces the number
of overrides needed by collections who try to amortize their
execution times.  The default implementation does nothing, so it is
optimized out by the virtual machine and so it loses very little on
the performance side.  Note that descendants of Collection have to
call it explicitly since #do: is abstract in Collection.

**`collect: aBlock`**

Answer a new instance of a Collection containing all the results of
evaluating aBlock passing each of the receiver's elements

**`gather: aBlock`**

Answer a new instance of a Collection containing all the results of
evaluating aBlock, joined together.  aBlock should return
collections.  The result is the same kind as the first collection,
returned by aBlock (as for #join).

**`readStream`**

Answer a stream that gives elements of the receiver

**`reject: aBlock`**

Answer a new instance of a Collection containing all the elements
in the receiver which, when passed to aBlock, don't answer true

**`select: aBlock`**

Answer a new instance of a Collection containing all the elements
in the receiver which, when passed to aBlock, answer true

#### 1.37.10 Collection: finalization

**`mourn: anObject`**

Private - anObject has been found to have a weak key, remove it and
possibly finalize the key.

#### 1.37.11 Collection: printing

**`displayLines`**

Print each element of the receiver to a line on standard output.

**`examineOn: aStream`**

Print all the instance variables and objects in the receiver on
aStream

**`printOn: aStream`**

Print a representation of the receiver on aStream

#### 1.37.12 Collection: removing

**`empty`**

Remove everything from the receiver.

**`remove: oldObject`**

Remove oldObject from the receiver.  If absent, fail, else answer
oldObject.

**`remove: oldObject ifAbsent: anExceptionBlock`**

Remove oldObject from the receiver.  If absent, evaluate
anExceptionBlock and answer the result, else answer oldObject.

**`removeAll: aCollection`**

Remove each object in aCollection, answer aCollection, fail if some
of them is absent.  Warning: this could leave the collection in a
semi-updated state.

**`removeAll: aCollection ifAbsent: aBlock`**

Remove each object in aCollection, answer aCollection; if some
element is absent, pass it to aBlock.

**`removeAllSuchThat: aBlock`**

Remove from the receiver all objects for which aBlock returns true.

#### 1.37.13 Collection: sorting

**`sorted`**

Return a sequenceable collection with the contents of the receiver
sorted according to the default sort block, which uses #\<= to
compare items.

**`sorted: sortBlock`**

Return a sequenceable collection with the contents of the receiver
sorted according to the given sort block, which accepts pair of
items and returns true if the first item is less than the second
one.

#### 1.37.14 Collection: storing

**`storeOn: aStream`**

Store Smalltalk code compiling to the receiver on aStream

#### 1.37.15 Collection: testing collections

**`capacity`**

Answer how many elements the receiver can hold before having to
grow.

**`identityIncludes: anObject`**

Answer whether we include the anObject object

**`includes: anObject`**

Answer whether we include anObject

**`includesAllOf: aCollection`**

Answer whether we include all of the objects in aCollection

**`includesAnyOf: aCollection`**

Answer whether we include any of the objects in aCollection

**`isEmpty`**

Answer whether we are (still) empty

**`isSequenceable`**

Answer whether the receiver can be accessed by a numeric index with
\#at:/#at:put:.

**`notEmpty`**

Answer whether we include at least one object

**`occurrencesOf: anObject`**

Answer how many occurrences of anObject we include

**`size`**

Answer how many objects we include

### 1.38 CompiledBlock

**Namespace:** Smalltalk · **Superclass:** [CompiledCode](#139-compiledcode) · **Category:** Language-Implementation

I represent a block that has been compiled.

#### 1.38.1 CompiledBlock class: instance creation

**`new: numBytecodes header: anInteger method: outerMethod`**

Answer a new instance of the receiver with room for the given
number of bytecodes and the given header.

**`numArgs: args numTemps: temps bytecodes: bytecodes depth: depth literals: literalArray`**

Answer an (almost) full fledged CompiledBlock.  To make it
complete, you must either set the new object's 'method' variable,
or put it into a BlockClosure and put the BlockClosure into a
CompiledMethod's literals.  The clean-ness of the block is
automatically computed.

#### 1.38.2 CompiledBlock: accessing

**`flags`**

Answer the 'cleanness' of the block.  0 = clean; 1 = access to
receiver variables and/or self; 2-30 = access to variables that are
1-29 contexts away; 31 = return from method or push thisContext

**`method`**

Answer the CompiledMethod in which the receiver lies

**`methodClass`**

Answer the class in which the receiver is installed.

**`methodClass: methodClass`**

Set the receiver's class instance variable

**`numArgs`**

Answer the number of arguments passed to the receiver

**`numLiterals`**

Answer the number of literals for the receiver

**`numTemps`**

Answer the number of temporary variables used by the receiver

**`selector`**

Answer the selector through which the method is called

**`selector: aSymbol`**

Set the selector through which the method is called

**`sourceCodeLinesDelta`**

Answer the delta from the numbers in LINE\_NUMBER bytecodes to
source code line numbers.

**`sourceCodeMap`**

Answer an array which maps bytecode indices to source code line
numbers.  0 values represent invalid instruction pointer indices.

**`stackDepth`**

Answer the number of stack slots needed for the receiver

#### 1.38.3 CompiledBlock: basic

**`= aMethod`**

Answer whether the receiver and aMethod are equal

**`methodCategory`**

Answer the method category

**`methodCategory: aCategory`**

Set the method category to the given string

**`methodSourceCode`**

Answer the method source code (a FileSegment or String or nil)

**`methodSourceFile`**

Answer the file where the method source code is stored

**`methodSourcePos`**

Answer the location where the method source code is stored in the
methodSourceFile

**`methodSourceString`**

Answer the method source code as a string

#### 1.38.4 CompiledBlock: printing

**`printOn: aStream`**

Print the receiver's class and selector on aStream

#### 1.38.5 CompiledBlock: saving and loading

**`binaryRepresentationObject`**

This method is implemented to allow for a PluggableProxy to be used
with CompiledBlocks.  Answer a DirectedMessage which sends
\#blockAt: to the CompiledMethod containing the receiver.

### 1.39 CompiledCode

**Namespace:** Smalltalk · **Superclass:** [ArrayedCollection](#15-arrayedcollection) · **Category:** Language-Implementation

I represent code that has been compiled.  I am an abstract
superclass for blocks and methods

#### 1.39.1 CompiledCode class: cache flushing

**`flushTranslatorCache`**

Answer any kind of cache mantained by a just-in-time code
translator in the virtual machine (if any).  Do nothing for now.

#### 1.39.2 CompiledCode class: instance creation

**`new: numBytecodes header: anInteger literals: literals`**

Answer a new instance of the receiver with room for the given
number of bytecodes and the given header

**`new: numBytecodes header: anInteger numLiterals: numLiterals`**

Answer a new instance of the receiver with room for the given
number of bytecodes and the given header

#### 1.39.3 CompiledCode class: tables

**`bytecodeInfoTable`**

Return a ByteArray which defines some properties of the bytecodes.
For each bytecode, 4 bytes are reserved.  The fourth byte is a flag
byte: bit 7 means that the argument is a line number to be used in
creating the bytecode-\>line number map.

The first three have a meaning only for those bytecodes that
represent a combination of operations: the combination can be BC1
ARG BC2 OPERAND if the fourth byte's bit 0 = 0 or BC1 OPERAND BC2
ARG if the fourth byte's bit 0 = 1

where BC1 is the first byte, BC2 is the second, ARG is the third
and OPERAND is the bytecode argument as it appears in the bytecode
stream.

**`specialSelectors`**

Answer an array of message names that don't need to be in literals
to be sent in a method.  Their position here reflects their integer
code in bytecode.

**`specialSelectorsNumArgs`**

Answer a harmoniously-indexed array of arities for the messages
answered by #specialSelectors.

#### 1.39.4 CompiledCode: accessing

**`at: anIndex put: aBytecode`**

Store aBytecode as the anIndex-th bytecode

**`blockAt: anIndex`**

Answer the CompiledBlock attached to the anIndex-th literal,
assuming that the literal is a CompiledBlock or a BlockClosure.

**`bytecodeAt: anIndex`**

Answer the anIndex-th bytecode

**`bytecodeAt: anIndex put: aBytecode`**

Store aBytecode as the anIndex-th bytecode

**`flags`**

Private - Answer the optimization flags for the receiver

**`isAnnotated`**

Answer 'false'.

**`literalAt: anIndex`**

Answer the anIndex-th literal

**`literalAt: anInteger put: aValue`**

Store aValue as the anIndex-th literal

**`literals`**

Answer the literals referenced by my code or any CompiledCode
instances I own.

**`method`**

Answer the parent method for the receiver, or self if it is a
method.

**`methodClass`**

Answer the class in which the receiver is installed.

**`methodClass: methodClass`**

Set the receiver's class instance variable

**`numArgs`**

Answer the number of arguments for the receiver

**`numLiterals`**

Answer the number of literals for the receiver

**`numTemps`**

Answer the number of temporaries for the receiver

**`primitive`**

Answer the primitive called by the receiver

**`selector`**

Answer the selector through which the method is called

**`selector: aSymbol`**

Set the selector through which the method is called

**`sourceCodeLinesDelta`**

Answer the delta from the numbers in LINE\_NUMBER bytecodes to
source code line numbers.

**`stackDepth`**

Answer the number of stack slots needed for the receiver

#### 1.39.5 CompiledCode: basic

**`= aMethod`**

Answer whether the receiver is the same object as arg.  Testing for
equality could break the browser, since it's possible to put
arbitrary objects via ##(...), so this is safer.

**`hash`**

Answer an hash value for the receiver

**`methodCategory`**

Answer the method category

**`methodCategory: aCategory`**

Set the method category to the given string

**`methodSourceCode`**

Answer the method source code (a FileSegment or String or nil)

**`methodSourceFile`**

Answer the file where the method source code is stored

**`methodSourcePos`**

Answer the location where the method source code is stored in the
methodSourceFile

**`methodSourceString`**

Answer the method source code as a string

#### 1.39.6 CompiledCode: copying

**`deepCopy`**

Answer a deep copy of the receiver

#### 1.39.7 CompiledCode: debugging

**`examineOn: aStream`**

Print the contents of the receiver in a verbose way.

#### 1.39.8 CompiledCode: decoding bytecodes

**`dispatchTo: anObject with: param`**

Disassemble the bytecodes and tell anObject about them in the form
of message sends.  param is given as an argument to every message
send.

#### 1.39.9 CompiledCode: literals - iteration

**`allLiteralSymbolsDo: aBlock`**

As with #allLiteralsDo:, but only call aBlock with found Symbols.

**`allLiteralsDo: aBlock`**

Walk my literals, descending into Arrays and Messages, invoking
aBlock with each touched object.

**`literalsDo: aBlock`**

Invoke aBlock with each object immediately in my list of literals.

#### 1.39.10 CompiledCode: security

**`verify`**

Verify the bytecodes for the receiver, and raise an exception if
the verification process failed.

#### 1.39.11 CompiledCode: testing accesses

**`accesses: instVarIndex`**

Answer whether the receiver accesses the instance variable with the
given index

**`assigns: instVarIndex`**

Answer whether the receiver writes to the instance variable with
the given index

**`containsLiteral: anObject`**

Answer if the receiver contains a literal which is equal to
anObject.

**`hasBytecode: byte between: firstIndex and: lastIndex`**

Answer whether the receiver includes the 'byte' bytecode in any of
the indices between firstIndex and lastIndex.

**`jumpDestinationAt: anIndex forward: aBoolean`**

Answer where the jump at bytecode index 'anIndex' lands

**`reads: instVarIndex`**

Answer whether the receiver reads the instance variable with the
given index

**`refersTo: anObject`**

Answer whether the receiver refers to the given object

**`sendsToSuper`**

Answer whether the receiver includes a send to super.

**`sourceCodeMap`**

Answer an array which maps bytecode indices to source code line
numbers.  0 values represent invalid instruction pointer indices.

#### 1.39.12 CompiledCode: translation

**`discardTranslation`**

Flush the just-in-time translated code for the receiver (if any).

### 1.40 CompiledMethod

**Namespace:** Smalltalk · **Superclass:** [CompiledCode](#139-compiledcode) · **Category:** Language-Implementation

I represent methods that have been compiled.  I can recompile
methods from their source code, I can invoke Emacs to edit the
source code for one of my instances, and I know how to access
components of my instances.

#### 1.40.1 CompiledMethod class: c call-outs

**`asyncCCall: descr numArgs: numArgs attributes: attributesArray`**

Return a CompiledMethod corresponding to a #asyncCCall:args: pragma
with the given arguments.

**`cCall: descr numArgs: numArgs attributes: attributesArray`**

Return a CompiledMethod corresponding to a #cCall:returning:args:
pragma with the given arguments.

#### 1.40.2 CompiledMethod class: instance creation

**`literals: lits numArgs: numArg numTemps: numTemp attributes: attrArray bytecodes: bytecodes depth: depth`**

Answer a full fledged CompiledMethod.  Construct the method header
from the parameters, and set the literals and bytecodes to the
provided ones.  Also, the bytecodes are optimized and any embedded
CompiledBlocks modified to refer to these literals and to the newly
created CompiledMethod.

**`numArgs: args`**

Create a user-defined method (one that is sent
\#valueWithReceiver:withArguments: when it is invoked) with numArgs
arguments.  This only makes sense when called for a subclass of
CompiledMethod.

#### 1.40.3 CompiledMethod class: lean images

**`stripSourceCode`**

Remove all the references to method source code from the system

#### 1.40.4 CompiledMethod: accessing

**`allBlocksDo: aBlock`**

Evaluate aBlock, passing to it all the CompiledBlocks it holds

**`allLiterals`**

Answer the literals referred to by the receiver and all the blocks
in it

**`flags`**

Private - Answer the optimization flags for the receiver

**`isOldSyntax`**

Answer whether the method was written with the old (chunk-format)
syntax

**`method`**

Answer the receiver, since it is already a method.

**`methodCategory`**

Answer the method category

**`methodCategory: aCategory`**

Set the method category to the given string

**`methodClass`**

Answer the class in which the receiver is installed.

**`methodClass: methodClass`**

Set the receiver's class instance variable

**`noteOldSyntax`**

Remember that the method is written with the old (chunk-format)
syntax

**`numArgs`**

Answer the number of arguments for the receiver

**`numTemps`**

Answer the number of temporaries for the receiver

**`primitive`**

Answer the primitive called by the receiver

**`selector`**

Answer the selector through which the method is called

**`selector: aSymbol`**

Set the selector through which the method is called

**`sourceCodeLinesDelta`**

Answer the delta from the numbers in LINE\_NUMBER bytecodes to
source code line numbers.

**`stackDepth`**

Answer the number of stack slots needed for the receiver

**`withAllBlocksDo: aBlock`**

Evaluate aBlock, passing the receiver and all the CompiledBlocks it
holds

**`withNewMethodClass: class`**

Answer either the receiver or a copy of it, with the method class
set to class

**`withNewMethodClass: class selector: selector`**

Answer either the receiver or a copy of it, with the method class
set to class

#### 1.40.5 CompiledMethod: attributes

**`attributeAt: aSymbol`**

Return a Message for the first attribute named aSymbol defined by
the receiver, or answer an error if none was found.

**`attributeAt: aSymbol ifAbsent: aBlock`**

Return a Message for the first attribute named aSymbol defined by
the receiver, or evaluate aBlock is none was found.

**`attributes`**

Return an Array of Messages, one for each attribute defined by the
receiver.

**`attributesDo: aBlock`**

Evaluate aBlock once for each attribute defined by the receiver,
passing a Message each time.

**`isAnnotated`**

If the receiver has any attributes, answer true.

**`primitiveAttribute`**

If the receiver defines a primitive, return a Message resembling
the attribute that was used to define it.

#### 1.40.6 CompiledMethod: basic

**`= aMethod`**

Answer whether the receiver and aMethod are equal

**`hash`**

Answer an hash value for the receiver

#### 1.40.7 CompiledMethod: c call-outs

**`isValidCCall`**

Answer whether I appear to have the valid flags, information, and
ops to invoke a C function and answer its result.

**`rewriteAsAsyncCCall: func args: argsArray`**

Not commented.

**`rewriteAsCCall: funcOrDescr for: aClass`**

Not commented.

**`rewriteAsCCall: func returning: returnType args: argsArray`**

Not commented.

#### 1.40.8 CompiledMethod: compiling

**`methodFormattedSourceString`**

Answer the method source code as a string, formatted using the
RBFormatter.  Requires package Parser.

**`methodParseNode`**

Answer the parse tree for the receiver, or nil if there is an
error.  Requires package Parser.

**`parserClass`**

Answer a parser class, similar to Behavior\>\>parserClass, that can
parse my source code.  Requires package Parser.

**`recompile`**

Recompile the method in the scope of the class where it leaves.

**`recompileNotifying: aNotifier`**

Recompile the method in the scope of the class where it leaves,
notifying errors to aNotifier by sending it #error:.

#### 1.40.9 CompiledMethod: invoking

**`valueWithReceiver: anObject withArguments: args`**

Execute the method within anObject, passing the elements of the
args Array as parameters.  The method need not reside on the
hierarchy from the receiver's class to Object - it need not reside
at all in a MethodDictionary, in fact - but doing bad things will
compromise stability of the Smalltalk virtual machine (and don't
blame anybody but yourself).

If the flags field of the method header is 6, this method instead
provides a hook from which the virtual machine can call back
whenever execution of the method is requested.  In this case,
invoking the method would cause an infinite loop (the VM asks the
method to run, the method asks the VM to invoke it, and so on), so
this method fails with a #subclassResponsibility error.

#### 1.40.10 CompiledMethod: printing

**`printOn: aStream`**

Print the receiver's class and selector on aStream

**`storeOn: aStream`**

Print code to create the receiver on aStream

#### 1.40.11 CompiledMethod: saving and loading

**`binaryRepresentationObject`**

This method is implemented to allow for a PluggableProxy to be used
with CompiledMethods.  Answer a DirectedMessage which sends #\>\> to
the class object containing the receiver.

#### 1.40.12 CompiledMethod: source code

**`methodRecompilationSourceString`**

Answer the method source code as a string, ensuring that it is in
new syntax (it has brackets).

**`methodSourceCode`**

Answer the method source code (a FileSegment or String or nil)

**`methodSourceFile`**

Answer the file where the method source code is stored

**`methodSourcePos`**

Answer the location where the method source code is stored in the
methodSourceFile

**`methodSourceString`**

Answer the method source code as a string

#### 1.40.13 CompiledMethod: testing

**`accesses: instVarIndex`**

Answer whether the receiver or the blocks it contains accesses the
instance variable with the given index

**`assigns: instVarIndex`**

Answer whether the receiver or the blocks it contains writes to the
instance variable with the given index

**`isAbstract`**

Answer whether the receiver is abstract.

**`reads: instVarIndex`**

Answer whether the receiver or the blocks it contains reads to the
instance variable with the given index

**`sendsToSuper`**

Answer whether the receiver or the blocks it contains have sends to
super

### 1.41 ContextPart

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Implementation

My instances represent executing Smalltalk code, which represent
the local environment of executable code.  They contain a stack and
also provide some methods that can be used in inspection or
debugging.

#### 1.41.1 ContextPart class: built ins

**`thisContext`**

Return the value of the thisContext variable.  Called internally
when the variable is accessed.

#### 1.41.2 ContextPart class: exception handling

**`backtrace`**

Print a backtrace from the caller to the bottom of the stack on the
Transcript

**`backtraceOn: aStream`**

Print a backtrace from the caller to the bottom of the stack on
aStream

#### 1.41.3 ContextPart: accessing

**`at: index`**

Answer the index-th slot in the receiver.  Any read access from
(self size + 1) to (self basicSize) will give nil.

**`at: index put: anObject`**

Answer the index-th slot in the receiver.  Any write access from
(self size + 1) to (self basicSize) will give an error unless nil
is being written.  This is because doing such an access first, and
then updating sp, is racy: the garbage collector may trigger in the
middle and move anObject, but the slot in the context won't be
adjusted.

**`client`**

Answer the client of this context, that is, the object that sent
the message that created this context.  Fail if the receiver has no
parent

**`currentFileName`**

Answer the name of the file where the method source code is

**`environment`**

To create a valid execution environment for the interpreter even
before it starts, GST creates a fake context whose selector is nil
and which can be used as a marker for the current execution
environment.  This method answers that context.  For processes, it
answers the process block itself

**`home`**

Answer the MethodContext to which the receiver refers

**`initialIP`**

Answer the value of the instruction pointer when execution starts
in the current context

**`ip`**

Answer the current instruction pointer into the receiver

**`ip: newIP`**

Set the instruction pointer for the receiver

**`isBlock`**

Answer whether the receiver is a block context

**`isDisabled`**

Answers whether the context is skipped when doing a return.
Contexts are marked as disabled whenever a non-local return is done
(either by returning from the enclosing method of a block, or with
the #continue: method of ContextPart) and there are unwind contexts
such as those created by #ensure:.  All non-unwind contexts are
then marked as disabled.

**`isEnvironment`**

To create a valid execution environment for the interpreter even
before it starts, GST creates a fake context which invokes a
special "termination" method.  Such a context can be used as a
marker for the current execution environment.  Answer whether the
receiver is that kind of context.

**`isProcess`**

Answer whether the receiver represents a process context, i.e.  a
context created by BlockClosure\>\>#newProcess.  Such a context can
be recognized because it has no parent but its flags are different
from those of the contexts created by the VM's
prepareExecutionEnvironment function.

**`isUnwind`**

Answers whether the context must continue execution even after a
non-local return (a return from the enclosing method of a block, or
a call to the #continue: method of ContextPart).  Such contexts are
created by #ensure:.

**`method`**

Return the CompiledMethod being executed

**`methodClass`**

Return the class in which the CompiledMethod being executed is
defined

**`numArgs`**

Answer the number of arguments passed to the receiver

**`numTemps`**

Answer the number of temporaries used by the receiver

**`parentContext`**

Answer the context that called the receiver

**`parentContext: aContext`**

Set the context to which the receiver will return

**`push: anObject`**

Push an object on the receiver's stack.

**`receiver`**

Return the receiver (self) for the method being executed

**`selector`**

Return the selector for the method being executed

**`size`**

Answer the number of valid fields for the receiver.  Any read
access from (self size + 1) to (self basicSize) will give nil.

**`sp`**

Answer the current stack pointer into the receiver

**`sp: newSP`**

Set the stack pointer for the receiver.

**`validSize`**

Answer how many elements in the receiver should be inspected

#### 1.41.4 ContextPart: built ins

**`continue: anObject`**

Resume execution from the receiver, faking that the context on top
of it in the execution chain has returned anObject.  The receiver
must belong to the same process as the executing context, otherwise
the results are not predictable.  All #ensure: (and possibly
\#ifCurtailed:) blocks between the currently executing context and
the receiver are evaluated (which is not what would happen if you
directly bashed at the parent context of thisContext).

#### 1.41.5 ContextPart: copying

**`copyStack`**

Answer a copy of the entire stack.

**`deepCopy`**

Answer a copy of the entire stack, but don't copy any of the other
instance variables of the context.

#### 1.41.6 ContextPart: debugging

**`currentLine`**

Answer the 1-based number of the line that is pointed to by the
receiver's instruction pointer.  The DebugTools package caches
information, thus making the implementation faster.

**`currentLineInFile`**

Answer the 1-based number of the line that is pointed to by the
receiver's instruction pointer, relative to the method's file.  The
implementation is slow unless the DebugTools package is loaded.

**`debugger`**

Answer the debugger that is attached to the given context.  It is
always nil unless the DebugTools package is loaded.

**`debuggerClass`**

Answer which debugger should be used to debug the current context
chain.  The class with the highest debugging priority is picked
among those mentioned in the chain.

**`isInternalExceptionHandlingContext`**

Answer whether the receiver is a context that should be hidden to
the user when presenting a backtrace.

#### 1.41.7 ContextPart: enumerating

**`scanBacktraceFor: selectors do: aBlock`**

Scan the backtrace for contexts whose selector is among those
listed in selectors; if one is found, invoke aBlock passing the
context.

**`scanBacktraceForAttribute: selector do: aBlock`**

Scan the backtrace for contexts which have the attribute selector
listed in selectors; if one is found, invoke aBlock passing the
context and the attribute.

#### 1.41.8 ContextPart: printing

**`backtrace`**

Print a backtrace from the receiver to the bottom of the stack on
the Transcript.

**`backtraceOn: aStream`**

Print a backtrace from the caller to the bottom of the stack on
aStream.

#### 1.41.9 ContextPart: security checks

**`checkSecurityFor: perm`**

Answer the receiver.

**`doSecurityCheckForName: name actions: actions target: target`**

Not commented.

**`securityCheckForName: name`**

Not commented.

**`securityCheckForName: name action: action`**

Not commented.

**`securityCheckForName: name actions: actions target: target`**

Not commented.

**`securityCheckForName: name target: target`**

Not commented.

### 1.42 Continuation

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Implementation

At my heart, I am something like the goto instruction; my creation
sets the label, and my methods do the jump.  However, this is a
really powerful kind of goto instruction.  If your hair is turning
green at this point, don't worry as you will probably only deal
with users of continuations, rather than with the concept itself.

#### 1.42.1 Continuation class: instance creation

**`current`**

Return a continuation.

**`currentDo: aBlock`**

Pass a continuation to the one-argument block, aBlock and return
the result of evaluating it.

**`escapeDo: aBlock`**

Pass a continuation to the one-argument block, knowing that aBlock
does not fall off (either because it includes a method return, or
because it yields control to another continuation).  If it does, an
exception will be signalled and the current process terminated.

#### 1.42.2 Continuation: invocation

**`callCC`**

Activate the original continuation, passing back in turn a
continuation for the caller.  The called continuation becomes
unusable, and any attempt to reactivate it will cause an exception.
This is not a limitation, in general, because this method is used
to replace a continuation with another (see the implementation of
the Generator class).

**`oneShotValue`**

Return nil to the original continuation, which becomes unusable.
Attempting to reactivate it will cause an exception.  This is an
optimization over #value.

**`oneShotValue: v`**

Return anObject to the original continuation, which becomes
unusable.  Attempting to reactivate it will cause an exception.
This is an optimization over #value:.

**`value`**

Return nil to the original continuation, copying the stack to allow
another activation.

**`value: anObject`**

Return anObject to the original continuation, copying the stack to
allow another activation.

**`valueWithArguments: aCollection`**

Return the sole element of aCollection to the original continuation
(or nil if aCollection is empty), copying the stack to allow
another activation

### 1.43 CPtr

**Namespace:** Smalltalk · **Superclass:** [CAggregate](#115-caggregate) · **Category:** Language-C interface

#### 1.43.1 CPtr: accessing

**`alignof`**

Answer the receiver's required aligment

**`sizeof`**

Answer the receiver's size

**`value`**

Answer the address of the location pointed to by the receiver.

**`value: anObject`**

Set the address of the location pointed to by the receiver to
anObject, which can be either an Integer or a CObject.  if anObject
is an Integer, it is interpreted as a 32-bit or 64-bit address.  If
it is a CObject, its address is stored.

### 1.44 CPtrCType

**Namespace:** Smalltalk · **Superclass:** [CType](#152-ctype) · **Category:** Language-C interface

#### 1.44.1 CPtrCType class: instance creation

**`elementType: aCType`**

Answer a new instance of CPtrCType that maps pointers to the given
CType

**`from: type`**

Private - Called by computeAggregateType: for pointers

#### 1.44.2 CPtrCType: accessing

**`elementType`**

Answer the type of the elements in the receiver's instances

#### 1.44.3 CPtrCType: basic

**`= anObject`**

Return whether the receiver and anObject are equal.

**`hash`**

Return a hash code for the receiver.

#### 1.44.4 CPtrCType: storing

**`storeOn: aStream`**

Not commented.

### 1.45 CScalar

**Namespace:** Smalltalk · **Superclass:** [CObject](#136-cobject) · **Category:** Language-C interface

#### 1.45.1 CScalar class: instance creation

**`gcValue: anObject`**

Answer a newly allocated CObject containing the passed value,
anObject, in garbage-collected storage.

**`type`**

Answer a CType for the receiver--for example, CByteType if the
receiver is CByte.

**`value: anObject`**

Answer a newly allocated CObject containing the passed value,
anObject.  Remember to call #addToBeFinalized if you want the
CObject to be automatically freed

#### 1.45.2 CScalar: accessing

**`cObjStoredType`**

Private - Provide a conversion from a CObject to a Smalltalk object
to be stored by #at:put:

**`value`**

Answer the value the receiver is pointing to.  The exact returned
value depends on the receiver's class

**`value: aValue`**

Set the receiver to point to the value, aValue.  The exact meaning
of aValue depends on the receiver's class

### 1.46 CScalarCType

**Namespace:** Smalltalk · **Superclass:** [CType](#152-ctype) · **Category:** Language-C interface

#### 1.46.1 CScalarCType: accessing

**`valueType`**

valueType is used as a means to communicate to the interpreter the
underlying type of the data.  For scalars, it is supplied by the
CObject subclass.

#### 1.46.2 CScalarCType: storing

**`storeOn: aStream`**

Store Smalltalk code that compiles to the receiver

### 1.47 CShort

**Namespace:** Smalltalk · **Superclass:** [CScalar](#145-cscalar) · **Category:** Language-C interface

#### 1.47.1 CShort class: accessing

**`alignof`**

Answer the receiver's instances required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's instances
scalar type

**`sizeof`**

Answer the receiver's instances size

#### 1.47.2 CShort: accessing

**`alignof`**

Answer the receiver's required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's scalar type

**`sizeof`**

Answer the receiver's size

### 1.48 CSmalltalk

**Namespace:** Smalltalk · **Superclass:** [CScalar](#145-cscalar) · **Category:** Language-C interface

#### 1.48.1 CSmalltalk class: accessing

**`alignof`**

Answer the receiver's instances required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's instances
scalar type

**`sizeof`**

Answer the receiver's instances size

#### 1.48.2 CSmalltalk: accessing

**`alignof`**

Answer the receiver's required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's scalar type

**`sizeof`**

Answer the receiver's size

### 1.49 CString

**Namespace:** Smalltalk · **Superclass:** [CPtr](#143-cptr) · **Category:** Language-C interface

Technically, CString is really a pointer to CChar.  However, it can
be very useful as a distinct datatype because it is a separate
datatype in Smalltalk, so we allow developers to express their
semantics more precisely by using a more descriptive type.

Note that like CChar is a pointer to char, CString is actually a
\*pointer\* to string: a char \*\* in C terms.  If you need to take a
String out of a char \*, use CChar\>\>#asString.

In general, I behave like a cross between an array of characters
and a pointer to a character.  I provide the protocol for both data
types.  My #value method returns a Smalltalk String, as you would
expect for a scalar datatype.

#### 1.49.1 CString class: accessing

**`cObjStoredType`**

Private - Provide a conversion from a CObject to a Smalltalk object
to be stored by #at:put:

#### 1.49.2 CString class: instance creation

**`type`**

Answer a CType for the receiver--for example, CByteType if the
receiver is CByte.

**`value: anObject`**

Answer a newly allocated CObject containing the passed value,
anObject.  Remember to call #addToBeFinalized if you want the
CObject to be automatically freed

#### 1.49.3 CString: accessing

**`cObjStoredType`**

Private - Provide a conversion from a CObject to a Smalltalk object
to be stored by #at:put:

**`value`**

Answer the value the receiver is pointing to.  The exact returned
value depends on the receiver's class

**`value: aValue`**

Set the receiver to point to the value, aValue.  The exact meaning
of aValue depends on the receiver's class

### 1.50 CStringCType

**Namespace:** Smalltalk · **Superclass:** [CScalarCType](#146-cscalarctype) · **Category:** Language-C interface

#### 1.50.1 CStringCType: accessing

**`elementType`**

Answer the type of the elements in the receiver's instances

### 1.51 CStruct

**Namespace:** Smalltalk · **Superclass:** [CCompound](#124-ccompound) · **Category:** Language-C interface

#### 1.51.1 CStruct class: subclass creation

**`declaration: array`**

Compile methods that implement the declaration in array.

### 1.52 CType

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-C interface

I am not part of the standard Smalltalk kernel class hierarchy.  I
contain type information used by subclasses of CObject, which
represents external C data items.

My only instance variable, cObjectType, is used to hold onto the
CObject subclass that gets created for a given CType.  Used
primarily in the C part of the interpreter because internally it
cannot execute methods to get values, so it has a simple way to
access instance variable which holds the desired subclass.

My subclasses have instances which represent the actual data types;
for the scalar types, there is only one instance created of each,
but for the aggregate types, there is at least one instance per
base type and/or number of elements.

#### 1.52.1 CType class: C instance creation

**`cObjectBinding: aCObjectSubclassBinding`**

Create a new CType for the given subclass of CObject

**`cObjectType: aCObjectSubclass`**

Create a new CType for the given subclass of CObject

**`computeAggregateType: type`**

Private - Called by from: for pointers/arrays.  Format of type:
(#array #int 3) or (#ptr #{FooStruct})

**`from: type`**

Private - Pass the size, alignment, and description of CType for
aBlock, given the field description in 'type' (the second element
of each pair).

#### 1.52.2 CType class: initialization

**`initialize`**

Initialize the receiver's TypeMap

#### 1.52.3 CType: accessing

**`alignof`**

Answer the size of the receiver's instances

**`arrayType: size`**

Answer a CArrayCType which represents an array with the given size
of CObjects whose type is in turn represented by the receiver

**`cObjectType`**

Answer the CObject subclass whose instance is created when new is
sent to the receiver

**`new: anInteger`**

Allocate a new CObject with room for anInteger C objects of the
type (class) identified by the receiver.  It is the caller's
responsibility to free the memory allocated for it.

**`ptrType`**

Answer a CPtrCType which represents a pointer to CObjects whose
type is in turn represented by the receiver

**`sizeof`**

Answer the size of the receiver's instances

**`valueType`**

valueType is used as a means to communicate to the interpreter the
underlying type of the data.  For anything but scalars, it's just
'self'

#### 1.52.4 CType: basic

**`= anObject`**

Return whether the receiver and anObject are equal.

**`hash`**

Return a hash code for the receiver.

#### 1.52.5 CType: C instance creation

**`address: cObjOrInt`**

Create a new CObject with the type (class) identified by the
receiver, pointing to the given address (identified by an Integer
or CObject).

**`gcNew`**

Allocate a new CObject with the type (class) identified by the
receiver.  The object is movable in memory, but on the other hand
it is garbage-collected automatically.

**`gcNew: anInteger`**

Allocate a new CObject with room for anInteger C object of the type
(class) identified by the receiver.  The object is movable in
memory, but on the other hand it is garbage-collected
automatically.

**`new`**

Allocate a new CObject with the type (class) identified by the
receiver.  It is the caller's responsibility to free the memory
allocated for it.

#### 1.52.6 CType: storing

**`storeOn: aStream`**

Store Smalltalk code that compiles to the receiver

### 1.53 CUChar

**Namespace:** Smalltalk · **Superclass:** [CScalar](#145-cscalar) · **Category:** Language-C interface

#### 1.53.1 CUChar class: getting info

**`alignof`**

Answer the receiver's instances required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's instances
scalar type

**`sizeof`**

Answer the receiver's instances size

#### 1.53.2 CUChar: accessing

**`alignof`**

Answer the receiver's required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's scalar type

**`sizeof`**

Answer the receiver's size

### 1.54 CUInt

**Namespace:** Smalltalk · **Superclass:** [CScalar](#145-cscalar) · **Category:** Language-C interface

#### 1.54.1 CUInt class: accessing

**`alignof`**

Answer the receiver's instances required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's instances
scalar type

**`sizeof`**

Answer the receiver's instances size

#### 1.54.2 CUInt: accessing

**`alignof`**

Answer the receiver's required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's scalar type

**`sizeof`**

Answer the receiver's size

### 1.55 CULong

**Namespace:** Smalltalk · **Superclass:** [CScalar](#145-cscalar) · **Category:** Language-C interface

#### 1.55.1 CULong class: accessing

**`alignof`**

Answer the receiver's instances required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's instances
scalar type

**`sizeof`**

Answer the receiver's instances size

#### 1.55.2 CULong: accessing

**`alignof`**

Answer the receiver's required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's scalar type

**`sizeof`**

Answer the receiver's size

### 1.56 CULongLong

**Namespace:** Smalltalk · **Superclass:** [CScalar](#145-cscalar) · **Category:** Language-C interface

#### 1.56.1 CULongLong class: accessing

**`alignof`**

Answer the receiver's instances required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's instances
scalar type

**`sizeof`**

Answer the receiver's instances size

#### 1.56.2 CULongLong: accessing

**`alignof`**

Answer the receiver's required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's scalar type

**`sizeof`**

Answer the receiver's size

### 1.57 CUnion

**Namespace:** Smalltalk · **Superclass:** [CCompound](#124-ccompound) · **Category:** Language-C interface

#### 1.57.1 CUnion class: subclass creation

**`declaration: array`**

Compile methods that implement the declaration in array.

### 1.58 CUShort

**Namespace:** Smalltalk · **Superclass:** [CScalar](#145-cscalar) · **Category:** Language-C interface

#### 1.58.1 CUShort class: accessing

**`alignof`**

Answer the receiver's instances required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's instances
scalar type

**`sizeof`**

Answer the receiver's instances size

#### 1.58.2 CUShort: accessing

**`alignof`**

Answer the receiver's required aligment

**`cObjStoredType`**

Private - Answer an index referring to the receiver's scalar type

**`sizeof`**

Answer the receiver's size

### 1.59 Date

**Namespace:** Smalltalk · **Superclass:** [Magnitude](#1107-magnitude) · **Category:** Language-Data types

My instances represent dates.  My base date is defined to be Jan 1,
1901\.  I provide methods for instance creation (including via
"symbolic" dates, such as "Date newDay: 14 month: #Feb year: 1990".

PLEASE BE WARNED - use this class only for dates after 1582 AD;
that's the beginning of the epoch.  Dates before 1582 will not be
correctly printed.  In addition, since ten days were lost from
October 5 through October 15, operations between a Gregorian date
(after 15-Oct-1582) and a Julian date (before 5-Oct-1582) will give
incorrect results; or, 4-Oct-1582 + 2 days will yield 6-Oct-1582 (a
non-existent day!), not 16-Oct-1582.

In fact, if you pass a year \< 1582 to a method like
\#newDay:month:year: it will assume that it is a two-digit year
(e.g.  90=1990, 1000=2900).  The only way to create Julian calendar
dates is with the #fromDays: instance creation method.

#### 1.59.1 Date class: basic

**`abbreviationOfDay: dayIndex`**

Answer the abbreviated name of the day of week corresponding to the
given index

**`dayOfWeek: dayName`**

Answer the index of the day of week corresponding to the given name

**`daysInMonth: monthName forYear: yearInteger`**

Answer the number of days in the given (named) month for the given
year

**`daysInYear: i`**

Answer the number of days in the given year

**`indexOfMonth: monthName`**

Answer the index of the month corresponding to the given name

**`initDayNameDict`**

Initialize the DayNameDict to the names of the days

**`initMonthNameDict`**

Initialize the MonthNameDict to the names of the months

**`initialize`**

Initialize the receiver

**`nameOfDay: dayIndex`**

Answer the name of the day of week corresponding to the given index

**`nameOfMonth: monthIndex`**

Answer the name of the month corresponding to the given index

**`shortNameOfMonth: monthIndex`**

Answer the name of the month corresponding to the given index

#### 1.59.2 Date class: instance creation (ANSI)

**`year: y day: d hour: h minute: min second: s`**

Answer a Date denoting the d-th day of the given year

**`year: y month: m day: d hour: h minute: min second: s`**

Answer a Date denoting the d-th day of the given (as a number)
month and year

#### 1.59.3 Date class: instance creation (Blue Book)

**`dateAndTimeNow`**

Answer an array containing the current date and time

**`fromDays: dayCount`**

Answer a Date denoting dayCount days past 1/1/1901

**`fromJulian: jd`**

Answer a Date denoting the jd-th day in the astronomical Julian
calendar.

**`fromSeconds: time`**

Answer a Date denoting the date time seconds past Jan 1st, 1901

**`newDay: day month: monthName year: yearInteger`**

Answer a Date denoting the dayCount day of the given (named) month
and year

**`newDay: day monthIndex: monthIndex year: yearInteger`**

Answer a Date denoting the dayCount day of the given (as a number)
month and year

**`newDay: dayCount year: yearInteger`**

Answer a Date denoting the dayCount day of the yearInteger year

**`readFrom: aStream`**

Parse an instance of the receiver from aStream

**`today`**

Answer a Date denoting the current date in local time

**`utcDateAndTimeNow`**

Answer an array containing the current date and time in Coordinated
Universal Time (UTC)

**`utcToday`**

Answer a Date denoting the current date in Coordinated Universal
Time (UTC)

#### 1.59.4 Date: basic

**`- aDate`**

Answer a new Duration counting the number of days between the
receiver and aDate.

**`addDays: dayCount`**

Answer a new Date pointing dayCount past the receiver

**`subtractDate: aDate`**

Answer the number of days between aDate and the receiver (negative
if the receiver is before aDate)

**`subtractDays: dayCount`**

Answer a new Date pointing dayCount before the receiver

#### 1.59.5 Date: compatibility (non-ANSI)

**`day`**

Answer the day represented by the receiver

**`dayName`**

Answer the day of week of the receiver as a Symbol

**`shortMonthName`**

Answer the abbreviated name of the month represented by the
receiver

#### 1.59.6 Date: date computations

**`asSeconds`**

Answer the date as the number of seconds from 1/1/1901.

**`dayOfMonth`**

Answer the day represented by the receiver (same as #day)

**`dayOfWeek`**

Answer the day of week of the receiver.  1 = Monday, 7 = Sunday

**`dayOfWeekAbbreviation`**

Answer the day of week of the receiver as a Symbol

**`dayOfWeekName`**

Answer the day of week of the receiver as a Symbol

**`dayOfYear`**

Answer the days passed since 31/12 of last year; e.g.  New Year's
Day is 1

**`daysFromBaseDay`**

Answer the days passed since 1/1/1901

**`daysInMonth`**

Answer the days in the month represented by the receiver

**`daysInYear`**

Answer the days in the year represented by the receiver

**`daysLeftInMonth`**

Answer the days to the end of the month represented by the receiver

**`daysLeftInYear`**

Answer the days to the end of the year represented by the receiver

**`firstDayOfMonth`**

Answer a Date representing the first day of the month represented
by the receiver

**`isLeapYear`**

Answer whether the receiver refers to a date in a leap year.

**`lastDayOfMonth`**

Answer a Date representing the last day of the month represented by
the receiver

**`month`**

Answer the index of the month represented by the receiver

**`monthAbbreviation`**

Answer the abbreviated name of the month represented by the
receiver

**`monthIndex`**

Answer the index of the month represented by the receiver

**`monthName`**

Answer the name of the month represented by the receiver

**`year`**

Answer the year represented by the receiver

#### 1.59.7 Date: printing

**`printOn: aStream`**

Print a representation for the receiver on aStream

#### 1.59.8 Date: still unclassified

**`+ aDuration`**

Answer a new Date or DateTime pointing aDuration time past the
receiver.

#### 1.59.9 Date: storing

**`storeOn: aStream`**

Store on aStream Smalltalk code compiling to the receiver

#### 1.59.10 Date: testing

**`< aDate`**

Answer whether the receiver indicates a date preceding aDate

**`= aDate`**

Answer whether the receiver indicates the same date as aDate

**`hash`**

Answer an hash value for the receievr

### 1.60 DateTime

**Namespace:** Smalltalk · **Superclass:** [Date](#159-date) · **Category:** Language-Data types

My instances represent timestamps.

#### 1.60.1 DateTime class: information

**`clockPrecision`**

Answer 'ClockPrecision'.

**`initialize`**

Initialize the receiver's class variables

#### 1.60.2 DateTime class: instance creation

**`now`**

Answer an instance of the receiver referring to the current date
and time.

**`readFrom: aStream`**

Parse an instance of the receiver from aStream

**`today`**

Answer an instance of the receiver referring to midnight of today
in local time.

**`year: y day: d hour: h minute: min second: s`**

Answer a DateTime denoting the d-th day of the given year, and
setting the time part to the given hour, minute, and second

**`year: y day: d hour: h minute: min second: s offset: ofs`**

Answer a DateTime denoting the d-th day of the given year.  Set the
offset field to ofs (a Duration), and the time part to the given
hour, minute, and second

**`year: y month: m day: d hour: h minute: min second: s`**

Answer a DateTime denoting the d-th day of the given (as a number)
month and year, setting the time part to the given hour, minute,
and second

**`year: y month: m day: d hour: h minute: min second: s offset: ofs`**

Answer a DateTime denoting the d-th day of the given (as a number)
month and year.  Set the offset field to ofs (a Duration), and the
the time part to the given hour, minute, and second

#### 1.60.3 DateTime class: instance creation (non-ANSI)

**`date: aDate time: aTime`**

Answer a DateTime denoting the given date and time.  Set the offset
field to ofs (a Duration).

**`date: aDate time: aTime offset: ofs`**

Answer a DateTime denoting the given date and time.  Set the offset
field to ofs (a Duration).

**`fromDays: days seconds: secs`**

Answer a DateTime denoting the given date (as days since January 1,
1901\) and time (as seconds since UTC midnight).

**`fromDays: days seconds: secs offset: ofs`**

Answer a DateTime denoting the given date (as days since January 1,
1901\) and time (as seconds since midnight).  Set the offset field
to ofs (a Duration).

**`fromSeconds: secs`**

Answer a DateTime denoting the given date and time (as seconds
since January 1, 1901 midnight UTC).

**`fromSeconds: secs offset: ofs`**

Answer a DateTime denoting the given date and time (as seconds
since January 1, 1901 midnight).  Set the offset field to ofs (a
Duration).

#### 1.60.4 DateTime: basic

**`+ aDuration`**

Answer a new Date pointing aDuration time past the receiver

**`- aDateTimeOrDuration`**

Answer a new Date pointing dayCount before the receiver

#### 1.60.5 DateTime: computations

**`asSeconds`**

Answer the date as the number of seconds from 1/1/1901.

**`dayOfWeek`**

Answer the day of week of the receiver.  Unlike Dates, DateAndTimes
have 1 = Sunday, 7 = Saturday

**`hour`**

Answer the hour in a 24-hour clock

**`hour12`**

Answer the hour in a 12-hour clock

**`hour24`**

Answer the hour in a 24-hour clock

**`meridianAbbreviation`**

Answer either #AM (for anti-meridian) or #PM (for post-meridian)

**`minute`**

Answer the minute

**`second`**

Answer the month represented by the receiver

#### 1.60.6 DateTime: printing

**`printOn: aStream`**

Print a representation for the receiver on aStream

#### 1.60.7 DateTime: splitting in dates & times

**`asDate`**

Answer a Date referring to the same day as the receiver

**`asTime`**

Answer a Time referring to the same time (from midnight) as the
receiver

**`at: anIndex`**

Since in the past timestamps were referred to as Arrays containing
a Date and a Time (in this order), this method provides access to
DateTime objects like if they were two-element Arrays.

#### 1.60.8 DateTime: storing

**`storeOn: aStream`**

Store on aStream Smalltalk code compiling to the receiver

#### 1.60.9 DateTime: testing

**`< aDateTime`**

Answer whether the receiver indicates a date preceding aDate

**`= aDateTime`**

Answer whether the receiver indicates the same date as aDate

**`hash`**

Answer an hash value for the receievr

#### 1.60.10 DateTime: time zones

**`asLocal`**

Answer the receiver, since DateTime objects store themselves in
Local time

**`asUTC`**

Convert the receiver to UTC time, and answer a new DateTime object.

**`offset`**

Answer the receiver's offset from UTC to local time (e.g.  +3600
seconds for Central Europe Time, -3600\*6 seconds for Eastern
Standard Time).  The offset is expressed as a Duration

**`offset: anOffset`**

Answer a copy of the receiver with the offset from UTC to local
time changed to anOffset (a Duration).

**`timeZoneAbbreviation`**

Answer an abbreviated indication of the receiver's offset,
expressed as 'shhmm', where 'hh' is the number of hours and 'mm' is
the number of minutes between UTC and local time, and 's' can be
'+' for the Eastern hemisphere and '-' for the Western hemisphere.

**`timeZoneName`**

Answer the time zone name for the receiver (currently, it is simply
'GMT +xxxx', where 'xxxx' is the receiver's #timeZoneAbbreviation).

### 1.61 DeferredVariableBinding

**Namespace:** Smalltalk · **Superclass:** [LookupKey](#1105-lookupkey) · **Category:** Language-Data types

I represent a binding to a variable that is not tied to a
particular dictionary until the first access.  Then, lookup rules
for global variables in the scope of a given class are used.

#### 1.61.1 DeferredVariableBinding class: basic

**`key: aSymbol class: aClass defaultDictionary: aDictionary`**

Answer a binding that will look up aSymbol as a variable in
aClass's environment at first access.  See #resolveBinding's
comment for aDictionary's meaning.

**`path: anArray class: aClass defaultDictionary: aDictionary`**

As with #key:class:defaultDictionary:, but accepting an array of
symbols, representing a namespace path, instead.

#### 1.61.2 DeferredVariableBinding: basic

**`path`**

Answer the path followed after resolving the first key.

**`value`**

Answer a new instance of the receiver with the given key and value

**`value: anObject`**

Answer a new instance of the receiver with the given key and value

#### 1.61.3 DeferredVariableBinding: storing

**`printOn: aStream`**

Put on aStream some Smalltalk code compiling to the receiver

**`storeOn: aStream`**

Put on aStream some Smalltalk code compiling to the receiver

### 1.62 Delay

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Kernel-Processes

I am the ultimate agent for frustration in the world.  I cause
things to wait (sometimes much more than is appropriate, but it is
those losing operating systems' fault).  When a process sends one
of my instances a wait message, that process goes to sleep for the
interval specified when the instance was created.

#### 1.62.1 Delay class: instance creation

**`forMilliseconds: millisecondCount`**

Answer a Delay waiting for millisecondCount milliseconds

**`forNanoseconds: nanosecondCount`**

Answer a Delay waiting for nanosecondCount nanoseconds

**`forSeconds: secondCount`**

Answer a Delay waiting for secondCount seconds

**`untilMilliseconds: millisecondCount`**

Answer a Delay waiting until millisecondCount milliseconds after
startup

**`untilNanoseconds: nanosecondCount`**

Answer a Delay waiting until nanosecondCount nanoseconds after
startup

#### 1.62.2 Delay class: still unclassified

**`update: aspect`**

Prime the timer event loop when the image starts running.

#### 1.62.3 Delay class: timer process

**`activeDelay`**

Return the delay at the head of the queue.

**`handleDelayRequestor`**

Handle a timer event; which can be either: - a schedule or
unschedule request (DelayRequestor notNil) - a timer signal (not
explicitly specified) We check for timer expiry every time we get a
signal.

**`runDelayProcess`**

Run the timer event loop.

**`scheduleDelay: aDelay`**

Private - Schedule this Delay.  Run in the timer process, which is
the only one that manipulates Queue.

**`startDelayLoop`**

Start the timer event loop.

**`unscheduleDelay: aDelay`**

Private - Unschedule this Delay.  Run in the timer process, which
is the only one that manipulates Queue.

#### 1.62.4 Delay: accessing

**`asAbsolute`**

Answer a delay that waits until the current delay's resumptionTime,
or delayDuration milliseconds from now if that would be nil.  May
answer the receiver if it is already waiting until an absolute
time.

**`delayDuration`**

Answer the time I have left to wait, in milliseconds.

**`isAbsolute`**

Answer whether the receiver waits until an absolute time on the
millisecond clock.

**`resumptionTime`**

Answer 'resumptionTime'.

#### 1.62.5 Delay: comparing

**`= aDelay`**

Answer whether the receiver and aDelay denote the same delay

**`hash`**

Answer an hash value for the receiver

#### 1.62.6 Delay: copying

**`postCopy`**

Adjust the current delay so that it behaves as if it had just been
created.

#### 1.62.7 Delay: delaying

**`timedWaitOn: aSemaphore`**

Schedule this Delay and wait on it.  The current process will be
suspended for the amount of time specified when this Delay was
created, or until aSemaphore is signaled.

**`wait`**

Schedule this Delay and wait on it.  The current process will be
suspended for the amount of time specified when this Delay was
created.

#### 1.62.8 Delay: initialization

**`initForNanoseconds: value`**

Initialize a Delay waiting for millisecondCount milliseconds

#### 1.62.9 Delay: instance creation

**`initUntilNanoseconds: value`**

Initialize a Delay waiting for millisecondCount milliseconds after
startup

#### 1.62.10 Delay: testing

**`isActive`**

Answer whether this Delay is being waited on.

#### 1.62.11 Delay: timeout

**`value: aBlock onTimeoutDo: aTimeoutBlock`**

Execute aBlock for up to the time of my own delay; in case the code
did not finish abort the execution, unwind the block and then
evaluate aTimeoutBlock.

### 1.63 DelayedAdaptor

**Namespace:** Smalltalk · **Superclass:** [PluggableAdaptor](#1130-pluggableadaptor) · **Category:** Language-Data types

I can be used where many expensive updates must be performed.  My
instances buffer the last value that was set, and only actually set
the value when the #trigger message is sent.  Apart from this, I'm
equivalent to PluggableAdaptor.

#### 1.63.1 DelayedAdaptor: accessing

**`trigger`**

Really set the value of the receiver.

**`value`**

Get the value of the receiver.

**`value: anObject`**

Set the value of the receiver - actually, the value is cached and
is not set until the #trigger method is sent.

### 1.64 Dictionary

**Namespace:** Smalltalk · **Superclass:** [HashedCollection](#188-hashedcollection) · **Category:** Collections-Keyed

I implement a dictionary, which is an object that is indexed by
unique objects (typcially instances of Symbol), and associates
another object with that index.  I use the equality operator = to
determine equality of indices.

In almost all places where you would use a plain Dictionary, a
LookupTable would be more efficient; see LookupTable's comment
before you use it.  I do have a couple of special features that are
useful in certain special cases.

#### 1.64.1 Dictionary class: instance creation

**`from: anArray`**

Answer a new dictionary created from the keys and values of
Associations in anArray, such as {1 -\> 2.  3 -\> 4}.  anArray should
be specified using brace-syntax.

**`new`**

Create a new dictionary with a default size

#### 1.64.2 Dictionary: accessing

**`add: newObject`**

Add the newObject association to the receiver

**`addAll: aCollection`**

Adds all the elements of 'aCollection' to the receiver, answer
aCollection

**`associationAt: key`**

Answer the key/value Association for the given key.  Fail if the
key is not found

**`associationAt: key ifAbsent: aBlock`**

Answer the key/value Association for the given key.  Evaluate
aBlock (answering the result) if the key is not found

**`associations`**

Returns the content of a Dictionary as a Set of Associations.

**`at: key`**

Answer the value associated to the given key.  Fail if the key is
not found

**`at: key ifAbsent: aBlock`**

Answer the value associated to the given key, or the result of
evaluating aBlock if the key is not found

**`at: aKey ifAbsentPut: aBlock`**

Answer the value associated to the given key.  If the key is not
found, evaluate aBlock and associate the result to aKey before
returning.

**`at: aKey ifPresent: aBlock`**

If aKey is absent, answer nil.  Else, evaluate aBlock passing the
associated value and answer the result of the invocation

**`at: key put: value`**

Store value as associated to the given key

**`atAll: keyCollection`**

Answer a Dictionary that only includes the given keys.  Fail if any
of them is not found

**`keyAtValue: value`**

Answer the key associated to the given value, or nil if the value
is not found

**`keyAtValue: value ifAbsent: exceptionBlock`**

Answer the key associated to the given value.  Evaluate
exceptionBlock (answering the result) if the value is not found.
IMPORTANT: == is used to compare values

**`keys`**

Answer a kind of Set containing the keys of the receiver

**`values`**

Answer an Array containing the values of the receiver

#### 1.64.3 Dictionary: awful ST-80 compatibility hacks

**`findKeyIndex: key`**

Tries to see if key exists as a the key of an indexed variable.  As
soon as nil or an association with the correct key is found, the
index of that slot is answered

#### 1.64.4 Dictionary: compilation

**`scopeDictionary`**

Answer the dictionary that is used when the receiver is before a
period in Smalltalk source code.

#### 1.64.5 Dictionary: dictionary enumerating

**`associationsDo: aBlock`**

Pass each association in the dictionary to aBlock

**`collect: aBlock`**

Answer a new dictionary where the keys are the same and the values
are obtained by passing each value to aBlock and collecting the
return values

**`do: aBlock`**

Pass each value in the dictionary to aBlock

**`keysAndValuesDo: aBlock`**

Pass each key/value pair in the dictionary as two distinct
parameters to aBlock

**`keysDo: aBlock`**

Pass each key in the dictionary to aBlock

**`reject: aBlock`**

Answer a new dictionary containing the key/value pairs for which
aBlock returns false.  aBlock only receives the value part of the
pairs.

**`select: aBlock`**

Answer a new dictionary containing the key/value pairs for which
aBlock returns true.  aBlock only receives the value part of the
pairs.

#### 1.64.6 Dictionary: dictionary removing

**`remove: anAssociation`**

Remove anAssociation's key from the dictionary

**`remove: anAssociation ifAbsent: aBlock`**

Remove anAssociation's key from the dictionary

**`removeAllKeys: keys`**

Remove all the keys in keys, without raising any errors

**`removeAllKeys: keys ifAbsent: aBlock`**

Remove all the keys in keys, passing the missing keys as parameters
to aBlock as they're encountered

**`removeKey: key`**

Remove the passed key from the dictionary, fail if it is not found

**`removeKey: key ifAbsent: aBlock`**

Remove the passed key from the dictionary, answer the result of
evaluating aBlock if it is not found

#### 1.64.7 Dictionary: dictionary testing

**`includes: anObject`**

Answer whether the receiver contains anObject as one of its values

**`includesAssociation: anAssociation`**

Answer whether the receiver contains the key which is
anAssociation's key and its value is anAssociation's value

**`includesKey: key`**

Answer whether the receiver contains the given key

**`occurrencesOf: aValue`**

Answer whether the number of occurrences of aValue as one of the
receiver's values

#### 1.64.8 Dictionary: namespace protocol

**`allSuperspaces`**

Answer all the receiver's superspaces in a collection

**`allSuperspacesDo: aBlock`**

Evaluate aBlock once for each of the receiver's superspaces (which
is none for BindingDictionary).

**`definedKeys`**

Answer a kind of Set containing the keys of the receiver

**`definesKey: key`**

Answer whether the receiver defines the given key.  'Defines' means
that the receiver's superspaces, if any, are not considered.

**`hereAssociationAt: key`**

Return the association for the variable named as specified by 'key'
\*in this namespace\*.  If the key is not found search will \*not\* be
carried on in superspaces and the method will fail.

**`hereAssociationAt: key ifAbsent: aBlock`**

Return the association for the variable named as specified by 'key'
\*in this namespace\*.  If the key is not found search will \*not\* be
carried on in superspaces and aBlock will be immediately evaluated.

**`hereAt: key`**

Return the value associated to the variable named as specified by
'key' \*in this namespace\*.  If the key is not found search will
\*not\* be carried on in superspaces and the method will fail.

**`hereAt: key ifAbsent: aBlock`**

Return the value associated to the variable named as specified by
'key' \*in this namespace\*.  If the key is not found search will
\*not\* be carried on in superspaces and aBlock will be immediately
evaluated.

**`inheritsFrom: aNamespace`**

Answer whether aNamespace is one of the receiver's direct and
indirect superspaces

**`superspace`**

Answer the receiver's superspace, which is nil for
BindingDictionary.

**`withAllSuperspaces`**

Answer the receiver and all of its superspaces in a collection,
which is none for BindingDictionary

**`withAllSuperspacesDo: aBlock`**

Invokes aBlock for the receiver and all superspaces, both direct
and indirect (though a BindingDictionary does not have any).

#### 1.64.9 Dictionary: printing

**`examineOn: aStream`**

Print all the instance variables and objects in the receiver on
aStream

**`printOn: aStream`**

Print a representation of the receiver on aStream

#### 1.64.10 Dictionary: rehashing

**`rehash`**

Rehash the receiver

#### 1.64.11 Dictionary: removing

**`removeAllKeysSuchThat: aBlock`**

Remove from the receiver all keys for which aBlock returns true.

#### 1.64.12 Dictionary: storing

**`storeOn: aStream`**

Print Smalltalk code compiling to the receiver on aStream

#### 1.64.13 Dictionary: testing

**`= aDictionary`**

Answer whether the receiver and aDictionary are equal

**`hash`**

Answer the hash value for the receiver

### 1.65 DirectedMessage

**Namespace:** Smalltalk · **Superclass:** [Message](#1110-message) · **Category:** Language-Implementation

I represent a message send: I contain the receiver, selector and
arguments for a message.

#### 1.65.1 DirectedMessage class: creating instances

**`receiver: anObject selector: aSymbol`**

Create a new instance of the receiver

**`receiver: receiverObject selector: aSymbol argument: argumentObject`**

Create a new instance of the receiver

**`receiver: anObject selector: aSymbol arguments: anArray`**

Create a new instance of the receiver

**`selector: aSymbol arguments: anArray`**

This method should not be called for instances of this class.

**`selector: aSymbol arguments: anArray receiver: anObject`**

Create a new instance of the receiver

#### 1.65.2 DirectedMessage: accessing

**`receiver`**

Answer the receiver

**`receiver: anObject`**

Change the receiver

#### 1.65.3 DirectedMessage: basic

**`printOn: aStream`**

Print a representation of the receiver on aStream

**`send`**

Send the message

**`value`**

Send the message (this message provides interoperability between
DirectedMessages and blocks)

**`value: anObject`**

Send the message with the sole argument anObject (this message
provides interoperability between DirectedMessages and blocks)

**`value: obj1 value: obj2`**

Send the message with the arguments obj1 and obj2 (this message
provides interoperability between DirectedMessages and blocks)

**`valueWithArguments: anArray`**

Send the message with the arguments replaced by anArray (this
message provides interoperability between DirectedMessages and
blocks)

#### 1.65.4 DirectedMessage: multiple process

**`fork`**

Create a new process executing the receiver and start it

**`forkAt: priority`**

Create a new process executing the receiver with given priority and
start it

**`newProcess`**

Create a new process executing the receiver in suspended state.
The priority is the same as for the calling process.  The receiver
must not contain returns

#### 1.65.5 DirectedMessage: saving and loading

**`reconstructOriginalObject`**

This method is used when DirectedMessages are used together with
PluggableProxies (see ObjectDumper).  It sends the receiver to
reconstruct the object that was originally stored.

### 1.66 Directory

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Streams-Files

I am the counterpart of File in a tree-structured file system.  I
provide the notion of a current working directory and know several
well-known places in the file system.

However, all navigation methods for directories are under FilePath
or File for efficiency reasons.  Refer to the manual of FilePath
for information on how to use the instances returned by my class
methods.

#### 1.66.1 Directory class: file name management

**`append: fileName to: directory`**

Answer the name of a file named 'fileName' which resides in a
directory named 'directory'.

**`pathSeparator`**

Answer (as a Character) the character used to separate directory
names

**`pathSeparatorString`**

Answer (in a String) the character used to separate directory names

#### 1.66.2 Directory class: file operations

**`allFilesMatching: aPattern do: aBlock`**

Invoke #allFilesMatching:do: on the current working directory.

**`create: dirName`**

Create a directory named dirName and answer it.

**`createTemporary: prefix`**

Create an empty directory whose name starts with prefix and answer
it.

**`working`**

Answer the current working directory, not following symlinks.

**`working: dirName`**

Change the current working directory to dirName.

#### 1.66.3 Directory class: reading system defaults

**`execPrefix`**

Answer the path to GNU Smalltalk's executable installation prefix

**`home`**

Answer the path to the user's home directory

**`image`**

Answer the path to GNU Smalltalk's image file

**`kernel`**

Answer the path in which a local version of the GNU Smalltalk
kernel's Smalltalk source files were searched when the image was
created.

**`libexec`**

Answer the path to GNU Smalltalk's auxiliary executables

**`localKernel`**

Answer the path to the GNU Smalltalk kernel's Smalltalk source
files.  Same as 'Directory kernel' since GNU Smalltalk 3.0.

**`module`**

Answer the path to GNU Smalltalk's dynamically loaded modules

**`prefix`**

Answer the path to GNU Smalltalk's installation prefix

**`systemKernel`**

Answer the path to the installed Smalltalk kernel source files.

**`temporary`**

Answer the path in which temporary files can be created.  This is
read from the environment, and guessed if that fails.

**`userBase`**

Answer the base path under which file for user customization of GNU
Smalltalk are stored.

### 1.67 DLD

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-C interface

...and Gandalf said: "Many folk like to know beforehand what is to
be set on the table; but those who have laboured to prepare the
feast like to keep their secret; for wonder makes the words of
praise louder."

I am just an ancillary class used to reference some C functions.
Most of my actual functionality is used by redefinitions of methods
in CFunctionDescriptor.

#### 1.67.1 DLD class: C call-outs

**`defineCFunc: aName as: aFuncAddr`**

Register aFuncAddr as the target for cCalls to aName.

#### 1.67.2 DLD class: dynamic linking

**`addLibrary: library`**

Add library to the search path of libraries to be used by DLD.

**`addLibraryHandle: libraryHandle`**

This is called internally by gst\_dlopen.  The library will be open
and put in the search path.

**`addModule: library`**

Add library to the list of modules to be loaded when the image is
started.  The gst\_initModule function in the library is called, but
the library will not be put in the search path used whenever a C
function is requested but not registered.

**`defineExternFunc: aFuncName`**

This method calls #primDefineExternFunc: to try to link to a
function with the given name, and answers whether the linkage was
successful.  You can redefine this method to restrict the ability
to do dynamic linking.

**`initialize`**

Private - Initialize the receiver's class variables

**`libraryList`**

Answer a copy of the search path of libraries to be used by DLD

**`moduleList`**

Answer a copy of the modules reloaded when the image is started

**`primDefineExternFunc: aFuncName`**

This method tries to link to a function with the given name, and
answers whether the linkage was successful.  It should not be
overridden.

**`update: aspect`**

Called on startup - Make DLD re-link and reset the addresses of all
the externally defined functions

### 1.68 DumperProxy

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Streams-Files

I am an helper class for ObjectDumper.  When an object cannot be
saved in the standard way, you can register a subclass of me to
provide special means to save that object.

#### 1.68.1 DumperProxy class: accessing

**`acceptUsageForClass: aClass`**

The receiver was asked to be used as a proxy for the class aClass.
Answer whether the registration is fine.  By default, answer true

**`loadFrom: anObjectDumper`**

Reload a proxy stored in anObjectDumper and reconstruct the object

#### 1.68.2 DumperProxy class: instance creation

**`on: anObject`**

Answer a proxy to be used to save anObject.  This method MUST be
overridden and anObject must NOT be stored in the object's instance
variables unless you override #dumpTo:, because that would result
in an infinite loop!

#### 1.68.3 DumperProxy: saving and restoring

**`dumpTo: anObjectDumper`**

Dump the proxy to anObjectDumper - the #loadFrom: class method will
reconstruct the original object.

**`object`**

Reconstruct the object stored in the proxy and answer it

### 1.69 Duration

**Namespace:** Smalltalk · **Superclass:** [Time](#1199-time) · **Category:** Language-Data types

My instances represent differences between timestamps.

#### 1.69.1 Duration class: instance creation

**`days: d`**

Answer a duration of 'd' days

**`days: d hours: h minutes: m seconds: s`**

Answer a duration of 'd' days and the given number of hours,
minutes, and seconds.

**`initialize`**

Initialize the receiver's instance variables

**`milliseconds: msec`**

Answer a duration of 'msec' milliseconds

**`readFrom: aStream`**

Parse an instance of the receiver (hours/minutes/seconds) from
aStream

**`weeks: w`**

Answer a duration of 'w' weeks

**`zero`**

Answer a duration of zero seconds.

#### 1.69.2 Duration class: instance creation (non ANSI)

**`fromDays: days seconds: secs offset: unused`**

Answer a duration of 'd' days and 'secs' seconds.  The last
parameter is unused; this message is available for interoperability
with the DateTime class.

#### 1.69.3 Duration: arithmetics

**`* factor`**

Answer a Duration that is 'factor' times longer than the receiver

**`+ aDuration`**

Answer a Duration that is the sum of the receiver and aDuration's
lengths.

**`- aDuration`**

Answer a Duration that is the difference of the receiver and
aDuration's lengths.

**`/ factorOrDuration`**

If the parameter is a Duration, answer the ratio between the
receiver and factorOrDuration.  Else divide the receiver by
factorOrDuration (a Number) and answer a new Duration that is
correspondingly shorter.

**`abs`**

Answer a Duration that is as long as the receiver, but always in
the future.

**`days`**

Answer the number of days in the receiver

**`isZero`**

Answer whether the receiver correspond to a duration of zero
seconds.

**`negated`**

Answer a Duration that is as long as the receiver, but with past
and future exchanged.

**`negative`**

Answer whether the receiver is in the past.

**`positive`**

Answer whether the receiver is a zero-second duration or is in the
future.

**`printOn: aStream`**

Print a represention of the receiver on aStream.

#### 1.69.4 Duration: processes

**`wait`**

Answer a Delay waiting for the amount of time represented by the
receiver and start waiting on it.

#### 1.69.5 Duration: storing

**`storeOn: aStream`**

Store on aStream Smalltalk code compiling to the receiver

### 1.70 DynamicVariable

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Utilities

I am a variable that is visible only in the stackframes outgoing
from this one.  Do not use DynamicVariable directly, instead create
a subclass for each variable you want to use.

You can override the #value class method, and call #valueIfAbsent:
from there if you want the default value to be something else than
nil.

#### 1.70.1 DynamicVariable class: evaluating

**`use: anObject during: aBlock`**

Not commented.

**`value`**

Not commented.

**`valueIfAbsent: aBlock`**

Not commented.

### 1.71 Error

**Namespace:** Smalltalk · **Superclass:** [Exception](#172-exception) · **Category:** Language-Exceptions

Error represents a fatal error.  Instances of it are not resumable.

#### 1.71.1 Error: exception description

**`description`**

Answer a textual description of the exception.

**`isResumable`**

Answer false.  Error exceptions are by default unresumable;
subclasses can override this method if desired.

### 1.72 Exception

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Exceptions

My instances describe an exception that has happened, and are
passed to exception handlers.  Classes describe the kind of
exception.

Apart from containing information on the generated exception, my
instances contain methods that allow you to resume execution, leave
the #on:do:...  block, and pass the exception to an handler with a
lower priority.

#### 1.72.1 Exception class: comparison

**`goodness: anExceptionClass`**

Answer how good the receiver is at handling the given exception.  A
negative value indicates that the receiver is not able to handle
the exception.

**`handles: anException`**

Answer whether the receiver handles 'anException'.

#### 1.72.2 Exception class: creating ExceptionCollections

**`, aTrappableEvent`**

Answer an ExceptionCollection containing all the exceptions in the
receiver and all the exceptions in aTrappableEvent

#### 1.72.3 Exception class: instance creation

**`new`**

Create an instance of the receiver, which you will be able to
signal later.

**`signal`**

Create an instance of the receiver, give it default attributes, and
signal it immediately.

**`signal: messageText`**

Create an instance of the receiver, set its message text, and
signal it immediately.

#### 1.72.4 Exception class: interoperability with TrappableEvents

**`allExceptionsDo: aBlock`**

Private - Pass ourselves to aBlock

#### 1.72.5 Exception: accessing

**`basicMessageText`**

Answer an exception's message text.  Do not override this method.

**`messageText`**

Answer an exception's message text.

**`messageText: aString`**

Set an exception's message text.

**`tag`**

Answer an exception's tag value.  If not specified, it is the same
as the message text.

**`tag: anObject`**

Set an exception's tag value.  If nil, the tag value will be the
same as the message text.

#### 1.72.6 Exception: built ins

**`resignalAsUnhandled: message`**

This might start the debugger...  Note that we use #basicPrint
'cause #printOn: might invoke an error.

#### 1.72.7 Exception: comparison

**`= anObject`**

Answer whether the receiver is equal to anObject.  This is true if
either the receiver or its class are the same object as anObject.

#### 1.72.8 Exception: copying

**`postCopy`**

Modify the receiver so that it does not refer to any instantiated
exception handler.

#### 1.72.9 Exception: exception description

**`defaultAction`**

Execute the default action that is attached to the receiver.

**`description`**

Answer a textual description of the exception.

**`isResumable`**

Answer true.  Exceptions are by default resumable.

#### 1.72.10 Exception: exception handling

**`context`**

Return the execution context for the #on:do: snippet

**`isNested`**

Answer whether the current exception handler is within the scope of
another handler for the same exception.

**`outer`**

Raise the exception that instantiated the receiver, passing the
same parameters.  If the receiver is resumable and the evaluated
exception action resumes then the result returned from #outer will
be the resumption value of the evaluated exception action.  If the
receiver is not resumable or if the exception action does not
resume then this message will not return, and #outer will be
equivalent to #pass.

**`pass`**

Yield control to the enclosing exception action for the receiver.
Similar to #outer, but control does not return to the currently
active exception handler.

**`resignalAs: replacementException`**

Reinstate all handlers and execute the handler for
'replacementException'; control does not return to the currently
active exception handler.  The new Signal object that is created
has the same contents as the receiver (this might or not be correct
\- if it isn't you can use an idiom such as 'sig retryUsing: \[
replacementException signal \])

**`resume`**

If the exception is resumable, resume the execution of the block
that raised the exception; the method that was used to signal the
exception will answer the receiver.  Use this method IF AND ONLY IF
you know who caused the exception and if it is possible to resume
it in that particular case

**`resume: anObject`**

If the exception is resumable, resume the execution of the block
that raised the exception; the method that was used to signal the
exception will answer anObject.  Use this method IF AND ONLY IF you
know who caused the exception and if it is possible to resume it in
that particular case

**`retry`**

Re-execute the receiver of the #on:do: message.  All handlers are
reinstated: watch out, this can easily cause an infinite loop.

**`retryUsing: aBlock`**

Execute aBlock reinstating all handlers, and return its result from
the #signal method.

**`return`**

Exit the #on:do: snippet, answering nil to its caller.

**`return: anObject`**

Exit the #on:do: snippet, answering anObject to its caller.

#### 1.72.11 Exception: exception signaling

**`signal`**

Raise the exceptional event represented by the receiver

**`signal: messageText`**

Raise the exceptional event represented by the receiver, setting
its message text to messageText.

#### 1.72.12 Exception: still unclassified

**`signalingContext`**

Return the execution context for the place that signaled the
exception, or nil if it is not available anymore (for example if
the exception handler has returned.

### 1.73 ExceptionSet

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Exceptions

My instances are not real exceptions: they can only be used as
arguments to #on:do:...  methods in BlockClosure.  They act as
shortcuts that allows you to use the same handler for many
exceptions without having to write duplicate code

#### 1.73.1 ExceptionSet class: instance creation

**`new`**

Private - Answer a new, empty ExceptionSet

#### 1.73.2 ExceptionSet: enumerating

**`allExceptionsDo: aBlock`**

Private - Evaluate aBlock for every exception in the receiver.
Answer the receiver

**`goodness: exception`**

Answer how good the receiver is at handling the given exception.  A
negative value indicates that the receiver is not able to handle
the exception.

**`handles: exception`**

Answer whether the receiver handles 'exception'.

#### 1.73.3 ExceptionSet: instance creation

**`, aTrappableEvent`**

Answer an ExceptionSet containing all the exceptions in the
receiver and all the exceptions in aTrappableEvent

### 1.74 False

**Namespace:** Smalltalk · **Superclass:** [Boolean](#113-boolean) · **Category:** Language-Data types

I always tell lies.  I have a single instance in the system, which
represents the value false.

#### 1.74.1 False: basic

**`& aBoolean`**

We are false - anded with anything, we always answer false

**`and: aBlock`**

We are false - anded with anything, we always answer false

**`eqv: aBoolean`**

Answer whether the receiver and aBoolean represent the same boolean
value

**`ifFalse: falseBlock`**

We are false - evaluate the falseBlock

**`ifFalse: falseBlock ifTrue: trueBlock`**

We are false - evaluate the falseBlock

**`ifTrue: trueBlock`**

We are false - answer nil

**`ifTrue: trueBlock ifFalse: falseBlock`**

We are false - evaluate the falseBlock

**`not`**

We are false - answer true

**`or: aBlock`**

We are false - ored with anything, we always answer the other
operand, so evaluate aBlock

**`xor: aBoolean`**

Answer whether the receiver and aBoolean represent different
boolean values

**`| aBoolean`**

We are false - ored with anything, we always answer the other
operand

#### 1.74.2 False: C hacks

**`asCBooleanValue`**

Answer '0'.

#### 1.74.3 False: printing

**`printOn: aStream`**

Print a representation of the receiver on aStream

### 1.75 File

**Namespace:** Smalltalk · **Superclass:** [FilePath](#177-filepath) · **Category:** Streams-Files

I enable access to the properties of files that are on disk.

#### 1.75.1 File class: C functions

**`errno`**

Answer the current value of C errno.

**`stringError: errno`**

Answer C strerror's result for errno.

#### 1.75.2 File class: file operations

**`checkError`**

Return whether an error had been reported or not.  If there had
been one, raise an exception too

**`checkError: errno`**

The error with the C code 'errno' has been reported.  If errno \>=
1, raise an exception

**`remove: fileName`**

Remove the file with the given path name

**`rename: oldFileName to: newFileName`**

Rename the file with the given path name oldFileName to newFileName

**`symlink: srcName as: destName`**

Create a symlink for the srcName file with the given path name

**`symlink: destName from: srcName`**

Create a symlink named destName file from the given path (relative
to destName)

**`touch: fileName`**

Update the timestamp of the file with the given path name.

#### 1.75.3 File class: initialization

**`initialize`**

Initialize the receiver's class variables

#### 1.75.4 File class: instance creation

**`name: aName`**

Answer a new file with the given path.  The path is turned into an
absolute path.

**`path: aString`**

Answer a new file with the given path.  The path is not validated
until some of the fields of the newly created objects are accessed

#### 1.75.5 File class: reading system defaults

**`executable`**

Answer the full path to the executable being run.

**`image`**

Answer the full path to the image being used.

#### 1.75.6 File class: testing

**`exists: fileName`**

Answer whether a file with the given name exists

**`isAccessible: fileName`**

Answer whether a directory with the given name exists and can be
accessed

**`isExecutable: fileName`**

Answer whether a file with the given name exists and can be
executed

**`isReadable: fileName`**

Answer whether a file with the given name exists and is readable

**`isWriteable: fileName`**

Answer whether a file with the given name exists and is writeable

#### 1.75.7 File: accessing

**`asString`**

Answer the name of the file identified by the receiver

**`at: aString`**

Answer a File or Directory object as appropriate for a file named
'aName' in the directory represented by the receiver.

**`creationTime`**

Answer the creation time of the file identified by the receiver.
On some operating systems, this could actually be the last change
time (the 'last change time' has to do with permissions, ownership
and the like).

**`isDirectory`**

Answer whether the file is a directory.

**`isSocket`**

Answer whether the file is an AF\_UNIX socket.

**`isSymbolicLink`**

Answer whether the file is a symbolic link.

**`lastAccessTime`**

Answer the last access time of the file identified by the receiver

**`lastChangeTime`**

Answer the last change time of the file identified by the receiver
(the 'last change time' has to do with permissions, ownership and
the like).  On some operating systems, this could actually be the
file creation time.

**`lastModifyTime`**

Answer the last modify time of the file identified by the receiver
(the 'last modify time' has to do with the actual file contents).

**`mode`**

Answer the permission bits for the file identified by the receiver

**`mode: anInteger`**

Set the permission bits for the file identified by the receiver to
be anInteger.

**`name`**

Answer the name of the file identified by the receiver

**`pathTo: destName`**

Compute the relative path from the receiver to destName.

**`refresh`**

Refresh the statistics for the receiver

**`size`**

Answer the size of the file identified by the receiver

#### 1.75.8 File: basic

**`= aFile`**

Answer whether the receiver represents the same file as the
receiver.

**`hash`**

Answer a hash value for the receiver.

#### 1.75.9 File: directory operations

**`createDirectory`**

Create the receiver as a directory.

**`namesDo: aBlock`**

Evaluate aBlock once for each file in the directory represented by
the receiver, passing its name.  aBlock should not return.

#### 1.75.10 File: file name management

**`full`**

Answer the full name of the receiver, resolving the '.'  and '..'
directory entries, and answer the result.  Answer nil if the name
is invalid (such as '/usr/../../badname')

#### 1.75.11 File: file operations

**`lastAccessTime: accessDateTime lastModifyTime: modifyDateTime`**

Set the receiver's timestamps to be accessDateTime and
modifyDateTime.

**`open: class mode: mode ifFail: aBlock`**

Open the receiver in the given mode (as answered by FileStream's
class constant methods)

**`owner: ownerString group: groupString`**

Set the receiver's owner and group to be ownerString and
groupString.

**`pathFrom: dir`**

Compute the relative path from the directory dirName to the
receiver

**`remove`**

Remove the file with the given path name

**`renameTo: newFileName`**

Rename the file with the given path name to newFileName

**`symlinkAs: destName`**

Create destName as a symbolic link of the receiver.  The
appropriate relative path is computed automatically.

**`symlinkFrom: srcName`**

Create the receiver as a symlink from path destName

#### 1.75.12 File: still unclassified

**`, aName`**

Answer an object of the same kind as the receiver, whose name is
suffixed with aName.

#### 1.75.13 File: testing

**`exists`**

Answer whether a file with the name contained in the receiver does
exist.

**`isAbsolute`**

Answer whether the receiver identifies an absolute path.

**`isAccessible`**

Answer whether a directory with the name contained in the receiver
does exist and is accessible

**`isExecutable`**

Answer whether a file with the name contained in the receiver does
exist and is executable

**`isFileSystemPath`**

Answer whether the receiver corresponds to a real filesystem path.

**`isReadable`**

Answer whether a file with the name contained in the receiver does
exist and is readable

**`isWriteable`**

Answer whether a file with the name contained in the receiver does
exist and is writeable

### 1.76 FileDescriptor

**Namespace:** Smalltalk · **Superclass:** [Stream](#1157-stream) · **Category:** Streams-Files

My instances are what conventional programmers think of as files.
My instance creation methods accept the name of a disk file (or any
named file object, such as /dev/rmt0 on UNIX or MTA0: on VMS). In
addition, they accept a virtual filesystem path like
'configure.gz#ugz' which can be used to transparently extract or
decompress files from archives, or do arbitrary processing on the
files.

#### 1.76.1 FileDescriptor class: initialization

**`initialize`**

Initialize the receiver's class variables

**`update: aspect`**

Close open files before quitting

#### 1.76.2 FileDescriptor class: instance creation

**`append`**

Open for writing.  The file is created if it does not exist.  The
stream is positioned at the end of the file.

**`create`**

Open for reading and writing.  The file is created if it does not
exist, otherwise it is truncated.  The stream is positioned at the
beginning of the file.

**`fopen: fileName mode: fileMode`**

Open fileName in the required mode - answered by #append, #create,
\#readWrite, #read or #write - and fail if the file cannot be
opened.  Else answer a new FileStream.  For mode anyway you can use
any standard C non-binary fopen mode.  The file will be
automatically closed upon GC if the object is not referenced
anymore, but it is better to close it as soon as you're finished
with it anyway, using #close.  To keep a file open even when no
references exist anymore, send it #removeToBeFinalized

**`fopen: fileName mode: fileMode ifFail: aBlock`**

Open fileName in the required mode - answered by #append, #create,
\#readWrite, #read or #write - and evaluate aBlock if the file
cannot be opened.  Else answer a new FileStream.  For mode anyway
you can use any The file will be automatically closed upon GC if
the object is not referenced anymore, but it is better to close it
as soon as you're finished with it anyway, using #close.  To keep a
file open even when no references exist anymore, send it
\#removeToBeFinalized

**`on: fd`**

Open a FileDescriptor on the given file descriptor.  Read-write
access is assumed.

**`open: fileName`**

Open fileName in read-write mode - fail if the file cannot be
opened.  Else answer a new FileStream.  The file will be
automatically closed upon GC if the object is not referenced
anymore, but you should close it with #close anyway.  To keep a
file open, send it #removeToBeFinalized

**`open: fileName mode: fileMode ifFail: aBlock`**

Open fileName in the required mode - answered by #append, #create,
\#readWrite, #read or #write - and evaluate aBlock if the file
cannot be opened.  Else answer a new instance of the receiver.  For
mode anyway you can use any standard C non-binary fopen mode.
fileName can be a 'virtual filesystem' path, including URLs and '#'
suffixes that are inspected by the virtual filesystem layers and
replaced with tasks such as un-gzipping a file or extracting a file
from an archive.

The file will be automatically closed upon GC if the object is not
referenced anymore, but it is better to close it as soon as you're
finished with it anyway, using #close.  To keep a file open even
when no references exist anymore, send it #removeToBeFinalized

**`openTemporaryFile: baseName`**

Open for writing a file whose name starts with baseName, followed
by six random alphanumeric characters.  The file is created with
mode read/write and permissions 0666 or 0600 on most recent
operating systems (beware, the former behavior might constitute a
security problem).  The file is opened with the O\_EXCL flag,
guaranteeing that when the method returns successfully we are the
only user.

**`popen: commandName dir: direction`**

Open a pipe on the given command and fail if the file cannot be
opened.  Else answer a new FileStream.  The pipe will not be
automatically closed upon GC, even if the object is not referenced
anymore, because when you close a pipe you have to wait for the
associated process to terminate.  direction is returned by #read or
\#write ('r' or 'w') and is interpreted from the point of view of
Smalltalk: reading means Smalltalk reads the standard output of the
command, writing means Smalltalk writes the standard input of the
command.  The other channel (stdin when reading, stdout when
writing) is the same as GST's, unless commandName alters it.

**`popen: commandName dir: direction ifFail: aBlock`**

Open a pipe on the given command and evaluate aBlock file cannot be
opened.  Else answer a new FileStream.  The pipe will not be
automatically closed upon GC, even if the object is not referenced
anymore, because when you close a pipe you have to wait for the
associated process to terminate.  direction is interpreted from the
point of view of Smalltalk: reading means that Smalltalk reads the
standard output of the command, writing means that Smalltalk writes
the standard input of the command

**`read`**

Open text file for reading.  The stream is positioned at the
beginning of the file.

**`readWrite`**

Open for reading and writing.  The stream is positioned at the
beginning of the file.

**`write`**

Truncate file to zero length or create text file for writing.  The
stream is positioned at the beginning of the file.

#### 1.76.3 FileDescriptor class: still unclassified

**`open: fileName mode: fileMode`**

Open fileName in the required mode - answered by #append, #create,
\#readWrite, #read or #write - and fail if the file cannot be
opened.  Else answer a new FileStream.  For mode anyway you can use
any standard C non-binary fopen mode.  fileName can be a 'virtual
filesystem' path, including URLs and '#' suffixes that are
inspected by the virtual filesystem layers and replaced with tasks
such as un-gzipping a file or extracting a file from an archive.

The file will be automatically closed upon GC if the object is not
referenced anymore, but it is better to close it as soon as you're
finished with it anyway, using #close.  To keep a file open even
when no references exist anymore, send it #removeToBeFinalized

#### 1.76.4 FileDescriptor: accessing

**`canRead`**

Answer whether the file is open and we can read from it

**`canWrite`**

Answer whether the file is open and we can write from it

**`ensureReadable`**

If the file is open, wait until data can be read from it.  The wait
allows other Processes to run.

**`ensureWriteable`**

If the file is open, wait until we can write to it.  The wait
allows other Processes to run.

**`exceptionalCondition`**

Answer whether the file is open and an exceptional condition (such
as presence of out of band data) has occurred on it

**`fd`**

Return the OS file descriptor of the file

**`file`**

Return the name of the file

**`isOpen`**

Answer whether the file is still open

**`isPeerAlive`**

Present for compatibility with sockets.  For files, it answers
whether the file is still open

**`isPipe`**

Answer whether the file is a pipe or an actual disk file

**`name`**

Return the name of the file

**`waitForException`**

If the file is open, wait until an exceptional condition (such as
presence of out of band data) has occurred on it.  The wait allows
other Processes to run.

#### 1.76.5 FileDescriptor: basic

**`checkError`**

Perform error checking.  By default, we call File
class\>\>#checkError.

**`close`**

Close the file

**`contents`**

Answer the whole contents of the file

**`copyFrom: from to: to`**

Answer the contents of the file between the two given positions

**`finalize`**

Close the file if it is still open by the time the object becomes
garbage.

**`invalidate`**

Invalidate a file descriptor

**`next`**

Return the next character in the file, or nil at eof

**`nextByte`**

Return the next byte in the file, or nil at eof

**`nextPut: aCharacter`**

Store aCharacter on the file

**`nextPutByte: anInteger`**

Store the byte, anInteger, on the file

**`nextPutByteArray: aByteArray`**

Store aByteArray on the file

**`peek`**

Returns the next element of the stream without moving the pointer.
Returns nil when at end of stream.

**`peekFor: anObject`**

Returns whether the next element of the stream is equal to
anObject, without moving the pointer if it is not.

**`position`**

Answer the zero-based position from the start of the file

**`position: n`**

Set the file pointer to the zero-based position n

**`reset`**

Reset the stream to its beginning

**`shutdown`**

Close the transmission side of a full-duplex connection.  This is
useful on read-write pipes.

**`size`**

Return the current size of the file, in bytes

**`truncate`**

Truncate the file at the current position

#### 1.76.6 FileDescriptor: binary I/O

**`nextByteArray: numBytes`**

Return the next numBytes bytes in the byte array

**`nextDouble`**

Return the next 64-bit float in the byte array

**`nextFloat`**

Return the next 32-bit float in the byte array

**`nextLong`**

Return the next 4 bytes in the byte array, interpreted as a 32 bit
signed int

**`nextLongLong`**

Return the next 8 bytes in the byte array, interpreted as a 64 bit
signed int

**`nextPutDouble: aDouble`**

Store aDouble as a 64-bit float in the byte array

**`nextPutFloat: aFloat`**

Return the next 32-bit float in the byte array

**`nextPutInt64: anInteger`**

Store anInteger (range: -2^63..2^64-1) on the byte array as 8 bytes

**`nextPutLong: anInteger`**

Store anInteger (range: -2^31..2^32-1) on the byte array as 4 bytes

**`nextPutShort: anInteger`**

Store anInteger (range: -32768..65535) on the byte array as 2 bytes

**`nextShort`**

Return the next 2 bytes in the byte array, interpreted as a 16 bit
signed int

**`nextSignedByte`**

Return the next byte in the byte array, interpreted as a 8 bit
signed number

**`nextUint64`**

Return the next 8 bytes in the byte array, interpreted as a 64 bit
unsigned int

**`nextUlong`**

Return the next 4 bytes in the byte array, interpreted as a 32 bit
unsigned int

**`nextUshort`**

Return the next 2 bytes in the byte array, interpreted as a 16 bit
unsigned int

#### 1.76.7 FileDescriptor: built ins

**`fileIn`**

File in the contents of the receiver.  During a file in operation,
global variables (starting with an uppercase letter) that are not
declared don't yield an 'unknown variable' error.  Instead, they
are defined as nil in the 'Undeclared' dictionary (a global
variable residing in Smalltalk).  As soon as you add the variable
to a namespace (for example by creating a class) the Association
will be removed from Undeclared and reused in the namespace, so
that the old references will automagically point to the new value.

**`fileOp: ioFuncIndex`**

Private - Used to limit the number of primitives used by
FileStreams

**`fileOp: ioFuncIndex ifFail: aBlock`**

Private - Used to limit the number of primitives used by
FileStreams.

**`fileOp: ioFuncIndex with: arg1`**

Private - Used to limit the number of primitives used by
FileStreams

**`fileOp: ioFuncIndex with: arg1 ifFail: aBlock`**

Private - Used to limit the number of primitives used by
FileStreams.

**`fileOp: ioFuncIndex with: arg1 with: arg2`**

Private - Used to limit the number of primitives used by
FileStreams

**`fileOp: ioFuncIndex with: arg1 with: arg2 ifFail: aBlock`**

Private - Used to limit the number of primitives used by
FileStreams.

**`fileOp: ioFuncIndex with: arg1 with: arg2 with: arg3`**

Private - Used to limit the number of primitives used by
FileStreams

**`fileOp: ioFuncIndex with: arg1 with: arg2 with: arg3 ifFail: aBlock`**

Private - Used to limit the number of primitives used by
FileStreams.

**`fileOp: ioFuncIndex with: arg1 with: arg2 with: arg3 with: arg4`**

Private - Used to limit the number of primitives used by
FileStreams

**`fileOp: ioFuncIndex with: arg1 with: arg2 with: arg3 with: arg4 ifFail: aBlock`**

Private - Used to limit the number of primitives used by
FileStreams.

#### 1.76.8 FileDescriptor: class type methods

**`isBinary`**

We answer characters, so answer false

**`isExternalStream`**

We stream on an external entity (a file), so answer true

**`isText`**

We answer characters, so answer true

#### 1.76.9 FileDescriptor: initialize-release

**`addToBeFinalized`**

Add me to the list of open files.

**`initialize`**

Initialize the receiver's instance variables

**`readStream`**

Answer myself, or an alternate stream coerced for reading.

**`removeToBeFinalized`**

Remove me from the list of open files.

#### 1.76.10 FileDescriptor: low-level access

**`next: n putAll: aCollection startingAt: position`**

Put the characters in the supplied range of aCollection in the file

**`nextAvailable: n into: aCollection startingAt: position`**

Ignoring any buffering, try to fill the given range of aCollection
with the contents of the file

#### 1.76.11 FileDescriptor: overriding inherited methods

**`isEmpty`**

Answer whether the receiver is empty

**`nextPutAllOn: aStream`**

Put all the characters of the receiver in aStream.

**`reverseContents`**

Return the contents of the file from the last byte to the first

**`setToEnd`**

Reset the file pointer to the end of the file

**`skip: anInteger`**

Skip anInteger bytes in the file

#### 1.76.12 FileDescriptor: polymorphism

**`pastEnd`**

The end of the stream has been reached.  Signal a Notification.

#### 1.76.13 FileDescriptor: positioning

**`isPositionable`**

Answer true if the stream supports moving backwards with #skip:.

#### 1.76.14 FileDescriptor: printing

**`printOn: aStream`**

Print a representation of the receiver on aStream

#### 1.76.15 FileDescriptor: testing

**`atEnd`**

Answer whether data has come to an end

### 1.77 FilePath

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Streams-Files

I expose the syntax of file names, including paths.  I know how to
manipulate such a path by splitting it into its components.  In
addition, I expose information about files (both real and virtual)
such as their size and timestamps.

#### 1.77.1 FilePath class: file name management

**`append: fileName to: directory`**

Answer the name of a file named 'fileName' which resides in a
directory named 'directory'.

**`extensionFor: aString`**

Answer the extension of a file named 'aString'.  Note: the
extension includes an initial dot.

**`fullNameFor: aString`**

Answer the full path to a file called 'aString', resolving the '.'
and '..'  directory entries, and answer the result.  '/..'  is the
same as '/'.

**`pathFor: aString`**

Determine the path of the name of a file called 'aString', and
answer the result.  With the exception of the root directory, the
final slash is stripped.

**`pathFor: aString ifNone: aBlock`**

Determine the path of the name of a file called 'aString', and
answer the result.  With the exception of the root directory, the
final slash is stripped.  If there is no path, evaluate aBlock and
return the result.

**`pathFrom: srcName to: destName`**

Answer the relative path to destName when the current directory is
srcName's directory.

**`stripExtensionFrom: aString`**

Remove the extension from the name of a file called 'aString', and
answer the result.

**`stripFileNameFor: aString`**

Determine the path of the name of a file called 'aString', and
answer the result as a directory name including the final slash.

**`stripPathFrom: aString`**

Remove the path from the name of a file called 'aString', and
answer the file name plus extension.

#### 1.77.2 FilePath class: still unclassified

**`isAbsolute: aString`**

Answer whether aString is an absolute ptah.

#### 1.77.3 FilePath: accessing

**`at: aName`**

Answer a File or Directory object as appropriate for a file named
'aName' in the directory represented by the receiver.

**`creationTime`**

Answer the creation time of the file identified by the receiver.
On some operating systems, this could actually be the last change
time (the 'last change time' has to do with permissions, ownership
and the like).

**`group: aString`**

Set the group of the file identified by the receiver to be aString.

**`includes: aName`**

Answer whether a file named 'aName' exists in the directory
represented by the receiver.

**`lastAccessTime`**

Answer the last access time of the file identified by the receiver

**`lastAccessTime: aDateTime`**

Update the last access time of the file corresponding to the
receiver, to be aDateTime.

**`lastAccessTime: accessDateTime lastModifyTime: modifyDateTime`**

Update the timestamps of the file corresponding to the receiver, to
be accessDateTime and modifyDateTime.

**`lastChangeTime`**

Answer the last change time of the file identified by the receiver
(the 'last change time' has to do with permissions, ownership and
the like).  On some operating systems, this could actually be the
file creation time.

**`lastModifyTime`**

Answer the last modify time of the file identified by the receiver
(the 'last modify time' has to do with the actual file contents).

**`lastModifyTime: aDateTime`**

Update the last modification timestamp of the file corresponding to
the receiver, to be aDateTime.

**`mode`**

Answer the permission bits for the file identified by the receiver

**`mode: anInteger`**

Set the permission bits for the file identified by the receiver to
be anInteger.

**`owner: aString`**

Set the owner of the file identified by the receiver to be aString.

**`owner: ownerString group: groupString`**

Set the owner and group of the file identified by the receiver to
be aString.

**`pathTo: destName`**

Compute the relative path from the receiver to destName.

**`refresh`**

Refresh the statistics for the receiver

**`size`**

Answer the size of the file identified by the receiver

#### 1.77.4 FilePath: converting

**`asFile`**

Answer the receiver.

#### 1.77.5 FilePath: decoration

**`all`**

Return a decorator of the receiver that will provide recursive
descent into directories for iteration methods.  Furthermore,
iteration on the returned wrapper will not include '.'  or '..'
directory entries, and will include the receiver (directly, not via
'.').

#### 1.77.6 FilePath: directory operations

**`createDirectories`**

Create the receiver as a directory, together with all its parents.

**`createDirectory`**

Create the receiver as a directory, together with all its parents.

**`nameAt: aName`**

Answer a FilePath for a file named 'aName' residing in the
directory represented by the receiver.

#### 1.77.7 FilePath: enumerating

**`allFilesMatching: aPattern do: aBlock`**

Evaluate aBlock on the File objects that match aPattern (according
to String\>\>#match:) in the directory named by the receiver.
Recursively descend into directories.

**`directories`**

Answer an Array with Directory objects for the subdirectories of
the directory represented by the receiver.

**`do: aBlock`**

Evaluate aBlock once for each file in the directory represented by
the receiver, passing a FilePath object (or a subclass) to it.  It
depends on the subclass whether iteration will include the '.'  and
'..'  directory entries.

**`entries`**

Answer an Array with File or Directory objects for the contents of
the directory represented by the receiver.

**`entryNames`**

Answer an Array with the names of the files in the directory
represented by the receiver.

**`files`**

Answer an Array with File objects for the contents of the directory
represented by the receiver.

**`filesMatching: aPattern`**

Evaluate aBlock once for each file in the directory represented by
the receiver, passing a File or Directory object to aBlock.
Returns the \*names\* of the files for which aBlock returns true.

**`filesMatching: aPattern do: block`**

Evaluate block on the File objects that match aPattern (according
to String\>\>#match:) in the directory named by the receiver.

**`namesDo: aBlock`**

Evaluate aBlock once for each file in the directory represented by
the receiver, passing its name.  It depends on the subclass whether
iteration will include the '.'  and '..'  directory entries.

**`namesMatching: aPattern do: block`**

Evaluate block on the file names that match aPattern (according to
String\>\>#match:) in the directory named by the receiver.

**`reject: aBlock`**

Evaluate aBlock once for each file in the directory represented by
the receiver, passing a File or Directory object to aBlock.
Returns the \*names\* of the files for which aBlock returns true.

**`select: aBlock`**

Evaluate aBlock once for each file in the directory represented by
the receiver, passing a File or Directory object to aBlock.
Returns the \*names\* of the files for which aBlock returns true.

#### 1.77.8 FilePath: file name management

**`directory`**

Answer the Directory object for the receiver's path

**`extension`**

Answer the extension of the receiver

**`full`**

Answer the full name of the receiver, resolving the '.'  and '..'
directory entries, and answer the result.  Answer nil if the name
is invalid (such as '/usr/../../badname')

**`fullName`**

Answer a String with the full path to the receiver (same as #name;
it is useless to override this method).

**`name`**

Answer String with the full path to the receiver (same as
\#fullName).

**`parent`**

Answer the Directory object for the receiver's path

**`path`**

Answer the path (if any) of the receiver

**`stripExtension`**

Answer the path (if any) and file name of the receiver

**`stripFileName`**

Answer the path of the receiver, always including a directory name
(possibly '.')  and the final directory separator

**`stripPath`**

Answer the file name and extension (if any) of the receiver

#### 1.77.9 FilePath: file operations

**`contents`**

Open a read-only FileStream on the receiver, read its contents,
close the stream and answer the contents

**`fileIn`**

File in the receiver

**`open: mode`**

Open the receiver in the given mode (as answered by FileStream's
class constant methods)

**`open: mode ifFail: aBlock`**

Open the receiver in the given mode (as answered by FileStream's
class constant methods).  Upon failure, evaluate aBlock.

**`open: class mode: mode ifFail: aBlock`**

Open the receiver in the given mode (as answered by FileStream's
class constant methods)

**`openDescriptor: mode`**

Open the receiver in the given mode (as answered by FileStream's
class constant methods)

**`openDescriptor: mode ifFail: aBlock`**

Open the receiver in the given mode (as answered by FileStream's
class constant methods).  Upon failure, evaluate aBlock.

**`pathFrom: dirName`**

Compute the relative path from the directory dirName to the
receiver

**`readStream`**

Open a read-only FileStream on the receiver

**`remove`**

Remove the file identified by the receiver

**`renameTo: newName`**

Rename the file identified by the receiver to newName

**`symlinkAs: destName`**

Create destName as a symbolic link of the receiver.  The
appropriate relative path is computed automatically.

**`symlinkFrom: srcName`**

Create the receiver as a symbolic link from srcName (relative to
the path of the receiver).

**`touch`**

Update the timestamp of the file corresponding to the receiver.

**`withReadStreamDo: aBlock`**

Answer the result of invoking aBlock with a reading stream open on
me, closing it when the dynamic extent of aBlock ends.

**`withWriteStreamDo: aBlock`**

Answer the result of invoking aBlock with a writing stream open on
me, closing it when the dynamic extent of aBlock ends.

**`writeStream`**

Open a write-only FileStream on the receiver

#### 1.77.10 FilePath: printing

**`asString`**

Print a representation of the receiver on aStream.

**`displayOn: aStream`**

Print a representation of the receiver on aStream.

**`printOn: aStream`**

Print a representation of the receiver on aStream.

**`withShellEscapes`**

Return the representation of the receiver with shell characters
escaped.

#### 1.77.11 FilePath: still unclassified

**`/ aName`**

Answer a File or Directory object as appropriate for a file named
'aName' in the directory represented by the receiver.

#### 1.77.12 FilePath: testing

**`exists`**

Answer whether a file with the name contained in the receiver does
exist.

**`isAbsolute`**

Answer whether the receiver identifies an absolute path.

**`isAccessible`**

Answer whether a directory with the name contained in the receiver
does exist and can be accessed

**`isDirectory`**

Answer whether a file with the name contained in the receiver does
exist and identifies a directory.

**`isExecutable`**

Answer whether a file with the name contained in the receiver does
exist and is executable

**`isFile`**

Answer whether a file with the name contained in the receiver does
exist and does not identify a directory.

**`isFileSystemPath`**

Answer whether the receiver corresponds to a real filesystem path.

**`isReadable`**

Answer whether a file with the name contained in the receiver does
exist and is readable

**`isRelative`**

Answer whether the receiver identifies a relative path.

**`isSymbolicLink`**

Answer whether a file with the name contained in the receiver does
exist and identifies a symbolic link.

**`isWriteable`**

Answer whether a file with the name contained in the receiver does
exist and is writeable

#### 1.77.13 FilePath: virtual filesystems

**`zip`**

Not commented.

### 1.78 FileSegment

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Implementation

My instances represent sections of files.  I am primarily used by
the compiler to record source code locations.  I am not a part of
the normal Smalltalk-80 kernel; I am specific to the GNU Smalltalk
implementation.

#### 1.78.1 FileSegment class: basic

**`on: aFile startingAt: startPos for: sizeInteger`**

Create a new FileSegment referring to the contents of the given
file, from the startPos-th byte and for sizeInteger bytes.  Note
that FileSegments should always be created with full paths because
relative paths are interpreted to be relative to the kernel
directory.

#### 1.78.2 FileSegment class: installing

**`relocate`**

Remove the kernel path from all paths that start with it.  Needed
to support $(DESTDIR) and relocatable installation.

#### 1.78.3 FileSegment: basic

**`asString`**

Answer a String containing the required segment of the file

**`copyFrom: from to: to`**

Answer a String containing the given subsegment of the file.  As
for streams, from and to are 0-based.

**`file`**

Answer the File object for the file containing the segment

**`fileName`**

Answer the name of the file containing the segment

**`filePos`**

Answer the position in the file where the segment starts

**`relocateFrom: startPath map: map`**

If the path starts with startPath, remove that part of the path.
map is a Dictionary that is used so that equal filenames stay
equal, without increasing the amount of memory that the image uses.

**`size`**

Answer the length of the segment

**`withFileDo: aBlock`**

Evaluate aBlock passing it the FileStream in which the segment
identified by the receiver is stored

#### 1.78.4 FileSegment: equality

**`= aFileSegment`**

Answer whether the receiver and aFileSegment are equal.

**`hash`**

Answer an hash value for the receiver.

#### 1.78.5 FileSegment: printing

**`printedFileName`**

Answer a printed representation of the file containing the segment.
While introducing some ambiguity, this representation is compact
eliminates the path for kernel files, and produces a relative path
from the current working directory for other files.

### 1.79 FileStream

**Namespace:** Smalltalk · **Superclass:** [FileDescriptor](#176-filedescriptor) · **Category:** Streams-Files

My instances are what conventional programmers think of as files.
My instance creation methods accept the name of a disk file (or any
named file object, such as /dev/rmt0 on UNIX or MTA0: on VMS).

#### 1.79.1 FileStream class: file-in

**`fileIn: aFileName`**

File in the aFileName file.  During a file in operation, global
variables (starting with an uppercase letter) that are not declared
yet don't yield an 'unknown variable' error.  Instead, they are
defined as nil in the 'Undeclared' dictionary (a global variable
residing in Smalltalk).  As soon as you add the variable to a
namespace (for example by creating a class) the Association will be
removed from Undeclared and reused in the namespace, so that the
old references will automagically point to the new value.

**`fileIn: aFileName ifMissing: aSymbol`**

Conditionally do a file in, only if the key (often a class)
specified by 'aSymbol' is not present in the Smalltalk system
dictionary already.  During a file in operation, global variables
(starting with an uppercase letter) that are not declared don't
yield an 'unknown variable' error.  Instead, they are defined as
nil in the 'Undeclared' dictionary (a global variable residing in
Smalltalk).  As soon as you add the variable to a namespace (for
example by creating a class) the Association will be removed from
Undeclared and reused in the namespace, so that the old references
will automagically point to the new value.

**`fileIn: aFileName ifTrue: aBoolean`**

Conditionally do a file in, only if the supplied boolean is true.
During a file in operation, global variables (starting with an
uppercase letter) that are not declared don't yield an 'unknown
variable' error.  Instead, they are defined as nil in the
'Undeclared' dictionary (a global variable residing in Smalltalk).
As soon as you add the variable to a namespace (for example by
creating a class) the Association will be removed from Undeclared
and reused in the namespace, so that the old references will
automagically point to the new value.

**`fileIn: aFileName line: lineInteger from: realFileName at: aCharPos`**

File in the aFileName file giving errors such as if it was loaded
from the given line, file name and starting position (instead of
1\).

**`generateMakefileOnto: aStream`**

Generate a make file for the file-ins since record was last set to
true.  Store it on aStream

**`initialize`**

Private - Initialize the receiver's class variables

**`record: recordFlag`**

Set whether Smalltalk should record information about nested
file-ins.  When recording is enabled, use #generateMakefileOnto: to
automatically generate a valid makefile for the intervening
file-ins.

**`require: assoc`**

Conditionally do a file in from the value of assoc, only if the key
of assoc is not present in the Smalltalk system dictionary already.
During a file in operation, global variables (starting with an
uppercase letter) that are not declared don't yield an 'unknown
variable' error.  Instead, they are defined as nil in the
'Undeclared' dictionary (a global variable residing in Smalltalk).
As soon as you add the variable to a namespace (for example by
creating a class) the Association will be removed from Undeclared
and reused in the namespace, so that the old references will
automagically point to the new value.

**`verbose: verboseFlag`**

Set whether Smalltalk should output debugging messages when filing
in

#### 1.79.2 FileStream class: standard streams

**`stderr`**

Answer a FileStream that is attached the Smalltalk program's
standard error file handle, which can be used for error messages
and diagnostics issued by the program.

**`stdin`**

Answer a FileStream that is attached the Smalltalk program's
standard input file handle, which is the normal source of input for
the program.

**`stdout`**

Answer a FileStream that is attached the Smalltalk program's
standard output file handle; this is used for normal output from
the program.

#### 1.79.3 FileStream: basic

**`bufferStart`**

Private - Answer the offset from the start of the file
corresponding to the beginning of the read buffer.

**`copyFrom: from to: to`**

Answer the contents of the file between the two given positions

**`next`**

Return the next character in the file, or nil at eof

**`nextPut: aCharacter`**

Store aCharacter on the file

**`peek`**

Return the next character in the file, or nil at eof.  Don't
advance the file pointer.

**`position`**

Answer the zero-based position from the start of the file

**`position: n`**

Set the file pointer to the zero-based position n

**`size`**

Return the current size of the file, in bytes

**`truncate`**

Truncate the file at the current position

#### 1.79.4 FileStream: buffering

**`bufferSize`**

Answer the file's current buffer

**`bufferSize: bufSize`**

Flush the file and set the buffer's size to bufSize

**`clean`**

Synchronize the file descriptor's state with the object's state.

**`fill`**

Private - Fill the input buffer

**`flush`**

Flush the output buffer.

**`newBuffer`**

Private - Answer a String to be used as the receiver's buffer

**`next: n bufferAll: aCollection startingAt: pos`**

Private - Assuming that the buffer has space for n characters,
store n characters of aCollection in the buffer, starting from the
pos-th.

**`nextAvailable: anInteger into: aCollection startingAt: pos`**

Read up to anInteger bytes from the stream and store them into
aCollection.  Return the number of bytes read.

**`nextAvailable: anInteger putAllOn: aStream`**

Copy up to anInteger bytes from the stream into aStream.  Return
the number of bytes read.

**`pendingWrite`**

Answer whether the output buffer is full.

#### 1.79.5 FileStream: compiling

**`segmentFrom: startPos to: endPos`**

Answer an object that, when sent #asString, will yield the result
of sending 'copyFrom: startPos to: endPos' to the receiver

#### 1.79.6 FileStream: initialize-release

**`initialize`**

Initialize the receiver's instance variables

#### 1.79.7 FileStream: overriding inherited methods

**`next: n putAll: aCollection startingAt: pos`**

Write n values from aCollection, the first being at pos.

**`nextLine`**

Returns a collection of the same type that the stream accesses,
containing the next line up to the next new-line character.
Returns the entire rest of the stream's contents if no new-line
character is found.

**`nextPutAllOn: aStream`**

Put all the characters of the receiver in aStream.

**`upTo: aCharacter`**

Returns a collection of the same type that the stream accesses,
containing data up to aCharacter.  Returns the entire rest of the
stream's contents if no such character is found.

#### 1.79.8 FileStream: testing

**`atEnd`**

Answer whether data has come to an end

### 1.80 Float

**Namespace:** Smalltalk · **Superclass:** [Number](#1122-number) · **Category:** Language-Data types

My instances represent floating point numbers that have arbitrary
precision.  Besides the standard numerical operations, they provide
transcendental operations too.  They implement IEEE-754 correctly
if the hardware supports it.

#### 1.80.1 Float class: byte-order dependancies

**`signByte`**

Answer the byte of the receiver that contains the sign bit

#### 1.80.2 Float class: characterization

**`denormalized`**

Answer whether instances of the receiver can be in denormalized
form.

**`e`**

Returns the value of e.  Hope is that it is precise enough

**`epsilon`**

Return the smallest Float x for which is 1 + x \~= 1

**`fmin`**

Return the smallest Float that is \> 0.

**`fminDenormalized`**

Return the smallest Float that is \> 0 if denormalized values are
supported, else return 0.

**`ln10`**

Returns the value of ln 10.  Hope is that it is precise enough

**`log10Base2`**

Returns the value of log2 10.  Hope is that it is precise enough

**`pi`**

Returns the value of pi.  Hope is that it is precise enough

**`radix`**

Answer the base in which computations between instances of the
receiver are made.  This should be 2 on about every known computer,
so GNU Smalltalk always answers 2.

#### 1.80.3 Float: arithmetic

**`integerPart`**

Return the receiver's integer part

**`negated`**

Return the negation of the receiver.  Unlike 0-self, this converts
correctly signed zeros.

**`raisedToInteger: anInteger`**

Return self raised to the anInteger-th power

#### 1.80.4 Float: basic

**`hash`**

Answer an hash value for the receiver.  Not-a-number values do not
have a hash code and cannot be put in a hashed collection.

#### 1.80.5 Float: built ins

**`arcCos`**

Answer the arc-cosine of the receiver

**`arcSin`**

Answer the arc-sine of the receiver

**`arcTan`**

Answer the arc-tangent of the receiver

**`ceiling`**

Answer the integer part of the receiver, truncated towards
\+infinity

**`cos`**

Answer the cosine of the receiver

**`exp`**

Answer 'e' (2.718281828459...)  raised to the receiver

**`floor`**

Answer the integer part of the receiver, truncated towards
\-infinity

**`ln`**

Answer the logarithm of the receiver in base 'e'
(2.718281828459...)

**`primHash`**

Private - Answer an hash value for the receiver

**`raisedTo: aNumber`**

Answer the receiver raised to its aNumber power

**`sin`**

Answer the sine of the receiver

**`sqrt`**

Answer the square root of the receiver

**`tan`**

Answer the tangent of the receiver

#### 1.80.6 Float: coercing

**`asExactFraction`**

Convert the receiver into a fraction with optimal approximation,
but with usually huge terms.

**`asFraction`**

Convert the receiver into a fraction with a good (but undefined)
approximation

**`truncated`**

Convert the receiver to an Integer.  Only used for LargeIntegers,
there are primitives for the other cases.

#### 1.80.7 Float: coercion

**`asCNumber`**

Convert the receiver to a kind of number that is understood by the
C call-out mechanism.

#### 1.80.8 Float: comparing

**`max: aNumber`**

Answer the maximum between the receiver and aNumber.  Redefine in
subclasses if necessary to ensure that if either self or aNumber is
a NaN, it is always answered.

**`min: aNumber`**

Answer the minimum between the receiver and aNumber.  Redefine in
subclasses if necessary to ensure that if either self or aNumber is
a NaN, it is always answered.

**`withSignOf: aNumber`**

Answer the receiver, with its sign possibly changed to match that
of aNumber.

#### 1.80.9 Float: compiler

**`literalEquals: anObject`**

Not commented.

**`literalHash`**

Not commented.

#### 1.80.10 Float: converting

**`half`**

Answer 0.5 in the representation of the receiver

#### 1.80.11 Float: floating point

**`predecessor`**

Not commented.

**`successor`**

Not commented.

#### 1.80.12 Float: misc math

**`log: aNumber`**

Answer log base aNumber of the receiver

#### 1.80.13 Float: printing

**`printOn: aStream`**

Print a representation of the receiver on aStream

#### 1.80.14 Float: storing

**`isLiteralObject`**

Answer whether the receiver is expressible as a Smalltalk literal.

**`storeLiteralOn: aStream`**

Store on aStream some Smalltalk code which compiles to the receiver

**`storeOn: aStream`**

Print a representation of the receiver on aStream

#### 1.80.15 Float: testing

**`isExact`**

Answer whether the receiver performs exact arithmetic.  Floats do
not.

**`isFinite`**

Answer whether the receiver does not represent infinity, nor a NaN

**`isInfinite`**

Answer whether the receiver represents positive or negative
infinity

**`isNaN`**

Answer whether the receiver represents a NaN

**`negative`**

Answer whether the receiver is negative

**`positive`**

Answer whether the receiver is positive.  Negative zero is not
positive, so the definition is not simply \>= 0.

**`sign`**

Answer 1 if the receiver is greater than 0, -1 if less than 0, else
0\.  Negative zero is the same as positive zero.

**`strictlyPositive`**

Answer whether the receiver is \> 0

#### 1.80.16 Float: testing functionality

**`isFloat`**

Answer 'true'.

#### 1.80.17 Float: transcendental operations

**`asFloat`**

Just defined for completeness.  Return the receiver.

**`ceilingLog: radix`**

Answer (self log: radix) ceiling.  Use exact arithmetic if radix is
not a floating point value.

**`estimatedLog`**

Answer an estimate of (self abs floorLog: 10)

**`floorLog: radix`**

Answer (self log: radix) floor.  Use exact arithmetic if radix is
not a floating point value.

**`log`**

Answer log base 10 of the receiver.

#### 1.80.18 Float: truncation and round off

**`rounded`**

Answer the receiver, rounded to the nearest integer

### 1.81 FloatD

**Namespace:** Smalltalk · **Superclass:** [Float](#180-float) · **Category:** Language-Data types

My instances represent floating point numbers that have the same
accuracy as C's "double" numbers.

#### 1.81.1 FloatD class: byte-order dependencies

**`fromBytes: aByteArray`**

Answer a float with the bytes in aByteArray, which are in
big-endian format.

**`signByte`**

Answer the byte of the receiver that contains the sign bit

#### 1.81.2 FloatD class: characterization

**`decimalDigits`**

Return the number of decimal digits of precision for a FloatD.
Technically, if P is the precision for the representation, then the
decimal precision Q is the maximum number of decimal digits such
that any floating point number with Q base 10 digits can be rounded
to a floating point number with P base 2 digits and back again,
without change to the Q decimal digits.

**`emax`**

Return the maximum allowable exponent for a FloatD that is finite.

**`emin`**

Return the maximum allowable exponent for a FloatD that is finite.

**`fmax`**

Return the largest normalized FloatD that is not infinite.

**`fminNormalized`**

Return the smallest normalized FloatD that is \> 0

**`infinity`**

Return a FloatD that represents positive infinity.

**`nan`**

Return a FloatD that represents a mathematically indeterminate
value (e.g.  Inf - Inf, Inf / Inf).

**`negativeInfinity`**

Return a FloatD that represents negative infinity.

**`precision`**

Answer the number of bits in the mantissa.  1 + (2^-precision) = 1

#### 1.81.3 FloatD class: converting

**`coerce: aNumber`**

Answer aNumber converted to a FloatD

#### 1.81.4 FloatD: built ins

**`* arg`**

Multiply the receiver and arg and answer another Number

**`+ arg`**

Sum the receiver and arg and answer another Number

**`- arg`**

Subtract arg from the receiver and answer another Number

**`/ arg`**

Divide the receiver by arg and answer another FloatD

**`< arg`**

Answer whether the receiver is less than arg

**`<= arg`**

Answer whether the receiver is less than or equal to arg

**`= arg`**

Answer whether the receiver is equal to arg

**`> arg`**

Answer whether the receiver is greater than arg

**`>= arg`**

Answer whether the receiver is greater than or equal to arg

**`asFloatE`**

Answer the receiver converted to a FloatE

**`asFloatQ`**

Answer the receiver converted to a FloatQ

**`exponent`**

Answer the exponent of the receiver in mantissa\*2^exponent
representation ( \|mantissa\|\<=1 )

**`fractionPart`**

Answer the fractional part of the receiver

**`timesTwoPower: arg`**

Answer the receiver multiplied by 2^arg

**`truncated`**

Truncate the receiver towards zero and answer the result

**`~= arg`**

Answer whether the receiver is not equal to arg

#### 1.81.5 FloatD: coercing

**`asFloatD`**

Just defined for completeness.  Return the receiver.

**`coerce: aNumber`**

Coerce aNumber to the receiver's class

**`generality`**

Answer the receiver's generality

**`unity`**

Coerce 1 to the receiver's class

**`zero`**

Coerce 0 to the receiver's class

#### 1.81.6 FloatD: converting

**`half`**

Coerce 0.5 to the receiver's class

### 1.82 FloatE

**Namespace:** Smalltalk · **Superclass:** [Float](#180-float) · **Category:** Language-Data types

My instances represent floating point numbers that have the same
accuracy as C's "float" numbers.

#### 1.82.1 FloatE class: byte-order dependancies

**`signByte`**

Answer the byte of the receiver that contains the sign bit

#### 1.82.2 FloatE class: byte-order dependencies

**`fromBytes: aByteArray`**

Answer a float with the bytes in aByteArray, which are in
big-endian format.

#### 1.82.3 FloatE class: characterization

**`decimalDigits`**

Return the number of decimal digits of precision for a FloatE.
Technically, if P is the precision for the representation, then the
decimal precision Q is the maximum number of decimal digits such
that any floating point number with Q base 10 digits can be rounded
to a floating point number with P base 2 digits and back again,
without change to the Q decimal digits.

**`e`**

Returns the value of e.  Hope is that it is precise enough

**`emax`**

Return the maximum allowable exponent for a FloatE that is finite.

**`emin`**

Return the maximum allowable exponent for a FloatE that is finite.

**`fmax`**

Return the largest normalized FloatE that is not infinite.

**`fminNormalized`**

Return the smallest normalized FloatE that is \> 0

**`infinity`**

Return a FloatE that represents positive infinity.

**`ln10`**

Returns the value of ln 10.  Hope is that it is precise enough

**`log10Base2`**

Returns the value of log2 10.  Hope is that it is precise enough

**`nan`**

Return a FloatE that represents a mathematically indeterminate
value (e.g.  Inf - Inf, Inf / Inf).

**`negativeInfinity`**

Return a FloatE that represents negative infinity.

**`pi`**

Returns the value of pi.  Hope is that it is precise enough

**`precision`**

Answer the number of bits in the mantissa.  1 + (2^-precision) = 1

#### 1.82.4 FloatE class: converting

**`coerce: aNumber`**

Answer aNumber converted to a FloatE

#### 1.82.5 FloatE: built ins

**`* arg`**

Multiply the receiver and arg and answer another Number

**`+ arg`**

Sum the receiver and arg and answer another Number

**`- arg`**

Subtract arg from the receiver and answer another Number

**`/ arg`**

Divide the receiver by arg and answer another FloatE

**`< arg`**

Answer whether the receiver is less than arg

**`<= arg`**

Answer whether the receiver is less than or equal to arg

**`= arg`**

Answer whether the receiver is equal to arg

**`> arg`**

Answer whether the receiver is greater than arg

**`>= arg`**

Answer whether the receiver is greater than or equal to arg

**`asFloatD`**

Answer the receiver converted to a FloatD

**`asFloatQ`**

Answer the receiver converted to a FloatQ

**`exponent`**

Answer the exponent of the receiver in mantissa\*2^exponent
representation ( \|mantissa\|\<=1 )

**`fractionPart`**

Answer the fractional part of the receiver

**`timesTwoPower: arg`**

Answer the receiver multiplied by 2^arg

**`truncated`**

Truncate the receiver towards zero and answer the result

**`~= arg`**

Answer whether the receiver is not equal to arg

#### 1.82.6 FloatE: coercing

**`asFloatE`**

Just defined for completeness.  Return the receiver.

**`coerce: aNumber`**

Coerce aNumber to the receiver's class

**`generality`**

Answer the receiver's generality

**`unity`**

Coerce 1 to the receiver's class

**`zero`**

Coerce 0 to the receiver's class

#### 1.82.7 FloatE: converting

**`half`**

Coerce 0.5 to the receiver's class

### 1.83 FloatQ

**Namespace:** Smalltalk · **Superclass:** [Float](#180-float) · **Category:** Language-Data types

My instances represent floating point numbers that have the same
accuracy as C's "long double" numbers.

#### 1.83.1 FloatQ class: byte-order dependancies

**`signByte`**

Answer the byte of the receiver that contains the sign bit

#### 1.83.2 FloatQ class: characterization

**`decimalDigits`**

Return the number of decimal digits of precision for a FloatQ.
Technically, if P is the precision for the representation, then the
decimal precision Q is the maximum number of decimal digits such
that any floating point number with Q base 10 digits can be rounded
to a floating point number with P base 2 digits and back again,
without change to the Q decimal digits.

**`e`**

Returns the value of e.  Hope is that it is precise enough

**`emax`**

Return the maximum allowable exponent for a FloatQ that is finite.

**`emin`**

Return the maximum allowable exponent for a FloatQ that is finite.

**`fmax`**

Return the largest normalized FloatQ that is not infinite.

**`fminNormalized`**

Return the smallest normalized FloatQ that is \> 0

**`infinity`**

Return a FloatQ that represents positive infinity.

**`ln10`**

Returns the value of ln 10.  Hope is that it is precise enough

**`log10Base2`**

Returns the value of log2 10.  Hope is that it is precise enough

**`nan`**

Return a FloatQ that represents a mathematically indeterminate
value (e.g.  Inf - Inf, Inf / Inf).

**`negativeInfinity`**

Return a FloatQ that represents negative infinity.

**`pi`**

Returns the value of pi.  Hope is that it is precise enough

**`precision`**

Answer the number of bits in the mantissa.  1 + (2^-precision) = 1

#### 1.83.3 FloatQ class: converting

**`coerce: aNumber`**

Answer aNumber converted to a FloatQ

#### 1.83.4 FloatQ: built ins

**`* arg`**

Multiply the receiver and arg and answer another Number

**`+ arg`**

Sum the receiver and arg and answer another Number

**`- arg`**

Subtract arg from the receiver and answer another Number

**`/ arg`**

Divide the receiver by arg and answer another FloatQ

**`< arg`**

Answer whether the receiver is less than arg

**`<= arg`**

Answer whether the receiver is less than or equal to arg

**`= arg`**

Answer whether the receiver is equal to arg

**`> arg`**

Answer whether the receiver is greater than arg

**`>= arg`**

Answer whether the receiver is greater than or equal to arg

**`asFloatD`**

Answer the receiver converted to a FloatD

**`asFloatE`**

Answer the receiver converted to a FloatE

**`exponent`**

Answer the exponent of the receiver in mantissa\*2^exponent
representation ( \|mantissa\|\<=1 )

**`fractionPart`**

Answer the fractional part of the receiver

**`timesTwoPower: arg`**

Answer the receiver multiplied by 2^arg

**`truncated`**

Truncate the receiver towards zero and answer the result

**`~= arg`**

Answer whether the receiver is not equal to arg

#### 1.83.5 FloatQ: coercing

**`asFloatQ`**

Just defined for completeness.  Return the receiver.

**`coerce: aNumber`**

Coerce aNumber to the receiver's class

**`generality`**

Answer the receiver's generality

**`unity`**

Coerce 1 to the receiver's class

**`zero`**

Coerce 0 to the receiver's class

#### 1.83.6 FloatQ: converting

**`half`**

Coerce 0.5 to the receiver's class

### 1.84 Fraction

**Namespace:** Smalltalk · **Superclass:** [Number](#1122-number) · **Category:** Language-Data types

I represent rational numbers in the form (p/q) where p and q are
integers.  The arithmetic operations \*, +, -, /, on fractions, all
return a reduced fraction.

#### 1.84.1 Fraction class: converting

**`coerce: aNumber`**

Answer aNumber converted to a Fraction

#### 1.84.2 Fraction class: instance creation

**`initialize`**

Initialize the receiver's class variables

**`numerator: nInteger denominator: dInteger`**

Answer a new instance of fraction (nInteger/dInteger)

#### 1.84.3 Fraction: accessing

**`denominator`**

Answer the receiver's denominator

**`numerator`**

Answer the receiver's numerator

#### 1.84.4 Fraction: arithmetic

**`* aNumber`**

Multiply two numbers and answer the result.

**`+ aNumber`**

Sum two numbers and answer the result.

**`- aNumber`**

Subtract aNumber from the receiver and answer the result.

**`/ aNumber`**

Divide the receiver by aNumber and answer the result.

**`// aNumber`**

Return the integer quotient of dividing the receiver by aNumber
with truncation towards negative infinity.

**`\\ aNumber`**

Return the remainder from dividing the receiver by aNumber, (using
//).

**`estimatedLog`**

Answer an estimate of (self abs floorLog: 10)

#### 1.84.5 Fraction: coercing

**`ceiling`**

Truncate the receiver towards positive infinity and return the
truncated result

**`coerce: aNumber`**

Coerce aNumber to the receiver's class

**`floor`**

Truncate the receiver towards negative infinity and return the
truncated result

**`generality`**

Return the receiver's generality

**`truncated`**

Truncate the receiver and return the truncated result

**`unity`**

Coerce 1 to the receiver's class

**`zero`**

Coerce 0 to the receiver's class

#### 1.84.6 Fraction: coercion

**`asCNumber`**

Convert the receiver to a kind of number that is understood by the
C call-out mechanism.

#### 1.84.7 Fraction: comparing

**`< arg`**

Test if the receiver is less than arg.

**`<= arg`**

Test if the receiver is less than or equal to arg.

**`= arg`**

Test if the receiver equals arg.

**`> arg`**

Test if the receiver is more than arg.

**`>= arg`**

Test if the receiver is greater than or equal to arg.

**`hash`**

Answer an hash value for the receiver

#### 1.84.8 Fraction: converting

**`asExactFraction`**

Answer the receiver, it is already a Fraction

**`asFloatD`**

Answer the receiver converted to a FloatD

**`asFloatE`**

Answer the receiver converted to a FloatD

**`asFloatQ`**

Answer the receiver converted to a FloatD

**`asFraction`**

Answer the receiver, it is already a Fraction

**`integerPart`**

Answer the integer part of the receiver, expressed as a Fraction

#### 1.84.9 Fraction: optimized cases

**`negated`**

Return the receiver, with its sign changed.

**`raisedToInteger: anInteger`**

Return self raised to the anInteger-th power.

**`reciprocal`**

Return the reciprocal of the receiver

**`sqrt`**

Return the square root of the receiver.

**`squared`**

Return the square of the receiver.

#### 1.84.10 Fraction: printing

**`printOn: aStream`**

Print a representation of the receiver on aStream

**`storeOn: aStream`**

Store Smalltalk code compiling to the receiver on aStream

#### 1.84.11 Fraction: testing

**`isRational`**

Answer whether the receiver is rational - true

### 1.85 Generator

**Namespace:** Smalltalk · **Superclass:** [Stream](#1157-stream) · **Category:** Streams-Generators

A Generator object provides a way to use blocks to define a Stream
of many return values.  The return values are computed one at a
time, as needed, and hence need not even be finite.

A generator block is converted to a Generator with "Generator on:
\[...\]".  The Generator itself is passed to the block, and as soon
as a message like #next, #peek, #atEnd or #peekFor: is sent to the
generator, execution of the block starts/resumes and goes on until
the generator's #yield: method is called: then the argument of
\#yield: will be the Generator's next element.  If the block goes on
to the end without calling #yield:, the Generator will produce no
more elements and #atEnd will return true.

You could achieve the effect of generators manually by writing your
own class and storing all the local variables of the generator as
instance variables.  For example, returning a list of integers
could be done by setting a variable to 0, and having the #next
method increment it and return it.  However, for a moderately
complicated generator, writing a corresponding class would be much
messier (and might lead to code duplication or inefficiency if you
want to support #peek, #peekFor: and/or #atEnd): in general,
providing a #do:-like interface is easy, but not providing a
Stream-like one (think binary trees).

The idea of generators comes from other programming languages, in
particular this interface looks much like Scheme streams and Python
generators.  But Python in turn mutuated the idea for example from
Icon, where the idea of generators is central.  In Icon, every
expression and function call behaves like a generator, and if a
statement manages scalars, it automatically uses up all the results
that the corresponding generator provides; on the other hand, Icon
does not represent generators as first-class objects like Python
and Smalltalk do.

#### 1.85.1 Generator class: instance creation

**`inject: aValue into: aBlock`**

Return an infinite generator; the first item is aValue, the
following items are obtained by passing the previous value to
aBlock.

**`on: aBlock`**

Return a generator and pass it to aBlock.  When #next is sent to
the generator, the block will start execution, and will be
suspended again as soon as #yield: is sent from the block to the
generator.

**`on: aCollection do: aBlock`**

Return a generator; for each item of aCollection, evaluate aBlock
passing the generator and the item.

#### 1.85.2 Generator: stream protocol

**`atEnd`**

Answer whether more data can be generated.

**`next`**

Evaluate the generator until it generates the next value or decides
that nothing else can be generated.

**`peek`**

Evaluate the generator until it generates the next value or decides
that nothing else can be generated, and save the value so that
\#peek or #next will return it again.

**`peekFor: anObject`**

Evaluate the generator until it generates the next value or decides
that nothing else can be generated, and if it is not equal to
anObject, save the value so that #peek or #next will return it
again.

**`yield: anObject`**

When entering from the generator the code in the block is executed
and control flow goes back to the consumer.  When entering from the
consumer, the code after the continuation is executed, which
resumes execution of the generator block.

### 1.86 Getopt

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Data types

This class is usually not instantiated.  Class methods provide a
way to parse command lines from Smalltalk.

#### 1.86.1 Getopt class: instance creation

**`parse: args with: pattern do: actionBlock`**

Parse the command-line arguments in args according to the syntax
specified in pattern.  For every command-line option found, the
two-argument block actionBlock is evaluated passing the option name
and the argument.  For file names (or in general, other
command-line arguments than options) the block's first argument
will be nil.  For options without arguments, or with unspecified
optional arguments, the block's second argument will be nil.  The
option name will be passed as a character object for short options,
and as a string for long options.

If an error is found, nil is returned.  For more information on the
syntax of pattern, see #parse:with:do:ifError:.

**`parse: args with: pattern do: actionBlock ifError: errorBlock`**

Parse the command-line arguments in args according to the syntax
specified in pattern.  For every command-line option found, the
two-argument block actionBlock is evaluated passing the option name
and the argument.  For file names (or in general, other
command-line arguments than options) the block's first argument
will be nil.  For options without arguments, or with unspecified
optional arguments, the block's second argument will be nil.  The
option name will be passed as a character object for short options,
and as a string for long options.

If an error is found, the parsing is interrupted, errorBlock is
evaluated, and the returned value is answered.

Every whitespace-separated part ('word') of pattern specifies a
command-line option.  If a word ends with a colon, the option will
have a mandatory argument.  If a word ends with two colons, the
option will have an optional argument.  Before the colons, multiple
option names (either short names like '-l' or long names like
'-long') can be specified.  Before passing the option to
actionBlock, the name will be canonicalized to the last one.

Prefixes of long options are accepted as long as they're unique,
and they are canonicalized to the full name before passing it to
actionBlock.  Additionally, the full name of an option is accepted
even if it is the prefix of a longer option.

Mandatory arguments can appear in the next argument, or in the same
argument (separated by an = for arguments to long options).
Optional arguments must appear in the same argument.

### 1.87 Halt

**Namespace:** Smalltalk · **Superclass:** [Exception](#172-exception) · **Category:** Language-Exceptions

Halt represents a resumable error, usually a bug.

#### 1.87.1 Halt: description

**`description`**

Answer a textual description of the exception.

**`isResumable`**

Answer true.  #halt exceptions are by default resumable.

### 1.88 HashedCollection

**Namespace:** Smalltalk · **Superclass:** [Collection](#137-collection) · **Category:** Collections-Unordered

I am an hashed collection that can store objects uniquely and give
fast responses on their presence in the collection.

#### 1.88.1 HashedCollection class: instance creation

**`new`**

Answer a new instance of the receiver with a default size

**`new: anInteger`**

Answer a new instance of the receiver with the given capacity

**`withAll: aCollection`**

Answer a collection whose elements are all those in aCollection

#### 1.88.2 HashedCollection: accessing

**`add: newObject`**

Add newObject to the set, if and only if the set doesn't already
contain an occurrence of it.  Don't fail if a duplicate is found.
Answer anObject

**`at: index`**

This method should not be called for instances of this class.

**`at: index put: value`**

This method should not be called for instances of this class.

#### 1.88.3 HashedCollection: builtins

**`primAt: anIndex`**

Private - Answer the anIndex-th item of the hash table for the
receiver.  Using this instead of basicAt: allows for easier changes
in the representation

**`primAt: anIndex put: value`**

Private - Store value in the anIndex-th item of the hash table for
the receiver.  Using this instead of basicAt:put: allows for easier
changes in the representation

**`primSize`**

Private - Answer the size of the hash table for the receiver.
Using this instead of basicSize allows for easier changes in the
representation

#### 1.88.4 HashedCollection: copying

**`deepCopy`**

Returns a deep copy of the receiver (the instance variables are
copies of the receiver's instance variables)

**`shallowCopy`**

Returns a shallow copy of the receiver (the instance variables are
not copied)

#### 1.88.5 HashedCollection: enumerating the elements of a collection

**`do: aBlock`**

Enumerate all the non-nil members of the set

#### 1.88.6 HashedCollection: rehashing

**`rehash`**

Rehash the receiver

#### 1.88.7 HashedCollection: removing

**`remove: oldObject ifAbsent: anExceptionBlock`**

Remove oldObject from the set.  If it is found, answer oldObject.
Otherwise, evaluate anExceptionBlock and answer its value.

#### 1.88.8 HashedCollection: saving and loading

**`postLoad`**

Called after loading an object; rehash the collection because
identity objects will most likely mutate their hashes.

**`postStore`**

Called after an object is dumped.  Do nothing - necessary because
by default this calls #postLoad by default

#### 1.88.9 HashedCollection: storing

**`storeOn: aStream`**

Store on aStream some Smalltalk code which compiles to the receiver

#### 1.88.10 HashedCollection: testing collections

**`= aHashedCollection`**

Returns true if the two sets have the same membership, false if not

**`capacity`**

Answer how many elements the receiver can hold before having to
grow.

**`hash`**

Return the hash code for the members of the set.  Since order is
unimportant, we use a commutative operator to compute the hash
value.

**`includes: anObject`**

Answer whether the receiver contains an instance of anObject.

**`isEmpty`**

Answer whether the receiver is empty.

**`occurrencesOf: anObject`**

Return the number of occurrences of anObject.  Since we're a set,
this is either 0 or 1.  Nil is never directly in the set, so we
special case it (the result is always 1).

**`size`**

Answer the receiver's size

### 1.89 HomedAssociation

**Namespace:** Smalltalk · **Superclass:** [Association](#16-association) · **Category:** Language-Data types

My instances represent know about their parent namespace, which is
of use when implementing weak collections and finalizations.

#### 1.89.1 HomedAssociation class: basic

**`key: aKey value: aValue environment: aNamespace`**

Answer a new association with the given key and value

#### 1.89.2 HomedAssociation: accessing

**`environment`**

Answer the namespace in which I live.

**`environment: aNamespace`**

Set the namespace in which I live to be aNamespace.

#### 1.89.3 HomedAssociation: finalization

**`mourn`**

This message is sent to the receiver when the object is made
ephemeron (which is common when HomedAssociations are used by a
WeakKeyDictionary or a WeakSet).  The mourning of the object's key
is first of all demanded to the environment (which will likely
remove the object from itself), and then performed as usual by
clearing the key and value fields.

#### 1.89.4 HomedAssociation: storing

**`storeOn: aStream`**

Put on aStream some Smalltalk code compiling to the receiver

### 1.90 IdentityDictionary

**Namespace:** Smalltalk · **Superclass:** [LookupTable](#1106-lookuptable) · **Category:** Collections-Keyed

I am similar to LookupTable, except that I use the object identity
comparision message == to determine equivalence of indices.

### 1.91 IdentitySet

**Namespace:** Smalltalk · **Superclass:** [Set](#1152-set) · **Category:** Collections-Unordered

I am the typical set object; I can store any objects uniquely.  I
use the == operator to determine duplication of objects.

#### 1.91.1 IdentitySet: testing

**`identityIncludes: anObject`**

Answer whether we include the anObject object; for IdentitySets
this is identical to #includes:

### 1.92 Integer

**Namespace:** Smalltalk · **Superclass:** [Number](#1122-number) · **Category:** Language-Data types

I am the abstract integer class of the GNU Smalltalk system.  My
subclasses' instances can represent signed integers of various
sizes (a subclass is picked according to the size), with varying
efficiency.

#### 1.92.1 Integer class: converting

**`coerce: aNumber`**

Answer aNumber converted to a kind of Integer

#### 1.92.2 Integer: accessing

**`denominator`**

Answer '1'.

**`numerator`**

Answer the receiver.

#### 1.92.3 Integer: basic

**`hash`**

Answer an hash value for the receiver

#### 1.92.4 Integer: bit operators

**`allMask: anInteger`**

True if all 1 bits in anInteger are 1 in the receiver

**`anyMask: anInteger`**

True if any 1 bits in anInteger are 1 in the receiver

**`bitAt: index`**

Answer the index-th bit of the receiver (the LSB has an index of 1)

**`bitAt: index put: value`**

Answer an integer which is identical to the receiver, possibly with
the exception of the index-th bit of the receiver (the LSB having
an index of 1), which assumes a value equal to the low-order bit of
the second parameter.

**`bitClear: aMask`**

Answer an Integer equal to the receiver, except that all the bits
that are set in aMask are cleared.

**`bitInvert`**

Return the 1's complement of the bits of the receiver

**`clearBit: index`**

Clear the index-th bit of the receiver and answer a new Integer

**`digitAt: index`**

Answer the index-th base-256 digit of the receiver (byte),
expressed in two's complement

**`highBit`**

Return the index of the highest order 1 bit of the receiver.

**`isBitSet: index`**

Answer whether the index-th bit of the receiver is set

**`lowBit`**

Return the index of the lowest order 1 bit of the receiver.

**`noMask: anInteger`**

Answer true if no 1 bits in anInteger are 1 in the receiver.

**`setBit: index`**

Set the index-th bit of the receiver and answer a new Integer

#### 1.92.5 Integer: converting

**`asCharacter`**

Return self as a Character or UnicodeCharacter object.

**`asFraction`**

Return the receiver converted to a fraction

**`asScaledDecimal: n`**

Answer the receiver, converted to a ScaledDecimal object.  The
scale is forced to be 0.

**`ceiling`**

Return the receiver - it's already truncated

**`coerce: aNumber`**

Coerce aNumber to the receiver's class.

**`floor`**

Return the receiver - it's already truncated

**`rounded`**

Return the receiver - it's already truncated

**`truncated`**

Return the receiver - it's already truncated

#### 1.92.6 Integer: extension

**`alignTo: anInteger`**

Answer the receiver, truncated to the first higher or equal
multiple of anInteger (which must be a power of two)

#### 1.92.7 Integer: iterators

**`timesRepeat: aBlock`**

Evaluate aBlock a number of times equal to the receiver's value.
Compiled in-line for no argument aBlocks without temporaries, and
therefore not overridable.

#### 1.92.8 Integer: math methods

**`binomial: anInteger`**

Compute the number of combinations of anInteger objects among a
number of objects given by the receiver.

**`ceilingLog: radix`**

Answer (self log: radix) ceiling.  Optimized to answer an integer.

**`estimatedLog`**

Answer an estimate of (self abs floorLog: 10)

**`even`**

Return whether the receiver is even

**`factorial`**

Return the receiver's factorial.

**`floorLog: radix`**

Answer (self log: radix) floor.  Optimized to answer an integer.

**`gcd: anInteger`**

Return the greatest common divisor (Euclid's algorithm) between the
receiver and anInteger

**`lcm: anInteger`**

Return the least common multiple between the receiver and anInteger

**`odd`**

Return whether the receiver is odd

#### 1.92.9 Integer: printing

**`displayOn: aStream`**

Print on aStream the base 10 representation of the receiver

**`displayString`**

Return the base 10 representation of the receiver

**`isLiteralObject`**

Answer whether the receiver is expressible as a Smalltalk literal.

**`printOn: aStream`**

Print on aStream the base 10 representation of the receiver

**`printOn: aStream base: b`**

Print on aStream the base b representation of the receiver

**`printOn: aStream paddedWith: padding to: size`**

Print on aStream the base 10 representation of the receiver, padded
if necessary to size characters with copies of padding.

**`printOn: aStream paddedWith: padding to: size base: baseInteger`**

Print on aStream the base b representation of the receiver, padded
if necessary to size characters with copies of padding.

**`printPaddedWith: padding to: size`**

Return the base baseInteger representation of the receiver, padded
if necessary to size characters with copies of padding.

**`printPaddedWith: padding to: size base: baseInteger`**

Return the base baseInteger representation of the receiver, padded
if necessary to size characters with copies of padding.

**`printString`**

Return the base 10 representation of the receiver

**`printString: baseInteger`**

Return the base baseInteger representation of the receiver

**`printStringRadix: baseInteger`**

Return the base baseInteger representation of the receiver, with
BBr in front of it

**`radix: baseInteger`**

Return the base baseInteger representation of the receiver, with
BBr in front of it.  This method is deprecated, use
\#printStringRadix: instead.

**`storeLiteralOn: aStream`**

Store on aStream some Smalltalk code which compiles to the receiver

**`storeOn: aStream base: b`**

Print on aStream Smalltalk code compiling to the receiver,
represented in base b

#### 1.92.10 Integer: storing

**`storeOn: aStream`**

Print on aStream the base 10 representation of the receiver

**`storeString`**

Return the base 10 representation of the receiver

#### 1.92.11 Integer: testing functionality

**`isInteger`**

Answer 'true'.

**`isRational`**

Answer whether the receiver is rational - true

### 1.93 Interval

**Namespace:** Smalltalk · **Superclass:** [ArrayedCollection](#15-arrayedcollection) · **Category:** Collections-Sequenceable

My instances represent ranges of objects, typically Number type
objects.  I provide iteration/enumeration messages for producing
all the members that my instance represents.

#### 1.93.1 Interval class: instance creation

**`from: startInteger to: stopInteger`**

Answer an Interval going from startInteger to the stopInteger, with
a step of 1

**`from: startInteger to: stopInteger by: stepInteger`**

Answer an Interval going from startInteger to the stopInteger, with
a step of stepInteger

**`withAll: aCollection`**

Answer an Interval containing the same elements as aCollection.
Fail if it is not possible to create one.

#### 1.93.2 Interval: basic

**`at: index`**

Answer the index-th element of the receiver.

**`at: index put: anObject`**

This method should not be called for instances of this class.

**`collect: aBlock`**

Evaluate the receiver for each element in aBlock, collect in an
array the result of the evaluations.

**`copyFrom: startIndex to: stopIndex`**

Not commented.

**`do: aBlock`**

Evaluate the receiver for each element in aBlock

**`isEmpty`**

Answer whether the receiver is empty.

**`reverse`**

Answer a copy of the receiver with all of its items reversed

**`size`**

Answer the number of elements in the receiver.

**`species`**

Answer 'Array'.

#### 1.93.3 Interval: printing

**`first`**

Not commented.

**`increment`**

Answer 'step'.

**`last`**

Answer the last value.

**`printOn: aStream`**

Print a representation for the receiver on aStream

#### 1.93.4 Interval: storing

**`storeOn: aStream`**

Store Smalltalk code compiling to the receiver on aStream

#### 1.93.5 Interval: testing

**`= anInterval`**

Answer whether anInterval is the same interval as the receiver

**`hash`**

Answer an hash value for the receiver

**`isExact`**

Answer whether elements of the receiver are computed using exact
arithmetic.  This is true as long as the start and step value are
exact (i.e.  not floating-point).

### 1.94 Iterable

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Collections

I am an abstract class.  My instances are collections of objects
that can be iterated.  The details on how they can be mutated (if
at all possible) are left to the subclasses.

#### 1.94.1 Iterable class: multibyte encodings

**`isUnicode`**

Answer true; the receiver is able to store arbitrary Unicode
characters.

#### 1.94.2 Iterable: enumeration

**`, anIterable`**

Answer an iterable that enumerates first the elements of the
receiver and then the elements of anIterable.

**`allSatisfy: aBlock`**

Search the receiver for an element for which aBlock returns false.
Answer true if none does, false otherwise.

**`anySatisfy: aBlock`**

Search the receiver for an element for which aBlock returns true.
Answer true if some does, false otherwise.

**`collect: aBlock`**

Answer a new instance of a Collection containing all the results of
evaluating aBlock passing each of the receiver's elements

**`conform: aBlock`**

Search the receiver for an element for which aBlock returns false.
Answer true if none does, false otherwise.

**`contains: aBlock`**

Search the receiver for an element for which aBlock returns true.
Answer true if some does, false otherwise.

**`count: aBlock`**

Count the elements of the receiver for which aBlock returns true,
and return their number.

**`detect: aBlock`**

Search the receiver for an element for which aBlock returns true.
If some does, answer it.  If none does, fail

**`detect: aBlock ifNone: exceptionBlock`**

Search the receiver for an element for which aBlock returns true.
If some does, answer it.  If none does, answer the result of
evaluating aBlock

**`do: aBlock`**

Enumerate each object of the receiver, passing them to aBlock

**`do: aBlock separatedBy: separatorBlock`**

Enumerate each object of the receiver, passing them to aBlock.
Between every two invocations of aBlock, invoke separatorBlock

**`fold: binaryBlock`**

First, pass to binaryBlock the first and second elements of the
receiver; for each subsequent element, pass the result of the
previous evaluation and an element.  Answer the result of the last
invocation, or the first element if the collection has size 1.
Fail if the collection is empty.

**`inject: thisValue into: binaryBlock`**

First, pass to binaryBlock thisValue and the first element of the
receiver; for each subsequent element, pass the result of the
previous evaluation and an element.  Answer the result of the last
invocation.

**`noneSatisfy: aBlock`**

Search the receiver for an element for which aBlock returns true.
Answer true if none does, false otherwise.

**`reject: aBlock`**

Answer a new instance of a Collection containing all the elements
in the receiver which, when passed to aBlock, don't answer true

**`select: aBlock`**

Answer a new instance of a Collection containing all the elements
in the receiver which, when passed to aBlock, answer true

#### 1.94.3 Iterable: iteration

**`ifNil: nilBlock ifNotNilDo: iterableBlock`**

Evaluate nilBlock if the receiver is nil, else evaluate
iterableBlock with each element of the receiver (which should be an
Iterable).

**`ifNotNilDo: iterableBlock`**

Evaluate iterableBlock with each element of the receiver (which
should be an Iterable) if not nil.  Else answer nil

**`ifNotNilDo: iterableBlock ifNil: nilBlock`**

Evaluate nilBlock if the receiver is nil, else evaluate
iterableBlock, passing each element of the receiver (which should
be an Iterable).

#### 1.94.4 Iterable: streaming

**`nextPutAllOn: aStream`**

Write all the objects in the receiver to aStream

**`readStream`**

Return a stream with the same contents as the receiver.

### 1.95 LargeArray

**Namespace:** Smalltalk · **Superclass:** [LargeArrayedCollection](#196-largearrayedcollection) · **Category:** Collections-Sequenceable

I am similar to a plain array, but I'm specially designed to save
memory when lots of items are nil.

#### 1.95.1 LargeArray: overridden

**`newCollection: size`**

Create an Array of the given size

### 1.96 LargeArrayedCollection

**Namespace:** Smalltalk · **Superclass:** [ArrayedCollection](#15-arrayedcollection) · **Category:** Collections-Sequenceable

I am an abstract class specially designed to save memory when lots
of items have the same value.

#### 1.96.1 LargeArrayedCollection class: instance creation

**`new: anInteger`**

Answer a new instance of the receiver, with room for anInteger
elements.

#### 1.96.2 LargeArrayedCollection: accessing

**`at: anIndex`**

Answer the anIndex-th item of the receiver.

**`at: anIndex put: anObject`**

Replace the anIndex-th item of the receiver with anObject.

**`compress`**

Arrange the representation of the array for maximum memory saving.

#### 1.96.3 LargeArrayedCollection: basic

**`= aLargeArray`**

Answer whether the receiver and aLargeArray have the same contents

**`hash`**

Answer an hash value for the receiver

**`size`**

Answer the maximum valid index for the receiver

### 1.97 LargeByteArray

**Namespace:** Smalltalk · **Superclass:** [LargeArrayedCollection](#196-largearrayedcollection) · **Category:** Collections-Sequenceable

I am similar to a plain ByteArray, but I'm specially designed to
save memory when lots of items are zero.

#### 1.97.1 LargeByteArray: overridden

**`costOfNewIndex`**

Answer the maximum number of consecutive items set to the
defaultElement that can be present in a compressed array.

**`defaultElement`**

Answer the value which is hoped to be the most common in the array

**`newCollection: size`**

Create a ByteArray of the given size

### 1.98 LargeInteger

**Namespace:** Smalltalk · **Superclass:** [Integer](#192-integer) · **Category:** Language-Data types

I represent a large integer, which has to be stored as a long
sequence of bytes.  I have methods to do arithmetics and
comparisons, but I need some help from my children,
LargePositiveInteger and LargeNegativeInteger, to speed them up a
bit.

#### 1.98.1 LargeInteger: accessing

**`raisedToInteger: n`**

Return self raised to the anInteger-th power

#### 1.98.2 LargeInteger: arithmetic

**`* aNumber`**

Multiply aNumber and the receiver, answer the result

**`+ aNumber`**

Sum the receiver and aNumber, answer the result

**`- aNumber`**

Subtract aNumber from the receiver, answer the result

**`/ aNumber`**

Divide aNumber and the receiver, answer the result (an Integer or
Fraction)

**`// aNumber`**

Divide aNumber and the receiver, answer the result truncated
towards -infinity

**`\\ aNumber`**

Divide aNumber and the receiver, answer the remainder truncated
towards -infinity

**`divExact: aNumber`**

Dividing receiver by arg assuming that the remainder is zero, and
answer the result

**`estimatedLog`**

Answer an estimate of (self abs floorLog: 10)

**`negated`**

Answer the receiver's negated

**`quo: aNumber`**

Divide aNumber and the receiver, answer the result truncated
towards 0

**`rem: aNumber`**

Divide aNumber and the receiver, answer the remainder truncated
towards 0

#### 1.98.3 LargeInteger: bit operations

**`bitAnd: aNumber`**

Answer the receiver ANDed with aNumber

**`bitAt: aNumber`**

Answer the aNumber-th bit in the receiver, where the LSB is 1

**`bitInvert`**

Answer the receiver's 1's complement

**`bitOr: aNumber`**

Answer the receiver ORed with aNumber

**`bitShift: aNumber`**

Answer the receiver shifted by aNumber places

**`bitXor: aNumber`**

Answer the receiver XORed with aNumber

**`lowBit`**

Return the index of the lowest order 1 bit of the receiver.

#### 1.98.4 LargeInteger: built-ins

**`at: anIndex`**

Answer the anIndex-th byte in the receiver's representation

**`at: anIndex put: aNumber`**

Set the anIndex-th byte in the receiver's representation

**`digitAt: anIndex`**

Answer the index-th base-256 digit of the receiver (byte),
expressed in two's complement

**`digitAt: anIndex put: aNumber`**

Set the anIndex-th base-256 digit in the receiver's representation

**`digitLength`**

Answer the number of base-256 digits in the receiver

**`hash`**

Answer an hash value for the receiver

**`primReplaceFrom: start to: stop with: replacementString startingAt: replaceStart`**

Private - Replace the characters from start to stop with new
characters contained in replacementString (which, actually, can be
any variable byte class), starting at the replaceStart location of
replacementString

**`size`**

Answer the number of indexed instance variable in the receiver

#### 1.98.5 LargeInteger: coercion

**`asCNumber`**

Convert the receiver to a kind of number that is understood by the
C call-out mechanism.

**`coerce: aNumber`**

Truncate the number; if needed, convert it to LargeInteger
representation.

**`generality`**

Answer the receiver's generality

**`unity`**

Coerce 1 to the receiver's class

**`zero`**

Coerce 0 to the receiver's class

#### 1.98.6 LargeInteger: disabled

**`asObject`**

This method always fails.  The number of OOPs is far less than the
minimum number represented with a LargeInteger.

**`asObjectNoFail`**

Answer 'nil'.

#### 1.98.7 LargeInteger: primitive operations

**`basicLeftShift: totalShift`**

Private - Left shift the receiver by aNumber places

**`basicRightShift: totalShift`**

Private - Right shift the receiver by 'shift' places

**`largeNegated`**

Private - Same as negated, but always answer a LargeInteger

#### 1.98.8 LargeInteger: testing

**`< aNumber`**

Answer whether the receiver is smaller than aNumber

**`<= aNumber`**

Answer whether the receiver is smaller than aNumber or equal to it

**`= aNumber`**

Answer whether the receiver and aNumber identify the same number.

**`> aNumber`**

Answer whether the receiver is greater than aNumber

**`>= aNumber`**

Answer whether the receiver is greater than aNumber or equal to it

**`~= aNumber`**

Answer whether the receiver and aNumber identify different numbers.

### 1.99 LargeNegativeInteger

**Namespace:** Smalltalk · **Superclass:** [LargeInteger](#198-largeinteger) · **Category:** Language-Data types

Just like my brother LargePositiveInteger, I provide a few methods
that allow LargeInteger to determine the sign of a large integer in
a fast way during its calculations.  For example, I know that I am
smaller than any LargePositiveInteger

#### 1.99.1 LargeNegativeInteger: converting

**`asFloatD`**

Answer the receiver converted to a FloatD

**`asFloatE`**

Answer the receiver converted to a FloatE

**`asFloatQ`**

Answer the receiver converted to a FloatQ

#### 1.99.2 LargeNegativeInteger: numeric testing

**`abs`**

Answer the receiver's absolute value.

**`negative`**

Answer whether the receiver is \< 0

**`positive`**

Answer whether the receiver is \>= 0

**`sign`**

Answer the receiver's sign

**`strictlyPositive`**

Answer whether the receiver is \> 0

#### 1.99.3 LargeNegativeInteger: reverting to LargePositiveInteger

**`+ aNumber`**

Sum the receiver and aNumber, answer the result

**`- aNumber`**

Subtract aNumber from the receiver, answer the result

**`gcd: anInteger`**

Return the greatest common divisor between the receiver and
anInteger

**`highBit`**

Answer the receiver's highest bit's index

### 1.100 LargePositiveInteger

**Namespace:** Smalltalk · **Superclass:** [LargeInteger](#198-largeinteger) · **Category:** Language-Data types

Just like my brother LargeNegativeInteger, I provide a few methods
that allow LargeInteger to determine the sign of a large integer in
a fast way during its calculations.  For example, I know that I am
larger than any LargeNegativeInteger.  In addition I implement the
guts of arbitrary precision arithmetic.

#### 1.100.1 LargePositiveInteger: arithmetic

**`+ aNumber`**

Sum the receiver and aNumber, answer the result

**`- aNumber`**

Subtract aNumber from the receiver, answer the result

**`gcd: anInteger`**

Calculate the GCD between the receiver and anInteger

**`highBit`**

Answer the receiver's highest bit's index

#### 1.100.2 LargePositiveInteger: converting

**`asFloatD`**

Answer the receiver converted to a FloatD

**`asFloatE`**

Answer the receiver converted to a FloatE

**`asFloatQ`**

Answer the receiver converted to a FloatQ

**`replace: str withStringBase: radix`**

Return in a String str the base radix representation of the
receiver.

#### 1.100.3 LargePositiveInteger: helper byte-level methods

**`bytes: byteArray1 from: j compare: byteArray2`**

Private - Answer the sign of byteArray2 - byteArray1; the j-th byte
of byteArray1 is compared with the first of byteArray2, the j+1-th
with the second, and so on.

**`bytes: byteArray1 from: j subtract: byteArray2`**

Private - Sutract the bytes in byteArray2 from those in byteArray1

**`bytes: bytes multiply: anInteger`**

Private - Multiply the bytes in bytes by anInteger, which must be \<
255\.  Put the result back in bytes.

**`bytesLeftShift: aByteArray`**

Private - Left shift by 1 place the bytes in aByteArray

**`bytesLeftShift: aByteArray big: totalShift`**

Private - Left shift the bytes in aByteArray by totalShift places

**`bytesLeftShift: aByteArray n: shift`**

Private - Left shift by shift places the bytes in aByteArray (shift
\<= 7)

**`bytesRightShift: aByteArray big: totalShift`**

Private - Right shift the bytes in aByteArray by totalShift places

**`bytesRightShift: bytes n: aNumber`**

Private - Right shift the bytes in 'bytes' by 'aNumber' places
(shift \<= 7)

**`bytesTrailingZeros: bytes`**

Private - Answer the number of trailing zero bits in the receiver

**`primDivide: rhs`**

Private - Implements Knuth's divide and correct algorithm from
'Seminumerical Algorithms' 3rd Edition, section 4.3.1 (which is
basically an enhanced version of the divide 'algorithm' for
two-digit divisors which is taught in primary school!!!)

#### 1.100.4 LargePositiveInteger: numeric testing

**`abs`**

Answer the receiver's absolute value

**`negative`**

Answer whether the receiver is \< 0

**`positive`**

Answer whether the receiver is \>= 0

**`sign`**

Answer the receiver's sign

**`strictlyPositive`**

Answer whether the receiver is \> 0

#### 1.100.5 LargePositiveInteger: primitive operations

**`divide: aNumber using: aBlock`**

Private - Divide the receiver by aNumber (unsigned division).
Evaluate aBlock passing the result ByteArray, the remainder
ByteArray, and whether the division had a remainder

**`isSmall`**

Private - Answer whether the receiver is small enough to employ
simple scalar algorithms for division and multiplication

**`multiply: aNumber`**

Private - Multiply the receiver by aNumber (unsigned multiply)

### 1.101 LargeWordArray

**Namespace:** Smalltalk · **Superclass:** [LargeArrayedCollection](#196-largearrayedcollection) · **Category:** Collections-Sequenceable

I am similar to a plain WordArray, but I'm specially designed to
save memory when lots of items are zero.

#### 1.101.1 LargeWordArray: overridden

**`defaultElement`**

Answer the value which is hoped to be the most common in the array

**`newCollection: size`**

Create a WordArray of the given size

### 1.102 LargeZeroInteger

**Namespace:** Smalltalk · **Superclass:** [LargePositiveInteger](#1100-largepositiveinteger) · **Category:** Language-Data types

I am quite a strange class.  Indeed, the concept of a "large
integer" that is zero is a weird one.  Actually my only instance is
zero but is represented like LargeIntegers, has the same generality
as LargeIntegers, and so on.  That only instance is stored in the
class variable Zero, and is used in arithmetical methods, when we
have to coerce a parameter that is zero.

#### 1.102.1 LargeZeroInteger: accessing

**`at: anIndex`**

Answer '0'.

**`hash`**

Answer '0'.

**`size`**

Answer '0'.

#### 1.102.2 LargeZeroInteger: arithmetic

**`* aNumber`**

Multiply aNumber and the receiver, answer the result

**`+ aNumber`**

Sum the receiver and aNumber, answer the result

**`- aNumber`**

Subtract aNumber from the receiver, answer the result

**`/ aNumber`**

Divide aNumber and the receiver, answer the result (an Integer or
Fraction)

**`// aNumber`**

Divide aNumber and the receiver, answer the result truncated
towards -infinity

**`\\ aNumber`**

Divide aNumber and the receiver, answer the remainder truncated
towards -infinity

**`quo: aNumber`**

Divide aNumber and the receiver, answer the result truncated
towards 0

**`rem: aNumber`**

Divide aNumber and the receiver, answer the remainder truncated
towards 0

#### 1.102.3 LargeZeroInteger: numeric testing

**`sign`**

Answer the receiver's sign

**`strictlyPositive`**

Answer whether the receiver is \> 0

#### 1.102.4 LargeZeroInteger: printing

**`replace: str withStringBase: radix`**

Return in a string the base radix representation of the receiver.

### 1.103 Link

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Collections-Sequenceable

I represent simple linked lists.  Generally, I am not used by
myself, but rather a subclass adds other instance variables that
hold the information for each node, and I hold the glue that keeps
them together.

#### 1.103.1 Link class: instance creation

**`nextLink: aLink`**

Create an instance with the given next link

#### 1.103.2 Link: basic

**`nextLink`**

Answer the next item in the list

**`nextLink: aLink`**

Set the next item in the list

#### 1.103.3 Link: iteration

**`at: index`**

Retrieve a node (instance of Link) that is at a distance of 'index'
after the receiver.

**`at: index put: object`**

This method should not be called for instances of this class.

**`do: aBlock`**

Evaluate aBlock for each element in the list

**`size`**

Answer the number of elements in the list.  Warning: this is O(n)

### 1.104 LinkedList

**Namespace:** Smalltalk · **Superclass:** [SequenceableCollection](#1151-sequenceablecollection) · **Category:** Collections-Sequenceable

I provide methods that access and manipulate linked lists.  I
assume that the elements of the linked list are subclasses of Link,
because I use the methods that class Link supplies to implement my
methods.

#### 1.104.1 LinkedList: accessing

**`at: index`**

Return the element that is index into the linked list.

**`at: index put: object`**

This method should not be called for instances of this class.

#### 1.104.2 LinkedList: adding

**`add: aLink`**

Add aLink at the end of the list; return aLink.

**`addFirst: aLink`**

Add aLink at the head of the list; return aLink.

**`addLast: aLink`**

Add aLink at then end of the list; return aLink.

**`remove: aLink ifAbsent: aBlock`**

Remove aLink from the list and return it, or invoke aBlock if it's
not found in the list.

**`removeFirst`**

Remove the first element from the list and return it, or error if
the list is empty.

**`removeLast`**

Remove the final element from the list and return it, or error if
the list is empty.

#### 1.104.3 LinkedList: enumerating

**`do: aBlock`**

Enumerate each object in the list, passing it to aBlock (actual
behavior might depend on the subclass of Link that is being used).

**`identityIncludes: anObject`**

Answer whether we include the anObject object

**`includes: anObject`**

Answer whether we include anObject

#### 1.104.4 LinkedList: iteration

**`first`**

Retrieve the first element of the list and return it, or error if
the list is empty.

**`last`**

Retrieve the last element of the list and return it, or error if
the list is empty.

#### 1.104.5 LinkedList: testing

**`isEmpty`**

Returns true if the list contains no members

**`notEmpty`**

Returns true if the list contains at least a member

**`size`**

Answer the number of elements in the list.  Warning: this is O(n)

### 1.105 LookupKey

**Namespace:** Smalltalk · **Superclass:** [Magnitude](#1107-magnitude) · **Category:** Language-Data types

I represent a key for looking up entries in a data structure.
Subclasses of me, such as Association, typically represent
dictionary entries.

#### 1.105.1 LookupKey class: basic

**`key: aKey`**

Answer a new instance of the receiver with the given key and value

#### 1.105.2 LookupKey: accessing

**`key`**

Answer the receiver's key

**`key: aKey`**

Set the receiver's key to aKey

#### 1.105.3 LookupKey: printing

**`printOn: aStream`**

Put on aStream a representation of the receiver

#### 1.105.4 LookupKey: storing

**`storeOn: aStream`**

Put on aStream some Smalltalk code compiling to the receiver

#### 1.105.5 LookupKey: testing

**`< aLookupKey`**

Answer whether the receiver's key is less than aLookupKey's

**`= aLookupKey`**

Answer whether the receiver's key and value are the same as
aLookupKey's, or false if aLookupKey is not an instance of the
receiver

**`hash`**

Answer an hash value for the receiver

### 1.106 LookupTable

**Namespace:** Smalltalk · **Superclass:** [Dictionary](#164-dictionary) · **Category:** Collections-Keyed

I am a more efficient variant of Dictionary that cannot be used as
a pool dictionary of variables, as I don't use Associations to
store key-value pairs.  I also cannot have nil as a key; if you
need to be able to store nil as a key, use Dictionary instead.  I
use the object equality comparison message #= to determine
equivalence of indices.

#### 1.106.1 LookupTable class: instance creation

**`new`**

Create a new LookupTable with a default size

#### 1.106.2 LookupTable: accessing

**`add: anAssociation`**

Add the anAssociation key to the receiver

**`associationAt: key ifAbsent: aBlock`**

Answer the key/value Association for the given key.  Evaluate
aBlock (answering the result) if the key is not found

**`at: key ifAbsent: aBlock`**

Answer the value associated to the given key, or the result of
evaluating aBlock if the key is not found

**`at: aKey ifPresent: aBlock`**

If aKey is absent, answer nil.  Else, evaluate aBlock passing the
associated value and answer the result of the invocation

**`at: key put: value`**

Store value as associated to the given key

#### 1.106.3 LookupTable: enumerating

**`associationsDo: aBlock`**

Pass each association in the LookupTable to aBlock.

**`do: aBlock`**

Pass each value in the LookupTable to aBlock.

**`keysAndValuesDo: aBlock`**

Pass each key/value pair in the LookupTable as two distinct
parameters to aBlock.

**`keysDo: aBlock`**

Pass each key in the LookupTable to aBlock.

#### 1.106.4 LookupTable: hashing

**`hash`**

Answer the hash value for the receiver

#### 1.106.5 LookupTable: rehashing

**`rehash`**

Rehash the receiver

#### 1.106.6 LookupTable: removing

**`remove: anAssociation`**

Remove anAssociation's key from the dictionary

**`remove: anAssociation ifAbsent: aBlock`**

Remove anAssociation's key from the dictionary

**`removeKey: key ifAbsent: aBlock`**

Remove the passed key from the LookupTable, answer the result of
evaluating aBlock if it is not found

#### 1.106.7 LookupTable: storing

**`storeOn: aStream`**

Print Smalltalk code compiling to the receiver on aStream

### 1.107 Magnitude

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Data types

I am an abstract class.  My objects represent things that are
discrete and map to a number line.  My instances can be compared
with \< and \>.

#### 1.107.1 Magnitude: basic

**`< aMagnitude`**

Answer whether the receiver is less than aMagnitude

**`<= aMagnitude`**

Answer whether the receiver is less than or equal to aMagnitude

**`= aMagnitude`**

Answer whether the receiver is equal to aMagnitude

**`> aMagnitude`**

Answer whether the receiver is greater than aMagnitude

**`>= aMagnitude`**

Answer whether the receiver is greater than or equal to aMagnitude

#### 1.107.2 Magnitude: misc methods

**`between: min and: max`**

Returns true if object is inclusively between min and max.

**`max: aMagnitude`**

Returns the greatest object between the receiver and aMagnitude

**`min: aMagnitude`**

Returns the least object between the receiver and aMagnitude

### 1.108 MappedCollection

**Namespace:** Smalltalk · **Superclass:** [Collection](#137-collection) · **Category:** Collections-Keyed

I represent collections of objects that are indirectly indexed by
names.  There are really two collections involved: domain and a
map.  The map maps between external names and indices into domain,
which contains the real association.  In order to work properly,
the domain must be an instance of a subclass of
SequenceableCollection, and the map must be an instance of
Dictionary, or of a subclass of SequenceableCollection.

As an example of using me, consider implenting a Dictionary whose
elements are indexed.  The domain would be a SequenceableCollection
with n elements, the map a Dictionary associating each key to an
index in the domain.  To access by key, to perform enumeration,
etc.  you would ask an instance of me; to access by index, you
would access the domain directly.

Another idea could be to implement row access or column access to a
matrix implemented as a single n\*m Array: the Array would be the
domain, while the map would be an Interval.

#### 1.108.1 MappedCollection class: instance creation

**`collection: aCollection map: aMap`**

Answer a new MappedCollection using the given domain (aCollection)
and map

**`new`**

This method should not be used; instead, use #collection:map: to
create MappedCollection.

#### 1.108.2 MappedCollection: basic

**`add: anObject`**

This method should not be called for instances of this class.

**`at: key`**

Answer the object at the given key

**`at: key put: value`**

Store value at the given key

**`atAll: keyCollection`**

Answer a new MappedCollection that only includes the given keys.
The new MappedCollection might use keyCollection or consecutive
integers for the keys, depending on the map's type.  Fail if any of
them is not found in the map.

**`collect: aBlock`**

Answer a Collection with the same keys as the map, where accessing
a key yields the value obtained by passing through aBlock the value
accessible from the key in the receiver.  The result need not be
another MappedCollection

**`contents`**

Answer a bag with the receiver's values

**`copyFrom: a to: b`**

Answer a new collection containing all the items in the receiver
from the a-th to the b-th.

**`do: aBlock`**

Evaluate aBlock for each object

**`domain`**

Answer the receiver's domain

**`keys`**

Answer the keys that can be used to access this collection.

**`keysAndValuesDo: aBlock`**

Evaluate aBlock passing two arguments, one being a key that can be
used to access this collection, and the other one being the value.

**`keysDo: aBlock`**

Evaluate aBlock on the keys that can be used to access this
collection.

**`map`**

Answer the receiver's map

**`reject: aBlock`**

Answer the objects in the domain for which aBlock returns false

**`select: aBlock`**

Answer the objects in the domain for which aBlock returns true

**`size`**

Answer the receiver's size

### 1.109 Memory

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Implementation

I provide access to actual machine addresses of OOPs and objects.
I have no instances; you send messages to my class to map between
an object and the address of its OOP or object.  In addition I
provide direct memory access with different C types (ints, chars,
OOPs, floats,...).

#### 1.109.1 Memory class: accessing

**`at: anAddress`**

Access the Smalltalk object (OOP) at the given address.

**`at: anAddress put: aValue`**

Store a pointer (OOP) to the Smalltalk object identified by 'value'
at the given address.

**`bigEndian`**

Answer whether we're running on a big- or little-endian system.

**`charAt: anAddress`**

Access the C char at the given address.  The value is returned as a
Smalltalk Character.

**`charAt: anAddress put: aValue`**

Store as a C char the Smalltalk Character or Integer object
identified by 'value', at the given address, using sizeof(char)
bytes - i.e.  1 byte.

**`deref: anAddress`**

Access the C int pointed by the given address

**`doubleAt: anAddress`**

Access the C double at the given address.

**`doubleAt: anAddress put: aValue`**

Store the Smalltalk Float object identified by 'value', at the
given address, writing it like a C double.

**`floatAt: anAddress`**

Access the C float at the given address.

**`floatAt: anAddress put: aValue`**

Store the Smalltalk Float object identified by 'value', at the
given address, writing it like a C float.

**`intAt: anAddress`**

Access the C int at the given address.

**`intAt: anAddress put: aValue`**

Store the Smalltalk Integer object identified by 'value', at the
given address, using sizeof(int) bytes.

**`longAt: anAddress`**

Access the C long int at the given address.

**`longAt: anAddress put: aValue`**

Store the Smalltalk Integer object identified by 'value', at the
given address, using sizeof(long) bytes.

**`longDoubleAt: anAddress`**

Access the C long double at the given address.

**`longDoubleAt: anAddress put: aValue`**

Store the Smalltalk Float object identified by 'value', at the
given address, writing it like a C long double.

**`shortAt: anAddress`**

Access the C short int at the given address.

**`shortAt: anAddress put: aValue`**

Store the Smalltalk Integer object identified by 'value', at the
given address, using sizeof(short) bytes.

**`stringAt: anAddress`**

Access the string pointed by the C 'char \*' at the given given
address.

**`stringAt: anAddress put: aValue`**

Store the Smalltalk String object identified by 'value', at the
given address in memory, writing it like a \*FRESHLY ALLOCATED\* C
string.  It is the caller's responsibility to free it if necessary.

**`ucharAt: anAddress put: aValue`**

Store as a C char the Smalltalk Character or Integer object
identified by 'value', at the given address, using sizeof(char)
bytes - i.e.  1 byte.

**`uintAt: anAddress put: aValue`**

Store the Smalltalk Integer object identified by 'value', at the
given address, using sizeof(int) bytes.

**`ulongAt: anAddress put: aValue`**

Store the Smalltalk Integer object identified by 'value', at the
given address, using sizeof(long) bytes.

**`unsignedCharAt: anAddress`**

Access the C unsigned char at the given address.  The value is
returned as a Smalltalk Character.

**`unsignedCharAt: anAddress put: aValue`**

Store as a C char the Smalltalk Character or Integer object
identified by 'value', at the given address, using sizeof(char)
bytes - i.e.  1 byte.

**`unsignedIntAt: anAddress`**

Access the C unsigned int at the given address.

**`unsignedIntAt: anAddress put: aValue`**

Store the Smalltalk Integer object identified by 'value', at the
given address, using sizeof(int) bytes.

**`unsignedLongAt: anAddress`**

Access the C unsigned long int at the given address.

**`unsignedLongAt: anAddress put: aValue`**

Store the Smalltalk Integer object identified by 'value', at the
given address, using sizeof(long) bytes.

**`unsignedShortAt: anAddress`**

Access the C unsigned short int at the given address.

**`unsignedShortAt: anAddress put: aValue`**

Store the Smalltalk Integer object identified by 'value', at the
given address, using sizeof(short) bytes.

**`ushortAt: anAddress put: aValue`**

Store the Smalltalk Integer object identified by 'value', at the
given address, using sizeof(short) bytes.

### 1.110 Message

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Implementation

I represent a message send.  My instances are created to hold a
message that has failed, so that error reporting methods can
examine the sender and arguments, but also to represent method
attributes (like \<primitive: 111\> since their syntax is isomorphic
to that of a message send.

#### 1.110.1 Message class: creating instances

**`selector: aSymbol argument: anObject`**

Create a new Message with the given selector and argument

**`selector: aSymbol arguments: anArray`**

Create a new Message with the given selector and arguments

#### 1.110.2 Message: accessing

**`argument`**

Answer the first of the receiver's arguments

**`arguments`**

Answer the receiver's arguments

**`arguments: anArray`**

Set the receiver's arguments

**`selector`**

Answer the receiver's selector

**`selector: aSymbol`**

Set the receiver's selector

#### 1.110.3 Message: basic

**`printAsAttributeOn: aStream`**

Print a representation of the receiver on aStream, modeling it
after the source code for a attribute.

#### 1.110.4 Message: printing

**`printOn: aStream`**

Print a representation of the receiver on aStream

**`reinvokeFor: aReceiver`**

Resend to aReceiver - present for compatibility

**`sendTo: aReceiver`**

Resend to aReceiver

### 1.111 MessageNotUnderstood

**Namespace:** Smalltalk · **Superclass:** [Error](#171-error) · **Category:** Language-Exceptions

MessageNotUnderstood represents an error during message lookup.
Signaling it is the default action of the #doesNotUnderstand:
handler

#### 1.111.1 MessageNotUnderstood: accessing

**`message`**

Answer the message that wasn't understood

**`receiver`**

Answer the object to whom the message send was directed

#### 1.111.2 MessageNotUnderstood: description

**`description`**

Answer a textual description of the exception.

**`isResumable`**

Answer true.  #doesNotUnderstand: exceptions are by default
resumable.

### 1.112 Metaclass

**Namespace:** Smalltalk · **Superclass:** [ClassDescription](#132-classdescription) · **Category:** Language-Implementation

I am the root of the class hierarchy.  My instances are
metaclasses, one for each real class.  My instances have a single
instance, which they hold onto, which is the class that they are
the metaclass of.  I provide methods for creation of actual class
objects from metaclass object, and the creation of metaclass
objects, which are my instances.  If this is confusing to you, it
should be...the Smalltalk metaclass system is strange and complex.

#### 1.112.1 Metaclass class: instance creation

**`subclassOf: superMeta`**

Answer a new metaclass representing a subclass of superMeta

#### 1.112.2 Metaclass: accessing

**`instanceClass`**

Answer the only instance of the metaclass

**`primaryInstance`**

Answer the only instance of the metaclass - present for
compatibility

**`soleInstance`**

Answer the only instance of the metaclass - present for
compatibility

#### 1.112.3 Metaclass: basic

**`name: className environment: aNamespace subclassOf: theSuperclass`**

Private - create a full featured class and install it, or change
the superclass or shape of an existing one; instance variable
names, class variable names and pool dictionaries are left
untouched.

**`name: className environment: aNamespace subclassOf: newSuperclass instanceVariableArray: variableArray shape: shape classPool: classVarDict poolDictionaries: sharedPoolNames category: categoryName`**

Private - create a full featured class and install it, or change an
existing one

**`name: newName environment: aNamespace subclassOf: theSuperclass instanceVariableNames: stringOfInstVarNames shape: shape classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames category: categoryName`**

Private - parse the instance and class variables, and the pool
dictionaries, then create the class.

**`newMeta: className environment: aNamespace subclassOf: theSuperclass instanceVariableArray: arrayOfInstVarNames shape: shape classPool: classVarDict poolDictionaries: sharedPoolNames category: categoryName`**

Private - create a full featured class and install it

#### 1.112.4 Metaclass: compiling methods

**`poolResolution`**

Use my instance's poolResolution.

#### 1.112.5 Metaclass: delegation

**`addClassVarName: aString`**

Add a class variable with the given name to the class pool
dictionary

**`addSharedPool: aDictionary`**

Add the given shared pool to the list of the class' pool
dictionaries

**`allClassVarNames`**

Answer the names of the variables in the receiver's class pool
dictionary and in each of the superclasses' class pool dictionaries

**`allSharedPoolDictionariesDo: aBlock`**

Answer the shared pools visible from methods in the metaclass, in
the correct search order.

**`allSharedPools`**

Return the names of the shared pools defined by the class and any
of its superclasses

**`category`**

Answer the class category

**`classPool`**

Answer the class pool dictionary

**`classVarNames`**

Answer the names of the variables in the class pool dictionary

**`comment`**

Answer the class comment

**`debuggerClass`**

Answer the debugger class that was set in the instance class

**`environment`**

Answer the namespace in which the receiver is implemented

**`name`**

Answer the class name - it has none, actually

**`pragmaHandlerFor: aSymbol`**

Answer the (possibly inherited) registered handler for pragma
aSymbol, or nil if not found.

**`removeClassVarName: aString`**

Removes the class variable from the class, error if not present, or
still in use.

**`removeSharedPool: aDictionary`**

Remove the given dictionary to the list of the class' pool
dictionaries

**`sharedPools`**

Return the names of the shared pools defined by the class

#### 1.112.6 Metaclass: filing

**`fileOutOn: aFileStream`**

File out complete class description: class definition, class and
instance methods

#### 1.112.7 Metaclass: printing

**`nameIn: aNamespace`**

Answer the class name when the class is referenced from aNamespace.

**`printOn: aStream`**

Print a represention of the receiver on aStream

**`printOn: aStream in: aNamespace`**

Print on aStream the class name when the class is referenced from
aNamespace.

**`storeOn: aStream`**

Store Smalltalk code compiling to the receiver on aStream

#### 1.112.8 Metaclass: testing functionality

**`asClass`**

Answer 'instanceClass'.

**`isMetaclass`**

Answer 'true'.

### 1.113 MethodContext

**Namespace:** Smalltalk · **Superclass:** [ContextPart](#141-contextpart) · **Category:** Language-Implementation

My instances represent an actively executing method.  They record
various bits of information about the execution environment, and
contain the execution stack.

#### 1.113.1 MethodContext: accessing

**`home`**

Answer the MethodContext to which the receiver refers (i.e.  the
receiver itself)

**`isBlock`**

Answer whether the receiver is a block context

**`isDisabled`**

Answers whether the receiver has actually ended execution and will
be skipped when doing a return.  BlockContexts are removed from the
chain whenever a non-local return is done, but MethodContexts need
to stay there in case there is a non-local return from the #ensure:
block.

**`isEnvironment`**

To create a valid execution environment for the interpreter even
before it starts, GST creates a fake context which invokes a
special "termination" method.  Such a context can be used as a
marker for the current execution environment.  Answer whether the
receiver is that kind of context.

**`isUnwind`**

Answers whether the context must continue execution even after a
non-local return (a return from the enclosing method of a block, or
a call to the #continue: method of ContextPart).  Such contexts are
created only by #ensure:.

**`mark`**

To create a valid execution environment for the interpreter even
before it starts, GST creates a fake context which invokes a
special "termination" method.  A similar context is created by
\#valueWithUnwind, by using this method.

**`sender`**

Return the context from which the receiver was sent

#### 1.113.2 MethodContext: debugging

**`isInternalExceptionHandlingContext`**

Answer whether the receiver is a context that should be hidden to
the user when presenting a backtrace.  Such contexts are identified
through the #exceptionHandlingInternal: attribute: if there is such
a context in the backtrace, all those above it are marked as
internal.

That is, the attribute being set to true means that the context and
all those above it are to be hidden, while the attribute being set
to false means that the contexts above it must be hidden, but not
the context itself.

#### 1.113.3 MethodContext: printing

**`printOn: aStream`**

Print a representation for the receiver on aStream

### 1.114 MethodDictionary

**Namespace:** Smalltalk · **Superclass:** [IdentityDictionary](#190-identitydictionary) · **Category:** Language-Implementation

I am similar to an IdentityDictionary, except that removal and
rehashing operations inside my instances look atomic to the
interpreter.

#### 1.114.1 MethodDictionary: adding

**`at: key put: value`**

Store value as associated to the given key

#### 1.114.2 MethodDictionary: rehashing

**`rehash`**

Rehash the receiver

#### 1.114.3 MethodDictionary: removing

**`remove: anAssociation`**

Remove anAssociation's key from the dictionary

**`removeKey: anElement ifAbsent: aBlock`**

Remove the passed key from the dictionary, answer the result of
evaluating aBlock if it is not found

### 1.115 MethodInfo

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Implementation

I provide information about particular methods.  I can produce the
category that a method was filed under, and can be used to access
the source code of the method.

#### 1.115.1 MethodInfo: accessing

**`category`**

Answer the method category

**`category: aCategory`**

Set the method category

**`methodClass`**

Answer the class in which the method is defined

**`methodClass: aClass`**

Set the class in which the method is defined

**`selector`**

Answer the selector through which the method is called

**`selector: aSymbol`**

Set the selector through which the method is called

**`sourceCode`**

Answer a FileSegment or String or nil containing the method source
code

**`sourceFile`**

Answer the name of the file where the method source code is

**`sourcePos`**

Answer the starting position of the method source code in the
sourceFile

**`sourceString`**

Answer a String containing the method source code

**`stripSourceCode`**

Remove the reference to the source code for the method

#### 1.115.2 MethodInfo: equality

**`= aMethodInfo`**

Compare the receiver and aMethodInfo, answer whether they're equal

**`hash`**

Answer an hash value for the receiver

### 1.116 Namespace

**Namespace:** Smalltalk · **Superclass:** [AbstractNamespace](#11-abstractnamespace) · **Category:** Language-Implementation

I am a Namespace that has a super-namespace.

#### 1.116.1 Namespace class: accessing

**`current`**

Answer the current namespace

**`current: aNamespaceOrClass`**

Set the current namespace to be aNamespace or, if it is a class,
its class pool (the Dictionary that holds class variables).

#### 1.116.2 Namespace class: disabling instance creation

**`new`**

Disabled - use #addSubspace: to create instances

**`new: size`**

Disabled - use #addSubspace: to create instances

#### 1.116.3 Namespace class: initialization

**`initialize`**

This actually is not needed, the job could be done in dict.c
(function namespace\_new).  But I'm lazy and I prefer to rely on the
Smalltalk implementation of IdentitySet.

#### 1.116.4 Namespace: accessing

**`inheritedKeys`**

Answer a Set of all the keys in the receiver and its superspaces

#### 1.116.5 Namespace: namespace hierarchy

**`siblings`**

Answer all the other namespaces that inherit from the receiver's
superspace.

**`siblingsDo: aBlock`**

Evaluate aBlock once for each of the other namespaces that inherit
from the receiver's superspace, passing the namespace as a
parameter.

#### 1.116.6 Namespace: overrides for superspaces

**`associationAt: key ifAbsent: aBlock`**

Return the key/value pair associated to the variable named as
specified by 'key'.  If the key is not found search will be brought
on in superspaces, finally evaluating aBlock if the variable cannot
be found in any of the superspaces.

**`associationsDo: aBlock`**

Pass each association in the namespace to aBlock

**`at: key ifAbsent: aBlock`**

Return the value associated to the variable named as specified by
'key'.  If the key is not found search will be brought on in
superspaces, finally evaluating aBlock if the variable cannot be
found in any of the superspaces.

**`at: key ifPresent: aBlock`**

If aKey is absent from the receiver and all its superspaces, answer
nil.  Else, evaluate aBlock passing the associated value and answer
the result of the invocation

**`do: aBlock`**

Pass each value in the namespace to aBlock

**`includesKey: key`**

Answer whether the receiver or any of its superspaces contain the
given key

**`keysAndValuesDo: aBlock`**

Pass to aBlock each of the receiver's keys and values, in two
separate parameters

**`keysDo: aBlock`**

Pass to aBlock each of the receiver's keys

**`set: key to: newValue ifAbsent: aBlock`**

Assign newValue to the variable named as specified by 'key'.  This
method won't define a new variable; instead if the key is not found
it will search in superspaces and evaluate aBlock if it is not
found.  Answer newValue.

**`size`**

Answer the number of keys in the receiver and each of its
superspaces

#### 1.116.7 Namespace: printing

**`nameIn: aNamespace`**

Answer Smalltalk code compiling to the receiver when the current
namespace is aNamespace

**`printOn: aStream in: aNamespace`**

Print on aStream some Smalltalk code compiling to the receiver when
the current namespace is aNamespace

**`storeOn: aStream`**

Store Smalltalk code compiling to the receiver

### 1.117 NetClients.URIResolver

**Namespace:** Smalltalk.NetClients · **Superclass:** [Object](#1123-object) · **Category:** NetClients-URIResolver

This class publishes methods to download files from the Internet.

#### 1.117.1 NetClients.URIResolver class: api

**`openOn: aURI`**

Always raise an error, as this method is not supported without
loading the additional NetClients package.

**`openOn: aURI ifFail: aBlock`**

Always evaluate aBlock and answer the result if the additional
NetClients package is not loaded.  If it is, instead, return a
WebEntity with the contents of the resource specified by anURI, and
only evaluate the block if loading the resource fails.

**`openStreamOn: aURI`**

Check if aURI can be fetched from the Internet or from the local
system, and if so return a Stream with its contents.  If this is
not possible, raise an exception.

**`openStreamOn: aURI ifFail: aBlock`**

Check if aURI can be fetched from the Internet or from the local
system, and if so return a Stream with its contents.  If this is
not possible, instead, evaluate the zero-argument block aBlock and
answer the result of the evaluation.

#### 1.117.2 NetClients.URIResolver class: instance creation

**`on: anURL`**

Answer a new URIResolver that will do its best to fetch the data
for anURL from the Internet.

### 1.118 NetClients.URL

**Namespace:** Smalltalk.NetClients · **Superclass:** [Object](#1123-object) · **Category:** NetClients-URIResolver

Copyright (c) Kazuki Yasumatsu, 1995.  All rights reserved.

#### 1.118.1 NetClients.URL class: encoding URLs

**`decode: aString`**

Decode a text/x-www-form-urlencoded String into a text/plain
String.

**`encode: anURL`**

Encode a text/plain into a text/x-www-form-urlencoded String (those
things with lots of % in them).

**`initialize`**

Initialize the receiver's class variables.

#### 1.118.2 NetClients.URL class: instance creation

**`fromString: aString`**

Parse the given URL and answer an URL object based on it.

**`new`**

Answer a 'blank' URL.

**`scheme: schemeString host: hostString path: pathString`**

Answer an URL object made from all the parts passed as arguments.

**`scheme: schemeString host: hostString port: portNumber path: pathString`**

Answer an URL object made from all the parts passed as arguments.

**`scheme: schemeString path: pathString`**

Answer an URL object made from all the parts passed as arguments.

**`scheme: schemeString username: userString password: passwordString host: hostString port: portNumber path: pathString`**

Answer an URL object made from all the parts passed as arguments.

#### 1.118.3 NetClients.URL: accessing

**`asString`**

Answer the full request string corresponding to the URL. This is
how the URL would be printed in the address bar of a web browser,
except that the query data is printed even if it is to be sent
through a POST request.

**`decodedFields`**

Convert the form fields to a Dictionary, answer nil if no question
mark is found in the URL.

**`decodedFile`**

Answer the file part of the URL, decoding it from
x-www-form-urlencoded format.

**`decodedFragment`**

Answer the fragment part of the URL, decoding it from
x-www-form-urlencoded format.

**`fragment`**

Answer the fragment part of the URL, leaving it in
x-www-form-urlencoded format.

**`fragment: aString`**

Set the fragment part of the URL, which should be in
x-www-form-urlencoded format.

**`fullRequestString`**

Answer the full request string corresponding to the URL. This is
how the URL would be printed in the address bar of a web browser,
except that the query data is printed even if it is to be sent
through a POST request.

**`hasPostData`**

Answer whether the URL has a query part but is actually for an HTTP
POST request and not really part of the URL (as it would be for the
HTTP GET request).

**`hasPostData: aBoolean`**

Set whether the query part of the URL is actually the data for an
HTTP POST request and not really part of the URL (as it would be
for the HTTP GET request).

**`host`**

Answer the host part of the URL.

**`host: aString`**

Set the host part of the URL to aString.

**`newsGroup`**

If the receiver is an nntp url, return the news group.

**`password`**

Answer the password part of the URL.

**`password: aString`**

Set the password part of the URL to aString.

**`path`**

Answer the path part of the URL.

**`path: aString`**

Set the path part of the URL to aString.

**`port`**

Answer the port number part of the URL.

**`port: anInteger`**

Set the port number part of the URL to anInteger.

**`postData`**

Answer whether the URL has a query part and it is meant for an HTTP
POST request, answer it.  Else answer nil.

**`postData: aString`**

Associate to the URL some data that is meant to be sent through an
HTTP POST request, answer it.

**`query`**

Answer the query data associated to the URL.

**`query: aString`**

Set the query data associated to the URL to aString.

**`requestString`**

Answer the URL as it would be sent in an HTTP stream (that is, the
path and the query data, the latter only if it is to be sent with
an HTTP POST request).

**`scheme`**

Answer the URL's scheme.

**`scheme: aString`**

Set the URL's scheme to be aString.

**`username`**

Answer the username part of the URL.

**`username: aString`**

Set the username part of the URL to aString.

#### 1.118.4 NetClients.URL: comparing

**`= anURL`**

Answer whether the two URLs are equal.  The file and anchor are
converted to full 8-bit ASCII (contrast with urlencoded) and the
comparison is case-sensitive; on the other hand, the protocol and
host are compared without regard to case.

**`hash`**

Answer an hash value for the receiver

#### 1.118.5 NetClients.URL: copying

**`copyWithoutAuxiliaryParts`**

Answer a copy of the receiver where the fragment and query parts of
the URL have been cleared.

**`copyWithoutFragment`**

Answer a copy of the receiver where the fragment parts of the URL
has been cleared.

**`postCopy`**

All the variables are copied when an URL object is copied.

#### 1.118.6 NetClients.URL: initialize-release

**`initialize`**

Initialize the object to a consistent state.

#### 1.118.7 NetClients.URL: printing

**`printOn: stream`**

Print a representation of the URL on the given stream.

#### 1.118.8 NetClients.URL: still unclassified

**`contents`**

Not commented.

**`entity`**

Not commented.

**`readStream`**

Not commented.

#### 1.118.9 NetClients.URL: testing

**`canCache`**

Answer whether the URL is cacheable.  The current implementation
considers file URLs not to be cacheable, and everything else to be.

**`hasFragment`**

Answer whether the URL points to a particular fragment (anchor) of
the resource.

**`hasQuery`**

Answer whether the URL includes query arguments to be submitted
when retrieving the resource.

**`isFileScheme`**

Answer whether the URL is a file URL.

**`isFragmentOnly`**

Answer whether the URL only includes the name of a particular
fragment (anchor) of the resource to which it refers.

#### 1.118.10 NetClients.URL: utilities

**`construct: anURL`**

Construct an absolute URL based on the relative URL anURL and the
base path represented by the receiver

### 1.119 Notification

**Namespace:** Smalltalk · **Superclass:** [Exception](#172-exception) · **Category:** Language-Exceptions

Notification represents a resumable, exceptional yet non-erroneous,
situation.  Signaling a notification in absence of an handler
simply returns nil.

#### 1.119.1 Notification: exception description

**`defaultAction`**

Do the default action for notifications, which is to resume
execution of the context which signaled the exception.

**`description`**

Answer a textual description of the exception.

**`isResumable`**

Answer true.  Notification exceptions are by default resumable.

### 1.120 NullProxy

**Namespace:** Smalltalk · **Superclass:** [AlternativeObjectProxy](#12-alternativeobjectproxy) · **Category:** Streams-Files

I am a proxy that does no special processing on the object to be
saved.  I can be used to disable proxies for particular subclasses.
My subclasses add to the stored information, but share the fact
that the format is about the same as that of #dump: without a
proxy.

#### 1.120.1 NullProxy class: instance creation

**`loadFrom: anObjectDumper`**

Reload the object stored in anObjectDumper

#### 1.120.2 NullProxy: accessing

**`dumpTo: anObjectDumper`**

Dump the object stored in the proxy to anObjectDumper

### 1.121 NullValueHolder

**Namespace:** Smalltalk · **Superclass:** [ValueAdaptor](#1204-valueadaptor) · **Category:** Language-Data types

I pretend to store my value in a variable, but I don't actually.
You can use the only instance of my class (returned by 'ValueHolder
null') if you're not interested in a value that is returned as
described in ValueHolder's comment.

#### 1.121.1 NullValueHolder class: creating instances

**`new`**

Not used - use 'ValueHolder null' instead

**`uniqueInstance`**

Answer the sole instance of NullValueHolder

#### 1.121.2 NullValueHolder: accessing

**`value`**

Retrive the value of the receiver.  Always answer nil

**`value: anObject`**

Set the value of the receiver.  Do nothing, discard the value

### 1.122 Number

**Namespace:** Smalltalk · **Superclass:** [Magnitude](#1107-magnitude) · **Category:** Language-Data types

I am an abstract class that provides operations on numbers, both
floating point and integer.  I provide some generic predicates, and
supply the implicit type coercing code for binary operations.

#### 1.122.1 Number class: converting

**`coerce: aNumber`**

Answer aNumber - whatever class it belongs to, it is good

**`readFrom: aStream`**

Answer the number read from the rest of aStream, converted to an
instance of the receiver.  If the receiver is number, the class of
the result is undefined - but the result is good.

**`readFrom: aStream radix: anInteger`**

Answer the number read from the rest of aStream, converted to an
instance of the receiver.  If the receiver is number, the class of
the result is undefined - but the result is good.

The exponent (for example 1.2e-1) is only parsed if anInteger is
10\.

#### 1.122.2 Number class: testing

**`isImmediate`**

Answer whether, if x is an instance of the receiver, x copy == x

#### 1.122.3 Number: arithmetic

**`* aNumber`**

Subtract the receiver and aNumber, answer the result

**`+ aNumber`**

Sum the receiver and aNumber, answer the result

**`- aNumber`**

Subtract aNumber from the receiver, answer the result

**`/ aNumber`**

Divide the receiver by aNumber, answer the result (no loss of
precision).  Raise a ZeroDivide exception or return a valid
(possibly infinite) continuation value if aNumber is zero.

**`// aNumber`**

Return the integer quotient of dividing the receiver by aNumber
with truncation towards negative infinity.  Raise a ZeroDivide
exception if aNumber is zero

**`\\ aNumber`**

Return the remainder of dividing the receiver by aNumber with
truncation towards negative infinity.  Raise a ZeroDivide exception
if aNumber is zero

**`quo: aNumber`**

Return the integer quotient of dividing the receiver by aNumber
with truncation towards zero.  Raise a ZeroDivide exception if
aNumber is zero

**`reciprocal`**

Return the reciprocal of the receiver

**`rem: aNumber`**

Return the remainder of dividing the receiver by aNumber with
truncation towards zero.  Raise a ZeroDivide exception if aNumber
is zero

#### 1.122.4 Number: coercion

**`asCNumber`**

Convert the receiver to a kind of number that is understood by the
C call-out mechanism.

#### 1.122.5 Number: comparing

**`max: aNumber`**

Answer the maximum between the receiver and aNumber.  Redefine in
subclasses if necessary to ensure that if either self or aNumber is
a NaN, it is always answered.

**`min: aNumber`**

Answer the minimum between the receiver and aNumber.  Redefine in
subclasses if necessary to ensure that if either self or aNumber is
a NaN, it is always answered.

#### 1.122.6 Number: converting

**`asExactFraction`**

Return the receiver, converted to a Fraction retaining the exact
value of the receiver.

**`asFloat`**

Convert the receiver to an arbitrary subclass of Float

**`asFloatD`**

This method's functionality should be implemented by subclasses of
Number

**`asFloatE`**

This method's functionality should be implemented by subclasses of
Number

**`asFloatQ`**

This method's functionality should be implemented by subclasses of
Number

**`asFraction`**

This method's functionality should be implemented by subclasses of
Number

**`asNumber`**

Answer the receiver, since it is already a number

**`asRectangle`**

Answer an empty rectangle whose origin is (self asPoint)

**`asScaledDecimal: n`**

Answer the receiver, converted to a ScaledDecimal object.

**`asScaledDecimal: denDigits radix: base scale: n`**

Answer the receiver, divided by base^denDigits and converted to a
ScaledDecimal object.

**`asString`**

Answer the receiver's #displayString, which should be a good enough
conversion to String for a number.

**`coerce: aNumber`**

Answer aNumber, converted to an integer or floating-point number.

**`degreesToRadians`**

Convert the receiver to radians

**`generality`**

Answer the receiver's generality

**`radiansToDegrees`**

Convert the receiver from radians to degrees

**`unity`**

Coerce 1 to the receiver's class.  The default implementation
works, but is inefficient

**`zero`**

Coerce 0 to the receiver's class.  The default implementation
works, but is inefficient

#### 1.122.7 Number: copying

**`deepCopy`**

Return the receiver - it's an immediate (immutable) object

**`shallowCopy`**

Return the receiver - it's an immediate (immutable) object

#### 1.122.8 Number: error raising

**`arithmeticError: msg`**

Raise an ArithmeticError exception having msg as its message text.

**`zeroDivide`**

Raise a division-by-zero (ZeroDivide) exception whose dividend is
the receiver.

#### 1.122.9 Number: misc math

**`abs`**

Answer the absolute value of the receiver

**`arcCos`**

Answer the arc cosine of the receiver

**`arcCosh`**

Answer the hyperbolic arc-cosine of the receiver.

**`arcSin`**

Answer the arc sine of the receiver

**`arcSinh`**

Answer the hyperbolic arc-sine of the receiver.

**`arcTan`**

Answer the arc tangent of the receiver

**`arcTan: x`**

Answer the angle (measured counterclockwise) between (x, self) and
a ray starting in (0, 0) and moving towards (1, 0) - i.e.  3
o'clock

**`arcTanh`**

Answer the hyperbolic arc-tangent of the receiver.

**`ceilingLog: radix`**

Answer (self log: radix) ceiling.  Optimized to answer an integer.

**`cos`**

Answer the cosine of the receiver

**`cosh`**

Answer the hyperbolic cosine of the receiver.

**`estimatedLog`**

Answer an estimate of (self abs floorLog: 10).  This method should
be overridden by subclasses, but Number's implementation does not
raise errors - simply, it gives a correct result, so it is slow.

**`exp`**

Answer e raised to the receiver

**`floorLog: radix`**

Answer (self log: radix) floor.  Optimized to answer an integer.

**`ln`**

Answer log base e of the receiver

**`log`**

Answer log base 10 of the receiver

**`log: aNumber`**

Answer log base aNumber of the receiver

**`negated`**

Answer the negated of the receiver

**`positiveDifference: aNumber`**

Answer the positive difference of the receiver and aNumber, that is
self - aNumber if it is positive, 0 otherwise.

**`raisedTo: aNumber`**

Return self raised to aNumber power

**`raisedToInteger: anInteger`**

Return self raised to the anInteger-th power

**`sin`**

Answer the sine of the receiver

**`sinh`**

Answer the hyperbolic sine of the receiver.

**`sqrt`**

Answer the square root of the receiver

**`squared`**

Answer the square of the receiver

**`tan`**

Answer the tangent of the receiver

**`tanh`**

Answer the hyperbolic tangent of the receiver.

**`withSignOf: aNumber`**

Answer the receiver, with its sign possibly changed to match that
of aNumber.

#### 1.122.10 Number: point creation

**`@ y`**

Answer a new point whose x is the receiver and whose y is y

**`asPoint`**

Answer a new point, self @ self

#### 1.122.11 Number: retrying

**`retry: aSymbol coercing: aNumber`**

Coerce to the other number's class the one number between the
receiver and aNumber which has the lowest, and retry calling
aSymbol.  aSymbol is supposed not to be #= or #\~= (since those
don't fail if aNumber is not a Number).

**`retryDifferenceCoercing: aNumber`**

Coerce to the other number's class the one number between the
receiver and aNumber which has the lowest, and retry calling #-.

**`retryDivisionCoercing: aNumber`**

Coerce to the other number's class the one number between the
receiver and aNumber which has the lowest, and retry calling #/.

**`retryEqualityCoercing: aNumber`**

Coerce to the other number's class the one number between the
receiver and aNumber which has the lowest, and retry calling #=.

**`retryError`**

Raise an error--a retrying method was called with two arguments
having the same generality.

**`retryInequalityCoercing: aNumber`**

Coerce to the other number's class the one number between the
receiver and aNumber which has the lowest, and retry calling #\~=.

**`retryMultiplicationCoercing: aNumber`**

Coerce to the other number's class the one number between the
receiver and aNumber which has the lowest, and retry calling #\*.

**`retryRelationalOp: aSymbol coercing: aNumber`**

Coerce to the other number's class the one number between the
receiver and aNumber which has the lowest, and retry calling
aSymbol (\<, \<=, \>, \>=).

**`retrySumCoercing: aNumber`**

Coerce to the other number's class the one number between the
receiver and aNumber which has the lowest, and retry calling #+.

#### 1.122.12 Number: shortcuts and iterators

**`to: stop`**

Return an interval going from the receiver to stop by 1

**`to: stop by: step`**

Return an interval going from the receiver to stop with the given
step

**`to: stop by: step collect: aBlock`**

Evaluate aBlock for each value in the interval going from the
receiver to stop with the given step.  The results are collected in
an Array and returned.

**`to: stop by: step do: aBlock`**

Evaluate aBlock for each value in the interval going from the
receiver to stop with the given step.  Compiled in-line for integer
literal steps, and for one-argument aBlocks without temporaries,
and therefore not overridable.

**`to: stop collect: aBlock`**

Evaluate aBlock for each value in the interval going from the
receiver to stop by 1.  The results are collected in an Array and
returned.

**`to: stop do: aBlock`**

Evaluate aBlock for each value in the interval going from the
receiver to stop by 1.  Compiled in-line for one-argument aBlocks
without temporaries, and therefore not overridable.

#### 1.122.13 Number: testing

**`closeTo: num`**

Answer whether the receiver can be considered sufficiently close to
num (this is done by checking equality if num is not a number, and
by checking with 0.01% tolerance if num is a number).

**`even`**

Returns true if self is divisible by 2

**`isExact`**

Answer whether the receiver performs exact arithmetic.  Most
numeric classes do (in fact the only exceptions is Float and its
descendants), so the default is to answer true rather than calling
\#subclassResponsibility.

**`isFinite`**

Answer whether the receiver represents a finite quantity.  Most
numeric classes are for finite quantities, so the default is to
answer true rather than calling #subclassResponsibility.

**`isInfinite`**

Answer whether the receiver represents an infinite quantity.  Most
numeric classes are for finite quantities, so the default is to
answer false rather than calling #subclassResponsibility.

**`isNaN`**

Answer whether the receiver is a Not-A-Number.  Most numeric
classes don't handle nans, so the default is to answer false rather
than calling #subclassResponsibility.

**`isNumber`**

Answer 'true'.

**`isRational`**

Answer whether the receiver is rational - false by default

**`negative`**

Answer whether the receiver is \< 0

**`odd`**

Returns true if self is not divisible by 2

**`positive`**

Answer whether the receiver is \>= 0

**`sign`**

Returns the sign of the receiver.

**`strictlyPositive`**

Answer whether the receiver is \> 0

#### 1.122.14 Number: truncation and round off

**`asInteger`**

Answer the receiver, rounded to the nearest integer

**`floor`**

Return the integer nearest the receiver toward negative infinity.

**`fractionPart`**

Answer a number which, summed to the #integerPart of the receiver,
gives the receiver itself.

**`integerPart`**

Answer the receiver, truncated towards zero

**`roundTo: aNumber`**

Answer the receiver, truncated to the nearest multiple of aNumber

**`rounded`**

Returns the integer nearest the receiver

**`truncateTo: aNumber`**

Answer the receiver, truncated towards zero to a multiple of
aNumber

**`truncated`**

Answer the receiver, truncated towards zero

### 1.123 Object

**Namespace:** Smalltalk · **Superclass:** none · **Category:** Language-Implementation

I am the root of the Smalltalk class system.  All classes in the
system are subclasses of me.

#### 1.123.1 Object class: initialization

**`dependencies`**

Answer a dictionary that associates an object with its dependents.

**`dependencies: anObject`**

Use anObject as the dictionary that associates an object with its
dependents.

**`finalizableObjects`**

Answer a set of finalizable objects.

**`initialize`**

Initialize the Dependencies dictionary to be a
WeakKeyIdentityDictionary.

**`update: aspect`**

Do any global tasks for the ObjectMemory events.

#### 1.123.2 Object: built ins

**`= arg`**

Answer whether the receiver is equal to arg.  The equality test is
by default the same as that for identical objects.  = must not
fail; answer false if the receiver cannot be compared to arg

**`== arg`**

Answer whether the receiver is the same object as arg.  This is a
very fast test and is called 'object identity'.

**`allOwners`**

Return an Array of Objects that point to the receiver.

**`asOop`**

Answer the object index associated to the receiver.  The object
index doesn't change when garbage collection is performed.

**`at: anIndex`**

Answer the index-th indexed instance variable of the receiver

**`at: anIndex put: value`**

Store value in the index-th indexed instance variable of the
receiver

**`basicAt: anIndex`**

Answer the index-th indexed instance variable of the receiver.
This method must not be overridden, override at: instead

**`basicAt: anIndex put: value`**

Store value in the index-th indexed instance variable of the
receiver This method must not be overridden, override at:put:
instead

**`basicPrint`**

Print a basic representation of the receiver

**`basicSize`**

Answer the number of indexed instance variable in the receiver

**`become: otherObject`**

Change all references to the receiver into references to
otherObject.  Depending on the implementation, references to
otherObject might or might not be transformed into the receiver
(respectively, 'two-way become' and 'one-way become').
Implementations doing one-way become answer the receiver (so that
it is not lost).  Most implementations doing two-way become answer
otherObject, but this is not assured - so do answer the receiver
for consistency.  GNU Smalltalk does two-way become and answers
otherObject, but this might change in future versions: programs
should not rely on the behavior and results of #become: .

**`becomeForward: otherObject`**

Change all references to the receiver into references to
otherObject.  References to otherObject are not transformed into
the receiver.  Answer the receiver so that it is not lost.

**`changeClassTo: aBehavior`**

Mutate the class of the receiver to be aBehavior.  Note: Tacitly
assumes that the structure is the same for the original and new
class!!

**`checkIndexableBounds: index`**

Private - Check the reason why an access to the given indexed
instance variable failed

**`checkIndexableBounds: index ifAbsent: aBlock`**

Private - Check the reason why an access to the given indexed
instance variable failed.  Evaluate aBlock for an invalid index.

**`checkIndexableBounds: index put: object`**

Private - Check the reason why a store to the given indexed
instance variable failed

**`class`**

Answer the class to which the receiver belongs

**`halt`**

Called to enter the debugger

**`hash`**

Answer an hash value for the receiver.  This hash value is ok for
objects that do not redefine ==.

**`identityHash`**

Answer an hash value for the receiver.  This method must not be
overridden

**`instVarAt: index`**

Answer the index-th instance variable of the receiver.  This method
must not be overridden.

**`instVarAt: index put: value`**

Store value in the index-th instance variable of the receiver.
This method must not be overridden.

**`isReadOnly`**

Answer whether the object's indexed instance variables can be
written

**`isUntrusted`**

Answer whether the object is to be considered untrusted.

**`makeEphemeron`**

Make the object an 'ephemeron'.  An ephemeron is marked after all
other objects, and if no references are found to the key except
from the object itself, it is sent the #mourn message.

**`makeFixed`**

Avoid that the receiver moves in memory across garbage collections.

**`makeReadOnly: aBoolean`**

Set whether the object's indexed instance variables can be written

**`makeUntrusted: aBoolean`**

Set whether the object is to be considered untrusted.

**`makeWeak`**

Make the object a 'weak' one.  When an object is only referenced by
weak objects, it is collected and the slots in the weak objects are
changed to nils by the VM; the weak object is then sent the #mourn
message.

**`mark: aSymbol`**

Private - use this method to mark code which needs to be reworked,
removed, etc.  You can then find all senders of #mark: to find all
marked methods or you can look for all senders of the symbol that
you sent to #mark: to find a category of marked methods.

**`nextInstance`**

Private - answer another instance of the receiver's class, or nil
if the entire object table has been walked

**`notYetImplemented`**

Called when a method defined by a class is not yet implemented, but
is going to be

**`perform: selectorOrMessageOrMethod`**

Send the unary message named selectorOrMessageOrMethod (if a
Symbol) to the receiver, or the message and arguments it identifies
(if a Message or DirectedMessage), or finally execute the method
within the receiver (if a CompiledMethod).  In the last case, the
method need not reside on the hierarchy from the receiver's class
to Object - it need not reside at all in a MethodDictionary, in
fact - but doing bad things will compromise stability of the
Smalltalk virtual machine (and don't blame anybody but yourself).

This method should not be overridden

**`perform: selectorOrMethod with: arg1`**

Send the message named selectorOrMethod (if a Symbol) to the
receiver, passing arg1 to it, or execute the method within the
receiver (if a CompiledMethod).  In the latter case, the method
need not reside on the hierarchy from the receiver's class to
Object - it need not reside at all in a MethodDictionary, in fact -
but doing bad things will compromise stability of the Smalltalk
virtual machine (and don't blame anybody but yourself).

This method should not be overridden

**`perform: selectorOrMethod with: arg1 with: arg2`**

Send the message named selectorOrMethod (if a Symbol) to the
receiver, passing arg1 and arg2 to it, or execute the method within
the receiver (if a CompiledMethod).  In the latter case, the method
need not reside on the hierarchy from the receiver's class to
Object - it need not reside at all in a MethodDictionary, in fact -
but doing bad things will compromise stability of the Smalltalk
virtual machine (and don't blame anybody but yourself).

This method should not be overridden

**`perform: selectorOrMethod with: arg1 with: arg2 with: arg3`**

Send the message named selectorOrMethod (if a Symbol) to the
receiver, passing the other arguments to it, or execute the method
within the receiver (if a CompiledMethod).  In the latter case, the
method need not reside on the hierarchy from the receiver's class
to Object - it need not reside at all in a MethodDictionary, in
fact - but doing bad things will compromise stability of the
Smalltalk virtual machine (and don't blame anybody but yourself).

This method should not be overridden

**`perform: selectorOrMethod with: arg1 with: arg2 with: arg3 with: arg4`**

Send the message named selectorOrMethod (if a Symbol) to the
receiver, passing the other arguments to it, or execute the method
within the receiver (if a CompiledMethod).  In the latter case, the
method need not reside on the hierarchy from the receiver's class
to Object - it need not reside at all in a MethodDictionary, in
fact - but doing bad things will compromise stability of the
Smalltalk virtual machine (and don't blame anybody but yourself).

This method should not be overridden

**`perform: selectorOrMethod withArguments: argumentsArray`**

Send the message named selectorOrMethod (if a Symbol) to the
receiver, passing the elements of argumentsArray as parameters, or
execute the method within the receiver (if a CompiledMethod).  In
the latter case, the method need not reside on the hierarchy from
the receiver's class to Object - it need not reside at all in a
MethodDictionary, in fact - but doing bad things will compromise
stability of the Smalltalk virtual machine (and don't blame anybody
but yourself).

This method should not be overridden

**`primitiveFailed`**

Called when a VM primitive fails

**`shallowCopy`**

Returns a shallow copy of the receiver (the instance variables are
not copied)

**`shouldNotImplement`**

Called when objects belonging to a class should not answer a
selector defined by a superclass

**`size`**

Answer the number of indexed instance variable in the receiver

**`subclassResponsibility`**

Called when a method defined by a class should be overridden in a
subclass

**`tenure`**

Move the object to oldspace.

#### 1.123.3 Object: change and update

**`broadcast: aSymbol`**

Send the unary message aSymbol to each of the receiver's dependents

**`broadcast: aSymbol with: anObject`**

Send the message aSymbol to each of the receiver's dependents,
passing anObject

**`broadcast: aSymbol with: arg1 with: arg2`**

Send the message aSymbol to each of the receiver's dependents,
passing arg1 and arg2 as parameters

**`broadcast: aSymbol withArguments: anArray`**

Send the message aSymbol to each of the receiver's dependents,
passing the parameters in anArray

**`broadcast: aSymbol withBlock: aBlock`**

Send the message aSymbol to each of the receiver's dependents,
passing the result of evaluating aBlock with each dependent as the
parameter

**`changed`**

Send update: for each of the receiver's dependents, passing them
the receiver

**`changed: aParameter`**

Send update: for each of the receiver's dependents, passing them
aParameter

**`update: aParameter`**

Default behavior is to do nothing.  Called by #changed and
\#changed:

#### 1.123.4 Object: class type methods

**`species`**

This method has no unique definition.  Generally speaking, methods
which always return the same type usually don't use #class, but
\#species.  For example, a PositionableStream's species is the class
of the collection on which it is streaming (used by upTo:,
upToAll:, upToEnd).  Stream uses species for obtaining the class of
next:'s return value, Collection uses it in its #copyEmpty:
message, which in turn is used by all collection-returning methods.
An Interval's species is Array (used by collect:, select:, reject:,
etc.).

**`yourself`**

Answer the receiver

#### 1.123.5 Object: compiler

**`literalEquals: anObject`**

Not commented.

**`literalHash`**

Not commented.

#### 1.123.6 Object: conversion

**`asValue`**

Answer a ValueHolder whose initial value is the receiver.

#### 1.123.7 Object: copying

**`copy`**

Returns a shallow copy of the receiver (the instance variables are
not copied).  The shallow copy receives the message postCopy and
the result of postCopy is passed back.

**`deepCopy`**

Returns a deep copy of the receiver (the instance variables are
copies of the receiver's instance variables)

**`postCopy`**

Performs any changes required to do on a copied object.  This is
the place where one could, for example, put code to replace objects
with copies of the objects

#### 1.123.8 Object: debugging

**`examine`**

Print all the instance variables of the receiver on the Transcript

**`examineOn: aStream`**

Print all the instance variables of the receiver on aStream

**`inspect`**

In a GUI environment, this opens a tool to examine and modify the
receiver.  In the default image, it just calls #examine.

**`validSize`**

Answer how many elements in the receiver should be inspected

#### 1.123.9 Object: dependents access

**`addDependent: anObject`**

Add anObject to the set of the receiver's dependents.  Important:
if an object has dependents, it won't be garbage collected.

**`dependents`**

Answer a collection of the receiver's dependents.

**`release`**

Remove all of the receiver's dependents from the set and allow the
receiver to be garbage collected.

**`removeDependent: anObject`**

Remove anObject to the set of the receiver's dependents.  No
problem if anObject is not in the set of the receiver's dependents.

#### 1.123.10 Object: error raising

**`doesNotUnderstand: aMessage`**

Called by the system when a selector was not found.  message is a
Message containing information on the receiver

**`error: message`**

Display a walkback for the receiver, with the given error message.
Signal an 'Error' exception.

**`halt: message`**

Display a walkback for the receiver, with the given error message.
Signal an 'Halt' exception.

#### 1.123.11 Object: finalization

**`addToBeFinalized`**

Arrange things so that #finalize is sent to the object when the
garbage collector finds out there are only weak references to it.

**`finalize`**

Do nothing by default

**`mourn`**

This method is sent by the VM to weak and ephemeron objects when
one of their fields is found out to be garbage collectable (this
means, for weak objects, that there are no references to it from
non-weak objects, and for ephemeron objects, that the only paths to
the first instance variable pass through other instance variables
of the same ephemeron).  The default behavior is to do nothing.

**`removeToBeFinalized`**

Unregister the object, so that #finalize is no longer sent to the
object when the garbage collector finds out there are only weak
references to it.

#### 1.123.12 Object: introspection

**`instVarNamed: aString`**

Answer the instance variable named aString in the receiver.

**`instVarNamed: aString put: anObject`**

Answer the instance variable named aString in the receiver.

#### 1.123.13 Object: printing

**`basicPrintNl`**

Print a basic representation of the receiver, followed by a new
line.

**`basicPrintOn: aStream`**

Print a represention of the receiver on aStream

**`display`**

Print a represention of the receiver on the Transcript (stdout the
GUI is not active).  For most objects this is simply its #print
representation, but for strings and characters, superfluous dollars
or extra pair of quotes are stripped.

**`displayNl`**

Print a represention of the receiver, then put a new line on the
Transcript (stdout the GUI is not active).  For most objects this
is simply its #printNl representation, but for strings and
characters, superfluous dollars or extra pair of quotes are
stripped.

**`displayOn: aStream`**

Print a represention of the receiver on aStream.  For most objects
this is simply its #printOn: representation, but for strings and
characters, superfluous dollars or extra pair of quotes are
stripped.

**`displayString`**

Answer a String representing the receiver.  For most objects this
is simply its #printString, but for strings and characters,
superfluous dollars or extra pair of quotes are stripped.

**`print`**

Print a represention of the receiver on the Transcript (stdout the
GUI is not active)

**`printNl`**

Print a represention of the receiver on stdout, put a new line the
Transcript (stdout the GUI is not active)

**`printOn: aStream`**

Print a represention of the receiver on aStream

**`printString`**

Answer a String representing the receiver

#### 1.123.14 Object: relational operators

**`~= anObject`**

Answer whether the receiver and anObject are not equal

**`~~ anObject`**

Answer whether the receiver and anObject are not the same object

#### 1.123.15 Object: saving and loading

**`binaryRepresentationObject`**

This method must be implemented if PluggableProxies are used with
the receiver's class.  The default implementation raises an
exception.

**`postLoad`**

Called after loading an object; must restore it to the state before
'preStore' was called.  Do nothing by default

**`postStore`**

Called after an object is dumped; must restore it to the state
before 'preStore' was called.  Call #postLoad by default

**`preStore`**

Called before dumping an object; it must \*change\* it (it must not
answer a new object) if necessary.  Do nothing by default

**`reconstructOriginalObject`**

Used if an instance of the receiver's class is returned as the
\#binaryRepresentationObject of another object.  The default
implementation raises an exception.

#### 1.123.16 Object: storing

**`store`**

Put a String of Smalltalk code compiling to the receiver on the
Transcript (stdout the GUI is not active)

**`storeLiteralOn: aStream`**

Put a Smalltalk literal compiling to the receiver on aStream

**`storeNl`**

Put a String of Smalltalk code compiling to the receiver, followed
by a new line, on the Transcript (stdout the GUI is not active)

**`storeOn: aStream`**

Put Smalltalk code compiling to the receiver on aStream

**`storeString`**

Answer a String of Smalltalk code compiling to the receiver

#### 1.123.17 Object: syntax shortcuts

**`-> anObject`**

Creates a new instance of Association with the receiver being the
key and the argument becoming the value

#### 1.123.18 Object: testing functionality

**`ifNil: nilBlock`**

Evaluate nilBlock if the receiver is nil, else answer self

**`ifNil: nilBlock ifNotNil: notNilBlock`**

Evaluate nilBlock if the receiver is nil, else evaluate
notNilBlock, passing the receiver.

**`ifNotNil: notNilBlock`**

Evaluate notNilBlock if the receiver is not nil, passing the
receiver.  Else answer nil.

**`ifNotNil: notNilBlock ifNil: nilBlock`**

Evaluate nilBlock if the receiver is nil, else evaluate
notNilBlock, passing the receiver.

**`isArray`**

Answer 'false'.

**`isBehavior`**

Answer 'false'.

**`isCObject`**

Answer 'false'.

**`isCharacter`**

Answer 'false'.

**`isCharacterArray`**

Answer 'false'.

**`isClass`**

Answer 'false'.

**`isFloat`**

Answer 'false'.

**`isInteger`**

Answer 'false'.

**`isKindOf: aClass`**

Answer whether the receiver's class is aClass or a subclass of
aClass

**`isMemberOf: aClass`**

Returns true if the receiver is an instance of the class 'aClass'

**`isMeta`**

Same as isMetaclass

**`isMetaClass`**

Same as isMetaclass

**`isMetaclass`**

Answer 'false'.

**`isNamespace`**

Answer 'false'.

**`isNil`**

Answer whether the receiver is nil

**`isNumber`**

Answer 'false'.

**`isSmallInteger`**

Answer 'false'.

**`isString`**

Answer 'false'.

**`isSymbol`**

Answer 'false'.

**`notNil`**

Answer whether the receiver is not nil

**`respondsTo: aSymbol`**

Returns true if the receiver understands the given selector

#### 1.123.19 Object: VM callbacks

**`badReturnError`**

Called back when a block performs a bad return.

**`mustBeBoolean`**

Called by the system when ifTrue:\*, ifFalse:\*, and: or or: are sent
to anything but a boolean

**`noRunnableProcess`**

Called back when all processes are suspended

**`userInterrupt`**

Called back when the user presses Ctrl-Break

### 1.124 ObjectDumper

**Namespace:** Smalltalk · **Superclass:** [Stream](#1157-stream) · **Category:** Streams-Files

I'm not part of a normal Smalltalk system, but most Smalltalks
provide a similar feature: that is, support for storing objects in
a binary format; there are many advantages in using me instead of
\#storeOn: and the Smalltalk compiler.

The data is stored in a very compact format, which has the side
effect of making loading much faster when compared with compiling
the Smalltalk code prepared by #storeOn:.  In addition, my
instances support circular references between objects, while
\#storeOn: supports it only if you know of such references at design
time and you override #storeOn: to deal with them

#### 1.124.1 ObjectDumper class: establishing proxy classes

**`disableProxyFor: aClass`**

Disable proxies for instances of aClass and its descendants

**`hasProxyFor: aClass`**

Answer whether a proxy class has been registered for instances of
aClass.

**`proxyClassFor: anObject`**

Answer the class of a valid proxy for an object, or nil if none
could be found

**`proxyFor: anObject`**

Answer a valid proxy for an object, or the object itself if none
could be found

**`registerProxyClass: aProxyClass for: aClass`**

Register the proxy class aProxyClass - descendent of DumperProxy -
to be used for instances of aClass and its descendants

#### 1.124.2 ObjectDumper class: instance creation

**`new`**

This method should not be called for instances of this class.

**`on: aFileStream`**

Answer an ObjectDumper working on aFileStream.

#### 1.124.3 ObjectDumper class: shortcuts

**`dump: anObject to: aFileStream`**

Dump anObject to aFileStream.  Answer anObject

**`loadFrom: aFileStream`**

Load an object from aFileStream and answer it

#### 1.124.4 ObjectDumper class: testing

**`example`**

This is a real torture test: it outputs recursive objects,
identical objects multiple times, classes, metaclasses, integers,
characters and proxies (which is also a test of more complex
objects)!

#### 1.124.5 ObjectDumper: accessing

**`flush`**

'Forget' any information on previously stored objects.

**`stream`**

Answer the ByteStream to which the ObjectDumper will write and from
which it will read.

**`stream: aByteStream`**

Set the ByteStream to which the ObjectDumper will write and from
which it will read.

#### 1.124.6 ObjectDumper: loading/dumping objects

**`dump: anObject`**

Dump anObject on the stream associated with the receiver.  Answer
anObject

**`load`**

Load an object from the stream associated with the receiver and
answer it

#### 1.124.7 ObjectDumper: stream interface

**`atEnd`**

Answer whether the underlying stream is at EOF

**`next`**

Load an object from the underlying stream

**`nextPut: anObject`**

Store an object on the underlying stream

### 1.125 ObjectMemory

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Implementation

I provide a few methods that enable one to tune the virtual
machine's usage of memory.  In addition, I can signal to my
dependants some 'events' that can happen during the virtual
machine's life.

ObjectMemory has both class-side and instance-side methods.  In
general, class-side methods provide means to tune the parameters of
the memory manager, while instance-side methods are used together
with the #current class-side method to take a look at statistics on
the memory manager's state.

#### 1.125.1 ObjectMemory class: accessing

**`current`**

Return a snapshot of the VM's memory management statistics.

#### 1.125.2 ObjectMemory class: builtins

**`abort`**

Quit the Smalltalk environment, dumping core.

**`addressOf: anObject`**

Returns the address of the actual object that anObject references.
Note that, with the exception of fixed objects this address is only
valid until the next garbage collection; thus it's pretty risky to
count on the address returned by this method for very long.

**`addressOfOOP: anObject`**

Returns the address of the OOP (object table slot) for anObject.
The address is an Integer and will not change over time (i.e.  is
immune from garbage collector action) except if the virtual machine
is stopped and restarted.

**`bigObjectThreshold`**

Answer the smallest size for objects that are allocated outside the
main heap in the hope of providing more locality of reference
between small objects.

**`bigObjectThreshold: bytes`**

Set the smallest size for objects that are allocated outside the
main heap in the hope of providing more locality of reference
between small objects.  bytes must be a positive SmallInteger.

**`compact`**

Force a full garbage collection, including compaction of oldspace

**`finishIncrementalGC`**

Do a step in the incremental garbage collection.

**`gcMessage`**

Answer whether messages indicating that garbage collection is
taking place are printed on stdout

**`gcMessage: aBoolean`**

Set whether messages indicating that garbage collection is taking
place are printed on stdout

**`globalGarbageCollect`**

Force a full garbage collection

**`growThresholdPercent`**

Answer the percentage of the amount of memory used by the system
grows which has to be full for the system to allocate more memory

**`growThresholdPercent: growPercent`**

Set the percentage of the amount of memory used by the system grows
which has to be full for the system to allocate more memory

**`growTo: numBytes`**

Grow the amount of memory used by the system grows to numBytes.

**`incrementalGCStep`**

Do a step in the incremental garbage collection.

**`quit`**

Quit the Smalltalk environment.  Whether files are closed and other
similar cleanup occurs depends on the platform

**`quit: exitStatus`**

Quit the Smalltalk environment, passing the exitStatus integer to
the OS. Files are closed and other similar cleanups occur.

**`scavenge`**

Force a minor garbage collection

**`smoothingFactor`**

Answer the factor (between 0 and 1) used to smooth the statistics
provided by the virtual machine about memory handling.  0 disables
updating the averages, 1 disables the smoothing (the statistics
return the last value).

**`smoothingFactor: rate`**

Set the factor (between 0 and 1) used to smooth the statistics
provided by the virtual machine about memory handling.  0 disables
updating the averages, 1 disables the smoothing (the statistics
return the last value).

**`spaceGrowRate`**

Answer the rate with which the amount of memory used by the system
grows

**`spaceGrowRate: rate`**

Set the rate with which the amount of memory used by the system
grows

#### 1.125.3 ObjectMemory class: initialization

**`changed: aSymbol`**

Not commented.

**`initialize`**

Initialize the globals

#### 1.125.4 ObjectMemory class: saving the image

**`snapshot`**

Save a snapshot on the image file that was loaded on startup.

**`snapshot: aString`**

Save an image on the aString file

#### 1.125.5 ObjectMemory: accessing

**`allocFailures`**

Answer the number of times that the old-space allocator found no
block that was at least as big as requested, and had to ask the
operating system for more memory.

**`allocMatches`**

Answer the number of times that the old-space allocator found a
block that was exactly as big as requested.

**`allocProbes`**

Answer the number of free blocks that the old-space allocator had
to examine so far to allocate all the objects that are in old-space

**`allocSplits`**

Answer the number of times that the old-space allocator could not
find a block that was exactly as big as requested, and had to split
a larger free block in two parts.

**`bytesPerOOP`**

Answer the number of bytes that is taken by an ordinary object
pointer (in practice, a field such as a named instance variable).

**`bytesPerOTE`**

Answer the number of bytes that is taken by an object table entry
(in practice, the overhead incurred by every object in the system,
with the sole exception of SmallIntegers).

**`edenSize`**

Answer the number of bytes in the 'eden' area of the young
generation (in practice, the number of allocated bytes between two
scavenges).

**`edenUsedBytes`**

Answer the number of bytes that are currently filled in the 'eden'
area of the young generation.

**`fixedSpaceSize`**

Answer the number of bytes in the special heap devoted to objects
that the garbage collector cannot move around in memory.

**`fixedSpaceUsedBytes`**

Answer the number of bytes that are currently filled in the special
heap devoted to objects that the garbage collector cannot move
around in memory.

**`numCompactions`**

Answer the number of oldspace compactions that happened since the
VM was started.

**`numFixedOOPs`**

Answer the number of objects that the garbage collector cannot move
around in memory.

**`numFreeOTEs`**

Answer the number of entries that are currently free in the object
table.

**`numGlobalGCs`**

Answer the number of global garbage collections (collection of the
entire heap) that happened since the VM was started.

**`numGrowths`**

Answer the number of times that oldspace was grown since the VM was
started.

**`numOTEs`**

Answer the number of entries that are currently allocated for the
object table.

**`numOldOOPs`**

Answer the number of objects that reside in the old generation.

**`numScavenges`**

Answer the number of scavenges (fast collections of the young
generation) that happened since the VM was started.

**`numWeakOOPs`**

Answer the number of weak objects that the garbage collector is
currently tracking.

**`oldSpaceSize`**

Answer the number of bytes in the old generation.

**`oldSpaceUsedBytes`**

Answer the number of bytes that are currently filled in the old
generation.

**`reclaimedBytesPerGlobalGC`**

Answer the average number of bytes that are found to be garbage
during a global garbage collections.

**`reclaimedBytesPerScavenge`**

Answer the average number of bytes that are found to be garbage
during a scavenge.

**`reclaimedPercentPerScavenge`**

Answer the average percentage of allocated bytes that are found to
be garbage during a scavenge.  If this number falls below 60-70 you
should definitely increment the size of the eden, because you risk
that scavenging is eating a considerable fraction of your execution
time; do the measurement on a restarted image, so that the extra
tenuring incurred when creating long-lived objects such as classes
or methods is not considered.

**`survSpaceSize`**

Answer the number of bytes in the 'survivor' area of the young
generation (the area to which young objects are relocated during
scavenges).

**`survSpaceUsedBytes`**

Answer the number of bytes that are currently filled in the
'survivor' area of the young generation.

**`tenuredBytesPerScavenge`**

Answer the average number of bytes that are promoted to oldspace
during a scavenge.

**`timeBetweenGlobalGCs`**

Answer the average number of milliseconds between two global
garbage collections.

**`timeBetweenGrowths`**

Answer the average number of milliseconds between decisions to grow
the heap.

**`timeBetweenScavenges`**

Answer the average number of milliseconds between two scavenges
(fast collections of the young generation).

**`timeToCollect`**

Answer the average number of milliseconds that a global garbage
collection takes.

**`timeToCompact`**

Answer the average number of milliseconds that compacting the heap
takes.  This the same time that is taken by growing the heap.

**`timeToScavenge`**

Answer the average number of milliseconds that a scavenge takes
(fast collections of the young generation).

#### 1.125.6 ObjectMemory: builtins

**`update`**

Update the values in the object to the current state of the VM.

#### 1.125.7 ObjectMemory: derived information

**`scavengesBeforeTenuring`**

Answer the number of scavenges that an object must on average
survive before being promoted to oldspace; this is however only an
estimate because objects that are reachable from oldspace have a
higher probability to be tenured soon, while objects that are only
reachable from thisContext have a lower probability to be tenured.
Anyway, if this number falls below 2-3 you should definitely
increment the size of eden and/or of survivor space, because you
are tenuring too often and relying too much on global garbage
collection to keep your heap clean; do the measurement on a
restarted image, so that the extra tenuring incurred when creating
long-lived objects such as classes or methods is not considered.

### 1.126 OrderedCollection

**Namespace:** Smalltalk · **Superclass:** [SequenceableCollection](#1151-sequenceablecollection) · **Category:** Collections-Sequenceable

My instances represent ordered collections of arbitrary typed
objects which are not directly accessible by an index.  They can be
accessed indirectly through an index, and can be manipulated by
adding to the end or based on content (such as add:after:)

#### 1.126.1 OrderedCollection class: instance creation

**`new`**

Answer an OrderedCollection of default size

**`new: anInteger`**

Answer an OrderedCollection of size anInteger

#### 1.126.2 OrderedCollection: accessing

**`at: anIndex`**

Answer the anIndex-th item of the receiver

**`at: anIndex put: anObject`**

Store anObject at the anIndex-th item of the receiver, answer
anObject

**`first`**

Answer the first item of the receiver

**`last`**

Answer the last item of the receiver

**`size`**

Return the number of objects in the receiver

#### 1.126.3 OrderedCollection: adding

**`add: anObject`**

Add anObject in the receiver, answer it

**`add: newObject after: oldObject`**

Add newObject in the receiver just after oldObject, answer it.
Fail if oldObject can't be found

**`add: newObject afterIndex: i`**

Add newObject in the receiver just after the i-th, answer it.  Fail
if i \< 0 or i \> self size

**`add: newObject before: oldObject`**

Add newObject in the receiver just before oldObject, answer it.
Fail if oldObject can't be found

**`add: newObject beforeIndex: i`**

Add newObject in the receiver just before the i-th, answer it.
Fail if i \< 1 or i \> self size + 1

**`addAll: aCollection`**

Add every item of aCollection to the receiver, answer it

**`addAll: newCollection after: oldObject`**

Add every item of newCollection to the receiver just after
oldObject, answer it.  Fail if oldObject is not found

**`addAll: newCollection afterIndex: i`**

Add every item of newCollection to the receiver just after the
i-th, answer it.  Fail if i \< 0 or i \> self size

**`addAll: newCollection before: oldObject`**

Add every item of newCollection to the receiver just before
oldObject, answer it.  Fail if oldObject is not found

**`addAll: newCollection beforeIndex: i`**

Add every item of newCollection to the receiver just before the
i-th, answer it.  Fail if i \< 1 or i \> self size + 1

**`addAllFirst: aCollection`**

Add every item of newCollection to the receiver right at the start
of the receiver.  Answer aCollection

**`addAllLast: aCollection`**

Add every item of newCollection to the receiver right at the end of
the receiver.  Answer aCollection

**`addFirst: newObject`**

Add newObject to the receiver right at the start of the receiver.
Answer newObject

**`addLast: newObject`**

Add newObject to the receiver right at the end of the receiver.
Answer newObject

#### 1.126.4 OrderedCollection: built ins

**`primReplaceFrom: start to: stop with: byteArray startingAt: replaceStart`**

Replace the characters from start to stop with new characters whose
ASCII codes are contained in byteArray, starting at the
replaceStart location of byteArray

#### 1.126.5 OrderedCollection: enumerating

**`do: aBlock`**

Evaluate aBlock for all the elements in the collection

#### 1.126.6 OrderedCollection: removing

**`identityRemove: oldObject`**

Remove oldObject from the receiver.  If absent, fail, else answer
oldObject.

**`identityRemove: anObject ifAbsent: aBlock`**

Remove anObject from the receiver.  If it can't be found, answer
the result of evaluating aBlock

**`remove: anObject ifAbsent: aBlock`**

Remove anObject from the receiver.  If it can't be found, answer
the result of evaluating aBlock

**`removeAtIndex: anIndex`**

Remove the object at index anIndex from the receiver.  Fail if the
index is out of bounds.

**`removeFirst`**

Remove an object from the start of the receiver.  Fail if the
receiver is empty

**`removeLast`**

Remove an object from the end of the receiver.  Fail if the
receiver is empty

### 1.127 Package

**Namespace:** Smalltalk · **Superclass:** Kernel.PackageInfo · **Category:** Language-Packaging

I am not part of a standard Smalltalk system.  I store internally
the information on a Smalltalk package, and can output my
description in XML.

#### 1.127.1 Package class: accessing

**`tags`**

Not commented.

#### 1.127.2 Package class: instance creation

**`parse: file`**

Answer a package from the XML description in file.

#### 1.127.3 Package: accessing

**`addBuiltFile: aString`**

Not commented.

**`addCallout: aString`**

Not commented.

**`addFeature: aString`**

Not commented.

**`addFile: aString`**

Not commented.

**`addFileIn: aString`**

Not commented.

**`addLibrary: aString`**

Not commented.

**`addModule: aString`**

Not commented.

**`addPrerequisite: aString`**

Not commented.

**`addSunitScript: aString`**

Not commented.

**`baseDirectories`**

Answer 'baseDirectories'.

**`baseDirectories: aCollection`**

Check if it's possible to resolve the names in the package
according to the base directories in baseDirectories, which depend
on where the packages.xml is found: the three possible places are
1\) the system kernel directory's parent directory, 2) the local
kernel directory's parent directory, 3) the local image directory
(in order of decreasing priority).

For a packages.xml found in the system kernel directory's parent
directory, all three directories are searched.  For a packages.xml
found in the local kernel directory's parent directory, only
directories 2 and 3 are searched.  For a packages.xml directory in
the local image directory, instead, only directory 3 is searched.

**`builtFiles`**

Answer a (modifiable) OrderedCollection of files that are part of
the package but are not distributed.

**`callouts`**

Answer a (modifiable) Set of call-outs that are required to load
the package.  Their presence is checked after the libraries and
modules are loaded so that you can do a kind of versioning.

**`directory`**

Answer the base directory from which to load the package.

**`features`**

Answer a (modifiable) Set of features provided by the package.

**`fileIns`**

Answer a (modifiable) OrderedCollections of files that are to be
filed-in to load the package.  This is usually a subset of 'files'
and 'builtFiles'.

**`files`**

Answer a (modifiable) OrderedCollection of files that are part of
the package.

**`fullPathOf: fileName`**

Try appending 'self directory' and fileName to each of the
directory in baseDirectories, and return the path to the first
tried filename that exists.  Raise a PackageNotAvailable exception
if no directory is found that contains the file.

**`libraries`**

Answer a (modifiable) Set of shared library names that are required
to load the package.

**`modules`**

Answer a (modifiable) Set of modules that are required to load the
package.

**`namespace`**

Answer the namespace in which the package is loaded.

**`namespace: aString`**

Set to aString the namespace in which the package is loaded.

**`prerequisites`**

Answer a (modifiable) Set of prerequisites.

**`primFileIn`**

Private - File in the given package without paying attention at
dependencies and C callout availability

**`relativeDirectory`**

Answer the directory, relative to the packages file, from which to
load the package.

**`relativeDirectory: dir`**

Set the directory, relative to the packages file, from which to
load the package, to dir.

**`startScript`**

Answer the start script for the package.

**`startScript: aString`**

Set the start script for the package to aString.

**`stopScript`**

Answer the start script for the package.

**`stopScript: aString`**

Set the stop script for the package to aString.

**`sunitScripts`**

Answer a (modifiable) OrderedCollection of SUnit scripts that
compose the package's test suite.

**`test`**

Answer the test sub-package.

**`test: aPackage`**

Set the test sub-package to be aPackage.

**`url`**

Answer the URL at which the package repository can be found.

**`url: aString`**

Set to aString the URL at which the package repository can be
found.

**`version`**

Not commented.

**`version: aVersion`**

Not commented.

#### 1.127.4 Package: still unclassified

**`checkTagIfInPath: aString`**

Not commented.

**`dir: file tag: aDictionary`**

Not commented.

**`isInPath`**

Not commented.

**`parseAttributes: aString`**

Not commented.

**`path`**

Not commented.

**`path: aString`**

Not commented.

#### 1.127.5 Package: version parsing

**`parseVersion: aString`**

Not commented.

### 1.128 PackageLoader

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Packaging

I am not part of a standard Smalltalk system.  I provide methods
for retrieving package information from an XML file and to load
packages into a Smalltalk image, correctly handling dependencies.

#### 1.128.1 PackageLoader class: accessing

**`builtFilesFor: package`**

Answer a Set of Strings containing the filenames of the given
package's machine-generated files (relative to the directory
answered by #directoryFor:)

**`calloutsFor: package`**

Answer a Set of Strings containing the filenames of the given
package's required callouts (relative to the directory answered by
\#directoryFor:)

**`directoryFor: package`**

Answer a Directory object to the given package's files

**`featuresFor: package`**

Answer a Set of Strings containing the features provided by the
given package.

**`fileInsFor: package`**

Answer a Set of Strings containing the filenames of the given
package's file-ins (relative to the directory answered by
\#directoryFor:)

**`filesFor: package`**

Answer a Set of Strings containing the filenames of the given
package's files (relative to the directory answered by
\#directoryFor:)

**`flush`**

Set to reload the 'packages.xml' file the next time it is needed.

**`ignoreCallouts`**

Answer whether unavailable C callouts must generate errors or not.

**`ignoreCallouts: aBoolean`**

Set whether unavailable C callouts must generate errors or not.

**`librariesFor: package`**

Answer a Set of Strings containing the filenames of the given
package's libraries (relative to the directory answered by
\#directoryFor:)

**`modulesFor: package`**

Answer a Set of Strings containing the filenames of the given
package's modules (relative to the directory answered by
\#directoryFor:)

**`packageAt: package`**

Answer a Package object for the given package

**`packageAt: package ifAbsent: aBlock`**

Answer a Package object for the given package

**`prerequisitesFor: package`**

Answer a Set of Strings containing the prerequisites for the given
package

**`refresh`**

Reload the 'packages.xml' file in the image and kernel directories.
The three possible places are 1) the kernel directory's parent
directory, 2) the '.st' subdirectory of the user's home directory,
3\) the local image directory (in order of decreasing priority).

For a packages.xml found in the kernel directory's parent
directory, all three directories are searched.  For a packages.xml
found in the '.st' subdirectory, only directories 2 and 3 are
searched.  For a packages.xml directory in the local image
directory, finally, only directory 3 is searched.

**`sunitScriptFor: package`**

Answer a Strings containing a SUnit script that describes the
package's test suite.

#### 1.128.2 PackageLoader class: loading

**`fileInPackage: package`**

File in the given package into GNU Smalltalk.

**`fileInPackages: packagesList`**

File in all the packages in packagesList into GNU Smalltalk.

#### 1.128.3 PackageLoader class: testing

**`canLoad: package`**

Answer whether all the needed pre-requisites for package are
available.

### 1.129 Permission

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Security

I am the basic class that represents whether operations that could
harm the system's security are allowed or denied.

#### 1.129.1 Permission class: testing

**`allowing: aSymbol target: aTarget action: action`**

Not commented.

**`allowing: aSymbol target: aTarget actions: actionsArray`**

Not commented.

**`denying: aSymbol target: aTarget action: action`**

Not commented.

**`denying: aSymbol target: aTarget actions: actionsArray`**

Not commented.

**`granting: aSymbol target: aTarget action: action`**

Not commented.

**`granting: aSymbol target: aTarget actions: actionsArray`**

Not commented.

**`name: aSymbol target: aTarget action: action`**

Not commented.

**`name: aSymbol target: aTarget actions: actionsArray`**

Not commented.

#### 1.129.2 Permission: accessing

**`action: anObject`**

Not commented.

**`actions`**

Answer 'actions'.

**`actions: anObject`**

Not commented.

**`allow`**

Not commented.

**`allowing`**

Not commented.

**`deny`**

Not commented.

**`denying`**

Not commented.

**`isAllowing`**

Answer 'positive'.

**`name`**

Answer 'name'.

**`name: anObject`**

Not commented.

**`target`**

Answer 'target'.

**`target: anObject`**

Not commented.

#### 1.129.3 Permission: testing

**`check: aPermission for: anObject`**

Not commented.

**`implies: aPermission`**

Not commented.

### 1.130 PluggableAdaptor

**Namespace:** Smalltalk · **Superclass:** [ValueAdaptor](#1204-valueadaptor) · **Category:** Language-Data types

I mediate between complex get/set behavior and the #value/#value:
protocol used by ValueAdaptors.  The get/set behavior can be
implemented by two blocks, or can be delegated to another object
with messages such as #someProperty to get and #someProperty: to
set.

#### 1.130.1 PluggableAdaptor class: creating instances

**`getBlock: getBlock putBlock: putBlock`**

Answer a PluggableAdaptor using the given blocks to implement
\#value and #value:

**`on: anObject aspect: aSymbol`**

Answer a PluggableAdaptor using anObject's aSymbol message to
implement #value, and anObject's aSymbol: message (aSymbol followed
by a colon) to implement #value:

**`on: anObject getSelector: getSelector putSelector: putSelector`**

Answer a PluggableAdaptor using anObject's getSelector message to
implement #value, and anObject's putSelector message to implement
\#value:

**`on: anObject index: anIndex`**

Answer a PluggableAdaptor using anObject's #at: and #at:put:
message to implement #value and #value:; the first parameter of
\#at: and #at:put: is anIndex

**`on: aDictionary key: aKey`**

Same as #on:index:.  Provided for clarity and completeness.

#### 1.130.2 PluggableAdaptor: accessing

**`value`**

Get the value of the receiver.

**`value: anObject`**

Set the value of the receiver.

### 1.131 PluggableProxy

**Namespace:** Smalltalk · **Superclass:** [AlternativeObjectProxy](#12-alternativeobjectproxy) · **Category:** Streams-Files

I am a proxy that stores a different object and, upon load, sends
\#reconstructOriginalObject to that object (which can be a
DirectedMessage, in which case the message is sent).  The object to
be stored is retrieved by sending #binaryRepresentationObject to
the object.

#### 1.131.1 PluggableProxy class: accessing

**`on: anObject`**

Answer a proxy to be used to save anObject.  The proxy stores a
different object obtained by sending to anObject the
\#binaryRepresentationObject message (embedded between #preStore and
\#postStore as usual).

#### 1.131.2 PluggableProxy: saving and restoring

**`object`**

Reconstruct the object stored in the proxy and answer it; the
binaryRepresentationObject is sent the #reconstructOriginalObject
message, and the resulting object is sent the #postLoad message.

### 1.132 Point

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Data types

Beginning of a Point class for simple display manipulation.  Has
not been exhaustively tested but appears to work for the basic
primitives and for the needs of the Rectangle class.

#### 1.132.1 Point class: instance creation

**`new`**

Create a new point with both coordinates set to 0

**`x: xInteger y: yInteger`**

Create a new point with the given coordinates

#### 1.132.2 Point: accessing

**`x`**

Answer the x coordinate

**`x: aNumber`**

Set the x coordinate to aNumber

**`x: anXNumber y: aYNumber`**

Set the x and y coordinate to anXNumber and aYNumber, respectively

**`y`**

Answer the y coordinate

**`y: aNumber`**

Set the y coordinate to aNumber

#### 1.132.3 Point: arithmetic

**`* scale`**

Multiply the receiver by scale, which can be a Number or a Point

**`+ delta`**

Sum the receiver and delta, which can be a Number or a Point

**`- delta`**

Subtract delta, which can be a Number or a Point, from the receiver

**`/ scale`**

Divide the receiver by scale, which can be a Number or a Point,
with no loss of precision

**`// scale`**

Divide the receiver by scale, which can be a Number or a Point,
with truncation towards -infinity

**`abs`**

Answer a new point whose coordinates are the absolute values of the
receiver's

#### 1.132.4 Point: comparing

**`< aPoint`**

Answer whether the receiver is higher and to the left of aPoint

**`<= aPoint`**

Answer whether aPoint is equal to the receiver, or the receiver is
higher and to the left of aPoint

**`= aPoint`**

Answer whether the receiver is equal to aPoint

**`> aPoint`**

Answer whether the receiver is lower and to the right of aPoint

**`>= aPoint`**

Answer whether aPoint is equal to the receiver, or the receiver is
lower and to the right of aPoint

**`max: aPoint`**

Answer self if it is lower and to the right of aPoint, aPoint
otherwise

**`min: aPoint`**

Answer self if it is higher and to the left of aPoint, aPoint
otherwise

#### 1.132.5 Point: converting

**`asPoint`**

Answer the receiver.

**`asRectangle`**

Answer an empty rectangle whose origin is self

**`corner: aPoint`**

Answer a Rectangle whose origin is the receiver and whose corner is
aPoint

**`extent: aPoint`**

Answer a Rectangle whose origin is the receiver and whose extent is
aPoint

**`hash`**

Answer an hash value for the receiver

#### 1.132.6 Point: point functions

**`arcTan`**

Answer the angle (measured counterclockwise) between the receiver
and a ray starting in (0, 0) and moving towards (1, 0) - i.e.  3
o'clock

**`dist: aPoint`**

Answer the distance between the receiver and aPoint

**`dotProduct: aPoint`**

Answer the dot product between the receiver and aPoint

**`grid: aPoint`**

Answer a new point whose coordinates are rounded towards the
nearest multiple of aPoint

**`normal`**

Rotate the Point 90degrees clockwise and get the unit vector

**`transpose`**

Answer a new point whose coordinates are the receiver's coordinates
exchanged (x becomes y, y becomes x)

**`truncatedGrid: aPoint`**

Answer a new point whose coordinates are rounded towards -infinity,
to a multiple of grid (which must be a Point)

#### 1.132.7 Point: printing

**`printOn: aStream`**

Print a representation for the receiver on aStream

#### 1.132.8 Point: storing

**`storeOn: aStream`**

Print Smalltalk code compiling to the receiver on aStream

#### 1.132.9 Point: truncation and round off

**`rounded`**

Answer a new point whose coordinates are rounded to the nearest
integer

**`truncateTo: grid`**

Answer a new point whose coordinates are rounded towards -infinity,
to a multiple of grid (which must be a Number)

### 1.133 PositionableStream

**Namespace:** Smalltalk · **Superclass:** [Stream](#1157-stream) · **Category:** Streams-Collections

My instances represent streams where explicit positioning is
permitted.  Thus, my streams act in a manner to normal disk files:
you can read or write sequentially, but also position the file to a
particular place whenever you choose.  Generally, you'll want to
use ReadStream, WriteStream or ReadWriteStream instead of me to
create and use streams.

#### 1.133.1 PositionableStream class: instance creation

**`on: aCollection`**

Answer an instance of the receiver streaming on the whole contents
of aCollection

**`on: aCollection from: firstIndex to: lastIndex`**

Answer an instance of the receiver streaming from the firstIndex-th
item of aCollection to the lastIndex-th

#### 1.133.2 PositionableStream: accessing-reading

**`close`**

Disassociate a stream from its backing store.

**`contents`**

Returns a collection of the same type that the stream accesses, up
to and including the final element.

**`copyFrom: start to: end`**

Answer the data on which the receiver is streaming, from the
start-th item to the end-th.  Note that this method is 0-based,
unlike the one in Collection, because a Stream's #position method
returns 0-based values.

**`next`**

Answer the next item of the receiver.  Returns nil when at end of
stream.

**`nextAvailable: anInteger into: aCollection startingAt: pos`**

Place up to anInteger objects from the receiver into aCollection,
starting from position pos in the collection and stopping if no
more data is available.

**`nextAvailable: anInteger putAllOn: aStream`**

Copy up to anInteger objects from the receiver into aStream,
stopping if no more data is available.

**`peek`**

Returns the next element of the stream without moving the pointer.
Returns nil when at end of stream.

**`peekFor: anObject`**

Returns true and gobbles the next element from the stream of it is
equal to anObject, returns false and doesn't gobble the next
element if the next element is not equal to anObject.

**`readStream`**

Answer a ReadStream on the same contents as the receiver

**`reverseContents`**

Returns a collection of the same type that the stream accesses, up
to and including the final element, but in reverse order.

**`upTo: anObject`**

Returns a collection of the same type that the stream accesses, up
to but not including the object anObject.  Returns the entire rest
of the stream's contents if anObject is not present.

**`upToEnd`**

Returns a collection of the same type that the stream accesses,
containing the entire rest of the stream's contents.

#### 1.133.3 PositionableStream: class type methods

**`isExternalStream`**

We stream on a collection residing in the image, so answer false

**`species`**

Return the type of the collections returned by #upTo: etc., which
are the same kind as those returned by the collection with methods
such as #select:.

#### 1.133.4 PositionableStream: compiling

**`name`**

Answer a string that represents what the receiver is streaming on

**`segmentFrom: startPos to: endPos`**

Answer an object that, when sent #asString, will yield the result
of sending 'copyFrom: startPos to: endPos' to the receiver

#### 1.133.5 PositionableStream: positioning

**`basicPosition: anInteger`**

Move the stream pointer to the anInteger-th object

**`isPositionable`**

Answer true if the stream supports moving backwards with #skip:.

**`position`**

Answer the current value of the stream pointer

**`position: anInteger`**

Move the stream pointer to the anInteger-th object

**`reset`**

Move the stream back to its first element.  For write-only streams,
the stream is truncated there.

**`setToEnd`**

Move the current position to the end of the stream.

**`size`**

Answer the size of data on which we are streaming.

**`skip: anInteger`**

Move the current position by anInteger places, either forwards or
backwards.

#### 1.133.6 PositionableStream: still unclassified

**`nextPutAllOn: aStream`**

Write all the objects in the receiver to aStream.

#### 1.133.7 PositionableStream: testing

**`atEnd`**

Answer whether the objects in the stream have reached an end

**`basicAtEnd`**

Answer whether the objects in the stream have reached an end.  This
method must NOT be overridden.

**`isEmpty`**

Answer whether the stream has no objects

#### 1.133.8 PositionableStream: truncating

**`truncate`**

Truncate the receiver to the current position - only valid for
writing streams

### 1.134 Process

**Namespace:** Smalltalk · **Superclass:** [Link](#1103-link) · **Category:** Language-Processes

I represent a unit of computation.  My instances are independantly
executable blocks that have a priority associated with them, and
they can suspend themselves and resume themselves however they
wish.

#### 1.134.1 Process: accessing

**`externalInterruptsEnabled`**

Answer whether the receiver is executed with interrupts enabled

**`name`**

Answer the user-friendly name of the process.

**`name: aString`**

Give the name aString to the process

**`priority`**

Answer the receiver's priority

**`priority: anInteger`**

Change the receiver's priority to anInteger

**`queueInterrupt: aBlock`**

Force the receiver to be interrupted and to evaluate aBlock as soon
as it becomes the active process (this could mean NOW if the
receiver is active).  If the process is temporarily suspended or
waiting on a semaphore, it is temporarily woken up so that the
interrupt is processed as soon as the process priority allows to
do.  Answer the receiver.

**`suspendedContext`**

Answer the context that the process was executing at the time it
was suspended.

**`suspendedContext: aContext`**

Modify the context that the process was executing at the time it
was suspended.

**`valueWithoutInterrupts: aBlock`**

Evaluate aBlock and delay all interrupts that are requested during
its execution to after aBlock returns.

#### 1.134.2 Process: basic

**`context`**

Return the execution context of the receiver.

**`debugger`**

Return the object in charge of debugging the receiver.  This always
returns nil unless the DebugTools package is loaded.

**`finalize`**

Terminate processes that are GCed while waiting on a dead
semaphore.

**`lowerPriority`**

Lower a bit the priority of the receiver.  A #lowerPriority will
cancel a previous #raisePriority, and vice versa.

**`makeUntrusted: aBoolean`**

Set whether the receiver is trusted or not.

**`primTerminate`**

Terminate the receiver - This is nothing more than prohibiting to
resume the process, then suspending it.

**`raisePriority`**

Raise a bit the priority of the receiver.  A #lowerPriority will
cancel a previous #raisePriority, and vice versa.

**`singleStep`**

Execute a limited amount of code (usually a bytecode, or up to the
next backward jump, or up to the next message send) of the
receiver, which must in a ready-to-run state (neither executing nor
terminating nor suspended), then restart running the current
process.  The current process should have higher priority than the
receiver.  For better performance, use the underlying primitive,
Process\>\>#singleStepWaitingOn:.

**`terminate`**

Terminate the receiver after having evaluated all the #ensure: and
\#ifCurtailed: blocks that are active in it.  This is done by
signalling a ProcessBeingTerminated notification.

**`terminateOnQuit`**

Mark the receiver so that it is terminated when ObjectMemory
class\>\>#quit: is sent.

#### 1.134.3 Process: builtins

**`resume`**

Resume the receiver's execution

**`singleStepWaitingOn: aSemaphore`**

Execute a limited amount of code (usually a bytecode, or up to the
next backward jump, or up to the next message send) of the
receiver, which must in a ready-to-run state (neither executing nor
terminating nor suspended), then restart running the current
process.  aSemaphore is used as a means to synchronize the
execution of the current process and the receiver and should have
no signals on it.  The current process should have higher priority
than the receiver.

**`suspend`**

Do nothing if we're already suspended.  Note that the blue book
made suspend a primitive - but the real primitive is yielding
control to another process.  Suspending is nothing more than taking
ourselves out of every scheduling list and THEN yielding control to
another process

**`yield`**

Yield control from the receiver to other processes

#### 1.134.4 Process: debugging

**`detach`**

Do nothing, instances of Process are already detached.

#### 1.134.5 Process: printing

**`printOn: aStream`**

Print a representation of the receiver on aStream

### 1.135 ProcessEnvironment

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Processes

I represent a proxy for thread-local variables defined for
Smalltalk processes.  Associations requested to me retrieve the
thread-local value for the current process.  For now, I don't
provide the full protocol of a Dictionary; in particular the
iteration protocol is absent.

#### 1.135.1 ProcessEnvironment class: disabled

**`new`**

This method should not be called for instances of this class.

#### 1.135.2 ProcessEnvironment class: singleton

**`uniqueInstance`**

Return the singleton instance of ProcessEnvironment.

#### 1.135.3 ProcessEnvironment: accessing

**`add: newObject`**

Add the newObject association to the receiver

**`associationAt: key`**

Answer the value associated to the given key, or the result of
evaluating aBlock if the key is not found

**`associationAt: key ifAbsent: aBlock`**

Answer the value associated to the given key, or the result of
evaluating aBlock if the key is not found

**`at: key`**

Answer the value associated to the given key.  Return nil if the
key is not found

**`at: key ifAbsent: aBlock`**

Answer the value associated to the given key, or the result of
evaluating aBlock if the key is not found

**`at: key ifAbsentPut: aBlock`**

Answer the value associated to the given key, setting it to the
result of evaluating aBlock if the key is not found.

**`at: key ifPresent: aBlock`**

Answer the value associated to the given key, or the result of
evaluating aBlock if the key is not found

**`at: key put: value`**

Store value as associated to the given key

**`keys`**

Answer a kind of Set containing the keys of the receiver

#### 1.135.4 ProcessEnvironment: dictionary removing

**`remove: anAssociation`**

Remove anAssociation's key from the dictionary

**`remove: anAssociation ifAbsent: aBlock`**

Remove anAssociation's key from the dictionary

**`removeAllKeys: keys`**

Remove all the keys in keys, without raising any errors

**`removeAllKeys: keys ifAbsent: aBlock`**

Remove all the keys in keys, passing the missing keys as parameters
to aBlock as they're encountered

**`removeKey: aSymbol`**

Remove the aSymbol key from the dictionary

**`removeKey: aSymbol ifAbsent: aBlock`**

Remove the aSymbol key from the dictionary

#### 1.135.5 ProcessEnvironment: dictionary testing

**`includesKey: key`**

Answer whether the receiver contains the given key

### 1.136 ProcessorScheduler

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Processes

I provide methods that control the execution of processes.

#### 1.136.1 ProcessorScheduler class: instance creation

**`new`**

Error--new instances of ProcessorScheduler should not be created.

#### 1.136.2 ProcessorScheduler: basic

**`activeDebugger`**

Answer the active process' debugger

**`activePriority`**

Answer the active process' priority

**`activeProcess`**

Answer the active process

**`processEnvironment`**

Answer another singleton object hosting thread-local variables for
the Smalltalk processes.  This acts like a normal Dictionary with a
couple of differences: a) using #associationAt: will return special
associations that retrieve a thread-local value; b) requesting
missing keys will return nil, and removing them will be a nop.

**`processesAt: aPriority`**

Answer a linked list of processes at the given priority

**`terminateActive`**

Terminate the active process

**`timeSlice`**

Answer the timeslice that is assigned to each Process before it is
automatically preempted by the system (in milliseconds).  An answer
of zero means that preemptive multitasking is disabled.  Note that
the system by default is compiled without preemptive multitasking,
and that even if it is enabled it will work only under BSD
derivatives (or, in general, systems that support ITIMER\_VIRTUAL).

**`timeSlice: milliSeconds`**

Set the timeslice that is assigned to each Process before it is
automatically preempted by the system.  Setting this to zero
disables preemptive multitasking.  Note that the system by default
is compiled with preemptive multitasking disabled, and that even if
it is enabled it will surely work only under BSD derivatives (or,
in general, systems that support ITIMER\_VIRTUAL).

**`yield`**

Let the active process yield control to other processes

#### 1.136.3 ProcessorScheduler: built ins

**`disableInterrupts`**

Disable interrupts caused by external events while the current
process is executing.  Note that interrupts are disabled on a
per-process basis, and that calling #disableInterrupts twice
requires calling #enableInterrupts twice as well to re-enable
interrupts.

**`enableInterrupts`**

Re-enable interrupts caused by external events while the current
process is executing.  By default, interrupts are enabled.

#### 1.136.4 ProcessorScheduler: idle tasks

**`idle`**

Private - Call the next idle task.  Return whether GNU Smalltalk
should pause until the next OS signal.

**`idleAdd: aBlock`**

Register aBlock to be executed when things are idle

**`initialize`**

Private - Start the finalization process.

**`pause: aBoolean`**

Private - Pause for some time if aBoolean is false, or until a
signal if it is true.

**`startFinalizers`**

Private - Fire a low-priority process to finalize the objects

**`update: aSymbol`**

If we left some work behind when the image was saved, do it now.

#### 1.136.5 ProcessorScheduler: printing

**`printOn: aStream`**

Store onto aStream a printed representation of the receiver

#### 1.136.6 ProcessorScheduler: priorities

**`highIOPriority`**

Answer the priority for system high-priority I/O processes, such as
a process handling input from a network.

**`highestPriority`**

Answer the highest valid priority

**`idlePriority`**

Answer the priority of idle processes.

**`lowIOPriority`**

Answer the priority for system low-priority I/O processes.
Examples are the process handling input from the user (keyboard,
pointing device, etc.)  and the process distributing input from a
network.

**`lowestPriority`**

Answer the lowest valid priority

**`priorityName: priority`**

Private - Answer a name for the given process priority

**`systemBackgroundPriority`**

Answer the priority for system background-priority processes.  An
incremental garbage collector could run at this level but now it
runs at idlePriority instead.

**`timingPriority`**

Answer the priority for system real-time processes.

**`unpreemptedPriority`**

Answer the highest priority avilable in the system; never create a
process with this priority, instead use
BlockClosure\>\>#valueWithoutPreemption.

**`userBackgroundPriority`**

Answer the priority for user background-priority processes

**`userInterruptPriority`**

Answer the priority for user interrupt-priority processes.
Processes run at this level will preempt the window scheduler and
should, therefore, not consume the processor forever.

**`userSchedulingPriority`**

Answer the priority for user standard-priority processes

#### 1.136.7 ProcessorScheduler: storing

**`storeOn: aStream`**

Store onto aStream a Smalltalk expression which evaluates to the
receiver

#### 1.136.8 ProcessorScheduler: timed invocation

**`isTimeoutProgrammed`**

Private - Answer whether there is a pending call to
\#signal:atMilliseconds:

**`signal: aSemaphore atNanosecondClockValue: ns`**

Private - signal 'aSemaphore' when the nanosecond clock reaches
'ns' nanoseconds.

**`signal: aSemaphore onInterrupt: anIntegerSignalNumber`**

Signal 'aSemaphore' when the given C signal occurs.

### 1.137 ProcessVariable

**Namespace:** Smalltalk · **Superclass:** [LookupKey](#1105-lookupkey) · **Category:** Language-Processes

I represent a proxy for a thread-local variable defined for a
process.  Requesting the value will return the thread-local setting
for the current process.

#### 1.137.1 ProcessVariable class: accessing

**`key: anObject`**

Return a new ProcessVariable with the given key.  Not that the key
need not be a symbol or string, for example you could use an array
\#(#{class name} 'name').  Setting the variable's value will
automatically create it in the current process, while removal must
be done by hand through the ProcessEnvironment singleton object.

**`new`**

Return a new ProcessVariable with a new anonymous but unique key.
It is suggested to use a descriptive name instead to ease
debugging.  Setting the variable's value will automatically create
it in the current process, while removal must be done by hand
through the ProcessEnvironment singleton object.

#### 1.137.2 ProcessVariable: accessing

**`environment`**

Return the environment in which this ProcessVariable lives.  This
is the singleton instance of ProcessEnvironment for all variables.

**`use: anObject during: aBlock`**

Set the value of this variable to anObject during the execution of
aBlock, then restore it.

**`value`**

Return the value of this variable in the current process.

**`value: anObject`**

Set the value of the current process's copy of the variable to be
anObject.

**`valueIfAbsent: aBlock`**

Return the value of this variable in the current process.

### 1.138 Promise

**Namespace:** Smalltalk · **Superclass:** [ValueHolder](#1205-valueholder) · **Category:** Language-Data types

I store my value in a variable, and know whether I have been
initialized or not.  If you ask for my value and I have not been
initialized, I suspend the process until a value has been assigned.

#### 1.138.1 Promise class: creating instances

**`for: aBlock`**

Invoke aBlock at an indeterminate time in an indeterminate process
before answering its value from #value sent to my result.

**`null`**

This method should not be called for instances of this class.

#### 1.138.2 Promise: accessing

**`hasError`**

Answer whether calling #value will raise an exception.

**`hasValue`**

Answer whether we already have a value (or calling #value will
raise an error).

**`value`**

Get the value of the receiver.

**`value: anObject`**

Set the value of the receiver.

#### 1.138.3 Promise: initializing

**`initialize`**

Private - set the initial state of the receiver

#### 1.138.4 Promise: printing

**`printOn: aStream`**

Print a representation of the receiver

#### 1.138.5 Promise: still unclassified

**`errorValue: anException`**

Private - Raise anException whenever #value is called.

### 1.139 Random

**Namespace:** Smalltalk · **Superclass:** [Stream](#1157-stream) · **Category:** Streams

My instances are generator streams that produce random numbers,
which are floating point values between 0 and 1.

#### 1.139.1 Random class: instance creation

**`new`**

Create a new random number generator whose seed is given by the
current time on the millisecond clock

**`seed: aFloat`**

Create a new random number generator whose seed is aFloat

#### 1.139.2 Random class: shortcuts

**`between: low and: high`**

Return a random integer between the given extrema

**`next`**

Return a random number between 0 and 1 (excluded)

**`source`**

Return a standard source of random numbers.

#### 1.139.3 Random: basic

**`atEnd`**

This stream never ends.  Always answer false.

**`between: low and: high`**

Return a random integer between low and high.

**`next`**

Return the next random number in the sequence.

**`nextPut: value`**

This method should not be called for instances of this class.

#### 1.139.4 Random: testing

**`chiSquare`**

Compute the chi-square of the random that this class generates.

**`chiSquare: n range: r`**

Return the chi-square deduced from calculating n random numbers in
the 0..r range.

### 1.140 ReadStream

**Namespace:** Smalltalk · **Superclass:** [PositionableStream](#1133-positionablestream) · **Category:** Streams-Collections

I implement the set of read-only stream objects.  You may read from
my objects, but you may not write to them.

#### 1.140.1 ReadStream class: instance creation

**`on: aCollection`**

Answer a new stream working on aCollection from its start.

**`on: aCollection from: firstIndex to: lastIndex`**

Answer an instance of the receiver streaming from the firstIndex-th
item of aCollection to the lastIndex-th

### 1.141 ReadWriteStream

**Namespace:** Smalltalk · **Superclass:** [WriteStream](#1223-writestream) · **Category:** Streams-Collections

I am the class of streams that may be read and written from
simultaneously.  In some sense, I am the best of both ReadStream
and WriteStream.

#### 1.141.1 ReadWriteStream class: instance creation

**`on: aCollection`**

Answer a new stream working on aCollection from its start.  The
stream starts at the front of aCollection.

**`on: aCollection from: firstIndex to: lastIndex`**

Answer an instance of the receiver streaming from the firstIndex-th
item of aCollection to the lastIndex-th

**`with: aCollection`**

Answer a new instance of the receiver which streams from the end of
aCollection.

#### 1.141.2 ReadWriteStream: positioning

**`contents`**

Unlike WriteStreams, ReadWriteStreams return the whole contents of
the underlying collection.

### 1.142 Rectangle

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Data types

Beginning of the Rectangle class for simple display manipulation.
Rectangles require the Point class to be available.  An extension
to the Point class is made here that since it requires Rectangles
to be defined (see converting)

#### 1.142.1 Rectangle class: instance creation

**`left: leftNumber right: rightNumber top: topNumber bottom: bottomNumber`**

Answer a rectangle with the given coordinates

**`left: leftNumber top: topNumber right: rightNumber bottom: bottomNumber`**

Answer a rectangle with the given coordinates

**`new`**

Answer the (0 @ 0 corner: 0 @ 0) rectangle

**`origin: originPoint corner: cornerPoint`**

Answer a rectangle with the given corners

**`origin: originPoint extent: extentPoint`**

Answer a rectangle with the given origin and size

#### 1.142.2 Rectangle: accessing

**`bottom`**

Answer the corner's y of the receiver

**`bottom: aNumber`**

Set the corner's y of the receiver

**`bottomCenter`**

Answer the center of the receiver's bottom side

**`bottomLeft`**

Answer the bottom-left corner of the receiver

**`bottomLeft: aPoint`**

Answer the receiver with the bottom-left changed to aPoint

**`bottomRight`**

Answer the bottom-right corner of the receiver

**`bottomRight: aPoint`**

Change the bottom-right corner of the receiver

**`center`**

Answer the center of the receiver

**`corner`**

Answer the corner of the receiver

**`corner: aPoint`**

Set the corner of the receiver

**`extent`**

Answer the extent of the receiver

**`extent: aPoint`**

Change the size of the receiver, keeping the origin the same

**`height`**

Answer the height of the receiver

**`height: aNumber`**

Set the height of the receiver

**`left`**

Answer the x of the left edge of the receiver

**`left: aValue`**

Set the x of the left edge of the receiver

**`left: l top: t right: r bottom: b`**

Change all four the coordinates of the receiver's corners

**`leftCenter`**

Answer the center of the receiver's left side

**`origin`**

Answer the top-left corner of the receiver

**`origin: aPoint`**

Change the top-left corner of the receiver to aPoint

**`origin: pnt1 corner: pnt2`**

Change both the origin (top-left corner) and the corner
(bottom-right corner) of the receiver

**`origin: pnt1 extent: pnt2`**

Change the top-left corner and the size of the receiver

**`right`**

Answer the x of the bottom-right corner of the receiver

**`right: aNumber`**

Change the x of the bottom-right corner of the receiver

**`rightCenter`**

Answer the center of the receiver's right side

**`top`**

Answer the y of the receiver's top-left corner

**`top: aValue`**

Change the y of the receiver's top-left corner

**`topCenter`**

Answer the center of the receiver's top side

**`topLeft`**

Answer the receiver's top-left corner

**`topLeft: aPoint`**

Change the receiver's top-left corner's coordinates to aPoint

**`topRight`**

Answer the receiver's top-right corner

**`topRight: aPoint`**

Change the receiver's top-right corner to aPoint

**`width`**

Answer the receiver's width

**`width: aNumber`**

Change the receiver's width to aNumber

#### 1.142.3 Rectangle: copying

**`copy`**

Return a deep copy of the receiver for safety.

#### 1.142.4 Rectangle: printing

**`printOn: aStream`**

Print a representation of the receiver on aStream

**`storeOn: aStream`**

Store Smalltalk code compiling to the receiver on aStream

#### 1.142.5 Rectangle: rectangle functions

**`amountToTranslateWithin: aRectangle`**

Answer a Point so that if aRectangle is translated by that point,
its origin lies within the receiver's.

**`area`**

Answer the receiver's area.  The area is the width times the
height, so it is possible for it to be negative if the rectangle is
not normalized.

**`areasOutside: aRectangle`**

Answer a collection of rectangles containing the parts of the
receiver outside of aRectangle.  For all points in the receiver,
but outside aRectangle, exactly one rectangle in the collection
will contain that point.

**`expandBy: delta`**

Answer a new rectangle that is the receiver expanded by aValue: if
aValue is a rectangle, calculate origin=origin-aValue origin,
corner=corner+aValue corner; else calculate origin=origin-aValue,
corner=corner+aValue.

**`insetBy: delta`**

Answer a new rectangle that is the receiver inset by aValue: if
aValue is a rectangle, calculate origin=origin+aValue origin,
corner=corner-aValue corner; else calculate origin=origin+aValue,
corner=corner-aValue.

**`insetOriginBy: originDelta corner: cornerDelta`**

Answer a new rectangle that is the receiver inset so that
origin=origin+originDelta, corner=corner-cornerDelta.  The deltas
can be points or numbers

**`intersect: aRectangle`**

Answers the rectangle (if any) created by the overlap of rectangles
A and B. Answers nil if the rectangles do not overlap

**`merge: aRectangle`**

Answer a new rectangle which is the smallest rectangle containing
both the receiver and aRectangle.

**`translatedToBeWithin: aRectangle`**

Answer a copy of the receiver that does not extend beyond
aRectangle.

#### 1.142.6 Rectangle: testing

**`= aRectangle`**

Answer whether the receiver is equal to aRectangle

**`contains: aRectangle`**

Answer true if the receiver contains (see containsPoint:) both
aRectangle's origin and aRectangle's corner

**`containsPoint: aPoint`**

Answer true if aPoint is equal to, or below and to the right of,
the receiver's origin; and aPoint is above and to the left of the
receiver's corner

**`hash`**

Answer an hash value for the receiver

**`intersects: aRectangle`**

Answer true if the receiver intersect aRectangle, i.e.  if it
contains (see containsPoint:) any of aRectangle corners or if
aRectangle contains the receiver

#### 1.142.7 Rectangle: transforming

**`moveBy: aPoint`**

Change the receiver so that the origin and corner are shifted by
aPoint

**`moveTo: aPoint`**

Change the receiver so that the origin moves to aPoint and the size
remains unchanged

**`scaleBy: scale`**

Answer a copy of the receiver in which the origin and corner are
multiplied by scale

**`translateBy: factor`**

Answer a copy of the receiver in which the origin and corner are
shifted by aPoint

#### 1.142.8 Rectangle: truncation and round off

**`rounded`**

Answer a copy of the receiver with the coordinates rounded to the
nearest integers

### 1.143 RecursionLock

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Processes

#### 1.143.1 RecursionLock class: instance creation

**`new`**

Answer a new semaphore

#### 1.143.2 RecursionLock: accessing

**`isOwnerProcess`**

Answer whether the receiver is the owner of the lock.

**`name`**

Answer a user-defined name for the lock.

**`name: aString`**

Set to aString the user-defined name for the lock.

**`waitingProcesses`**

Answer the set of processes that are waiting on the semaphore.

**`wouldBlock`**

Answer whether sending #wait to the receiver would suspend the
active process.

#### 1.143.3 RecursionLock: mutual exclusion

**`critical: aBlock`**

Wait for the receiver to be free, execute aBlock and signal the
receiver again.  Return the result of evaluating aBlock.

#### 1.143.4 RecursionLock: printing

**`printOn: aStream`**

Print a human-readable represention of the receiver on aStream.

### 1.144 Regex

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Collections-Text

A Regex is a read-only string for which the regular expression
matcher can cache a compiled representation, thus speeding up
matching.  Regex objects are constructed automatically by methods
that expect to match many times the same regular expression, but
can also be constructed explicitly sending #asRegex to a String or
Symbol.

Creation of Regex objects inside a loop is of course slower than
creating them outside the loop, but special care is taken so that
the same Regex object is used whenever possible (when converting
Strings to Regex, the cache is sought for an equivalent, already
constructed Regex).

#### 1.144.1 Regex class: instance creation

**`fromString: aString`**

Like 'aString asRegex'.

**`new`**

Do not send this message.

#### 1.144.2 Regex: basic

**`at: anIndex put: anObject`**

Fail.  Regex objects are read-only.

**`copy`**

Answer the receiver; instances of Regex are identity objects
because their only purpose is to ease caching, and we obtain better
caching if we avoid copying Regex objects

#### 1.144.3 Regex: conversion

**`asRegex`**

Answer the receiver, which \*is\* a Regex!

**`asString`**

Answer the receiver, converted back to a String

**`species`**

Answer 'String'.

#### 1.144.4 Regex: printing

**`displayOn: aStream`**

Print a represention of the receiver on aStream.  For most objects
this is simply its #printOn: representation, but for strings and
characters, superfluous dollars or extra pairs of quotes are
stripped.

**`displayString`**

Answer a String representing the receiver.  For most objects this
is simply its #printString, but for strings and characters,
superfluous dollars or extra pair of quotes are stripped.

**`printOn: aStream`**

Print a represention of the receiver on aStream.

### 1.145 RegexResults

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Collections-Text

I hold the results of a regular expression match, and I can
reconstruct which parts of the matched string were assigned to each
subexpression.  Methods such as #=\~ return RegexResults objects,
while others transform the string directly without passing the
results object back to the caller.

#### 1.145.1 RegexResults: accessing

**`asArray`**

If the regular expression was matched, return an Array with the
subexpressions that were present in the regular expression.

**`at: anIndex`**

If the regular expression was matched, return the text of the
anIndex-th subexpression in the successful match.

**`from`**

If the regular expression was matched, return the index of the
first character in the successful match.

**`fromAt: anIndex`**

If the regular expression was matched, return the index of the
first character of the anIndex-th subexpression in the successful
match.

**`intervalAt: anIndex`**

If the regular expression was matched, return an Interval for the
range of indices in the anIndex-th subexpression of the successful
match.

**`match`**

If the regular expression was matched, return the text of the
successful match.

**`matchInterval`**

If the regular expression was matched, return an Interval for the
range of indices of the successful match.

**`size`**

If the regular expression was matched, return the number of
subexpressions that were present in the regular expression.

**`subject`**

If the regular expression was matched, return the text that was
matched against it.

**`to`**

If the regular expression was matched, return the index of the last
character in the successful match.

**`toAt: anIndex`**

If the regular expression was matched, return the index of the last
character of the anIndex-th subexpression in the successful match.

#### 1.145.2 RegexResults: testing

**`ifMatched: oneArgBlock`**

If the regular expression was matched, pass the receiver to
oneArgBlock and return its result.  Otherwise, return nil.

**`ifMatched: oneArgBlock ifNotMatched: zeroArgBlock`**

If the regular expression was matched, evaluate oneArgBlock with
the receiver as the argument.  If it was not, evaluate
zeroArgBlock.  Answer the result of the block's evaluation.

**`ifNotMatched: zeroArgBlock`**

If the regular expression was matched, return the receiver.  If it
was not, evaluate zeroArgBlock and return its result.

**`ifNotMatched: zeroArgBlock ifMatched: oneArgBlock`**

If the regular expression was matched, evaluate oneArgBlock with
the receiver as the argument.  If it was not, evaluate
zeroArgBlock.  Answer the result of the block's evaluation.

**`matched`**

Answer whether the regular expression was matched

### 1.146 RootNamespace

**Namespace:** Smalltalk · **Superclass:** [AbstractNamespace](#11-abstractnamespace) · **Category:** Language-Implementation

I am a special form of dictionary.  Classes hold on an instance of
me; it is called their 'environment'.

#### 1.146.1 RootNamespace class: instance creation

**`new: spaceName`**

Create a new root namespace with the given name, and add to
Smalltalk a key that references it.

#### 1.146.2 RootNamespace: namespace hierarchy

**`siblings`**

Answer all the other root namespaces

**`siblingsDo: aBlock`**

Evaluate aBlock once for each of the other root namespaces, passing
the namespace as a parameter.

#### 1.146.3 RootNamespace: overrides for superspaces

**`inheritedKeys`**

Answer a Set of all the keys in the receiver and its superspaces

**`set: key to: newValue ifAbsent: aBlock`**

Assign newValue to the variable named as specified by 'key'.  This
method won't define a new variable; instead if the key is not found
it will search in superspaces and evaluate aBlock if it is not
found.  Answer newValue.

#### 1.146.4 RootNamespace: printing

**`nameIn: aNamespace`**

Answer Smalltalk code compiling to the receiver when the current
namespace is aNamespace

**`printOn: aStream in: aNamespace`**

Print on aStream some Smalltalk code compiling to the receiver when
the current namespace is aNamespace

**`storeOn: aStream`**

Store Smalltalk code compiling to the receiver

### 1.147 RunArray

**Namespace:** Smalltalk · **Superclass:** [OrderedCollection](#1126-orderedcollection) · **Category:** Collections-Sequenceable

My instances are OrderedCollections that automatically apply Run
Length Encoding compression to the things they store.  Be careful
when using me: I can provide great space savings, but my instances
don't grant linear access time.  RunArray's behavior currently is
similar to that of OrderedCollection (you can add elements to
RunArrays); maybe it should behave like an ArrayedCollection.

#### 1.147.1 RunArray class: instance creation

**`new`**

Answer an empty RunArray

**`new: aSize`**

Answer a RunArray with space for aSize runs

#### 1.147.2 RunArray: accessing

**`at: anIndex`**

Answer the element at index anIndex

**`at: anIndex put: anObject`**

Replace the element at index anIndex with anObject and answer
anObject

#### 1.147.3 RunArray: adding

**`add: anObject afterIndex: anIndex`**

Add anObject after the element at index anIndex

**`addAll: aCollection afterIndex: anIndex`**

Add all the elements of aCollection after the one at index anIndex.
If aCollection is unordered, its elements could be added in an
order which is not the #do: order

**`addAllFirst: aCollection`**

Add all the elements of aCollection at the beginning of the
receiver.  If aCollection is unordered, its elements could be added
in an order which is not the #do: order

**`addAllLast: aCollection`**

Add all the elements of aCollection at the end of the receiver.  If
aCollection is unordered, its elements could be added in an order
which is not the #do: order

**`addFirst: anObject`**

Add anObject at the beginning of the receiver.  Watch out: this
operation can cause serious performance pitfalls

**`addLast: anObject`**

Add anObject at the end of the receiver

#### 1.147.4 RunArray: basic

**`first`**

Answer the first element in the receiver

**`last`**

Answer the last element of the receiver

**`size`**

Answer the number of elements in the receiver

#### 1.147.5 RunArray: copying

**`deepCopy`**

Answer a copy of the receiver containing copies of the receiver's
elements (#copy is used to obtain them)

**`shallowCopy`**

Answer a copy of the receiver.  The elements are not copied

#### 1.147.6 RunArray: enumerating

**`do: aBlock`**

Enumerate all the objects in the receiver, passing each one to
aBlock

**`objectsAndRunLengthsDo: aBlock`**

Enumerate all the runs in the receiver, passing to aBlock two
parameters for every run: the first is the repeated object, the
second is the number of copies

#### 1.147.7 RunArray: removing

**`removeAtIndex: anIndex`**

Remove the object at index anIndex from the receiver and answer the
removed object

**`removeFirst`**

Remove the first object from the receiver and answer the removed
object

**`removeLast`**

Remove the last object from the receiver and answer the removed
object

#### 1.147.8 RunArray: searching

**`indexOf: anObject startingAt: anIndex ifAbsent: aBlock`**

Answer the index of the first copy of anObject in the receiver,
starting the search at the element at index anIndex.  If no equal
object is found, answer the result of evaluating aBlock

#### 1.147.9 RunArray: testing

**`= anObject`**

Answer true if the receiver is equal to anObject

**`hash`**

Answer an hash value for the receiver

### 1.148 ScaledDecimal

**Namespace:** Smalltalk · **Superclass:** [Number](#1122-number) · **Category:** Language-Data types

ScaledDecimal provides a numeric representation of fixed point
decimal numbers able to accurately represent decimal fractions.  It
supports unbounded precision, with no limit to the number of digits
before and after the decimal point.

#### 1.148.1 ScaledDecimal class: instance creation

**`newFromNumber: aNumber scale: scale`**

Answer a new instance of ScaledDecimal, representing a decimal
fraction with a decimal representation considered valid up to the
scale-th digit.

#### 1.148.2 ScaledDecimal: arithmetic

**`* aNumber`**

Multiply two numbers and answer the result.

**`+ aNumber`**

Sum two numbers and answer the result.

**`- aNumber`**

Subtract aNumber from the receiver and answer the result.

**`/ aNumber`**

Divide two numbers and answer the result.

**`// aNumber`**

Answer the integer quotient after dividing the receiver by aNumber
with truncation towards negative infinity.

**`\\ aNumber`**

Answer the remainder after integer division the receiver by aNumber
with truncation towards negative infinity.

#### 1.148.3 ScaledDecimal: coercion

**`asCNumber`**

Convert the receiver to a kind of number that is understood by the
C call-out mechanism.

**`asFloatD`**

Answer the receiver, converted to a FloatD

**`asFloatE`**

Answer the receiver, converted to a FloatE

**`asFloatQ`**

Answer the receiver, converted to a FloatQ

**`asFraction`**

Answer the receiver, converted to a Fraction

**`ceiling`**

Answer the receiver, converted to an Integer and truncated towards
\+infinity.

**`coerce: aNumber`**

Answer aNumber, converted to a ScaledDecimal with the same scale as
the receiver.

**`fractionPart`**

Answer the fractional part of the receiver.

**`generality`**

Return the receiver's generality

**`integerPart`**

Answer the fractional part of the receiver.

**`truncated`**

Answer the receiver, converted to an Integer and truncated towards
\-infinity.

#### 1.148.4 ScaledDecimal: comparing

**`< aNumber`**

Answer whether the receiver is less than arg.

**`<= aNumber`**

Answer whether the receiver is less than or equal to arg.

**`= arg`**

Answer whether the receiver is equal to arg.

**`> aNumber`**

Answer whether the receiver is greater than arg.

**`>= aNumber`**

Answer whether the receiver is greater than or equal to arg.

**`hash`**

Answer an hash value for the receiver.

**`~= arg`**

Answer whether the receiver is not equal arg.

#### 1.148.5 ScaledDecimal: constants

**`one`**

Answer the receiver's representation of one.

**`zero`**

Answer the receiver's representation of zero.

#### 1.148.6 ScaledDecimal: printing

**`displayOn: aStream`**

Print a representation of the receiver on aStream, intended to be
directed to a user.  In this particular case, the 'scale' part of
the #printString is not emitted.

**`printOn: aStream`**

Print a representation of the receiver on aStream.

#### 1.148.7 ScaledDecimal: storing

**`isLiteralObject`**

Answer whether the receiver is expressible as a Smalltalk literal.

**`storeLiteralOn: aStream`**

Store on aStream some Smalltalk code which compiles to the receiver

**`storeOn: aStream`**

Print Smalltalk code that compiles to the receiver on aStream.

### 1.149 SecurityPolicy

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Security

I am the class that represents which operations that could harm the
system's security are allowed or denied to a particular class.  If
a class does not have a policy, it is allowed everything if it is
trusted, and denied everything if it is untrusted

#### 1.149.1 SecurityPolicy: modifying

**`addPermission: aPermission`**

Not commented.

**`owner: aClass`**

Not commented.

**`removePermission: aPermission`**

Not commented.

**`withOwner: aClass`**

Not commented.

#### 1.149.2 SecurityPolicy: querying

**`check: aPermission`**

Not commented.

**`implies: aPermission`**

Not commented.

### 1.150 Semaphore

**Namespace:** Smalltalk · **Superclass:** [LinkedList](#1104-linkedlist) · **Category:** Language-Processes

My instances represent counting semaphores.  I provide methods for
signalling the semaphore's availability, and methods for waiting
for its availability.  I also provide some methods for implementing
critical sections.

#### 1.150.1 Semaphore class: instance creation

**`forMutualExclusion`**

Answer a new semaphore with a signal on it.  These semaphores are a
useful shortcut when you use semaphores as critical sections.

**`new`**

Answer a new semaphore

#### 1.150.2 Semaphore: accessing

**`name`**

Answer a user-friendly name for the receiver

**`name: aString`**

Answer a user-friendly name for the receiver

**`waitingProcesses`**

Answer an Array of processes currently waiting on the receiver.

**`wouldBlock`**

Answer whether waiting on the receiver would suspend the current
process.

#### 1.150.3 Semaphore: builtins

**`lock`**

Without putting the receiver to sleep, force processes that try to
wait on the semaphore to block.  Answer whether this was the case
even before.

**`notify`**

Resume one of the processes that were waiting on the semaphore if
there were any.  Do not leave a signal on the semaphore if no
process is waiting.

**`notifyAll`**

Resume all the processes that were waiting on the semaphore if
there were any.  Do not leave a signal on the semaphore if no
process is waiting.

**`signal`**

Signal the receiver, resuming a waiting process' if there is one

**`wait`**

Wait for the receiver to be signalled, suspending the executing
process if it is not yet.  Return nil if the wait was interrupted,
the receiver otherwise.

**`waitAfterSignalling: aSemaphore`**

Signal aSemaphore then, atomically, wait for the receiver to be
signalled, suspending the executing process if it is not yet.  This
is needed to avoid race conditions when the #notify and #notifyAll
are used before waiting on receiver: otherwise, if a process sends
any of the two between the time aSemaphore is signaled and the time
the process starts waiting on the receiver, the notification is
lost.

#### 1.150.4 Semaphore: mutual exclusion

**`critical: aBlock`**

Wait for the receiver to be free, execute aBlock and signal the
receiver again.  Return the result of evaluating aBlock.

#### 1.150.5 Semaphore: printing

**`printOn: aStream`**

Print a human-readable represention of the receiver on aStream.

### 1.151 SequenceableCollection

**Namespace:** Smalltalk · **Superclass:** [Collection](#137-collection) · **Category:** Collections-Sequenceable

My instances represent collections of objects that are ordered.  I
provide some access and manipulation methods.

#### 1.151.1 SequenceableCollection class: instance creation

**`join: aCollection separatedBy: sepCollection`**

Where aCollection is a collection of SequenceableCollections,
answer a new instance with all the elements therein, in order, each
separated by an occurrence of sepCollection.

#### 1.151.2 SequenceableCollection: basic

**`after: oldObject`**

Return the element after oldObject.  Error if oldObject not found
or if no following object is available

**`allButFirst`**

Answer a copy of the receiver without the first object.

**`allButFirst: n`**

Answer a copy of the receiver without the first n objects.

**`allButLast`**

Answer a copy of the receiver without the last object.

**`allButLast: n`**

Answer a copy of the receiver without the last n objects.

**`at: anIndex ifAbsent: aBlock`**

Answer the anIndex-th item of the collection, or evaluate aBlock
and answer the result if the index is out of range

**`atAll: keyCollection`**

Answer a collection of the same kind returned by #collect:, that
only includes the values at the given indices.  Fail if any of the
values in keyCollection is out of bounds for the receiver.

**`atAll: aCollection put: anObject`**

Put anObject at every index contained in aCollection

**`atAllPut: anObject`**

Put anObject at every index in the receiver

**`atRandom`**

Return a random item of the receiver.

**`before: oldObject`**

Return the element before oldObject.  Error if oldObject not found
or if no preceding object is available

**`first`**

Answer the first item in the receiver

**`first: n`**

Answer the first n items in the receiver

**`fourth`**

Answer the fourth item in the receiver

**`identityIncludes: anObject`**

Answer whether we include the anObject object

**`identityIndexOf: anElement`**

Answer the index of the first occurrence of an object identical to
anElement in the receiver.  Answer 0 if no item is found

**`identityIndexOf: anElement ifAbsent: exceptionBlock`**

Answer the index of the first occurrence of an object identical to
anElement in the receiver.  Invoke exceptionBlock and answer its
result if no item is found

**`identityIndexOf: anElement startingAt: anIndex`**

Answer the first index \> anIndex which contains an object identical
to anElement.  Answer 0 if no item is found

**`identityIndexOf: anObject startingAt: anIndex ifAbsent: exceptionBlock`**

Answer the first index \> anIndex which contains an object exactly
identical to anObject.  Invoke exceptionBlock and answer its result
if no item is found

**`identityIndexOfLast: anElement ifAbsent: exceptionBlock`**

Answer the last index which contains an object identical to
anElement.  Invoke exceptionBlock and answer its result if no item
is found

**`includes: anObject`**

Answer whether we include anObject

**`indexOf: anElement`**

Answer the index of the first occurrence of anElement in the
receiver.  Answer 0 if no item is found

**`indexOf: anElement ifAbsent: exceptionBlock`**

Answer the index of the first occurrence of anElement in the
receiver.  Invoke exceptionBlock and answer its result if no item
is found

**`indexOf: anElement startingAt: anIndex`**

Answer the first index \> anIndex which contains anElement.  Answer
0 if no item is found

**`indexOf: anElement startingAt: anIndex ifAbsent: exceptionBlock`**

Answer the first index \> anIndex which contains anElement.  Invoke
exceptionBlock and answer its result if no item is found

**`indexOfLast: anElement ifAbsent: exceptionBlock`**

Answer the last index which contains anElement.  Invoke
exceptionBlock and answer its result if no item is found

**`indexOfSubCollection: aSubCollection`**

Answer the first index \> anIndex at which starts a sequence of
items matching aSubCollection.  Answer 0 if no such sequence is
found.

**`indexOfSubCollection: aSubCollection ifAbsent: exceptionBlock`**

Answer the first index \> anIndex at which starts a sequence of
items matching aSubCollection.  Answer 0 if no such sequence is
found.

**`indexOfSubCollection: aSubCollection startingAt: anIndex`**

Answer the first index \> anIndex at which starts a sequence of
items matching aSubCollection.  Answer 0 if no such sequence is
found.

**`indexOfSubCollection: aSubCollection startingAt: anIndex ifAbsent: exceptionBlock`**

Answer the first index \> anIndex at which starts a sequence of
items matching aSubCollection.  Invoke exceptionBlock and answer
its result if no such sequence is found

**`last`**

Answer the last item in the receiver

**`last: n`**

Answer the last n items in the receiver

**`second`**

Answer the second item in the receiver

**`third`**

Answer the third item in the receiver

#### 1.151.3 SequenceableCollection: comparing

**`endsWith: aSequenceableCollection`**

Returns true if the receiver ends with the same characters as
aSequenceableCollection.

**`startsWith: aSequenceableCollection`**

Returns true if the receiver starts with the same characters as
aSequenceableCollection.

#### 1.151.4 SequenceableCollection: concatenating

**`join: sepCollection`**

Answer a new collection like my first element, with all the
elements (in order) of all my elements (which should be
collections) separated by sepCollection.

I use my first element instead of myself as a prototype because my
elements are more likely to share the desired properties than I am,
such as in:

\#('hello,' 'world') join: ' ' =\> 'hello, world'

**`with: aSequenceableCollection`**

Return an Array with the same size as the receiver and
aSequenceableCollection, each element of which is a 2-element
Arrays including one element from the receiver and one from
aSequenceableCollection.

**`with: seqColl1 with: seqColl2`**

Return an Array with the same size as the receiver and the
arguments, each element of which is a 3-element Arrays including
one element from the receiver and one from each argument.

**`with: seqColl1 with: seqColl2 with: seqColl3`**

Return an Array with the same size as the receiver and the
arguments, each element of which is a 4-element Arrays including
one element from the receiver and one from each argument.

#### 1.151.5 SequenceableCollection: copying SequenceableCollections

**`copyAfter: anObject`**

Answer a new collection holding all the elements of the receiver
after the first occurrence of anObject, up to the last.

**`copyAfterLast: anObject`**

Answer a new collection holding all the elements of the receiver
after the last occurrence of anObject, up to the last.

**`copyFrom: start`**

Answer a new collection containing all the items in the receiver
from the start-th.

**`copyFrom: start to: stop`**

Answer a new collection containing all the items in the receiver
from the start-th and to the stop-th

**`copyReplaceAll: oldSubCollection with: newSubCollection`**

Answer a new collection in which all the sequences matching
oldSubCollection are replaced with newSubCollection

**`copyReplaceFrom: start to: stop with: replacementCollection`**

Answer a new collection of the same class as the receiver that
contains the same elements as the receiver, in the same order,
except for elements from index 'start' to index 'stop'.

If start \< stop, these are replaced by the contents of the
replacementCollection.  Instead, If start = (stop + 1), like in
'copyReplaceFrom: 4 to: 3 with: anArray', then every element of the
receiver will be present in the answered copy; the operation will
be an append if stop is equal to the size of the receiver or, if it
is not, an insert before index 'start'.

**`copyReplaceFrom: start to: stop withObject: anObject`**

Answer a new collection of the same class as the receiver that
contains the same elements as the receiver, in the same order,
except for elements from index 'start' to index 'stop'.

If start \< stop, these are replaced by stop-start+1 copies of
anObject.  Instead, If start = (stop + 1), then every element of
the receiver will be present in the answered copy; the operation
will be an append if stop is equal to the size of the receiver or,
if it is not, an insert before index 'start'.

**`copyUpTo: anObject`**

Answer a new collection holding all the elements of the receiver
from the first up to the first occurrence of anObject, excluded.

**`copyUpToLast: anObject`**

Answer a new collection holding all the elements of the receiver
from the first up to the last occurrence of anObject, excluded.

**`copyWithFirst: anObject`**

Answer a new collection holding all the elements of the receiver
after the first occurrence of anObject, up to the last.

#### 1.151.6 SequenceableCollection: enumerating

**`anyOne`**

Answer an unspecified element of the collection.

**`do: aBlock`**

Evaluate aBlock for all the elements in the sequenceable collection

**`do: aBlock separatedBy: sepBlock`**

Evaluate aBlock for all the elements in the sequenceable
collection.  Between each element, evaluate sepBlock without
parameters.

**`doWithIndex: aBlock`**

Evaluate aBlock for all the elements in the sequenceable
collection, passing the index of each element as the second
parameter.  This method is mantained for backwards compatibility
and is not mandated by the ANSI standard; use #keysAndValuesDo:

**`findFirst: aBlock`**

Returns the index of the first element of the sequenceable
collection for which aBlock returns true, or 0 if none

**`findLast: aBlock`**

Returns the index of the last element of the sequenceable
collection for which aBlock returns true, or 0 if none does

**`fold: binaryBlock`**

First, pass to binaryBlock the first and second elements of the
receiver; for each subsequent element, pass the result of the
previous evaluation and an element.  Answer the result of the last
invocation, or the first element if the collection has size 1.
Fail if the collection is empty.

**`from: startIndex to: stopIndex do: aBlock`**

Evaluate aBlock for all the elements in the sequenceable collection
whose indices are in the range index to stopIndex

**`from: startIndex to: stopIndex doWithIndex: aBlock`**

Evaluate aBlock for all the elements in the sequenceable collection
whose indices are in the range index to stopIndex, passing the
index of each element as the second parameter.  This method is
mantained for backwards compatibility and is not mandated by the
ANSI standard; use #from:to:keysAndValuesDo:

**`from: startIndex to: stopIndex keysAndValuesDo: aBlock`**

Evaluate aBlock for all the elements in the sequenceable collection
whose indices are in the range index to stopIndex, passing the
index of each element as the first parameter and the element as the
second.

**`keys`**

Return an Interval corresponding to the valid indices in the
receiver.

**`keysAndValuesDo: aBlock`**

Evaluate aBlock for all the elements in the sequenceable
collection, passing the index of each element as the first
parameter and the element as the second.

**`readStream`**

Answer a ReadStream streaming on the receiver

**`readWriteStream`**

Answer a ReadWriteStream which streams on the receiver

**`reverse`**

Answer the receivers' contents in reverse order

**`reverseDo: aBlock`**

Evaluate aBlock for all elements in the sequenceable collection,
from the last to the first.

**`with: aSequenceableCollection collect: aBlock`**

Evaluate aBlock for each pair of elements took respectively from
the receiver and from aSequenceableCollection; answer a collection
of the same kind of the receiver, made with the block's return
values.  Fail if the receiver has not the same size as
aSequenceableCollection.

**`with: aSequenceableCollection do: aBlock`**

Evaluate aBlock for each pair of elements took respectively from
the receiver and from aSequenceableCollection.  Fail if the
receiver has not the same size as aSequenceableCollection.

#### 1.151.7 SequenceableCollection: manipulation

**`swap: anIndex with: anotherIndex`**

Swap the item at index anIndex with the item at index another index

#### 1.151.8 SequenceableCollection: replacing items

**`replaceAll: anObject with: anotherObject`**

In the receiver, replace every occurrence of anObject with
anotherObject.

**`replaceFrom: start to: stop with: replacementCollection`**

Replace the items from start to stop with replacementCollection's
items from 1 to stop-start+1 (in unexpected order if the collection
is not sequenceable).

**`replaceFrom: start to: stop with: replacementCollection startingAt: repStart`**

Replace the items from start to stop with replacementCollection's
items from repStart to repStart+stop-start

**`replaceFrom: anIndex to: stopIndex withObject: replacementObject`**

Replace every item from start to stop with replacementObject.

#### 1.151.9 SequenceableCollection: sorting

**`sort`**

Sort the contents of the receiver according to the default sort
block, which uses #\<= to compare items.

**`sort: sortBlock`**

Sort the contents of the receiver according to the given sort
block, which accepts pair of items and returns true if the first
item is less than the second one.

**`sorted`**

Return a copy of the receiver sorted according to the default sort
block, which uses #\<= to compare items.

**`sorted: sortBlock`**

Return a copy of the receiver sorted according to the given sort
block, which accepts pair of items and returns true if the first
item is less than the second one.

#### 1.151.10 SequenceableCollection: still unclassified

**`nextPutAllOn: aStream`**

Write all the objects in the receiver to aStream

#### 1.151.11 SequenceableCollection: testing

**`= aCollection`**

Answer whether the receiver's items match those in aCollection

**`examineOn: aStream`**

Print all the instance variables and context of the receiver on
aStream

**`hash`**

Answer an hash value for the receiver

**`isSequenceable`**

Answer whether the receiver can be accessed by a numeric index with
\#at:/#at:put:.

#### 1.151.12 SequenceableCollection: testing collections

**`size`**

Answer a dummy size of 0, so that SequenceableCollection\>\>#do:
works.

### 1.152 Set

**Namespace:** Smalltalk · **Superclass:** [HashedCollection](#188-hashedcollection) · **Category:** Collections-Unordered

I am the typical set object; I also known how to do arithmetic on
my instances.

#### 1.152.1 Set: arithmetic

**`& aSet`**

Compute the set intersection of the receiver and aSet.

**`+ aSet`**

Compute the set union of the receiver and aSet.

**`- aSet`**

Compute the set difference of the receiver and aSet.

#### 1.152.2 Set: awful ST-80 compatibility hacks

**`findObjectIndex: object`**

Tries to see if anObject exists as an indexed variable.  As soon as
nil or anObject is found, the index of that slot is answered

#### 1.152.3 Set: comparing

**`< aSet`**

Answer whether the receiver is a strict subset of aSet

**`<= aSet`**

Answer whether the receiver is a subset of aSet

**`> aSet`**

Answer whether the receiver is a strict superset of aSet

**`>= aSet`**

Answer whether the receiver is a superset of aSet

### 1.153 SharedQueue

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Processes

My instances provide a guaranteed safe mechanism to allow for
communication between processes.  All access to the underlying data
structures is controlled with critical sections so that things
proceed smoothly.

#### 1.153.1 SharedQueue class: instance creation

**`new`**

Create a new instance of the receiver

**`sortBlock: sortBlock`**

Create a new instance of the receiver which implements a priority
queue with the given sort block

#### 1.153.2 SharedQueue: accessing

**`isEmpty`**

Answer whether there is an object on the queue

**`next`**

Wait for an object to be on the queue, then remove it and answer it

**`nextPut: value`**

Put value on the queue and answer it

**`peek`**

Wait for an object to be on the queue if necessary, then answer the
same object that #next would answer without removing it.

### 1.154 SingletonProxy

**Namespace:** Smalltalk · **Superclass:** [AlternativeObjectProxy](#12-alternativeobjectproxy) · **Category:** Streams-Files

I am a proxy that stores the class of an object rather than the
object itself, and pretends that a registered instance (which most
likely is a singleton instance of the stored class) was stored
instead.

#### 1.154.1 SingletonProxy class: accessing

**`acceptUsageForClass: aClass`**

The receiver was asked to be used as a proxy for the class aClass.
The registration is fine if the class is actually a singleton.

#### 1.154.2 SingletonProxy class: instance creation

**`on: anObject`**

Answer a proxy to be used to save anObject.  The proxy stores the
class and restores the object by looking into a dictionary of class
\-\> singleton objects.

#### 1.154.3 SingletonProxy: saving and restoring

**`object`**

Reconstruct the object stored in the proxy and answer it; the
binaryRepresentationObject is sent the #reconstructOriginalObject
message, and the resulting object is sent the #postLoad message.

### 1.155 SmallInteger

**Namespace:** Smalltalk · **Superclass:** [Integer](#192-integer) · **Category:** Language-Data types

I am the integer class of the GNU Smalltalk system.  My instances
can represent signed 30 bit integers and are as efficient as
possible.

#### 1.155.1 SmallInteger class: getting limits

**`bits`**

Answer the number of bits (excluding the sign) that can be
represented directly in an object pointer

**`largest`**

Answer the largest integer represented directly in an object
pointer

**`smallest`**

Answer the smallest integer represented directly in an object
pointer

#### 1.155.2 SmallInteger class: testing

**`isIdentity`**

Answer whether x = y implies x == y for instances of the receiver

#### 1.155.3 SmallInteger: bit arithmetic

**`highBit`**

Return the index of the highest order 1 bit of the receiver

**`lowBit`**

Return the index of the lowest order 1 bit of the receiver.

#### 1.155.4 SmallInteger: built ins

**`* arg`**

Multiply the receiver and arg and answer another Number

**`+ arg`**

Sum the receiver and arg and answer another Number

**`- arg`**

Subtract arg from the receiver and answer another Number

**`/ arg`**

Divide the receiver by arg and answer another Integer or Fraction

**`// arg`**

Dividing receiver by arg (with truncation towards -infinity) and
answer the result

**`< arg`**

Answer whether the receiver is less than arg

**`<= arg`**

Answer whether the receiver is less than or equal to arg

**`= arg`**

Answer whether the receiver is equal to arg

**`== arg`**

Answer whether the receiver is the same object as arg

**`> arg`**

Answer whether the receiver is greater than arg

**`>= arg`**

Answer whether the receiver is greater than or equal to arg

**`\\ arg`**

Calculate the remainder of dividing receiver by arg (with
truncation towards -infinity) and answer it

**`asFloatD`**

Convert the receiver to a FloatD, answer the result

**`asFloatE`**

Convert the receiver to a FloatE, answer the result

**`asFloatQ`**

Convert the receiver to a FloatQ, answer the result

**`asObject`**

Answer the object whose index is in the receiver, nil if there is a
free object, fail if index is out of bounds

**`asObjectNoFail`**

Answer the object whose index is in the receiver, or nil if no
object is found at that index

**`bitAnd: arg`**

Do a bitwise AND between the receiver and arg, answer the result

**`bitOr: arg`**

Do a bitwise OR between the receiver and arg, answer the result

**`bitShift: arg`**

Shift the receiver by arg places to the left if arg \> 0, by arg
places to the right if arg \< 0, answer another Number

**`bitXor: arg`**

Do a bitwise XOR between the receiver and arg, answer the result

**`divExact: arg`**

Dividing receiver by arg assuming that the remainder is zero, and
answer the result

**`nextValidOop`**

Answer the index of the first non-free OOP after the receiver.
This is used internally; it is placed here to avoid polluting
Object.

**`quo: arg`**

Dividing receiver by arg (with truncation towards zero) and answer
the result

**`~= arg`**

Answer whether the receiver is not equal to arg

**`~~ arg`**

Answer whether the receiver is not the same object as arg

#### 1.155.5 SmallInteger: builtins

**`at: anIndex`**

Answer the index-th indexed instance variable of the receiver.
This method always fails.

**`at: anIndex put: value`**

Store value in the index-th indexed instance variable of the
receiver This method always fails.

**`basicAt: anIndex`**

Answer the index-th indexed instance variable of the receiver.
This method always fails.

**`basicAt: anIndex put: value`**

Store value in the index-th indexed instance variable of the
receiver This method always fails.

**`scramble`**

Answer the receiver with its bits mixed and matched.

#### 1.155.6 SmallInteger: coercion

**`asCNumber`**

Convert the receiver to a kind of number that is understood by the
C call-out mechanism.

#### 1.155.7 SmallInteger: coercion methods

**`generality`**

Return the receiver's generality

**`unity`**

Coerce 1 to the receiver's class

**`zero`**

Coerce 0 to the receiver's class

#### 1.155.8 SmallInteger: testing functionality

**`isSmallInteger`**

Answer 'true'.

### 1.156 SortedCollection

**Namespace:** Smalltalk · **Superclass:** [OrderedCollection](#1126-orderedcollection) · **Category:** Collections-Sequenceable

I am a collection of objects, stored and accessed according to some
sorting criteria.  I store things using heap sort and quick sort.
My instances have a comparison block associated with them; this
block takes two arguments and is a predicate which returns true if
the first argument should be sorted earlier than the second.  The
default block is \[ :a :b \| a \<= b \], but I will accept any block
that conforms to the above criteria - actually any object which
responds to #value:value:.

#### 1.156.1 SortedCollection class: hacking

**`defaultSortBlock`**

Answer a default sort block for the receiver.

#### 1.156.2 SortedCollection class: instance creation

**`new`**

Answer a new collection with a default size and sort block

**`new: aSize`**

Answer a new collection with a default sort block and the given
size

**`sortBlock: aSortBlock`**

Answer a new collection with a default size and the given sort
block

#### 1.156.3 SortedCollection: basic

**`last`**

Answer the last item of the receiver

**`removeLast`**

Remove an object from the end of the receiver.  Fail if the
receiver is empty

**`sortBlock`**

Answer the receiver's sort criteria

**`sortBlock: aSortBlock`**

Change the sort criteria for a sorted collection, resort the
elements of the collection, and return it.

#### 1.156.4 SortedCollection: copying

**`copyEmpty: newSize`**

Answer an empty copy of the receiver, with the same sort block as
the receiver

#### 1.156.5 SortedCollection: disabled

**`add: anObject afterIndex: i`**

This method should not be called for instances of this class.

**`addAll: aCollection afterIndex: i`**

This method should not be called for instances of this class.

**`addAllFirst: aCollection`**

This method should not be called for instances of this class.

**`addAllLast: aCollection`**

This method should not be called for instances of this class.

**`addFirst: anObject`**

This method should not be called for instances of this class.

**`addLast: anObject`**

This method should not be called for instances of this class.

**`at: index put: anObject`**

This method should not be called for instances of this class.

#### 1.156.6 SortedCollection: enumerating

**`beConsistent`**

Prepare the receiver to be walked through with #do: or another
enumeration method.

#### 1.156.7 SortedCollection: saving and loading

**`postLoad`**

Restore the default sortBlock if it is nil

**`preStore`**

Store the default sortBlock as nil

#### 1.156.8 SortedCollection: searching

**`includes: anObject`**

Private - Answer whether the receiver includes an item which is
equal to anObject

**`indexOf: anObject startingAt: index ifAbsent: aBlock`**

Answer the first index \> anIndex which contains anElement.  Invoke
exceptionBlock and answer its result if no item is found

**`occurrencesOf: anObject`**

Answer how many occurrences of anObject can be found in the
receiver

#### 1.156.9 SortedCollection: sorting

**`sort`**

Sort the contents of the receiver according to the given sort
block, which accepts pair of items and returns true if the first
item is less than the second one.  Fails if the collections's sort
block is not the same as the default sort block.

**`sort: sortBlock`**

Sort the contents of the receiver according to the given sort
block, which accepts pair of items and returns true if the first
item is less than the second one.  Fails if the sort block is not
the same as the collection's sort block.

### 1.157 Stream

**Namespace:** Smalltalk · **Superclass:** [Iterable](#194-iterable) · **Category:** Streams

I am an abstract class that provides interruptable sequential
access to objects.  I can return successive objects from a source,
or accept successive objects and store them sequentially on a sink.
I provide some simple iteration over the contents of one of my
instances, and provide for writing collections sequentially.

#### 1.157.1 Stream: accessing-reading

**`contents`**

Answer the whole contents of the receiver, from the next object to
the last

**`file`**

Return nil by default; not all streams have a file.

**`name`**

Return nil by default; not all streams have a name.

**`next`**

Return the next object in the receiver

**`next: anInteger`**

Return the next anInteger objects in the receiver

**`nextAvailable: anInteger`**

Return up to anInteger objects in the receiver.  Besides stopping
if the end of the stream is reached, this may return less than this
number of bytes for various reasons.  For example, on files and
sockets this operation could be non-blocking, or could do at most
one I/O operation.

**`nextAvailable: anInteger into: aCollection startingAt: pos`**

Place the next anInteger objects from the receiver into
aCollection, starting at position pos.  Return the number of items
stored.  Besides stopping if the end of the stream is reached, this
may return less than this number of bytes for various reasons.  For
example, on files and sockets this operation could be non-blocking,
or could do at most one I/O operation.

**`nextAvailable: anInteger putAllOn: aStream`**

Copy up to anInteger objects in the receiver to aStream.  Besides
stopping if the end of the stream is reached, this may return less
than this number of bytes for various reasons.  For example, on
files and sockets this operation could be non-blocking, or could do
at most one I/O operation.

**`nextLine`**

Returns a collection of the same type that the stream accesses,
containing the next line up to the next new-line character.
Returns the entire rest of the stream's contents if no new-line
character is found.

**`nextMatchFor: anObject`**

Answer whether the next object is equal to anObject.  Even if it
does not, anObject is lost

**`splitAt: anObject`**

Answer an OrderedCollection of parts of the receiver.  A new
(possibly empty) part starts at the start of the receiver, or after
every occurrence of an object which is equal to anObject (as
compared by #=).

**`upTo: anObject`**

Returns a collection of the same type that the stream accesses, up
to but not including the object anObject.  Returns the entire rest
of the stream's contents if anObject is not present.

**`upToAll: aCollection`**

If there is a sequence of objects remaining in the stream that is
equal to the sequence in aCollection, set the stream position just
past that sequence and answer the elements up to, but not
including, the sequence.  Else, set the stream position to its end
and answer all the remaining elements.

**`upToEnd`**

Answer every item in the collection on which the receiver is
streaming, from the next one to the last

#### 1.157.2 Stream: accessing-writing

**`next: anInteger put: anObject`**

Write anInteger copies of anObject to the receiver

**`next: n putAll: aCollection startingAt: start`**

Write n objects to the stream, reading them from aCollection and
starting at the start-th item.

**`nextPut: anObject`**

Write anObject to the receiver

**`nextPutAll: aCollection`**

Write all the objects in aCollection to the receiver

**`nextPutAllFlush: aCollection`**

Put all the elements of aCollection in the stream, then flush the
buffers if supported by the stream.

#### 1.157.3 Stream: basic

**`species`**

Answer 'Array'.

#### 1.157.4 Stream: buffering

**`next: anInteger into: answer startingAt: pos`**

Read up to anInteger bytes from the stream and store them into
answer.  Return the number of bytes that were read, raising an
exception if we could not read the full amount of data.

**`next: anInteger putAllOn: aStream`**

Read up to anInteger bytes from the stream and store them into
aStream.  Return the number of bytes that were read, raising an
exception if we could not read the full amount of data.

#### 1.157.5 Stream: built ins

**`fileIn`**

File in the contents of the receiver.  During a file in operation,
global variables (starting with an uppercase letter) that are not
declared don't yield an 'unknown variable' error.  Instead, they
are defined as nil in the 'Undeclared' dictionary (a global
variable residing in Smalltalk).  As soon as you add the variable
to a namespace (for example by creating a class) the Association
will be removed from Undeclared and reused in the namespace, so
that the old references will automagically point to the new value.

**`fileInLine: lineNum file: aFile at: charPosInt`**

Private - Much like a preprocessor #line directive; it is used
internally by #fileIn, and explicitly by the Emacs Smalltalk mode.

**`fileInLine: lineNum fileName: aString at: charPosInt`**

Private - Much like a preprocessor #line directive; it is used
internally by #fileIn, and explicitly by the Emacs Smalltalk mode.

#### 1.157.6 Stream: character writing

**`cr`**

Store a cr on the receiver

**`crTab`**

Store a cr and a tab on the receiver

**`encoding`**

Answer the encoding to be used when storing Unicode characters.

**`isUnicode`**

Answer whether the receiver is able to store Unicode characters.
Note that if this method returns true, the stream may or may not be
able to store Characters (as opposed to UnicodeCharacters) whose
value is above 127.

**`nl`**

Store a new line on the receiver

**`nlTab`**

Store a new line and a tab on the receiver

**`space`**

Store a space on the receiver

**`space: n`**

Store n spaces on the receiver

**`tab`**

Store a tab on the receiver

**`tab: n`**

Store n tabs on the receiver

#### 1.157.7 Stream: compiling

**`segmentFrom: startPos to: endPos`**

Answer an object that, when sent #asString, will yield the result
of sending 'copyFrom: startPos to: endPos' to the receiver

#### 1.157.8 Stream: concatenating

**`with: aStream`**

Return a new Stream whose elements are 2-element Arrays, including
one element from the receiver and one from aStream.

**`with: stream1 with: stream2`**

Return a new Stream whose elements are 3-element Arrays, including
one element from the receiver and one from each argument.

**`with: stream1 with: stream2 with: stream3`**

Return a new Stream whose elements are 3-element Arrays, including
one element from the receiver and one from each argument.

#### 1.157.9 Stream: enumerating

**`do: aBlock`**

Evaluate aBlock once for every object in the receiver

**`linesDo: aBlock`**

Evaluate aBlock once for every line in the receiver (assuming the
receiver is streaming on Characters).

#### 1.157.10 Stream: filing out

**`fileOut: aClass`**

File out aClass on the receiver.  If aClass is not a metaclass,
file out class and instance methods; if aClass is a metaclass, file
out only the class methods

#### 1.157.11 Stream: filtering

**`, anIterable`**

Answer a new stream that concatenates the data in the receiver with
the data in aStream.  Both the receiver and aStream should be
readable.

**`collect: aBlock`**

Answer a new stream that will pass the returned objects through
aBlock, and return whatever object is returned by aBlock instead.
Note that when peeking in the returned stream, the block will be
invoked multiple times, with possibly surprising results.

**`lines`**

Answer a new stream that answers lines from the receiver.

**`peek`**

Returns the next element of the stream without moving the pointer.
Returns nil when at end of stream.  Lookahead is implemented
automatically for streams that are not positionable but can be
copied.

**`peekFor: aCharacter`**

Returns true and gobbles the next element from the stream of it is
equal to anObject, returns false and doesn't gobble the next
element if the next element is not equal to anObject.  Lookahead is
implemented automatically for streams that are not positionable but
can be copied.

**`reject: aBlock`**

Answer a new stream that only returns those objects for which
aBlock returns false.  Note that the returned stream will not be
positionable.

**`select: aBlock`**

Answer a new stream that only returns those objects for which
aBlock returns true.  Note that the returned stream will not be
positionable.

#### 1.157.12 Stream: polymorphism

**`close`**

Do nothing.  This is provided for consistency with file streams

**`flush`**

Do nothing.  This is provided for consistency with file streams

**`pastEnd`**

The end of the stream has been reached.  Signal a Notification.

#### 1.157.13 Stream: positioning

**`isPositionable`**

Answer true if the stream supports moving backwards with #skip:.

**`skip: anInteger`**

Move the position forwards by anInteger places

**`skipSeparators`**

Advance the receiver until we find a character that is not a
separator.  Answer false if we reach the end of the stream, else
answer true; in this case, sending #next will return the first
non-separator character (possibly the same to which the stream
pointed before #skipSeparators was sent).

**`skipTo: anObject`**

Move the current position to after the next occurrence of anObject
and return true if anObject was found.  If anObject doesn't exist,
the pointer is atEnd, and false is returned.

**`skipToAll: aCollection`**

If there is a sequence of objects remaining in the stream that is
equal to the sequence in aCollection, set the stream position just
past that sequence and answer true.  Else, set the stream position
to its end and answer false.

#### 1.157.14 Stream: printing

**`<< anObject`**

This method is a short-cut for #display:; it prints anObject on the
receiver by sending displayOn: to anObject.  This method is
provided so that you can use cascading and obtain better-looking
code

**`display: anObject`**

Print anObject on the receiver by sending displayOn: to anObject.
This method is provided so that you can use cascading and obtain
better-looking code

**`print: anObject`**

Print anObject on the receiver by sending printOn: to anObject.
This method is provided so that you can use cascading and obtain
better-looking code

#### 1.157.15 Stream: still unclassified

**`nextPutAllOn: aStream`**

Write all the objects in the receiver to aStream

#### 1.157.16 Stream: storing

**`store: anObject`**

Print Smalltalk code compiling to anObject on the receiver, by
sending storeOn: to anObject.  This method is provided so that you
can use cascading and obtain better-looking code

#### 1.157.17 Stream: streaming protocol

**`nextAvailablePutAllOn: aStream`**

Copy to aStream a more-or-less arbitrary amount of data.  When used
on files, this does at most one I/O operation.  For other kinds of
stream, the definition may vary.  This method is used to do
stream-to-stream copies.

#### 1.157.18 Stream: testing

**`atEnd`**

Answer whether the stream has got to an end

**`isExternalStream`**

Answer whether the receiver streams on a file or socket.  By
default, answer false.

**`isSequenceable`**

Answer whether the receiver can be accessed by a numeric index with
\#at:/#at:put:.

**`readStream`**

As a wild guess, return the receiver.  WriteStreams should override
this method.

### 1.158 String

**Namespace:** Smalltalk · **Superclass:** [CharacterArray](#129-characterarray) · **Category:** Collections-Text

My instances represent 8-bit character strings.  Being a very
common case, they are particularly optimized.

Note that, if you care about multilingualization, you should treat
String only as an encoded representation of a UnicodeString.  The
I18N package adds more Unicode-friendliness to the system so that
encoding and decoding is performed automatically in more cases.  In
that case, String represents a case when the encoding is either
unknown, irrelevant, or assumed to be the system default.

#### 1.158.1 String class: instance creation

**`fromCData: aCObject`**

Answer a String containing the bytes starting at the location
pointed to by aCObject, up to the first NUL character.

**`fromCData: aCObject size: anInteger`**

Answer a String containing anInteger bytes starting at the location
pointed to by aCObject

#### 1.158.2 String class: multibyte encodings

**`isUnicode`**

Answer false; the receiver stores bytes (i.e.  an encoded form),
not characters.

#### 1.158.3 String: accessing

**`byteAt: index`**

Answer the ascii value of index-th character variable of the
receiver

**`byteAt: index put: value`**

Store (Character value: value) in the index-th indexed instance
variable of the receiver

#### 1.158.4 String: basic

**`, aString`**

Answer a new instance of an ArrayedCollection containing all the
elements in the receiver, followed by all the elements in
aSequenceableCollection

**`= aCollection`**

Answer whether the receiver's items match those in aCollection

**`indexOf: anElement startingAt: anIndex`**

Answer the first index \> anIndex which contains anElement.  Invoke
exceptionBlock and answer its result if no item is found

**`indexOf: anElement startingAt: anIndex ifAbsent: exceptionBlock`**

Answer the first index \> anIndex which contains anElement.  Invoke
exceptionBlock and answer its result if no item is found

#### 1.158.5 String: built ins

**`asCData: aCType`**

Allocate memory with malloc for a NULL-terminated copy of the
receiver, and return a pointer to it as a CObject of the given
type.

**`at: anIndex`**

Answer the index-th indexed instance variable of the receiver

**`at: anIndex ifAbsent: aBlock`**

Answer the index-th indexed instance variable of the receiver

**`at: anIndex put: value`**

Store value in the index-th indexed instance variable of the
receiver

**`basicAt: anIndex`**

Answer the index-th indexed instance variable of the receiver.
This method must not be overridden, override at: instead

**`basicAt: anIndex put: value`**

Store value in the index-th indexed instance variable of the
receiver This method must not be overridden, override at:put:
instead

**`hash`**

Answer an hash value for the receiver

**`replaceFrom: start to: stop with: aString startingAt: replaceStart`**

Replace the characters from start to stop with new characters whose
ASCII codes are contained in aString, starting at the replaceStart
location of aString

**`replaceFrom: start to: stop withByteArray: byteArray startingAt: replaceStart`**

Replace the characters from start to stop with new characters whose
ASCII codes are contained in byteArray, starting at the
replaceStart location of byteArray

**`similarityTo: aString`**

Answer a number that denotes the similarity between aString and the
receiver.  0 indicates equality, negative numbers indicate some
difference.  Implemented as a primitive for speed.

**`size`**

Answer the size of the receiver

#### 1.158.6 String: CObject

**`asCData`**

Allocate memory with malloc for a NULL-terminated copy of the
receiver, and return a pointer to it as a CChar.

#### 1.158.7 String: converting

**`asByteArray`**

Return the receiver, converted to a ByteArray of ASCII values

**`asString`**

But I already am a String!  Really!

**`asSymbol`**

Returns the symbol corresponding to the receiver

**`encoding`**

Answer the encoding of the receiver.  This is not implemented
unless you load the Iconv package.

#### 1.158.8 String: filesystem

**`/ aName`**

Answer a File object as appropriate for a file named 'aName' in the
directory represented by the receiver.

**`asFile`**

Answer a File object for the file whose name is in the receiver.

#### 1.158.9 String: printing

**`displayOn: aStream`**

Print a representation of the receiver on aStream.  Unlike
\#printOn:, this method strips extra quotes.

**`displayString`**

Answer a String representing the receiver.  For most objects this
is simply its #printString, but for CharacterArrays and characters,
superfluous dollars or extra pair of quotes are stripped.

**`isLiteralObject`**

Answer whether the receiver is expressible as a Smalltalk literal.

**`printOn: aStream`**

Print a representation of the receiver on aStream

**`storeLiteralOn: aStream`**

Store a Smalltalk literal compiling to the receiver on aStream

**`storeOn: aStream`**

Store Smalltalk code compiling to the receiver on aStream

#### 1.158.10 String: regex

**`=~ pattern`**

Answer a RegexResults object for matching the receiver against the
Regex or String object pattern.

**`allOccurrencesOfRegex: pattern`**

Find all the matches of pattern within the receiver and collect
them into an OrderedCollection.

**`allOccurrencesOfRegex: pattern do: aBlock`**

Find all the matches of pattern within the receiver and pass the
RegexResults objects to aBlock.

**`allOccurrencesOfRegex: pattern from: from to: to`**

Find all the matches of pattern within the receiver and within the
given range of indices.  Collect them into an OrderedCollection,
which is then returned.

**`allOccurrencesOfRegex: pattern from: from to: to do: aBlock`**

Find all the matches of pattern within the receiver and within the
given range of indices.  For each match, pass the RegexResults
object to aBlock.

**`asRegex`**

Answer the receiver, converted to a Regex object.

**`copyFrom: from to: to replacingAllRegex: pattern with: aStringOrBlock`**

Returns the substring of the receiver between from and to.  Any
match of pattern in that part of the string is replaced using
aStringOrBlock as follows: if it is a block, a RegexResults object
is passed, while if it is a string, %n sequences are replaced with
the captured subexpressions of the match (as in #%).

**`copyFrom: from to: to replacingRegex: pattern with: aStringOrBlock`**

Returns the substring of the receiver between from and to.  If
pattern has a match in that part of the string, the match is
replaced using aStringOrBlock as follows: if it is a block, a
RegexResults object is passed, while if it is a string, %n
sequences are replaced with the captured subexpressions of the
match (as in #%).

**`copyReplacingAllRegex: pattern with: aStringOrBlock`**

Returns the receiver after replacing all the matches of pattern (if
any) using aStringOrBlock as follows: if it is a block, a
RegexResults object is passed, while if it is a string, %n
sequences are replaced with the captured subexpressions of the
match (as in #%).

**`copyReplacingRegex: pattern with: aStringOrBlock`**

Returns the receiver after replacing the first match of pattern (if
any) using aStringOrBlock as follows: if it is a block, a
RegexResults object is passed, while if it is a string, %n
sequences are replaced with the captured subexpressions of the
match (as in #%).

**`indexOfRegex: regexString`**

If an occurrence of the regex is present in the receiver, return
the Interval corresponding to the leftmost-longest match.
Otherwise return nil.

**`indexOfRegex: regexString from: from to: to`**

If an occurrence of the regex is present in the receiver, return
the Interval corresponding to the leftmost-longest match occurring
within the given range of indices.  Otherwise return nil.

**`indexOfRegex: regexString from: from to: to ifAbsent: excBlock`**

If an occurrence of the regex is present in the receiver, return
the Interval corresponding to the leftmost-longest match occurring
within the given indices.  Otherwise, evaluate excBlock and return
the result.

**`indexOfRegex: regexString ifAbsent: excBlock`**

If an occurrence of the regex is present in the receiver, return
the Interval corresponding to the leftmost-longest match.
Otherwise, evaluate excBlock and return the result.

**`indexOfRegex: regexString startingAt: index`**

If an occurrence of the regex is present in the receiver, return
the Interval corresponding to the leftmost-longest match starting
after the given index.  Otherwise return nil.

**`indexOfRegex: regexString startingAt: index ifAbsent: excBlock`**

If an occurrence of the regex is present in the receiver, return
the Interval corresponding to the leftmost-longest match starting
after the given index.  Otherwise, evaluate excBlock and return the
result.

**`matchRegex: pattern`**

Answer whether the receiver is an exact match for the pattern.
This means that the pattern is implicitly anchored at the beginning
and the end.

**`matchRegex: pattern from: from to: to`**

Answer whether the given range of indices is an exact match for the
pattern.  This means that there is a match starting at from and
ending at to (which is not necessarily the longest match starting
at from).

**`occurrencesOfRegex: pattern`**

Returns count of how many times pattern repeats in the receiver.

**`occurrencesOfRegex: pattern from: from to: to`**

Return a count of how many times pattern repeats in the receiver
within the given range of index.

**`occurrencesOfRegex: pattern startingAt: index`**

Returns count of how many times pattern repeats in the receiver,
starting the search at the given index.

**`onOccurrencesOfRegex: pattern do: body`**

Find all the matches of pattern within the receiver and, for each
match, pass the RegexResults object to aBlock.

**`onOccurrencesOfRegex: pattern from: from to: to do: aBlock`**

Find all the matches of pattern within the receiver and within the
given range of indices.  For each match, pass the RegexResults
object to aBlock.

**`replacingAllRegex: pattern with: aStringOrBlock`**

Returns the receiver if the pattern has no match in it.  Otherwise,
any match of pattern in that part of the string is replaced using
aStringOrBlock as follows: if it is a block, a RegexResults object
is passed, while if it is a string, %n sequences are replaced with
the captured subexpressions of the match (as in #%).

**`replacingRegex: pattern with: aStringOrBlock`**

Returns the receiver if the pattern has no match in it.  If it has
a match, it is replaced using aStringOrBlock as follows: if it is a
block, a RegexResults object is passed, while if it is a string, %n
sequences are replaced with the captured subexpressions of the
match (as in #%).

**`searchRegex: pattern`**

A synonym for #=\~.  Answer a RegexResults object for matching the
receiver against the Regex or String object pattern.

**`searchRegex: pattern from: from to: to`**

Answer a RegexResults object for matching the receiver against the
Regex or String object pattern, restricting the match to the
specified range of indices.

**`searchRegex: pattern startingAt: anIndex`**

Answer a RegexResults object for matching the receiver against the
Regex or String object pattern, starting the match at index
anIndex.

**`tokenize: pattern`**

Split the receiver at every occurrence of pattern.  All parts that
do not match pattern are separated and stored into an Array of
Strings that is returned.

**`tokenize: pattern from: from to: to`**

Split the receiver at every occurrence of pattern (considering only
the indices between from and to).  All parts that do not match
pattern are separated and stored into an Array of Strings that is
returned.

**`~ pattern`**

Answer whether the receiver matched against the Regex or String
object pattern.

#### 1.158.11 String: still unclassified

**`escapeRegex`**

Answer the receiver with all regex special characters escaped by a
backslash.

#### 1.158.12 String: testing functionality

**`isString`**

Answer 'true'.

### 1.159 Symbol

**Namespace:** Smalltalk · **Superclass:** [String](#1158-string) · **Category:** Language-Implementation

My instances are unique throughout the Smalltalk system.  My
instances behave for the most part like strings, except that they
print differently, and I guarantee that any two instances that have
the same printed representation are in fact the same instance.

#### 1.159.1 Symbol class: built ins

**`intern: aString`**

Private - Same as 'aString asSymbol'

#### 1.159.2 Symbol class: instance creation

**`internCharacter: aCharacter`**

Answer the one-character symbol associated to the given character.

**`new`**

This method should not be called for instances of this class.

**`new: size`**

This method should not be called for instances of this class.

**`with: element1`**

Answer a collection whose only element is element1

**`with: element1 with: element2`**

Answer a collection whose only elements are the parameters in the
order they were passed

**`with: element1 with: element2 with: element3`**

Answer a collection whose only elements are the parameters in the
order they were passed

**`with: element1 with: element2 with: element3 with: element4`**

Answer a collection whose only elements are the parameters in the
order they were passed

**`with: element1 with: element2 with: element3 with: element4 with: element5`**

Answer a collection whose only elements are the parameters in the
order they were passed

#### 1.159.3 Symbol class: symbol table

**`hasInterned: aString ifTrue: aBlock`**

If aString has not been interned yet, answer false.  Else, pass the
interned version to aBlock and answer true.  Note that this works
because String\>\>#hash calculates the same hash value used by the VM
when interning strings into the SymbolTable.  Changing one of the
hashing methods without changing the other will break this method.

**`isSymbolString: aString`**

Answer whether aString has already been interned.  Note that this
works because String\>\>#hash calculates the same hash value used by
the VM when interning strings into the SymbolTable.  Changing one
of the hashing methods without changing the other will break this
method.

**`rebuildTable`**

Rebuild the SymbolTable, thereby garbage-collecting unreferenced
Symbols.  While this process is done, preemption is disabled
because it is not acceptable to leave the SymbolTable in a
partially updated state.  Note that this works because
String\>\>#hash calculates the same hash value used by the VM when
interning strings into the SymbolTable.  Changing one of the
hashing methods without changing the other will break this method.

#### 1.159.4 Symbol: accessing the method dictionary

**`implementors`**

Answer a Set of all the compiled method associated with selector
named by the receiver, which is supposed to be a valid message
name.

#### 1.159.5 Symbol: basic

**`deepCopy`**

Returns a deep copy of the receiver.  As Symbols are identity
objects, we actually return the receiver itself.

**`keywords`**

Answer an array of keywords that compose the receiver, which is
supposed to be a valid message name (#+, #not, #printOn:,
\#ifTrue:ifFalse:, etc.)

**`numArgs`**

Answer the number of arguments supported by the receiver, which is
supposed to be a valid message name (#+, #not, #printOn:,
\#ifTrue:ifFalse:, etc.)

**`shallowCopy`**

Returns a deep copy of the receiver.  As Symbols are identity
objects, we actually return the receiver itself.

#### 1.159.6 Symbol: built ins

**`= aSymbol`**

Answer whether the receiver and aSymbol are the same object

**`hash`**

Answer an hash value for the receiver.  Symbols are optimized for
speed

#### 1.159.7 Symbol: converting

**`asString`**

Answer a String with the same characters as the receiver

**`asSymbol`**

But we are already a Symbol, and furthermore, Symbols are identity
objects!  So answer the receiver.

#### 1.159.8 Symbol: misc

**`species`**

Answer 'String'.

#### 1.159.9 Symbol: storing

**`displayOn: aStream`**

Print a represention of the receiver on aStream.  For most objects
this is simply its #printOn: representation, but for strings and
characters, superfluous dollars or extra pairs of quotes are
stripped.

**`displayString`**

Answer a String representing the receiver.  For most objects this
is simply its #printString, but for strings and characters,
superfluous dollars or extra pair of quotes are stripped.

**`printOn: aStream`**

Print a represention of the receiver on aStream.

**`storeLiteralOn: aStream`**

Print Smalltalk code on aStream that compiles to the same symbol as
the receiver.

**`storeOn: aStream`**

Print Smalltalk code on aStream that compiles to the same symbol as
the receiver.

#### 1.159.10 Symbol: testing

**`isSimpleSymbol`**

Answer whether the receiver must be represented in quoted-string
(e.g.  #'abc-def') form.

#### 1.159.11 Symbol: testing functionality

**`isString`**

Answer 'false'.

**`isSymbol`**

Answer 'true'.

### 1.160 SymLink

**Namespace:** Smalltalk · **Superclass:** [Link](#1103-link) · **Category:** Language-Implementation

I am used to implement the Smalltalk symbol table.  My instances
are links that contain symbols, and the symbol table basically a
hash table that points to chains of my instances.

#### 1.160.1 SymLink class: instance creation

**`symbol: aSymbol nextLink: aSymLink`**

Answer a new SymLink, which refers to aSymbol and points to
aSymLink as the next SymLink in the chain.

#### 1.160.2 SymLink: accessing

**`symbol`**

Answer the Symbol that the receiver refers to in the symbol table.

**`symbol: aSymbol`**

Set the Symbol that the receiver refers to in the symbol table.

#### 1.160.3 SymLink: iteration

**`do: aBlock`**

Evaluate aBlock for each symbol in the list

#### 1.160.4 SymLink: printing

**`printOn: aStream`**

Print a representation of the receiver on aStream.

### 1.161 SystemDictionary

**Namespace:** Smalltalk · **Superclass:** [RootNamespace](#1146-rootnamespace) · **Category:** Language-Implementation

I am a special namespace.  I only have one instance, called
"Smalltalk", which is known to the Smalltalk interpreter.  I define
several methods that are "system" related, such as #quitPrimitive.
My instance also helps keep track of dependencies between objects.

#### 1.161.1 SystemDictionary class: initialization

**`initialize`**

Create the kernel's private namespace.

#### 1.161.2 SystemDictionary: basic

**`halt`**

Interrupt interpreter

**`hash`**

Smalltalk usually contains a reference to itself, avoid infinite
loops

#### 1.161.3 SystemDictionary: builtins

**`basicBacktrace`**

Prints the method invocation stack backtrace, as an aid to
debugging

**`byteCodeCounter`**

Answer the number of bytecodes executed by the VM

**`debug`**

This methods provides a way to break in the VM code.  Set a
breakpoint in \_gst\_debug and call this method near the point where
you think the bug happens.

**`declarationTrace`**

Answer whether compiled bytecodes are printed on stdout

**`declarationTrace: aBoolean`**

Set whether compiled bytecodes are printed on stdout

**`executionTrace`**

Answer whether executed bytecodes are printed on stdout

**`executionTrace: aBoolean`**

Set whether executed bytecodes are printed on stdout

**`getTraceFlag: anIndex`**

Private - Returns a boolean value which is one of the interpreter's
tracing flags

**`setTraceFlag: anIndex to: aBoolean`**

Private - Sets the value of one of the interpreter's tracing flags
(indicated by 'anIndex') to the value aBoolean.

**`verboseTrace`**

Answer whether execution tracing prints the object on the stack top

**`verboseTrace: aBoolean`**

Set whether execution tracing prints the object on the stack top

#### 1.161.4 SystemDictionary: c call-outs

**`environ`**

Not commented.

**`getArgc`**

Not commented.

**`getArgv: index`**

Not commented.

**`getenv: aString`**

Not commented.

**`putenv: aString`**

Not commented.

**`system: aString`**

Not commented.

**`system: aString withArguments: args`**

Not commented.

#### 1.161.5 SystemDictionary: command-line

**`arguments: pattern do: actionBlock`**

Parse the command-line arguments according to the syntax specified
in pattern.  For every command-line option found, the two-argument
block actionBlock is evaluated passing the option name and the
argument.  For file names (or in general, other command-line
arguments than options) the block's first argument will be nil.
For options without arguments, or with unspecified optional
arguments, the block's second argument will be nil.  The option
name will be passed as a character object for short options, and as
a string for long options.

If an error is found, nil is returned.  For more information on the
syntax of pattern, see #arguments:do:ifError:.

**`arguments: pattern do: actionBlock ifError: errorBlock`**

Parse the command-line arguments according to the syntax specified
in pattern.  For every command-line option found, the two-argument
block actionBlock is evaluated passing the option name and the
argument.  For file names (or in general, other command-line
arguments than options) the block's first argument will be nil.
For options without arguments, or with unspecified optional
arguments, the block's second argument will be nil.  The option
name will be passed as a character object for short options, and as
a string for long options.

If an error is found, the parsing is interrupted, errorBlock is
evaluated, and the returned value is answered.

Every whitespace-separated part ('word') of pattern specifies a
command-line option.  If a word ends with a colon, the option will
have a mandatory argument.  If a word ends with two colons, the
option will have an optional argument.  Before the colons, multiple
option names (either short names like '-l' or long names like
'-long') can be specified.  Before passing the option to
actionBlock, the name will be canonicalized to the last one.

Prefixes of long options are accepted as long as they're unique,
and they are canonicalized to the full name before passing it to
actionBlock.  Additionally, the full name of an option is accepted
even if it is the prefix of a longer option.

Mandatory arguments can appear in the next argument, or in the same
argument (separated by an = for arguments to long options).
Optional arguments must appear in the same argument.

#### 1.161.6 SystemDictionary: miscellaneous

**`arguments`**

Return the command line arguments after the -a switch

**`backtrace`**

Print a backtrace on the Transcript.

**`hostSystem`**

Answer the triplet corresponding to the system for which GNU
Smalltalk was built.

#### 1.161.7 SystemDictionary: printing

**`nameIn: aNamespace`**

Answer ''Smalltalk".

**`printOn: aStream in: aNamespace`**

Store Smalltalk code compiling to the receiver

**`storeOn: aStream`**

Store Smalltalk code compiling to the receiver

#### 1.161.8 SystemDictionary: profiling

**`rawProfile: anIdentityDictionary`**

Set the raw profile to be anIdentityDictionary and return the old
one.

#### 1.161.9 SystemDictionary: special accessing

**`addFeature: aFeature`**

Add the aFeature feature to the Features set

**`hasFeatures: features`**

Returns true if the feature or features in 'features' is one of the
implementation dependent features present

**`removeFeature: aFeature`**

Remove the aFeature feature to the Features set

**`version`**

Answer the current version of the GNU Smalltalk environment

#### 1.161.10 SystemDictionary: testing

**`imageLocal`**

Answer whether the kernel directory is a subdirectory of the image
directory (non-local image) or not.

**`isSmalltalk`**

Answer 'true'.

### 1.162 SystemExceptions.AlreadyDefined

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.InvalidArgument](#1170-systemexceptionsinvalidargument) · **Category:** Language-Exceptions

I am raised when one tries to define a symbol (class or pool
variable) that is already defined.

#### 1.162.1 SystemExceptions.AlreadyDefined: accessing

**`description`**

Answer a description for the error

### 1.163 SystemExceptions.ArgumentOutOfRange

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.InvalidArgument](#1170-systemexceptionsinvalidargument) · **Category:** Language-Exceptions

I am raised when one invokes a method with an argument outside of
its valid range.

#### 1.163.1 SystemExceptions.ArgumentOutOfRange class: signaling

**`signalOn: value mustBeBetween: low and: high`**

Raise the exception.  The given value was not between low and high.

#### 1.163.2 SystemExceptions.ArgumentOutOfRange: accessing

**`description`**

Answer a textual description of the exception.

**`high`**

Answer the highest value that was permitted.

**`high: aMagnitude`**

Set the highest value that was permitted.

**`low`**

Answer the lowest value that was permitted.

**`low: aMagnitude`**

Set the lowest value that was permitted.

### 1.164 SystemExceptions.BadReturn

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.VMError](#1194-systemexceptionsvmerror) · **Category:** Language-Exceptions

I am raised when one tries to return from an already-terminated
method.

#### 1.164.1 SystemExceptions.BadReturn: accessing

**`description`**

Answer a textual description of the exception.

### 1.165 SystemExceptions.CInterfaceError

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.PrimitiveFailed](#1184-systemexceptionsprimitivefailed) · **Category:** Language-Exceptions

I am raised when an error happens that is related to the C
interface.

#### 1.165.1 SystemExceptions.CInterfaceError: accessing

**`description`**

Answer a textual description of the exception.

### 1.166 SystemExceptions.EmptyCollection

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.InvalidValue](#1174-systemexceptionsinvalidvalue) · **Category:** Language-Exceptions

I am raised when one invokes a method on an empty collection.

#### 1.166.1 SystemExceptions.EmptyCollection: accessing

**`description`**

Answer a textual description of the exception.

### 1.167 SystemExceptions.EndOfStream

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [Notification](#1119-notification) · **Category:** Language-Exceptions

I am raised when a stream reaches its end.

#### 1.167.1 SystemExceptions.EndOfStream class: signaling

**`signalOn: stream`**

Answer an exception reporting the parameter has reached its end.

#### 1.167.2 SystemExceptions.EndOfStream: accessing

**`description`**

Answer a textual description of the exception.

**`stream`**

Answer the stream whose end was reached.

**`stream: anObject`**

Set the stream whose end was reached.

### 1.168 SystemExceptions.FileError

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.PrimitiveFailed](#1184-systemexceptionsprimitivefailed) · **Category:** Language-Exceptions

I am raised when an error happens that is related to the file
system.

#### 1.168.1 SystemExceptions.FileError: accessing

**`description`**

Answer a textual description of the exception.

### 1.169 SystemExceptions.IndexOutOfRange

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.ArgumentOutOfRange](#1163-systemexceptionsargumentoutofrange) · **Category:** Language-Exceptions

I am raised when one invokes am accessor method with an index
outside of its valid range.

#### 1.169.1 SystemExceptions.IndexOutOfRange class: signaling

**`signalOn: aCollection withIndex: value`**

The given index was out of range in aCollection.

#### 1.169.2 SystemExceptions.IndexOutOfRange: accessing

**`collection`**

Answer the collection that triggered the error

**`collection: anObject`**

Set the collection that triggered the error

**`description`**

Answer a textual description of the exception.

**`messageText`**

Answer an exception's message text.

### 1.170 SystemExceptions.InvalidArgument

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.InvalidValue](#1174-systemexceptionsinvalidvalue) · **Category:** Language-Exceptions

I am raised when one invokes a method with an invalid argument.

#### 1.170.1 SystemExceptions.InvalidArgument: accessing

**`messageText`**

Answer an exception's message text.

### 1.171 SystemExceptions.InvalidProcessState

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.InvalidValue](#1174-systemexceptionsinvalidvalue) · **Category:** Language-Exceptions

I am an error raised when trying to resume a terminated process, or
stuff like that.

#### 1.171.1 SystemExceptions.InvalidProcessState: accessing

**`description`**

Answer a textual description of the exception.

### 1.172 SystemExceptions.InvalidSize

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.InvalidArgument](#1170-systemexceptionsinvalidargument) · **Category:** Language-Exceptions

I am raised when an argument has an invalid size.

#### 1.172.1 SystemExceptions.InvalidSize: accessing

**`description`**

Answer a textual description of the exception.

### 1.173 SystemExceptions.InvalidState

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.InvalidValue](#1174-systemexceptionsinvalidvalue) · **Category:** Language-Exceptions

I am raised when one invokes a method and the receiver or an
argument are in an invalid state for the method.

#### 1.173.1 SystemExceptions.InvalidState: accessing

**`messageText`**

Answer an exception's message text.

### 1.174 SystemExceptions.InvalidValue

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [Error](#171-error) · **Category:** Language-Exceptions

I am raised when one invokes a method with an invalid receiver or
argument.

#### 1.174.1 SystemExceptions.InvalidValue class: signaling

**`signalOn: value`**

Answer an exception reporting the parameter as invalid.

**`signalOn: value reason: reason`**

Answer an exception reporting 'value' as invalid, for the given
reason.

#### 1.174.2 SystemExceptions.InvalidValue: accessing

**`description`**

Answer a textual description of the exception.

**`messageText`**

Answer an exception's message text.

**`value`**

Answer the object that was found to be invalid.

**`value: anObject`**

Set the object that was found to be invalid.

### 1.175 SystemExceptions.MustBeBoolean

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.WrongClass](#1196-systemexceptionswrongclass) · **Category:** Language-Exceptions

I am raised when one invokes a boolean method on a non-boolean.

#### 1.175.1 SystemExceptions.MustBeBoolean class: signaling

**`signalOn: anObject`**

Signal a new exception, with the bad value in question being
anObject.

### 1.176 SystemExceptions.MutationError

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [Error](#171-error) · **Category:** Language-Exceptions

I am an error raised when a class is mutated in an invalid way.

#### 1.176.1 SystemExceptions.MutationError class: instance creation

**`new`**

Create an instance of the receiver, which you will be able to
signal later.

#### 1.176.2 SystemExceptions.MutationError: accessing

**`description`**

Answer a textual description of the exception.

### 1.177 SystemExceptions.NoRunnableProcess

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.VMError](#1194-systemexceptionsvmerror) · **Category:** Language-Exceptions

I am raised when no runnable process can be found in the image.

#### 1.177.1 SystemExceptions.NoRunnableProcess: accessing

**`description`**

Answer a textual description of the exception.

### 1.178 SystemExceptions.NotEnoughElements

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [Error](#171-error) · **Category:** Language-Exceptions

I am raised when one invokes #next: but not enough items remain in
the stream.

#### 1.178.1 SystemExceptions.NotEnoughElements class: signaling

**`signalOn: remainingCount`**

Answer an exception reporting the parameter as invalid.

#### 1.178.2 SystemExceptions.NotEnoughElements: accessing

**`description`**

Answer a textual description of the exception.

**`messageText`**

Answer an exception's message text.

**`remainingCount`**

Answer the number of items that were to be read.

**`remainingCount: anObject`**

Set the number of items that were to be read.

### 1.179 SystemExceptions.NotFound

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.InvalidArgument](#1170-systemexceptionsinvalidargument) · **Category:** Language-Exceptions

I am raised when something is searched without success.

#### 1.179.1 SystemExceptions.NotFound class: accessing

**`signalOn: value reason: aString`**

Raise an exception: reason specifies the reason of the exception.

**`signalOn: value what: aString`**

Raise an exception; aString specifies what was not found (a key, an
object, a class, and so on).

#### 1.179.2 SystemExceptions.NotFound: accessing

**`description`**

Answer a textual description of the exception.

### 1.180 SystemExceptions.NotImplemented

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [Error](#171-error) · **Category:** Language-Exceptions

I am raised when a method is called that has not been implemented.

#### 1.180.1 SystemExceptions.NotImplemented: accessing

**`description`**

Answer a textual description of the exception.

### 1.181 SystemExceptions.NotIndexable

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.InvalidValue](#1174-systemexceptionsinvalidvalue) · **Category:** Language-Exceptions

I am raised when an object is not indexable.

#### 1.181.1 SystemExceptions.NotIndexable: accessing

**`description`**

Answer a textual description of the exception.

### 1.182 SystemExceptions.NotYetImplemented

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.NotImplemented](#1180-systemexceptionsnotimplemented) · **Category:** Language-Exceptions

I am raised when a method is called that has not been implemented
yet.

#### 1.182.1 SystemExceptions.NotYetImplemented: accessing

**`description`**

Answer a textual description of the exception.

### 1.183 SystemExceptions.PackageNotAvailable

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.NotFound](#1179-systemexceptionsnotfound) · **Category:** Language-Packaging

#### 1.183.1 SystemExceptions.PackageNotAvailable class: still unclassified

**`signal: aString`**

Signal an exception saying that the package named aString can't be
found.

**`signal: package reason: reason`**

Signal an exception saying that be package named package can't be
found because the reason named reason.

#### 1.183.2 SystemExceptions.PackageNotAvailable: description

**`isResumable`**

Answer true.  Package unavailability is resumable, because the
package files might just lie elsewhere.

### 1.184 SystemExceptions.PrimitiveFailed

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.VMError](#1194-systemexceptionsvmerror) · **Category:** Language-Exceptions

I am raised when a primitive fails for some reason.

#### 1.184.1 SystemExceptions.PrimitiveFailed: accessing

**`description`**

Answer a textual description of the exception.

### 1.185 SystemExceptions.ProcessBeingTerminated

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [Notification](#1119-notification) · **Category:** Language-Exceptions

I am raised when a process is terminated.

#### 1.185.1 SystemExceptions.ProcessBeingTerminated class: still unclassified

**`initialize`**

Not commented.

#### 1.185.2 SystemExceptions.ProcessBeingTerminated: accessing

**`description`**

Answer a textual description of the exception.

**`semaphore`**

If the process was waiting on a semaphore, answer it.

**`semaphore: aSemaphore`**

If the process was waiting on a semaphore, answer it.

### 1.186 SystemExceptions.ProcessTerminated

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.InvalidValue](#1174-systemexceptionsinvalidvalue) · **Category:** Language-Exceptions

I am raised when somebody tries to resume or interrupt a terminated
process.

#### 1.186.1 SystemExceptions.ProcessTerminated: accessing

**`description`**

Answer a textual description of the exception.

### 1.187 SystemExceptions.ReadOnlyObject

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.InvalidValue](#1174-systemexceptionsinvalidvalue) · **Category:** Language-Exceptions

I am raised when one writes to a read-only object.

#### 1.187.1 SystemExceptions.ReadOnlyObject: accessing

**`description`**

Answer a textual description of the exception.

### 1.188 SystemExceptions.SecurityError

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.VMError](#1194-systemexceptionsvmerror) · **Category:** Language-Exceptions

I am an error raised when an untrusted object tries to do an
insecure operation.

#### 1.188.1 SystemExceptions.SecurityError class: accessing

**`signal: aPermission`**

Raise the exception, setting to aPermission the permission that was
tested and failed.

#### 1.188.2 SystemExceptions.SecurityError: accessing

**`description`**

Answer a textual description of the exception.

**`failedPermission`**

Answer the permission that was tested and that failed.

**`failedPermission: anObject`**

Set which permission was tested and failed.

### 1.189 SystemExceptions.ShouldNotImplement

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.NotImplemented](#1180-systemexceptionsnotimplemented) · **Category:** Language-Exceptions

I am raised when a method is called that a class wishes that is not
called.

#### 1.189.1 SystemExceptions.ShouldNotImplement: accessing

**`description`**

Answer a textual description of the exception.

### 1.190 SystemExceptions.SubclassResponsibility

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.ShouldNotImplement](#1189-systemexceptionsshouldnotimplement) · **Category:** Language-Exceptions

I am raised when a method is called whose implementation is the
responsibility of concrete subclass.

#### 1.190.1 SystemExceptions.SubclassResponsibility: accessing

**`description`**

Answer a textual description of the exception.

### 1.191 SystemExceptions.UnhandledException

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [Exception](#172-exception) · **Category:** Language-Exception

I am raised when a backtrace is shown to terminate the current
process.

#### 1.191.1 SystemExceptions.UnhandledException: accessing

**`defaultAction`**

Terminate the current process.

**`description`**

Answer a textual description of the exception.

**`originalException`**

Answer the uncaught exception.

**`originalException: anObject`**

Set the uncaught exception to anObject.

### 1.192 SystemExceptions.UserInterrupt

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.VMError](#1194-systemexceptionsvmerror) · **Category:** Language-Exceptions

I am raised when one presses Ctrl-C.

#### 1.192.1 SystemExceptions.UserInterrupt: accessing

**`description`**

Answer a textual description of the exception.

### 1.193 SystemExceptions.VerificationError

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.VMError](#1194-systemexceptionsvmerror) · **Category:** Language-Exceptions

I am raised when the verification of a method fails.

#### 1.193.1 SystemExceptions.VerificationError: accessing

**`description`**

Answer a textual description of the exception.

### 1.194 SystemExceptions.VMError

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [Error](#171-error) · **Category:** Language-Exceptions

I am an error related to the innards of the system.

#### 1.194.1 SystemExceptions.VMError: accessing

**`description`**

Answer a textual description of the exception.

### 1.195 SystemExceptions.WrongArgumentCount

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.PrimitiveFailed](#1184-systemexceptionsprimitivefailed) · **Category:** Language-Exceptions

I am raised when one tries to evaluate a method (via #perform:...)
or a block but passes the wrong number of arguments.

#### 1.195.1 SystemExceptions.WrongArgumentCount: accessing

**`description`**

Answer a textual description of the exception.

### 1.196 SystemExceptions.WrongClass

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.InvalidValue](#1174-systemexceptionsinvalidvalue) · **Category:** Language-Exceptions

I am raised when an argument is constrained to be an instance of a
determinate class, and this constraint is not respected by the
caller.

#### 1.196.1 SystemExceptions.WrongClass class: signaling

**`signalOn: anObject mustBe: aClassOrArray`**

Raise an exception.  The given object should have been an instance
of one of the classes indicated by aClassOrArray (which should be a
single class or an array of classes).  Whether instances of
subclasses are allowed should be clear from the context, though in
general (i.e.  with the exception of a few system messages) they
should be.

#### 1.196.2 SystemExceptions.WrongClass: accessing

**`description`**

Answer a textual description of the exception.

**`messageText`**

Answer an exception's message text.

**`validClasses`**

Answer the list of classes whose instances would have been valid.

**`validClasses: aCollection`**

Set the list of classes whose instances would have been valid.

**`validClassesString`**

Answer the list of classes whose instances would have been valid,
formatted as a string.

### 1.197 SystemExceptions.WrongMessageSent

**Namespace:** Smalltalk.SystemExceptions · **Superclass:** [SystemExceptions.ShouldNotImplement](#1189-systemexceptionsshouldnotimplement) · **Category:** Language-Exceptions

I am raised when a method is called that a class wishes that is not
called.  This exception also includes a suggestion on which message
should be sent instead

#### 1.197.1 SystemExceptions.WrongMessageSent class: signaling

**`signalOn: selector useInstead: aSymbol`**

Raise an exception, signaling which selector was sent and
suggesting a valid alternative.

#### 1.197.2 SystemExceptions.WrongMessageSent: accessing

**`messageText`**

Answer an exception's message text.

**`selector`**

Answer which selector was sent.

**`selector: aSymbol`**

Set which selector was sent.

**`suggestedSelector`**

Answer a valid alternative to the selector that was used.

**`suggestedSelector: aSymbol`**

Set a valid alternative to the selector that was used.

### 1.198 TextCollector

**Namespace:** Smalltalk · **Superclass:** [Stream](#1157-stream) · **Category:** Streams

I am a thread-safe class that maps between standard Stream protocol
and a single message to another object (its selector is pluggable
and should roughly correspond to #nextPutAll:).  I am, in fact, the
class that implements the global Transcript object.

#### 1.198.1 TextCollector class: accessing

**`message: receiverToSelectorAssociation`**

Answer a new instance of the receiver, that uses the message
identified by anAssociation to perform write operations.
anAssociation's key is the receiver, while its value is the
selector.

**`new`**

This method should not be called for instances of this class.

#### 1.198.2 TextCollector: accessing

**`cr`**

Emit a new-line (carriage return) to the Transcript

**`critical: aBlock`**

Evaluate aBlock while holding the Transcript lock

**`endEntry`**

Emit two new-lines.  This method is present for compatibility with
VisualWorks.

**`next: anInteger put: anObject`**

Write anInteger copies of anObject to the Transcript

**`next: n putAll: aString startingAt: pos`**

Write aString to the Transcript

**`nextPut: aCharacter`**

Emit aCharacter to the Transcript

**`show: aString`**

Write aString to the Transcript

**`showCr: aString`**

Write aString to the Transcript, followed by a new-line character

**`showOnNewLine: aString`**

Write aString to the Transcript, preceded by a new-line character

#### 1.198.3 TextCollector: printing

**`print: anObject`**

Print anObject's representation to the Transcript

**`printOn: aStream`**

Print a representation of the receiver onto aStream

#### 1.198.4 TextCollector: set up

**`message`**

Answer an association representing the message to be sent to
perform write operations.  The key is the receiver, the value is
the selector

**`message: receiverToSelectorAssociation`**

Set the message to be sent to perform write operations to the one
represented by anAssociation.  anAssociation's key is the receiver,
while its value is the selector

#### 1.198.5 TextCollector: storing

**`store: anObject`**

Print Smalltalk code which evaluates to anObject on the Transcript

**`storeOn: aStream`**

Print Smalltalk code which evaluates to the receiver onto aStream

### 1.199 Time

**Namespace:** Smalltalk · **Superclass:** [Magnitude](#1107-magnitude) · **Category:** Language-Data types

My instances represent times of the day.  I provide methods for
instance creation, methods that access components (hours, minutes,
and seconds) of a time value, and a block execution timing
facility.

#### 1.199.1 Time class: basic (UTC)

**`midnight`**

Answer a time representing midnight in Coordinated Universal Time
(UTC)

**`utcNow`**

Answer a time representing the current time of day in Coordinated
Universal Time (UTC)

**`utcSecondClock`**

Answer the number of seconds since the midnight of 1/1/1901 (unlike
\#secondClock, the reference time is here expressed as UTC, that is
as Coordinated Universal Time).

#### 1.199.2 Time class: builtins

**`primNanosecondClock`**

Returns the number of milliseconds since midnight.

**`primSecondClock`**

Returns the number of seconds to/from 1/1/2000.

**`timezone`**

Answer a String associated with the current timezone (either
standard or daylight-saving) on this operating system.  For
example, the answer could be 'EST' to indicate Eastern Standard
Time; the answer can be empty and can't be assumed to be a
three-character code such as 'EST'.

**`timezoneBias`**

Specifies the current bias, in seconds, for local time translation
for the current time.  The bias is the difference, in seconds,
between Coordinated Universal Time (UTC) and local time; a positive
bias indicates that the local timezone is to the east of Greenwich
(e.g.  Europe, Asia), while a negative bias indicates that it is to
the west (e.g.  America)

**`timezoneBias: seconds`**

Specifies the bias, in seconds, for local time translation for the
given second clock value (0 being midnight of 1/1/1901).  The bias
is the difference, in seconds, between Coordinated Universal Time
(UTC) and local time; a positive bias indicates that the local
timezone is to the east of Greenwich (e.g.  Europe, Asia), while a
negative bias indicates that it is to the west (e.g.  America)

#### 1.199.3 Time class: clocks

**`millisecondClock`**

Answer the number of milliseconds since startup.

**`millisecondClockValue`**

Answer the number of milliseconds since startup

**`millisecondsPerDay`**

Answer the number of milliseconds in a day

**`millisecondsToRun: timedBlock`**

Answer the number of milliseconds which timedBlock took to run

**`nanosecondClock`**

Answer the number of nanoseconds since startup.

**`nanosecondClockValue`**

Answer the number of milliseconds since startup

**`secondClock`**

Answer the number of seconds since the midnight of 1/1/1901

#### 1.199.4 Time class: initialization

**`initialize`**

Initialize the Time class after the image has been bootstrapped

**`update: aspect`**

Private - Initialize the receiver's instance variables

#### 1.199.5 Time class: instance creation

**`fromSeconds: secondCount`**

Answer a Time representing secondCount seconds past midnight

**`hour: h`**

Answer a Time that is the given number of hours past midnight

**`hour: h minute: m second: s`**

Answer a Time that is the given number of hours, minutes and
seconds past midnight

**`hours: h`**

Answer a Time that is the given number of hours past midnight

**`hours: h minutes: m seconds: s`**

Answer a Time that is the given number of hours, minutes and
seconds past midnight

**`minute: m`**

Answer a Time that is the given number of minutes past midnight

**`minutes: m`**

Answer a Time that is the given number of minutes past midnight

**`new`**

Answer a Time representing midnight

**`now`**

Answer a time representing the current time of day

**`readFrom: aStream`**

Parse an instance of the receiver (hours/minutes/seconds) from
aStream

**`second: s`**

Answer a Time that is the given number of seconds past midnight

**`seconds: s`**

Answer a Time that is the given number of seconds past midnight

#### 1.199.6 Time: accessing (ANSI for DateAndTimes)

**`hour`**

Answer the number of hours in the receiver

**`hour12`**

Answer the hour in a 12-hour clock

**`hour24`**

Answer the hour in a 24-hour clock

**`minute`**

Answer the number of minutes in the receiver

**`second`**

Answer the number of seconds in the receiver

#### 1.199.7 Time: accessing (non ANSI & for Durations)

**`asMilliseconds`**

Not commented.

**`asNanoseconds`**

Not commented.

**`asSeconds`**

Answer 'seconds'.

**`hours`**

Answer the number of hours in the receiver

**`minutes`**

Answer the number of minutes in the receiver

**`seconds`**

Answer the number of seconds in the receiver

#### 1.199.8 Time: arithmetic

**`addSeconds: timeAmount`**

Answer a new Time that is timeAmount seconds after the receiver

**`addTime: timeAmount`**

Answer a new Time that is timeAmount seconds after the receiver;
timeAmount is a Time.

**`printOn: aStream`**

Print a representation of the receiver on aStream

**`subtractTime: timeAmount`**

Answer a new Time that is timeAmount seconds before the receiver;
timeAmount is a Time.

#### 1.199.9 Time: comparing

**`< aTime`**

Answer whether the receiver is less than aTime

**`= aTime`**

Answer whether the receiver is equal to aTime

**`hash`**

Answer an hash value for the receiver

### 1.200 True

**Namespace:** Smalltalk · **Superclass:** [Boolean](#113-boolean) · **Category:** Language-Data types

I represent truth and justice in the world.  My motto is "semper
veritatis".

#### 1.200.1 True: basic

**`& aBoolean`**

We are true - anded with anything, we always answer the other
operand

**`and: aBlock`**

We are true - anded with anything, we always answer the other
operand, so evaluate aBlock

**`eqv: aBoolean`**

Answer whether the receiver and aBoolean represent the same boolean
value

**`ifFalse: falseBlock`**

We are true - answer nil

**`ifFalse: falseBlock ifTrue: trueBlock`**

We are true - evaluate trueBlock

**`ifTrue: trueBlock`**

We are true - evaluate trueBlock

**`ifTrue: trueBlock ifFalse: falseBlock`**

We are true - evaluate trueBlock

**`not`**

We are true - answer false

**`or: aBlock`**

We are true - ored with anything, we always answer true

**`xor: aBoolean`**

Answer whether the receiver and aBoolean represent different
boolean values

**`| aBoolean`**

We are true - ored with anything, we always answer true

#### 1.200.2 True: C hacks

**`asCBooleanValue`**

Answer '1'.

#### 1.200.3 True: printing

**`printOn: aStream`**

Print a representation of the receiver on aStream

### 1.201 UndefinedObject

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Implementation

I have the questionable distinction of being a class with only one
instance, which is the object "nil".

#### 1.201.1 UndefinedObject: basic

**`copy`**

Answer the receiver.

**`deepCopy`**

Answer the receiver.

**`shallowCopy`**

Answer the receiver.

#### 1.201.2 UndefinedObject: class creation - alternative

**`subclass: classNameString classInstanceVariableNames: stringClassInstVarNames instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

**`subclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

**`variableByteSubclass: classNameString classInstanceVariableNames: stringClassInstVarNames instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

**`variableByteSubclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

**`variableLongSubclass: classNameString classInstanceVariableNames: stringClassInstVarNames instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

**`variableLongSubclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

**`variableSubclass: classNameString classInstanceVariableNames: stringClassInstVarNames instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

**`variableSubclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames`**

Don't use this, it is only present to file in from IBM Smalltalk

#### 1.201.3 UndefinedObject: class polymorphism

**`allSubclasses`**

Return all the classes in the system.

**`instSize`**

Answer '0'.

**`metaclassFor: classNameString`**

Create a Metaclass object for the given class name.  The metaclass
is a subclass of Class

**`methodDictionary`**

Answer 'nil'.

**`removeSubclass: aClass`**

Ignored - necessary to support disjoint class hierarchies

**`subclass: classNameString`**

Define a subclass of the receiver with the given name.  If the
class is already defined, don't modify its instance or class
variables but still, if necessary, recompile everything needed.

**`subclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames category: categoryNameString`**

Define a fixed subclass of the receiver with the given name,
instance variables, class variables, pool dictionaries and
category.  If the class is already defined, if necessary, recompile
everything needed.

**`variable: shape subclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames category: categoryNameString`**

Define a variable subclass of the receiver with the given name,
shape, instance variables, class variables, pool dictionaries and
category.  If the class is already defined, if necessary, recompile
everything needed.  The shape can be one of #byte #int8 #character
\#short #ushort #int #uint #int64 #uint64 #utf32 #float #double or
\#pointer.

**`variableByteSubclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames category: categoryNameString`**

Define a byte variable subclass of the receiver with the given
name, instance variables, class variables, pool dictionaries and
category.  If the class is already defined, if necessary, recompile
everything needed.

**`variableSubclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames category: categoryNameString`**

Define a variable pointer subclass of the receiver with the given
name, instance variables, class variables, pool dictionaries and
category.  If the class is already defined, if necessary, recompile
everything needed.

**`variableWordSubclass: classNameString instanceVariableNames: stringInstVarNames classVariableNames: stringOfClassVarNames poolDictionaries: stringOfPoolNames category: categoryNameString`**

Define a word variable subclass of the receiver with the given
name, instance variables, class variables, pool dictionaries and
category.  If the class is already defined, if necessary, recompile
everything needed.

#### 1.201.4 UndefinedObject: CObject interoperability

**`free`**

Do nothing, a NULL pointer can be safely freed.

**`narrow`**

Return the receiver: a NULL pointer is always nil, whatever its
type.

#### 1.201.5 UndefinedObject: dependents access

**`addDependent: ignored`**

Fail, nil does not support dependents.

**`release`**

Ignore this call, nil does not support dependents.

#### 1.201.6 UndefinedObject: iteration

**`ifNil: nilBlock ifNotNilDo: iterableBlock`**

Evaluate nilBlock if the receiver is nil, else evaluate
iterableBlock with each element of the receiver (which should be an
Iterable).

**`ifNotNilDo: iterableBlock`**

Evaluate iterableBlock with each element of the receiver (which
should be an Iterable) if not nil.  Else answer nil

**`ifNotNilDo: iterableBlock ifNil: nilBlock`**

Evaluate nilBlock if the receiver is nil, else evaluate
iterableBlock, passing each element of the receiver (which should
be an Iterable).

#### 1.201.7 UndefinedObject: printing

**`printOn: aStream`**

Print a representation of the receiver on aStream.

**`printOn: aStream in: aNamespace`**

Print on aStream a representation of the receiver as it would be
accessed from aNamespace: nil is the same everywhere, so print the
same as #printOn:

#### 1.201.8 UndefinedObject: still unclassified

**`inheritsFrom: aClass`**

Always return false, as nil inherits from nothing.

#### 1.201.9 UndefinedObject: storing

**`isLiteralObject`**

Answer whether the receiver is expressible as a Smalltalk literal.

**`storeLiteralOn: aStream`**

Store on aStream some Smalltalk code which compiles to the receiver

**`storeOn: aStream`**

Store Smalltalk code compiling to the receiver on aStream.

#### 1.201.10 UndefinedObject: testing

**`ifNil: nilBlock`**

Evaluate nilBlock if the receiver is nil, else answer nil

**`ifNil: nilBlock ifNotNil: notNilBlock`**

Evaluate nilBlock if the receiver is nil, else evaluate
notNilBlock, passing the receiver.

**`ifNotNil: notNilBlock`**

Evaluate notNilBlock if the receiver is not nil, passing the
receiver.  Else answer nil

**`ifNotNil: notNilBlock ifNil: nilBlock`**

Evaluate nilBlock if the receiver is nil, else evaluate
notNilBlock, passing the receiver.

**`isNil`**

Answer whether the receiver is the undefined object nil.  Always
answer true.

**`isNull`**

Answer whether the receiver represents a NULL C pointer.  Always
answer true.

**`notNil`**

Answer whether the receiver is not the undefined object nil.
Always answer false.

### 1.202 UnicodeCharacter

**Namespace:** Smalltalk · **Superclass:** [Character](#128-character) · **Category:** Language-Data types

My instances represent the over one million characters of the
Unicode character set.  It provides messages to translate between
integers and character objects.

UnicodeCharacter objects are created when accessing UnicodeStrings,
or with Character class\>\>#codePoint:.

#### 1.202.1 UnicodeCharacter class: built ins

**`value: anInteger`**

Returns the character object, possibly a Character, corresponding
to anInteger.  Error if anInteger is not an integer, or not in
0\..16r10FFFF.

This is only a primitive for speed.  UnicodeCharacter's #value:
method is equivalent to #codePoint: (which is the same for
Character and UnicodeCharacter).

#### 1.202.2 UnicodeCharacter: coercion methods

**`* aNumber`**

Returns a String with aNumber occurrences of the receiver.

### 1.203 UnicodeString

**Namespace:** Smalltalk · **Superclass:** [CharacterArray](#129-characterarray) · **Category:** Collections-Text

My instances represent Unicode string data types.  Data is stored
as 4-byte UTF-32 characters

#### 1.203.1 UnicodeString class: converting

**`fromString: aString`**

Return the String, aString, converted to its Unicode
representation.  Unless the I18N package is loaded, this is not
implemented.

#### 1.203.2 UnicodeString class: multibyte encodings

**`defaultEncoding`**

Answer the encoding used by the receiver.  Conventionally, we
answer 'Unicode' to ensure that two UnicodeStrings always have the
same encoding.

**`isUnicode`**

Answer true; the receiver stores characters.

#### 1.203.3 UnicodeString: built ins

**`at: anIndex ifAbsent: aBlock`**

Answer the index-th indexed instance variable of the receiver

#### 1.203.4 UnicodeString: built-ins

**`hash`**

Answer an hash value for the receiver

#### 1.203.5 UnicodeString: converting

**`asString`**

Returns the string corresponding to the receiver.  Without the
Iconv package, unrecognized Unicode characters become $?
characters.  When it is loaded, an appropriate single- or
multi-byte encoding could be used.

**`asSymbol`**

Returns the symbol corresponding to the receiver

**`asUnicodeString`**

But I already am a UnicodeString!  Really!

**`displayOn: aStream`**

Print a representation of the receiver on aStream

**`printOn: aStream`**

Print a representation of the receiver on aStream

#### 1.203.6 UnicodeString: multibyte encodings

**`encoding`**

Answer the encoding used by the receiver.  Conventionally, we
answer 'Unicode' to ensure that two UnicodeStrings always have the
same encoding.

**`numberOfCharacters`**

Answer the number of Unicode characters in the receiver.  This is
the same as #size for UnicodeString.

### 1.204 ValueAdaptor

**Namespace:** Smalltalk · **Superclass:** [Object](#1123-object) · **Category:** Language-Data types

My subclasses are used to access data from different objects with a
consistent protocol.  However, I'm an abstract class.

#### 1.204.1 ValueAdaptor class: creating instances

**`new`**

We don't know enough of subclasses to have a shared implementation
of new

#### 1.204.2 ValueAdaptor: accessing

**`value`**

Retrive the value of the receiver.  Must be implemented by
ValueAdaptor's subclasses

**`value: anObject`**

Set the value of the receiver.  Must be implemented by
ValueAdaptor's subclasses

#### 1.204.3 ValueAdaptor: printing

**`printOn: aStream`**

Print a representation of the receiver

### 1.205 ValueHolder

**Namespace:** Smalltalk · **Superclass:** [ValueAdaptor](#1204-valueadaptor) · **Category:** Language-Data types

I store my value in a variable.  For example, you can use me to
pass numbers by reference.  Just instance me before calling a
method and ask for my value after that method.  There are a lot of
other creative uses for my intances, though.

#### 1.205.1 ValueHolder class: creating instances

**`new`**

Create a ValueHolder whose starting value is nil

**`null`**

Answer the sole instance of NullValueHolder

**`with: anObject`**

Create a ValueHolder whose starting value is anObject

#### 1.205.2 ValueHolder: accessing

**`value`**

Get the value of the receiver.

**`value: anObject`**

Set the value of the receiver.

#### 1.205.3 ValueHolder: initializing

**`initialize`**

Private - set the initial value of the receiver

### 1.206 VariableBinding

**Namespace:** Smalltalk · **Superclass:** [HomedAssociation](#189-homedassociation) · **Category:** Language-Data types

My instances represent a mapping between a key in a namespace and
its value.  I print different than a normal Association, and know
about my parent namespace, otherwise my behavior is the same.

#### 1.206.1 VariableBinding: compiler

**`literalEquals: anObject`**

Not commented.

**`literalHash`**

Not commented.

#### 1.206.2 VariableBinding: printing

**`path`**

Print a dotted path that compiles to the receiver's value

**`printOn: aStream`**

Put on aStream a representation of the receiver

#### 1.206.3 VariableBinding: saving and loading

**`binaryRepresentationObject`**

This method is implemented to allow for a PluggableProxy to be used
with VariableBindings.  Answer a DirectedMessage which sends #at:
to the environment that holds the receiver.

#### 1.206.4 VariableBinding: storing

**`isLiteralObject`**

Answer whether the receiver is expressible as a Smalltalk literal.

**`storeLiteralOn: aStream`**

Store on aStream some Smalltalk code which compiles to the receiver

**`storeOn: aStream`**

Put on aStream some Smalltalk code compiling to the receiver

#### 1.206.5 VariableBinding: testing

**`isDefined`**

Answer true if this VariableBinding lives outside the Undeclared
dictionary

### 1.207 VersionableObjectProxy

**Namespace:** Smalltalk · **Superclass:** [NullProxy](#1120-nullproxy) · **Category:** Streams-Files

I am a proxy that stores additional information to allow different
versions of an object's representations to be handled by the
program.  VersionableObjectProxies are backwards compatible, that
is you can support versioning even if you did not use a
VersionableObjectProxy for that class when the object was
originarily dumped.  VersionableObjectProxy does not support
classes that changed shape across different versions.  See the
method comments for more information.

#### 1.207.1 VersionableObjectProxy class: saving and restoring

**`loadFrom: anObjectDumper`**

Retrieve the object.  If the version number doesn't match the
\#binaryRepresentationVersion answered by the class, call the class'
\#convertFromVersion:withFixedVariables:instanceVariables:for:
method.  The stored version number will be the first parameter to
that method (or nil if the stored object did not employ a
VersionableObjectProxy), the remaining parameters will be
respectively the fixed instance variables, the indexed instance
variables (or nil if the class is fixed), and the ObjectDumper
itself.  If no VersionableObjectProxy, the class is sent
\#nonVersionedInstSize to retrieve the number of fixed instance
variables stored for the non-versioned object.

#### 1.207.2 VersionableObjectProxy: saving and restoring

**`dumpTo: anObjectDumper`**

Save the object with extra versioning information.

### 1.208 VFS.ArchiveFile

**Namespace:** Smalltalk.VFS · **Superclass:** [VFS.FileWrapper](#1210-vfsfilewrapper) · **Category:** Streams-Files

ArchiveFile handles virtual filesystems that have a directory
structure of their own.  The directories and files in the archive
are instances of ArchiveMember, but the functionality resides
entirely in ArchiveFile because the members will still ask the
archive to get directory information on them, to extract them to a
real file, and so on.

#### 1.208.1 VFS.ArchiveFile: ArchiveMember protocol

**`fillMember: anArchiveMember`**

Extract the information on anArchiveMember.  Answer false if it
actually does not exist in the archive; otherwise, answer true
after having told anArchiveMember about them by sending
\#size:stCtime:stMtime:stAtime:isDirectory: to it.

**`member: anArchiveMember do: aBlock`**

Evaluate aBlock once for each file in the directory represented by
anArchiveMember, passing its name.

**`member: anArchiveMember mode: bits`**

Set the permission bits for the file in anArchiveMember.

**`refresh`**

Extract the directory listing from the archive

**`removeMember: anArchiveMember`**

Remove the member represented by anArchiveMember.

**`updateMember: anArchiveMember`**

Update the member represented by anArchiveMember by copying the
file into which it was extracted back to the archive.

#### 1.208.2 VFS.ArchiveFile: directory operations

**`at: aName`**

Answer a FilePath for a file named 'aName' residing in the
directory represented by the receiver.

**`nameAt: aString`**

Answer a FilePath for a file named 'aName' residing in the
directory represented by the receiver.

**`namesDo: aBlock`**

Evaluate aBlock once for each file in the directory represented by
the receiver, passing its name.

**`release`**

Release the resources used by the receiver that don't survive when
reloading a snapshot.

#### 1.208.3 VFS.ArchiveFile: querying

**`isAccessible`**

Answer whether a directory with the name contained in the receiver
does exist and can be accessed

**`isDirectory`**

Answer true.  The archive can always be considered as a directory.

#### 1.208.4 VFS.ArchiveFile: still unclassified

**`displayOn: aStream`**

Print a representation of the file identified by the receiver.

#### 1.208.5 VFS.ArchiveFile: TmpFileArchiveMember protocol

**`extractMember: anArchiveMember`**

Extract the contents of anArchiveMember into a file that resides on
disk, and answer the name of the file.

**`extractMember: anArchiveMember into: file`**

Extract the contents of anArchiveMember into a file that resides on
disk, and answer the name of the file.

### 1.209 VFS.ArchiveMember

**Namespace:** Smalltalk.VFS · **Superclass:** [FilePath](#177-filepath) · **Category:** Streams-Files

TmpFileArchiveMember is a handler class for members of archive
files that creates temporary files when extracting files from an
archive.

#### 1.209.1 VFS.ArchiveMember: accessing

**`archive`**

Answer the archive of which the receiver is a member.

**`asString`**

Answer the name of the file identified by the receiver as answered
by File\>\>#name.

**`creationTime`**

Answer the creation time of the file identified by the receiver.
On some operating systems, this could actually be the last change
time (the 'last change time' has to do with permissions, ownership
and the like).

**`lastAccessTime`**

Answer the last access time of the file identified by the receiver

**`lastChangeTime`**

Answer the last change time of the file identified by the receiver
(the 'last change time' has to do with permissions, ownership and
the like).  On some operating systems, this could actually be the
file creation time.

**`lastModifyTime`**

Answer the last modify time of the file identified by the receiver
(the 'last modify time' has to do with the actual file contents).

**`name`**

Answer the receiver's file name.

**`name: aName`**

Set the receiver's file name to aName.

**`refresh`**

Refresh the statistics for the receiver

**`size`**

Answer the size of the file identified by the receiver

#### 1.209.2 VFS.ArchiveMember: basic

**`= aFile`**

Answer whether the receiver represents the same file as the
receiver.

**`hash`**

Answer a hash value for the receiver.

#### 1.209.3 VFS.ArchiveMember: delegation

**`full`**

Answer the size of the file identified by the receiver

#### 1.209.4 VFS.ArchiveMember: directory operations

**`at: aName`**

Answer a FilePath for a file named 'aName' residing in the
directory represented by the receiver.

**`createDirectory: dirName`**

Create a subdirectory of the receiver, naming it dirName.

**`namesDo: aBlock`**

Evaluate aBlock once for each file in the directory represented by
the receiver, passing its name.

#### 1.209.5 VFS.ArchiveMember: file operations

**`open: class mode: mode ifFail: aBlock`**

Open the receiver in the given mode (as answered by FileStream's
class constant methods)

**`remove`**

Remove the file with the given path name

**`renameTo: newFileName`**

Rename the file with the given path name oldFileName to newFileName

**`update: aspect`**

Private - Update the in-archive version of the file before closing.

#### 1.209.6 VFS.ArchiveMember: initializing

**`archive: anArchiveFile`**

Set the archive of which the receiver is a member.

**`fillFrom: data`**

Called back by the receiver's archive when the ArchiveMember asks
for file information.

**`size: bytes stCtime: ctime stMtime: mtime stAtime: atime mode: modeBits`**

Set the file information for the receiver.

**`size: bytes stMtime: mtime mode: modeBits`**

Set the file information for the receiver.

#### 1.209.7 VFS.ArchiveMember: still unclassified

**`, aName`**

Answer an object of the same kind as the receiver, whose name is
suffixed with aName.

**`displayOn: aStream`**

Print a representation of the file identified by the receiver.

**`isAbsolute`**

Answer whether the receiver identifies an absolute path.

#### 1.209.8 VFS.ArchiveMember: testing

**`exists`**

Answer whether a file with the name contained in the receiver does
exist.

**`isAccessible`**

Answer whether a directory with the name contained in the receiver
does exist and is accessible

**`isDirectory`**

Answer whether a file with the name contained in the receiver does
exist and identifies a directory.

**`isExecutable`**

Answer whether a file with the name contained in the receiver does
exist and is executable

**`isReadable`**

Answer whether a file with the name contained in the receiver does
exist and is readable

**`isSymbolicLink`**

Answer whether a file with the name contained in the receiver does
exist and identifies a symbolic link.

**`isWriteable`**

Answer whether a file with the name contained in the receiver does
exist and is writeable

**`mode`**

Answer the octal permissions for the file.

**`mode: mode`**

Set the octal permissions for the file to be 'mode'.

### 1.210 VFS.FileWrapper

**Namespace:** Smalltalk.VFS · **Superclass:** [FilePath](#177-filepath) · **Category:** Streams-Files

FileWrapper gives information for virtual files that refer to a
real file on disk.

#### 1.210.1 VFS.FileWrapper class: initializing

**`initialize`**

Register the receiver with ObjectMemory

**`update: aspect`**

Private - Remove the files before quitting, and register the
virtual filesystems specified by the subclasses upon image load.

#### 1.210.2 VFS.FileWrapper class: instance creation

**`on: file`**

Create an instance of this class representing the contents of the
given file, under the virtual filesystem fsName.

#### 1.210.3 VFS.FileWrapper: accessing

**`asString`**

Answer the string representation of the receiver's path.

**`at: aName`**

Answer a File or Directory object as appropriate for a file named
'aName' in the directory represented by the receiver.

**`lastAccessTime: accessDateTime lastModifyTime: modifyDateTime`**

Update the timestamps of the file corresponding to the receiver, to
be accessDateTime and modifyDateTime.

**`name`**

Answer the full path to the receiver.

**`owner: ownerString group: groupString`**

Set the receiver's owner and group to be ownerString and
groupString.

**`pathTo: destName`**

Compute the relative path from the receiver to destName.

#### 1.210.4 VFS.FileWrapper: basic

**`= aFile`**

Answer whether the receiver represents the same file as the
receiver.

**`hash`**

Answer a hash value for the receiver.

#### 1.210.5 VFS.FileWrapper: delegation

**`creationTime`**

Answer the creation time of the file identified by the receiver.
On some operating systems, this could actually be the last change
time (the 'last change time' has to do with permissions, ownership
and the like).

**`full`**

Answer the size of the file identified by the receiver

**`isExecutable`**

Answer whether a file with the name contained in the receiver does
exist and is executable

**`isReadable`**

Answer whether a file with the name contained in the receiver does
exist and is readable

**`isWriteable`**

Answer whether a file with the name contained in the receiver does
exist and is writeable

**`lastAccessTime`**

Answer the last access time of the file identified by the receiver

**`lastChangeTime`**

Answer the last change time of the file identified by the receiver
(the 'last change time' has to do with permissions, ownership and
the like).  On some operating systems, this could actually be the
file creation time.

**`lastModifyTime`**

Answer the last modify time of the file identified by the receiver
(the 'last modify time' has to do with the actual file contents).

**`mode`**

Answer the permission bits for the file identified by the receiver

**`mode: anInteger`**

Answer the permission bits for the file identified by the receiver

**`open: class mode: mode ifFail: aBlock`**

Open the receiver in the given mode (as answered by FileStream's
class constant methods)

**`remove`**

Remove the file with the given path name

**`size`**

Answer the size of the file identified by the receiver

#### 1.210.6 VFS.FileWrapper: enumerating

**`namesDo: aBlock`**

Evaluate aBlock once for each file in the directory represented by
the receiver, passing its name.

#### 1.210.7 VFS.FileWrapper: file operations

**`pathFrom: dirName`**

Compute the relative path from the directory dirName to the
receiver

**`renameTo: newName`**

Rename the file identified by the receiver to newName

**`symlinkAs: destName`**

Create destName as a symbolic link of the receiver.  The
appropriate relative path is computed automatically.

**`symlinkFrom: srcName`**

Create the receiver as a symbolic link from srcName (relative to
the path of the receiver).

#### 1.210.8 VFS.FileWrapper: testing

**`exists`**

Answer whether a file with the name contained in the receiver does
exist.

**`isAbsolute`**

Answer whether the receiver identifies an absolute path.

**`isAccessible`**

Answer whether a directory with the name contained in the receiver
does exist and can be accessed

**`isDirectory`**

Answer whether a file with the name contained in the receiver does
exist identifies a directory.

**`isSymbolicLink`**

Answer whether a file with the name contained in the receiver does
exist and identifies a symbolic link.

### 1.211 VFS.StoredZipMember

**Namespace:** Smalltalk.VFS · **Superclass:** [VFS.TmpFileArchiveMember](#1212-vfstmpfilearchivemember) · **Category:** Streams-Files

ArchiveMember is the handler class for stored ZIP archive members,
which are optimized.

#### 1.211.1 VFS.StoredZipMember: accessing

**`offset`**

Answer 'offset'.

**`offset: anInteger`**

Not commented.

#### 1.211.2 VFS.StoredZipMember: opening

**`open: class mode: mode ifFail: aBlock`**

Not commented.

### 1.212 VFS.TmpFileArchiveMember

**Namespace:** Smalltalk.VFS · **Superclass:** [VFS.ArchiveMember](#1209-vfsarchivemember) · **Category:** Streams-Files

#### 1.212.1 VFS.TmpFileArchiveMember: directory operations

**`file`**

Answer the real file name which holds the file contents, or nil if
it does not apply.

**`open: class mode: mode ifFail: aBlock`**

Open the receiver in the given mode (as answered by FileStream's
class constant methods)

#### 1.212.2 VFS.TmpFileArchiveMember: finalization

**`release`**

Release the resources used by the receiver that don't survive when
reloading a snapshot.

#### 1.212.3 VFS.TmpFileArchiveMember: still unclassified

**`extracted`**

Answer whether the file has already been extracted to disk.

### 1.213 VFS.ZipFile

**Namespace:** Smalltalk.VFS · **Superclass:** [VFS.ArchiveFile](#1208-vfsarchivefile) · **Category:** Streams-Files

ZipFile transparently extracts files from a ZIP archive.

#### 1.213.1 VFS.ZipFile: members

**`centralDirectoryRangeIn: f`**

Not commented.

**`createDirectory: dirName`**

Create a subdirectory of the receiver, naming it dirName.

**`extractMember: anArchiveMember into: temp`**

Extract the contents of anArchiveMember into a file that resides on
disk, and answer the name of the file.

**`fileData`**

Extract the directory listing from the archive

**`member: anArchiveMember mode: bits`**

Set the permission bits for the file in anArchiveMember.

**`removeMember: anArchiveMember`**

Remove the member represented by anArchiveMember.

**`updateMember: anArchiveMember`**

Update the member represented by anArchiveMember by copying the
file into which it was extracted back to the archive.

### 1.214 Warning

**Namespace:** Smalltalk · **Superclass:** [Notification](#1119-notification) · **Category:** Language-Exceptions

Warning represents an 'important' but resumable error.

#### 1.214.1 Warning: exception description

**`description`**

Answer a textual description of the exception.

### 1.215 WeakArray

**Namespace:** Smalltalk · **Superclass:** [Array](#14-array) · **Category:** Collections-Weak

I am similar to a plain array, but my items are stored in a weak
object, so I track which of them are garbage collected.

#### 1.215.1 WeakArray class: instance creation

**`new`**

Create a new WeakArray of size 0.

**`new: size`**

Create a new WeakArray of the given size.

#### 1.215.2 WeakArray: accessing

**`aliveObjectsDo: aBlock`**

Evaluate aBlock for all the elements in the array, excluding the
garbage collected ones.  Note: a finalized object stays alive until
the next collection (the collector has no means to see whether it
was resuscitated by the finalizer), so an object being alive does
not mean that it is usable.

**`at: index`**

Answer the index-th item of the receiver, or nil if it has been
garbage collected.

**`at: index put: object`**

Store the value associated to the given index; plus, store in
nilValues whether the object is nil.  nil objects whose associated
item of nilValues is 1 were touched by the garbage collector.

**`atAll: indices put: object`**

Put object at every index contained in the indices collection

**`atAllPut: object`**

Put object at every index in the receiver

**`clearGCFlag: index`**

Clear the 'object has been garbage collected' flag for the item at
the given index

**`do: aBlock`**

Evaluate aBlock for all the elements in the array, including the
garbage collected ones (pass nil for those).

**`isAlive: index`**

Answer whether the item at the given index is still alive or has
been garbage collected.  Note: a finalized object stays alive until
the next collection (the collector has no means to see whether it
was resuscitated by the finalizer), so an object being alive does
not mean that it is usable.

**`size`**

Answer the number of items in the receiver

#### 1.215.3 WeakArray: conversion

**`asArray`**

Answer a non-weak version of the receiver

**`deepCopy`**

Returns a deep copy of the receiver (the instance variables are
copies of the receiver's instance variables)

**`shallowCopy`**

Returns a shallow copy of the receiver (the instance variables are
not copied)

**`species`**

Answer Array; this method is used in the #copyEmpty: message, which
in turn is used by all collection-returning methods (collect:,
select:, reject:, etc.).

#### 1.215.4 WeakArray: loading

**`postLoad`**

Called after loading an object; must restore it to the state before
'preStore' was called.  Make it weak again

### 1.216 WeakIdentitySet

**Namespace:** Smalltalk · **Superclass:** [WeakSet](#1219-weakset) · **Category:** Collections-Weak

I am similar to a plain identity set, but my keys are stored in a
weak array; I track which of them are garbage collected and, as
soon as I encounter one of them, I swiftly remove all the garbage
collected keys

#### 1.216.1 WeakIdentitySet: accessing

**`identityIncludes: anObject`**

Answer whether I include anObject exactly.  As I am an
identity-set, this is the same as #includes:.

### 1.217 WeakKeyDictionary

**Namespace:** Smalltalk · **Superclass:** [Dictionary](#164-dictionary) · **Category:** Collections-Weak

I am similar to a plain Dictionary, but my keys are stored in a
weak array; I track which of them are garbage collected and, as
soon as I encounter one of them, I swiftly remove all the
associations for the garbage collected keys

#### 1.217.1 WeakKeyDictionary class: hacks

**`postLoad`**

Called after loading an object; must restore it to the state before
'preStore' was called.  Make it weak again

#### 1.217.2 WeakKeyDictionary: accessing

**`add: anAssociation`**

Store value as associated to the given key.

**`at: key put: value`**

Store value as associated to the given key.

### 1.218 WeakKeyIdentityDictionary

**Namespace:** Smalltalk · **Superclass:** [WeakKeyDictionary](#1217-weakkeydictionary) · **Category:** Collections-Weak

I am similar to a plain identity dictionary, but my keys are stored
in a weak array; I track which of them are garbage collected and,
as soon as I encounter one of them, I swiftly remove all the
associations for the garbage collected keys

### 1.219 WeakSet

**Namespace:** Smalltalk · **Superclass:** [Set](#1152-set) · **Category:** Collections-Weak

I am similar to a plain set, but my items are stored in a weak
array; I track which of them are garbage collected and, as soon as
I encounter one of them, I swiftly remove all.

#### 1.219.1 WeakSet: accessing

**`add: newObject`**

Add newObject to the set, if and only if the set doesn't already
contain an occurrence of it.  Don't fail if a duplicate is found.
Answer newObject

**`do: aBlock`**

Enumerate all the non-nil members of the set

#### 1.219.2 WeakSet: copying

**`deepCopy`**

Returns a deep copy of the receiver (the instance variables are
copies of the receiver's instance variables)

**`shallowCopy`**

Returns a shallow copy of the receiver (the instance variables are
not copied)

#### 1.219.3 WeakSet: loading

**`postLoad`**

Called after loading an object; must restore it to the state before
'preStore' was called.  Make it weak again

### 1.220 WeakValueIdentityDictionary

**Namespace:** Smalltalk · **Superclass:** [WeakValueLookupTable](#1221-weakvaluelookuptable) · **Category:** Collections-Weak

I am similar to a plain identity dictionary, but my values are
stored in a weak array; I track which of the values are garbage
collected and, as soon as one of them is accessed, I swiftly remove
the associations for the garbage collected values

### 1.221 WeakValueLookupTable

**Namespace:** Smalltalk · **Superclass:** [LookupTable](#1106-lookuptable) · **Category:** Collections-Weak

I am similar to a plain LookupTable, but my values are stored in a
weak array; I track which of the values are garbage collected and,
as soon as one of them is accessed, I swiftly remove the
associations for the garbage collected values

#### 1.221.1 WeakValueLookupTable class: hacks

**`primNew: realSize`**

Answer a new, uninitialized instance of the receiver with the given
size

#### 1.221.2 WeakValueLookupTable: hacks

**`at: key ifAbsent: aBlock`**

Answer the value associated to the given key, or the result of
evaluating aBlock if the key is not found

**`at: key ifPresent: aBlock`**

If aKey is absent, answer nil.  Else, evaluate aBlock passing the
associated value and answer the result of the invocation

**`includesKey: key`**

Answer whether the receiver contains the given key.

#### 1.221.3 WeakValueLookupTable: rehashing

**`rehash`**

Rehash the receiver

### 1.222 WordArray

**Namespace:** Smalltalk · **Superclass:** [ArrayedCollection](#15-arrayedcollection) · **Category:** Collections-Sequenceable

I am similar to a plain array, but my items are 32-bit integers.

#### 1.222.1 WordArray: built ins

**`at: anIndex ifAbsent: aBlock`**

Answer the index-th indexed instance variable of the receiver

### 1.223 WriteStream

**Namespace:** Smalltalk · **Superclass:** [PositionableStream](#1133-positionablestream) · **Category:** Streams-Collections

I am the class of writeable streams.  I only allow write operations
to my instances; reading is strictly forbidden.

#### 1.223.1 WriteStream class: instance creation

**`on: aCollection`**

Answer a new instance of the receiver which streams on aCollection.
Every item of aCollection is discarded.

**`with: aCollection`**

Answer a new instance of the receiver which streams from the end of
aCollection.

**`with: aCollection from: firstIndex to: lastIndex`**

Answer a new instance of the receiver which streams from the
firstIndex-th item of aCollection to the lastIndex-th.  The pointer
is moved to the last item in that range.

#### 1.223.2 WriteStream: accessing-writing

**`contents`**

Returns a collection of the same type that the stream accesses, up
to and including the final element.

**`next: n putAll: aCollection startingAt: pos`**

Put n characters or bytes of aCollection, starting at the pos-th,
in the collection buffer.

**`nextPut: anObject`**

Store anObject as the next item in the receiver.  Grow the
collection if necessary

**`readStream`**

Answer a ReadStream on the same contents as the receiver

**`reverseContents`**

Returns a collection of the same type that the stream accesses, up
to and including the final element, but in reverse order.

#### 1.223.3 WriteStream: positioning

**`emptyStream`**

Extension - Reset the stream

### 1.224 ZeroDivide

**Namespace:** Smalltalk · **Superclass:** [ArithmeticError](#13-arithmeticerror) · **Category:** Language-Exceptions

A ZeroDivide exception is raised by numeric classes when a program
tries to divide by zero.  Information on the dividend is available
to the handler.

#### 1.224.1 ZeroDivide class: instance creation

**`dividend: aNumber`**

Create a new ZeroDivide object remembering that the dividend was
aNumber.

**`new`**

Create a new ZeroDivide object; the dividend is conventionally set
to zero.

#### 1.224.2 ZeroDivide: accessing

**`dividend`**

Answer the number that was being divided by zero

#### 1.224.3 ZeroDivide: description

**`description`**

Answer a textual description of the exception.

## Class index

- `AbstractNamespace` — [AbstractNamespace](#11-abstractnamespace)
- `AlternativeObjectProxy` — [AlternativeObjectProxy](#12-alternativeobjectproxy)
- `ArithmeticError` — [ArithmeticError](#13-arithmeticerror)
- `Array` — [Array](#14-array)
- `ArrayedCollection` — [ArrayedCollection](#15-arrayedcollection)
- `Association` — [Association](#16-association)
- `Autoload` — [Autoload](#17-autoload)
- `Bag` — [Bag](#18-bag)
- `Behavior` — [Behavior](#19-behavior)
- `BindingDictionary` — [BindingDictionary](#110-bindingdictionary)
- `BlockClosure` — [BlockClosure](#111-blockclosure)
- `BlockContext` — [BlockContext](#112-blockcontext)
- `Boolean` — [Boolean](#113-boolean)
- `ByteArray` — [ByteArray](#114-bytearray)
- `CAggregate` — [CAggregate](#115-caggregate)
- `CallinProcess` — [CallinProcess](#116-callinprocess)
- `CArray` — [CArray](#117-carray)
- `CArrayCType` — [CArrayCType](#118-carrayctype)
- `CBoolean` — [CBoolean](#119-cboolean)
- `CByte` — [CByte](#120-cbyte)
- `CCallable` — [CCallable](#121-ccallable)
- `CCallbackDescriptor` — [CCallbackDescriptor](#122-ccallbackdescriptor)
- `CChar` — [CChar](#123-cchar)
- `CCompound` — [CCompound](#124-ccompound)
- `CDouble` — [CDouble](#125-cdouble)
- `CFloat` — [CFloat](#126-cfloat)
- `CFunctionDescriptor` — [CFunctionDescriptor](#127-cfunctiondescriptor)
- `Character` — [Character](#128-character)
- `CharacterArray` — [CharacterArray](#129-characterarray)
- `CInt` — [CInt](#130-cint)
- `Class` — [Class](#131-class)
- `ClassDescription` — [ClassDescription](#132-classdescription)
- `CLong` — [CLong](#133-clong)
- `CLongDouble` — [CLongDouble](#134-clongdouble)
- `CLongLong` — [CLongLong](#135-clonglong)
- `CObject` — [CObject](#136-cobject)
- `Collection` — [Collection](#137-collection)
- `CompiledBlock` — [CompiledBlock](#138-compiledblock)
- `CompiledCode` — [CompiledCode](#139-compiledcode)
- `CompiledMethod` — [CompiledMethod](#140-compiledmethod)
- `ContextPart` — [ContextPart](#141-contextpart)
- `Continuation` — [Continuation](#142-continuation)
- `CPtr` — [CPtr](#143-cptr)
- `CPtrCType` — [CPtrCType](#144-cptrctype)
- `CScalar` — [CScalar](#145-cscalar)
- `CScalarCType` — [CScalarCType](#146-cscalarctype)
- `CShort` — [CShort](#147-cshort)
- `CSmalltalk` — [CSmalltalk](#148-csmalltalk)
- `CString` — [CString](#149-cstring)
- `CStringCType` — [CStringCType](#150-cstringctype)
- `CStruct` — [CStruct](#151-cstruct)
- `CType` — [CType](#152-ctype)
- `CUChar` — [CUChar](#153-cuchar)
- `CUInt` — [CUInt](#154-cuint)
- `CULong` — [CULong](#155-culong)
- `CULongLong` — [CULongLong](#156-culonglong)
- `CUnion` — [CUnion](#157-cunion)
- `CUShort` — [CUShort](#158-cushort)
- `Date` — [Date](#159-date)
- `DateTime` — [DateTime](#160-datetime)
- `DeferredVariableBinding` — [DeferredVariableBinding](#161-deferredvariablebinding)
- `Delay` — [Delay](#162-delay)
- `DelayedAdaptor` — [DelayedAdaptor](#163-delayedadaptor)
- `Dictionary` — [Dictionary](#164-dictionary)
- `DirectedMessage` — [DirectedMessage](#165-directedmessage)
- `Directory` — [Directory](#166-directory)
- `DLD` — [DLD](#167-dld)
- `DumperProxy` — [DumperProxy](#168-dumperproxy)
- `Duration` — [Duration](#169-duration)
- `DynamicVariable` — [DynamicVariable](#170-dynamicvariable)
- `Error` — [Error](#171-error)
- `Exception` — [Exception](#172-exception)
- `ExceptionSet` — [ExceptionSet](#173-exceptionset)
- `False` — [False](#174-false)
- `File` — [File](#175-file)
- `FileDescriptor` — [FileDescriptor](#176-filedescriptor)
- `FilePath` — [FilePath](#177-filepath)
- `FileSegment` — [FileSegment](#178-filesegment)
- `FileStream` — [FileStream](#179-filestream)
- `Float` — [Float](#180-float)
- `FloatD` — [FloatD](#181-floatd)
- `FloatE` — [FloatE](#182-floate)
- `FloatQ` — [FloatQ](#183-floatq)
- `Fraction` — [Fraction](#184-fraction)
- `Generator` — [Generator](#185-generator)
- `Getopt` — [Getopt](#186-getopt)
- `Halt` — [Halt](#187-halt)
- `HashedCollection` — [HashedCollection](#188-hashedcollection)
- `HomedAssociation` — [HomedAssociation](#189-homedassociation)
- `IdentityDictionary` — [IdentityDictionary](#190-identitydictionary)
- `IdentitySet` — [IdentitySet](#191-identityset)
- `Integer` — [Integer](#192-integer)
- `Interval` — [Interval](#193-interval)
- `Iterable` — [Iterable](#194-iterable)
- `LargeArray` — [LargeArray](#195-largearray)
- `LargeArrayedCollection` — [LargeArrayedCollection](#196-largearrayedcollection)
- `LargeByteArray` — [LargeByteArray](#197-largebytearray)
- `LargeInteger` — [LargeInteger](#198-largeinteger)
- `LargeNegativeInteger` — [LargeNegativeInteger](#199-largenegativeinteger)
- `LargePositiveInteger` — [LargePositiveInteger](#1100-largepositiveinteger)
- `LargeWordArray` — [LargeWordArray](#1101-largewordarray)
- `LargeZeroInteger` — [LargeZeroInteger](#1102-largezerointeger)
- `Link` — [Link](#1103-link)
- `LinkedList` — [LinkedList](#1104-linkedlist)
- `LookupKey` — [LookupKey](#1105-lookupkey)
- `LookupTable` — [LookupTable](#1106-lookuptable)
- `Magnitude` — [Magnitude](#1107-magnitude)
- `MappedCollection` — [MappedCollection](#1108-mappedcollection)
- `Memory` — [Memory](#1109-memory)
- `Message` — [Message](#1110-message)
- `MessageNotUnderstood` — [MessageNotUnderstood](#1111-messagenotunderstood)
- `Metaclass` — [Metaclass](#1112-metaclass)
- `MethodContext` — [MethodContext](#1113-methodcontext)
- `MethodDictionary` — [MethodDictionary](#1114-methoddictionary)
- `MethodInfo` — [MethodInfo](#1115-methodinfo)
- `Namespace` — [Namespace](#1116-namespace)
- `NetClients.URIResolver` — [NetClients.URIResolver](#1117-netclientsuriresolver)
- `NetClients.URL` — [NetClients.URL](#1118-netclientsurl)
- `Notification` — [Notification](#1119-notification)
- `NullProxy` — [NullProxy](#1120-nullproxy)
- `NullValueHolder` — [NullValueHolder](#1121-nullvalueholder)
- `Number` — [Number](#1122-number)
- `Object` — [Object](#1123-object)
- `ObjectDumper` — [ObjectDumper](#1124-objectdumper)
- `ObjectMemory` — [ObjectMemory](#1125-objectmemory)
- `OrderedCollection` — [OrderedCollection](#1126-orderedcollection)
- `Package` — [Package](#1127-package)
- `PackageLoader` — [PackageLoader](#1128-packageloader)
- `Permission` — [Permission](#1129-permission)
- `PluggableAdaptor` — [PluggableAdaptor](#1130-pluggableadaptor)
- `PluggableProxy` — [PluggableProxy](#1131-pluggableproxy)
- `Point` — [Point](#1132-point)
- `PositionableStream` — [PositionableStream](#1133-positionablestream)
- `Process` — [Process](#1134-process)
- `ProcessEnvironment` — [ProcessEnvironment](#1135-processenvironment)
- `ProcessorScheduler` — [ProcessorScheduler](#1136-processorscheduler)
- `ProcessVariable` — [ProcessVariable](#1137-processvariable)
- `Promise` — [Promise](#1138-promise)
- `Random` — [Random](#1139-random)
- `ReadStream` — [ReadStream](#1140-readstream)
- `ReadWriteStream` — [ReadWriteStream](#1141-readwritestream)
- `Rectangle` — [Rectangle](#1142-rectangle)
- `RecursionLock` — [RecursionLock](#1143-recursionlock)
- `Regex` — [Regex](#1144-regex)
- `RegexResults` — [RegexResults](#1145-regexresults)
- `RootNamespace` — [RootNamespace](#1146-rootnamespace)
- `RunArray` — [RunArray](#1147-runarray)
- `ScaledDecimal` — [ScaledDecimal](#1148-scaleddecimal)
- `SecurityPolicy` — [SecurityPolicy](#1149-securitypolicy)
- `Semaphore` — [Semaphore](#1150-semaphore)
- `SequenceableCollection` — [SequenceableCollection](#1151-sequenceablecollection)
- `Set` — [Set](#1152-set)
- `SharedQueue` — [SharedQueue](#1153-sharedqueue)
- `SingletonProxy` — [SingletonProxy](#1154-singletonproxy)
- `SmallInteger` — [SmallInteger](#1155-smallinteger)
- `SortedCollection` — [SortedCollection](#1156-sortedcollection)
- `Stream` — [Stream](#1157-stream)
- `String` — [String](#1158-string)
- `Symbol` — [Symbol](#1159-symbol)
- `SymLink` — [SymLink](#1160-symlink)
- `SystemDictionary` — [SystemDictionary](#1161-systemdictionary)
- `SystemExceptions.AlreadyDefined` — [SystemExceptions.AlreadyDefined](#1162-systemexceptionsalreadydefined)
- `SystemExceptions.ArgumentOutOfRange` — [SystemExceptions.ArgumentOutOfRange](#1163-systemexceptionsargumentoutofrange)
- `SystemExceptions.BadReturn` — [SystemExceptions.BadReturn](#1164-systemexceptionsbadreturn)
- `SystemExceptions.CInterfaceError` — [SystemExceptions.CInterfaceError](#1165-systemexceptionscinterfaceerror)
- `SystemExceptions.EmptyCollection` — [SystemExceptions.EmptyCollection](#1166-systemexceptionsemptycollection)
- `SystemExceptions.EndOfStream` — [SystemExceptions.EndOfStream](#1167-systemexceptionsendofstream)
- `SystemExceptions.FileError` — [SystemExceptions.FileError](#1168-systemexceptionsfileerror)
- `SystemExceptions.IndexOutOfRange` — [SystemExceptions.IndexOutOfRange](#1169-systemexceptionsindexoutofrange)
- `SystemExceptions.InvalidArgument` — [SystemExceptions.InvalidArgument](#1170-systemexceptionsinvalidargument)
- `SystemExceptions.InvalidProcessState` — [SystemExceptions.InvalidProcessState](#1171-systemexceptionsinvalidprocessstate)
- `SystemExceptions.InvalidSize` — [SystemExceptions.InvalidSize](#1172-systemexceptionsinvalidsize)
- `SystemExceptions.InvalidState` — [SystemExceptions.InvalidState](#1173-systemexceptionsinvalidstate)
- `SystemExceptions.InvalidValue` — [SystemExceptions.InvalidValue](#1174-systemexceptionsinvalidvalue)
- `SystemExceptions.MustBeBoolean` — [SystemExceptions.MustBeBoolean](#1175-systemexceptionsmustbeboolean)
- `SystemExceptions.MutationError` — [SystemExceptions.MutationError](#1176-systemexceptionsmutationerror)
- `SystemExceptions.NoRunnableProcess` — [SystemExceptions.NoRunnableProcess](#1177-systemexceptionsnorunnableprocess)
- `SystemExceptions.NotEnoughElements` — [SystemExceptions.NotEnoughElements](#1178-systemexceptionsnotenoughelements)
- `SystemExceptions.NotFound` — [SystemExceptions.NotFound](#1179-systemexceptionsnotfound)
- `SystemExceptions.NotImplemented` — [SystemExceptions.NotImplemented](#1180-systemexceptionsnotimplemented)
- `SystemExceptions.NotIndexable` — [SystemExceptions.NotIndexable](#1181-systemexceptionsnotindexable)
- `SystemExceptions.NotYetImplemented` — [SystemExceptions.NotYetImplemented](#1182-systemexceptionsnotyetimplemented)
- `SystemExceptions.PackageNotAvailable` — [SystemExceptions.PackageNotAvailable](#1183-systemexceptionspackagenotavailable)
- `SystemExceptions.PrimitiveFailed` — [SystemExceptions.PrimitiveFailed](#1184-systemexceptionsprimitivefailed)
- `SystemExceptions.ProcessBeingTerminated` — [SystemExceptions.ProcessBeingTerminated](#1185-systemexceptionsprocessbeingterminated)
- `SystemExceptions.ProcessTerminated` — [SystemExceptions.ProcessTerminated](#1186-systemexceptionsprocessterminated)
- `SystemExceptions.ReadOnlyObject` — [SystemExceptions.ReadOnlyObject](#1187-systemexceptionsreadonlyobject)
- `SystemExceptions.SecurityError` — [SystemExceptions.SecurityError](#1188-systemexceptionssecurityerror)
- `SystemExceptions.ShouldNotImplement` — [SystemExceptions.ShouldNotImplement](#1189-systemexceptionsshouldnotimplement)
- `SystemExceptions.SubclassResponsibility` — [SystemExceptions.SubclassResponsibility](#1190-systemexceptionssubclassresponsibility)
- `SystemExceptions.UnhandledException` — [SystemExceptions.UnhandledException](#1191-systemexceptionsunhandledexception)
- `SystemExceptions.UserInterrupt` — [SystemExceptions.UserInterrupt](#1192-systemexceptionsuserinterrupt)
- `SystemExceptions.VerificationError` — [SystemExceptions.VerificationError](#1193-systemexceptionsverificationerror)
- `SystemExceptions.VMError` — [SystemExceptions.VMError](#1194-systemexceptionsvmerror)
- `SystemExceptions.WrongArgumentCount` — [SystemExceptions.WrongArgumentCount](#1195-systemexceptionswrongargumentcount)
- `SystemExceptions.WrongClass` — [SystemExceptions.WrongClass](#1196-systemexceptionswrongclass)
- `SystemExceptions.WrongMessageSent` — [SystemExceptions.WrongMessageSent](#1197-systemexceptionswrongmessagesent)
- `TextCollector` — [TextCollector](#1198-textcollector)
- `Time` — [Time](#1199-time)
- `True` — [True](#1200-true)
- `UndefinedObject` — [UndefinedObject](#1201-undefinedobject)
- `UnicodeCharacter` — [UnicodeCharacter](#1202-unicodecharacter)
- `UnicodeString` — [UnicodeString](#1203-unicodestring)
- `ValueAdaptor` — [ValueAdaptor](#1204-valueadaptor)
- `ValueHolder` — [ValueHolder](#1205-valueholder)
- `VariableBinding` — [VariableBinding](#1206-variablebinding)
- `VersionableObjectProxy` — [VersionableObjectProxy](#1207-versionableobjectproxy)
- `VFS.ArchiveFile` — [VFS.ArchiveFile](#1208-vfsarchivefile)
- `VFS.ArchiveMember` — [VFS.ArchiveMember](#1209-vfsarchivemember)
- `VFS.FileWrapper` — [VFS.FileWrapper](#1210-vfsfilewrapper)
- `VFS.StoredZipMember` — [VFS.StoredZipMember](#1211-vfsstoredzipmember)
- `VFS.TmpFileArchiveMember` — [VFS.TmpFileArchiveMember](#1212-vfstmpfilearchivemember)
- `VFS.ZipFile` — [VFS.ZipFile](#1213-vfszipfile)
- `Warning` — [Warning](#1214-warning)
- `WeakArray` — [WeakArray](#1215-weakarray)
- `WeakIdentitySet` — [WeakIdentitySet](#1216-weakidentityset)
- `WeakKeyDictionary` — [WeakKeyDictionary](#1217-weakkeydictionary)
- `WeakKeyIdentityDictionary` — [WeakKeyIdentityDictionary](#1218-weakkeyidentitydictionary)
- `WeakSet` — [WeakSet](#1219-weakset)
- `WeakValueIdentityDictionary` — [WeakValueIdentityDictionary](#1220-weakvalueidentitydictionary)
- `WeakValueLookupTable` — [WeakValueLookupTable](#1221-weakvaluelookuptable)
- `WordArray` — [WordArray](#1222-wordarray)
- `WriteStream` — [WriteStream](#1223-writestream)
- `ZeroDivide` — [ZeroDivide](#1224-zerodivide)

## Method index

- `%` — [CharacterArray-string processing](#1299-characterarray-string-processing)
- `&` — [Boolean-basic](#1132-boolean-basic)
- `&` — [False-basic](#1741-false-basic)
- `&` — [Set-arithmetic](#11521-set-arithmetic)
- `&` — [True-basic](#12001-true-basic)
- `*` — [Character-coercion methods](#1287-character-coercion-methods)
- `*` — [Duration-arithmetics](#1693-duration-arithmetics)
- `*` — [FloatD-built ins](#1814-floatd-built-ins)
- `*` — [FloatE-built ins](#1825-floate-built-ins)
- `*` — [FloatQ-built ins](#1834-floatq-built-ins)
- `*` — [Fraction-arithmetic](#1844-fraction-arithmetic)
- `*` — [LargeInteger-arithmetic](#1982-largeinteger-arithmetic)
- `*` — [LargeZeroInteger-arithmetic](#11022-largezerointeger-arithmetic)
- `*` — [Number-arithmetic](#11223-number-arithmetic)
- `*` — [Point-arithmetic](#11323-point-arithmetic)
- `*` — [ScaledDecimal-arithmetic](#11482-scaleddecimal-arithmetic)
- `*` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `*` — [UnicodeCharacter-coercion methods](#12022-unicodecharacter-coercion-methods)
- `+` — [CObject-pointer-like behavior](#13610-cobject-pointer-like-behavior)
- `+` — [Date-still unclassified](#1598-date-still-unclassified)
- `+` — [DateTime-basic](#1604-datetime-basic)
- `+` — [Duration-arithmetics](#1693-duration-arithmetics)
- `+` — [FloatD-built ins](#1814-floatd-built-ins)
- `+` — [FloatE-built ins](#1825-floate-built-ins)
- `+` — [FloatQ-built ins](#1834-floatq-built-ins)
- `+` — [Fraction-arithmetic](#1844-fraction-arithmetic)
- `+` — [LargeInteger-arithmetic](#1982-largeinteger-arithmetic)
- `+` — [LargeNegativeInteger-reverting to LargePositiveInteger](#1993-largenegativeinteger-reverting-to-largepositiveinteger)
- `+` — [LargePositiveInteger-arithmetic](#11001-largepositiveinteger-arithmetic)
- `+` — [LargeZeroInteger-arithmetic](#11022-largezerointeger-arithmetic)
- `+` — [Number-arithmetic](#11223-number-arithmetic)
- `+` — [Point-arithmetic](#11323-point-arithmetic)
- `+` — [ScaledDecimal-arithmetic](#11482-scaleddecimal-arithmetic)
- `+` — [Set-arithmetic](#11521-set-arithmetic)
- `+` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `,` — [ArrayedCollection-basic](#152-arrayedcollection-basic)
- `,` — [Collection-copying SequenceableCollections](#1378-collection-copying-sequenceablecollections)
- `,` — [Exception class-creating ExceptionCollections](#1722-exception-class-creating-exceptioncollections)
- `,` — [ExceptionSet-instance creation](#1733-exceptionset-instance-creation)
- `,` — [File-still unclassified](#17512-file-still-unclassified)
- `,` — [Iterable-enumeration](#1942-iterable-enumeration)
- `,` — [Stream-filtering](#115711-stream-filtering)
- `,` — [String-basic](#11584-string-basic)
- `,` — [VFS.ArchiveMember-still unclassified](#12097-vfsarchivemember-still-unclassified)
- `-` — [CObject-pointer-like behavior](#13610-cobject-pointer-like-behavior)
- `-` — [Date-basic](#1594-date-basic)
- `-` — [DateTime-basic](#1604-datetime-basic)
- `-` — [Duration-arithmetics](#1693-duration-arithmetics)
- `-` — [FloatD-built ins](#1814-floatd-built-ins)
- `-` — [FloatE-built ins](#1825-floate-built-ins)
- `-` — [FloatQ-built ins](#1834-floatq-built-ins)
- `-` — [Fraction-arithmetic](#1844-fraction-arithmetic)
- `-` — [LargeInteger-arithmetic](#1982-largeinteger-arithmetic)
- `-` — [LargeNegativeInteger-reverting to LargePositiveInteger](#1993-largenegativeinteger-reverting-to-largepositiveinteger)
- `-` — [LargePositiveInteger-arithmetic](#11001-largepositiveinteger-arithmetic)
- `-` — [LargeZeroInteger-arithmetic](#11022-largezerointeger-arithmetic)
- `-` — [Number-arithmetic](#11223-number-arithmetic)
- `-` — [Point-arithmetic](#11323-point-arithmetic)
- `-` — [ScaledDecimal-arithmetic](#11482-scaleddecimal-arithmetic)
- `-` — [Set-arithmetic](#11521-set-arithmetic)
- `-` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `->` — [Object-syntax shortcuts](#112317-object-syntax-shortcuts)
- `/` — [Duration-arithmetics](#1693-duration-arithmetics)
- `/` — [FilePath-still unclassified](#17711-filepath-still-unclassified)
- `/` — [FloatD-built ins](#1814-floatd-built-ins)
- `/` — [FloatE-built ins](#1825-floate-built-ins)
- `/` — [FloatQ-built ins](#1834-floatq-built-ins)
- `/` — [Fraction-arithmetic](#1844-fraction-arithmetic)
- `/` — [LargeInteger-arithmetic](#1982-largeinteger-arithmetic)
- `/` — [LargeZeroInteger-arithmetic](#11022-largezerointeger-arithmetic)
- `/` — [Number-arithmetic](#11223-number-arithmetic)
- `/` — [Point-arithmetic](#11323-point-arithmetic)
- `/` — [ScaledDecimal-arithmetic](#11482-scaleddecimal-arithmetic)
- `/` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `/` — [String-filesystem](#11588-string-filesystem)
- `//` — [Fraction-arithmetic](#1844-fraction-arithmetic)
- `//` — [LargeInteger-arithmetic](#1982-largeinteger-arithmetic)
- `//` — [LargeZeroInteger-arithmetic](#11022-largezerointeger-arithmetic)
- `//` — [Number-arithmetic](#11223-number-arithmetic)
- `//` — [Point-arithmetic](#11323-point-arithmetic)
- `//` — [ScaledDecimal-arithmetic](#11482-scaleddecimal-arithmetic)
- `//` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `<` — [Character-comparing](#1288-character-comparing)
- `<` — [CharacterArray-comparing](#1295-characterarray-comparing)
- `<` — [Date-testing](#15910-date-testing)
- `<` — [DateTime-testing](#1609-datetime-testing)
- `<` — [FloatD-built ins](#1814-floatd-built-ins)
- `<` — [FloatE-built ins](#1825-floate-built-ins)
- `<` — [FloatQ-built ins](#1834-floatq-built-ins)
- `<` — [Fraction-comparing](#1847-fraction-comparing)
- `<` — [LargeInteger-testing](#1988-largeinteger-testing)
- `<` — [LookupKey-testing](#11055-lookupkey-testing)
- `<` — [Magnitude-basic](#11071-magnitude-basic)
- `<` — [Point-comparing](#11324-point-comparing)
- `<` — [ScaledDecimal-comparing](#11484-scaleddecimal-comparing)
- `<` — [Set-comparing](#11523-set-comparing)
- `<` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `<` — [Time-comparing](#11999-time-comparing)
- `<<` — [Stream-printing](#115714-stream-printing)
- `<=` — [Character-comparing](#1288-character-comparing)
- `<=` — [CharacterArray-comparing](#1295-characterarray-comparing)
- `<=` — [FloatD-built ins](#1814-floatd-built-ins)
- `<=` — [FloatE-built ins](#1825-floate-built-ins)
- `<=` — [FloatQ-built ins](#1834-floatq-built-ins)
- `<=` — [Fraction-comparing](#1847-fraction-comparing)
- `<=` — [LargeInteger-testing](#1988-largeinteger-testing)
- `<=` — [Magnitude-basic](#11071-magnitude-basic)
- `<=` — [Point-comparing](#11324-point-comparing)
- `<=` — [ScaledDecimal-comparing](#11484-scaleddecimal-comparing)
- `<=` — [Set-comparing](#11523-set-comparing)
- `<=` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `=` — [Association-testing](#166-association-testing)
- `=` — [Bag-testing collections](#188-bag-testing-collections)
- `=` — [BindingDictionary-basic & copying](#1102-bindingdictionary-basic--copying)
- `=` — [ByteArray-basic](#1142-bytearray-basic)
- `=` — [CArrayCType-basic](#1183-carrayctype-basic)
- `=` — [Character-built ins](#1286-character-built-ins)
- `=` — [CharacterArray-comparing](#1295-characterarray-comparing)
- `=` — [Class-testing](#13111-class-testing)
- `=` — [CObject-basic](#1366-cobject-basic)
- `=` — [CompiledBlock-basic](#1383-compiledblock-basic)
- `=` — [CompiledCode-basic](#1395-compiledcode-basic)
- `=` — [CompiledMethod-basic](#1406-compiledmethod-basic)
- `=` — [CPtrCType-basic](#1443-cptrctype-basic)
- `=` — [CType-basic](#1524-ctype-basic)
- `=` — [Date-testing](#15910-date-testing)
- `=` — [DateTime-testing](#1609-datetime-testing)
- `=` — [Delay-comparing](#1625-delay-comparing)
- `=` — [Dictionary-testing](#16413-dictionary-testing)
- `=` — [Exception-comparison](#1727-exception-comparison)
- `=` — [File-basic](#1758-file-basic)
- `=` — [FileSegment-equality](#1784-filesegment-equality)
- `=` — [FloatD-built ins](#1814-floatd-built-ins)
- `=` — [FloatE-built ins](#1825-floate-built-ins)
- `=` — [FloatQ-built ins](#1834-floatq-built-ins)
- `=` — [Fraction-comparing](#1847-fraction-comparing)
- `=` — [HashedCollection-testing collections](#18810-hashedcollection-testing-collections)
- `=` — [Interval-testing](#1935-interval-testing)
- `=` — [LargeArrayedCollection-basic](#1963-largearrayedcollection-basic)
- `=` — [LargeInteger-testing](#1988-largeinteger-testing)
- `=` — [LookupKey-testing](#11055-lookupkey-testing)
- `=` — [Magnitude-basic](#11071-magnitude-basic)
- `=` — [MethodInfo-equality](#11152-methodinfo-equality)
- `=` — [NetClients.URL-comparing](#11184-netclientsurl-comparing)
- `=` — [Object-built ins](#11232-object-built-ins)
- `=` — [Point-comparing](#11324-point-comparing)
- `=` — [Rectangle-testing](#11426-rectangle-testing)
- `=` — [RunArray-testing](#11479-runarray-testing)
- `=` — [ScaledDecimal-comparing](#11484-scaleddecimal-comparing)
- `=` — [SequenceableCollection-testing](#115111-sequenceablecollection-testing)
- `=` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `=` — [String-basic](#11584-string-basic)
- `=` — [Symbol-built ins](#11596-symbol-built-ins)
- `=` — [Time-comparing](#11999-time-comparing)
- `=` — [VFS.ArchiveMember-basic](#12092-vfsarchivemember-basic)
- `=` — [VFS.FileWrapper-basic](#12104-vfsfilewrapper-basic)
- `==` — [Object-built ins](#11232-object-built-ins)
- `==` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `=~` — [String-regex](#115810-string-regex)
- `>` — [Character-comparing](#1288-character-comparing)
- `>` — [CharacterArray-comparing](#1295-characterarray-comparing)
- `>` — [FloatD-built ins](#1814-floatd-built-ins)
- `>` — [FloatE-built ins](#1825-floate-built-ins)
- `>` — [FloatQ-built ins](#1834-floatq-built-ins)
- `>` — [Fraction-comparing](#1847-fraction-comparing)
- `>` — [LargeInteger-testing](#1988-largeinteger-testing)
- `>` — [Magnitude-basic](#11071-magnitude-basic)
- `>` — [Point-comparing](#11324-point-comparing)
- `>` — [ScaledDecimal-comparing](#11484-scaleddecimal-comparing)
- `>` — [Set-comparing](#11523-set-comparing)
- `>` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `>=` — [Character-comparing](#1288-character-comparing)
- `>=` — [CharacterArray-comparing](#1295-characterarray-comparing)
- `>=` — [FloatD-built ins](#1814-floatd-built-ins)
- `>=` — [FloatE-built ins](#1825-floate-built-ins)
- `>=` — [FloatQ-built ins](#1834-floatq-built-ins)
- `>=` — [Fraction-comparing](#1847-fraction-comparing)
- `>=` — [LargeInteger-testing](#1988-largeinteger-testing)
- `>=` — [Magnitude-basic](#11071-magnitude-basic)
- `>=` — [Point-comparing](#11324-point-comparing)
- `>=` — [ScaledDecimal-comparing](#11484-scaleddecimal-comparing)
- `>=` — [Set-comparing](#11523-set-comparing)
- `>=` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `>>` — [Behavior-accessing the method dictionary](#193-behavior-accessing-the-method-dictionary)
- `@` — [Number-point creation](#112210-number-point-creation)
- `\\` — [Fraction-arithmetic](#1844-fraction-arithmetic)
- `\\` — [LargeInteger-arithmetic](#1982-largeinteger-arithmetic)
- `\\` — [LargeZeroInteger-arithmetic](#11022-largezerointeger-arithmetic)
- `\\` — [Number-arithmetic](#11223-number-arithmetic)
- `\\` — [ScaledDecimal-arithmetic](#11482-scaleddecimal-arithmetic)
- `\\` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `|` — [Boolean-basic](#1132-boolean-basic)
- `|` — [False-basic](#1741-false-basic)
- `|` — [True-basic](#12001-true-basic)
- `~` — [String-regex](#115810-string-regex)
- `~=` — [FloatD-built ins](#1814-floatd-built-ins)
- `~=` — [FloatE-built ins](#1825-floate-built-ins)
- `~=` — [FloatQ-built ins](#1834-floatq-built-ins)
- `~=` — [LargeInteger-testing](#1988-largeinteger-testing)
- `~=` — [Object-relational operators](#112314-object-relational-operators)
- `~=` — [ScaledDecimal-comparing](#11484-scaleddecimal-comparing)
- `~=` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `~~` — [Object-relational operators](#112314-object-relational-operators)
- `~~` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `abbreviationOfDay:` — [Date class-basic](#1591-date-class-basic)
- `abort` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `abs` — [Duration-arithmetics](#1693-duration-arithmetics)
- `abs` — [LargeNegativeInteger-numeric testing](#1992-largenegativeinteger-numeric-testing)
- `abs` — [LargePositiveInteger-numeric testing](#11004-largepositiveinteger-numeric-testing)
- `abs` — [Number-misc math](#11229-number-misc-math)
- `abs` — [Point-arithmetic](#11323-point-arithmetic)
- `acceptUsageForClass:` — [AlternativeObjectProxy class-instance creation](#121-alternativeobjectproxy-class-instance-creation)
- `acceptUsageForClass` — [\<1\>:              DumperProxy class-accessing](#1681-dumperproxy-class-accessing)
- `acceptUsageForClass` — [\<2\>:              SingletonProxy class-accessing](#11541-singletonproxy-class-accessing)
- `accesses:` — [CompiledCode-testing accesses](#13911-compiledcode-testing-accesses)
- `accesses` — [\<1\>:                         CompiledMethod-testing](#14013-compiledmethod-testing)
- `action:` — [Permission-accessing](#11292-permission-accessing)
- `actions` — [Permission-accessing](#11292-permission-accessing)
- `actions:` — [Permission-accessing](#11292-permission-accessing)
- `activeDebugger` — [ProcessorScheduler-basic](#11362-processorscheduler-basic)
- `activeDelay` — [Delay class-timer process](#1623-delay-class-timer-process)
- `activePriority` — [ProcessorScheduler-basic](#11362-processorscheduler-basic)
- `activeProcess` — [ProcessorScheduler-basic](#11362-processorscheduler-basic)
- `add:` — [ArrayedCollection-basic](#152-arrayedcollection-basic)
- `add` — [\<1\>:                              Bag-adding](#182-bag-adding)
- `add` — [\<2\>:                              Collection-adding](#1373-collection-adding)
- `add` — [\<3\>:                              Dictionary-accessing](#1642-dictionary-accessing)
- `add` — [\<4\>:                              HashedCollection-accessing](#1882-hashedcollection-accessing)
- `add` — [\<5\>:                              LinkedList-adding](#11042-linkedlist-adding)
- `add` — [\<6\>:                              LookupTable-accessing](#11062-lookuptable-accessing)
- `add` — [\<7\>:                              MappedCollection-basic](#11082-mappedcollection-basic)
- `add` — [\<8\>:                              OrderedCollection-adding](#11263-orderedcollection-adding)
- `add` — [\<9\>:                              ProcessEnvironment-accessing](#11353-processenvironment-accessing)
- `add` — [\<10\>:                             WeakKeyDictionary-accessing](#12172-weakkeydictionary-accessing)
- `add` — [\<11\>:                             WeakSet-accessing](#12191-weakset-accessing)
- `add:after:` — [OrderedCollection-adding](#11263-orderedcollection-adding)
- `add:afterIndex:` — [OrderedCollection-adding](#11263-orderedcollection-adding)
- `add:afterIndex` — [\<1\>:                   RunArray-adding](#11473-runarray-adding)
- `add:afterIndex` — [\<2\>:                   SortedCollection-disabled](#11565-sortedcollection-disabled)
- `add:before:` — [OrderedCollection-adding](#11263-orderedcollection-adding)
- `add:beforeIndex:` — [OrderedCollection-adding](#11263-orderedcollection-adding)
- `add:withOccurrences:` — [Bag-adding](#182-bag-adding)
- `addAll:` — [Collection-adding](#1373-collection-adding)
- `addAll` — [\<1\>:                           Dictionary-accessing](#1642-dictionary-accessing)
- `addAll` — [\<2\>:                           OrderedCollection-adding](#11263-orderedcollection-adding)
- `addAll:after:` — [OrderedCollection-adding](#11263-orderedcollection-adding)
- `addAll:afterIndex:` — [OrderedCollection-adding](#11263-orderedcollection-adding)
- `addAll:afterIndex` — [\<1\>:                RunArray-adding](#11473-runarray-adding)
- `addAll:afterIndex` — [\<2\>:                SortedCollection-disabled](#11565-sortedcollection-disabled)
- `addAll:before:` — [OrderedCollection-adding](#11263-orderedcollection-adding)
- `addAll:beforeIndex:` — [OrderedCollection-adding](#11263-orderedcollection-adding)
- `addAllFirst:` — [OrderedCollection-adding](#11263-orderedcollection-adding)
- `addAllFirst` — [\<1\>:                      RunArray-adding](#11473-runarray-adding)
- `addAllFirst` — [\<2\>:                      SortedCollection-disabled](#11565-sortedcollection-disabled)
- `addAllLast:` — [OrderedCollection-adding](#11263-orderedcollection-adding)
- `addAllLast` — [\<1\>:                       RunArray-adding](#11473-runarray-adding)
- `addAllLast` — [\<2\>:                       SortedCollection-disabled](#11565-sortedcollection-disabled)
- `addBuiltFile:` — [Package-accessing](#11273-package-accessing)
- `addCallout:` — [Package-accessing](#11273-package-accessing)
- `addClassVarName:` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `addClassVarName` — [\<1\>:                  Metaclass-delegation](#11125-metaclass-delegation)
- `addClassVarName:value:` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `addDays:` — [Date-basic](#1594-date-basic)
- `addDependent:` — [Object-dependents access](#11239-object-dependents-access)
- `addDependent` — [\<1\>:                     UndefinedObject-dependents access](#12015-undefinedobject-dependents-access)
- `addFeature:` — [Package-accessing](#11273-package-accessing)
- `addFeature` — [\<1\>:                       SystemDictionary-special accessing](#11619-systemdictionary-special-accessing)
- `addFile:` — [Package-accessing](#11273-package-accessing)
- `addFileIn:` — [Package-accessing](#11273-package-accessing)
- `addFirst:` — [LinkedList-adding](#11042-linkedlist-adding)
- `addFirst` — [\<1\>:                         OrderedCollection-adding](#11263-orderedcollection-adding)
- `addFirst` — [\<2\>:                         RunArray-adding](#11473-runarray-adding)
- `addFirst` — [\<3\>:                         SortedCollection-disabled](#11565-sortedcollection-disabled)
- `addInstVarName:` — [Behavior-instance variables](#1914-behavior-instance-variables)
- `addLast:` — [LinkedList-adding](#11042-linkedlist-adding)
- `addLast` — [\<1\>:                          OrderedCollection-adding](#11263-orderedcollection-adding)
- `addLast` — [\<2\>:                          RunArray-adding](#11473-runarray-adding)
- `addLast` — [\<3\>:                          SortedCollection-disabled](#11565-sortedcollection-disabled)
- `addLibrary:` — [DLD class-dynamic linking](#1672-dld-class-dynamic-linking)
- `addLibrary` — [\<1\>:                       Package-accessing](#11273-package-accessing)
- `addLibraryHandle:` — [DLD class-dynamic linking](#1672-dld-class-dynamic-linking)
- `addModule:` — [DLD class-dynamic linking](#1672-dld-class-dynamic-linking)
- `addModule` — [\<1\>:                        Package-accessing](#11273-package-accessing)
- `addPermission:` — [SecurityPolicy-modifying](#11491-securitypolicy-modifying)
- `addPrerequisite:` — [Package-accessing](#11273-package-accessing)
- `address` — [CObject-accessing](#1365-cobject-accessing)
- `address:` — [CObject class-instance creation](#1362-cobject-class-instance-creation)
- `address` — [\<1\>:                          CObject-accessing](#1365-cobject-accessing)
- `address` — [\<2\>:                          CType-C instance creation](#1525-ctype-c-instance-creation)
- `addressAt:` — [CObject-pointer-like behavior](#13610-cobject-pointer-like-behavior)
- `addressOf:` — [CFunctionDescriptor class-testing](#1272-cfunctiondescriptor-class-testing)
- `addressOf` — [\<1\>:                        ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `addressOfOOP:` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `addSeconds:` — [Time-arithmetic](#11998-time-arithmetic)
- `addSelector:withMethod:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `addSharedPool:` — [AbstractNamespace-compiling](#113-abstractnamespace-compiling)
- `addSharedPool` — [\<1\>:                    Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `addSharedPool` — [\<2\>:                    ClassDescription-parsing class declarations](#1326-classdescription-parsing-class-declarations)
- `addSharedPool` — [\<3\>:                    Metaclass-delegation](#11125-metaclass-delegation)
- `addSubclass:` — [Behavior-creating a class hierarchy](#1910-behavior-creating-a-class-hierarchy)
- `addSubspace:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `addSunitScript:` — [Package-accessing](#11273-package-accessing)
- `addTime:` — [Time-arithmetic](#11998-time-arithmetic)
- `addToBeFinalized` — [FileDescriptor-initialize-release](#1769-filedescriptor-initialize-release)
- `addToBeFinalized` — [Object-finalization](#112311-object-finalization)
- `after:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `alignof` — [CAggregate class-accessing](#1151-caggregate-class-accessing)
- `alignof` — [CArray-accessing](#1171-carray-accessing)
- `alignof` — [CArrayCType-accessing](#1182-carrayctype-accessing)
- `alignof` — [CChar class-accessing](#1231-cchar-class-accessing)
- `alignof` — [CChar-accessing](#1232-cchar-accessing)
- `alignof` — [CCompound class-subclass creation](#1242-ccompound-class-subclass-creation)
- `alignof` — [CDouble class-accessing](#1251-cdouble-class-accessing)
- `alignof` — [CDouble-accessing](#1252-cdouble-accessing)
- `alignof` — [CFloat class-accessing](#1261-cfloat-class-accessing)
- `alignof` — [CFloat-accessing](#1262-cfloat-accessing)
- `alignof` — [CInt class-accessing](#1301-cint-class-accessing)
- `alignof` — [CInt-accessing](#1302-cint-accessing)
- `alignof` — [CLong class-accessing](#1331-clong-class-accessing)
- `alignof` — [CLong-accessing](#1332-clong-accessing)
- `alignof` — [CLongDouble class-accessing](#1341-clongdouble-class-accessing)
- `alignof` — [CLongDouble-accessing](#1342-clongdouble-accessing)
- `alignof` — [CLongLong class-accessing](#1351-clonglong-class-accessing)
- `alignof` — [CLongLong-accessing](#1352-clonglong-accessing)
- `alignof` — [CPtr-accessing](#1431-cptr-accessing)
- `alignof` — [CShort class-accessing](#1471-cshort-class-accessing)
- `alignof` — [CShort-accessing](#1472-cshort-accessing)
- `alignof` — [CSmalltalk class-accessing](#1481-csmalltalk-class-accessing)
- `alignof` — [CSmalltalk-accessing](#1482-csmalltalk-accessing)
- `alignof` — [CType-accessing](#1523-ctype-accessing)
- `alignof` — [CUChar class-getting info](#1531-cuchar-class-getting-info)
- `alignof` — [CUChar-accessing](#1532-cuchar-accessing)
- `alignof` — [CUInt class-accessing](#1541-cuint-class-accessing)
- `alignof` — [CUInt-accessing](#1542-cuint-accessing)
- `alignof` — [CULong class-accessing](#1551-culong-class-accessing)
- `alignof` — [CULong-accessing](#1552-culong-accessing)
- `alignof` — [CULongLong class-accessing](#1561-culonglong-class-accessing)
- `alignof` — [CULongLong-accessing](#1562-culonglong-accessing)
- `alignof` — [CUShort class-accessing](#1581-cushort-class-accessing)
- `alignof` — [CUShort-accessing](#1582-cushort-accessing)
- `alignTo:` — [Integer-extension](#1926-integer-extension)
- `aliveObjectsDo:` — [WeakArray-accessing](#12152-weakarray-accessing)
- `all` — [FilePath-decoration](#1775-filepath-decoration)
- `allAssociations` — [AbstractNamespace-accessing](#112-abstractnamespace-accessing)
- `allBehaviorsDo:` — [AbstractNamespace-accessing](#112-abstractnamespace-accessing)
- `allBlocksDo:` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `allButFirst` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `allButFirst:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `allButLast` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `allButLast:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `allClassesDo:` — [AbstractNamespace-accessing](#112-abstractnamespace-accessing)
- `allClassObjectsDo:` — [AbstractNamespace-accessing](#112-abstractnamespace-accessing)
- `allClassVarNames` — [Behavior-accessing instances and variables](#192-behavior-accessing-instances-and-variables)
- `allClassVarNames` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `allClassVarNames` — [Metaclass-delegation](#11125-metaclass-delegation)
- `allExceptionsDo:` — [Exception class-interoperability with TrappableEvents](#1724-exception-class-interoperability-with-trappableevents)
- `allExceptionsDo` — [\<1\>:                  ExceptionSet-enumerating](#1732-exceptionset-enumerating)
- `allFilesMatching:do:` — [Directory class-file operations](#1662-directory-class-file-operations)
- `allFilesMatching:do` — [\<1\>:              FilePath-enumerating](#1777-filepath-enumerating)
- `allInstances` — [Behavior-accessing instances and variables](#192-behavior-accessing-instances-and-variables)
- `allInstancesDo:` — [Behavior-enumerating](#1911-behavior-enumerating)
- `allInstVarNames` — [Behavior-accessing instances and variables](#192-behavior-accessing-instances-and-variables)
- `allLiterals` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `allLiteralsDo:` — [CompiledCode-literals - iteration](#1399-compiledcode-literals---iteration)
- `allLiteralSymbolsDo:` — [CompiledCode-literals - iteration](#1399-compiledcode-literals---iteration)
- `allMask:` — [Integer-bit operators](#1924-integer-bit-operators)
- `allMetaclassesDo:` — [AbstractNamespace-accessing](#112-abstractnamespace-accessing)
- `alloc:` — [CObject class-instance creation](#1362-cobject-class-instance-creation)
- `alloc:type:` — [CObject class-primitive allocation](#1363-cobject-class-primitive-allocation)
- `allOccurrencesOfRegex:` — [String-regex](#115810-string-regex)
- `allOccurrencesOfRegex:do:` — [String-regex](#115810-string-regex)
- `allOccurrencesOfRegex:from:to:` — [String-regex](#115810-string-regex)
- `allOccurrencesOfRegex:from:to:do:` — [String-regex](#115810-string-regex)
- `allocFailures` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `allocMatches` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `allocProbes` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `allocSplits` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `allow` — [Permission-accessing](#11292-permission-accessing)
- `allowing` — [Permission-accessing](#11292-permission-accessing)
- `allowing:target:action:` — [Permission class-testing](#11291-permission-class-testing)
- `allowing:target:actions:` — [Permission class-testing](#11291-permission-class-testing)
- `allOwners` — [Object-built ins](#11232-object-built-ins)
- `allSatisfy:` — [Iterable-enumeration](#1942-iterable-enumeration)
- `allSelectors` — [Behavior-accessing the method dictionary](#193-behavior-accessing-the-method-dictionary)
- `allSharedPoolDictionaries` — [Behavior-accessing instances and variables](#192-behavior-accessing-instances-and-variables)
- `allSharedPoolDictionariesDo:` — [Behavior-still unclassified](#1920-behavior-still-unclassified)
- `allSharedPoolDictionariesDo` — [\<1\>:      Class-still unclassified](#13110-class-still-unclassified)
- `allSharedPoolDictionariesDo` — [\<2\>:      Metaclass-delegation](#11125-metaclass-delegation)
- `allSharedPools` — [Behavior-accessing instances and variables](#192-behavior-accessing-instances-and-variables)
- `allSharedPools` — [Metaclass-delegation](#11125-metaclass-delegation)
- `allSubassociationsDo:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `allSubclasses` — [Behavior-accessing class hierarchy](#191-behavior-accessing-class-hierarchy)
- `allSubclasses` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `allSubclassesDo:` — [Behavior-enumerating](#1911-behavior-enumerating)
- `allSubinstancesDo:` — [Behavior-enumerating](#1911-behavior-enumerating)
- `allSubspaces` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `allSubspacesDo:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `allSuperclasses` — [Behavior-accessing class hierarchy](#191-behavior-accessing-class-hierarchy)
- `allSuperclassesDo:` — [Behavior-enumerating](#1911-behavior-enumerating)
- `allSuperspaces` — [Dictionary-namespace protocol](#1648-dictionary-namespace-protocol)
- `allSuperspacesDo:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `allSuperspacesDo` — [\<1\>:                 Dictionary-namespace protocol](#1648-dictionary-namespace-protocol)
- `amountToTranslateWithin:` — [Rectangle-rectangle functions](#11425-rectangle-rectangle-functions)
- `and:` — [Boolean-basic](#1132-boolean-basic)
- `and` — [\<1\>:                              False-basic](#1741-false-basic)
- `and` — [\<2\>:                              True-basic](#12001-true-basic)
- `anyMask:` — [Integer-bit operators](#1924-integer-bit-operators)
- `anyOne` — [Collection-enumeration](#1379-collection-enumeration)
- `anyOne` — [SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `anySatisfy:` — [Iterable-enumeration](#1942-iterable-enumeration)
- `append` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `append:to:` — [Directory class-file name management](#1661-directory-class-file-name-management)
- `append:to` — [\<1\>:                        FilePath class-file name management](#1771-filepath-class-file-name-management)
- `arcCos` — [Float-built ins](#1805-float-built-ins)
- `arcCos` — [Number-misc math](#11229-number-misc-math)
- `arcCosh` — [Number-misc math](#11229-number-misc-math)
- `archive` — [VFS.ArchiveMember-accessing](#12091-vfsarchivemember-accessing)
- `archive:` — [VFS.ArchiveMember-initializing](#12096-vfsarchivemember-initializing)
- `arcSin` — [Float-built ins](#1805-float-built-ins)
- `arcSin` — [Number-misc math](#11229-number-misc-math)
- `arcSinh` — [Number-misc math](#11229-number-misc-math)
- `arcTan` — [Float-built ins](#1805-float-built-ins)
- `arcTan` — [Number-misc math](#11229-number-misc-math)
- `arcTan` — [Point-point functions](#11326-point-point-functions)
- `arcTan:` — [Number-misc math](#11229-number-misc-math)
- `arcTanh` — [Number-misc math](#11229-number-misc-math)
- `area` — [Rectangle-rectangle functions](#11425-rectangle-rectangle-functions)
- `areasOutside:` — [Rectangle-rectangle functions](#11425-rectangle-rectangle-functions)
- `argument` — [Message-accessing](#11102-message-accessing)
- `argumentCount` — [BlockClosure-accessing](#1113-blockclosure-accessing)
- `arguments` — [Message-accessing](#11102-message-accessing)
- `arguments` — [SystemDictionary-miscellaneous](#11616-systemdictionary-miscellaneous)
- `arguments:` — [Message-accessing](#11102-message-accessing)
- `arguments:do:` — [SystemDictionary-command-line](#11615-systemdictionary-command-line)
- `arguments:do:ifError:` — [SystemDictionary-command-line](#11615-systemdictionary-command-line)
- `arithmeticError:` — [Number-error raising](#11228-number-error-raising)
- `arrayType:` — [CType-accessing](#1523-ctype-accessing)
- `article` — [Behavior-support for lightweight classes](#1921-behavior-support-for-lightweight-classes)
- `article` — [Class-printing](#1317-class-printing)
- `asAbsolute` — [Delay-accessing](#1624-delay-accessing)
- `asArray` — [Collection-converting](#1376-collection-converting)
- `asArray` — [RegexResults-accessing](#11451-regexresults-accessing)
- `asArray` — [WeakArray-conversion](#12153-weakarray-conversion)
- `asBag` — [Collection-converting](#1376-collection-converting)
- `asByteArray` — [CharacterArray-converting](#1296-characterarray-converting)
- `asByteArray` — [Collection-converting](#1376-collection-converting)
- `asByteArray` — [String-converting](#11587-string-converting)
- `asByteArray:` — [CChar-conversion](#1233-cchar-conversion)
- `asCBooleanValue` — [Boolean-C hacks](#1133-boolean-c-hacks)
- `asCBooleanValue` — [False-C hacks](#1742-false-c-hacks)
- `asCBooleanValue` — [True-C hacks](#12002-true-c-hacks)
- `asCData` — [ByteArray-CObject](#1144-bytearray-cobject)
- `asCData` — [String-CObject](#11586-string-cobject)
- `asCData:` — [ByteArray-built ins](#1143-bytearray-built-ins)
- `asCData` — [\<1\>:                          String-built ins](#11585-string-built-ins)
- `asCharacter` — [Character-converting](#1289-character-converting)
- `asCharacter` — [Integer-converting](#1925-integer-converting)
- `asciiValue` — [Character-built ins](#1286-character-built-ins)
- `asciiValue:` — [Character class-built ins](#1281-character-class-built-ins)
- `asClass` — [Behavior-support for lightweight classes](#1921-behavior-support-for-lightweight-classes)
- `asClass` — [Class-testing functionality](#13112-class-testing-functionality)
- `asClass` — [ClassDescription-conversion](#1322-classdescription-conversion)
- `asClass` — [Metaclass-testing functionality](#11128-metaclass-testing-functionality)
- `asClassPoolKey` — [CharacterArray-converting](#1296-characterarray-converting)
- `asCNumber` — [Float-coercion](#1807-float-coercion)
- `asCNumber` — [Fraction-coercion](#1846-fraction-coercion)
- `asCNumber` — [LargeInteger-coercion](#1985-largeinteger-coercion)
- `asCNumber` — [Number-coercion](#11224-number-coercion)
- `asCNumber` — [ScaledDecimal-coercion](#11483-scaleddecimal-coercion)
- `asCNumber` — [SmallInteger-coercion](#11556-smallinteger-coercion)
- `asDate` — [DateTime-splitting in dates & times](#1607-datetime-splitting-in-dates--times)
- `asExactFraction` — [Float-coercing](#1806-float-coercing)
- `asExactFraction` — [Fraction-converting](#1848-fraction-converting)
- `asExactFraction` — [Number-converting](#11226-number-converting)
- `asFile` — [FilePath-converting](#1774-filepath-converting)
- `asFile` — [String-filesystem](#11588-string-filesystem)
- `asFloat` — [Float-transcendental operations](#18017-float-transcendental-operations)
- `asFloat` — [Number-converting](#11226-number-converting)
- `asFloatD` — [FloatD-coercing](#1815-floatd-coercing)
- `asFloatD` — [FloatE-built ins](#1825-floate-built-ins)
- `asFloatD` — [FloatQ-built ins](#1834-floatq-built-ins)
- `asFloatD` — [Fraction-converting](#1848-fraction-converting)
- `asFloatD` — [LargeNegativeInteger-converting](#1991-largenegativeinteger-converting)
- `asFloatD` — [LargePositiveInteger-converting](#11002-largepositiveinteger-converting)
- `asFloatD` — [Number-converting](#11226-number-converting)
- `asFloatD` — [ScaledDecimal-coercion](#11483-scaleddecimal-coercion)
- `asFloatD` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `asFloatE` — [FloatD-built ins](#1814-floatd-built-ins)
- `asFloatE` — [FloatE-coercing](#1826-floate-coercing)
- `asFloatE` — [FloatQ-built ins](#1834-floatq-built-ins)
- `asFloatE` — [Fraction-converting](#1848-fraction-converting)
- `asFloatE` — [LargeNegativeInteger-converting](#1991-largenegativeinteger-converting)
- `asFloatE` — [LargePositiveInteger-converting](#11002-largepositiveinteger-converting)
- `asFloatE` — [Number-converting](#11226-number-converting)
- `asFloatE` — [ScaledDecimal-coercion](#11483-scaleddecimal-coercion)
- `asFloatE` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `asFloatQ` — [FloatD-built ins](#1814-floatd-built-ins)
- `asFloatQ` — [FloatE-built ins](#1825-floate-built-ins)
- `asFloatQ` — [FloatQ-coercing](#1835-floatq-coercing)
- `asFloatQ` — [Fraction-converting](#1848-fraction-converting)
- `asFloatQ` — [LargeNegativeInteger-converting](#1991-largenegativeinteger-converting)
- `asFloatQ` — [LargePositiveInteger-converting](#11002-largepositiveinteger-converting)
- `asFloatQ` — [Number-converting](#11226-number-converting)
- `asFloatQ` — [ScaledDecimal-coercion](#11483-scaleddecimal-coercion)
- `asFloatQ` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `asFraction` — [Float-coercing](#1806-float-coercing)
- `asFraction` — [Fraction-converting](#1848-fraction-converting)
- `asFraction` — [Integer-converting](#1925-integer-converting)
- `asFraction` — [Number-converting](#11226-number-converting)
- `asFraction` — [ScaledDecimal-coercion](#11483-scaleddecimal-coercion)
- `asGlobalKey` — [CharacterArray-converting](#1296-characterarray-converting)
- `asInteger` — [Character-built ins](#1286-character-built-ins)
- `asInteger` — [CharacterArray-converting](#1296-characterarray-converting)
- `asInteger` — [Number-truncation and round off](#112214-number-truncation-and-round-off)
- `asLocal` — [DateTime-time zones](#16010-datetime-time-zones)
- `asLowercase` — [Character-coercion methods](#1287-character-coercion-methods)
- `asLowercase` — [CharacterArray-converting](#1296-characterarray-converting)
- `asMetaclass` — [ClassDescription-conversion](#1322-classdescription-conversion)
- `asMilliseconds` — [Time-accessing (non ANSI & for Durations)](#11997-time-accessing-non-ansi--for-durations)
- `asNanoseconds` — [Time-accessing (non ANSI & for Durations)](#11997-time-accessing-non-ansi--for-durations)
- `asNumber` — [CharacterArray-converting](#1296-characterarray-converting)
- `asNumber` — [Number-converting](#11226-number-converting)
- `asObject` — [LargeInteger-disabled](#1986-largeinteger-disabled)
- `asObject` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `asObjectNoFail` — [LargeInteger-disabled](#1986-largeinteger-disabled)
- `asObjectNoFail` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `asOop` — [Object-built ins](#11232-object-built-ins)
- `asOrderedCollection` — [Collection-converting](#1376-collection-converting)
- `asPoint` — [Number-point creation](#112210-number-point-creation)
- `asPoint` — [Point-converting](#11325-point-converting)
- `asPoolKey` — [CharacterArray-converting](#1296-characterarray-converting)
- `asRectangle` — [Number-converting](#11226-number-converting)
- `asRectangle` — [Point-converting](#11325-point-converting)
- `asRegex` — [Regex-conversion](#11443-regex-conversion)
- `asRegex` — [String-regex](#115810-string-regex)
- `asRunArray` — [Collection-converting](#1376-collection-converting)
- `asScaledDecimal:` — [Integer-converting](#1925-integer-converting)
- `asScaledDecimal` — [\<1\>:                  Number-converting](#11226-number-converting)
- `asScaledDecimal:radix:scale:` — [Number-converting](#11226-number-converting)
- `asSeconds` — [Date-date computations](#1596-date-date-computations)
- `asSeconds` — [DateTime-computations](#1605-datetime-computations)
- `asSeconds` — [Time-accessing (non ANSI & for Durations)](#11997-time-accessing-non-ansi--for-durations)
- `asSet` — [Bag-enumerating the elements of a collection](#183-bag-enumerating-the-elements-of-a-collection)
- `asSet` — [Collection-converting](#1376-collection-converting)
- `assigns:` — [CompiledCode-testing accesses](#13911-compiledcode-testing-accesses)
- `assigns` — [\<1\>:                          CompiledMethod-testing](#14013-compiledmethod-testing)
- `associationAt:` — [Dictionary-accessing](#1642-dictionary-accessing)
- `associationAt` — [\<1\>:                    ProcessEnvironment-accessing](#11353-processenvironment-accessing)
- `associationAt:ifAbsent:` — [Dictionary-accessing](#1642-dictionary-accessing)
- `associationAt:ifAbsent` — [\<1\>:           LookupTable-accessing](#11062-lookuptable-accessing)
- `associationAt:ifAbsent` — [\<2\>:           Namespace-overrides for superspaces](#11166-namespace-overrides-for-superspaces)
- `associationAt:ifAbsent` — [\<3\>:           ProcessEnvironment-accessing](#11353-processenvironment-accessing)
- `associations` — [Dictionary-accessing](#1642-dictionary-accessing)
- `associationsDo:` — [Dictionary-dictionary enumerating](#1645-dictionary-dictionary-enumerating)
- `associationsDo` — [\<1\>:                   LookupTable-enumerating](#11063-lookuptable-enumerating)
- `associationsDo` — [\<2\>:                   Namespace-overrides for superspaces](#11166-namespace-overrides-for-superspaces)
- `asSortedCollection` — [Collection-converting](#1376-collection-converting)
- `asSortedCollection:` — [Collection-converting](#1376-collection-converting)
- `asString` — [ByteArray-converting](#1145-bytearray-converting)
- `asString` — [CChar-conversion](#1233-cchar-conversion)
- `asString` — [Character-coercion methods](#1287-character-coercion-methods)
- `asString` — [CharacterArray-converting](#1296-characterarray-converting)
- `asString` — [Collection-converting](#1376-collection-converting)
- `asString` — [File-accessing](#1757-file-accessing)
- `asString` — [FilePath-printing](#17710-filepath-printing)
- `asString` — [FileSegment-basic](#1783-filesegment-basic)
- `asString` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `asString` — [Number-converting](#11226-number-converting)
- `asString` — [Regex-conversion](#11443-regex-conversion)
- `asString` — [String-converting](#11587-string-converting)
- `asString` — [Symbol-converting](#11597-symbol-converting)
- `asString` — [UnicodeString-converting](#12035-unicodestring-converting)
- `asString` — [VFS.ArchiveMember-accessing](#12091-vfsarchivemember-accessing)
- `asString` — [VFS.FileWrapper-accessing](#12103-vfsfilewrapper-accessing)
- `asString:` — [CChar-conversion](#1233-cchar-conversion)
- `asSymbol` — [Character-coercion methods](#1287-character-coercion-methods)
- `asSymbol` — [CharacterArray-converting](#1296-characterarray-converting)
- `asSymbol` — [String-converting](#11587-string-converting)
- `asSymbol` — [Symbol-converting](#11597-symbol-converting)
- `asSymbol` — [UnicodeString-converting](#12035-unicodestring-converting)
- `asTime` — [DateTime-splitting in dates & times](#1607-datetime-splitting-in-dates--times)
- `asUnicodeString` — [ByteArray-converting](#1145-bytearray-converting)
- `asUnicodeString` — [Character-coercion methods](#1287-character-coercion-methods)
- `asUnicodeString` — [CharacterArray-converting](#1296-characterarray-converting)
- `asUnicodeString` — [Collection-converting](#1376-collection-converting)
- `asUnicodeString` — [UnicodeString-converting](#12035-unicodestring-converting)
- `asUppercase` — [Character-coercion methods](#1287-character-coercion-methods)
- `asUppercase` — [CharacterArray-converting](#1296-characterarray-converting)
- `asUTC` — [DateTime-time zones](#16010-datetime-time-zones)
- `asValue` — [Object-conversion](#11236-object-conversion)
- `asyncCall` — [CCallable-calling](#1213-ccallable-calling)
- `asyncCallNoRetryFrom:` — [CCallable-calling](#1213-ccallable-calling)
- `asyncCCall:numArgs:attributes:` — [CompiledMethod class-c call-outs](#1401-compiledmethod-class-c-call-outs)
- `at:` — [CObject-pointer-like behavior](#13610-cobject-pointer-like-behavior)
- `at` — [\<1\>:                               ContextPart-accessing](#1413-contextpart-accessing)
- `at` — [\<2\>:                               DateTime-splitting in dates & times](#1607-datetime-splitting-in-dates--times)
- `at` — [\<3\>:                               Dictionary-accessing](#1642-dictionary-accessing)
- `at` — [\<4\>:                               File-accessing](#1757-file-accessing)
- `at` — [\<5\>:                               FilePath-accessing](#1773-filepath-accessing)
- `at` — [\<6\>:                               HashedCollection-accessing](#1882-hashedcollection-accessing)
- `at` — [\<7\>:                               Interval-basic](#1932-interval-basic)
- `at` — [\<8\>:                               LargeArrayedCollection-accessing](#1962-largearrayedcollection-accessing)
- `at` — [\<9\>:                               LargeInteger-built-ins](#1984-largeinteger-built-ins)
- `at` — [\<10\>:                              LargeZeroInteger-accessing](#11021-largezerointeger-accessing)
- `at` — [\<11\>:                              Link-iteration](#11033-link-iteration)
- `at` — [\<12\>:                              LinkedList-accessing](#11041-linkedlist-accessing)
- `at` — [\<13\>:                              MappedCollection-basic](#11082-mappedcollection-basic)
- `at` — [\<14\>:                              Memory class-accessing](#11091-memory-class-accessing)
- `at` — [\<15\>:                              Object-built ins](#11232-object-built-ins)
- `at` — [\<16\>:                              OrderedCollection-accessing](#11262-orderedcollection-accessing)
- `at` — [\<17\>:                              ProcessEnvironment-accessing](#11353-processenvironment-accessing)
- `at` — [\<18\>:                              RegexResults-accessing](#11451-regexresults-accessing)
- `at` — [\<19\>:                              RunArray-accessing](#11472-runarray-accessing)
- `at` — [\<20\>:                              SmallInteger-builtins](#11555-smallinteger-builtins)
- `at` — [\<21\>:                              String-built ins](#11585-string-built-ins)
- `at` — [\<22\>:                              VFS.ArchiveFile-directory operations](#12082-vfsarchivefile-directory-operations)
- `at` — [\<23\>:                              VFS.ArchiveMember-directory operations](#12094-vfsarchivemember-directory-operations)
- `at` — [\<24\>:                              VFS.FileWrapper-accessing](#12103-vfsfilewrapper-accessing)
- `at` — [\<25\>:                              WeakArray-accessing](#12152-weakarray-accessing)
- `at:ifAbsent:` — [Array-built ins](#142-array-built-ins)
- `at:ifAbsent` — [\<1\>:                      ByteArray-built ins](#1143-bytearray-built-ins)
- `at:ifAbsent` — [\<2\>:                      Dictionary-accessing](#1642-dictionary-accessing)
- `at:ifAbsent` — [\<3\>:                      LookupTable-accessing](#11062-lookuptable-accessing)
- `at:ifAbsent` — [\<4\>:                      Namespace-overrides for superspaces](#11166-namespace-overrides-for-superspaces)
- `at:ifAbsent` — [\<5\>:                      ProcessEnvironment-accessing](#11353-processenvironment-accessing)
- `at:ifAbsent` — [\<6\>:                      SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `at:ifAbsent` — [\<7\>:                      String-built ins](#11585-string-built-ins)
- `at:ifAbsent` — [\<8\>:                      UnicodeString-built ins](#12033-unicodestring-built-ins)
- `at:ifAbsent` — [\<9\>:                      WeakValueLookupTable-hacks](#12212-weakvaluelookuptable-hacks)
- `at:ifAbsent` — [\<10\>:                     WordArray-built ins](#12221-wordarray-built-ins)
- `at:ifAbsentPut:` — [Dictionary-accessing](#1642-dictionary-accessing)
- `at:ifAbsentPut` — [\<1\>:                   ProcessEnvironment-accessing](#11353-processenvironment-accessing)
- `at:ifPresent:` — [Dictionary-accessing](#1642-dictionary-accessing)
- `at:ifPresent` — [\<1\>:                     LookupTable-accessing](#11062-lookuptable-accessing)
- `at:ifPresent` — [\<2\>:                     Namespace-overrides for superspaces](#11166-namespace-overrides-for-superspaces)
- `at:ifPresent` — [\<3\>:                     ProcessEnvironment-accessing](#11353-processenvironment-accessing)
- `at:ifPresent` — [\<4\>:                     WeakValueLookupTable-hacks](#12212-weakvaluelookuptable-hacks)
- `at:put:` — [BindingDictionary-forward declarations](#1104-bindingdictionary-forward-declarations)
- `at:put` — [\<1\>:                           CObject-pointer-like behavior](#13610-cobject-pointer-like-behavior)
- `at:put` — [\<2\>:                           CompiledCode-accessing](#1394-compiledcode-accessing)
- `at:put` — [\<3\>:                           ContextPart-accessing](#1413-contextpart-accessing)
- `at:put` — [\<4\>:                           Dictionary-accessing](#1642-dictionary-accessing)
- `at:put` — [\<5\>:                           HashedCollection-accessing](#1882-hashedcollection-accessing)
- `at:put` — [\<6\>:                           Interval-basic](#1932-interval-basic)
- `at:put` — [\<7\>:                           LargeArrayedCollection-accessing](#1962-largearrayedcollection-accessing)
- `at:put` — [\<8\>:                           LargeInteger-built-ins](#1984-largeinteger-built-ins)
- `at:put` — [\<9\>:                           Link-iteration](#11033-link-iteration)
- `at:put` — [\<10\>:                          LinkedList-accessing](#11041-linkedlist-accessing)
- `at:put` — [\<11\>:                          LookupTable-accessing](#11062-lookuptable-accessing)
- `at:put` — [\<12\>:                          MappedCollection-basic](#11082-mappedcollection-basic)
- `at:put` — [\<13\>:                          Memory class-accessing](#11091-memory-class-accessing)
- `at:put` — [\<14\>:                          MethodDictionary-adding](#11141-methoddictionary-adding)
- `at:put` — [\<15\>:                          Object-built ins](#11232-object-built-ins)
- `at:put` — [\<16\>:                          OrderedCollection-accessing](#11262-orderedcollection-accessing)
- `at:put` — [\<17\>:                          ProcessEnvironment-accessing](#11353-processenvironment-accessing)
- `at:put` — [\<18\>:                          Regex-basic](#11442-regex-basic)
- `at:put` — [\<19\>:                          RunArray-accessing](#11472-runarray-accessing)
- `at:put` — [\<20\>:                          SmallInteger-builtins](#11555-smallinteger-builtins)
- `at:put` — [\<21\>:                          SortedCollection-disabled](#11565-sortedcollection-disabled)
- `at:put` — [\<22\>:                          String-built ins](#11585-string-built-ins)
- `at:put` — [\<23\>:                          WeakArray-accessing](#12152-weakarray-accessing)
- `at:put` — [\<24\>:                          WeakKeyDictionary-accessing](#12172-weakkeydictionary-accessing)
- `at:put:type:` — [CObject-C data access](#1367-cobject-c-data-access)
- `at:type:` — [CObject-C data access](#1367-cobject-c-data-access)
- `atAll:` — [ArrayedCollection-basic](#152-arrayedcollection-basic)
- `atAll` — [\<1\>:                            Dictionary-accessing](#1642-dictionary-accessing)
- `atAll` — [\<2\>:                            MappedCollection-basic](#11082-mappedcollection-basic)
- `atAll` — [\<3\>:                            SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `atAll:put:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `atAll:put` — [\<1\>:                        WeakArray-accessing](#12152-weakarray-accessing)
- `atAllPut:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `atAllPut` — [\<1\>:                         WeakArray-accessing](#12152-weakarray-accessing)
- `atEnd` — [FileDescriptor-testing](#17615-filedescriptor-testing)
- `atEnd` — [FileStream-testing](#1798-filestream-testing)
- `atEnd` — [Generator-stream protocol](#1852-generator-stream-protocol)
- `atEnd` — [ObjectDumper-stream interface](#11247-objectdumper-stream-interface)
- `atEnd` — [PositionableStream-testing](#11337-positionablestream-testing)
- `atEnd` — [Random-basic](#11393-random-basic)
- `atEnd` — [Stream-testing](#115718-stream-testing)
- `atRandom` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `attributeAt:` — [CompiledMethod-attributes](#1405-compiledmethod-attributes)
- `attributeAt:ifAbsent:` — [CompiledMethod-attributes](#1405-compiledmethod-attributes)
- `attributes` — [CompiledMethod-attributes](#1405-compiledmethod-attributes)
- `attributesDo:` — [CompiledMethod-attributes](#1405-compiledmethod-attributes)
- `backspace` — [Character class-constants](#1282-character-class-constants)
- `backtrace` — [ContextPart class-exception handling](#1412-contextpart-class-exception-handling)
- `backtrace` — [ContextPart-printing](#1418-contextpart-printing)
- `backtrace` — [SystemDictionary-miscellaneous](#11616-systemdictionary-miscellaneous)
- `backtraceOn:` — [ContextPart class-exception handling](#1412-contextpart-class-exception-handling)
- `backtraceOn` — [\<1\>:                      ContextPart-printing](#1418-contextpart-printing)
- `badReturnError` — [Object-VM callbacks](#112319-object-vm-callbacks)
- `baseDirectories` — [Package-accessing](#11273-package-accessing)
- `baseDirectories:` — [Package-accessing](#11273-package-accessing)
- `basicAt:` — [Object-built ins](#11232-object-built-ins)
- `basicAt` — [\<1\>:                          SmallInteger-builtins](#11555-smallinteger-builtins)
- `basicAt` — [\<2\>:                          String-built ins](#11585-string-built-ins)
- `basicAt:put:` — [Object-built ins](#11232-object-built-ins)
- `basicAt:put` — [\<1\>:                      SmallInteger-builtins](#11555-smallinteger-builtins)
- `basicAt:put` — [\<2\>:                      String-built ins](#11585-string-built-ins)
- `basicAtEnd` — [PositionableStream-testing](#11337-positionablestream-testing)
- `basicBacktrace` — [SystemDictionary-builtins](#11613-systemdictionary-builtins)
- `basicLeftShift:` — [LargeInteger-primitive operations](#1987-largeinteger-primitive-operations)
- `basicMessageText` — [Exception-accessing](#1725-exception-accessing)
- `basicNew` — [Behavior-builtin](#195-behavior-builtin)
- `basicNew:` — [Behavior-builtin](#195-behavior-builtin)
- `basicNewInFixedSpace` — [Behavior-built ins](#194-behavior-built-ins)
- `basicNewInFixedSpace:` — [Behavior-built ins](#194-behavior-built-ins)
- `basicPosition:` — [PositionableStream-positioning](#11335-positionablestream-positioning)
- `basicPrint` — [Object-built ins](#11232-object-built-ins)
- `basicPrintNl` — [Object-printing](#112313-object-printing)
- `basicPrintOn:` — [Object-printing](#112313-object-printing)
- `basicRightShift:` — [LargeInteger-primitive operations](#1987-largeinteger-primitive-operations)
- `basicSize` — [Object-built ins](#11232-object-built-ins)
- `become:` — [Object-built ins](#11232-object-built-ins)
- `becomeForward:` — [Object-built ins](#11232-object-built-ins)
- `beConsistent` — [Collection-enumeration](#1379-collection-enumeration)
- `beConsistent` — [SortedCollection-enumerating](#11566-sortedcollection-enumerating)
- `before:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `bell` — [Character class-constants](#1282-character-class-constants)
- `between:and:` — [Magnitude-misc methods](#11072-magnitude-misc-methods)
- `between:and` — [\<1\>:                      Random class-shortcuts](#11392-random-class-shortcuts)
- `between:and` — [\<2\>:                      Random-basic](#11393-random-basic)
- `bigEndian` — [Memory class-accessing](#11091-memory-class-accessing)
- `bigObjectThreshold` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `bigObjectThreshold:` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `binaryRepresentationObject` — [CompiledBlock-saving and loading](#1385-compiledblock-saving-and-loading)
- `binaryRepresentationObject` — [CompiledMethod-saving and loading](#14011-compiledmethod-saving-and-loading)
- `binaryRepresentationObject` — [Object-saving and loading](#112315-object-saving-and-loading)
- `binaryRepresentationObject` — [VariableBinding-saving and loading](#12063-variablebinding-saving-and-loading)
- `binaryRepresentationVersion` — [Class-saving and loading](#1318-class-saving-and-loading)
- `binding` — [ClassDescription-conversion](#1322-classdescription-conversion)
- `bindingFor:` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `bindWith:` — [CharacterArray-string processing](#1299-characterarray-string-processing)
- `bindWith:with:` — [CharacterArray-string processing](#1299-characterarray-string-processing)
- `bindWith:with:with:` — [CharacterArray-string processing](#1299-characterarray-string-processing)
- `bindWith:with:with:with:` — [CharacterArray-string processing](#1299-characterarray-string-processing)
- `bindWithArguments:` — [CharacterArray-string processing](#1299-characterarray-string-processing)
- `binomial:` — [Integer-math methods](#1928-integer-math-methods)
- `bitAnd:` — [LargeInteger-bit operations](#1983-largeinteger-bit-operations)
- `bitAnd` — [\<1\>:                           SmallInteger-built ins](#11554-smallinteger-built-ins)
- `bitAt:` — [Integer-bit operators](#1924-integer-bit-operators)
- `bitAt` — [\<1\>:                            LargeInteger-bit operations](#1983-largeinteger-bit-operations)
- `bitAt:put:` — [Integer-bit operators](#1924-integer-bit-operators)
- `bitClear:` — [Integer-bit operators](#1924-integer-bit-operators)
- `bitInvert` — [Integer-bit operators](#1924-integer-bit-operators)
- `bitInvert` — [LargeInteger-bit operations](#1983-largeinteger-bit-operations)
- `bitOr:` — [LargeInteger-bit operations](#1983-largeinteger-bit-operations)
- `bitOr` — [\<1\>:                            SmallInteger-built ins](#11554-smallinteger-built-ins)
- `bits` — [SmallInteger class-getting limits](#11551-smallinteger-class-getting-limits)
- `bitShift:` — [LargeInteger-bit operations](#1983-largeinteger-bit-operations)
- `bitShift` — [\<1\>:                         SmallInteger-built ins](#11554-smallinteger-built-ins)
- `bitXor:` — [LargeInteger-bit operations](#1983-largeinteger-bit-operations)
- `bitXor` — [\<1\>:                           SmallInteger-built ins](#11554-smallinteger-built-ins)
- `block` — [BlockClosure-accessing](#1113-blockclosure-accessing)
- `block` — [CCallbackDescriptor-accessing](#1222-ccallbackdescriptor-accessing)
- `block:` — [BlockClosure class-instance creation](#1111-blockclosure-class-instance-creation)
- `block` — [\<1\>:                            BlockClosure-accessing](#1113-blockclosure-accessing)
- `block` — [\<2\>:                            CCallbackDescriptor-accessing](#1222-ccallbackdescriptor-accessing)
- `block:receiver:` — [BlockClosure class-instance creation](#1111-blockclosure-class-instance-creation)
- `block:receiver:outerContext:` — [BlockClosure class-instance creation](#1111-blockclosure-class-instance-creation)
- `blockAt:` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `bottom` — [Rectangle-accessing](#11422-rectangle-accessing)
- `bottom:` — [Rectangle-accessing](#11422-rectangle-accessing)
- `bottomCenter` — [Rectangle-accessing](#11422-rectangle-accessing)
- `bottomLeft` — [Rectangle-accessing](#11422-rectangle-accessing)
- `bottomLeft:` — [Rectangle-accessing](#11422-rectangle-accessing)
- `bottomRight` — [Rectangle-accessing](#11422-rectangle-accessing)
- `bottomRight:` — [Rectangle-accessing](#11422-rectangle-accessing)
- `broadcast:` — [Object-change and update](#11233-object-change-and-update)
- `broadcast:with:` — [Object-change and update](#11233-object-change-and-update)
- `broadcast:with:with:` — [Object-change and update](#11233-object-change-and-update)
- `broadcast:withArguments:` — [Object-change and update](#11233-object-change-and-update)
- `broadcast:withBlock:` — [Object-change and update](#11233-object-change-and-update)
- `bufferSize` — [FileStream-buffering](#1794-filestream-buffering)
- `bufferSize:` — [FileStream-buffering](#1794-filestream-buffering)
- `bufferStart` — [FileStream-basic](#1793-filestream-basic)
- `builtFiles` — [Package-accessing](#11273-package-accessing)
- `builtFilesFor:` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `byteAt:` — [ByteArray-built ins](#1143-bytearray-built-ins)
- `byteAt` — [\<1\>:                           String-accessing](#11583-string-accessing)
- `byteAt:put:` — [ByteArray-built ins](#1143-bytearray-built-ins)
- `byteAt:put` — [\<1\>:                       String-accessing](#11583-string-accessing)
- `bytecodeAt:` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `bytecodeAt:put:` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `byteCodeCounter` — [SystemDictionary-builtins](#11613-systemdictionary-builtins)
- `bytecodeInfoTable` — [CompiledCode class-tables](#1393-compiledcode-class-tables)
- `bytes:from:compare:` — [LargePositiveInteger-helper byte-level methods](#11003-largepositiveinteger-helper-byte-level-methods)
- `bytes:from:subtract:` — [LargePositiveInteger-helper byte-level methods](#11003-largepositiveinteger-helper-byte-level-methods)
- `bytes:multiply:` — [LargePositiveInteger-helper byte-level methods](#11003-largepositiveinteger-helper-byte-level-methods)
- `bytesLeftShift:` — [LargePositiveInteger-helper byte-level methods](#11003-largepositiveinteger-helper-byte-level-methods)
- `bytesLeftShift:big:` — [LargePositiveInteger-helper byte-level methods](#11003-largepositiveinteger-helper-byte-level-methods)
- `bytesLeftShift:n:` — [LargePositiveInteger-helper byte-level methods](#11003-largepositiveinteger-helper-byte-level-methods)
- `bytesPerOOP` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `bytesPerOTE` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `bytesRightShift:big:` — [LargePositiveInteger-helper byte-level methods](#11003-largepositiveinteger-helper-byte-level-methods)
- `bytesRightShift:n:` — [LargePositiveInteger-helper byte-level methods](#11003-largepositiveinteger-helper-byte-level-methods)
- `bytesTrailingZeros:` — [LargePositiveInteger-helper byte-level methods](#11003-largepositiveinteger-helper-byte-level-methods)
- `callCC` — [Continuation-invocation](#1422-continuation-invocation)
- `caller` — [BlockContext-accessing](#1121-blockcontext-accessing)
- `callInto:` — [CCallable-calling](#1213-ccallable-calling)
- `callNoRetryFrom:into:` — [CCallable-calling](#1213-ccallable-calling)
- `callouts` — [Package-accessing](#11273-package-accessing)
- `calloutsFor:` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `canCache` — [NetClients.URL-testing](#11189-netclientsurl-testing)
- `canLoad:` — [PackageLoader class-testing](#11283-packageloader-class-testing)
- `canRead` — [FileDescriptor-accessing](#1764-filedescriptor-accessing)
- `canUnderstand:` — [Behavior-testing the method dictionary](#1925-behavior-testing-the-method-dictionary)
- `canWrite` — [FileDescriptor-accessing](#1764-filedescriptor-accessing)
- `capacity` — [Collection-testing collections](#13715-collection-testing-collections)
- `capacity` — [HashedCollection-testing collections](#18810-hashedcollection-testing-collections)
- `castTo:` — [ByteArray-CObject](#1144-bytearray-cobject)
- `castTo` — [\<1\>:                           CObject-conversion](#1368-cobject-conversion)
- `categoriesFor:are:` — [Class-instance creation - alternative](#1315-class-instance-creation---alternative)
- `category` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `category` — [Metaclass-delegation](#11125-metaclass-delegation)
- `category` — [MethodInfo-accessing](#11151-methodinfo-accessing)
- `category:` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `category` — [\<1\>:                         MethodInfo-accessing](#11151-methodinfo-accessing)
- `cCall:numArgs:attributes:` — [CompiledMethod class-c call-outs](#1401-compiledmethod-class-c-call-outs)
- `ceiling` — [Float-built ins](#1805-float-built-ins)
- `ceiling` — [Fraction-coercing](#1845-fraction-coercing)
- `ceiling` — [Integer-converting](#1925-integer-converting)
- `ceiling` — [ScaledDecimal-coercion](#11483-scaleddecimal-coercion)
- `ceilingLog:` — [Float-transcendental operations](#18017-float-transcendental-operations)
- `ceilingLog` — [\<1\>:                       Integer-math methods](#1928-integer-math-methods)
- `ceilingLog` — [\<2\>:                       Number-misc math](#11229-number-misc-math)
- `center` — [Rectangle-accessing](#11422-rectangle-accessing)
- `centralDirectoryRangeIn:` — [VFS.ZipFile-members](#12131-vfszipfile-members)
- `changeClassTo:` — [Object-built ins](#11232-object-built-ins)
- `changed` — [Object-change and update](#11233-object-change-and-update)
- `changed:` — [Object-change and update](#11233-object-change-and-update)
- `changed` — [\<1\>:                          ObjectMemory class-initialization](#11253-objectmemory-class-initialization)
- `charAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `charAt` — [\<1\>:                           Memory class-accessing](#11091-memory-class-accessing)
- `charAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `charAt:put` — [\<1\>:                       Memory class-accessing](#11091-memory-class-accessing)
- `check:` — [Class-security](#1319-class-security)
- `check` — [\<1\>:                            SecurityPolicy-querying](#11492-securitypolicy-querying)
- `check:for:` — [Permission-testing](#11293-permission-testing)
- `checkError` — [File class-file operations](#1752-file-class-file-operations)
- `checkError` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `checkError:` — [File class-file operations](#1752-file-class-file-operations)
- `checkIndexableBounds:` — [Object-built ins](#11232-object-built-ins)
- `checkIndexableBounds:ifAbsent:` — [Object-built ins](#11232-object-built-ins)
- `checkIndexableBounds:put:` — [Object-built ins](#11232-object-built-ins)
- `checkSecurityFor:` — [ContextPart-security checks](#1419-contextpart-security-checks)
- `checkTagIfInPath:` — [Package-still unclassified](#11274-package-still-unclassified)
- `chiSquare` — [Random-testing](#11394-random-testing)
- `chiSquare:range:` — [Random-testing](#11394-random-testing)
- `class` — [Autoload-accessing](#172-autoload-accessing)
- `class` — [Object-built ins](#11232-object-built-ins)
- `class:from:` — [Autoload class-instance creation](#171-autoload-class-instance-creation)
- `class:in:from:` — [Autoload class-instance creation](#171-autoload-class-instance-creation)
- `class:in:loader:` — [Autoload class-instance creation](#171-autoload-class-instance-creation)
- `class:loader:` — [Autoload class-instance creation](#171-autoload-class-instance-creation)
- `classAt:` — [AbstractNamespace-accessing](#112-abstractnamespace-accessing)
- `classAt:ifAbsent:` — [AbstractNamespace-accessing](#112-abstractnamespace-accessing)
- `classify:under:` — [ClassDescription-organization of messages and classes](#1325-classdescription-organization-of-messages-and-classes)
- `classPool` — [Behavior-accessing instances and variables](#192-behavior-accessing-instances-and-variables)
- `classPool` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `classPool` — [Metaclass-delegation](#11125-metaclass-delegation)
- `classPragmas` — [CCompound class-subclass creation](#1242-ccompound-class-subclass-creation)
- `classPragmas` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `classVariableString` — [ClassDescription-printing](#1327-classdescription-printing)
- `classVarNames` — [Behavior-accessing instances and variables](#192-behavior-accessing-instances-and-variables)
- `classVarNames` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `classVarNames` — [Metaclass-delegation](#11125-metaclass-delegation)
- `clean` — [FileStream-buffering](#1794-filestream-buffering)
- `clearBit:` — [Integer-bit operators](#1924-integer-bit-operators)
- `clearGCFlag:` — [WeakArray-accessing](#12152-weakarray-accessing)
- `client` — [ContextPart-accessing](#1413-contextpart-accessing)
- `clockPrecision` — [DateTime class-information](#1601-datetime-class-information)
- `close` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `close` — [PositionableStream-accessing-reading](#11332-positionablestream-accessing-reading)
- `close` — [Stream-polymorphism](#115712-stream-polymorphism)
- `closeTo:` — [Number-testing](#112213-number-testing)
- `cObjectBinding:` — [CType class-C instance creation](#1521-ctype-class-c-instance-creation)
- `cObjectType` — [CType-accessing](#1523-ctype-accessing)
- `cObjectType:` — [CType class-C instance creation](#1521-ctype-class-c-instance-creation)
- `cObjStoredType` — [CByte class-conversion](#1201-cbyte-class-conversion)
- `cObjStoredType` — [CByte-accessing](#1202-cbyte-accessing)
- `cObjStoredType` — [CChar class-accessing](#1231-cchar-class-accessing)
- `cObjStoredType` — [CChar-accessing](#1232-cchar-accessing)
- `cObjStoredType` — [CDouble class-accessing](#1251-cdouble-class-accessing)
- `cObjStoredType` — [CDouble-accessing](#1252-cdouble-accessing)
- `cObjStoredType` — [CFloat class-accessing](#1261-cfloat-class-accessing)
- `cObjStoredType` — [CFloat-accessing](#1262-cfloat-accessing)
- `cObjStoredType` — [CInt class-accessing](#1301-cint-class-accessing)
- `cObjStoredType` — [CInt-accessing](#1302-cint-accessing)
- `cObjStoredType` — [CLong class-accessing](#1331-clong-class-accessing)
- `cObjStoredType` — [CLong-accessing](#1332-clong-accessing)
- `cObjStoredType` — [CLongDouble class-accessing](#1341-clongdouble-class-accessing)
- `cObjStoredType` — [CLongDouble-accessing](#1342-clongdouble-accessing)
- `cObjStoredType` — [CLongLong class-accessing](#1351-clonglong-class-accessing)
- `cObjStoredType` — [CLongLong-accessing](#1352-clonglong-accessing)
- `cObjStoredType` — [CScalar-accessing](#1452-cscalar-accessing)
- `cObjStoredType` — [CShort class-accessing](#1471-cshort-class-accessing)
- `cObjStoredType` — [CShort-accessing](#1472-cshort-accessing)
- `cObjStoredType` — [CSmalltalk class-accessing](#1481-csmalltalk-class-accessing)
- `cObjStoredType` — [CSmalltalk-accessing](#1482-csmalltalk-accessing)
- `cObjStoredType` — [CString class-accessing](#1491-cstring-class-accessing)
- `cObjStoredType` — [CString-accessing](#1493-cstring-accessing)
- `cObjStoredType` — [CUChar class-getting info](#1531-cuchar-class-getting-info)
- `cObjStoredType` — [CUChar-accessing](#1532-cuchar-accessing)
- `cObjStoredType` — [CUInt class-accessing](#1541-cuint-class-accessing)
- `cObjStoredType` — [CUInt-accessing](#1542-cuint-accessing)
- `cObjStoredType` — [CULong class-accessing](#1551-culong-class-accessing)
- `cObjStoredType` — [CULong-accessing](#1552-culong-accessing)
- `cObjStoredType` — [CULongLong class-accessing](#1561-culonglong-class-accessing)
- `cObjStoredType` — [CULongLong-accessing](#1562-culonglong-accessing)
- `cObjStoredType` — [CUShort class-accessing](#1581-cushort-class-accessing)
- `cObjStoredType` — [CUShort-accessing](#1582-cushort-accessing)
- `codePoint` — [Character-built ins](#1286-character-built-ins)
- `codePoint:` — [Character class-built ins](#1281-character-class-built-ins)
- `coerce:` — [FloatD class-converting](#1813-floatd-class-converting)
- `coerce` — [\<1\>:                           FloatD-coercing](#1815-floatd-coercing)
- `coerce` — [\<2\>:                           FloatE class-converting](#1824-floate-class-converting)
- `coerce` — [\<3\>:                           FloatE-coercing](#1826-floate-coercing)
- `coerce` — [\<4\>:                           FloatQ class-converting](#1833-floatq-class-converting)
- `coerce` — [\<5\>:                           FloatQ-coercing](#1835-floatq-coercing)
- `coerce` — [\<6\>:                           Fraction class-converting](#1841-fraction-class-converting)
- `coerce` — [\<7\>:                           Fraction-coercing](#1845-fraction-coercing)
- `coerce` — [\<8\>:                           Integer class-converting](#1921-integer-class-converting)
- `coerce` — [\<9\>:                           Integer-converting](#1925-integer-converting)
- `coerce` — [\<10\>:                          LargeInteger-coercion](#1985-largeinteger-coercion)
- `coerce` — [\<11\>:                          Number class-converting](#11221-number-class-converting)
- `coerce` — [\<12\>:                          Number-converting](#11226-number-converting)
- `coerce` — [\<13\>:                          ScaledDecimal-coercion](#11483-scaleddecimal-coercion)
- `collect:` — [ArrayedCollection-enumerating the elements of a collection](#156-arrayedcollection-enumerating-the-elements-of-a-collection)
- `collect` — [\<1\>:                          Collection-enumeration](#1379-collection-enumeration)
- `collect` — [\<2\>:                          Dictionary-dictionary enumerating](#1645-dictionary-dictionary-enumerating)
- `collect` — [\<3\>:                          Interval-basic](#1932-interval-basic)
- `collect` — [\<4\>:                          Iterable-enumeration](#1942-iterable-enumeration)
- `collect` — [\<5\>:                          MappedCollection-basic](#11082-mappedcollection-basic)
- `collect` — [\<6\>:                          Stream-filtering](#115711-stream-filtering)
- `collection` — [SystemExceptions.IndexOutOfRange-accessing](#11692-systemexceptionsindexoutofrange-accessing)
- `collection:` — [SystemExceptions.IndexOutOfRange-accessing](#11692-systemexceptionsindexoutofrange-accessing)
- `collection:map:` — [MappedCollection class-instance creation](#11081-mappedcollection-class-instance-creation)
- `comment` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `comment` — [Metaclass-delegation](#11125-metaclass-delegation)
- `comment:` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `compact` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `compile:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `compile:classified:` — [ClassDescription-compiling](#1321-classdescription-compiling)
- `compile:classified:ifError:` — [ClassDescription-compiling](#1321-classdescription-compiling)
- `compile:classified:notifying:` — [ClassDescription-compiling](#1321-classdescription-compiling)
- `compile:ifError:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `compile:notifying:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `compileAll` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `compileAll:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `compileAllSubclasses` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `compileAllSubclasses:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `compiledMethodAt:` — [Behavior-accessing the method dictionary](#193-behavior-accessing-the-method-dictionary)
- `compiledMethodAt:ifAbsent:` — [Behavior-accessing the method dictionary](#193-behavior-accessing-the-method-dictionary)
- `compilerClass` — [Behavior-compiling](#198-behavior-compiling)
- `compileSize:align:` — [CCompound class-subclass creation](#1242-ccompound-class-subclass-creation)
- `compress` — [LargeArrayedCollection-accessing](#1962-largearrayedcollection-accessing)
- `computeAggregateType:` — [CType class-C instance creation](#1521-ctype-class-c-instance-creation)
- `conform:` — [Iterable-enumeration](#1942-iterable-enumeration)
- `construct:` — [NetClients.URL-utilities](#111810-netclientsurl-utilities)
- `contains:` — [Iterable-enumeration](#1942-iterable-enumeration)
- `contains` — [\<1\>:                         Rectangle-testing](#11426-rectangle-testing)
- `containsLiteral:` — [CompiledCode-testing accesses](#13911-compiledcode-testing-accesses)
- `containsPoint:` — [Rectangle-testing](#11426-rectangle-testing)
- `contents` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `contents` — [FilePath-file operations](#1779-filepath-file-operations)
- `contents` — [MappedCollection-basic](#11082-mappedcollection-basic)
- `contents` — [NetClients.URL-still unclassified](#11188-netclientsurl-still-unclassified)
- `contents` — [PositionableStream-accessing-reading](#11332-positionablestream-accessing-reading)
- `contents` — [ReadWriteStream-positioning](#11412-readwritestream-positioning)
- `contents` — [Stream-accessing-reading](#11571-stream-accessing-reading)
- `contents` — [WriteStream-accessing-writing](#12232-writestream-accessing-writing)
- `context` — [Exception-exception handling](#17210-exception-exception-handling)
- `context` — [Process-basic](#11342-process-basic)
- `continue:` — [ContextPart-built ins](#1414-contextpart-built-ins)
- `contractTo:` — [CharacterArray-string processing](#1299-characterarray-string-processing)
- `convertFromVersion:withFixedVariables:indexedVariables:for:` — [Class-saving and loading](#1318-class-saving-and-loading)
- `copy` — [BindingDictionary-copying](#1103-bindingdictionary-copying)
- `copy` — [BlockClosure-overriding](#1118-blockclosure-overriding)
- `copy` — [Object-copying](#11237-object-copying)
- `copy` — [Rectangle-copying](#11423-rectangle-copying)
- `copy` — [Regex-basic](#11442-regex-basic)
- `copy` — [UndefinedObject-basic](#12011-undefinedobject-basic)
- `copy:from:` — [ClassDescription-copying](#1323-classdescription-copying)
- `copy:from:classified:` — [ClassDescription-copying](#1323-classdescription-copying)
- `copyAfter:` — [SequenceableCollection-copying SequenceableCollections](#11515-sequenceablecollection-copying-sequenceablecollections)
- `copyAfterLast:` — [SequenceableCollection-copying SequenceableCollections](#11515-sequenceablecollection-copying-sequenceablecollections)
- `copyAll:from:` — [ClassDescription-copying](#1323-classdescription-copying)
- `copyAll:from:classified:` — [ClassDescription-copying](#1323-classdescription-copying)
- `copyAllCategoriesFrom:` — [ClassDescription-copying](#1323-classdescription-copying)
- `copyCategory:from:` — [ClassDescription-copying](#1323-classdescription-copying)
- `copyCategory:from:classified:` — [ClassDescription-copying](#1323-classdescription-copying)
- `copyEmpty:` — [AbstractNamespace-copying](#114-abstractnamespace-copying)
- `copyEmpty` — [\<1\>:                        BindingDictionary-copying](#1103-bindingdictionary-copying)
- `copyEmpty` — [\<2\>:                        SortedCollection-copying](#11564-sortedcollection-copying)
- `copyEmptyForCollect` — [BindingDictionary-copying](#1103-bindingdictionary-copying)
- `copyEmptyForCollect:` — [BindingDictionary-copying](#1103-bindingdictionary-copying)
- `copyFrom:` — [SequenceableCollection-copying SequenceableCollections](#11515-sequenceablecollection-copying-sequenceablecollections)
- `copyFrom:to:` — [ArrayedCollection-basic](#152-arrayedcollection-basic)
- `copyFrom:to` — [\<1\>:                      FileDescriptor-basic](#1765-filedescriptor-basic)
- `copyFrom:to` — [\<2\>:                      FileSegment-basic](#1783-filesegment-basic)
- `copyFrom:to` — [\<3\>:                      FileStream-basic](#1793-filestream-basic)
- `copyFrom:to` — [\<4\>:                      Interval-basic](#1932-interval-basic)
- `copyFrom:to` — [\<5\>:                      MappedCollection-basic](#11082-mappedcollection-basic)
- `copyFrom:to` — [\<6\>:                      PositionableStream-accessing-reading](#11332-positionablestream-accessing-reading)
- `copyFrom:to` — [\<7\>:                      SequenceableCollection-copying SequenceableCollections](#11515-sequenceablecollection-copying-sequenceablecollections)
- `copyFrom:to:replacingAllRegex:with:` — [String-regex](#115810-string-regex)
- `copyFrom:to:replacingRegex:with:` — [String-regex](#115810-string-regex)
- `copyReplaceAll:with:` — [ArrayedCollection-copying Collections](#155-arrayedcollection-copying-collections)
- `copyReplaceAll:with` — [\<1\>:              SequenceableCollection-copying SequenceableCollections](#11515-sequenceablecollection-copying-sequenceablecollections)
- `copyReplaceFrom:to:with:` — [ArrayedCollection-copying Collections](#155-arrayedcollection-copying-collections)
- `copyReplaceFrom:to:with` — [\<1\>:          SequenceableCollection-copying SequenceableCollections](#11515-sequenceablecollection-copying-sequenceablecollections)
- `copyReplaceFrom:to:withObject:` — [ArrayedCollection-copying Collections](#155-arrayedcollection-copying-collections)
- `copyReplaceFrom:to:withObject` — [\<1\>:    SequenceableCollection-copying SequenceableCollections](#11515-sequenceablecollection-copying-sequenceablecollections)
- `copyReplacing:withObject:` — [Collection-copying Collections](#1377-collection-copying-collections)
- `copyReplacingAllRegex:with:` — [String-regex](#115810-string-regex)
- `copyReplacingRegex:with:` — [String-regex](#115810-string-regex)
- `copyStack` — [ContextPart-copying](#1415-contextpart-copying)
- `copyUpTo:` — [SequenceableCollection-copying SequenceableCollections](#11515-sequenceablecollection-copying-sequenceablecollections)
- `copyUpToLast:` — [SequenceableCollection-copying SequenceableCollections](#11515-sequenceablecollection-copying-sequenceablecollections)
- `copyWith:` — [ArrayedCollection-basic](#152-arrayedcollection-basic)
- `copyWith` — [\<1\>:                         Collection-copying Collections](#1377-collection-copying-collections)
- `copyWithFirst:` — [SequenceableCollection-copying SequenceableCollections](#11515-sequenceablecollection-copying-sequenceablecollections)
- `copyWithout:` — [ArrayedCollection-basic](#152-arrayedcollection-basic)
- `copyWithout` — [\<1\>:                      Collection-copying Collections](#1377-collection-copying-collections)
- `copyWithoutAuxiliaryParts` — [NetClients.URL-copying](#11185-netclientsurl-copying)
- `copyWithoutFragment` — [NetClients.URL-copying](#11185-netclientsurl-copying)
- `corner` — [Rectangle-accessing](#11422-rectangle-accessing)
- `corner:` — [Point-converting](#11325-point-converting)
- `corner` — [\<1\>:                           Rectangle-accessing](#11422-rectangle-accessing)
- `cos` — [Float-built ins](#1805-float-built-ins)
- `cos` — [Number-misc math](#11229-number-misc-math)
- `cosh` — [Number-misc math](#11229-number-misc-math)
- `costOfNewIndex` — [LargeByteArray-overridden](#1971-largebytearray-overridden)
- `count:` — [Iterable-enumeration](#1942-iterable-enumeration)
- `cr` — [Character class-constants](#1282-character-class-constants)
- `cr` — [Stream-character writing](#11576-stream-character-writing)
- `cr` — [TextCollector-accessing](#11982-textcollector-accessing)
- `create` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `create:` — [Directory class-file operations](#1662-directory-class-file-operations)
- `createDirectories` — [FilePath-directory operations](#1776-filepath-directory-operations)
- `createDirectory` — [File-directory operations](#1759-file-directory-operations)
- `createDirectory` — [FilePath-directory operations](#1776-filepath-directory-operations)
- `createDirectory:` — [VFS.ArchiveMember-directory operations](#12094-vfsarchivemember-directory-operations)
- `createDirectory` — [\<1\>:                  VFS.ZipFile-members](#12131-vfszipfile-members)
- `createGetMethod:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `createGetMethod` — [\<1\>:                  ClassDescription-organization of messages and classes](#1325-classdescription-organization-of-messages-and-classes)
- `createGetMethod:default:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `createGetMethod:default` — [\<1\>:          ClassDescription-organization of messages and classes](#1325-classdescription-organization-of-messages-and-classes)
- `createSetMethod:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `createSetMethod` — [\<1\>:                  ClassDescription-organization of messages and classes](#1325-classdescription-organization-of-messages-and-classes)
- `createTemporary:` — [Directory class-file operations](#1662-directory-class-file-operations)
- `creationTime` — [File-accessing](#1757-file-accessing)
- `creationTime` — [FilePath-accessing](#1773-filepath-accessing)
- `creationTime` — [VFS.ArchiveMember-accessing](#12091-vfsarchivemember-accessing)
- `creationTime` — [VFS.FileWrapper-delegation](#12105-vfsfilewrapper-delegation)
- `critical:` — [RecursionLock-mutual exclusion](#11433-recursionlock-mutual-exclusion)
- `critical` — [\<1\>:                         Semaphore-mutual exclusion](#11504-semaphore-mutual-exclusion)
- `critical` — [\<2\>:                         TextCollector-accessing](#11982-textcollector-accessing)
- `crTab` — [Stream-character writing](#11576-stream-character-writing)
- `cull:` — [BlockClosure-built ins](#1114-blockclosure-built-ins)
- `cull:cull:` — [BlockClosure-built ins](#1114-blockclosure-built-ins)
- `cull:cull:cull:` — [BlockClosure-built ins](#1114-blockclosure-built-ins)
- `current` — [Continuation class-instance creation](#1421-continuation-class-instance-creation)
- `current` — [Namespace class-accessing](#11161-namespace-class-accessing)
- `current` — [ObjectMemory class-accessing](#11251-objectmemory-class-accessing)
- `current:` — [Namespace class-accessing](#11161-namespace-class-accessing)
- `currentDo:` — [Continuation class-instance creation](#1421-continuation-class-instance-creation)
- `currentFileName` — [ContextPart-accessing](#1413-contextpart-accessing)
- `currentLine` — [ContextPart-debugging](#1416-contextpart-debugging)
- `currentLineInFile` — [ContextPart-debugging](#1416-contextpart-debugging)
- `date:time:` — [DateTime class-instance creation (non-ANSI)](#1603-datetime-class-instance-creation-non-ansi)
- `date:time:offset:` — [DateTime class-instance creation (non-ANSI)](#1603-datetime-class-instance-creation-non-ansi)
- `dateAndTimeNow` — [Date class-instance creation (Blue Book)](#1593-date-class-instance-creation-blue-book)
- `day` — [Date-compatibility (non-ANSI)](#1595-date-compatibility-non-ansi)
- `dayName` — [Date-compatibility (non-ANSI)](#1595-date-compatibility-non-ansi)
- `dayOfMonth` — [Date-date computations](#1596-date-date-computations)
- `dayOfWeek` — [Date-date computations](#1596-date-date-computations)
- `dayOfWeek` — [DateTime-computations](#1605-datetime-computations)
- `dayOfWeek:` — [Date class-basic](#1591-date-class-basic)
- `dayOfWeekAbbreviation` — [Date-date computations](#1596-date-date-computations)
- `dayOfWeekName` — [Date-date computations](#1596-date-date-computations)
- `dayOfYear` — [Date-date computations](#1596-date-date-computations)
- `days` — [Duration-arithmetics](#1693-duration-arithmetics)
- `days:` — [Duration class-instance creation](#1691-duration-class-instance-creation)
- `days:hours:minutes:seconds:` — [Duration class-instance creation](#1691-duration-class-instance-creation)
- `daysFromBaseDay` — [Date-date computations](#1596-date-date-computations)
- `daysInMonth` — [Date-date computations](#1596-date-date-computations)
- `daysInMonth:forYear:` — [Date class-basic](#1591-date-class-basic)
- `daysInYear` — [Date-date computations](#1596-date-date-computations)
- `daysInYear:` — [Date class-basic](#1591-date-class-basic)
- `daysLeftInMonth` — [Date-date computations](#1596-date-date-computations)
- `daysLeftInYear` — [Date-date computations](#1596-date-date-computations)
- `debug` — [SystemDictionary-builtins](#11613-systemdictionary-builtins)
- `debugger` — [ContextPart-debugging](#1416-contextpart-debugging)
- `debugger` — [Process-basic](#11342-process-basic)
- `debuggerClass` — [Behavior-pluggable behavior (not yet implemented)](#1917-behavior-pluggable-behavior-not-yet-implemented)
- `debuggerClass` — [ContextPart-debugging](#1416-contextpart-debugging)
- `debuggerClass` — [Metaclass-delegation](#11125-metaclass-delegation)
- `decimalDigits` — [FloatD class-characterization](#1812-floatd-class-characterization)
- `decimalDigits` — [FloatE class-characterization](#1823-floate-class-characterization)
- `decimalDigits` — [FloatQ class-characterization](#1832-floatq-class-characterization)
- `declaration` — [CCompound class-subclass creation](#1242-ccompound-class-subclass-creation)
- `declaration:` — [CCompound class-subclass creation](#1242-ccompound-class-subclass-creation)
- `declaration` — [\<1\>:                      CStruct class-subclass creation](#1511-cstruct-class-subclass-creation)
- `declaration` — [\<2\>:                      CUnion class-subclass creation](#1571-cunion-class-subclass-creation)
- `declaration:inject:into:` — [CCompound class-subclass creation](#1242-ccompound-class-subclass-creation)
- `declarationTrace` — [SystemDictionary-builtins](#11613-systemdictionary-builtins)
- `declarationTrace:` — [SystemDictionary-builtins](#11613-systemdictionary-builtins)
- `decode:` — [NetClients.URL class-encoding URLs](#11181-netclientsurl-class-encoding-urls)
- `decodedFields` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `decodedFile` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `decodedFragment` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `decompile:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `decompilerClass` — [Behavior-pluggable behavior (not yet implemented)](#1917-behavior-pluggable-behavior-not-yet-implemented)
- `decr` — [CObject-pointer-like behavior](#13610-cobject-pointer-like-behavior)
- `decrBy:` — [CObject-pointer-like behavior](#13610-cobject-pointer-like-behavior)
- `deepCopy` — [BindingDictionary-copying](#1103-bindingdictionary-copying)
- `deepCopy` — [BlockClosure-overriding](#1118-blockclosure-overriding)
- `deepCopy` — [Boolean-overriding](#1134-boolean-overriding)
- `deepCopy` — [CompiledCode-copying](#1396-compiledcode-copying)
- `deepCopy` — [ContextPart-copying](#1415-contextpart-copying)
- `deepCopy` — [HashedCollection-copying](#1884-hashedcollection-copying)
- `deepCopy` — [Number-copying](#11227-number-copying)
- `deepCopy` — [Object-copying](#11237-object-copying)
- `deepCopy` — [RunArray-copying](#11475-runarray-copying)
- `deepCopy` — [Symbol-basic](#11595-symbol-basic)
- `deepCopy` — [UndefinedObject-basic](#12011-undefinedobject-basic)
- `deepCopy` — [WeakArray-conversion](#12153-weakarray-conversion)
- `deepCopy` — [WeakSet-copying](#12192-weakset-copying)
- `defaultAction` — [Exception-exception description](#1729-exception-exception-description)
- `defaultAction` — [Notification-exception description](#11191-notification-exception-description)
- `defaultAction` — [SystemExceptions.UnhandledException-accessing](#11911-systemexceptionsunhandledexception-accessing)
- `defaultElement` — [LargeByteArray-overridden](#1971-largebytearray-overridden)
- `defaultElement` — [LargeWordArray-overridden](#11011-largewordarray-overridden)
- `defaultEncoding` — [UnicodeString class-multibyte encodings](#12032-unicodestring-class-multibyte-encodings)
- `defaultSortBlock` — [SortedCollection class-hacking](#11561-sortedcollection-class-hacking)
- `define:` — [BindingDictionary-accessing](#1101-bindingdictionary-accessing)
- `defineAsyncCFunc:withSelectorArgs:args:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `defineAsyncCFunc:withSelectorArgs:args` — [\<1\>: ClassDescription-organization of messages and classes](#1325-classdescription-organization-of-messages-and-classes)
- `defineCFunc:as:` — [DLD class-C call-outs](#1671-dld-class-c-call-outs)
- `defineCFunc:withSelectorArgs:returning:args:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `defineCFunc:withSelectorArgs:returning:args` — [\<1\>: ClassDescription-organization of messages and classes](#1325-classdescription-organization-of-messages-and-classes)
- `definedKeys` — [Dictionary-namespace protocol](#1648-dictionary-namespace-protocol)
- `defineExternFunc:` — [DLD class-dynamic linking](#1672-dld-class-dynamic-linking)
- `definesKey:` — [Dictionary-namespace protocol](#1648-dictionary-namespace-protocol)
- `degreesToRadians` — [Number-converting](#11226-number-converting)
- `delayDuration` — [Delay-accessing](#1624-delay-accessing)
- `denominator` — [Fraction-accessing](#1843-fraction-accessing)
- `denominator` — [Integer-accessing](#1922-integer-accessing)
- `denormalized` — [Float class-characterization](#1802-float-class-characterization)
- `deny` — [Permission-accessing](#11292-permission-accessing)
- `denying` — [Permission-accessing](#11292-permission-accessing)
- `denying:target:action:` — [Permission class-testing](#11291-permission-class-testing)
- `denying:target:actions:` — [Permission class-testing](#11291-permission-class-testing)
- `dependencies` — [Object class-initialization](#11231-object-class-initialization)
- `dependencies:` — [Object class-initialization](#11231-object-class-initialization)
- `dependents` — [Object-dependents access](#11239-object-dependents-access)
- `deref:` — [Memory class-accessing](#11091-memory-class-accessing)
- `description` — [ArithmeticError-description](#131-arithmeticerror-description)
- `description` — [Error-exception description](#1711-error-exception-description)
- `description` — [Exception-exception description](#1729-exception-exception-description)
- `description` — [Halt-description](#1871-halt-description)
- `description` — [MessageNotUnderstood-description](#11112-messagenotunderstood-description)
- `description` — [Notification-exception description](#11191-notification-exception-description)
- `description` — [SystemExceptions.AlreadyDefined-accessing](#11621-systemexceptionsalreadydefined-accessing)
- `description` — [SystemExceptions.ArgumentOutOfRange-accessing](#11632-systemexceptionsargumentoutofrange-accessing)
- `description` — [SystemExceptions.BadReturn-accessing](#11641-systemexceptionsbadreturn-accessing)
- `description` — [SystemExceptions.CInterfaceError-accessing](#11651-systemexceptionscinterfaceerror-accessing)
- `description` — [SystemExceptions.EmptyCollection-accessing](#11661-systemexceptionsemptycollection-accessing)
- `description` — [SystemExceptions.EndOfStream-accessing](#11672-systemexceptionsendofstream-accessing)
- `description` — [SystemExceptions.FileError-accessing](#11681-systemexceptionsfileerror-accessing)
- `description` — [SystemExceptions.IndexOutOfRange-accessing](#11692-systemexceptionsindexoutofrange-accessing)
- `description` — [SystemExceptions.InvalidProcessState-accessing](#11711-systemexceptionsinvalidprocessstate-accessing)
- `description` — [SystemExceptions.InvalidSize-accessing](#11721-systemexceptionsinvalidsize-accessing)
- `description` — [SystemExceptions.InvalidValue-accessing](#11742-systemexceptionsinvalidvalue-accessing)
- `description` — [SystemExceptions.MutationError-accessing](#11762-systemexceptionsmutationerror-accessing)
- `description` — [SystemExceptions.NoRunnableProcess-accessing](#11771-systemexceptionsnorunnableprocess-accessing)
- `description` — [SystemExceptions.NotEnoughElements-accessing](#11782-systemexceptionsnotenoughelements-accessing)
- `description` — [SystemExceptions.NotFound-accessing](#11792-systemexceptionsnotfound-accessing)
- `description` — [SystemExceptions.NotImplemented-accessing](#11801-systemexceptionsnotimplemented-accessing)
- `description` — [SystemExceptions.NotIndexable-accessing](#11811-systemexceptionsnotindexable-accessing)
- `description` — [SystemExceptions.NotYetImplemented-accessing](#11821-systemexceptionsnotyetimplemented-accessing)
- `description` — [SystemExceptions.PrimitiveFailed-accessing](#11841-systemexceptionsprimitivefailed-accessing)
- `description` — [SystemExceptions.ProcessBeingTerminated-accessing](#11852-systemexceptionsprocessbeingterminated-accessing)
- `description` — [SystemExceptions.ProcessTerminated-accessing](#11861-systemexceptionsprocessterminated-accessing)
- `description` — [SystemExceptions.ReadOnlyObject-accessing](#11871-systemexceptionsreadonlyobject-accessing)
- `description` — [SystemExceptions.SecurityError-accessing](#11882-systemexceptionssecurityerror-accessing)
- `description` — [SystemExceptions.ShouldNotImplement-accessing](#11891-systemexceptionsshouldnotimplement-accessing)
- `description` — [SystemExceptions.SubclassResponsibility-accessing](#11901-systemexceptionssubclassresponsibility-accessing)
- `description` — [SystemExceptions.UnhandledException-accessing](#11911-systemexceptionsunhandledexception-accessing)
- `description` — [SystemExceptions.UserInterrupt-accessing](#11921-systemexceptionsuserinterrupt-accessing)
- `description` — [SystemExceptions.VerificationError-accessing](#11931-systemexceptionsverificationerror-accessing)
- `description` — [SystemExceptions.VMError-accessing](#11941-systemexceptionsvmerror-accessing)
- `description` — [SystemExceptions.WrongArgumentCount-accessing](#11951-systemexceptionswrongargumentcount-accessing)
- `description` — [SystemExceptions.WrongClass-accessing](#11962-systemexceptionswrongclass-accessing)
- `description` — [Warning-exception description](#12141-warning-exception-description)
- `description` — [ZeroDivide-description](#12243-zerodivide-description)
- `detach` — [CallinProcess-debugging](#1161-callinprocess-debugging)
- `detach` — [Process-debugging](#11344-process-debugging)
- `detect:` — [Iterable-enumeration](#1942-iterable-enumeration)
- `detect:ifNone:` — [Iterable-enumeration](#1942-iterable-enumeration)
- `digitAt:` — [Integer-bit operators](#1924-integer-bit-operators)
- `digitAt` — [\<1\>:                          LargeInteger-built-ins](#1984-largeinteger-built-ins)
- `digitAt:put:` — [LargeInteger-built-ins](#1984-largeinteger-built-ins)
- `digitLength` — [LargeInteger-built-ins](#1984-largeinteger-built-ins)
- `digitValue` — [Character-converting](#1289-character-converting)
- `digitValue:` — [Character class-instance creation](#1284-character-class-instance-creation)
- `dir:tag:` — [Package-still unclassified](#11274-package-still-unclassified)
- `directories` — [FilePath-enumerating](#1777-filepath-enumerating)
- `directory` — [FilePath-file name management](#1778-filepath-file-name-management)
- `directory` — [Package-accessing](#11273-package-accessing)
- `directoryFor:` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `disableInterrupts` — [ProcessorScheduler-built ins](#11363-processorscheduler-built-ins)
- `disableProxyFor:` — [ObjectDumper class-establishing proxy classes](#11241-objectdumper-class-establishing-proxy-classes)
- `discardTranslation` — [CompiledCode-translation](#13912-compiledcode-translation)
- `dispatchTo:with:` — [CompiledCode-decoding bytecodes](#1398-compiledcode-decoding-bytecodes)
- `display` — [Object-printing](#112313-object-printing)
- `display:` — [Stream-printing](#115714-stream-printing)
- `displayLines` — [Collection-printing](#13711-collection-printing)
- `displayNl` — [Object-printing](#112313-object-printing)
- `displayOn:` — [Character-printing](#12810-character-printing)
- `displayOn` — [\<1\>:                        FilePath-printing](#17710-filepath-printing)
- `displayOn` — [\<2\>:                        Integer-printing](#1929-integer-printing)
- `displayOn` — [\<3\>:                        Object-printing](#112313-object-printing)
- `displayOn` — [\<4\>:                        Regex-printing](#11444-regex-printing)
- `displayOn` — [\<5\>:                        ScaledDecimal-printing](#11486-scaleddecimal-printing)
- `displayOn` — [\<6\>:                        String-printing](#11589-string-printing)
- `displayOn` — [\<7\>:                        Symbol-storing](#11599-symbol-storing)
- `displayOn` — [\<8\>:                        UnicodeString-converting](#12035-unicodestring-converting)
- `displayOn` — [\<9\>:                        VFS.ArchiveFile-still unclassified](#12084-vfsarchivefile-still-unclassified)
- `displayOn` — [\<10\>:                       VFS.ArchiveMember-still unclassified](#12097-vfsarchivemember-still-unclassified)
- `displayString` — [Integer-printing](#1929-integer-printing)
- `displayString` — [Object-printing](#112313-object-printing)
- `displayString` — [Regex-printing](#11444-regex-printing)
- `displayString` — [String-printing](#11589-string-printing)
- `displayString` — [Symbol-storing](#11599-symbol-storing)
- `dist:` — [Point-point functions](#11326-point-point-functions)
- `divExact:` — [LargeInteger-arithmetic](#1982-largeinteger-arithmetic)
- `divExact` — [\<1\>:                         SmallInteger-built ins](#11554-smallinteger-built-ins)
- `divide:using:` — [LargePositiveInteger-primitive operations](#11005-largepositiveinteger-primitive-operations)
- `dividend` — [ZeroDivide-accessing](#12242-zerodivide-accessing)
- `dividend:` — [ZeroDivide class-instance creation](#12241-zerodivide-class-instance-creation)
- `do:` — [Bag-enumerating the elements of a collection](#183-bag-enumerating-the-elements-of-a-collection)
- `do` — [\<1\>:                               Dictionary-dictionary enumerating](#1645-dictionary-dictionary-enumerating)
- `do` — [\<2\>:                               FilePath-enumerating](#1777-filepath-enumerating)
- `do` — [\<3\>:                               HashedCollection-enumerating the elements of a collection](#1885-hashedcollection-enumerating-the-elements-of-a-collection)
- `do` — [\<4\>:                               Interval-basic](#1932-interval-basic)
- `do` — [\<5\>:                               Iterable-enumeration](#1942-iterable-enumeration)
- `do` — [\<6\>:                               Link-iteration](#11033-link-iteration)
- `do` — [\<7\>:                               LinkedList-enumerating](#11043-linkedlist-enumerating)
- `do` — [\<8\>:                               LookupTable-enumerating](#11063-lookuptable-enumerating)
- `do` — [\<9\>:                               MappedCollection-basic](#11082-mappedcollection-basic)
- `do` — [\<10\>:                              Namespace-overrides for superspaces](#11166-namespace-overrides-for-superspaces)
- `do` — [\<11\>:                              OrderedCollection-enumerating](#11265-orderedcollection-enumerating)
- `do` — [\<12\>:                              RunArray-enumerating](#11476-runarray-enumerating)
- `do` — [\<13\>:                              SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `do` — [\<14\>:                              Stream-enumerating](#11579-stream-enumerating)
- `do` — [\<15\>:                              SymLink-iteration](#11603-symlink-iteration)
- `do` — [\<16\>:                              WeakArray-accessing](#12152-weakarray-accessing)
- `do` — [\<17\>:                              WeakSet-accessing](#12191-weakset-accessing)
- `do:separatedBy:` — [Iterable-enumeration](#1942-iterable-enumeration)
- `do:separatedBy` — [\<1\>:                   SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `doesNotUnderstand:` — [Autoload-accessing](#172-autoload-accessing)
- `doesNotUnderstand` — [\<1\>:                BindingDictionary-accessing](#1101-bindingdictionary-accessing)
- `doesNotUnderstand` — [\<2\>:                Object-error raising](#112310-object-error-raising)
- `domain` — [MappedCollection-basic](#11082-mappedcollection-basic)
- `doSecurityCheckForName:actions:target:` — [ContextPart-security checks](#1419-contextpart-security-checks)
- `dotProduct:` — [Point-point functions](#11326-point-point-functions)
- `doubleAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `doubleAt` — [\<1\>:                         Memory class-accessing](#11091-memory-class-accessing)
- `doubleAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `doubleAt:put` — [\<1\>:                     Memory class-accessing](#11091-memory-class-accessing)
- `doWithIndex:` — [SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `dump:` — [ObjectDumper-loading/dumping objects](#11246-objectdumper-loadingdumping-objects)
- `dump:to:` — [ObjectDumper class-shortcuts](#11243-objectdumper-class-shortcuts)
- `dumpTo:` — [DumperProxy-saving and restoring](#1683-dumperproxy-saving-and-restoring)
- `dumpTo` — [\<1\>:                           NullProxy-accessing](#11202-nullproxy-accessing)
- `dumpTo` — [\<2\>:                           VersionableObjectProxy-saving and restoring](#12072-versionableobjectproxy-saving-and-restoring)
- `e` — [Float class-characterization](#1802-float-class-characterization)
- `e` — [FloatE class-characterization](#1823-floate-class-characterization)
- `e` — [FloatQ class-characterization](#1832-floatq-class-characterization)
- `edenSize` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `edenUsedBytes` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `edit:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `elementType` — [CAggregate-accessing](#1152-caggregate-accessing)
- `elementType` — [CPtrCType-accessing](#1442-cptrctype-accessing)
- `elementType` — [CStringCType-accessing](#1501-cstringctype-accessing)
- `elementType:` — [CArrayCType class-instance creation](#1181-carrayctype-class-instance-creation)
- `elementType` — [\<1\>:                      CPtrCType class-instance creation](#1441-cptrctype-class-instance-creation)
- `elementType:numberOfElements:` — [CArrayCType class-instance creation](#1181-carrayctype-class-instance-creation)
- `emax` — [FloatD class-characterization](#1812-floatd-class-characterization)
- `emax` — [FloatE class-characterization](#1823-floate-class-characterization)
- `emax` — [FloatQ class-characterization](#1832-floatq-class-characterization)
- `emin` — [FloatD class-characterization](#1812-floatd-class-characterization)
- `emin` — [FloatE class-characterization](#1823-floate-class-characterization)
- `emin` — [FloatQ class-characterization](#1832-floatq-class-characterization)
- `emitFieldNameTo:for:` — [CCompound class-subclass creation](#1242-ccompound-class-subclass-creation)
- `empty` — [Collection-removing](#13712-collection-removing)
- `emptyStream` — [WriteStream-positioning](#12233-writestream-positioning)
- `enableInterrupts` — [ProcessorScheduler-built ins](#11363-processorscheduler-built-ins)
- `encode:` — [NetClients.URL class-encoding URLs](#11181-netclientsurl-class-encoding-urls)
- `encoding` — [CharacterArray-multibyte encodings](#1297-characterarray-multibyte-encodings)
- `encoding` — [Stream-character writing](#11576-stream-character-writing)
- `encoding` — [String-converting](#11587-string-converting)
- `encoding` — [UnicodeString-multibyte encodings](#12036-unicodestring-multibyte-encodings)
- `endEntry` — [TextCollector-accessing](#11982-textcollector-accessing)
- `endsWith:` — [SequenceableCollection-comparing](#11513-sequenceablecollection-comparing)
- `ensure:` — [BlockClosure-unwind protection](#11110-blockclosure-unwind-protection)
- `ensureReadable` — [FileDescriptor-accessing](#1764-filedescriptor-accessing)
- `ensureWriteable` — [FileDescriptor-accessing](#1764-filedescriptor-accessing)
- `entity` — [NetClients.URL-still unclassified](#11188-netclientsurl-still-unclassified)
- `entries` — [FilePath-enumerating](#1777-filepath-enumerating)
- `entryNames` — [FilePath-enumerating](#1777-filepath-enumerating)
- `environ` — [SystemDictionary-c call-outs](#11614-systemdictionary-c-call-outs)
- `environment` — [Association-accessing](#162-association-accessing)
- `environment` — [Behavior-support for lightweight classes](#1921-behavior-support-for-lightweight-classes)
- `environment` — [BindingDictionary-accessing](#1101-bindingdictionary-accessing)
- `environment` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `environment` — [ContextPart-accessing](#1413-contextpart-accessing)
- `environment` — [HomedAssociation-accessing](#1892-homedassociation-accessing)
- `environment` — [Metaclass-delegation](#11125-metaclass-delegation)
- `environment` — [ProcessVariable-accessing](#11372-processvariable-accessing)
- `environment:` — [Association-accessing](#162-association-accessing)
- `environment` — [\<1\>:                      BindingDictionary-accessing](#1101-bindingdictionary-accessing)
- `environment` — [\<2\>:                      Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `environment` — [\<3\>:                      HomedAssociation-accessing](#1892-homedassociation-accessing)
- `eof` — [Character class-constants](#1282-character-class-constants)
- `eot` — [Character class-constants](#1282-character-class-constants)
- `epsilon` — [Float class-characterization](#1802-float-class-characterization)
- `eqv:` — [Boolean-basic](#1132-boolean-basic)
- `eqv` — [\<1\>:                              False-basic](#1741-false-basic)
- `eqv` — [\<2\>:                              True-basic](#12001-true-basic)
- `errno` — [File class-C functions](#1751-file-class-c-functions)
- `error:` — [Object-error raising](#112310-object-error-raising)
- `errorValue:` — [Promise-still unclassified](#11385-promise-still-unclassified)
- `esc` — [Character class-constants](#1282-character-class-constants)
- `escapeDo:` — [Continuation class-instance creation](#1421-continuation-class-instance-creation)
- `escapeRegex` — [String-still unclassified](#115811-string-still-unclassified)
- `estimatedLog` — [Float-transcendental operations](#18017-float-transcendental-operations)
- `estimatedLog` — [Fraction-arithmetic](#1844-fraction-arithmetic)
- `estimatedLog` — [Integer-math methods](#1928-integer-math-methods)
- `estimatedLog` — [LargeInteger-arithmetic](#1982-largeinteger-arithmetic)
- `estimatedLog` — [Number-misc math](#11229-number-misc-math)
- `evalString:to:` — [Behavior-evaluating](#1912-behavior-evaluating)
- `evalString:to:ifError:` — [Behavior-evaluating](#1912-behavior-evaluating)
- `evaluate:` — [Behavior-evaluating](#1912-behavior-evaluating)
- `evaluate:ifError:` — [Behavior-evaluating](#1912-behavior-evaluating)
- `evaluate:notifying:` — [Behavior-evaluating](#1912-behavior-evaluating)
- `evaluate:to:` — [Behavior-evaluating](#1912-behavior-evaluating)
- `evaluate:to:ifError:` — [Behavior-evaluating](#1912-behavior-evaluating)
- `evaluatorClass` — [Behavior-pluggable behavior (not yet implemented)](#1917-behavior-pluggable-behavior-not-yet-implemented)
- `even` — [Integer-math methods](#1928-integer-math-methods)
- `even` — [Number-testing](#112213-number-testing)
- `examine` — [Object-debugging](#11238-object-debugging)
- `examineOn:` — [CCompound-debugging](#1243-ccompound-debugging)
- `examineOn` — [\<1\>:                        Collection-printing](#13711-collection-printing)
- `examineOn` — [\<2\>:                        CompiledCode-debugging](#1397-compiledcode-debugging)
- `examineOn` — [\<3\>:                        Dictionary-printing](#1649-dictionary-printing)
- `examineOn` — [\<4\>:                        Object-debugging](#11238-object-debugging)
- `examineOn` — [\<5\>:                        SequenceableCollection-testing](#115111-sequenceablecollection-testing)
- `example` — [ObjectDumper class-testing](#11244-objectdumper-class-testing)
- `exceptionalCondition` — [FileDescriptor-accessing](#1764-filedescriptor-accessing)
- `execPrefix` — [Directory class-reading system defaults](#1663-directory-class-reading-system-defaults)
- `executable` — [File class-reading system defaults](#1755-file-class-reading-system-defaults)
- `executionTrace` — [SystemDictionary-builtins](#11613-systemdictionary-builtins)
- `executionTrace:` — [SystemDictionary-builtins](#11613-systemdictionary-builtins)
- `exists` — [File-testing](#17513-file-testing)
- `exists` — [FilePath-testing](#17712-filepath-testing)
- `exists` — [VFS.ArchiveMember-testing](#12098-vfsarchivemember-testing)
- `exists` — [VFS.FileWrapper-testing](#12108-vfsfilewrapper-testing)
- `exists:` — [File class-testing](#1756-file-class-testing)
- `exp` — [Float-built ins](#1805-float-built-ins)
- `exp` — [Number-misc math](#11229-number-misc-math)
- `expandBy:` — [Rectangle-rectangle functions](#11425-rectangle-rectangle-functions)
- `exponent` — [FloatD-built ins](#1814-floatd-built-ins)
- `exponent` — [FloatE-built ins](#1825-floate-built-ins)
- `exponent` — [FloatQ-built ins](#1834-floatq-built-ins)
- `extend` — [Class-instance creation](#1314-class-instance-creation)
- `extension` — [FilePath-file name management](#1778-filepath-file-name-management)
- `extensionFor:` — [FilePath class-file name management](#1771-filepath-class-file-name-management)
- `extent` — [Rectangle-accessing](#11422-rectangle-accessing)
- `extent:` — [Point-converting](#11325-point-converting)
- `extent` — [\<1\>:                           Rectangle-accessing](#11422-rectangle-accessing)
- `externalInterruptsEnabled` — [Process-accessing](#11341-process-accessing)
- `extracted` — [VFS.TmpFileArchiveMember-still unclassified](#12123-vfstmpfilearchivemember-still-unclassified)
- `extractMember:` — [VFS.ArchiveFile-TmpFileArchiveMember protocol](#12085-vfsarchivefile-tmpfilearchivemember-protocol)
- `extractMember:into:` — [VFS.ArchiveFile-TmpFileArchiveMember protocol](#12085-vfsarchivefile-tmpfilearchivemember-protocol)
- `extractMember:into` — [\<1\>:               VFS.ZipFile-members](#12131-vfszipfile-members)
- `factorial` — [Integer-math methods](#1928-integer-math-methods)
- `failedPermission` — [SystemExceptions.SecurityError-accessing](#11882-systemexceptionssecurityerror-accessing)
- `failedPermission:` — [SystemExceptions.SecurityError-accessing](#11882-systemexceptionssecurityerror-accessing)
- `fd` — [FileDescriptor-accessing](#1764-filedescriptor-accessing)
- `features` — [Package-accessing](#11273-package-accessing)
- `featuresFor:` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `ff` — [Character class-constants](#1282-character-class-constants)
- `fieldSelectorList` — [CCompound-debugging](#1243-ccompound-debugging)
- `file` — [FileDescriptor-accessing](#1764-filedescriptor-accessing)
- `file` — [FileSegment-basic](#1783-filesegment-basic)
- `file` — [Stream-accessing-reading](#11571-stream-accessing-reading)
- `file` — [VFS.TmpFileArchiveMember-directory operations](#12121-vfstmpfilearchivemember-directory-operations)
- `fileData` — [VFS.ZipFile-members](#12131-vfszipfile-members)
- `fileIn` — [FileDescriptor-built ins](#1767-filedescriptor-built-ins)
- `fileIn` — [FilePath-file operations](#1779-filepath-file-operations)
- `fileIn` — [Stream-built ins](#11575-stream-built-ins)
- `fileIn:` — [FileStream class-file-in](#1791-filestream-class-file-in)
- `fileIn:ifMissing:` — [FileStream class-file-in](#1791-filestream-class-file-in)
- `fileIn:ifTrue:` — [FileStream class-file-in](#1791-filestream-class-file-in)
- `fileIn:line:from:at:` — [FileStream class-file-in](#1791-filestream-class-file-in)
- `fileInLine:file:at:` — [Stream-built ins](#11575-stream-built-ins)
- `fileInLine:fileName:at:` — [Stream-built ins](#11575-stream-built-ins)
- `fileInPackage:` — [PackageLoader class-loading](#11282-packageloader-class-loading)
- `fileInPackages:` — [PackageLoader class-loading](#11282-packageloader-class-loading)
- `fileIns` — [Package-accessing](#11273-package-accessing)
- `fileInsFor:` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `fileName` — [CharacterArray-converting](#1296-characterarray-converting)
- `fileName` — [FileSegment-basic](#1783-filesegment-basic)
- `fileOp:` — [FileDescriptor-built ins](#1767-filedescriptor-built-ins)
- `fileOp:ifFail:` — [FileDescriptor-built ins](#1767-filedescriptor-built-ins)
- `fileOp:with:` — [FileDescriptor-built ins](#1767-filedescriptor-built-ins)
- `fileOp:with:ifFail:` — [FileDescriptor-built ins](#1767-filedescriptor-built-ins)
- `fileOp:with:with:` — [FileDescriptor-built ins](#1767-filedescriptor-built-ins)
- `fileOp:with:with:ifFail:` — [FileDescriptor-built ins](#1767-filedescriptor-built-ins)
- `fileOp:with:with:with:` — [FileDescriptor-built ins](#1767-filedescriptor-built-ins)
- `fileOp:with:with:with:ifFail:` — [FileDescriptor-built ins](#1767-filedescriptor-built-ins)
- `fileOp:with:with:with:with:` — [FileDescriptor-built ins](#1767-filedescriptor-built-ins)
- `fileOp:with:with:with:with:ifFail:` — [FileDescriptor-built ins](#1767-filedescriptor-built-ins)
- `fileOut:` — [ClassDescription-filing](#1324-classdescription-filing)
- `fileOut` — [\<1\>:                          Stream-filing out](#115710-stream-filing-out)
- `fileOutCategory:to:` — [ClassDescription-filing](#1324-classdescription-filing)
- `fileOutCategory:toStream:` — [ClassDescription-still unclassified](#1328-classdescription-still-unclassified)
- `fileOutDeclarationOn:` — [Class-filing](#1313-class-filing)
- `fileOutHeaderOn:` — [Class-still unclassified](#13110-class-still-unclassified)
- `fileOutOn:` — [Class-filing](#1313-class-filing)
- `fileOutOn` — [\<1\>:                        ClassDescription-filing](#1324-classdescription-filing)
- `fileOutOn` — [\<2\>:                        Metaclass-filing](#11126-metaclass-filing)
- `fileOutSelector:to:` — [ClassDescription-filing](#1324-classdescription-filing)
- `fileOutSelector:toStream:` — [ClassDescription-still unclassified](#1328-classdescription-still-unclassified)
- `filePos` — [CharacterArray-converting](#1296-characterarray-converting)
- `filePos` — [FileSegment-basic](#1783-filesegment-basic)
- `files` — [FilePath-enumerating](#1777-filepath-enumerating)
- `files` — [Package-accessing](#11273-package-accessing)
- `filesFor:` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `filesMatching:` — [FilePath-enumerating](#1777-filepath-enumerating)
- `filesMatching:do:` — [FilePath-enumerating](#1777-filepath-enumerating)
- `fill` — [FileStream-buffering](#1794-filestream-buffering)
- `fillFrom:` — [VFS.ArchiveMember-initializing](#12096-vfsarchivemember-initializing)
- `fillMember:` — [VFS.ArchiveFile-ArchiveMember protocol](#12081-vfsarchivefile-archivemember-protocol)
- `finalIP` — [BlockClosure-accessing](#1113-blockclosure-accessing)
- `finalizableObjects` — [Object class-initialization](#11231-object-class-initialization)
- `finalize` — [CObject-finalization](#1369-cobject-finalization)
- `finalize` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `finalize` — [Object-finalization](#112311-object-finalization)
- `finalize` — [Process-basic](#11342-process-basic)
- `findFirst:` — [SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `findKeyIndex:` — [Dictionary-awful ST-80 compatibility hacks](#1643-dictionary-awful-st-80-compatibility-hacks)
- `findLast:` — [SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `findObjectIndex:` — [Set-awful ST-80 compatibility hacks](#11522-set-awful-st-80-compatibility-hacks)
- `finishIncrementalGC` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `first` — [Interval-printing](#1933-interval-printing)
- `first` — [LinkedList-iteration](#11044-linkedlist-iteration)
- `first` — [OrderedCollection-accessing](#11262-orderedcollection-accessing)
- `first` — [RunArray-basic](#11474-runarray-basic)
- `first` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `first:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `firstDayOfMonth` — [Date-date computations](#1596-date-date-computations)
- `fixedSpaceSize` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `fixedSpaceUsedBytes` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `fixTemps` — [BlockClosure-accessing](#1113-blockclosure-accessing)
- `flags` — [CompiledBlock-accessing](#1382-compiledblock-accessing)
- `flags` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `flags` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `floatAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `floatAt` — [\<1\>:                          Memory class-accessing](#11091-memory-class-accessing)
- `floatAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `floatAt:put` — [\<1\>:                      Memory class-accessing](#11091-memory-class-accessing)
- `floor` — [Float-built ins](#1805-float-built-ins)
- `floor` — [Fraction-coercing](#1845-fraction-coercing)
- `floor` — [Integer-converting](#1925-integer-converting)
- `floor` — [Number-truncation and round off](#112214-number-truncation-and-round-off)
- `floorLog:` — [Float-transcendental operations](#18017-float-transcendental-operations)
- `floorLog` — [\<1\>:                         Integer-math methods](#1928-integer-math-methods)
- `floorLog` — [\<2\>:                         Number-misc math](#11229-number-misc-math)
- `flush` — [FileStream-buffering](#1794-filestream-buffering)
- `flush` — [ObjectDumper-accessing](#11245-objectdumper-accessing)
- `flush` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `flush` — [Stream-polymorphism](#115712-stream-polymorphism)
- `flushCache` — [Behavior-built ins](#194-behavior-built-ins)
- `flushTranslatorCache` — [CompiledCode class-cache flushing](#1391-compiledcode-class-cache-flushing)
- `fmax` — [FloatD class-characterization](#1812-floatd-class-characterization)
- `fmax` — [FloatE class-characterization](#1823-floate-class-characterization)
- `fmax` — [FloatQ class-characterization](#1832-floatq-class-characterization)
- `fmin` — [Float class-characterization](#1802-float-class-characterization)
- `fminDenormalized` — [Float class-characterization](#1802-float-class-characterization)
- `fminNormalized` — [FloatD class-characterization](#1812-floatd-class-characterization)
- `fminNormalized` — [FloatE class-characterization](#1823-floate-class-characterization)
- `fminNormalized` — [FloatQ class-characterization](#1832-floatq-class-characterization)
- `fold:` — [Iterable-enumeration](#1942-iterable-enumeration)
- `fold` — [\<1\>:                             SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `fopen:mode:` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `fopen:mode:ifFail:` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `for:` — [Promise class-creating instances](#11381-promise-class-creating-instances)
- `for:returning:withArgs:` — [CCallable class-instance creation](#1211-ccallable-class-instance-creation)
- `for:returning:withArgs` — [\<1\>:           CCallbackDescriptor class-instance creation](#1221-ccallbackdescriptor-class-instance-creation)
- `for:returning:withArgs` — [\<2\>:           CFunctionDescriptor class-instance creation](#1271-cfunctiondescriptor-class-instance-creation)
- `fork` — [BlockClosure-multiple process](#1117-blockclosure-multiple-process)
- `fork` — [DirectedMessage-multiple process](#1654-directedmessage-multiple-process)
- `forkAt:` — [BlockClosure-multiple process](#1117-blockclosure-multiple-process)
- `forkAt` — [\<1\>:                           DirectedMessage-multiple process](#1654-directedmessage-multiple-process)
- `forkWithoutPreemption` — [BlockClosure-multiple process](#1117-blockclosure-multiple-process)
- `formattedSourceStringAt:` — [Behavior-accessing the method dictionary](#193-behavior-accessing-the-method-dictionary)
- `formattedSourceStringAt:ifAbsent:` — [Behavior-source code](#1919-behavior-source-code)
- `forMilliseconds:` — [Delay class-instance creation](#1621-delay-class-instance-creation)
- `forMutualExclusion` — [Semaphore class-instance creation](#11501-semaphore-class-instance-creation)
- `forNanoseconds:` — [Delay class-instance creation](#1621-delay-class-instance-creation)
- `forSeconds:` — [Delay class-instance creation](#1621-delay-class-instance-creation)
- `fourth` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `fractionPart` — [FloatD-built ins](#1814-floatd-built-ins)
- `fractionPart` — [FloatE-built ins](#1825-floate-built-ins)
- `fractionPart` — [FloatQ-built ins](#1834-floatq-built-ins)
- `fractionPart` — [Number-truncation and round off](#112214-number-truncation-and-round-off)
- `fractionPart` — [ScaledDecimal-coercion](#11483-scaleddecimal-coercion)
- `fragment` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `fragment:` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `free` — [CObject-C data access](#1367-cobject-c-data-access)
- `free` — [UndefinedObject-CObject interoperability](#12014-undefinedobject-cobject-interoperability)
- `from` — [RegexResults-accessing](#11451-regexresults-accessing)
- `from:` — [Array class-instance creation](#141-array-class-instance-creation)
- `from` — [\<1\>:                             CArrayCType class-instance creation](#1181-carrayctype-class-instance-creation)
- `from` — [\<2\>:                             Collection class-instance creation](#1371-collection-class-instance-creation)
- `from` — [\<3\>:                             CPtrCType class-instance creation](#1441-cptrctype-class-instance-creation)
- `from` — [\<4\>:                             CType class-C instance creation](#1521-ctype-class-c-instance-creation)
- `from` — [\<5\>:                             Dictionary class-instance creation](#1641-dictionary-class-instance-creation)
- `from:to:` — [Interval class-instance creation](#1931-interval-class-instance-creation)
- `from:to:by:` — [Interval class-instance creation](#1931-interval-class-instance-creation)
- `from:to:do:` — [SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `from:to:doWithIndex:` — [SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `from:to:keysAndValuesDo:` — [SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `fromAt:` — [RegexResults-accessing](#11451-regexresults-accessing)
- `fromBytes:` — [FloatD class-byte-order dependencies](#1811-floatd-class-byte-order-dependencies)
- `fromBytes` — [\<1\>:                        FloatE class-byte-order dependencies](#1822-floate-class-byte-order-dependencies)
- `fromCData:` — [String class-instance creation](#11581-string-class-instance-creation)
- `fromCData:size:` — [ByteArray class-instance creation](#1141-bytearray-class-instance-creation)
- `fromCData:size` — [\<1\>:                   String class-instance creation](#11581-string-class-instance-creation)
- `fromDays:` — [Date class-instance creation (Blue Book)](#1593-date-class-instance-creation-blue-book)
- `fromDays:seconds:` — [DateTime class-instance creation (non-ANSI)](#1603-datetime-class-instance-creation-non-ansi)
- `fromDays:seconds:offset:` — [DateTime class-instance creation (non-ANSI)](#1603-datetime-class-instance-creation-non-ansi)
- `fromDays:seconds:offset` — [\<1\>:          Duration class-instance creation (non ANSI)](#1692-duration-class-instance-creation-non-ansi)
- `fromJulian:` — [Date class-instance creation (Blue Book)](#1593-date-class-instance-creation-blue-book)
- `fromSeconds:` — [Date class-instance creation (Blue Book)](#1593-date-class-instance-creation-blue-book)
- `fromSeconds` — [\<1\>:                      DateTime class-instance creation (non-ANSI)](#1603-datetime-class-instance-creation-non-ansi)
- `fromSeconds` — [\<2\>:                      Time class-instance creation](#11995-time-class-instance-creation)
- `fromSeconds:offset:` — [DateTime class-instance creation (non-ANSI)](#1603-datetime-class-instance-creation-non-ansi)
- `fromString:` — [CharacterArray class-basic](#1291-characterarray-class-basic)
- `fromString` — [\<1\>:                       NetClients.URL class-instance creation](#11182-netclientsurl-class-instance-creation)
- `fromString` — [\<2\>:                       Regex class-instance creation](#11441-regex-class-instance-creation)
- `fromString` — [\<3\>:                       UnicodeString class-converting](#12031-unicodestring-class-converting)
- `full` — [File-file name management](#17510-file-file-name-management)
- `full` — [FilePath-file name management](#1778-filepath-file-name-management)
- `full` — [VFS.ArchiveMember-delegation](#12093-vfsarchivemember-delegation)
- `full` — [VFS.FileWrapper-delegation](#12105-vfsfilewrapper-delegation)
- `fullName` — [FilePath-file name management](#1778-filepath-file-name-management)
- `fullNameFor:` — [FilePath class-file name management](#1771-filepath-class-file-name-management)
- `fullPathOf:` — [Package-accessing](#11273-package-accessing)
- `fullRequestString` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `gather:` — [Collection-enumeration](#1379-collection-enumeration)
- `gcAlloc:` — [CObject class-instance creation](#1362-cobject-class-instance-creation)
- `gcAlloc:type:` — [CObject class-primitive allocation](#1363-cobject-class-primitive-allocation)
- `gcd:` — [Integer-math methods](#1928-integer-math-methods)
- `gcd` — [\<1\>:                              LargeNegativeInteger-reverting to LargePositiveInteger](#1993-largenegativeinteger-reverting-to-largepositiveinteger)
- `gcd` — [\<2\>:                              LargePositiveInteger-arithmetic](#11001-largepositiveinteger-arithmetic)
- `gcMessage` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `gcMessage:` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `gcNew` — [CCompound class-instance creation](#1241-ccompound-class-instance-creation)
- `gcNew` — [CType-C instance creation](#1525-ctype-c-instance-creation)
- `gcNew:` — [CObject class-instance creation](#1362-cobject-class-instance-creation)
- `gcNew` — [\<1\>:                            CType-C instance creation](#1525-ctype-c-instance-creation)
- `gcValue:` — [CScalar class-instance creation](#1451-cscalar-class-instance-creation)
- `generality` — [FloatD-coercing](#1815-floatd-coercing)
- `generality` — [FloatE-coercing](#1826-floate-coercing)
- `generality` — [FloatQ-coercing](#1835-floatq-coercing)
- `generality` — [Fraction-coercing](#1845-fraction-coercing)
- `generality` — [LargeInteger-coercion](#1985-largeinteger-coercion)
- `generality` — [Number-converting](#11226-number-converting)
- `generality` — [ScaledDecimal-coercion](#11483-scaleddecimal-coercion)
- `generality` — [SmallInteger-coercion methods](#11557-smallinteger-coercion-methods)
- `generateMakefileOnto:` — [FileStream class-file-in](#1791-filestream-class-file-in)
- `getArgc` — [SystemDictionary-c call-outs](#11614-systemdictionary-c-call-outs)
- `getArgv:` — [SystemDictionary-c call-outs](#11614-systemdictionary-c-call-outs)
- `getBlock:putBlock:` — [PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `getenv:` — [SystemDictionary-c call-outs](#11614-systemdictionary-c-call-outs)
- `getTraceFlag:` — [SystemDictionary-builtins](#11613-systemdictionary-builtins)
- `globalGarbageCollect` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `goodness:` — [Exception class-comparison](#1721-exception-class-comparison)
- `goodness` — [\<1\>:                         ExceptionSet-enumerating](#1732-exceptionset-enumerating)
- `granting:target:action:` — [Permission class-testing](#11291-permission-class-testing)
- `granting:target:actions:` — [Permission class-testing](#11291-permission-class-testing)
- `grid:` — [Point-point functions](#11326-point-point-functions)
- `group:` — [FilePath-accessing](#1773-filepath-accessing)
- `growThresholdPercent` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `growThresholdPercent:` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `growTo:` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `half` — [Float-converting](#18010-float-converting)
- `half` — [FloatD-converting](#1816-floatd-converting)
- `half` — [FloatE-converting](#1827-floate-converting)
- `half` — [FloatQ-converting](#1836-floatq-converting)
- `halt` — [Object-built ins](#11232-object-built-ins)
- `halt` — [SystemDictionary-basic](#11612-systemdictionary-basic)
- `halt:` — [Object-error raising](#112310-object-error-raising)
- `handleDelayRequestor` — [Delay class-timer process](#1623-delay-class-timer-process)
- `handles:` — [Exception class-comparison](#1721-exception-class-comparison)
- `handles` — [\<1\>:                          ExceptionSet-enumerating](#1732-exceptionset-enumerating)
- `hasBytecode:between:and:` — [CompiledCode-testing accesses](#13911-compiledcode-testing-accesses)
- `hasError` — [Promise-accessing](#11382-promise-accessing)
- `hasFeatures:` — [SystemDictionary-special accessing](#11619-systemdictionary-special-accessing)
- `hasFragment` — [NetClients.URL-testing](#11189-netclientsurl-testing)
- `hash` — [Association-testing](#166-association-testing)
- `hash` — [Bag-testing collections](#188-bag-testing-collections)
- `hash` — [BindingDictionary-basic & copying](#1102-bindingdictionary-basic--copying)
- `hash` — [ByteArray-built ins](#1143-bytearray-built-ins)
- `hash` — [CArrayCType-basic](#1183-carrayctype-basic)
- `hash` — [CObject-basic](#1366-cobject-basic)
- `hash` — [CompiledCode-basic](#1395-compiledcode-basic)
- `hash` — [CompiledMethod-basic](#1406-compiledmethod-basic)
- `hash` — [CPtrCType-basic](#1443-cptrctype-basic)
- `hash` — [CType-basic](#1524-ctype-basic)
- `hash` — [Date-testing](#15910-date-testing)
- `hash` — [DateTime-testing](#1609-datetime-testing)
- `hash` — [Delay-comparing](#1625-delay-comparing)
- `hash` — [Dictionary-testing](#16413-dictionary-testing)
- `hash` — [File-basic](#1758-file-basic)
- `hash` — [FileSegment-equality](#1784-filesegment-equality)
- `hash` — [Float-basic](#1804-float-basic)
- `hash` — [Fraction-comparing](#1847-fraction-comparing)
- `hash` — [HashedCollection-testing collections](#18810-hashedcollection-testing-collections)
- `hash` — [Integer-basic](#1923-integer-basic)
- `hash` — [Interval-testing](#1935-interval-testing)
- `hash` — [LargeArrayedCollection-basic](#1963-largearrayedcollection-basic)
- `hash` — [LargeInteger-built-ins](#1984-largeinteger-built-ins)
- `hash` — [LargeZeroInteger-accessing](#11021-largezerointeger-accessing)
- `hash` — [LookupKey-testing](#11055-lookupkey-testing)
- `hash` — [LookupTable-hashing](#11064-lookuptable-hashing)
- `hash` — [MethodInfo-equality](#11152-methodinfo-equality)
- `hash` — [NetClients.URL-comparing](#11184-netclientsurl-comparing)
- `hash` — [Object-built ins](#11232-object-built-ins)
- `hash` — [Point-converting](#11325-point-converting)
- `hash` — [Rectangle-testing](#11426-rectangle-testing)
- `hash` — [RunArray-testing](#11479-runarray-testing)
- `hash` — [ScaledDecimal-comparing](#11484-scaleddecimal-comparing)
- `hash` — [SequenceableCollection-testing](#115111-sequenceablecollection-testing)
- `hash` — [String-built ins](#11585-string-built-ins)
- `hash` — [Symbol-built ins](#11596-symbol-built-ins)
- `hash` — [SystemDictionary-basic](#11612-systemdictionary-basic)
- `hash` — [Time-comparing](#11999-time-comparing)
- `hash` — [UnicodeString-built-ins](#12034-unicodestring-built-ins)
- `hash` — [VFS.ArchiveMember-basic](#12092-vfsarchivemember-basic)
- `hash` — [VFS.FileWrapper-basic](#12104-vfsfilewrapper-basic)
- `hasInterned:ifTrue:` — [Symbol class-symbol table](#11593-symbol-class-symbol-table)
- `hasMethodReturn` — [BlockClosure-testing](#1119-blockclosure-testing)
- `hasMethods` — [Behavior-testing the method dictionary](#1925-behavior-testing-the-method-dictionary)
- `hasPostData` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `hasPostData:` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `hasProxyFor:` — [ObjectDumper class-establishing proxy classes](#11241-objectdumper-class-establishing-proxy-classes)
- `hasQuery` — [NetClients.URL-testing](#11189-netclientsurl-testing)
- `hasValue` — [Promise-accessing](#11382-promise-accessing)
- `height` — [Rectangle-accessing](#11422-rectangle-accessing)
- `height:` — [Rectangle-accessing](#11422-rectangle-accessing)
- `hereAssociationAt:` — [Dictionary-namespace protocol](#1648-dictionary-namespace-protocol)
- `hereAssociationAt:ifAbsent:` — [Dictionary-namespace protocol](#1648-dictionary-namespace-protocol)
- `hereAt:` — [Dictionary-namespace protocol](#1648-dictionary-namespace-protocol)
- `hereAt:ifAbsent:` — [Dictionary-namespace protocol](#1648-dictionary-namespace-protocol)
- `hierarchyIndent` — [Behavior-printing hierarchy](#1918-behavior-printing-hierarchy)
- `high` — [SystemExceptions.ArgumentOutOfRange-accessing](#11632-systemexceptionsargumentoutofrange-accessing)
- `high:` — [SystemExceptions.ArgumentOutOfRange-accessing](#11632-systemexceptionsargumentoutofrange-accessing)
- `highBit` — [Integer-bit operators](#1924-integer-bit-operators)
- `highBit` — [LargeNegativeInteger-reverting to LargePositiveInteger](#1993-largenegativeinteger-reverting-to-largepositiveinteger)
- `highBit` — [LargePositiveInteger-arithmetic](#11001-largepositiveinteger-arithmetic)
- `highBit` — [SmallInteger-bit arithmetic](#11553-smallinteger-bit-arithmetic)
- `highestPriority` — [ProcessorScheduler-priorities](#11366-processorscheduler-priorities)
- `highIOPriority` — [ProcessorScheduler-priorities](#11366-processorscheduler-priorities)
- `home` — [BlockContext-accessing](#1121-blockcontext-accessing)
- `home` — [ContextPart-accessing](#1413-contextpart-accessing)
- `home` — [Directory class-reading system defaults](#1663-directory-class-reading-system-defaults)
- `home` — [MethodContext-accessing](#11131-methodcontext-accessing)
- `host` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `host:` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `hostSystem` — [SystemDictionary-miscellaneous](#11616-systemdictionary-miscellaneous)
- `hour` — [DateTime-computations](#1605-datetime-computations)
- `hour` — [Time-accessing (ANSI for DateAndTimes)](#11996-time-accessing-ansi-for-dateandtimes)
- `hour12` — [DateTime-computations](#1605-datetime-computations)
- `hour12` — [Time-accessing (ANSI for DateAndTimes)](#11996-time-accessing-ansi-for-dateandtimes)
- `hour24` — [DateTime-computations](#1605-datetime-computations)
- `hour24` — [Time-accessing (ANSI for DateAndTimes)](#11996-time-accessing-ansi-for-dateandtimes)
- `hour:` — [Time class-instance creation](#11995-time-class-instance-creation)
- `hour:minute:second:` — [Time class-instance creation](#11995-time-class-instance-creation)
- `hours` — [Time-accessing (non ANSI & for Durations)](#11997-time-accessing-non-ansi--for-durations)
- `hours:` — [Time class-instance creation](#11995-time-class-instance-creation)
- `hours:minutes:seconds:` — [Time class-instance creation](#11995-time-class-instance-creation)
- `identityHash` — [Object-built ins](#11232-object-built-ins)
- `identityIncludes:` — [Collection-testing collections](#13715-collection-testing-collections)
- `identityIncludes` — [\<1\>:                 IdentitySet-testing](#1911-identityset-testing)
- `identityIncludes` — [\<2\>:                 LinkedList-enumerating](#11043-linkedlist-enumerating)
- `identityIncludes` — [\<3\>:                 SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `identityIncludes` — [\<4\>:                 WeakIdentitySet-accessing](#12161-weakidentityset-accessing)
- `identityIndexOf:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `identityIndexOf:ifAbsent:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `identityIndexOf:startingAt:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `identityIndexOf:startingAt:ifAbsent:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `identityIndexOfLast:ifAbsent:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `identityRemove:` — [OrderedCollection-removing](#11266-orderedcollection-removing)
- `identityRemove:ifAbsent:` — [OrderedCollection-removing](#11266-orderedcollection-removing)
- `idle` — [ProcessorScheduler-idle tasks](#11364-processorscheduler-idle-tasks)
- `idleAdd:` — [ProcessorScheduler-idle tasks](#11364-processorscheduler-idle-tasks)
- `idlePriority` — [ProcessorScheduler-priorities](#11366-processorscheduler-priorities)
- `ifCurtailed:` — [BlockClosure-unwind protection](#11110-blockclosure-unwind-protection)
- `ifError:` — [BlockClosure-exception handling](#1116-blockclosure-exception-handling)
- `ifFalse:` — [Boolean-basic](#1132-boolean-basic)
- `ifFalse` — [\<1\>:                          False-basic](#1741-false-basic)
- `ifFalse` — [\<2\>:                          True-basic](#12001-true-basic)
- `ifFalse:ifTrue:` — [Boolean-basic](#1132-boolean-basic)
- `ifFalse:ifTrue` — [\<1\>:                   False-basic](#1741-false-basic)
- `ifFalse:ifTrue` — [\<2\>:                   True-basic](#12001-true-basic)
- `ifMatched:` — [RegexResults-testing](#11452-regexresults-testing)
- `ifMatched:ifNotMatched:` — [RegexResults-testing](#11452-regexresults-testing)
- `ifNil:` — [Object-testing functionality](#112318-object-testing-functionality)
- `ifNil` — [\<1\>:                            UndefinedObject-testing](#120110-undefinedobject-testing)
- `ifNil:ifNotNil:` — [Object-testing functionality](#112318-object-testing-functionality)
- `ifNil:ifNotNil` — [\<1\>:                   UndefinedObject-testing](#120110-undefinedobject-testing)
- `ifNil:ifNotNilDo:` — [Iterable-iteration](#1943-iterable-iteration)
- `ifNil:ifNotNilDo` — [\<1\>:                 UndefinedObject-iteration](#12016-undefinedobject-iteration)
- `ifNotMatched:` — [RegexResults-testing](#11452-regexresults-testing)
- `ifNotMatched:ifMatched:` — [RegexResults-testing](#11452-regexresults-testing)
- `ifNotNil:` — [Object-testing functionality](#112318-object-testing-functionality)
- `ifNotNil` — [\<1\>:                         UndefinedObject-testing](#120110-undefinedobject-testing)
- `ifNotNil:ifNil:` — [Object-testing functionality](#112318-object-testing-functionality)
- `ifNotNil:ifNil` — [\<1\>:                   UndefinedObject-testing](#120110-undefinedobject-testing)
- `ifNotNilDo:` — [Iterable-iteration](#1943-iterable-iteration)
- `ifNotNilDo` — [\<1\>:                       UndefinedObject-iteration](#12016-undefinedobject-iteration)
- `ifNotNilDo:ifNil:` — [Iterable-iteration](#1943-iterable-iteration)
- `ifNotNilDo:ifNil` — [\<1\>:                 UndefinedObject-iteration](#12016-undefinedobject-iteration)
- `ifTrue:` — [Boolean-basic](#1132-boolean-basic)
- `ifTrue` — [\<1\>:                           False-basic](#1741-false-basic)
- `ifTrue` — [\<2\>:                           True-basic](#12001-true-basic)
- `ifTrue:ifFalse:` — [Boolean-basic](#1132-boolean-basic)
- `ifTrue:ifFalse` — [\<1\>:                   False-basic](#1741-false-basic)
- `ifTrue:ifFalse` — [\<2\>:                   True-basic](#12001-true-basic)
- `ignoreCallouts` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `ignoreCallouts:` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `image` — [Directory class-reading system defaults](#1663-directory-class-reading-system-defaults)
- `image` — [File class-reading system defaults](#1755-file-class-reading-system-defaults)
- `imageLocal` — [SystemDictionary-testing](#116110-systemdictionary-testing)
- `implementors` — [Symbol-accessing the method dictionary](#11594-symbol-accessing-the-method-dictionary)
- `implies:` — [Permission-testing](#11293-permission-testing)
- `implies` — [\<1\>:                          SecurityPolicy-querying](#11492-securitypolicy-querying)
- `import:` — [AbstractNamespace-compiling](#113-abstractnamespace-compiling)
- `import` — [\<1\>:                           ClassDescription-parsing class declarations](#1326-classdescription-parsing-class-declarations)
- `import:from:` — [BindingDictionary-accessing](#1101-bindingdictionary-accessing)
- `includes:` — [Bag-testing collections](#188-bag-testing-collections)
- `includes` — [\<1\>:                         Collection-testing collections](#13715-collection-testing-collections)
- `includes` — [\<2\>:                         Dictionary-dictionary testing](#1647-dictionary-dictionary-testing)
- `includes` — [\<3\>:                         FilePath-accessing](#1773-filepath-accessing)
- `includes` — [\<4\>:                         HashedCollection-testing collections](#18810-hashedcollection-testing-collections)
- `includes` — [\<5\>:                         LinkedList-enumerating](#11043-linkedlist-enumerating)
- `includes` — [\<6\>:                         SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `includes` — [\<7\>:                         SortedCollection-searching](#11568-sortedcollection-searching)
- `includesAllOf:` — [Collection-testing collections](#13715-collection-testing-collections)
- `includesAnyOf:` — [Collection-testing collections](#13715-collection-testing-collections)
- `includesAssociation:` — [Dictionary-dictionary testing](#1647-dictionary-dictionary-testing)
- `includesBehavior:` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `includesClassNamed:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `includesGlobalNamed:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `includesKey:` — [Dictionary-dictionary testing](#1647-dictionary-dictionary-testing)
- `includesKey` — [\<1\>:                      Namespace-overrides for superspaces](#11166-namespace-overrides-for-superspaces)
- `includesKey` — [\<2\>:                      ProcessEnvironment-dictionary testing](#11355-processenvironment-dictionary-testing)
- `includesKey` — [\<3\>:                      WeakValueLookupTable-hacks](#12212-weakvaluelookuptable-hacks)
- `includesSelector:` — [Behavior-testing the method dictionary](#1925-behavior-testing-the-method-dictionary)
- `incr` — [CObject-pointer-like behavior](#13610-cobject-pointer-like-behavior)
- `incrBy:` — [CObject-pointer-like behavior](#13610-cobject-pointer-like-behavior)
- `increment` — [Interval-printing](#1933-interval-printing)
- `incrementalGCStep` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `indexOf:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `indexOf:ifAbsent:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `indexOf:matchCase:startingAt:` — [CharacterArray-comparing](#1295-characterarray-comparing)
- `indexOf:startingAt:` — [ByteArray-basic](#1142-bytearray-basic)
- `indexOf:startingAt` — [\<1\>:               SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `indexOf:startingAt` — [\<2\>:               String-basic](#11584-string-basic)
- `indexOf:startingAt:ifAbsent:` — [ByteArray-basic](#1142-bytearray-basic)
- `indexOf:startingAt:ifAbsent` — [\<1\>:      RunArray-searching](#11478-runarray-searching)
- `indexOf:startingAt:ifAbsent` — [\<2\>:      SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `indexOf:startingAt:ifAbsent` — [\<3\>:      SortedCollection-searching](#11568-sortedcollection-searching)
- `indexOf:startingAt:ifAbsent` — [\<4\>:      String-basic](#11584-string-basic)
- `indexOfInstVar:` — [Behavior-accessing instances and variables](#192-behavior-accessing-instances-and-variables)
- `indexOfInstVar:ifAbsent:` — [Behavior-accessing instances and variables](#192-behavior-accessing-instances-and-variables)
- `indexOfLast:ifAbsent:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `indexOfMonth:` — [Date class-basic](#1591-date-class-basic)
- `indexOfRegex:` — [String-regex](#115810-string-regex)
- `indexOfRegex:from:to:` — [String-regex](#115810-string-regex)
- `indexOfRegex:from:to:ifAbsent:` — [String-regex](#115810-string-regex)
- `indexOfRegex:ifAbsent:` — [String-regex](#115810-string-regex)
- `indexOfRegex:startingAt:` — [String-regex](#115810-string-regex)
- `indexOfRegex:startingAt:ifAbsent:` — [String-regex](#115810-string-regex)
- `indexOfSubCollection:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `indexOfSubCollection:ifAbsent:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `indexOfSubCollection:startingAt:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `indexOfSubCollection:startingAt:ifAbsent:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `infinity` — [FloatD class-characterization](#1812-floatd-class-characterization)
- `infinity` — [FloatE class-characterization](#1823-floate-class-characterization)
- `infinity` — [FloatQ class-characterization](#1832-floatq-class-characterization)
- `inheritedKeys` — [AbstractNamespace-overrides for superspaces](#116-abstractnamespace-overrides-for-superspaces)
- `inheritedKeys` — [Namespace-accessing](#11164-namespace-accessing)
- `inheritedKeys` — [RootNamespace-overrides for superspaces](#11463-rootnamespace-overrides-for-superspaces)
- `inheritsFrom:` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `inheritsFrom` — [\<1\>:                     Dictionary-namespace protocol](#1648-dictionary-namespace-protocol)
- `inheritsFrom` — [\<2\>:                     UndefinedObject-still unclassified](#12018-undefinedobject-still-unclassified)
- `inheritShape` — [Class-instance creation](#1314-class-instance-creation)
- `inheritShape` — [CObject class-subclass creation](#1364-cobject-class-subclass-creation)
- `initDayNameDict` — [Date class-basic](#1591-date-class-basic)
- `initForNanoseconds:` — [Delay-initialization](#1628-delay-initialization)
- `initialIP` — [BlockClosure-accessing](#1113-blockclosure-accessing)
- `initialIP` — [ContextPart-accessing](#1413-contextpart-accessing)
- `initialize` — [Character class-initializing lookup tables](#1283-character-class-initializing-lookup-tables)
- `initialize` — [Class class-initialize](#1311-class-class-initialize)
- `initialize` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `initialize` — [CType class-initialization](#1522-ctype-class-initialization)
- `initialize` — [Date class-basic](#1591-date-class-basic)
- `initialize` — [DateTime class-information](#1601-datetime-class-information)
- `initialize` — [DLD class-dynamic linking](#1672-dld-class-dynamic-linking)
- `initialize` — [Duration class-instance creation](#1691-duration-class-instance-creation)
- `initialize` — [File class-initialization](#1753-file-class-initialization)
- `initialize` — [FileDescriptor class-initialization](#1761-filedescriptor-class-initialization)
- `initialize` — [FileDescriptor-initialize-release](#1769-filedescriptor-initialize-release)
- `initialize` — [FileStream class-file-in](#1791-filestream-class-file-in)
- `initialize` — [FileStream-initialize-release](#1796-filestream-initialize-release)
- `initialize` — [Fraction class-instance creation](#1842-fraction-class-instance-creation)
- `initialize` — [Namespace class-initialization](#11163-namespace-class-initialization)
- `initialize` — [NetClients.URL class-encoding URLs](#11181-netclientsurl-class-encoding-urls)
- `initialize` — [NetClients.URL-initialize-release](#11186-netclientsurl-initialize-release)
- `initialize` — [Object class-initialization](#11231-object-class-initialization)
- `initialize` — [ObjectMemory class-initialization](#11253-objectmemory-class-initialization)
- `initialize` — [ProcessorScheduler-idle tasks](#11364-processorscheduler-idle-tasks)
- `initialize` — [Promise-initializing](#11383-promise-initializing)
- `initialize` — [SystemDictionary class-initialization](#11611-systemdictionary-class-initialization)
- `initialize` — [SystemExceptions.ProcessBeingTerminated class-still unclassified](#11851-systemexceptionsprocessbeingterminated-class-still-unclassified)
- `initialize` — [Time class-initialization](#11994-time-class-initialization)
- `initialize` — [ValueHolder-initializing](#12053-valueholder-initializing)
- `initialize` — [VFS.FileWrapper class-initializing](#12101-vfsfilewrapper-class-initializing)
- `initializeAsRootClass` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `initMonthNameDict` — [Date class-basic](#1591-date-class-basic)
- `initUntilNanoseconds:` — [Delay-instance creation](#1629-delay-instance-creation)
- `inject:into:` — [Generator class-instance creation](#1851-generator-class-instance-creation)
- `inject:into` — [\<1\>:                      Iterable-enumeration](#1942-iterable-enumeration)
- `insetBy:` — [Rectangle-rectangle functions](#11425-rectangle-rectangle-functions)
- `insetOriginBy:corner:` — [Rectangle-rectangle functions](#11425-rectangle-rectangle-functions)
- `inspect` — [Object-debugging](#11238-object-debugging)
- `instanceClass` — [Metaclass-accessing](#11122-metaclass-accessing)
- `instanceCount` — [Behavior-accessing instances and variables](#192-behavior-accessing-instances-and-variables)
- `instanceVariableNames:` — [Behavior-instance variables](#1914-behavior-instance-variables)
- `instanceVariableString` — [ClassDescription-printing](#1327-classdescription-printing)
- `instSize` — [Behavior-testing the form of the instances](#1924-behavior-testing-the-form-of-the-instances)
- `instSize` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `instVarAt:` — [Object-built ins](#11232-object-built-ins)
- `instVarAt:put:` — [Object-built ins](#11232-object-built-ins)
- `instVarNamed:` — [Object-introspection](#112312-object-introspection)
- `instVarNamed:put:` — [Object-introspection](#112312-object-introspection)
- `instVarNames` — [Behavior-accessing instances and variables](#192-behavior-accessing-instances-and-variables)
- `intAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `intAt` — [\<1\>:                            Memory class-accessing](#11091-memory-class-accessing)
- `intAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `intAt:put` — [\<1\>:                        Memory class-accessing](#11091-memory-class-accessing)
- `integerPart` — [Float-arithmetic](#1803-float-arithmetic)
- `integerPart` — [Fraction-converting](#1848-fraction-converting)
- `integerPart` — [Number-truncation and round off](#112214-number-truncation-and-round-off)
- `integerPart` — [ScaledDecimal-coercion](#11483-scaleddecimal-coercion)
- `intern:` — [Symbol class-built ins](#11591-symbol-class-built-ins)
- `internCharacter:` — [Symbol class-instance creation](#11592-symbol-class-instance-creation)
- `intersect:` — [Rectangle-rectangle functions](#11425-rectangle-rectangle-functions)
- `intersects:` — [Rectangle-testing](#11426-rectangle-testing)
- `intervalAt:` — [RegexResults-accessing](#11451-regexresults-accessing)
- `invalidate` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `ip` — [ContextPart-accessing](#1413-contextpart-accessing)
- `ip:` — [ContextPart-accessing](#1413-contextpart-accessing)
- `isAbsolute` — [CObject-accessing](#1365-cobject-accessing)
- `isAbsolute` — [Delay-accessing](#1624-delay-accessing)
- `isAbsolute` — [File-testing](#17513-file-testing)
- `isAbsolute` — [FilePath-testing](#17712-filepath-testing)
- `isAbsolute` — [VFS.ArchiveMember-still unclassified](#12097-vfsarchivemember-still-unclassified)
- `isAbsolute` — [VFS.FileWrapper-testing](#12108-vfsfilewrapper-testing)
- `isAbsolute:` — [FilePath class-still unclassified](#1772-filepath-class-still-unclassified)
- `isAbstract` — [CompiledMethod-testing](#14013-compiledmethod-testing)
- `isAccessible` — [File-testing](#17513-file-testing)
- `isAccessible` — [FilePath-testing](#17712-filepath-testing)
- `isAccessible` — [VFS.ArchiveFile-querying](#12083-vfsarchivefile-querying)
- `isAccessible` — [VFS.ArchiveMember-testing](#12098-vfsarchivemember-testing)
- `isAccessible` — [VFS.FileWrapper-testing](#12108-vfsfilewrapper-testing)
- `isAccessible:` — [File class-testing](#1756-file-class-testing)
- `isActive` — [Delay-testing](#16210-delay-testing)
- `isAlive:` — [WeakArray-accessing](#12152-weakarray-accessing)
- `isAllowing` — [Permission-accessing](#11292-permission-accessing)
- `isAlphaNumeric` — [Character-testing](#12812-character-testing)
- `isAnnotated` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `isAnnotated` — [CompiledMethod-attributes](#1405-compiledmethod-attributes)
- `isArray` — [Array-testing](#145-array-testing)
- `isArray` — [Object-testing functionality](#112318-object-testing-functionality)
- `isBehavior` — [Behavior-testing functionality](#1922-behavior-testing-functionality)
- `isBehavior` — [Object-testing functionality](#112318-object-testing-functionality)
- `isBinary` — [FileDescriptor-class type methods](#1768-filedescriptor-class-type-methods)
- `isBits` — [Behavior-testing the form of the instances](#1924-behavior-testing-the-form-of-the-instances)
- `isBitSet:` — [Integer-bit operators](#1924-integer-bit-operators)
- `isBlock` — [BlockContext-accessing](#1121-blockcontext-accessing)
- `isBlock` — [ContextPart-accessing](#1413-contextpart-accessing)
- `isBlock` — [MethodContext-accessing](#11131-methodcontext-accessing)
- `isCharacter` — [Character-testing functionality](#12813-character-testing-functionality)
- `isCharacter` — [Object-testing functionality](#112318-object-testing-functionality)
- `isCharacterArray` — [CharacterArray-testing functionality](#12910-characterarray-testing-functionality)
- `isCharacterArray` — [Object-testing functionality](#112318-object-testing-functionality)
- `isClass` — [Class-testing functionality](#13112-class-testing-functionality)
- `isClass` — [Object-testing functionality](#112318-object-testing-functionality)
- `isCObject` — [CObject-testing functionality](#13612-cobject-testing-functionality)
- `isCObject` — [Object-testing functionality](#112318-object-testing-functionality)
- `isDefined` — [VariableBinding-testing](#12065-variablebinding-testing)
- `isDigit` — [Character-testing](#12812-character-testing)
- `isDigit:` — [Character-testing](#12812-character-testing)
- `isDirectory` — [File-accessing](#1757-file-accessing)
- `isDirectory` — [FilePath-testing](#17712-filepath-testing)
- `isDirectory` — [VFS.ArchiveFile-querying](#12083-vfsarchivefile-querying)
- `isDirectory` — [VFS.ArchiveMember-testing](#12098-vfsarchivemember-testing)
- `isDirectory` — [VFS.FileWrapper-testing](#12108-vfsfilewrapper-testing)
- `isDisabled` — [BlockContext-accessing](#1121-blockcontext-accessing)
- `isDisabled` — [ContextPart-accessing](#1413-contextpart-accessing)
- `isDisabled` — [MethodContext-accessing](#11131-methodcontext-accessing)
- `isEmpty` — [Collection-testing collections](#13715-collection-testing-collections)
- `isEmpty` — [FileDescriptor-overriding inherited methods](#17611-filedescriptor-overriding-inherited-methods)
- `isEmpty` — [HashedCollection-testing collections](#18810-hashedcollection-testing-collections)
- `isEmpty` — [Interval-basic](#1932-interval-basic)
- `isEmpty` — [LinkedList-testing](#11045-linkedlist-testing)
- `isEmpty` — [PositionableStream-testing](#11337-positionablestream-testing)
- `isEmpty` — [SharedQueue-accessing](#11532-sharedqueue-accessing)
- `isEnvironment` — [BlockContext-accessing](#1121-blockcontext-accessing)
- `isEnvironment` — [ContextPart-accessing](#1413-contextpart-accessing)
- `isEnvironment` — [MethodContext-accessing](#11131-methodcontext-accessing)
- `isExact` — [Float-testing](#18015-float-testing)
- `isExact` — [Interval-testing](#1935-interval-testing)
- `isExact` — [Number-testing](#112213-number-testing)
- `isExecutable` — [File-testing](#17513-file-testing)
- `isExecutable` — [FilePath-testing](#17712-filepath-testing)
- `isExecutable` — [VFS.ArchiveMember-testing](#12098-vfsarchivemember-testing)
- `isExecutable` — [VFS.FileWrapper-delegation](#12105-vfsfilewrapper-delegation)
- `isExecutable:` — [File class-testing](#1756-file-class-testing)
- `isExternalStream` — [FileDescriptor-class type methods](#1768-filedescriptor-class-type-methods)
- `isExternalStream` — [PositionableStream-class type methods](#11333-positionablestream-class-type-methods)
- `isExternalStream` — [Stream-testing](#115718-stream-testing)
- `isFile` — [FilePath-testing](#17712-filepath-testing)
- `isFileScheme` — [NetClients.URL-testing](#11189-netclientsurl-testing)
- `isFileSystemPath` — [File-testing](#17513-file-testing)
- `isFileSystemPath` — [FilePath-testing](#17712-filepath-testing)
- `isFinite` — [Float-testing](#18015-float-testing)
- `isFinite` — [Number-testing](#112213-number-testing)
- `isFixed` — [Behavior-testing the form of the instances](#1924-behavior-testing-the-form-of-the-instances)
- `isFloat` — [Float-testing functionality](#18016-float-testing-functionality)
- `isFloat` — [Object-testing functionality](#112318-object-testing-functionality)
- `isFragmentOnly` — [NetClients.URL-testing](#11189-netclientsurl-testing)
- `isFunction:` — [CFunctionDescriptor class-testing](#1272-cfunctiondescriptor-class-testing)
- `isIdentity` — [Behavior-testing the form of the instances](#1924-behavior-testing-the-form-of-the-instances)
- `isIdentity` — [Boolean class-testing](#1131-boolean-class-testing)
- `isIdentity` — [SmallInteger class-testing](#11552-smallinteger-class-testing)
- `isImmediate` — [Behavior-testing the form of the instances](#1924-behavior-testing-the-form-of-the-instances)
- `isImmediate` — [BlockClosure class-testing](#1112-blockclosure-class-testing)
- `isImmediate` — [Boolean class-testing](#1131-boolean-class-testing)
- `isImmediate` — [Character class-testing](#1285-character-class-testing)
- `isImmediate` — [Number class-testing](#11222-number-class-testing)
- `isInfinite` — [Float-testing](#18015-float-testing)
- `isInfinite` — [Number-testing](#112213-number-testing)
- `isInPath` — [Package-still unclassified](#11274-package-still-unclassified)
- `isInteger` — [Integer-testing functionality](#19211-integer-testing-functionality)
- `isInteger` — [Object-testing functionality](#112318-object-testing-functionality)
- `isInternalExceptionHandlingContext` — [BlockContext-debugging](#1122-blockcontext-debugging)
- `isInternalExceptionHandlingContext` — [ContextPart-debugging](#1416-contextpart-debugging)
- `isInternalExceptionHandlingContext` — [MethodContext-debugging](#11132-methodcontext-debugging)
- `isKindOf:` — [Object-testing functionality](#112318-object-testing-functionality)
- `isLeapYear` — [Date-date computations](#1596-date-date-computations)
- `isLetter` — [Character-testing](#12812-character-testing)
- `isLiteralObject` — [Array-printing](#144-array-printing)
- `isLiteralObject` — [Boolean-storing](#1135-boolean-storing)
- `isLiteralObject` — [ByteArray-storing](#1147-bytearray-storing)
- `isLiteralObject` — [Character-storing](#12811-character-storing)
- `isLiteralObject` — [Float-storing](#18014-float-storing)
- `isLiteralObject` — [Integer-printing](#1929-integer-printing)
- `isLiteralObject` — [ScaledDecimal-storing](#11487-scaleddecimal-storing)
- `isLiteralObject` — [String-printing](#11589-string-printing)
- `isLiteralObject` — [UndefinedObject-storing](#12019-undefinedobject-storing)
- `isLiteralObject` — [VariableBinding-storing](#12064-variablebinding-storing)
- `isLowercase` — [Character-testing](#12812-character-testing)
- `isMemberOf:` — [Object-testing functionality](#112318-object-testing-functionality)
- `isMeta` — [Object-testing functionality](#112318-object-testing-functionality)
- `isMetaclass` — [Metaclass-testing functionality](#11128-metaclass-testing-functionality)
- `isMetaClass` — [Object-testing functionality](#112318-object-testing-functionality)
- `isMetaclass` — [Object-testing functionality](#112318-object-testing-functionality)
- `isNamespace` — [AbstractNamespace-testing](#118-abstractnamespace-testing)
- `isNamespace` — [Object-testing functionality](#112318-object-testing-functionality)
- `isNaN` — [Float-testing](#18015-float-testing)
- `isNaN` — [Number-testing](#112213-number-testing)
- `isNested` — [Exception-exception handling](#17210-exception-exception-handling)
- `isNil` — [Object-testing functionality](#112318-object-testing-functionality)
- `isNil` — [UndefinedObject-testing](#120110-undefinedobject-testing)
- `isNull` — [CObject-testing](#13611-cobject-testing)
- `isNull` — [UndefinedObject-testing](#120110-undefinedobject-testing)
- `isNumber` — [Number-testing](#112213-number-testing)
- `isNumber` — [Object-testing functionality](#112318-object-testing-functionality)
- `isNumeric` — [CharacterArray-converting](#1296-characterarray-converting)
- `isOldSyntax` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `isOpen` — [FileDescriptor-accessing](#1764-filedescriptor-accessing)
- `isOwnerProcess` — [RecursionLock-accessing](#11432-recursionlock-accessing)
- `isPathSeparator` — [Character-testing](#12812-character-testing)
- `isPeerAlive` — [FileDescriptor-accessing](#1764-filedescriptor-accessing)
- `isPipe` — [FileDescriptor-accessing](#1764-filedescriptor-accessing)
- `isPointers` — [Behavior-testing the form of the instances](#1924-behavior-testing-the-form-of-the-instances)
- `isPositionable` — [FileDescriptor-positioning](#17613-filedescriptor-positioning)
- `isPositionable` — [PositionableStream-positioning](#11335-positionablestream-positioning)
- `isPositionable` — [Stream-positioning](#115713-stream-positioning)
- `isProcess` — [ContextPart-accessing](#1413-contextpart-accessing)
- `isPunctuation` — [Character-testing](#12812-character-testing)
- `isRational` — [Fraction-testing](#18411-fraction-testing)
- `isRational` — [Integer-testing functionality](#19211-integer-testing-functionality)
- `isRational` — [Number-testing](#112213-number-testing)
- `isReadable` — [File-testing](#17513-file-testing)
- `isReadable` — [FilePath-testing](#17712-filepath-testing)
- `isReadable` — [VFS.ArchiveMember-testing](#12098-vfsarchivemember-testing)
- `isReadable` — [VFS.FileWrapper-delegation](#12105-vfsfilewrapper-delegation)
- `isReadable:` — [File class-testing](#1756-file-class-testing)
- `isReadOnly` — [Object-built ins](#11232-object-built-ins)
- `isRelative` — [FilePath-testing](#17712-filepath-testing)
- `isResumable` — [ArithmeticError-description](#131-arithmeticerror-description)
- `isResumable` — [Error-exception description](#1711-error-exception-description)
- `isResumable` — [Exception-exception description](#1729-exception-exception-description)
- `isResumable` — [Halt-description](#1871-halt-description)
- `isResumable` — [MessageNotUnderstood-description](#11112-messagenotunderstood-description)
- `isResumable` — [Notification-exception description](#11191-notification-exception-description)
- `isResumable` — [SystemExceptions.PackageNotAvailable-description](#11832-systemexceptionspackagenotavailable-description)
- `isSeparator` — [Character-testing](#12812-character-testing)
- `isSequenceable` — [Collection-testing collections](#13715-collection-testing-collections)
- `isSequenceable` — [SequenceableCollection-testing](#115111-sequenceablecollection-testing)
- `isSequenceable` — [Stream-testing](#115718-stream-testing)
- `isSimpleSymbol` — [Symbol-testing](#115910-symbol-testing)
- `isSmall` — [LargePositiveInteger-primitive operations](#11005-largepositiveinteger-primitive-operations)
- `isSmallInteger` — [Object-testing functionality](#112318-object-testing-functionality)
- `isSmallInteger` — [SmallInteger-testing functionality](#11558-smallinteger-testing-functionality)
- `isSmalltalk` — [AbstractNamespace-testing](#118-abstractnamespace-testing)
- `isSmalltalk` — [SystemDictionary-testing](#116110-systemdictionary-testing)
- `isSocket` — [File-accessing](#1757-file-accessing)
- `isString` — [Object-testing functionality](#112318-object-testing-functionality)
- `isString` — [String-testing functionality](#115812-string-testing-functionality)
- `isString` — [Symbol-testing functionality](#115911-symbol-testing-functionality)
- `isSymbol` — [Object-testing functionality](#112318-object-testing-functionality)
- `isSymbol` — [Symbol-testing functionality](#115911-symbol-testing-functionality)
- `isSymbolicLink` — [File-accessing](#1757-file-accessing)
- `isSymbolicLink` — [FilePath-testing](#17712-filepath-testing)
- `isSymbolicLink` — [VFS.ArchiveMember-testing](#12098-vfsarchivemember-testing)
- `isSymbolicLink` — [VFS.FileWrapper-testing](#12108-vfsfilewrapper-testing)
- `isSymbolString:` — [Symbol class-symbol table](#11593-symbol-class-symbol-table)
- `isText` — [FileDescriptor-class type methods](#1768-filedescriptor-class-type-methods)
- `isTimeoutProgrammed` — [ProcessorScheduler-timed invocation](#11368-processorscheduler-timed-invocation)
- `isUnicode` — [CharacterArray class-multibyte encodings](#1292-characterarray-class-multibyte-encodings)
- `isUnicode` — [CharacterArray-multibyte encodings](#1297-characterarray-multibyte-encodings)
- `isUnicode` — [Collection class-multibyte encodings](#1372-collection-class-multibyte-encodings)
- `isUnicode` — [Iterable class-multibyte encodings](#1941-iterable-class-multibyte-encodings)
- `isUnicode` — [Stream-character writing](#11576-stream-character-writing)
- `isUnicode` — [String class-multibyte encodings](#11582-string-class-multibyte-encodings)
- `isUnicode` — [UnicodeString class-multibyte encodings](#12032-unicodestring-class-multibyte-encodings)
- `isUntrusted` — [Object-built ins](#11232-object-built-ins)
- `isUnwind` — [BlockContext-accessing](#1121-blockcontext-accessing)
- `isUnwind` — [ContextPart-accessing](#1413-contextpart-accessing)
- `isUnwind` — [MethodContext-accessing](#11131-methodcontext-accessing)
- `isUppercase` — [Character-testing](#12812-character-testing)
- `isValid` — [CCallable-accessing](#1212-ccallable-accessing)
- `isValidCCall` — [CompiledMethod-c call-outs](#1407-compiledmethod-c-call-outs)
- `isVariable` — [Behavior-testing the form of the instances](#1924-behavior-testing-the-form-of-the-instances)
- `isVowel` — [Character-testing](#12812-character-testing)
- `isWriteable` — [File-testing](#17513-file-testing)
- `isWriteable` — [FilePath-testing](#17712-filepath-testing)
- `isWriteable` — [VFS.ArchiveMember-testing](#12098-vfsarchivemember-testing)
- `isWriteable` — [VFS.FileWrapper-delegation](#12105-vfsfilewrapper-delegation)
- `isWriteable:` — [File class-testing](#1756-file-class-testing)
- `isZero` — [Duration-arithmetics](#1693-duration-arithmetics)
- `join` — [Collection-concatenating](#1375-collection-concatenating)
- `join:` — [ArrayedCollection class-instance creation](#151-arrayedcollection-class-instance-creation)
- `join` — [\<1\>:                             Collection class-instance creation](#1371-collection-class-instance-creation)
- `join` — [\<2\>:                             SequenceableCollection-concatenating](#11514-sequenceablecollection-concatenating)
- `join:separatedBy:` — [ArrayedCollection class-instance creation](#151-arrayedcollection-class-instance-creation)
- `join:separatedBy` — [\<1\>:                 SequenceableCollection class-instance creation](#11511-sequenceablecollection-class-instance-creation)
- `jumpDestinationAt:forward:` — [CompiledCode-testing accesses](#13911-compiledcode-testing-accesses)
- `kernel` — [Directory class-reading system defaults](#1663-directory-class-reading-system-defaults)
- `key` — [LookupKey-accessing](#11052-lookupkey-accessing)
- `key:` — [LookupKey class-basic](#11051-lookupkey-class-basic)
- `key` — [\<1\>:                              LookupKey-accessing](#11052-lookupkey-accessing)
- `key` — [\<2\>:                              ProcessVariable class-accessing](#11371-processvariable-class-accessing)
- `key:class:defaultDictionary:` — [DeferredVariableBinding class-basic](#1611-deferredvariablebinding-class-basic)
- `key:value:` — [Association class-basic](#161-association-class-basic)
- `key:value` — [\<1\>:                        Association-accessing](#162-association-accessing)
- `key:value:environment:` — [HomedAssociation class-basic](#1891-homedassociation-class-basic)
- `keyAtValue:` — [Dictionary-accessing](#1642-dictionary-accessing)
- `keyAtValue:ifAbsent:` — [Dictionary-accessing](#1642-dictionary-accessing)
- `keys` — [Dictionary-accessing](#1642-dictionary-accessing)
- `keys` — [MappedCollection-basic](#11082-mappedcollection-basic)
- `keys` — [ProcessEnvironment-accessing](#11353-processenvironment-accessing)
- `keys` — [SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `keysAndValuesDo:` — [Dictionary-dictionary enumerating](#1645-dictionary-dictionary-enumerating)
- `keysAndValuesDo` — [\<1\>:                  LookupTable-enumerating](#11063-lookuptable-enumerating)
- `keysAndValuesDo` — [\<2\>:                  MappedCollection-basic](#11082-mappedcollection-basic)
- `keysAndValuesDo` — [\<3\>:                  Namespace-overrides for superspaces](#11166-namespace-overrides-for-superspaces)
- `keysAndValuesDo` — [\<4\>:                  SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `keysDo:` — [Dictionary-dictionary enumerating](#1645-dictionary-dictionary-enumerating)
- `keysDo` — [\<1\>:                           LookupTable-enumerating](#11063-lookuptable-enumerating)
- `keysDo` — [\<2\>:                           MappedCollection-basic](#11082-mappedcollection-basic)
- `keysDo` — [\<3\>:                           Namespace-overrides for superspaces](#11166-namespace-overrides-for-superspaces)
- `keywords` — [Symbol-basic](#11595-symbol-basic)
- `kindOfSubclass` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `largeNegated` — [LargeInteger-primitive operations](#1987-largeinteger-primitive-operations)
- `largest` — [SmallInteger class-getting limits](#11551-smallinteger-class-getting-limits)
- `last` — [Interval-printing](#1933-interval-printing)
- `last` — [LinkedList-iteration](#11044-linkedlist-iteration)
- `last` — [OrderedCollection-accessing](#11262-orderedcollection-accessing)
- `last` — [RunArray-basic](#11474-runarray-basic)
- `last` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `last` — [SortedCollection-basic](#11563-sortedcollection-basic)
- `last:` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `lastAccessTime` — [File-accessing](#1757-file-accessing)
- `lastAccessTime` — [FilePath-accessing](#1773-filepath-accessing)
- `lastAccessTime` — [VFS.ArchiveMember-accessing](#12091-vfsarchivemember-accessing)
- `lastAccessTime` — [VFS.FileWrapper-delegation](#12105-vfsfilewrapper-delegation)
- `lastAccessTime:` — [FilePath-accessing](#1773-filepath-accessing)
- `lastAccessTime:lastModifyTime:` — [File-file operations](#17511-file-file-operations)
- `lastAccessTime:lastModifyTime` — [\<1\>:    FilePath-accessing](#1773-filepath-accessing)
- `lastAccessTime:lastModifyTime` — [\<2\>:    VFS.FileWrapper-accessing](#12103-vfsfilewrapper-accessing)
- `lastChangeTime` — [File-accessing](#1757-file-accessing)
- `lastChangeTime` — [FilePath-accessing](#1773-filepath-accessing)
- `lastChangeTime` — [VFS.ArchiveMember-accessing](#12091-vfsarchivemember-accessing)
- `lastChangeTime` — [VFS.FileWrapper-delegation](#12105-vfsfilewrapper-delegation)
- `lastDayOfMonth` — [Date-date computations](#1596-date-date-computations)
- `lastModifyTime` — [File-accessing](#1757-file-accessing)
- `lastModifyTime` — [FilePath-accessing](#1773-filepath-accessing)
- `lastModifyTime` — [VFS.ArchiveMember-accessing](#12091-vfsarchivemember-accessing)
- `lastModifyTime` — [VFS.FileWrapper-delegation](#12105-vfsfilewrapper-delegation)
- `lastModifyTime:` — [FilePath-accessing](#1773-filepath-accessing)
- `lcm:` — [Integer-math methods](#1928-integer-math-methods)
- `left` — [Rectangle-accessing](#11422-rectangle-accessing)
- `left:` — [Rectangle-accessing](#11422-rectangle-accessing)
- `left:right:top:bottom:` — [Rectangle class-instance creation](#11421-rectangle-class-instance-creation)
- `left:top:right:bottom:` — [Rectangle class-instance creation](#11421-rectangle-class-instance-creation)
- `left:top:right:bottom` — [\<1\>:            Rectangle-accessing](#11422-rectangle-accessing)
- `leftCenter` — [Rectangle-accessing](#11422-rectangle-accessing)
- `lf` — [Character class-constants](#1282-character-class-constants)
- `libexec` — [Directory class-reading system defaults](#1663-directory-class-reading-system-defaults)
- `libraries` — [Package-accessing](#11273-package-accessing)
- `librariesFor:` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `libraryList` — [DLD class-dynamic linking](#1672-dld-class-dynamic-linking)
- `lineDelimiter` — [CharacterArray class-basic](#1291-characterarray-class-basic)
- `lines` — [CharacterArray-string processing](#1299-characterarray-string-processing)
- `lines` — [Stream-filtering](#115711-stream-filtering)
- `linesDo:` — [CharacterArray-string processing](#1299-characterarray-string-processing)
- `linesDo` — [\<1\>:                          Stream-enumerating](#11579-stream-enumerating)
- `link` — [CCallable-restoring](#1214-ccallable-restoring)
- `link` — [CCallbackDescriptor-restoring](#1223-ccallbackdescriptor-restoring)
- `link` — [CFunctionDescriptor-restoring](#1275-cfunctiondescriptor-restoring)
- `literalAt:` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `literalAt:put:` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `literalEquals:` — [ArrayedCollection-compiler](#154-arrayedcollection-compiler)
- `literalEquals` — [\<1\>:                    Collection-compiler](#1374-collection-compiler)
- `literalEquals` — [\<2\>:                    Float-compiler](#1809-float-compiler)
- `literalEquals` — [\<3\>:                    Object-compiler](#11235-object-compiler)
- `literalEquals` — [\<4\>:                    VariableBinding-compiler](#12061-variablebinding-compiler)
- `literalHash` — [ArrayedCollection-compiler](#154-arrayedcollection-compiler)
- `literalHash` — [Collection-compiler](#1374-collection-compiler)
- `literalHash` — [Float-compiler](#1809-float-compiler)
- `literalHash` — [Object-compiler](#11235-object-compiler)
- `literalHash` — [VariableBinding-compiler](#12061-variablebinding-compiler)
- `literals` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `literals:numArgs:numTemps:attributes:bytecodes:depth:` — [CompiledMethod class-instance creation](#1402-compiledmethod-class-instance-creation)
- `literalsDo:` — [CompiledCode-literals - iteration](#1399-compiledcode-literals---iteration)
- `ln` — [Float-built ins](#1805-float-built-ins)
- `ln` — [Number-misc math](#11229-number-misc-math)
- `ln10` — [Float class-characterization](#1802-float-class-characterization)
- `ln10` — [FloatE class-characterization](#1823-floate-class-characterization)
- `ln10` — [FloatQ class-characterization](#1832-floatq-class-characterization)
- `load` — [ObjectDumper-loading/dumping objects](#11246-objectdumper-loadingdumping-objects)
- `loadFrom:` — [DumperProxy class-accessing](#1681-dumperproxy-class-accessing)
- `loadFrom` — [\<1\>:                         NullProxy class-instance creation](#11201-nullproxy-class-instance-creation)
- `loadFrom` — [\<2\>:                         ObjectDumper class-shortcuts](#11243-objectdumper-class-shortcuts)
- `loadFrom` — [\<3\>:                         VersionableObjectProxy class-saving and restoring](#12071-versionableobjectproxy-class-saving-and-restoring)
- `localKernel` — [Directory class-reading system defaults](#1663-directory-class-reading-system-defaults)
- `lock` — [Semaphore-builtins](#11503-semaphore-builtins)
- `log` — [Float-transcendental operations](#18017-float-transcendental-operations)
- `log` — [Number-misc math](#11229-number-misc-math)
- `log10Base2` — [Float class-characterization](#1802-float-class-characterization)
- `log10Base2` — [FloatE class-characterization](#1823-floate-class-characterization)
- `log10Base2` — [FloatQ class-characterization](#1832-floatq-class-characterization)
- `log:` — [Float-misc math](#18012-float-misc-math)
- `log` — [\<1\>:                              Number-misc math](#11229-number-misc-math)
- `longAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `longAt` — [\<1\>:                           Memory class-accessing](#11091-memory-class-accessing)
- `longAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `longAt:put` — [\<1\>:                       Memory class-accessing](#11091-memory-class-accessing)
- `longDoubleAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `longDoubleAt` — [\<1\>:                     Memory class-accessing](#11091-memory-class-accessing)
- `longDoubleAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `longDoubleAt:put` — [\<1\>:                 Memory class-accessing](#11091-memory-class-accessing)
- `lookupAllSelectors:` — [Behavior-accessing the method dictionary](#193-behavior-accessing-the-method-dictionary)
- `lookupSelector:` — [Behavior-accessing the method dictionary](#193-behavior-accessing-the-method-dictionary)
- `low` — [SystemExceptions.ArgumentOutOfRange-accessing](#11632-systemexceptionsargumentoutofrange-accessing)
- `low:` — [SystemExceptions.ArgumentOutOfRange-accessing](#11632-systemexceptionsargumentoutofrange-accessing)
- `lowBit` — [Integer-bit operators](#1924-integer-bit-operators)
- `lowBit` — [LargeInteger-bit operations](#1983-largeinteger-bit-operations)
- `lowBit` — [SmallInteger-bit arithmetic](#11553-smallinteger-bit-arithmetic)
- `lowerPriority` — [Process-basic](#11342-process-basic)
- `lowestPriority` — [ProcessorScheduler-priorities](#11366-processorscheduler-priorities)
- `lowIOPriority` — [ProcessorScheduler-priorities](#11366-processorscheduler-priorities)
- `makeEphemeron` — [Object-built ins](#11232-object-built-ins)
- `makeFixed` — [Object-built ins](#11232-object-built-ins)
- `makeReadOnly:` — [Object-built ins](#11232-object-built-ins)
- `makeUntrusted:` — [Object-built ins](#11232-object-built-ins)
- `makeUntrusted` — [\<1\>:                    Process-basic](#11342-process-basic)
- `makeWeak` — [Object-built ins](#11232-object-built-ins)
- `map` — [MappedCollection-basic](#11082-mappedcollection-basic)
- `mark` — [MethodContext-accessing](#11131-methodcontext-accessing)
- `mark:` — [Object-built ins](#11232-object-built-ins)
- `match` — [RegexResults-accessing](#11451-regexresults-accessing)
- `match:` — [CharacterArray-comparing](#1295-characterarray-comparing)
- `match:ignoreCase:` — [CharacterArray-comparing](#1295-characterarray-comparing)
- `matched` — [RegexResults-testing](#11452-regexresults-testing)
- `matchInterval` — [RegexResults-accessing](#11451-regexresults-accessing)
- `matchRegex:` — [String-regex](#115810-string-regex)
- `matchRegex:from:to:` — [String-regex](#115810-string-regex)
- `max:` — [Float-comparing](#1808-float-comparing)
- `max` — [\<1\>:                              Magnitude-misc methods](#11072-magnitude-misc-methods)
- `max` — [\<2\>:                              Number-comparing](#11225-number-comparing)
- `max` — [\<3\>:                              Point-comparing](#11324-point-comparing)
- `member:do:` — [VFS.ArchiveFile-ArchiveMember protocol](#12081-vfsarchivefile-archivemember-protocol)
- `member:mode:` — [VFS.ArchiveFile-ArchiveMember protocol](#12081-vfsarchivefile-archivemember-protocol)
- `member:mode` — [\<1\>:                      VFS.ZipFile-members](#12131-vfszipfile-members)
- `merge:` — [Rectangle-rectangle functions](#11425-rectangle-rectangle-functions)
- `meridianAbbreviation` — [DateTime-computations](#1605-datetime-computations)
- `message` — [MessageNotUnderstood-accessing](#11111-messagenotunderstood-accessing)
- `message` — [TextCollector-set up](#11984-textcollector-set-up)
- `message:` — [TextCollector class-accessing](#11981-textcollector-class-accessing)
- `message` — [\<1\>:                          TextCollector-set up](#11984-textcollector-set-up)
- `messageText` — [Exception-accessing](#1725-exception-accessing)
- `messageText` — [SystemExceptions.IndexOutOfRange-accessing](#11692-systemexceptionsindexoutofrange-accessing)
- `messageText` — [SystemExceptions.InvalidArgument-accessing](#11701-systemexceptionsinvalidargument-accessing)
- `messageText` — [SystemExceptions.InvalidState-accessing](#11731-systemexceptionsinvalidstate-accessing)
- `messageText` — [SystemExceptions.InvalidValue-accessing](#11742-systemexceptionsinvalidvalue-accessing)
- `messageText` — [SystemExceptions.NotEnoughElements-accessing](#11782-systemexceptionsnotenoughelements-accessing)
- `messageText` — [SystemExceptions.WrongClass-accessing](#11962-systemexceptionswrongclass-accessing)
- `messageText` — [SystemExceptions.WrongMessageSent-accessing](#11972-systemexceptionswrongmessagesent-accessing)
- `messageText:` — [Exception-accessing](#1725-exception-accessing)
- `metaclassFor:` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `method` — [BlockClosure-accessing](#1113-blockclosure-accessing)
- `method` — [CompiledBlock-accessing](#1382-compiledblock-accessing)
- `method` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `method` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `method` — [ContextPart-accessing](#1413-contextpart-accessing)
- `methodCategory` — [CompiledBlock-basic](#1383-compiledblock-basic)
- `methodCategory` — [CompiledCode-basic](#1395-compiledcode-basic)
- `methodCategory` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `methodCategory:` — [CompiledBlock-basic](#1383-compiledblock-basic)
- `methodCategory` — [\<1\>:                   CompiledCode-basic](#1395-compiledcode-basic)
- `methodCategory` — [\<2\>:                   CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `methodClass` — [CompiledBlock-accessing](#1382-compiledblock-accessing)
- `methodClass` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `methodClass` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `methodClass` — [ContextPart-accessing](#1413-contextpart-accessing)
- `methodClass` — [MethodInfo-accessing](#11151-methodinfo-accessing)
- `methodClass:` — [CompiledBlock-accessing](#1382-compiledblock-accessing)
- `methodClass` — [\<1\>:                      CompiledCode-accessing](#1394-compiledcode-accessing)
- `methodClass` — [\<2\>:                      CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `methodClass` — [\<3\>:                      MethodInfo-accessing](#11151-methodinfo-accessing)
- `methodDictionary` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `methodDictionary` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `methodDictionary:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `methodFormattedSourceString` — [CompiledMethod-compiling](#1408-compiledmethod-compiling)
- `methodParseNode` — [CompiledMethod-compiling](#1408-compiledmethod-compiling)
- `methodRecompilationSourceString` — [CompiledMethod-source code](#14012-compiledmethod-source-code)
- `methods` — [Behavior-compilation (alternative)](#197-behavior-compilation-alternative)
- `methodsFor` — [Behavior-compilation (alternative)](#197-behavior-compilation-alternative)
- `methodsFor:` — [Behavior-compiling methods](#199-behavior-compiling-methods)
- `methodsFor:ifFeatures:` — [Behavior-compilation (alternative)](#197-behavior-compilation-alternative)
- `methodsFor:ifTrue:` — [Behavior-built ins](#194-behavior-built-ins)
- `methodsFor:stamp:` — [Behavior-compilation (alternative)](#197-behavior-compilation-alternative)
- `methodSourceCode` — [CompiledBlock-basic](#1383-compiledblock-basic)
- `methodSourceCode` — [CompiledCode-basic](#1395-compiledcode-basic)
- `methodSourceCode` — [CompiledMethod-source code](#14012-compiledmethod-source-code)
- `methodSourceFile` — [CompiledBlock-basic](#1383-compiledblock-basic)
- `methodSourceFile` — [CompiledCode-basic](#1395-compiledcode-basic)
- `methodSourceFile` — [CompiledMethod-source code](#14012-compiledmethod-source-code)
- `methodSourcePos` — [CompiledBlock-basic](#1383-compiledblock-basic)
- `methodSourcePos` — [CompiledCode-basic](#1395-compiledcode-basic)
- `methodSourcePos` — [CompiledMethod-source code](#14012-compiledmethod-source-code)
- `methodSourceString` — [CompiledBlock-basic](#1383-compiledblock-basic)
- `methodSourceString` — [CompiledCode-basic](#1395-compiledcode-basic)
- `methodSourceString` — [CompiledMethod-source code](#14012-compiledmethod-source-code)
- `midnight` — [Time class-basic (UTC)](#11991-time-class-basic-utc)
- `millisecondClock` — [Time class-clocks](#11993-time-class-clocks)
- `millisecondClockValue` — [Time class-clocks](#11993-time-class-clocks)
- `milliseconds:` — [Duration class-instance creation](#1691-duration-class-instance-creation)
- `millisecondsPerDay` — [Time class-clocks](#11993-time-class-clocks)
- `millisecondsToRun:` — [Time class-clocks](#11993-time-class-clocks)
- `min:` — [Float-comparing](#1808-float-comparing)
- `min` — [\<1\>:                              Magnitude-misc methods](#11072-magnitude-misc-methods)
- `min` — [\<2\>:                              Number-comparing](#11225-number-comparing)
- `min` — [\<3\>:                              Point-comparing](#11324-point-comparing)
- `minute` — [DateTime-computations](#1605-datetime-computations)
- `minute` — [Time-accessing (ANSI for DateAndTimes)](#11996-time-accessing-ansi-for-dateandtimes)
- `minute:` — [Time class-instance creation](#11995-time-class-instance-creation)
- `minutes` — [Time-accessing (non ANSI & for Durations)](#11997-time-accessing-non-ansi--for-durations)
- `minutes:` — [Time class-instance creation](#11995-time-class-instance-creation)
- `mode` — [File-accessing](#1757-file-accessing)
- `mode` — [FilePath-accessing](#1773-filepath-accessing)
- `mode` — [VFS.ArchiveMember-testing](#12098-vfsarchivemember-testing)
- `mode` — [VFS.FileWrapper-delegation](#12105-vfsfilewrapper-delegation)
- `mode:` — [File-accessing](#1757-file-accessing)
- `mode` — [\<1\>:                             FilePath-accessing](#1773-filepath-accessing)
- `mode` — [\<2\>:                             VFS.ArchiveMember-testing](#12098-vfsarchivemember-testing)
- `mode` — [\<3\>:                             VFS.FileWrapper-delegation](#12105-vfsfilewrapper-delegation)
- `module` — [Directory class-reading system defaults](#1663-directory-class-reading-system-defaults)
- `moduleList` — [DLD class-dynamic linking](#1672-dld-class-dynamic-linking)
- `modules` — [Package-accessing](#11273-package-accessing)
- `modulesFor:` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `month` — [Date-date computations](#1596-date-date-computations)
- `monthAbbreviation` — [Date-date computations](#1596-date-date-computations)
- `monthIndex` — [Date-date computations](#1596-date-date-computations)
- `monthName` — [Date-date computations](#1596-date-date-computations)
- `mourn` — [Association-finalization](#163-association-finalization)
- `mourn` — [HomedAssociation-finalization](#1893-homedassociation-finalization)
- `mourn` — [Object-finalization](#112311-object-finalization)
- `mourn:` — [Collection-finalization](#13710-collection-finalization)
- `moveBy:` — [Rectangle-transforming](#11427-rectangle-transforming)
- `moveTo:` — [Rectangle-transforming](#11427-rectangle-transforming)
- `multiBecome:` — [Array-mutating objects](#143-array-mutating-objects)
- `multiply:` — [LargePositiveInteger-primitive operations](#11005-largepositiveinteger-primitive-operations)
- `mustBeBoolean` — [Object-VM callbacks](#112319-object-vm-callbacks)
- `name` — [AbstractNamespace-printing](#117-abstractnamespace-printing)
- `name` — [Behavior-support for lightweight classes](#1921-behavior-support-for-lightweight-classes)
- `name` — [BindingDictionary-accessing](#1101-bindingdictionary-accessing)
- `name` — [CFunctionDescriptor-accessing](#1273-cfunctiondescriptor-accessing)
- `name` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `name` — [File-accessing](#1757-file-accessing)
- `name` — [FileDescriptor-accessing](#1764-filedescriptor-accessing)
- `name` — [FilePath-file name management](#1778-filepath-file-name-management)
- `name` — [Metaclass-delegation](#11125-metaclass-delegation)
- `name` — [Permission-accessing](#11292-permission-accessing)
- `name` — [PositionableStream-compiling](#11334-positionablestream-compiling)
- `name` — [Process-accessing](#11341-process-accessing)
- `name` — [RecursionLock-accessing](#11432-recursionlock-accessing)
- `name` — [Semaphore-accessing](#11502-semaphore-accessing)
- `name` — [Stream-accessing-reading](#11571-stream-accessing-reading)
- `name` — [VFS.ArchiveMember-accessing](#12091-vfsarchivemember-accessing)
- `name` — [VFS.FileWrapper-accessing](#12103-vfsfilewrapper-accessing)
- `name:` — [AbstractNamespace-printing](#117-abstractnamespace-printing)
- `name` — [\<1\>:                             CFunctionDescriptor-accessing](#1273-cfunctiondescriptor-accessing)
- `name` — [\<2\>:                             File class-instance creation](#1754-file-class-instance-creation)
- `name` — [\<3\>:                             Permission-accessing](#11292-permission-accessing)
- `name` — [\<4\>:                             Process-accessing](#11341-process-accessing)
- `name` — [\<5\>:                             RecursionLock-accessing](#11432-recursionlock-accessing)
- `name` — [\<6\>:                             Semaphore-accessing](#11502-semaphore-accessing)
- `name` — [\<7\>:                             VFS.ArchiveMember-accessing](#12091-vfsarchivemember-accessing)
- `name:environment:subclassOf:` — [Metaclass-basic](#11123-metaclass-basic)
- `name:environment:subclassOf:instanceVariableArray:shape:classPool:poolDictionaries:category:` — [Metaclass-basic](#11123-metaclass-basic)
- `name:environment:subclassOf:instanceVariableNames:shape:classVariableNames:poolDictionaries:category:` — [Metaclass-basic](#11123-metaclass-basic)
- `name:target:action:` — [Permission class-testing](#11291-permission-class-testing)
- `name:target:actions:` — [Permission class-testing](#11291-permission-class-testing)
- `nameAt:` — [FilePath-directory operations](#1776-filepath-directory-operations)
- `nameAt` — [\<1\>:                           VFS.ArchiveFile-directory operations](#12082-vfsarchivefile-directory-operations)
- `nameIn:` — [AbstractNamespace-printing](#117-abstractnamespace-printing)
- `nameIn` — [\<1\>:                           Behavior-support for lightweight classes](#1921-behavior-support-for-lightweight-classes)
- `nameIn` — [\<2\>:                           BindingDictionary-accessing](#1101-bindingdictionary-accessing)
- `nameIn` — [\<3\>:                           ClassDescription-printing](#1327-classdescription-printing)
- `nameIn` — [\<4\>:                           Metaclass-printing](#11127-metaclass-printing)
- `nameIn` — [\<5\>:                           Namespace-printing](#11167-namespace-printing)
- `nameIn` — [\<6\>:                           RootNamespace-printing](#11464-rootnamespace-printing)
- `nameIn` — [\<7\>:                           SystemDictionary-printing](#11617-systemdictionary-printing)
- `nameOfDay:` — [Date class-basic](#1591-date-class-basic)
- `nameOfMonth:` — [Date class-basic](#1591-date-class-basic)
- `namesDo:` — [File-directory operations](#1759-file-directory-operations)
- `namesDo` — [\<1\>:                          FilePath-enumerating](#1777-filepath-enumerating)
- `namesDo` — [\<2\>:                          VFS.ArchiveFile-directory operations](#12082-vfsarchivefile-directory-operations)
- `namesDo` — [\<3\>:                          VFS.ArchiveMember-directory operations](#12094-vfsarchivemember-directory-operations)
- `namesDo` — [\<4\>:                          VFS.FileWrapper-enumerating](#12106-vfsfilewrapper-enumerating)
- `namesMatching:do:` — [FilePath-enumerating](#1777-filepath-enumerating)
- `namespace` — [Package-accessing](#11273-package-accessing)
- `namespace:` — [Package-accessing](#11273-package-accessing)
- `nan` — [FloatD class-characterization](#1812-floatd-class-characterization)
- `nan` — [FloatE class-characterization](#1823-floate-class-characterization)
- `nan` — [FloatQ class-characterization](#1832-floatq-class-characterization)
- `nanosecondClock` — [Time class-clocks](#11993-time-class-clocks)
- `nanosecondClockValue` — [Time class-clocks](#11993-time-class-clocks)
- `narrow` — [CObject-conversion](#1368-cobject-conversion)
- `narrow` — [UndefinedObject-CObject interoperability](#12014-undefinedobject-cobject-interoperability)
- `negated` — [Duration-arithmetics](#1693-duration-arithmetics)
- `negated` — [Float-arithmetic](#1803-float-arithmetic)
- `negated` — [Fraction-optimized cases](#1849-fraction-optimized-cases)
- `negated` — [LargeInteger-arithmetic](#1982-largeinteger-arithmetic)
- `negated` — [Number-misc math](#11229-number-misc-math)
- `negative` — [Duration-arithmetics](#1693-duration-arithmetics)
- `negative` — [Float-testing](#18015-float-testing)
- `negative` — [LargeNegativeInteger-numeric testing](#1992-largenegativeinteger-numeric-testing)
- `negative` — [LargePositiveInteger-numeric testing](#11004-largepositiveinteger-numeric-testing)
- `negative` — [Number-testing](#112213-number-testing)
- `negativeInfinity` — [FloatD class-characterization](#1812-floatd-class-characterization)
- `negativeInfinity` — [FloatE class-characterization](#1823-floate-class-characterization)
- `negativeInfinity` — [FloatQ class-characterization](#1832-floatq-class-characterization)
- `new` — [AbstractNamespace class-instance creation](#111-abstractnamespace-class-instance-creation)
- `new` — [Bag class-basic](#181-bag-class-basic)
- `new` — [Behavior-builtin](#195-behavior-builtin)
- `new` — [CCompound class-instance creation](#1241-ccompound-class-instance-creation)
- `new` — [CObject class-instance creation](#1362-cobject-class-instance-creation)
- `new` — [CType-C instance creation](#1525-ctype-c-instance-creation)
- `new` — [Dictionary class-instance creation](#1641-dictionary-class-instance-creation)
- `new` — [Exception class-instance creation](#1723-exception-class-instance-creation)
- `new` — [ExceptionSet class-instance creation](#1731-exceptionset-class-instance-creation)
- `new` — [HashedCollection class-instance creation](#1881-hashedcollection-class-instance-creation)
- `new` — [LookupTable class-instance creation](#11061-lookuptable-class-instance-creation)
- `new` — [MappedCollection class-instance creation](#11081-mappedcollection-class-instance-creation)
- `new` — [Namespace class-disabling instance creation](#11162-namespace-class-disabling-instance-creation)
- `new` — [NetClients.URL class-instance creation](#11182-netclientsurl-class-instance-creation)
- `new` — [NullValueHolder class-creating instances](#11211-nullvalueholder-class-creating-instances)
- `new` — [ObjectDumper class-instance creation](#11242-objectdumper-class-instance-creation)
- `new` — [OrderedCollection class-instance creation](#11261-orderedcollection-class-instance-creation)
- `new` — [Point class-instance creation](#11321-point-class-instance-creation)
- `new` — [ProcessEnvironment class-disabled](#11351-processenvironment-class-disabled)
- `new` — [ProcessorScheduler class-instance creation](#11361-processorscheduler-class-instance-creation)
- `new` — [ProcessVariable class-accessing](#11371-processvariable-class-accessing)
- `new` — [Random class-instance creation](#11391-random-class-instance-creation)
- `new` — [Rectangle class-instance creation](#11421-rectangle-class-instance-creation)
- `new` — [RecursionLock class-instance creation](#11431-recursionlock-class-instance-creation)
- `new` — [Regex class-instance creation](#11441-regex-class-instance-creation)
- `new` — [RunArray class-instance creation](#11471-runarray-class-instance-creation)
- `new` — [Semaphore class-instance creation](#11501-semaphore-class-instance-creation)
- `new` — [SharedQueue class-instance creation](#11531-sharedqueue-class-instance-creation)
- `new` — [SortedCollection class-instance creation](#11562-sortedcollection-class-instance-creation)
- `new` — [Symbol class-instance creation](#11592-symbol-class-instance-creation)
- `new` — [SystemExceptions.MutationError class-instance creation](#11761-systemexceptionsmutationerror-class-instance-creation)
- `new` — [TextCollector class-accessing](#11981-textcollector-class-accessing)
- `new` — [Time class-instance creation](#11995-time-class-instance-creation)
- `new` — [ValueAdaptor class-creating instances](#12041-valueadaptor-class-creating-instances)
- `new` — [ValueHolder class-creating instances](#12051-valueholder-class-creating-instances)
- `new` — [WeakArray class-instance creation](#12151-weakarray-class-instance-creation)
- `new` — [ZeroDivide class-instance creation](#12241-zerodivide-class-instance-creation)
- `new:` — [Bag class-basic](#181-bag-class-basic)
- `new` — [\<1\>:                              Behavior-builtin](#195-behavior-builtin)
- `new` — [\<2\>:                              CObject class-instance creation](#1362-cobject-class-instance-creation)
- `new` — [\<3\>:                              CType-accessing](#1523-ctype-accessing)
- `new` — [\<4\>:                              HashedCollection class-instance creation](#1881-hashedcollection-class-instance-creation)
- `new` — [\<5\>:                              LargeArrayedCollection class-instance creation](#1961-largearrayedcollection-class-instance-creation)
- `new` — [\<6\>:                              Namespace class-disabling instance creation](#11162-namespace-class-disabling-instance-creation)
- `new` — [\<7\>:                              OrderedCollection class-instance creation](#11261-orderedcollection-class-instance-creation)
- `new` — [\<8\>:                              RootNamespace class-instance creation](#11461-rootnamespace-class-instance-creation)
- `new` — [\<9\>:                              RunArray class-instance creation](#11471-runarray-class-instance-creation)
- `new` — [\<10\>:                             SortedCollection class-instance creation](#11562-sortedcollection-class-instance-creation)
- `new` — [\<11\>:                             Symbol class-instance creation](#11592-symbol-class-instance-creation)
- `new` — [\<12\>:                             WeakArray class-instance creation](#12151-weakarray-class-instance-creation)
- `new:header:literals:` — [CompiledCode class-instance creation](#1392-compiledcode-class-instance-creation)
- `new:header:method:` — [CompiledBlock class-instance creation](#1381-compiledblock-class-instance-creation)
- `new:header:numLiterals:` — [CompiledCode class-instance creation](#1392-compiledcode-class-instance-creation)
- `new:withAll:` — [ArrayedCollection class-instance creation](#151-arrayedcollection-class-instance-creation)
- `newBuffer` — [FileStream-buffering](#1794-filestream-buffering)
- `newCollection:` — [LargeArray-overridden](#1951-largearray-overridden)
- `newCollection` — [\<1\>:                    LargeByteArray-overridden](#1971-largebytearray-overridden)
- `newCollection` — [\<2\>:                    LargeWordArray-overridden](#11011-largewordarray-overridden)
- `newDay:month:year:` — [Date class-instance creation (Blue Book)](#1593-date-class-instance-creation-blue-book)
- `newDay:monthIndex:year:` — [Date class-instance creation (Blue Book)](#1593-date-class-instance-creation-blue-book)
- `newDay:year:` — [Date class-instance creation (Blue Book)](#1593-date-class-instance-creation-blue-book)
- `newFromNumber:scale:` — [ScaledDecimal class-instance creation](#11481-scaleddecimal-class-instance-creation)
- `newInFixedSpace` — [Behavior-instance creation](#1913-behavior-instance-creation)
- `newInFixedSpace:` — [Behavior-instance creation](#1913-behavior-instance-creation)
- `newMeta:environment:subclassOf:instanceVariableArray:shape:classPool:poolDictionaries:category:` — [Metaclass-basic](#11123-metaclass-basic)
- `newPage` — [Character class-constants](#1282-character-class-constants)
- `newProcess` — [BlockClosure-multiple process](#1117-blockclosure-multiple-process)
- `newProcess` — [DirectedMessage-multiple process](#1654-directedmessage-multiple-process)
- `newProcessWith:` — [BlockClosure-multiple process](#1117-blockclosure-multiple-process)
- `newsGroup` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `newStruct:declaration:` — [CCompound class-subclass creation](#1242-ccompound-class-subclass-creation)
- `next` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `next` — [FileStream-basic](#1793-filestream-basic)
- `next` — [Generator-stream protocol](#1852-generator-stream-protocol)
- `next` — [ObjectDumper-stream interface](#11247-objectdumper-stream-interface)
- `next` — [PositionableStream-accessing-reading](#11332-positionablestream-accessing-reading)
- `next` — [Random class-shortcuts](#11392-random-class-shortcuts)
- `next` — [Random-basic](#11393-random-basic)
- `next` — [SharedQueue-accessing](#11532-sharedqueue-accessing)
- `next` — [Stream-accessing-reading](#11571-stream-accessing-reading)
- `next:` — [Stream-accessing-reading](#11571-stream-accessing-reading)
- `next:bufferAll:startingAt:` — [FileStream-buffering](#1794-filestream-buffering)
- `next:into:startingAt:` — [Stream-buffering](#11574-stream-buffering)
- `next:put:` — [Stream-accessing-writing](#11572-stream-accessing-writing)
- `next:put` — [\<1\>:                         TextCollector-accessing](#11982-textcollector-accessing)
- `next:putAll:startingAt:` — [FileDescriptor-low-level access](#17610-filedescriptor-low-level-access)
- `next:putAll:startingAt` — [\<1\>:           FileStream-overriding inherited methods](#1797-filestream-overriding-inherited-methods)
- `next:putAll:startingAt` — [\<2\>:           Stream-accessing-writing](#11572-stream-accessing-writing)
- `next:putAll:startingAt` — [\<3\>:           TextCollector-accessing](#11982-textcollector-accessing)
- `next:putAll:startingAt` — [\<4\>:           WriteStream-accessing-writing](#12232-writestream-accessing-writing)
- `next:putAllOn:` — [Stream-buffering](#11574-stream-buffering)
- `nextAvailable:` — [Stream-accessing-reading](#11571-stream-accessing-reading)
- `nextAvailable:into:startingAt:` — [FileDescriptor-low-level access](#17610-filedescriptor-low-level-access)
- `nextAvailable:into:startingAt` — [\<1\>:    FileStream-buffering](#1794-filestream-buffering)
- `nextAvailable:into:startingAt` — [\<2\>:    PositionableStream-accessing-reading](#11332-positionablestream-accessing-reading)
- `nextAvailable:into:startingAt` — [\<3\>:    Stream-accessing-reading](#11571-stream-accessing-reading)
- `nextAvailable:putAllOn:` — [FileStream-buffering](#1794-filestream-buffering)
- `nextAvailable:putAllOn` — [\<1\>:           PositionableStream-accessing-reading](#11332-positionablestream-accessing-reading)
- `nextAvailable:putAllOn` — [\<2\>:           Stream-accessing-reading](#11571-stream-accessing-reading)
- `nextAvailablePutAllOn:` — [Stream-streaming protocol](#115717-stream-streaming-protocol)
- `nextByte` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `nextByteArray:` — [FileDescriptor-binary I/O](#1766-filedescriptor-binary-io)
- `nextDouble` — [FileDescriptor-binary I/O](#1766-filedescriptor-binary-io)
- `nextFloat` — [FileDescriptor-binary I/O](#1766-filedescriptor-binary-io)
- `nextInstance` — [Object-built ins](#11232-object-built-ins)
- `nextLine` — [FileStream-overriding inherited methods](#1797-filestream-overriding-inherited-methods)
- `nextLine` — [Stream-accessing-reading](#11571-stream-accessing-reading)
- `nextLink` — [Link-basic](#11032-link-basic)
- `nextLink:` — [Link class-instance creation](#11031-link-class-instance-creation)
- `nextLink` — [\<1\>:                         Link-basic](#11032-link-basic)
- `nextLong` — [FileDescriptor-binary I/O](#1766-filedescriptor-binary-io)
- `nextLongLong` — [FileDescriptor-binary I/O](#1766-filedescriptor-binary-io)
- `nextMatchFor:` — [Stream-accessing-reading](#11571-stream-accessing-reading)
- `nextPut:` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `nextPut` — [\<1\>:                          FileStream-basic](#1793-filestream-basic)
- `nextPut` — [\<2\>:                          ObjectDumper-stream interface](#11247-objectdumper-stream-interface)
- `nextPut` — [\<3\>:                          Random-basic](#11393-random-basic)
- `nextPut` — [\<4\>:                          SharedQueue-accessing](#11532-sharedqueue-accessing)
- `nextPut` — [\<5\>:                          Stream-accessing-writing](#11572-stream-accessing-writing)
- `nextPut` — [\<6\>:                          TextCollector-accessing](#11982-textcollector-accessing)
- `nextPut` — [\<7\>:                          WriteStream-accessing-writing](#12232-writestream-accessing-writing)
- `nextPutAll:` — [Stream-accessing-writing](#11572-stream-accessing-writing)
- `nextPutAllFlush:` — [Stream-accessing-writing](#11572-stream-accessing-writing)
- `nextPutAllOn:` — [FileDescriptor-overriding inherited methods](#17611-filedescriptor-overriding-inherited-methods)
- `nextPutAllOn` — [\<1\>:                     FileStream-overriding inherited methods](#1797-filestream-overriding-inherited-methods)
- `nextPutAllOn` — [\<2\>:                     Iterable-streaming](#1944-iterable-streaming)
- `nextPutAllOn` — [\<3\>:                     PositionableStream-still unclassified](#11336-positionablestream-still-unclassified)
- `nextPutAllOn` — [\<4\>:                     SequenceableCollection-still unclassified](#115110-sequenceablecollection-still-unclassified)
- `nextPutAllOn` — [\<5\>:                     Stream-still unclassified](#115715-stream-still-unclassified)
- `nextPutByte:` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `nextPutByteArray:` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `nextPutDouble:` — [FileDescriptor-binary I/O](#1766-filedescriptor-binary-io)
- `nextPutFloat:` — [FileDescriptor-binary I/O](#1766-filedescriptor-binary-io)
- `nextPutInt64:` — [FileDescriptor-binary I/O](#1766-filedescriptor-binary-io)
- `nextPutLong:` — [FileDescriptor-binary I/O](#1766-filedescriptor-binary-io)
- `nextPutShort:` — [FileDescriptor-binary I/O](#1766-filedescriptor-binary-io)
- `nextShort` — [FileDescriptor-binary I/O](#1766-filedescriptor-binary-io)
- `nextSignedByte` — [FileDescriptor-binary I/O](#1766-filedescriptor-binary-io)
- `nextUint64` — [FileDescriptor-binary I/O](#1766-filedescriptor-binary-io)
- `nextUlong` — [FileDescriptor-binary I/O](#1766-filedescriptor-binary-io)
- `nextUshort` — [FileDescriptor-binary I/O](#1766-filedescriptor-binary-io)
- `nextValidOop` — [SmallInteger-built ins](#11554-smallinteger-built-ins)
- `nl` — [Character class-constants](#1282-character-class-constants)
- `nl` — [Stream-character writing](#11576-stream-character-writing)
- `nlTab` — [Stream-character writing](#11576-stream-character-writing)
- `noMask:` — [Integer-bit operators](#1924-integer-bit-operators)
- `noneSatisfy:` — [Iterable-enumeration](#1942-iterable-enumeration)
- `nonVersionedInstSize` — [Class-saving and loading](#1318-class-saving-and-loading)
- `normal` — [Point-point functions](#11326-point-point-functions)
- `noRunnableProcess` — [Object-VM callbacks](#112319-object-vm-callbacks)
- `not` — [Boolean-basic](#1132-boolean-basic)
- `not` — [False-basic](#1741-false-basic)
- `not` — [True-basic](#12001-true-basic)
- `notEmpty` — [Collection-testing collections](#13715-collection-testing-collections)
- `notEmpty` — [LinkedList-testing](#11045-linkedlist-testing)
- `noteOldSyntax` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `notify` — [Semaphore-builtins](#11503-semaphore-builtins)
- `notifyAll` — [Semaphore-builtins](#11503-semaphore-builtins)
- `notNil` — [Object-testing functionality](#112318-object-testing-functionality)
- `notNil` — [UndefinedObject-testing](#120110-undefinedobject-testing)
- `notYetImplemented` — [Object-built ins](#11232-object-built-ins)
- `now` — [DateTime class-instance creation](#1602-datetime-class-instance-creation)
- `now` — [Time class-instance creation](#11995-time-class-instance-creation)
- `nthOuterContext:` — [BlockContext-accessing](#1121-blockcontext-accessing)
- `nul` — [Character class-constants](#1282-character-class-constants)
- `null` — [Promise class-creating instances](#11381-promise-class-creating-instances)
- `null` — [ValueHolder class-creating instances](#12051-valueholder-class-creating-instances)
- `numArgs` — [BlockClosure-accessing](#1113-blockclosure-accessing)
- `numArgs` — [CompiledBlock-accessing](#1382-compiledblock-accessing)
- `numArgs` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `numArgs` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `numArgs` — [ContextPart-accessing](#1413-contextpart-accessing)
- `numArgs` — [Symbol-basic](#11595-symbol-basic)
- `numArgs:` — [CompiledMethod class-instance creation](#1402-compiledmethod-class-instance-creation)
- `numArgs:numTemps:bytecodes:depth:literals:` — [BlockClosure class-instance creation](#1111-blockclosure-class-instance-creation)
- `numArgs:numTemps:bytecodes:depth:literals` — [\<1\>: CompiledBlock class-instance creation](#1381-compiledblock-class-instance-creation)
- `numberOfCharacters` — [CharacterArray-multibyte encodings](#1297-characterarray-multibyte-encodings)
- `numberOfCharacters` — [UnicodeString-multibyte encodings](#12036-unicodestring-multibyte-encodings)
- `numberOfElements` — [CArrayCType-accessing](#1182-carrayctype-accessing)
- `numCompactions` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `numerator` — [Fraction-accessing](#1843-fraction-accessing)
- `numerator` — [Integer-accessing](#1922-integer-accessing)
- `numerator:denominator:` — [Fraction class-instance creation](#1842-fraction-class-instance-creation)
- `numFixedOOPs` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `numFreeOTEs` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `numGlobalGCs` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `numGrowths` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `numLiterals` — [CompiledBlock-accessing](#1382-compiledblock-accessing)
- `numLiterals` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `numOldOOPs` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `numOTEs` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `numScavenges` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `numTemps` — [BlockClosure-accessing](#1113-blockclosure-accessing)
- `numTemps` — [CompiledBlock-accessing](#1382-compiledblock-accessing)
- `numTemps` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `numTemps` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `numTemps` — [ContextPart-accessing](#1413-contextpart-accessing)
- `numWeakOOPs` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `object` — [AlternativeObjectProxy-accessing](#122-alternativeobjectproxy-accessing)
- `object` — [DumperProxy-saving and restoring](#1683-dumperproxy-saving-and-restoring)
- `object` — [PluggableProxy-saving and restoring](#11312-pluggableproxy-saving-and-restoring)
- `object` — [SingletonProxy-saving and restoring](#11543-singletonproxy-saving-and-restoring)
- `object:` — [AlternativeObjectProxy-accessing](#122-alternativeobjectproxy-accessing)
- `objectAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `objectAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `objectsAndRunLengthsDo:` — [RunArray-enumerating](#11476-runarray-enumerating)
- `occurrencesOf:` — [Bag-testing collections](#188-bag-testing-collections)
- `occurrencesOf` — [\<1\>:                    Collection-testing collections](#13715-collection-testing-collections)
- `occurrencesOf` — [\<2\>:                    Dictionary-dictionary testing](#1647-dictionary-dictionary-testing)
- `occurrencesOf` — [\<3\>:                    HashedCollection-testing collections](#18810-hashedcollection-testing-collections)
- `occurrencesOf` — [\<4\>:                    SortedCollection-searching](#11568-sortedcollection-searching)
- `occurrencesOfRegex:` — [String-regex](#115810-string-regex)
- `occurrencesOfRegex:from:to:` — [String-regex](#115810-string-regex)
- `occurrencesOfRegex:startingAt:` — [String-regex](#115810-string-regex)
- `odd` — [Integer-math methods](#1928-integer-math-methods)
- `odd` — [Number-testing](#112213-number-testing)
- `offset` — [DateTime-time zones](#16010-datetime-time-zones)
- `offset` — [VFS.StoredZipMember-accessing](#12111-vfsstoredzipmember-accessing)
- `offset:` — [DateTime-time zones](#16010-datetime-time-zones)
- `offset` — [\<1\>:                           VFS.StoredZipMember-accessing](#12111-vfsstoredzipmember-accessing)
- `oldSpaceSize` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `oldSpaceUsedBytes` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `on:` — [AlternativeObjectProxy class-instance creation](#121-alternativeobjectproxy-class-instance-creation)
- `on` — [\<1\>:                               DumperProxy class-instance creation](#1682-dumperproxy-class-instance-creation)
- `on` — [\<2\>:                               FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `on` — [\<3\>:                               Generator class-instance creation](#1851-generator-class-instance-creation)
- `on` — [\<4\>:                               NetClients.URIResolver class-instance creation](#11172-netclientsuriresolver-class-instance-creation)
- `on` — [\<5\>:                               ObjectDumper class-instance creation](#11242-objectdumper-class-instance-creation)
- `on` — [\<6\>:                               PluggableProxy class-accessing](#11311-pluggableproxy-class-accessing)
- `on` — [\<7\>:                               PositionableStream class-instance creation](#11331-positionablestream-class-instance-creation)
- `on` — [\<8\>:                               ReadStream class-instance creation](#11401-readstream-class-instance-creation)
- `on` — [\<9\>:                               ReadWriteStream class-instance creation](#11411-readwritestream-class-instance-creation)
- `on` — [\<10\>:                              SingletonProxy class-instance creation](#11542-singletonproxy-class-instance-creation)
- `on` — [\<11\>:                              VFS.FileWrapper class-instance creation](#12102-vfsfilewrapper-class-instance-creation)
- `on` — [\<12\>:                              WriteStream class-instance creation](#12231-writestream-class-instance-creation)
- `on:aspect:` — [PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `on:do:` — [BlockClosure-exception handling](#1116-blockclosure-exception-handling)
- `on:do` — [\<1\>:                            Generator class-instance creation](#1851-generator-class-instance-creation)
- `on:do:on:do:` — [BlockClosure-exception handling](#1116-blockclosure-exception-handling)
- `on:do:on:do:on:do:` — [BlockClosure-exception handling](#1116-blockclosure-exception-handling)
- `on:do:on:do:on:do:on:do:` — [BlockClosure-exception handling](#1116-blockclosure-exception-handling)
- `on:do:on:do:on:do:on:do:on:do:` — [BlockClosure-exception handling](#1116-blockclosure-exception-handling)
- `on:from:to:` — [PositionableStream class-instance creation](#11331-positionablestream-class-instance-creation)
- `on:from:to` — [\<1\>:                       ReadStream class-instance creation](#11401-readstream-class-instance-creation)
- `on:from:to` — [\<2\>:                       ReadWriteStream class-instance creation](#11411-readwritestream-class-instance-creation)
- `on:getSelector:putSelector:` — [PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `on:index:` — [PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `on:key:` — [PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `on:startingAt:for:` — [FileSegment class-basic](#1781-filesegment-class-basic)
- `one` — [ScaledDecimal-constants](#11485-scaleddecimal-constants)
- `oneShotValue` — [Continuation-invocation](#1422-continuation-invocation)
- `oneShotValue:` — [Continuation-invocation](#1422-continuation-invocation)
- `onOccurrencesOfRegex:do:` — [String-regex](#115810-string-regex)
- `onOccurrencesOfRegex:from:to:do:` — [String-regex](#115810-string-regex)
- `open:` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `open` — [\<1\>:                             FilePath-file operations](#1779-filepath-file-operations)
- `open:ifFail:` — [FilePath-file operations](#1779-filepath-file-operations)
- `open:mode:` — [FileDescriptor class-still unclassified](#1763-filedescriptor-class-still-unclassified)
- `open:mode:ifFail:` — [File-file operations](#17511-file-file-operations)
- `open:mode:ifFail` — [\<1\>:                 FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `open:mode:ifFail` — [\<2\>:                 FilePath-file operations](#1779-filepath-file-operations)
- `open:mode:ifFail` — [\<3\>:                 VFS.ArchiveMember-file operations](#12095-vfsarchivemember-file-operations)
- `open:mode:ifFail` — [\<4\>:                 VFS.FileWrapper-delegation](#12105-vfsfilewrapper-delegation)
- `open:mode:ifFail` — [\<5\>:                 VFS.StoredZipMember-opening](#12112-vfsstoredzipmember-opening)
- `open:mode:ifFail` — [\<6\>:                 VFS.TmpFileArchiveMember-directory operations](#12121-vfstmpfilearchivemember-directory-operations)
- `openDescriptor:` — [FilePath-file operations](#1779-filepath-file-operations)
- `openDescriptor:ifFail:` — [FilePath-file operations](#1779-filepath-file-operations)
- `openOn:` — [NetClients.URIResolver class-api](#11171-netclientsuriresolver-class-api)
- `openOn:ifFail:` — [NetClients.URIResolver class-api](#11171-netclientsuriresolver-class-api)
- `openStreamOn:` — [NetClients.URIResolver class-api](#11171-netclientsuriresolver-class-api)
- `openStreamOn:ifFail:` — [NetClients.URIResolver class-api](#11171-netclientsuriresolver-class-api)
- `openTemporaryFile:` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `or:` — [Boolean-basic](#1132-boolean-basic)
- `or` — [\<1\>:                               False-basic](#1741-false-basic)
- `or` — [\<2\>:                               True-basic](#12001-true-basic)
- `origin` — [Rectangle-accessing](#11422-rectangle-accessing)
- `origin:` — [Rectangle-accessing](#11422-rectangle-accessing)
- `origin:corner:` — [Rectangle class-instance creation](#11421-rectangle-class-instance-creation)
- `origin:corner` — [\<1\>:                    Rectangle-accessing](#11422-rectangle-accessing)
- `origin:extent:` — [Rectangle class-instance creation](#11421-rectangle-class-instance-creation)
- `origin:extent` — [\<1\>:                    Rectangle-accessing](#11422-rectangle-accessing)
- `originalException` — [SystemExceptions.UnhandledException-accessing](#11911-systemexceptionsunhandledexception-accessing)
- `originalException:` — [SystemExceptions.UnhandledException-accessing](#11911-systemexceptionsunhandledexception-accessing)
- `outer` — [Exception-exception handling](#17210-exception-exception-handling)
- `outerContext` — [BlockClosure-accessing](#1113-blockclosure-accessing)
- `outerContext` — [BlockContext-accessing](#1121-blockcontext-accessing)
- `outerContext:` — [BlockClosure-accessing](#1113-blockclosure-accessing)
- `owner:` — [FilePath-accessing](#1773-filepath-accessing)
- `owner` — [\<1\>:                            SecurityPolicy-modifying](#11491-securitypolicy-modifying)
- `owner:group:` — [File-file operations](#17511-file-file-operations)
- `owner:group` — [\<1\>:                      FilePath-accessing](#1773-filepath-accessing)
- `owner:group` — [\<2\>:                      VFS.FileWrapper-accessing](#12103-vfsfilewrapper-accessing)
- `packageAt:` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `packageAt:ifAbsent:` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `parent` — [FilePath-file name management](#1778-filepath-file-name-management)
- `parentContext` — [ContextPart-accessing](#1413-contextpart-accessing)
- `parentContext:` — [ContextPart-accessing](#1413-contextpart-accessing)
- `parse:` — [Package class-instance creation](#11272-package-class-instance-creation)
- `parse:with:do:` — [Getopt class-instance creation](#1861-getopt-class-instance-creation)
- `parse:with:do:ifError:` — [Getopt class-instance creation](#1861-getopt-class-instance-creation)
- `parseAttributes:` — [Package-still unclassified](#11274-package-still-unclassified)
- `parseInstanceVariableString:` — [Behavior-parsing class declarations](#1916-behavior-parsing-class-declarations)
- `parseNodeAt:` — [Behavior-still unclassified](#1920-behavior-still-unclassified)
- `parserClass` — [Behavior-pluggable behavior (not yet implemented)](#1917-behavior-pluggable-behavior-not-yet-implemented)
- `parserClass` — [CompiledMethod-compiling](#1408-compiledmethod-compiling)
- `parseTreeFor:` — [Behavior-accessing the method dictionary](#193-behavior-accessing-the-method-dictionary)
- `parseVariableString:` — [Behavior-parsing class declarations](#1916-behavior-parsing-class-declarations)
- `parseVersion:` — [Package-version parsing](#11275-package-version-parsing)
- `pass` — [Exception-exception handling](#17210-exception-exception-handling)
- `password` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `password:` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `pastEnd` — [FileDescriptor-polymorphism](#17612-filedescriptor-polymorphism)
- `pastEnd` — [Stream-polymorphism](#115712-stream-polymorphism)
- `path` — [DeferredVariableBinding-basic](#1612-deferredvariablebinding-basic)
- `path` — [FilePath-file name management](#1778-filepath-file-name-management)
- `path` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `path` — [Package-still unclassified](#11274-package-still-unclassified)
- `path` — [VariableBinding-printing](#12062-variablebinding-printing)
- `path:` — [File class-instance creation](#1754-file-class-instance-creation)
- `path` — [\<1\>:                             NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `path` — [\<2\>:                             Package-still unclassified](#11274-package-still-unclassified)
- `path:class:defaultDictionary:` — [DeferredVariableBinding class-basic](#1611-deferredvariablebinding-class-basic)
- `pathFor:` — [FilePath class-file name management](#1771-filepath-class-file-name-management)
- `pathFor:ifNone:` — [FilePath class-file name management](#1771-filepath-class-file-name-management)
- `pathFrom:` — [File-file operations](#17511-file-file-operations)
- `pathFrom` — [\<1\>:                         FilePath-file operations](#1779-filepath-file-operations)
- `pathFrom` — [\<2\>:                         VFS.FileWrapper-file operations](#12107-vfsfilewrapper-file-operations)
- `pathFrom:to:` — [FilePath class-file name management](#1771-filepath-class-file-name-management)
- `pathSeparator` — [Directory class-file name management](#1661-directory-class-file-name-management)
- `pathSeparatorString` — [Directory class-file name management](#1661-directory-class-file-name-management)
- `pathTo:` — [File-accessing](#1757-file-accessing)
- `pathTo` — [\<1\>:                           FilePath-accessing](#1773-filepath-accessing)
- `pathTo` — [\<2\>:                           VFS.FileWrapper-accessing](#12103-vfsfilewrapper-accessing)
- `pause:` — [ProcessorScheduler-idle tasks](#11364-processorscheduler-idle-tasks)
- `peek` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `peek` — [FileStream-basic](#1793-filestream-basic)
- `peek` — [Generator-stream protocol](#1852-generator-stream-protocol)
- `peek` — [PositionableStream-accessing-reading](#11332-positionablestream-accessing-reading)
- `peek` — [SharedQueue-accessing](#11532-sharedqueue-accessing)
- `peek` — [Stream-filtering](#115711-stream-filtering)
- `peekFor:` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `peekFor` — [\<1\>:                          Generator-stream protocol](#1852-generator-stream-protocol)
- `peekFor` — [\<2\>:                          PositionableStream-accessing-reading](#11332-positionablestream-accessing-reading)
- `peekFor` — [\<3\>:                          Stream-filtering](#115711-stream-filtering)
- `pendingWrite` — [FileStream-buffering](#1794-filestream-buffering)
- `perform:` — [Object-built ins](#11232-object-built-ins)
- `perform:with:` — [Object-built ins](#11232-object-built-ins)
- `perform:with:with:` — [Object-built ins](#11232-object-built-ins)
- `perform:with:with:with:` — [Object-built ins](#11232-object-built-ins)
- `perform:with:with:with:with:` — [Object-built ins](#11232-object-built-ins)
- `perform:withArguments:` — [Object-built ins](#11232-object-built-ins)
- `pi` — [Float class-characterization](#1802-float-class-characterization)
- `pi` — [FloatE class-characterization](#1823-floate-class-characterization)
- `pi` — [FloatQ class-characterization](#1832-floatq-class-characterization)
- `poolResolution` — [Behavior-compiling methods](#199-behavior-compiling-methods)
- `poolResolution` — [Metaclass-compiling methods](#11124-metaclass-compiling-methods)
- `popen:dir:` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `popen:dir:ifFail:` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `port` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `port:` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `position` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `position` — [FileStream-basic](#1793-filestream-basic)
- `position` — [PositionableStream-positioning](#11335-positionablestream-positioning)
- `position:` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `position` — [\<1\>:                         FileStream-basic](#1793-filestream-basic)
- `position` — [\<2\>:                         PositionableStream-positioning](#11335-positionablestream-positioning)
- `positive` — [Duration-arithmetics](#1693-duration-arithmetics)
- `positive` — [Float-testing](#18015-float-testing)
- `positive` — [LargeNegativeInteger-numeric testing](#1992-largenegativeinteger-numeric-testing)
- `positive` — [LargePositiveInteger-numeric testing](#11004-largepositiveinteger-numeric-testing)
- `positive` — [Number-testing](#112213-number-testing)
- `positiveDifference:` — [Number-misc math](#11229-number-misc-math)
- `postCopy` — [Delay-copying](#1626-delay-copying)
- `postCopy` — [Exception-copying](#1728-exception-copying)
- `postCopy` — [NetClients.URL-copying](#11185-netclientsurl-copying)
- `postCopy` — [Object-copying](#11237-object-copying)
- `postData` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `postData:` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `postLoad` — [HashedCollection-saving and loading](#1888-hashedcollection-saving-and-loading)
- `postLoad` — [Object-saving and loading](#112315-object-saving-and-loading)
- `postLoad` — [SortedCollection-saving and loading](#11567-sortedcollection-saving-and-loading)
- `postLoad` — [WeakArray-loading](#12154-weakarray-loading)
- `postLoad` — [WeakKeyDictionary class-hacks](#12171-weakkeydictionary-class-hacks)
- `postLoad` — [WeakSet-loading](#12193-weakset-loading)
- `postStore` — [HashedCollection-saving and loading](#1888-hashedcollection-saving-and-loading)
- `postStore` — [Object-saving and loading](#112315-object-saving-and-loading)
- `pragmaHandlerFor:` — [Class-pragmas](#1316-class-pragmas)
- `pragmaHandlerFor` — [\<1\>:                 Metaclass-delegation](#11125-metaclass-delegation)
- `precision` — [FloatD class-characterization](#1812-floatd-class-characterization)
- `precision` — [FloatE class-characterization](#1823-floate-class-characterization)
- `precision` — [FloatQ class-characterization](#1832-floatq-class-characterization)
- `predecessor` — [Float-floating point](#18011-float-floating-point)
- `prefix` — [Directory class-reading system defaults](#1663-directory-class-reading-system-defaults)
- `prerequisites` — [Package-accessing](#11273-package-accessing)
- `prerequisitesFor:` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `preStore` — [Object-saving and loading](#112315-object-saving-and-loading)
- `preStore` — [SortedCollection-saving and loading](#11567-sortedcollection-saving-and-loading)
- `primaryInstance` — [Metaclass-accessing](#11122-metaclass-accessing)
- `primAt:` — [HashedCollection-builtins](#1883-hashedcollection-builtins)
- `primAt:put:` — [HashedCollection-builtins](#1883-hashedcollection-builtins)
- `primCompile:` — [Behavior-built ins](#194-behavior-built-ins)
- `primCompile:ifError:` — [Behavior-built ins](#194-behavior-built-ins)
- `primDefineExternFunc:` — [DLD class-dynamic linking](#1672-dld-class-dynamic-linking)
- `primDivide:` — [LargePositiveInteger-helper byte-level methods](#11003-largepositiveinteger-helper-byte-level-methods)
- `primFileIn` — [Package-accessing](#11273-package-accessing)
- `primHash` — [Float-built ins](#1805-float-built-ins)
- `primitive` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `primitive` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `primitiveAttribute` — [CompiledMethod-attributes](#1405-compiledmethod-attributes)
- `primitiveFailed` — [Object-built ins](#11232-object-built-ins)
- `primNanosecondClock` — [Time class-builtins](#11992-time-class-builtins)
- `primNew:` — [WeakValueLookupTable class-hacks](#12211-weakvaluelookuptable-class-hacks)
- `primNew:name:` — [AbstractNamespace class-instance creation](#111-abstractnamespace-class-instance-creation)
- `primObject` — [AlternativeObjectProxy-accessing](#122-alternativeobjectproxy-accessing)
- `primReplaceFrom:to:with:startingAt:` — [LargeInteger-built-ins](#1984-largeinteger-built-ins)
- `primReplaceFrom:to:with:startingAt` — [\<1\>: OrderedCollection-built ins](#11264-orderedcollection-built-ins)
- `primSecondClock` — [Time class-builtins](#11992-time-class-builtins)
- `primSize` — [HashedCollection-builtins](#1883-hashedcollection-builtins)
- `primTerminate` — [Process-basic](#11342-process-basic)
- `print` — [Object-printing](#112313-object-printing)
- `print:` — [Stream-printing](#115714-stream-printing)
- `print` — [\<1\>:                            TextCollector-printing](#11983-textcollector-printing)
- `printAsAttributeOn:` — [Message-basic](#11103-message-basic)
- `printedFileName` — [FileSegment-printing](#1785-filesegment-printing)
- `printFullHierarchy` — [Behavior-printing hierarchy](#1918-behavior-printing-hierarchy)
- `printHierarchy` — [Behavior-printing hierarchy](#1918-behavior-printing-hierarchy)
- `printNl` — [Object-printing](#112313-object-printing)
- `printOn:` — [AbstractNamespace-printing](#117-abstractnamespace-printing)
- `printOn` — [\<1\>:                          Array-printing](#144-array-printing)
- `printOn` — [\<2\>:                          Association-printing](#164-association-printing)
- `printOn` — [\<3\>:                          Bag-printing](#185-bag-printing)
- `printOn` — [\<4\>:                          BlockContext-printing](#1123-blockcontext-printing)
- `printOn` — [\<5\>:                          CFunctionDescriptor-printing](#1274-cfunctiondescriptor-printing)
- `printOn` — [\<6\>:                          Character-printing](#12810-character-printing)
- `printOn` — [\<7\>:                          Class-printing](#1317-class-printing)
- `printOn` — [\<8\>:                          CObject-accessing](#1365-cobject-accessing)
- `printOn` — [\<9\>:                          Collection-printing](#13711-collection-printing)
- `printOn` — [\<10\>:                         CompiledBlock-printing](#1384-compiledblock-printing)
- `printOn` — [\<11\>:                         CompiledMethod-printing](#14010-compiledmethod-printing)
- `printOn` — [\<12\>:                         Date-printing](#1597-date-printing)
- `printOn` — [\<13\>:                         DateTime-printing](#1606-datetime-printing)
- `printOn` — [\<14\>:                         DeferredVariableBinding-storing](#1613-deferredvariablebinding-storing)
- `printOn` — [\<15\>:                         Dictionary-printing](#1649-dictionary-printing)
- `printOn` — [\<16\>:                         DirectedMessage-basic](#1653-directedmessage-basic)
- `printOn` — [\<17\>:                         Duration-arithmetics](#1693-duration-arithmetics)
- `printOn` — [\<18\>:                         False-printing](#1743-false-printing)
- `printOn` — [\<19\>:                         FileDescriptor-printing](#17614-filedescriptor-printing)
- `printOn` — [\<20\>:                         FilePath-printing](#17710-filepath-printing)
- `printOn` — [\<21\>:                         Float-printing](#18013-float-printing)
- `printOn` — [\<22\>:                         Fraction-printing](#18410-fraction-printing)
- `printOn` — [\<23\>:                         Integer-printing](#1929-integer-printing)
- `printOn` — [\<24\>:                         Interval-printing](#1933-interval-printing)
- `printOn` — [\<25\>:                         LookupKey-printing](#11053-lookupkey-printing)
- `printOn` — [\<26\>:                         Message-printing](#11104-message-printing)
- `printOn` — [\<27\>:                         Metaclass-printing](#11127-metaclass-printing)
- `printOn` — [\<28\>:                         MethodContext-printing](#11133-methodcontext-printing)
- `printOn` — [\<29\>:                         NetClients.URL-printing](#11187-netclientsurl-printing)
- `printOn` — [\<30\>:                         Object-printing](#112313-object-printing)
- `printOn` — [\<31\>:                         Point-printing](#11327-point-printing)
- `printOn` — [\<32\>:                         Process-printing](#11345-process-printing)
- `printOn` — [\<33\>:                         ProcessorScheduler-printing](#11365-processorscheduler-printing)
- `printOn` — [\<34\>:                         Promise-printing](#11384-promise-printing)
- `printOn` — [\<35\>:                         Rectangle-printing](#11424-rectangle-printing)
- `printOn` — [\<36\>:                         RecursionLock-printing](#11434-recursionlock-printing)
- `printOn` — [\<37\>:                         Regex-printing](#11444-regex-printing)
- `printOn` — [\<38\>:                         ScaledDecimal-printing](#11486-scaleddecimal-printing)
- `printOn` — [\<39\>:                         Semaphore-printing](#11505-semaphore-printing)
- `printOn` — [\<40\>:                         String-printing](#11589-string-printing)
- `printOn` — [\<41\>:                         Symbol-storing](#11599-symbol-storing)
- `printOn` — [\<42\>:                         SymLink-printing](#11604-symlink-printing)
- `printOn` — [\<43\>:                         TextCollector-printing](#11983-textcollector-printing)
- `printOn` — [\<44\>:                         Time-arithmetic](#11998-time-arithmetic)
- `printOn` — [\<45\>:                         True-printing](#12003-true-printing)
- `printOn` — [\<46\>:                         UndefinedObject-printing](#12017-undefinedobject-printing)
- `printOn` — [\<47\>:                         UnicodeString-converting](#12035-unicodestring-converting)
- `printOn` — [\<48\>:                         ValueAdaptor-printing](#12043-valueadaptor-printing)
- `printOn` — [\<49\>:                         VariableBinding-printing](#12062-variablebinding-printing)
- `printOn:base:` — [Integer-printing](#1929-integer-printing)
- `printOn:in:` — [Behavior-support for lightweight classes](#1921-behavior-support-for-lightweight-classes)
- `printOn:in` — [\<1\>:                       BindingDictionary-printing](#1105-bindingdictionary-printing)
- `printOn:in` — [\<2\>:                       ClassDescription-printing](#1327-classdescription-printing)
- `printOn:in` — [\<3\>:                       Metaclass-printing](#11127-metaclass-printing)
- `printOn:in` — [\<4\>:                       Namespace-printing](#11167-namespace-printing)
- `printOn:in` — [\<5\>:                       RootNamespace-printing](#11464-rootnamespace-printing)
- `printOn:in` — [\<6\>:                       SystemDictionary-printing](#11617-systemdictionary-printing)
- `printOn:in` — [\<7\>:                       UndefinedObject-printing](#12017-undefinedobject-printing)
- `printOn:paddedWith:to:` — [Integer-printing](#1929-integer-printing)
- `printOn:paddedWith:to:base:` — [Integer-printing](#1929-integer-printing)
- `printPaddedWith:to:` — [Integer-printing](#1929-integer-printing)
- `printPaddedWith:to:base:` — [Integer-printing](#1929-integer-printing)
- `printString` — [Integer-printing](#1929-integer-printing)
- `printString` — [Object-printing](#112313-object-printing)
- `printString:` — [Integer-printing](#1929-integer-printing)
- `printStringRadix:` — [Integer-printing](#1929-integer-printing)
- `priority` — [Process-accessing](#11341-process-accessing)
- `priority:` — [Process-accessing](#11341-process-accessing)
- `priorityName:` — [ProcessorScheduler-priorities](#11366-processorscheduler-priorities)
- `privateMethods` — [Behavior-compilation (alternative)](#197-behavior-compilation-alternative)
- `processEnvironment` — [ProcessorScheduler-basic](#11362-processorscheduler-basic)
- `processesAt:` — [ProcessorScheduler-basic](#11362-processorscheduler-basic)
- `proxyClassFor:` — [ObjectDumper class-establishing proxy classes](#11241-objectdumper-class-establishing-proxy-classes)
- `proxyFor:` — [ObjectDumper class-establishing proxy classes](#11241-objectdumper-class-establishing-proxy-classes)
- `ptrType` — [CType-accessing](#1523-ctype-accessing)
- `publicMethods` — [Behavior-compilation (alternative)](#197-behavior-compilation-alternative)
- `push:` — [ContextPart-accessing](#1413-contextpart-accessing)
- `putenv:` — [SystemDictionary-c call-outs](#11614-systemdictionary-c-call-outs)
- `query` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `query:` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `queueInterrupt:` — [Process-accessing](#11341-process-accessing)
- `quit` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `quit:` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `quo:` — [LargeInteger-arithmetic](#1982-largeinteger-arithmetic)
- `quo` — [\<1\>:                              LargeZeroInteger-arithmetic](#11022-largezerointeger-arithmetic)
- `quo` — [\<2\>:                              Number-arithmetic](#11223-number-arithmetic)
- `quo` — [\<3\>:                              SmallInteger-built ins](#11554-smallinteger-built-ins)
- `radiansToDegrees` — [Number-converting](#11226-number-converting)
- `radix` — [Float class-characterization](#1802-float-class-characterization)
- `radix:` — [Integer-printing](#1929-integer-printing)
- `raisedTo:` — [Float-built ins](#1805-float-built-ins)
- `raisedTo` — [\<1\>:                         Number-misc math](#11229-number-misc-math)
- `raisedToInteger:` — [Float-arithmetic](#1803-float-arithmetic)
- `raisedToInteger` — [\<1\>:                  Fraction-optimized cases](#1849-fraction-optimized-cases)
- `raisedToInteger` — [\<2\>:                  LargeInteger-accessing](#1981-largeinteger-accessing)
- `raisedToInteger` — [\<3\>:                  Number-misc math](#11229-number-misc-math)
- `raisePriority` — [Process-basic](#11342-process-basic)
- `rawProfile:` — [SystemDictionary-profiling](#11618-systemdictionary-profiling)
- `read` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `readFrom:` — [Date class-instance creation (Blue Book)](#1593-date-class-instance-creation-blue-book)
- `readFrom` — [\<1\>:                         DateTime class-instance creation](#1602-datetime-class-instance-creation)
- `readFrom` — [\<2\>:                         Duration class-instance creation](#1691-duration-class-instance-creation)
- `readFrom` — [\<3\>:                         Number class-converting](#11221-number-class-converting)
- `readFrom` — [\<4\>:                         Time class-instance creation](#11995-time-class-instance-creation)
- `readFrom:radix:` — [Number class-converting](#11221-number-class-converting)
- `reads:` — [CompiledCode-testing accesses](#13911-compiledcode-testing-accesses)
- `reads` — [\<1\>:                            CompiledMethod-testing](#14013-compiledmethod-testing)
- `readStream` — [Collection-enumeration](#1379-collection-enumeration)
- `readStream` — [FileDescriptor-initialize-release](#1769-filedescriptor-initialize-release)
- `readStream` — [FilePath-file operations](#1779-filepath-file-operations)
- `readStream` — [Iterable-streaming](#1944-iterable-streaming)
- `readStream` — [NetClients.URL-still unclassified](#11188-netclientsurl-still-unclassified)
- `readStream` — [PositionableStream-accessing-reading](#11332-positionablestream-accessing-reading)
- `readStream` — [SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `readStream` — [Stream-testing](#115718-stream-testing)
- `readStream` — [WriteStream-accessing-writing](#12232-writestream-accessing-writing)
- `readWrite` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `readWriteStream` — [SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `rebuildTable` — [Symbol class-symbol table](#11593-symbol-class-symbol-table)
- `receiver` — [BlockClosure-accessing](#1113-blockclosure-accessing)
- `receiver` — [ContextPart-accessing](#1413-contextpart-accessing)
- `receiver` — [DirectedMessage-accessing](#1652-directedmessage-accessing)
- `receiver` — [MessageNotUnderstood-accessing](#11111-messagenotunderstood-accessing)
- `receiver:` — [BlockClosure-accessing](#1113-blockclosure-accessing)
- `receiver` — [\<1\>:                         DirectedMessage-accessing](#1652-directedmessage-accessing)
- `receiver:selector:` — [DirectedMessage class-creating instances](#1651-directedmessage-class-creating-instances)
- `receiver:selector:argument:` — [DirectedMessage class-creating instances](#1651-directedmessage-class-creating-instances)
- `receiver:selector:arguments:` — [DirectedMessage class-creating instances](#1651-directedmessage-class-creating-instances)
- `reciprocal` — [Fraction-optimized cases](#1849-fraction-optimized-cases)
- `reciprocal` — [Number-arithmetic](#11223-number-arithmetic)
- `reclaimedBytesPerGlobalGC` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `reclaimedBytesPerScavenge` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `reclaimedPercentPerScavenge` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `recompile` — [CompiledMethod-compiling](#1408-compiledmethod-compiling)
- `recompile:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `recompile:notifying:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `recompileNotifying:` — [CompiledMethod-compiling](#1408-compiledmethod-compiling)
- `reconstructOriginalObject` — [DirectedMessage-saving and loading](#1655-directedmessage-saving-and-loading)
- `reconstructOriginalObject` — [Object-saving and loading](#112315-object-saving-and-loading)
- `record:` — [FileStream class-file-in](#1791-filestream-class-file-in)
- `refersTo:` — [CompiledCode-testing accesses](#13911-compiledcode-testing-accesses)
- `refresh` — [File-accessing](#1757-file-accessing)
- `refresh` — [FilePath-accessing](#1773-filepath-accessing)
- `refresh` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `refresh` — [VFS.ArchiveFile-ArchiveMember protocol](#12081-vfsarchivefile-archivemember-protocol)
- `refresh` — [VFS.ArchiveMember-accessing](#12091-vfsarchivemember-accessing)
- `registerHandler:forPragma:` — [Class-pragmas](#1316-class-pragmas)
- `registerProxyClass:for:` — [ObjectDumper class-establishing proxy classes](#11241-objectdumper-class-establishing-proxy-classes)
- `rehash` — [Dictionary-rehashing](#16410-dictionary-rehashing)
- `rehash` — [HashedCollection-rehashing](#1886-hashedcollection-rehashing)
- `rehash` — [LookupTable-rehashing](#11065-lookuptable-rehashing)
- `rehash` — [MethodDictionary-rehashing](#11142-methoddictionary-rehashing)
- `rehash` — [WeakValueLookupTable-rehashing](#12213-weakvaluelookuptable-rehashing)
- `reinvokeFor:` — [Message-printing](#11104-message-printing)
- `reject:` — [ArrayedCollection-enumerating the elements of a collection](#156-arrayedcollection-enumerating-the-elements-of-a-collection)
- `reject` — [\<1\>:                           Collection-enumeration](#1379-collection-enumeration)
- `reject` — [\<2\>:                           Dictionary-dictionary enumerating](#1645-dictionary-dictionary-enumerating)
- `reject` — [\<3\>:                           FilePath-enumerating](#1777-filepath-enumerating)
- `reject` — [\<4\>:                           Iterable-enumeration](#1942-iterable-enumeration)
- `reject` — [\<5\>:                           MappedCollection-basic](#11082-mappedcollection-basic)
- `reject` — [\<6\>:                           Stream-filtering](#115711-stream-filtering)
- `relativeDirectory` — [Package-accessing](#11273-package-accessing)
- `relativeDirectory:` — [Package-accessing](#11273-package-accessing)
- `release` — [Object-dependents access](#11239-object-dependents-access)
- `release` — [UndefinedObject-dependents access](#12015-undefinedobject-dependents-access)
- `release` — [VFS.ArchiveFile-directory operations](#12082-vfsarchivefile-directory-operations)
- `release` — [VFS.TmpFileArchiveMember-finalization](#12122-vfstmpfilearchivemember-finalization)
- `relocate` — [FileSegment class-installing](#1782-filesegment-class-installing)
- `relocateFrom:map:` — [FileSegment-basic](#1783-filesegment-basic)
- `rem:` — [LargeInteger-arithmetic](#1982-largeinteger-arithmetic)
- `rem` — [\<1\>:                              LargeZeroInteger-arithmetic](#11022-largezerointeger-arithmetic)
- `rem` — [\<2\>:                              Number-arithmetic](#11223-number-arithmetic)
- `remainingCount` — [SystemExceptions.NotEnoughElements-accessing](#11782-systemexceptionsnotenoughelements-accessing)
- `remainingCount:` — [SystemExceptions.NotEnoughElements-accessing](#11782-systemexceptionsnotenoughelements-accessing)
- `remove` — [File-file operations](#17511-file-file-operations)
- `remove` — [FilePath-file operations](#1779-filepath-file-operations)
- `remove` — [VFS.ArchiveMember-file operations](#12095-vfsarchivemember-file-operations)
- `remove` — [VFS.FileWrapper-delegation](#12105-vfsfilewrapper-delegation)
- `remove:` — [Collection-removing](#13712-collection-removing)
- `remove` — [\<1\>:                           Dictionary-dictionary removing](#1646-dictionary-dictionary-removing)
- `remove` — [\<2\>:                           File class-file operations](#1752-file-class-file-operations)
- `remove` — [\<3\>:                           LookupTable-removing](#11066-lookuptable-removing)
- `remove` — [\<4\>:                           MethodDictionary-removing](#11143-methoddictionary-removing)
- `remove` — [\<5\>:                           ProcessEnvironment-dictionary removing](#11354-processenvironment-dictionary-removing)
- `remove:ifAbsent:` — [Bag-removing](#186-bag-removing)
- `remove:ifAbsent` — [\<1\>:                  Collection-removing](#13712-collection-removing)
- `remove:ifAbsent` — [\<2\>:                  Dictionary-dictionary removing](#1646-dictionary-dictionary-removing)
- `remove:ifAbsent` — [\<3\>:                  HashedCollection-removing](#1887-hashedcollection-removing)
- `remove:ifAbsent` — [\<4\>:                  LinkedList-adding](#11042-linkedlist-adding)
- `remove:ifAbsent` — [\<5\>:                  LookupTable-removing](#11066-lookuptable-removing)
- `remove:ifAbsent` — [\<6\>:                  OrderedCollection-removing](#11266-orderedcollection-removing)
- `remove:ifAbsent` — [\<7\>:                  ProcessEnvironment-dictionary removing](#11354-processenvironment-dictionary-removing)
- `removeAll:` — [Collection-removing](#13712-collection-removing)
- `removeAll:ifAbsent:` — [Collection-removing](#13712-collection-removing)
- `removeAllKeys:` — [Dictionary-dictionary removing](#1646-dictionary-dictionary-removing)
- `removeAllKeys` — [\<1\>:                    ProcessEnvironment-dictionary removing](#11354-processenvironment-dictionary-removing)
- `removeAllKeys:ifAbsent:` — [Dictionary-dictionary removing](#1646-dictionary-dictionary-removing)
- `removeAllKeys:ifAbsent` — [\<1\>:           ProcessEnvironment-dictionary removing](#11354-processenvironment-dictionary-removing)
- `removeAllKeysSuchThat:` — [Dictionary-removing](#16411-dictionary-removing)
- `removeAllSuchThat:` — [Collection-removing](#13712-collection-removing)
- `removeAtIndex:` — [OrderedCollection-removing](#11266-orderedcollection-removing)
- `removeAtIndex` — [\<1\>:                    RunArray-removing](#11477-runarray-removing)
- `removeCategory:` — [ClassDescription-organization of messages and classes](#1325-classdescription-organization-of-messages-and-classes)
- `removeClassVarName:` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `removeClassVarName` — [\<1\>:               Metaclass-delegation](#11125-metaclass-delegation)
- `removeDependent:` — [Object-dependents access](#11239-object-dependents-access)
- `removeFeature:` — [SystemDictionary-special accessing](#11619-systemdictionary-special-accessing)
- `removeFirst` — [LinkedList-adding](#11042-linkedlist-adding)
- `removeFirst` — [OrderedCollection-removing](#11266-orderedcollection-removing)
- `removeFirst` — [RunArray-removing](#11477-runarray-removing)
- `removeInstVarName:` — [Behavior-instance variables](#1914-behavior-instance-variables)
- `removeKey:` — [Dictionary-dictionary removing](#1646-dictionary-dictionary-removing)
- `removeKey` — [\<1\>:                        ProcessEnvironment-dictionary removing](#11354-processenvironment-dictionary-removing)
- `removeKey:ifAbsent:` — [Dictionary-dictionary removing](#1646-dictionary-dictionary-removing)
- `removeKey:ifAbsent` — [\<1\>:               LookupTable-removing](#11066-lookuptable-removing)
- `removeKey:ifAbsent` — [\<2\>:               MethodDictionary-removing](#11143-methoddictionary-removing)
- `removeKey:ifAbsent` — [\<3\>:               ProcessEnvironment-dictionary removing](#11354-processenvironment-dictionary-removing)
- `removeLast` — [LinkedList-adding](#11042-linkedlist-adding)
- `removeLast` — [OrderedCollection-removing](#11266-orderedcollection-removing)
- `removeLast` — [RunArray-removing](#11477-runarray-removing)
- `removeLast` — [SortedCollection-basic](#11563-sortedcollection-basic)
- `removeMember:` — [VFS.ArchiveFile-ArchiveMember protocol](#12081-vfsarchivefile-archivemember-protocol)
- `removeMember` — [\<1\>:                     VFS.ZipFile-members](#12131-vfszipfile-members)
- `removePermission:` — [SecurityPolicy-modifying](#11491-securitypolicy-modifying)
- `removeSelector:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `removeSelector:ifAbsent:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `removeSharedPool:` — [AbstractNamespace-compiling](#113-abstractnamespace-compiling)
- `removeSharedPool` — [\<1\>:                 Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `removeSharedPool` — [\<2\>:                 Metaclass-delegation](#11125-metaclass-delegation)
- `removeSubclass:` — [Behavior-creating a class hierarchy](#1910-behavior-creating-a-class-hierarchy)
- `removeSubclass` — [\<1\>:                   UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `removeSubspace:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `removeToBeFinalized` — [FileDescriptor-initialize-release](#1769-filedescriptor-initialize-release)
- `removeToBeFinalized` — [Object-finalization](#112311-object-finalization)
- `rename:to:` — [File class-file operations](#1752-file-class-file-operations)
- `renameTo:` — [File-file operations](#17511-file-file-operations)
- `renameTo` — [\<1\>:                         FilePath-file operations](#1779-filepath-file-operations)
- `renameTo` — [\<2\>:                         VFS.ArchiveMember-file operations](#12095-vfsarchivemember-file-operations)
- `renameTo` — [\<3\>:                         VFS.FileWrapper-file operations](#12107-vfsfilewrapper-file-operations)
- `repeat` — [BlockClosure-control structures](#1115-blockclosure-control-structures)
- `replace:withStringBase:` — [LargePositiveInteger-converting](#11002-largepositiveinteger-converting)
- `replace:withStringBase` — [\<1\>:           LargeZeroInteger-printing](#11024-largezerointeger-printing)
- `replaceAll:with:` — [SequenceableCollection-replacing items](#11518-sequenceablecollection-replacing-items)
- `replaceFrom:to:with:` — [SequenceableCollection-replacing items](#11518-sequenceablecollection-replacing-items)
- `replaceFrom:to:with:startingAt:` — [Array-built ins](#142-array-built-ins)
- `replaceFrom:to:with:startingAt` — [\<1\>:   ByteArray-built ins](#1143-bytearray-built-ins)
- `replaceFrom:to:with:startingAt` — [\<2\>:   SequenceableCollection-replacing items](#11518-sequenceablecollection-replacing-items)
- `replaceFrom:to:with:startingAt` — [\<3\>:   String-built ins](#11585-string-built-ins)
- `replaceFrom:to:withByteArray:startingAt:` — [String-built ins](#11585-string-built-ins)
- `replaceFrom:to:withObject:` — [SequenceableCollection-replacing items](#11518-sequenceablecollection-replacing-items)
- `replaceFrom:to:withString:startingAt:` — [ByteArray-built ins](#1143-bytearray-built-ins)
- `replacingAllRegex:with:` — [String-regex](#115810-string-regex)
- `replacingRegex:with:` — [String-regex](#115810-string-regex)
- `requestString` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `require:` — [FileStream class-file-in](#1791-filestream-class-file-in)
- `reset` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `reset` — [PositionableStream-positioning](#11335-positionablestream-positioning)
- `resignalAs:` — [Exception-exception handling](#17210-exception-exception-handling)
- `resignalAsUnhandled:` — [Exception-built ins](#1726-exception-built-ins)
- `respondsTo:` — [Object-testing functionality](#112318-object-testing-functionality)
- `resume` — [Exception-exception handling](#17210-exception-exception-handling)
- `resume` — [Process-builtins](#11343-process-builtins)
- `resume:` — [Exception-exception handling](#17210-exception-exception-handling)
- `resumptionTime` — [Delay-accessing](#1624-delay-accessing)
- `retry` — [Exception-exception handling](#17210-exception-exception-handling)
- `retry:coercing:` — [Number-retrying](#112211-number-retrying)
- `retryDifferenceCoercing:` — [Number-retrying](#112211-number-retrying)
- `retryDivisionCoercing:` — [Number-retrying](#112211-number-retrying)
- `retryEqualityCoercing:` — [Number-retrying](#112211-number-retrying)
- `retryError` — [Number-retrying](#112211-number-retrying)
- `retryInequalityCoercing:` — [Number-retrying](#112211-number-retrying)
- `retryMultiplicationCoercing:` — [Number-retrying](#112211-number-retrying)
- `retryRelationalOp:coercing:` — [Number-retrying](#112211-number-retrying)
- `retrySumCoercing:` — [Number-retrying](#112211-number-retrying)
- `retryUsing:` — [Exception-exception handling](#17210-exception-exception-handling)
- `return` — [Exception-exception handling](#17210-exception-exception-handling)
- `return:` — [Exception-exception handling](#17210-exception-exception-handling)
- `returnType` — [CCallable-accessing](#1212-ccallable-accessing)
- `reverse` — [ArrayedCollection-copying Collections](#155-arrayedcollection-copying-collections)
- `reverse` — [Interval-basic](#1932-interval-basic)
- `reverse` — [SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `reverseContents` — [FileDescriptor-overriding inherited methods](#17611-filedescriptor-overriding-inherited-methods)
- `reverseContents` — [PositionableStream-accessing-reading](#11332-positionablestream-accessing-reading)
- `reverseContents` — [WriteStream-accessing-writing](#12232-writestream-accessing-writing)
- `reverseDo:` — [SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `rewriteAsAsyncCCall:args:` — [CompiledMethod-c call-outs](#1407-compiledmethod-c-call-outs)
- `rewriteAsCCall:for:` — [CompiledMethod-c call-outs](#1407-compiledmethod-c-call-outs)
- `rewriteAsCCall:returning:args:` — [CompiledMethod-c call-outs](#1407-compiledmethod-c-call-outs)
- `right` — [Rectangle-accessing](#11422-rectangle-accessing)
- `right:` — [Rectangle-accessing](#11422-rectangle-accessing)
- `rightCenter` — [Rectangle-accessing](#11422-rectangle-accessing)
- `rounded` — [Float-truncation and round off](#18018-float-truncation-and-round-off)
- `rounded` — [Integer-converting](#1925-integer-converting)
- `rounded` — [Number-truncation and round off](#112214-number-truncation-and-round-off)
- `rounded` — [Point-truncation and round off](#11329-point-truncation-and-round-off)
- `rounded` — [Rectangle-truncation and round off](#11428-rectangle-truncation-and-round-off)
- `roundTo:` — [Number-truncation and round off](#112214-number-truncation-and-round-off)
- `runDelayProcess` — [Delay class-timer process](#1623-delay-class-timer-process)
- `sameAs:` — [CharacterArray-comparing](#1295-characterarray-comparing)
- `scaleBy:` — [Rectangle-transforming](#11427-rectangle-transforming)
- `scanBacktraceFor:do:` — [ContextPart-enumerating](#1417-contextpart-enumerating)
- `scanBacktraceForAttribute:do:` — [ContextPart-enumerating](#1417-contextpart-enumerating)
- `scavenge` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `scavengesBeforeTenuring` — [ObjectMemory-derived information](#11257-objectmemory-derived-information)
- `scheduleDelay:` — [Delay class-timer process](#1623-delay-class-timer-process)
- `scheme` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `scheme:` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `scheme:host:path:` — [NetClients.URL class-instance creation](#11182-netclientsurl-class-instance-creation)
- `scheme:host:port:path:` — [NetClients.URL class-instance creation](#11182-netclientsurl-class-instance-creation)
- `scheme:path:` — [NetClients.URL class-instance creation](#11182-netclientsurl-class-instance-creation)
- `scheme:username:password:host:port:path:` — [NetClients.URL class-instance creation](#11182-netclientsurl-class-instance-creation)
- `scopeDictionary` — [Behavior-compilation](#196-behavior-compilation)
- `scopeDictionary` — [Dictionary-compilation](#1644-dictionary-compilation)
- `scopeHas:ifTrue:` — [Behavior-testing the method dictionary](#1925-behavior-testing-the-method-dictionary)
- `scramble` — [SmallInteger-builtins](#11555-smallinteger-builtins)
- `searchRegex:` — [String-regex](#115810-string-regex)
- `searchRegex:from:to:` — [String-regex](#115810-string-regex)
- `searchRegex:startingAt:` — [String-regex](#115810-string-regex)
- `second` — [DateTime-computations](#1605-datetime-computations)
- `second` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `second` — [Time-accessing (ANSI for DateAndTimes)](#11996-time-accessing-ansi-for-dateandtimes)
- `second:` — [Time class-instance creation](#11995-time-class-instance-creation)
- `secondClock` — [Time class-clocks](#11993-time-class-clocks)
- `seconds` — [Time-accessing (non ANSI & for Durations)](#11997-time-accessing-non-ansi--for-durations)
- `seconds:` — [Time class-instance creation](#11995-time-class-instance-creation)
- `securityCheckForName:` — [ContextPart-security checks](#1419-contextpart-security-checks)
- `securityCheckForName:action:` — [ContextPart-security checks](#1419-contextpart-security-checks)
- `securityCheckForName:actions:target:` — [ContextPart-security checks](#1419-contextpart-security-checks)
- `securityCheckForName:target:` — [ContextPart-security checks](#1419-contextpart-security-checks)
- `securityPolicy` — [Behavior-support for lightweight classes](#1921-behavior-support-for-lightweight-classes)
- `securityPolicy` — [Class-security](#1319-class-security)
- `securityPolicy:` — [Behavior-support for lightweight classes](#1921-behavior-support-for-lightweight-classes)
- `securityPolicy` — [\<1\>:                   Class-security](#1319-class-security)
- `seed:` — [Random class-instance creation](#11391-random-class-instance-creation)
- `segmentFrom:to:` — [FileStream-compiling](#1795-filestream-compiling)
- `segmentFrom:to` — [\<1\>:                   PositionableStream-compiling](#11334-positionablestream-compiling)
- `segmentFrom:to` — [\<2\>:                   Stream-compiling](#11577-stream-compiling)
- `select:` — [ArrayedCollection-enumerating the elements of a collection](#156-arrayedcollection-enumerating-the-elements-of-a-collection)
- `select` — [\<1\>:                           Collection-enumeration](#1379-collection-enumeration)
- `select` — [\<2\>:                           Dictionary-dictionary enumerating](#1645-dictionary-dictionary-enumerating)
- `select` — [\<3\>:                           FilePath-enumerating](#1777-filepath-enumerating)
- `select` — [\<4\>:                           Iterable-enumeration](#1942-iterable-enumeration)
- `select` — [\<5\>:                           MappedCollection-basic](#11082-mappedcollection-basic)
- `select` — [\<6\>:                           Stream-filtering](#115711-stream-filtering)
- `selector` — [CompiledBlock-accessing](#1382-compiledblock-accessing)
- `selector` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `selector` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `selector` — [ContextPart-accessing](#1413-contextpart-accessing)
- `selector` — [Message-accessing](#11102-message-accessing)
- `selector` — [MethodInfo-accessing](#11151-methodinfo-accessing)
- `selector` — [SystemExceptions.WrongMessageSent-accessing](#11972-systemexceptionswrongmessagesent-accessing)
- `selector:` — [CompiledBlock-accessing](#1382-compiledblock-accessing)
- `selector` — [\<1\>:                         CompiledCode-accessing](#1394-compiledcode-accessing)
- `selector` — [\<2\>:                         CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `selector` — [\<3\>:                         Message-accessing](#11102-message-accessing)
- `selector` — [\<4\>:                         MethodInfo-accessing](#11151-methodinfo-accessing)
- `selector` — [\<5\>:                         SystemExceptions.WrongMessageSent-accessing](#11972-systemexceptionswrongmessagesent-accessing)
- `selector:argument:` — [Message class-creating instances](#11101-message-class-creating-instances)
- `selector:arguments:` — [DirectedMessage class-creating instances](#1651-directedmessage-class-creating-instances)
- `selector:arguments` — [\<1\>:               Message class-creating instances](#11101-message-class-creating-instances)
- `selector:arguments:receiver:` — [DirectedMessage class-creating instances](#1651-directedmessage-class-creating-instances)
- `selectorAt:` — [Behavior-accessing the method dictionary](#193-behavior-accessing-the-method-dictionary)
- `selectors` — [Behavior-accessing the method dictionary](#193-behavior-accessing-the-method-dictionary)
- `selectorsAndMethodsDo:` — [Behavior-method dictionary](#1915-behavior-method-dictionary)
- `selectSubclasses:` — [Behavior-enumerating](#1911-behavior-enumerating)
- `selectSubspaces:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `selectSuperclasses:` — [Behavior-enumerating](#1911-behavior-enumerating)
- `selectSuperspaces:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `semaphore` — [SystemExceptions.ProcessBeingTerminated-accessing](#11852-systemexceptionsprocessbeingterminated-accessing)
- `semaphore:` — [SystemExceptions.ProcessBeingTerminated-accessing](#11852-systemexceptionsprocessbeingterminated-accessing)
- `send` — [DirectedMessage-basic](#1653-directedmessage-basic)
- `sender` — [MethodContext-accessing](#11131-methodcontext-accessing)
- `sendsToSuper` — [CompiledCode-testing accesses](#13911-compiledcode-testing-accesses)
- `sendsToSuper` — [CompiledMethod-testing](#14013-compiledmethod-testing)
- `sendTo:` — [Message-printing](#11104-message-printing)
- `set:to:` — [AbstractNamespace-overrides for superspaces](#116-abstractnamespace-overrides-for-superspaces)
- `set:to:ifAbsent:` — [AbstractNamespace-overrides for superspaces](#116-abstractnamespace-overrides-for-superspaces)
- `set:to:ifAbsent` — [\<1\>:                  Namespace-overrides for superspaces](#11166-namespace-overrides-for-superspaces)
- `set:to:ifAbsent` — [\<2\>:                  RootNamespace-overrides for superspaces](#11463-rootnamespace-overrides-for-superspaces)
- `setBit:` — [Integer-bit operators](#1924-integer-bit-operators)
- `setToEnd` — [FileDescriptor-overriding inherited methods](#17611-filedescriptor-overriding-inherited-methods)
- `setToEnd` — [PositionableStream-positioning](#11335-positionablestream-positioning)
- `setTraceFlag:to:` — [SystemDictionary-builtins](#11613-systemdictionary-builtins)
- `shallowCopy` — [BindingDictionary-copying](#1103-bindingdictionary-copying)
- `shallowCopy` — [Boolean-overriding](#1134-boolean-overriding)
- `shallowCopy` — [HashedCollection-copying](#1884-hashedcollection-copying)
- `shallowCopy` — [Number-copying](#11227-number-copying)
- `shallowCopy` — [Object-built ins](#11232-object-built-ins)
- `shallowCopy` — [RunArray-copying](#11475-runarray-copying)
- `shallowCopy` — [Symbol-basic](#11595-symbol-basic)
- `shallowCopy` — [UndefinedObject-basic](#12011-undefinedobject-basic)
- `shallowCopy` — [WeakArray-conversion](#12153-weakarray-conversion)
- `shallowCopy` — [WeakSet-copying](#12192-weakset-copying)
- `shape` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `shape:` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `sharedPoolDictionaries` — [AbstractNamespace-compiling](#113-abstractnamespace-compiling)
- `sharedPools` — [Behavior-accessing instances and variables](#192-behavior-accessing-instances-and-variables)
- `sharedPools` — [Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `sharedPools` — [Metaclass-delegation](#11125-metaclass-delegation)
- `sharedVariableString` — [ClassDescription-printing](#1327-classdescription-printing)
- `shortAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `shortAt` — [\<1\>:                          Memory class-accessing](#11091-memory-class-accessing)
- `shortAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `shortAt:put` — [\<1\>:                      Memory class-accessing](#11091-memory-class-accessing)
- `shortMonthName` — [Date-compatibility (non-ANSI)](#1595-date-compatibility-non-ansi)
- `shortNameOfMonth:` — [Date class-basic](#1591-date-class-basic)
- `shouldNotImplement` — [Object-built ins](#11232-object-built-ins)
- `show:` — [TextCollector-accessing](#11982-textcollector-accessing)
- `showCr:` — [TextCollector-accessing](#11982-textcollector-accessing)
- `showOnNewLine:` — [TextCollector-accessing](#11982-textcollector-accessing)
- `shutdown` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `siblings` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `siblings` — [Namespace-namespace hierarchy](#11165-namespace-namespace-hierarchy)
- `siblings` — [RootNamespace-namespace hierarchy](#11462-rootnamespace-namespace-hierarchy)
- `siblingsDo:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `siblingsDo` — [\<1\>:                       Namespace-namespace hierarchy](#11165-namespace-namespace-hierarchy)
- `siblingsDo` — [\<2\>:                       RootNamespace-namespace hierarchy](#11462-rootnamespace-namespace-hierarchy)
- `sign` — [Float-testing](#18015-float-testing)
- `sign` — [LargeNegativeInteger-numeric testing](#1992-largenegativeinteger-numeric-testing)
- `sign` — [LargePositiveInteger-numeric testing](#11004-largepositiveinteger-numeric-testing)
- `sign` — [LargeZeroInteger-numeric testing](#11023-largezerointeger-numeric-testing)
- `sign` — [Number-testing](#112213-number-testing)
- `signal` — [Exception class-instance creation](#1723-exception-class-instance-creation)
- `signal` — [Exception-exception signaling](#17211-exception-exception-signaling)
- `signal` — [Semaphore-builtins](#11503-semaphore-builtins)
- `signal:` — [Exception class-instance creation](#1723-exception-class-instance-creation)
- `signal` — [\<1\>:                           Exception-exception signaling](#17211-exception-exception-signaling)
- `signal` — [\<2\>:                           SystemExceptions.PackageNotAvailable class-still unclassified](#11831-systemexceptionspackagenotavailable-class-still-unclassified)
- `signal` — [\<3\>:                           SystemExceptions.SecurityError class-accessing](#11881-systemexceptionssecurityerror-class-accessing)
- `signal:atNanosecondClockValue:` — [ProcessorScheduler-timed invocation](#11368-processorscheduler-timed-invocation)
- `signal:onInterrupt:` — [ProcessorScheduler-timed invocation](#11368-processorscheduler-timed-invocation)
- `signal:reason:` — [SystemExceptions.PackageNotAvailable class-still unclassified](#11831-systemexceptionspackagenotavailable-class-still-unclassified)
- `signalingContext` — [Exception-still unclassified](#17212-exception-still-unclassified)
- `signalOn:` — [SystemExceptions.EndOfStream class-signaling](#11671-systemexceptionsendofstream-class-signaling)
- `signalOn` — [\<1\>:                         SystemExceptions.InvalidValue class-signaling](#11741-systemexceptionsinvalidvalue-class-signaling)
- `signalOn` — [\<2\>:                         SystemExceptions.MustBeBoolean class-signaling](#11751-systemexceptionsmustbeboolean-class-signaling)
- `signalOn` — [\<3\>:                         SystemExceptions.NotEnoughElements class-signaling](#11781-systemexceptionsnotenoughelements-class-signaling)
- `signalOn:mustBe:` — [SystemExceptions.WrongClass class-signaling](#11961-systemexceptionswrongclass-class-signaling)
- `signalOn:mustBeBetween:and:` — [SystemExceptions.ArgumentOutOfRange class-signaling](#11631-systemexceptionsargumentoutofrange-class-signaling)
- `signalOn:reason:` — [SystemExceptions.InvalidValue class-signaling](#11741-systemexceptionsinvalidvalue-class-signaling)
- `signalOn:reason` — [\<1\>:                  SystemExceptions.NotFound class-accessing](#11791-systemexceptionsnotfound-class-accessing)
- `signalOn:useInstead:` — [SystemExceptions.WrongMessageSent class-signaling](#11971-systemexceptionswrongmessagesent-class-signaling)
- `signalOn:what:` — [SystemExceptions.NotFound class-accessing](#11791-systemexceptionsnotfound-class-accessing)
- `signalOn:withIndex:` — [SystemExceptions.IndexOutOfRange class-signaling](#11691-systemexceptionsindexoutofrange-class-signaling)
- `signByte` — [Float class-byte-order dependancies](#1801-float-class-byte-order-dependancies)
- `signByte` — [FloatD class-byte-order dependencies](#1811-floatd-class-byte-order-dependencies)
- `signByte` — [FloatE class-byte-order dependancies](#1821-floate-class-byte-order-dependancies)
- `signByte` — [FloatQ class-byte-order dependancies](#1831-floatq-class-byte-order-dependancies)
- `similarityTo:` — [String-built ins](#11585-string-built-ins)
- `sin` — [Float-built ins](#1805-float-built-ins)
- `sin` — [Number-misc math](#11229-number-misc-math)
- `singleStep` — [Process-basic](#11342-process-basic)
- `singleStepWaitingOn:` — [Process-builtins](#11343-process-builtins)
- `sinh` — [Number-misc math](#11229-number-misc-math)
- `size` — [ArrayedCollection-built ins](#153-arrayedcollection-built-ins)
- `size` — [Bag-testing collections](#188-bag-testing-collections)
- `size` — [Collection-testing collections](#13715-collection-testing-collections)
- `size` — [ContextPart-accessing](#1413-contextpart-accessing)
- `size` — [File-accessing](#1757-file-accessing)
- `size` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `size` — [FilePath-accessing](#1773-filepath-accessing)
- `size` — [FileSegment-basic](#1783-filesegment-basic)
- `size` — [FileStream-basic](#1793-filestream-basic)
- `size` — [HashedCollection-testing collections](#18810-hashedcollection-testing-collections)
- `size` — [Interval-basic](#1932-interval-basic)
- `size` — [LargeArrayedCollection-basic](#1963-largearrayedcollection-basic)
- `size` — [LargeInteger-built-ins](#1984-largeinteger-built-ins)
- `size` — [LargeZeroInteger-accessing](#11021-largezerointeger-accessing)
- `size` — [Link-iteration](#11033-link-iteration)
- `size` — [LinkedList-testing](#11045-linkedlist-testing)
- `size` — [MappedCollection-basic](#11082-mappedcollection-basic)
- `size` — [Namespace-overrides for superspaces](#11166-namespace-overrides-for-superspaces)
- `size` — [Object-built ins](#11232-object-built-ins)
- `size` — [OrderedCollection-accessing](#11262-orderedcollection-accessing)
- `size` — [PositionableStream-positioning](#11335-positionablestream-positioning)
- `size` — [RegexResults-accessing](#11451-regexresults-accessing)
- `size` — [RunArray-basic](#11474-runarray-basic)
- `size` — [SequenceableCollection-testing collections](#115112-sequenceablecollection-testing-collections)
- `size` — [String-built ins](#11585-string-built-ins)
- `size` — [VFS.ArchiveMember-accessing](#12091-vfsarchivemember-accessing)
- `size` — [VFS.FileWrapper-delegation](#12105-vfsfilewrapper-delegation)
- `size` — [WeakArray-accessing](#12152-weakarray-accessing)
- `size:stCtime:stMtime:stAtime:mode:` — [VFS.ArchiveMember-initializing](#12096-vfsarchivemember-initializing)
- `size:stMtime:mode:` — [VFS.ArchiveMember-initializing](#12096-vfsarchivemember-initializing)
- `sizeof` — [CAggregate class-accessing](#1151-caggregate-class-accessing)
- `sizeof` — [CArray-accessing](#1171-carray-accessing)
- `sizeof` — [CArrayCType-accessing](#1182-carrayctype-accessing)
- `sizeof` — [CChar class-accessing](#1231-cchar-class-accessing)
- `sizeof` — [CChar-accessing](#1232-cchar-accessing)
- `sizeof` — [CCompound class-subclass creation](#1242-ccompound-class-subclass-creation)
- `sizeof` — [CDouble class-accessing](#1251-cdouble-class-accessing)
- `sizeof` — [CDouble-accessing](#1252-cdouble-accessing)
- `sizeof` — [CFloat class-accessing](#1261-cfloat-class-accessing)
- `sizeof` — [CFloat-accessing](#1262-cfloat-accessing)
- `sizeof` — [CInt class-accessing](#1301-cint-class-accessing)
- `sizeof` — [CInt-accessing](#1302-cint-accessing)
- `sizeof` — [CLong class-accessing](#1331-clong-class-accessing)
- `sizeof` — [CLong-accessing](#1332-clong-accessing)
- `sizeof` — [CLongDouble class-accessing](#1341-clongdouble-class-accessing)
- `sizeof` — [CLongDouble-accessing](#1342-clongdouble-accessing)
- `sizeof` — [CLongLong class-accessing](#1351-clonglong-class-accessing)
- `sizeof` — [CLongLong-accessing](#1352-clonglong-accessing)
- `sizeof` — [CPtr-accessing](#1431-cptr-accessing)
- `sizeof` — [CShort class-accessing](#1471-cshort-class-accessing)
- `sizeof` — [CShort-accessing](#1472-cshort-accessing)
- `sizeof` — [CSmalltalk class-accessing](#1481-csmalltalk-class-accessing)
- `sizeof` — [CSmalltalk-accessing](#1482-csmalltalk-accessing)
- `sizeof` — [CType-accessing](#1523-ctype-accessing)
- `sizeof` — [CUChar class-getting info](#1531-cuchar-class-getting-info)
- `sizeof` — [CUChar-accessing](#1532-cuchar-accessing)
- `sizeof` — [CUInt class-accessing](#1541-cuint-class-accessing)
- `sizeof` — [CUInt-accessing](#1542-cuint-accessing)
- `sizeof` — [CULong class-accessing](#1551-culong-class-accessing)
- `sizeof` — [CULong-accessing](#1552-culong-accessing)
- `sizeof` — [CULongLong class-accessing](#1561-culonglong-class-accessing)
- `sizeof` — [CULongLong-accessing](#1562-culonglong-accessing)
- `sizeof` — [CUShort class-accessing](#1581-cushort-class-accessing)
- `sizeof` — [CUShort-accessing](#1582-cushort-accessing)
- `skip:` — [FileDescriptor-overriding inherited methods](#17611-filedescriptor-overriding-inherited-methods)
- `skip` — [\<1\>:                             PositionableStream-positioning](#11335-positionablestream-positioning)
- `skip` — [\<2\>:                             Stream-positioning](#115713-stream-positioning)
- `skipSeparators` — [Stream-positioning](#115713-stream-positioning)
- `skipTo:` — [Stream-positioning](#115713-stream-positioning)
- `skipToAll:` — [Stream-positioning](#115713-stream-positioning)
- `smallest` — [SmallInteger class-getting limits](#11551-smallinteger-class-getting-limits)
- `smoothingFactor` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `smoothingFactor:` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `snapshot` — [ObjectMemory class-saving the image](#11254-objectmemory-class-saving-the-image)
- `snapshot:` — [ObjectMemory class-saving the image](#11254-objectmemory-class-saving-the-image)
- `soleInstance` — [Metaclass-accessing](#11122-metaclass-accessing)
- `someInstance` — [Behavior-built ins](#194-behavior-built-ins)
- `sort` — [SequenceableCollection-sorting](#11519-sequenceablecollection-sorting)
- `sort` — [SortedCollection-sorting](#11569-sortedcollection-sorting)
- `sort:` — [SequenceableCollection-sorting](#11519-sequenceablecollection-sorting)
- `sort` — [\<1\>:                             SortedCollection-sorting](#11569-sortedcollection-sorting)
- `sortBlock` — [SortedCollection-basic](#11563-sortedcollection-basic)
- `sortBlock:` — [SharedQueue class-instance creation](#11531-sharedqueue-class-instance-creation)
- `sortBlock` — [\<1\>:                        SortedCollection class-instance creation](#11562-sortedcollection-class-instance-creation)
- `sortBlock` — [\<2\>:                        SortedCollection-basic](#11563-sortedcollection-basic)
- `sorted` — [ArrayedCollection-sorting](#157-arrayedcollection-sorting)
- `sorted` — [Collection-sorting](#13713-collection-sorting)
- `sorted` — [SequenceableCollection-sorting](#11519-sequenceablecollection-sorting)
- `sorted:` — [ArrayedCollection-sorting](#157-arrayedcollection-sorting)
- `sorted` — [\<1\>:                           Collection-sorting](#13713-collection-sorting)
- `sorted` — [\<2\>:                           SequenceableCollection-sorting](#11519-sequenceablecollection-sorting)
- `sortedByCount` — [Bag-extracting items](#184-bag-extracting-items)
- `source` — [Random class-shortcuts](#11392-random-class-shortcuts)
- `sourceCode` — [MethodInfo-accessing](#11151-methodinfo-accessing)
- `sourceCodeAt:` — [Behavior-accessing the method dictionary](#193-behavior-accessing-the-method-dictionary)
- `sourceCodeAt:ifAbsent:` — [Behavior-accessing the method dictionary](#193-behavior-accessing-the-method-dictionary)
- `sourceCodeLinesDelta` — [CompiledBlock-accessing](#1382-compiledblock-accessing)
- `sourceCodeLinesDelta` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `sourceCodeLinesDelta` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `sourceCodeMap` — [CompiledBlock-accessing](#1382-compiledblock-accessing)
- `sourceCodeMap` — [CompiledCode-testing accesses](#13911-compiledcode-testing-accesses)
- `sourceFile` — [MethodInfo-accessing](#11151-methodinfo-accessing)
- `sourceMethodAt:` — [Behavior-accessing the method dictionary](#193-behavior-accessing-the-method-dictionary)
- `sourcePos` — [MethodInfo-accessing](#11151-methodinfo-accessing)
- `sourceString` — [MethodInfo-accessing](#11151-methodinfo-accessing)
- `sp` — [ContextPart-accessing](#1413-contextpart-accessing)
- `sp:` — [ContextPart-accessing](#1413-contextpart-accessing)
- `space` — [Character class-constants](#1282-character-class-constants)
- `space` — [Stream-character writing](#11576-stream-character-writing)
- `space:` — [Stream-character writing](#11576-stream-character-writing)
- `spaceGrowRate` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `spaceGrowRate:` — [ObjectMemory class-builtins](#11252-objectmemory-class-builtins)
- `specialSelectors` — [CompiledCode class-tables](#1393-compiledcode-class-tables)
- `specialSelectorsNumArgs` — [CompiledCode class-tables](#1393-compiledcode-class-tables)
- `species` — [BindingDictionary-testing](#1106-bindingdictionary-testing)
- `species` — [Interval-basic](#1932-interval-basic)
- `species` — [Object-class type methods](#11234-object-class-type-methods)
- `species` — [PositionableStream-class type methods](#11333-positionablestream-class-type-methods)
- `species` — [Regex-conversion](#11443-regex-conversion)
- `species` — [Stream-basic](#11573-stream-basic)
- `species` — [Symbol-misc](#11598-symbol-misc)
- `species` — [WeakArray-conversion](#12153-weakarray-conversion)
- `splitAt:` — [Stream-accessing-reading](#11571-stream-accessing-reading)
- `sqrt` — [Float-built ins](#1805-float-built-ins)
- `sqrt` — [Fraction-optimized cases](#1849-fraction-optimized-cases)
- `sqrt` — [Number-misc math](#11229-number-misc-math)
- `squared` — [Fraction-optimized cases](#1849-fraction-optimized-cases)
- `squared` — [Number-misc math](#11229-number-misc-math)
- `stackDepth` — [BlockClosure-accessing](#1113-blockclosure-accessing)
- `stackDepth` — [CompiledBlock-accessing](#1382-compiledblock-accessing)
- `stackDepth` — [CompiledCode-accessing](#1394-compiledcode-accessing)
- `stackDepth` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `startDelayLoop` — [Delay class-timer process](#1623-delay-class-timer-process)
- `startFinalizers` — [ProcessorScheduler-idle tasks](#11364-processorscheduler-idle-tasks)
- `startScript` — [Package-accessing](#11273-package-accessing)
- `startScript:` — [Package-accessing](#11273-package-accessing)
- `startsWith:` — [SequenceableCollection-comparing](#11513-sequenceablecollection-comparing)
- `stderr` — [FileStream class-standard streams](#1792-filestream-class-standard-streams)
- `stdin` — [FileStream class-standard streams](#1792-filestream-class-standard-streams)
- `stdout` — [FileStream class-standard streams](#1792-filestream-class-standard-streams)
- `stopScript` — [Package-accessing](#11273-package-accessing)
- `stopScript:` — [Package-accessing](#11273-package-accessing)
- `storage` — [CObject-accessing](#1365-cobject-accessing)
- `storage:` — [CObject-accessing](#1365-cobject-accessing)
- `store` — [Object-storing](#112316-object-storing)
- `store:` — [Stream-storing](#115716-stream-storing)
- `store` — [\<1\>:                            TextCollector-storing](#11985-textcollector-storing)
- `storeLiteralOn:` — [Array-printing](#144-array-printing)
- `storeLiteralOn` — [\<1\>:                   Boolean-storing](#1135-boolean-storing)
- `storeLiteralOn` — [\<2\>:                   ByteArray-storing](#1147-bytearray-storing)
- `storeLiteralOn` — [\<3\>:                   Character-printing](#12810-character-printing)
- `storeLiteralOn` — [\<4\>:                   Float-storing](#18014-float-storing)
- `storeLiteralOn` — [\<5\>:                   Integer-printing](#1929-integer-printing)
- `storeLiteralOn` — [\<6\>:                   Object-storing](#112316-object-storing)
- `storeLiteralOn` — [\<7\>:                   ScaledDecimal-storing](#11487-scaleddecimal-storing)
- `storeLiteralOn` — [\<8\>:                   String-printing](#11589-string-printing)
- `storeLiteralOn` — [\<9\>:                   Symbol-storing](#11599-symbol-storing)
- `storeLiteralOn` — [\<10\>:                  UndefinedObject-storing](#12019-undefinedobject-storing)
- `storeLiteralOn` — [\<11\>:                  VariableBinding-storing](#12064-variablebinding-storing)
- `storeNl` — [Object-storing](#112316-object-storing)
- `storeOn:` — [AbstractNamespace-printing](#117-abstractnamespace-printing)
- `storeOn` — [\<1\>:                          Array-printing](#144-array-printing)
- `storeOn` — [\<2\>:                          ArrayedCollection-storing](#158-arrayedcollection-storing)
- `storeOn` — [\<3\>:                          Association-storing](#165-association-storing)
- `storeOn` — [\<4\>:                          Bag-storing](#187-bag-storing)
- `storeOn` — [\<5\>:                          Boolean-storing](#1135-boolean-storing)
- `storeOn` — [\<6\>:                          ByteArray-storing](#1147-bytearray-storing)
- `storeOn` — [\<7\>:                          CArrayCType-storing](#1184-carrayctype-storing)
- `storeOn` — [\<8\>:                          Character-storing](#12811-character-storing)
- `storeOn` — [\<9\>:                          Class-printing](#1317-class-printing)
- `storeOn` — [\<10\>:                         Collection-storing](#13714-collection-storing)
- `storeOn` — [\<11\>:                         CompiledMethod-printing](#14010-compiledmethod-printing)
- `storeOn` — [\<12\>:                         CPtrCType-storing](#1444-cptrctype-storing)
- `storeOn` — [\<13\>:                         CScalarCType-storing](#1462-cscalarctype-storing)
- `storeOn` — [\<14\>:                         CType-storing](#1526-ctype-storing)
- `storeOn` — [\<15\>:                         Date-storing](#1599-date-storing)
- `storeOn` — [\<16\>:                         DateTime-storing](#1608-datetime-storing)
- `storeOn` — [\<17\>:                         DeferredVariableBinding-storing](#1613-deferredvariablebinding-storing)
- `storeOn` — [\<18\>:                         Dictionary-storing](#16412-dictionary-storing)
- `storeOn` — [\<19\>:                         Duration-storing](#1695-duration-storing)
- `storeOn` — [\<20\>:                         Float-storing](#18014-float-storing)
- `storeOn` — [\<21\>:                         Fraction-printing](#18410-fraction-printing)
- `storeOn` — [\<22\>:                         HashedCollection-storing](#1889-hashedcollection-storing)
- `storeOn` — [\<23\>:                         HomedAssociation-storing](#1894-homedassociation-storing)
- `storeOn` — [\<24\>:                         Integer-storing](#19210-integer-storing)
- `storeOn` — [\<25\>:                         Interval-storing](#1934-interval-storing)
- `storeOn` — [\<26\>:                         LookupKey-storing](#11054-lookupkey-storing)
- `storeOn` — [\<27\>:                         LookupTable-storing](#11067-lookuptable-storing)
- `storeOn` — [\<28\>:                         Metaclass-printing](#11127-metaclass-printing)
- `storeOn` — [\<29\>:                         Namespace-printing](#11167-namespace-printing)
- `storeOn` — [\<30\>:                         Object-storing](#112316-object-storing)
- `storeOn` — [\<31\>:                         Point-storing](#11328-point-storing)
- `storeOn` — [\<32\>:                         ProcessorScheduler-storing](#11367-processorscheduler-storing)
- `storeOn` — [\<33\>:                         Rectangle-printing](#11424-rectangle-printing)
- `storeOn` — [\<34\>:                         RootNamespace-printing](#11464-rootnamespace-printing)
- `storeOn` — [\<35\>:                         ScaledDecimal-storing](#11487-scaleddecimal-storing)
- `storeOn` — [\<36\>:                         String-printing](#11589-string-printing)
- `storeOn` — [\<37\>:                         Symbol-storing](#11599-symbol-storing)
- `storeOn` — [\<38\>:                         SystemDictionary-printing](#11617-systemdictionary-printing)
- `storeOn` — [\<39\>:                         TextCollector-storing](#11985-textcollector-storing)
- `storeOn` — [\<40\>:                         UndefinedObject-storing](#12019-undefinedobject-storing)
- `storeOn` — [\<41\>:                         VariableBinding-storing](#12064-variablebinding-storing)
- `storeOn:base:` — [Integer-printing](#1929-integer-printing)
- `storeString` — [Integer-storing](#19210-integer-storing)
- `storeString` — [Object-storing](#112316-object-storing)
- `stream` — [ObjectDumper-accessing](#11245-objectdumper-accessing)
- `stream` — [SystemExceptions.EndOfStream-accessing](#11672-systemexceptionsendofstream-accessing)
- `stream:` — [ObjectDumper-accessing](#11245-objectdumper-accessing)
- `stream` — [\<1\>:                           SystemExceptions.EndOfStream-accessing](#11672-systemexceptionsendofstream-accessing)
- `streamContents:` — [ArrayedCollection class-instance creation](#151-arrayedcollection-class-instance-creation)
- `strictlyPositive` — [Float-testing](#18015-float-testing)
- `strictlyPositive` — [LargeNegativeInteger-numeric testing](#1992-largenegativeinteger-numeric-testing)
- `strictlyPositive` — [LargePositiveInteger-numeric testing](#11004-largepositiveinteger-numeric-testing)
- `strictlyPositive` — [LargeZeroInteger-numeric testing](#11023-largezerointeger-numeric-testing)
- `strictlyPositive` — [Number-testing](#112213-number-testing)
- `stringAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `stringAt` — [\<1\>:                         Memory class-accessing](#11091-memory-class-accessing)
- `stringAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `stringAt:put` — [\<1\>:                     Memory class-accessing](#11091-memory-class-accessing)
- `stringError:` — [File class-C functions](#1751-file-class-c-functions)
- `stripExtension` — [FilePath-file name management](#1778-filepath-file-name-management)
- `stripExtensionFrom:` — [FilePath class-file name management](#1771-filepath-class-file-name-management)
- `stripFileName` — [FilePath-file name management](#1778-filepath-file-name-management)
- `stripFileNameFor:` — [FilePath class-file name management](#1771-filepath-class-file-name-management)
- `stripPath` — [FilePath-file name management](#1778-filepath-file-name-management)
- `stripPathFrom:` — [FilePath class-file name management](#1771-filepath-class-file-name-management)
- `stripSourceCode` — [CompiledMethod class-lean images](#1403-compiledmethod-class-lean-images)
- `stripSourceCode` — [MethodInfo-accessing](#11151-methodinfo-accessing)
- `subclass:` — [Class-instance creation](#1314-class-instance-creation)
- `subclass` — [\<1\>:                         UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `subclass:classInstanceVariableNames:instanceVariableNames:classVariableNames:poolDictionaries:` — [Class-instance creation - alternative](#1315-class-instance-creation---alternative)
- `subclass:classInstanceVariableNames:instanceVariableNames:classVariableNames:poolDictionaries` — [\<1\>: UndefinedObject-class creation - alternative](#12012-undefinedobject-class-creation---alternative)
- `subclass:declaration:classVariableNames:poolDictionaries:category:` — [CCompound class-subclass creation](#1242-ccompound-class-subclass-creation)
- `subclass:instanceVariableNames:classVariableNames:poolDictionaries:` — [Class-instance creation - alternative](#1315-class-instance-creation---alternative)
- `subclass:instanceVariableNames:classVariableNames:poolDictionaries` — [\<1\>: UndefinedObject-class creation - alternative](#12012-undefinedobject-class-creation---alternative)
- `subclass:instanceVariableNames:classVariableNames:poolDictionaries:category:` — [Class-instance creation](#1314-class-instance-creation)
- `subclass:instanceVariableNames:classVariableNames:poolDictionaries:category` — [\<1\>: UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `subclasses` — [Behavior-accessing class hierarchy](#191-behavior-accessing-class-hierarchy)
- `subclassesDo:` — [Behavior-enumerating](#1911-behavior-enumerating)
- `subclassInstVarNames` — [Behavior-accessing instances and variables](#192-behavior-accessing-instances-and-variables)
- `subclassOf:` — [Metaclass class-instance creation](#11121-metaclass-class-instance-creation)
- `subclassResponsibility` — [Object-built ins](#11232-object-built-ins)
- `subject` — [RegexResults-accessing](#11451-regexresults-accessing)
- `subspaces` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `subspacesDo:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `subStrings` — [CharacterArray-string processing](#1299-characterarray-string-processing)
- `substrings` — [CharacterArray-string processing](#1299-characterarray-string-processing)
- `subStrings:` — [CharacterArray-string processing](#1299-characterarray-string-processing)
- `substrings:` — [CharacterArray-string processing](#1299-characterarray-string-processing)
- `subtractDate:` — [Date-basic](#1594-date-basic)
- `subtractDays:` — [Date-basic](#1594-date-basic)
- `subtractTime:` — [Time-arithmetic](#11998-time-arithmetic)
- `successor` — [Float-floating point](#18011-float-floating-point)
- `suggestedSelector` — [SystemExceptions.WrongMessageSent-accessing](#11972-systemexceptionswrongmessagesent-accessing)
- `suggestedSelector:` — [SystemExceptions.WrongMessageSent-accessing](#11972-systemexceptionswrongmessagesent-accessing)
- `sunitScriptFor:` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `sunitScripts` — [Package-accessing](#11273-package-accessing)
- `superclass` — [Behavior-accessing class hierarchy](#191-behavior-accessing-class-hierarchy)
- `superclass:` — [Behavior-creating a class hierarchy](#1910-behavior-creating-a-class-hierarchy)
- `superclass` — [\<1\>:                       Class-accessing instances and variables](#1312-class-accessing-instances-and-variables)
- `superspace` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `superspace` — [Dictionary-namespace protocol](#1648-dictionary-namespace-protocol)
- `superspace:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `survSpaceSize` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `survSpaceUsedBytes` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `suspend` — [Process-builtins](#11343-process-builtins)
- `suspendedContext` — [Process-accessing](#11341-process-accessing)
- `suspendedContext:` — [Process-accessing](#11341-process-accessing)
- `swap:with:` — [SequenceableCollection-manipulation](#11517-sequenceablecollection-manipulation)
- `symbol` — [SymLink-accessing](#11602-symlink-accessing)
- `symbol:` — [SymLink-accessing](#11602-symlink-accessing)
- `symbol:nextLink:` — [SymLink class-instance creation](#11601-symlink-class-instance-creation)
- `symlink:as:` — [File class-file operations](#1752-file-class-file-operations)
- `symlink:from:` — [File class-file operations](#1752-file-class-file-operations)
- `symlinkAs:` — [File-file operations](#17511-file-file-operations)
- `symlinkAs` — [\<1\>:                        FilePath-file operations](#1779-filepath-file-operations)
- `symlinkAs` — [\<2\>:                        VFS.FileWrapper-file operations](#12107-vfsfilewrapper-file-operations)
- `symlinkFrom:` — [File-file operations](#17511-file-file-operations)
- `symlinkFrom` — [\<1\>:                      FilePath-file operations](#1779-filepath-file-operations)
- `symlinkFrom` — [\<2\>:                      VFS.FileWrapper-file operations](#12107-vfsfilewrapper-file-operations)
- `system:` — [SystemDictionary-c call-outs](#11614-systemdictionary-c-call-outs)
- `system:withArguments:` — [SystemDictionary-c call-outs](#11614-systemdictionary-c-call-outs)
- `systemBackgroundPriority` — [ProcessorScheduler-priorities](#11366-processorscheduler-priorities)
- `systemKernel` — [Directory class-reading system defaults](#1663-directory-class-reading-system-defaults)
- `tab` — [Character class-constants](#1282-character-class-constants)
- `tab` — [Stream-character writing](#11576-stream-character-writing)
- `tab:` — [Stream-character writing](#11576-stream-character-writing)
- `tag` — [Exception-accessing](#1725-exception-accessing)
- `tag:` — [Exception-accessing](#1725-exception-accessing)
- `tags` — [Package class-accessing](#11271-package-class-accessing)
- `tan` — [Float-built ins](#1805-float-built-ins)
- `tan` — [Number-misc math](#11229-number-misc-math)
- `tanh` — [Number-misc math](#11229-number-misc-math)
- `target` — [Permission-accessing](#11292-permission-accessing)
- `target:` — [Permission-accessing](#11292-permission-accessing)
- `temporary` — [Directory class-reading system defaults](#1663-directory-class-reading-system-defaults)
- `tenure` — [Object-built ins](#11232-object-built-ins)
- `tenuredBytesPerScavenge` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `terminate` — [Process-basic](#11342-process-basic)
- `terminateActive` — [ProcessorScheduler-basic](#11362-processorscheduler-basic)
- `terminateOnQuit` — [Process-basic](#11342-process-basic)
- `test` — [Package-accessing](#11273-package-accessing)
- `test:` — [Package-accessing](#11273-package-accessing)
- `third` — [SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `thisContext` — [ContextPart class-built ins](#1411-contextpart-class-built-ins)
- `timeBetweenGlobalGCs` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `timeBetweenGrowths` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `timeBetweenScavenges` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `timedWaitOn:` — [Delay-delaying](#1627-delay-delaying)
- `timeSlice` — [ProcessorScheduler-basic](#11362-processorscheduler-basic)
- `timeSlice:` — [ProcessorScheduler-basic](#11362-processorscheduler-basic)
- `timesRepeat:` — [Integer-iterators](#1927-integer-iterators)
- `timesTwoPower:` — [FloatD-built ins](#1814-floatd-built-ins)
- `timesTwoPower` — [\<1\>:                    FloatE-built ins](#1825-floate-built-ins)
- `timesTwoPower` — [\<2\>:                    FloatQ-built ins](#1834-floatq-built-ins)
- `timeToCollect` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `timeToCompact` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `timeToScavenge` — [ObjectMemory-accessing](#11255-objectmemory-accessing)
- `timezone` — [Time class-builtins](#11992-time-class-builtins)
- `timeZoneAbbreviation` — [DateTime-time zones](#16010-datetime-time-zones)
- `timezoneBias` — [Time class-builtins](#11992-time-class-builtins)
- `timezoneBias:` — [Time class-builtins](#11992-time-class-builtins)
- `timeZoneName` — [DateTime-time zones](#16010-datetime-time-zones)
- `timingPriority` — [ProcessorScheduler-priorities](#11366-processorscheduler-priorities)
- `to` — [RegexResults-accessing](#11451-regexresults-accessing)
- `to:` — [Number-shortcuts and iterators](#112212-number-shortcuts-and-iterators)
- `to:by:` — [Number-shortcuts and iterators](#112212-number-shortcuts-and-iterators)
- `to:by:collect:` — [Number-shortcuts and iterators](#112212-number-shortcuts-and-iterators)
- `to:by:do:` — [Number-shortcuts and iterators](#112212-number-shortcuts-and-iterators)
- `to:collect:` — [Number-shortcuts and iterators](#112212-number-shortcuts-and-iterators)
- `to:do:` — [Number-shortcuts and iterators](#112212-number-shortcuts-and-iterators)
- `toAt:` — [RegexResults-accessing](#11451-regexresults-accessing)
- `today` — [Date class-instance creation (Blue Book)](#1593-date-class-instance-creation-blue-book)
- `today` — [DateTime class-instance creation](#1602-datetime-class-instance-creation)
- `tokenize:` — [String-regex](#115810-string-regex)
- `tokenize:from:to:` — [String-regex](#115810-string-regex)
- `top` — [Rectangle-accessing](#11422-rectangle-accessing)
- `top:` — [Rectangle-accessing](#11422-rectangle-accessing)
- `topCenter` — [Rectangle-accessing](#11422-rectangle-accessing)
- `topLeft` — [Rectangle-accessing](#11422-rectangle-accessing)
- `topLeft:` — [Rectangle-accessing](#11422-rectangle-accessing)
- `topRight` — [Rectangle-accessing](#11422-rectangle-accessing)
- `topRight:` — [Rectangle-accessing](#11422-rectangle-accessing)
- `touch` — [FilePath-file operations](#1779-filepath-file-operations)
- `touch:` — [File class-file operations](#1752-file-class-file-operations)
- `translateBy:` — [Rectangle-transforming](#11427-rectangle-transforming)
- `translatedToBeWithin:` — [Rectangle-rectangle functions](#11425-rectangle-rectangle-functions)
- `transpose` — [Point-point functions](#11326-point-point-functions)
- `trigger` — [DelayedAdaptor-accessing](#1631-delayedadaptor-accessing)
- `trimSeparators` — [CharacterArray-converting](#1296-characterarray-converting)
- `truncate` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `truncate` — [FileStream-basic](#1793-filestream-basic)
- `truncate` — [PositionableStream-truncating](#11338-positionablestream-truncating)
- `truncated` — [Float-coercing](#1806-float-coercing)
- `truncated` — [FloatD-built ins](#1814-floatd-built-ins)
- `truncated` — [FloatE-built ins](#1825-floate-built-ins)
- `truncated` — [FloatQ-built ins](#1834-floatq-built-ins)
- `truncated` — [Fraction-coercing](#1845-fraction-coercing)
- `truncated` — [Integer-converting](#1925-integer-converting)
- `truncated` — [Number-truncation and round off](#112214-number-truncation-and-round-off)
- `truncated` — [ScaledDecimal-coercion](#11483-scaleddecimal-coercion)
- `truncatedGrid:` — [Point-point functions](#11326-point-point-functions)
- `truncateTo:` — [Number-truncation and round off](#112214-number-truncation-and-round-off)
- `truncateTo` — [\<1\>:                       Point-truncation and round off](#11329-point-truncation-and-round-off)
- `type` — [CBoolean class-conversion](#1191-cboolean-class-conversion)
- `type` — [CByte class-conversion](#1201-cbyte-class-conversion)
- `type` — [CObject class-conversion](#1361-cobject-class-conversion)
- `type` — [CObject-conversion](#1368-cobject-conversion)
- `type` — [CScalar class-instance creation](#1451-cscalar-class-instance-creation)
- `type` — [CString class-instance creation](#1492-cstring-class-instance-creation)
- `type:` — [CObject-accessing](#1365-cobject-accessing)
- `ucharAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `ucharAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `ucharAt:put` — [\<1\>:                      Memory class-accessing](#11091-memory-class-accessing)
- `uintAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `uintAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `uintAt:put` — [\<1\>:                       Memory class-accessing](#11091-memory-class-accessing)
- `ulongAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `ulongAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `ulongAt:put` — [\<1\>:                      Memory class-accessing](#11091-memory-class-accessing)
- `uniqueInstance` — [NullValueHolder class-creating instances](#11211-nullvalueholder-class-creating-instances)
- `uniqueInstance` — [ProcessEnvironment class-singleton](#11352-processenvironment-class-singleton)
- `unity` — [FloatD-coercing](#1815-floatd-coercing)
- `unity` — [FloatE-coercing](#1826-floate-coercing)
- `unity` — [FloatQ-coercing](#1835-floatq-coercing)
- `unity` — [Fraction-coercing](#1845-fraction-coercing)
- `unity` — [LargeInteger-coercion](#1985-largeinteger-coercion)
- `unity` — [Number-converting](#11226-number-converting)
- `unity` — [SmallInteger-coercion methods](#11557-smallinteger-coercion-methods)
- `unpreemptedPriority` — [ProcessorScheduler-priorities](#11366-processorscheduler-priorities)
- `unscheduleDelay:` — [Delay class-timer process](#1623-delay-class-timer-process)
- `unsignedCharAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `unsignedCharAt` — [\<1\>:                   Memory class-accessing](#11091-memory-class-accessing)
- `unsignedCharAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `unsignedCharAt:put` — [\<1\>:               Memory class-accessing](#11091-memory-class-accessing)
- `unsignedIntAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `unsignedIntAt` — [\<1\>:                    Memory class-accessing](#11091-memory-class-accessing)
- `unsignedIntAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `unsignedIntAt:put` — [\<1\>:                Memory class-accessing](#11091-memory-class-accessing)
- `unsignedLongAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `unsignedLongAt` — [\<1\>:                   Memory class-accessing](#11091-memory-class-accessing)
- `unsignedLongAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `unsignedLongAt:put` — [\<1\>:               Memory class-accessing](#11091-memory-class-accessing)
- `unsignedShortAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `unsignedShortAt` — [\<1\>:                  Memory class-accessing](#11091-memory-class-accessing)
- `unsignedShortAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `unsignedShortAt:put` — [\<1\>:              Memory class-accessing](#11091-memory-class-accessing)
- `untilMilliseconds:` — [Delay class-instance creation](#1621-delay-class-instance-creation)
- `untilNanoseconds:` — [Delay class-instance creation](#1621-delay-class-instance-creation)
- `update` — [ObjectMemory-builtins](#11256-objectmemory-builtins)
- `update:` — [Delay class-still unclassified](#1622-delay-class-still-unclassified)
- `update` — [\<1\>:                           DLD class-dynamic linking](#1672-dld-class-dynamic-linking)
- `update` — [\<2\>:                           FileDescriptor class-initialization](#1761-filedescriptor-class-initialization)
- `update` — [\<3\>:                           Object class-initialization](#11231-object-class-initialization)
- `update` — [\<4\>:                           Object-change and update](#11233-object-change-and-update)
- `update` — [\<5\>:                           ProcessorScheduler-idle tasks](#11364-processorscheduler-idle-tasks)
- `update` — [\<6\>:                           Time class-initialization](#11994-time-class-initialization)
- `update` — [\<7\>:                           VFS.ArchiveMember-file operations](#12095-vfsarchivemember-file-operations)
- `update` — [\<8\>:                           VFS.FileWrapper class-initializing](#12101-vfsfilewrapper-class-initializing)
- `updateInstanceVars:shape:` — [Behavior-still unclassified](#1920-behavior-still-unclassified)
- `updateMember:` — [VFS.ArchiveFile-ArchiveMember protocol](#12081-vfsarchivefile-archivemember-protocol)
- `updateMember` — [\<1\>:                     VFS.ZipFile-members](#12131-vfszipfile-members)
- `upTo:` — [FileStream-overriding inherited methods](#1797-filestream-overriding-inherited-methods)
- `upTo` — [\<1\>:                             PositionableStream-accessing-reading](#11332-positionablestream-accessing-reading)
- `upTo` — [\<2\>:                             Stream-accessing-reading](#11571-stream-accessing-reading)
- `upToAll:` — [Stream-accessing-reading](#11571-stream-accessing-reading)
- `upToEnd` — [PositionableStream-accessing-reading](#11332-positionablestream-accessing-reading)
- `upToEnd` — [Stream-accessing-reading](#11571-stream-accessing-reading)
- `url` — [Package-accessing](#11273-package-accessing)
- `url:` — [Package-accessing](#11273-package-accessing)
- `use:during:` — [DynamicVariable class-evaluating](#1701-dynamicvariable-class-evaluating)
- `use:during` — [\<1\>:                       ProcessVariable-accessing](#11372-processvariable-accessing)
- `userBackgroundPriority` — [ProcessorScheduler-priorities](#11366-processorscheduler-priorities)
- `userBase` — [Directory class-reading system defaults](#1663-directory-class-reading-system-defaults)
- `userInterrupt` — [Object-VM callbacks](#112319-object-vm-callbacks)
- `userInterruptPriority` — [ProcessorScheduler-priorities](#11366-processorscheduler-priorities)
- `username` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `username:` — [NetClients.URL-accessing](#11183-netclientsurl-accessing)
- `userSchedulingPriority` — [ProcessorScheduler-priorities](#11366-processorscheduler-priorities)
- `ushortAt:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `ushortAt:put:` — [ByteArray-more advanced accessing](#1146-bytearray-more-advanced-accessing)
- `ushortAt:put` — [\<1\>:                     Memory class-accessing](#11091-memory-class-accessing)
- `utcDateAndTimeNow` — [Date class-instance creation (Blue Book)](#1593-date-class-instance-creation-blue-book)
- `utcNow` — [Time class-basic (UTC)](#11991-time-class-basic-utc)
- `utcSecondClock` — [Time class-basic (UTC)](#11991-time-class-basic-utc)
- `utcToday` — [Date class-instance creation (Blue Book)](#1593-date-class-instance-creation-blue-book)
- `validClasses` — [SystemExceptions.WrongClass-accessing](#11962-systemexceptionswrongclass-accessing)
- `validClasses:` — [SystemExceptions.WrongClass-accessing](#11962-systemexceptionswrongclass-accessing)
- `validClassesString` — [SystemExceptions.WrongClass-accessing](#11962-systemexceptionswrongclass-accessing)
- `validSize` — [ContextPart-accessing](#1413-contextpart-accessing)
- `validSize` — [Object-debugging](#11238-object-debugging)
- `value` — [Association-accessing](#162-association-accessing)
- `value` — [BlockClosure-built ins](#1114-blockclosure-built-ins)
- `value` — [CBoolean-accessing](#1192-cboolean-accessing)
- `value` — [CByte-accessing](#1202-cbyte-accessing)
- `value` — [Character-built ins](#1286-character-built-ins)
- `value` — [Continuation-invocation](#1422-continuation-invocation)
- `value` — [CPtr-accessing](#1431-cptr-accessing)
- `value` — [CScalar-accessing](#1452-cscalar-accessing)
- `value` — [CString-accessing](#1493-cstring-accessing)
- `value` — [DeferredVariableBinding-basic](#1612-deferredvariablebinding-basic)
- `value` — [DelayedAdaptor-accessing](#1631-delayedadaptor-accessing)
- `value` — [DirectedMessage-basic](#1653-directedmessage-basic)
- `value` — [DynamicVariable class-evaluating](#1701-dynamicvariable-class-evaluating)
- `value` — [NullValueHolder-accessing](#11212-nullvalueholder-accessing)
- `value` — [PluggableAdaptor-accessing](#11302-pluggableadaptor-accessing)
- `value` — [ProcessVariable-accessing](#11372-processvariable-accessing)
- `value` — [Promise-accessing](#11382-promise-accessing)
- `value` — [SystemExceptions.InvalidValue-accessing](#11742-systemexceptionsinvalidvalue-accessing)
- `value` — [ValueAdaptor-accessing](#12042-valueadaptor-accessing)
- `value` — [ValueHolder-accessing](#12052-valueholder-accessing)
- `value:` — [Association-accessing](#162-association-accessing)
- `value` — [\<1\>:                            BlockClosure-built ins](#1114-blockclosure-built-ins)
- `value` — [\<2\>:                            CBoolean-accessing](#1192-cboolean-accessing)
- `value` — [\<3\>:                            CByte-accessing](#1202-cbyte-accessing)
- `value` — [\<4\>:                            Character class-built ins](#1281-character-class-built-ins)
- `value` — [\<5\>:                            Continuation-invocation](#1422-continuation-invocation)
- `value` — [\<6\>:                            CPtr-accessing](#1431-cptr-accessing)
- `value` — [\<7\>:                            CScalar class-instance creation](#1451-cscalar-class-instance-creation)
- `value` — [\<8\>:                            CScalar-accessing](#1452-cscalar-accessing)
- `value` — [\<9\>:                            CString class-instance creation](#1492-cstring-class-instance-creation)
- `value` — [\<10\>:                           CString-accessing](#1493-cstring-accessing)
- `value` — [\<11\>:                           DeferredVariableBinding-basic](#1612-deferredvariablebinding-basic)
- `value` — [\<12\>:                           DelayedAdaptor-accessing](#1631-delayedadaptor-accessing)
- `value` — [\<13\>:                           DirectedMessage-basic](#1653-directedmessage-basic)
- `value` — [\<14\>:                           NullValueHolder-accessing](#11212-nullvalueholder-accessing)
- `value` — [\<15\>:                           PluggableAdaptor-accessing](#11302-pluggableadaptor-accessing)
- `value` — [\<16\>:                           ProcessVariable-accessing](#11372-processvariable-accessing)
- `value` — [\<17\>:                           Promise-accessing](#11382-promise-accessing)
- `value` — [\<18\>:                           SystemExceptions.InvalidValue-accessing](#11742-systemexceptionsinvalidvalue-accessing)
- `value` — [\<19\>:                           UnicodeCharacter class-built ins](#12021-unicodecharacter-class-built-ins)
- `value` — [\<20\>:                           ValueAdaptor-accessing](#12042-valueadaptor-accessing)
- `value` — [\<21\>:                           ValueHolder-accessing](#12052-valueholder-accessing)
- `value:onTimeoutDo:` — [Delay-timeout](#16211-delay-timeout)
- `value:value:` — [BlockClosure-built ins](#1114-blockclosure-built-ins)
- `value:value` — [\<1\>:                      DirectedMessage-basic](#1653-directedmessage-basic)
- `value:value:value:` — [BlockClosure-built ins](#1114-blockclosure-built-ins)
- `valueAt:` — [CharacterArray-built ins](#1294-characterarray-built-ins)
- `valueAt:ifAbsent:` — [CharacterArray-basic](#1293-characterarray-basic)
- `valueAt:put:` — [CharacterArray-built ins](#1294-characterarray-built-ins)
- `valueIfAbsent:` — [DynamicVariable class-evaluating](#1701-dynamicvariable-class-evaluating)
- `valueIfAbsent` — [\<1\>:                    ProcessVariable-accessing](#11372-processvariable-accessing)
- `values` — [AbstractNamespace-overrides for superspaces](#116-abstractnamespace-overrides-for-superspaces)
- `values` — [Dictionary-accessing](#1642-dictionary-accessing)
- `valueType` — [CScalarCType-accessing](#1461-cscalarctype-accessing)
- `valueType` — [CType-accessing](#1523-ctype-accessing)
- `valueWithArguments:` — [BlockClosure-built ins](#1114-blockclosure-built-ins)
- `valueWithArguments` — [\<1\>:               Continuation-invocation](#1422-continuation-invocation)
- `valueWithArguments` — [\<2\>:               DirectedMessage-basic](#1653-directedmessage-basic)
- `valueWithoutInterrupts` — [BlockClosure-multiple process](#1117-blockclosure-multiple-process)
- `valueWithoutInterrupts:` — [Process-accessing](#11341-process-accessing)
- `valueWithoutPreemption` — [BlockClosure-multiple process](#1117-blockclosure-multiple-process)
- `valueWithReceiver:withArguments:` — [CompiledMethod-invoking](#1409-compiledmethod-invoking)
- `valueWithUnwind` — [BlockClosure-unwind protection](#11110-blockclosure-unwind-protection)
- `variable:subclass:instanceVariableNames:classVariableNames:poolDictionaries:category:` — [Class-instance creation](#1314-class-instance-creation)
- `variable:subclass:instanceVariableNames:classVariableNames:poolDictionaries:category` — [\<1\>: UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `variableByteSubclass:classInstanceVariableNames:classVariableNames:poolDictionaries:` — [Class-instance creation - alternative](#1315-class-instance-creation---alternative)
- `variableByteSubclass:classInstanceVariableNames:instanceVariableNames:classVariableNames:poolDictionaries:` — [UndefinedObject-class creation - alternative](#12012-undefinedobject-class-creation---alternative)
- `variableByteSubclass:classVariableNames:poolDictionaries:` — [Class-instance creation - alternative](#1315-class-instance-creation---alternative)
- `variableByteSubclass:instanceVariableNames:classVariableNames:poolDictionaries:` — [UndefinedObject-class creation - alternative](#12012-undefinedobject-class-creation---alternative)
- `variableByteSubclass:instanceVariableNames:classVariableNames:poolDictionaries:category:` — [Class-instance creation](#1314-class-instance-creation)
- `variableByteSubclass:instanceVariableNames:classVariableNames:poolDictionaries:category` — [\<1\>: UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `variableLongSubclass:classInstanceVariableNames:classVariableNames:poolDictionaries:` — [Class-instance creation - alternative](#1315-class-instance-creation---alternative)
- `variableLongSubclass:classInstanceVariableNames:instanceVariableNames:classVariableNames:poolDictionaries:` — [UndefinedObject-class creation - alternative](#12012-undefinedobject-class-creation---alternative)
- `variableLongSubclass:classVariableNames:poolDictionaries:` — [Class-instance creation - alternative](#1315-class-instance-creation---alternative)
- `variableLongSubclass:instanceVariableNames:classVariableNames:poolDictionaries:` — [UndefinedObject-class creation - alternative](#12012-undefinedobject-class-creation---alternative)
- `variableSubclass:classInstanceVariableNames:instanceVariableNames:classVariableNames:poolDictionaries:` — [Class-instance creation - alternative](#1315-class-instance-creation---alternative)
- `variableSubclass:classInstanceVariableNames:instanceVariableNames:classVariableNames:poolDictionaries` — [\<1\>: UndefinedObject-class creation - alternative](#12012-undefinedobject-class-creation---alternative)
- `variableSubclass:instanceVariableNames:classVariableNames:poolDictionaries:` — [Class-instance creation - alternative](#1315-class-instance-creation---alternative)
- `variableSubclass:instanceVariableNames:classVariableNames:poolDictionaries` — [\<1\>: UndefinedObject-class creation - alternative](#12012-undefinedobject-class-creation---alternative)
- `variableSubclass:instanceVariableNames:classVariableNames:poolDictionaries:category:` — [Class-instance creation](#1314-class-instance-creation)
- `variableSubclass:instanceVariableNames:classVariableNames:poolDictionaries:category` — [\<1\>: UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `variableWordSubclass:instanceVariableNames:classVariableNames:poolDictionaries:category:` — [Class-instance creation](#1314-class-instance-creation)
- `variableWordSubclass:instanceVariableNames:classVariableNames:poolDictionaries:category` — [\<1\>: UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `verbose:` — [FileStream class-file-in](#1791-filestream-class-file-in)
- `verboseTrace` — [SystemDictionary-builtins](#11613-systemdictionary-builtins)
- `verboseTrace:` — [SystemDictionary-builtins](#11613-systemdictionary-builtins)
- `verify` — [CompiledCode-security](#13910-compiledcode-security)
- `version` — [Package-accessing](#11273-package-accessing)
- `version` — [SystemDictionary-special accessing](#11619-systemdictionary-special-accessing)
- `version:` — [Package-accessing](#11273-package-accessing)
- `wait` — [Delay-delaying](#1627-delay-delaying)
- `wait` — [Duration-processes](#1694-duration-processes)
- `wait` — [Semaphore-builtins](#11503-semaphore-builtins)
- `waitAfterSignalling:` — [Semaphore-builtins](#11503-semaphore-builtins)
- `waitForException` — [FileDescriptor-accessing](#1764-filedescriptor-accessing)
- `waitingProcesses` — [RecursionLock-accessing](#11432-recursionlock-accessing)
- `waitingProcesses` — [Semaphore-accessing](#11502-semaphore-accessing)
- `weeks:` — [Duration class-instance creation](#1691-duration-class-instance-creation)
- `whichCategoryIncludesSelector:` — [ClassDescription-organization of messages and classes](#1325-classdescription-organization-of-messages-and-classes)
- `whichClassIncludesSelector:` — [Behavior-testing the method dictionary](#1925-behavior-testing-the-method-dictionary)
- `whichSelectorsAccess:` — [Behavior-testing the method dictionary](#1925-behavior-testing-the-method-dictionary)
- `whichSelectorsAssign:` — [Behavior-testing the method dictionary](#1925-behavior-testing-the-method-dictionary)
- `whichSelectorsRead:` — [Behavior-testing the method dictionary](#1925-behavior-testing-the-method-dictionary)
- `whichSelectorsReferTo:` — [Behavior-testing the method dictionary](#1925-behavior-testing-the-method-dictionary)
- `whichSelectorsReferToByteCode:` — [Behavior-testing the method dictionary](#1925-behavior-testing-the-method-dictionary)
- `whileCurrentDo:` — [AbstractNamespace-copying](#114-abstractnamespace-copying)
- `whileFalse` — [BlockClosure-control structures](#1115-blockclosure-control-structures)
- `whileFalse:` — [BlockClosure-control structures](#1115-blockclosure-control-structures)
- `whileTrue` — [BlockClosure-control structures](#1115-blockclosure-control-structures)
- `whileTrue:` — [BlockClosure-control structures](#1115-blockclosure-control-structures)
- `width` — [Rectangle-accessing](#11422-rectangle-accessing)
- `width:` — [Rectangle-accessing](#11422-rectangle-accessing)
- `with:` — [ArrayedCollection class-instance creation](#151-arrayedcollection-class-instance-creation)
- `with` — [\<1\>:                             Collection class-instance creation](#1371-collection-class-instance-creation)
- `with` — [\<2\>:                             ReadWriteStream class-instance creation](#11411-readwritestream-class-instance-creation)
- `with` — [\<3\>:                             SequenceableCollection-concatenating](#11514-sequenceablecollection-concatenating)
- `with` — [\<4\>:                             Stream-concatenating](#11578-stream-concatenating)
- `with` — [\<5\>:                             Symbol class-instance creation](#11592-symbol-class-instance-creation)
- `with` — [\<6\>:                             ValueHolder class-creating instances](#12051-valueholder-class-creating-instances)
- `with` — [\<7\>:                             WriteStream class-instance creation](#12231-writestream-class-instance-creation)
- `with:collect:` — [ArrayedCollection-enumerating the elements of a collection](#156-arrayedcollection-enumerating-the-elements-of-a-collection)
- `with:collect` — [\<1\>:                     SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `with:do:` — [SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `with:from:to:` — [WriteStream class-instance creation](#12231-writestream-class-instance-creation)
- `with:with:` — [ArrayedCollection class-instance creation](#151-arrayedcollection-class-instance-creation)
- `with:with` — [\<1\>:                        Collection class-instance creation](#1371-collection-class-instance-creation)
- `with:with` — [\<2\>:                        SequenceableCollection-concatenating](#11514-sequenceablecollection-concatenating)
- `with:with` — [\<3\>:                        Stream-concatenating](#11578-stream-concatenating)
- `with:with` — [\<4\>:                        Symbol class-instance creation](#11592-symbol-class-instance-creation)
- `with:with:with:` — [ArrayedCollection class-instance creation](#151-arrayedcollection-class-instance-creation)
- `with:with:with` — [\<1\>:                   Collection class-instance creation](#1371-collection-class-instance-creation)
- `with:with:with` — [\<2\>:                   SequenceableCollection-concatenating](#11514-sequenceablecollection-concatenating)
- `with:with:with` — [\<3\>:                   Stream-concatenating](#11578-stream-concatenating)
- `with:with:with` — [\<4\>:                   Symbol class-instance creation](#11592-symbol-class-instance-creation)
- `with:with:with:with:` — [ArrayedCollection class-instance creation](#151-arrayedcollection-class-instance-creation)
- `with:with:with:with` — [\<1\>:              Collection class-instance creation](#1371-collection-class-instance-creation)
- `with:with:with:with` — [\<2\>:              Symbol class-instance creation](#11592-symbol-class-instance-creation)
- `with:with:with:with:with:` — [ArrayedCollection class-instance creation](#151-arrayedcollection-class-instance-creation)
- `with:with:with:with:with` — [\<1\>:         Collection class-instance creation](#1371-collection-class-instance-creation)
- `with:with:with:with:with` — [\<2\>:         Symbol class-instance creation](#11592-symbol-class-instance-creation)
- `withAll:` — [ArrayedCollection class-instance creation](#151-arrayedcollection-class-instance-creation)
- `withAll` — [\<1\>:                          Collection class-instance creation](#1371-collection-class-instance-creation)
- `withAll` — [\<2\>:                          HashedCollection class-instance creation](#1881-hashedcollection-class-instance-creation)
- `withAll` — [\<3\>:                          Interval class-instance creation](#1931-interval-class-instance-creation)
- `withAllBlocksDo:` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `withAllSubclasses` — [Behavior-accessing class hierarchy](#191-behavior-accessing-class-hierarchy)
- `withAllSubclassesDo:` — [Behavior-enumerating](#1911-behavior-enumerating)
- `withAllSubspaces` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `withAllSubspacesDo:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `withAllSuperclasses` — [Behavior-accessing class hierarchy](#191-behavior-accessing-class-hierarchy)
- `withAllSuperclassesDo:` — [Behavior-enumerating](#1911-behavior-enumerating)
- `withAllSuperspaces` — [Dictionary-namespace protocol](#1648-dictionary-namespace-protocol)
- `withAllSuperspacesDo:` — [Dictionary-namespace protocol](#1648-dictionary-namespace-protocol)
- `withFileDo:` — [FileSegment-basic](#1783-filesegment-basic)
- `withNewMethodClass:` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `withNewMethodClass:selector:` — [CompiledMethod-accessing](#1404-compiledmethod-accessing)
- `withOwner:` — [SecurityPolicy-modifying](#11491-securitypolicy-modifying)
- `withReadStreamDo:` — [FilePath-file operations](#1779-filepath-file-operations)
- `withShellEscapes` — [CharacterArray-string processing](#1299-characterarray-string-processing)
- `withShellEscapes` — [FilePath-printing](#17710-filepath-printing)
- `withSignOf:` — [Float-comparing](#1808-float-comparing)
- `withSignOf` — [\<1\>:                       Number-misc math](#11229-number-misc-math)
- `withUnixShellEscapes` — [CharacterArray-still unclassified](#1298-characterarray-still-unclassified)
- `withWindowsShellEscapes` — [CharacterArray-still unclassified](#1298-characterarray-still-unclassified)
- `withWriteStreamDo:` — [FilePath-file operations](#1779-filepath-file-operations)
- `working` — [Directory class-file operations](#1662-directory-class-file-operations)
- `working:` — [Directory class-file operations](#1662-directory-class-file-operations)
- `wouldBlock` — [RecursionLock-accessing](#11432-recursionlock-accessing)
- `wouldBlock` — [Semaphore-accessing](#11502-semaphore-accessing)
- `write` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `writeStream` — [ArrayedCollection-streams](#159-arrayedcollection-streams)
- `writeStream` — [FilePath-file operations](#1779-filepath-file-operations)
- `x` — [Point-accessing](#11322-point-accessing)
- `x:` — [Point-accessing](#11322-point-accessing)
- `x:y:` — [Point class-instance creation](#11321-point-class-instance-creation)
- `x:y` — [\<1\>:                              Point-accessing](#11322-point-accessing)
- `xor:` — [Boolean-basic](#1132-boolean-basic)
- `xor` — [\<1\>:                              False-basic](#1741-false-basic)
- `xor` — [\<2\>:                              True-basic](#12001-true-basic)
- `y` — [Point-accessing](#11322-point-accessing)
- `y:` — [Point-accessing](#11322-point-accessing)
- `year` — [Date-date computations](#1596-date-date-computations)
- `year:day:hour:minute:second:` — [Date class-instance creation (ANSI)](#1592-date-class-instance-creation-ansi)
- `year:day:hour:minute:second` — [\<1\>:      DateTime class-instance creation](#1602-datetime-class-instance-creation)
- `year:day:hour:minute:second:offset:` — [DateTime class-instance creation](#1602-datetime-class-instance-creation)
- `year:month:day:hour:minute:second:` — [Date class-instance creation (ANSI)](#1592-date-class-instance-creation-ansi)
- `year:month:day:hour:minute:second` — [\<1\>: DateTime class-instance creation](#1602-datetime-class-instance-creation)
- `year:month:day:hour:minute:second:offset:` — [DateTime class-instance creation](#1602-datetime-class-instance-creation)
- `yield` — [Process-builtins](#11343-process-builtins)
- `yield` — [ProcessorScheduler-basic](#11362-processorscheduler-basic)
- `yield:` — [Generator-stream protocol](#1852-generator-stream-protocol)
- `yourself` — [Object-class type methods](#11234-object-class-type-methods)
- `zero` — [Duration class-instance creation](#1691-duration-class-instance-creation)
- `zero` — [FloatD-coercing](#1815-floatd-coercing)
- `zero` — [FloatE-coercing](#1826-floate-coercing)
- `zero` — [FloatQ-coercing](#1835-floatq-coercing)
- `zero` — [Fraction-coercing](#1845-fraction-coercing)
- `zero` — [LargeInteger-coercion](#1985-largeinteger-coercion)
- `zero` — [Number-converting](#11226-number-converting)
- `zero` — [ScaledDecimal-constants](#11485-scaleddecimal-constants)
- `zero` — [SmallInteger-coercion methods](#11557-smallinteger-coercion-methods)
- `zeroDivide` — [Number-error raising](#11228-number-error-raising)
- `zip` — [FilePath-virtual filesystems](#17713-filepath-virtual-filesystems)

## Selector cross-reference

- `#` — [CompiledCode-basic](#1395-compiledcode-basic)
- `%` — [String-regex](#115810-string-regex)
- `%` — [String-regex](#115810-string-regex)
- `%` — [String-regex](#115810-string-regex)
- `%` — [String-regex](#115810-string-regex)
- `%` — [String-regex](#115810-string-regex)
- `%` — [String-regex](#115810-string-regex)
- `*` — [Number-retrying](#112211-number-retrying)
- `+` — [Number-retrying](#112211-number-retrying)
- `+` — [Symbol-basic](#11595-symbol-basic)
- `+` — [Symbol-basic](#11595-symbol-basic)
- `-` — [Number-retrying](#112211-number-retrying)
- `/` — [Number-retrying](#112211-number-retrying)
- `<=` — [ArrayedCollection-sorting](#157-arrayedcollection-sorting)
- `<=` — [Collection-sorting](#13713-collection-sorting)
- `<=` — [SequenceableCollection-sorting](#11519-sequenceablecollection-sorting)
- `<=` — [SequenceableCollection-sorting](#11519-sequenceablecollection-sorting)
- `=` — [Association-testing](#166-association-testing)
- `=` — [Number-retrying](#112211-number-retrying)
- `=` — [Number-retrying](#112211-number-retrying)
- `=` — [Stream-accessing-reading](#11571-stream-accessing-reading)
- `=~` — [String-regex](#115810-string-regex)
- `>>` — [CompiledMethod-saving and loading](#14011-compiledmethod-saving-and-loading)
- `~=` — [Number-retrying](#112211-number-retrying)
- `~=` — [Number-retrying](#112211-number-retrying)
- `add:` — [Collection-copying SequenceableCollections](#1378-collection-copying-sequenceablecollections)
- `addSubspace:` — [Namespace class-disabling instance creation](#11162-namespace-class-disabling-instance-creation)
- `addSubspace` — [\<1\>:                      Namespace class-disabling instance creation](#11162-namespace-class-disabling-instance-creation)
- `addToBeFinalized` — [CCompound class-instance creation](#1241-ccompound-class-instance-creation)
- `addToBeFinalized` — [CObject-finalization](#1369-cobject-finalization)
- `addToBeFinalized` — [CScalar class-instance creation](#1451-cscalar-class-instance-creation)
- `addToBeFinalized` — [CString class-instance creation](#1492-cstring-class-instance-creation)
- `allFilesMatching:do:` — [Directory class-file operations](#1662-directory-class-file-operations)
- `allLiteralsDo:` — [CompiledCode-literals - iteration](#1399-compiledcode-literals---iteration)
- `AM` — [DateTime-computations](#1605-datetime-computations)
- `append` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `append` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `append` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `append` — [FileDescriptor class-still unclassified](#1763-filedescriptor-class-still-unclassified)
- `arguments:do:ifError:` — [SystemDictionary-command-line](#11615-systemdictionary-command-line)
- `array` — [CType class-C instance creation](#1521-ctype-class-c-instance-creation)
- `asciiValue` — [Character-built ins](#1286-character-built-ins)
- `asciiValue` — [Character-built ins](#1286-character-built-ins)
- `asciiValue` — [Character-built ins](#1286-character-built-ins)
- `asciiValue` — [Character-built ins](#1286-character-built-ins)
- `asInteger` — [Character-built ins](#1286-character-built-ins)
- `asInteger` — [Character-built ins](#1286-character-built-ins)
- `asInteger` — [Character-built ins](#1286-character-built-ins)
- `asInteger` — [Character-built ins](#1286-character-built-ins)
- `associationAt:` — [ProcessorScheduler-basic](#11362-processorscheduler-basic)
- `asString` — [FileStream-compiling](#1795-filestream-compiling)
- `asString` — [PositionableStream-compiling](#11334-positionablestream-compiling)
- `asString` — [Stream-compiling](#11577-stream-compiling)
- `asyncCallFrom:` — [CCallable-calling](#1213-ccallable-calling)
- `asyncCCall:args:` — [CompiledMethod class-c call-outs](#1401-compiledmethod-class-c-call-outs)
- `at:` — [PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `at` — [\<1\>:                               PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `at` — [\<2\>:                               VariableBinding-saving and loading](#12063-variablebinding-saving-and-loading)
- `at:/#at:put:` — [Collection-testing collections](#13715-collection-testing-collections)
- `at:/#at:put` — [\<1\>:                      SequenceableCollection-testing](#115111-sequenceablecollection-testing)
- `at:/#at:put` — [\<2\>:                      Stream-testing](#115718-stream-testing)
- `at:put:` — [BindingDictionary-accessing](#1101-bindingdictionary-accessing)
- `at:put` — [\<1\>:                           CScalar-accessing](#1452-cscalar-accessing)
- `at:put` — [\<2\>:                           CString class-accessing](#1491-cstring-class-accessing)
- `at:put` — [\<3\>:                           CString-accessing](#1493-cstring-accessing)
- `at:put` — [\<4\>:                           PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `at:put` — [\<5\>:                           PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `autoload` — [Autoload class-instance creation](#171-autoload-class-instance-creation)
- `autoload` — [Autoload class-instance creation](#171-autoload-class-instance-creation)
- `basicNew` — [Behavior-built ins](#194-behavior-built-ins)
- `basicNew:` — [Behavior-built ins](#194-behavior-built-ins)
- `basicPrint` — [Exception-built ins](#1726-exception-built-ins)
- `become:` — [Object-built ins](#11232-object-built-ins)
- `binaryRepresentationObject` — [Object-saving and loading](#112315-object-saving-and-loading)
- `binaryRepresentationObject` — [PluggableProxy class-accessing](#11311-pluggableproxy-class-accessing)
- `binaryRepresentationVersion` — [VersionableObjectProxy class-saving and restoring](#12071-versionableobjectproxy-class-saving-and-restoring)
- `blockAt:` — [CompiledBlock-saving and loading](#1385-compiledblock-saving-and-loading)
- `byte` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `byte` — [Class-instance creation](#1314-class-instance-creation)
- `byte` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `callFrom:into:` — [CCallable-calling](#1213-ccallable-calling)
- `cCall:returning:args:` — [CompiledMethod class-c call-outs](#1401-compiledmethod-class-c-call-outs)
- `changed` — [Object-change and update](#11233-object-change-and-update)
- `changed:` — [Object-change and update](#11233-object-change-and-update)
- `character` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `character` — [Class-instance creation](#1314-class-instance-creation)
- `character` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `checkError` — [FileDescriptor-basic](#1765-filedescriptor-basic)
- `class` — [Object-class type methods](#11234-object-class-type-methods)
- `close` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `close` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `close` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `close` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `close` — [FileDescriptor class-still unclassified](#1763-filedescriptor-class-still-unclassified)
- `cObject` — [CObject-conversion](#1368-cobject-conversion)
- `codePoint` — [Character-built ins](#1286-character-built-ins)
- `codePoint` — [Character-built ins](#1286-character-built-ins)
- `codePoint` — [Character-built ins](#1286-character-built-ins)
- `codePoint` — [Character-built ins](#1286-character-built-ins)
- `codePoint:` — [UnicodeCharacter class-built ins](#12021-unicodecharacter-class-built-ins)
- `collect:` — [ArrayedCollection-basic](#152-arrayedcollection-basic)
- `collect` — [\<1\>:                          BindingDictionary-copying](#1103-bindingdictionary-copying)
- `collect` — [\<2\>:                          BindingDictionary-copying](#1103-bindingdictionary-copying)
- `collect` — [\<3\>:                          SequenceableCollection-basic](#11512-sequenceablecollection-basic)
- `collection:map:` — [MappedCollection class-instance creation](#11081-mappedcollection-class-instance-creation)
- `compile:` — [Behavior-built ins](#194-behavior-built-ins)
- `compile:ifError:` — [Behavior-built ins](#194-behavior-built-ins)
- `continue:` — [BlockContext-accessing](#1121-blockcontext-accessing)
- `continue` — [\<1\>:                         ContextPart-accessing](#1413-contextpart-accessing)
- `continue` — [\<2\>:                         ContextPart-accessing](#1413-contextpart-accessing)
- `continue` — [\<3\>:                         MethodContext-accessing](#11131-methodcontext-accessing)
- `convertFromVersion:withFixedVariables:instanceVariables:for:` — [VersionableObjectProxy class-saving and restoring](#12071-versionableobjectproxy-class-saving-and-restoring)
- `copy` — [RunArray-copying](#11475-runarray-copying)
- `copyEmpty:` — [Object-class type methods](#11234-object-class-type-methods)
- `copyEmpty` — [\<1\>:                        WeakArray-conversion](#12153-weakarray-conversion)
- `create` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `create` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `create` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `create` — [FileDescriptor class-still unclassified](#1763-filedescriptor-class-still-unclassified)
- `day` — [Date-date computations](#1596-date-date-computations)
- `debuggingPriority` — [Behavior-pluggable behavior (not yet implemented)](#1917-behavior-pluggable-behavior-not-yet-implemented)
- `directoryFor:` — [PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `directoryFor` — [\<1\>:                     PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `directoryFor` — [\<2\>:                     PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `directoryFor` — [\<3\>:                     PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `directoryFor` — [\<4\>:                     PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `directoryFor` — [\<5\>:                     PackageLoader class-accessing](#11281-packageloader-class-accessing)
- `disableInterrupts` — [ProcessorScheduler-built ins](#11363-processorscheduler-built-ins)
- `display:` — [Stream-printing](#115714-stream-printing)
- `displayString` — [Number-converting](#11226-number-converting)
- `do:` — [Collection-converting](#1376-collection-converting)
- `do` — [\<1\>:                               Collection-enumeration](#1379-collection-enumeration)
- `do` — [\<2\>:                               RunArray-adding](#11473-runarray-adding)
- `do` — [\<3\>:                               RunArray-adding](#11473-runarray-adding)
- `do` — [\<4\>:                               RunArray-adding](#11473-runarray-adding)
- `do` — [\<5\>:                               SequenceableCollection-testing collections](#115112-sequenceablecollection-testing-collections)
- `do` — [\<6\>:                               SortedCollection-enumerating](#11566-sortedcollection-enumerating)
- `doesNotUnderstand:` — [MessageNotUnderstood-description](#11112-messagenotunderstood-description)
- `double` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `double` — [Class-instance creation](#1314-class-instance-creation)
- `double` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `dumpTo:` — [AlternativeObjectProxy class-instance creation](#121-alternativeobjectproxy-class-instance-creation)
- `dumpTo` — [\<1\>:                           DumperProxy class-instance creation](#1682-dumperproxy-class-instance-creation)
- `enableInterrupts` — [ProcessorScheduler-built ins](#11363-processorscheduler-built-ins)
- `ensure:` — [BlockClosure-unwind protection](#11110-blockclosure-unwind-protection)
- `ensure` — [\<1\>:                           BlockContext-accessing](#1121-blockcontext-accessing)
- `ensure` — [\<2\>:                           BlockContext-accessing](#1121-blockcontext-accessing)
- `ensure` — [\<3\>:                           ContextPart-accessing](#1413-contextpart-accessing)
- `ensure` — [\<4\>:                           ContextPart-accessing](#1413-contextpart-accessing)
- `ensure` — [\<5\>:                           ContextPart-built ins](#1414-contextpart-built-ins)
- `ensure` — [\<6\>:                           MethodContext-accessing](#11131-methodcontext-accessing)
- `ensure` — [\<7\>:                           MethodContext-accessing](#11131-methodcontext-accessing)
- `ensure` — [\<8\>:                           Process-basic](#11342-process-basic)
- `error:` — [Behavior-evaluating](#1912-behavior-evaluating)
- `error` — [\<1\>:                            Behavior-method dictionary](#1915-behavior-method-dictionary)
- `error` — [\<2\>:                            Behavior-method dictionary](#1915-behavior-method-dictionary)
- `error` — [\<3\>:                            Behavior-method dictionary](#1915-behavior-method-dictionary)
- `error` — [\<4\>:                            Behavior-method dictionary](#1915-behavior-method-dictionary)
- `error` — [\<5\>:                            Behavior-method dictionary](#1915-behavior-method-dictionary)
- `error` — [\<6\>:                            BlockClosure-exception handling](#1116-blockclosure-exception-handling)
- `error` — [\<7\>:                            CompiledMethod-compiling](#1408-compiledmethod-compiling)
- `examine` — [Object-debugging](#11238-object-debugging)
- `examineOn:` — [CCompound class-subclass creation](#1242-ccompound-class-subclass-creation)
- `examineOn` — [\<1\>:                        CCompound-debugging](#1243-ccompound-debugging)
- `exceptionHandlingInternal:` — [MethodContext-debugging](#11132-methodcontext-debugging)
- `fileIn` — [Stream-built ins](#11575-stream-built-ins)
- `fileIn` — [Stream-built ins](#11575-stream-built-ins)
- `finalize` — [Object-finalization](#112311-object-finalization)
- `finalize` — [Object-finalization](#112311-object-finalization)
- `float` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `float` — [Class-instance creation](#1314-class-instance-creation)
- `float` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `free` — [CObject-finalization](#1369-cobject-finalization)
- `from:to:keysAndValuesDo:` — [SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `fullName` — [FilePath-file name management](#1778-filepath-file-name-management)
- `generateMakefileOnto:` — [FileStream class-file-in](#1791-filestream-class-file-in)
- `halt` — [Halt-description](#1871-halt-description)
- `hash` — [Symbol class-symbol table](#11593-symbol-class-symbol-table)
- `hash` — [Symbol class-symbol table](#11593-symbol-class-symbol-table)
- `hash` — [Symbol class-symbol table](#11593-symbol-class-symbol-table)
- `identityHash` — [BindingDictionary-basic & copying](#1102-bindingdictionary-basic--copying)
- `ifCurtailed:` — [ContextPart-built ins](#1414-contextpart-built-ins)
- `ifCurtailed` — [\<1\>:                      Process-basic](#11342-process-basic)
- `ifTrue:ifFalse:` — [Symbol-basic](#11595-symbol-basic)
- `ifTrue:ifFalse` — [\<1\>:                   Symbol-basic](#11595-symbol-basic)
- `includes:` — [IdentitySet-testing](#1911-identityset-testing)
- `includes` — [\<1\>:                         WeakIdentitySet-accessing](#12161-weakidentityset-accessing)
- `includesClassNamed:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `includesGlobalNamed:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `includesKey:` — [AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `includesKey` — [\<1\>:                      AbstractNamespace-namespace hierarchy](#115-abstractnamespace-namespace-hierarchy)
- `inherit` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `inherit` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `int` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `int` — [Class-instance creation](#1314-class-instance-creation)
- `int` — [CType class-C instance creation](#1521-ctype-class-c-instance-creation)
- `int` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `int64` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `int64` — [Class-instance creation](#1314-class-instance-creation)
- `int64` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `int8` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `int8` — [Class-instance creation](#1314-class-instance-creation)
- `int8` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `integerPart` — [Number-truncation and round off](#112214-number-truncation-and-round-off)
- `join` — [Collection-enumeration](#1379-collection-enumeration)
- `key:class:defaultDictionary:` — [DeferredVariableBinding class-basic](#1611-deferredvariablebinding-class-basic)
- `keysAndValuesDo:` — [SequenceableCollection-enumerating](#11516-sequenceablecollection-enumerating)
- `line` — [Stream-built ins](#11575-stream-built-ins)
- `line` — [Stream-built ins](#11575-stream-built-ins)
- `loadFrom:` — [DumperProxy-saving and restoring](#1683-dumperproxy-saving-and-restoring)
- `lowerPriority` — [Process-basic](#11342-process-basic)
- `lowerPriority` — [Process-basic](#11342-process-basic)
- `mark:` — [Object-built ins](#11232-object-built-ins)
- `mark` — [\<1\>:                             Object-built ins](#11232-object-built-ins)
- `match:` — [FilePath-enumerating](#1777-filepath-enumerating)
- `match` — [\<1\>:                            FilePath-enumerating](#1777-filepath-enumerating)
- `match` — [\<2\>:                            FilePath-enumerating](#1777-filepath-enumerating)
- `mourn` — [Object-built ins](#11232-object-built-ins)
- `mourn` — [Object-built ins](#11232-object-built-ins)
- `name` — [FilePath-file name management](#1778-filepath-file-name-management)
- `name` — [VFS.ArchiveMember-accessing](#12091-vfsarchivemember-accessing)
- `new` — [AbstractNamespace class-instance creation](#111-abstractnamespace-class-instance-creation)
- `new` — [Behavior-instance creation](#1913-behavior-instance-creation)
- `new:` — [Behavior-instance creation](#1913-behavior-instance-creation)
- `newProcess` — [ContextPart-accessing](#1413-contextpart-accessing)
- `next` — [Generator class-instance creation](#1851-generator-class-instance-creation)
- `next` — [Generator-stream protocol](#1852-generator-stream-protocol)
- `next` — [Generator-stream protocol](#1852-generator-stream-protocol)
- `next` — [SharedQueue-accessing](#11532-sharedqueue-accessing)
- `next` — [Stream-positioning](#115713-stream-positioning)
- `nonVersionedInstSize` — [VersionableObjectProxy class-saving and restoring](#12071-versionableobjectproxy-class-saving-and-restoring)
- `not` — [Symbol-basic](#11595-symbol-basic)
- `not` — [Symbol-basic](#11595-symbol-basic)
- `notify` — [Semaphore-builtins](#11503-semaphore-builtins)
- `notifyAll` — [Semaphore-builtins](#11503-semaphore-builtins)
- `on:` — [AlternativeObjectProxy class-instance creation](#121-alternativeobjectproxy-class-instance-creation)
- `on:do:` — [BlockClosure-unwind protection](#11110-blockclosure-unwind-protection)
- `on:do` — [\<1\>:                            Exception-exception handling](#17210-exception-exception-handling)
- `on:do` — [\<2\>:                            Exception-exception handling](#17210-exception-exception-handling)
- `on:do` — [\<3\>:                            Exception-exception handling](#17210-exception-exception-handling)
- `on:do` — [\<4\>:                            Exception-exception handling](#17210-exception-exception-handling)
- `on:index:` — [PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `outer` — [Exception-exception handling](#17210-exception-exception-handling)
- `outer` — [Exception-exception handling](#17210-exception-exception-handling)
- `outer` — [Exception-exception handling](#17210-exception-exception-handling)
- `parse:with:do:ifError:` — [Getopt class-instance creation](#1861-getopt-class-instance-creation)
- `parseVariableString:` — [Behavior-parsing class declarations](#1916-behavior-parsing-class-declarations)
- `pass` — [Exception-exception handling](#17210-exception-exception-handling)
- `peek` — [Generator-stream protocol](#1852-generator-stream-protocol)
- `peek` — [Generator-stream protocol](#1852-generator-stream-protocol)
- `PM` — [DateTime-computations](#1605-datetime-computations)
- `pointer` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `pointer` — [Class-instance creation](#1314-class-instance-creation)
- `pointer` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `position` — [PositionableStream-accessing-reading](#11332-positionablestream-accessing-reading)
- `postLoad` — [HashedCollection-saving and loading](#1888-hashedcollection-saving-and-loading)
- `postLoad` — [Object-saving and loading](#112315-object-saving-and-loading)
- `postLoad` — [PluggableProxy-saving and restoring](#11312-pluggableproxy-saving-and-restoring)
- `postLoad` — [SingletonProxy-saving and restoring](#11543-singletonproxy-saving-and-restoring)
- `postStore` — [PluggableProxy class-accessing](#11311-pluggableproxy-class-accessing)
- `preStore` — [PluggableProxy class-accessing](#11311-pluggableproxy-class-accessing)
- `primCompile:` — [Behavior-built ins](#194-behavior-built-ins)
- `primDefineExternFunc:` — [DLD class-dynamic linking](#1672-dld-class-dynamic-linking)
- `print` — [Object-printing](#112313-object-printing)
- `printHierarchy` — [Behavior-printing hierarchy](#1918-behavior-printing-hierarchy)
- `printNl` — [Object-printing](#112313-object-printing)
- `printOn:` — [Character-printing](#12810-character-printing)
- `printOn` — [\<1\>:                          Exception-built ins](#1726-exception-built-ins)
- `printOn` — [\<2\>:                          Object-printing](#112313-object-printing)
- `printOn` — [\<3\>:                          Regex-printing](#11444-regex-printing)
- `printOn` — [\<4\>:                          String-printing](#11589-string-printing)
- `printOn` — [\<5\>:                          Symbol-basic](#11595-symbol-basic)
- `printOn` — [\<6\>:                          Symbol-basic](#11595-symbol-basic)
- `printOn` — [\<7\>:                          Symbol-storing](#11599-symbol-storing)
- `printOn` — [\<8\>:                          UndefinedObject-printing](#12017-undefinedobject-printing)
- `printString` — [Object-printing](#112313-object-printing)
- `printString` — [Regex-printing](#11444-regex-printing)
- `printString` — [ScaledDecimal-printing](#11486-scaleddecimal-printing)
- `printString` — [String-printing](#11589-string-printing)
- `printString` — [Symbol-storing](#11599-symbol-storing)
- `printStringRadix:` — [Integer-printing](#1929-integer-printing)
- `ptr` — [CType class-C instance creation](#1521-ctype-class-c-instance-creation)
- `quit:` — [Process-basic](#11342-process-basic)
- `raisePriority` — [Process-basic](#11342-process-basic)
- `raisePriority` — [Process-basic](#11342-process-basic)
- `read` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `read` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `read` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `read` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `read` — [FileDescriptor class-still unclassified](#1763-filedescriptor-class-still-unclassified)
- `readWrite` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `readWrite` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `readWrite` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `readWrite` — [FileDescriptor class-still unclassified](#1763-filedescriptor-class-still-unclassified)
- `reconstructOriginalObject` — [PluggableProxy-saving and restoring](#11312-pluggableproxy-saving-and-restoring)
- `reconstructOriginalObject` — [SingletonProxy-saving and restoring](#11543-singletonproxy-saving-and-restoring)
- `removeToBeFinalized` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `removeToBeFinalized` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `removeToBeFinalized` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `removeToBeFinalized` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `removeToBeFinalized` — [FileDescriptor class-still unclassified](#1763-filedescriptor-class-still-unclassified)
- `resolveBinding` — [DeferredVariableBinding class-basic](#1611-deferredvariablebinding-class-basic)
- `return:` — [BlockClosure-exception handling](#1116-blockclosure-exception-handling)
- `return` — [\<1\>:                           BlockClosure-exception handling](#1116-blockclosure-exception-handling)
- `return` — [\<2\>:                           BlockClosure-exception handling](#1116-blockclosure-exception-handling)
- `return` — [\<3\>:                           BlockClosure-exception handling](#1116-blockclosure-exception-handling)
- `return` — [\<4\>:                           BlockClosure-exception handling](#1116-blockclosure-exception-handling)
- `secondClock` — [Time class-basic (UTC)](#11991-time-class-basic-utc)
- `select:` — [PositionableStream-class type methods](#11333-positionablestream-class-type-methods)
- `self` — [CCallable-calling](#1213-ccallable-calling)
- `self` — [CCallable-calling](#1213-ccallable-calling)
- `self` — [CCallable-calling](#1213-ccallable-calling)
- `self` — [CCallable-calling](#1213-ccallable-calling)
- `selfSmalltalk` — [CCallable-calling](#1213-ccallable-calling)
- `selfSmalltalk` — [CCallable-calling](#1213-ccallable-calling)
- `selfSmalltalk` — [CCallable-calling](#1213-ccallable-calling)
- `selfSmalltalk` — [CCallable-calling](#1213-ccallable-calling)
- `short` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `short` — [Class-instance creation](#1314-class-instance-creation)
- `short` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `signal` — [Exception-exception handling](#17210-exception-exception-handling)
- `signal:atMilliseconds:` — [ProcessorScheduler-timed invocation](#11368-processorscheduler-timed-invocation)
- `singleStepWaitingOn:` — [Process-basic](#11342-process-basic)
- `size` — [UnicodeString-multibyte encodings](#12036-unicodestring-multibyte-encodings)
- `size:stCtime:stMtime:stAtime:isDirectory:` — [VFS.ArchiveFile-ArchiveMember protocol](#12081-vfsarchivefile-archivemember-protocol)
- `skip:` — [FileDescriptor-positioning](#17613-filedescriptor-positioning)
- `skip` — [\<1\>:                             PositionableStream-positioning](#11335-positionablestream-positioning)
- `skip` — [\<2\>:                             Stream-positioning](#115713-stream-positioning)
- `skipSeparators` — [Stream-positioning](#115713-stream-positioning)
- `specialSelectors` — [CompiledCode class-tables](#1393-compiledcode-class-tables)
- `species` — [Object-class type methods](#11234-object-class-type-methods)
- `storage` — [CObject-accessing](#1365-cobject-accessing)
- `subclass:declaration:` — [CCompound class-subclass creation](#1242-ccompound-class-subclass-creation)
- `subclassResponsibility` — [CompiledMethod-invoking](#1409-compiledmethod-invoking)
- `subclassResponsibility` — [Number-testing](#112213-number-testing)
- `subclassResponsibility` — [Number-testing](#112213-number-testing)
- `subclassResponsibility` — [Number-testing](#112213-number-testing)
- `subclassResponsibility` — [Number-testing](#112213-number-testing)
- `timeZoneAbbreviation` — [DateTime-time zones](#16010-datetime-time-zones)
- `trigger` — [DelayedAdaptor-accessing](#1631-delayedadaptor-accessing)
- `uint` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `uint` — [Class-instance creation](#1314-class-instance-creation)
- `uint` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `uint64` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `uint64` — [Class-instance creation](#1314-class-instance-creation)
- `uint64` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `upTo:` — [PositionableStream-class type methods](#11333-positionablestream-class-type-methods)
- `ushort` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `ushort` — [Class-instance creation](#1314-class-instance-creation)
- `ushort` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `utf32` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `utf32` — [Class-instance creation](#1314-class-instance-creation)
- `utf32` — [UndefinedObject-class polymorphism](#12013-undefinedobject-class-polymorphism)
- `value` — [Character-built ins](#1286-character-built-ins)
- `value` — [Character-built ins](#1286-character-built-ins)
- `value` — [Character-built ins](#1286-character-built-ins)
- `value` — [Character-built ins](#1286-character-built-ins)
- `value` — [Continuation-invocation](#1422-continuation-invocation)
- `value` — [PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `value` — [PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `value` — [PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `value` — [PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `value` — [Promise class-creating instances](#11381-promise-class-creating-instances)
- `value` — [Promise-accessing](#11382-promise-accessing)
- `value` — [Promise-accessing](#11382-promise-accessing)
- `value` — [Promise-still unclassified](#11385-promise-still-unclassified)
- `value:` — [Continuation-invocation](#1422-continuation-invocation)
- `value` — [\<1\>:                            PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `value` — [\<2\>:                            PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `value` — [\<3\>:                            PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `value` — [\<4\>:                            PluggableAdaptor class-creating instances](#11301-pluggableadaptor-class-creating-instances)
- `value` — [\<5\>:                            UnicodeCharacter class-built ins](#12021-unicodecharacter-class-built-ins)
- `valueWithoutPreemption` — [ProcessorScheduler-priorities](#11366-processorscheduler-priorities)
- `valueWithReceiver:withArguments:` — [CompiledMethod class-instance creation](#1402-compiledmethod-class-instance-creation)
- `valueWithUnwind` — [BlockClosure-unwind protection](#11110-blockclosure-unwind-protection)
- `valueWithUnwind` — [MethodContext-accessing](#11131-methodcontext-accessing)
- `Variable` — [BindingDictionary-accessing](#1101-bindingdictionary-accessing)
- `Variable` — [BindingDictionary-accessing](#1101-bindingdictionary-accessing)
- `wait` — [RecursionLock-accessing](#11432-recursionlock-accessing)
- `word` — [Behavior-testing the class hierarchy](#1923-behavior-testing-the-class-hierarchy)
- `write` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `write` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `write` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `write` — [FileDescriptor class-instance creation](#1762-filedescriptor-class-instance-creation)
- `write` — [FileDescriptor class-still unclassified](#1763-filedescriptor-class-still-unclassified)
- `yield:` — [Generator class-instance creation](#1851-generator-class-instance-creation)
