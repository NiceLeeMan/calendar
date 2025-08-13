 # CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive calendar application built with Spring Boot backend and React (TypeScript) frontend. The application features JWT-based authentication, advanced plan management with recurring patterns, email verification, and Redis caching for optimal performance.

## Project Structure

### Backend (`src/main/java/org/example/calendar/`)
- **Main Application**: `CalendarApplication.java`
- **Base Package**: `org.example.calendar`
- **Port**: 8080 with context path `/api`

#### Module Organization

**1. Common Module (`common/`)**
- **Config**: Security, Redis, OpenAPI, Jackson configurations
- **Security**: JWT authentication with filter chain
- **Exception Handling**: Global exception handler with structured responses
- **DTOs**: Standard API response wrappers
- **Controllers**: Cache management endpoints

**2. User Module (`user/`)**
- **Entity**: User account with email verification
- **Authentication**: JWT-based login/signup with email verification
- **Services**: AuthService, UserService, EmailVerificationService
- **Exceptions**: Domain-specific exceptions (DuplicateEmail, UserNotFound, etc.)

**3. Plan Module (`plan/`)**
- **Entities**: Plan, PlanAlarm, RecurringInfo
- **Features**: Single events, complex recurring patterns, alarms, exception dates
- **Caching**: Redis-based monthly plan caching with PlanCacheService
- **Recurring Logic**: Sophisticated pattern generation (daily, weekly, monthly, yearly)
- **Enums**: RepeatUnit, DayOfWeek for type safety

### Frontend (`frontend/src/`)
- **Framework**: React 18 with TypeScript, Vite build tool
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with structured API layer

#### Frontend Structure
- **Pages**: Login, SignUp, Calendar, Main pages
- **Components**: Modular calendar components (Month/Week/Day views, modals, forms)
- **API Layer**: Organized by domain (userApi, planApi) with query/CRUD separation
- **Types**: Comprehensive TypeScript definitions for API contracts
- **UI Components**: Reusable Button, Input, Modal, DatePicker components

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.5.3, Java 21
- **Database**: PostgreSQL with Spring Data JPA
- **Migration**: Flyway for database versioning
- **Caching**: Redis with Spring Data Redis
- **Security**: Spring Security + JWT (jjwt library)
- **Documentation**: SpringDoc OpenAPI 3 (Swagger UI at `/swagger-ui.html`)
- **Email**: Spring Mail with Gmail SMTP
- **Build**: Gradle with multi-profile support

### Frontend
- **Core**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **HTTP**: Axios for API communication
- **Routing**: React Router DOM
- **Development**: ESLint + TypeScript strict mode

### Infrastructure
- **Database**: PostgreSQL 16 with Docker
- **Cache**: Redis 7 Alpine
- **Containerization**: Docker Compose for full-stack deployment
- **Monitoring**: Actuator endpoints with health checks

## Development Commands

### Backend Development
```bash
# Build the project
./gradlew build

# Run with local profile (development)
./gradlew bootRun --args='--spring.profiles.active=local'

# Run tests with test profile
./gradlew test

# Database migrations
./gradlew flywayMigrate
./gradlew flywayClean flywayMigrate
```

### Frontend Development
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Docker Development
```bash
# Start all services (PostgreSQL + Redis + Application)
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build -d

# View logs
docker-compose logs -f calendar-app
```

## Configuration Profiles

### Local Development (`application-local.properties`)
- PostgreSQL on localhost:5432
- Redis on localhost:6379
- Debug logging enabled
- Email verification with Gmail SMTP

### Docker Environment (`application-docker.properties`)
- Database: postgres:5432 (Docker service)
- Redis: redis:6379 (Docker service)
- Production-like settings within containers

### Test Profile (`application-test.properties`)
- Test-specific database configuration
- Isolated test environment

## Database Schema

