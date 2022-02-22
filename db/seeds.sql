INSERT INTO department (name)
VALUES
('Operations'),
('Finance'),
('Legal'),
('HR'),
('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES 
('Manager', 20, 1),
('CFO', 10, 2),
('Lawyer', 15, 3),
('Specialist', 5, 4),
('Director', 10, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Huckleberry', 'Finn', 1, NULL),
('Tom', 'Sawyer', 2, 2),
('Kendrick', 'Lamar', 3, 2),
('Snoop', 'Dogg', 4, 2),
('Mary', 'Blige', 5, 2);