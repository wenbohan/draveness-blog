---
layout: post
title: 中位数和顺序统计量
date: 2015-03-28 02:34:48.000000000 +08:00
permalink: /:title
---


#顺序统计量

在一个由 $n$ 个元素组成的集合中, 第 $i$ 个顺序统计量 (order statistic) 是该集合中第 $i$ 小的元素.

* **最小值**是第 $1$ 个顺序统计量 $i=1$.
* **最大值**是第 $n$ 个顺序统计量 $i=n$.
* **中位数**是所属集合的中点元素.
	* 当 $n$ 为偶数时, 存在两个中位数, 分别位于 $i=n/2$ 和 $i=n/2+1$.
	* 当 $n$ 为奇数时, 中位数是唯一的, 位于 $i=(n+1)/2$.
	
#选择问题

我们将讨论从一个由 $n$ 个元素互异的集合中选择第 $i$ 个顺序统计量的问题, 把这一类问题形式化定义为如下的**选择问题**.

> 输入: 一个包含 $n$ 个(互异的)数的集合 $A$ 和一个整数 $i$, 其中 $1 \leq i \leq n$
> 输出: 元素 $x \in A$, 且 $A$ 中恰好有 $i-1$个其它元素小于它.

#期望为线性时间的选择算法

我们将介绍一种解决选择问题的算法, 渐进时间为 $\Theta (n)$. 与快速排序一样, 我们将输入数组进行递归划分. 但与快速排序不同的是, 我们只会处理划分的一边. 所以快速排序的期望运行复杂度为 $\Theta (n \lg n)$, 而在这里选择算法的期望运行时间为 $\Theta (n)$

`RANDOMIZED_SELECT` 利用了 `randomized_partition` 过程, 它也是一个随机算法.

```
#define EXCHANGE(a, b) tmp = a; a = b; b = tmp;

int randomized_select(int A[], int p, int r, int i) {
    int q, k;
    if (p == r) {
        return A[p];
    }

    q = randomized_partition(A, p, r);
    k = q - p + 1;

    if (i == k) {
        return A[q];
    } else if (i < k) {
        return randomized_select(A, p, q - 1, i);
    } else {
        return randomized_select(A, q + 1, r, i - k);
    }
}

int randomized_partition(int A[], int p, int r) {
    int i = rand() % (r - p) + p,
        tmp;

    EXCHANGE(A[i], A[r - 1]);

    return partition(A, p, r);
}

int partition(int A[], int p, int r) {
    int x = A[r - 1],
        i = p - 1;

    for (int j = p; j < r; j++) {
        if (A[j] <= x) {
            i++;
            EXCHANGE(A[j], A[i]);
        }
    }
    EXCHANGE(A[r], A[i + 1]);
    return i + 1;
}
```

`RANDOMIZED_SELECT` 的运行过程如下:

* `if (p == r)` 检查递归的基本情况, 即数组 $A[p..r]$ 中只包含一个元素.
* `randomized_partition(A, p, r)` 将数组 $A[p..r]$ 划分为两个可能为空的子数组 $A[p..q - 1]$ 和  $A[q + 1..r]$, 使得前者中每个元素都小于 $A[p]$, 后者大于 $A[p]$, 其中  $A[q]$ 为主元.
* `k = q - p + 1` 计算子数组 $A[p..q]$ 中的元素个数, 及处于划分的低区的元素的个数加 $1$, $1$ 为主元素..
* `if (i == k)` 检查 $A[q]$ 是否是第 $i$ 小的元素, 如果是就返回 `RANDOMIZED_SELECT(A, p, q - 1, i)`, 如果是直接返回 $A[q]$, 否则返回 `RANDOMIZED_SELECT(A, q + 1, r, i - k)`, 其中 $i-k$ 为元素在高区的相对位置.

`RANDOMIZED_SELECT` 的最坏情况的运行时间为 $\Theta (n^2)$. 这样的运行时间并不是我们需要的, 下面我们将介绍一种效率更高的选择算法.

#最坏情况为线性时间的选择算法

我们现在来介绍一个最坏情况的运行时间 $O(n)$ 的选择算法. 像 `RANDOMIZED_SELECT` 算法一样, `SELECT` 算法通过对输入数组的递归划分来找出所需的元素. 它使用的也是来自快速排序的确定性划分算法, `PARTITION`.

通过执行一下步骤, 算法可以确定一个有 $n>1$ 个不同元素的输入数组中第 $i$ 小的元素:

1. 将输入数组的 $n$ 个元素划分成 $\left \lceil{x/5}\right \rceil$ , 每组 $5$ 个元素, 且至多由剩下的 $n mod 5$ 个元素组成.
2. 寻找这 $\left \lfloor{x/5}\right \rfloor$ 组中每一组饿中位数: 首先对每组元素进行插入排序, 然后确定中位数.
3. 对第 $2$ 步中找出的 $\left \lceil{x/5}\right \rceil$ 个中位数, 递归调用 `SELECT` 以找出其中位数 $x$.
4. 利用修改过的 `partition` 版本, 按中位数的中位数 $x$ 对输入数组进行划分. 让 $k$ 比划分的低区中的元素数目多 $1$. 因此 $x$ 是第 $k$ 小的元素, 并且有 $n-k$ 个元素在划分的高区.
5. 如果 $i=k$, 则返回 $x$. 如果 $i<k$, 则在低区递归调用 `SELECT` 已找出第 $i$ 小的元素. 如果 $i>k$ 小的元素.

如果划分的主元素为 $x$, 至少有一半大于或等于中位数的中位数 $x$. 只要有一半的组中有 $3$ 个元素大于 $x$, 不算中间这个组, 大于 $x$ 的元素个数只要为:

$$3(\left \lceil \frac{1}{2}\left \lceil{\frac{n}{5}}\right \rceil \right \rceil) \geq \frac{3n}{10}$$

所以我们现在有一个递归式来推导 `SELECT` 算法的最坏情况的运行时间 $T(n)$了.

$$T(n) \leq \begin{cases}
 & O(1) & \text{ if } n < 140 \\\\
 & T(\left \lceil{x/5}\right \rceil) + T(7n/10+6) + O(n) & \text { if } n \geq 140
\end{cases}$$

所以, 可以得到 $T(n) = O(n)$.

与比较排序一样, `SELECT` 和 `RANDOMIZED_SELECT` 也是通过元素之间的比较来确定它们之间的相对次序的.
