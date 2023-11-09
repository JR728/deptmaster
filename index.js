const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');
require('dotenv').config();

const app = express();

// Configure the MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Establish the database connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
  startApp();
});

function startApp() {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'choice',
          message: 'What would you like to do?',
          choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit',
          ],
        },
      ])
      .then((answer) => {
        switch (answer.choice) {
          case 'View all departments':
            viewDepartments();
            break;
          case 'View all roles':
            viewRoles();
            break;
          case 'View all employees':
            viewEmployees();
            break;
          case 'Add a department':
            addDepartment();
            break;
          case 'Add a role':
            addRole();
            break;
          case 'Add an employee':
            addEmployee();
            break;
          case 'Update an employee role':
            updateEmployeeRole();
            break;
          case 'Exit':
            console.log('Goodbye!');
            db.end();
            break;
        }
    });
}

// Function to view all departments
function viewDepartments() {
    const query = 'SELECT id, name FROM department';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching departments:', err);
        return;
      }
      // Process and display the results in a formatted table
      console.table(results);
    });
  }
  
  // Function to view all roles
  function viewRoles() {
    const query = 'SELECT id, title, salary, deparment_id FROM role';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching roles:', err);
        return;
      }
      // Process and display the results in a formatted table
      console.table(results);
    });
  }
  
  // Function to view all employees
  function viewEmployees() {
    const query = 'SELECT e.id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching employees:', err);
        return;
      }
      // Process and display the results in a formatted table
      console.table(results);
    });
  }
  
  // Function to add a department
  function addDepartment() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter the name of the department:',
        },
      ])
      .then((answers) => {
        const query = 'INSERT INTO department (name) VALUES (?)';
        db.query(query, [answers.name], (err, results) => {
          if (err) {
            console.error('Error adding department:', err);
            return;
          }
          console.log('Department added successfully.');
        });
      });
  }
  
// Function to add a role
function addRole() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the title of the role:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for the role:',
        },
        {
          type: 'input',
          name: 'department_id',
          message: 'Enter the department ID for the role:',
        },
      ])
      .then((answers) => {
        const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        db.query(query, [answers.title, answers.salary, answers.department_id], (err, results) => {
          if (err) {
            console.error('Error adding role:', err);
            return;
          }
          console.log('Role added successfully.');
        });
      });
  }
  
  // Function to add an employee
  function addEmployee() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'first_name',
          message: "Enter the employee's first name:",
        },
        {
          type: 'input',
          name: 'last_name',
          message: "Enter the employee's last name:",
        },
        {
          type: 'input',
          name: 'role_id',
          message: "Enter the employee's role ID:",
        },
        {
          type: 'input',
          name: 'manager_id',
          message: "Enter the employee's manager's ID (or leave empty if none):",
        },
      ])
      .then((answers) => {
        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
        db.query(query, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id || null], (err, results) => {
          if (err) {
            console.error('Error adding employee:', err);
            return;
          }
          console.log('Employee added successfully.');
        });
      });
  }
  
  // Function to update an employee's role
  function updateEmployeeRole() {
    // Query the database to get a list of employees
    db.query('SELECT id, first_name, last_name FROM employee', (err, results) => {
      if (err) {
        console.error('Error fetching employee list:', err);
        return;
      }
  
      const employeeChoices = results.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));
  
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee_id',
            message: 'Select an employee to update:',
            choices: employeeChoices,
          },
          {
            type: 'input',
            name: 'new_role_id',
            message: 'Enter the new role ID for the employee:',
          },
        ])
        .then((answers) => {
          const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
          db.query(query, [answers.new_role_id, answers.employee_id], (err, results) => {
            if (err) {
              console.error('Error updating employee role:', err);
              return;
            }
            console.log('Employee role updated successfully.');
          });
        });
    });
  }
  