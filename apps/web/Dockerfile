# Base image with pnpm
FROM node:20-bullseye-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN npm install -g turbo

# Prune the monorepo for the web package
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune web --docker

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
RUN pnpm turbo run build --filter=web

# Final runner image
FROM node:20-bullseye-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Add a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/web ./apps/web

WORKDIR /app/apps/web

EXPOSE 3001

CMD ["npm", "run", "start"]
