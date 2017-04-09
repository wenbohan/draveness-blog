---
layout: post
title: Single-Assignment
date: 2015-04-09 21:55:47.000000000 +08:00
permalink: /:title
---

##Concepts

Before we talk about `single-assignment`. Let us show you three important concepts.

1. The concept of *identifier*. An identifier is a character string that is used to refernece entities during of a program.
2. The concept of *variable* in memory. A program does its calculatio in a part of the computer's memory. The memory is devided into variables, and each variable can be bound to the result of a calculation.
3. The concept of a *environment* (sometimes called a *frame*). The environment is the correspondance between the identifiers in the program and the variables in momory. At every point in a program's execution, there is well-defined ebvironment, More precisely, **an enviroment is a function of one argument that takes an identifier and retuns a variable in memory**.


##Single Assignment

* What is `single-assignment`. Just a set of variables that are initial unbound, and can only be bound to one value. The concept is very useful in `functional programming`, because the variable and function does not change after first bound, so every time call a function with the same value, you got the same annswer, there are not any side-effect outside the function or the variable.


###Declarative variables

Variables in the `single-assignment` store are called declartive variables. Once bound, a declarative variable stay bound throughout the computers and is distinguishable from its value.

	declare
	X=11
	
	X=12 // This will cuz a error.

###Value Store

A store where all values are bound to values is called a *value store*. Another way to say is that value store is a persistent mapping from variables to values. A value is a mathematical constant. 

	// x1 is bound to 314, x1 = 314
	         ----------
	x1       |   314  |
	         __________
	         
	// x2 is bound to [1 2 3], x2 = [1 2 3]
			 ----------    ---------    -----------
	x2       | 1 |  ------>| 2 | ------>| 3 | nil |
	         ----------    ---------    -----------
	         
	// x3 is unbound
	         -----------
	x3       | unbound |
	         ___________
	         
###Variable identifiers

A value store is contains variables and values. The role of a variable identifier is refer store entity from the store. Once bound, a variable indistinguish from its value. With the variable identifier
	
				    ----------------------------------------------------- 
					|    Inside the store                               |
		-------     |              -------    ---------    -----------  |
		| "X" |-------------->  x1 | 1 | ---->| 2 | ------>| 3 | nil |  |
		 -------     |              -------    ---------    -----------  |
		           |                                                   |
		            -----------------------------------------------------
	            
After the bind `X = [1 2 3]`, the identifier `"X"` still refers to x1, which is not bound to `[1 2 3]`. This is indistinguishable from the figure above, `X` refers directly to `[1 2 3]`. Following the links of bound variables to get the value is called dereferrencing.

###Dataflow variables

In the declarative model, creating a variable and binding it are done separately. If we try to use the variable before its bound, we call this a variable use error. We have the following possibilities when there is a use error

1. Execution continues and no error message is given. The variable’s content is undefined, i.e. it is “garbage”: whatever is found in memory. This is what C++ does.
2. Execution continues and no error message is given. The variable is initialized to a default value when it is declared, e.g., to 0 for an integer. This is what Java does for fields in objects and data structures, such as arrays. The default value depends on the type.
3. Execution stops with an error message (or an exception is raised). This is what Prolog does for arithmetic operations.
4. Execution is not possible because the compiler detects that there is an execution path to the variable’s use that does not initialize it. This is what Java does for local variables.
5. Execution waits until the variable is bound and then continues. This is what Oz does, to support dataflow programming.


Declarative variables that cause the program to wait until they are bound are called `dataflow variables`. Dataflow variables are tremendously useful in concurrent programming.