### Migration Files (`src/main/resources/db/migration/`)
- `V1_init.sql`: Initial database setup
- `V2__create_users_table.sql`: User accounts with verification
- `V3__create_plans_table.sql`: Plans, alarms, and recurring patterns
- `V4__add_recurring_info_end_date.sql`: Recurring pattern enhancements
- `V5__fix_week_of_month_constraint.sql`: Weekly pattern constraints

### Core Tables
- **users**: Account info, email verification status
- **plans**: Calendar events with title, dates, description
- **plan_alarms**: Multiple alarms per plan
- **recurring_info**: Complex recurring pattern definitions
- **Collection tables**: Days of week, exception dates for patterns

## API Architecture

### Authentication Endpoints (`/users/`)
- `POST /signup`: User registration with email verification
- `POST /login`: JWT token authentication
- `POST /verify-email`: Email verification with token
- `GET /me`: Current user profile
- `POST /logout`: Token invalidation

### Plan Management (`/plans/`)
- `GET /`: Fetch plans with date range filtering
- `POST /`: Create single or recurring plans
- `PUT /{id}`: Update plan with recurring options
- `DELETE /`: Delete plans (single occurrence or series)

### System Endpoints
- `GET /actuator/health`: Health check endpoint
- `GET /swagger-ui.html`: API documentation
- `/cache/**`: Cache management (CacheController)

## Caching Strategy

### Redis Implementation
- **Key Pattern**: `plan:monthly:{userId}:{year}-{month}`
- **Cache Structure**: MonthlyPlanCache with CachedPlan objects
- **Cache Service**: PlanCacheService handles invalidation and updates
- **Performance**: Optimized for monthly calendar view queries

## Security Implementation

### JWT Configuration
- **Token Storage**: HTTP-only cookies
- **Expiration**: Configurable (default 24 hours)
- **Security**: BCrypt password hashing
- **Stateless**: No server-side session storage

### Path Security
- Public: `/users/signup`, `/users/login`, `/users/verify-email`
- Protected: All `/plans/**` endpoints require authentication
- Documentation: Swagger UI accessible in development

## Frontend Architecture

### Component Organization
- **Pages**: Route-level components
- **Calendar Components**: Month/Week/Day view implementations
- **Auth Components**: Login and signup forms
- **UI Components**: Reusable design system components

### State Management
- React hooks for local state
- API integration through custom hooks
- Type-safe API contracts with TypeScript

### API Integration
- **HTTP Client**: Centralized Axios configuration
- **API Modules**: Domain-separated API functions
- **Error Handling**: Structured error responses
- **Type Safety**: Full TypeScript coverage for API contracts

## Development Guidelines

### Code Organization
- Domain-driven structure for backend modules
- Component-based architecture for frontend
- Clear separation of concerns (entities, DTOs, services, controllers)
- Comprehensive error handling with custom exceptions

### Database Design
- Optimized indexes for user and date-based queries
- Flexible recurring pattern storage
- Audit fields (created_at, updated_at) on core entities
- Foreign key constraints with proper cascading

### Testing Strategy
- JUnit Platform with Spring Boot Test
- Security testing with Spring Security Test
- Test profile isolation
- System property configuration for test runs

### Performance Considerations
- Redis caching for frequently accessed monthly views
- Efficient recurring plan generation algorithms
- Database query optimization with proper indexing
- Docker health checks for service reliability

## Recent Changes & Current State

### Unversioned Files
- `CacheController.java`: Cache management endpoints
- Log files in `/logs` directory (application.log, error.log)

### Active Development Areas
- Cache management and monitoring
- Enhanced recurring pattern support
- Email verification system refinement
- Frontend calendar component development

## Quick Start

1. **Database Setup**: Start PostgreSQL and Redis with Docker Compose
2. **Backend**: Run with local profile for development
3. **Frontend**: Start Vite dev server in frontend directory
4. **Access**: Application at localhost:8080/api, Frontend at localhost:5173
5. **Documentation**: Swagger UI at localhost:8080/swagger-ui.html