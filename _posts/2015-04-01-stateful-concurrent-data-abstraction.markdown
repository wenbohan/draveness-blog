---
layout: post
title: Stateful Concurrent Data Abstraction
date: 2015-04-01 00:56:39.000000000 +08:00
permalink: /:title
---


#Lock

It often happens when threads wish to access a shared resource, but the resource can only be accessed by one thread at a time. This always called race condition and may causes unexcepted error during execution.

To manage this situation, we introduce a language concept called lock, to help control access to resource.

A lock dynamicically controls access to part of the program, called a critical region. If the shared resource is only accessed from within the critical region, then the lock can be used to control access to the resource.


We are ready to program stateful concurrent data abstractions and give a systematic way to transform a declrative data abstraction to become stateful concurrent data abstraction.

We illustrate the different techniques by means of simple example, a queue.

##Declarative Version

```
fun {NewQueue}
X in
	q(0 X X)
end
fun {Insert q(N S E) X}
E1 in
	E=X|E1 q(N+1 S E1)
end
fun {Delete q(N S E) X}
S1 in
	S=X|S1 q(N-1 S1 E)
end
```

This is essentially the declarative queue. The order of the queue operations is explicitly determined by the program.

##Sequential Stateful Version

```
fun {NewQueue}
	X C={NewCell q(0 X X)}
	proc {Insert X}
	N E E1 in
		q(N S X|E1)=@C
		C:=q(N+1 S E1)
	end
	fun {Delete}
	N S1 E X in
		q(N X|S1 E)=@C
		C:=q(N-1 S1 E)
		X
	end
in
	queue(insert:Insert delete:Delete)
end
```


This show the same queue in a stateful version encapsulated the queue's data. But this version cannot be used in concurrency. Because the `@` operation and `:=` operation. If two threads each do an insert operation, this may causes interleaving, which may gets incorrect answer.

##Concurrent Stateful Version with Lock

```
fun {NewQueue}
	X C={NewCell q(0 X X)}
	L={NewLock}
	proc {Insert X}
	N E E1 in
		lock L then
			q(N S X|E1)=@C
			C:=q(N+1 S E1)
	end
	end
	fun {Delete}
	N S1 E X in
		lock L then
			q(N X|S1 E)=@C
			C:=q(N-1 S1 E)
		end
		X
	end
in
	queue(insert:Insert delete:Delete)
end
```

This version shows a concurrent version of stateful queue, using a lock to ensure atomicity of the read-operation-write sequence. Doing this version in different threads will not impose any synchronization between the threads. This property is a consequence of using state.

##Concurrent Object-Oriented Version with Lock

```
class Queue
	attr queue
	prop locking
	
	meth init
		queue:=q(0 X X)
	end
	
	meth insert(X)
		lock N S E1 in
			q(N S X|E1)=@queue
			queue:=q(N+1 S E1)
		end
	end
	
	meth delete(X)
		lock N S1 E in
			q(N X|S1 E)=@queue
			queue:=q(N-1 S1 E)
		end
	end
end
```

This version is rewrittern with object-oriented syntax. The cell is replaced by the attribute `queue` and the lock is implicitly defined by the `locking` property.

##Concurrent Stateful Version with Exchange

```
fun {NewQueue}
	X C={NewCell q(0 X X)}
	proc {Insert X}
	N S E1 N1 in
		{Exchange C q(N S X|E1)	 q(N1 S E1)}
		N1=N+1
	end
	fun {Delete}
	N S1 E N1 X in
		{Exchange C q(N X|S1 S)	 q(N1 S1 E)}
		N1=N-1
		X
	end
in
	queue(insert:Insert delete:Delete)
end
```

This version is made by `Exchange` operation, because this is single state operation, so no locks are needed.

#Monitors

Locks are an important tool for building abstraction in a stateful model, but they are not sufficient. 

The standard way of coordinating threads in a stateful model is by monitor. A monitor is a lock extended with program control over how waiting threads enter and exit the lock.

The monitors adds a `wait` and `notify` operation to the lock entry and exit operations. 

* When inside a monitor, a thread can explicitly do a `wait`; suspend the thread, and entered into the monitor wait set, and release the monitor lock.
* When a thread does a `notify`, it lets one thread in the wait set continue. This thread attempts to get the monitor lock again.

##Definition

A monitor is always part of an object. It is an object with an internal lock and wait set. Object methoded can be protected by the lock by annotating them as `synchronized`. There are three  operations to manage the lock: `wait`, `notify`, and `notifyAll`.

* The `wait` operation
	* The current thread is suspended.
	* The thread is placed in the object's internal wait set.
	* The lock for the object is released.
