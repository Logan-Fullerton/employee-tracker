DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employeeDepartment (
  id: INT PRIMARY KEY,
  department: VARCHAR(30) NOT NULL
);

CREATE TABLE employeeRole(
    id: INT PRIMARY KEY,
    title: VARCHAR(30)
    salary: DECIMAL
    department_id: INT
);
CREATE TABLE employee(
  id: INT PRIMARY KEY
  first_name:VARCHAR(30)
  last_name:VARCHAR(30)
  role_id: INT 
  manager_id; INT
)
