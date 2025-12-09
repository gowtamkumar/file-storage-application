# NestJS File Storage API

This is a NestJS-based backend server for the File Storage Application, replicating the logic of the Next.js API using TypeORM and PostgreSQL.

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- npm

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   The project is pre-configured with a `.env` file. Update the database credentials if necessary:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=file_storage_db
   JWT_SECRET=super_secret_jwt_key_change_me
   ```

3. **Database Setup**
   Ensure your PostgreSQL server is running and create the database:
   ```bash
   createdb file_storage_db
   ```
   *Note: The application is configured to auto-synchronize schemas (`synchronize: true`). This is great for development but should be disabled in production.*

## Running the Server

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The server will start on `http://localhost:3001` (default port).

## API Documentation

The API follows the structure of the existing Next.js application.

### Key Endpoints

- **Auth**:
  - `POST /auth/register` - Create account
  - `POST /auth/login` - Login to get JWT

- **Users**:
  - `GET /user` - Get profile
  - `PATCH /user` - Update profile

- **Files**:
  - `GET /files` - List files
  - `POST /files/upload` - Upload file (multipart/form-data)
  - `DELETE /files/:id` - Delete file

- **Folders**:
  - `GET /folders` - List folders
  - `POST /folders` - Create folder

- **Admin**:
  - `GET /admin/dashboard` - View stats
  - `GET /admin/users` - Manage users

## Project Structure

- `src/entities`: Database models (TypeORM entities)
- `src/modules`: Feature modules (Auth, Users, Files, etc.)
- `src/common`: Guards, strategies, and utilities
- `uploads/`: Directory where uploaded files are stored locally
