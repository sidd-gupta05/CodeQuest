# -------------------------------
# Stage 1: Build Stage
# -------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client for the correct platform
RUN npx prisma generate

# Copy project files
COPY . .

# Build the Next.js app
RUN npm run build --no-lint

# Remove dev dependencies to reduce size
RUN npm prune --production

# -------------------------------
# Stage 2: Production Stage
# -------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Install TypeScript globally or as production dependency
RUN npm install typescript @types/node

# Copy only what’s needed from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/prisma ./prisma

# Copy your environment variables file
# (You can comment this out in production if you're using Docker secrets)
COPY .env .env

# Expose the app port
EXPOSE 3000

# Healthcheck to verify Next.js server
# HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
#   CMD wget --spider http://labsphere-three.vercel.app || exit 1

# Start Next.js
CMD ["npm", "start"]
