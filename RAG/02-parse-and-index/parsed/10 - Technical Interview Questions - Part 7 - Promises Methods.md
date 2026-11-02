# Technical Interview Questions - Part 7 - Promises Methods

Giuliana Olmos · 19 de diciembre de 2024 · https://dev.to/giulianaolmos/technical-interview-questions-part-7-promises-methods-311n

## Introduction

Hello! 😊
We've reached the end of this series! 🎉
It's been months of interviewing, thinking, writing, and coding.

Interviews can be stressful and challenging, and staying positive through rejections is never easy. I started this series after going through several interviews where I struggled—whether it was not knowing enough, giving inconsistent answers, or having difficulty expressing myself clearly.

I truly hope these posts have been as helpful to you as they have been to me.

For this final post, I'm covering just one question, so it'll be a short one. Let's dive in!

## Questions

1. What Are <mark>Promise.all()</mark>, <mark>Promise.allSettled()</mark>, and <mark>Promise.race()</mark> ?

## **What Are <mark>Promise.all()</mark>, <mark>Promise.allSettled()</mark>, **and <mark>Promise.race()</mark> ?**

### 🎯 **Promise.all()**

This method takes an iterable of promises and returns a single promise that fulfills when all the input promises have fulfilled. If any of the promises reject, the returned promise immediately rejects with the reason for the first rejection. All the promises run at the same time, and the total time it takes equals the time taken by the slowest promise to resolve.

### 🎯 **Promise.allSettled()**

This method works similarly to <mark>Promise.all()</mark>, but the difference is in the returned value. Instead of stopping at the first rejection, it waits for all promises to settle (either resolve or reject). The result is an array that shows the outcome of each promise. All promises run at the same time, and the total time it takes equals the time taken by the slowest promise to settle. If

1 / 2

one or more promises fail, you'll still be able to see the result, since the status of each promise will be included in the returned array, in the same order as the input promises.

# **Promise.race()**

Like <mark>Promise.all()</mark> and <mark>Promise.allSettled()</mark>, this method also takes an iterable of promises. The difference is that instead of waiting for all the promises, it settles as soon as the first promise resolves or rejects. The returned promise adopts the state (fulfilled or rejected) and value or reason of the first settled promise. This method is part of the promise concurrency methods.

## ✨ Key Points ✨

- All three methods handle arrays (or iterables) of promises.
- <mark>Promise.all()</mark> and <mark>Promise.allSettled()</mark> execute all promises concurrently, while <mark>Promise.race()</mark> resolves/rejects based on the first settled promise.
- Each method has its use case depending on whether you need all results, individual outcomes, or the fastest result.

## **End**

As I mentioned, this was a really short post. 😊 This marks the end of this series (at least for this season). 🥰

I've been thinking about a lot of topics to write about next. Interviews have taught me so many new things—new topics, new ways of thinking, and a lot about architecture. So maybe the next series will be about that. 🤩

For now, I'm planning to take a few weeks to rest before I start writing again. I really want to take some time to recharge.

I truly hope all of you find your dream job. 💖 Wishing you the best of luck on this journey! If any of you land a job or successfully answer interview questions thanks to my posts, I'd love to hear about it.

Thank you so much for reading! 😊

Have a wonderful end of the year and an even better new year filled with opportunities, interviews, and exciting challenges! 🎉

2 / 2