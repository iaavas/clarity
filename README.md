# Clarity Web App 
Clarity is a personal expense tracking app designed to help you understand your finances better. Think of it as a smart way to track where your money goes, so you can make better financial decisions.

## Features

- **Expense Tracking**: Log and monitor your spending habits
- **Income Management**: Track your income alongside expenses
- **Category Organization**: Organize transactions by custom categories
- **Visual Analytics**: Beautiful charts and insights to understand your spending patterns
- **AI-Powered App**: Use chatbot to deal with your finances

## Prerequisites


- **Node.js**
- **Docker Desktop** 


## Getting Started

### Step 1: Clone the Repository

```bash
https://github.com/iaavas/clarity
cd clarity
```

### Step 2: Set Up the Database

We use PostgreSQL for storing our data
First, start the database:

```bash
cd backend
docker-compose up -d
```

### Step 3: Configure Environment Variables


#### Backend Configuration

Copy the example environment file and fill in your values:

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and make sure it looks like this:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/clarity_db?schema=public"
PORT=8000
JWT_SECRET="your-super-secret-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
FRONTEND_URL=your_frontend_url
```

#### Frontend Configuration

Now let's set up the frontend:

```bash
cd ../frontend
cp .env.example .env
```

Open `frontend/.env` and configure it:

```env
VITE_API_URL=http://localhost:8000
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

- `VITE_API_URL` should point to your backend (default is `http://localhost:8000`)
- `VITE_GEMINI_API_KEY` is needed for AI features. 


### Step 4: Install Dependencies


```bash
cd ..  
npm run install-all
```

### Step 5: Set Up the Database Schema

Now let's create the database tables:

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```



### Step 6: Run the App! 🚀

You're almost there! From the root directory, run:

```bash
npm run dev
```

This starts both the backend and frontend servers simultaneously. 

- **Frontend** will be running at `http://localhost:5173`
- **Backend API** will be running at `http://localhost:8000`

Open your browser and navigate to the frontend URL. You should see the Clarity webapp.

## Creating Your First Account

When you first open the app, you'll need to sign up:

1. Click on "Sign Up" (or navigate to the signup page)
2. Enter your email and create a password
3. Once you're logged in, you can start adding transactions!

## Running Individual Services

Sometimes you might want to run just the frontend or just the backend:

**Backend only:**
```bash
cd backend
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm run dev
```

## Stopping the Database

When you're done for the day, you can stop the database:

```bash
cd backend
docker-compose down
```

If you want to remove all the data too (fresh start):

```bash
docker-compose down -v
```

### Prisma errors

If you make changes to the database schema:
```bash
cd backend
npx prisma migrate dev --name your_migration_name
npx prisma generate
```

## Project Structure

```
clarity-app/
├── backend/          
│   ├── src/         
│   ├── prisma/      
│   └── docker-compose.yml  
├── frontend/        
│   └── src/         
└── package.json     
```

## Tech Stack

- **Backend**: Node.js, Express, Prisma, PostgreSQL
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, ShadcnUI
- **Database**: PostgreSQL (via Docker)


