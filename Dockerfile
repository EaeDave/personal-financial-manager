# Use the official Bun image
# See all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN bunx prisma generate

# Build the application
RUN bun run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Generate Prisma Client for production
COPY prisma ./prisma
RUN bunx prisma generate

# Copy built application
COPY --from=builder /app/.output ./.output

# Expose the port the app runs on
EXPOSE 3000

# Copy the local database (WARNING: Data will be reset on every deploy)
COPY dev.db ./
ENV DATABASE_URL="file:./dev.db"

# Start the application
CMD ["bun", ".output/server/index.mjs"]
