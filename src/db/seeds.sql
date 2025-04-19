-- Step 1: Seed Departments
INSERT INTO department (name)
VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');

-- Step 2: Reset department sequence
SELECT setval('department_id_seq', (SELECT MAX(id) FROM department), false);

-- Step 3: Seed Roles
INSERT INTO role (title, salary, department_id)
VALUES
  ('Salesperson', 80000, 1),
  ('Lead Engineer', 150000, 2),
  ('Software Engineer', 120000, 2),
  ('Account Manager', 160000, 3),
  ('Accountant', 125000, 3),
  ('Legal Team Lead', 250000, 4),
  ('Lawyer', 190000, 4),
  ('Customer Service', 80000, 1);

-- Step 4: Reset role sequence
SELECT setval('role_id_seq', (SELECT MAX(id) FROM role), false);

-- Step 5: Seed Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Mike', 'Chan', 1, 6),
  ('Ashley', 'Rodriguez', 2, NULL),
  ('Kevin', 'Tupik', 3, 2),
  ('Kunal', 'Singh', 4, NULL),
  ('Malia', 'Brown', 5, 4),
  ('Sarah', 'Lourd', 6, NULL),
  ('Tom', 'Allen', 7, 6),
  ('John', 'Doe', 1, NULL),
  ('Sam', 'Kash', 8, 2);

-- Step 6: Reset employee sequence
SELECT setval('employee_id_seq', (SELECT MAX(id) FROM employee), false);