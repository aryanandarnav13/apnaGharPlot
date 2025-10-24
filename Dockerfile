# Multi-stage Dockerfile for ApnaGhar Plots

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine AS backend-build

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --production

COPY backend/ ./

# Stage 3: Production
FROM node:18-alpine

WORKDIR /app

# Install PostgreSQL client for database operations
RUN apk add --no-cache postgresql-client

# Copy backend files
COPY --from=backend-build /app/backend ./backend

# Copy built frontend files
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Expose ports
EXPOSE 5000 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start command
CMD ["sh", "-c", "cd backend && node server.js"]

