# Technical Interview Questions - Part 5 - Event Loop

Giuliana Olmos · 28 de noviembre de 2024 · https://dev.to/giulianaolmos/technical-interview-questions-part-5-event-loop-1ki4

## Introduction

Hello, everybody!
Today, as the title says 😊, I'll be talking about the event loop.

This is not a topic that interviewers often ask about directly (I can only remember two occasions when they asked me to explain the event loop). BUT, in most interviews, they ask questions that are related to it. For example:

- "If I do this... what should be the behavior?"
- "If my code looks like this, what will be the output?"
- "Why does this code produce this output?"

All those questions are much easier to answer if you understand how the event loop works.

I'll be honest: this topic isn't my favorite. I much prefer questions about the behavior of code rather than explaining how the event loop works for 10 minutes straight.😊

Let's dive in! 😄

## Questions

1. What is the event loop?
2. Examples

## What is the **event loop**?

*Short Answer:*

<mark> The event loop is responsible for handling asynchronous tasks in the JavaScript runtime.</mark>

To be honest, I don't think this answer is enough to satisfy the curiosity of an interviewer asking about the event loop. So, in this post, I'd like to dive deeper into this topic.

More than just knowing the concepts, it's important to understand **how** it works. That's why I've added some examples at the end.

1 / 13

# Theory

## What is the Event Loop?

JavaScript has a runtime based on an event loop, which is responsible for handling tasks. Each language has a unique runtime, and an important point to note is that JavaScript is **single-threaded**.

## What Does Single-Threaded Mean?

Single-threaded means that **JavaScript can handle only one task at a time**. This is why the event loop is so essential in JavaScript; it helps manage tasks efficiently despite this single-thread limitation.

## Components of the Runtime

To understand the event loop better, let's first look at its main components:

<table>
  <tr>
    <th>Component</th>
  </tr>
<tr>
    <td><mark>Call Stack</mark></td>
  </tr>
<tr>
    <td><u>Visual Representation Event Loop</u></td>
  </tr>
<tr>
    <td>Event Loop</td>
  </tr>
<tr>
    <td><b>Task Queue</b></td>
  </tr>
<tr>
    <td><b>Microtask Queue</b></td>
  </tr>
</table>

## Call Stack

The **call stack** is a data structure that keeps track of the functions we call. You can think of it like a stack of plates: when a function is called, it's added to the stack, and when it finishes, it's removed from the stack.

2 / 13

The call stack operates on a **LIFO (Last-In-First-Out)** principle, meaning JavaScript executes functions in the order they're stacked—from the topmost item down to the bottom, one at a time (remember, JavaScript is *single-threaded*).

## **Queues**

In JavaScript's runtime, we have queues, which hold lists of tasks to be processed. Tasks in these queues wait until the call stack is empty.

- **Task Queue (or Callback Queue):** <mark>setTimeout()</mark> and <mark>setInterval()</mark> calls. This queue stores tasks like `setTimeout()` and `setInterval()` calls. Tasks here are processed after the call stack is empty and after all tasks in the Microtask Queue have been processed. See more examples of tasks that are stored in this queue on MDN.

- **Microtask Queue:** This queue has priority over the Task Queue. It includes microtasks such as <mark>Promise</mark> callbacks and asynchronous functions like <mark>process.nextTick()</mark> and <mark>async</mark> functions.

The **Task Queue** works on a **FIFO (First-In-First-Out)** basis, meaning tasks are processed in the order they're added, but only after the Microtask Queue is empty.

## **Event Loop**

The **event loop** is a mechanism that manages the execution of asynchronous code. It observes the call stack and coordinates *between* the call stack and the queues (Task Queue and Microtask Queue) to keep the code running smoothly.

## **How Does It Work?**

Let's go through the event loop process step by step. Refer to the image below for a visual representation.

3 / 13

<table>
  <tr>
    <th>Component</th>
    <th>Content</th>
  </tr>
<tr>
    <td>Call Stack</td>
    <td><mark>Yellow Box</mark></td>
  </tr>
<tr>
    <td>Event Loop</td>
    <td>Recycling symbol</td>
  </tr>
<tr>
    <td>Task Queue</td>
    <td><mark>Pink Box</mark></td>
  </tr>
<tr>
    <td>Microtask Queue</td>
    <td><mark>Purple Box</mark> <mark>Purple Box</mark></td>
  </tr>
</table>

In this example:

- The **Call Stack** has one function.
- The **Microtask Queue** has two messages.
- The **Task Queue** has one message.

**Step 1: Process the Call Stack**

