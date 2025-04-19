-- Clear existing data and reset IDs
TRUNCATE TABLE employee, role, department RESTART IDENTITY CASCADE;

-- Seed Departments
INSERT INTO department (name) 
VALUES
  ('Sales'),         -- id = 1
  ('Engineering'),   -- id = 2
  ('Finance'),       -- id = 3
  ('Legal');         -- id = 4

-- Seed Roles (each role references department_id)
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

-- Seed Employees
-- Assumes auto-incrementing IDs match insert order
-- Sarah (id 6) manages Mike (1) and Tom (7)
-- Ashley (id 2) manages Kevin (3) and Sam (9)
-- John (id 8) manages Mike too (if dual-manager logic applies)

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

  -- Reset sequences so IDs match current max values
SELECT setval('department_id_seq', (SELECT MAX(id) FROM department));
SELECT setval('role_id_seq', (SELECT MAX(id) FROM role));
SELECT setval('employee_id_seq', (SELECT MAX(id) FROM employee));
