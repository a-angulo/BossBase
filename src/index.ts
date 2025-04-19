import inquirer from "inquirer";
import { connectToDb } from "./db/connection.js";
import Db from "./db/queries.js";

connectToDb();
const db = new Db();

async function menu() {
  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add department",
      "Add role",
      "Add employee",
      "Update employee role",
      "Update employee manager",
      "View employees by manager",
      "View employees by department",
      "Delete employee",
      "Delete role",
      "Delete department",
      "Exit",
    ],
  });

  switch (action) {
    case "View all departments":
      const departments = await db.findAllDepartments();
      console.table(departments);
      break;

    case "View all roles":
      const roles = await db.findAllRoles();
      console.table(roles);
      break;

    case "View all employees":
      const employees = await db.findAllEmployees();
      console.table(employees);
      break;

    case "Add department":
      const { departmentName } = await inquirer.prompt({
        type: "input",
        name: "departmentName",
        message: "Enter the name of the department:",
      });
      await db.addNewDepartment(departmentName);
      console.log(`Department ${departmentName} added.`);
      break;

    case "Add role":
      const departmentsList = await db.findAllDepartments();
      const departmentChoices = departmentsList.map((d) => ({
        name: d.name,
        value: d.id,
      }));

      const { roleName, roleSalary, departmentId } = await inquirer.prompt([
        {
          type: "input",
          name: "roleName",
          message: "Enter the name of the role:",
        },
        {
          type: "input",
          name: "roleSalary",
          message: "Enter the salary for the role:",
        },
        {
          type: "list",
          name: "departmentId",
          message: "Select the department for the role:",
          choices: departmentChoices,
        },
      ]);
      await db.addNewRole({ title: roleName, salary: roleSalary, department_id: departmentId });
      console.log(`Role ${roleName} added.`);
      break;

    case "Add employee":
      const roleList = await db.findAllRoles();
      const roleChoices = roleList.map((r) => ({
        name: `${r.title} (${r.department})`,
        value: r.id,
      }));

      const managerList = await db.findAllEmployees();
      const managerChoices = [
        { name: "None", value: null },
        ...managerList.map((e) => ({
          name: `${e.first_name} ${e.last_name}`,
          value: e.id,
        })),
      ];

      const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
          type: "input",
          name: "firstName",
          message: "Enter the first name of the employee:",
        },
        {
          type: "input",
          name: "lastName",
          message: "Enter the last name of the employee:",
        },
        {
          type: "list",
          name: "roleId",
          message: "Select the role for the employee:",
          choices: roleChoices,
        },
        {
          type: "list",
          name: "managerId",
          message: "Select the manager for the employee (if any):",
          choices: managerChoices,
        },
      ]);

      await db.addNewEmployee({ first_name: firstName, last_name: lastName, role_id: roleId, manager_id: managerId });
      console.log(`Employee ${firstName} ${lastName} added.`);
      break;

    case "Update employee role":
      const employeeList = await db.findAllEmployees();
      const employeeChoices = employeeList.map((e) => ({
        name: `${e.first_name} ${e.last_name}`,
        value: e.id,
      }));

      const roleOptions = await db.findAllRoles();
      const roleSelection = roleOptions.map((r) => ({
        name: r.title,
        value: r.id,
      }));

      const { employeeId, newRoleId } = await inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Select the employee to update:",
          choices: employeeChoices,
        },
        {
          type: "list",
          name: "newRoleId",
          message: "Select the new role for the employee:",
          choices: roleSelection,
        },
      ]);

      await db.updateEmployeeRole(employeeId, newRoleId);
      console.log(`Employee ID ${employeeId} updated to role ID ${newRoleId}.`);
      break;

    case "Update employee manager":
      const empList = await db.findAllEmployees();
      const empChoices = empList.map((e) => ({
        name: `${e.first_name} ${e.last_name}`,
        value: e.id,
      }));

      const { empId, newManagerId } = await inquirer.prompt([
        {
          type: "list",
          name: "empId",
          message: "Select the employee to update:",
          choices: empChoices,
        },
        {
          type: "list",
          name: "newManagerId",
          message: "Select the new manager:",
          choices: [{ name: "None", value: null }, ...empChoices],
        },
      ]);
      await db.updateEmployeeManager(empId, newManagerId);
      console.log(`Employee ID ${empId} updated to manager ID ${newManagerId}.`);
      break;

    case "View employees by manager":
      const allManagers = await db.findAllEmployees();
      const managerSelect = allManagers.map((m) => ({
        name: `${m.first_name} ${m.last_name}`,
        value: m.id,
      }));

      const { managerIdToView } = await inquirer.prompt({
        type: "list",
        name: "managerIdToView",
        message: "Select the manager:",
        choices: managerSelect,
      });

      const employeesByManager = await db.findEmployeesByManager(managerIdToView);
      console.table(employeesByManager);
      break;

    case "View employees by department":
      const departmentsList2 = await db.findAllDepartments();
      const departmentChoices2 = departmentsList2.map((department) => ({
        name: department.name,
        value: department.id,
      }));
      const { departmentIdToView } = await inquirer.prompt({
        type: "list",
        name: "departmentIdToView",
        message: "Select a department to view its employees:",
        choices: departmentChoices2,
      });
      const employeesByDepartment = await db.findEmployeesByDepartment(departmentIdToView);
      console.table(employeesByDepartment);
      break;

    case "Delete employee":
      const allEmployees = await db.findAllEmployees();
      const employeeDeleteChoices = allEmployees.map((e) => ({
        name: `${e.first_name} ${e.last_name}`,
        value: e.id,
      }));

      const { empIdToDelete } = await inquirer.prompt({
        type: "list",
        name: "empIdToDelete",
        message: "Select the employee to delete:",
        choices: employeeDeleteChoices,
      });

      await db.deleteEmployee(empIdToDelete);
      console.log(`Employee ID ${empIdToDelete} deleted.`);
      break;

    case "Delete role":
      const rolesList = await db.findAllRoles();
      const roleDeleteChoices = rolesList.map((r) => ({
        name: r.title,
        value: r.id,
      }));

      const { roleIdToDelete } = await inquirer.prompt({
        type: "list",
        name: "roleIdToDelete",
        message: "Select the role to delete:",
        choices: roleDeleteChoices,
      });

      await db.deleteRole(roleIdToDelete);
      console.log(`Role ID ${roleIdToDelete} deleted.`);
      break;

    case "Delete department":
      const deptList = await db.findAllDepartments();
      const deptChoices = deptList.map((department) => ({
        name: department.name,
        value: department.id,
      }));

      const { departmentIdToDelete } = await inquirer.prompt({
        type: "list",
        name: "departmentIdToDelete",
        message: "Select the department to delete:",
        choices: deptChoices,
      });

      await db.deleteDepartment(departmentIdToDelete);
      console.log(`Department ID ${departmentIdToDelete} deleted.`);
      break;

    case "Exit":
      console.log("Goodbye!");
      process.exit(0);

    default:
      console.log("Invalid action. Please try again.");
      break;
  }

  menu(); // Loop again
}

menu(); // Start the app