# URL Shortener Application

A modern, full-stack URL shortener application built with FastAPI, React, and MongoDB. This project demonstrates best practices in web development, including caching strategies, load balancing, and comprehensive logging.

## Features

- **URL Shortening**: Create shortened versions of long URLs
- **Original URL Retriving**: Retrive original long URLs
- **Automatic Redirect**: Allow to use short URLs
- **Load Balancing**: Multiple backend instances managed by Nginx
- **Caching**: Redis implementation for improved performance
- **URL Statistics**: Track the number of visits for each shortened URL
- **Auto-Expiration**: URLs automatically expire after 30 days
- **Comprehensive Logging**: Detailed logging system with different severity levels
- **Modern UI**: React-based frontend with dark/light mode support

## Tech Stack

### Backend
- FastAPI (Python)
- MongoDB
- Redis (caching)
- Nginx (load balancer)

### Frontend
- Vite
- React
- TypeScript -> choosen for type safety
- Tailwind CSS
- Shadcn UI Components

## Setup

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- Python 3.8+ (for local development)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AdKaora/adk-url-shortner-challenge.git
cd url-shortener
```

2. Start the application using Docker Compose:

```bash
docker-compose up --build
```

This will start all services:
- Frontend (port 3000)
- Backend services (3 instances)
- Nginx load balancer (port 8000)
- MongoDB
- Redis

## Architecture Diagram
```
                      +---------+
    User Request ---> | Frontend| (Port 3000)
                      +---------+
                           |
                           v
                      +------------------+
                      |      NGINX       | (Load Balancer)
                      +------------------+
                           |
        -------------------------------------------
        |                     |                     |
   +---------+          +---------+           +---------+
   | Backend | <------> | Backend | <-------> | Backend |
   |         |          |    -2   |           |    -3   |
   +---------+          +---------+           +---------+
        |
        |---------------------------------
        |                                |
   +---------+                     +---------+
   |  Redis  |                     | MongoDB |
   +---------+                     +---------+
```

## Project Structure
```
.
├── backend/
│ ├── app/
│ │ ├── main.py # Main FastAPI application
│ │ ├── models.py # Data models
│ │ ├── database.py # Database connections
│ │ └── utils/
│ │     └── logger.py # Logging system
├── frontend/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── hooks/ # Custom React hooks
│ │ └── model/ # Data models
├── nginx/
│ └── nginx.conf # Nginx configuration
└── docker-compose.yml # Docker services configuration
```
## Load Balancing & Rate Limiting

The application uses Nginx as a load balancer with the following features:
- Least connections algorithm for optimal load distribution
- Rate limiting (10 requests/second per IP with burst of 20)
- Health check endpoint at `/health`
- Timeout configurations:
  - Connect: 60s
  - Send: 60s
  - Read: 60s

## Backend Logging System

The application implements a comprehensive logging system that creates log files in the `logs` directory. Logs are categorized into different levels:

- 🔵 INFO: General information messages
- 🟢 SUCCESS: Successful operations
- 🟡 WARNING: Warning messages
- 🔴 ERROR: Error messages
- 🟣 DEBUG: Debug information

Log files are automatically created with the format: `url_shortener_YYYYMMDD.log`

## API Endpoints

### Backend API (port 8000)

- `POST /api/shorten` - Create a shortened URL
- `GET /{short_code}` - Redirect to original URL
- `GET /api/url/{short_code}` - Get original URL information
- `GET /api/stats/{short_code}` - Get URL statistics

## Frontend Application (port 3000)

The frontend provides a user-friendly interface with the following features:

- Clean and modern UI design
- Dark/Light mode toggle
- URL shortening form
- Statistics display
- Responsive design
- Toast notifications for user feedback

## Development

### Running Locally

1. Backend:
```bash
docker compose -f docker-compose.backend.yml
```

2. Frontend:
```bash
cd frontend
pnpm install
pnpm run dev
```

## Architecture

### Load Balancing
- Three backend instances running simultaneously
- Nginx load balancer distributes traffic
- Health checks ensure traffic only goes to healthy instances

### Caching Strategy
- Redis caches frequently redirection of shortened URLs
- Cache invalidation on URL expiration
- Improved response times for redirect popular URLs

## Error Handling

The application includes comprehensive error handling:
- Duplicate URL detection
- Invalid URL validation
- Expired URL handling
- Server error recovery
- Rate limiting protection

## Security Considerations

- CORS protection
- Rate limiting on API endpoints
- Input validation and sanitization
- No sensitive data exposure
- Secure HTTP headers

## Performance Optimizations and Scaling

- Redis caching layer
- Database indexing
- Load balancing

## Future Improvements

### Scalability Enhancements
- Implement Redis caching for visit tracking
- Integrate RabbitMQ or Kafka for asynchronous analytics processing
- Implement circuit breakers to handle failures gracefully
- Deploy MongoDB with sharding for distributed architecture
- Add horizontal scaling capabilities for backend services

### Deployment Optimizations
- Implement CI/CD pipeline using GitHub Actions
- Migrate to Kubernetes for improved cluster management
- Add SSL/TLS encryption for secure communication
- Implement SASL authentication for user management
- Set up monitoring and alerting system  
