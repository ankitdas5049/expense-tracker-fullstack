# Expense Tracker - Full Stack Application

A comprehensive expense tracking application for students and employed professionals with budget management, monthly expenditure analysis, and a modern, polished UI.

## Features

✨ **Core Features**
- 🔐 Authentication (JWT-based login/signup)
- 💰 Expense Management (Create, Read, Update, Delete)
- 📊 Budget Management & Tracking
- 📈 Monthly Expenditure Analysis
- 💳 Multiple Categories Support
- 📱 Responsive Design
- 🎨 Modern, Clean UI
- ⚡ Optimistic Updates
- 📦 Persistent Data Storage (SQLite)
- 🌱 Seeded Demo Data

## Tech Stack

**Backend:**
- Node.js + Express.js
- TypeScript
- SQLite3
- JWT Authentication
- Zod Validation

**Frontend:**
- React 18
- TypeScript
- TailwindCSS
- React Router
- Tanstack Query
- Zustand (State Management)
- Recharts (Data Visualization)

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/ankitdas5049/expense-tracker-fullstack.git
cd expense-tracker-fullstack
```

2. Install dependencies
```bash
npm install
cd client && npm install && cd ..
```

3. Setup environment variables
```bash
cp .env.example .env
```

4. Seed demo data
```bash
npm run seed
```

5. Start development servers
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token

### Expenses
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats/monthly` - Monthly statistics

### Budgets
- `GET /api/budgets` - List all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/:id/progress` - Budget progress

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category

## Project Structure

```
expense-tracker-fullstack/
├── src/
│   ├── server/
│   │   ├── index.ts                # Express app entry
│   │   ├── db.ts                   # Database setup
│   │   ├── seed.ts                 # Demo data seeding
│   │   ├── middleware/
│   │   │   ├── auth.ts             # JWT middleware
│   │   │   └── error.ts            # Error handling
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── expenses.ts
│   │   │   ├── budgets.ts
│   │   │   └── categories.ts
│   │   ├── controllers/
│   │   ├── services/
│   │   └── types.ts
│   └── shared/
│       └── types.ts                # Shared TypeScript types
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── styles/
│   └── package.json
├── package.json
└── tsconfig.json
```

## Demo Credentials

After seeding, use these credentials:

**Student Account:**
- Email: `student@example.com`
- Password: `password123`

**Working Professional Account:**
- Email: `professional@example.com`
- Password: `password123`

## License

MIT
