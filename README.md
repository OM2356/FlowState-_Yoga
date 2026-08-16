# FlowState Yoga

A full-stack yoga platform focused on **mental well-being and physical recovery**. FlowState helps users choose yoga sessions based on how they feel and provides a simple, personalized experience.

## 🚀 Features

* 🧘 Mood-based yoga session selection
* 👤 User registration and login
* 🔐 Secure authentication
* 🧑‍💻 User profiles
* 📱 Responsive user interface
* ✨ Smooth animations and transitions
* 🗄️ Database-backed user data
* 🔒 Secure password hashing

## 🛠️ Technology Stack

### Frontend

* Next.js 14
* React 18
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* Zustand
* Lucide Icons

### Backend

* Next.js API Routes
* NextAuth.js
* bcryptjs
* Prisma ORM

### Database

* SQLite

## 📁 Project Structure

```text
FlowState/
├── app/
│   ├── api/
│   ├── components/
│   ├── page.tsx
│   └── layout.tsx
├── components/
├── prisma/
│   └── schema.prisma
├── public/
├── .env.local
├── package.json
└── README.md
```

## ⚙️ Installation

### Prerequisites

* Node.js
* npm

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd FlowState
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file and add the required environment variables:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
```

### 4. Set up the database

```bash
npx prisma migrate dev
```

### 5. Start the development server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

## 🏗️ Architecture

FlowState uses a full-stack Next.js architecture:

```text
User
  ↓
React + Next.js
  ↓
Next.js API Routes
  ↓
NextAuth + bcryptjs
  ↓
Prisma ORM
  ↓
SQLite Database
```

## 🔐 Security

* Passwords are securely hashed using bcryptjs.
* Authentication is handled using NextAuth.js.
* Database access is managed through Prisma ORM.
* Sensitive configuration is stored in environment variables.

## 📦 Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 🌐 Deployment

The application can be deployed on platforms such as Vercel or other compatible Next.js hosting platforms.

## 👨‍💻 Project

**FlowState Yoga**

Mental Well-being × Physical Recovery
