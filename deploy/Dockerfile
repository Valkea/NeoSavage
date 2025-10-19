# Multi-stage build for NeoSavage JS
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source files including pre-generated parser
COPY R2.g4 ./
COPY *.js ./
COPY *.json ./
COPY commands/ ./commands/
COPY dice/ ./dice/
COPY discordUI/ ./discordUI/
COPY parser/ ./parser/

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
COPY --from=builder /app/*.json ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/commands ./commands
COPY --from=builder /app/dice ./dice
COPY --from=builder /app/discordUI ./discordUI

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
