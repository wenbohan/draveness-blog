---
layout: post
title: Parameter Passing Mechanisms
date: 2015-03-19 00:47:50.000000000 +08:00
permalink: /:title
---


The operation of a data abstraction can have arguments and results. Many different mechanisms have been divised to pass the arguments and results between a calling program and an abstraction.

###Call by Reference

The identity of a **language entity is passed to the procedure**. The procedure can then use this language entity freely. This is the primitive mechanism used by the computation models of the book for all language entities including dataflow variables and cells.

###Call by Variable

This is a special case of call by reference. **The identity of a cell is passed to the procedure**.

```
proc {Sqr A}
	A:=@A*@A
end
local
	C={NewCell 0}
in
	C:=25
	{Sqr C}
	{Browse @C}
end
```

###Call by Value

A value is passed to the procedure and put into a cell local to the procedure.

```
proc {Sqr D}
	A={NewCell D}
in
	A:=@A+1
	{Browse @A*@A}
end
{Sqrt 25}
```
	
The cell a is initialized with the arguement of `Sqr`.

###Call by Value-result

This is a modification of call by variable. When the procedure is called, the content of a cell is put into another mutable variable local to the procedure. When the procedure returns, the content of the latter cell is put into the former cell.

```
proc {Sqr A}
	D={NewCell @A}
in
	D:=@D*@D
	A:=@D
end
local
	C={NewCell 0}
in
	C:=25
	{Sqr C}
	{Browse @C}
end
```

When entering the `Sqr`, `D` is assigned to the content of `A`. After computation, assigned the content of `D` back to the `C`. And we can reference `C` from outside.

###Call by Name

This mechanism creates a function to wrap each argument which is called thunk. And each time argument is needed, call it as a function, and this returns an unwrapped argument.

```
proc {Sqr A}
	{A}:=@{A}*@{A}
end
local C={NewCell 0} in
	C:=25
	{Sqr fun {$} C end}
	{Browse @C}
end
```

The function wrapped in thunk is called each time, the argument is needed.

###Call by Need

This is a modification and improve of call by name, which the function is called at most once. When the function is first called, its result stored and used for subsequent evaluations.

```
proc {Sqr A}
	B={A}
in
	B:=@B*@B
end
local C={NewCell 0} in
	C:=25
	{Sqr fun {$} C end}
	{Browse @C}
end
```	
The argument `A` is evaluated when it is needed, and after first evaluate, it stored in the variable `B`, and then every time `A` is needed, just use `B` instead.

This approach is exactly the same concept as lazy evalution.
