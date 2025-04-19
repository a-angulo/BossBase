-- Drop all existing tables and their constraints
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS role CASCADE;
DROP TABLE IF EXISTS department CASCADE;

-- Create department table
CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

-- Create role table
CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary INTEGER NOT NULL,
  department_id INTEGER NOT NULL REFERENCES department(id) ON DELETE CASCADE
);

-- Create employee table
CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL REFERENCES role(id) ON DELETE CASCADE,
  manager_id INTEGER REFERENCES employee(id) ON DELETE SET NULL
);

-- Seed departments
INSERT INTO department (name) VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');

-- Reset department sequence
SELECT setval('department_id_seq', (SELECT MAX(id) FROM department), true);

-- Seed roles
INSERT INTO role (title, salary, department_id) VALUES
  ('Salesperson', 80000, 1),
  ('Lead Engineer', 150000, 2),
  ('Software Engineer', 120000, 2),
  ('Account Manager', 160000, 3),
  ('Accountant', 125000, 3),
  ('Legal Team Lead', 250000, 4),
  ('Lawyer', 190000, 4),
  ('Customer Service', 80000, 1);

-- Reset role sequence
SELECT setval('role_id_seq', (SELECT MAX(id) FROM role), true);

-- Seed employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('Mike', 'Chan', 1, 6),
  ('Ashley', 'Rodriguez', 2, NULL),
  ('Kevin', 'Tupik', 3, 2),
  ('Kunal', 'Singh', 4, NULL),
  ('Malia', 'Brown', 5, 4),
  ('Sarah', 'Lourd', 6, NULL),
  ('Tom', 'Allen', 7, 6),
  ('John', 'Doe', 1, NULL),
  ('Sam', 'Kash', 8, 2);

-- Reset employee sequence
SELECT setval('employee_id_seq', (SELECT MAX(id) FROM employee), true);
