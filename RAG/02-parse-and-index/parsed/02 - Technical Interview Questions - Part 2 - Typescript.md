# Technical Interview Questions - Part 2 - TypeScript

Giuliana Olmos · 24 de octubre de 2024 · https://dev.to/giulianaolmos/technical-interview-questions-part-2-typescript-1njn

## **Introduction**

Hello, hello!! :D

Hope you're all doing well!

How we're really feeling:

I'm back with the second part of this series. 😎

In this chapter, we'll dive into the ✨TypeScript✨ questions I've faced during interviews.

I'll keep the intro short, so let's jump right in!

## **Questions**

1. What are generics in typescript? What is <T> ?
2. What are the differences between interfaces and types?
3. What are the differences between <mark>any</mark>, <mark>null</mark>, <mark>unknown</mark>, and <mark>never</mark> ?

## **Question 1: What are generics in typescript? What is <T> ?**

*The short answer is...*

Generics in TypeScript allow us to create reusable functions, classes, and interfaces that can work with a variety of types, without having to specify a particular one. This helps to avoid using <mark>any</mark> as a catch-all type.

The syntax <T> is used to declare a generic type, but you could also use <V>, <M>, or any other placeholder.

*How does it work?*

Let's break it down with an example.

Suppose I have a function that accepts a parameter and returns an element of the same type. If I write that function with a specific type, it would look like this:

1 / 11

function returnElement(element: string): string {
  return element;
}

const stringData = returnElement("Hello world");

I know the type of <mark>stringData</mark> will be "string" because I declared it.

<img src="code_screenshot_1.png" alt="Code screenshot showing const stringData: string and const stringData = returnElement("Hello world");">

But what happens if I want to return a different type?

```
const numberData = returnElement(5);
```

I will receive an error message because the type differs from what was declared.

Argument of type 'number' is not assignable to parameter of type 'string'. ts(2345)
View Problem (<F8)   Quick Fix... (%.)

The solution could be to create a new function to return a number type.

```
function returnNumber(element: number): number {
  return element;
}
```

That approach would work, but it could lead to duplicated code.

A common mistake to avoid this is using <mark>any</mark> instead of a declared type, but that defeats the purpose of type safety.

```
function returnElement2(element: any): any {
  return element;
}

This is precisely when it's beneficial to use generics.

```typescript
function returnGenericElement<T>(element: T): T {
  return element;
}
```

The function will receive an element of a specific type; that type will replace the generic and remain so throughout the runtime.

This approach enables us to eliminate duplicated code while preserving type safety.

```typescript
const stringData2 = returnGenericElement("Hello world");

const numberData2 = returnGenericElement(5);
```

*But what if I need a specific function that comes from an array?*

We could declare the generic as an array and write it like this:

```typescript
function returnLength<T>(element: T[]): number {
  return element.length;
}
```

Then,

```typescript
const stringLength = returnLength(["Hello", "world"]);
```

The declared types will be replaced by the type provided as a parameter.

<mark>function returnLength<string>(element: string[]): number</mark>

*We can also use generics in classes.*

```typescript
class Addition<U> {
  add: (x: U, y: U) => U;
}
```

I have three points to make about this code:

1. ~~add~~ is an anonymous arrow function (which I discussed in the first chapter).
2. The generic can be named <U>, <T>, or even <Banana>, if you prefer.

3 / 11

3. Since we haven't specified the type yet, we can't implement operations inside the classes. Therefore, we need to instantiate the class by declaring the type of the generic and then implement the function.

Here's how it looks:

```javascript
const operation = new Addition<number>();

operation.add = (x, y) => x + y; => We implement the **function** here

console.log(operation.add(5, 6)); // 11
```

And, one last thing to add before ending this question. Remember that generics are a feature of Typescript. That means the generics will be erased when we compile it into Javascript.

From

```typescript
function returnGenericElement<T>(element: T): T {
  return element;
}
```

to

```typescript
function returnGenericElement(element) {
  return element;
}
```

## **Question 2: What are the differences between interfaces and types?**

*The short answer is:*

1. Declaration merging works with interfaces but not with types.
2. You cannot use <mark>implements</mark> in a class with union types.
3. You cannot use <mark>extends</mark> with an interface using union types.

Regarding the first point, *what do I mean by declaration merging?*

Let me show you: I've defined the same interface twice while using it in a class. The class will then incorporate the properties declared in both definitions.

4 / 11

```typescript
**interface** CatInterface {
    name: string;
    age: number;
}

**interface** CatInterface {
    color: string;
}

**const** cat: CatInterface = {
    name: "Tom",
    age: 5,
    color: "Black",
};
```

This does not occur with types. If we attempt to define a <mark>type</mark> more than once, TypeScript will throw an error.

```typescript
**type** dog = {
    name: string;
    age: number;
};

**type** dog = { // Duplicate identifier 'dog'.ts(2300)
    color: string;
};

**const** dog1: dog = {
    name: "Tom",
    age: 5,
    color: "Black", //Object literal may only specify known properties, and 'color' does not exist
    in type 'dog'.ts(2353)
};
```

<table>
  <tr>
    <th>Error Message</th>
  </tr>
<tr>
    <td>Duplicate identifier 'dog'. ts(2300)</td>
  </tr>
</table>

<table>
  <tr>
    <td>type dog = {</td>
  </tr>
<tr>
    <td>    color: string;</td>
  </tr>
<tr>
    <td>}</td>
  </tr>
</table>

5 / 11

Object literal may only specify known properties, and 'color' does not exist in type 'dog'. ts(2353)
(property) color: string

Regarding the following points, let's differentiate between <u>union</u> and <u>intersection</u> types:

<u>Union types</u> allow us to specify that a value can be one of several types. This is useful when a variable can hold multiple types.

<u>Intersection types</u> allow us to combine types into one. It is defined using the & operator.

```typescript
type cat = {
  name: string;
  age: number;
};

