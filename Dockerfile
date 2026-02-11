FROM node:22-alpine AS builder
WORKDIR /app

# Use corepack (built into Node 22)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Remove devDependencies after build
RUN pnpm prune --prod

FROM node:22-alpine
WORKDIR /app

# Copy built application and production dependencies only
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/package.json ./

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "build/index.js"]