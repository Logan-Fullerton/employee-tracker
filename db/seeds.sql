INSERT INTO department (name) 
VALUES 
("sales"), 
("marketing"), 
("IT"), 
("manager"), 
("warehouse");

INSERT INTO role (title, salary, department_id) 
VALUES ("sales person", 55000, 1), 
("lead tech guy", 165000, 3);


INSERT INTO employee(first_name,last_name,role_id,manager_id) 
values 
("Todd","Potter",2,NULL), 
("Will","Smith",1,1);




       