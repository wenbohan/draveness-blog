---
layout: post
title: Class as Data Abstraction in OOP
date: 2015-03-23 18:28:07.000000000 +08:00
permalink: /:title
---


The heart of the object concept is controlled access to encapsulated data. The behaviour of an object is specified by a **class** which is an incremental definition of a data abstraction.

* Complete data abstraction
	* Defining the various elements that make up a class.
	* Taking advantage of dynamic typing.
* Incremental data abstraction
	* Related to inheritance.

##Defining Classes and Objects

A class is data structure that defines an object's internal state (attributes), its behavior (methods), the classes it inherits several properties and operations.

A class is a data abstraction that give its partial and total implementation.

Objects of a given class is called **instances**. These object have differenty identities but can have differnet values for their interval state. And instance is initialized with the operation `New`.
```
Obj={New Class Init}
```
This code creates an new object `Obj` of class `Class` and invokes with the message `Init`. And after the initialize, we can use the syntax `{Obj Message}` to call a message on instance `Obj`.

##Class members

A class defines the constituent parts part each of its object will have. There are three kinds of members in class:

* **Attributes**
	> An attribute is a cell that contains part of the instance's state which is always called **instance variable** in an instance. And this just visible in the class definition. Every instance have seperate set of attributes.
* **Methods**
	> A method is a kind of procedure that is called in the context of a particular object and that access the object's attribute. 
	
	* The method consists of a head and body. 
	* The head consists of a label, which must be an atom or a name, and a set of arguments.
	* The arguments must be distinct variables.
* **Properties**
	> A property modifies how an object behaves.
	
##Initializing Attributes

Attributes can be initialized in two ways: per instance or per class.

* Per instance
	* An attribute can be given a different initial value per instance.

		```
		class OneApt
			attr streetName
			meth init(X) @streetName=X end
		end
		Apt1={New OneApt init(drottninggatan)}
		Apt2={New OneApt init(runNeuve)}
		```
			

* Per class
	* An attribute can be given a value that is the same for all instances of a class. This is done by initilizing it with ":" in the class definition.
	
		```
		class YorkApt
			attr
				streetName:york
				streetNumber:100
				wallColor:_
				floorSurface:wood
			meth init skip end
		end
		Apt3={New OneApt init}
		Apt4={New OneApt init}
		```

* Per brand
	* This is another way to use the per-class initialization. A brand is a set of classes that related in some way.

		```
		L=linux
		class RedHat attr ostype:L end
		class SuSE attr ostype:L end
		class Debian attr ostype:L end
		```

##First-class Messages

Messages are records and method heads are patterns that match a record. We can use different type of records to pass to a method.

1. Static record as message. In this case, message is known at **compile time**.
2. Dynamic record as message. In this case, message is a variable that references a record that calculated at **run time**.

In the method definition, the following approach is possible:

1. Fixed argument list

	```
	meth add(x:X y:Y)
		% Method body
	end
	```

2. Flexible argument list

	```
	meth add(x:X y:Y ...)
		% Method body
	end
	```

	The "..." in the method head means that any message is accepted if has least the listed argument.
3. Variable reference to method head

	The whole method head is referenced by a variable.
	
	```
	meth add(x:X y:Y ...)=M
		% Method body
	end
	```

The variable `M` references the full message as a record.
	
4. Optional argument

	```
	meth add(x:X y:Y z:Z<=V)
		% Method body
	end
	```

	The `<=V` in the method head means that field `z` is optional. You can either called the method with `add(x:1 y:2)` or `add(x:1 y:2 z:3)`.
	
5. Private method label

	Method label can be names. This is denoted by using a variable identifier
	
	```
	meth A(bar:X)
		% Method body
	end
	```

	The method `A` is bound to a fresh name whtn the class is defined. If this method must be used elsewhere in the program, we should pass it explicitly.
	
6. Dynamic method label

	```
	meth !A(bar:X)
		% Method body
	end
	```

	The method label has to be known when the class definitions is executed. The variable must be bound to an atom or a name. This technique can make method secure.
	
7. The `otherwise` method

	The method head with label `otherwise` is a catchall that accepts any message for message for which no other method exists.
	
	```
	meth otherwise(M)
		% Method body
	end
	```

A class has only one method with `otherwise`, if this method exists, it accepts any message.

	
##First-class Attributes

Attribute names can be calculated at tun time. It is possible to write methods to access and assign any attributes.

```
class Inspector
	meth get(A ?X)
		X=@A
	end
	meth set(A X)
		A:=X
	end
end
```

The `get` method can get any attribute, and the `set` method can assign any attribute.

##Programming Techniques

The class concept we have introduced so far gives a convenient syntax for defining data abstractions with excapsulated state and multiple operations.

* The class statement defines a class value, which can be instantiated to give objects.
* Classes can have external references.
* Classes are cmpositional, they can be nested within classes.
* Classes are compatible with procedure values, they can be nested within procedures and vice versa.
