# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Expose the app's port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
