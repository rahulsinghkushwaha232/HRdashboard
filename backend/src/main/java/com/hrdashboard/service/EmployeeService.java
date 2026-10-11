package com.hrdashboard.service;

import com.hrdashboard.dto.EmployeeRequest;
import com.hrdashboard.dto.EmployeeResponse;
import com.hrdashboard.entity.Employee;
import com.hrdashboard.exception.DuplicateEmailException;
import com.hrdashboard.exception.ResourceNotFoundException;
import com.hrdashboard.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> findAll(String search) {
        List<Employee> employees = search == null || search.isBlank()
                ? employeeRepository.findAll()
                : employeeRepository.search(search.trim());
        return employees.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public EmployeeResponse findById(Long id) {
        return toResponse(getEmployee(id));
    }

    public EmployeeResponse create(EmployeeRequest request) {
        ensureEmailAvailable(request.getEmail(), null);
        return toResponse(employeeRepository.save(toEntity(request)));
    }

    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee employee = getEmployee(id);
        ensureEmailAvailable(request.getEmail(), id);
        updateEntity(employee, request);
        return toResponse(employeeRepository.save(employee));
    }

    public void delete(Long id) {
        employeeRepository.delete(getEmployee(id));
    }

    private Employee getEmployee(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee with id " + id + " not found"));
    }

    private void ensureEmailAvailable(String email, Long employeeId) {
        boolean exists = employeeId == null
                ? employeeRepository.existsByEmail(email)
                : employeeRepository.existsByEmailAndIdNot(email, employeeId);
        if (exists) {
            throw new DuplicateEmailException(email);
        }
    }

    private Employee toEntity(EmployeeRequest request) {
        Employee employee = new Employee();
        updateEntity(employee, request);
        return employee;
    }

    private void updateEntity(Employee employee, EmployeeRequest request) {
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setHireDate(request.getHireDate());
        employee.setBasicSalary(request.getBasicSalary());
        employee.setStatus(request.getStatus());
        employee.setDepartment(request.getDepartment());
        employee.setJobTitle(request.getJobTitle());
    }

    private EmployeeResponse toResponse(Employee employee) {
        EmployeeResponse response = new EmployeeResponse();
        response.setId(employee.getId());
        response.setFirstName(employee.getFirstName());
        response.setLastName(employee.getLastName());
        response.setEmail(employee.getEmail());
        response.setPhone(employee.getPhone());
        response.setHireDate(employee.getHireDate());
        response.setBasicSalary(employee.getBasicSalary());
        response.setStatus(employee.getStatus());
        response.setDepartment(employee.getDepartment());
        response.setJobTitle(employee.getJobTitle());
        return response;
    }
}
