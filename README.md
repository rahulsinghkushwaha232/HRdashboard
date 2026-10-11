# 🏢 HR Dashboard - Enterprise HRMS

![React](https://img.shields.io/badge/Frontend-React%2018-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwind-css)
![Spring Boot](https://img.shields.io/badge/Backend-SpringBoot%203.4-green?logo=springboot)
![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)
![Database](https://img.shields.io/badge/Database-MySQL%20%7C%20H2-4479A1?logo=mysql)
![Deployment](https://img.shields.io/badge/Deploy-Vercel%20%7C%20Render-black?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-yellow)
![GitHub stars](https://img.shields.io/github/stars/rahulsinghkushwaha232/HRdashboard?style=social)

A full-stack modern **Human Resource Management System (HRMS)** designed to streamline employee lifecycle management, payroll calculation, department metrics, and enterprise workforce insights.

The platform combines a responsive, feature-rich **React 18** client with an enterprise-grade **Spring Boot 3 REST API**, supporting both cloud-managed **MySQL** and zero-config in-memory **H2** databases.

---

## 🌐 Live Deployments

- **Frontend Application (Vercel):** [https://h-rdashboard-three.vercel.app](https://h-rdashboard-three.vercel.app)
- **Backend REST API (Render):** [https://hrdashboard-vjkj.onrender.com/api](https://hrdashboard-vjkj.onrender.com/api)
- **Local API Base:** `http://localhost:8080/api`

---

## ✨ Key Features

### 👥 Employee Management
- Complete CRUD operations (Add, View, Edit, Delete employees).
- Instant, case-insensitive search across employee names and email addresses.
- Multi-dimensional filters: Status (`Active`, `On Leave`, `Resigned`) and Departments.
- Sortable tabular view with pagination controls.
- Safe deletion with interactive confirmation modals.

### 💰 Payroll & Compensation Tracking
- Monthly payroll breakdown calculations based on base salary.
- Real-time tax estimations and net pay projections.
- Department-wise salary allocation summaries.
- One-click CSV export for offline payroll auditing.

### 📊 Executive HR Dashboard
- High-level KPIs: Total headcount, active staff, department counts, and monthly payroll budget.
- Interactive data visualizations with **Recharts** (Department Distribution, Salary Spread, Hiring Trends).
- Theme toggle with persistent **Light / Dark Mode**.

### 🛡️ Enterprise-Grade Backend
- Validated DTO request pipeline with comprehensive Bean Validation (`@Valid`).
- Centralized exception handling returning standardized RFC-7807 compliant JSON error structures.
- Automated database seeding on startup for rapid local testing.
- Configurable Cross-Origin Resource Sharing (CORS) policy.

---

## 🛠️ Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 18, React Router v6, Tailwind CSS, Axios, Recharts, Lucide Icons |
| **Backend** | Java 17, Spring Boot 3.4, Spring Data JPA, Hibernate, Bean Validation |
| **Database** | MySQL 8 (Production), H2 In-Memory (Development & Testing) |
| **Deployment** | Vercel (Frontend), Render (Backend API) |
| **Tools & Version Control** | Git, GitHub, Maven Wrapper, Postman, VS Code |

---

## 🏗️ Project Architecture

```text
┌──────────────────────────────────────────────┐
│            Frontend (React 18)               │
│     Tailwind CSS + Recharts + React Router   │
│         (Deployed on Vercel CDN)             │
└──────────────────────┬───────────────────────┘
                       │ HTTPS / REST (JSON)
                       ▼
┌──────────────────────────────────────────────┐
│           Backend (Spring Boot 3)            │
│  Controller ──► Service ──► Repository (JPA) │
│         (Hosted on Render Cloud)             │
└──────────────────────┬───────────────────────┘
                       │ JDBC / Hibernate
                       ▼
┌──────────────────────────────────────────────┐
│             Database Layer                   │
│        MySQL 8 / In-Memory H2 DB             │
└──────────────────────────────────────────────┘
```

---

## 🧠 System Design & Code Structure

The backend adheres strictly to clean code principles and the **Layered Architecture Pattern**:

### 1. Controller Layer (`com.hrdashboard.controller`)
Exposes REST endpoints, parses path/query parameters, and delegates requests to services.
- `EmployeeController.java`: Endpoints for employee lifecycle and system `/health`.

### 2. Service Layer (`com.hrdashboard.service`)
Enforces core business logic, duplicate email checks, and data transformation.
- `EmployeeService.java`: Business operations and mapping between Entities and DTOs.

### 3. Repository Layer (`com.hrdashboard.repository`)
Interfaces with Spring Data JPA for data persistence and custom queries.
- `EmployeeRepository.java`: Custom finders such as search filtering and email checks.

### 4. Entity & DTO Layer (`com.hrdashboard.entity` & `com.hrdashboard.dto`)
Encapsulates database schemas and validation-safe request/response payloads.
- `Employee.java`: JPA Entity mapped to the relational database.
- `EmployeeRequest.java` / `EmployeeResponse.java`: Validated payload schemas.

---

## 📂 Repository Directory Structure

```text
HRdashboard/
├── backend/
│   ├── .mvn/wrapper/
│   ├── src/main/java/com/hrdashboard/
│   │   ├── HrDashboardApplication.java
│   │   ├── config/              # CORS configuration & initial DataSeeder
│   │   ├── controller/          # REST Controller endpoints
│   │   ├── dto/                 # Request and Response transfer objects
│   │   ├── entity/              # JPA Database entities
│   │   ├── exception/           # Global exception handler & error response
│   │   ├── repository/          # Spring Data JPA repositories
│   │   └── service/             # Business logic layer
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── application-h2.properties
│   │   └── schema-reference.sql
│   ├── mvnw & mvnw.cmd
│   └── pom.xml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable UI components (Modals, StatCards, Toast)
│   │   ├── context/             # Theme & Toast context providers
│   │   ├── pages/               # Dashboard, Employees, Payroll, NotFound
│   │   ├── services/            # Axios API client
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── index.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── vercel.json
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **JDK 17** or higher
- **Node.js 18+** & npm
- **MySQL 8** (Optional: H2 profile runs with zero database installation)

### 1. Clone the Repository
```bash
git clone https://github.com/rahulsinghkushwaha232/HRdashboard.git
cd HRdashboard
```

### 2. Backend Setup

#### Option A: Quick Run with In-Memory H2 (No Database Install Required)
```powershell
cd backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"
```

#### Option B: Run with MySQL
Configure credentials in `backend/src/main/resources/application.properties` or provide environment variables:
```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/hrdashboard?createDatabaseIfNotExist=true&serverTimezone=UTC"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="yourpassword"
cd backend
.\mvnw.cmd spring-boot:run
```
> The backend server starts on: **`http://localhost:8080`**

### 3. Frontend Setup
In a new terminal window:
```powershell
cd frontend
npm install
npm start
```
> The frontend application launches on: **`http://localhost:3000`**

---

## 🔗 REST API Endpoints

All endpoints are hosted under `/api`.

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/api/health` | Service health status check | `200 OK` |
| `GET` | `/api/employees` | Get all employees (supports `?search=query`) | `200 OK` |
| `GET` | `/api/employees/{id}` | Get specific employee details by ID | `200 OK` |
| `POST` | `/api/employees` | Create a new employee record | `201 Created` |
| `PUT` | `/api/employees/{id}` | Update existing employee data | `200 OK` |
| `DELETE` | `/api/employees/{id}` | Delete an employee by ID | `204 No Content` |

---

## ☁️ Deployment Guide

### Frontend on Vercel
1. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Connect your GitHub repository `HRdashboard`.
3. Set the **Root Directory** to `frontend`.
4. Add an Environment Variable:
   - `REACT_APP_API_URL` = `https://your-backend-api.onrender.com/api`
5. Click **Deploy**.

### Backend on Render
1. Sign in to [Render](https://render.com) and create a **New Web Service**.
2. Select your `HRdashboard` repository.
3. Configure the following fields:
   - **Root Directory**: `backend`
   - **Runtime**: `Java`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
   - **Environment Variables**:
     - `SPRING_PROFILES_ACTIVE` = `h2`
     - `CORS_ORIGINS` = `https://your-frontend.vercel.app`
4. Click **Deploy Web Service**.

---

## 🔮 Future Enhancements
- [ ] JWT authentication with role-based access control (Admin, HR Manager, Employee).
- [ ] Leave application and approval tracking workflow.
- [ ] Attendance logs and biometric integration.
- [ ] Automated monthly PDF salary slip generation and email dispatch.
- [ ] Audit logs and activity history.

---

## 👨‍💻 Author

**Rahul Singh Kushwaha**
- GitHub: [@rahulsinghkushwaha232](https://github.com/rahulsinghkushwaha232)

---

## 📄 License

This project is licensed under the **MIT License**.
