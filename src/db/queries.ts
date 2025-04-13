import { pool } from './connection.js';

export default class Db {
  constructor() {}

  async query(sql: string, args: any[] = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, args);
      return result.rows;
    } catch (error) {
      console.error('DB Error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async findAllEmployees() {
    const sql = `
      SELECT 
        emp.id, 
        emp.first_name, 
        emp.last_name,
        role.title,
        dept.name AS department,
        role.salary,
        CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager
      FROM employee AS emp
      LEFT JOIN role AS role ON emp.role_id = role.id
      LEFT JOIN department AS dept ON role.department_id = dept.id
      LEFT JOIN employee AS mgr ON mgr.id = emp.manager_id
      ORDER BY emp.id;
    `;
    return this.query(sql);
  }

  async addNewEmployee({ first_name, last_name, role_id, manager_id }: 
    { first_name: string, last_name: string, role_id: number, manager_id?: number }) {
    const sql = `
      INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    return this.query(sql, [first_name, last_name, role_id, manager_id || null]);
  }

  async deleteEmployee(employeeId: number) {
    return this.query('DELETE FROM employee WHERE id = $1;', [employeeId]);
  }

  async updateEmployeeRole(employeeId: number, newRoleId: number) {
    return this.query('UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *;', [newRoleId, employeeId]);
  }

  async findAllRoles() {
    const sql = `
      SELECT 
        role.id,
        role.title,
        dept.name AS department,
        role.salary
      FROM role AS role
      LEFT JOIN department AS dept ON role.department_id = dept.id
      ORDER BY role.id;
    `;
    return this.query(sql);
  }

  async addNewRole({ title, salary, department_id }: 
    { title: string, salary: number, department_id: number }) {
    const sql = `
      INSERT INTO role (title, salary, department_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    return this.query(sql, [title, salary, department_id]);
  }

  async deleteRole(roleId: number) {
    return this.query('DELETE FROM role WHERE id = $1;', [roleId]);
  }

  async findAllDepartments() {
    return this.query('SELECT id, name FROM department ORDER BY id;');
  }

  async addNewDepartment(name: string) {
    return this.query('INSERT INTO department (name) VALUES ($1) RETURNING *;', [name]);
  }

  async deleteDepartment(departmentId: number) {
    return this.query('DELETE FROM department WHERE id = $1;', [departmentId]);
  }

  async updateEmployeeManager(employeeId: number, newManagerId: number) {
    return this.query('UPDATE employee SET manager_id = $1 WHERE id = $2 RETURNING *;', [newManagerId, employeeId]);
  }

  async findEmployeesByManager(managerId: number) {
    const sql = `
      SELECT 
        emp.id, 
        emp.first_name, 
        emp.last_name,
        role.title,
        dept.name AS department,
        role.salary
      FROM employee AS emp
      LEFT JOIN role AS role ON emp.role_id = role.id
      LEFT JOIN department AS dept ON role.department_id = dept.id
      WHERE emp.manager_id = $1
      ORDER BY emp.id;
    `;
    return this.query(sql, [managerId]);
  }

  async findEmployeesByDepartment(departmentId: number) {
    const sql = `
      SELECT 
        emp.id, 
        emp.first_name, 
        emp.last_name,
        role.title,
        dept.name AS department,
        role.salary
      FROM employee AS emp
      LEFT JOIN role AS role ON emp.role_id = role.id
      LEFT JOIN department AS dept ON role.department_id = dept.id
      WHERE dept.id = $1
      ORDER BY emp.id;
    `;
    return this.query(sql, [departmentId]);
  }
}