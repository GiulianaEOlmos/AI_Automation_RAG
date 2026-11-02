# Technical Interview Questions - Part 6 - SQL 2

Giuliana Olmos · 12 de diciembre de 2024 · https://dev.to/giulianaolmos/technical-interview-questions-part-6-sql-2-1oaf

## Introduction

Hello, everyone! 😊
We're getting close to the end of this series, and I hope you've been enjoying it so far.

In this post, I'll dive into some SQL questions that I couldn't include in the earlier posts. These questions are pretty recent—I had to answer them just a few days ago—and interestingly, they came up twice!

As you've probably noticed, this post is titled "SQL 2." If you're curious about the first post on SQL, you can check it out here.

Now, let's jump into the questions!

## Questions

1. What is the difference between OUTER JOIN and INNER JOIN?
2. What is an Index? What are the Trade-offs of Using Indices?

## Question 1: **What is the difference between OUTER JOIN and INNER JOIN?**

*This will be a short answer since it's not too complicated...*

- **Inner Join**: The inner join is used when we want to return only the common values (or rows) between two tables.
- **Outer Join**: In contrast, the outer join returns the same values as the inner join, plus any rows that don't have a match in the other table.

## **Which table will be prioritized?**

It depends on the type of outer join being used:

- **Left Join**: Returns the inner join results plus all the rows from the left table.
- **Right Join**: Returns the inner join results plus all the rows from the right table.

1 / 3

- **Full Join**: Returns all the rows from both tables, regardless of matches.

# INNER JOIN

<table>
  <tr>
    <th>Set A</th>
    <th>Set B</th>
    <th>Intersection</th>
  </tr>
<tr>
    <td>A only</td>
    <td>B only</td>
    <td>A ∩ B</td>
  </tr>
</table>

# OUTER JOIN

## LEFT JOIN

<table>
  <tr>
    <th>Set A</th>
    <th>Set B</th>
    <th>Intersection</th>
  </tr>
<tr>
    <td>A only</td>
    <td>B only</td>
    <td>A ∩ B</td>
  </tr>
</table>

## RIGHT JOIN

<table>
  <tr>
    <th>Set A</th>
    <th>Set B</th>
    <th>Intersection</th>
  </tr>
<tr>
    <td>A only</td>
    <td>B only</td>
    <td>A ∩ B</td>
  </tr>
</table>

## FULL JOIN

<table>
  <tr>
    <th>Set A</th>
    <th>Set B</th>
    <th>Intersection</th>
  </tr>
<tr>
    <td>A only</td>
    <td>B only</td>
    <td>A ∩ B</td>
  </tr>
</table>

---

# **Question 2: What is an Index? What are the Trade-offs of Using Indices?**

*The short answer is...*

<mark>An index is an object in the database used to optimize query performance. By creating an index, you can significantly speed up how quickly the database retrieves data.</mark>

In most cases, interviewers might not directly ask, "What is an index?" Instead, you could first encounter a question like, "**How would you debug a slow query or improve its performance?**" This is when you might respond, ✨"**I would improve this query using an index.**"✨ This response could lead the interviewer to ask more about indices.

Then...

An index is a tool associated with a database table designed to improve query performance. It's stored within the database, meaning it occupies storage space.

Indexes can be composed of one (Single-column Index) or more (Composite Index) columns.

2 / 3

# **What are the trade-offs of using indices?** 🎯

1. **Increased Disk Space Usage** Indexes take up additional storage in the database. The more indexes you create, the more disk space is consumed.

2. **Slower Write Operations** When we use ~~INSERT~~, ~~UPDATE~~, or ~~DELETE~~ operations, the database also needs to update the indexes. This makes these operations take more time to process.

3. **More Maintenance** Using indexes adds maintenance overhead. Every time we update the data, we need to consider how the indexes on the affected tables will be impacted. Here are some questions to keep in mind:
   - Does this change affect the index?
   - How much time will it take to update the index?
   - Will the table or index be locked during the update?

## **Extra Data: Index Usage in Firestore**

<table>
  <tr>
    <td>Indices can sometimes be expensive, both in terms of resources and limits. For example, in Firestore, you are limited to 200 indices if billing is not enabled for your Google Cloud project.</td>
  </tr>
<tr>
    <td>If you need more indices, enabling billing increases the quota to 500 indices. This limitation means you need to be strategic and efficient with how you use your indices to avoid unnecessary costs or hitting quota limits.</td>
  </tr>
</table>

## **End**

In recent interviews I've participated in, I've noticed an increase in database-related questions. 🤔 I hope these posts help clarify some of those questions and also help you answer them in a more consistent way.

As always, if you have any questions from a previous interview that you'd like to share, feel free to let me know! 😎

Wishing you all a great week. 🥰

Thank you so much!
Bye-bye!

3 / 3