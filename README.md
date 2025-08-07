# Florian Project

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

The server uses Basic Authentication with the following credentials:
- Username: `cxf-account-user`
- Password: `YdiDNMJRa6aeQMs!JV7a!W*69PS#9eR$`

## Client Configuration

The client script:
- Reads failed participations from `./data/failed-participations.js`
- Sends POST requests to `https://localhost:3000/promotion`
- Logs responses to `./output/resend-participations.log`
- Includes a 2-second delay between requests
- Processes participations with a configurable limit

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
