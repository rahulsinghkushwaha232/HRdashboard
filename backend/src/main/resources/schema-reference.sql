-- Documentation reference only. Hibernate creates and updates this table.
CREATE TABLE employee (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255),
    hire_date DATE,
    basic_salary DOUBLE,
    status VARCHAR(255),
    department VARCHAR(255),
    job_title VARCHAR(255)
);
