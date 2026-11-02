# Technical Interview Questions - Part 1 - Javascript

Giuliana Olmos · 17 de octubre de 2024 · https://dev.to/giulianaolmos/technical-interview-questions-part-1-javascript-5gcj

## Introduction

Hey everyone!

How's it going?

I've been thinking about starting a series based on the theoretical questions I've come across in technical interviews. I'll be covering *Javascript*, *NodeJS*, *TypeScript*, and *SQL*.

The goal of this series is to give quick responses and explain key concepts. Also, you'll notice "Part 1" in the title—I'm not sure yet how many parts this series will have! 😊

This first chapter will dive into ✨Javascript✨.

So, let's go...

## Questions

1. What are the differences between regular and arrow functions in JavaScript?
2. What are the differences between <mark>then()</mark> and <mark>async/await</mark>?
3. What timing events do you know in JS, and how do they work?

## Question 1: What are the **differences between regular and arrow functions in JavaScript**?

*Answer:*

- They are syntactically different (Arrow functions were introduced in ECMAScript 6).
- ~~Arrow functions can be anonymous (they don't need a name).~~ //Clarification in *comments*
- The key difference lies in how they handle the <mark>this</mark> context.

In this post, I'll focus on the most commonly asked aspect: the difference in how <mark>this</mark> is handled.

Let's use this object as an example.

1 / 10

```javascript
const cat = {
  name: 'Rubi',

  //This is a regular function
  regularGreet() {
    console.log(`Hello, my name is ${this.name}. I mean... meow`);
  },

  //This is an arrow function
  arrowGreet: () => {
    console.log(`Hello, my name is ${this.name}. I mean... meow`);
  },
};
```

If you run those functions, the result will be the next.

```javascript
cat.regularGreet(); // return "Hello, my name is Rubi. I mean... meow"

cat.arrowGreet(); // return "Hello, my name is undefined. I mean... meow"
```

In the arrow function, `${this.name}` is <mark>undefined</mark>.

<mark>DISCLAIMER: This example works if you're using Node or Deno. However, it will throw an error in Bun because the default context is <mark>undefined</mark>.</mark>

But...

Because of how the <mark>this</mark> keyword works:

In regular functions, <mark>this</mark> refers to the object the function is a part of. However, arrow functions don't have their own <mark>this</mark>; instead, they inherit it from the surrounding context.

For example, if I log <mark>this</mark> inside a regular function, it will output the cat object.

```javascript
regularGreet() {
  console.log({ this: this });
  console.log(`Hello, my name is ${this.name}. I mean... meow`);
},
```

Log:

2 / 10

```
▼ (1) {this: {...}}
  ▼ this: (3) {name: "Rubi", regularGreet: regular...}
  name: "Rubi"
  ▶ regularGreet: f regularGreet()
  ▶ arrowGreet: f arrowGreet()
  ▶ [[Prototype]]: {}
  ▶ [[Prototype]]: {}
```

But, when I log <mark>this</mark> in an arrow function:

```javascript
arrowGreet: () => {
  console.log({ this: this });
  console.log(`Hello, my name is ${this.name}. I mean... meow`);
},
```

Log:

```
▼ (1) {this: {...}}
  ▶ this: {}
  ▶ [[Prototype]]: {}
```

<mark>This</mark> is empty.

<mark>It's essential to know that when we don't have a broader scope, this refers to the Window object.</mark>

**How could you print the name in <mark>arrowGreet</mark> ?**

Well, you could define <mark>this</mark>, inside <mark>arrowGreet()</mark>

```javascript
arrowGreet: () => {
  console.log({ this: this });
  this.name = 'Rubi'

  console.log(`Hello, my name is ${this.name}. I mean... meow`);
},
```

Now, you will be logging:

Hello, my name is Rubi. I mean... meow

3 / 10

However, this is not a good practice; if you have to define this inside the function, use regular functions instead.

But if you want to inherit the context for the arrow function. You could do the next.

```javascript
inheritContext() {
  const inceptionArrow = () => {
    console.log({ this2: this });
    console.log(`Hello, my name is ${this.name}. I mean... meow`);
  };
  inceptionArrow();
},
```

`inheritContext()` => It's a regular function. So the context of <mark>this</mark> is the same as `regularGreet()`, the object cat.

`inceptionArrow()` => It's inside of <mark>inheritContext()</mark>. As we said before, the arrow function inherits its context. So, which context is it inheriting from?

Yes, cat.

The result of printing <mark>this2</mark>

<table>
  <tr>
    <td>▼ (1) {this2: {...}}</td>
  </tr>
<tr>
    <td>▼ this2: (4) {name: "Rubi", regularGreet: regular...</td>
  </tr>
<tr>
    <td>name: "Rubi"</td>
  </tr>
<tr>
    <td>▶ regularGreet: f regularGreet()</td>
  </tr>
<tr>
    <td>▶ arrowGreet: f arrowGreet()</td>
  </tr>
<tr>
    <td>▶ inheritContext: f inheritContext()</td>
  </tr>
<tr>
    <td>▶ [[Prototype]]: {}</td>
  </tr>
<tr>
    <td>▶ [[Prototype]]: {}</td>
  </tr>
<tr>
    <td>Hello, my name is Rubi. I mean... meow</td>
  </tr>
</table>

We can apply the same approach with another example, this time using <mark>setTimeout()</mark>. In this case, we have a regular function that contains an arrow function, which inherits its context from <mark>secondCombinationFunctions()</mark>.

```javascript
secondCombinationFunctions() {
  setTimeout(() => {
    console.log({ this3: this });
    console.log(`Hello, my name is ${this.name}. I mean... meow`);
  }, 1000);
},
```

4 / 10

# **Question 2: What are the **differences between** <mark>then()</mark> and <mark>async/await</mark>?</mark>

**Answer:**

> There are no differences between them other than their syntaxes.

If we have an existent function called <mark>asyncFunction()</mark> and we run it using <mark>async/await</mark> and <mark>then()</mark>

```javascript
await asyncFunction();
console.log('Run this after running asyncFunction');

asyncFunction.then(() => {
    console.log('Run this after running asyncFunction');
});
```

The results and the order of its run will be the same.

> The difference could be that sometimes we need to run several functions concurrently, and using <mark>then()</mark> could create a callback hell.

```javascript
function1().then(() => {
    function2().then(() => {
        function3().then(() => {
            function4...
        })
    })
})
```

## **Question 2.5: How do you avoid a callback Hell?**

**Answer:**

> Using <mark>async/await</mark>. Avoiding nested <mark>.then()</mark> calls.

The execution is almost the same, but it's more readable in this way.

<mark>async/await:</mark>

```javascript
await function1()
await function2()
await function3()
```

5 / 10

```javascript
await function4()
...
```

`.then():`

```javascript
function1()
  .then(function2)
  .then(function3)
  .then(function4)
```

# **Question 3: What timing events do you know in JS, and how do they work?**

*Answer:*

I know about two different timing events in JS.
setTimeout()
 setInterval()

Both methods from the <mark>"window"</mark> object allow you to run your code in intervals.

The definition of both from <mark>w3school</mark> is:

**setTimeout(function, milliseconds)** Executes a function, after waiting a specified number of milliseconds.

**setInterval(function, milliseconds)** It is the same as <mark>setTimeout()</mark> but repeats the function's execution continuously.

## **How it works setTimeout?**

```javascript
function testSetTimeout() {
  console.log('Start function');
  setTimeout(() => {
    console.log('Hello World');
  }, 3000);
  console.log('Waiting set Time out');
}

testSetTimeout();
```

Logs:

6 / 10

```
Start function
Waiting setTimeout
Hello World
```

The order of how it runs is

1. Run `console.log('Start function')`;
2. Run `setTimeout()`; The timing starts to count now before running the function inside setTimeout.
3. Run `console.log('Waiting set Time out')`;
4. The timer hits 3000 and runs the function that shows the `console.log`.

## **How do I stop the `setTimeout`?**

When the function set with the `setTimeout` has yet to run, you can stop it with `clearTimeout()`.

```javascript
function testSetTimeout() {
  console.log('Start function');
  const settedTimeout = setTimeout(() => {
    console.log('Hello World');
  }, 3000);
  console.log('Waiting setTimeout');
  clearTimeout(settedTimeout);
}

testSetTimeout();
```

Log:

```
Start function
Waiting setTimeout
```

7 / 10

# How it works setInterval?

```javascript
function testSetInterval() {
  console.log('Start function');
  setInterval(() => {
    console.log('Run interval');
  }, 2000);
  console.log('Waiting for interval starting');
}

testSetInterval()
```

1. Run <mark>console.log('Start function');</mark>
2. Run <mark>setInterval();</mark> As <mark>setTimeout()</mark> in that line is when the timer starts to count.
3. Run <mark>console.log('Waiting for interval starting');</mark>
4. The timer hits 2000ms and runs the function that shows the <mark>console.log</mark>. *Then, every 2000ms, the function runs again.*

<table>
  <tr>
    <td>Waiting for interval starting</td>
  </tr>
<tr>
    <td>Run interval</td>
  </tr>
<tr>
    <td>Run interval</td>
  </tr>
<tr>
    <td>Run interval</td>
  </tr>
<tr>
    <td>Run interval</td>
  </tr>
<tr>
    <td>Run interval</td>
  </tr>
<tr>
    <td>Run interval</td>
  </tr>
<tr>
    <td>Run interval</td>
  </tr>
</table>

## How could we stop it?

Using <mark>clearInterval()</mark>

```javascript
function testSetInterval() {
  console.log('Start function');
  const settedInterval = setInterval(() => {
    console.log('Run interval');
  }, 2000);
  console.log('Waiting for interval starting');

  clearInterval(settedInterval);
}

testSetInterval()
```

The result is the next:

8 / 10

# Start function
# Waiting for interval starting

*Or... we could combine the timers to step the interval after a specific time.*

```javascript
function testSetInterval() {
  console.log('Start function');
  const settedInterval = setInterval(() => {
    console.log('Run interval');
  }, 2000);
  console.log('Waiting for interval starting');

  setInterval(() => {
    clearInterval(settedInterval);
  }, 10000)
}

testSetInterval()
```

Then, the interval will run for 10k milliseconds for each 2k ms.

<table>
  <tr>
    <td>Start function</td>
  </tr>
<tr>
    <td>Waiting for interval starting</td>
  </tr>
<tr>
    <td>Run interval</td>
  </tr>
<tr>
    <td>Run interval</td>
  </tr>
<tr>
    <td>Run interval</td>
  </tr>
<tr>
    <td>Run interval</td>
  </tr>
<tr>
    <td>Run interval</td>
  </tr>
</table>

9 / 10

# **The end...**

That's all for now! I'm working on more posts covering common interview questions (I've got a list of others to tackle). If there's a specific question you'd like me to explain, feel free to drop it in the comments, and I'll make sure to include it.

✨ I hope this is helpful to everyone! ✨

Thank you so much, and see you next time 🤗

## **Last but not least**

I want to say thanks to Samuel Rouse for taking the time to write comments, correcting and adding clarifications that helped me improve this post.

10 / 10