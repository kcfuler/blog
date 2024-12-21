# Personal Blog Project

A full-stack blog application built with React (frontend) and FastAPI (backend).

## Project Structure
```
blog/
├── frontend/         # React frontend application
└── backend/          # FastAPI backend application
```

## Technology Stack

### Frontend
- React
- TypeScript
- Ant Design
- Vite

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

## Getting Started

### Backend Setup
1. Navigate to the backend directory
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `.\venv\Scripts\activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `uvicorn main:app --reload`

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
