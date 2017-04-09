---
layout: post
title: Message-Passing Concurrency
date: 2015-03-16 09:13:25.000000000 +08:00
permalink: /:title
---


`Message-passing` is a programming style in which a program consists of independent entities that interact by sending each other messages asynchronously.

##Why Message-passing important?

* It is the basic framework for **multi-agent** systems.
* It is the natural stype for a **distributed** system.
* It lends itself well to building highly reliable systems.

##Message-passing concurrent model

The message-passing concurrent model extends the declarative concurrent model by adding ports. We add two operions to manipulate ports.

```
{NewPort <y> <x>}  Port creation: create a new port with entry point <x> and stream <y>
{Send <x> <y>}     Port send: append <y> to he stream corresponding to the entry point <x>
```

##Port Objects

A `port object` is a combination of one or more ports and a stream object. This extends stream objects in two ways.

1. **Many-to-one communication** is possible, many threads can reference a given port object and send message to it independently.
2. Port objects can be **embedded inside data structures**.

In message-passing model, a program consists of a set of port objects sending and receiving messages. 

* Port objects can create new port objects. 
* Port objects can send messages containing references to other port objects.

###NewPortObject abstraction

We can define an abstraction to make it easier to program with port objects.

```
fun {NewPortObject Init Fun}
Sin Sout in
	thread {FoldL Sin FUn Init Sout} end
	{NewPort Sin}
end
fun {NewPortObject2 Proc}
Sin in
	thread for Msg in Sin do {Proc Msg} end end
	{NewPort Sin}
end
```
	
##Message Protocol

We can use message-passing paradigm to model simple message protocol.

###RMI

`RMI` is the most popular of the simple protocols. It allows to call another object in a different operating system process.

```
proc {ServerProc Msg}
	case Msg
	of calc(X Y) then
		Y=X*X+2.0*X+2.0
	end
end
Server={NewPortObject2 ServerProc}

proc {ClientProc Msg}
	case Msg
	of work(Y) then Y1 Y2 in
		{Send Server calc(1.0 Y1)}
		{Wait Y1}
		{Send Server calc(2.0 Y1)}
		{Wait Y2}
		Y=Y1+Y2
	end
end
Client={NewPortObject2 ClientProc}
{Browse {Send Client work($)}}

// 15
```

###Asynchronous RMI

This protocol is similar to `RMI`, except that the client continues immediately after sending the request. The client is informed when the reply arrives. Multiple requests can be handled in rapid succession.

```
proc {ClientProc Msg}
	case Msg
	of work(?Y) then Y1 Y2 in
		{Send Server calc(1.0 Y1)}
		{Send Server calc(2.0 Y1)}
		Y=Y1+Y2
	end
end
Client={NewPortObject2 ClientProc}
{Browse {Send Client work($)}}
// 15
```

Requests are handled by the server the same order as they are sent and replies arrive in that order as well.

###RMI with callback

Here is a server that does a callback to find the value of a special value `delta` only known by the client.

```
proc {ServerProc Msg}
	case Msg
	of calc(X ?Y Client) then X1 D in
		{Send Client delta(D)}
		X1=X+D
		Y=X1*X1+2.0*X1+2.0
	end
end
Server={NewPortObject2 ServerProc}

proc {ClientProc Msg}
	case Msg
	of work(?Z) then Y in
		{Send Server calc(10.0 Y Client)}
		Z=Y+100.0
	[] delta(?D) then
		D=1.0
	end
end
Client={NewPortObject2 ClientProc}
{Browse {Send Client work($)}}
	
// _
```
	
This solution not work, because the client suspends when it calls th server, so that the server cannot call the client.

####Using thread

First, we use concurrency to solve this problem.

```
proc {ClientProc Msg}
	case Msg
	of work(?Z) then Y in
		{Send Server calc(10.0 Y Client)}
		thread Z=Y+100.0 end
	[] delta(?D) then
		D=1.0
	end
end

// 245.0
```
	
After the client sent a message to the server, it does not suspend, because the `thread` creates a new thread and execute it on it.

####Using record continuation

Instead of using thread, we can use record to solve this issue. In this way, the client never waits and deadlock is avoiding.

```
proc {ServerProc Msg}
	case Msg
	of calc(X Client Cont) then X1 D Y in
		{Send Client delta(D)}
		X1=X+D
		Y=X1*X1+2.0*X1+2.0
		{Send Client Cont#Y}
	end
end
Server={NewPortObject2 ServerProc}

proc {ClientProc Msg}
	case Msg
	of work(?Z) then Y in
		{Send Server calc(10.0 Client cont(Z))}
	[] cont(Z)#Y then
		Z=Y+100.0
	[] delta(?D) then
		D=1.0
	end
end
Client={NewPortObject2 ClientProc}
{Browse {Send Client work($)}}

// 245.0
```
	
When we pass `work` message to `client` it immediately send `server` message `calc`. After the server execute `calc`, it pass back `Cont#Y` back to the client, then client finishes the calculation.

####Using procedure continuation

The previous example can be generalized in a powerful way by passing a precedure instead of a record.

```
proc {ClientProc Msg}
	case Msg
	of work(?Z) then
		C=proc {$ Y} Z=Y+100.0 end
	in
		{Send Server calc(10.0 Client cont(C))}
	[] cont(C)#Y then
		{C Y}
	[] delta(?D) then
		D=1.0
	end
end
```
	
The continuation contains the work that the client has to do after the server returns. Since the continuation is a procedure value, it is self-contained, it can be executed by anyone without knowing anything inside it.	

####Asynchronous RMI with callback

We might want to do two asynchronous RMIs where each `RMI` does a callback.

```
proc {ServerProc Msg}
	case Msg
	of calc(X ?Y Client) then X1 D in
		{Send Client delta(D)}
		thread 
			X1=X+D
			Y=X1*X1+2.0*X1+2.0
		end
	end
end

proc {ClientProc Msg}
	case Msg
	of work(?Z) then Y1 Y2 in
		{Send Server calc(10.0 Y1 Client)}
		{Send Server calc(20.0 Y2 Client)}
		thread Y=Y1+Y2 end
	[] delta(?D) then
		D=1.0
	end
end
```

####Double callback

When the server does a first callback to client, and which itself calls a second callback to the server. To handle this, both the client and the server should response immediately and not wait until the result come back.

```
proc {ServerProc Msg}
	case Msg
	of calc(X ?Y Client) then X1 D in
		{Send Client delta(D)}
		thread 
			X1=X+D
			Y=X1*X1+2.0*X1+2.0
		end
	end
	[] serverdelta(?S) then
		S=0.01
	end
end

proc {ClientProc Msg}
	case Msg
	of work(?Z) then Y in
		{Send Server calc(10.0 Y Client)}
		thread Z=Y+100.0 end
	[] delta(?D) then S in
		{Send Server serverdelta(S)}
		thread D=1.0+S end
	end
end
```
	
Calling `{Send Client work(Z)}` calls the server, which calls the client method `delta(D)`, which iteself calls the server method `serverdelta(?S)`.
