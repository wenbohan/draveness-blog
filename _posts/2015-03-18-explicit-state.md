---
layout: post
title: Explicit State
date: 2015-03-18 22:34:39.000000000 +08:00
permalink: /:title
---


##State

A `state` is a sequence of values in time that contains the intermediate results of a desired computation.

There are different ways that state can be used in a program.

* Implicit or declarative state
	* The state need only exist in the mind of the programmer. It does not need any support at all from the computation model.
* Explicit state
	* A procedure is a state whose lifetime extends over more than one procedure call without being present in the procedure's arguments.
	
		```
		local
			C={NewCell 0}
		in
			fun {SumList Xs S}
				C:=@C+1
				case Xs
				of nil then S
				[] X|Xr then {SumList Xr X+S}
				end
			end
			fun {SumCount} @C end
		end
		
		% In this procedure, C is not an arugment for the function SumList and we can use another helper function SumCount to get its value.
		```
			
	* With explicit state, data abstraction gain tremendously in modularity since is is possible to **encapsulate an explicit state inside a data abstraction**. And the access to state is limited according to the operations of the data abstraction.


##Data Abstraction

**Data abstraction** is a way of using data in abstract fashion, we can use the data without having to deal with its implementation. It contains a set of instances that can be used according to certain rules called interface.

###Organize Data Abstraction

* `Openness and Security`
	* A data abstraction is `secure` if its encapsulation is enforced by the language. Otherwise it is open. If the data abstraction is open, the encapsulation should be **enforced by programmer discipline**.
* `Bundling`
	* A data abstraction is `unbundled` if it defines two kinds of entities, called **value and operation**.
	* A data abstraction is `bundled` if it defines just one kind of entity, called **object**, that combines the notion of value and operation. (Which is sometimes called a precedural data abstraction, `PDA`)
* `Explicit`
	* A data is stateful if it uses **explicit state**. Otherwise it is known as stateless or declarative.
	
We use these three axes, secure, bundling and explit state to organize data abstraction is `8` ways.

###Open Declarative Stack


```
% This version is open, declarative and unbundled.

declare	
local
     fun {NewStack} nil end
     fun {Push S E} E|S end
     fun {Pop S ?E} case S of X|S1 then E=X S1 end end
     fun {IsEmpty S} S==nil end
in
     Stack=stack(new:NewStack push:Push pop:Pop isEmpty:IsEmpty)
end
```


###Secure Declarative Unbundled Stack


```
% This version is secure, declarative and unbundled. 

declare
local Wrap Unwrap
     {NewWrapper Wrap Unwrap}
     fun {NewStack} {Wrap nil} end
     fun {Push S E} {Wrap E|{Unwrap S}} end
     fun {Pop S ?E} case {Unwrap S} of X|S1 then E=X {Wrap S1} end end
     fun {IsEmpty S} {Unwrap S}==nil end
in
     Stack=stack(new:NewStack push:Push pop:Pop isEmpty:IsEmpty)
end
```


The stack is unwrapped when entering an ADT and wrapped when the operation exits.
	
###Secure Declarative Bundled Stack

```
% This version is secure, declarative and bundled.

local
     fun {StackObject S}
          fun {Push E} {StackObject E|S} end
          fun {Pop ?E}
               case S of X|S1 then E=X {StackObject S1} end end
          fun {IsEmpty} S==nil end
     in stack(push:Push pop:Pop isEmpty:IsEmpty) end
in
     fun {NewStack} {StackObject nil} end
end
```

We can make a data abstraction secure only use `higher-order` programming instead of using explicit state and name.

Because this version is both secure and bundled, we cansider it as a declarative form of `object-oriented programming`.

###Secure Stateful Bundled Stack

```
% This version is secure, stateful and bundled.

declare
fun {NewStack}
     C={NewCell nil}
     proc {Push E} C:=E|@C end
     fun {Pop} case @C of X|S1 then C:=S1 X end end
     fun {IsEmpty} @C=nil end
in
     stack(push:Push pop:Pop isEmpty:IsEmpty)
end
```

In this version the objectis represented by a recored of procedure values. This version provides the basic functionality of object-oriented programming, namely a group of operations `methods` with a hidden internal state.


###Secure Stateful Bundled Stack With Procedure Dispatching

```
% This version is secure, stateful and bundled.

declare
fun {NewStack}
     C={NewCell nil}
     proc {Push E} C:=E|@C end
     fun {Pop} case @C of X|S1 then C:=S1 X end end
     fun {IsEmpty} @C=nil end
in
     proc {$ Msg}
          case Msg
          of push(X) then {Push X}
          [] pop(?E) then E={Pop}
          [] isEmpty(?B) then B={IsEmpty}
     end
end
```


