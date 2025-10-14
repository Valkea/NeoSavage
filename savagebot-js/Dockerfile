# Multi-stage build for Savagebot JS
FROM node:20-alpine AS builder

# Install Java and ANTLR4 dependencies
RUN apk add --no-cache \
    openjdk11-jre \
    curl \
    bash

# Install ANTLR4 globally
RUN npm install -g antlr4@4.13.1

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy grammar and source files
COPY R2.g4 ./
COPY *.js ./

# Generate ANTLR4 parser
RUN mkdir -p parser && \
    antlr4 -Dlanguage=JavaScript -visitor R2.g4 -o ./parser

# Production stage
FROM node:20-alpine

# Install runtime dependencies
RUN apk add --no-cache \
    tini

# Create app directory
WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/parser ./parser
COPY --from=builder /app/*.js ./
COPY --from=builder /app/package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port (if needed for health checks)
EXPOSE 3000

# Use tini as entrypoint for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start the bot
CMD ["node", "index.js"]
