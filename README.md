# 🎓 TutorG — Full-Stack E-Learning Platform
TutorG is a production-ready, full-stack E-Learning Platform designed for **Admins**, **Instructors**, and **Students**, built using **React + TypeScript** and **Node.js + Express (TypeScript)**.

It demonstrates real-world system design, clean architecture, and scalable backend practices commonly used in modern SaaS products.

---

## 🌟 Why TutorG?

TutorG goes beyond a simple CRUD application and showcases an end-to-end learning ecosystem:

- 🏗 Enterprise-style layered architecture
- 🧩 Repository pattern for clean data access
- 🔐 Role-based access control (RBAC)
- 🔑 Secure authentication & authorization
- ☁️ Scalable media handling
- 🚀 Production-ready frontend & backend separation
- 📈 Designed for real users, growth, and maintainability

---

## 🌟 Screenshots

Here are some real glimpses of the working platform:

<div align="center">
  <img src="screenshots/student-home.png" alt="Student HomePage" width="75%"/>
  <br><br>
  <em>Modern student Home Page with course recommendations & Tutors</em>
</div>

<br>
<div align="center">
  <img src="screenshots/course-listing.png" alt="Student HomePage" width="75%"/>
  <br><br>
  <em>Modern student Home Page with course recommendations & Tutors</em>
</div>

<br>
<div align="center">
  <img src="screenshots/course-details.png" alt="Student HomePage" width="75%"/>
  <br><br>
  <em>Modern student Home Page with course recommendations & Tutors</em>
</div>

<br>
---

## 🚀 Live Demo & Source Code

🌐 **Live Application:**  
https://tutorg.vercel.app/

💻 **GitHub Repository:**  
https://github.com/JoyelV/tutorG

---

## 🧠 Product Overview

### 🎯 Purpose

TutorG provides a multi-role learning platform where:

- Admins manage the ecosystem
- Instructors create and manage courses
- Students browse, purchase, and consume learning content

### 👥 Supported Roles

- Admin
- Instructor
- Student

Each role operates with secure, isolated permissions and workflows.

---

## 🏗 Architecture & System Design

### 🔹 High-Level Architecture

- **Frontend:** React Single Page Application (SPA)
- **Backend:** RESTful API using Express
- **Database:** MongoDB (NoSQL)
- **Deployment:** Vercel (Frontend) — Backend deployable on Render, Railway, AWS, etc.

### 🔹 Backend Architecture (Key Highlight)

TutorG follows a **Layered Architecture** with **Repository Pattern**:  
**Controller → Service → Repository → Model**
---

## 📂 Project Structure

tutorG/
├── client/                        # 🎨 Frontend (React + TypeScript)
│   ├── public/
│   └── src/
│       ├── components/            # Reusable UI pieces
│       ├── pages/                 # Route-based pages
│       ├── hooks/
│       ├── contexts/
│       ├── types/
│       └── assets/
│
├── server/                        # ⚙️ Backend (Node.js + Express + TS)
│   ├── src/
│   │   ├── controllers/           # Express request handlers
│   │   ├── services/              # Business logic layer
│   │   ├── repositories/          # Data access (abstraction)
│   │   ├── models/                # Mongoose schemas
│   │   ├── routes/                # API endpoints
│   │   ├── middlewares/           # Auth, validation, errors
│   │   ├── config/                # Configurations & env setup
│   │   ├── utils/                 # Helpers (jwt, mailer, otp...)
│   │   └── server.ts              # ← Application entry
│   └── ...
│
├── screenshots/                   # 📸 README images
├── .env.example
└── README.md
---

## 🔐 Authentication & Security

- JWT-based authentication
- Secure password hashing
- Role-Based Access Control (RBAC)
- Protected routes using middleware
- Environment-based secret management
- Secure CORS configuration

---

## 🎓 Core Features

### 👩‍🏫 Instructor Features
- Create and manage courses
- Upload lessons and learning media
- Manage course content

### 👨‍🎓 Student Features
- Browse and enroll in courses
- Add courses to cart
- Place orders
- View lessons and quizzes
- Submit reviews

### 🛠 Admin Features
- Manage users and roles
- Oversee platform activity
- Control platform data

---

## 📦 Media & File Management

- Multer for file handling
- Cloudinary for secure cloud-based storage
- Optimized handling of image and video assets

---

## 🎨 Frontend Highlights

- Built using React + TypeScript
- Styled with Tailwind CSS
- Responsive & mobile-first UI
- Reusable, modular component design
- Clean API integration layer
- Accessible and user-friendly layouts

---

## ⚙️ Tech Stack

**Frontend**  
React · TypeScript · Tailwind CSS

**Backend**  
Node.js · Express · TypeScript · MongoDB · Mongoose

**Tools & Services**  
JWT · Cloudinary · Multer · REST APIs · Vercel

---

## 🚀 Deployment

- Frontend: Deployed on Vercel
- Backend: Production-ready Express server (easily deployable on Render, Railway, etc.)

---

## 🧪 Code Quality & Engineering Practices

- Type-safe codebase (TypeScript everywhere)
- Clean Architecture principles
- SOLID design approach
- Reusable services & repositories
- Scalable and maintainable structure

---

## 🎯 Ideal For Demonstrating

- MERN / Full-Stack Development
- Clean Architecture & Repository Pattern
- Role-based systems
- Production-ready API design
- Real-world SaaS product thinking

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit clean, scoped changes
4. Open a pull request with a clear description

---

## 👨‍💻 Author

**Joyel Varghese**  
Full-Stack Developer  
(MERN | TypeScript | React | Node.js)

---