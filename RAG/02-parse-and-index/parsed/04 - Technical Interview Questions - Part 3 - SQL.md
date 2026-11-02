# Technical Interview Questions - Part 3 - SQL

Giuliana Olmos · 7 de noviembre de 2024 · https://dev.to/giulianaolmos/technical-interview-questions-part-3-sql-ni4

## Introduction

Hi everyone! 🤗 I'm back with a new set of SQL questions. They aren't too complicated (I think), but I've often struggled to explain them clearly 😢. I could give examples from my own use, but I couldn't always find the right words to describe them.

I'll keep this intro short, so let's dive into the questions! 😎

## Questions

1. What is a key in SQL, and what types do you know?
2. What is a subquery?
3. What is a transaction in SQL??

## Question 1: **What is a key in SQL, and what types do you know?**

*The short answer is...*

> A key is a set of attributes that we use to identify a specific row in a table or to create relationships between tables.

> There are different types of keys:

- Primary Key
- Candidate Key
- Super Key
- Alternate Key
- Unique Key
- Composite Key
- Foreign Key

...

1 / 7

# Primary Key

**A primary key** is the key to uniquely identifying each row (record) in a table.

- A table can have only **one** primary key.
- Can be made up of **one or more** columns.
- Cannot be **NULL**.
- Cannot be duplicated.

Table <mark>students</mark>

<table>
  <thead>
    <tr>
      <th>StudentID</th>
      <th>FirstName</th>
      <th>LastName</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>John</td>
      <td>Doe</td>
    </tr>
<tr>
      <td>2</td>
      <td>Jane</td>
      <td>Smith</td>
    </tr>
<tr>
      <td>3</td>
      <td>Bob</td>
      <td>Brown</td>
    </tr>
  </tbody>
</table>

In this example, <mark>StudentID</mark> is the primary key. Each student has only one <mark>StudentID</mark>.

...

# Candidate key

**A candidate key** is a set of columns that can uniquely identify each row in a table. A table can have multiple candidate keys, but only **one** will be chosen as the **primary key**. A candidate key must be **minimal** and cannot include extra columns.

Table <mark>vehicles</mark>

<table>
  <thead>
    <tr>
      <th>VIN</th>
      <th>LicensePlate</th>
      <th>Model</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1HGCM82633A123456</td>
      <td>ABC123</td>
      <td>Civic</td>
    </tr>
<tr>
      <td>1HGCM82633A654321</td>
      <td>XYZ987</td>
      <td>Accord</td>
    </tr>
  </tbody>
</table>

<mark>VIN</mark> and <mark>LicensePlate</mark> are the candidate keys for this table because both can uniquely identify a vehicle.

...

# Super Key

**A super key** is a set of columns that can uniquely identify records in a table. **All candidate keys** are super keys, but not all super keys are candidate keys because super keys may include columns that are not necessary for uniqueness.

Table <mark>employees</mark>

2 / 7

<table>
  <thead>
    <tr>
      <th>EmployeeID</th>
      <th>Email</th>
      <th>PhoneNumber</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>john.doe@example.com</td>
      <td>123-456-7890</td>
      <td>John Doe</td>
    </tr>
<tr>
      <td>2</td>
      <td>jane.smith@example.com</td>
      <td>987-654-3210</td>
      <td>Jane Smith</td>
    </tr>
  </tbody>
</table>

- {EmployeeID, Email} and {EmployeeID, Email, PhoneNumber} are **Super Keys** because the combination of those columns can uniquely identify each record.

...

## **Alternate Key**

When a primary key is selected, any remaining key becomes an alternate key.

Table <mark>Authors</mark>

<table>
  <thead>
    <tr>
      <th>AuthorID</th>
      <th>SSN</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>123-45-6789</td>
      <td>John Doe</td>
    </tr>
<tr>
      <td>2</td>
      <td>987-65-4321</td>
      <td>Jane Smith</td>
    </tr>
  </tbody>
</table>

**Primary Key** => <mark>AuthorID</mark> **Alternate Key** => <mark>SSN</mark> (Since it can also uniquely identify a record but is not chosen as the Primary Key).

...

## **Unique Key**

It also uniquely identifies records BUT allows **NULL** values.

Table <mark>employees</mark>

<table>
  <thead>
    <tr>
      <th>EmployeeID</th>
      <th>Email</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>101</td>
      <td>john.doe@example.com</td>
      <td>John Doe</td>
    </tr>
<tr>
      <td>102</td>
      <td>jane.smith@example.com</td>
      <td>Jane Smith</td>
    </tr>
<tr>
      <td>103</td>
      <td>bob.brown@example.com</td>
      <td>Bob Brown</td>
    </tr>
  </tbody>
</table>

**Primary Key** => <mark>EmployeeID</mark> (Unique for each employee). **Unique Key** => <mark>Email</mark> (Each email is unique).

...

3 / 7

# Composite Key

These keys are made up of **two or more columns** that uniquely identify a record.

Table <mark>CourseEnrollments</mark>

<table>
  <thead>
    <tr>
      <th>StudentID</th>
      <th>CourseID</th>
      <th>EnrollmentDate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>101</td>
      <td>2024-01-01</td>
    </tr>
<tr>
      <td>2</td>
      <td>102</td>
      <td>2024-01-02</td>
    </tr>
<tr>
      <td>1</td>
      <td>102</td>
      <td>2024-01-03</td>
    </tr>
  </tbody>
</table>

The **composite key** is <mark>{StudentID, CourseID}</mark> because a student can enroll in multiple courses, but this combination is unique.

