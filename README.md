# Project description

A client-server application for managing and resending failed participations with Express.js backend and Node.js client.

## Project Structure

This project uses npm workspaces to manage both client and server applications:

```
florian/
├── package.json          # Root workspace configuration
├── client/              # Client application
│   ├── package.json     # Client dependencies
│   ├── index.js         # Main client script
│   ├── data/
│   │   └── failed-participations.js  # Dummy participation data
│   └── output/          # Log files output directory
└── server/              # Server application
    ├── package.json     # Server dependencies
    └── index.js         # Express server with basic auth
```

## Getting Started

### Prerequisites

- Node.js (>= 16.0.0)
- npm (>= 7.0.0)

### Environment Configuration

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file with your configuration:**
   ```bash
   # Server Configuration
   SERVER_PORT=3000
   SERVER_HOST=localhost
   SERVER_URL=http://localhost:3000

   # API Endpoints
   PROMOTION_ENDPOINT=/promotion

   # Authentication Credentials
   AUTH_USERNAME=your_username
   AUTH_PASSWORD=your_secure_password

   # Client Configuration
   REQUEST_DELAY=2000
   OUTPUT_LOG_FILENAME=result.log

   # Environment
   NODE_ENV=development
   ```

### Installation

Install all dependencies for both client and server:

```bash
npm install
```

Or install individually:

```bash
# Install server dependencies
npm run install:server

# Install client dependencies
npm run install:client
```

### Running the Application

#### Development Mode (Both services)

Run both client and server in development mode with auto-restart:

```bash
npm run dev
```

#### Individual Services

**Server only:**
```bash
# Production
npm run start:server

# Development with auto-restart
npm run dev:server
```

**Client only:**
```bash
# Production
npm run start:client

# Development with auto-restart
npm run dev:client
```

#### Manual Setup

1. **Start the server:**
   ```bash
   cd server
   npm install
   npm start
   # Server runs on http://localhost:3000
   ```

2. **Run the client:**
   ```bash
   cd client
   npm install
   npm start
   # Client will send requests to the server
   ```

## API Endpoints

### Server (Port 3000)

- **POST /promotion**
  - Receives participation data
  - Requires Basic Authentication
  - Content-Type: application/json

### Authentication

The server uses Basic Authentication with credentials configured via environment variables:
- Username: Set via `AUTH_USERNAME` (default: `admin`)
- Password: Set via `AUTH_PASSWORD` (default: `password123!`)

**Security Note:** Always change the default credentials in production and use strong passwords.

## Client Configuration

The client script:
- Reads failed participations from `./data/failed-participations.js`
- Sends POST requests to the configured server URL
- Logs responses to the configured output file
- Includes a configurable delay between requests
- All settings are controlled via environment variables

## Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `SERVER_PORT` | Port for the server | `3000` |
| `SERVER_HOST` | Server hostname | `localhost` |
| `SERVER_URL` | Full server URL | `http://localhost:3000` |
| `PROMOTION_ENDPOINT` | API endpoint path | `/promotion` |
| `AUTH_USERNAME` | Basic auth username | `admin` |
| `AUTH_PASSWORD` | Basic auth password | `password123!` |
| `REQUEST_DELAY` | Delay between requests (ms) | `2000` |
| `OUTPUT_LOG_FILENAME` | Log file name | `result.log` |
| `NODE_ENV` | Environment mode | `development` |

## Data Structure

Each participation payload includes:
- `participationId`: Unique identifier
- `userId`: User identifier
- `email`: User email address
- `promotionCode`: Promotional code
- `timestamp`: ISO timestamp
- `participationType`: Type of participation
- `metadata`: Additional context (source, referrer)

## Development

### Workspace Commands

```bash
# Install all dependencies
npm install

# Run both services in development
npm run dev

# Work with specific workspace
npm run dev:server    # Server only
npm run dev:client    # Client only
```

### Adding Dependencies

```bash
# Add to server
npm install express --workspace=server

# Add to client
npm install axios --workspace=client

# Add to root (affects all workspaces)
npm install --save-dev nodemon
```

## Logs

Client execution logs are written to:
- `client/output/resend-participations.log`

Each log entry contains:
- Timestamp
- HTTP status code
- Response data or error details
- Original payload

## License

ISC
