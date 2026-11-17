# Zen Practical Test - Invoice & Billing System

Invoice generation and billing application built with React, Node.js (Express), and MySQL (Sequelize).

---

## Tech Stack

- **Frontend:** React.js, Bootstrap 5, Axios, Vite
- **Backend:** Node.js, Express.js, Sequelize ORM
- **Database:** MySQL

## Features

- **Single Form Interface:** Exactly modeled after the practical test specification.
- **Dynamic Dropdown:** Products fetched directly from `Product_Master`.
- **Auto-Fetch:** Rate and Unit automatically populated based on selected product.
- **Real-Time Calculations:** Net Amount and Total Amount calculated dynamically on user input.
- **In-Memory Line Items Grid:** Multiple items can be added before final database submission.
- **In-Grid Update & Removal:** Users can modify quantity, discount, or remove rows (`X REMOVE`) directly within the grid.
- **Transactional Database Persistence:** When clicking **SUBMIT**, `Invoice_Master` and `Invoice_Detail` records are saved atomically within a database transaction.
- **Invoice History Modal:** Review past saved invoices and their line items.

---

## Setup & Running the Application

### 1. Prerequisites
- Node.js (v18+)
- MySQL Server running on `localhost:3306`

### 2. Database Configuration
Create the database in MySQL:
```sql
CREATE DATABASE zen_practical_db;
```

Check `backend/.env` and update your MySQL credentials if needed:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=zen_practical_db
DB_USER=root
DB_PASSWORD=root
```

### 3. Backend Setup
```bash
cd backend
npm install

# Run database migrations (creates tables)
npm run migrate

# Run database seeders (populates sample products)
npm run seed

# Start backend server
npm run dev
```
Backend runs on `http://localhost:5000`.

### 4. Frontend Setup
```bash
cd frontend
npm install

# Start Vite development server
npm run dev
```
Frontend runs on `http://localhost:3000`.