...

# Foreign Key

A **foreign key** is used to set relationships between tables. It ensures **referential integrity** between tables, helping to avoid duplicate data.

For this example, I need two tables:

Table <mark>orders</mark>

<table>
  <thead>
    <tr>
      <th>OrderID</th>
      <th>CustomerID</th>
      <th>OrderDate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>101</td>
      <td>2024-01-01</td>
    </tr>
<tr>
      <td>2</td>
      <td>102</td>
      <td>2024-01-02</td>
    </tr>
<tr>
      <td>3</td>
      <td>101</td>
      <td>2024-01-03</td>
    </tr>
  </tbody>
</table>

Table <mark>customers</mark>

<table>
  <thead>
    <tr>
      <th>CustomerID</th>
      <th>CustomerName</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>101</td>
      <td>John Doe</td>
    </tr>
<tr>
      <td>102</td>
      <td>Jane Smith</td>
    </tr>
  </tbody>
</table>

The **primary keys** are <mark>OrderID</mark> for the <mark>Orders</mark> table and <mark>CustomerID</mark> for the <mark>Customers</mark> table. The **foreign key** in <mark>Orders</mark>: <mark>CustomerID</mark> (References <mark>CustomerID</mark> in <mark>Customers</mark>).

4 / 7

# Question 2: **What is a subquery?**

*Answer:*

> **A subquery** is a query that appears inside another query statement. It's also called an <mark>inner query</mark> or <mark>nested query</mark>. It's used to perform a query that returns data to be used by the "outer" query.

An example: If I have two tables...

## Table <mark>Employees</mark>

<table>
  <tr>
    <th>EmployeeID</th>
    <th>Name</th>
    <th>DepartmentID</th>
  </tr>
<tr>
    <td>1</td>
    <td>John Doe</td>
    <td>10</td>
  </tr>
<tr>
    <td>2</td>
    <td>Jane Smith</td>
    <td>20</td>
  </tr>
<tr>
    <td>3</td>
    <td>Bob Brown</td>
    <td>10</td>
  </tr>
<tr>
    <td>4</td>
    <td>Alice White</td>
    <td>30</td>
  </tr>
</table>

## And the table <mark>Departments</mark>

<table>
  <tr>
    <th>DepartmentID</th>
    <th>DepartmentName</th>
  </tr>
<tr>
    <td>10</td>
    <td>HR</td>
  </tr>
<tr>
    <td>20</td>
    <td>Finance</td>
  </tr>
<tr>
    <td>30</td>
    <td>IT</td>
  </tr>
</table>

If I want to find the names of employees in the HR department. The query I should write looks like this:

```sql
SELECT Name
FROM Employees
WHERE DepartmentID = (
    SELECT DepartmentID
    FROM Departments
    WHERE DepartmentName = 'HR'
);
```

Where the <mark>inner query</mark> is

```sql
SELECT DepartmentID
FROM Departments
WHERE DepartmentName = 'HR'
```

5 / 7

And the <mark>outer query</mark> is

```sql
SELECT Name
FROM Employees
WHERE DepartmentID = 10;
```

## **Question 3: What is a transaction in SQL?**

**Answer:**

<mark> A **transaction** is a sequence of one or more SQL operations that run as a single execution. </mark>

It's used to maintain the **integrity** of the database and to ensure that changes aren't applied until all queries are fully completed without errors. Otherwise, the transaction will **rollback** any changes.

## **What is ACID ?**

**ACID** represents the key properties of transactions:

- <mark>A</mark> for <mark>Atomicity</mark> : The transaction should be completed successfully or unsuccessfully, but not by parts. If any part fails, the transaction must **rollback**.
- <mark>C</mark> for <mark>Consistency</mark> : The transaction ensures data **integrity**. If any query in the transaction tries to violate a constraint, the entire transaction will **fail**, preventing changes in the database.
- <mark>I</mark> for <mark>Isolation</mark> : Ensures that transactions do not interfere with each other, even when executed simultaneously.
- <mark>D</mark> for <mark>Durability</mark> : Ensures the transaction is committed. Its change is permanently stored even in the event of a system failure.

Transactions are widely used in **Fintech**. For example, when working with clients' bank accounts, we use transactions to ensure the **integrity** of the database.

## **Example:**

Suppose we want to transfer 100 currency units from Account 1 to Account 2. This requires two operations:

1 - Deduct 100 from Account 1's balance. 2 - Add 100 to Account 2's balance.

Here's how our transaction query would look:

```sql
BEGIN;
```

6 / 7

```sql
<mark>UPDATE</mark> Accounts
<mark>SET</mark> Balance = Balance - <mark>100</mark>
<mark>WHERE</mark> AccountID = <mark>1</mark>;

<mark>UPDATE</mark> Accounts
<mark>SET</mark> Balance = Balance + <mark>100</mark>
<mark>WHERE</mark> AccountID = <mark>2</mark>;

<mark>COMMIT</mark>;
```

- <mark>BEGIN</mark> starts the transaction
- <mark>UPDATES</mark> modifies the balances of the accounts.
- <mark>COMMIT</mark> finalizes the transaction and saves the changes, making them permanent in the database.

If any part of this process fails, we can use:
- <mark>ROLLBACK</mark> to undo all changes, ensuring that the database remains consistent.

## Farewell & Thoughts

That's all for this post!

It's a bit short, but I included as many examples as possible to make things easy to understand. 🤗 As I always say, if you have other questions you'd like me to cover, just let me know!

See you in the next post, and have a great week!

7 / 7