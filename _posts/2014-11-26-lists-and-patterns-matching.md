---
layout: post
title: Lists and Patterns Matching
date: 2014-11-26 23:57:59.000000000 +08:00
permalink: /:title
---



##Recursive computations

递归的计算模型是声明式编程的核心, 有些人可能并不知道, 类型也是可以递归的. 比如说列表.

###List
列表是在函数式编程中是很有趣的, 也是很强大的, 大多数函数式编程语言都支持列表, 比如`Haskell`, `ML`, `Scheme`. 列表. 列表与`C`, `Java`, `Objective-C` 语言中的`array`非常的相似, 但是却有着很大的不同. 

列表是一种递归的数据类型:

```
% Xs Xr 是列表
Xs => nil
Xr => X|Xr
```

我们使用上下文无关文案表示列表在核心语言中的语法的表示.

```
<List> ::=  nil
		 	|   <T> `|` <List T>
```
列表可以由`nil`开始, 不挺的重复自己, 直到列表结束`<List> => nil`.

我们也可以使用这种方式表示其他更复杂的数据类型, 比如说`binary tree`

```
<BTree T>  ::= leaf
			|  tree(key: <Literal> value: T
					left: <BTree T> right: <BTree T>)
```

####Haskell
在`Haskell`中, 列表是一种单类型的数据结构, 可以用来存储多个类型的东西, 同时它还可以嵌套. 简单展示一下`Haskell`中的列表吧:

```
[1,2,3,4,5]
	
//嵌套列表
[[1,2,3,4],[5,6,7,8],[9,10,11,12]]
```

访问列表中的元素, 有两种基本的方法, 在`Haskell`中一种是`head`访问数组的头部, 一种的`tail`返回列表的尾部.

```
head [1,2,3]  => 1
	tail [1,2,3]  => [2,3]

head [1,2] => 1
tail [1,2] => [2]

head [2] => 2
tail [2] => []
```

有几点注意的是, 这两个函数都只能对列表进行操作, `head`返回的是列表中的一个元素, 而`tail`返回的是一个**列表**. 尤其注意后面的两种情况.

在`Haskell`中呢, 有一种更强大过滤组合列表的方式, 叫做`list comprehension`列表推导, 我们可以使用列表推导轻松的完成快速排序的实现.

```
quicksort :: (Ord a) => [a] -> [a]  
quicksort [] = []  
quicksort (x:xs) =   
    let smallerSorted = quicksort [a | a <- xs, a <= x]  
        biggerSorted = quicksort [a | a <- xs, a > x]  
    in  smallerSorted ++ [x] ++ biggerSorted  
```
	    
这段代码就是用列表推导完成了使用其他语言需要几倍代码量才能完成的快速排序.

####Scheme

`Scheme`是`Lisp`主要的两种方言之一. 它与`lambda`演算的关系相当的密切, `Scheme`中的有两种方式构造一个列表.

```
(list 1 2 3)

; This is just a syntax sugar
'(1 2 3)
```
	
`Scheme`中对列表的操作, 使用`car`和`cdr`, 用法基本与`Haskell`中的`head`和`tail`一样.

####Oz
`Oz`是在`CTMCP`一书中提到的用于研究的语言, 我们使用它来展示列表是如何工作和使用的.

```
% 列表的声明
	L = [5 6 7 8]

% car 方法
L.1 = 5

% cdr 方法
L.2 = [6 7 8]
```

我们也可以使用`|`操作符创建列表

```
L = 5|6|7|8|nil
```
	
##Programming with Lists

因为列表简单的结构, 使用它们进行声明式编程是非常简单和强大的.

* 递归式的思考, 解决问题的更小一部分.
* 将递归式的计算模型转化为迭代式的计算模型.
* 校正迭代式的计算模型.
* 遵循类型来构建程序.

###Pattern Matching
模式匹配同样是`FP`中强大的特性, 我们可以使用它来代替`car`和`cdr`方法同时获取列表的头部和尾部, 避免使用`if`条件.

```
% display 5 and [6 7 8]
declare
L=[5 6 7 8]
case L of H|T then {Browse H} {Browse T} end
```