This is called procedure dispatching as opposed to the previous version which uses record dispatching. It is another way to implement secure, stateful bundled stack. With this approach, we use `{S.push X}` to invocate method `push`.

###Secure Stateful Unbundled Stack


```
% This version is secure, stateful and unbundled.

declare
local Wrap Unwrap
     {NewWrapper Wrap Unwrap}
     fun {NewStack} {Wrap {NewCell nil}} end
     proc {Push S E} C={Unwrap S} in C:=E|@C end
     fun {Pop S}
          C={Unwrap S} in case @C of X|S1 then C:=S1 X end end
     fun {IsEmpty S} @{Unwrap S}==nil end
in
     Stack=stack(new:NewStack push:Push pop:Pop isEmpty:IsEmpty)
end
```


This style is little used in object-oriented programming, but deserves to be more widely known. In this version, we group four operations in a module.

##Polymorphism

`Polymorphism` is the ability of an entity to take om many forms. In the context of data abstraction, we say an operation is polymorphic if it works correct for arguments of different types.

* The `object` stype has an advantage over the `ADT` style in that polymorphism is particularly easy to express.
* The `ADT` style gives more freedom to make efficient implementation.

###An Example: Collection Type

We implement a collection type in both `object` and `ADT` style which with three operations.

First, we use `ADT` to implement the stateful unbundled collection:

```
local Wrap Unwrap
	{NewWrapper Wrap Unwrap}
	fun {NewCollection} {Wrap {Stack.new}} end
	proc {Put C X} S={Unwrap C} in {Stack.push S X} end
	fun {Get C} S={Unwrap C} in {Stack.pop S} end
	fun {IsEmpty C} {Stack.isEmpty {Unwrap C}} end
in
	Collection=collection(new:NewCollection put:Put get:Get
						  isEmpty:IsEmpty)
end
```

Then, implement this with object style:

```
fun {NewCollection}
	S={NewStack}
	proc {Put X} {S.put X} end
	fun {Get X} {S.pop} end
	fun {IsEmpty} {S.isEmpty} end
in
	collection(put:Put get:Pop isEmpty:IsEmpty)
end
```

Now we have out colletion type with both styles, in order to compare the difference between them, let us add an operation `union` to this collection type.

###Adding a `union` Operation in the ADT case

To implement `union`, let us introduce a control abstraction:


```
proc {DoUntil BF S}
	if {BF} then skip else {S} {DoUntil BF S} end
end
```


With `DoUntil`, we can implement the new `Collection` type as follows.

```
% Use Internal representations

local Wrap Unwrap
	...
	proc {Union C1 C2}
	S1={Unwrap C1} S2={Unwrap C2} in
		{DoUntil fun {$} {Stack.isEmpty S2} end
		proc {$} {Stack.push S1 {Stack.pop S2}} end}
	end
in
	Collection=collection(... union:Union)
end

% Use external interfaces

local Wrap Unwrap
	...
	proc {Union C1 C2}
	S1={Unwrap C1} S2={Unwrap C2} in
		{DoUntil fun {$} {Collection.isEmpty S2} end
		proc {$} {Collection.put S1 {Collection.get S2}} end}
	end
in
	Collection=collection(... union:Union)
end	
```

	
We have choice of whether or not to use the internal representation of each collection argument. This gives us the freedom to make a **more efficient implementation**.

###Adding a `union` Operation in the Object case

Let us implement `union` operation in object stype. This is called as `{C1 union(C2)}`.

```
% Use internal representation of C1 but external interface of C2

fun {NewCollection}
	S1={NewStack}
	...
	proc {Union C2}
		{DoUntil C2.isEmpty
		proc {$} {S1.push {C2.get}} end}
	end
in
	collection(... union:Union)
end
```

	
The implementation uses the **internal representation** of `C1` but the external interface of `C2`. This is a crucial difference with the `ADT` stype. We can also use both **external interfaces** to implement this operation again.

```
% Use external interfaces

fun {NewCollection}
	S1={NewStack}
	...
	proc {Union C2}
		{DoUntil C2.isEmpty
		proc {$} {This.push {C2.get}} end}
	end
	This=collection(... union:Union)
in
	This
end
```


The object `C1` refers to itself through the variable `This`.

###Decision between ADT and Object styles

* The `ADT` style can be more efficient because it allows accessing both internal representations.
* Sometimes the `ADT` style is the only one that works. Especially when we deal with addtion between integer.
* The `object` style provides polyphism "for free".
* The `object` style is not limited to sequential objects.
* The 'ADT` style provides polymorohism if the language has first-class modules.
* If we use the `ADT` style without first-class modules, then we must write new code to get types to interoperate.
