# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the React frontend
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the built frontend from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the server file and data
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/properties.json ./

# Expose the port used by the server
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
