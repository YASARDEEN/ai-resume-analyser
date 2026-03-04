# AI Resume Analyser & Professional ATS

A premium, state-of-the-art AI-powered Applicant Tracking System and Resume Analyser.

## 🚀 Quick Start

To run the entire application (Frontend + Backend) with a single command:

1.  Open your terminal in the root folder.
2.  Run:
    ```bash
    npm start
    ```

The application will be available at:
- **Frontend**: [http://localhost:5173/](http://localhost:5173/)
- **Backend API**: [http://localhost:5000/](http://localhost:5000/)

---

## 🛠️ Manual Execution

If you prefer to run them separately:

### Backend
```bash
cd backend-v2
npm start
```

### Frontend
```bash
npm run dev
```

---

## ✨ Features
- **Real Resume Upload**: Upload PDF/DOCX files directly.
- **Persistent Database**: Data is saved to `database.json` locally.
- **Smart Analysis**: AI-powered resume parsing (with mock fallback if no API key is set).
- **Admin Dashboard**: Keyword management and candidate ranking.
- **Candidate Dashboard**: Detailed analysis results and resume history.
- **Professional UI**: Modern, responsive design using Tailwind CSS and Framer Motion.

---

## 🔑 Authentication
- **Register**: Create a new account as an Administrator or Candidate.
- **Login**: Secure access with JWT persistent sessions.

> [!TIP]
> Use the **Administrator** role during registration to access advanced ranking and report features!
