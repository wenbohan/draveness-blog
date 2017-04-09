---
layout: post
title: Stateful Collections
date: 2015-03-21 07:51:23.000000000 +08:00
permalink: /:title
---


There are different kinds of collection depending on what operations are provided. We discuss in two axises about collections.

1. Indexed collections and unindexed collections, depending on whether or not thereis rapid access to individual elements.
2. Extensible or inextensible collections, depending on whether the number of elements is variable or fixed.

##Indexed Collections

The stateful versions of **tuples** and **records** are **arrays** and **dictionaries**. And now, we have four different kinds of indexed collections.

![](/content/images/2015/04/Stateful-Collections1.png)

###Arrays

An array is a mapping from integers to partial values. 

* The domain is a set of consecutive integers from lower bound to an upper bound.
* The domain is givenwhen the array is declared and cannot be changed afterward.
* The range of the mapping can be changed.
* Both accessing and changing an array element are done in constant time.

There is a strong relationship between tuples and arrays, each of them are mapping from integers to partial values. **But tuples are stateless and arrays are stateful.** And the content of arrays can be changed but tuples can not.

###Dictionaries

A dictionary is a mapping from simple constants to partial values. 

* Both the domain and the range of the range of mapping can be changes.
* Accessing and changing are done in constant time and adding/removal are done in amortized constant time.
* There are no limits to the number of fields in the mapping.

There is a close relationship between records and dictionaries. Each of them maps simple contants to partial values. **But records and stateless and dictionaries and stateful.** A records has a fixed set of field but dictionary not.

###Choosing Indexed Collections

The different has different trade-offs in possible operations, memory use, and execution time.

Let us compare the four collections mention above:

* Tuples
	* Most restrictive
	* Fastest
	* Require less memory
	* Stored consecutively
	* Indexed by number
* Records
	* More flexible then tuples
	* Indecies can te literal
	* Efficient
	* Stored consecutively
* Arrays
	* Field can be changed
	* Bounds can not be changes
	* Stored consecutively
	* Efficient
	* Indexed by number
* Dictionaries
	* Most general
	* Indecies can te literal
	* Created empty
	* Efficient
	* More memory and alower access (by a constant factor)
	
We can choose the proper collection type when we use.

##Unindexed Collections

Indexed collection are not always the best choice. Sometimes it is better to use unindexed collections, such as lists and streams.

Both of them are declrative data types that collect elements in a linear sqeuence can be traversed from front to back. Any number of traversals can beb done simulataneously on the same list or stream.

###Lists

Lists are of finite, fixed length. They are one of the most important data struture in functional programming language. It is really an elegant data struture. And we use `map` `filter` `fold` and many powerful operation to deal with it.

###Streams

Streams are also called incomplete lists or partial lists. Their tail are unbound variables. 

* Stream is one of the most efficient extensible collections.
* Stream is useful for representing orered sequences of message.

##Extensible Collections

Final, I will introduce some extensible collections, streams, dictionaries and extensible arrays.

###Extensible Arrays

As we mentioned above, array is a bounded data structure. How do extensible array work? 

* When the array is full, we create a new array with double size of the older one. And copy all the elements from old one to new one. 
* When the array is quarter full, we create a new array with half size of the older one. And copy the elements.

This data structure take constant time to the cost of resize operation. The most important thing is to ensure that the index must always remain in bound.