1. The event loop starts by looking at the **Call Stack**.
2. It finds a function in the stack and begins executing it.
3. Once this function completes, it is removed from the **Call Stack**.

4 / 13

# Call Stack

# Event Loop

# Task Queue
<mark> </mark>

# Microtask Queue
<mark> </mark> <mark> </mark>

## **Step 2: Process the Microtask Queue**

1. After the **Call Stack** is empty, the event loop checks the **Microtask Queue**.
2. It takes the first message from the **Microtask Queue** and pushes it to the **Call Stack** for execution.

5 / 13

<table>
  <tr>
    <th>Component</th>
    <th>Content</th>
  </tr>
<tr>
    <td>Call Stack</td>
    <td><mark>1</mark></td>
  </tr>
<tr>
    <td>Event Loop</td>
    <td>Icon</td>
  </tr>
<tr>
    <td>Task Queue</td>
    <td><mark>pink</mark></td>
  </tr>
<tr>
    <td>Microtask Queue</td>
    <td><mark>2</mark></td>
  </tr>
</table>

3. The function runs and, once completed, is removed from the **Call Stack**.
4. The event loop then moves to the next message in the **Microtask Queue** and repeats the process.
5. This continues until there are no more messages left in the **Microtask Queue**.

6 / 13

<table>
  <tr>
    <th>Component</th>
    <th>Content</th>
  </tr>
<tr>
    <td>Call Stack</td>
    <td>2</td>
  </tr>
<tr>
    <td>Event Loop</td>
    <td>Recycling icon</td>
  </tr>
<tr>
    <td>Task Queue</td>
    <td>Pink box</td>
  </tr>
<tr>
    <td>Microtask Queue</td>
    <td>Empty</td>
  </tr>
</table>

# Step 3: Process the Task Queue

1. Once both the **Call Stack** and the **Microtask Queue** are empty, the event loop turns to the **Task Queue**.
2. It picks the first message in the **Task Queue** and adds it to the **Call Stack**.
3. The function runs, and when it completes, it's removed from the **Call Stack**.
4. The event loop will continue this process with each task in the **Task Queue**, ensuring all tasks are handled one by one.

7 / 13

# Call Stack

# Event Loop

# Task Queue

# Microtask Queue

By following this order—**Call Stack**, then **Microtask Queue**, and finally **Task Queue**—the event loop helps JavaScript handle asynchronous code efficiently, even within its single-threaded environment.

## Examples

Now that we understand how the event loop works and how tasks are prioritized, let's look at some examples.

## Example 1

```javascript
const a = new Promise(function showA(resolve){
    console.log('A');
    resolve('B');
});

setTimeout(function showC() {
    console.log('C');
}, 0);

a.then(function showB(b) {
    console.log(b);
});

const d = function showD() {
```

8 / 13

```javascript
console.log('D');
};

d();
```

Before continuing, try to think about the order of the output.

✨ What do you expect it to be? ✨

Let's break down each part of the code to understand why we get this output.

## 1. Creating the Promise

```javascript
const a = new Promise(function showA(resolve) {
    console.log('A');
    resolve('B');
});
```

- Here, we create a new promise with a callback function.
- Inside this function, <mark>console.log('A')</mark> is executed immediately, so "**A**" is printed to the console.
- After logging "A", the promise is resolved with the value "<mark>"B"</mark>".
- JavaScript recognizes there's a <mark>.then</mark> callback (i.e., <mark>showB</mark>) that should run once the main call stack is clear, so it adds <mark>showB</mark> to the **Microtask Queue** (since promise resolutions go there).

## 2. setTimeout Call

```javascript
setTimeout(function showC() {
    console.log('C');
}, 0);
```

- The <mark>setTimeout</mark> function schedules <mark>showC</mark> to run after 0 milliseconds.
- JavaScript places <mark>showC</mark> in the Task Queue because it's a timer-based function.

## 3. a.then Callback

```javascript
a.then(function showB(b) {
    console.log(b);
});
```

- This line registers a <mark>.then</mark> handler for the promise we already resolved in the previous step (<mark>resolve('B')</mark>).
- Since the promise is resolved, <mark>showB</mark> (the <mark>.then</mark> callback) is added to the **Microtask Queue**.

9 / 13

# 4. **Defining** d

```javascript
const d = function showD() {
    console.log('D');
};
```

- This line simply defines the function <mark>showD</mark> but doesn't execute it yet, so nothing happens here.

# 5. **Calling** d()

```javascript
d();
```

- Now, we call <mark>d()</mark>, which is added to the **Call Stack** and executed. This results in <mark>console.log('D')</mark>, so "**D**" is printed to the console.

