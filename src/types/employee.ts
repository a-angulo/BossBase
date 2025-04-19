// Define the Role interface
export interface Role {
  id: number;
  title: string;
  salary: number;
  department_id: number;
}

//Department Interface
export interface Department {
  id: number;
  name: string;
}

//Employee Interface
export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  role_id: number;
  manager_id?: number | null; // Optional because not all employees have managers
}

// NewEmployee Type
// Used when creating a new employee (no id yet)
export type NewEmployee = Omit<Employee, 'id'>;

// EmployeeDetail Interface
// Used when querying joined employee info with role and department
export interface EmployeeDetail extends Employee {
  role_title: string;
  department_name: string;
}
  
  