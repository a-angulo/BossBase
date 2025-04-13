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
                type: "input",
                name: "departmentId",
                message: "Enter the department ID for the role:",
            },
        ]);
        await db.addNewRole({title:roleName, salary:roleSalary,  department_id:departmentId});
        console.log(`Role ${roleName} added.`);
        break;
    case "Add employee":
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
                type: "input",
                name: "roleId",
                message: "Enter the role ID for the employee:",
            },
            {
                type: "input",
                name: "managerId",
                message: "Enter the manager ID for the employee (optional):",
            },
        ]);
        await db.addNewEmployee({first_name:firstName, last_name:lastName, role_id: roleId, manager_id: managerId});
        console.log(`Employee ${firstName} ${lastName} added.`);
        break;
    case "Update employee role":
        const { employeeId, newRoleId } = await inquirer.prompt([
            {
                type: "input",
                name: "employeeId",
                message: "Enter the ID of the employee to update:",
            },
            {
                type: "input",
                name: "newRoleId",
                message: "Enter the new role ID for the employee:",
            },
        ]);
        await db.updateEmployeeRole(employeeId, newRoleId);
        console.log(`Employee ID ${employeeId} updated to role ID ${newRoleId}.`);
        break;
    case "Update employee manager":
        const { empId, newManagerId } = await inquirer.prompt([
            {
                type: "input",
                name: "empId",
                message: "Enter the ID of the employee to update:",
            },
            {
                type: "input",
                name: "newManagerId",
                message: "Enter the new manager ID for the employee:",
            },
        ]);
        await db.updateEmployeeManager(empId, newManagerId);
        console.log(`Employee ID ${empId} updated to manager ID ${newManagerId}.`);
        break;
    case "View employees by manager":
        const { managerIdToView } = await inquirer.prompt({
            type: "input",
            name: "managerIdToView",
            message: "Enter the manager ID to view employees:",
        });
        const employeesByManager = await db.findEmployeesByManager(managerIdToView);
        console.table(employeesByManager);
        break;
    case "View employees by department":
        const { departmentIdToView } = await inquirer.prompt({
            type: "input",
            name: "departmentIdToView",
            message: "Enter the department ID to view employees:",
        });
        const employeesByDepartment = await db.findEmployeesByDepartment(departmentIdToView);
        console.table(employeesByDepartment);
        break;
    case "Delete employee":
        const { empIdToDelete } = await inquirer.prompt({
            type: "input",
            name: "empIdToDelete",
            message: "Enter the ID of the employee to delete:",
        });
        await db.deleteEmployee(empIdToDelete);
        console.log(`Employee ID ${empIdToDelete} deleted.`);
        break;  
    case "Delete role":
        const { roleIdToDelete } = await inquirer.prompt({ 
            type: "input",
            name: "roleIdToDelete",
            message: "Enter the ID of the role to delete:",
        });
        await db.deleteRole(roleIdToDelete);    
        console.log(`Role ID ${roleIdToDelete} deleted.`);
        break;
    case "Delete department":
        const departmentsList = await db.findAllDepartments();
        const departmentChoices = departmentsList.map(department => ({
            name: department.name,
            value: department.id,
        }));
        const { departmentIdToDelete } = await inquirer.prompt({    
            type: "list",
            name: "departmentIdToDelete",
            message: "Enter the ID of the department to delete:",
            choices: departmentChoices,
        });
        await db.deleteDepartment(departmentIdToDelete);
        console.log(`Department ID ${departmentIdToDelete} deleted.`);
        break; 
    case "Exit":
        console.log("Goodbye!");
        process.exit(0);
        break;  
    default:
        console.log("Invalid action. Please try again.");   
        break;
    }
    
  menu(); // Show the menu again after an action
}

menu(); // Start the menu loop