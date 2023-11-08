INSERT INTO department (name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Engineering');

-- Sample roles
INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Manager', 60000, 1),
  ('Marketing Specialist', 45000, 2),
  ('Software Engineer', 75000, 3);

-- Sample employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, NULL),
  ('Alice', 'Johnson', 3, 1);