type dog = {
  name: string;
  age: number;
  breed: string;
};
```

**Union type:**

```typescript
type animal = cat | dog;
```

**Intersection type:**

```typescript
type intersectionAnimal = cat & dog;
```

If we attempt to use the <u>implements</u> keyword with a <u>union type</u>, such as **Animal**, TypeScript will throw an error. This is because <u>implements</u> expects a single interface or type, rather than a union type.

```typescript
class pet implements animal{
  name: string;
  age: number;
  breed: string;
  constructor(name: string, age: number, breed: string){
    this.name = name;
    this.age = age;
    this.breed = breed;
  }
}

A class can only **implement** an object type or intersection of object types with statically known members. ts(2422)

`type animal = cat | dog`

## **TypeScript allows us to use "implements" with:**

### a. Intersection types

```typescript
class pet2 implements intersectionAnimal {
    name: string;
    age: number;
    color: string;
    breed: string;
    constructor(name: string, age: number, color: string, breed: string) {
        this.name = name;
        this.age = age;
        this.color = color;
        this.breed = breed;
    }
}
```

### b. Interfaces

```typescript
interface CatInterface {
    name: string;
    age: number;
    color: string;
}
```

```typescript
class pet3 implements CatInterface {
    name: string;
    age: number;
    color: string;
    constructor(name: string, age: number, color: string) {
        this.name = name;
        this.age = age;
        this.color = color;
    }
}
```

### c. Single Type.

```typescript
class pet4 implements cat {
    name: string;
    age: number;
    color: string;
    constructor(name: string, age: number, color: string) {
        this.name = name;
        this.age = age;
    }
}
```

7 / 11

```javascript
    this.color = color;
}
}
```

The same issue occurs when we try to use <mark>extends</mark> with a union type. TypeScript will throw an error because an <mark>interface</mark> cannot extend a <mark>union type.</mark> Here's an example

```typescript
**interface** petUnionType **extends** animal {
    name: string;
    age: number;
    breed: string;
}
```

You cannot extend a union type because it represents multiple possible types, and it's unclear which type's properties should be inherited.

<table>
  <tr>
    <td>An interface can only extend an object type or <b>intersection</b> of object types with statically known members. ts(2312)</td>
  </tr>
<tr>
    <td><b>type</b> animal = cat | dog</td>
  </tr>
</table>

BUT you can extend a <mark>type</mark> or an <mark>interface</mark>.

```typescript
**interface** petIntersectionType **extends** intersectionAnimal {
    name: string;
    age: number;
    color: string;
    breed: string;
}

**interface** petCatInterface **extends** CatInterface {
    name: string;
    age: number;
    color: string;
}
```

Also, you can extend a single type.

```typescript
**interface** petCatType **extends** cat {
    name: string;
    age: number;
    color: string;
}
```

8 / 11

# Question 3: What are the **differences between** <mark>any</mark>, <mark>null</mark>, <mark>unknown</mark>, and <mark>never</mark>?

## *Short answer:*

> **Any** => It's a top-type variable (also called universal type or universal supertype). When we use <mark>any</mark> in a variable, the variable could hold any type. It's typically used when the specific type of a variable is unknown or expected to change. However, using any is not considered a best practice; it's recommended to use generics instead.

```typescript
let anyVariable: any;
```

While <mark>any</mark> allows for operations like calling methods, the TypeScript compiler won't catch errors at this stage. For instance:

```typescript
anyVariable.trim();
anyVariable.length;
```

You can assign any value to an <mark>any</mark> variable:

```typescript
anyVariable = 5;
anyVariable = "Hello";
```

Furthermore, you can assign an <mark>any</mark> variable to another variable with a defined type:

```typescript
let booleanVariable: boolean = anyVariable;
let numberVariable: number = anyVariable;
```

> **Unknown** => This type, like <mark>any</mark>, could hold any value and is also considered the top type. We use it when we don't know the variable type, but it will be assigned later and remain the same during the runtime. <mark>Unknown</mark> is a less permissive type than <mark>any</mark>.

```typescript
let unknownVariable: unknown;
```

Directly calling methods on unknown will result in a compile-time error:

```typescript
unknownVariable.trim();
```

9 / 11

```

```

```
'unknownVariable' is of type 'unknown'. ts(18046)
let unknownVariable: unknown
```

Before using it, we should perform checks like:

```
if (typeof unknownVariable === "string") {
    unknownVariable.trim();
}
```

Like <mark>any</mark>, we could assign any type to the variable.

```
unknownVariable = 5;
unknownVariable = "Hello";
```

However, we cannot assign the <mark>unknown</mark> type to another type, but <mark>any</mark> or <mark>unknown</mark>.

```
let booleanVariable2: boolean = unknownVariable;
let numberVariable2: number = unknownVariable;
```

This will show us an error

```
Type 'unknown' is not assignable to type 'number'. ts(2322)
let numberVariable2: number
```

<mark>Null</mark> => The variable can hold either type. It means that the variable does not have a value.

```
let nullVariable: null;

nullVariable = null;
```

Attempting to assign any other type to a null variable will result in an error:

```
nullVariable = "Hello";
```

10 / 11

Type `"Hello"` is not assignable to type `'null'`. ts(2322)

```typescript
let nullVariable: null
```

**Never** => We use this `type` to specify that a function doesn't have a return value.

```typescript
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    console.log("Hello");
  }
}
```

# **The end...**

We finish with Typescript,

For today (?)

I hope this was helpful to someone.

If you have any technical interview questions you'd like me to explain, feel free to let me know in the comments. 🤗

Have a great week 💜

11 / 11