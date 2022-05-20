# sql-employee-tracker

<br/>

## **Link** to video walkthrough to demonstrate app functionality: https://drive.google.com/file/d/1CR8SqyQ3coOWY7olChoBmzA_D_-VbJmx/view

<br/>

## **Motivation**

To create a command-line app that helps manage a company's employee database using Node.js, Inquirer and mySQL2. You can view or add departments, roles, or employees and update an employee.
<br/>

## **Instructions for downloading and running**

-Clone the repo locally
-Log into mySQL using the username root and password Caradhras100! with the command
`mysql -u root -p`
then enter the case-sensitive password Caradhras100!
-To create and access the database, from the mysql> command line, run the following two commands:
`source db/db.sql`
`source db/schema.sql`
-If you don't want to use seed data, skip to the next step. To seed: run the following command:
`source db/seeds.sql`
-To return to the terminal command line, run the commmand:
`quit`
-To run the application type the following command:
`node server.js`
-Follow the prompts and enjoy!
<br/>

## **Table of Contents**

[How and Why?](#what-problem-does-this-solve-and-how-was-a-solution-accomplished) <br/>
[Things I learned](#things-i-learned) <br/>
[What makes this project stand out?](#what-makes-this-project-stand-out) <br/>
[Challenge Criteria](#challenge-criteria)<br/>
[Screenshot of Web Application](#screenshot-of-web-application)<br/>
[How to Contribute](#how-to-contribute)<br/>
[Credits](#credits)<br/>

<br/>

## **What Problem does this solve and how was a solution accomplished?**

My employee tracker app allows non-developers to easily view and intereact with information stored in a database. The app is a mix of inquirer prompts, whose returned answer objects are then used to query the database. I used an inquirer prompt to create an initial menu to ask what the user wants to do. From there a switch statement manages the flow of the app. No matter what the user chooses, they are always brought back to the main menu.
<br/>

## **Things I learned**

-   There are multiple ways to do a self join. I was having trouble using one way when combining with other left joins; I believe the WHERE statement was throwing off the other left joins. To solve this issue I used a left join as a self join with some help from good ol' google.
-   The value of constructor functions and classes and modularization. I was short on time, otherwise I would've moved every function and query to separate files because the server.js file is CROWDED.
    <br/>

## **What makes this project stand out?**

The easy command line interface makes this project stand out. I use a lot of statements in parens to walk the user through the questions and main menu. I can't imagine someone would use something like this professionally without also adding the ability to export the database to an html/excel file, but I see the opportunity for improvement and the apps usefullness.

<br/>

## **Challenge Criteria**

AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business

GIVEN a command-line application that accepts user input<br/>

-   WHEN I start the application<br/>
    THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

-   WHEN I choose to view all departments<br/>
    THEN I am presented with a formatted table showing department names and department ids

-   WHEN I choose to view all roles<br/>
    THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

-   WHEN I choose to view all employees<br/>
    THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

-   WHEN I choose to add a department<br/>
    THEN I am prompted to enter the name of the department and that department is added to the database

-   WHEN I choose to add a role<br/>
    THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

-   WHEN I choose to add an employee<br/>
    THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

-   WHEN I choose to update an employee role<br/>
    THEN I am prompted to select an employee to update and their new role and this information is updated in the database
    <br/>

## **Screenshot of Web Application**

There is a walkthrough video link at the beginning of this README
<br/>

## **How to Contribute**

Please feel free to review, refactor and submit a pull request for additional features on my github page: <br/>
https://github.com/alinz07

### **Credits**

-   I used the left join self join syntax demonstrated by www.mysqltutorial.org. Web address: https://www.mysqltutorial.org/mysql-self-join/
