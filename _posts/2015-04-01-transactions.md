---
layout: post
title: Transactions
date: 2015-04-01 19:50:46.000000000 +08:00
permalink: /:title
---



Transactions were introduced as a basic concept for the management of larget shared database.

The term "transaction" has acquired a fairly meaning, it is any operation satisfies the four `ACID` properties which is an acronym.


* A stands for **atmoic**
	* No intermediate states of a transaction's execution are observable.
* C stands for **consistent**
	* Observable state changes respect the system invariants. Consistentcy is closely related to atomicity. The difference is the consistency is responsibility for programmer, whereas atmoicity is the responsibility of the implemenation of the trasaction system.
* I stands for **isolation**
	* Several transactions can execute concurrently without interfering with each other. They execute as if they were sequential.
* D stands for **durabulity**
	* Observable state changes survive across system shutdowns. This is often called persistence.
	
## Motivations

* One motivation for transactions was to increase the throughtput of concurrent accesses to a database.
* A second motivation is concurrent programming with exceptions. Most routines has two way to exit, either they exit normally or they raise an exception. And there are two solutions when an exception raised.
	* The caller can clean up the called routine's mess.
	* The routine can be inside a transaction. Raising an exception corresponds to aborting the transaction.
* A third motivation is fault tolerance. A fault tolerance application has to take three steps:
	1. Detect the fault.
	2. Contain the fault in a limited part of the application
	3. Repair any problems caused by the fault.
* A fourth motivation is resource management.

##Concurrency Control

Consider a large database by many clients at the same time. They are concurrent yet still satisfy serializability. The implementation should allow concurrent transaction and yet it has to make sure that they are still serializable.

Concurrency control is the set of techniques used to build and program concurrent sysmtems with transactional properties. Our algorithm is interesting because it is both practical and simple.

###Locks and Timestamps

The two most widely used approaches to concurrency control are locks and timestamps:

* Lock-based concurrency control
	* Each stateful entity has a lock that controls access to the entity Locks always restricting the system's behavior so that it is safe.
* Timestamp-based concurrency control
	* Each transaction is given a timestamp that gives it a priority. Timestamps are important to ensure that execution makes progress.
	
Safety and liveness propeties describe how a system hahaves as a function of time.












