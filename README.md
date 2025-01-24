# 🍽️ Menuger - Menu Management System

A modern, scalable menu management system built with Node.js, TypeScript, and Express. Features include category management, item organization, image uploads to S3, Redis caching, and more.

## 🌟 Features

- **📚 Menu Organization**
  - Categories, subcategories, and items management
  - Hierarchical structure with tax inheritance
  - Flexible pricing with base amount and discounts

- **🚀 Performance Features**
  - Redis caching for optimized data retrieval
  - Rate limiting for API protection
  - AWS S3 integration for image storage

- **🔍 Search Capabilities**
  - Search items by name
  - Filter items by category/subcategory
  - Smart caching for search results

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **Storage**: AWS S3
- **Containerization**: Docker & Docker Compose

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js v18 or later
- AWS Account with S3 bucket

### Environment Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd menuger
   ```

2. Create `.env` file:
   ```env
   DATABASE_URL=postgresql://admin:adminpassword@postgres:5432/menuger
   REDIS_URL=redis://redis:6379
   PORT=3000
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=your_region
   S3_BUCKET_NAME=your_bucket_name
   ```

### Running with Docker

1. Build and start all services:
   ```bash
   docker-compose build
   docker-compose up -d
   ```

The application will automatically:
- Wait for PostgreSQL and Redis to be healthy
- Run database migrations
- Start the server

You can check the logs with:
```bash
docker-compose logs -f app
```

The application will be available at http://localhost:3000

### Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start PostgreSQL and Redis:
   ```bash
   docker-compose up -d postgres redis
   ```

3. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 API Documentation

### Categories

- **POST** `/api/categories`
  ```json
  {
    "name": "Main Course",
    "description": "Main dishes",
    "image": "(file upload)",
    "taxApplicable": true,
    "tax": 10
  }
  ```

- **GET** `/api/categories`
- **GET** `/api/categories/:param` (ID or name)
- **PUT** `/api/categories/:id`
- **DELETE** `/api/categories/:id`

### Items

- **POST** `/api/items`
- **GET** `/api/items/search?name=query`
- **GET** `/api/items/category/:categoryId`
- **GET** `/api/items/:param` (ID or name)

## 🤔 Assignment Questions

### Database Choice
I chose PostgreSQL for this project because:
- Strong relational data support for complex menu hierarchies
- Robust ACID compliance for data integrity
- Excellent integration with Prisma ORM
- Great performance with proper indexing
- Active community and extensive documentation

### Three Key Learnings
1. **Redis Integration**: Implementing efficient caching strategies for optimizing API response times and reducing database load.
2. **AWS S3 File Management**: Handling file uploads securely with pre-signed URLs and proper error handling.
3. **TypeScript Best Practices**: Using advanced TypeScript features for better type safety and code maintainability.

### Most Challenging Aspect
The most challenging part was implementing an efficient caching strategy that properly invalidates related caches across the menu hierarchy. For example, when updating a category, we needed to invalidate not just the category cache but also related subcategories and items caches.

### Future Improvements
Given more time, I would:
1. Implement WebSocket support for real-time menu updates
2. Add comprehensive unit and integration tests
3. Create a CI/CD pipeline with automated testing and deployment
4. Add GraphQL support for more flexible data querying
5. Implement image optimization and CDN integration

## 📄 License

MIT License - feel free to use this project for learning or as a base for your own projects.

