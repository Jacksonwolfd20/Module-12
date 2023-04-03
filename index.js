const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");
const { prompt } = require("inquirer");
const colors = require("colors");

const mainMenu = () => {
  console.log("Welcome to the Employee Tracker!".green);
  inquirer
    .prompt([
      {
        name: "mainMenu",
        type: "list",
        message: "Choose an option:",
        choices: [
          "View all employees",
          "Add an employee",
          "Update an employee role",
          "Add a department",
          "View all roles",
          "Add a role",
          "View all departments",
          "add a department",
          "Quit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.mainMenu) {
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "Add a role":
          addRole();
          break;
        case "View all departments":
          viewAllDepartments();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Quit":
          Quit();
          break;
      }
    });
};
// View all employees
const viewAllEmployees = () => {
  db.promise()
    .query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    )
    .then(([data]) => {
      let employees = data;
      console.table(employees);
      mainMenu();
    });
};

// Add an employee
const addEmployee = () => {
  prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      name: "last_name",
      message: "What is the employee's last name?",
    },
  ]).then((data) => {
    let firstName = data.first_name;
    let lastName = data.last_name;

    db.promise().query(
        "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
      ).then(([data]) => {
      let allRoles = data;
      const ChosenRole = allRoles.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      prompt({
        type: "list",
        name: "roleId",
        message: "What role does the employee do?",
        choices: ChosenRole,
      }).then((data) => {
        let roleId = data.roleId;

        db.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
          ).then(([data]) => {
          let employees = data;
          const ChosenManager = employees.map(
            ({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id,
            })
          );

          ChosenManager.unshift({ name: "None", value: null });

          prompt({
            type: "list",
            name: "managerId",
            message: "Who is the employee's manager?",
            choices: ChosenManager,
          })
            .then((data) => {
              let employee = {
                manager_id: data.managerId,
                role_id: roleId,
                first_name: firstName,
                last_name: lastName,
              };

              db.promise().query("INSERT INTO employee SET ?", employee);
            })
            .then(() =>
              console.log(`Added ${firstName} ${lastName} to the database`.blue)
            )
            .then(() => mainMenu());
        });
      });
    });
  });
};

// Update an employee role
const updateEmployeeRole = () => {
  db.promise().query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
  ).then(([data]) => {
    let employees = data;
    const allEmployees = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    prompt([
      {
        type: "list",
        name: "employeeId",
        message: "What Employees role should be updated?",
        choices: allEmployees,
      },
    ]).then((data) => {
      let employeeId = data.employeeId;
      db.promise().query(
        "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
      ).then(([data]) => {
        let roles = data;
        const allRoles = roles.map(({ id, title }) => ({
          name: title,
          value: id,
        }));
        prompt([
          {
            type: "list",
            name: "roleId",
            message: "What is the new role the employee should have?",
            choices: allRoles,
          },
        ])
          .then((data) => db.promise().query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [data.roleId, employeeId]
          ))
          .then(() => console.log("Updated employee's role".blue))
          .then(() => mainMenu());
      });
    });
  });
};

// View all roles
const viewAllRoles = () => {
  db.promise().query(
    "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
  )
    .then(([data]) => {
      let roles = data;
      console.table(roles);
    })
    .then(() => mainMenu());
};

// Add a role
const addRole = () => {
  db.promise().query(
    "SELECT department.id, department.name FROM department;"
  ).then(([data]) => {
    let departments = data;
    const allDepartments = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));
    prompt([
      {
        name: "title",
        message: "What is the name of the role?",
      },
      {
        name: "salary",
        message: "What is the salary of the role?",
      },
      {
        type: "list",
        name: "department_id",
        message: "What department does the role belong to?",
        choices: allDepartments,
      },
    ])
      .then((data) => db.promise().query("INSERT INTO role SET ?", data))
      .then(() => console.log(`Added a new role to the database`.blue))
      .then(() => mainMenu());
  });
};

// View all departments

const viewAllDepartments = () => {
  db.promise().query(
    "SELECT department.id, department.name FROM department;"
  )
    .then(([data]) => {
      let departments = data;
      console.table(departments);
    })
    .then(() => mainMenu());
};

// Add a department
const addDepartment = () => {
  prompt([
    {
      name: "name",
      message: "What do you name the new department?",
    },
  ])
    .then((data) => db.promise().query("INSERT INTO department SET ?", data))
    .then(() => console.log(`New department has been added`.blue))
    .then(() => mainMenu());
};

const Quit = () => {
    console.log("Goodbye!".blue);
    process.exit();
    };

mainMenu();
