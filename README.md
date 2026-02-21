# Consultation Management System

A simple mini CRM for medical consultations with AI-powered summary generation.

## Features
- **Patient Management**: Create and list patients.
- **Consultation Management**: Record symptoms and diagnosis for patients.
- **AI Summary**: Generate automated clinical summaries using OpenAI GPT-3.5.
- **Basic UI**: Dark-themed, responsive interface built with React and Bootstrap.
- **API Documentation**: Automated Swagger/OpenAPI documentation.

## Technology Stack
- **Backend**: Django, Django REST Framework (DRF)
- **Frontend**: React (Vite), Axios, Bootstrap 5
- **AI**: OpenAI API Integration
- **Database**: SQLite (default)
- **Documentation**: drf-spectacular (Swagger)

---

## Setup Instructions

### Docker Setup
1. Clone the repository.
2. In the `backend` directory, update `.env` to include your `OPENAI_API_KEY` for real AI summaries.
3. Run `docker-compose up --build`.
4. Access the frontend app at `http://localhost:5173`. The backend API will be available at `http://localhost:8000/api/`.

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   - Copy `.env.example` to `backend/.env` (already done in this repo).
   - Update `OPENAI_API_KEY` in `backend/.env` for real AI summaries.
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the server:
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000/api/`.
   Swagger docs: `http://localhost:8000/api/docs/`.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

---

## Assumptions & Notes
- **AI Integration**: The system uses a mock response if no valid `OPENAI_API_KEY` is provided in the `.env` file. To enable real summaries, provide a valid key.
- **CORS**: `django-cors-headers` is configured to allow all origins for development. In production, this should be restricted to the frontend domain.
- **Filtering**: A basic filter by `patient_id` is implemented in the consultations endpoint: `/api/consultations/?patient_id=1`.

## Bonus Features Implemented
- **Filtering**: Consultations can be filtered by patient.
- **Swagger Documentation**: Accessible at `/api/docs/`.
- **Environment Variables**: Managed via `.env` for secrets.
- **Docker Setup**: `docker-compose` setup included for easy execution.
- **Pagination**: Basic pagination implemented on main endpoints.
- **Unit Tests**: Basic tests added for Django models and views.