## Final Output Order:

<table>
  <tr>
    <td>A</td>
    <td>D</td>
    <td>B</td>
    <td>C</td>
  </tr>
</table>

## GIF for reference

<table>
  <tr>
    <th>Code</th>
  </tr>
<tr>
    <td>1 = const a = new Promise(function showA(resolve){</td>
  </tr>
<tr>
    <td>2   console.log('A');</td>
  </tr>
<tr>
    <td>3   resolve('B')</td>
  </tr>
<tr>
    <td>4 }</td>
  </tr>
<tr>
    <td>5 </td>
  </tr>
<tr>
    <td>6 setTimeout(function showC(){console.log('C')}, 0)</td>
  </tr>
<tr>
    <td>7 </td>
  </tr>
<tr>
    <td>8 a.then(function showB(b){console.log(b)})</td>
  </tr>
<tr>
    <td>9 </td>
  </tr>
<tr>
    <td>10 const d = function showD(){console.log('D')}</td>
  </tr>
<tr>
    <td>11 </td>
  </tr>
<tr>
    <td>12 d()</td>
  </tr>
<tr>
    <td>13 </td>
  </tr>
</table>

Built by Andrew Dillon. Inspired by Loupe.

## Interactive Example

10 / 13

# Example 2

```javascript
console.log("Start!");

setTimeout(function showTimeout() {
  console.log("Timeout!");
}, 0);

Promise.resolve("Promise!")
  .then(function showPromise(res) {
    console.log(res);
  });

console.log("End!");
```

Again, take a moment to think about the order of the output.

✨ What do you expect it to be? ✨

Let's go with the explanation...

## 1. Logging "Start!"

```javascript
console.log("Start!");
```

- This line is added to the **Call Stack** and executed immediately.
- As a result, "**Start!**" is printed to the console.

## 2. `setTimeout` Call

```javascript
setTimeout(function showTimeout() {
  console.log("Timeout!");
}, 0);
```

- The `setTimeout` function schedules `showTimeout` to run after 0 milliseconds.
- JavaScript places `showTimeout` in the **Task Queue** since it's a timer-based function.

## 3. Promise Resolution

```javascript
Promise.resolve("Promise!")
  .then(function showPromise(res) {
    console.log(res);
  });
```

- The promise is resolved immediately with the value "Promise!".

11 / 13

- JavaScript places <mark>showPromise</mark> (the <mark>.then</mark> callback) in the **Microtask Queue** because promises go into the microtask queue after being resolved.

## 4. Logging "End!"

```javascript
console.log("End!");
```

- This line is added to the **Call Stack** and executed immediately.
- As a result, "**End!**" is printed to the console.

## Final Output Order:

Start!
End!
Promise!
Timeout!

## GIF for reference

<table>
  <tr>
    <th>Section</th>
    <th>Content</th>
  </tr>
<tr>
    <td>JS JavaScript Visualizer 9000</td>
    <td>Choose an Example</td>
  </tr>
<tr>
    <td>Code</td>
    <td>
      1 `console.log("Start!");`<br />
      2<br />
      3- `setTimeout(function showTimeout() {`<br />
      4 `  console.log("Timeout!");`<br />
      5 `}, 0);`<br />
      6<br />
      7 `Promise.resolve("Promise!")`<br />
      8- `.then(function showPromise(res) {`<br />
      9 `  console.log(res);`<br />
      10 `});`<br />
      11<br />
      12 `console.log("End!");`<br />
      13
    </td>
  </tr>
<tr>
    <td>Task Queue</td>
    <td>ABOUT</td>
  </tr>
<tr>
    <td>Microtask Queue</td>
    <td>ABOUT</td>
  </tr>
<tr>
    <td>Call Stack</td>
    <td>ABOUT</td>
  </tr>
<tr>
    <td>Event Loop</td>
    <td>
      1 <b>Evaluate Script</b><br />
      Synchronously execute the script as though it were a function body. Run until the Call Stack<br />
      2 Run a Task<br />
      3 Run all Microtasks<br />
      4 Render
    </td>
  </tr>
<tr>
    <td colspan="2">Built by Andrew Dillon. Inspired by Loupe.</td>
  </tr>
</table>

Interactive Example

## End

This chapter wasn't too long, but I hope these examples helped you understand how the event loop works.

12 / 13

I strongly recommend experimenting with the interactive page to analyze other examples.
Playing around on that page can make it much easier to understand the event loop in action.

Thank you so much for all the love on my previous posts!
See you next week! 😊

Bye Bye

13 / 13