# Hospital Management System (HMS) 🏥

A full-stack enterprise **Hospital Management System** designed to automate and manage core healthcare operations including patient registration, doctor scheduling, department allocation, appointment booking with conflict detection, and medical history tracking.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot 3.2.4
- **Modules**: Spring Web (REST APIs), Spring Data JPA, Spring Boot Validation
- **Database**: MySQL
- **Build Tool**: Maven

---

## 🏗️ Architecture

```text
React Frontend (Vite)
       │ HTTP / REST APIs (JSON)
       ▼
Spring Boot REST Controllers
       │
Service Layer (Business Rules & Validation)
       │
Repository Layer (Spring Data JPA)
       │ JDBC
       ▼
MySQL Database (hms_db)
```

## 📁 Project Structure

```text
HMS/
├── src/main/java/com/hospital/hms/
│   ├── controller/      # REST API Controllers (Department, Patient, Doctor, Appointment, MedicalRecord, Dashboard)
│   ├── service/         # Service Interfaces & Implementations
│   ├── repository/      # Spring Data JPA Repositories
│   ├── entity/          # JPA Entities (Department, Patient, Doctor, Appointment, MedicalRecord, User)
│   ├── dto/             # Data Transfer Objects & Validations
│   └── exception/       # Global Exception Handler
├── src/main/resources/
│   └── application.properties  # Database & Spring Boot configuration
├── frontend/
│   ├── src/
│   │   ├── components/  # Header, Sidebar
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # Dashboard, Patients, Doctors, Departments, Appointments, MedicalRecords
│   │   ├── services/    # Axios API configuration
│   │   ├── App.jsx      # React Router configuration
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Database Setup
Create a MySQL database named `hms_db`:
```sql
CREATE DATABASE hms_db;
```

Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hms_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=Kaveesha@2003
```

### 2. Backend Setup
Run the Spring Boot application using Maven or your IDE:
```bash
mvn spring-boot:run
```
The REST API will be available at `http://localhost:8080/api`.

### 3. Frontend Setup
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
npm run dev
```
The React frontend will run at `http://localhost:5173`.