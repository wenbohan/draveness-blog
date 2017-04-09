---
layout: post
title: Active Object
date: 2015-03-30 22:05:38.000000000 +08:00
permalink: /:title
---


An active object is a port object whose behavior is defined by a class. It consists of a port, a thread that reads messages from the port's stream, and an object that is a class inheritance.

Active objects combine the abilities of OOP and the abilities of message-passing concurrency.

With respect to active obejects, the other obejcts of this object are called _passive objects_, since they have an internal thread.

#NewActive Abstraction

The behavior of avtive objects is defined with a class. Sending a message to an active object is the same as sending message to an object. And the invocation of the method is asynchronous. It returns immediately without waiting until the message has been handled.

```
fun {NewActive Class Init}
   Obj={New Class Init}
   P
in
   thread S in
      {NewPort S P}
      for M in S do {Obj M} end
   end
   proc {$ M} {Send P M} end
end
```

This makes defining active objects very intuitive.

#Synchronous Abstraction

A synchronous invocation `{Obj M}` does not return until the method corresponding to `M` is completely executed. Here is the definition of `NewSync`, which creates a synchronous active object.

```
fun {NewSync Class Init}
P Obj={New Class Init} in
	thread S in
		{NewPort S P}
		for M#X in S do {Obj M} X=unit end
	end
	proc {$ M} X in {Send P M#X} {Wait X} end
end
```

Each message sent to the object contains a synchronization token `X`, which is bound only when the message is completely handled.

#Active Objects with Exception Handling

Use exception handling means add `try catch` in the statement. The abstraction needs another argument whether or not an exception occurred.

The extra argument is bound to `normal` if the invocation completes normally, and to `exception(E)` if the object raises the exception `E`.

```
fun {NewActiveExc Class Init}
P Obj={New Class Init} in
	thread S in
		{NewPort S P}
		for M#X in S do
			try {Obj M} X=normal
			catch E then X=exception(E) end
		end
	end
	proc {$ M X} {Send P M#X} end
end
```
