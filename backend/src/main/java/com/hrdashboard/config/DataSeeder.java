package com.hrdashboard.config;

import com.hrdashboard.entity.Employee;
import com.hrdashboard.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;

    public DataSeeder(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public void run(String... args) {
        if (employeeRepository.count() != 0) {
            return;
        }

        List<Employee> employees = List.of(
                employee("Aarav", "Sharma", "aarav.sharma@example.com", "9876543210", "2020-03-16", 125000, "Active", "Engineering", "Senior Software Engineer"),
                employee("Ananya", "Patel", "ananya.patel@example.com", "9876543211", "2021-07-12", 98000, "Active", "Engineering", "Software Engineer"),
                employee("Rohan", "Gupta", "rohan.gupta@example.com", "9876543212", "2019-11-04", 150000, "Active", "Engineering", "Engineering Manager"),
                employee("Diya", "Reddy", "diya.reddy@example.com", "9876543213", "2022-02-21", 72000, "On Leave", "HR", "HR Specialist"),
                employee("Vivaan", "Nair", "vivaan.nair@example.com", "9876543214", "2020-09-07", 88000, "Active", "Sales", "Account Manager"),
                employee("Isha", "Mehta", "isha.mehta@example.com", "9876543215", "2023-01-16", 65000, "Active", "Marketing", "Content Strategist"),
                employee("Aditya", "Verma", "aditya.verma@example.com", "9876543216", "2021-05-10", 110000, "Active", "Finance", "Finance Analyst"),
                employee("Meera", "Iyer", "meera.iyer@example.com", "9876543217", "2024-04-01", 54000, "Active", "Support", "Customer Support Associate"),
                employee("Kabir", "Singh", "kabir.singh@example.com", "9876543218", "2022-08-15", 92000, "On Leave", "Engineering", "QA Engineer"),
                employee("Saanvi", "Khan", "saanvi.khan@example.com", "9876543219", "2019-06-24", 135000, "Active", "Sales", "Regional Sales Lead"),
                employee("Arjun", "Desai", "arjun.desai@example.com", "9876543220", "2025-02-03", 48000, "Active", "HR", "Recruitment Coordinator"),
                employee("Tara", "Joshi", "tara.joshi@example.com", "9876543221", "2023-09-18", 78000, "Resigned", "Marketing", "Brand Executive"),
                employee("Reyansh", "Kulkarni", "reyansh.kulkarni@example.com", "9876543222", "2026-01-12", 60000, "Active", "Finance", "Accounts Executive"),
                employee("Aadhya", "Pillai", "aadhya.pillai@example.com", "9876543223", "2024-11-11", 25000, "Active", "Support", "Support Representative"),
                employee("Ishaan", "Chopra", "ishaan.chopra@example.com", "9876543224", "2025-06-02", 105000, "Active", "Engineering", "Product Engineer")
        );
        employeeRepository.saveAll(employees);
    }

    private Employee employee(
            String firstName,
            String lastName,
            String email,
            String phone,
            String hireDate,
            double basicSalary,
            String status,
            String department,
            String jobTitle
    ) {
        Employee employee = new Employee();
        employee.setFirstName(firstName);
        employee.setLastName(lastName);
        employee.setEmail(email);
        employee.setPhone(phone);
        employee.setHireDate(LocalDate.parse(hireDate));
        employee.setBasicSalary(basicSalary);
        employee.setStatus(status);
        employee.setDepartment(department);
        employee.setJobTitle(jobTitle);
        return employee;
    }
}
