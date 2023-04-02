USE business_db;

INSERT INTO department
    (name)
VALUES  ('Finance'), 
        ('Human Resources'), 
        ('Marketing'), 
        ('Research and Development'),
        ('Engineering');


INSERT INTO role (title, salary, department_id) 
VALUES  ('Accounting Manager', 130000, 1),
        ('Financial Analyst', 60000, 1),
        ('Employee Relations', 160000, 2),
        ('Talent Acquisition', 90000, 2),
        ('Brand Manager', 180000, 3),
        ('Digital Marketing', 90000, 3),
        ('R&D Project Manager', 130000, 4),
        ('Development Engineer', 70000, 4);
        

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Sarah', 'Johnson', 1, NULL),
        ('Michael', 'Chen', 2, 1),
        ('Olivia', 'Rodriguez', 3, NULL),
        ('Thomas', 'Lee', 4, 3),
        ('Ava', 'Patel', 6, 5),
        ('William', 'Thompson', 7, NULL),
        ('Isabella', 'Kim', 8, 7),
        ('Alexander', 'Davis', 5, NULL);
