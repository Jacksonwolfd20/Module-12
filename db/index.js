const connection = require("./connection");

class DB {
  // Find all employees and combine the data with the roles, departments, salary, and managers
  findAllEmployees = () => {
    return this.db
      .promise()
      .query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
      );
  };

  // Find all employees except with the entered id
  findAllPossibleManagers = (employeeId) => {
    return this.db
      .promise()
      .query(
        "SELECT id, first_name, last_name FROM employee WHERE id != ?;",
        employeeId
      );
  };

  // Create a new employee
  createEmployee = (employee) => {
    return this.db.promise().query("INSERT INTO employee SET ?", employee);
  };

  // Remove an employee with the entered id
  removeEmployee = (employeeId) => {
    return this.db
      .promise()
      .query("DELETE FROM employee WHERE id = ?", employeeId);
  };

  // Update the role of an employee with the entered id
  updateEmployeeRole = (roleId, employeeId) => {
    return this.db
      .promise()
      .query("UPDATE employee SET role_id = ? WHERE id = ?", [
        roleId,
        employeeId,
      ]);
  };

  // Update the manager of an employee with the entered id
  updateEmployeeManager = (managerId, employeeId) => {
    return this.db
      .promise()
      .query("UPDATE employee SET manager_id = ? WHERE id = ?", [
        managerId,
        employeeId,
      ]);
  };

  // Find all roles, combine with departments
  findAllRoles = () => {
    return this.db
      .promise()
      .query(
        "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
      );
  };

  // Create a new role
  createRole = (role) => {
    return this.db.promise().query("INSERT INTO role SET ?", role);
  };

  // Remove a role
  removeRole = (roleId) => {
    return this.db.promise().query("DELETE FROM role WHERE id = ?", roleId);
  };

  // Find all departments
  findAllDepartments = () => {
    return this.db
      .promise()
      .query(
        "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
      );
  };

  // Create a new department
  createDepartment = (department) => {
    return this.db.promise().query("INSERT INTO department SET ?", department);
  };

  // Remove a department
  removeDepartment = (departmentId) => {
    return this.db
      .promise()
      .query("DELETE FROM department WHERE id = ?", departmentId);
  };

  // Find all employees in a given department, combine with roles and managers
  findAllEmployeesByDepartment = (departmentId) => {
    return this.db
      .promise()
      .query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id WHERE department.id = ?;",
        departmentId
      );
  };

  // Find all employees by manager, combine them with their departments and roles
  findAllEmployeesByManager = (managerId) => {
    return this.db
      .promise()
      .query(
        "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id WHERE manager_id = ?;",
        managerId
      );
  };

  // Find all departments, and gather the budgets of each department by employee salaries
  viewDepartmentBudgets() {
    return this.connection
      .promise()
      .query(
        "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
      );
  }
}
module.exports = new DB(connection);
