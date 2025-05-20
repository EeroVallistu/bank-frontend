# Bank API Frontend

## Overview
This is a React frontend for the Bank API. It provides a user interface for interacting with all the endpoints defined in the API, including user authentication, account management, transactions, and currency exchange features.

## Features
- User registration and authentication
- Account management (create and view accounts)
- Transaction handling (create and view transactions)
  - Outgoing transactions displayed with negative (-) sign
  - Incoming transactions displayed with positive (+) sign
- Real-time currency exchange rates and converter
- Responsive design using Bootstrap

## Technologies Used
- React.js
- React Router for navigation
- Axios for API communication
- React Bootstrap for UI components
- Formik & Yup for form handling and validation
- Context API for state management

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or bun package manager

### Installation
```bash
cd frontend
npm install
# or
bun install
```

### Running the Development Server
```bash
npm start
# or
bun run start
```

### Building for Production
```bash
npm run build
# or
bun run build
```

## Project Structure
- `src/components/` - Reusable UI components
- `src/contexts/` - React context providers
- `src/pages/` - Page components for each route
- `src/services/` - API service configuration

## Authentication
The application uses JWT authentication. Tokens are stored in localStorage and automatically included in API requests via the Axios interceptor.