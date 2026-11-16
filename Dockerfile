# syntax=docker/dockerfile:1
# Prices come from the billing catalog at build time, so rebuild the image when the catalog changes.

FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG CATALOG_API_URL
ENV CATALOG_API_URL=${CATALOG_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1
RUN test -n "$CATALOG_API_URL" || (echo "CATALOG_API_URL build argument is required" && exit 1)
RUN pnpm build

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
