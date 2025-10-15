# Docker Deployment Guide

Complete guide for deploying Savagebot JS using Docker.

## Quick Start

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f savagebot

# Stop
docker-compose down
```

## Dockerfile Features

### Multi-Stage Build

The Dockerfile uses a multi-stage build for optimal image size:

1. **Builder Stage** (node:20-alpine + Java + ANTLR4)
   - Installs Java 11 and ANTLR4 tool
   - Generates the R2 parser from grammar file
   - Installs Node.js dependencies

2. **Production Stage** (node:20-alpine)
   - Minimal runtime image
   - Only production dependencies
   - Non-root user for security
   - Tini for proper signal handling

### Installed Components

- **Node.js 20 (Alpine)** - Minimal base image
- **ANTLR4 4.13.1** - Parser generator (build-time only)
- **Java 11 JRE** - Required for ANTLR4 (build-time only)
- **Tini** - Init system for proper signal handling
- **Production dependencies** - discord.js, dotenv, antlr4 runtime

### Security Features

- Runs as non-root user (`nodejs:nodejs`)
- Minimal Alpine base image
- No build tools in final image
- Proper signal handling with tini

## Docker Compose Configuration

### Environment Variables

The bot requires these environment variables:

```yaml
# .env file
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id_optional
NODE_ENV=production
```

### Resource Limits

Default resource limits:
- **CPU Limit**: 0.5 cores
- **Memory Limit**: 512MB
- **CPU Reservation**: 0.25 cores
- **Memory Reservation**: 256MB

Adjust in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 512M
```

### Logging

Logs are configured with:
- **Driver**: json-file
- **Max size**: 10MB per file
- **Max files**: 3 files

View logs:
```bash
# Follow logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f savagebot
```

## Manual Docker Commands

### Build Image

```bash
docker build -t savagebot-js:latest .
```

### Run Container

```bash
docker run -d \
  --name savagebot \
  --env-file .env \
  --restart unless-stopped \
  savagebot-js:latest
```

### Manage Container

```bash
# View logs
docker logs -f savagebot

# Stop container
docker stop savagebot

# Start container
docker start savagebot

# Remove container
docker rm savagebot

# Shell access (for debugging)
docker exec -it savagebot /bin/sh
```

## Development with Docker

### Development Mode

For development with live reload:

```bash
# Build development image
docker build -t savagebot-js:dev --target builder .

# Run with volume mounts
docker run -it \
  --name savagebot-dev \
  --env-file .env \
  -v $(pwd):/app \
  -v /app/node_modules \
  savagebot-js:dev \
  npm run dev
```

### Docker Compose Development

Create `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  savagebot-dev:
    build:
      context: .
      dockerfile: Dockerfile
      target: builder
    volumes:
      - .:/app
      - /app/node_modules
      - /app/parser
    env_file:
      - .env
    environment:
      - NODE_ENV=development
    command: npm run dev
```

Run:
```bash
docker-compose -f docker-compose.dev.yml up
```

## Troubleshooting

### Parser Generation Issues

If the parser fails to generate:

```bash
# Rebuild without cache
docker-compose build --no-cache

# Check build logs
docker-compose build 2>&1 | tee build.log
```

### Container Won't Start

```bash
# Check logs
docker-compose logs savagebot

# Verify environment variables
docker-compose config

# Check if .env file exists
ls -la .env
```

### Memory Issues

If the container is killed by OOM:

1. Increase memory limits in `docker-compose.yml`
2. Check actual memory usage:
   ```bash
   docker stats savagebot
   ```

### Permission Issues

If you see permission errors:

```bash
# The container runs as nodejs user (UID 1001)
# Ensure files are readable
chmod -R +r .
```

## Production Deployment

### Recommended Configuration

```yaml
version: '3.8'

services:
  savagebot:
    image: savagebot-js:latest
    container_name: savagebot-prod
    restart: always
    env_file:
      - .env.production
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "5"
    networks:
      - bot-network

networks:
  bot-network:
    driver: bridge
```

### Health Monitoring

Add health checks:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pgrep node || exit 1"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Auto-Updates

Use Watchtower for automatic updates:

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  savagebot-prod
```

## Image Management

### Cleanup

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Full cleanup
docker system prune -a --volumes
```

### Image Size

Current image size: ~200MB (Alpine-based)

To check:
```bash
docker images savagebot-js
```

## Advanced Configuration

### Custom Network

```bash
# Create network
docker network create bot-network

# Run with custom network
docker run -d \
  --name savagebot \
  --network bot-network \
  --env-file .env \
  savagebot-js:latest
```

### Volume Mounts (for persistence)

```bash
# If you add persistent storage later
docker run -d \
  --name savagebot \
  --env-file .env \
  -v savagebot-data:/app/data \
  savagebot-js:latest
```

## Security Best Practices

1. ✅ **Never commit .env file** - Use .env.example as template
2. ✅ **Use non-root user** - Already configured in Dockerfile
3. ✅ **Limit resources** - Prevents resource exhaustion
4. ✅ **Keep base image updated** - Regularly rebuild with latest Alpine
5. ✅ **Use secrets management** - Consider Docker secrets for tokens
6. ✅ **Enable read-only filesystem** (optional):
   ```yaml
   read_only: true
   tmpfs:
     - /tmp
   ```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build image
        run: docker build -t savagebot-js:latest .
      - name: Push to registry
        run: |
          docker tag savagebot-js:latest registry/savagebot-js:latest
          docker push registry/savagebot-js:latest
```

## Support

For issues with Docker deployment:
1. Check logs: `docker-compose logs -f`
2. Verify environment: `docker-compose config`
3. Rebuild image: `docker-compose build --no-cache`
4. Check Discord bot token is valid
5. Ensure bot has proper Discord permissions
