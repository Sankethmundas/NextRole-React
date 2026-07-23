# 🚀 NextRole — Modern Career Management Platform

[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Framework-Express_5-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Google OAuth](https://img.shields.io/badge/Auth-Google_OAuth_2.0-4285F4?style=for-the-badge&logo=google)](https://developers.google.com/identity)

**NextRole** is a comprehensive, full-stack career platform designed to empower job seekers. It brings resume building, ATS resume checking, job application tracking, cover letter generation, and user authentication into one unified, calm workspace.

---

## ✨ Features Overview

### 📝 1. Resume Builder
- **Real-Time Live Preview**: Interactive resume form with instantaneous right-hand visual preview.
- **PDF Export**: Download formatted, professional resumes directly using `html2pdf.js`.
- **Cloud Auto-Save**: Seamlessly persists resume sections (summary, skills, education, projects, certifications) to MongoDB with smart debouncing.

### 📊 2. Job Application Tracker
- **Application Pipeline**: Track applications across statuses (`Applied`, `Interview`, `Offer`, `Rejected`).
- **Real-Time Analytics Cards**: Instant counts for total applications and status breakdowns.
- **Search & Filter**: Search by company name and filter applications dynamically by status.
- **CSV Data Export**: Export application history into downloadable `.csv` spreadsheets.

### 🎯 3. ATS Resume Checker
- **Document Parsing**: Extract raw text from `.docx` resume files using `mammoth.js`.
- **Keyword Match Calculation**: Compares resume content against job description requirements.
- **Categorized Breakdown**: Group matched and missing keywords into *Skills*, *Tools*, *Certifications*, and *Eligibility*.
- **Actionable Recommendations**: Delivers smart suggestions to boost ATS match scores.

### ✉️ 4. Cover Letter Generator
- **Multi-Tone Generation**: Generates *Professional*, *Confident*, or *Friendly* cover letters.
- **Clipboard & PDF**: Copy formatted text with 1-click or export directly as a PDF document.
- **Persisted Drafts**: Saves user inputs and generated letters to cloud database.

### 🔐 5. Authentication & Security
- **Dual Auth System**: Standard Email/Password auth with `bcryptjs` hashing + Google OAuth 2.0 via `@react-oauth/google`.
- **JWT Protection**: Secure 256-bit token authentication for all user-scoped backend routes.
- **Protected Routes**: Frontend route guarding ensuring user privacy and data security.

---

## 🛠️ Tech Stack & Architecture

```text
 ┌─────────────────────────────────────────────────────────┐
 │                   REACT FRONTEND (Vercel)               │
 │  React 19 • React Router 7 • React Toastify • Axios     │
 └────────────────────────────┬────────────────────────────┘
                              │ API Requests (JWT Auth)
 ┌────────────────────────────▼────────────────────────────┐
 │                 EXPRESS BACKEND (Render)                │
 │  Node.js • Express 5 • Mongoose • Google Auth Library   │
 └────────────────────────────┬────────────────────────────┘
                              │ Mongoose ODM
 ┌────────────────────────────▼────────────────────────────┐
 │                 MONGODB ATLAS (Cloud DB)                │
 │  Users • Jobs • Resumes • Cover Letters • ATS Results   │
 └─────────────────────────────────────────────────────────┘
```

---

## 🚀 Step-by-Step Local Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://cloud.mongodb.com/) account or local MongoDB instance

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/NextRole-React.git
cd NextRole-React
```

### 2. Backend Setup
```bash
cd nextrole-backend
npm install
```

Create a `.env` file inside `nextrole-backend`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_client_id_optional
```

Start backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd nextrole-react
npm install
```

Create a `.env` file inside `nextrole-react` (optional for custom backend URL):
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_optional
```

Start frontend development server:
```bash
npm start
```
Open `http://localhost:3000` in your browser.

---

## 🌐 Production Deployment Guide

### Backend (Render.com)
1. Create a **New Web Service** connected to `NextRole-React`.
2. Set Root Directory to `nextrole-backend`.
3. Set Build Command: `npm install` | Start Command: `node server.js`.
4. Add Environment Variables (`PORT`, `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`).

### Frontend (Vercel.com)
1. Import `NextRole-React` repository.
2. Set Root Directory to `nextrole-react`.
3. Add Environment Variable `REACT_APP_API_URL` pointing to your deployed Render URL (e.g. `https://nextrole-backend.onrender.com`).
4. Click **Deploy**.

---

## 🔮 Future Roadmap & Enhancements (V2)

- [ ] **🤖 OpenAI GPT-4o-mini Integration**:
  - AI Resume Bullet-Point Enhancer & Professional Summary Generator.
  - Natural Language AI Cover Letter Writer personalized to company job descriptions.
- [ ] **📄 Full PDF Resume Parser**: Native PDF text parsing support alongside DOCX.
- [ ] **🔍 Semantic AI ATS Analysis**: Contextual vector-based skill matching beyond keyword search.
- [ ] **📈 Application Analytics Dashboard**: Visual charts tracking interview success rates and weekly application volume.
- [ ] **🔔 Reminders & Notifications**: Email alerts for scheduled interviews and follow-ups.

---

## 👨‍💻 Author

Crafted with ❤️ by **Sankethkumar**  
*Feel free to star ⭐️ this repository if you find it helpful!*
