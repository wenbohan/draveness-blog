---
layout: post
title: SICP 1.1 The Elements of Programming
date: 2015-01-19 18:06:27.000000000 +08:00
permalink: /:title
---


#Summary

This blog just a summary of what I learned from SICP and the solution I made for exercises.

There are three tips on how our mind works and how we build abstractions.

1. Combining several simple ideas into one compound one, one thus all complex idea are made.
2. The second is bringing two ideas, whether simple or complex, together, and setting them by one another so as to take a view of them at once, without untiling them into one, by which it gets all its ideas of relations.
3. Thr third is separating them from all other ideas that accompany them in their existence.

Every powerful language has three mechanisms for accomplishing this

1. **primitive expressions**, which represent the simplest entities the language is concerned with.
2. **means of combination**, by which compound elements are built from simpler ones, and
3. **means of abstraction**, by which compound elements can be named and manipulated as units.

In programming, we just deal with two kinds of elements: `procedures` and `data`. Data is 'stuff' we manipulated and procedures are descriptions of the rules for manipulating the data. When we learn a new programming language, the first three thing we should learn is what is the primitive expressions in this language, how to combinate those primitive elements, and how to abstract them to make many complex system.

In `Scheme` and many other languages `define` is means of abstraction. We can use `define` to add a tuple to the global environment, such as `(define a 3)` is to associate `a` with a value 3.

And then, what are the important things in LISP, the most powerful programming language

* Numbers and arithmetic operations are primitive data and procedures.
* Nesting of combination provides a means of combing operations.
* Definitions that associate names with values provide a limited means of abstraction.

Substitution model for procedure application is not to provide a description of how the interpreter really works. It just helps us how to think about how procedure application works.

Application order versus nornal order

* Application order is to evalute the argument and then apply.
* Normal order is to fully expand and then reduce.

The most important thing I learned from this chapter is to build abstraction to suppress details, and the interface user should not know how it is happened, he just needs to know how it should be used and what result does this occured. We use `black box abstraction` to suppress details and make a big problem into a number of subproblems. For a human beings, when we meet problem in building extremely complex system, we can abstract, abstract and abstract, make new language such as domain specific language to solve complex problem.

In Lisp, the syntax is very concise and beautiful, use parentheses to build tree-like programs, and the interpreter can interpret it easily.

##Exercise 1.1

```
> 10
10
> (+ 5 3 4)
12
> (- 9 1)
8
> (/ 6 2)
3
> (+ (* 2 4) (- 4 6))
6
> (define a 3)
> (define b (+ a 1))
> (+ a b (* a b))
19
> (= a b)
#f
> (if (and (> b a) (< b (* a b)))
      b
      a)
4
> (cond ((= a 4) 6)
        ((= b 4) (+ 6 7 a))
        (else 25))
16
> (+ 2 (if (> b a) b a))
6
> (* (cond ((> a b) a)
           ((< a b) b)
           (else -1))
     (+ a 1))
16
```
	
##Exercise 1.2

```
(/ (+ 5 4 (- 2 (- 3 (+ 6 (/ 4 5)))))
   (* 3 (- 6 2) (- 2 7)))
```

##Exercise 1.3

```
(define (square x) (* x x))
(define (sum-of-square a b)
  (+ (square a) (square b)))
(define (two-larger-sum-of-square a b c)
  (cond ((and (< a b) (< a c)) (sum-of-square b c))
        ((and (< b a) (< b c)) (sum-of-square a c))
        (else (sum-of-square a b))))
```
	        
##Exercise 1.4

if parameter `b` is greater than zero, then the `if` clouse will return operator `+`, otherwise it will return `-`.

##Exercise 1.5

if the interpreter uses `applicative-order` evaluation, every parameters pass to the function are evaluated immediately. So the `p` function call it self and never terminate. The interpreter falls into infinite loop.

However, if the intepreter uses `normal-order` evaluation, the interpreter does not evaluate `(test 0 (p))` immediately, when the `if` clouse is sent to the interpreter, the `(p)` branch will never evaluate.

##Exercise 1.6

`if` clouse is a different syntax, it is different from `new-if` function, in this function every branch will be evaluated when passed into the function. So the `sqrt-iter` branch will never terminate and fall into infinite recursion.

##Exercise 1.7

The constant in function `good-enough?` determines this strategy not works well when evaluate a square root of a small number. When the number is very large, the strategy becomes very inefficient, and the procedure works very slow.

##Exercise 1.8

```
(define (square x) (* x x))
(define (cube x) (* x x x))
(define (cube-iter guess x)
  (if (good-enough? guess x)
      guess
      (cube-iter (improve guess x)
                 x)))
(define (improve guess x)
  (average guess (/ (+ (/ x (square guess)) 
                       (* 2 guess))
                    3)))
(define (average x y)
  (/ (+ x y) 2))
(define (good-enough? guess x)
  (< (abs (- (cube guess) x)) 0.001))
(define (cube-root x)
  (cube-iter 1.0 x)) 
```
