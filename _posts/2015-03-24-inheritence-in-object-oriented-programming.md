---
layout: post
title: Inheritence in Object-Oriented-Programming
date: 2015-03-24 17:07:46.000000000 +08:00
permalink: /:title
---

##Introduction

The main addition that **OOP** adds to component-based programming is inheritence. OOP allows defining a class incrementally by extending existing classes.

While using inheritence, it must be taken good care of. It may lost control if your application doesn't use good design patterns.

##Inheritence Graph

Inheritence is a way to construct new classes from existing classes. 

* A method in `class C` overrrdes any method with the same label in all of `C`'s superclass.
* A class that inherits from exactly one class is said to use **single inheritence**. Inheritence from more than one class is called **multiple inheritence**.
* A class hierarchy with the superclass relation can be seen as a directed graph with the current class being the root.
* The inheritence is directed and acyclic, there cannot be any inherit cicle in the inheritence hierachy.
* After striking out all overridden methods, each remaing method should have a unique label.

<img src="http://deltax.qiniudn.com/Class-Hierarchy.png?attname=&e=1427254344&token=YJb_IPQrTSw1ox9LenQDH1HRcgHii9w_bp9ddmcz:YuVSCsLdlEzG3RyHdiJQmj7fE2Y" style="display:block;margin:auto"/>
	
##Method Access Control

When executing inside an object, we often want to call another method in the same object, do a kind of recursive invocation. 

We need two ways to do a recursive call. They are called static binding and dynamic binding.

Both of them are needed when using inheritence to override methods.

###Dynamic Binding

Dynamic binding allows the new class to correctly extend the old class by letting old methods can new methods. Even the new method did not exist whtn the old method is defined. 

This is written as `{self M}`. This chooses the method matching `M` that is visible in the current object.

###Static Binding

Static binding allows the new methods call the old methods when they have to.

This is written `C, M` (with a comma), where `C` is a class that defines a method matching `M`. This chooses the method matching `M` tgat us visible in class `C`.

##Encapsulation Control

The principle of controlling encapsulation in an object-oriented language is to limit access to class members (attributes and methods) according to the requirements of the application architecure.

###Private and Public Scopes

The two most basic scopes are private and public.

* A private member is one which is only visible in the object instance. The object instance can see all members defined in its class and its superclasses.
* A public member is one which is visible everywhere in the program.

These definitions of private and public are natural if classes are used to construct data abstractions.

1. A class is not the same thing as the data abstractions it defines. The class is increment.
2. Attributes are internal to the data abstraction and should be invisible from the outside. This is exactly the definition of private scope.
3. Methods are make up the external interface of the data abstraction, so they should be visible to all entities that reference the abstraction. This is exactly the definition of public scope.

###Private Methods

When a method head is a name value, then its scope limited to all instances of the class, but not to the subclasses or their instances. These method is only visible inside the class definition. 

```
class C
	meth A(X)
		% Method body
	end
end
```

And with `!` we can capture the method outside the scope.

```
local
	A={NewName}
in
	class C
		meth !A(X)
			% Method body
		end
	end
end
```

This creates a name at class definition time.

###Protected Methods

In `C++`,  method is protected if it is accessible only in the class it is defined or in descendant classes (and all instances of this classes).

##Forwarding and Delegation

Inheritence is one way to reuse functionality when defining new functionality. But it can be tricky to use, because it implies a tight binding between classes. 

When developing a application, we want to decomposition different components, always inheritence is not a greate choice for this reason.

Sometimes we use looser approaches. Two such approaches are forwarding and delegation.

<img src="http://deltax.qiniudn.com/Delegation-Forwarding.png?attname=&e=1427254344&token=YJb_IPQrTSw1ox9LenQDH1HRcgHii9w_bp9ddmcz:56KTT0g8JxSKHlqaNzvLtqiiXOs" style="display:block;margin:auto"/>

###Forwarding

An object can forward any message to another object. In this system, we implement this strategy in `otherwise` method.

```
local
	class ForwardMixin
		attr Forward:none
		meth setForward(F) Forward:= F end
		meth otherwise(M)
			if @Forward==none then raise undefinedMethod end
			else {@Forward M} end
		end
	end
in
	fun {NewF Class Init}
		{New class $ from Class ForwardMixin end Init}
	end
end
```
	
Objects created with `NewF` have a method `setForward(F)` that lets them set dynamically the object to which the object will forward messages if they do not understand.

