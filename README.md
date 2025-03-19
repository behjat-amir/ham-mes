# HamrahMes Backend

A modern RESTful API for messaging system.

## Project Structure

```
.
├── src/                  # Source files
│   ├── config/           # Configuration files
│   │   ├── db.js         # Database connection
│   │   └── swagger.js    # API documentation setup
│   ├── controllers/      # Request handlers
│   │   ├── adminController.js
│   │   ├── apiKeyController.js
│   │   ├── authController.js
│   │   ├── messageController.js
│   │   └── systemController.js
│   ├── middlewares/      # Express middlewares
│   │   ├── auth.js       # Authentication middleware
│   │   ├── fileAccess.js # File access control
│   │   └── upload.js     # File upload handling
│   ├── models/           # Database models
│   │   ├── ApiKey.js
│   │   ├── Banner.js
│   │   ├── Message.js
│   │   ├── OTP.js
│   │   ├── SystemInfo.js
│   │   ├── User.js
│   │   └── index.js      # Models export
│   ├── routes/           # Express routes
│   │   ├── admin.routes.js
│   │   ├── apiKey.routes.js
│   │   ├── auth.routes.js
│   │   ├── message.routes.js
│   │   └── system.routes.js
│   └── app.js            # Express app setup
├── uploads/              # Uploaded files directory
├── .env                  # Environment variables (not in repo)
├── .env.example          # Example environment variables
├── index.js              # Application entry point
├── swagger.yaml          # API documentation
└── package.json          # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables example:
   ```bash
   cp .env.example .env
   ```
4. Configure your environment variables in `.env`

### Running the application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Documentation

The API documentation is available at `/api-docs` endpoint when the server is running.

## Features

- User authentication with OTP
- JWT-based authentication with refresh tokens
- Admin management for users and API keys
- Message sending and receiving
- System information management
- Banner management
- File upload and download

## Authentication

The API uses JWT token-based authentication. To access protected endpoints:

1. Request an OTP via `/auth/send-otp`
2. Verify OTP and get tokens via `/auth/verify-otp`
3. Include the received token in your requests:
   ```
   Authorization: Bearer YOUR_TOKEN
   ```
4. Refresh expired tokens via `/auth/refresh-token`

## License

This project is licensed under the ISC License 