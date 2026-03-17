# PressureWash Pro Platform

Marketplace platform for pressure washing services with role-based access (Admin, Seller, User), PayPal checkout, subscription-gated chatbot, and seller approval workflow.

## Repository Rules Compliance
- This submission uses one combined repository containing both frontend and backend.
- Branch policy: `main` only.
- No Vite configuration is used.
- Environment files are not committed. Use `.env.sample` files as templates.

## Tech Stack
- Backend: Django, Django REST Framework, JWT, SQLite
- Frontend: React (CRA), Redux, React Router, React Bootstrap + Bootswatch
- Payments: PayPal client flow with server-side verification endpoints

## Project Structure
- `backend/` Django API
- `frontend/` React app

Both projects are connected in this same repository (`frontend` consumes `backend` API endpoints).

## Backend Setup
1. Activate virtual environment: `myenv\\Scripts\\Activate.ps1`
2. Install backend deps (if needed): `pip install -r requirements.txt`
3. Copy `backend/.env.sample` to `backend/.env` and set values:
   - `DJANGO_SECRET_KEY=...`
   - `DJANGO_DEBUG=True`
   - `OPENAI_API_KEY=...`
   - `OPENAI_MODEL=gpt-4o-mini`
   - `PAYPAL_CLIENT_ID=...`
   - `PAYPAL_SECRET=...`
4. Run migrations:
   - `python manage.py makemigrations`
   - `python manage.py migrate`
5. Seed dummy data:
   - `python manage.py seed_dummy_data`
6. Start server:
   - `python manage.py runserver`

## Frontend Setup
1. Go to frontend: `cd frontend`
2. Install deps: `npm install`
3. Copy `frontend/.env.sample` to `frontend/.env` and set values:
   - `REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api/v1`
   - `REACT_APP_PAYPAL_CLIENT_ID=...`
   - `REACT_APP_PAYPAL_PLAN_TIER_1=...`
   - `REACT_APP_PAYPAL_PLAN_TIER_2=...`
   - `REACT_APP_PAYPAL_PLAN_TIER_3=...`
4. Start app: `npm start`

## Key Features
- JWT login using email credentials
- User registration with role defaulting to `user`
- Seller application flow: apply, approve with merchant ID, decline with reason
- Service list and detail pages with cards and image previews
- Seller dashboard for service CRUD
- User profile with order history
- Admin user management and subscription transaction list
- Subscription tiers with usage limits for chatbot
- Chatbot limited to project domain and subscription usage

## Submission Reminder
- Commit `.env.sample` files only.
- Do not commit actual `.env` files or private API keys/secrets.

