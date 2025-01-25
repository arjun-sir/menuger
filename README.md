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

- **POST** `/api/category`
  ```json
  {
    "name": "Main Course",
    "description": "Main dishes",
    "image": "(file upload)",
    "taxApplicable": true,
    "tax": 10
  }
  ```

- **GET** `/api/category` - List all categories
- **GET** `/api/category/:param` - Get category by ID or name
- **PUT** `/api/category/:id` - Update category
- **DELETE** `/api/category/:id` - Delete category

### Subcategories

- **POST** `/api/subcategory`
  ```json
  {
    "name": "Pizzas",
    "description": "Italian pizzas",
    "image": "(file upload)",
    "categoryId": 1
  }
  ```

- **GET** `/api/subcategory` - List all subcategories
- **GET** `/api/subcategory/:param` - Get subcategory by ID or name
- **GET** `/api/subcategory/category/:categoryId` - Get subcategories by category
- **PUT** `/api/subcategory/:id` - Update subcategory

### Items

- **POST** `/api/item`
  ```json
  {
    "name": "Margherita Pizza",
    "description": "Classic Italian pizza",
    "image": "(file upload)",
    "price": 12.99,
    "categoryId": 1,
    "subcategoryId": 1
  }
  ```

- **GET** `/api/item` - List all items
- **GET** `/api/item/:param` - Get item by ID or name
- **GET** `/api/item/category/:categoryId` - Get items by category
- **GET** `/api/item/subcategory/:subcategoryId` - Get items by subcategory
- **GET** `/api/item/search?name=query` - Search items by name
- **PUT** `/api/item/:id` - Update item

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
3. **Rate Limiting**: Implementing rate limiting to protect the API from abuse and ensure fair usage.

### Most Challenging Aspect
The most challenging part was implementing an efficient caching strategy that properly invalidates related caches across the menu hierarchy. For example, when updating a category, we needed to invalidate not just the category cache but also related subcategories and items caches.

### Future Improvements
Given more time, I would:
1. Add comprehensive unit and integration tests
2. Create a CI/CD pipeline with automated testing and deployment
3. Add GraphQL support for more flexible data querying
4. Implement image optimization and CDN integration

## 📄 License

MIT License - feel free to use this project for learning or as a base for your own projects.

