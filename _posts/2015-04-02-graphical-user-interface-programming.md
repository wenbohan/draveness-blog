---
layout: post
title: Graphical User Interface Programming
date: 2015-04-02 21:03:18.000000000 +08:00
permalink: /:title
---


This post will show a particularly simple and powerful way to do graphical user inteerface programming. We combine the declarative model together with the shared-state concurrent model. First, we will summarize the existing approaches.

* Purely procedurel
	* The user interface is constructed by a sequence of graphics commands. These commands can be purely imperative or even functional. The object-oriented or functional style is preferable to an imperative style.
* Purely declarative
	* The user interface is constructed by choosing from a set of predefined possibilities. This is an example of descriptive declarativeness.
* Using an interface builder
	* The user interface is constructed manully by the developer, using a direct manipulation interface.

The procedural approach is expressive but is complex to use. 
The declarative approach is easy to use but lacks expressiveness. 
The interface builder is easy to use and gives immediate feedback on the interface but it lacks expressiveness and the interface is haard to change at run time.

##The Declarative/Procedural Approach

What are the relative merits of the declarative and procedural approaches to specifying user interfaces? The trade-off is between expressiveness and manipulability:

* The declrative approach defines a set of possibilities for different attributes. The developer chooses among this set and defines a data structure that describes the interface. 
	* The pure declarative approach makes it easy to formally manipulate the user definitions. But the expressiveness is limited bacause it is only possible to express what the designers initially thought of.
* The procedural approach gives a set of primitive operations and the ability to write programs to them. These programs construct the interface. 
	* A purely procedural approach has no limits on its expressiveness. However, this makes harder to do formal manipulations on the user interface definitions.

The trade-off is not a temporary state of affairs. It is a deep property of computational models. As a language becomes more expressive, its programs become less amenable to formal manipulation.

It is still possible to define a model that is both manipulate and expressive. We can do it by combing the declarative and procedural approaches.

