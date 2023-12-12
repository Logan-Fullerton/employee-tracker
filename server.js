const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const { prompt } = require('inquirer');
require("dotenv").config();
require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
console.log(`Connected to the ${process.env.DB_DATABASE} database.`);

const mainMenu = async () => {
  const response = await prompt([
    {
      type:'list',
      message:'Hello! What would you like to do?',
      name: 'action',
      choices: ['View all departments', 'View all employees']
    },
  ])

  switch (response.action) {
    case 'View all departments':
      viewAllDepartments();
      break;

    case 'View all employees':
      viewAllEmployees();
      break;
  }

}


mainMenu();

// ACTIONS
const viewAllDepartments = async () => {
  const [departments] = await db.promise().query('SELECT * FROM department;');

  console.table(departments)
  mainMenu();
}

const viewAllEmployees = async () => {
  const [employees] = await db.promise().query('SELECT * FROM employee;');

  // console.log();
  console.table(employees);
  mainMenu();
}