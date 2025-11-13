# -------------------------------
# Stage 1: Build Stage
# -------------------------------
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate --no-engine
COPY . .

# Adding Build requirements environment variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
ARG NEXT_PUBLIC_SITE_URL
ARG RAZORPAY_KEY_ID
ARG RAZORPAY_KEY_SECRET

RUN echo "Building app for $NEXT_PUBLIC_SITE_URL"

RUN npm run build 
RUN npm prune --production

# -------------------------------
# Stage 2: Production Stage
# -------------------------------
FROM node:20-alpine AS runner

# Create non-root user and group properly
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
# Copy everything with ownership set
COPY --chown=appuser:appgroup --chmod=555 --from=builder /app/package*.json ./
COPY --chown=appuser:appgroup --chmod=555 --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appgroup --chmod=555 --from=builder /app/.next ./.next
COPY --chown=appuser:appgroup --chmod=555 --from=builder /app/public ./public
COPY --chown=appuser:appgroup --chmod=555 --from=builder /app/prisma ./prisma

USER appuser

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3000 || exit 1

CMD ["sh", "-c", "npm run db:deploy && npm run dev"]
