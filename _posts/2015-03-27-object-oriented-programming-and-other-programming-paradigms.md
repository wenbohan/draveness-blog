---
layout: post
title: Object-Oriented-Programming and Other Programming Paradigms
date: 2015-03-27 03:09:33.000000000 +08:00
permalink: /:title
---


Object-Oriented Programming is one way to structure programs which is most often used together with explicit state. The main difference between this computational model to other is **polymorphism** and **inheritance**.

In my opinion, this computational model is important but not magic. There are many opponents and different ideas.

[Was object-oriented programming a failure?](https://www.quora.com/Was-object-oriented-programming-a-failure)

[What are some programming paradigms other than Object Oriented?](https://www.quora.com/What-are-some-programming-paradigms-other-than-Object-Oriented)

#Higher-order Programming

Object-oriented programming and high-order programming are closely related. A new sorting routine can be created by giving a particular order function.

We can write this in high-order programming:

```
proc {NewSortRoutine Order ?SortRoutine}
	proc {SortRoutine InL OutL}
		% ... {Order X Y} calculates order
	end
end

proc {Order X Y ?B}
	B=(X<Y)
end

SortRoutine={NewSortRoutine Order}
```

In `OOP`, this can be written as follows:

```
class SortRoutineClass
	attr ord
	meth init(Order)
		ord:=Order
	end
	meth sort(InL OutL)
		% ... {@ord order(X Y $)} calculates order
	end
end

class OrderClass
	meth init skip end
	meth order(X Y B)
		B=(X<Y)
	end
end

SortRoutine={New SortRoutineClass init({New OrderClass init})}
```

##Embellishments

Procedure values and objects are closed related. Let us now compare higher-order and object-oriented programming more carefully.

The main difference is that `OOP` embellishes high-order programming. With embellishments, object-oriented provides a collection of additional idioms beyond procedural abstraction:

* Explicit state can be defined and used easily.
* Multiple methods that share the same explicit state can be defined easily.
* Classes are provided, which define a set of methods and can be instantiated. If objects are like procedures, then classes are like procedures that return procedures.
* Inheritance is provided, to define new sets of methods from existing sets.
* Different degrees of encapsulation can be defined between classes and obejcts.

These mechanisms do not provide any fundamentally new ability. All these things can be implemented with high-order programming, explicit state and name values.

`OOP` is an abstraction that provides a rich notation to use any or all of these mechanisms together. But this is a double-edged sword.

* It makes the abstraction particularly useful for many programming tasks.
* The abstraction has a complex semantics and is hard to reason about.

##Common Limitations

The object system defined here is particularly close to high-order programming. But not all the object system is so close. In common use, the following characteristics are aften absent or cumbersome to use:

* Classes are values
	* Classes can be created at run time, passed as arguments, and stored in data structures.
* Full lexical scoping
	* Language supports procedure values with external references.
* First-class messages
	* Allow messages to be values in the languages.
	
There are also some object-oriented languages do not support high-order programming because they define procedure values with lexical scoping at run time. Many of the mechanisms can be obtained through inheritanceand encapsulation.

* A procedure value can be encoded as object.
	* The object's attributes represent the procedure value's external references and the method arguments are the procedure value's arguments.
* A generic procedure can be encoded as an abstract class.
	* A generic procedure is one that tkes procedure arguments and return a specific procedure. An abstract class is a class with undefined methods. And the methods are implemented in subclasses.
	
##Should everything be an object?

Now, let us discover the practical of everything is object.

###String Objects

A sensible way to define the principle is as "all language entities should be instances of data abstractions with as many generic properties as possible." There are six properties this principle implies.

* All language entities should be defined with the object style.
* All language entities should be defined in the terms of classes can be instantiated.
* All language entities should be extensible with inheritance.
* All language entities should have a unique identity.
* All language entities should excapsulate a state.
* All language entities should be accessed with a uniform syntax.

In most languages, not all entities are strong objects. An integer in Objective-C is a pure value in the `ADT` style. It is not defined by a class or encapsulate a state. 

And there is not any language only have strong objects.

1. The ADT style is sometimes essential.
2. Stateless entities can play an important role.
3. Not all entities need a unique identity.
4. The simplicity of a uniform syntax is illusory.

With them, the powerful reasoning techniques of declarative programming become possible.

###Objects and program complexity

How can one predict a particular object's behavior. It depends on two factor:

1. Its internal state, which potentially depends on all past calls. These calls can be done from many parts of the program.
2. Its textual definiation, which depends on all classes it inherits from. These classes can be defined in many places in the program text.

###Uniform object syntax

A language's syntax should help and not hinder programmers in designing, writing and reasoning about programs. An important principle  in syntax design is form mirrors content.
