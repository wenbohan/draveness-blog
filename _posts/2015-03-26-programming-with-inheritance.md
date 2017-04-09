---
layout: post
title: Programming with Inheritance
date: 2015-03-26 20:03:48.000000000 +08:00
permalink: /:title
---


#How to use Inheritance

There are two ways to view inheritance. 

* The **type** view
	> Classes are types and subclasses are subtypes. The type view is consistent with the principle that classes should model real-world entities or some abstract versions of them. In type view, classes satisfy the substitution property: every operation works on class `C` also works on subclass of `C`.
* The **structure** view
	> Inheritance is just another programming tool that is used to structure programs. This view is strongly discouraged bacause classes no longer satisfy the substituion property.
	
In the type view, each class stands on its own two feet. And in the structure view, classes are sometimes just scaffolding, which exists only for its role in structuring he program.

In the vast majority of cases, inheritance shuld respect the type view. And the rest of this blog is mainly consider the type view.

##Desin by Contract

Based on the teniques such as using aximatic semantics of the formal semantics, Bertrand Mayer has developed a method for designing correct programs called **design by contract** and implement it.

The principle idea of design by contract is that a data abstraction implies a contract between the abstraciton's designer and its users.

* The user must guarantee that an abstraction is called in the right way.
* The designer must guarantee that the right value is returned after the procedure executed.

The user is responsible for the preconditions and the disigner is responsible for the postconditions.

In the data abstraction, we should check if the precondition is valid and the user followed the contract. This is checked at boundary when the data abstraction is called which can be in either runtime or compile time.

##Things should Prevented

There are such things that we should not use when dealing with inheritance.

* The subsitution property was regularly violated.
* Classes were subclassed to fix small problems.

The most important principle using inheritance is to use it add new functionality and not to patch a broken class.

##Reengineering

The general goal of reengnnering is to take an exisinting system and attempt to improve some of its property by changing the source code. However reengineering cannot resurrect a failed project.

#Generic Classes

A generic class is one that only defines part of the functionality of a data abstraction. It has to be completely before it can be used to create objects. How can we define generic class, there are two ways for us to make it.

##Using Inheritance

A common way to use generic class is to use abstract classes. 

```
class GenericSort
   meth init skip end
   meth qsort(Xs Ys)
      case Xs
      of nil then Ys=nil
      [] P|Xr then S L in
	 {self partition(Xr P S L)}
	 {Append {self qsort(S $)}
	  P|{self qsort(L $)} Ys}
      end
   end
   meth partition(Xs P Ss Ls)
      case Xs
      of nil then Ss=nil Ls=nil
      [] X|Xr then Sr Lr in
	 if {self less(X P $)} then
	    Ss=X|Xr Ls=Lr
	 else
	    Ss=Sr Ls=X|Lr
	 end
	 {self partition(Xr P Sr Lr)}
      end
   end
end
```

This block of codes define an abstract class `GenericSort` which remains the method `less` undefined for subclasses.

So we define this method is subclass `IntegerSort` and `RationalSort`.

```
class IntegerSort from GenericSort
   meth less(X Y B)
      B=(X<Y)
   end
end
class RationalSort from GenericSort
   meth less(X Y B)
      '/'(P Q)=X
      '/'(R S)=Y
   in B=(P*S<Q*R) end
end
```

The abstraction is really powerful, we can subclass `GenericSort` and implement `less` method to sort any kinds of data we want.

But this is just a syntactic sugar for high-order programming.

##Using Higher-order Programming

There is a second natual way to create generic classes, namely by using higher-order programming directly. Now we can define a function which takes some arguments and returns a class that is specialized with these arguments.

```
fun {MakeSort Less}
   class $
      meth init skip end
      meth qsort(Xs Ys)
	 case Xs
	 of nil then Ys=nil
	 [] P|Xr then S L in
	    {self partition(Xr P S L)}
	    {Append {self qsort(S $)}
	     P|{self qsort(L $)} Ys}
	 end
      end
      meth partition(Xs P Ss Ls)
	 case Xs
	 of nil then Ss=nil Ls=nil
	 [] X|Xr then Sr Lr in
	    if {Less X P} then
	       Ss=X|Sr Ls=Lr
	    else
	       Ss=Sr Ls=X|Lr
	    end
	    {self partition(Xr P Sr Lr)}
	 end
      end
   end
end
```

The function `MakeSort` take an argument `Less` which compares two elements and returns a bool value. And the function returns a class, that can sort different kinds of element.

```
IntegerSort={MakeSort fun {$ X Y} X<Y end}
RationalSort={MakeSort fun {$ X Y}
						'/'(P Q)=X
						'/'(R S)=Y
					   in P*S<Q*R end}
```

And then we can use these as this:

```
ISort={New IntegerSort init}
{Browse {ISort qsort([1 2 4 5 6 3] $)}}
```

##Discussion

What is the different between the two techniques? 

* In most programming languags, the inheritance must be defined at compile time. This gives static genericity. So the compiler can generate better code or do more checking.
* High-order programming, when it is possible lets us define dynamic genericity which is much more flexible.

#Mutiple Inheritance

Mutiple inheritance is useful when an object has to be two different things in the same program.

##Rules about Mutiple Inheritance

Mutiple inheritance is powerful technique that has to be used care.

* Mutiple inheritance works well when combing two **completely independant abstraction**.
* Mutiple inheritance is much harder to use correctly when the abstraction has much in common, this always causes name label conflicts.

See more in this post: [Mutiple Inheritance](http://deltax.me/2014/11/22/Multiple%20Inheritence/)

