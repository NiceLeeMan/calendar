# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Spring Boot calendar application with JWT-based authentication, plan management, and email verification features. The application uses PostgreSQL for data persistence, Redis for caching, and Flyway for database migrations.

## Development Commands

### Build and Run
```bash
# Build the project
./gradlew build

# Run the application (local profile)
./gradlew bootRun

# Run tests
./gradlew test

# Run with specific profile
./gradlew bootRun --args='--spring.profiles.active=local'
```

### Database Operations
```bash
# Run Flyway migrations manually
./gradlew flywayMigrate

# Clean database and rebuild
./gradlew flywayClean flywayMigrate
```

### Testing
```bash
# Run all tests
./gradlew test

# Run tests with detailed logging
./gradlew test --info

# Run specific test class
./gradlew test --tests "org.example.calendar.CalendarApplicationTests"
```

## Architecture Overview

### Application Structure
- **Base Package**: `org.example.calendar`
- **Main Class**: `CalendarApplication.java`
- **Context Path**: `/api` (configured in application.properties)

### Domain Organization
The application follows a domain-driven design with these main modules:

#### 1. User Module (`user/`)
- **Entity**: `User.java` - User account information with validation
- **Authentication**: JWT-based with email verification
- **Controllers**: User registration, login, profile management
- **Services**: `AuthService`, `UserService`, `EmailVerificationService`

#### 2. Plan Module (`plan/`)
- **Entity**: `Plan.java` - Calendar events with recurring pattern support
- **Features**: Single and recurring plans, alarms, exception dates
- **Cache**: Redis-based caching with `PlanCacheService`
- **Complex Domain Logic**: Supports various repeat patterns (daily, weekly, monthly, yearly)

#### 3. Common Module (`common/`)
- **Security**: JWT authentication filter, Spring Security configuration
- **Exception Handling**: Global exception handler with structured error responses
- **Configuration**: OpenAPI/Swagger, Redis, Security configs
- **DTOs**: Standard API response wrappers (`ApiResponse`, `ErrorResponse`)

### Key Technologies
- **Framework**: Spring Boot 3.5.3, Java 21
- **Security**: Spring Security with JWT (jjwt library)
- **Database**: PostgreSQL with Spring Data JPA, Flyway migrations
- **Caching**: Redis with Spring Data Redis
- **API Documentation**: SpringDoc OpenAPI 3 (Swagger UI at `/swagger-ui.html`)
- **Email**: Spring Mail with Gmail SMTP
- **Build Tool**: Gradle

### Configuration Profiles
- **local**: Development profile with detailed logging, PostgreSQL connection
- **test**: Test profile for automated testing
- **prod**: Production profile (configuration in `application-prod.properties`)

### Database Schema
- Database migrations in `src/main/resources/db/migration/`
- Key tables: `users`, `plans`, `plan_alarms`, collection tables for repeat patterns
- Optimized with indexes for user queries and date ranges

### Security Implementation
- JWT tokens stored in cookies with configurable expiration
- Stateless authentication (no server-side sessions)
- Path-based authorization in `SecurityConfig.java`
- Password encryption with BCrypt

### API Endpoints Structure
- **Authentication**: `/users/signup`, `/users/login`, `/users/verify-email`
- **User Management**: `/users/me`, `/users/logout`  
- **Plans**: `/plans/**` (all require authentication)
- **Monitoring**: `/actuator/**` endpoints enabled
- **Documentation**: `/swagger-ui.html`, `/v3/api-docs`

### Development Environment Setup
1. PostgreSQL database: `calendar_dev` on localhost:5432
2. Redis server: localhost:6379
3. Gmail SMTP configuration for email verification
4. Application runs on port 8080 with context path `/api`

### Testing Strategy
- Test profile uses separate database configuration
- JUnit Platform with Spring Boot Test
- Security testing with Spring Security Test
- System property `spring.profiles.active=test` set for test runs