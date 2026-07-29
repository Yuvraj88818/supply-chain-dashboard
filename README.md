# Supply Chain Dashboard

A full-stack web application designed to manage and visualize supply chain operations. This project was built to demonstrate proficiency in modern web development technologies, system architecture, and database management as part of my software engineering portfolio.

## Overview

The Supply Chain Dashboard provides a centralized interface for tracking inventory, managing warehouses, coordinating suppliers, and monitoring shipments. It features real-time data visualization and a complete RESTful API backend.

## Technical Stack

### Frontend
* React.js (Vite)
* Tailwind CSS
* Recharts (Data Visualization)
* Axios (HTTP Client)
* React Router DOM

### Backend
* Node.js
* Express.js
* Prisma ORM
* PostgreSQL / SQLite
* JSON Web Tokens (JWT) Authentication

## Key Features

* **Authentication System**: Secure login and registration with JWT-based route protection.
* **Dashboard Analytics**: Dynamic charting of delivery trends and live activity feeds.
* **Inventory Management**: Complete CRUD operations for tracking stock across multiple global facilities.
* **Logistics Tracking**: Shipment tracking with origin and destination routing.
* **Data Export**: Utility to instantly export table data to CSV for business reporting.
* **Printable Reports**: Specialized CSS media queries for generating clean PDF reports directly from the browser.

## Local Installation

1. Clone the repository
2. Install backend dependencies:
   cd server
   npm install
3. Configure the database:
   Create a .env file in the server directory with: DATABASE_URL="file:./dev.db"
   Run: npx prisma db push
4. Start the backend server:
   npm run start
5. Install frontend dependencies:
   cd ../client
   npm install
6. Start the frontend development server:
   npm run dev

## Architecture Decisions

The application follows a standard client-server architecture. The frontend is entirely decoupled from the backend, communicating exclusively via REST API endpoints. Prisma was chosen as the ORM to ensure type safety and rapid schema iteration. The UI was designed with a focus on usability and data density, utilizing a custom design system built on top of Tailwind CSS.

## License

This project is open-source and available under the MIT License.
