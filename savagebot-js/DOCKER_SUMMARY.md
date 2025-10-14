# Docker Setup Summary

## 🐳 What's Been Created

### Core Files
- ✅ **Dockerfile** - Multi-stage build with ANTLR4 and parser generation
- ✅ **docker-compose.yml** - Production-ready orchestration
- ✅ **.dockerignore** - Optimized build context
- ✅ **DOCKER.md** - Comprehensive deployment guide

## 🚀 Quick Start

```bash
# 1. Create environment file
cp .env.example .env
# Edit .env with your Discord bot token

# 2. Run with Docker Compose
docker-compose up -d

# 3. View logs
docker-compose logs -f
```

That's it! The container will:
1. Install Node.js dependencies
2. Install Java + ANTLR4
3. Generate the R2 parser from grammar
4. Start the bot automatically

## 📦 Dockerfile Highlights

### Multi-Stage Build

**Stage 1: Builder (node:20-alpine + Java + ANTLR4)**
```dockerfile
- Installs OpenJDK 11
- Installs ANTLR4 globally
- Generates parser from R2.g4
- Builds production dependencies
```

**Stage 2: Production (node:20-alpine)**
```dockerfile
- Minimal runtime image (~200MB)
- Non-root user (nodejs:nodejs)
- Tini for signal handling
- Only production files
```

### Key Features

✅ **Automatic Parser Generation** - R2 grammar compiled during build
✅ **Security** - Non-root user, minimal attack surface
✅ **Small Image** - Alpine base, multi-stage build (~200MB)
✅ **Production Ready** - Proper signal handling, restart policies
✅ **Resource Limits** - CPU and memory constraints configured

## 🔧 Docker Compose Configuration

### Default Settings

```yaml
Resources:
  CPU: 0.5 cores max
  Memory: 512MB max

Logging:
  Max size: 10MB per file
  Max files: 3 rotated logs

Restart: unless-stopped
Network: isolated bridge network
```

### Environment Variables

Required in `.env`:
```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id (optional)
```

## 📋 Common Commands

```bash
# Start the bot
docker-compose up -d

# View logs
docker-compose logs -f

# Restart the bot
docker-compose restart

# Stop the bot
docker-compose down

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d

# Check status
docker-compose ps

# Check resource usage
docker stats savagebot
```

## 🔍 What Happens During Build

1. **Install system dependencies**
   - OpenJDK 11 (for ANTLR4)
   - curl, bash utilities

2. **Install ANTLR4**
   - Global npm package
   - Version 4.13.1

3. **Install Node.js dependencies**
   - discord.js ^14.14.1
   - dotenv ^16.3.1
   - antlr4 ^4.13.1 (runtime)

4. **Generate Parser**
   ```bash
   antlr4 -Dlanguage=JavaScript -visitor R2.g4 -o ./parser
   ```
   Creates:
   - R2Lexer.js
   - R2Parser.js
   - R2Visitor.js
   - R2Listener.js

5. **Create Production Image**
   - Copy parser and compiled files
   - Remove build dependencies
   - Set up non-root user
   - Configure entrypoint

## 🛠️ Troubleshooting

### Bot Won't Start
```bash
# Check logs
docker-compose logs savagebot

# Verify environment
docker-compose config

# Ensure .env exists and has valid token
cat .env
```

### Parser Generation Fails
```bash
# Rebuild without cache
docker-compose build --no-cache

# Check build output
docker-compose build 2>&1 | tee build.log
```

### Out of Memory
```bash
# Increase memory in docker-compose.yml
limits:
  memory: 1G

# Then restart
docker-compose down && docker-compose up -d
```

## 🔒 Security Features

- ✅ Non-root user (UID 1001)
- ✅ Read-only layers in final image
- ✅ Minimal Alpine base
- ✅ No build tools in production
- ✅ Proper signal handling (tini)
- ✅ Network isolation
- ✅ Resource limits enforced

## 📊 Image Details

**Base Image**: node:20-alpine
**Final Size**: ~200MB
**Layers**: Optimized multi-stage build
**User**: nodejs (non-root)
**Init System**: tini

## 🔄 Development Mode

For local development with live reload:

```bash
# Run in development mode
docker-compose -f docker-compose.yml run \
  --rm \
  -v $(pwd):/app \
  savagebot npm run dev
```

## 📚 Additional Resources

- **DOCKER.md** - Comprehensive deployment guide
- **README.md** - General installation and usage
- **SETUP_PARSER.md** - Manual parser generation
- **IMPLEMENTATION.md** - Technical details

## ✨ Production Deployment

For production, see `DOCKER.md` for:
- Health checks
- Auto-updates with Watchtower
- Monitoring and logging
- CI/CD integration
- Security hardening
- Backup strategies

## 🎯 Next Steps

1. Create `.env` file with your Discord bot token
2. Run `docker-compose up -d`
3. Monitor logs: `docker-compose logs -f`
4. Invite bot to your Discord server
5. Test with `/help` command

All dependencies (Node.js, ANTLR4, Java) are automatically installed during the build process. No manual setup required!
