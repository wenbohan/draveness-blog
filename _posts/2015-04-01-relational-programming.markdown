---
layout: post
title: Relational Programming
date: 2015-04-01 23:15:09.000000000 +08:00
permalink: /:title
---


A relational procedure is more flexible than a functional procedure in two ways. 

* First, there can be any number of results to a call. 
* Second, which arguments are inputs and which are outputs can be different for each call.

These features make relational programming well-suited for databases and parsers. And it extends declarative programming with a new kind of statement called a "choice". And `Prolog` language uses a choice operation as the heart of its execution model.

The flexibility of relational programming has a reverse side. It can easily lead to inefficient programs. Relational programming is practical in these areas:

* When the search space is small.
* As an exploratory tool.

#The Relational Computational Model

The relational computational model extends the declrative model with two new statements, `choice` and `fail`.

* The `choice` statement group together a set of alternative statements.
* The `fail` statement indicates that the current alternative is wrong.

##Search Tree

A relational program is executed sequentially. The `choice` statements are executed in the order that they are encountered during execution.

When a `choice` is first executed, its first alternativeis picked. When  `fail` is executed, execution "backs up" to the most recent `choice` statement.

This execution stategy can be illustrated with a tree called the search tree.

![](/content/images/2015/04/Search-Tree.png)



##The `Solve` Function

We provide encapsulated search by adding one function, `Solve` to the computation model. The call `{Solve F}` is given a zero-argument function `F` that returns a solution to a relational program. This returns a lazy list of all solutions with `DFS`.

We just look the first element with this function:

```
fun {SolveOne F}
   L={Solve F}
in
   if L==nil then nil else [L.1] end
end
```

To get all-solution search, we look at the whole list:

```
fun {SolveAll F}
   L={Solve F}
   proc {TouchAll L}
      if L==nil then skip else {TouchAll L.2} end
   end
in
   {TouchAll L}
   L
end
```

