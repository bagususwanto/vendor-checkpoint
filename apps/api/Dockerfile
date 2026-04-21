# Base image with pnpm
FROM node:20-bullseye-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN npm install -g turbo

# Prune the monorepo for the api package
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune api --docker

# Build the project
FROM base AS builder
WORKDIR /app

# Copy pruned workspace
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Copy source code and build
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo run build --filter=api

# Final runner image
FROM node:20-bullseye-slim AS runner
WORKDIR /app

# Add a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api ./apps/api

WORKDIR /app/apps/api
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/src/main"]
