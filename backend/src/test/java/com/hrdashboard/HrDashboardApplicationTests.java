package com.hrdashboard;

import com.hrdashboard.dto.EmployeeRequest;
import com.hrdashboard.dto.EmployeeResponse;
import com.hrdashboard.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("h2")
class HrDashboardApplicationTests {

    @Autowired
    private EmployeeService employeeService;

    @Test
    void createsAndFetchesEmployee() {
        EmployeeRequest request = new EmployeeRequest();
        request.setFirstName("Test");
        request.setLastName("Employee");
        request.setEmail("test.employee@example.com");
        request.setPhone("9876501234");
        request.setHireDate(LocalDate.now());
        request.setBasicSalary(50000.0);
        request.setStatus("Active");
        request.setDepartment("Engineering");
        request.setJobTitle("Developer");

        EmployeeResponse created = employeeService.create(request);
        EmployeeResponse fetched = employeeService.findById(created.getId());

        assertThat(fetched.getId()).isEqualTo(created.getId());
        assertThat(fetched.getEmail()).isEqualTo(request.getEmail());
        assertThat(fetched.getDepartment()).isEqualTo(request.getDepartment());
    }
}
