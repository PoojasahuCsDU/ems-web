# Employee Management System (EMS)

A modern, responsive web application for managing employees, admins, and projects within an organization. Built with **React.js (Vite)**, **Ant Design**, and a secure backend API, this project demonstrates robust frontend architecture, clean UI/UX, and seamless integration with RESTful services.

---

## 🌐 Live Demo

**Deployed at:** [https://ems-frontend-369113394426.asia-south2.run.app/login]

---

## ✨ Project Highlights

- **JWT-based authentication** for secure admin access
- **Role-based dashboards** for admins and employees
- **Comprehensive CRUD** for employees and projects
- **Responsive UI** with Ant Design
- **Context API** for global state management
- **RESTful API integration** with Axios
- **Modern codebase** using React Hooks and Vite
- **Cloud deployment on Google Cloud Platform (GCP)**
- **Containerized with Docker for easy deployment and scalability**

---

Here are some screenshots showcasing the Employee Management System (EMS) app:

<div align="center">
   <img src="Employee-Management-System-Web/src/assets/png/login screen.png" alt="Login Screen" width="300" style="margin: 10px;"/>
   <img src="Employee-Management-System-Web/src/assets/png/adding employe.png" alt="Add Employee Screen" width="300" style="margin: 10px;"/>
   <img src="Employee-Management-System-Web/src/assets/png/project screen details.png" alt="Project Details Screen" width="300" style="margin: 10px;"/>
</div>

- **Login Screen:** Secure authentication for admins and employees.
- **Add Employee Screen:** Easily onboard new team members.
- **Project Details Screen:** View comprehensive project information at a glance.

---

## 🛠️ Tech Stack

- **React.js (Vite)**
- **React Router v6**
- **Ant Design**
- **React Context API**
- **Axios**
- **Google Cloud Platform (GCP)**
- **Docker**

---

##  Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd ems-web
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root:

```
VITE_API_URL="https://your-backend-url"
```

### 3. Run Locally

```bash
npm run dev
```

---

## 🗂️ Project Structure

```
src/
├── Auth/
├── components/employees/
├── contexts/
├── hooks/
├── Pages/
├── utils/
├── App.jsx
├── App.css
└── main.jsx
```

---

## 🔗 API Endpoints

| Feature                     | Endpoint                                 |
| --------------------------- | ---------------------------------------- |
| Admin Login                 | `/api/auth/login-admin`                  |
| Register Admin              | `/api/auth/register`                     |
| Get Admins                  | `/api/auth/admins`                       |
| Get Employees               | `/api/users`, `/api/auth/employees`      |
| Get Projects                | `/api/projects/all-projects`             |
| Employee Detail             | `/api/users/:empId`                      |
| Update Employee             | `/api/users/update/:empId`               |
| Download Employee Waypoints | `/api/downloads/kmz/{projectId}/{empId}` |

---

## 📚 Features Overview

- **Admin Management:** List and add admins securely.
- **Employee Management:** List, search, add, edit, and view employee details.
- **Project Management:** List and view project details.
- **Download Waypoints:** Export employee waypoints as KMZ files.
- **Responsive Dashboard:** Optimized for all devices.
- **Cloud Deployment:** Easily deployable on GCP.
- **Containerization:** Docker support for consistent environments.

---

## 🙋‍♂️ About Me

**Pooja Sahu**  
Software Developer passionate about building scalable and beautiful web applications.

- **Email:** heyitspoojasahu@gmail.com
- **Cloud & DevOps:** Experienced with Google Cloud Platform (GCP) and Docker for deploying and managing scalable applications.

---

## ⭐️ If you like this project, please star the repository and connect
