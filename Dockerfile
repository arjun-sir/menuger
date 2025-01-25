# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Add necessary build tools for Prisma
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps flag
RUN npm ci --legacy-peer-deps

# Copy prisma schema
COPY prisma ./prisma/

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Add necessary runtime dependencies
RUN apk add --no-cache libc6-compat

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

# Copy prisma files and generate client
COPY prisma ./prisma/
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy built assets
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 3000

CMD npx prisma generate && npx prisma db push --accept-data-loss && npm start
