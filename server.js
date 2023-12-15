
// Import and require mysql2
const mysql = require('mysql2');
const { prompt } = require('inquirer');
require("dotenv").config();
require('console.table');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
console.log(`Connected to the ${process.env.DB_DATABASE} database.`);

const updateEmployeeRole = async () => {
  // Get the list of employees from the database
  const [employees] = await db.promise().query('SELECT * FROM employee;');

  // Prompt the user to select an employee to update
  const employeeToUpdate = await prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select an employee to update:',
      choices: employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }))
    }
  ]);

  // Get the list of roles from the database
  const [roles] = await db.promise().query('SELECT * FROM role;');

  // Prompt the user to select a new role for the employee
  const updatedRole = await prompt([
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the updated role for the employee:',
      choices: roles.map((role) => ({
        name: role.title,
        value: role.id
      }))
    }
  ]);

  const { role_id } = updatedRole;

  // Update the employee's role in the database
  await db.promise().query(
    'UPDATE employee SET role_id = ? WHERE id = ?',
    [role_id, employeeToUpdate.employeeId]
  );

  console.log('Employee role updated successfully!');
  mainMenu();
};

const mainMenu = async () => {
  const response = await prompt([
    {
      type: 'list',
      message: 'Hello! What would you like to do?',
      name: 'action',
      choices: [
        'View all Departments',
        'View all Employees',
        'View all Roles',
        'Add a Department',
        'Add a Role',
        'Add an employee',
        'Update Employee Role'
      ]
    }
  ]);

  switch (response.action) {
    case 'View all Departments':
      await viewAllDepartments();
      break;
    case 'View all Employees':
      await viewAllEmployees();
      break;
    case 'View all Roles':
      await viewAllRoles();
      break;
    case 'Add a Department':
      await addDepartment();
      break;
    case 'Add a Role':
      await addRole();
      break;
    case 'Add an employee':
      await addEmployee();
      break;
    case 'Update Employee Role':
      await updateEmployeeRole();
      break;
  }

  mainMenu();
};

const viewAllDepartments = async () => {
  const [departments] = await db.promise().query('SELECT * FROM department;');
  console.table(departments);
};

const viewAllEmployees = async () => {
  const [employees] = await db.promise().query('SELECT * FROM employee;');
  console.table(employees);
};

const viewAllRoles = async () => {
  const [roles] = await db.promise().query('SELECT * FROM role;');
  console.table(roles);
};

const addDepartment = async () => {
  const { departmentName } = await prompt([
  
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the department'
    },
  ]);

  await db.promise().query('INSERT INTO department (name) VALUES (?)', [departmentName]);
  console.log(`Department added successfully!`);
};

mainMenu();

const addRole = async () => {
  // Fetch the department ids from the database
  const [departments] = await db.promise().query('SELECT id FROM department;');

  const roleName = await prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter employee title'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter employee salary'
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'Enter department id',
      choices: departments.map((department) => department.id)
    }
  ]);

  const { title, salary, department_id } = roleName;

  await db.promise().query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [title, salary, department_id]);

  console.log(`Department added successfully!`);
  console.log("Role added successfully!");
};

const addEmployee = async () => {
  const [roles] = await db.promise().query('SELECT id FROM role WHERE id IS NOT NULL;');
  const [managers] = await db.promise().query('SELECT manager_id FROM employee WHERE manager_id IS NOT NULL;');

  const roleChoices = [
    { name: 'None', value: null },
    ...roles.map((role) => ({ name: role.id, value: role.id }))
  ];

  const managerChoices = [
    { name: 'None', value: null },
    ...managers.map((manager) => ({ name: manager.manager_id, value: manager.manager_id }))
  ];

  const employee = await prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter employee first name'
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter employee last name'
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select role id',
      choices: roleChoices
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Select manager id',
      choices: managerChoices
    }
  ]);


  const { first_name, last_name, role_id, manager_id } = employee;

  await db.promise().query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [first_name, last_name, role_id, manager_id]);

  console.log("Employee added successfully!");
  mainMenu();
};

