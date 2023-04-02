const inquirer = require("inquirer");
const db = require("./db");
const cTable = require("console.table");
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
          "View All Employees By Department",
          "View All Employees By Manager",
          "Add an employee",
          "Update an employee role",
          "Remove an employee",
          "update an employee manager",
          "Add a department",
          "View all roles",
          "Add a role",
          "remove a role",
          "View all departments",
          "Remove a department",
          "add a department",
          "View the total utilized budget of a department",
          "Quit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.mainMenu) {
        case "View all employees":
          viewAllEmployees();
          break;
        case "View All Employees By Department":
          viewEmployeesByDepartment();
          break;
        case "View All Employees By Manager":
          viewEmployeesByManager();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Remove an employee":
          removeEmployee();
          break;
        case "update an employee manager":
          updateEmployeeManager();
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
        case "remove a role":
          removeRole();
          break;
        case "View all departments":
          viewAllDepartments();
          break;
        case "Remove a department":
          removeDepartment();
          break;
        case "add a department":
          addDepartment();
          break;
        case "View the total utilized budget of a department":
          viewTotalUtilizedBudget();
          break;
        case "Quit":
          quit();
          break;
      }
    });
};
// View all employees
const viewAllEmployees = () => {
  db.findAllEmployees()
    .then(([data]) => {
      let employees = data;
      console.table(employees);
    })
    .then(() => mainMenu());
};

// View all employees by department
const viewEmployeesByDepartment = () => {
  db.findAllDepartments().then(([data]) => {
    const departments = data.map(({ id, name }) => ({ name: name, value: id }));
    const allDepartments = departments;
    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Please choose a department to see employees from?",
          choices: allDepartments,
        },
      ])
      .then((answer) => {
        db.findAllEmployeesByDepartment(answer.departmentId)
          .then(([data]) => {
            let employees = data;
            console.table(employees);
          })
          .then(() => mainMenu());
      });
  });
};

// View all employees by manager
const viewEmployeesByManager = () => {
  db.findAllEmployees().then(([data]) => {
    let managers = data;
    const allManagers = managers.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "managerId",
        message: "Which employee would you want to select?",
        choices: allManagers,
      },
    ])
      .then((res) => db.findAllEmployeesByManager(res.managerId))
      .then(([rows]) => {
        let employees = rows;
        if (employees.length === 0) {
          console.log("Sorry the employee has no manager");
        } else {
          console.table(employees);
        }
      })
      .then(() => mainMenu());
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
  ]).then((res) => {
    let firstName = res.first_name;
    let lastName = res.last_name;

    db.findAllRoles().then(([data]) => {
      let allRoles = data;
      const ChosenRole = allRoles.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      prompt({
        type: "list",
        name: "roleId",
        message: "what role does the employee do?",
        choices: ChosenRole,
      }).then((res) => {
        let roleId = res.roleId;

        db.findAllEmployees().then(([data]) => {
          let employees = data;
          const ChosenManager = employees.map(
            ({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id,
            })
          );

          managerChoices.unshift({ name: "None", value: null });

          prompt({
            type: "list",
            name: "managerId",
            message: "Who is the employee's manager?",
            choices: managerChoices,
          })
            .then((res) => {
              let employee = {
                manager_id: res.managerId,
                role_id: roleId,
                first_name: firstName,
                last_name: lastName,
              };

              db.createEmployee(employee);
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
  db.findAllEmployees().then(([data]) => {
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
    ]).then((res) => {
      let employeeId = res.employeeId;
      db.findAllRoles().then(([data]) => {
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
          .then((res) => db.updateEmployeeRole(employeeId, res.roleId))
          .then(() => console.log("Updated employee's role".blue))
          .then(() => mainMenu());
      });
    });
  });
};

// Remove an employee
const removeEmployee = () => {
  db.findAllEmployees().then(([data]) => {
    let employees = data;
    const allEmployees = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    prompt([
      {
        type: "list",
        name: "employeeId",
        message: "What employee will be removed?",
        choices: allEmployees,
      },
    ])
      .then((res) => db.removeEmployee(res.employeeId))
      .then(() => console.log("Removed employee from the database".blue))
      .then(() => mainMenu());
  });
};

// View all roles
const viewAllRoles = () => {
  db.findAllRoles()
    .then(([data]) => {
      let roles = data;
      console.table(roles);
    })
    .then(() => mainMenu());
};

// Add a role
const addRole = () => {
  db.findAllDepartments().then(([data]) => {
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
      .then((res) => db.createRole(res))
      .then(() => console.log(`Added a new role to the database`.blue))
      .then(() => mainMenu());
  });
};

// Remove a role
const removeRole = () => {
  db.findAllRoles().then(([data]) => {
    let roles = data;
    const allRoles = roles.map(({ id, title }) => ({
      name: title,
      value: id,
    }));
    prompt([
      {
        type: "list",
        name: "roleId",
        message: "What role will be removed?",
        choices: allRoles,
      },
    ])
      .then((res) => db.removeRole(res.roleId))
      .then(() => console.log("Removed role from the database".blue))
      .then(() => mainMenu());
  });
};

// View all departments

const viewAllDepartments = () => {
  db.findAllDepartments()
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
    .then((res) => db.createDepartment(res))
    .then(() => console.log(`new department has been added`.blue))
    .then(() => mainMenu());
};

// Remove a department
const removeDepartment = () => {
  db.findAllDepartments().then(([data]) => {
    let departments = data;
    const allDepartments = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));
    prompt([
      {
        type: "list",
        name: "departmentId",
        message: "What department will be removed?",
        choices: allDepartments,
      },
    ])
      .then((res) => db.removeDepartment(res.departmentId))
      .then(() => console.log("department has been removed".blue))
      .then(() => mainMenu());
  });
};

// View the total utilized budget of a department -- ie the combined salaries of all employees in that department
const viewTotalUtilizedBudget = () => {
  db.viewDepartmentBudgets()
    .then(([data]) => {
      let departments = data;
      console.table(departments);
    })
    .then(() => mainMenu());
};

mainMenu();
