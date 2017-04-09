---
layout: post
title: Shared-State Concurrency
date: 2015-03-30 22:54:21.000000000 +08:00
permalink: /:title
---


After reading the chapter 8 in CTMCP, I wirte this post gives an alternative way to implement concurrency model by adding cells.

#Programming With Concurrency

By now, we have seen many different apporoach to write concurrent programs. And before introduce to `Shared-State Concurrency`. Let's list all the approaches to implement concurrency.

* Sequential Programming
* Declarative Programming
* Message-Passing Concurrency
* Shared-State Concurrency

##Sequential Programming

In a sequential model, there is a total order among all opertions. This is the strongest order invariant a program can have. And this variant model is deterministic.

##Declarative Concurrency

This does not change the result of a calculation, but only changes the order in which the result is obtained.

These models have nondeterminism in the implementation, since the system choose how to advance the threads.

The demand-driven concurrent model, also known as lazy execution, is a form of declarative concurrency. It does not change the result of a calculation but only affects how much calculation is done to obtain the result.

##Message-Passing Concurrency

Message passing is a basic programming style of stateful concurrent model. It extends the declarative model with a simple kind of communication channel, a port.

##Shared-State Concurrency

Shared state is another basic programming style of the stateful concurrent model. It consists of a set of threads accessing a set of shared passive object.