* The `notify` operation
	* If one exists, an arbitrary thread `T` is removed from the object's internal wait set.
	* `T` proceeds to get the lock, just as any other thread. This means that `T` will always suspend for a short time, until the notifying releases the lock.
	* `T` resumes execution at the point it was suspended.
* The `notify` operation
	* Similar to `notify` except does above steps for all threads. The wait set is emptied.

Monitors are disigned for building concurrent data abstractions based on shared state.

##Bounded Buffer

The bounded buffer is an object with three operations.

* `B={New Buffer init(N)}`: create a new bouned buffer `B` of size `N`.
* `B={Put (X)}`: put the element `X` in buffer. If the buffer is fill, this will block until the buffer has room for the element.
* `B={Get (X)}`: remove the element `X` from the buffer. If the buffer is empty this will block until there is at least one element.

###Partial Definition of Monitor Version

```
class Buffer
   attr
      buf first last n i

   meth init(N)
      buf:={NewArray 0 N-1 null}
      first:=0
      last:=0
      n:=N
      i:=0
   end

   meth put(X)
      @buf.@last:=X
      last:=(@last+1) mod @n
      i:=@i+1
   end

   meth get(X)
      X=@buf.@first
      first:=(@first+1) mod @n
      i:=@i-1
   end
end
```

The partial definition of the monitor does not check the bounded of the monitor. And then we will use monitor to implement this.

###Monitor Version

```
class Buffer
   attr m buf first last n i

   meth init(N)
      m:={NewMonitor}
      buf:={NewArray 0 N-1 null}
      n:=N i:= 0 first:=0 last:=0
   end
   
   meth put(X)
      {@m.'lock' proc {$}
		    if @i>@n then {@m.wait} {self put(X)}
		    else
		       @buf.@last:=X
		       last:=(@last+1) mod @n
		       i:=@i+1
		       {@m.notifyAll}
		    end
		 end}
   end

   meth get(X)
      {M.'lock' proc {$}
		   if @i==0 then {@m.wait} {self get(X)}
		   else
		      X=@buf.@first
		      first:=(@first+1) mod n
		      i:=i-1
		      {@m.notifyAll}
		   end
		end}
   end
end
```

If the buffer is full, then `{M.wait}` simply waits until it is no longer full. When `get(X)` removes an element, it calls `{M.notifyAll}`, which wakes up the waiting thread.

##Programming with Monitors

The idea of monitors is guarded. Guarded methods are implemented using the `wait` and `notifyAll` operations.

```
meth methHead
	lock
		while not <expr> do wait;
		<stmt>
		notifyAll;
	end
end
```

In this example, `<expr>` is the guard and `<stmt>` is the guarded body. When the method is called, the thread enters the lock and waits for conition in a `while` loop. If the `<expr>` is true, this executes the body and notify all the other threads. If not, threads wait until other notify them.

##Implementing Monitors

Now let us impelement monitors in the shared-state concurrent model. This is thread-reentrant and correctly handles exceptions.

###Extended Concurrent Stateful Version Queue

```
fun {NewQueue}
	......
   fun {Size}
      lock L then @C.1 end
   end
   fun {DeleteAll}
      lock L then 
     	X q(_ S E)=@C in
			C:=q(0 X X)
			E=nil S
      end
   end
   fun {DeleteNonBlock}
      lock L then
 			if {Size}>0 then [{Delete}] else nil end
      end
   end
in
   queue(insert:Insert delete:Delete size:Size deleteAll:DeleteAll deleteNonBlock:DeleteNonBlock)
end
```

###Reentrant Get-release Version Lock

```
fun {NewGRLock}
	Token1={NewCell unit}
	Token2={NewCell unit}
	CurThr={NewCell unit}
	
	proc {GetLock}
		if {Thread.this}\=@CurThr then Old New in
			{Exchange Token1 Old New}
			{Wait Old}
			Token2:=New
			CurThr:={Thread.this}
		end
	end
	
	proc {ReleaseLock}
		CurThr:=unit
		unit=@Token2
	end
in
	'lock'(get:GetLock release:ReleaseLock)
end
```

###Monitor Implementation

```
fun {NewMonitor}
   Q={NewQueue}
   L={NewGRLock}
   proc {LockM P}
      {L.get} try {P} finally {L.release} end
   end
   proc {WaitM} X in
      {Q.insert X} {L.release} {Wait X} {L.get}
   end
   proc {NotifyM} U={Q.deleteNonBlock} in
      case U of [X] then X=unit else skip end
   end
   proc {NotifyAllM} L={Q.deleteAll} in
      for X in L do X=unit end
   end
in
   monitor('lock':LockM wait:WaitM notify:NotifyM
	   notifyAll:NotifyAllM)
end
```
