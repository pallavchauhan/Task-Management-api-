📋 Task Management API
A backend REST API for task management with user authentication using Node.js, Express.js, TypeScript, PostgreSQL, and JWT-based Authentication.

🚀 Features
User Signup & Login with hashed passwords (bcrypt)
JWT-based Authentication (Login returns token)
Task CRUD (Create, Read, Update, Delete)
Smart Task Summary (Grouped by status & overdue count)
PostgreSQL Database Integration
Fully developed in TypeScript
Modular Folder Structure
Secure Auth Middleware (Route Protection)

🛠 Tech Stack
Node.js
Express.js
TypeScript
PostgreSQL
JWT (jsonwebtoken)
Bcrypt (password hashing)
Dotenv (environment variables)

📦 Installation Steps
Clone Repository
//Copy code
git clone <your-repo-link>
cd <repo-folder>

Install Dependencies
//Copy code
npm install

Setup Environment Variables (.env)
Create a .env file in the root:
PORT=3600
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/Assignment
JWT_SECRET=yourSecretKey

Create PostgreSQL Database
Copy code
CREATE DATABASE "Assignment";

Create Tables
Copy code
\c Assignment;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'in-progress', 'completed')) NOT NULL DEFAULT 'pending'
);


Start the Server
Copy code
npx ts-node src/server.ts


🧪 API Endpoints
Auth Routes
Method	Endpoint	Description
POST	/auth/signup	User Registration
POST	/auth/login	User Login (returns JWT token)

Task Routes (Authenticated)
Method	Endpoint	Description
POST	/tasks	Create a new task
GET	/tasks	Get all tasks of logged-in user
PUT	/tasks/:id	Update task (only if owner)
DELETE	/tasks/:id	Delete task (only if owner)
GET	/tasks/summary	Get task summary with overdue count

🧑‍💻 Testing API via Postman
Signup → /auth/signup

Login → /auth/login (Copy JWT Token)

For all /tasks/* routes, add Header:

makefile
Copy code
Authorization: Bearer <paste-your-token-here>
Test Create, Read, Update, Delete, Summary APIs.

📝 Folder Structure
pgsql
Copy code
src/
 ├── controllers/
 ├── middleware/
 ├── routes/
 ├── utils/
 ├── database.ts
 ├── app.ts
 └── server.ts

npx ts-node src/server.ts

✨ Author
Pallav Chauhan
