# 🚀 Team Task Manager (Full-Stack)

A full-stack web application designed to manage projects, assign tasks, and track team progress with role-based access control. This system enables efficient collaboration between Admins and Members with real-time task tracking.

---

## 🔥 Features

* 🔐 User Authentication (Signup/Login with JWT)
* 👥 Role-Based Access (Admin / Member)
* 📁 Project Management (Create, View, Delete)
* ✅ Task Management (Assign, Update Status, Track Progress)
* 📊 Dashboard (Task status & overdue tracking)
* 🌐 Fully deployed on Railway (Live & functional)

---

## 🛠 Tech Stack

**Frontend:**

* React (Vite)
* Tailwind CSS

**Backend:**

* Node.js
* Express.js

**Database:**

* MongoDB (Mongoose)

---

## 📂 Project Structure

```
Ethara_AI_Assistment_Project/
│
├── backend/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── index.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Local Development Setup

### 🔹 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
```

Start backend server:

```bash
npm start
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

---

## 🚀 Deployment (Railway)

This project is deployed using a **monorepo approach with two separate Railway services**:

### 🔹 Backend Service

* Root Directory: `/backend`
* Environment Variables:

  * `MONGO_URI`
  * `JWT_SECRET`
* Generates API endpoints

### 🔹 Frontend Service

* Root Directory: `/frontend`
* Environment Variable:

  * `VITE_API_URL=<backend_live_url>/api`

---

## 📌 API Endpoints (Sample)

* `POST /api/auth/signup`
* `POST /api/auth/login`
* `GET /api/projects`
* `POST /api/tasks`
* `PUT /api/tasks/:id`

---

## 🎥 Demo

* Live URL: *(Add your Railway frontend link here)*
* Demo Video: *(Add your video link here)*

---

## 🧠 Key Highlights

* Clean and modular folder structure
* RESTful API design
* Secure authentication using JWT
* Scalable and production-ready setup
* Focus on functionality over UI complexity

---

## 📄 License

This project is developed as part of a full-stack assessment.

---

## 👨‍💻 Author

**Chaitanya Ravindra Chincholkar**
Full-Stack Developer | Data Analyst

