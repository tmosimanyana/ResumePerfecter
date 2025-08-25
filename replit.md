# Overview

This is a full-stack resume analysis application that helps users optimize their resumes for Applicant Tracking Systems (ATS) and specific job descriptions. The application uses AI-powered analysis to provide keyword matching, formatting feedback, and actionable recommendations to improve resume compatibility.

The system consists of a React frontend with shadcn/ui components, an Express.js backend with RESTful APIs, and uses PostgreSQL with Drizzle ORM for data persistence. The core functionality revolves around uploading resumes, inputting job descriptions, and generating detailed analysis reports with scoring and recommendations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript in SPA (Single Page Application) mode
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for development and production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful APIs with JSON payloads
- **File Handling**: Multer middleware for multipart/form-data file uploads
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: TSX for TypeScript execution with hot reloading

## Data Storage Solutions
- **Database**: PostgreSQL with connection via @neondatabase/serverless
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Schema Management**: Drizzle Kit for schema generation and database migrations
- **Session Storage**: In-memory storage with fallback to PostgreSQL using connect-pg-simple
- **File Storage**: Local filesystem for temporary file processing during upload

## Authentication and Authorization
- **Current State**: Basic user schema defined but authentication not fully implemented
- **Planned Architecture**: Session-based authentication with user/password credentials
- **User Management**: User creation and lookup capabilities in storage layer

## External Service Integrations
- **OpenAI API**: GPT-5 model for resume analysis, keyword extraction, and recommendation generation
- **File Processing**: 
  - PDF parsing capabilities (mock implementation, designed for pdf-parse library)
  - DOCX parsing capabilities (mock implementation, designed for mammoth library)
- **File Upload Validation**: 10MB size limit, PDF/DOCX file type restrictions

## Core Application Flow
1. **Resume Upload**: Users upload PDF/DOCX files which are parsed into text
2. **Job Description Input**: Users provide job posting details via form
3. **AI Analysis**: OpenAI processes both inputs to generate:
   - Keyword matching analysis
   - ATS formatting feedback
   - Skills gap assessment
   - Actionable recommendations
4. **Results Display**: Comprehensive scoring dashboard with visual components
5. **Data Persistence**: Analysis results stored for future reference

## API Structure
- `POST /api/resume/upload` - File upload and parsing
- `POST /api/job-description` - Job description creation
- `POST /api/analyze` - Resume analysis against job description
- `GET /api/analyses/recent` - Historical analysis retrieval

## Development Configuration
- **Development Server**: Vite dev server with Express API proxy
- **Hot Reloading**: Full-stack hot reloading with error overlay
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)
- **TypeScript**: Strict mode with path mapping and ESNext target