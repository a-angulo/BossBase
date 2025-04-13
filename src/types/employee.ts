// Define the Role interface
export interface Role {
    id: number;
    title: string;
    salary: number;
    department_id: number;
  }
  
  // Define the Department interface
  export interface Department {
    id: number;
    name: string;
  }
  
  // Define the Employee interface
  export interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    role_id: number;
    manager_id?: number | null; // Optional field, can be null
  }
  
  