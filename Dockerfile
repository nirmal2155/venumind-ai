# Stage 1: Build the React Frontend
FROM node:18-alpine AS builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup the Express Backend
FROM node:18-alpine

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source code
COPY backend/ ./

# Copy built frontend from Stage 1 into the backend's public directory
COPY --from=builder /app/frontend/dist ./public

# Expose port 3000 (Cloud Run uses PORT environment variable, which defaults to 8080 or can be configured)
EXPOSE 3000
ENV PORT=3000

# Start the Node server
CMD ["npm", "start"]