```
class C1
	meth init skip end
	meth cube(A B) B=A*A*A end
end

class C2
	meth init skip end
	meth square(A B) B=A*A end
end
Obj1={NewF C1 init}
Obj2={NewF C2 init}
{Obj2 setForward(Obj1)}
```

When `{Obj2 cube(10 X)}` is called, `Obj2` forward this message to `Obj1` and bind the result to `X`.

###Delegation

Delegation is powerful way to struture a system dynamically. **It lets us build a hierachy among objects instead of among classes**.

Delegation can achieve the same effects as inheritence, with two main differences, but with objects instead of classes, and can be changed at any time.

```
local
	SetSelf={NewName}
	class DelegateMixin
		attr this Delegate:none
		meth !SetSelf(S) this:=S end
		meth set(A X) A:=X end
		meth get(X ?X) X=@A end
		meth setDelegate(D) Delegate:=D End
		meth Del(M S) SS in
			SS:=this this:=S
			try {self M} finally this:=SS end
		end
		meth call(M) SS in
			SS:=this this:=self
			try {self M} finally this:=SS end
		end
		meth otherwise(M)
			if @Delegate==none then
				raise undefinedMethod end
			else
				{@Delegate Del(M @this)}
			end
		end
	end
in
	fun {NewD Class Init}
		Obj={New class $ from Class DelegateMixin end Init}
	in
		{Obj SetSelf(Obj)}
		Obj
	end
end
```
	
If there are two objects `Obj1` and `Obj2`, suppose there exists a method `setDelegate` such that `{Obj2 setDelegate(Obj1)}` sets `Obj2` to delegate to `Obj1`. And `Obj1` behaves like `Obj2`'s superclass.

When we enter the `Del` method, we should preserve our `this` value in a temp variable. Because the `{Self M}` should executes in the `Obj1` context and change `Obj1` attributes.

```
class C1
   attr i:0
   meth init skip end
   meth inc(I)
      {@this set(i {@this get(i $)}+I)}
   end
   meth browse
      {@this inc(10)}
      {Browse c1#{@this get(i $)}}
   end
   meth c {@this browse} end end
Obj1={NewD C1 init}
class C2
   attr i:0
   meth init skip end
   meth browse
      {@this inc(100)}
      {Browse c2#{@this get(i $)}}
   end
end
Obj2={NewD C2 init}
{Obj2 setDelegate(Obj1)}
```
	
If we execute

```
{Obj1 call(browse)}
{Obj2 call(browse)}

% c1#10 c2#100
```


But if we change the `Del` procedure like this:

```
meth Del(M S) in
	{self M}
end
```

The previous execution will browse

```
c1#100 c2#0
```

	
Because the `Obj1` does not preserve its attributes, `this` in `{self M}` means `Obj1` instead of `Obj2`. This make no sense, delegation indeed is design pattern that let other handle the message and deal with own attributes. If we do not save the context in `Del`, it just like send message to `Obj2`.

##Reflection

A system is reflection if it can inspect part of its execution while running.

Reflection can be purely introspective or intrusive.

* Purely Introspective
	* Only reading the internal state without modifying it.
* Instrutive
	* Both reading and modifying the internal state.

###Meta-Object Protocols

The description of how an object system works at a basic level is called meta-object protocol. The ability to change the meta-object protocol is a powerful way to modify an obejct system. It is used for many purposes: debugging, customzing, and separation of concerns.
	
###Methig Wrapping

A common use of meta-object protocol is to do method wrapping. We can write a tracer to track the behavior of an object-oriented program.

```
fun {TraceNew Class Init}
	Obj={New Class Init}
	proc {TraceObj M}
		{Browse entering({Label M)}
		{Obj M}
		{Browse exiting({Label M)}
	end
in TraceObj end
```

If an object is created with this procedure, every method will be traced.

A second way is to implement this with a class instead of a procedure.

```
fun {TraceNew2 Class Init}
   Obj={New Class Init}
   TInit={NewName}
   class Tracer
      meth !TInit skip end
      meth otherwise(M)
	 {Browse entering({Label M})} {Obj M}
	 {Browse exiting({Label M})}
      end
   end
in {New Tracer TInit} end
```
	
This strategy is used dynamic class creation, the `otherwise` method and a freshname `TInit`.

###Reflection of object state

We would like to ba able to read and write the whole state of an object, independant of the object's class.
